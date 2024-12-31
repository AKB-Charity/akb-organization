import React from "react";
import { useMediaQuery } from "react-responsive";
import MobileComponent from "../components/UploadedImagesTwo/UploadedImagesTwo"; // Import the mobile component
import WebComponent from "../components/UploadedImagesTwo/WebComponent"; // Import the web component

const UploadedImagesTwo = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return <div>{isMobile ? <MobileComponent /> : <WebComponent />}</div>;
};

export default UploadedImagesTwo;
