import React from "react";
import { NavigationScreenProp } from "react-navigation";
import { createStackNavigator } from "react-navigation";
import {
  Text,
  Button,
  Linking,
  Platform,
  Alert,
  Clipboard
} from "react-native";
import * as EmailValidator from "email-validator";

import ViewWrapper from "../components/ViewWrapper";
import Border from "../components/Border";
import Wrapper from "../components/Wrapper";
import Textarea from "../components/Textarea";
import { connect } from "react-redux";
import { login, createLoginAction } from "../actions/authentication";

interface Props {
  navigation: NavigationScreenProp<{}>;
  dispatch: any;
}

interface State {
  name: string;
  email: string;
}

class WelcomeComponent extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Willkommen"
  };

  state = {
    name: "",
    email: ""
  };

  componentDidMount() {
    if (Platform.OS === "android") {
      Linking.getInitialURL().then(url => {
        this.handleSchemaUrl(url);
      });
    } else {
      Linking.addEventListener("url", this.handleOpenURL);
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleOpenURL);
  }

  handleOpenURL = event => {
    this.handleSchemaUrl(event.url);
  };

  handleSchemaUrl = url => {
    const route = url.replace(/.*?:\/\//g, "");
    const routeName = route.split("/")[0];

    switch (routeName) {
      case "login":
        const authenticationToken = route.split("/")[1];
        this.props.dispatch(
          createLoginAction(false, null, authenticationToken)
        );
        break;
    }
  };

  onPress = () => {
    if (!this.state.email || !this.state.name) {
      Alert.alert("Achtung!", "Bitte fülle alle Felder aus.");
      return;
    }

    if (!EmailValidator.validate(this.state.email)) {
      Alert.alert("Achtung!", "Deine E-Mail Adresse sieht etwas seltsam aus.");
      return;
    }

    this.props
      .dispatch(login(this.state.name, this.state.email))
      .then(() =>
        Alert.alert(
          "Anmeldung",
          "Um deine Anmeldung abzuschliessen, muss du auf den Link klicken, den wir dir in einer Mail versendet haben.",
          [
            { text: "Okay!", onPress: () => {} },
            {
              text: "Verwende URL aus der Zwischenablage",
              onPress: () => Clipboard.getString().then(this.handleSchemaUrl)
            }
          ]
        )
      )
      .catch(e =>
        Alert.alert("Fehler", "Achtung es ist ein Fehler aufgetreten.")
      );
  };

  render() {
    return (
      <ViewWrapper>
        <Wrapper>
          <Text>
            Gib hier deine E-Mail Adresse ein um dich anzumelden oder zur
            registrieren
          </Text>
        </Wrapper>
        <Border />
        <Wrapper>
          <Textarea
            placeholder={"john@doe.com"}
            value={this.state.email}
            onChange={email => this.setState({ email })}
            multiline={false}
          />
        </Wrapper>
        <Border />
        <Wrapper>
          <Text>
            Gib hier noch deinen Namen ein. Dieser wird in deinen Beiträgen
            öffentlich angezeigt. Du kannst natürlich auch eine Spitz- oder
            Künstlernamen verwenden.
          </Text>
        </Wrapper>
        <Border />
        <Wrapper>
          <Textarea
            placeholder={"Johnny"}
            value={this.state.name}
            onChange={name => this.setState({ name })}
            multiline={false}
          />
        </Wrapper>
        <Border />
        <Button title="Anmelden" onPress={this.onPress} />
      </ViewWrapper>
    );
  }
}

const ConnectedWelcomeComponent = connect()(WelcomeComponent);

const Welcome = createStackNavigator(
  {
    Welcome: {
      screen: ConnectedWelcomeComponent
    }
  },
  {
    initialRouteName: "Welcome"
  }
);

export default Welcome;
