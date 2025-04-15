import React from "react";

const Invoice = ({ invoice, profile }) => {
  if (!invoice || !profile) {
    return <p className="text-center p-4">Loading...</p>;
  }

  const totalQuantity = invoice.Items.reduce((sum, item) => sum + item.Quantity, 0);
  const totalAmount = invoice.Items.reduce((sum, item) => sum + item.Quantity * item.AmountPerItem, 0);

  return (
    <div className="flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 gap-4">
          <div className="border-2 border-red-600 rounded-full py-2 px-3 w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-red-600 text-center truncate">
              {profile.CompanyName}
            </h1>
          </div>
          <div className="text-center sm:text-right">
            <p className="font-medium text-sm sm:text-base">Invoice No. - {invoice._id || "N/A"}</p>
          </div>
        </div>

        {/* Payment info section */}
        <div className="border-t border-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
            <div className="p-4">
              <h2 className="font-bold mb-2">Payable To</h2>
              <p className="font-bold">{profile.UserName || "N/A"}</p>
              <p className="text-sm md:text-base break-words">{profile.BussinessAdress || "N/A"}</p>
              <p className="text-sm md:text-base break-words">{profile.Email || "N/A"}</p>
            </div>

            <div className="p-4">
              <h2 className="font-bold mb-2">Date</h2>
              <p>{new Date(invoice.Date).toLocaleDateString("en-GB") || "N/A"}</p>
            </div>

            <div className="p-4">
              <h2 className="font-bold mb-2">Due Date</h2>
              <p>{invoice.DueDate ? new Date(invoice.DueDate).toLocaleDateString("en-GB") : "No Due"}</p>
            </div>
          </div>
        </div>

        {/* Billing and items section */}
        <div className="border-t border-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
            <div className="p-4">
              <h2 className="font-bold mb-2">Billed To</h2>
              <p className="font-bold">{invoice.CustomerName || "N/A"}</p>
              <p className="text-sm md:text-base break-words">{invoice.CustomerEmail || "N/A"}</p>
            </div>

            <div className="col-span-1 sm:col-span-2 overflow-x-auto scrollbar-hide">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 px-2 sm:px-4 text-left">Item Name</th>
                    <th className="py-2 px-2 sm:px-4 text-right w-16 sm:w-24">Qty</th>
                    <th className="py-2 px-2 sm:px-4 text-right w-24 sm:w-32">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.Items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="py-2 px-2 sm:px-4 break-words">{item.Name}</td>
                      <td className="py-2 px-2 sm:px-4 text-right">{item.Quantity}</td>
                      <td className="py-2 px-2 sm:px-4 text-right">₹ {item.AmountPerItem}</td>
                    </tr>
                  ))}

                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-2 sm:px-4 font-bold">TOTAL</td>
                    <td className="py-2 px-2 sm:px-4 text-right">{totalQuantity}</td>
                    <td className="py-2 px-2 sm:px-4 text-right">₹ {totalAmount}</td>
                  </tr>

                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-2 sm:px-4 font-bold">Discount</td>
                    <td className="py-2 px-2 sm:px-4 text-right"></td>
                    <td className="py-2 px-2 sm:px-4 text-right">₹ {invoice.Discount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="border-t border-gray-300 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
          <div className="p-4">
            <h2 className="font-bold mb-2">Contact</h2>
            <p className="text-sm md:text-base break-words">{profile.Email}</p>
            <p className="text-sm md:text-base break-words">{profile.BussinessAdress}</p>
            <p className="text-sm md:text-base">{profile.MobileNumber}</p>
          </div>
          <div className="col-span-1 sm:col-span-2 p-4 flex items-center justify-center sm:justify-end">
            <div className="border-2 border-red-600 rounded-full px-4 sm:px-8 py-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-red-600">Thank you</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
