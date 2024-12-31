import React from "react";
import { useMediaQuery } from "react-responsive";
import MobileComponent from "../components/UploadMoreImagesTwo/UploadMoreImagesMobileComponent2"; // Import the mobile component
import WebComponent from "../components/UploadMoreImagesTwo/UploadMoreImagesWebComponent2"; // Import the web component

const UploadMoreImagesTwo = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return <div>{isMobile ? <MobileComponent /> : <WebComponent />}</div>;
};

export default UploadMoreImagesTwo;
