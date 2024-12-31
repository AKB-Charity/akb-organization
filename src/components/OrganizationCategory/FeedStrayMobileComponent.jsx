import React, { useState, useEffect, useRef } from "react";
import { Camera, Image as ImageIcon, RotateCw } from "lucide-react";
import api from "../../api";
import img1 from "../../assets/fundraising.png";
import html2canvas from "html2canvas";

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-lg font-semibold">Please wait...</p>
      <p className="text-gray-600">Your image is being processed</p>
    </div>
  </div>
);

const DonorCardOverlay = ({ name, category, website, instagram, phoneNo }) => (
  <div
    className="absolute left-1/2 -translate-x-1/2 w-[250px] p-3 bg-white shadow-lg rounded-lg"
    style={{ bottom: "40px" }} // Fixed bottom position
    id="donor-card-overlay"
  >
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-600" />
        </div>
      </div>
      <h1 className="text-md font-bold text-blue-900 mb-1">AKB FOUNDATION</h1>
      <div className="text-blue-900 py-1 px-3 font-bold text-xs rounded-full mb-1">
        {"FEED A STRAY DOG / CAT"}
      </div>
      <p className="text-xs text-center font-bold uppercase text-blue-900 mb-1">
        {name || "DONOR NAME"}
      </p>
      <p className="text-xs text-center text-black italic font-semibold mb-3">
        Making Change Together
      </p>
      <div className="text-xs text-center text-blue-900 font-medium">
        <a
          href={website || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block underline mb-1"
        >
          {website || "Website"}
        </a>
        <a
          href={`https://instagram.com/${instagram || ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block underline mb-1"
        >
          {instagram ? `@${instagram}` : "Instagram"}
        </a>
        <p className="block">{phoneNo || "Phone Number"}</p>
      </div>
    </div>
  </div>
);

const CameraComponent = ({ onClose, onCapture, name, category }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");

  const startCamera = async (facingModeValue) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingModeValue,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        "Unable to access camera. Please ensure you've granted camera permissions."
      );
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      // Handle mirroring for front camera
      if (facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const donorCard = document.getElementById("donor-card-overlay");
      if (donorCard) {
        html2canvas(donorCard).then((donorCardCanvas) => {
          // Calculate consistent positioning
          const scale = 1.3;
          const cardWidth = donorCardCanvas.width * scale;
          const cardHeight = donorCardCanvas.height * scale;
          const x = (canvas.width - cardWidth) / 2;
          const y = canvas.height - cardHeight - 40; // Consistent with CSS bottom: 40px

          ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation
          ctx.drawImage(donorCardCanvas, x, y, cardWidth, cardHeight);

          const imageData = canvas.toDataURL("image/jpeg", 1.0);
          onCapture(imageData);
        });
      } else {
        const imageData = canvas.toDataURL("image/jpeg", 1.0);
        onCapture(imageData);
      }
    }
  };
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="relative w-full h-[75vh]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${
            facingMode === "user" ? "scale-x-[-1]" : ""
          }`}
        />
        <DonorCardOverlay name={name} category={category} />
        <button
          onClick={toggleCamera}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg"
          aria-label="Switch Camera"
        >
          <RotateCw size={20} className="text-blue-600" />
        </button>
      </div>

      <div className="flex gap-4 mt-2 mb-4">
        <button
          onClick={handleCapture}
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700"
        >
          Capture
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const CapturedImageComponent = ({ imageData, onRetake, onAccept }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptClick = async () => {
    setIsLoading(true);
    try {
      await onAccept();
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      {isLoading && <LoadingOverlay />}
      <div className="relative w-full h-[75vh] flex items-center justify-center">
        {imageData ? (
          <div className="relative w-full h-full flex justify-center items-center">
            <img
              src={imageData}
              alt="Captured"
              className="w-auto h-full object-contain rounded-md shadow-lg"
            />
          </div>
        ) : (
          <p>No image captured</p>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={onRetake}
          className="px-6 py-2 bg-yellow-500 text-white rounded-full font-semibold hover:bg-yellow-600"
          disabled={isLoading}
        >
          Retake
        </button>
        <button
          onClick={handleAcceptClick}
          className="px-6 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600"
          disabled={isLoading}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

const ImagesGrid = ({ images }) => (
  <div className="w-full px-4">
    <h2 className="text-xl font-semibold mt-6 mb-4">Images</h2>
    <div className="grid grid-cols-1 gap-4">
      {images.map((image, index) => (
        <div key={index} className="bg-gray-200 p-2 rounded-lg shadow-md">
          <img
            src={image}
            alt={`Uploaded ${index + 1}`}
            className="w-full h-auto object-cover rounded"
          />
        </div>
      ))}
    </div>
  </div>
);

const FeedStrayMobileComponent = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [viewUploadedImages, setViewUploadedImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    category: "",
    remaining_photos: 0,
    donation_id: null,
  });

  useEffect(() => {
    const fetchDonorInfo = async () => {
      try {
        const response = await api.get("/api/get_donor_info/", {
          params: { category: "stray" },
        });
        if (response.data) {
          setDonorInfo(response.data);
          fetchUploadedImages(response.data.donation_id);
        }
      } catch (error) {
        console.error("Error fetching donor info:", error);
      }
    };

    const fetchUploadedImages = async (donationId) => {
      try {
        const response = await api.get(
          `/api/get_uploaded_img/?donation_id=${donationId}`
        );
        setUploadedImages(response.data.donation_img || []);
      } catch (error) {
        console.error("Error fetching uploaded images:", error);
      }
    };

    fetchDonorInfo();

    const handlePopState = (event) => {
      event.preventDefault();
      if (viewUploadedImages) {
        setViewUploadedImages(false);
      } else {
        setShowExitConfirmation(true);
      }
      window.history.pushState(null, null, window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, null, window.location.href);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [viewUploadedImages]);

  const handleExit = async () => {
    try {
      await api.post("/api/unblock/");
    } catch (error) {
      console.error("Error calling unblock API:", error);
    } finally {
      window.location.href = "/organization/select-donation-category";
    }
  };

  const handleCameraClose = () => setShowCamera(false);

  const handleImageCapture = (imageData) => {
    setCapturedImage(imageData);
    handleCameraClose();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowCamera(true);
  };

  const handleAccept = async () => {
    try {
      await api.post("/api/upload_donation_images/", {
        img: capturedImage,
        donation_id: donorInfo.donation_id,
        type: "donation_img",
      });
      window.alert("Submission successful");
      window.location.href = "/organization/feed-stray";
    } catch (error) {
      console.error("Error uploading image:", error);
      window.alert("Error uploading image. Please try again.");
    }
  };

  const toggleViewImages = () => {
    setViewUploadedImages(!viewUploadedImages);
    setShowCamera(false);
    setCapturedImage(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header className="w-full py-4 bg-gray-200 text-center font-bold text-lg">
        Organization Dashboard
      </header>

      {showExitConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Do you want to exit?</h2>
            <p className="text-gray-600">
              Are you sure you want to leave this page? Your progress may be
              lost.
            </p>
            <div className="flex gap-4 mt-4">
              <button
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                onClick={() => setShowExitConfirmation(false)}
              >
                No
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                onClick={handleExit}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {viewUploadedImages ? (
        <ImagesGrid images={uploadedImages} />
      ) : !showCamera && !capturedImage ? (
        <>
          <div className="w-11/12 max-w-md px-4 py-6 mt-6 bg-white rounded-lg shadow-md">
            {donorInfo.name ? (
              <>
                <p className="text-gray-800 font-semibold">
                  Name on Parcel:{" "}
                  <span className="font-normal">{donorInfo.name}</span>
                </p>
                <p className="text-gray-800 font-semibold">
                  Category:{" "}
                  <span className="font-normal">{donorInfo.category}</span>
                </p>
                <p className="text-gray-800 font-semibold">
                  Photos Remaining:{" "}
                  <span className="font-normal">
                    {donorInfo.remaining_photos}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-gray-800 font-semibold">
                No donor information available.
              </p>
            )}
          </div>

          <div className="my-6">
            <img
              src={img1}
              alt="Parcel"
              className="w-40 h-40 object-cover rounded-md"
            />
          </div>

          <div className="flex flex-col w-full max-w-md space-y-4 px-4 mb-6">
            <button
              className="mx-auto w-3/4 py-3 bg-[#407daa] text-white rounded-full text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              onClick={() => setShowCamera(true)}
            >
              <Camera size={20} />
              Upload
            </button>
            <button
              className="mx-auto w-3/4 py-3 bg-[#407daa] text-white rounded-full text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              onClick={toggleViewImages}
            >
              <ImageIcon size={20} />
              View Uploaded Images
            </button>
          </div>
        </>
      ) : showCamera ? (
        <CameraComponent
          onClose={handleCameraClose}
          onCapture={handleImageCapture}
          name={donorInfo.name}
          category={donorInfo.category}
        />
      ) : (
        <CapturedImageComponent
          imageData={capturedImage}
          onRetake={handleRetake}
          onAccept={handleAccept}
          name={donorInfo.name}
          category={donorInfo.category}
        />
      )}

      <footer className="w-full py-4 text-center bg-gray-200 font-bold mt-auto">
        AKB
      </footer>
    </div>
  );
};

export default FeedStrayMobileComponent;
