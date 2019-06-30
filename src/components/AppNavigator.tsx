import React from "react";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Feed from "../containers/Feed";
import Compose from "../containers/Compose";
import Find from "../containers/Find";
import { COLOR_PRIMARY, COLOR_DISABLED } from "../styles";

const TabNavigator = createBottomTabNavigator(
  {
    Feed: {
      screen: Feed
    },
    Compose: {
      screen: Compose,
      navigationOptions: ({ navigation }) => ({
        title: `Schreiben`
      })
    },
    Find: {
      screen: Find
    }
  },
  {
    initialRouteName: "Feed",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent;
        let iconName;

        if (routeName === "Compose") {
          IconComponent = Feather;
          iconName = focused ? "edit-3" : "edit-2";
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
          //IconComponent = HomeIconWithBadge;
        } else if (routeName === "Feed") {
          IconComponent = FontAwesome;
          iconName = `home`;
        } else if (routeName === "Find") {
          IconComponent = Feather;
          iconName = `search`;
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: COLOR_PRIMARY,
      inactiveTintColor: COLOR_DISABLED
    }
  }
);

export default TabNavigator;
