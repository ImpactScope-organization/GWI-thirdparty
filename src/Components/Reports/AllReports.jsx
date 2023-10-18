import React, { useState } from "react";
// import { allReportsData } from "../../data";
import { useStepsContext } from "../../Context/StateContext";
import {
  useGetAllPendingReports,
  useGetAllReviewedReports,
  useGetAllUnderReviewReports,
} from "../../Hooks/reports-hooks";
import PriorityColor from "./PriorityColor";

const AllReports = () => {
  const [activeTab, setActiveTab] = useState(1);
  // const { setStep, rows } = useStepsContext();

  const { data: pendingReportsData, isLoading: pendingReportLoading } =
    useGetAllPendingReports();

  console.log("pendingReportsData");
  console.log(pendingReportsData);

  const { data: reviewReportsData } = useGetAllUnderReviewReports();
  const { data: reviewedReportsData } = useGetAllReviewedReports();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-[90%] mx-auto my-10">
      {/* Top Container */}
      <div className="flex justify-between items-start mb-6">
        {/* Left */}
        <div>
          <h1 className="text-[#000] font-bold text-3xl mb-1">Reports</h1>
          <p className="text-[#0000007f] text-lg font-semibold mb-7">
            Overview all of the Greenwashing reports here
          </p>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="flex gap-10 w-fit justify-center item-center mb-8">
        <h1
          onClick={() => handleTabClick(1)}
          className={`cursor-pointer ${
            activeTab === 1
              ? "border-b-[2px] border-[#3FDD78] text-[#000] font-semibold"
              : "text-[#5f6264]"
          }  pb-1 `}
        >
          Pending review
        </h1>
        <h1
          onClick={() => handleTabClick(2)}
          className={`cursor-pointer ${
            activeTab === 2
              ? "border-b-[2px] border-[#3FDD78] text-[#000] font-semibold"
              : "text-[#5a5c5e]"
          }  pb-1 `}
        >
          Review in progress
        </h1>

        <h1
          onClick={() => handleTabClick(3)}
          className={`cursor-pointer ${
            activeTab === 3
              ? "border-b-[2px] border-[#3FDD78] text-[#000] font-semibold"
              : "text-[#5a5c5e]"
          }  pb-1 `}
        >
          Review completed
        </h1>
      </div>

      {/* Reports Container */}
      <div className="w-full gap-5 grid grid-cols-3">
        {activeTab === 1 && (
          <Report
            data={pendingReportsData}
            activeTab={1}
            loading={pendingReportLoading}
          />
        )}
        {activeTab === 2 && <Report data={reviewReportsData} activeTab={2} />}
        {activeTab === 3 && <Report data={reviewedReportsData} activeTab={3} />}
      </div>
    </div>
  );
};

export default AllReports;

const Report = ({ data, activeTab, loading }) => {
  const { setStep, setCompany, setSpecificReportDetailsID } = useStepsContext();

  const handleNavigate = async (report, id) => {
    setCompany(report);
    setSpecificReportDetailsID(id);
    // console.log("report: ", report);

    if (activeTab === 1) {
      setStep("specific_report");
    }

    if (activeTab === 2) {
      setStep("review_progress");
    }

    if (activeTab === 3) {
      setStep("review_completed");
    }
  };

  return (
    <>
      {data?.results
        ? data?.results.map((report, index) => (
            <div
              key={index}
              // onClick={() => setStep("specific_report")}
              onClick={() => handleNavigate(report?.companyName, report._id)}
              style={{
                boxShadow:
                  " 0px 33px 32px -16px rgba(0, 0, 0, 0.10), 0px 0px 16px 4px rgba(0, 0, 0, 0.04)",
              }}
              className="p-4 cursor-pointer rounded-xl hover:border-[1px] hover:border-black  "
            >
              <p className="mb-2 text-sm text-[#6C7275]">
                {loading
                  ? "loading..."
                  : report?.sendToRegulatorsTimeStamp &&
                    report?.sendToRegulatorsTimeStamp}
              </p>
              <h1 className="mb-3 text-[#000] text-2xl font-semibold">
                {loading ? "Loading..." : report?.companyName}
              </h1>
              <p className="text-[#6C7275] mr-3 font-semibold">
                Jurisdiction :
                <span className="text-[#000] font-semibold ml-2 text-sm ">
                  {loading
                    ? "loading..."
                    : report?.jurisdiction && report?.jurisdiction}
                </span>
              </p>
              <p className="text-[#6C7275] mr-3 font-semibold">
                Data sources :
                <span className="text-[#000] font-semibold ml-2 text-sm">
                  {loading
                    ? "loading..."
                    : report?.dataSources && report?.dataSources}
                </span>
              </p>

              <div className="flex justify-start items-center ">
                <p className="text-[#6C7275] mr-3 font-semibold">Age:</p>
                <label
                  htmlFor="freshness"
                  className="ml-2 text-[#000] font-semibold text-sm"
                >
                  {report?.age}
                </label>
              </div>

              <div className="flex justify-start items-center ">
                <p className="text-[#6C7275] mr-3 font-semibold">Priority:</p>

                <div className="flex justify-start items-center">
                  <PriorityColor priority={report?.priority} />

                  <label
                    htmlFor="potentialgreenwashing"
                    className="ml-2 text-[#000] font-semibold text-sm"
                  >
                    {report?.priority}
                  </label>
                </div>
              </div>
            </div>
          ))
        : data?.message && <p>{data?.message}</p>}
    </>
  );
};
