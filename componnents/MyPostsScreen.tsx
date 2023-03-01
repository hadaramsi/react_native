import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { FC, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, FlatList, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'

import PostModel, { Post } from '../model/PostModel'

const ListItem: FC<{ name: String, text: String, image: String, userImage: String, postId: String, edit: any, deletePost: any }> =
    ({ name, text, image, userImage, postId, edit, deletePost }) => {
        const onDeleteCallback = async () => {
            try {
                console.log("delete try")
                const res = await PostModel.deletePost(postId)
                deletePost()
            } catch (err) {
                console.log("fail to open edit post screen")
            }
        }
        const onEditCallback = async () => {
            try {
                edit(postId)
            } catch (err) {
                console.log("fail to open edit post screen")
            }
        }
        return (
            <TouchableHighlight underlayColor={'gainsboro'}>
                <View style={styles.list}>
                    <View style={styles.listRowPosted}>
                        {userImage == "" && <Image style={styles.userImg} source={require('../assets/avatar.png')} />}
                        {userImage != "" && <Image style={styles.userImg} source={{ uri: userImage.toString() }} />}
                        <Text style={styles.name}>{name}</Text>
                        <TouchableOpacity onPress={onDeleteCallback} style={styles.deleteButton} >
                            <Ionicons name={"trash-bin"} size={30} color='tomato' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onEditCallback} style={styles.editButton}>
                            <Ionicons name={"build"} size={30} color='tomato' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listRowTextContainer}>
                        <Text style={styles.textPost}>{text}</Text>
                        {image == "" && <Image style={styles.listRowImage} source={require('../assets/avatar.png')} />}
                        {image != "" && <Image style={styles.listRowImage} source={{ uri: image.toString() }} />}
                    </View>
                </View>
            </TouchableHighlight>


        )
    }


const MyPostsList: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {

    const [posts, setPosts] = useState<Array<Post>>()
    const [pb, setPb] = useState(true)

    const onEditScreen = async (postId: String) => {
        navigation.navigate("PostEdit", { postId: postId })
    }
    const RefreshList = async () => {
        let posts: Post[] = []
        try {
            const userId = await AsyncStorage.getItem("userId")
            if (!userId) {
                console.log("fail fetching my posts ")
                return
            }
            posts = await PostModel.getUserPosts(userId)
            setPb(false)
        } catch (err) {
            console.log("fail fetching students " + err)
        }
        console.log("fetching finish")
        setPosts(posts)
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            RefreshList()
        })
        return unsubscribe
    })
    return (
        <View style={styles.flatlist}>
            <ActivityIndicator style={styles.pb} size={100} color="#00ff00" animating={pb} />

            <FlatList style={styles.flatlist}
                data={posts}
                keyExtractor={post => post.id.toString()}
                renderItem={({ item }) => (
                    <ListItem name={item.sender} text={item.message} image={item.imageUrl} userImage={item.userImageUrl}
                        postId={item.id} edit={onEditScreen} deletePost={RefreshList} />
                )}
            >
            </FlatList>


        </View>
    )
}

const styles = StyleSheet.create({
    pb: {
        alignSelf: 'center',
        position: 'absolute'
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
    listRowPosted: {
        margin: 4,
        flexDirection: "row",
        height: 50,
        elevation: 1,
        borderRadius: 2,
    },
    listRowImage: {
        margin: 4,
        // flex: 1,
        // resizeMode: "contain",
        height: 280,
        width: 390,
    },
    listRowTextContainer: {
        flex: 1,
        margin: 2,
        // justifyContent: "space-around"
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
        fontWeight: 'bold'
    },
    textPost: {
        fontSize: 20,
        margin: 4,
        // fontWeight: 'bold'
    },
    listRowId: {
        fontSize: 25
    }

})

export default MyPostsList

function deletePost() {
    throw new Error('Function not implemented.');
}
