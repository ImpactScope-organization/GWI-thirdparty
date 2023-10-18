import React, { useState } from "react";
import BackButton from "../Shared/BackButton";
import { useStepsContext } from "../../Context/StateContext";
import { useGetSpecificReportDetails } from "../../Hooks/reports-hooks";

// ----------------------------
const ReviewCompleted = () => {
  const { setStep, specificReportDetailsID } = useStepsContext();

  // getSingleReportDetail;
  const {
    data: specificReportDetailsData,
    isLoading: specificReportDetailsLoading,
  } = useGetSpecificReportDetails(specificReportDetailsID);

  return (
    <div>
      <BackButton setStep={() => setStep("all_reports")} />

      {/* Specific Report */}
      <div
        style={{
          boxShadow:
            "0px 33px 32px -16px rgba(0, 0, 0, 0.10), 0px 0px 16px 4px rgba(0, 0, 0, 0.04)",
        }}
        className="w-[80%] mx-auto my-10 p-5 rounded-xl"
      >
        {/* Top */}

        <div className="mb-7">
          <div className="flex justify-between items-center">
            <p className="mb-2 text-sm text-[#2c2d2e] font-semibold">
              {specificReportDetailsLoading
                ? "Loading..."
                : specificReportDetailsData?.results?.sendToRegulatorsTimeStamp}
            </p>

            <img src="./assets/Review__Completed.png" alt="logo" />
          </div>
          <h1 className="mb-5 text-[#000] text-2xl font-bold">
            {specificReportDetailsLoading
              ? "Loading..."
              : specificReportDetailsData?.results?.companyName}
          </h1>
          <p className="text-[#6C7275] text-base mb-1 font-semibold">
            Jurisdiction :
            <span className="text-[#000] font-semibold ml-2">
              {specificReportDetailsLoading
                ? "Loading..."
                : specificReportDetailsData?.results?.jurisdiction}
            </span>
          </p>

          <p className="text-[#6C7275] text-base font-semibold mb-1">
            Data sources: :
            <span className="text-[#000] font-semibold ml-2">
              {specificReportDetailsLoading
                ? "Loading..."
                : specificReportDetailsData?.results?.dataSources}
            </span>
          </p>
          {/* Links */}
          <div className="">
            <>
              <p className="mb-1 text-[#6C7275] text-base">
                <span className="font-bold"> Hash: </span>
                <a
                  href={`https://ipfs.io/ipfs/${specificReportDetailsData?.results?.IPFSHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#3FDD78] font-semibold"
                >
                  {" "}
                  {specificReportDetailsLoading
                    ? "Loading..."
                    : specificReportDetailsData?.results?.IPFSHash}
                </a>
              </p>
              <p className="text-[#6C7275] text-base">
                <span className="font-bold"> Etherscan URL: </span>
                <a
                  href={specificReportDetailsData?.results?.etherscanURL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#3FDD78] font-semibold"
                >
                  {" "}
                  {specificReportDetailsLoading
                    ? "Loading..."
                    : specificReportDetailsData?.results?.etherscanURL}
                </a>
              </p>
            </>
          </div>
        </div>

        {/* Verdict */}
        <div className="bg-[#F3F5F7] p-3 rounded-md mb-7">
          <p className="text-[#6C7275] mb-3 font-semibold">
            Summary of findings::
          </p>
          <p className="font-semibold">
            {" "}
            {specificReportDetailsLoading
              ? "Loading..."
              : specificReportDetailsData?.results?.contradiction}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCompleted;
