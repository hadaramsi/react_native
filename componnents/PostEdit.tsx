import { useState, FC, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import PostModel, { Post } from '../model/PostModel'
import * as ImagePicker from 'expo-image-picker'
import React from "react"

const PostEdit: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [text, setPostText] = useState("")
    const [imageUri, setImageUri] = useState("")
    const [pb, setPb] = useState(true)

    let postId = route.params.postId

    const getDetails = async () => {
        const post: any = await PostModel.getPostById(postId)
        if (post != null) {
            setPostText(post.post.message)
            setImageUri(post.post.imageUrl)
        }
        setPb(false)
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
    useEffect(() => {
        getDetails()
        askPermission()
    }, [])

    const openCamera = async () => {
        try {
            const res = await ImagePicker.launchCameraAsync()
            if (!res.canceled && res.assets.length > 0) {
                const uri = res.assets[0].uri
                setImageUri(uri)
            }

        } catch (err) {
            console.log("open camera error:" + err)
        }
    }

    const openGallery = async () => {
        try {
            const res = await ImagePicker.launchImageLibraryAsync()
            if (!res.canceled && res.assets.length > 0) {
                const uri = res.assets[0].uri
                setImageUri(uri)
            }

        } catch (err) {
            console.log("open camera error:" + err)
        }
    }

    const onSaveCallback = async () => {
        try {
            let data: any = { message: text, imageUrl: imageUri }
            if (imageUri != "") {
                const url = await PostModel.uploadImage(imageUri)
                data.imageUri = url
            }
            setPb(true)
            if (postId != null) {
                await PostModel.putPostById(postId, data)
            }
            setPb(false)
        } catch (err) {
            console.log("fail save changes")
        }
        navigation.goBack()
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View>
                    {imageUri == "" && <Image source={require('../assets/avatar.png')} style={styles.avatar}></Image>}
                    {imageUri != "" && <Image source={{ uri: imageUri }} style={styles.avatar}></Image>}

                    <TouchableOpacity onPress={openCamera} >
                        <Ionicons name={'camera'} style={styles.cameraButton} size={50} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openGallery} >
                        <Ionicons name={'image'} style={styles.galleryButton} size={50} />
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.input}
                    onChangeText={setPostText}
                    value={text}
                    placeholder={'text'}
                />
                <ActivityIndicator style={styles.pb} size={100} color="#00ff00" animating={pb} />

                <View style={styles.buttonesContainer}>
                    <TouchableOpacity onPress={onSaveCallback} style={styles.button}>
                        <Text style={styles.buttonText}>SAVE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    pb: {
        alignSelf: 'center',
        position: 'absolute'
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
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    buttonesContainer: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        margin: 12,
        padding: 12,
        backgroundColor: 'tomato',
        borderRadius: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    }
});

export default PostEdit
