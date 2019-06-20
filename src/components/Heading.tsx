import React from "react";
import styled from "styled-components";
import { Text, View } from "react-native";

const StyledHeading = styled(Text)`
  font-size: 30px;
  font-weight: bold;
`;

interface Props {
  children: string;
}
interface State {}

class Heading extends React.PureComponent<Props, State> {
  render() {
    return <StyledHeading>{this.props.children}</StyledHeading>;
  }
}

export default Heading;
