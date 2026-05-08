const API = {
  // tech lib
  GAD: {
    DashboardData: "/ILeap/GetGADDataSheetPaginated",
    GadCreateReq: "/ILeap/CreateGADRequest",
    ReferenceNumberList: "/ILeap/GetGADReferenceNumberBySearch",
    GetRequestNo: "/ILeap/GetNextGADRequestNo",
    AddVendors: "/ILeap/CreateGADVendorInfo",
    GadApprove: "/ILeap/GADApproveByApprover",
  },

  ProjectProfitability: {
    GetPendingProjects: "/ILeap/GetPendingProjects",
    GetProjectDetails: "/ILeap/GetProjectDetails",
    SaveProjectProfitability: "/ILeap/SaveProjectProfitability",
    GetPaginatedProjects: "/ILeap/GetPaginatedProjects",
    GetEstimatedProfitability: "/ILeap/GetEstimatedProfitability",
    GetMaterialCosts: "/ILeap/GetMaterialCosts",
    UpdateBudgetedCosts: "/ILeap/UpdateBudgetedCosts",
  },

  Helpdesk: {
    GetHDCatalog: "/ILeap/GetHDCatalog",
  },

  // common
  FileDownload: {
    DownloadFile: "/ILeap/DownloadFile",
  },
};

export default API;
