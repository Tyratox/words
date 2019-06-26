import React from "react";
import { View } from "react-native";

import WYSIWYGInput from "../../components/WYSIWYGInput";
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import Wrapper from "../../components/Wrapper";
import ViewWrapper from "../../components/ViewWrapper";

interface Props {
  navigation: NavigationScreenProp<{}, NavigationParams>;
}

interface State {
  value: string;
}

class WYSIWYGEditor extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Editor"
  };

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.navigation.state.params.value || ""
    };
  }

  render() {
    return (
      <ViewWrapper>
        <Wrapper>
          <WYSIWYGInput
            placeholder={"Text: Man glaubt es kaum: ..."}
            value={this.state.value}
            onChange={value => {
              this.props.navigation.state.params.onChange(value);
              this.setState({ value });
            }}
            navigation={this.props.navigation}
            isFullscreen
          />
        </Wrapper>
      </ViewWrapper>
    );
  }
}

export default WYSIWYGEditor;
