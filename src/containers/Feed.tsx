import React from "react";
import { Text, View, Button, Alert } from "react-native";
import { NavigationScreenProp, FlatList } from "react-navigation";
import gql from "graphql-tag";
import styled from "styled-components";

import Wrapper from "../components/Wrapper";
import ViewWrapper from "../components/ViewWrapper";
import { Query } from "react-apollo";
import Post from "../components/Post";

interface Props {
  navigation: NavigationScreenProp<{}>;
}

const query = gql`
  query latestPosts($count: Int!) {
    latestPosts(count: $count) {
      id
      title
      lead
      content
    }
  }
`;

class Feed extends React.Component<Props> {
  render() {
    return (
      <ViewWrapper>
        <Query query={query} variables={{ count: 10 }}>
          {({ loading, error, data, refetch }) => {
            if (error) {
              return <View>{JSON.stringify(error)}</View>;
            }

            return (
              <Wrapper>
                <FlatList
                  data={data.latestPosts}
                  keyExtractor={(item, index) => index.toString()}
                  refreshing={loading}
                  onRefresh={refetch}
                  renderItem={data => {
                    const item: any = data.item;

                    return (
                      <Post
                        title={item.title}
                        lead={item.lead}
                        content={item.content}
                      />
                    );
                  }}
                />
              </Wrapper>
            );
          }}
        </Query>
      </ViewWrapper>
    );
  }
}

export default Feed;
