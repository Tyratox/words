import React from "react";
import { Text, TextInput } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import ViewWrapper from "../components/ViewWrapper";

interface Props {
  navigation: NavigationScreenProp<{}>;
}

interface State {
  text: string;
}

class Compose extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Schreiben"
  };

  constructor(props) {
    super(props);

    this.state = { text: "" };
  }

  render() {
    return (
      <ViewWrapper>
        <Text>Compose</Text>
        <TextInput
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
        />
      </ViewWrapper>
    );
  }
}

export default Compose;
