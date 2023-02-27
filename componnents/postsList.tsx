import React, { FC, useState, useEffect } from 'react'
import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, FlatList, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import PostModel, { Post } from '../model/PostModel'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const ListItem: FC<{ name: String, text: String, image: String, userImage: String }> =
    ({ name, text, image, userImage }) => {
        return (
            <TouchableHighlight underlayColor={'gainsboro'}>
                <View style={styles.listRow}>
                    <View style={styles.listRowPosted}>
                        <Text style={styles.name}>{name}</Text>
                        {userImage == "" && <Image style={styles.userImg} source={require('../assets/avatar.png')} />}
                        {userImage != "" && <Image style={styles.userImg} source={{ uri: userImage.toString() }} />}
                    </View>
                    <View style={styles.listRowTextContainer}>
                        <Text style={styles.textPost}>{text}</Text>
                        {image == "" && <Image style={styles.listRowImage} source={require('../assets/avatar.png')} />}
                        {image != "" && <Image style={styles.listRowImage} source={{ uri: image.toString() }} />}
                        <Text style={styles.listRowName}>{name}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

const PostsList: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const onRowSelected = (id: String) => {
        console.log("in the list: row was selected " + id)
        navigation.navigate('StudentDetails', { studentId: id })
    }
    const [posts, setPosts] = useState<Array<Post>>();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            console.log('focus')
            let posts: Post[] = []
            try {
                posts = await PostModel.getAllPosts()
                console.log("fetching posts complete")
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
                <ListItem name={item.sender} text={item.message} image={item.imageUrl} userImage={item.imageUrl} />
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
    listRow: {
        margin: 4,
        flexDirection: "row",
        height: 150,
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
        height: 30,
        width: 30,
        borderRadius: 30,
    },
    name: {
        fontSize: 20,
        marginTop: 10,
    },
    textPost: {
        fontSize: 15,
        margin: 4,
    },
    listRowId: {
        fontSize: 25
    }
});

export default PostsList