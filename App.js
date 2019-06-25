import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Input } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home'
    };

    render() {
        return (
            <View style={styles.container}>
                <Text>Open up App.js to start working on your app!</Text>
                <Button
                    title={"Go to Details"}
                    onPress={() => this.props.navigation.navigate('Personal')}
                />
            </View>
        );
    }

}

class PersonalInfoScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            phone: "",
        }
    }

    static navigationOptions = {
        title: 'Set Up Appointment'
    };

    render() {
        return (
            <View style={styles.container}>
                <Text>Set up an appointment with Noah Ferrer!</Text>
                <Input
                    name={"name"}
                    label={"Name"}
                    placeholder="Name"
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name })}
                />
                <Input
                    name={"phone"}
                    label={"Phone"}
                    keyboardType={"numeric"}
                    placeholder="19495551212"
                    value={this.state.phone}
                    onChangeText={(phone) => this.setState({ phone: phone.replace(/[^0-9]/g, '') })}
                    maxLength={11}
                />
                <Text>{ this.state.name }</Text>
                <Text>{ this.state.phone }</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const AppNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        Personal: PersonalInfoScreen,
    },
    {
        initialRouteName: "Home",
    }
)

export default createAppContainer(AppNavigator)

