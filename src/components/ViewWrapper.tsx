import React from "react";
import styled from "styled-components";
import { SafeAreaView } from "react-native";

const Wrapper = styled(SafeAreaView)`
  padding: 10;
`;

const ViewWrapper = React.memo(({ children }) => {
  return <Wrapper>{children}</Wrapper>;
});

export default ViewWrapper;
