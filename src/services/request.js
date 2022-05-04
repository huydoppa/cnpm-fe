let request = {};
request.upload = async (formData, method = 'POST') => {
  let option = {
    method: method,
    body: formData,
    headers: {
      'Authorization': `${JSON.parse(sessionStorage.getItem('session')) || 'customer'}`,
    }
  };
  let res = await fetch(process.env.REACT_APP_BE_URL + '/admin/uploadImage', option);
  let rs = await res.json();
  return rs;
}
request.request = async (url, data, method = 'POST') => {
  let option = {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `${JSON.parse(sessionStorage.getItem('session')) || 'customer'}`,
    }
  };
  if (method === 'GET') delete option.body;
  let res = await fetch(process.env.REACT_APP_BE_URL + url, option);
  let rs = await res.json();
  if (Array.isArray(rs)) rs = { data: rs };
  if (res.status !== 200) rs.e = 1
  else rs.e = 0
  return rs
}
export default request;