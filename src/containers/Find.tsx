import React from "react";
import { Text, View } from "react-native";

import ViewWrapper from "../components/ViewWrapper";

class Find extends React.Component {
  static navigationOptions = {
    title: "Finden"
  };

  render() {
    return (
      <ViewWrapper
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text>Find</Text>
      </ViewWrapper>
    );
  }
}

export default Find;
