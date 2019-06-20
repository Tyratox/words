import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Props {
  placeholder: string;
  children: React.ReactNode;
}
interface State {
  visible: boolean;
}

class HiddenInput extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = { visible: false };
  }

  render() {
    return this.state.visible ? (
      this.props.children
    ) : (
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Text>{this.props.placeholder}</Text>
        <TouchableOpacity onPress={() => this.setState({ visible: true })}>
          <FontAwesome name="plus-circle" size={25} color="#000" />
        </TouchableOpacity>
      </View>
    );
  }
}

export default HiddenInput;
