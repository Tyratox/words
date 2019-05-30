import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Compose from "../containers/Compose";

const AppNavigator = createStackNavigator(
  {
    Compose: {
      screen: Compose
    }
  },
  {
    initialRouteName: "Compose"
  }
);

export default createAppContainer(AppNavigator);
