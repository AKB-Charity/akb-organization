import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { FaHome } from "react-icons/fa";
import { LoadingContext } from "../CustomComponent/Context";
import { useContext } from "react";
import { toast } from "react-toastify";

const UploadBill = () => {
  const [formData, setFormData] = useState({
    purpose: "",
    amount: "",
    documents: null,
  });
  const [errors, setErrors] = useState({
    purpose: "",
    amount: "",
    documents: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const {setLoading} = useContext(LoadingContext);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      purpose: "",
      amount: "",
      documents: "",
    };

    // Purpose validation
    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
      isValid = false;
    } else if (formData.purpose.length < 3) {
      newErrors.purpose = "Purpose must be at least 3 characters long";
      isValid = false;
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
      isValid = false;
    } else {
      const amountNum = parseFloat(formData.amount);
      if (isNaN(amountNum)) {
        newErrors.amount = "Amount must be a valid number";
        isValid = false;
      } else if (amountNum <= 0) {
        newErrors.amount = "Amount must be greater than 0";
        isValid = false;
      }
    }

    // Document validation
    if (!formData.documents) {
      newErrors.documents = "Please upload a document";
      isValid = false;
    } else {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(formData.documents.type)) {
        newErrors.documents = "Only JPG, PNG, and PDF files are allowed";
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
    data.append("bill_for", formData.purpose);
    data.append("amount_paid", formData.amount);

    try {
      setLoading(true);
      const response = await api.post("/api/upload_expenses/", data);

      if (response.status === 200) {
        console.log("File uploaded successfully");
        toast.success("File uploaded successfully");
        window.history.back();
      } else {
        console.error(
          "File upload failed",
          response.status,
          response.statusText
        );
        console.log("Response data:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    } finally {
      setLoading(false);
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
      console.log(file, file?.type);
      setFormData((prevState) => ({
        ...prevState,
        documents: file,
      }));
      setImagePreview(URL.createObjectURL(file));
      // Clear document error when new file is selected
      setErrors((prevErrors) => ({
        ...prevErrors,
        documents: "",
      }));
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="relative flex flex-row items-center w-full p-4 bg-gray-200">
        <FaHome className="absolute left-4 text-3xl text-black-600 cursor-pointer" onClick={() => navigate("/organization/home")} />
        <header className="mx-auto text-center font-bold text-lg">
          Organization Dashboard
        </header>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md px-4">
        <div>
          <label htmlFor="purpose" className="block text-sm mb-2 mt-8">
            What is this bill for?
          </label>
          <input
            type="text"
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            placeholder="Groceries"
            className={`w-full h-12 px-3 rounded-lg border ${
              errors.purpose ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:border-green-500`}
          />
          {errors.purpose && (
            <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm mb-2">
            Amount paid
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="500"
            className={`w-full h-12 px-3 rounded-lg border ${
              errors.amount ? "border-red-500" : "border-gray-200"
            } focus:outline-none focus:border-green-500`}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">Upload Relevant Document</label>
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
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <label
              htmlFor="documents"
              className="flex items-center justify-center h-12 cursor-pointer"
            >
              <span className="text-sm text-gray-600">
                Upload (JPG, PNG, or PDF, max 5MB)
              </span>
            </label>
          </div>
          {errors.documents && (
            <p className="text-red-500 text-sm mt-1">{errors.documents}</p>
          )}
          {imagePreview && (
            <div className="mt-4 flex justify-center">
              {formData.documents?.type.startsWith("image/") ? (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <a
                  href={imagePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Uploaded File
                </a>
              )}
            </div>
          )}


        </div>

        <button
          type="submit"
          className="w-full h-12 bg-green-500 text-white rounded-lg text-sm font-medium mt-6 hover:bg-green-600 active:bg-green-700 transition-colors"
        >
          Submit
        </button>
      </form>

      <footer className="w-full py-4 text-center bg-gray-200 font-bold mt-auto">
        AKB
      </footer>
    </div>
  );
};

export default UploadBill;
