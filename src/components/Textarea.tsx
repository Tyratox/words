import React from "react";
import styled from "styled-components";
import { TextInput } from "react-native";
import { COLOR_PLACEHOLDER, COLOR_PRIMARY } from "../styles";

interface Props {
  placeholder?: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  value: string;
  multiline: boolean;
}
interface State {}

const StyledTextarea = styled<Props>(TextInput)``;

class Textarea extends React.PureComponent<Props, State> {
  render() {
    return (
      <StyledTextarea
        onChangeText={this.props.onChange}
        value={this.props.value}
        placeholder={this.props.placeholder}
        placeholderTextColor={COLOR_PLACEHOLDER}
        autoCompleteType={"off"}
        autoCorrect={false}
        autoFocus={this.props.autoFocus}
        importantForAutofill={"no"}
        multiline={this.props.multiline}
        blurOnSubmit={!this.props.multiline}
        textAlignVertical={"top"}
        selectionColor={COLOR_PRIMARY}
      />
    );
  }
}

export default Textarea;
