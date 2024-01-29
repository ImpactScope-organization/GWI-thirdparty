import React, { useEffect, useRef, useState } from "react";
import BackButton from "../Shared/BackButton";
import { useStepsContext } from "../../Context/StateContext";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAssignCase,
  useCloseCase,
  useGetChangeStatusToReview,
  useUpdateCase,
  useGetSpecificReportDetails,
} from "../../Hooks/reports-hooks";
import { formattedDate } from "../../utils/date";
import PriorityColor from "./PriorityColor";
import CustomGaugeChart from "../gauge-chart";

// ----------------------------
const SpecificReport = () => {
  const queryClient = useQueryClient();
  const [isEditing, setisEditing] = useState(false);
  const [showCaseStatusStep0, setShowCaseStatusStep0] = useState(true);
  const [showCaseStatusStep1, setShowCaseStatusStep1] = useState(false);
  const [showCaseStatusStep2, setShowCaseStatusStep2] = useState(false);
  const [showCaseStatusStep3Update, setShowCaseStatusStep3Update] =
    useState(false);
  const [showCaseStatusStep4Final, setShowCaseStatusStep4Final] =
    useState(false);
  const { setStep, company, specificReportDetailsID } = useStepsContext();

  const callAPIAgain = () => {
    queryClient.invalidateQueries("getSingleReportDetail");
  };
  // useGetChangeStatusToReview;
  const {
    mutate: addMutateChangeStatusToReview,
    isLoading: changeStatusLoading,
  } = useGetChangeStatusToReview(
    JSON.stringify({
      company,
      pending: "true",
      reviewing: "true",
      sentToRegulators: "false",
      reviewed: "false",
      caseOpenedTimeStamp: formattedDate,
    })
  );

  const handleChangeStatusCase = async () => {
    addMutateChangeStatusToReview(
      {},
      {
        onSuccess: (response) => {
          if (response?.data?.message) {
            toast.error(response?.data?.message);
          }
          if (response?.data?.results) {
            callAPIAgain();
            setShowCaseStatusStep0(false);
            setShowCaseStatusStep1(true);
            setisEditing(true);
          }
        },
      }
    );
  };

  // AssignCase
  const [reportAssignCaseData, setReportAssignCaseData] = useState({
    assignedTo: "",
    comment: "",
  });

  const { mutate: addMutate, isLoading } = useAssignCase(
    JSON.stringify({
      ...reportAssignCaseData,
      pending: "false",
      caseAssignedTimeStamp: formattedDate,
      openedBy: "John Doe (case file officer)",
      company,
    })
    // currentCountry
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReportAssignCaseData({
      ...reportAssignCaseData,
      [name]: value,
    });
  };

  const handleAssignCase = async () => {
    if (!reportAssignCaseData.assignedTo) {
      toast.error("Please enter the fields");
      return;
    }

    addMutate(
      {},
      {
        onSuccess: (response) => {
          if (response?.data?.message) {
            toast.error(response?.data?.message);
          }
          if (response?.data?.results) {
            toast.success("Case has been assigned");
            callAPIAgain();
            setisEditing(false);
            // setShowCaseStatusStep1(false);
            // setShowCaseStatusStep2(true);
          }
        },
      }
    );
  };

  // updateCase

  const [updateReportComment, setUpdateReportComment] = useState("");

  const { mutate: addMutateUpdateCase, isLoading: updateCaseLoading } =
    useUpdateCase(
      JSON.stringify({
        ...updateReportComment,
        caseUpdateTimeStamp: formattedDate,
        company,
      })
      // currentCountry
    );

  const handleUpdateCase = async () => {
    if (!updateReportComment) {
      toast.error("Please enter the field");
      return;
    }

    addMutateUpdateCase(
      {},
      {
        onSuccess: (response) => {
          if (response?.data?.message) {
            toast.error(response?.data?.message);
          }
          if (response?.data?.results) {
            toast.success("Comment has been updated");
            setShowCaseStatusStep1(false);
            setShowCaseStatusStep3Update(false);
            setShowCaseStatusStep4Final(true);
            //  setShowCaseStatusStep2(true);
          }
        },
      }
    );
  };

  // useCloseCase;
  const { mutate: addMutateCloseCase, isLoading: closeCaseLoading } =
    useCloseCase(
      JSON.stringify({
        company,
        reviewed: "true",
        reviewing: "false",
        sentToRegulators: "false",
      })
      // currentCountry
    );

  const handleCloseCase = async () => {
    addMutateCloseCase(
      {},
      {
        onSuccess: (response) => {
          if (response?.data?.message) {
            toast.error(response?.data?.message);
          }
          if (response?.data?.results) {
            toast.success("Case has been closed");
            setShowCaseStatusStep4Final(false);
            setStep("all_reports");
          }
        },
      }
    );
  };

  // getSingleReportDetail;
  const {
    data: specificReportDetailsData,
    isLoading: specificReportDetailsLoading,
  } = useGetSpecificReportDetails(specificReportDetailsID);

  // const allClaim = JSON.parse(specificReportDetailsData?.results?.claims);
  const allClaim = specificReportDetailsData?.results?.claims
    ? JSON.parse(specificReportDetailsData?.results?.claims)
    : null;

  console.log("allClaim: ", allClaim);

  // useEffect(() => {
  //   callAPIAgain();
  // }, []);

  return (
    <div>
      <BackButton setStep={() => setStep("all_reports")} />

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
              {specificReportDetailsLoading
                ? "Loading..."
                : specificReportDetailsData?.results?.sendToRegulatorsTimeStamp}
            </p>
            <h1 className="leading-[64px] text-darkBlack text-2xl font-bold">
              {specificReportDetailsLoading
                ? "Loading..."
                : specificReportDetailsData?.results?.companyName}
            </h1>
            <div className="mt-[16px] grid grid-cols-5 max-w-[60%]">
              <p className="text-reportGrey  col-span-2 text-[1em] text-base mb-1 font-md">
                Jurisdiction
              </p>
              <p className="text-blackText col-span-3 ml-4 text-[1em] text-base mb-1 font-md">
                {specificReportDetailsLoading
                  ? "Loading..."
                  : specificReportDetailsData?.results?.jurisdiction}
              </p>
              <p className="text-reportGrey col-span-2 text-[1em] text-base mb-1 font-md">
                Sector
              </p>
              <p className="text-blackText col-span-3 ml-4 text-[1em] text-base mb-1 font-md">
                {specificReportDetailsLoading
                  ? "Loading..."
                  : specificReportDetailsData?.results?.sector}
              </p>
              <p className="text-reportGrey col-span-2 text-[1em] text-base mb-1 font-md">
                Annual Revenue
              </p>
              <p className="text-blackText col-span-3 ml-4 text-[1em] text-base mb-1 font-md">
                {specificReportDetailsLoading
                  ? "Loading..."
                  : specificReportDetailsData?.results?.annualRevenue}
              </p>
              <p className="text-reportGrey col-span-2 text-[1em] text-base mb-1 font-md">
                Employees
              </p>
              <p className="text-blackText col-span-3 ml-4 text-[1em] text-base mb-1 font-md">
                {specificReportDetailsLoading
                  ? "Loading..."
                  : specificReportDetailsData?.results?.noOfEmployees}
              </p>
            </div>
          </div>

          {/* Contradiction */}
          <div className="bg-[#F3F5F7] mt-[32px] p-3 rounded-md mb-5">
            <p className="text-reportGrey text-[1em] text-base font-md">
              Contradictions
            </p>
            <p className="text-blackText mt-[8px] text-[1em] text-base  font-md">
              {specificReportDetailsData?.results?.contradiction &&
                specificReportDetailsData?.results?.contradiction
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
              {specificReportDetailsData?.results?.potentialInconsistencies >
                "" &&
                specificReportDetailsData?.results?.potentialInconsistencies
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
              {specificReportDetailsData?.results?.unsubstantiatedClaims &&
                specificReportDetailsData?.results?.unsubstantiatedClaims
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
              {specificReportDetailsData?.results?.sources &&
              JSON?.parse(specificReportDetailsData?.results?.sources)?.length >
                0 ? (
                specificReportDetailsData?.results?.sources &&
                JSON?.parse(specificReportDetailsData?.results?.sources)?.map(
                  (source, index) => {
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
                  }
                )
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
                  (specificReportDetailsData?.results
                    ?.greenwashRiskPercentage &&
                    parseInt(
                      specificReportDetailsData?.results
                        ?.greenwashRiskPercentage
                    )) ||
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
                        parseInt(
                          specificReportDetailsData?.results
                            ?.reportingRiskPercentage
                        )
                          ? "bg-darkGreen"
                          : "bg-reportGrey "
                      }`}
                    ></div>
                  );
                })}
                <p className="text-blackText ml-[8px] text-[1em] text-base font-md">
                  {parseInt(
                    specificReportDetailsData?.results?.reportingRiskPercentage
                  )}
                  %
                </p>
              </div>
              <p className="text-reportGrey  text-[1em] text-base mb-1 font-md">
                GHG emissions
              </p>
              <p className="text-blackText ml-4 text-[1em] text-base mb-1 font-md">
                {specificReportDetailsData?.results?.GHGEmissions}
              </p>
              {specificReportDetailsData?.results?.IPFSHash && (
                <p className="text-reportGrey  text-[1em] text-base mb-1 font-md">
                  Timestamp
                </p>
              )}
              {specificReportDetailsData?.results?.IPFSHash && (
                <p className="col-span-1 ml-4 text-[1em] text-base mb-1 font-md">
                  {specificReportDetailsLoading
                    ? "Loading..."
                    : specificReportDetailsData?.results
                        ?.sendToRegulatorsTimeStamp}
                </p>
              )}
              {/* Links */}
              {specificReportDetailsData?.results?.IPFSHash && (
                <p className="text-reportGrey  text-[1em] text-base mb-1 font-md">
                  IPFS link
                </p>
              )}
              {specificReportDetailsData?.results?.IPFSHash && (
                <a
                  href={`https://ipfs.io/ipfs/${specificReportDetailsData?.results?.IPFSHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-darkGreen col-span-1 truncate ml-4 text-[1em]  mb-1 font-md"
                >
                  {specificReportDetailsData?.results?.IPFSHash}
                </a>
              )}
              {specificReportDetailsData?.results?.etherscanURL && (
                <p className="text-reportGrey  text-[1em] text-base mb-1 font-md">
                  Etherscan URL
                </p>
              )}
              {specificReportDetailsData?.results?.etherscanURL && (
                <a
                  href={specificReportDetailsData?.results?.etherscanURL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-darkGreen truncate ml-4 text-[1em] text-base mb-1 font-md"
                >
                  {specificReportDetailsData?.results?.etherscanURL}
                </a>
              )}
            </div>
          </div>

          <div className="card_shadow mt-8 gap-4 rounded-2xl flex basis-4/12 flex-col z-50 p-[16px]">
            <h2 className="text-[18px] leading-[24px] font-[600]">
              Case Information
            </h2>
            <div className="mt-[16px] grid grid-cols-2 max-w-[370px] gap-2 gap-y-4 my-3 ">
              <p className="text-reportGrey text-[1em] text-base mb-1 font-md">
                Case status
              </p>
              <p className="text-blackText ml-1 text-[1em] text-base mb-1 font-md">
                <span
                  className={`py-1 px-3 text-white rounded-3xl ${
                    specificReportDetailsData?.results?.sentToRegulators ===
                    "true"
                      ? "bg-foggyGrey"
                      : specificReportDetailsData?.results?.reviewing === "true"
                      ? "bg-review"
                      : specificReportDetailsData?.results?.reviewed === "true"
                      ? "bg-darkGreen"
                      : "bg-danger"
                  }`}
                >
                  {console.log(
                    typeof specificReportDetailsData?.results?.sentToRegulators
                  )}
                  {specificReportDetailsData?.results?.sentToRegulators ===
                  "true"
                    ? "Pending Review"
                    : specificReportDetailsData?.results?.reviewing === "true"
                    ? "In review"
                    : specificReportDetailsData?.results?.reviewed === "true"
                    ? "closed"
                    : specificReportDetailsData?.results?.disregard === "true"
                    ? "disregarded"
                    : ""}
                </span>
              </p>
              {specificReportDetailsData?.results?.caseOpenedTimeStamp && (
                <div className="col-span-2">
                  <div className="mt-[16px] grid grid-cols-5 max-w-[370px] gap-2 my-3 ">
                    <p className="text-reportGrey col-span-2 text-[1em] text-base mb-1 font-md">
                      Case Opened
                    </p>
                    <p className="col-span-1 ml-4 col-span-3 text-[1em] text-base mb-1 font-md">
                      John Doe (case file officer)
                    </p>
                    <p className="text-reportGrey col-span-2 text-[1em] text-base mb-1 font-md">
                      Timestamp
                    </p>
                    <p className="col-span-1 ml-4 col-span-3 text-[1em] text-base mb-1 font-md">
                      {specificReportDetailsLoading
                        ? "Loading..."
                        : specificReportDetailsData?.results
                            ?.caseOpenedTimeStamp}
                    </p>
                    {specificReportDetailsData?.results?.assignedTo && (
                      <p className="text-reportGrey col-span-2 text-[1em] text-base mb-1 font-md">
                        Assigned to
                      </p>
                    )}
                    {specificReportDetailsData?.results?.assignedTo && (
                      <p className="col-span-1 ml-4 col-span-3 text-[1em] text-base mb-1 font-md">
                        {specificReportDetailsLoading
                          ? "Loading..."
                          : specificReportDetailsData?.results?.assignedTo}
                      </p>
                    )}
                    {specificReportDetailsData?.results?.comment && (
                      <p className="text-reportGrey col-span-2 text-[1em] text-base mb-1 font-md">
                        Comment
                      </p>
                    )}
                    {specificReportDetailsData?.results?.comment && (
                      <p className="col-span-1 ml-4 col-span-3 text-[1em] text-base mb-1 font-md">
                        {specificReportDetailsLoading
                          ? "Loading..."
                          : specificReportDetailsData?.results?.comment}
                      </p>
                    )}
                  </div>
                  {isEditing && (
                    <div className="p-3 mt-7 mb-5 border-[1px] rounded-lg border-[#b6bdc0] flex flex-col gap-2">
                      <label className="text-[#6C7275]">Case assigned to</label>
                      <input
                        type="text"
                        required
                        name="assignedTo"
                        placeholder="Assigned to..."
                        value={reportAssignCaseData.assignedTo}
                        onChange={handleInputChange}
                        className="border-none focus:outline-none w-full font-semibold"
                      />
                    </div>
                  )}

                  {isEditing && (
                    <div className="p-3 mt-5 mb-5 border-[1px] rounded-lg bg-gray-100 border-[#b6bdc0] flex flex-col gap-2">
                      <label className="text-[#6C7275]">
                        Comment (optional)
                      </label>
                      <input
                        type="text"
                        name="comment"
                        placeholder="Type here..."
                        value={reportAssignCaseData.comment}
                        onChange={handleInputChange}
                        className="border-none focus:outline-none w-full bg-gray-100 font-semibold"
                      />
                    </div>
                  )}
                </div>
              )}
              {!isEditing &&
                specificReportDetailsData?.results?.reviewed === "false" && (
                  <button
                    onClick={() => {
                      // open case
                      if (
                        specificReportDetailsData?.results?.sentToRegulators ===
                        "true"
                      ) {
                        handleChangeStatusCase();
                      } else {
                        handleCloseCase();
                      }
                    }}
                    className={`bg-darkGreen rounded-lg  py-2 px-2 border-none outline-none text-[#fff] text-[16px]`}
                  >
                    {specificReportDetailsData?.results?.sentToRegulators ===
                    "true"
                      ? "Open Case"
                      : "Close Case"}
                  </button>
                )}
              {isEditing &&
                specificReportDetailsData?.results?.reviewed === "false" && (
                  <button
                    onClick={() => {
                      handleAssignCase();
                    }}
                    className={`bg-blackText rounded-lg  py-2 px-2 border-none outline-none text-[#fff] text-[16px]`}
                  >
                    Save
                  </button>
                )}
              {!isEditing &&
                specificReportDetailsData?.results?.reviewed === "false" && (
                  <button
                    onClick={() => {
                      if (
                        specificReportDetailsData?.results?.sentToRegulators ===
                          "false" &&
                        specificReportDetailsData?.results?.reviewing === "true"
                      ) {
                        setisEditing(true);
                      }
                    }}
                    className={`bg-white border ${
                      specificReportDetailsData?.results?.sentToRegulators ===
                      "true"
                        ? "border-danger"
                        : "border-blackText"
                    } rounded-lg  py-2 px-2 ${
                      specificReportDetailsData?.results?.sentToRegulators ===
                      "true"
                        ? "text-danger"
                        : "text-blackText"
                    } text-[16px]`}
                  >
                    {specificReportDetailsData?.results?.sentToRegulators ===
                    "true"
                      ? "Disregard Case"
                      : "Add Update"}
                  </button>
                )}
              {isEditing &&
                specificReportDetailsData?.results?.reviewed === "false" && (
                  <button
                    onClick={() => {
                      setisEditing(false);
                    }}
                    className={`bg-white border border-blackText
                   rounded-lg  py-2 px-2 text-blackText
                    text-[16px]`}
                  >
                    Cancel
                  </button>
                )}
            </div>
          </div>

          <div className="card_shadow mt-8 gap-4 rounded-2xl flex basis-4/12 flex-col z-50 p-[16px]">
            <h2 className="text-[18px] leading-[24px] font-[600]">Documents</h2>
            <div
              onClick={() => {
                alert("coming soon!");
              }}
              className="flex flex-row flex-nowrap justify-start items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-2xl"
            >
              <img src="/assets/xls-icon.svg" alt="xls-icon" />
              <h2 className="text-[18px] leading-[24px] mt-1 font-[600]">
                <span className="truncate">AIB_Group_PLC</span>.xlsx
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificReport;
