import React from "react";
import styled from "styled-components";
import ParsedText from "react-native-parsed-text";
import { View, StyleSheet, Text } from "react-native";
import { COLOR_PRIMARY } from "../styles";
import Textarea from "./Textarea";
import Border from "./Border";

const StyledView = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: #f5fcff;
`;

const styles = StyleSheet.create({
  url: {
    textDecorationLine: "underline"
  },

  text: {
    fontSize: 14
  },

  username: {
    color: "#000",
    fontWeight: "bold"
  },

  hashTag: {
    fontStyle: "italic",
    color: COLOR_PRIMARY
  }
});

interface Props {
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
}

interface State {}

class WYSIWYGInput extends React.PureComponent<Props, State> {
  render() {
    return (
      <StyledView>
        <Textarea
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={value => this.props.onChange(value)}
          multiline
        />
        <Border />
        <Text>Vorschau:</Text>
        <ParsedText
          style={styles.text}
          parse={[
            { type: "url", style: styles.url },
            {
              pattern: /@[A-z0-9]+/i,
              style: styles.username
            },
            { pattern: /#(\w+)/, style: styles.hashTag }
          ]}
          childrenProps={{ allowFontScaling: false }}
        >
          {this.props.value}
        </ParsedText>
      </StyledView>
    );
  }
}

export default WYSIWYGInput;
