import React, { useState } from "react";
import Particles from "../components/ui/particles.jsx";
import logo from "../assets/chatlogo.png";
import { BorderBeam } from "@/components/ui/border-beam.jsx";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import axios from "axios";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState();
  const navigate = useNavigate();

  const postDetails = (pics) => {
    setLoading(true);

    if (!pics) {
      toast.warning("Please select an image.");
      setLoading(false);
      return;
    }

    if (
      pics.type !== "image/jpeg" &&
      pics.type !== "image/png" &&
      pics.type !== "image/gif"
    ) {
      toast.warning("Please upload a valid image file (JPEG, PNG, or GIF).");
      setLoading(false);
      return;
    }

    if (pics.size > 5 * 1024 * 1024) {
      toast.warning("File size exceeds 5MB. Please upload a smaller file.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "QualityConnect");
    data.append("cloud_name", "doen07bub");

    fetch("https://api.cloudinary.com/v1_1/doen07bub/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setAvatar(data.secure_url);
        console.log("Uploaded Image URL:", data.secure_url);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
        toast.error("Error uploading image. Please try again.");
        setLoading(false);
      });
  };

  const formData = {
    username,
    email,
    password,
    avatar,
  };

  const handleEmailValidation = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const onSignup = async () => {
    setLoading(true);
    if (!handleEmailValidation(email) && email.length > 0) {
      toast.error("Please enter a valid Gmail address ending with @gmail.com");
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post("/api/user/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Registration successful!");
      toast.info("An Email is send to your inbox , please verify your email!");
      setLoading(false);
      navigate("/verify");
    } catch (error) {
      if (error.response) {
        console.log("Error from backend:", error.response.data.message);
        toast.error(error.response.data.message);
        setLoading(false);
      } else {
        console.log("Error:", error.message);
        toast.error("Something went wrong! Please try again later.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <Particles
        color="#ffffff"
        quantity={400}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="flex flex-col items-center justify-center w-full h-full overflow-hidden">
        <div className="border border-zinc-900 bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/3 h-auto max-w-md p-5">
          <BorderBeam />
          <div className="flex items-center w-auto justify-center mb-5">
            <img
              className="w-20 object-cover"
              src={logo}
              alt="QualityConnect Logo"
            />
            <p className="text-2xl sm:text-4xl animate__animated animate__zoomIn bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 font-extrabold text-transparent bg-clip-text">
              QualityConnect
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h1 className="font-bold text-xl sm:text-2xl text-gray-200 text-center">
              Sign Up
            </h1>
            <div className="w-full mt-5 flex flex-col gap-5 items-center">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-600 text-gray-200  sm:text-xl text-lg  bg-transparent p-2 outline-none rounded-md focus:input-gradient"
                type="text"
                placeholder="Username"
                required
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-600 text-gray-200  sm:text-xl text-lg  bg-transparent p-2 outline-none rounded-md focus:input-gradient"
                type="text"
                placeholder="Email"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-600 text-gray-200  text-xl  bg-transparent p-2 outline-none rounded-md focus:input-gradient"
                type="password"
                placeholder="Password"
                required
              />
              <input
                className="w-full text-gray-200 text-xl bg-transparent p-2 outline-none  rounded-md"
                type="file"
                required
                onChange={(e) => {
                  const file = e.target.files[0];
                  postDetails(file);
                }}
              />
              <Link
                onClick={(e) => {
                  onSignup();
                }}
                className={`w-1/2 px-2 py-3 text-center text-gray-200 shadow-lg transform hover:scale-105 transition-transform hover:text-black rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 `}
              >
                {loading ? <ClipLoader color="#000080" /> : "Sign Up"}
              </Link>

              <p className="text-gray-700 hover:text-gray-200">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="cursor-pointer hover:text-blue-500 underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
