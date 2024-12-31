import React from "react";
import { useMediaQuery } from "react-responsive";
import MobileComponent from "../components/OrganizationHome/MobileComponent"; // Import the mobile component
import WebComponent from "../components/OrganizationHome/WebComponent"; // Import the web component

const OrganizationHome = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return <div>{isMobile ? <MobileComponent /> : <WebComponent />}</div>;
};

export default OrganizationHome;
