import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import Invoice from "./Invoice";
import DomToImage from "dom-to-image";

const BillingTable = ({ searchQuery, selectedDate, selectedTab }) => {
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const toastShown = useRef(false);
  const profileShown = useRef(false);
  const invoiceRef = useRef(null);
  const [monthFilter, setMonthFilter] = useState("This Month");

  useEffect(() => {
    if (!profileShown.current) {
      profileShown.current = true;
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}api/v1/profile/getProfile`, {
          withCredentials: true,
        })
        .then((response) => setProfile(response.data.profile))
        .catch((error) => console.error("Error fetching profile:", error));
    }
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/invoice/getInvoices`,
          { withCredentials: true }
        );

        const sortedInvoices = response.data.invoices.sort(
          (a, b) => new Date(b.Date) - new Date(a.Date)
        );
        setBillingData(sortedInvoices);

        if (!toastShown.current) {
          toast.success(response.data.message);
          toastShown.current = true;
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleMarkAsPaid = async (invoiceId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, mark as paid!",
      customClass: {
        popup: "custom-swal",
      },
    });

    if (!result.isConfirmed) return;

    let updatedInvoice;
    const updatedBillingData = billingData.map((invoice) => {
      if (invoice._id === invoiceId) {
        const totalAmount = invoice.Items.reduce((sum, item) => {
          return sum + item.AmountPerItem * item.Quantity;
        }, 0);

        updatedInvoice = {
          ...invoice,
          IsDue: false,
          DueDate: null,
          AmountPaid: totalAmount,
        };
        return updatedInvoice;
      }
      return invoice;
    });

    setBillingData(updatedBillingData);

    try {
      await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }api/v1/invoice/updateInvoice/${invoiceId}`,
        updatedInvoice,
        { withCredentials: true }
      );

      Swal.fire({
        title: "Success!",
        text: "Invoice marked as paid with full amount.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        customClass: {
          popup: "custom-swal",
        },
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
      setBillingData(billingData);
      Swal.fire({
        title: "Error!",
        text: "Failed to update invoice.",
        icon: "error",
        confirmButtonColor: "#d33",
        customClass: {
          popup: "custom-swal",
        },
      });
    }
  };

  const handleDownload = () => {
    if (invoiceRef.current) {
      DomToImage.toJpeg(invoiceRef.current, { quality: 0.95 })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "invoice.jpeg";
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error("Error downloading invoice:", error);
          toast.error("Failed to download image");
        });
    }
  };

  const filteredData = billingData.filter((invoice) => {
    const invoiceDate = new Date(invoice.Date);
    const currentDate = new Date();

    // Match month filter
    let matchesMonth = true;
    if (monthFilter !== "This Month") {
      const selectedMonthDiff = parseInt(monthFilter.split(" ")[0]); // e.g., "2 Months Ago" => 2
      const filterDate = new Date();
      filterDate.setMonth(currentDate.getMonth() - selectedMonthDiff);
      matchesMonth =
        invoiceDate.getMonth() === filterDate.getMonth() &&
        invoiceDate.getFullYear() === filterDate.getFullYear();
    } else {
      matchesMonth =
        invoiceDate.getMonth() === currentDate.getMonth() &&
        invoiceDate.getFullYear() === currentDate.getFullYear();
    }

    const matchesSearch =
      invoice._id.toLowerCase().includes(searchQuery) ||
      invoice.CustomerName.toLowerCase().includes(searchQuery) ||
      invoice.AmountPaid.toString().includes(searchQuery);

    const matchesDate = selectedDate
      ? new Date(invoice.Date).toISOString().split("T")[0] === selectedDate
      : true;

    const matchesTab =
      selectedTab === "Overview"
        ? true
        : selectedTab === "Unpaid"
        ? invoice.IsDue
        : !invoice.IsDue;

    return matchesSearch && matchesDate && matchesTab && matchesMonth;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color="#36d7b7" />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="w-full max-w-full">
          <div className="p-4">
            {/* Month Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                "This Month",
                "1 Month Ago",
                "2 Months Ago",
                "3 Months Ago",
                "4 Months Ago",
                "5 Months Ago",
              ].map((label, index) => (
                <button
                  key={index}
                  onClick={() => setMonthFilter(label)}
                  className={`px-3 py-1 rounded border text-sm ${
                    monthFilter === label
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {label}
                </button>
              ))}

              {/* Show All button */}
              <button
                onClick={() => setMonthFilter("Show All")}
                className={`px-3 py-1 rounded border text-sm ${
                  monthFilter === "Show All"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                Show All
              </button>
            </div>

            {/* Table or No Data Message */}
            {filteredData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-300">
                  <thead className="bg-gray-100">{/* header columns */}</thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index}>{/* row data */}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-4 text-sm">
                No data found for "{monthFilter}"
              </p>
            )}
          </div>

          <table className="w-full border-collapse text-sm md:text-base">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="form-checkbox" />
                </th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                  Invoice Number
                </th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                  Vendor
                </th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                  Billing Date
                </th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                  Due Amount
                </th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-2 md:px-4 py-3 text-right text-xs md:text-sm font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-2 md:px-4 py-3 text-right text-xs md:text-sm font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedInvoice(row);
                    setShowInvoiceModal(true);
                  }}
                >
                  <td className="px-2 md:px-4 py-3">
                    <input type="checkbox" className="form-checkbox" />
                  </td>
                  <td className="px-2 md:px-4 py-3 text-gray-500 truncate max-w-[150px] md:max-w-full">
                    {row._id}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-gray-900">
                    {row.CustomerName}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-gray-500">
                    {new Date(row.Date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-gray-500">
                    {row.DueDate
                      ? new Date(row.DueDate).toLocaleDateString("en-GB")
                      : "No Due"}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-gray-500">
                    {(() => {
                      const totalAmount = row.Items.reduce(
                        (sum, item) => sum + item.AmountPerItem * item.Quantity,
                        0
                      );
                      return Math.max(totalAmount - row.AmountPaid, 0);
                    })()}
                  </td>
                  <td className="px-2 md:px-4 py-3">
                    <span
                      className={`px-2 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full ${
                        !row.IsDue
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {row.IsDue ? "Unpaid" : "Paid"}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3 text-right text-gray-500">
                    {row.AmountPaid}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-right">
                    <button
                      className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded transition-all ${
                        !row.IsDue
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                      disabled={!row.IsDue}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsPaid(row._id);
                      }}
                    >
                      {row.IsDue ? "Mark as Paid" : "Paid"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Invoice */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center overflow-y-auto">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-4xl relative my-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-3xl"
              onClick={() => setShowInvoiceModal(false)}
            >
              &times;
            </button>
            <div ref={invoiceRef}>
              <Invoice invoice={selectedInvoice} profile={profile} />
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-600"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BillingTable;
