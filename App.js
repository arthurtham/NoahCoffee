import React from 'react';
import { StyleSheet, Text, View, Button, Alert, SectionList, ActivityIndicator, Image, FlatList } from 'react-native';
import { createStackNavigator, createAppContainer, NavigationActions, StackActions } from 'react-navigation';
import { Input } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { ListView } from "react-native-web";
import moment from 'moment';

const networkIP = "http://192.168.7.29";

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Noah: "Is it lit?"'
    };

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={{width: 200, height: 200}}
                    source={require("./assets/noah.png")}
                />
                <Text>Set up a Coffee appointment with Noah Ferrer!</Text>
                <Button
                    title={"Set up the deets"}
                    onPress={() => this.props.navigation.navigate('Personal')}
                />
                <Button
                    title={"View my deets"}
                    disabled={true}
                    />
                <Button
                    title={"About my deets app"}
                    disabled={true}
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
    constructor(props) {
        super(props)

        this.state = {
            networkBusy: false,
            networkData: null,
        }
    }

    componentWillMount() {
        this.requestAvailability();
    }

    requestAvailability() {
        this.setState({networkBusy: true});
        return fetch(networkIP+"/getAvailability.php")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({networkBusy: false});
                let code = this.handleRequest(responseJson);
                this.setState({networkData: code});
            })
            .catch((error) =>{
                console.error(error);
                this.setState({networkBusy: false});
            })
            .finally(() => {
                //this.setState({networkBusy: false});
            });
    }

    handleRequest(json) {
        return json;
    }

    static navigationOptions = {
        title: 'Availability'
    };

    GetSectionListItem(item) {
        //Alert.alert(item);
        this.props.navigation.navigate("Confirmation", {
            name: this.props.navigation.getParam("name","NONAME"),
            phone: this.props.navigation.getParam("phone","NOPHONE"),
            date: item,
        });
    }

    render() {
        const { navigation } = this.props;
        const name = navigation.getParam("name","NONAME");
        const phone = navigation.getParam("phone","NOPHONE");

        const availabilityList =  (this.state.networkBusy) ? (
            <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator/>
            </View>
        ) : (
        <View style={styles.containerList}>
            <Text style={styles.sectionHeader}>
                Noah's Availability
            </Text>
            <FlatList
                data={this.state.networkData}
                renderItem={({item}) => (<Text style={styles.item}
                                               onPress={this.GetSectionListItem.bind(this, item.datetime)}
                    >
                        { moment(item.datetime).format('MMM DD, YYYY | hh:mm A') }
                    </Text>)}
                keyExtractor={(item) => (item.id)}
            />
        </View>
        );

        return (
            <View style={{
                flex: 1,
                justifyContent: 'flex-start'
            }}>
                <View style={styles.container}>
                    <Text>Using the following info:</Text>
                    <Text>{name}</Text>
                    <Text>{phone}</Text>
                    <Text>In the next 7 days, Noah is free during these times.</Text>
                    <Text>Select a time that works for you.</Text>
                </View>
                { availabilityList }
            </View>
        )
    }
}

class ConfirmationScreen extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            networkBusy: false,
            response: null,
        }
    }

    static navigationOptions = {
        title: 'Confirm'
    };

    requestReservation() {
        this.setState({networkBusy: true});
        return fetch(networkIP+"/submitAppointment.php")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({networkBusy: false});
                let code = this.handleRequest(responseJson);
                if (code === "false") {
                    throw error("Failed submission");
                } else {
                    let resetAction = StackActions.reset({
                        index: 0, // <-- currect active route from actions array
                        actions: [
                            NavigationActions.navigate(
                                {
                                    routeName: "Successful",
                                    params: {
                                        "code": code,

                                    }
                                }),
                        ],
                    });
                    this.props.navigation.dispatch(resetAction);
                    //this.props.navigation.navigate("Successful", {code: code});
                }

            })
            .catch((error) =>{
                console.error(error);
                this.setState({networkBusy: false});
            })
            .finally(() => {
                //this.setState({networkBusy: false});
            });
    }

    handleRequest(json) {
        const status = json.status;
        console.log(status);
        if (status === "false") {
            return "error";
        };
        return json.code;
        //return json.toString();
    }

    render() {
        const activityBusy =  (this.state.networkBusy) ? (
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
        ) : null;

        return (
            <View style={styles.container}>
                <Text>Confirmation!</Text>
                <Text>Noah will use this information to contact you about your next coffee appointment</Text>
                <Text>{ this.props.navigation.getParam("name","NONAME") }</Text>
                <Text>{ this.props.navigation.getParam("phone","NOPHONE") }</Text>
                <Text>{ this.props.navigation.getParam("date","NODATE") }</Text>
                <Button
                    title={"Confirm Reservation"}
                    onPress={() => this.requestReservation()}
                    disabled={this.state.networkBusy}
                />
                { activityBusy }
            </View>
        );
    }

}

class ConfirmationSuccess extends React.Component {
    constructor(props) {
        super(props)

    }
    static navigationOptions = {
        title: 'Success'
    };

    returnHome() {
        let resetAction = StackActions.reset({
            index: 0, // <-- currect active route from actions array
            actions: [
                NavigationActions.navigate({ routeName: "Home" }),
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Success!</Text>
                <Text>Your appointment code is: {this.props.navigation.getParam("code","NOCODE")}</Text>
                <Text>It will also be texted to you!</Text>
                <Button
                    title={"Back home"}
                    onPress={() => this.returnHome()}
                />
            </View>
        );
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
        Confirmation: ConfirmationScreen,
        Successful: ConfirmationSuccess,
    },
    {
        initialRouteName: "Home",
    }
);

export default createAppContainer(AppNavigator)

