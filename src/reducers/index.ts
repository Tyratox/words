import { combineReducers } from "redux";
import { LoginAction, LogoutAction } from "../actions/authentication";

type Action = LoginAction | LogoutAction;

const appReducer = combineReducers({
  authenticationToken: (state: string | null = null, action: Action) => {
    switch (action.type) {
      case "LOGIN_USER":
        return (
          !action.isFetching && !action.error && action.authenticationToken
        );
      /*case "LOGOUT_USER":
                    return false*/
    }

    return state;
  },
  isAuthenticated: (state: boolean = false, action: Action) => {
    switch (action.type) {
      case "LOGIN_USER":
        return !action.isFetching && !action.error && action.authenticationToken
          ? true
          : false;
      /*case "LOGOUT_USER":
                return false*/
    }

    return state;
  }
});

const rootReducer = (
  state: { [key: string]: any },
  action: { [key: string]: any }
) => {
  switch (action.type) {
    case "LOAD_STATE":
      return action.state;
    case "LOGOUT_USER":
      state = undefined;
      break;
  }

  // @ts-ignore
  return appReducer(state, action);
};

export default rootReducer;
