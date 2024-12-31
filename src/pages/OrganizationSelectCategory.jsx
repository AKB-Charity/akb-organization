import React from "react";
import { useMediaQuery } from "react-responsive";
import MobileComponent from "../components/OrganizationSelectCategory/MobileComponent"; // Import the mobile component
import WebComponent from "../components/OrganizationSelectCategory/WebComponent"; // Import the web component

const OrganizationSelectCategory = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return <div>{isMobile ? <MobileComponent /> : <WebComponent />}</div>;
};

export default OrganizationSelectCategory;
