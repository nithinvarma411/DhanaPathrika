import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BillingTable = ({ searchQuery, selectedDate, selectedTab }) => {
  const [billingData, setBillingData] = useState([]);
  const toastShown = useRef(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/getInvoices`,
          { withCredentials: true }
        );

        const sortedInvoices = response.data.invoices.sort(
          (a, b) => new Date(b.Date) - new Date(a.Date)
        );
        setBillingData(sortedInvoices);

        // Display toast only once
        if (!toastShown.current) {
          toast.success(response.data.message);
          toastShown.current = true;
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
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

    // Find the invoice to update
    let updatedInvoice;
    const updatedBillingData = billingData.map((invoice) => {
      if (invoice._id === invoiceId) {
        // Calculate total amount from Items array
        const totalAmount = invoice.Items.reduce((sum, item) => {
          return sum + item.AmountPerItem * item.Quantity;
        }, 0);

        updatedInvoice = {
          ...invoice,
          IsDue: false,
          DueDate: null,
          AmountPaid: totalAmount, // Update AmountPaid to total bill
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
        }/api/v1/invoice/updateInvoice/${invoiceId}`,
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

      // Revert changes if request fails
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

  // **Filter invoices based on search query**
  const filteredData = billingData.filter((invoice) => {
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

    return matchesSearch && matchesDate && matchesTab;
  });

  return (
    <div className="overflow-x-auto">
      <div className="w-full max-w-full">
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
              <tr key={index} className="hover:bg-gray-50">
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
                    return Math.max(totalAmount - row.AmountPaid, 0); // Ensure it doesn't go negative
                  })()}
                </td>

                <td className="px-2 md:px-4 py-3">
                  <span
                    className={`px-2 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full 
                      ${
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
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded transition-all 
                      ${
                        !row.IsDue
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    disabled={!row.IsDue}
                    onClick={() => handleMarkAsPaid(row._id)}
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
  );
};

export default BillingTable;
