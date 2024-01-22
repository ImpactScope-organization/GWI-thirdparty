import React from "react";
import { useStepsContext } from "../Context/StateContext";
import AllReports from "../Components/Reports/AllReports";
import SpecificReport from "../Components/Reports/SpecificReport";
// import ReviewCompleted from "../Components/Reports/ReviewCompleted";
// import ReviewProgress from "../Components/Reports/ReviewProgress";

const Reports = () => {
  const { step } = useStepsContext();

  return (
    <div>
      {/* <AllReports /> */}
      {step === "all_reports" && <AllReports />}
      {step === "specific_report" && <SpecificReport />}
      {step === "review_progress" && <SpecificReport />}
      {step === "review_completed" && <SpecificReport />}
    </div>
  );
};

export default Reports;
