import React from "react";
import styled from "styled-components";
import { View } from "react-native";

interface Props {}
interface State {}

const StyledWrapper = styled(View)`
  width: 100%;
  margin: 10px 0;
  border-bottom-width: 2px;
  border-bottom-color: #000;
`;

class Border extends React.PureComponent<Props, State> {
  render() {
    return <StyledWrapper />;
  }
}

export default Border;
