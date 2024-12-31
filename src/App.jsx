import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifierSignIn from "./pages/VerifierSignIn";
import OrganizationHome from "./pages/OrganizationHome";
import OrganizationSelectCategory from "./pages/OrganizationSelectCategory";
import FeedFoodCategory from "./components/OrganizationCategory/FeedFoodMobileComponent";
import UploadMoreImages from "./pages/UploadMoreImages";
import ImagePreview from "./pages/ImagePreview";
import GroceriesMobileComponent from "./components/OrganizationCategory/GroceriesMobileComponent";
import UploadMoreImagesTwo from "./pages/UploadMoreImagesTwo";
import UploadedImagesTwo from "./pages/UploadedImagesTwo";
import UploadBill from "./pages/UploadBill";
import OrgDetails from "./pages/OrgDetails";
import ContactHelp from "./pages/ContactHelp";
import FeedStrayMobileComponent from "./components/OrganizationCategory/FeedStrayMobileComponent";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VerifierSignIn />} />
        <Route path="/organization/organization-home" element={<OrganizationHome />} />
        <Route
          path="/organization/select-donation-category"
          element={<OrganizationSelectCategory />}
        />
        <Route path="/organization/feed-food" element={<FeedFoodCategory />} />
        <Route
          path="/organization/feed-stray"
          element={<FeedStrayMobileComponent />}
        />
        <Route
          path="/organization/groceries-to-poor"
          element={<GroceriesMobileComponent />}
        />
        <Route path="/organization/uploadmoreimage" element={<UploadMoreImages />} />
        <Route path="/organization/uploadmoreimagetwo" element={<UploadMoreImagesTwo />} />
        <Route path="/organization/uploaded-images-two" element={<UploadedImagesTwo />} />
        <Route path="" element={<ImagePreview />} />
        <Route path="/organization/upload-bills" element={<UploadBill />} />
        <Route path="/organization/orgn-details" element={<OrgDetails />} />
        <Route path="/organization/contact-help" element={<ContactHelp />} />
        {/* New route */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
