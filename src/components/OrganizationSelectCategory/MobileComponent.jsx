import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MobileComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle back button press
    const handleBackButton = (e) => {
      e.preventDefault();
      navigate("/organization/organization-home");
    };

    // Push a dummy state to history to detect back navigation
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handleBackButton);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full py-4 bg-gray-200 text-center font-bold text-lg">
        Volunteer Dashboard
      </header>

      {/* Content */}
      <div className="flex flex-col w-full max-w-md px-4 py-12 space-y-4">
        {/* Title */}
        <h2 className="text-center text-xl font-semibold">Select Category</h2>
        {/* Category Buttons */}
        <CategoryButton
          text="Feed Food for Needy"
          route="/organization/feed-food"
        />
        <CategoryButton
          text="Feed for Stray Cats / Dogs"
          route="/organization/feed-stray"
        />
        <CategoryButton
          text="Groceries to Poor"
          route="/organization/groceries-to-poor"
        />
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center bg-gray-200 font-bold mt-auto">
        AKB
      </footer>
    </div>
  );
};

// CategoryButton Component
const CategoryButton = ({ text, route }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(route);
  };

  return (
    <button
      onClick={handleNavigation}
      className="flex justify-between items-center w-full px-4 py-4 bg-white rounded-lg shadow-md text-gray-800"
    >
      <span>{text}</span>
      <span>&#8250;</span>
    </button>
  );
};

export default MobileComponent;
