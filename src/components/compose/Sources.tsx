import React from "react";
import { FlatList, View, Text, Linking, TouchableOpacity } from "react-native";
import styled from "styled-components";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Textarea from "../Textarea";
import ModalDropdown from "react-native-modal-dropdown";
import Dropdown from "../Dropdown";
import NewSource from "../NewSource";

const ListEntry = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 5px 0;
`;

const ListIcon = styled(FontAwesome)`
  margin-right: 10px;
`;

const Url = styled(Text)`
  text-decoration-line: underline;
`;

const TYPE_TO_ICON = {
  website: "globe",
  book: "book"
};

export interface EmptySource {
  type: "empty";
}

export interface WebsiteSource {
  type: "website";
  title: string;
  url: string;
}

export interface BookSource {
  type: "book";
  title: string;
  author: string;
}

export type Source = EmptySource | WebsiteSource | BookSource;

interface SourceDescriptionProps {
  item: Source;
}

interface SourceDescriptionState {}

class SourceDescription extends React.PureComponent<
  SourceDescriptionProps,
  SourceDescriptionState
> {
  render() {
    const { item } = this.props;
    switch (item.type) {
      case "website":
        return (
          <Url onPress={() => Linking.openURL(item.url)} numberOfLines={1}>{`${
            item.title
          }, ${item.url}`}</Url>
        );
      case "book":
        return <Text>{`${item.title} von ${item.author}`}</Text>;
      default:
        return <Text />;
    }
  }
}

const SourceDescriptionWrapper = styled(View)`
  flex-shrink: 1;
`;

const Filler = styled(View)`
  flex-shrink: 1;
  flex-grow: 1;
`;

interface Props {
  sources: Array<Source>;
  onNewSource: (source: Source) => void;
  onRemoveSource: (source: Source) => void;
}
interface State {}

class Sources extends React.PureComponent<Props, State> {
  sourceUpdateFunction: (source: Source) => void;

  getSourceUpdateFunction = (updateFunction: (source: Source) => void) => {
    this.sourceUpdateFunction = updateFunction;
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.props.sources}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const { type } = item;

            return (
              <ListEntry>
                <ListIcon
                  name={TYPE_TO_ICON[type] || ""}
                  size={25}
                  color="#000"
                />
                <SourceDescriptionWrapper>
                  <SourceDescription item={item} />
                </SourceDescriptionWrapper>
                <Filler />
                <TouchableOpacity
                  onPress={() => {
                    this.sourceUpdateFunction(item);
                    this.props.onRemoveSource(item);
                  }}
                >
                  <FontAwesome name="edit" size={25} color="#000" />
                </TouchableOpacity>
              </ListEntry>
            );
          }}
        />
        <NewSource
          getUpdateFunction={this.getSourceUpdateFunction}
          onNewSource={this.props.onNewSource}
        />
      </View>
    );
  }
}

export default Sources;
