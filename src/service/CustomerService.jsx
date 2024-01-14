import axios from "axios";
export const CustomerService = {
  getPermissions() {
    return axios.get("http://localhost:5126/api/Permission");
  },
};
