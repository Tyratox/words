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
  createStackNavigator
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

const query = gql`
  query latestPosts($count: Int!) {
    latestPosts(count: $count) {
      id
      title
      lead
      content
      createdAt

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
        <Query query={query} variables={{ count: 10 }}>
          {({ loading, error, data, refetch }) => {
            if (error) {
              return (
                <View>
                  <Text>{JSON.stringify(error)}</Text>
                </View>
              );
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
