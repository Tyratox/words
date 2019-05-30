import React, { Component } from "react";
import { View, Platform } from "react-native";
import styled from "styled-components";
import { COLOR_PRIMARY } from "../styles";

interface Props {
  color?: string;
}

interface State {
  text: string;
}

const height = Platform.OS === "ios" ? 18 : 0;

const StyledStatusBarBackground = styled(View)`
  height: ${height};
  background-color: ${({ color }) => color || COLOR_PRIMARY};
`;

class StatusBarBackground extends Component<Props, State> {
  render() {
    return <StyledStatusBarBackground color={this.props.color} />;
  }
}

export default StatusBarBackground;
