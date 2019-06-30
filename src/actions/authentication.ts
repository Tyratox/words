import { Action } from ".";
import { fetchApi } from "../utilities/api";

export interface LoginAction extends Action {
  type: "LOGIN_USER";
  authenticationToken: null | string;
}

export const createLoginAction = (
  isFetching: boolean,
  error: Error | null,
  authenticationToken: null | string
): LoginAction => ({
  type: "LOGIN_USER",
  isFetching,
  error,
  authenticationToken
});

export interface LogoutAction extends Action {
  type: "LOGOUT_USER";
}

export const createLogoutAction = (): LogoutAction => ({ type: "LOGOUT_USER" });

export const login = (name, email, locale = "de-CH") => dispatch => {
  dispatch(createLoginAction(true, null, null));

  return fetchApi("/login", {
    headers: undefined,
    method: "POST",
    body: JSON.stringify({ name, email, locale })
  }).then(response => {
    if (response.success) {
      dispatch(createLoginAction(false, null, null));
      return Promise.resolve();
    } else {
      dispatch(createLoginAction(false, response, null));
      return Promise.reject();
    }
  });
};
