import React from "react";
import { Text, View, Button } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import ViewWrapper from "../components/ViewWrapper";

interface Props {
  navigation: NavigationScreenProp<{}>;
}

class Newspaper extends React.Component<Props> {
  static navigationOptions = {
    title: "Words"
  };

  render() {
    return (
      <ViewWrapper
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text>Newspaper</Text>
        <Button
          title="Compose a text"
          onPress={() => this.props.navigation.navigate("Compose")}
        />
      </ViewWrapper>
    );
  }
}

export default Newspaper;
