import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import Invoice from "./Invoice";
import DomToImage from "dom-to-image";

const BillingTable = ({ searchQuery, selectedDate, selectedTab, monthFilter, setMonthFilter }) => {
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);
  const [themes, setThemes] = useState(null); // Add this state
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const toastShown = useRef(false);
  const profileShown = useRef(false);
  const invoiceRef = useRef(null);

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
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/invoice/getFilteredInvoices/${monthFilter}`,
          { withCredentials: true }
        );

        setBillingData(response.data.invoices);
        setThemes(response.data.themes);

        if (!toastShown.current) {
          toast.success(response.data.message);
          toastShown.current = true;
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [monthFilter]);

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

  const handleDelete = async (invoiceId) => {
    // First get password
    const { value: password } = await Swal.fire({
      title: "Enter your password to confirm deletion",
      input: "password",
      inputPlaceholder: "Enter your password",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6e7881",
      confirmButtonText: "Next",
      customClass: {
        popup: "custom-swal",
      },
      inputValidator: (value) => {
        if (!value) {
          return "Password is required";
        }
      },
    });

    if (!password) return;

    // Second confirmation after password
    const result = await Swal.fire({
      title: "Are you absolutely sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "custom-swal",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }api/v1/invoice/deleteInvoice/${invoiceId}`,
        {
          data: { Password: password },
          withCredentials: true,
        }
      );

      setBillingData(
        billingData.filter(
          (invoice) => (invoice.InvoiceID || invoice._id) !== invoiceId
        )
      );

      Swal.fire({
        title: "Deleted!",
        text: "Invoice has been deleted.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        customClass: {
          popup: "custom-swal",
        },
      });

      window.location.reload();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete invoice.",
        icon: "error",
        confirmButtonColor: "#d33",
        customClass: {
          popup: "custom-swal",
        },
      });
    }
  };

  const handleDownload = async () => {
    if (!invoiceRef.current || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await DomToImage.toJpeg(invoiceRef.current, { quality: 0.95 });
      const link = document.createElement("a");
      link.download = `${selectedInvoice.InvoiceID || selectedInvoice._id}.jpeg`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUpdate = async (updatedInvoice) => {
    try {
      const invoiceId = updatedInvoice._id;
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }api/v1/invoice/updateInvoice/${invoiceId}`,
        updatedInvoice,
        { withCredentials: true }
      );

      // Update the local state with the updated invoice
      setBillingData(
        billingData.map((invoice) =>
          (invoice.InvoiceID || invoice._id) === invoiceId
            ? response.data.invoice
            : invoice
        )
      );

      setShowInvoiceModal(false);

      Swal.fire({
        title: "Success!",
        text: "Invoice updated successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        customClass: {
          popup: "custom-swal",
        },
      });

      window.location.reload();
    } catch (error) {
      console.error("Error updating invoice:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update invoice.",
        icon: "error",
        confirmButtonColor: "#d33",
        customClass: {
          popup: "custom-swal",
        },
      });
    }
  };

  // Filter data only for search and tab
  const filteredData = billingData.filter((invoice) => {
    const matchesSearch =
      (invoice.InvoiceID || invoice._id).toLowerCase().includes(searchQuery) ||
      invoice.CustomerName.toLowerCase().includes(searchQuery) ||
      invoice.AmountPaid.toString().includes(searchQuery);

    const matchesTab =
      selectedTab === "Overview"
        ? true
        : selectedTab === "Unpaid"
        ? invoice.IsDue
        : !invoice.IsDue;

    const matchesDate = selectedDate
      ? new Date(invoice.Date).toISOString().split('T')[0] === selectedDate
      : true;

    return matchesSearch && matchesTab && matchesDate;
  }).sort((a, b) => {
    // Always sort by date in descending order (newest first)
    return new Date(b.Date) - new Date(a.Date);
  });

  const sendInvoiceEmail = async () => {
    if (!invoiceRef.current) return;

    setIsSending(true); // Start loading
    try {
      const dataUrl = await DomToImage.toJpeg(invoiceRef.current, {
        quality: 0.95,
      });

      // Send the invoice image to the server
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/invoice/send-email`,
        { image: dataUrl, invoiceId: selectedInvoice.InvoiceID },
        { withCredentials: true }
      );
      toast.success("Invoice sent to email successfully.");
    } catch (error) {
      console.error("Error sending invoice email:", error);
      toast.error("Failed to send invoice via email.");
    } finally {
      setIsSending(false); // End loading
    }
  };

  // Add this function before the return statement
  const handleWhatsAppShare = async () => {
    if (!invoiceRef.current || isSendingWhatsApp) return;

    setIsSendingWhatsApp(true);
    try {
      const dataUrl = await DomToImage.toJpeg(invoiceRef.current, { quality: 0.95 });
      const cloudinaryResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/invoice/store-image`,
        { image: dataUrl, invoiceId: selectedInvoice.InvoiceID },
        { withCredentials: true }
      );

      if (cloudinaryResponse.data.imageUrl) {
        const phoneNumber = selectedInvoice.CustomerPhone?.replace("+91", "") || "";
        const message = encodeURIComponent(
          `Here's your invoice from ${profile.CompanyName}.\nInvoice ID: ${selectedInvoice.InvoiceID}\n\nView/Download your invoice here: ${cloudinaryResponse.data.imageUrl}`
        );
        const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error("Error sharing via WhatsApp:", error);
      toast.error("Failed to share via WhatsApp");
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

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
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    monthFilter === label
                      ? "bg-blue-500 text-white shadow-md transform scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {label}
                </button>
              ))}

              {/* Show All button */}
              <button
                onClick={() => setMonthFilter("Show All")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  monthFilter === "Show All"
                    ? "bg-blue-500 text-white shadow-md transform scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                Show All
              </button>
            </div>

            {filteredData.length > 0 ? (
              <table className="w-full border-collapse text-sm md:text-base bg-white shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Invoice Number
                    </th>
                    <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Billing Date
                    </th>
                    <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Due Amount
                    </th>
                    <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-4 text-right text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Amount Paid
                    </th>
                    <th className="px-4 py-4 text-right text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200 ease-in-out cursor-pointer"
                      onClick={() => {
                        setSelectedInvoice(row);
                        setShowInvoiceModal(true);
                      }}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-gray-600 font-medium">
                        {row.InvoiceID || row._id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-800 font-medium">
                        {row.CustomerName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                        {new Date(row.Date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                        {row.DueDate
                          ? new Date(row.DueDate).toLocaleDateString("en-GB")
                          : "No Due"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-600 font-medium">
                        ₹
                        {(() => {
                          const totalAmount = row.Items.reduce(
                            (sum, item) =>
                              sum + item.AmountPerItem * item.Quantity,
                            0
                          );
                          return Math.max(
                            totalAmount - row.AmountPaid - (row.Discount || 0),
                            0
                          ).toLocaleString();
                        })()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full ${
                            !row.IsDue
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {row.IsDue ? "Unpaid" : "Paid"}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-gray-600 font-medium">
                        ₹{row.AmountPaid.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                              !row.IsDue
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                : "bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow"
                            }`}
                            disabled={!row.IsDue}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsPaid(row._id);
                            }}
                          >
                            {row.IsDue ? "Mark as Paid" : "Paid"}
                          </button>
                          <button
                            className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(row._id);
                            }}
                          >
                            Delete
                          </button>
                          <button
                            className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoice(row);
                              setIsEditing(true); // Set editing mode
                              setShowInvoiceModal(true);
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 mt-4 text-sm">
                No data found for "{monthFilter}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Invoice */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center overflow-y-auto">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-4xl relative my-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-3xl"
              onClick={() => {
                setShowInvoiceModal(false);
                setIsEditing(false); // Reset editing mode
              }}
            >
              &times;
            </button>
            <div ref={invoiceRef}>
              <Invoice
                invoice={selectedInvoice}
                profile={profile}
                isEditing={isEditing}
                onUpdate={handleUpdate}
                themes={themes}
              />
            </div>
            <div>
              <div className="flex justify-center mt-4 gap-4">
                <button
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={handleDownload}
                  disabled={isDownloading || isSending || isSendingWhatsApp}
                >
                  {isDownloading ? "Downloading..." : "Download"}
                </button>

                <button
                  onClick={sendInvoiceEmail}
                  className={`bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={isSending || isDownloading || isSendingWhatsApp}
                >
                  {isSending ? "Sending..." : "Send Invoice"}
                </button>

                {selectedInvoice.CustomerPhone && (
                  <button
                    onClick={handleWhatsAppShare}
                    className={`bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={isSendingWhatsApp || isSending || isDownloading}
                  >
                    {isSendingWhatsApp ? "Sending..." : "Send via WhatsApp"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BillingTable;
