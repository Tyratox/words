import React from "react";
import styled from "styled-components";
import { View, Button, Alert } from "react-native";

import Post from "../components/Post";
import {
  NavigationParams,
  NavigationScreenProp,
  ScrollView
} from "react-navigation";
import Wrapper from "../components/Wrapper";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const PostDetailWrapper = styled(View)`
  margin-bottom: 16px;
`;

const DELETE_POST = gql`
  mutation deletePost($id: Int!) {
    deletePost(id: $id)
  }
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
              createdAt={this.props.navigation.state.params.createdAt}
              author={this.props.navigation.state.params.user.name}
              lead={this.props.navigation.state.params.lead}
              fullLead
              content={this.props.navigation.state.params.content}
              sources={this.props.navigation.state.params.sources}
              showSources
            />
            {this.props.navigation.state.params.canEdit ? (
              <Button
                title="Beitrag bearbeiten"
                onPress={() =>
                  this.props.navigation.navigate("Compose", {
                    ...this.props.navigation.state.params
                  })
                }
              />
            ) : null}
            {this.props.navigation.state.params.canDelete ? (
              <Mutation mutation={DELETE_POST}>
                {(deletePost, { data }) => (
                  <Button
                    title="Beitrag löschen"
                    onPress={() =>
                      deletePost({
                        variables: {
                          id: parseInt(this.props.navigation.state.params.id)
                        }
                      }).then(() => this.props.navigation.navigate("Feed"))
                    }
                  />
                )}
              </Mutation>
            ) : null}
          </ScrollView>
        </Wrapper>
      </PostDetailWrapper>
    );
  }
}

export default PostDetail;
