import React from "react";
import styled from "styled-components";
import {
  View,
  Linking,
  Text,
  FlatList,
  TouchableOpacity,
  Alert
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Source } from "./compose/EditableSources";

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

const SourceDescriptionWrapper = styled(View)`
  flex-shrink: 1;
`;

const Filler = styled(View)`
  flex-shrink: 1;
  flex-grow: 1;
`;

const Url = styled(Text)`
  text-decoration-line: underline;
`;

const TYPE_TO_ICON = {
  website: "globe",
  book: "book"
};

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

interface Props {
  sources: Source[];
  editable: boolean;
  onEdit?: (source: Source) => void;
}

interface State {}

class Sources extends React.PureComponent<Props, State> {
  render() {
    return (
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
              {this.props.editable ? (
                <React.Fragment>
                  <Filler />
                  <TouchableOpacity
                    onPress={
                      this.props.onEdit
                        ? () => this.props.onEdit(item)
                        : undefined
                    }
                  >
                    <FontAwesome name="edit" size={25} color="#000" />
                  </TouchableOpacity>
                </React.Fragment>
              ) : null}
            </ListEntry>
          );
        }}
      />
    );
  }
}

export default Sources;
