import React from "react";
import Particles from "../components/ui/particles.jsx";
import { BorderBeam } from "@/components/ui/border-beam.jsx";

function VerificationPage() {
  return (
    <div className="relative w-full h-screen bg-black">
      <Particles
        color="#ffffff"
        quantity={400}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="flex flex-col items-center justify-center w-full h-full overflow-hidden">
        <div className="border sm:w-2/5 md:w-2/5 lg:w-2/5 border-zinc-900 bg-gray-800 shadow-md rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm w-2/3 p-5">
          <BorderBeam />
          <div className="flex  flex-col  gap-10 text-gray-200">
            <h1 className="text-2xl sm:text-4xl font-bold text-center ">
              Email Verification
            </h1>
            <p className="text-xl ">
              An email has been sent to your inbox. Please check and verify your
              email address to proceed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationPage;
