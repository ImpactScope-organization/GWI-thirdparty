import React, { useEffect, useState } from "react";
import BackButton from "../Shared/BackButton";
import { useStepsContext } from "../../Context/StateContext";
import { toast } from "react-toastify";
import {
  useAssignCase,
  useCloseCase,
  useGetSpecificReportDetails,
  useUpdateCase,
} from "../../Hooks/reports-hooks";
import { formattedDate } from "../../utils/date";
import PriorityColor from "./PriorityColor";

// ----------------------------
const ReviewProgress = () => {
  const [showCaseStatusStep1, setShowCaseStatusStep1] = useState(true);
  const [showCaseStatusStep2, setShowCaseStatusStep2] = useState(false);
  const [showCaseStatusStep3Update, setShowCaseStatusStep3Update] =
    useState(false);
  const [showCaseStatusStep4Final, setShowCaseStatusStep4Final] =
    useState(false);
  const { setStep, company, specificReportDetailsID } = useStepsContext();

  // AssignCase
  const [reportAssignCaseData, setReportAssignCaseData] = useState({
    assignedTo: "",
    comment: "",
  });

  const { mutate: addMutate, isLoading } = useAssignCase(
    JSON.stringify({
      ...reportAssignCaseData,
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
            setShowCaseStatusStep1(false);
            setShowCaseStatusStep2(true);
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
        pending: "false",
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

  const {
    data: specificReportDetailsData,
    isLoading: specificReportDetailsLoading,
  } = useGetSpecificReportDetails(specificReportDetailsID);

  console.log("specificReportDetailsData: ", specificReportDetailsData);

  // const allClaim = JSON.parse(specificReportDetailsData?.results?.claims);
  const allClaim = specificReportDetailsData?.results?.claims
    ? JSON.parse(specificReportDetailsData?.results?.claims)
    : null;

  console.log("allClaim: ", allClaim);

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

            {showCaseStatusStep4Final && (
              <img src="./assets/Review__Completed.png" alt="logo" />
            )}

            {(showCaseStatusStep1 ||
              showCaseStatusStep2 ||
              showCaseStatusStep3Update) && (
              <img src="./assets/review__in__progress.png" alt="logo" />
            )}
          </div>
          <h1 className="mb-5 text-[#000] text-2xl font-bold">
            {specificReportDetailsLoading
              ? "Loading..."
              : specificReportDetailsData?.results?.companyName}
          </h1>
          <p className="text-[#6C7275] text-base mb-1 font-semibold">
            Jurisdiction :
            <span className="text-[#000] font-semibold ml-2">
              {" "}
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
            Summary of findings:
          </p>
          <p className="font-semibold">
            {" "}
            {specificReportDetailsLoading
              ? "Loading..."
              : specificReportDetailsData?.results?.contradiction}
          </p>
        </div>

        {/* Stats */}
        <div className="my-7">
          <p className="text-[#6C7275] text-base mb-1">
            Age :
            <span className="text-[#000] font-semibold ml-2">
              {" "}
              {specificReportDetailsLoading
                ? "Loading..."
                : specificReportDetailsData?.results?.age}
            </span>
          </p>

          <p className="text-[#6C7275] text-base mb-3 flex items-center">
            Priority :
            <PriorityColor
              priority={specificReportDetailsData?.results?.priority}
            />
            <span className="text-[#000] font-semibold ml-2">
              {" "}
              {specificReportDetailsLoading
                ? "Loading..."
                : specificReportDetailsData?.results?.priority}
            </span>
          </p>

          <hr className="bg-[#E8ECEF]" />
        </div>

        {/* Claims */}
        <div>
          <p className="text-[#6C7275] font-semibold mb-3">
            Sustainability claims:
          </p>
          {/* <p className="font-semibold text-[#000]">
            In 2019 we made €5 b available for green projects and last year we
            set a target for 70% of our lending to be green by 2030. We also
            became the first Irish bank to pledge to operate as carbon neutral
            by 2030
          </p>
          <p className="text-[#6C7275] text-sm mt-3 font-semibold">
            Data source:
            <span className="text-[#000] font-semibold ml-2">Twitter</span>
          </p> */}

          {/* {Object.entries(allClaim).map(([key, value]) => {
            if (value) {
              return (
                <>
                  <p className="font-semibold text-[#000]">
                    {value.slice(0, 250)}
                    {value.length > 250 && "..."}
                  </p>
                  <p className="text-[#6C7275] text-sm mt-3 font-semibold mb-4">
                    Data source:
                    <span className="text-[#000] font-semibold ml-2 ">
                      {key}
                    </span>
                  </p>
                </>
              );
            }
          })} */}

          {!specificReportDetailsLoading && allClaim ? (
            Object.entries(allClaim).map(([key, value]) => {
              if (value) {
                return (
                  <>
                    <p className="font-semibold text-[#000]">
                      {value.slice(0, 250)}
                      {value.length > 250 && "..."}
                    </p>
                    <p className="text-[#6C7275] text-sm mt-3 font-semibold mb-4">
                      Data source:
                      <span className="text-[#000] font-semibold ml-2 ">
                        {key}
                      </span>
                    </p>
                  </>
                );
              }
            })
          ) : specificReportDetailsLoading ? (
            <p>Loading claims...</p>
          ) : null}

          {/* case status step 1 */}
          {showCaseStatusStep1 && (
            <div className="mt-7">
              <p className="font-semibold text-xl mb-3">Case Status:</p>
              <p className="text-[#6C7275] text-base mb-1 font-semibold">
                Case opened by:
                <span className="text-[#000] font-semibold ml-2">
                  {" "}
                  John Doe (case file officer)
                </span>
              </p>
              <p className="text-[#6C7275] text-base mb-1 font-semibold">
                Timestamp:
                <span className="text-[#000] font-semibold ml-2">
                  {specificReportDetailsLoading
                    ? "Loading..."
                    : specificReportDetailsData?.results?.caseOpenedTimeStamp}
                </span>
              </p>

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

              <div className="p-3 mt-5 mb-5 border-[1px] rounded-lg bg-gray-100 border-[#b6bdc0] flex flex-col gap-2">
                <label className="text-[#6C7275]">Comment (optional)</label>
                <input
                  type="text"
                  name="comment"
                  placeholder="Type here..."
                  value={reportAssignCaseData.comment}
                  onChange={handleInputChange}
                  className="border-none focus:outline-none w-full bg-gray-100 font-semibold"
                />
              </div>
            </div>
          )}

          {/* case status step 2 */}
          {showCaseStatusStep2 && (
            <div className="mt-7">
              <p className="font-semibold text-xl mb-3">Case Status:</p>
              <p className="text-[#6C7275] text-base mb-1 font-semibold">
                Case opened by:
                <span className="text-[#000] font-semibold ml-2">
                  {" "}
                  John Doe (case file officer)
                </span>
              </p>
              <p className="text-[#6C7275] text-base mb-1 font-semibold">
                Case assigned to:
                <span className="text-[#000] font-semibold ml-2">
                  {" "}
                  {specificReportDetailsLoading
                    ? "Loading..."
                    : specificReportDetailsData?.results?.assignedTo}
                </span>
              </p>
              <p className="text-[#6C7275] text-base mb-1 font-semibold">
                Timestamp:
                <span className="text-[#000] font-semibold ml-2">
                  {specificReportDetailsLoading
                    ? "Loading..."
                    : specificReportDetailsData?.results?.caseAssignedTimeStamp}
                </span>
              </p>

              {specificReportDetailsData?.results?.comment && (
                <div className="p-3 mt-5 mb-5 border-[1px] rounded-lg bg-gray-100 border-[#b6bdc0] flex flex-col gap-2">
                  <label className="text-[#6C7275]">Comment (optional)</label>
                  <p className="font-semibold text-[#000]">
                    {specificReportDetailsLoading
                      ? "Loading..."
                      : specificReportDetailsData?.results?.comment}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* case status step 3 Update */}
          {showCaseStatusStep3Update && (
            <>
              {/* Old comment */}
              <div className="mt-7">
                <p className="font-semibold text-xl mb-3">Case Status:</p>
                <p className="text-[#6C7275] text-base mb-1 font-semibold">
                  Case opened by:
                  <span className="text-[#000] font-semibold ml-2">
                    {" "}
                    John Doe (case file officer)
                  </span>
                </p>
                <p className="text-[#6C7275] text-base mb-1 font-semibold">
                  Case assigned to:
                  <span className="text-[#000] font-semibold ml-2">
                    {" "}
                    {specificReportDetailsLoading
                      ? "Loading..."
                      : specificReportDetailsData?.results?.assignedTo}
                  </span>
                </p>
                <p className="text-[#6C7275] text-base mb-1 font-semibold">
                  Timestamp:
                  <span className="text-[#000] font-semibold ml-2">
                    {specificReportDetailsLoading
                      ? "Loading..."
                      : specificReportDetailsData?.results
                          ?.caseAssignedTimeStamp}
                  </span>
                </p>

                {specificReportDetailsData?.results?.comment && (
                  <div className="p-3 mt-5 mb-5 border-[1px] rounded-lg bg-gray-100 border-[#b6bdc0] flex flex-col gap-2">
                    <label className="text-[#6C7275]">Comment</label>
                    <p className="font-semibold text-[#000]">
                      {specificReportDetailsLoading
                        ? "Loading..."
                        : specificReportDetailsData?.results?.comment}
                    </p>
                  </div>
                )}
                <hr className="bg-[#E8ECEF]" />
              </div>

              {/* Updated Comment */}

              <div className="mt-7">
                <p className="font-semibold text-xl mb-3">Update #1:</p>
                <p className="text-[#6C7275] text-base mb-1 font-semibold">
                  Updated by:
                  <span className="text-[#000] font-semibold ml-2">
                    {" "}
                    John Doe (case file officer)
                  </span>
                </p>

                <p className="text-[#6C7275] text-base mb-1 font-semibold">
                  Timestamp:
                  <span className="text-[#000] font-semibold ml-2">
                    {formattedDate}
                  </span>
                </p>

                <div className="p-3 mt-5 mb-5 border-[1px] rounded-lg bg-gray-100 border-[#b6bdc0] flex flex-col gap-2">
                  <label className="text-[#6C7275]">Comment </label>
                  <input
                    type="text"
                    required
                    name="updatedComment"
                    placeholder="Type here..."
                    value={updateReportComment}
                    onChange={(e) => setUpdateReportComment(e.target.value)}
                    className="border-none focus:outline-none bg-gray-100 w-full font-semibold"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Button */}

        {showCaseStatusStep1 && (
          <div className="mt-7">
            <button
              // onClick={handleOpenCaseStep1}
              onClick={() => {
                handleAssignCase();
              }}
              className="bg-[#3FDD78] rounded-lg  py-2 px-3 border-none outline-none text-[#fff] "
            >
              {isLoading ? "Assigning..." : "Save"}
            </button>
          </div>
        )}

        {showCaseStatusStep2 && (
          <div className="mt-7 flex justify-start items-center gap-5">
            <button
              onClick={handleCloseCase}
              className="bg-[#3FDD78] rounded-lg  py-2 px-3 border-none outline-none text-[#fff] "
            >
              {closeCaseLoading ? "Closing..." : "Close case"}
            </button>
            <button
              onClick={() => {
                setShowCaseStatusStep3Update(true);
                setShowCaseStatusStep2(false);
                setShowCaseStatusStep1(false);
              }}
              className="bg-[#000] rounded-lg  py-2 px-3 border-none outline-none text-[#fff] "
            >
              Add Update
            </button>
          </div>
        )}

        {showCaseStatusStep3Update && (
          <div className="mt-7 flex justify-start items-center gap-5">
            <button
              onClick={handleUpdateCase}
              className="bg-[#3FDD78] rounded-lg  py-2 px-3 border-none outline-none text-[#fff] "
            >
              {updateCaseLoading ? "Saving..." : " Save"}
            </button>
            <button
              onClick={() => {
                setShowCaseStatusStep3Update(false);
                setShowCaseStatusStep2(true);
                setShowCaseStatusStep1(false);
              }}
              className="bg-[#000] rounded-lg  py-2 px-3 border-none outline-none text-[#fff] "
            >
              Cancel
            </button>
          </div>
        )}

        {showCaseStatusStep4Final && (
          <div className="mt-7">
            <button
              onClick={handleCloseCase}
              className="bg-[#3FDD78] rounded-lg  py-2 px-3 border-none outline-none text-[#fff] "
            >
              {closeCaseLoading ? "Closing..." : "Close case"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewProgress;
