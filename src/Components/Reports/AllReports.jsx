import React, { useState } from "react";
import { useStepsContext } from "../../Context/StateContext";
import {
  useGetAllPendingReports,
  useGetAllReviewedReports,
  useGetAllUnderReviewReports,
} from "../../Hooks/reports-hooks";

const AllReports = () => {
  const [activeTab, setActiveTab] = useState(1);

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
      <div className="flex justify-between items-start mb-3">
        {/* Left */}
        <div>
          <h1 className="text-darkBlack font-bold text-[40px] leading-[64px]">
            Reports
          </h1>
          <p className="text-reportGrey text-lg font-karla font-normal mb-7 leading-[36px]">
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
              ? "border-b-[2px] border-[#3FDD78] text-[#181E2F] font-semibold"
              : "text-reportGrey font-medium"
          }  pb-1 text-[16px] leading-[24px]`}
        >
          Pending review
        </h1>
        <h1
          onClick={() => handleTabClick(2)}
          className={`cursor-pointer ${
            activeTab === 2
              ? "border-b-[2px] border-[#3FDD78] text-[#181E2F] font-semibold"
              : "text-reportGrey font-medium"
          }  pb-1 text-[16px] leading-[24px]`}
        >
          Review in progress
        </h1>

        <h1
          onClick={() => handleTabClick(3)}
          className={`cursor-pointer ${
            activeTab === 3
              ? "border-b-[2px] border-[#3FDD78] text-[#181E2F] font-semibold"
              : "text-reportGrey font-medium"
          }  pb-1 text-[16px] leading-[24px]`}
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
              onClick={() => {
                handleNavigate(report?.companyName, report.id);
              }}
              style={{
                boxShadow:
                  " 0px 13px 12px -16px rgba(0, 0, 0, 0.05), 0px 0px 12px 0px rgba(0, 0, 0, 0.1)",
              }}
              className="p-4 cursor-pointer rounded-xl border border-borderLight hover:border-darkBlack"
            >
              <p className="text-[#6C7275] text-[14px] mb-[4px] font-medium">
                {loading
                  ? "loading..."
                  : report?.sendToRegulatorsTimeStamp &&
                    report?.sendToRegulatorsTimeStamp}
              </p>
              <h1 className="mb-3 text-darkBlack text-2xl font-semibold">
                {loading ? "Loading..." : report?.companyName}
              </h1>
              <p className="text-[#6C7275] mt-[16px] text-[14px] mr-3 font-medium">
                Jurisdiction :
                <span className="text-darkBlack font-semibold ml-2 text-sm ">
                  {loading
                    ? "loading..."
                    : report?.jurisdiction && report?.jurisdiction}
                </span>
              </p>
            </div>
          ))
        : data?.message && <p className="text-darkBlack">{data?.message}</p>}
    </>
  );
};
