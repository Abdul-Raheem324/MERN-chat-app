import React from "react";
import Particles from "../components/ui/particles.jsx";
import logo from "../assets/chatlogo.png";
import "animate.css";
import { Link } from "react-router-dom";
import GradualSpacing from "@/components/ui/gradual-spacing.jsx";

function HomePage() {
  return (
    <div className="relative w-full h-screen bg-black">
      <Particles
        color="#ffffff"
        quantity={400}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="flex items-center justify-center w-full h-full px-4 md:px-0">
        <div className="flex flex-col text-center w-full sm:w-2/3 md:w-1/3 gap-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl animate__animated font-extrabold animate__bounceIn text-gray-200 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">
            Welcome to
          </h1>
          <div className="flex items-center w-auto justify-center">
            <img
              className="w-24 sm:w-32 object-cover"
              src={logo}
              alt="QualityConnect Logo"
            />
            <GradualSpacing
              className="font-display text-center text-3xl sm:text-4xl font-bold -tracking-widest text-purple-500 dark:text-white md:text-5xl"
              text="QualityConnect"
            />
          </div>
          <div>
            <p className="max-w-md italic text-lg sm:text-xl mx-auto animate__animated animate__fadeIn text-sky-500">
              QualityConnect is a chat application that enables you to chat with
              your friends just using your Email ID.
            </p>
          </div>
          <div className="flex flex-col sm:flex text-gray-200 gap-5 mt-5 w-full">
            <Link
              to="/login"
              className="w-full sm:w-full px-3 py-4 text-center hover:bg-gray-800 cursor-pointer bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50 border-gray-200 border text-xl hover:text-cyan-300 transition delay-50 bg-gray-700"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="w-full sm:w-auto px-3 py-4 text-center hover:bg-gray-800 cursor-pointer bg-transparent rounded-md bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50 border-gray-200 border text-xl hover:text-cyan-300 transition delay-50 bg-gray-700"
            >
              SignUp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
