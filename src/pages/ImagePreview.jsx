import React from "react";
import { useMediaQuery } from "react-responsive";
import MobileComponent from "../components/ImagePreview/CapturedImageComponent"; // Import the mobile component
import WebComponent from "../components/ImagePreview/WebComponent"; // Import the web component

const ImagePreview = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return <div>{isMobile ? <MobileComponent /> : <WebComponent />}</div>;
};

export default ImagePreview;
