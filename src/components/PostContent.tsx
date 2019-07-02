import React from "react";
import styled from "styled-components";
import ParsedText from "react-native-parsed-text";
import { StyleSheet } from "react-native";

import { COLOR_PRIMARY } from "../styles";

interface Props {
  children: string;
}
interface State {}

const styles = StyleSheet.create({
  url: {
    textDecorationLine: "underline"
  },

  text: {
    fontSize: 16
    /*textAlign: "justify"*/
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

class PostContent extends React.PureComponent<Props, State> {
  render() {
    return (
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
        {this.props.children}
      </ParsedText>
    );
  }
}

export default PostContent;
