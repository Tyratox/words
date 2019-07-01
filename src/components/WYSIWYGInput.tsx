import React from "react";
import styled from "styled-components";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import Textarea from "./Textarea";
import Border from "./Border";
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import PostContent from "./PostContent";

const StyledView = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const EditView = styled(View)`
  width: 100%;
  margin-bottom: ${({ isFullscreen }) => (isFullscreen ? "0" : "30")}px;
  min-height: ${({ isFullscreen }) => (isFullscreen ? "64" : "0")}px;
`;

const FullsceenButton = styled(TouchableOpacity)`
  position: absolute;
  right: 0;
  bottom: -30px;
`;

interface Props {
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
  navigation: NavigationScreenProp<{}, NavigationParams>;
  isFullscreen: boolean;
}

interface State {}

class WYSIWYGInput extends React.PureComponent<Props, State> {
  render() {
    return (
      <StyledView>
        <EditView isFullscreen={this.props.isFullscreen}>
          <Textarea
            placeholder={this.props.placeholder}
            value={this.props.value}
            onChange={value => this.props.onChange(value)}
            multiline
          />
          {!this.props.isFullscreen && (
            <FullsceenButton
              onPress={() =>
                this.props.navigation.navigate("WYSIWYGEditor", {
                  value: this.props.value,
                  onChange: (value: string) => this.props.onChange(value)
                })
              }
            >
              <MaterialIcons name="fullscreen" size={25} color="#000" />
            </FullsceenButton>
          )}
        </EditView>
        <Border />
        <Text>Vorschau:</Text>
        <PostContent>{this.props.value}</PostContent>
      </StyledView>
    );
  }
}

export default WYSIWYGInput;
