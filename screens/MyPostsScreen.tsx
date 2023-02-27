import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { FC, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, FlatList, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'

import PostModel, { Post } from '../model/PostModel'

const ListItem: FC<{ name: String, text: String, image: String, userImage: String }> =
    ({ name, text, image, userImage }) => {
        const onDeleteCallback = async () => {
            try {

            } catch (err) {
                console.log("fail register user: " + err)
            }
        }
        const onEditCallback = async () => {

            try {

            } catch (err) {
                console.log("fail register user: " + err)
            }
        }
        return (
            <TouchableHighlight underlayColor={'gainsboro'}>
                <View style={styles.list}>
                    <View style={styles.listRowPosted}>
                        {userImage == "url" && <Image style={styles.userImg} source={require('../assets/avatar.png')} />}
                        {userImage != "url" && <Image style={styles.userImg} source={{ uri: userImage.toString() }} />}
                        <Text style={styles.name}>{name}</Text>
                        <TouchableOpacity onPress={onDeleteCallback} style={styles.deleteButton} >
                            <Ionicons name={"trash-bin"} size={30} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onEditCallback} style={styles.editButton}>
                            <Ionicons name={"build"} size={30} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listRowTextContainer}>
                        <Text style={styles.textPost}>{text}</Text>
                        {image == "url" && <Image style={styles.listRowImage} source={require('../assets/avatar.png')} />}
                        {image != "url" && <Image style={styles.listRowImage} source={{ uri: image.toString() }} />}
                    </View>
                </View>
            </TouchableHighlight>


        )
    }


const MyPostsList: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {

    const [posts, setPosts] = useState<Array<Post>>();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            let posts: Post[] = []
            try {
                const userId = await AsyncStorage.getItem("userId")
                if (!userId) {
                    console.log("fail fetching my posts ")
                    return
                }
                posts = await PostModel.getUserPosts(userId)
            } catch (err) {
                console.log("fail fetching students " + err)
            }
            console.log("fetching finish")
            setPosts(posts)
        })
        return unsubscribe
    })

    const onDeleteCallback = async () => {
        try {

        } catch (err) {
            console.log("fail register user: " + err)
        }
    }
    const onEditCallback = async () => {

        try {

        } catch (err) {
            console.log("fail register user: " + err)
        }
    }
    return (
        <FlatList style={styles.flatlist}
            data={posts}
            keyExtractor={post => post.id.toString()}
            renderItem={({ item }) => (
                <ListItem name={item.sender} text={item.message} image={item.imageUrl} userImage={item.userImageUrl} />
            )}
        >
        </FlatList>
    )
}


const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: 'grey',
    },
    flatlist: {
        flex: 1,
    },
    list: {
        margin: 4,
        flex: 1,
        elevation: 1,
        borderRadius: 2,
    },
    deleteButton: {
        position: 'absolute',
        bottom: -10,
        right: 0,
        width: 50,
        height: 50,
    },
    editButton: {
        position: 'absolute',
        bottom: -10,
        right: 35,
        width: 50,
        height: 50,
    },
    listRowPosted: {
        margin: 4,
        flexDirection: "row",
        height: 50,
        elevation: 1,
        borderRadius: 2,
    },
    listRowImage: {
        margin: 10,
        resizeMode: "contain",
        height: 130,
        width: 130,
    },
    listRowTextContainer: {
        flex: 1,
        margin: 10,
        justifyContent: "space-around"
    },
    listRowName: {
        fontSize: 30
    },
    userImg: {
        margin: 8,
        resizeMode: "contain",
        height: 40,
        width: 40,
        borderRadius: 30,
    },
    name: {
        fontSize: 20,
        marginTop: 10,
    },
    textPost: {
        fontSize: 20,
        margin: 4,
    },
    listRowId: {
        fontSize: 25
    }
    // container: {
    //     marginTop: StatusBar.currentHeight,
    //     flex: 1,
    //     backgroundColor: 'grey',
    //     alignSelf: 'center',

    // },
    // flatlist: {
    //     flex: 1,
    // },
    // list: {
    //     margin: 4,
    //     flex: 1,
    //     elevation: 1,
    //     borderRadius: 2,
    // },
    // listRow: {
    //     margin: 4,
    //     flexDirection: "row",
    //     height: 50,
    //     elevation: 1,
    //     borderRadius: 2,

    // },
    // button: {
    //     position: 'absolute',
    //     bottom: -10,
    //     left: 10,
    //     width: 50,
    //     height: 50,
    // },
    // listRowImage: {
    //     margin: 10,
    //     resizeMode: "contain",
    //     height: 80,
    //     width: 50,
    //     alignSelf: 'center',
    // },
    // listRowTextContainer: {
    //     flex: 1,
    //     margin: 10,
    //     justifyContent: "space-around"

    // },
    // listRowName: {
    //     fontSize: 20,
    //     alignSelf: 'center',

    // },
    // name: {
    //     fontSize: 8,
    //     marginTop: 10,
    // },
    // textPost: {
    //     fontSize: 10,
    //     margin: 4,
    //     alignSelf: 'center',

    // },
    // icon: {
    //     flexDirection: "row",
    // },
    // listRowId: {
    //     fontSize: 25
    // },
    // userImg: {
    //     margin: 8,
    //     resizeMode: "contain",
    //     height: 30,
    //     width: 30,
    //     borderRadius: 30,
    // },
});

export default MyPostsList