import React,{useCallback, useState} from 'react';
import { View, Text,StyleSheet,Dimensions,FlatList,Image } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL,ANDROID_AUTH_TOKEN } from '../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
const window = Dimensions.get('window');
const PAGE_WIDTH = window.width;
var pageName="Home"
export default function TvShows({navigation}) {
  const state = {
    index: 1,
  }
  const [latestEpisodesCount,setLatestEpisodesCount] = useState();
  const loadData = () =>{
    axios.get(BASE_URL+'/catalog_lists/featured-latest-episodes.gzip?item_language=eng&region=IN&auth_token='+ANDROID_AUTH_TOKEN+'&from=0&page=0&page_size=20&start_count=0')
    .then((response) => {
      setLatestEpisodesCount(response.data.data.catalog_list_items)
    })
    .catch(function (error) {
      console.log(error);
    })
  
  }
 const navigateToVideo = async (item) =>{
    try{
      const seoKeys=item.seo_url.split("/"); 
      var url=(BASE_URL+"/catalogs/"+seoKeys[1]+ "/items/"+seoKeys[2]+ "/subcategories/"+seoKeys[3]+ "/episodes/"+seoKeys[4] + "?auth_token="+ANDROID_AUTH_TOKEN+"&item_language=eng&region=IN");
      navigation.navigate('CustomeVideoPlayer',{url,pageName})
    }
    catch{}
    
 }
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity onPress={()=>navigateToVideo(item)}><Image
            style={styles.imageSectionHorizontal}
            source={{uri:item.thumbnails.medium_4_3.url.toString()}} /></TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'#191D4F', }}>
          <View style={styles.sectionHeaderView}>
                    <Text style={styles.sectionHeader}>Latest Episodes</Text>
                    <Text style={styles.sectionHeaderMore}>+MORE</Text>
          </View>
          <FlatList
              extraData={state.index}
              data={latestEpisodesCount}
              keyExtractor={(x, i) => i.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={styles.containerMargin}
              renderItem={renderItem}
            />
    </View>
  );
}


const styles = StyleSheet.create({

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
});