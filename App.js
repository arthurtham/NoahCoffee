import React from 'react';
import { StyleSheet, Text, View, Button, Alert, SectionList } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Input } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import {ListView} from "react-native-web";

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home'
    };

    render() {
        return (
            <View style={styles.container}>
                <Text>Set up a Coffee appointment with Noah Ferrer!</Text>
                <Button
                    title={"Set up the deets"}
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
        title: 'Appointment'
    };

    _onSubmit() {
        if (this.validateAll()) {
            this.props.navigation.navigate('AppointmentSelect', {name: this.state.name, phone: this.state.phone})
        } else {
            Alert.alert("At least one error...")
        }
    }

    validateAll() {
        return (
            this.validateName(this.state.name)
            && this.validatePhone(this.state.phone)
        );
    }

    validateName(name) {
        let booleanStatement = name.length > 0;
        this.setState({nameValid: (booleanStatement)});
        return booleanStatement;
    }

    validatePhone(phone) {
        let booleanStatement = phone.length === 11
        this.setState({phoneValid: (booleanStatement)});
        return booleanStatement;
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
                    onEndEditing={() => this.validateName(this.state.name)}
                    errorStyle={{ color: 'red'}}
                    errorMessage= {this.state.nameValid ? "" : "Name can't be blank!"}
                />
                <Input
                    name={"phone"}
                    label={"Phone"}
                    keyboardType={"numeric"}
                    placeholder="19495551212"
                    value={this.state.phone}
                    onChangeText={(phone) => this.setState({ phone: phone.replace(/[^0-9]/g, '') })}
                    onEndEditing={() => this.validatePhone(this.state.phone)}
                    maxLength={11}
                    errorStyle={{ color: 'red'}}
                    errorMessage={this.state.phoneValid ? "" : "US Phone must be 11 digits! (19495551212)"}
                />
                <Button title={"Use this info"} onPress={() => this._onSubmit()} />
                <Text>{ this.state.name } | {this.state.nameValid.toString()} </Text>
                <Text>{ this.state.phone } | {this.state.phoneValid.toString()} </Text>
            </View>
        );
    }

}

class AppointmentSelectScreen extends React.Component {
    static navigationOptions = {
        title: 'Availability'
    };

    render() {
        const { navigation } = this.props;
        const name = navigation.getParam("name","NONAME");
        const phone = navigation.getParam("phone","NOPHONE");
        return (
            <View style={{
                flex: 1,
                justifyContent: 'flex-start'
            }}>
                <View style={styles.container}>
                    <Text>Using the following info:</Text>
                    <Text>{name}</Text>
                    <Text>{phone}</Text>
                    <Text>Here are some appointments:</Text>
                </View>
                <View style={styles.containerList}>
                    <SectionList
                        sections={[
                            {title: 'June', data: ['June 24th, 9am']},
                            {title: 'July', data: ['July 21th, 9am',
                                    'July 22th, 11am',
                                    'July 23th, 5pm',
                                    'July 24th, 9am',
                                    'July 25th, 8am']},
                        ]}
                        renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
                        renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                        keyExtractor={(item, index) => index}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    containerList: {
        flex: 5,
        paddingTop: 22,

    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

const AppNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        Personal: PersonalInfoScreen,
        AppointmentSelect: AppointmentSelectScreen,
    },
    {
        initialRouteName: "Home",
    }
)

export default createAppContainer(AppNavigator)

