import { FC, useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Button, Alert, TextInput, FlatList, TouchableHighlight } from 'react-native';

import PostModel, { Post } from '../model/PostModel'

const ListItem: FC<{ name: String, text: String, image: String }> =
    ({ name, text, image }) => {
        return (
            <TouchableHighlight underlayColor={'gainsboro'}>
                <View style={styles.listRow}>
                    <Text style={styles.name}>{name}</Text>
                    {image == "" && <Image style={styles.listRowImage} source={require('../assets/ava.png')} />}
                    {image != "" && <Image style={styles.listRowImage} source={{ uri: image.toString() }} />}
                    <Text style={styles.textPost}>{text}</Text>
                    {/* <View style={styles.listRowTextContainer}>
                        <Text style={styles.listRowName}>{name}</Text>
                        <Text style={styles.listRowId}>{id}</Text>
                    </View> */}
                </View>
            </TouchableHighlight>
        )
    }


const PostsList: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    // const onRowSelected = (id: String) => {
    //     console.log("in the list: row was selected " + id)
    //     navigation.navigate('StudentDetails', { studentId: id })
    // }
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
                <ListItem name={item.name} text={item.text} image={item.image} onRowSelected={onRowSelected} />
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