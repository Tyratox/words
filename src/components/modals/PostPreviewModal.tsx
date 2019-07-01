import React from "react";
import styled from "styled-components";
import { View, Modal, Button } from "react-native";
import Post from "../Post";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Wrapper from "../Wrapper";

const ModalWrapperView = styled(View)`
  margin-top: 16px;
`;

interface Props {
  visible: boolean;
  title: string;
  lead: string;
  content: string;
  onCreate?: () => void;
  close: () => void;
}
interface State {}

const createPostMutation = gql`
  mutation createPost($title: String!, $lead: String, $content: String!) {
    createPost(title: $title, lead: $lead, content: $content) {
      id
      title
      lead
      content
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
          <ModalWrapperView>
            <Wrapper>
              <Post
                title={this.props.title}
                lead={this.props.lead}
                content={this.props.content}
              />
              <Mutation mutation={createPostMutation}>
                {(createPost, { data }) => (
                  <Button
                    title="Veröffentlichen"
                    onPress={() =>
                      createPost({
                        variables: {
                          title: this.props.title,
                          lead: this.props.lead,
                          content: this.props.content
                        }
                      }).then(() => {
                        this.props.onCreate();
                        this.props.close();
                      })
                    }
                  />
                )}
              </Mutation>
              <Button title="Abbrechen" onPress={this.props.close} />
            </Wrapper>
          </ModalWrapperView>
        </Modal>
      </ModalWrapperView>
    );
  }
}

export default PostPreviewModal;
