import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categories, types, facilities } from "../data";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function CreateListing() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("An entire place");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [formData, setFormData] = useState({
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
    bedrooms: 1,
    bathrooms: 1,
    guests: 1,
    imageUrls: [],
    title: "",
    description: "",
    price: 0,
  });

  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 10) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload Failed (MAX 2MB Images allowed).");
          setUploading(false);
        });
    } else {
      setImageUploadError("Minimum 1 and Maximum 10 image allowed to upload.");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");

      setLoading(true);
      setError(false);

      const res = await fetch("/server/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: user._id,
          type: selectedType,
          category: selectedCategory,
          amenities: selectedAmenities,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setLoading(false);
      navigate(`/property-list`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const renderIcon = (IconComponent) => {
    return <IconComponent className="w-8 h-10" />;
  };

  const handleCounterChange = (field, delta) => {
    setFormData({ ...formData, [field]: Math.max(formData[field] + delta, 1) });
  };

  // console.log(formData)

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Publish Your Place
      </h1>

      <form onSubmit={handleSubmit} className="">
        <div className="bg-white p-4 rounded-lg shadow mb-7 mx-10">
          <p className="text-2xl text-blue-950 font-semibold pb-4 border-b-4 border-blue-950">
            Step 1: Tell us about your place
          </p>

          <div className="mt-10">
            <h3 className="text-lg text-gray-600 font-semibold">
              Which of these categories best describes your place?
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 px-8">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.label}
                  className={`flex flex-col items-center p-2 rounded-xl shadow border border-gray-400 ${
                    selectedCategory === category.label
                      ? "ring-2 ring-slate-700 shadow-lg"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory(category.label)}
                >
                  {renderIcon(category.icon)}
                  <span className="mt-2 text-sm text-gray-800">
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <h3 className="text-lg text-gray-600 font-semibold mb-6">
              What type of place will guests have?
            </h3>
            <div className="flex flex-col space-y-6 px-8">
              {types.map((type) => (
                <button
                  type="button"
                  key={type.name}
                  className={`flex justify-between items-center p-4 rounded-xl shadow border border-gray-400 ${
                    selectedType === type.name
                      ? "ring-2 ring-slate-700 shadow-lg"
                      : ""
                  }`}
                  onClick={() => setSelectedType(type.name)}
                >
                  <div className="flex flex-col justify-between">
                    <p className="text-xl font-semibold text-gray-800 flex">
                      {type.name}
                    </p>
                    <p className="mt-2 text-sm text-gray-800">
                      {type.description}
                    </p>
                  </div>
                  {renderIcon(type.icon)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <h3 className="text-lg text-gray-600 font-semibold mb-6">
              Where's your place Located?
            </h3>

            <div className="flex flex-col px-8">
              <p className="font-semibold text-md">Street Address</p>
              <input
                type="text"
                placeholder="Street address"
                className="border border-gray-400 p-3 rounded-lg shadow-sm mt-2"
                id="address"
                maxLength="64"
                minLength="8"
                required
                onChange={handleChange}
                value={formData.address}
              />
            </div>

            <div className="flex flex-col sm:flex-row mt-6">
              <div className="flex flex-col px-8 w-full">
                <p className="font-semibold text-md">Pincode</p>
                <input
                  type="text"
                  placeholder="Pincode"
                  className="border border-gray-400 p-3 rounded-lg shadow-sm mt-2"
                  id="pincode"
                  required
                  onChange={handleChange}
                  value={formData.pincode}
                />
              </div>
              <div className="flex flex-col px-8 w-full">
                <p className="font-semibold text-md">City</p>
                <input
                  type="text"
                  placeholder="City"
                  className="border border-gray-400 p-3 rounded-lg shadow-sm mt-2"
                  id="city"
                  required
                  onChange={handleChange}
                  value={formData.city}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row mt-6">
              <div className="flex flex-col px-8 w-full">
                <p className="font-semibold text-md">State</p>
                <input
                  type="text"
                  placeholder="State"
                  className="border border-gray-400 p-3 rounded-lg shadow-sm mt-2"
                  id="state"
                  required
                  onChange={handleChange}
                  value={formData.state}
                />
              </div>
              <div className="flex flex-col px-8 w-full">
                <p className="font-semibold text-md">Country</p>
                <input
                  type="text"
                  placeholder="Country"
                  className="border border-gray-400 p-3 rounded-lg shadow-sm mt-2"
                  id="country"
                  required
                  onChange={handleChange}
                  value={formData.country}
                />
              </div>
            </div>
          </div>

          <div className="mt-14">
            <h3 className="text-lg text-gray-600 font-semibold mb-6">
              Share some basics about your place
            </h3>

            <div className="flex sm:flex-row flex-col gap-10 justify-around flex-wrap">
              <div className="flex items-center space-x-4 border border-gray-400 p-4 rounded-full w-fit">
                <label>Guests</label>
                <button
                  type="button"
                  className="p-2 border-4 border-black rounded-full"
                  onClick={() => handleCounterChange("guests", -1)}
                >
                  <FaMinus />
                </button>
                <span>{formData.guests}</span>
                <button
                  type="button"
                  className="p-2 border-4 border-black rounded-full"
                  onClick={() => handleCounterChange("guests", 1)}
                >
                  <FaPlus />
                </button>
              </div>

              <div className="flex items-center space-x-4 border border-gray-400 p-4 rounded-full w-fit">
                <label>BedRooms</label>
                <button
                  type="button"
                  className="p-2 border-4 border-black rounded-full"
                  onClick={() => handleCounterChange("bedrooms", -1)}
                >
                  <FaMinus />
                </button>
                <span>{formData.bedrooms}</span>
                <button
                  type="button"
                  className="p-2 border-4 border-black rounded-full"
                  onClick={() => handleCounterChange("bedrooms", 1)}
                >
                  <FaPlus />
                </button>
              </div>

              <div className="flex items-center space-x-4 border border-gray-400 p-4 rounded-full w-fit">
                <label>BathRooms</label>
                <button
                  type="button"
                  className="p-2 border-4 border-black rounded-full"
                  onClick={() => handleCounterChange("bathrooms", -1)}
                >
                  <FaMinus />
                </button>
                <span>{formData.bathrooms}</span>
                <button
                  type="button"
                  className="p-2 border-4 border-black rounded-full"
                  onClick={() => handleCounterChange("bathrooms", 1)}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-7 mt-20 mx-10">
          <p className="text-2xl text-blue-950 font-semibold pb-4 border-b-4 border-blue-950">
            Step 2: Make your place stand out
          </p>

          <div className="mt-10">
            <h3 className="text-lg text-gray-600 font-semibold">
              Tell guests what your place has to offer
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 px-8">
              {facilities.map((facility) => (
                <button
                  type="button"
                  key={facility.name}
                  className={`flex flex-col items-center p-2 rounded-xl shadow border border-gray-400 ${
                    selectedAmenities.findIndex(
                      (name) => name === facility.name
                    ) !== -1
                      ? "ring-2 ring-slate-700 shadow-lg"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedAmenities([...selectedAmenities, facility.name])
                  }
                >
                  {renderIcon(facility.icon)}
                  <span className="mt-2 text-sm text-gray-800">
                    {facility.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <h3 className="text-lg text-gray-600 font-semibold">
              Add some photos of your place
            </h3>

            <div className="p-4 border-2 border-gray-200 rounded-lg shadow mb-5">
              <div className="flex gap-4">
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  className="p-3 border border-blue-950 rounded w-full"
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleImageSubmit}
                  className="p-3 text-gray-700 border-2 border-gray-700 rounded uppercase hover:shadow-lg disabled:opacity-70 font-bold "
                >
                  {uploading ? `uploading...` : "upload"}
                </button>
              </div>

              {imageUploadError && (
                <p className="text-red-700 text-ellipsis text-xl font-semibold text-center">
                  {imageUploadError}
                </p>
              )}

              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, indx) => (
                  <div
                    key={indx}
                    className="flex justify-between p-3 m-3 border-2 border-gray-950 rounded items-center"
                  >
                    <img
                      src={url}
                      alt="listing image"
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(indx)}
                      className="p-3 ml-3 text-red-700 rounded-lg uppercase hover:opacity-70"
                    >
                      delete
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-14">
            <h3 className="text-lg text-gray-600 font-semibold mb-6">
              What make your place attractive and exciting?
            </h3>

            <div className="flex flex-col px-8 ">
              <p className="font-semibold text-md">Title</p>
              <input
                type="text"
                placeholder="Title"
                className="border border-gray-400 p-3 rounded-lg shadow-sm mt-2"
                id="title"
                maxLength="64"
                minLength="8"
                required
                onChange={handleChange}
                value={formData.title}
              />
            </div>

            <div className="flex flex-col px-8 mt-8">
              <p className="font-semibold text-md">Description</p>
              <textarea
                type="text"
                placeholder="Description"
                className="border border-gray-400 p-3 rounded-lg shadow-sm mt-2"
                id="description"
                maxLength="128"
                minLength="16"
                required
                onChange={handleChange}
                value={formData.description}
              />
            </div>
          </div>

          <div className="mt-14">
            <h3 className="text-lg text-gray-600 font-semibold mb-2">
              Now, set your PRICE
            </h3>
            <div className="flex flex-row items-center px-8">
              <span className="px-3 text-2xl">₹</span>
              <input
                type="number"
                id="price"
                min="1"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.price}
              />
              <span className="px-3 text-2xl">/ night</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-700 mt-5 text-lg text-center font-semibold">{error}</p>
        )}
        <div className="flex justify-center">
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
        </div>
      </form>
    </main>
  );
}
