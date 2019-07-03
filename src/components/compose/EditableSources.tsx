import React from "react";
import { FlatList, View, Text, Linking, TouchableOpacity } from "react-native";
import styled from "styled-components";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import NewSource from "../NewSource";
import Sources from "../Sources";

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

interface Props {
  sources: Source[];
  onNewSource: (source: Source) => void;
  onRemoveSource: (source: Source) => void;
}
interface State {}

class EditableSources extends React.PureComponent<Props, State> {
  sourceUpdateFunction: (source: Source) => void;

  getSourceUpdateFunction = (updateFunction: (source: Source) => void) => {
    this.sourceUpdateFunction = updateFunction;
  };

  render() {
    return (
      <View>
        <Sources
          sources={this.props.sources}
          editable
          onEdit={item => {
            this.sourceUpdateFunction(item);
            this.props.onRemoveSource(item);
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

export default EditableSources;
