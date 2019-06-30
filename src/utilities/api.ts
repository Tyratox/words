const API_URL = "http://192.168.178.119:4000";

export const fetchApi = (
  url = "",
  options: { [key: string]: any } = { headers: undefined, body: undefined }
) => {
  if (!options.headers && options.body) {
    options.headers = new Headers();
    options.headers.append("Content-Type", "application/json");
  }

  return fetch(API_URL + url, options).then(response => response.json());
};
