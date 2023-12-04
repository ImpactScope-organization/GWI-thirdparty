import { useStepsContext } from "../../Context/StateContext";
import CustomGaugeChart from "../gauge-chart";

const ReportDetails = ({ data, activeTab, loading }) => {
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
    <div
      id="report-container"
      className="flex flex-col md:flex-row gap-6 my-10 px-16 max-w-[1120px] mx-auto"
    >
      <div
        style={{
          boxShadow:
            "0px 33px 32px -16px rgba(0, 0, 0, 0.10), 0px 0px 16px 4px rgba(0, 0, 0, 0.04)",
        }}
        className="basis-8/12 p-[16px] mx-auto rounded-2xl "
      >
        {/* Top */}

        <div>
          <p className="mb-1 leading-[24px] text-sm text-reportGrey font-medium">
            {/* {formattedDate} */}
          </p>
          <h1 className="leading-[64px] text-[#000] text-2xl font-bold">
            {data?.companyName}
          </h1>
          <div className="mt-[16px] grid grid-cols-5 max-w-[60%]">
            <p className="text-reportGrey  col-span-2 text-[1em] text-base mb-1 font-md">
              Jurisdiction
            </p>
            <p className="text-blackText col-span-3 ml-4 text-[1em] text-base mb-1 font-md">
              {data?.jurisdiction}
            </p>
            <p className="text-reportGrey col-span-2 text-[1em] text-base mb-1 font-md">
              Sector
            </p>
            <p className="text-blackText col-span-3 ml-4 text-[1em] text-base mb-1 font-md">
              {data?.sector}
            </p>
            <p className="text-reportGrey col-span-2 text-[1em] text-base mb-1 font-md">
              Annual Revenue
            </p>
            <p className="text-blackText col-span-3 ml-4 text-[1em] text-base mb-1 font-md">
              {data?.annualRevenue}
            </p>
            <p className="text-reportGrey col-span-2 text-[1em] text-base mb-1 font-md">
              Employees
            </p>
            <p className="text-blackText col-span-3 ml-4 text-[1em] text-base mb-1 font-md">
              {data?.employees}
            </p>
          </div>
        </div>

        {/* Contradiction */}
        <div className="bg-[#F3F5F7] mt-[32px] p-3 rounded-md mb-5">
          <p className="text-reportGrey text-[1em] text-base font-md">
            Contradictions
          </p>
          <p className="text-blackText mt-[8px] text-[1em] text-base  font-md">
            {data?.contradictions &&
              data?.contradictions
                ?.split("\n")
                ?.filter((item) => item !== "\n")
                ?.map((text) => (
                  <>
                    {text}
                    <br />
                    <br />
                  </>
                ))}
          </p>
        </div>
        {/*    Potential inconsistencies */}
        <div className="bg-[#F3F5F7] mt-[32px] p-3 rounded-md mb-5">
          <p className="text-reportGrey text-[1em] text-base font-md">
            Potential inconsistencies
          </p>
          <p className="text-blackText mt-[8px] text-[1em] text-base  font-md ">
            {data?.potentialInconsistencies > "" &&
              data?.potentialInconsistencies
                ?.split("\n")
                ?.filter((item) => item !== "\n")
                ?.map((text) => (
                  <>
                    {text}
                    <br />
                    <br />
                  </>
                ))}
          </p>
        </div>
        {/* Unsubstantiated claims */}
        <div className="bg-[#F3F5F7] mt-[32px] p-3 rounded-md mb-5">
          <p className="text-reportGrey text-[1em] text-base font-md">
            Unsubstantiated claims
          </p>
          <p className="text-blackText mt-[8px] text-[1em] text-base  font-md ">
            {data?.unsubstantiatedClaims &&
              data?.unsubstantiatedClaims
                ?.split("\n")
                ?.filter((item) => item !== "\n")
                ?.map((text) => (
                  <>
                    {text}
                    <br />
                    <br />
                  </>
                ))}
          </p>
        </div>

        <div>
          <h2 className="text-[18px] mb-[16px] leading-[24px] font-[600]">
            Sources
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data?.sources.length > 0 ? (
              data?.sources?.map((source, index) => {
                return (source?.title || source?.Title) &&
                  (source?.description || source?.Description) ? (
                  <div className="group bg-[#F3F5F7] p-3 rounded-md mb-5">
                    <p className="text-reportGrey  line-clamp-1 group-hover:line-clamp-none text-[1em] text-base font-md">
                      #{index + 1} {source?.title || source?.Title}
                    </p>
                    <p className="line-clamp-2 group-hover:line-clamp-none text-blackText mt-[8px] text-[1em] text-base  font-md ">
                      {source?.description || source?.Description}
                    </p>
                  </div>
                ) : (
                  <></>
                );
              })
            ) : (
              <p className="text-blackText mt-[8px] text-[1em] text-base  font-md">
                No data found
              </p>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="card_shadow rounded-2xl flex basis-4/12 flex-col gap-1 py-4 px-3">
          <h5 className="font-medium text-blackText">Report</h5>
          <div className="overflow-hidden w-full px-2 flex justify-center items-center ">
            <CustomGaugeChart
              percentage={
                (data?.greenwashRiskPercentage &&
                  parseInt(data?.greenwashRiskPercentage)) ||
                0
              }
            />
          </div>
          {/* Cols */}
          <div className="mt-[16px] grid grid-cols-2 max-w-[370px] gap-2 my-3 ">
            <p className="text-reportGrey   text-[1em] text-base mb-1 font-md">
              Reporting risk
            </p>
            <div className="flex flex-row ml-4 items-center gap-[4px] flex-nowrap">
              {Array.from({ length: 10 }).map((_item, index) => {
                return (
                  <div
                    className={`w-[4px] h-[14px] rounded-sm ${
                      (index + 1) * 10 <=
                      parseInt(data?.reportingRiskPercentage)
                        ? "bg-darkGreen"
                        : "bg-reportGrey "
                    }`}
                  ></div>
                );
              })}
              <p className="text-blackText ml-[8px] text-[1em] text-base font-md">
                {parseInt(data?.reportingRiskPercentage)}%
              </p>
            </div>
            <p className="text-reportGrey  text-[1em] text-base mb-1 font-md">
              GHG emissions
            </p>
            <p className="text-blackText ml-4 text-[1em] text-base mb-1 font-md">
              {data?.GHGEmissions}
            </p>
            <p className="text-reportGrey  text-[1em] text-base mb-1 font-md">
              Report status
            </p>
            <p className="text-blackText ml-4 text-[1em] text-base mb-1 font-md">
              <span className="py-1 px-3 rounded-3xl bg-foggyGrey">
                Generated
              </span>
            </p>
            {data?.IPFSHash && (
              <p className="text-reportGrey  text-[1em] text-base mb-1 font-md">
                Timestamp
              </p>
            )}
            {data?.IPFSHash && (
              <a className="col-span-1 ml-4 text-[1em] text-base mb-1 font-md">
                {/* {formattedDate} */}
              </a>
            )}
            {/* Links */}
            {data?.IPFSHash && (
              <p className="text-reportGrey  text-[1em] text-base mb-1 font-md">
                IPFS link
              </p>
            )}
            {data?.IPFSHash && (
              <a
                href={`https://ipfs.io/ipfs/${data?.IPFSHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-darkGreen col-span-1 truncate ml-4 text-[1em]  mb-1 font-md"
              >
                {data?.IPFSHash}
              </a>
            )}
            {data?.etherscanURL && (
              <p className="text-reportGrey  text-[1em] text-base mb-1 font-md">
                Etherscan URL
              </p>
            )}
            {data?.etherscanURL && (
              <a
                href={data?.etherscanURL}
                target="_blank"
                rel="noreferrer"
                className="text-darkGreen truncate ml-4 text-[1em] text-base mb-1 font-md"
              >
                {data?.etherscanURL}
              </a>
            )}
          </div>
          {/* {(!data?.IPFSHash || !data?.etherscanURL) && (
            <div className="flex flex-row gap-4 w-full">
              <button
                // onClick={handleSendToRegulators}
                className="bg-darkGreen flex-1 rounded-lg  py-3 px-3 border-none outline-none text-[#fff]"
              >
                Send to regulator
              </button>
              <Dropdown
                trigger={["click"]}
                menu={{
                  onClick: (e) => {
                    if (e.key == 1) {
                      captureScreen("report-container");
                    } else {
                      alert("coming soon!");
                    }
                  },
                  items: [
                    { label: "Modify Report", key: "0" },
                    {
                      label: "Save as PDF",
                      key: "1",
                    },
                    { label: "Remove from DB", key: "2" },
                  ],
                }}
                placement="bottomRight"
              >
                <div className="py-[12px] px-[18px] rounded-md border bg-transparent flex justify-center items-center">
                  <IoEllipsisHorizontalSharp />
                </div>
              </Dropdown>
            </div>
          )} */}
          {data?.IPFSHash && data?.etherscanURL && (
            <div className="flex flex-row gap-2 w-full">
              <button
                // onClick={() => captureScreen("report-container")}
                className="bg-blackText  rounded-lg  py-2 px-2 border-none outline-none text-[#fff] text-[16px]"
              >
                Download as .pdf
              </button>
              <button
                onClick={() => alert("Coming Soon!")}
                className="bg-white border border-danger rounded-lg  py-2 px-2 text-danger text-[16px]"
              >
                Remove from DB
              </button>
            </div>
          )}
        </div>
        <div className="card_shadow mt-8 gap-4 rounded-2xl flex basis-4/12 flex-col z-50 p-[16px]">
          <h2 className="text-[18px] leading-[24px] font-[600]">Documents</h2>
          <div className="flex flex-row flex-nowrap justify-start items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-2xl">
            <img src="/assets/xls-icon.svg" alt="xls-icon" />
            <h2 className="text-[18px] leading-[24px] mt-1 font-[600]">
              <span className="truncate">AIB_Group_PLC</span>.csv
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
