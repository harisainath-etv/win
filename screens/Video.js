import React, {  useState,useRef,useEffect } from 'react';
import { View,StyleSheet, Text, Dimensions, Pressable,PanResponder,BackHandler,TouchableOpacity  } from 'react-native';
import Video from 'react-native-video';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { TouchableWithoutFeedback } from 'react-native';
import ProgressBarCustom from './ProgressBarCustom';
import Orientation,{ useDeviceOrientationChange} from 'react-native-orientation-locker';
import { useNavigation } from '@react-navigation/native';

//convert to player time 
function getMinutesFromSeconds(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : '0' + minutes}:${
      seconds >= 10 ? seconds : '0' + seconds
    }`;
  }

//get the dimensions of screen and setting it to progress bar
const width=Dimensions.get('window').width-80;
const height=Dimensions.get('window').height-120;

export default function CustomeVideoPlayer(){
  const navigation = useNavigation();
  //Defining all the constants for handling the player controls
    const [screenWidth,setScreenWidth]=useState(width)
    const [paused,setPaused]=useState(true)
    const [playPause,setPlayPause]=useState("play")
    const [playPauseCounter,setplayPauseCounter]=useState("")
    const [progress,setProgress]=useState(0)
    const [duration,setDuration]=useState(0)
    const [controls,setControls]=useState(true)
    const [fullscreen,setFullscreen]=useState(false)
    const [state, setState] = useState({
        currentTime: 0,
    });
    const player = useRef(null)

//setting duartion on loading the video
    const handleLoad =(meta) =>{
        setDuration(meta.duration)
    }

//Handling the progress bar
    const handleProgress = (progress) =>{
        setProgress(progress.currentTime / duration)
        setState({currentTime:progress.currentTime})
    }

//Resetting the values at the end of video
    const handleEnd=() => {
        player.current.seek(0);
        pause()
        setControls(true)
    }    

//Handling the press on the progress bar
    const handleProgressPress = (e) =>{
        const position=e.nativeEvent.locationX;
        const progress = (position / width) * duration;
        player.current.seek(progress);
    }

//Handling the backward press
    const skipBack =(e) =>{
      const seconds=10;
        const seekTime=state.currentTime-seconds;
        player.current.seek(seekTime);
    }

//Handling the forward press
    const skipForward =(e) =>{
      const seconds=10;
      const seekTime=state.currentTime+seconds;
      player.current.seek(seekTime);
    }

//Handling the play button
    const play = () =>{
        setPaused(false);
        setPlayPause("pause");
        setplayPauseCounter(1);
        if(progress>=1)
        player.current.seek(0);
    }

//Handling the pause button
    const pause = () =>{
        setPaused(true);
        setPlayPause("play");
        setplayPauseCounter("");
        if(progress>=1)
        player.current.seek(0);
    }

//Showing controls after hiding them
    const showControls =() =>{
        setControls(true)
        playPauseCounter ? pause() : play()
    }

//Handling the orientation change
   useDeviceOrientationChange((o) => {
        if(o!="PORTRAIT")
        {
            Orientation.unlockAllOrientations();
        }
        else
        {
            fullscreen
            ? Orientation.lockToLandscapeLeft()
            : Orientation.unlockAllOrientations();
        }
      });

//Handling the full screen mode with orientation change
      function handleFullscreen() {
        Orientation.lockToLandscape();
          setFullscreen(true)
          setScreenWidth(height)
        //   Orientation.getOrientation((err, orientation) => {
        //             if (orientation == 'LANDSCAPE') {
        //                 Orientation.lockToPortrait();
        //             } else {
        //                 Orientation.lockToLandscape();
        //             }
        //         });
      }

//Handling the small screen mode with orientation change
      function handleSmallscreen(){
        Orientation.lockToPortrait();
        setFullscreen(false)
        setScreenWidth(width)
      }
   
//Hide Controls After 10 seconds of inactivity 
    const timerId = useRef(false)
    const [timeForInactivityInSecond, setTimeForInactivityInSecond] = useState(
    10
    )
//Changing the hardware back button press by changing orientation to potrait
const onBackPress=()=>{
  handleSmallscreen();
  return true;
}
    useEffect(() => {
        resetInactivityTimeout()
        play()
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
      }, [])
    
      const panResponder = useRef(
        PanResponder.create({
          onStartShouldSetPanResponderCapture: () => {
            // console.log('user starts touch');
            resetInactivityTimeout()
          },
        })
      ).current
    
      const resetInactivityTimeout = () => {
        clearTimeout(timerId.current)
        timerId.current = setTimeout(() => {
            setControls(false);
        }, timeForInactivityInSecond * 1000)
      }

//Handling maximize screen back button
const goToBackVideoScreen =() =>{
  handleSmallscreen()
}

//Handling minimize screen back button
const goToBackScreen =() =>{
  navigation.goBack();
}

   return(
        <View style={{flex:1,backgroundColor:'#191D4F'}} {...panResponder.panHandlers}>
            <Pressable onPress={showControls} style={{alignContent:'center',alignItems:'center',justifyContent:'center'}}>
            <View style={[styles.backButtonWrapper,controls ? styles.showBarControls : styles.hideBarControls]}>
                <TouchableOpacity onPress={fullscreen? goToBackVideoScreen : goToBackScreen}>
                <MaterialCommunityIcons name="keyboard-backspace" style={{color:"#d9d9d9",marginRight:90}} size={35}></MaterialCommunityIcons>
                </TouchableOpacity>
            </View>

            <View style={[controls ? styles.showBarControls : styles.hideBarControls,{flexDirection:'row',zIndex:3,elevation:3,position:'absolute'}]}>
                          <Pressable onPress={skipBack}>
                              <MaterialCommunityIcons name="skip-backward" style={{color:"#d9d9d9",marginRight:90}} size={35}></MaterialCommunityIcons>
                          </Pressable>
                          <Pressable onPress={skipForward}>
                              <MaterialCommunityIcons name="skip-forward" style={{color:"#d9d9d9"}} size={35}></MaterialCommunityIcons>
                          </Pressable>
            </View>
                
                <Video 
                paused={paused}
                source={{uri:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}}
                style={fullscreen ? styles.backgroundVideoFull : styles.backgroundVideo} 
                resizeMode="contain"
                onLoad={handleLoad}
                onProgress={handleProgress}
                onEnd={handleEnd}
                ref={ref => (player.current = ref)}
                fullscreen= {fullscreen ? true : false}
                />
                
                <View style={[fullscreen ? styles.controlsBgFull : styles.controlsBgSmall,controls ? styles.showBarControls : styles.hideBarControls]}>
                      
                        <View style={{width:"10%",top:10,left:5,position:'absolute'}}>
                            <FontAwesome5 name={playPause} style={{}} size={15} color="white" onPress={playPauseCounter ? pause : play}/>
                        </View>
                        <View style={styles.seekBar}>
                            <TouchableWithoutFeedback onPress={handleProgressPress}>
                                <View style={{marginBottom:10,top:-5}}>
                                    <ProgressBarCustom
                                    progress={progress}
                                    color="#ffffff"
                                    unfilledColor="rgba(255,255,255,.5)"
                                    borderColor="#ffffff"
                                    width={screenWidth}
                                    height={5}
                                    ></ProgressBarCustom>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{width:"10%",top:10,right:11,position:'absolute'}}>
                            <Text style={{color:"#ffffff",fontSize:11}}>
                               {getMinutesFromSeconds(progress * duration)} 
                            </Text>
                        </View>
                        <View style={{width:"10%",top:5,right:-15,position:'absolute'}}>
                            <MaterialCommunityIcons style={{}} name="fullscreen" size={25} color="white" onPress={fullscreen ? handleSmallscreen : handleFullscreen}/>
                        </View>
                </View>
            </Pressable>
                

          <View style={{}}>
            <Text style={{fontSize:25,marginBottom:5,color:'#ffffff',padding:6}}>Epi 118</Text>
            <Text style={{fontSize:13,marginBottom:5,color:'#566666',padding:6}}>16 hours ago</Text>
            <Text style={{fontSize:13,marginBottom:5,color:'#566666',padding:6}}>ETV Plus</Text>
            <Text style={{fontSize:13,marginBottom:10,color:'#566666',padding:6}}>U/A 13+</Text>
            <Text style={{fontSize:13,marginBottom:10,color:'#566666',padding:6}}>Loreum Ipsum Loreum Ipsum Loreum Ipsum Loreum Ipsum </Text>
            <View style={{borderTopColor:'#566666',borderBottomColor:'#566666',borderRightColor:'#191D4F',borderLeftColor:'#191D4F ',height:35,borderWidth:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                  <View style={{width:"25%",alignItems:'center',justifyContent:'center'}}><Text><MaterialCommunityIcons name="thumb-up" style={{}} size={20} color="#ffffff"/></Text></View>
                  <View style={{width:"25%",alignItems:'center',justifyContent:'center'}}><Text><MaterialCommunityIcons name="share-variant" style={{}} size={20} color="#ffffff"/></Text></View>
                  <View style={{width:"25%",alignItems:'center',justifyContent:'center'}}><Text><MaterialCommunityIcons name="download" style={{}} size={20} color="#ffffff"/></Text></View>
                  <View style={{width:"25%",alignItems:'center',justifyContent:'center'}}><Text><MaterialIcons name="watch-later" style={{}} size={20} color="#ffffff"/></Text></View>
            </View>
          </View>


        </View>
    );
}



// Later on in your styles..
var styles = StyleSheet.create({
  showBarControls:{
        display:'flex'
    },
  hideBarControls:{
        display:'none'
   },
  backgroundVideoFull:{
   width:"100%",
   height:"100%",
   top:0
  },
  backgroundVideo: {
   width:"100%",
   height:250,
   top:-15
  },
  controlsBgSmall:{
    backgroundColor:"#191D4F77",
    width:"100%",
    height:40,
    justifyContent:"center",
    position:'absolute',
    top:186,
    flexDirection:'row'
  },
  controlsBgFull:{
    backgroundColor:"#191D4F77",
    width:"100%",
    height:40,
    justifyContent:"center",
    position:'absolute',
    bottom:0,
    flexDirection:'row'
  },
  seekBar:{width:"70%",top:20,left:25,position:'absolute'},
  backButtonWrapper: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: "flex-start",
    top:0
}
});