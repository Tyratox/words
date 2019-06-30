import { Action as ReduxAction } from "redux";

export interface Action extends ReduxAction<string> {
  isFetching?: boolean;
  error?: Error | null;
}
