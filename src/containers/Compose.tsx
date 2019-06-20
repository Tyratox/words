import React from "react";
import { NavigationScreenProp, ScrollView } from "react-navigation";
import TagInput from "react-native-tag-input";

import ViewWrapper from "../components/ViewWrapper";
import Heading from "../components/Heading";
import Border from "../components/Border";
import Wrapper from "../components/Wrapper";
import Textarea from "../components/Textarea";
import HiddenInput from "../components/compose/HiddenInput";
import { Text, View, KeyboardAvoidingView, Button } from "react-native";
import Sources, { Source } from "../components/compose/Sources";
import WYSIWYGInput from "../components/WYSIWYGInput";

interface Props {
  navigation: NavigationScreenProp<{}>;
}

interface State {
  headline: string;
  lead: string;
  showLead: boolean;
  content: string;
  sources: Array<Source>;
}

class Compose extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Schreiben"
  };

  constructor(props) {
    super(props);

    this.state = {
      headline: "",
      lead: "",
      showLead: false,
      content: "",
      sources: [
        {
          type: "website",
          title: "Wikipedia",
          url: "https://wikipedia.org/meta/about/wikipedia"
        },
        { type: "book", title: "1984", author: "George Orwell" }
      ]
    };
  }
  //keyboardDismissMode={"on-drag"}
  render() {
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
                placeholder={"Headline"}
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
                placeholder={"Text"}
                onChange={text => {
                  this.setState({ content: text });
                }}
                value={this.state.content}
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
            <Button title="Veröffentlichen" onPress={() => {}} />
          </KeyboardAvoidingView>
        </ScrollView>
      </ViewWrapper>
    );
  }
}

export default Compose;
