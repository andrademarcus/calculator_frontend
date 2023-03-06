import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://truenorthcalculator-env.eba-3pmpvwpz.us-west-2.elasticbeanstalk.com/api/v1/operations";

const getOperations = () => {
  return axios.get(API_URL + "/all", { headers: authHeader() });
};

const newOperation = (operationType, number1, number2) => {
  var data = {
    'operationType': operationType,
    'number1': number1,
    'number2': number2,
  };
  return axios.post(API_URL + "/calculator", data, { headers: authHeader() })
    .then((response) => {
      return response.data;
    });
};

export default {
  getOperations,
  newOperation
};