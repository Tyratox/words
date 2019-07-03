export const API_URL = "https://words.tyratox.ch";

export const fetchApi = (
  url = "",
  dispatch: any,
  options: { [key: string]: any } = { headers: undefined, body: undefined }
) => {
  if (!options.headers && options.body) {
    options.headers = new Headers();
    options.headers.append("Content-Type", "application/json");
  }

  return fetch(API_URL + url, options).then(response => {
    if (response.status === 401) {
      return dispatch({ type: "LOGOUT_USER" });
    } else {
      return response.json();
    }
  });
};
