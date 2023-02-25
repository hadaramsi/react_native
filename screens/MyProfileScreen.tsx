import React, { FC, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AntDesign } from '@expo/vector-icons'
import AuthModel, { Register } from '../model/AuthModel'
import * as ImagePicker from 'expo-image-picker'

const MyProfileScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    // const [avatarUri, setAvatarImage] = useState("")
    const onRegisterCallback = async () => {
        const register = {
            email: email,
            password: password,
            fullName: fullName,
            imageUrl: imageUrl
        }
        try {
            if (email != "" && password != "" && fullName != "") {
                if (imageUrl != "") {
                    console.log("uploading image")
                    const url = await AuthModel.uploadImage(imageUrl)
                    register.imageUrl = url
                    console.log("got url from upload: " + url)
                }
                await AuthModel.RegisterUser(register)
            }
        } catch (err) {
            console.log("fail register user: " + err)
        }
        navigation.goBack()
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
    const onEditProfileCallback = () => {
        //-------------------------------------to do ---------------------------------------
    }
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.text}>Your profile details</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    editable={false}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={'******'}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={fullName}
                />
                {imageUrl != "" && <Image source={{ uri: imageUrl }} style={styles.avatar}></Image>}
                <TouchableOpacity onPress={onEditProfileCallback} style={styles.button}>
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
        width: 200,
        height: 50,
        margin: 12,
        padding: 12,
        backgroundColor: 'salmon',
        borderRadius: 10,
    },
    textSade: {
        margin: 2,
        fontSize: 20,
        alignSelf: 'center',
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