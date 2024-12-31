import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Image as ImageIcon, Upload } from "lucide-react";
import img1 from "../../assets/fundraising.png";

const IMAGE_TYPES = {
  BILL: "bill",
  DRESS: "dress",
  PERSON: "person",
  EXTRA: "extra",
};

const UploadMoreImagesMobileComponent2 = ({
  name,
  category,
  photosRemaining,
}) => {
  const [currentImageType, setCurrentImageType] = useState(null);
  const [capturedImages, setCapturedImages] = useState({
    [IMAGE_TYPES.BILL]: null,
    [IMAGE_TYPES.DRESS]: null,
    [IMAGE_TYPES.PERSON]: null,
    [IMAGE_TYPES.EXTRA]: [],
  });
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (currentImageType === IMAGE_TYPES.EXTRA) {
          setCapturedImages((prev) => ({
            ...prev,
            [currentImageType]: [
              ...(prev[currentImageType] || []),
              reader.result,
            ],
          }));
        } else {
          setCapturedImages((prev) => ({
            ...prev,
            [currentImageType]: reader.result,
          }));
        }
        navigate("/organization/uploaded-images-two"); // Redirect after uploading
      };
      reader.readAsDataURL(file);
    }
  };

  const startUpload = (imageType) => {
    setCurrentImageType(imageType);
    document.getElementById("fileInput").click();
  };

  const getImageStatusColor = (imageType) => {
    const image = capturedImages[imageType];
    if (imageType === IMAGE_TYPES.EXTRA) {
      return image?.length > 0 ? "bg-green-500" : "bg-[#407daa]";
    }
    return image ? "bg-green-500" : "bg-[#407daa]";
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header className="w-full py-4 bg-gray-200 text-center font-bold text-lg">
      Organization Dashboard
      </header>

      <div className="w-11/12 max-w-md px-4 py-6 mt-6 bg-white rounded-lg shadow-md mx-auto">
        <p className="text-gray-800 font-semibold">
          Name on Parcel: <span className="font-normal">{name}</span>
        </p>
        <p className="text-gray-800 font-semibold">
          Category: <span className="font-normal">{category}</span>
        </p>
        <p className="text-gray-800 font-semibold">
          Amount Paid for 1 Dress:{" "}
          <span className="font-normal">{photosRemaining}</span>
        </p>
        <p className="text-gray-800 font-semibold">
          Special Request:{" "}
          <span className="font-normal">{photosRemaining}</span>
        </p>
      </div>

      <div className="my-6">
        <img
          src={img1}
          alt="Parcel"
          className="w-40 h-40 object-cover rounded-md"
        />
      </div>

      <div className="flex flex-col w-full max-w-md space-y-4 px-4 mb-6">
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          className={`mx-auto w-3/4 py-3 ${getImageStatusColor(
            IMAGE_TYPES.BILL
          )} text-white rounded-full text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2`}
          onClick={() => navigate("/organization/upload-bills")}
        >
          <Camera size={20} />
          Upload Bill {capturedImages[IMAGE_TYPES.BILL] && "✓"}
        </button>
        <button
          className={`mx-auto w-3/4 py-3 ${getImageStatusColor(
            IMAGE_TYPES.DRESS
          )} text-white rounded-full text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2`}
          onClick={() => startUpload(IMAGE_TYPES.DRESS)}
        >
          <Camera size={20} />
          Upload Dress {capturedImages[IMAGE_TYPES.DRESS] && "✓"}
        </button>
        <button
          className={`mx-auto w-3/4 py-3 ${getImageStatusColor(
            IMAGE_TYPES.PERSON
          )} text-white rounded-full text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2`}
          onClick={() => startUpload(IMAGE_TYPES.PERSON)}
        >
          <Camera size={20} />
          Upload Person Holding Dress{" "}
          {capturedImages[IMAGE_TYPES.PERSON] && "✓"}
        </button>
        <button
          className="mx-auto w-3/4 py-3 bg-[#407daa] text-white rounded-full text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
          onClick={() => navigate("/organization/uploaded-images-two")}
        >
          <ImageIcon size={20} />
          View Uploaded Images
        </button>
        <button
          className={`mx-auto w-3/4 py-3 ${getImageStatusColor(
            IMAGE_TYPES.EXTRA
          )} text-white rounded-full text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2`}
          onClick={() => startUpload(IMAGE_TYPES.EXTRA)}
        >
          <Upload size={20} className="mr-2" />
          Add Extra Image/Reupload{" "}
          {capturedImages[IMAGE_TYPES.EXTRA]?.length > 0 &&
            `(${capturedImages[IMAGE_TYPES.EXTRA].length})`}
        </button>
      </div>

      <footer className="w-full py-4 text-center bg-gray-200 font-bold mt-auto">
        AKB
      </footer>
    </div>
  );
};

export default UploadMoreImagesMobileComponent2;
