import * as React from 'react';
import { useEffect,useState } from 'react';
import { View,StyleSheet,Text,Image,TouchableOpacity,Pressable,BackHandler  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createNavigationContainerRef } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { DrawerActions } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
//screen imports
import HomeScreen from './screens/Home';
import ChannelScreen from './screens/Channel';
import NewsScreen from './screens/News';
import Downloads from './screens/Downloads';
import WatchLater from './screens/WatchLater';
import LiveTv from './screens/LiveTv';
import Exclusive from './screens/Exclusive';
import Movies from './screens/Movies';
import TvShows from './screens/TvShows';
import Search from './screens/search';
import Subscribe from './screens/subscribe';
import CustomeVideoPlayer from './screens/Video';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Top = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();
const ref = createNavigationContainerRef();

function MyFooterTabs() {
  return (
    <Tab.Navigator
    screenOptions={({route})=>({
      tabBarActiveTintColor: '#ffc908',
      tabBarInactiveTintColor: '#ffffff',
      tabBarStyle:{backgroundColor:'#23285b'},
      tabBarIcon: ({focused,size,color})=>{
        let iconName;
        if(route.name==='HomeFooter')
        {
          iconName='home';
          //size = focused ? 25 : 20
          //color = focused ? '#f0ff' : '#555'
        }
        else
        if(route.name==='TVChannels')
        {
          iconName='television-classic';
        }
        else
        if(route.name==='News')
        {
          iconName='newspaper-variant-multiple-outline';
        }
        else
        if(route.name==='Downloads')
        {
          iconName='download';
        }
        else
        if(route.name==='WatchLater')
        {
          iconName='sticker-plus';
        }
        return (
          <MaterialCommunityIcons
          name={iconName}
          size={size}
          color={color}
          ></MaterialCommunityIcons>
        )
      }

    })}
    >
      <Tab.Screen name="HomeFooter" component={MyTopTabs} style={styles.FooterText} options={{header:()=>null,tabBarLabel: 'Home', }}/>
      <Tab.Screen name="TVChannels" component={ChannelScreen}  style={styles.FooterText} options={{header:()=>null,}}/>
      <Tab.Screen name="News" component={NewsScreen}  style={styles.FooterText} options={{header:()=>null}}/>
      <Tab.Screen name="Downloads" component={Downloads}  style={styles.FooterText} options={{header:()=>null}}/>
      <Tab.Screen name="WatchLater" component={WatchLater}  style={styles.FooterText} options={{header:()=>null}}/>
    </Tab.Navigator>
  );
}

function MyTopTabs(){
  return (
  <Top.Navigator
  initialRouteName='HomeScreen'
  lazyLoad={true}
  screenOptions={({ route }) => ({
    swipeEnabled:false, 
    tabBarActiveTintColor: "#ffffff",
    tabBarInactiveTintColor: "#ffffff",
    tabBarPressColor: "#191D4F",
    tabBarScrollEnabled: true,
    tabBarItemStyle: {
      width: 100,
      textAlign: "center",
      justifyContent: "center",
      flex: 1
    },
    tabBarIndicatorStyle: {
      backgroundColor: "#7249BF",
      height: 43,
      borderRadius: 50,
      width: 85,
      marginLeft: 7
    },
    tabBarStyle: {
      backgroundColor: "#191D4F",
      height: 45,
      width: "100%",
      textAlign: "center",
      justifyContent: "center"
    }

  })}
      sceneContainerStyle={{ backgroundColor: "white" }}
      >
        <Top.Screen
        name='HomeScreen'
        component={HomeScreen}
        options={{header:()=>null,
          tabBarLabel: 'Home',
        }}
        >
        </Top.Screen>

        <Top.Screen
        name='Live Tv'
        component={LiveTv}
        options={{header:()=>null}}
        style={styles.roundedTab}
        ></Top.Screen>

        <Top.Screen
        name='Exclusive'
        component={Exclusive}
        >
        </Top.Screen>

        <Top.Screen
        name='Movies'
        component={Movies}
        >
        </Top.Screen>

        <Top.Screen
        name='TvShows'
        component={TvShows}
        >
        </Top.Screen>
      </Top.Navigator> 

  );
}


