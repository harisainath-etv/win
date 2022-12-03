import * as React from 'react';
import {useState} from 'react';
import { View,Dimensions,ScrollView,FlatList,StyleSheet,Text,Image,Pressable } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { SBItem } from './SBItem';
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_500Medium,
  } from '@expo-google-fonts/montserrat';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { BASE_URL,ANDROID_AUTH_TOKEN,FIRETV_BASE_URL } from '../constants';

export const ElementsText = {
    AUTOPLAY: 'AutoPlay',
};
export const window = Dimensions.get('window');
const PAGE_WIDTH = window.width;
const state = {
  data: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
  index: 1,
}


var HomeBanner=[];
var BeforeTv=[];
var LiveTv=[];
var TvShow=[];
function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}
function Index({navigation}) {
    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium
      });
      const [colors,setColors] = useState([
        '#ffc908',
        '#ffc908',
        '#ffc908',
        '#ffc908',
        '#ffc908',
        '#ffc908',
        '#ffc908',
        '#ffc908',
        '#ffc908',
        '#ffc908',
    ]);
    const [bannerimages,setBannerImages]=useState([]);
    const [beforetvimages,setbeforetvimages]=useState([]);
    const [liveTv,setliveTv]=useState([]);
    const [tvShows,settvShows]=useState([]);
    const [isVertical, setIsVertical] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);
    const [pagingEnabled, setPagingEnabled] = useState(true);
    const [snapEnabled, setSnapEnabled] = useState(true);
    const progressValue = useSharedValue(0);
    const baseOptions = ({
              vertical: false,
              width: PAGE_WIDTH * 0.85,
              height: PAGE_WIDTH * 1.05,
          });
         
    function loadData(){
        const url=  FIRETV_BASE_URL+"/catalog_lists/home.gzip?item_language=eng&region=IN&auth_token="+ANDROID_AUTH_TOKEN+"&access_token=Ay6KCkajdBzztJ4bptpW&page=0&page_size=5&npage_size=10";
        
        axios.get(url)
      .then((response) => {
        
        for(var i=0;i<response.data.data.catalog_list_items.length;i++)
        {
             for(var j=0;j<response.data.data.catalog_list_items[i].catalog_list_items.length;j++)
             {
                 if(response.data.data.catalog_list_items[i].friendly_id=='featured-banner')
                 {
                    if(!HomeBanner.includes(response.data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url))
                    HomeBanner.push(response.data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url);
                 }
                 else
                 if(response.data.data.catalog_list_items[i].friendly_id=='featured-before-tv')
                 {
                    if(!BeforeTv.includes(response.data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_4_3.url))
                    BeforeTv.push(response.data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_4_3.url);
                 }
                 else
                 if(response.data.data.catalog_list_items[i].friendly_id=='featured-live-tv')
                 {
                    if(!LiveTv.includes(response.data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url))
                    LiveTv.push(response.data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url);
                 }
                 else
                 if(response.data.data.catalog_list_items[i].friendly_id=='tv-show')
                 {
                    if(!TvShow.includes(response.data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url))
                    TvShow.push(response.data.data.catalog_list_items[i].catalog_list_items[j].thumbnails.high_3_4.url);
                 }
                 
             }
        }
        setBannerImages(HomeBanner)
        setbeforetvimages(BeforeTv)
        setliveTv(LiveTv)
        settvShows(TvShow)
      })
      .catch(function (error) {
        console.log(error);
      })

    }
    loadData();
    return (
    <View style={{flex:1}}>
      <ScrollView  
      contentContainerStyle={{ flexWrap: 'nowrap' }} 
      style={{
        backgroundColor:'#191D4F',
        flex:1,
      }}>
        <View
            style={{
                alignItems: 'center',
              }}
        >
            <Carousel
                {...baseOptions}
                loop
                pagingEnabled={pagingEnabled}
                snapEnabled={snapEnabled}
                autoPlay={autoPlay}
                autoPlayInterval={2000}
                onProgressChange={(_, absoluteProgress) =>
                    (progressValue.value = absoluteProgress)
                }
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.82,
                    parallaxScrollingOffset: 50,
                    parallaxAdjacentItemScale:0.82,
                }}
                data={bannerimages}
                style={{top:-15,}}
                renderItem={({ item,index }) => <Image key={index} style={styles.image} source={{uri:item}} />}
            />
            {!!progressValue && (
                <View
                    style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  width: 200,
                                  alignSelf: 'center',
                                  top:-30,
                          }}
                >
                    {colors.map((backgroundColor, index) => {
                        return (
                            <PaginationItem
                                backgroundColor={backgroundColor}
                                animValue={progressValue}
                                index={index}
                                key={index}
                                isRotate={isVertical}
                                length={colors.length}
                            />
                        );
                    })}
                </View>
            )}
            



            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Continue Watching</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionHorizontal}
                                        source={require('../assets/images/pose.png')} />
                                        <Image
                                        style={{width:22,height:22,position:'absolute',top:7,left:10}}
                                        source={require('../assets/images/crown.png')} />
                                        <Image
                                        style={{width:26,height:26,position:'absolute',bottom:20,right:15}}
                                        source={require('../assets/images/play.png')} />
                                </View>
                        }
                    />


            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>ETV Exclusives</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsVerticalScrollIndicator={true}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionBigSingle}
                                        source={require('../assets/images/beauty.png')} />
                                    <Image
                                        style={{position:'absolute',width:'20%',height:'47%',left:40}}
                                        source={require('../assets/images/premium-tag.png')} />

                                </View>
                        }
                    />


            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Before TV</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={beforetvimages}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={[styles.imageSectionHorizontal,{resizeMode: 'stretch',}]}
                                        source={{uri:item}} />
                                </View>
                        }
                    />


            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Live TV</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={liveTv}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={[styles.imageSectionVertical,{resizeMode: 'stretch',}]}
                                        source={{uri:item}} />
                                </View>
                        }
                    />




            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>TV Shows</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            {/* <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionBigWithBorder}
                                        source={require('../assets/images/greatescape.png')} />
                                </View>
                        }
                    /> */}
                <View style={styles.containerMargin}>
                        <Carousel
                        {...baseOptions}
                        loop
                        pagingEnabled={pagingEnabled}
                        snapEnabled={snapEnabled}
                        autoPlay={false}
                        autoPlayInterval={2000}
                        onProgressChange={(_, absoluteProgress) =>
                            (progressValue.value = absoluteProgress)
                        }
                        mode="parallax"
                        modeConfig={{
                            parallaxScrollingScale: 0.82,
                            parallaxScrollingOffset: 50,
                            parallaxAdjacentItemScale:0.82,
                        }}
                        data={tvShows}
                        style={{top:-15,height:250,borderRadius:18}}
                        renderItem={({ item,index }) => <Image key={index} style={styles.image} source={{uri:item}} />}
                    />
                </View>


            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Trending Shows</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionVertical}
                                        source={require('../assets/images/wakeupsid.jpg')} />
                                </View>
                        }
                    />


            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Recommended For You</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionHorizontal}
                                        source={require('../assets/images/joy.jpg')} />
                                </View>
                        }
                    />



            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Top Movies</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionVertical}
                                        source={require('../assets/images/reality.png')} />
                                </View>
                        }
                    />


            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Family</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionVertical}
                                        source={require('../assets/images/reality.png')} />
                                </View>
                        }
                    />  
              <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Comedy</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionVertical}
                                        source={require('../assets/images/reality.png')} />
                                </View>
                        }
                    />
            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Romance</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionVertical}
                                        source={require('../assets/images/reality.png')} />
                                </View>
                        }
                    />
            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Classic</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionVertical}
                                        source={require('../assets/images/reality.png')} />
                                </View>
                        }
                    />
              <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Mythology / Folklore</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionVertical}
                                        source={require('../assets/images/reality.png')} />
                                </View>
                        }
                    />
              <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Action / Thriller</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionVertical}
                                        source={require('../assets/images/reality.png')} />
                                </View>
                        }
                    />


            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Latest News</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionHorizontal}
                                        source={require('../assets/images/joy.jpg')} />
                                </View>
                        }
                    />

            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Explore By Channels</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionCircle}
                                        source={require('../assets/images/etvwin.png')} />
                                </View>
                        }
                    />

            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Health Fitness</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionHorizontal}
                                        source={require('../assets/images/joy.jpg')} />
                                </View>
                        }
                    />
             

             <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>Food</Text>
                <Text style={styles.sectionHeaderMore}>+MORE</Text>
            </View>
            <FlatList
                        extraData={state.index}
                        data={state.data}
                        keyExtractor={(x, i) => i.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.containerMargin}
                        renderItem={
                            ({ item, index }) =>
                                <View>
                                    <Image
                                        style={styles.imageSectionHorizontal}
                                        source={require('../assets/images/joy.jpg')} />
                                </View>
                        }
                    />


                        

        </View>
        </ScrollView>

        <View style={styles.chromeCast}>
        <FontAwesome5 name="chromecast" size={25} color="white" />
        </View>
        </View>
    );
}

