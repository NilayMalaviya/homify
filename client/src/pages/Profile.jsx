import React from "react";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/state";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const { user, loading, err } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileP, setFileP] = useState(0);
  const [fileErr, setFileErr] = useState(false);
  const [formData, setformData] = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);


  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  useEffect(() => {
    setFileErr(false)
    dispatch(updateUserSuccess(user));
  }, []);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileP(Math.round(progress));
      },
      (error) => {
        setFileErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setformData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/server/user/update/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/server/user/delete/${user._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch(`/server/auth/signout`);

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || user.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-2 border-black"
        />

        <p className="text-sm self-center">
          {fileErr ? (
            <span className="text-red-700">
              Error in Uploading!!!(Image must be less than 2MB.)
            </span>
          ) : fileP > 0 && fileP < 100 ? (
            <span className="text-green-700"> {`Uploading ${fileP}%...`}</span>
          ) : fileP === 100 && !fileErr ? (
            <span className="text-green-700">Image Successfully Uploaded.</span>
          ) : (
            " "
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          defaultValue={user.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={user.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />

        <button
          disabled={loading}
          className="bg-gray-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
        >
          {loading ? "loading..." : "update"}
        </button>

      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>

      {err && <p className="text-red-700 mt-5 text-lg font-semibold">{err}</p>}
      {updateSuccess && (
        <p className="text-green-700 mt-5 text-lg font-semibold">
          User updated succesfully!!
        </p>
      )}
    </div>
  );
}
