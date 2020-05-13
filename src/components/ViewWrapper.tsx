import React from "react";
import styled from "styled-components";
import { SafeAreaView } from "react-native";

const Wrapper = styled(SafeAreaView)`
  margin: 16px 0;
  flex: 1;
  width: 100%;
  height: 100%;
`;

interface Props {}

class ViewWrapper extends React.PureComponent<Props> {
  render() {
    return <Wrapper>{this.props.children}</Wrapper>;
  }
}

export default ViewWrapper;
