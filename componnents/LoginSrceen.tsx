import React, { FC, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import AuthModel, { Login } from '../model/AuthModel'
import ClientApi from '../api/ClientApi'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen: FC<{ route: any, navigation: any, setTokenFunction: any }> = ({ route, navigation, setTokenFunction }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const onLoginCallback = async () => {
        const login = {
            email: email,
            password: password,
        }
        try {
            if (email != "" && password != "") {
                const res = await AuthModel.loginUser(login)
                if (res == "") {
                    console.log("res is null")
                    return
                }
                console.log(res.tokens.accessToken)
                setTokenFunction(res.tokens.accessToken)
                ClientApi.setHeader(
                    "Authorization",
                    "JWT " + res.tokens.accessToken
                )
                await AsyncStorage.setItem("accessToken", res.tokens.accessToken)
                await AsyncStorage.setItem("refreshToken", res.tokens.refreshToken)
                await AsyncStorage.setItem("userId", res.userId)
            }
        } catch (err) {
            console.log("fail adding user: " + err)
        }

        // navigation.navigate("RegisterScreen")
    }
    const onRegisterCallback = () => {
        navigation.navigate("RegisterScreen")
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.text}>Welcome!</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder={'Email'}
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder={'Password'}
            />
            <TouchableOpacity onPress={onLoginCallback} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onRegisterCallback}>
                <Text style={styles.textRegister}>Not register yet? Click here</Text>
            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({
    text: {
        margin: 5,
        fontSize: 50,
    },
    textRegister: {
        margin: 5,
        fontSize: 30,
    },
    container: {
        flex: 1,
    },
    avatar: {
        height: 250,
        resizeMode: "contain",
        alignSelf: 'center',
        width: '100%'
    },
    cameraButton: {
        position: 'absolute',
        bottom: -10,
        left: 10,
        width: 50,
        height: 50,
    },
    galleryButton: {
        position: 'absolute',
        bottom: -10,
        right: 10,
        width: 50,
        height: 50,
    },
    input: {
        height: 50,
        width: 350,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    buttonesContainer: {
        flexDirection: 'row',
    },
    button: {
        width: 200,
        height: 50,
        margin: 12,
        padding: 12,
        backgroundColor: 'salmon',
        borderRadius: 10,
    },
    imageButton: {
        width: 200,
        height: 50,
        margin: 12,
        padding: 12,
        backgroundColor: 'pink',
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
    icon: {
        // marginTop: StatusBar.currentHeight,
        // flex: 1,
        // backgroundColor: 'grey',
        flexDirection: "row",
    },
});
export default LoginScreen