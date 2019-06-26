import React from "react";
import { NavigationScreenProp, ScrollView } from "react-navigation";
import { createStackNavigator } from "react-navigation";
import {
  Text,
  View,
  KeyboardAvoidingView,
  Button,
  ActivityIndicator,
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
import Sources, { Source } from "../components/compose/Sources";
import WYSIWYGInput from "../components/WYSIWYGInput";
import WYSIWYGEditor from "./compose/WYSIWYGEditor";
import { COLOR_PRIMARY } from "../styles";
import Drafts from "./compose/Drafts";

interface Props {
  navigation: NavigationScreenProp<{}>;
}

export interface ComposeData {
  headline: string;
  lead: string;
  showLead: boolean;
  content: string;
  sources: Array<Source>;
}

interface State extends ComposeData {
  fullscreen: boolean;
  cacheLoaded: boolean;
}

const DEFAULT_STATE: State = {
  headline: "",
  lead: "",
  showLead: false,
  content: "",
  fullscreen: false,
  cacheLoaded: false,
  sources: [
    {
      type: "website",
      title: "Wikipedia",
      url: "https://wikipedia.org/meta/about/wikipedia"
    },
    { type: "book", title: "1984", author: "George Orwell" }
  ]
};

class ComposeComponent extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Schreiben"
  };

  storeInterval = null;

  constructor(props) {
    super(props);

    this.state = DEFAULT_STATE;

    this.loadData();
    this.storeInterval = setInterval(this.storeData, 5000);
  }

  componentWillUnmount = () => {
    clearInterval(this.storeInterval);
  };

  getComposeData = () => ({
    headline: this.state.headline,
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

  //keyboardDismissMode={"on-drag"}
  render() {
    if (!this.state.cacheLoaded) {
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
      <ViewWrapper>
        <ScrollView style={{ height: "100%" }}>
          <KeyboardAvoidingView behavior="padding" enabled>
            <Wrapper>
              <Heading>Text verfassen</Heading>
            </Wrapper>
            <Border />
            <Wrapper>
              <Textarea
                placeholder="Headline: Revolutionäre Blogging-App"
                autoFocus
                onChange={text => {
                  this.setState({ headline: text });
                }}
                value={this.state.headline}
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
                <Sources
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
            <Button
              title="Entwurf laden"
              onPress={() => {
                this.props.navigation.navigate("Drafts", {
                  onLoad: (draft: ComposeData) => {
                    this.setState({ ...this.state, ...draft });
                  }
                });
              }}
            />
            <Button
              title="Entwurf speichern"
              onPress={() => {
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
                  .then(() =>
                    this.setState({ ...DEFAULT_STATE, cacheLoaded: true })
                  )
                  .catch(e => Alert.alert("Es ist ein Fehler aufgetreten", e));
              }}
            />
            <Button title="Vorschau und veröffentlichen" onPress={() => {}} />
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
