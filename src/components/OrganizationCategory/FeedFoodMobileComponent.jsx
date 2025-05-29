import React, { useState, useEffect, useRef } from "react";
import { Camera, Image as ImageIcon, RotateCw } from "lucide-react";
import api from "../../api";
import img1 from "../../assets/donate_food.webp";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { useLocation, useNavigationType } from "react-router-dom";
import { useContext } from "react";
import { LoadingContext } from "../CustomComponent/Context";

const DonorCardOverlay = ({name, category}) => {
  return (
    <div className="absolute left-1/2 top-[80%] transform -translate-x-1/2 -translate-y-1/2 w-64 shadow-lg" id="donor-card-overlay">
      <div className="bg-gray-100">
        {/* Name Section */}
        <div className="p-4">
          <div className="text-xl font-black tracking-tight">
            {name}
          </div>
        </div>
        
        {/* Footer Section */}
        <div className="bg-black text-white p-3 flex items-center justify-between">
          {/* QR Code */}
          <div className="w-16 h-16 bg-white flex items-center justify-center">
            <div className="w-14 h-14 grid grid-cols-8 gap-0">
              {/* This is a simplified QR code representation */}
              {Array(64).fill().map((_, i) => (
                <div 
                  key={i} 
                  className={`${Math.random() > 0.7 ? 'bg-white' : 'bg-black'}`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Foundation Info */}
          <div className="ml-2">
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 mr-1 relative">
                <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 20% 0, 20% 80%, 80% 80%, 80% 0)' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-2 bg-white"></div>
              </div>
              <span className="text-base font-bold tracking-wide">AKB</span>
            </div>
            <div className="text-xs font-medium tracking-wide mb-1">FOUNDATION</div>
            <div className="text-xs mb-0.5">WWW.AKBFOUNDATION.ORG</div>
            <div className="flex items-center text-xs">
              <span className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-0.02-12.64c-2.18 0-3.9 1.73-3.9 3.9 0 2.18 1.72 3.9 3.9 3.9 2.18 0 3.9-1.73 3.9-3.9 0-2.18-1.73-3.9-3.9-3.9zm0 6.46c-1.41 0-2.56-1.15-2.56-2.56s1.15-2.56 2.56-2.56c1.41 0 2.56 1.15 2.56 2.56s-1.15 2.56-2.56 2.56z" />
                </svg>
              </span>
              akbfoundation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      toast.warn(
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
    const video = videoRef.current;
    if (!video) return;
    
    // Create two canvases - one for the raw video frame, one for the final composition
    const videoCanvas = document.createElement("canvas");
    const finalCanvas = document.createElement("canvas");
    
    // Step 1: Get the intrinsic video dimensions (from the video stream)
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    // Step 2: Get the actual displayed dimensions
    const displayRect = video.getBoundingClientRect();
    const displayWidth = displayRect.width;
    const displayHeight = displayRect.height;
    
    // Set up the canvases
    videoCanvas.width = videoWidth;
    videoCanvas.height = videoHeight;
    finalCanvas.width = displayWidth;
    finalCanvas.height = displayHeight;
    
    // Draw the raw video frame first (at native resolution)
    const videoCtx = videoCanvas.getContext("2d");
    videoCtx.drawImage(video, 0, 0, videoWidth, videoHeight);
    
    // Now calculate how this would be displayed on screen
    const finalCtx = finalCanvas.getContext("2d");
    
    // Calculate the scaling and positioning to match what's seen on screen
    const videoAspect = videoWidth / videoHeight;
    const displayAspect = displayWidth / displayHeight;
    
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
    
    // Handle the scaling based on object-fit property (assuming 'cover' as default)
    // You may need to adjust this to match your CSS settings
    if (videoAspect > displayAspect) {
      // Video is wider than display area (height limited)
      drawHeight = displayHeight;
      drawWidth = videoWidth * (displayHeight / videoHeight);
      offsetX = (displayWidth - drawWidth) / 2;
    } else {
      // Video is taller than display area (width limited)
      drawWidth = displayWidth;
      drawHeight = videoHeight * (displayWidth / videoWidth);
      offsetY = (displayHeight - drawHeight) / 2;
    }
    
    // Apply mirroring if front camera
    if (facingMode === "user") {
      finalCtx.translate(finalCanvas.width, 0);
      finalCtx.scale(-1, 1);
    }
    
    // Draw the video frame scaled and positioned to match display
    finalCtx.drawImage(videoCanvas, offsetX, offsetY, drawWidth, drawHeight);
    
    // Reset transform before adding overlay
    if (facingMode === "user") {
      finalCtx.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    // Add the donor card overlay
    const donorCard = document.getElementById("donor-card-overlay");
    if (donorCard) {
      html2canvas(donorCard).then((donorCardCanvas) => {
        const scale = 0.5;
        const overlayWidth = donorCardCanvas.width * scale;
        const overlayHeight = donorCardCanvas.height * scale;
        
        const centerX = (finalCanvas.width - overlayWidth) / 2;
        const centerY = (finalCanvas.height - overlayHeight) * 0.9;
        
        finalCtx.drawImage(
          donorCardCanvas,
          centerX,
          centerY,
          overlayWidth,
          overlayHeight
        );
        
        const imageData = finalCanvas.toDataURL("image/jpeg", 0.8);
        onCapture(imageData);
      });
    } else {
      const imageData = finalCanvas.toDataURL("image/jpeg", 0.8);
      onCapture(imageData);
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

      <div className="flex gap-4 mt-4">
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

const CapturedImageComponent = ({ imageData, onRetake, onAccept }) => (
  <div className="flex flex-col items-center w-full h-full">
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
      >
        Retake
      </button>
      <button
        onClick={onAccept}
        className="px-6 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600"
      >
        Accept
      </button>
    </div>
  </div>
);

const ImagesGrid = ({ images, toggleViewImages }) => (
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
    <div className="flex gap-4 mt-4">
      <button
        onClick={toggleViewImages}
        className="px-6 py-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600"
      >
        Close
      </button>
    </div>
  </div>
);

const FeedFoodMobileComponent = () => {
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
  const { setLoading } = useContext(LoadingContext);


  const location = useLocation();
  const navigationType = useNavigationType();

  const fetchDonorInfo = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/get_donor_info/", {
        params: { category: "food" },
      });
      setLoading(false);
      if (response.data) {
        setDonorInfo(response.data);
        fetchUploadedImages(response.data.donation_id);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching donor info:", error);
    }
  };

  const fetchUploadedImages = async (donationId) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/get_uploaded_img/?donation_id=${donationId}`
      );
      setLoading(false);
      setUploadedImages(response.data.donation_img || []);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching uploaded images:", error);
    }
  };

  useEffect(() => {
    fetchDonorInfo();

    // Set up event listeners for page exit
    const handlePopState = (event) => {
      setShowExitConfirmation(true);
    };

    window.addEventListener("popstate", handlePopState);

    if (!sessionStorage.getItem("pushed")) {
      sessionStorage.setItem("pushed", "true");
      window.history.pushState(null, "", window.location.href);
    }

    const handleBeforeUnload = () => {
      const navEntries = performance.getEntriesByType("navigation");
      const isReload = navEntries[0]?.type === "reload";

      if (!isReload) {
        sessionStorage.removeItem("pushed");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
      if(navigationType === "POP") {
        sessionStorage.removeItem("pushed");
      }
    }, [location, navigationType]);

  const handleExit = async () => {
    try {
      if(donorInfo.donation_id){
        await api.post("/api/unblock/", {"donation_id": donorInfo.donation_id});
      }
    } catch (error) {
      console.error("Error calling unblock API:", error);
    } finally {
      window.history.back();
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
      setLoading(true);
      await api.post("/api/upload_donation_images/", {
        img: capturedImage,
        donation_id: donorInfo.donation_id,
        type: "donation_img",
      });
      setLoading(false);
      toast.success("Submission successful");
      setCapturedImage(null);
      setShowCamera(false);
      fetchDonorInfo();
    } catch (error) {
      console.error("Error uploading image:", error);
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
        Volunteer Dashboard
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
                onClick={() => {
                  setShowExitConfirmation(false);
                  window.history.pushState(null, null, window.location.href);
                }}
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
        <ImagesGrid images={uploadedImages} toggleViewImages={toggleViewImages} />
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
              className="w-40 h-40 object-contain rounded-md"
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

export default FeedFoodMobileComponent;
