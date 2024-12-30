import React, { useEffect, useState } from "react";
import { BorderBeam } from "@/components/ui/border-beam.jsx";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import verifyImg from "../../assets/verifyImg.png";
import axios from "axios";
import Particles from "../ui/particles";

function Emailverification() {
  const [verified, setVerified] = useState(false);
  const { token } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const encodedToken = encodeURIComponent(token);

    if (encodedToken) {
      verifyEmail(encodedToken);
    }
  }, []);

  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/user/verify/${token}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Email successfully verified!");
      setVerified(true);
      setLoading(false);
    } catch (error) {
      console.error("Verification error:", error);
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message ||
            "Something went wrong. Please try again later."
        );
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
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
      <div className="flex flex-col items-center justify-center w-full h-full overflow-hidden">
        {loading ? (
          <div className="border sm:h-2/5 md:w-2/5 lg:w-2/5 border-zinc-900 bg-gray-800 shadow-md rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm w-2/3 p-5 flex flex-col items-center justify-center gap-12">
            <BorderBeam />
            <h1 className="text-gray-200 text-2xl font-bold sm:text-3xl text-center">
              Verifying your email address. One moment please!
            </h1>
            <ClipLoader color="white" size={50} />
          </div>
        ) : verified ? (
          <div className="border sm:h-2/5 md:w-2/5 lg:w-2/5 border-zinc-900 bg-gray-800 shadow-md rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm w-2/3 p-5">
            <BorderBeam />
            <div className="flex items-center flex-col gap-5 text-gray-200">
              <img className="w-20" src={verifyImg} alt="" />
              <h1 className="text-2xl font-bold sm:text-4xl text-center">
                Email Verified Successfully!
              </h1>
              <p className="text-sm text-center">
                Your email was verified. You can continue using this application
              </p>

              {/* Login Button */}
              <Link
                to="/login"
                className="mt-6 w-auto px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="border sm:w-2/5 md:w-2/5 lg:w-2/5 border-zinc-900 bg-gray-800 shadow-md rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm w-2/3 p-5">
            <BorderBeam />
            <div className="flex  flex-col  gap-10 text-gray-200">
              <h1 className="text-2xl sm:text-4xl font-bold text-center ">
                Email Verification
              </h1>
              <p className="text-xl ">
                An email has been sent to your inbox. Please check and verify
                your email address to proceed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Emailverification;
