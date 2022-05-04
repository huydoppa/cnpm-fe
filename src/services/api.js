import request from "./request";

let api = {}

let path = {
  login: '/admin/login',
}

Object.keys(path).forEach(function (key) {
  api[key] = async function (data) {
    let result = await request.request(path[key], data);
    return result;
  };
}, this);

export default api;