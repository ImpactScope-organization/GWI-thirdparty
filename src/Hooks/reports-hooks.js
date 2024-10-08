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

const useDisregardCase = () => {
  // console.log(reportData)
  const queryClient = useQueryClient();
  return useMutation(
    (body) => {
      return ReportService.disregardCase(body);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("assignCase");
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
  useDisregardCase,
};
