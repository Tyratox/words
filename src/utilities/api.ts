export const API_URL = "https://words.tyratox.ch";

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
