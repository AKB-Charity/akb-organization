import React, { useContext, useEffect, useState } from "react";
import api from "../../api";
import { LoadingContext } from "../CustomComponent/Context";
import { FaHome } from "react-icons/fa";

const OrgDetailsMobile = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const {setLoading} = useContext(LoadingContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/get_org_donation/");
        console.log(response.data); // Log the API data to the console
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {data && 
        <div className="flex flex-col min-h-screen bg-gray-100">
          <div className="relative flex flex-row items-center w-full p-4 bg-gray-200">
            <FaHome className="absolute left-4 text-3xl text-black-600 cursor-pointer" onClick={() => navigate("/organization/home")} />
            <header className="mx-auto text-center font-bold text-lg">
              Organization Dashboard
            </header>
          </div>

          <div className="flex-1 p-4 space-y-4">
            {/* Pending Donations Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-md font-medium mb-3">Pending Donations</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Number of Donations</span>
                  <span className="font-medium">{data.total_donations_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Donors Contributed</span>
                  <span className="font-medium">{data.total_donors}</span>
                </div>
              </div>
            </div>

            {/* Food Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-md font-medium mb-3">Food</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Number of Donations</span>
                  <span className="font-medium">
                    {data.categories.food.total_donations_count}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Donors contributed</span>
                  <span className="font-medium">
                    {data.categories.food.total_donors}
                  </span>
                </div>
              </div>
            </div>

            {/* Stray Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-md font-medium mb-3">Stray</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Number of Donations</span>
                  <span className="font-medium">
                    {data.categories.stray.total_donations_count}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Donors contributed</span>
                  <span className="font-medium">
                    {data.categories.stray.total_donors}
                  </span>
                </div>
              </div>
            </div>

            {/* Groceries Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-md font-medium mb-3">Groceries</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Number of Donations</span>
                  <span className="font-medium">
                    {data.categories.groceries.total_donations_count}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Donors contributed</span>
                  <span className="font-medium">
                    {data.categories.groceries.total_donors}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2 mt-4">Amount</h3>
                  <div className="space-y-2">
                    {data.categories.groceries.grocery_details.map(
                      (detail, index) => (
                        <div className="flex justify-between text-sm" key={index}>
                          <span className="text-gray-600">
                            {detail.name_on_parcel}
                          </span>
                          <span className="font-medium">
                            INR {detail.total_amount}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="w-full py-4 text-center bg-gray-200 font-bold">
            AKB
          </footer>
        </div>
      }
    </>
  );
};

export default OrgDetailsMobile;
