import React from "react";
import { useMediaQuery } from "react-responsive";
import MobileComponent from "../components/ContactHelp/ContactHelpMobile"; // Import the mobile component
import WebComponent from "../components/ContactHelp/WebComponent"; // Import the web component

const ContactHelp = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return <div>{isMobile ? <MobileComponent /> : <WebComponent />}</div>;
};

export default ContactHelp;
