import React from "react";
import { createStore, applyMiddleware } from "redux";
import { connect, Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createAppContainer } from "react-navigation";
import throttle from "lodash/throttle";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { AsyncStorage, View, ActivityIndicator, Alert } from "react-native";

import reducers from "./src/reducers";
import AppNavigator from "./src/components/AppNavigator";
import { COLOR_PRIMARY } from "./src/styles";
import Welcome from "./src/containers/Welcome";
import { API_URL } from "./src/utilities/api";

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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
      return (
        <View
          style={{
            height: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ActivityIndicator size="large" color={COLOR_PRIMARY} />
        </View>
      );
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
