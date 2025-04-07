import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fef2f2] px-4">
      <div className="max-w-lg text-center">
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/page-not-found-7621863-6102085.png"
          alt="404 Illustration"
          className="w-72 mx-auto mb-6"
        />
        <h1 className="text-6xl font-extrabold text-[#7f1d1d]">404</h1>
        <h2 className="text-2xl font-semibold text-[#991b1b] mt-4">Page Not Found</h2>
        <p className="text-[#b91c1c] mt-2">
          Looks like you're lost in stock! This page doesn't exist or might have been moved.
        </p>
        <a
          href="/home"
          className="inline-block mt-6 px-6 py-3 bg-[#7f1d1d] text-white rounded-lg hover:bg-[#991b1b] transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
