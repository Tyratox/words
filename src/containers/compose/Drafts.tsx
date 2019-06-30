import React from "react";
import {
  AsyncStorage,
  View,
  ActivityIndicator,
  Text,
  Alert,
  Platform,
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import styled from "styled-components";
import { SwipeListView } from "react-native-swipe-list-view";

import {
  NavigationScreenProp,
  NavigationParams,
  FlatList
} from "react-navigation";
import Wrapper from "../../components/Wrapper";
import { ComposeData } from "../Compose";
import { COLOR_PRIMARY } from "../../styles";

const ItemText = styled(Text)`
  font-size: 24px;
  font-weight: bold;
`;

const RowFront = styled(TouchableHighlight)`
  flex: 1;
  align-items: flex-start;
  background-color: #fff;
  border-bottom-color: #666;
  border-bottom-width: 1;
  justify-content: center;
  padding: 16px 8px;
`;

const RowBack = styled(View)`
  flex: 1;
  align-items: center;
  background-color: #f00;
  justify-content: flex-end;
  flex-direction: row;
  padding-left: 15px;
`;

const DeleteButton = styled(TouchableOpacity)`
  background-color: #f00;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 75px;

  padding-right: 16px;
`;

const WhiteText = styled(Text)`
  color: #fff;
  text-align: right;
`;

interface Props {
  navigation: NavigationScreenProp<{}, NavigationParams>;
}

interface State {
  drafts: ComposeData[];
  draftsLoaded: boolean;
}

class Drafts extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Entwürfe"
  };

  constructor(props) {
    super(props);

    this.state = {
      drafts: [],
      draftsLoaded: false
    };

    this.loadDrafts();
  }

  loadDrafts = () => {
    return AsyncStorage.getItem("draftIds")
      .then(value => {
        if (!value) {
          return Promise.resolve([]);
        }

        return Promise.all(
          value.split(";").map(id =>
            AsyncStorage.getItem(`draft:${id}`).then(data => ({
              ...JSON.parse(data),
              key: id
            }))
          )
        );
      })
      .then(drafts => this.setState({ drafts, draftsLoaded: true }))
      .catch(e => Alert.alert("Es ist ein Fehler aufgetreten", e));
  };

  render() {
    if (!this.state.draftsLoaded) {
      return (
        <View
          style={{
            height: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ActivityIndicator size="large" color={COLOR_PRIMARY} />
        </View>
      );
    }

    return (
      <View>
        <Wrapper>
          {this.state.drafts.length > 0 ? (
            <SwipeListView
              useFlatList
              data={this.state.drafts}
              renderItem={({ item: draft }) => (
                <RowFront
                  onPress={() => {
                    this.props.navigation.state.params.onLoad(draft);
                    this.props.navigation.goBack();
                  }}
                >
                  <ItemText>{draft.title}</ItemText>
                </RowFront>
              )}
              renderHiddenItem={({ item: draft }, rowMap) => (
                <RowBack>
                  <DeleteButton
                    onPress={() => {
                      Alert.alert(
                        "Löschen?",
                        `Soll der Entwurf '${
                          draft.title
                        }' tatsächlich gelöscht werden?`,
                        [
                          { text: "Abbrechen", onPress: () => {} },
                          {
                            text: "Löschen",
                            onPress: () => {
                              this.setState({ draftsLoaded: false });
                              AsyncStorage.removeItem(`draft:${draft.key}`)
                                .then(() => AsyncStorage.getItem("draftIds"))
                                .then(draftIds => {
                                  if (!draftIds) {
                                    return;
                                  }
                                  return AsyncStorage.setItem(
                                    "draftIds",
                                    draftIds
                                      .split(";")
                                      .filter(id => id != draft.key)
                                      .join(";")
                                  );
                                })
                                .then(() => this.loadDrafts())
                                .catch(e =>
                                  Alert.alert(
                                    "Es ist ein Fehler aufgetreten",
                                    e
                                  )
                                );
                            }
                          }
                        ]
                      );
                    }}
                  >
                    <WhiteText>Löschen</WhiteText>
                  </DeleteButton>
                </RowBack>
              )}
              leftOpenValue={0}
              rightOpenValue={-90}
            />
          ) : (
            <Text>Es wurden bisher keine Entwürfe gespeichert.</Text>
          )}
        </Wrapper>
      </View>
    );
  }
}

export default Drafts;
