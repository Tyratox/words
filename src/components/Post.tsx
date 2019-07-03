import React from "react";
import styled from "styled-components";
import { Text, View } from "react-native";
import TimeAgo from "react-native-timeago";

import PostContent from "./PostContent";
import Border from "./Border";
import Sources from "./Sources";
import { Source } from "./compose/EditableSources";

const PostHeader = styled(View)`
  margin-top: 16px;
  margin-bottom: 16px;
`;
const PostTitle = styled(Text)`
  font-weight: bold;
  font-size: 24px;
`;
const PostMeta = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const PostTime = styled(TimeAgo)`
  font-size: 12px;
`;
const Author = styled(Text)`
  font-size: 12px;
`;

const PostLead = styled(Text)`
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
  /*text-align: justify;*/
`;

interface Props {
  title: string;
  author: string;
  lead: string;
  fullLead: boolean;
  content: string | boolean;
  createdAt: string;
  showSources: boolean;
  sources?: Source[];
}
interface State {}

class Post extends React.PureComponent<Props, State> {
  render() {
    return (
      <View>
        <PostHeader>
          <PostTitle>{this.props.title}</PostTitle>
          <PostMeta>
            <Author>{`von ${this.props.author} `}</Author>
            <PostTime time={parseInt(this.props.createdAt)} />
          </PostMeta>
        </PostHeader>
        {this.props.lead.length > 0 ? (
          <PostLead numberOfLines={this.props.fullLead ? undefined : 8}>
            {this.props.lead}
          </PostLead>
        ) : null}
        {typeof this.props.content === "string" ? (
          <PostContent>{this.props.content}</PostContent>
        ) : null}
        {this.props.showSources && this.props.sources ? (
          <View>
            <Border />
            <Sources sources={this.props.sources} />
          </View>
        ) : null}
      </View>
    );
  }
}

export default Post;
