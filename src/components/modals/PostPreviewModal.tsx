import React from "react";
import styled from "styled-components";
import { View, Modal, Button, Alert, ScrollView } from "react-native";
import Post from "../Post";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Wrapper from "../Wrapper";
import { Source } from "../compose/EditableSources";

const ModalWrapperView = styled(View)`
  margin-top: 16px;
`;

interface Props {
  visible: boolean;
  updateId?: number;
  title: string;
  lead: string;
  content: string;
  sources: Source[];
  onUpdate?: () => void;
  onCreate?: () => void;
  close: () => void;
}
interface State {}

const CREATE_POST = gql`
  mutation createPost(
    $title: String!
    $lead: String
    $content: String!
    $sources: [SourceInput!]
  ) {
    createPost(
      title: $title
      lead: $lead
      content: $content
      sources: $sources
    ) {
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
    }
  }
`;

const UPDATE_POST = gql`
  mutation updatePost(
    $id: Int!
    $title: String!
    $lead: String
    $content: String!
    $sources: [SourceInput!]
  ) {
    updatePost(
      id: $id
      title: $title
      lead: $lead
      content: $content
      sources: $sources
    ) {
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
    }
  }
`;

class PostPreviewModal extends React.PureComponent<Props, State> {
  render() {
    return (
      <ModalWrapperView>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.visible}
          onRequestClose={() => {}}
        >
          <ScrollView>
            <ModalWrapperView>
              <Wrapper>
                <Post
                  title={this.props.title}
                  author={"dir"}
                  lead={this.props.lead}
                  fullLead
                  content={this.props.content}
                  createdAt={Date.now()}
                  sources={this.props.sources}
                  showSources
                />
                {this.props.updateId ? (
                  <Mutation mutation={UPDATE_POST}>
                    {(createPost, { data }) => (
                      <Button
                        title="Aktualisieren"
                        onPress={() =>
                          createPost({
                            variables: {
                              id: this.props.updateId,
                              title: this.props.title,
                              lead: this.props.lead,
                              content: this.props.content,
                              sources: this.props.sources
                            }
                          })
                            .then(() => {
                              this.props.onUpdate();
                              this.props.close();
                            })
                            .catch(e => Alert.alert("Error", JSON.stringify(e)))
                        }
                      />
                    )}
                  </Mutation>
                ) : (
                  <Mutation mutation={CREATE_POST}>
                    {(createPost, { data }) => (
                      <Button
                        title="Veröffentlichen"
                        onPress={() =>
                          createPost({
                            variables: {
                              title: this.props.title,
                              lead: this.props.lead,
                              content: this.props.content,
                              sources: this.props.sources
                            }
                          }).then(() => {
                            this.props.onCreate();
                            this.props.close();
                          })
                        }
                      />
                    )}
                  </Mutation>
                )}

                <Button title="Abbrechen" onPress={this.props.close} />
              </Wrapper>
            </ModalWrapperView>
          </ScrollView>
        </Modal>
      </ModalWrapperView>
    );
  }
}

export default PostPreviewModal;
