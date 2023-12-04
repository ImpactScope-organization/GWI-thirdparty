import React, { useRef, useState } from "react";
import BackButton from "../Shared/BackButton";
import { useStepsContext } from "../../Context/StateContext";
import { toast } from "react-toastify";
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
  const [showCaseStatusStep0, setShowCaseStatusStep0] = useState(true);
  const [showCaseStatusStep1, setShowCaseStatusStep1] = useState(false);
  const [showCaseStatusStep2, setShowCaseStatusStep2] = useState(false);
  const [showCaseStatusStep3Update, setShowCaseStatusStep3Update] =
    useState(false);
  const [showCaseStatusStep4Final, setShowCaseStatusStep4Final] =
    useState(false);
  const { setStep, company, specificReportDetailsID } = useStepsContext();

  // useGetChangeStatusToReview;
  const {
    mutate: addMutateChangeStatusToReview,
    isLoading: changeStatusLoading,
  } = useGetChangeStatusToReview(
    JSON.stringify({
      company,
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
            setShowCaseStatusStep0(false);
            setShowCaseStatusStep1(true);
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

  //   {
  //     "_id": "656ca5816ea5f76048fb5b27",
  //     "companyName": "AIB Group PLC",
  //     "jurisdiction": "Ireland",
  //     "sector": "Financials",
  //     "noOfEmployees": "Approx. 79,000",
  //     "dataSources": "Company, Claims, file, generatedReport",
  //     "contradiction": "1. While AIB Group claims to have made significant progress in green lending, allocating 7.9bn by the end of 2022, there is no further details on what specific initiatives these funds have been directed towards or their impacts, which could indicate greenwashing.\n2. AIB Group reports a 40% reduction in absolute Scope 1 and 2 GHG emissions from a 2019 baseline, but does not provide any detailed information or measures on how they effectively achieved this reduction.\n3. AIB encourages their suppliers to report carbon emissions through the Carbon Disclosures Project, but out of 98 suppliers, only 66 responded, raising questions about their transparency and compliance on environmental impact.",
  //     "unsubstantiatedClaims": "1. Claim: \"As at 31 December 2022 we have allocated 7.9bn in green lending, reflecting our strong progress in supporting Ireland's transition to a low-carbon economy, and demonstrating that we are on track to deliver the SMART target by 2023.\"\n   Unsubstantiated because: The firm does not provide any factual details about how this green lending is exactly contributing to a lower carbon economy, nor it explains what exactly the SMART targets entail.\n\n2. Claim: \"In 2022 the number of suppliers who requested to participate in reporting to CDP increased by 9% to 98, and the number of suppliers submitting responses increased by 12 to 66.\"\n   Unsubstantiated because: Though the company claims an increase in suppliers reporting to CDP, it doesn't provide any specific data or outcomes on the improvements or impacts brought about by this reporting.\n\n3. Claim: \"By 2022 we have already delivered a 40% reduction in absolute Scope 1 and 2 GHG emissions from a 2019 Baseline of 14,808 tCO2e.\"\n   Unsubstantiated because: The report does not provide any outline of the methodologies involved, or the measures taken to achieve this significant reduction, raising questions about the validity of the claim.",
  //     "potentialInconsistencies": "1. AIB Group PLC highlights the increase in suppliers engaging with the CDP, but this does not necessarily indicate a reduction in their suppliers' carbon emissions.\n2. The company reports a 40% reduction in GHG emissions, but does not specify the extent of its overall carbon footprint, which could indicate selective disclosure.\n3. There's an ambiguity in the target of financing new green lending and its alignment with SDG 13 as the company does not provide information on the emission reductions resulting from these investments.",
  //     "sources": "[{\"title\":\"AIB Group PLC\",\"description\":\"As at 31 December 2022 we have allocated 7.9bn in green lending, reflecting our strong progress in supporting Irelands transition to a low-carbon economy, and demonstrating that we are on track to deliver the SMART target by 2023.\"},{\"title\":\"AIB Group PLC\",\"description\":\"We encourage our suppliers to report their carbon emissions through the CDP (CarbonDisclosures Project). In 2022 the number of suppliers who requested to participate in reporting to CDP increased by 9% to 98, and the number of suppliers submitting responses increased by 12 to 66\"},{\"title\":\"AIB Group PLC\",\"description\":\"AIB’s climate SMART target is to finance new green lending to support the transition to a lowcarbon economy and is aligned to SDG 13 ‘Climate Action’, where ‘CO2 emissions per capita’ is a key metric. In a national context the Climate Action and Low Carbon Development Bill 2021 requires a 51% reduction in national GHG emissions by 2030 and for Ireland to achieve Net Zero by 2050.\"},{\"title\":\"AIB Group PLC\",\"description\":\"In 2020 we announced our target of Net Zero in our operations by 2030. Our property strategy and energy efficiency investments have been instrumental in Reducing our GHG emissions to date. By 2022 we have already delivered a 40% reduction in absolute Scope 1 and 2 GHG emissions from a 2019 Baseline of\\n14,808 tCO2e\"},{\"title\":\"AIB Group PLC\",\"description\":\"Our carbon reporting is aligned with our financial reporting. Our Scope 1 & 2 emissions for 2022 are 8,924\\ntCO2e. Verification was based on data extrapolation to account for the 12 months of the reporting period.\\nFor further information see our verification report. Scope 3 emissions are reported one year in arrears.\"}]",
  //     "greenwashRiskPercentage": "35",
  //     "reportingRiskPercentage": "56.66666666666667",
  //     "GHGEmissions": "14,808 tCO2",
  //     "IPFSHash": "QmasJ6ZUvQMPJHupZ7SrGMADPAX8hr2bcioTgEN4eqadQG",
  //     "etherscanURL": "https://sepolia.etherscan.io/tx/0xc272bf06187a4b5120af80c2e69a6cad8bfc9625fc40ee66a079ecfef10ea78f",
  //     "age": "Recent",
  //     "priority": "Low",
  //     "sentToRegulators": "true",
  //     "pending": "false",
  //     "reviewing": "false",
  //     "reviewed": "false",
  //     "disregard": "false",
  //     "claims": "[{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2022,\"Description\":\"As at 31 December 2022 we have allocated 7.9bn in green lending, reflecting our strong progress in supporting Irelands transition to a low-carbon economy, and demonstrating that we are on track to deliver the SMART target by 2023.\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2022,\"Description\":\"We encourage our suppliers to report their carbon emissions through the CDP (CarbonDisclosures Project). In 2022 the number of suppliers who requested to participate in reporting to CDP increased by 9% to 98, and the number of suppliers submitting responses increased by 12 to 66\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2022,\"Description\":\"AIB’s climate SMART target is to finance new green lending to support the transition to a lowcarbon economy and is aligned to SDG 13 ‘Climate Action’, where ‘CO2 emissions per capita’ is a key metric. In a national context the Climate Action and Low Carbon Development Bill 2021 requires a 51% reduction in national GHG emissions by 2030 and for Ireland to achieve Net Zero by 2050.\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2022,\"Description\":\"In 2020 we announced our target of Net Zero in our operations by 2030. Our property strategy and energy efficiency investments have been instrumental in Reducing our GHG emissions to date. By 2022 we have already delivered a 40% reduction in absolute Scope 1 and 2 GHG emissions from a 2019 Baseline of\\n14,808 tCO2e\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2022,\"Description\":\"Our carbon reporting is aligned with our financial reporting. Our Scope 1 & 2 emissions for 2022 are 8,924\\ntCO2e. Verification was based on data extrapolation to account for the 12 months of the reporting period.\\nFor further information see our verification report. Scope 3 emissions are reported one year in arrears.\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2022,\"Description\":\"Delivered €3.3bn of green lending against our agreed\\n€10bn climate action fund, supporting our customers in\\ntheir transition to a low-carbon future.\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2022,\"Description\":\"AIB has limited exposure to fossil fuels with <1% with less than of the loan book classified as fossil fuels (where a company is included as fossil fuels if more than 5% of revenues come from those activities\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Financial Report\",\"Year\":2022,\"Description\":\" In July, we provided a cornerstone investment of 30m to a new SME fund to back businesses accelerating Irelands transition towards a low-carbon econom\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Financial Report\",\"Year\":2022,\"Description\":\"Our property strategy and energy efficiency investments have resulted in 40% reduction in GHG emissions\\nagainst our Net Zero target\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Financial Report\",\"Year\":2022,\"Description\":\"A Corporate Power Purchase Agreement (CPPA) contract was signed with NTR plc to source renewable energy generated from two solar farms in Ireland which is expected to remove c. 80% of our Scope 2 emissions. This partnership will help deliver on our commitment to source 100%\\nof our power requirements from certified renewable energy sources by 2030.\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2019,\"Description\":\" reduce carbon emissions by 50% by 2030 • 1.5m Active digital customers • 1.3m Active on mobile app • Over 26k business customer migrated to improved Internet Banking platform • Completed the roll-out of the Express Mortgage Journey • Early warning indicators introduced for customers and ongoing work with debt advocacy groups • Remote account opening process expanded and now available to students and graduates • 32 Brexit advisors, nationwide Brexit seminars and 15,421 Brexit ready checks completed • Enhanced supports for Vulnerable Customers and c. 4,800 employees completed new training • 7,500\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2019,\"Description\":\", recording our progress and confrming that we are on track with the Low Carbon Pledge commitment to reduce our Scope 1 and 2 carbon emissions by 50%, by 2030. The pledge is a commitment by Irish businesses to invest time and resources into creating more sustainable operations – by being more energy- efcient and reducing carbon emissions. The Low Carbon Pledge is powered by the Leaders’ Group on Sustainability. The Group believes Irish industry will have a greater impact on sustainability by working together, sharing best practice in energy efciency, by pooling resources and exchanging data – to help\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2019,\"Description\":\" us improve our energy usage and that of our clients, supply chain and the communities in which we operate. WE ARE ON TRACK WITH THE LOW CARBON PLEDGE’S COMMITMENT TO REDUCE OUR DIRECT CARBON EMISSIONS BY 50%, BY 2030 We are committed to backing farmers with the help they need to grow sustainable businesses and we decided to bring a message of sustainability and grass management to farmers in a unique and way. We partnered with Teagasc to identify the 10 key steps towards maximising sustainability in farming resulting in better output and increased proftability. And we’ve delivered these in the\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Twitter\",\"Year\":2023,\"Description\":\"The latest AIB Sustainability Survey reveals that when considering high impact actions to reduce their carbon footprint, Irish people are most likely to choose renewable energy sources and reduce the number of flights they are taking.\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Twitter\",\"Year\":2022,\"Description\":\"The world around us is fragile, so We Pledge to Do More.\\nAt AIB, we’re helping Ireland upgrade to greener homes and businesses with our €10 billion climate action fund.\\nVisit AIB Sustainability to learn more 👉 aib.ie/sustainability\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Twitter\",\"Year\":2021,\"Description\":\"In 2019 we made €5 bn available for green projects and last year we set a target for 70% of our lending to be green by 2030. We also became the first Irish bank to pledge to operate as carbon neutral by 2030. So far this year we have lent €913m to support green projects\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2021,\"Description\":\" business to accelerate our understanding, strengthen our strategy and clarify our actions. We’re reducing our own carbon footprint and commit to being Net Zero by 2030. We’re supporting our customers and communities in their transition to a low-carbon economy with an ambition that green and transition products will account for 70% of all our new lending by 2030. We recognise the responsibility that comes with the scale and impact of our business. We aspire to contribute and advocate for a fairer society that is socially and economically inclusive. We do this by investing and raising awareness in\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2021,\"Description\":\" overall risk management. Continue reviewing the operational risk processes to embed ESG considerations further, including supplier management. Continue to evolve our credit risk frameworks to incorporate climate risk. METRICS & TARGETS - THE METRICS AND TARGETS USED TO ASSESS AND MANAGE RELEVANT CLIMATE-RELATED RISKS AND OPPORTUNITIES WHERE SUCH INFORMATION IS MATERIAL Disclose the metrics used by the organisation to assess climate- related risks and opportunities in line with its strategy and risk management process. We continued to develop and enhance capabilities to measure our carbon\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2021,\"Description\":\" footprint in relation to our own operational footprint as well as fnanced emissions: Progress made on 2020 climate ambition announcements including: • 19% reduction in Scope 1 & 2 emissions year-on-year for 2021 • €2bn of green fnancing accounting for 19% of new lending (excludes transition fnance) • Issuance of second Green Bond - €750m • Tendering for a power purchase agreement for 100% certifed solar renewable energy • Climate Action lending target doubled from €5bn over 5 years to €10bn in same period. • Emission reduction targets set for a number of key sectors (Residential Mortgages, Commercial\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2021,\"Description\":\" the end of 2019. We have a stated clear ambition for 70% of our new lending to be green or transition by 2030 and have a target to achieve Net Zero in our fnanced emissions by 2040 for our lending portfolio (2050 including Agriculture). We are fundamentally committed to supporting the transition to a low-carbon economy, reducing our own carbon footprint and helping our customers to do the same. AIB is a supporter of the Financial Stability Board’s Task Force on Climate-related Financial Disclosures (TCFD) and this is our second year of disclosure aligning to the TCFD recommendations. AIB has\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2021,\"Description\":\" emissions by 22%. In Scope 2, location-based emissions reductions, 23%, were linked to the implementation of energy-efcient initiatives. Our carbon pathway for Scope 1 & 2 emissions shows a 71% reduction from 2009 – 2021. AIB’s full carbon footprint is one year behind our fnancial reporting year. For 2020, our total GHG emissions were 23,527 TCO2e (location-based). Scope 1 emissions contributed to 18% of our carbon footprint, Scope 2 to 32% and Scope 3 to 50% of emissions. Year-on-year (2020 v 2019), we reduced our combined Scope 1, 2 and 3 emissions by 20%. Category 15 emissions have not been\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2021,\"Description\":\"reported in line with the GHG Protocol and independently verifed by ECOACT in line with the International Standard Organisation’s (ISO) 14064-3:2019 specifcation. We disclose our GHG emissions annually - see p.106-108 for the details. AIB have been consistently reducing its operational carbon emissions over the past 13 years. We’re reducing our own carbon footprint and in 2020 we set out our ambition to become Net Zero in our operations by 2030. Annually we produce an inventory of the greenhouse gas (GHG) emissions generated from our activities. Over the past 5 years we have focused on expanding\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2021,\"Description\":\" Scope 3 emission sources to include Employee commuting, Hotel Stays, Well-to-Tank, Transport & Distribution and in 2021 emissions from our Data centres were added. This is used to calculate our carbon footprint. In 2021, with the aim to deliver our Net Zero goal we worked on developing our low carbon operational strategy and we undertook a study to identify high emitting activities, carbon-intensive premises and areas of focus (cooling, heating, feet, etc). The fndings allowed us to inform our Property Strategy and to establish a pathway to reach Net Zero. In 2021 we invested in a software\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2021,\"Description\":\" annually. Alongside these more modern and efcient buildings, we are continuously improving our existing branch & ofce building estate to reduce its energy consumption and carbon footprint. A range of measures include upgrading fuorescent type lighting systems to modern LED lighting including controls. To date 51 branches and 2 head ofce buildings have been upgraded. Expected completion date for the remaining locations is 2024. Similarly, there is a replacement of older less efcient air conditioning systems and installation of small controls items across the branch network. AIB has moved to a thin\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2021,\"Description\":\" investing in energy efcient housing, and supports the reduction of CO2 emissions associated with the national housing stock. A Mortgage Top-Up is designed to support customers who want to invest in improving the energy efciency of their housing, again helping our customers reduce their carbon footprint. For more information on Green mortgages see p.36. Mortgage products are managed by a dedicated team in Retail Banking and a network of advisors in our branches support the delivery of our mortgages, as well as other fnancial products and services. Customer-facing employees involved in the\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2021,\"Description\":\" predominantly), the US or Northern Ireland are located in a region of high/extremely high water stress. The tool is available at https://www.wri.org/applications/aqueduct/water-risk-atlas/ 3. The AIB carbon footprint was calculated using The Greenhouse Gas Protocol: A Corporate Accounting and Reporting Standard, Revised Edition (the GHG Protocol); the UK Government’s emission conversion factors for greenhouse gas company reporting; the International Energy Agency electricity emissions factors and other emissions factors as required. 4. We have adopted the operational control approach on reporting\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2021,\"Description\":\"energy company whose revenues are derived solely from the production and distribution of solar energy Loan is used to fnance specifc activity which is defned in the list of projects/ activities listed as “green” in the framework and meet eligibility criteria. » A loan for upgrading the energy efciency of vehicle feets Loan used to fnance a company which is able to demonstrate a credible and measurable plan to transition to low carbon/carbon neutral. » A dairy farm that has plans to introduce carbon reducing technologies » A energy company that has a plan to transition from fossil to renewable\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2022,\"Description\":\" for our Financed Emissions, are set out page 26 of this report. We intend to commence reporting on our progress against these targets in our FY2023 reporting. We monitor and regularly report on our Greenhouse Gas (GHG) Emissions for our own operations. Net zero target Scope 1 and 2 GHG emissions TCO2e In 2020 we announced our target of Net Zero in our operations by 2030. Our property strategy and energy efficiency investments have been instrumental in reducing our GHG emissions to date. By 2022 we have already delivered a 40% reduction in absolute Scope 1 and 2 GHG emissions from a 2019\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Sustainability Report\",\"Year\":2022,\"Description\":\" Baseline of 14,808 TCO2e: For more detail on our GHG Emissions, see ESG Supporting Data on page 99. We also report on the energy we consume in our business, the water we use and the waste we generate (see page 100). Notes: It should be noted that the approach to setting Financed Emissions Targets and associated data collection is still evolving and is subject to change over time. As such, the figures disclosed may evolve in line with industry best practice. AIB Group plc's portfolio targets cover 36% of its total investment (Balance Sheet) and lending activities as of 2021. Within its loan\"},{\"Company\":\"AIB Group plc\",\"Jurisdiction\":\"Ireland\",\"Data source\":\"Annual Report\",\"Year\":2020,\"Description\":\") exclude well-to-tank emissions. These are the upstream emissions associated with extracting, refning and transporting fuel/energy to the end-user. Total well-to-tank emissions are 5,512 tonnes of COe. 1. Our CO2 emissions are reported one year in arrears. Emissions reported in 2020 were generated in 2019. This saving is equivalent to the emissions avoided from return fights from Dublin to London! 17,883 For more details, see our Sustainability Report 2020, which is available on our website: aib.ie/sustainability AIB and our people have a long history of fundraising, both locally and nationally\"}]",
  //     "sendToRegulatorsTimeStamp": "Dec 3, 2023, 04:08:10 PM GMT+5",
  //     "__v": 0
  // }
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
            <h1 className="leading-[64px] text-[#000] text-2xl font-bold">
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
                <a className="col-span-1 ml-4 text-[1em] text-base mb-1 font-md">
                  {specificReportDetailsLoading
                    ? "Loading..."
                    : specificReportDetailsData?.results
                        ?.sendToRegulatorsTimeStamp}
                </a>
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
                <span className="py-1 px-3 rounded-3xl bg-foggyGrey">
                  Pending Review
                </span>
              </p>
              <button
                // onClick={() => captureScreen("report-container")}
                className="bg-darkGreen  rounded-lg  py-2 px-2 border-none outline-none text-[#fff] text-[16px]"
              >
                Open Case
              </button>
              <button
                onClick={() => alert("Coming Soon!")}
                className="bg-white border border-danger rounded-lg  py-2 px-2 text-danger text-[16px]"
              >
                Disregard Case
              </button>
            </div>
          </div>

          <div className="card_shadow mt-8 gap-4 rounded-2xl flex basis-4/12 flex-col z-50 p-[16px]">
            <h2 className="text-[18px] leading-[24px] font-[600]">Documents</h2>
            <div className="flex flex-row flex-nowrap justify-start items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-2xl">
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
