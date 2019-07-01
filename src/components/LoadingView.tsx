import React from "react";
import { View, ActivityIndicator } from "react-native";
import { COLOR_PRIMARY } from "../styles";

interface Props {}
interface State {}

class LoadingView extends React.PureComponent<Props, State> {
  render = () => {
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
  };
}

export default LoadingView;
