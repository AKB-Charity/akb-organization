import React from "react";
import images from "../../assets/fundraising.png";

const UploadedImagesTwo = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full py-4 bg-gray-200 text-center font-bold text-lg">
      Organization Dashboard
      </header>

      {/* Images Section */}
      <div className="text-xl font-semibold mt-6 mb-4">Images</div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4 px-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 p-2 shadow-lg rounded-md">
            <img
              src={images}
              alt="Organization"
              className="w-full h-auto object-cover rounded"
            />
          </div>
        ))}
      </div>

      {/* Images Section */}
      <div className="text-xl font-semibold mt-6 mb-4">Bills</div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4 px-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 p-2 shadow-lg rounded-md">
            <img
              src={images}
              alt="Organization"
              className="w-full h-auto object-cover rounded"
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center bg-gray-200 font-bold mt-auto">
        AKB
      </footer>
    </div>
  );
};

export default UploadedImagesTwo;
