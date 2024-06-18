import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { categories, types } from "../data";

export default function Search() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  console.log(sidebardata.searchTerm)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const categoryFromUrl = urlParams.get("category");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      categoryFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
      const categoriesArray = categoryFromUrl ? categoryFromUrl.split(",") : [];
      const typesArray = typeFromUrl ? typeFromUrl.split(",") : [];
      setSelectedTypes(typesArray);
      setSelectedCategories(categoriesArray);
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/server/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", selectedTypes);
    urlParams.set("category", selectedCategories);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    const searchQuery = urlParams.toString();
    console.log("searchQuery : ")
    console.log(searchQuery)
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startInd", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/server/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  const renderIcon = (IconComponent) => {
    return <IconComponent className="w-3 h-3" />;
  };

  const [isOpenType, setIsOpenType] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);

  const handleChangeType = (e) => {
    setSelectedTypes((prevSelectedTypes) => {
      if (e.target.checked) {
        return [...prevSelectedTypes, e.target.value];
      } else {
        return prevSelectedTypes.filter((type) => type !== e.target.value);
      }
    });
  };
  const handleChangeCategory = (e) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (e.target.checked) {
        return [...prevSelectedCategories, e.target.value];
      } else {
        return prevSelectedCategories.filter(
          (category) => category !== e.target.value
        );
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:border-black md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="button"
              className="flex justify-between w-full pl-4 py-2 text-sm font-semibold text-left text-gray-700 bg-white rounded-lg hover:bg-white"
              onClick={() => setIsOpenType(!isOpenType)}
            >
              Type
              <span className="mr-1 mt-1">
                {isOpenType
                  ? renderIcon(FaChevronUp)
                  : renderIcon(FaChevronDown)}
              </span>
            </button>
            <div className={`${isOpenType ? "block" : "hidden"} p-2`}>
              {types.map((type, index) => (
                <div key={index} className="flex items-center mb-4">
                  <input
                    id={`${type.name}`}
                    type="checkbox"
                    value={type.name}
                    checked={selectedTypes.includes(type.name)}
                    onChange={handleChangeType}
                    className="w-4 h-4 text-blue-600 bg-white rounded border-gray-300"
                  />
                  <label
                    htmlFor={`${type.name}`}
                    className="ml-2 text-sm font-medium text-gray-900 hover:cursor-pointer"
                  >
                    {type.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              className="flex justify-between w-full pl-4 py-2 text-sm font-semibold text-left text-gray-700 bg-white rounded-lg"
              onClick={() => setIsOpenCategory(!isOpenCategory)}
            >
              Category
              <span className="mr-1 mt-1">
                {isOpenCategory
                  ? renderIcon(FaChevronUp)
                  : renderIcon(FaChevronDown)}
              </span>
            </button>
            <div className={`${isOpenCategory ? "block" : "hidden"} p-2`}>
              {categories.map((category, index) => (
                <div key={index} className="flex items-center mb-4">
                  <input
                    id={`${category.label}`}
                    type="checkbox"
                    value={category.label}
                    checked={selectedCategories.includes(category.label)}
                    onChange={handleChangeCategory}
                    className="w-4 h-4 text-blue-600 bg-white rounded border-gray-300"
                  />
                  <label
                    htmlFor={`${category.label}`}
                    className="ml-2 text-sm font-medium text-gray-900 hover:cursor-pointer"
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-slate-950 text-white p-3 rounded-lg uppercase opacity-90">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b-2 border-black p-3 text-slate-950 mt-5">
          Search Results:
        </h1>

        <div className="p-7 flex flex-wrap gap-6 ml-2">
          {loading && (
            <p className="text-xl text-slate-950 text-center w-full">
              Loading...
            </p>
          )}

          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-950">No Listing Found!!</p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem
                key={listing._id}
                listing={listing}
                booking={false}
                property={false}
              />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-slate-800 font-semibold text-2xl hover:underline text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
