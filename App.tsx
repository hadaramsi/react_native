import { FC, useState, useEffect } from 'react'
import { StatusBar, StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, Button, Alert, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'
import LoginScreen from './screens/LoginSrceen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import MyPostsScreen from './screens/MyPostsScreen'
import ChatScreen from './screens/ChatScreen'
import MyProfileScreen from './screens/MyProfileScreen'

const InfoScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Info Screen</Text>
    </View>
  );
}

// const Stack = createNativeStackNavigator()
// const StudentStackCp: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
//   const addNewStudents = () => {
//     navigation.navigate('StudentAdd')
//   }
//   return (
//     <StudentStack.Navigator>
//       <StudentStack.Screen name="StudentList" component={StudentList} options={{
//         headerRight: () => (
//           <TouchableOpacity
//             onPress={addNewStudents}>
//             <Ionicons name={'add-outline'} size={40} color={'gray'} />
//           </TouchableOpacity>
//         ),
//       }
//       } />
//       <StudentStack.Screen name="StudentDetails" component={StudentDetails} />
//       <StudentStack.Screen name="StudentAdd" component={StudentAdd} />
//     </StudentStack.Navigator>
//   );
// }

const Tab = createBottomTabNavigator();

const App: FC = () => {
  const Stack = createNativeStackNavigator()
  const [token, setToken] = useState()

  if (!token) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="LoginScreen">
            {(props) => (
              <LoginScreen
                route={props.route}
                navigation={props.navigation}
                setTokenFunction={setToken}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </Stack.Navigator>

      </NavigationContainer>
    )
  }
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === "My posts") {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === "My profile") {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === "Chat") {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="My profile" component={MyProfileScreen} />
        <Tab.Screen name="My posts" component={MyPostsScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
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

});

export default App
