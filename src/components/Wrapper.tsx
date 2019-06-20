import React from "react";
import styled from "styled-components";
import { View } from "react-native";

const StyledWrapper = styled(View)`
  margin: 0 15px;
`;

interface Props {}

class Wrapper extends React.PureComponent<Props> {
  render() {
    return <StyledWrapper>{this.props.children}</StyledWrapper>;
  }
}

export default Wrapper;
