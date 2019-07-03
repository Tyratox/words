import React from "react";
import styled from "styled-components";
import { View, Text, Button } from "react-native";
import Dropdown from "./Dropdown";
import Textarea from "./Textarea";
import { Source } from "./compose/EditableSources";
import Border from "./Border";
import InputView from "./InputView";

const NewSourceWrapper = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 5px 0;
`;

const SourceDescriptionWrapper = styled(View)`
  flex-shrink: 1;
`;

interface SourceOption {
  type: string;
  icon: string;
  label: string;
}

const OPTIONS: SourceOption[] = [
  { type: "book", icon: "book", label: "Buch" },
  { type: "website", icon: "globe", label: "Website" }
];

const createEmptySource = (type: string): Source => {
  switch (type) {
    case "book":
      return { type: "book", title: "", author: "" };
    case "website":
      return { type: "website", title: "", url: "" };
    default:
      return { type: "empty" };
  }
};

const isEmptySource = (value: Source) => {
  switch (value.type) {
    case "book":
      return value.title.length == 0 || value.author.length == 0;
    case "website":
      return value.title.length == 0 || value.url.length == 0;
    default:
      return true;
  }
};

interface Props {
  onNewSource: (source: Source) => any;
  getUpdateFunction: (callback: (source: Source) => void) => void;
}

interface State {
  type: SourceOption;
  value: Source;
}

class NewSource extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      type: OPTIONS[0],
      value: createEmptySource(OPTIONS[0].type)
    };

    props.getUpdateFunction((source: Source) =>
      this.setState({
        type: OPTIONS.find(o => o.type === source.type),
        value: source
      })
    );
  }

  render() {
    return (
      <View>
        <NewSourceWrapper>
          <Dropdown
            options={OPTIONS}
            value={this.state.type}
            onSelect={(index, option: SourceOption) => {
              this.setState({
                type: option,
                value: createEmptySource(option.type)
              });
            }}
          />
          <SourceDescriptionWrapper>
            <Text>Neuen Eintrag hinzufügen</Text>
          </SourceDescriptionWrapper>
        </NewSourceWrapper>
        <Border />
        {this.state.value.type === "book" && (
          <View>
            <InputView label="Titel">
              <Textarea
                placeholder="Faust. Eine Tragödie."
                autoFocus
                value={this.state.value.title}
                multiline={false}
                onChange={title =>
                  this.setState({
                    value: {
                      type: "book",
                      title,
                      author:
                        this.state.value.type === "book"
                          ? this.state.value.author
                          : ""
                    }
                  })
                }
              />
            </InputView>
            <InputView label="Autor">
              <Textarea
                placeholder="Johann Wolfgang von Goethe"
                value={this.state.value.author}
                multiline={false}
                onChange={author =>
                  this.setState({
                    value: {
                      type: "book",
                      title:
                        this.state.value.type === "book"
                          ? this.state.value.title
                          : "",
                      author
                    }
                  })
                }
              />
            </InputView>
          </View>
        )}
        {this.state.value.type === "website" && (
          <View>
            <InputView label="Titel">
              <Textarea
                placeholder="Wikipedia – Die freie Enzyklopädie"
                autoFocus
                value={this.state.value.title}
                multiline={false}
                onChange={title =>
                  this.setState({
                    value: {
                      type: "website",
                      title,
                      url:
                        this.state.value.type === "website"
                          ? this.state.value.url
                          : ""
                    }
                  })
                }
              />
            </InputView>
            <InputView label="URL">
              <Textarea
                placeholder="https://de.wikipedia.org/wiki/Wikipedia:Hauptseite"
                value={this.state.value.url}
                multiline={false}
                onChange={url =>
                  this.setState({
                    value: {
                      type: "website",
                      title:
                        this.state.value.type === "website"
                          ? this.state.value.title
                          : "",
                      url
                    }
                  })
                }
              />
            </InputView>
          </View>
        )}
        <Button
          title="Hinzufügen"
          onPress={() => {
            if (!isEmptySource(this.state.value)) {
              this.props.onNewSource(this.state.value);
              this.setState({
                type: OPTIONS[0],
                value: createEmptySource(OPTIONS[0].type)
              });
            }
          }}
        />
      </View>
    );
  }
}

export default NewSource;
