import React from "react";
import styled from "styled-components";
import { Text, View } from "react-native";
import PostContent from "./PostContent";

const PostTitle = styled(Text)`
  font-weight: bold;
  font-size: 20px;
  margin-top: 16px;
  margin-bottom: 16px;
`;
const PostLead = styled(Text)`
  color: #666;
  margin-bottom: 16px;
`;

interface Props {
  title: string;
  lead: string;
  content: string;
}
interface State {}

class Post extends React.PureComponent<Props, State> {
  render() {
    return (
      <View>
        <PostTitle>{this.props.title}</PostTitle>
        {this.props.lead.length > 0 ? (
          <PostLead>{this.props.lead}</PostLead>
        ) : null}
        <PostContent>{this.props.content}</PostContent>
      </View>
    );
  }
}

export default Post;
