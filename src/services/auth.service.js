import axios from "axios";

const API_URL = "http://calculator-env.eba-8niu3zcp.us-east-2.elasticbeanstalk.com/api/auth";

const login = (username, password) => {
  return axios
    .post(API_URL + "/signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  login,
  logout,
};
