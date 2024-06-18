import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpStart, signUpSuccess, signUpFailure } from "../redux/state";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formdata, setFormData] = useState({});
  const {loading,err} = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(signUpStart());
    try {
      const res = await fetch("/server/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      dispatch(signUpSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signUpFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl text-center font-semibold my-7">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className="bg-blue-950 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <OAuth/>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Already have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700 font-semibold underline">Sign in</span>
        </Link>
      </div>

      {err && <p className="text-red-600">{err}</p>}
    </div>
  );
}
