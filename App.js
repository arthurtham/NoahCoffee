import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
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
            nameValid: true,
            phone: "",
            phoneValid: true,
        }
    }

    static navigationOptions = {
        title: 'Set Up Appointment'
    };

    _onSubmit() {
        Alert.alert("To be continued!")
    }

    validateName(name) {
        this.state.nameValid = (this.state.name.length > 0)
    }

    validatePhone(phone) {
        this.state.phoneValid = (this.state.phone.length == 11)
    }

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
                    onEndEditing={() => this.validateName()}
                    errorStyle={{ color: 'red'}}
                    errorMessage= {this.state.nameValid ? null : "Name can't be blank!"}
                />
                <Input
                    name={"phone"}
                    label={"Phone"}
                    keyboardType={"numeric"}
                    placeholder="19495551212"
                    value={this.state.phone}
                    onChangeText={(phone) => this.setState({ phone: phone.replace(/[^0-9]/g, '') })}
                    onEndEditing={() => this.validatePhone()}
                    maxLength={11}
                    errorStyle={{ color: 'red'}}
                    errorMessage={this.state.phoneValid ? null : "US Phone must be 11 digits! (19495551212)"}
                />
                <Button title={"Use this info"} onPress={() => this._onSubmit()} />
                <Text>{ this.state.name } | {this.state.nameValid.toString()} </Text>
                <Text>{ this.state.phone } | {this.state.phoneValid.toString()} </Text>
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