const CustomDrawer = (props) =>{
  return(
    <View style={{flex:1}}>
    <DrawerContentScrollView {...props}>
      <View style={{flexDirection:'row', justifyContent:'space-between', padding:20, alignItems:'center', backgroundColor:'#f6f6f6',marginBottom:20,}}>
        <View>
          <Text>Hari</Text>
          <Text>hari.sainath@etv.co.in</Text>
        </View>
        <Image
        style={styles.profilePic}
        source={require('./assets/images/logo.png')}
      />
      </View>
      <DrawerItemList  {...props}></DrawerItemList>
    </DrawerContentScrollView>
    <Text style={{position:'absolute',bottom:0,fontSize:10,fontWeight:'bold',right:0}}>v.1.1.1</Text>
    </View>
  );
}

function MyDrawer({navigation}){
  return (

    <Drawer.Navigator
    initialRouteName='Home'
    screenOptions={{
      drawerType:"back",
      drawerPosition: 'left',
      swipeEnabled:true,
      gestureEnabled:true,
      headerTitleAlign: 'center',
      headerTitle:'',
      drawerStyle:{backgroundColor:'#ffffff'},
      headerStyle:{backgroundColor:'#191D4F',elevation:0,shadowOpacity:0},
      headerTintColor:'#fff',
      headerTitleStyle:{
        fontSize:25,
      }
    }} 
    drawerContent={(props) => <CustomDrawer {...props}></CustomDrawer>}
    >
      <Drawer.Screen
      name='Home'
      component={MyFooterTabs}
      options={{
        headerRight: () => (
          <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, alignItems:'center', }}>
            <TouchableOpacity  onPress={() => navigation.navigate('Subscribe')} >
            <Image source={require('./assets/images/subscribe.png')} style={{width:130,resizeMode:'contain',}}></Image>
            </TouchableOpacity>
          <TouchableOpacity  onPress={() => navigation.navigate('Search')} style={{marginRight:10,marginLeft:7}}>
            <FontAwesome5 name="search" size={20} color="white" />
          </TouchableOpacity>
          </View>
        ),
        headerLeft: () => (
          <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, alignItems:'center', }}>
            <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <MaterialCommunityIcons 
            name='menu'
            size={25}
            color='#ffffff'
            ></MaterialCommunityIcons>
            </Pressable>
            <Image source={require('./assets/images/logo.png')} style={{width:115,resizeMode:'contain',marginLeft:5}}></Image>
          </View>
        )
      }}
      >
      </Drawer.Screen>
      <Drawer.Screen
      name='Live Tv'
      component={LiveTv}
      >
      </Drawer.Screen>
      <Drawer.Screen
      name='CustomeVideoPlayer'
      component={CustomeVideoPlayer}
      options={() =>
        ({
          header:()=>null,
        })}
      >
      </Drawer.Screen>
    </Drawer.Navigator>

  );
}

//Changing the orientation to potrait
const onBackPress=()=>{
  Orientation.lockToPortrait();
}
function App() {
//Handling the back button press on device hardware
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
  });  
return (
    <View style={styles.body}>
    <NavigationContainer
    >
      <Stack.Navigator>
        <Stack.Screen name="MainHome" component={MyDrawer}  options={{header:()=>null}}/>
        <Stack.Screen name="LiveTv" component={LiveTv}  options={{}}/>
        <Stack.Screen name="Exclusive" component={Exclusive}  options={{}}/>
        <Stack.Screen name="Movies" component={Movies}  options={{}}/>
        <Stack.Screen name="TvShows" component={TvShows}  options={{}}/>
        <Stack.Screen name="Search" component={Search}  options={{}}/>
        <Stack.Screen name="Subscribe" component={Subscribe}  options={{}}/>
        <Stack.Screen name="CustomeVideoPlayer" component={CustomeVideoPlayer} options={{header:()=>null,}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );
}
const styles = StyleSheet.create({
  FooterText:{
    color:'#ffffff',
    fontWeight:'bold',
  },
  body:{
    backgroundColor:'#191D4F',
    flex:1,
  },
  roundedTab:{
    borderRadius:10,
  },
  profilePic:{
    width:60,
    height:60,
    borderRadius:30,
  }
});
export default App;