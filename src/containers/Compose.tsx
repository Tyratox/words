import React from "react";
import {
  NavigationScreenProp,
  ScrollView,
  NavigationParams,
  createStackNavigator
} from "react-navigation";
import {
  Text,
  KeyboardAvoidingView,
  Button,
  AsyncStorage,
  Alert
} from "react-native";
import generateUuid from "uuid/v1";

import ViewWrapper from "../components/ViewWrapper";
import Heading from "../components/Heading";
import Border from "../components/Border";
import Wrapper from "../components/Wrapper";
import Textarea from "../components/Textarea";
import HiddenInput from "../components/compose/HiddenInput";
import EditableSources, { Source } from "../components/compose/EditableSources";
import WYSIWYGInput from "../components/WYSIWYGInput";
import WYSIWYGEditor from "./compose/WYSIWYGEditor";
import { COLOR_PRIMARY } from "../styles";
import Drafts from "./compose/Drafts";
import LoadingView from "../components/LoadingView";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import PostPreviewModal from "../components/modals/PostPreviewModal";
import { NavigationEvents } from "react-navigation";

interface Props {
  navigation: NavigationScreenProp<{}, NavigationParams>;
}

export interface ComposeData {
  title: string;
  lead: string;
  content: string;
  sources: Array<Source>;
}

interface State extends ComposeData {
  fullscreen: boolean;
  cacheLoaded: boolean;
  showPreview: boolean;
  updateId: number | null;
}

const DEFAULT_STATE: State = {
  fullscreen: false,
  cacheLoaded: false,
  showPreview: false,
  updateId: null,

  title: "",
  lead: "",
  content: "",
  sources: []
};

