import React from "react";
import { createStore, applyMiddleware } from "redux";
import { connect, Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createAppContainer } from "react-navigation";
import throttle from "lodash/throttle";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { AsyncStorage, Alert } from "react-native";
import moment from "moment";
import "moment/locale/de";

import reducers from "./src/reducers";
import AppNavigator from "./src/components/AppNavigator";
import { COLOR_PRIMARY } from "./src/styles";
import Welcome from "./src/containers/Welcome";
import { API_URL } from "./src/utilities/api";
import LoadingView from "./src/components/LoadingView";
import { createLogoutAction } from "./src/actions/authentication";

moment.locale("de");

const AppContainer = createAppContainer(AppNavigator);
const WelcomeContainer = createAppContainer(Welcome);

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

const httpLink = new HttpLink({ uri: API_URL + "/graphql" });
const authLink = setContext((_, { headers }) => {
  // get the authentication token if it exists
  const token = store.getState().authenticationToken;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key, value) =>
      key === "__typename" ? undefined : value;
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename
    );
  }
  return forward(operation).map(data => {
    return data;
  });
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    /*graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );*/
  }

  if (networkError) {
    // console.log(`[Network error]: ${networkError}`);
    if (networkError.statusCode === 401) {
      store.dispatch(createLogoutAction());
    }
  }
});

const link = ApolloLink.from([cleanTypeName, errorLink, authLink, httpLink]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

store.subscribe(
  throttle(() => {
    const { user, authenticationToken, isAuthenticated } = store.getState();

    AsyncStorage.setItem(
      "state",
      JSON.stringify({ user, authenticationToken, isAuthenticated })
    );
  }, 5000)
);

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      stateLoaded: false
    };

    AsyncStorage.getItem("state").then(value => {
      if (value !== null) {
        const state = JSON.parse(value);
        store.dispatch({ type: "LOAD_STATE", state });
      }
      this.setState({ stateLoaded: true });
    });
  }

  render() {
    if (!this.state.stateLoaded) {
      return <LoadingView />;
    }

    if (!this.props.isAuthenticated) {
      return <WelcomeContainer />;
    }

    return <AppContainer />;
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.isAuthenticated
});

const ConnectedApp = connect(mapStateToProps)(App);

class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <ConnectedApp />
        </ApolloProvider>
      </Provider>
    );
  }
}

export default AppWrapper;
