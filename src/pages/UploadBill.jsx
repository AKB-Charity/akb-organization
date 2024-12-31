import React from "react";
import { useMediaQuery } from "react-responsive";
import MobileComponent from "../components/UploadBill/UploadBill"; // Import the mobile component
import WebComponent from "../components/UploadBill/WebComponent"; // Import the web component

const UploadBill = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return <div>{isMobile ? <MobileComponent /> : <WebComponent />}</div>;
};

export default UploadBill;
