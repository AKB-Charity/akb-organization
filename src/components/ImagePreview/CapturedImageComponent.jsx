import React from "react";
import DonorCardOverlay from "../ImagePreview/DonorCardOverlay"; // Adjust this path as needed

const CapturedImageComponent = ({ imageData, onRetake, onAccept }) => {
  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* <header className="w-full py-4 bg-gray-200 text-center font-bold text-lg">
        Captured Image
      </header> */}

      <div className="relative w-full h-[75vh] flex items-center justify-center">
        {/* Display Captured Image */}
        {imageData ? (
          <div className="relative w-full h-full flex justify-center items-center">
            <img
              src={imageData}
              alt="Captured"
              className="w-auto h-full object-contain rounded-md shadow-lg"
            />
            {/* Overlay Donor Card, position it properly */}
            <div className="absolute top-3 left-5 w-[150px]">
              <DonorCardOverlay name="AKB FOUNDATION" />
            </div>
          </div>
        ) : (
          <p>No image captured</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={onRetake}
          className="px-6 py-2 mb-4 bg-yellow-500 text-white rounded-full font-semibold hover:bg-yellow-600"
        >
          Retake
        </button>
        <button
          onClick={onAccept}
          className="px-6 py-2 mb-4 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CapturedImageComponent;
