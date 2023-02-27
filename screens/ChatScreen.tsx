import React, { FC, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList
} from 'react-native'
import PostModel, { Post } from '../model/PostModel';

const ChatItems: FC<{ name: String, message: String, senderImage: String }> = ({ name, message, senderImage }) => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.listRow}>
                    <View style={styles.listRowPosted}>
                        <Text style={styles.name}>{name}</Text>
                        {senderImage == "" && <Image style={styles.senderImg} source={require('../assets/avatar.png')} />}
                        {senderImage != "" && <Image style={styles.senderImg} source={{ uri: senderImage.toString() }} />}
                    </View>
                    <View style={styles.listRowTextContainer}>
                        <Text style={styles.textMessage}>{message}</Text>
                    </View>
                </View>
            </View>
        </ScrollView >
    )
}

const ChatScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [messages, setMessages] = useState<Array<Post>>();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            console.log('focus')
            let messages: Post[] = []
            try {
                messages = await PostModel.getAllPosts()
                console.log("fetching posts complete")
            } catch (err) {
                console.log("fail fetching students " + err)
            }
            console.log("fetching finish")
            setMessages(messages)
        })
        return unsubscribe
    })


    return (
        <FlatList style={styles.flatlist}
            data={messages}
            keyExtractor={post => post.id.toString()}
            renderItem={({ item }) => (
                <ChatItems name={item.sender} message={item.message} senderImage={item.senderImage} />
            )}
        >
        </FlatList>

    )
}

const styles = StyleSheet.create({
    listRowTextContainer: {
        flex: 1,
        margin: 10,
        justifyContent: "space-around"
    },
    flatlist: {
        flex: 1,
    },
    senderImg: {
        margin: 8,
        resizeMode: "contain",
        height: 30,
        width: 30,
        borderRadius: 30,
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
    textMessage: {
        fontSize: 15,
        margin: 4,
    },
    container: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        marginTop: 10,
    },
    avatar: {
        height: 250,
        resizeMode: "contain",
        alignSelf: 'center',
        width: '100%'
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
export default ChatScreen