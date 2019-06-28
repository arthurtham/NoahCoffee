import React from 'react';
import { StyleSheet, Text, View, Button, Alert, SectionList, ActivityIndicator, Image, FlatList } from 'react-native';
import { createStackNavigator, createAppContainer, NavigationActions, StackActions } from 'react-navigation';
import { Input } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { ListView } from "react-native-web";
import Dialog from "react-native-dialog";
import moment from 'moment';

//const networkIP = "http://192.168.7.29";
const networkIP = "http://34.83.36.150/noahcoffee/";

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
                    disabled={false}
                    onPress={() => this.props.navigation.navigate('ConfirmationView')}
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
        title: 'Make it lit'
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
                <Text>Appointments are two hours, and the location is always random.</Text>
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
                    errorMessage={this.state.phoneValid ? "" : "US Phone must be 11 digits! (1 949 555 1212)"}
                />
                <Button title={"Use this info"} onPress={() => this._onSubmit()} />
                <Text>{ this.state.name } | {this.state.nameValid.toString()} </Text>
                <Text>{ this.state.phone } | {this.state.phoneValid.toString()} </Text>

                <Image
                    style={{width: 200, height: 200}}
                    source={require("./assets/coffee.jpg")}
                />
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

    static navigationOptions = {
        title: 'Make it free'
    };

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
                    <Text>Noah is free during these times.</Text>
                    <Text>Select a time that works for you.</Text>
                    <Text>Appointments are usually 2 hours in length.</Text>
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
        title: 'Make it official'
    };

    requestReservation() {
        this.setState({networkBusy: true});
        return fetch(networkIP+"/submitAppointment.php",
            {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.props.navigation.getParam("name","NONAME") ,
                    phone: this.props.navigation.getParam("phone","NOPHONE") ,
                    datetime: this.props.navigation.getParam("date","NODATE") ,
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({networkBusy: false});
                let code = this.handleRequest(responseJson);
                if (code === "error") {
                    throw "Failed submission: Check console for error JSON.";
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
        console.log(JSON.stringify(json));
        const status = json.status;
        if (status !== "success") {
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
        title: 'Deets set!'
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
                <Image
                    style={{width: 200, height: 200}}
                    source={require("./assets/noahHappy.jpg")}
                />
            </View>
        );
    }

}

class ConfirmationViewScreen extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            networkBusy: false,
            response: null,
            name: null,
            phone: null,
            datetime: null,
            code: "",
            codeValid: false,
            codeNetwork: null,
            dialogVisible: false,
        }
    }

    static navigationOptions = {
        title: 'View Deets'
    };

    requestDeletion() {
        const codeNetwork = this.state.codeNetwork;
        const datetime = this.state.datetime;
        this.setState({networkBusy: true});
        return fetch(networkIP+"/deleteAppointment.php",
            {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: codeNetwork ,
                    datetime: datetime,
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({networkBusy: false});
                let code = this.handleRequest(responseJson);
                if (code === "error") {
                    throw "Failed submission: Check console for error JSON.";
                } else {
                    this.setState({name: "Reservation deleted!"});
                    this.setState({phone: ""});
                    this.setState({datetime: ""});
                    this.setState( {codeNetwork: null});
                };
            })
            .catch((error) =>{
                console.error(error);
                this.setState({networkBusy: false});
            })
            .finally(() => {
                //this.setState({networkBusy: false});
            });
    }

    requestReservation() {
        const codeNetwork = this.state.code;
        this.setState({networkBusy: true});
        this.setState( {codeNetwork: null});
        return fetch(networkIP+"/getAppointment.php",
            {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: codeNetwork ,
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({networkBusy: false});
                let code = this.handleRequest(responseJson);
                if (code === "error") {
                    throw "Failed submission: Check console for error JSON.";
                } else {
                    this.setState({name: code.name});
                    this.setState({phone: code.phone});
                    this.setState({datetime: code.datetime});
                    this.setState( {codeNetwork: (code.phone.length > 0) ? codeNetwork : null});
                };
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
        console.log(JSON.stringify(json));
        const status = json.status;
        if (status !== "success") {
            return "error";
        };
        return json.details;
        //return json.toString();
    }

    validateAll() {
        return this.validateCode(this.state.code);
    }

    onReviewPress() {
        if (this.validateAll()) {
            this.requestReservation();
        }
    }

    onCancelPress() {
        this.setState({dialogVisible: false})
    }
    onDeletePress() {
        this.setState({dialogVisible: false})
        this.requestDeletion();
    }

    validateCode(code) {
        let booleanStatement = code.length == 6;
        this.setState({codeValid: (booleanStatement)});
        return booleanStatement;
    }

    render() {
        const activityBusy =  (this.state.networkBusy) ? (
                <ActivityIndicator/>
        ) : null;

        const activityDetails = (
            <View>
                <Text>Details: </Text>
                <Text>{ this.state.name }</Text>
                <Text>{ this.state.phone }</Text>
                <Text>{ this.state.datetime }</Text>
                <Button
                    title={"Delete Reservation"}
                    onPress={() => this.setState({dialogVisible: true})}
                    disabled={this.state.codeNetwork == null}
                    />
                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>Account delete</Dialog.Title>
                    <Dialog.Description>
                        Do you want to delete this account? You cannot undo this action.
                    </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={() => this.onCancelPress()} />
                    <Dialog.Button label="Delete" onPress={() => this.onDeletePress()} />
                </Dialog.Container>
            </View>
        );

        return (
            <View style={styles.container}>
                <Text>View Confirmation</Text>
                <Text>Enter your reservation code to review your reservation...</Text>
                <Input
                    name={"code"}
                    label={"Code"}
                    placeholder="Code"
                    value={this.state.code}
                    onChangeText={(code) => this.setState({ code })}
                    //onEndEditing={() => this.validateName(this.state.code)}
                    errorStyle={{ color: 'red'}}
                    errorMessage= {this.state.codeValid ? "" : "Code must be 6 letters/numbers!"}
                />
                <Button
                    title={"Review Reservation"}
                    onPress={() => this.onReviewPress()}
                    disabled={this.state.networkBusy}
                />
                { activityBusy }
                { activityDetails }
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
        ConfirmationView: ConfirmationViewScreen
    },
    {
        initialRouteName: "Home",
    }
);

export default createAppContainer(AppNavigator)

