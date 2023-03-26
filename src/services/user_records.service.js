import axios from "axios";
import authHeader from "./auth-header";
import moment from "moment";

const API_URL = "http://localhost:8080/api/v1/userRecord";

const getUserRecords = (page, pageSize, startDate, endDate, sortBy, sortDirection) => {
  let url = API_URL + "/findAll?page=" + page + "&pageSize=" + pageSize + "&sortBy=" + sortBy + "&sortDirection=" + sortDirection;
  if (startDate) {
    url += "&startDate=" + moment(startDate).format("MM/DD/YYYY");
  }
  if (endDate) {
    url += "&endDate=" + moment(endDate).format("MM/DD/YYYY");
  }
  return axios.get(url, { headers: authHeader() });
};

const deleteUserRecord = (id) => {
  return axios.delete(API_URL + "/delete/" + id, { headers: authHeader() });
};

export default {
  getUserRecords,
  deleteUserRecord
};