class ComposeComponent extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Schreiben"
  };

  storeInterval = null;

  constructor(props) {
    super(props);

    this.state = DEFAULT_STATE;

    //data was passed to us, use it
    const parentNavigation = this.props.navigation.dangerouslyGetParent();
    if (
      parentNavigation &&
      parentNavigation.state &&
      parentNavigation.state.params &&
      parentNavigation.state.params.id
    ) {
      this.state = {
        ...this.state,
        updateId: parseInt(parentNavigation.state.params.id),
        title: parentNavigation.state.params.title,
        lead: parentNavigation.state.params.lead,
        content: parentNavigation.state.params.content,
        sources: parentNavigation.state.params.sources
          ? parentNavigation.state.params.sources
          : [],
        cacheLoaded: true
      };
      parentNavigation.setParams({ id: null });
    } else {
      this.loadData();
      this.storeInterval = setInterval(this.storeData, 5000);
    }
  }

  onFocus = () => {
    const parentNavigation = this.props.navigation.dangerouslyGetParent();
    if (
      parentNavigation &&
      parentNavigation.state &&
      parentNavigation.state.params &&
      parentNavigation.state.params.id &&
      parentNavigation.state.params.id !== this.state.updateId
    ) {
      this.setState({
        ...this.state,
        updateId: parseInt(parentNavigation.state.params.id),
        title: parentNavigation.state.params.title,
        lead: parentNavigation.state.params.lead,
        content: parentNavigation.state.params.content,
        sources: parentNavigation.state.params.sources
          ? parentNavigation.state.params.sources
          : [],
        cacheLoaded: true
      });
      parentNavigation.setParams({ id: null });
    }
  };

  componentWillUnmount = () => {
    clearInterval(this.storeInterval);
  };

  getComposeData = () => ({
    title: this.state.title,
    lead: this.state.lead,
    content: this.state.content,
    sources: this.state.sources
  });

  loadData = () => {
    return AsyncStorage.getItem("compose.cache").then(value => {
      if (value !== null) {
        const data: ComposeData = JSON.parse(value);
        this.setState({ ...this.state, ...data, cacheLoaded: true });
      } else {
        this.setState({ cacheLoaded: true });
      }
    });
  };

  storeData = () => {
    return AsyncStorage.setItem(
      "compose.cache",
      JSON.stringify(this.getComposeData())
    );
  };

  resetState = () => this.setState({ ...DEFAULT_STATE, cacheLoaded: true });

  //keyboardDismissMode={"on-drag"}
  render() {
    if (!this.state.cacheLoaded) {
      return <LoadingView />;
    }

    return (
      <ViewWrapper>
        <NavigationEvents onDidFocus={this.onFocus} />
        <ScrollView style={{ height: "100%" }}>
          <KeyboardAvoidingView behavior="padding" enabled>
            <Wrapper>
              <Heading>Text verfassen</Heading>
            </Wrapper>
            <Border />
            <Wrapper>
              <Textarea
                placeholder="Headline: Revolutionäre Blogging-App"
                onChange={text => {
                  this.setState({ title: text });
                }}
                value={this.state.title}
                multiline={false}
              />
            </Wrapper>
            <Border />
            <Wrapper>
              <HiddenInput placeholder="Lead">
                <Textarea
                  placeholder="Lead"
                  autoFocus
                  onChange={text => {
                    this.setState({ lead: text });
                  }}
                  value={this.state.lead}
                  multiline
                />
              </HiddenInput>
            </Wrapper>
            <Border />
            <Wrapper>
              <WYSIWYGInput
                placeholder={"Text: Man glaubt es kaum: ..."}
                onChange={text => {
                  this.setState({ content: text });
                }}
                value={this.state.content}
                navigation={this.props.navigation}
                isFullscreen={false}
              />
            </Wrapper>
            <Border />
            <Wrapper>
              <HiddenInput placeholder="Quellen">
                <Text>Quellen</Text>
                <EditableSources
                  sources={this.state.sources}
                  onNewSource={source =>
                    this.setState({ sources: [...this.state.sources, source] })
                  }
                  onRemoveSource={source =>
                    this.setState({
                      sources: this.state.sources.filter(s => s !== source)
                    })
                  }
                />
              </HiddenInput>
            </Wrapper>
            <Border />
            {!this.state.updateId ? (
              <React.Fragment>
                <Button
                  title="Entwurf laden"
                  onPress={() => {
                    this.props.navigation.navigate("Drafts", {
                      onLoad: (draft: ComposeData) => {
                        this.setState({
                          ...DEFAULT_STATE,
                          ...draft,
                          cacheLoaded: true
                        });
                      }
                    });
                  }}
                />
                <Button
                  title="Entwurf speichern"
                  onPress={() => {
                    if (!this.state.title) {
                      return Alert.alert(
                        "Fehler!",
                        "Gib dem Entwurf zumindest einen Titel"
                      );
                    }

                    const data = JSON.stringify(this.getComposeData());
                    const id = generateUuid();
                    AsyncStorage.getItem("draftIds")
                      .then(draftIds => {
                        if (!draftIds) {
                          draftIds = id;
                        } else {
                          draftIds += ";" + id;
                        }

                        return AsyncStorage.setItem("draftIds", draftIds);
                      })
                      .then(() => AsyncStorage.setItem(`draft:${id}`, data))
                      .then(() => this.resetState())
                      .catch(e =>
                        Alert.alert("Es ist ein Fehler aufgetreten", e)
                      );
                  }}
                />
              </React.Fragment>
            ) : null}
            <Button
              title="Vorschau und veröffentlichen"
              onPress={() => {
                if (!this.state.title) {
                  return Alert.alert("Fehler", "Gib dem Beitrag einen Titel");
                }

                if (!this.state.content) {
                  return Alert.alert(
                    "Fehler",
                    "Dein Beitrag besitzt keinen Inhalt"
                  );
                }

                this.setState({ showPreview: true });
              }}
            />
            <Button title="Zurücksetzen" onPress={this.resetState} />
            <PostPreviewModal
              visible={this.state.showPreview}
              updateId={this.state.updateId}
              title={this.state.title}
              lead={this.state.lead}
              content={this.state.content}
              sources={this.state.sources}
              onCreate={this.resetState}
              onUpdate={this.resetState}
              close={() => this.setState({ showPreview: false })}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </ViewWrapper>
    );
  }
}

const Compose = createStackNavigator(
  {
    Compose: {
      screen: ComposeComponent
    },
    WYSIWYGEditor: {
      screen: WYSIWYGEditor
    },
    Drafts: {
      screen: Drafts
    }
  },
  {
    initialRouteName: "Compose"
  }
);

export default Compose;
