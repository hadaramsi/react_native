import React, { FC, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, ToastAndroid } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AntDesign } from '@expo/vector-icons'
import AuthModel, { Register } from '../model/AuthModel'
import * as ImagePicker from 'expo-image-picker'
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [pb, setPb] = useState(false)
    const [googleToken, setGoogleToken] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [errorMes, setError] = useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: "2489142327-v8o5dq1o34at0of3putjkbeo1cg6j60u.apps.googleusercontent.com"

    });
    useEffect(() => {
        if (response?.type === "success") {
            if (response.authentication != null) {
                setGoogleToken(response.authentication.accessToken);
                getUserInfo();
            }
        }
    }, [response, googleToken]);

    useEffect(() => {

        if (userInfo != null) {
            const user: any = userInfo
            setEmail(user.email)
            setFullName(user.given_name + " " + user.family_name)
            setImageUrl(user.picture)
        }
    }, [userInfo]);
    const getUserInfo = async () => {
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${googleToken}` },
                }
            );
            const user = await response.json();
            setUserInfo(user);
        } catch (error) {
            // Add your own error handler here
        }
    }

    const onRegisterCallback = async () => {
        const register = {
            email: email,
            password: password,
            fullName: fullName,
            imageUrl: imageUrl
        }

        try {
            if (email != "" && password != "" && fullName != "") {
                setPb(true)
                if (imageUrl != "") {
                    console.log("uploading image")
                    const url = await AuthModel.uploadImage(imageUrl)
                    register.imageUrl = url
                    console.log("got url from upload: " + url)
                }

                let res = await AuthModel.RegisterUser(register)
                console.log("000000000000")
                console.log(res)
                if (res == null) {
                    setPb(false)
                    setError(true)
                    return
                }
                setPb(false)
            }
            else {
                setError(true)
                return
            }

        } catch (err) {
            console.log("fail register user: " + err)
        }
        navigation.goBack()
    }

    const onRegisterGoogleCallback = async () => {
        ToastAndroid.show("Google", ToastAndroid.LONG)
        setUserInfo(null)
        promptAsync()
    }

    const openCamera = async () => {
        try {
            const res = await ImagePicker.launchCameraAsync()
            if (!res.canceled && res.assets.length > 0) {
                const url = res.assets[0].uri
                setImageUrl(url)
            }

        } catch (err) {
            console.log("open camera error:" + err)
        }
    }

    const openGallery = async () => {
        try {
            const res = await ImagePicker.launchImageLibraryAsync()
            if (!res.canceled && res.assets.length > 0) {
                const url = res.assets[0].uri
                setImageUrl(url)
            }

        } catch (err) {
            console.log("open camera error:" + err)
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.text}>We are happy that you</Text>
                <Text style={styles.text}>want to join us</Text>
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
                <TextInput
                    style={styles.input}
                    onChangeText={setFullName}
                    value={fullName}
                    placeholder={'Full name'}
                />
                {errorMes && (<Text style={{ fontSize: 20, color: "red", alignSelf: "center", }}>Worng input </Text>
                )}
                {/* <Text style={styles.textSade}>Uplude image</Text> */}
                {imageUrl == "" && < Image source={require('../assets/avatar.png')} style={styles.avatar}></Image>}
                {imageUrl != "" && <Image source={{ uri: imageUrl }} style={styles.avatar}></Image>}

                <View>
                    <TouchableOpacity onPress={openCamera} >
                        <Ionicons name={'camera'} style={styles.cameraButton} size={50} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openGallery} >
                        <Ionicons name={'image'} style={styles.galleryButton} size={50} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.textSade}>Register with:</Text>
                <View style={styles.icon}>
                    {/* <TouchableOpacity onPress={onRegisterCallback}>
                        <Ionicons name={"logo-facebook"} size={50} color="blue" />
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={onRegisterGoogleCallback}>
                        <Ionicons name={"logo-google"} size={50} color="gray" />
                    </TouchableOpacity>
                </View>
                <ActivityIndicator style={styles.pb} size={100} color="#00ff00" animating={pb} />


                <TouchableOpacity onPress={onRegisterCallback} style={styles.button}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

            </View>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    text: {
        margin: 2,
        fontSize: 30,
        alignSelf: 'center',
    },
    textSade: {
        margin: 2,
        fontSize: 20,
        alignSelf: 'center',
    },
    container: {
        flex: 1,
    },
    pb: {
        alignSelf: 'center',
        position: 'absolute'
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
        height: 40,
        width: 300,
        margin: 5,
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        alignSelf: 'center',
    },
    buttonesContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    button: {
        width: 120,
        height: 50,
        margin: 8,
        padding: 8,
        backgroundColor: 'salmon',
        borderRadius: 10,
        alignSelf: 'center',
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
        alignSelf: 'center',
    },
});
export default RegisterScreen