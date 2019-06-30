import React from "react";
import { Text, View, Button, Alert } from "react-native";
import { NavigationScreenProp, FlatList } from "react-navigation";
import gql from "graphql-tag";

import Wrapper from "../components/Wrapper";
import ViewWrapper from "../components/ViewWrapper";
import { GraphQLRequest } from "apollo-link";
import { GraphqlQueryControls, graphql, Query } from "react-apollo";

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
          {({ loading, error, data }) => {
            if (loading || error) {
              return <View />;
            }
            return (
              <FlatList
                data={data.latestPosts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={data => {
                  const item: any = data.item;

                  return (
                    <View>
                      <Text>{item.title}</Text>
                    </View>
                  );
                }}
              />
            );
          }}
        </Query>
      </ViewWrapper>
    );
  }
}

export default Feed;
