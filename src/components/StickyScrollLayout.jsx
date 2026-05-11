import React from "react";

const StickyScrollLayout = () => {
  return (
    <div className="bg-gray-100">
      {/* 1. Top Section (Optional) */}
      <div className="h-[40vh] flex items-center justify-center bg-white">
        <h2 className="text-xl text-gray-400">Scroll down to start</h2>
      </div>

      {/* 2. The Main Parent Container */}
      <div className="flex flex-col md:flex-row relative max-w-7xl mx-auto">
        {/* Left Side: Sticky Div */}
        <div className="md:w-1/2 h-screen sticky top-0 flex flex-col justify-center p-12 bg-blue-600 text-white">
          <h1 className="text-5xl font-extrabold mb-6">Fixed Focus</h1>
          <p className="text-lg opacity-90">
            I will stay perfectly still while you explore the images on the
            right. Only after you've seen every single one will I move out of
            the way.
          </p>
        </div>

        {/* Right Side: Long Scrollable Content */}
        <div className="md:w-1/2 p-8 space-y-12">
          {/* Use large heights or real images to create the scroll length */}
          <div className="h-[700px] rounded-3xl bg-white shadow-lg flex items-center justify-center text-gray-400 text-2xl">
            Image 01
          </div>
          <div className="h-[700px] rounded-3xl bg-white shadow-lg flex items-center justify-center text-gray-400 text-2xl">
            Image 02
          </div>
          <div className="h-[700px] rounded-3xl bg-white shadow-lg flex items-center justify-center text-gray-400 text-2xl">
            Image 03
          </div>
          <div className="h-[700px] rounded-3xl bg-white shadow-lg flex items-center justify-center text-gray-400 text-2xl">
            Image 04
          </div>
        </div>
      </div>

      {/* 3. Bottom Section */}
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <h2 className="text-4xl font-bold text-white">End of Section</h2>
      </div>
    </div>
  );
};

export default StickySection;
