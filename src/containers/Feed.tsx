import React from "react";
import {
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
  FlatList
} from "react-native";
import {
  NavigationScreenProp,
  NavigationParams,
  createStackNavigator,
  NavigationEvents
} from "react-navigation";
import gql from "graphql-tag";
import styled from "styled-components";

import Wrapper from "../components/Wrapper";
import ViewWrapper from "../components/ViewWrapper";
import { Query } from "react-apollo";
import Post from "../components/Post";
import PostDetail from "./PostDetail";

interface Props {
  navigation: NavigationScreenProp<{}, NavigationParams>;
}

const FETCH_LATEST_POSTS = gql`
  query latestPosts($count: Int!, $after: Int) {
    latestPosts(count: $count, after: $after) {
      id
      title
      lead
      content
      sources {
        type
        title
        author
        url
      }
      createdAt
      canEdit
      canDelete

      user {
        name
      }
    }
  }
`;

class FeedComponent extends React.Component<Props> {
  static navigationOptions = {
    title: "Feed"
  };

  render() {
    return (
      <View>
        <Query
          query={FETCH_LATEST_POSTS}
          variables={{ count: 10 }}
          notifyOnNetworkStatusChange
        >
          {({ loading, error, data, refetch, fetchMore }) => {
            if (error) {
              return (
                <View>
                  <Text>{JSON.stringify(error)}</Text>
                </View>
              );
            }

            return (
              <Wrapper>
                <NavigationEvents onDidFocus={() => refetch()} />
                <FlatList
                  data={data.latestPosts}
                  keyExtractor={(item, index) => index.toString()}
                  refreshing={loading}
                  onRefresh={refetch}
                  style={{ height: "100%" }}
                  onEndReachedThreshold={0.4}
                  onEndReached={() =>
                    fetchMore({
                      variables: {
                        count: 10,
                        after: parseInt(
                          data.latestPosts[data.latestPosts.length - 1].id
                        )
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        return {
                          ...prev,
                          latestPosts: [
                            ...prev.latestPosts,
                            ...fetchMoreResult.latestPosts
                          ]
                        };
                      }
                    })
                  }
                  renderItem={data => {
                    const item: any = data.item;

                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate("PostDetail", item);
                        }}
                      >
                        <Post
                          title={item.title}
                          author={item.user.name}
                          createdAt={item.createdAt}
                          lead={item.lead}
                          fullLead={false}
                          content={false}
                          showSources={false}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              </Wrapper>
            );
          }}
        </Query>
      </View>
    );
  }
}

const Feed = createStackNavigator(
  {
    Feed: {
      screen: FeedComponent
    },
    PostDetail: {
      screen: PostDetail
    }
  },
  {
    initialRouteName: "Feed"
  }
);

export default Feed;
