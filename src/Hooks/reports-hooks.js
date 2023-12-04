import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import ReportService from "../Hooks/reports-hook"
import ReportService from "../Services/reports-services";

const useGetSpecificReportDetails = (id) => {
  return useQuery({
    queryKey: ["getSingleReportDetail"],
    queryFn: () => ReportService.getSpecificReport(id),
  });
};

const useGetAllPendingReports = () => {
  return useQuery({
    queryKey: ["getUpdateSendToRegulators"],
    queryFn: () => ReportService.getAllPendingReports(),
  });
};

const useGetAllUnderReviewReports = () => {
  return useQuery({
    queryKey: ["getAllUnderReviewReports"],
    queryFn: () => ReportService.getAllUnderReviewReports(),
  });
};

const useGetAllReviewedReports = () => {
  return useQuery({
    queryKey: ["getAllReviewedReports"],
    queryFn: () => ReportService.getAllReviewedReports(),
  });
};

const useGetSingleReportDetails = (company) => {
  return useQuery({
    queryKey: ["getSingleReportDetail"],
    queryFn: () => ReportService.getSingleReportDetail(company),
  });
};

const useGetChangeStatusToReview = (company) => {
  // console.log(reportData)
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return ReportService.getChangeStatusToReview(company);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("changeStatusToReview");
      },
    }
  );
};

const useCloseCase = (company) => {
  // console.log(reportData)
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return ReportService.closeCase(company);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("closeCase");
      },
    }
  );
};

const useAssignCase = (reportData) => {
  // console.log(reportData)
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return ReportService.assignCase(reportData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("assignCase");
      },
    }
  );
};

const useUpdateCase = (reportData) => {
  // console.log(reportData)
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return ReportService.updateCase(reportData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("updateCase");
      },
    }
  );
};

export {
  useGetSpecificReportDetails,
  useGetAllPendingReports,
  useGetAllUnderReviewReports,
  useGetAllReviewedReports,
  useCloseCase,
  useGetChangeStatusToReview,
  useAssignCase,
  useUpdateCase,
  useGetSingleReportDetails,
};
