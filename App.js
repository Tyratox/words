import React from "react";
import { createStore, applyMiddleware } from "redux";
import { connect, Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createAppContainer } from "react-navigation";
import throttle from "lodash/throttle";
import { AsyncStorage, View, ActivityIndicator } from "react-native";

import reducers from "./src/reducers";
import AppNavigator from "./src/components/AppNavigator";
import { COLOR_PRIMARY } from "./src/styles";
import Welcome from "./src/containers/Welcome";

const AppContainer = createAppContainer(AppNavigator);
const WelcomeContainer = createAppContainer(Welcome);

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

store.subscribe(
  throttle(() => {
    const { user, isAuthenticated } = store.getState();

    AsyncStorage.setItem("state", JSON.stringify({ user, isAuthenticated }));
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
        <ConnectedApp />
      </Provider>
    );
  }
}

export default AppWrapper;
