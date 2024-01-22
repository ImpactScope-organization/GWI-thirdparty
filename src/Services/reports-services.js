import axios from "axios";
import apiUrl from "../utils/baseURL";

class ReportService {
  /**
   * getSingleReportDetail
   * @returns
   */
  async getSpecificReport(id) {
    const { data } = await axios.get(
      `${apiUrl}/api/report/getSingleReportDetail/${id}`
    );
    return data;
  }

  /**
   * getAllPendingReports
   * @returns
   */

  async getAllPendingReports() {
    const { data } = await axios.get(
      `${apiUrl}/api/report/getUpdateSendToRegulators`
    );
    return data;
  }

  /**
   * getAllUnderReviewReports
   * @returns
   */
  async getAllUnderReviewReports() {
    const { data } = await axios.get(
      `${apiUrl}/api/report/getAllUnderReviewReports`
    );
    return data;
  }

  /**
   * getAllReviewedReports
   * @returns
   */
  async getAllReviewedReports() {
    const { data } = await axios.get(
      `${apiUrl}/api/report/getAllReviewedReports`
    );
    return data;
  }

  /**
   * getChangeStatusToReview
   * @returns
   */
  async getChangeStatusToReview(company) {
    const res = await axios.put(
      `${apiUrl}/api/report/changeStatusToReview`,
      company,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  }

  /**
   * getChangeStatusToReview
   * @returns
   */
  async closeCase(company) {
    const res = await axios.put(`${apiUrl}/api/report/closeCase`, company, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  }

  /**
   * assignCase
   * @returns
   */
  async assignCase(reportData) {
    // console.log("Hello");
    const res = await axios.put(`${apiUrl}/api/report/assignCase`, reportData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  }

  /**
   * disregardCase
   * @returns
   */
  async disregardCase(reportData) {
    // console.log("Hello");
    const res = await axios.put(
      `${apiUrl}/api/report/disregardCase`,
      reportData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  }

  /**
   * updateCase
   * @returns
   */
  async updateCase(reportData) {
    // console.log("Hello");
    const res = await axios.put(`${apiUrl}/api/report/updateCase`, reportData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  }

  /**
   * getSingleReportDetail
   * @returns
   */
  async getSingleReportDetail(company) {
    const { data } = await axios.get(
      `${apiUrl}/api/report/getSingleReportDetail?company=${company}`
    );
    return data;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ReportService();
