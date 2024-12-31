import React from "react";
import { useMediaQuery } from "react-responsive";
import MobileComponent from "../components/UploadMoreImagesOne/UploadMoreImagesMobileComponent"; // Import the mobile component
import WebComponent from "../components/UploadMoreImagesOne/WebComponent"; // Import the web component

const UploadMoreImages = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return <div>{isMobile ? <MobileComponent /> : <WebComponent />}</div>;
};

export default UploadMoreImages;
