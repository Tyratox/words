import React from "react";
import styled from "styled-components";
import { View } from "react-native";

import Post from "../components/Post";
import {
  NavigationParams,
  NavigationScreenProp,
  ScrollView
} from "react-navigation";
import Wrapper from "../components/Wrapper";

const PostDetailWrapper = styled(View)`
  margin-bottom: 16px;
`;

interface Props {
  navigation: NavigationScreenProp<{}, NavigationParams>;
}

interface State {}

class PostDetail extends React.PureComponent<Props, State> {
  static navigationOptions = {
    title: "Beitrag"
  };

  render() {
    return (
      <PostDetailWrapper>
        <Wrapper>
          <ScrollView>
            <Post
              title={this.props.navigation.state.params.title}
              author={this.props.navigation.state.params.user.name}
              lead={this.props.navigation.state.params.lead}
              fullLead
              content={this.props.navigation.state.params.content}
              createdAt={this.props.navigation.state.params.createdAt}
            />
          </ScrollView>
        </Wrapper>
      </PostDetailWrapper>
    );
  }
}

export default PostDetail;
