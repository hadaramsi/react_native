import React, { FC, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import UserModel from '../model/UserModel'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostModel from '../model/PostModel';

const MyProfileScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("******")
    const [fullName, setFullName] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    const getDetails = async () => {
        const userID = await AsyncStorage.getItem("userId")
        if (userID != null) {
            const user: any = await UserModel.getUserById(userID)
            setEmail(user.email)
            setFullName(user.fullName)
            setImageUrl(user.image)
            console.log("imageUrl000000000000000000000000000000000")
            console.log(imageUrl)
        }
    }
    const askPermission = async () => {
        try {
            const res = await ImagePicker.getCameraPermissionsAsync()
            if (!res.granted) {
                alert("camera permission is requiered!")
            }
        } catch (err) {
            console.log("ask permission error " + err)
        }
    }
    React.useEffect(() => {
        askPermission()
        getDetails()
    }, [])

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

    const onSaveCallback = async () => {
        try {
            let data
            if (password == "******") {
                data = { fullName: fullName, image: imageUrl, email: email }
            } else {
                data = { fullName: fullName, image: imageUrl, email: email, password: password }
            }
            if (imageUrl != "") {
                const url = await PostModel.uploadImage(imageUrl)
                data.image = url
            }
            const userId = await AsyncStorage.getItem("userId")
            if (userId != null) {
                console.log("user Id: -----------------" + userId)

                await UserModel.putUserById(userId, data)
            }
        } catch (err) {
            console.log("fail save changes")
        }
        navigation.goBack()
    }
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.text}>Your profile details</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    editable={false}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setFullName}
                    value={fullName}
                />
                {imageUrl == "" && <Image style={styles.avatar} source={require('../assets/avatar.png')} />}
                {imageUrl != "" && <Image style={styles.avatar} source={{ uri: imageUrl }} />}
                <View>
                    <TouchableOpacity onPress={openCamera} >
                        <Ionicons name={'camera'} style={styles.cameraButton} size={50} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openGallery} >
                        <Ionicons name={'image'} style={styles.galleryButton} size={50} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={onSaveCallback} style={styles.button}>
                    <Text style={styles.buttonText}>Save</Text>
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
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
    button: {
        width: 160,
        height: 50,
        margin: 12,
        padding: 12,
        backgroundColor: 'salmon',
        borderRadius: 10,
        alignSelf: 'center',
    },
    textSade: {
        margin: 2,
        fontSize: 20,
        alignSelf: 'center',
    },
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight

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
    icon: {
        flexDirection: "row",
        alignSelf: 'center',
    },
})
export default MyProfileScreen