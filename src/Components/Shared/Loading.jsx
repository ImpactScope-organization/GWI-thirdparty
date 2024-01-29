import React from "react";

const Loading = ({ title }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[86vh]">
      <h1 className="text-darkBlack font-bold text-4xl mb-1">Please wait...</h1>
      <p className="text-[#0000007f] text-lg font-semibold mb-7">{title}</p>
    </div>
  );
};

export default Loading;
