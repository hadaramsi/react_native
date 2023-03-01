import React, { FC, useState, useEffect } from 'react'
import { StatusBar, StyleSheet, Text, View, Image, FlatList, ProgressBarAndroidBase, TouchableHighlight } from 'react-native'
import PostModel, { Post } from '../model/PostModel'

const ListItem: FC<{ name: String, text: String, image: String, userImage: String }> =
    ({ name, text, image, userImage }) => {
        return (
            <TouchableHighlight underlayColor={'gainsboro'}>
                <View style={styles.list}>
                    <View style={styles.listRowPosted}>
                        {userImage == "" && <Image style={styles.userImg} source={require('../assets/avatar.png')} />}
                        {userImage != "" && <Image style={styles.userImg} source={{ uri: userImage.toString() }} />}
                        <Text style={styles.name}>{name}</Text>
                    </View>
                    <View style={styles.listRowTextContainer}>
                        <Text style={styles.textPost}>{text}</Text>
                        {image == "" && <Image style={styles.listRowImage} source={require('../assets/avatar.png')} />}
                        {image != "" && <Image style={styles.listRowImage} source={{ uri: image.toString() }} />}
                    </View>
                    {/* <ProgressBarAndroidBase styleAttr="Horizontal" indeterminate={true} progress={0.5} /> */}

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
});

export default PostsList