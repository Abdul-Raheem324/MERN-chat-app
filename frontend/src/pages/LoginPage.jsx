import React, { useState } from "react";
import Particles from "../components/ui/particles.jsx";
import logo from "../assets/chatlogo.png";
import { BorderBeam } from "@/components/ui/border-beam.jsx";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatState } from "@/context/chatProvider.jsx";
import { login } from "@/lib/authUtils.js";

export default function LoginPage() {
  const { setUser } = ChatState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formData = {
    email,
    password,
  };
  const onLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/user/login",
        formData,
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const userInfo = response.data;
      setUser(response);
      login(userInfo.token);
      toast.success("Login successful!");
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      navigate("/chat");
    } catch (error) {
      if (error.response && error.response.data.message) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.log("Error:", error.message);
        toast.error("Something went wrong! Please try again later.");
      }
      setLoading(false);
    }
  };
  return (
    <div className="relative w-full h-screen bg-black">
      <Particles
        color="#ffffff"
        quantity={400}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="flex flex-col items-center justify-center w-full h-full overflow-hidden shadow-xl">
        <div className="border border-zinc-900 bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/3 h-auto p-2 ">
          <BorderBeam />
          <div className="flex items-center w-auto justify-center">
            <img
              className="sm:w-20 w-16 object-cover"
              src={logo}
              alt="QualityConnect Logo"
            />
            <p className="sm:text-4xl text-3xl animate__animated animate__zoomIn bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 font-extrabold text-transparent bg-clip-text">
              QualityConnect
            </p>
          </div>

          <div className="mt-5 flex flex-col items-center">
            <h1 className=" font-bold sm:text-2xl text-xl text-gray-200 text-center">
              Login
            </h1>
            <div className="w-3/4 mt-5 justify-center flex flex-col gap-10 items-center ">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-gray-200 sm:text-xl text-lg bg-transparent p-2 outline-none border
            border-gray-600  rounded-lg focus:input-gradient"
                type="text"
                placeholder="Email"
              />

              <div className="w-full">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-gray-200  sm:text-xl text-lg bg-transparent p-2 outline-none border border-gray-600 rounded-md focus:input-gradient"
                  type="password"
                  placeholder="Password"
                />
              </div>
              <Link
                onClick={(e) => {
                  onLogin();
                }}
                className={`w-1/2 px-2 py-3 text-center rounded-lg shadow-lg transform hover:scale-105 transition-transform  text-gray-200 hover:text-black  bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 `}
              >
                {loading ? <ClipLoader color="#000080" /> : "Login"}
              </Link>
              <p className="text-gray-700 hover:text-gray-200">
                Create Account ?{" "}
                <Link
                  to="/signup"
                  className="cursor-pointer underline hover:text-blue-500"
                >
                  SignUp
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
