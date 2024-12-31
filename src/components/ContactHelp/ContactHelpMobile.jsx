import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import api from "../../api";

const ContactHelpMobile = () => {
  const [formData, setFormData] = useState({
    purpose: "",
    description: "",
    documents: null,
  });
  const [errors, setErrors] = useState({
    purpose: "",
    description: "",
    documents: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      purpose: "",
      description: "",
      documents: "",
    };

    // Purpose validation
    if (!formData.purpose.trim()) {
      newErrors.purpose = "Issue type is required";
      isValid = false;
    } else if (formData.purpose.length < 3) {
      newErrors.purpose = "Issue type must be at least 3 characters";
      isValid = false;
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    // Document validation
    if (!formData.documents) {
      newErrors.documents = "Please upload a document";
      isValid = false;
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(formData.documents.type)) {
        newErrors.documents = "Please upload a valid file (JPEG, PNG, or PDF)";
        isValid = false;
      } else if (formData.documents.size > 5 * 1024 * 1024) {
        // 5MB limit
        newErrors.documents = "File size must be less than 5MB";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("documents", formData.documents);
    data.append("issue_type", formData.purpose);
    data.append("description", formData.description);

    try {
      const response = await api.post("api/org_issue/", data);

      if (response.status === 200) {
        window.alert("Issue submitted successfully");
        navigate("/organization/organization-home");
      } else {
        console.error(
          "Submission failed",
          response.status,
          response.statusText
        );
        window.alert("Failed to submit issue. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("An error occurred. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        documents: file,
      }));
      setImagePreview(URL.createObjectURL(file));
      // Clear error when file is selected
      setErrors((prevErrors) => ({
        ...prevErrors,
        documents: "",
      }));
    }
  };

  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header className="w-full py-4 bg-gray-200 text-center font-bold text-lg">
        Organization Dashboard
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-md px-4 space-y-5">
        <div>
          <label
            htmlFor="purpose"
            className="block text-sm font-medium mb-2 mt-8"
          >
            Type of Issue <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            placeholder="e.g., Payment Issue"
            className={`w-full h-12 px-3 rounded-lg border ${
              errors.purpose ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:border-green-500 transition-colors`}
          />
          <ErrorMessage message={errors.purpose} />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            Description of Issue <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Please describe your issue in detail"
            rows={4}
            className={`w-full px-3 py-2 rounded-lg border ${
              errors.description ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:border-green-500 transition-colors`}
          />
          <ErrorMessage message={errors.description} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Relevant Documents <span className="text-red-500">*</span>
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-4 ${
              errors.documents ? "border-red-500" : "border-gray-200"
            }`}
          >
            <input
              type="file"
              id="documents"
              name="documents"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
            />
            <label
              htmlFor="documents"
              className="flex flex-col items-center justify-center h-24 cursor-pointer"
            >
              <span className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500">
                Maximum file size: 5MB (JPEG, PNG, PDF)
              </span>
            </label>
          </div>
          <ErrorMessage message={errors.documents} />
          {imagePreview && (
            <div className="mt-4 flex justify-center">
              <img
                src={imagePreview}
                alt="Document Preview"
                className="max-w-[200px] max-h-[200px] rounded-lg object-contain"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-green-500 text-white rounded-lg text-sm font-medium mt-6 
                   hover:bg-green-600 active:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          Submit Issue
        </button>
      </form>

      <footer className="w-full py-4 text-center bg-gray-200 font-bold mt-auto">
        AKB
      </footer>
    </div>
  );
};

export default ContactHelpMobile;