const PaginationItem = (props) => {
    const { animValue, index, length, backgroundColor, isRotate } = props;
    const width = 10;

    const animStyle = useAnimatedStyle(() => {
        let inputRange = [index - 1, index, index + 1];
        let outputRange = [-width, 0, width];

        if (index === 0 && animValue?.value > length - 1) {
            inputRange = [length - 1, length, length + 1];
            outputRange = [-width, 0, width];
        }

        return {
            transform: [
                {
                    translateX: interpolate(
                        animValue?.value,
                        inputRange,
                        outputRange,
                        Extrapolate.CLAMP
                    ),
                },
            ],
        };
    }, [animValue, index, length]);
    return (
        <View
            style={{
                backgroundColor: '#3a3d68',
                width,
                height: width,
                borderRadius: 50,
                overflow: 'hidden',
                transform: [
                    {
                        rotateZ: isRotate ? '90deg' : '0deg',
                    },
                ],
            }}
        >
            <Animated.View
                style={[
                    {
                        borderRadius: 50,
                        backgroundColor,
                        flex: 1,
                    },
                    animStyle,
                ]}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    Container:{
        backgroundColor:'#191D4F',
        textAlign: "center",
        justifyContent: "center",
        height: 60,
        width:"100%",
    },
    textTabActive:{
        textAlign: "center",
        justifyContent: "center",
        backgroundColor: "#7249BF",
        height: 43,
        borderRadius: 25,
        width: '100%'
    },
    textTab:{
        textAlign: "center",
        justifyContent: "center",
        height: 43,
        borderRadius: 25,
        width: '100%'
    },
    textStyle:{
        color:'#ffffff',
        textAlign: "center",
        justifyContent: "center", 
        fontFamily:'Montserrat_500Medium',
        fontWeight:'600'
    },
  sectionHeaderView: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
    fontFamily:'Montserrat_500Medium',
},
sectionHeader: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
    left:3,
    fontFamily:'Montserrat_500Medium',
    width:"50%"
},
sectionHeaderMore: {
    color: '#ffc908',
    right: 15,
    fontFamily:'Montserrat_500Medium',
    fontSize:13,
    width:"50%",
    textAlign: 'right'
},
imageSectionHorizontal: {
  width: PAGE_WIDTH/2.06,
  height: 117,
  marginHorizontal: 3,
  borderRadius: 10,
  marginBottom:10,
  borderColor:'#6b9fd7',
  borderWidth:1
},
imageSectionVertical: {
  width: PAGE_WIDTH/3.15,
  height: 170,
  marginHorizontal: 3,
  borderRadius: 10,
  marginBottom:10,
  
},
imageSectionCircle:{
  marginHorizontal: 0,
  marginBottom:10,
  width: PAGE_WIDTH/4, 
  height: PAGE_WIDTH/4,
  borderRadius: (PAGE_WIDTH/4)/ 2,
  borderColor:'#6b9fd7',
  borderWidth:1
},
imageSectionBig: {
  width: PAGE_WIDTH/1.1,
  height: 230,
  marginHorizontal: 8,
  borderRadius: 1,
  padding:20,
  borderColor:'#6b9fd7',
  borderWidth:1
},
imageSectionBigSingle:{
  width: PAGE_WIDTH/1.04,
  height: 230,
  marginHorizontal: 8,
  borderRadius: 7,
  padding:20,
  
},
imageSectionBigWithBorder:{
  width: PAGE_WIDTH/1.1,
  height: 230,
  marginHorizontal: 8,
  borderRadius: 1,
  padding:20,
  borderRadius:10,
  borderColor:'#6b9fd7',
  borderWidth:1
},
chromeCast:{
    width: 56,  
    height: 56,   
    borderRadius: 28,            
    backgroundColor:'#191D4F',
    position: 'absolute',                                          
    bottom: 10,                                                    
    right: 10, 
    borderColor:'#6b9fd7',
    borderWidth:1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'flex-end'
},
image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: 'stretch',
    borderRadius:10,
    height:400
},
});

export default Index;