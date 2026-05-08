import APIHelper from "../../context/ApiHelper.js";
import API from "../../constants/API.js";

const HelpdeskService = {
  GetHDCatalog: async () => {
    // fetch commercial invoice data based on invoice number
    try {
      const response = await APIHelper("POST", API.Helpdesk.GetHDCatalog);
      return response;
    } catch (error) {
      console.error("Error fetching HD Catalog data:", error);
      throw error;
    }
  },
};

export default HelpdeskService;
