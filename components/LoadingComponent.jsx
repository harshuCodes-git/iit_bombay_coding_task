import React from 'react'
import { Loader2Icon } from "lucide-react";

const LoadingComponent = () => {
  return (
    <div>
      <div className="fixed inset-0 flex flex-col items-center justify-center  bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center">
          <Loader2Icon className="animate-spin flex text-blue-500 w-10 h-10 mb-4" />
          <p className="text-xl">Loading Report...</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingComponent
