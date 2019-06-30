import React from "react";
import { Text, View, Button } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import Wrapper from "../components/Wrapper";
import ViewWrapper from "../components/ViewWrapper";

interface Props {
  navigation: NavigationScreenProp<{}>;
}

class Feed extends React.Component<Props> {
  static navigationOptions = {
    title: "Words"
  };

  render() {
    return (
      <ViewWrapper>
        <View
          style={{
            height: "100%",
            width: "100%",
            flex: 0,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text>Newspaper</Text>

          <Button
            title="Compose a text"
            onPress={() => this.props.navigation.navigate("Compose")}
          />
        </View>
      </ViewWrapper>
    );
  }
}

export default Feed;
