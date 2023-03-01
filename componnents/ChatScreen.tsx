import React, { FC, useState } from "react"
import postModel, { Post } from "../model/PostModel"
import { StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity, TextInput, StatusBar, FlatList, TouchableHighlight } from "react-native"

import Ionicons from "@expo/vector-icons/Ionicons"
import Client, { Socket } from "socket.io-client"
import { DefaultEventsMap } from "@socket.io/component-emitter"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Message } from "../model/chatModel"
import userModel from "../model/UserModel"

let currentUserId: String | null
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined

const ListItem: FC<{
    sender: String, message: String, image: String, senderId: String
}> = ({ sender, message, image, senderId }) => {
    return (
        <TouchableHighlight underlayColor={"gainsboro"}>
            <View
                style={{
                    margin: 10,
                    flex: 1,
                    elevation: 1,
                    borderRadius: 3,
                    backgroundColor:
                        senderId == currentUserId ? "moccasin" : "blanchedalmond",
                    marginRight: senderId == currentUserId ? 0 : 4,
                    marginLeft: senderId == currentUserId ? 4 : 0,
                }}
            >
                <View style={styles.listRowUser}>
                    {image == "" && (<Image style={styles.userImage} source={require("../assets/avatar.png")} />)}
                    {image != "" && (<Image style={styles.userImage} source={{ uri: image.toString() }} />)}
                    <Text style={styles.userName}>{sender}</Text>

                </View>
                <View style={styles.listRow}>
                    {/* {image == "" && (<Image style={styles.userImage} source={require("../assets/avatar.png")} />)}
                    {image != "" && (<Image style={styles.userImage} source={{ uri: image.toString() }} />)} */}
                    <Text style={styles.messageText}>{message}</Text>
                </View>
            </View>
        </TouchableHighlight>
    )
}

const Chat: FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
    const [messages, setMessages] = useState<Array<Message>>()
    const [newMessage, setNewMessage] = useState("")
    const [pb, setPb] = useState(true)

    const clientSocketConnect = (
        clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>
    ): Promise<string> => {
        return new Promise((resolve) => {
            clientSocket.on("connect", () => {
                resolve("1")
            })
        })
    }

    const connectUser = async () => {
        const token = await AsyncStorage.getItem("accessToken")
        //פתיחת סוקט ללקוח
        socket = Client("http://192.168.1.154:3000", {
            auth: { token: "barrer " + token, },
        })
        await clientSocketConnect(socket)
        return socket
    }

    const sendMessage = () => {
        console.log(socket)
        if (socket != undefined) {
            socket.emit("chat:send_message", {
                message: newMessage,
            })
        }
        setPb(false)
    }

    const addUsernameToMessages = async (res: any) => {
        let messages = Array<Message>()
        console.log(res)
        if (res) {
            for (let i = 0; i < res.length; ++i) {
                const user: any = await userModel.getUserById(res[i].sender)
                const mes: Message = {
                    senderId: res[i].sender,
                    sender: user.fullName,
                    message: res[i].message,
                    image: user.image,
                    messageId: res[i]._id,
                }
                messages.push(mes)
            }
        }
        return messages;
    }

    const fetchMessages = (socket: any) => {
        socket.once("chat:get", async (arg: any) => {
            setMessages(await addUsernameToMessages(arg.body))
        })
        socket.emit("chat:get")
    }

    const updateUserId = async () => {
        currentUserId = await AsyncStorage.getItem("userId")
    }

    React.useEffect(() => {

        setPb(false)
        updateUserId()
        const subscribe = navigation.addListener("focus", async () => {
            console.log("focus")
            socket = await connectUser();
            //Register to each time that essage sent in the room
            socket.on("chat:message", (arg: { res: { body: { _id: string } } }) => {
                console.log("new message id === " + arg.res.body._id) // message id
                fetchMessages(socket)
                setNewMessage("")
            });
            if (socket != undefined) {
                fetchMessages(socket)
            }

        })

        const unsubscribe = navigation.addListener("blur", () => {
            console.log("unfocus")
            if (socket != undefined) socket.close()
        })

        return subscribe;
    }, [navigation, socket])

    return (
        <View style={styles.container}>
            <FlatList style={styles.flatlist}
                data={messages}
                keyExtractor={(message) => message.messageId.toString()}
                renderItem={({ item }) => (
                    <ListItem
                        sender={item.sender}
                        message={item.message}
                        image={item.image}
                        senderId={item.senderId}
                    />
                )}

            ></FlatList>
            <ActivityIndicator style={styles.pb} size={100} color="#00ff00" animating={pb} />

            <View style={styles.listRow}>
                <TextInput style={styles.input} onChangeText={setNewMessage} placeholder="send message" value={newMessage} />
                <TouchableOpacity onPress={sendMessage}>
                    <Ionicons name={"send"} style={styles.button} size={40} color='tomato'></Ionicons>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    pb: {
        alignSelf: 'center',
        position: 'absolute'
    },
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1,

    },
    listRow: {
        flexDirection: "row",
    },
    userImage: {
        resizeMode: "contain",
        height: 30,
        width: 30,
        borderRadius: 30,
        marginTop: 5,

    },
    userName: {
        fontSize: 15,
        marginTop: 10,
        marginLeft: 10,
        fontWeight: 'bold'
    },
    messageText: {
        fontSize: 20,
        marginTop: 4,
        marginLeft: 1,
    },
    listRowUser: {
        margin: 4,
        flexDirection: "row",
        height: 40,
        borderRadius: 2,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    button: {
        flex: 10,
        margin: 12
    },
    flatlist: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        marginLeft: 50,


    },
})

export default Chat