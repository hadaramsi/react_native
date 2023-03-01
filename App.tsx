import { FC, useState, useEffect } from 'react'
import { StatusBar, StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, Button, Alert, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'
import LoginScreen from './componnents/LoginSrceen'
import RegisterScreen from './componnents/RegisterScreen'
import PostsList from './componnents/postsList'
import MyPostsScreen from './componnents/MyPostsScreen'
import ChatScreen from './componnents/ChatScreen'
import MyProfileScreen from './componnents/MyProfileScreen'
import PostAdd from './componnents/PostAdd'
import apiClient from './api/ClientApi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MyPostsList from './componnents/MyPostsScreen'
import PostEdit from './componnents/PostEdit'

const Tab = createBottomTabNavigator()

const PostsStack = createNativeStackNavigator()
const PostsStackCp: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const addNewPost = () => {
    navigation.navigate('PostAdd')
  }
  return (
    <PostsStack.Navigator>
      <PostsStack.Screen name="Posts List" component={PostsList} options={{
        headerRight: () => (
          <TouchableOpacity
            onPress={addNewPost}>
            <Ionicons name={'add-outline'} size={40} color={'tomato'} />
          </TouchableOpacity>
        ),
      }} />
      <PostsStack.Screen name='Add Post' component={PostAdd} />
    </PostsStack.Navigator>

  )
}
const MyPostsStack = createNativeStackNavigator()
const MyPostsStackCp: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const addNewPost = () => {
    navigation.navigate('PostAdd')
  }
  return (
    <MyPostsStack.Navigator>
      <MyPostsStack.Screen name="My posts List" component={MyPostsList} options={{
        headerRight: () => (
          <View style={styles.row}>
            <TouchableOpacity
              onPress={addNewPost}>
              <Ionicons name={'add-outline'} size={40} color={'tomato'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addNewPost}>
              <Ionicons name={'power-outline'} size={40} color={'tomato'} />
            </TouchableOpacity>
          </View>

        ),
      }} />
      <MyPostsStack.Screen name='Edit Post' component={PostEdit} />
    </MyPostsStack.Navigator>

  )
}
const logout = async () => {
  await AsyncStorage.clear()
  setTokenC(null)
  updateToken()
}

let setTokenC: any
const updateToken = async () => {
  const token = await AsyncStorage.getItem("accessToken")
  // await AsyncStorage.clear()
  if (token != null) {
    apiClient.setHeader("Authorization", "JWT " + token)
    return setTokenC(token)
  }
}

const App: FC = () => {
  const Stack = createNativeStackNavigator()
  const [token, setToken] = useState()
  setTokenC = setToken
  updateToken()
  if (!token) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                route={props.route}
                navigation={props.navigation}
                setTokenFunction={setToken}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>

      </NavigationContainer>
    )
  }
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === "Home") {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === "My posts") {
            iconName = focused ? 'book' : 'book-outline'
          } else if (route.name === "My profile") {
            iconName = focused ? 'briefcase' : 'briefcase-outline'
          } else if (route.name === "Chat") {
            iconName = focused ? 'chatbox' : 'chatbox-outline'
          }
          return <Ionicons name={iconName} size={size} color={color} />
        },
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ margin: 3 }}>
            <Ionicons name={"power-outline"} size={40} color={"tomato"} />
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'salmon',
      })}>
        <Tab.Screen name="Home" component={PostsStackCp} options={{ headerShown: false }} />
        <Tab.Screen name="My profile" component={MyProfileScreen} />
        <Tab.Screen name="My posts" component={MyPostsStackCp} options={{ headerShown: false }} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        {/* <Tab.Screen name="Add" component={PostsStackCp} /> */}

      </Tab.Navigator>

    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: 'grey',
  },
  row: {
    flexDirection: "row",
  },

})

export default App
