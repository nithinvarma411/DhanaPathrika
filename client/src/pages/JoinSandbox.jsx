import React from "react";

const JoinSandbox = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">📲 Join WhatsApp Sandbox</h2>
        <p className="text-center text-gray-600 mb-4">
          To receive WhatsApp messages from us, follow these steps:
        </p>
        <ol className="list-decimal list-inside text-left text-gray-700 mb-6">
          <li>Open WhatsApp on your phone</li>
          <li>Scan the QR code below</li>
          <li>
            Send the code <strong className="text-black">join gold-circle</strong>
          </li>
        </ol>
        <div className="flex justify-center">
          <img
            src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2033%2033%22%20shape-rendering%3D%22crispEdges%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M0%200h33v33H0z%22%2F%3E%3Cpath%20stroke%3D%22%23000000%22%20d%3D%22M0%200.5h7m5%200h6m1%200h1m3%200h2m1%200h7M0%201.5h1m5%200h1m3%200h1m2%200h2m2%200h1m3%200h1m4%200h1m5%200h1M0%202.5h1m1%200h3m1%200h1m1%200h3m2%200h1m1%200h4m4%200h1m2%200h1m1%200h3m1%200h1M0%203.5h1m1%200h3m1%200h1m1%200h3m3%200h3m2%200h5m2%200h1m1%200h3m1%200h1M0%204.5h1m1%200h3m1%200h1m1%200h1m4%200h1m1%200h1m2%200h1m7%200h1m1%200h3m1%200h1M0%205.5h1m5%200h1m1%200h4m1%200h4m1%200h1m1%200h1m2%200h2m1%200h1m5%200h1M0%206.5h7m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h1m1%200h7M8%207.5h1m1%200h1m1%200h2m1%200h1m2%200h1m2%200h3M0%208.5h1m1%200h5m2%200h1m1%200h2m1%200h4m3%200h1m2%200h1m1%200h5M1%209.5h1m1%200h1m1%200h1m1%200h3m1%200h1m2%200h3m3%200h1m1%200h5m2%200h2m1%200h1M3%2010.5h1m1%200h3m1%200h2m1%200h1m5%200h2m6%200h1m1%200h1m1%200h2M1%2011.5h2m4%200h1m1%200h4m1%200h1m4%200h1m1%200h1m6%200h3m1%200h1M0%2012.5h1m1%200h1m1%200h3m1%200h1m1%200h1m7%200h2m1%200h1m2%200h2m1%200h1m1%200h1m2%200h1M0%2013.5h2m5%200h2m2%200h7m2%200h2m3%200h1m2%200h5M0%2014.5h2m2%200h1m1%200h3m4%200h1m3%200h1m1%200h1m1%200h1m1%200h3m1%200h1m2%200h2M0%2015.5h1m2%200h2m3%200h1m1%200h2m1%200h1m2%200h6m3%200h6M2%2016.5h1m1%200h1m1%200h2m2%200h2m1%200h2m1%200h2m1%200h1m4%200h2m1%200h2m3%200h1M0%2017.5h1m4%200h1m1%200h2m4%200h1m2%200h3m1%200h1m2%200h1m2%200h2m1%200h2M0%2018.5h3m1%200h1m1%200h2m1%200h1m2%200h1m1%200h2m1%200h1m4%200h1m3%200h1m1%200h1m1%200h2M0%2019.5h1m1%200h2m1%200h1m1%200h1m1%200h2m1%200h4m1%200h2m7%200h1m1%200h3M3%2020.5h1m2%200h1m1%200h1m2%200h1m2%200h1m1%200h1m2%200h8m2%200h1m1%200h2M0%2021.5h2m3%200h1m3%200h3m1%200h1m1%200h1m1%200h2m4%200h1m4%200h1m1%200h1m1%200h1M0%2022.5h1m3%200h1m1%200h1m1%200h2m2%200h5m1%200h1m1%200h5m2%200h2m1%200h2M0%2023.5h1m2%200h2m4%200h1m2%200h4m1%200h2m4%200h3m2%200h2m2%200h1M0%2024.5h1m3%200h3m1%200h1m1%200h1m1%200h1m2%200h1m4%200h2m2%200h5m1%200h3M8%2025.5h4m2%200h1m1%200h1m1%200h1m2%200h1m2%200h1m3%200h1m1%200h2M0%2026.5h7m2%200h1m3%200h1m4%200h1m2%200h1m1%200h2m1%200h1m1%200h1m1%200h3M0%2027.5h1m5%200h1m1%200h5m2%200h1m3%200h1m1%200h4m3%200h1m1%200h1m1%200h1M0%2028.5h1m1%200h3m1%200h1m1%200h1m1%200h4m1%200h1m2%200h2m1%200h1m2%200h6M0%2029.5h1m1%200h3m1%200h1m1%200h1m4%200h1m1%200h3m2%200h1m1%200h1m4%200h3M0%2030.5h1m1%200h3m1%200h1m1%200h1m1%200h2m5%200h3m1%200h3m2%200h2M0%2031.5h1m5%200h1m2%200h2m1%200h2m2%200h5m1%200h4m1%200h3M0%2032.5h7m1%200h1m1%200h2m4%200h2m1%200h1m1%200h1m1%200h1m2%200h6%22%2F%3E%3C%2Fsvg%3E"
            alt="WhatsApp QR"
            className="w-64 h-64"
          />
        </div>
      </div>
    </div>
  );
};

export default JoinSandbox;
