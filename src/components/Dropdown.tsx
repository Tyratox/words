import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ModalDropdown from "react-native-modal-dropdown";

export interface Option {
  icon?: string;
  label: string;
  [key: string]: any;
}

const ModalButtonWrapper = styled(View)`
  margin: 5px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DropdownItem = styled(View)`
  margin: 5px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Icon = styled(FontAwesome)`
  margin-right: 10px;
`;

interface Props {
  disabled?: boolean;
  options: Option[];
  renderRow?: (option: any, index: number, isSelected: boolean) => any;
  renderButton?: (option: any) => any;
  onSelect?: (index: number, option: any) => void;
  value: any;
}
interface State {}

const defaultRenderButton = item => (
  <View>
    {item.icon ? (
      <Icon name={item.icon} size={25} color="#000" />
    ) : (
      <Text>{item.label}</Text>
    )}
  </View>
);

const defaultRenderRow = (item, index, isSelected) => {
  return (
    <DropdownItem>
      {item.icon && <Icon name={item.icon} size={25} color="#000" />}
      <Text>{item.label}</Text>
    </DropdownItem>
  );
};

class Dropdown extends React.PureComponent<Props, State> {
  render() {
    const renderButton = this.props.renderButton || defaultRenderButton;

    return (
      <ModalDropdown
        options={this.props.options}
        renderRow={this.props.renderRow || defaultRenderRow}
        disabled={this.props.disabled}
        onSelect={this.props.onSelect}
      >
        <ModalButtonWrapper>
          <Icon name="caret-down" size={25} color="#000" />
          {renderButton(this.props.value)}
        </ModalButtonWrapper>
      </ModalDropdown>
    );
  }
}

export default Dropdown;
