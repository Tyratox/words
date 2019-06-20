import React from "react";
import styled from "styled-components";
import { View, Text } from "react-native";

const StyledInputView = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 5px 0;
`;

const Label = styled(Text)`
  margin-right: 5px;
`;

interface Props {
  label: string;
}

interface State {}

class InputView extends React.PureComponent<Props, State> {
  render() {
    return (
      <StyledInputView>
        <Label>{this.props.label}:</Label>
        {this.props.children}
      </StyledInputView>
    );
  }
}

export default InputView;
