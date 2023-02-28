import React, { FC, useState, useEffect } from 'react'
import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, FlatList, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import PostModel, { Post } from '../model/PostModel'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListItem: FC<{ name: String, text: String, image: String, userImage: String }> =
    ({ name, text, image, userImage }) => {

        return (
            <TouchableHighlight underlayColor={'gainsboro'}>
                <View style={styles.list}>
                    <View style={styles.listRowPosted}>
                        {userImage == "url" && <Image style={styles.userImg} source={require('../assets/avatar.png')} />}
                        {userImage != "url" && <Image style={styles.userImg} source={{ uri: userImage.toString() }} />}
                        <Text style={styles.name}>{name}</Text>
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

const PostsList: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [posts, setPosts] = useState<Array<Post>>();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            let posts: Post[] = []
            try {
                posts = await PostModel.getAllPosts()
            } catch (err) {
                console.log("fail fetching students " + err)
            }
            console.log("fetching finish")
            setPosts(posts)
        })
        return unsubscribe
    })


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
    button: {
        position: 'absolute',
        bottom: -10,
        left: 10,
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
        fontSize: 40
    },
    userImg: {
        margin: 8,
        resizeMode: "contain",
        height: 35,
        width: 35,
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
});

export default PostsList