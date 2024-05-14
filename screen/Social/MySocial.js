import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const line = Platform.OS === 'ios' ? 15 : 14;
const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const MySocial = (props) => {
  const socialData = [
		{idx:1, cate:'1:1', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:'', before:'no', delete:'no'},
		{idx:2, cate:'미팅', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:'', before:'no', delete:'no'},
		{idx:3, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:'', before:'no', delete:'no'},
		{idx:4, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:'', before:'no', delete:'yes'},
		{idx:5, cate:'1:1', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:'', before:'start', delete:'no'},
		{idx:6, cate:'미팅', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:'', before:'yes', delete:'yes'},
		{idx:7, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:'', before:'yes', delete:'yes'},
		{idx:8, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:'', before:'yes', delete:'no'},
	];

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [overPop, setOverPop] = useState(false);

  const [socialList, setSocaiList] = useState(socialData);
  const [tabSt, setTabSt] = useState(1);
  const [tabSt2, setTabSt2] = useState(1);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
      
		}else{
			//console.log("isFocused");
			setRouteLoad(true);
			setPageSt(!pageSt);
		}

		Keyboard.dismiss();
		Toast.hide();
    setLoading(false);
		return () => isSubscribed = false;
	}, [isFocused]);

	useEffect(() => {
    const unsubscribe = navigationUse.addListener('beforeRemove', (e) => {
      // 뒤로 가기 이벤트가 발생했을 때 실행할 로직을 작성합니다.
      // 여기에 원하는 동작을 추가하세요.
      // e.preventDefault();를 사용하면 뒤로 가기를 막을 수 있습니다.
      //console.log('preventBack22 ::: ',preventBack);
      if (preventBack) {
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

	useEffect(() => {
		getSocialList();
	}, [tabSt, tabSt2])

  const getSocialList = async (v) => {
    //console.log(tabSt+'///'+tabSt2);
  }

  const getList = ({item, index}) => (    
		<View style={styles.socialLi}>
      {item.before == 'start' ? (
      <View style={styles.beforeSocial}>
        <View style={styles.beforeSocialLine}></View>
        <View style={styles.beforeSocialTitle}>
          <Text style={styles.beforeSocialTitleText}>지난 소셜</Text>
        </View>
      </View>
      ) : null}

			<TouchableOpacity
				style={[styles.socialLiBtn]}
				activeOpacity={opacityVal}
				onPress={()=>{
          if(item.delete == 'yes'){
            ToastMessage('삭제된 소셜입니다.');
          }else{
            if(index == 0){
              setOverPop(true);
            }else if(index == 1){
              navigation.navigate('SocialView', {idx:item.idx})
            }
          }
				}}
			>
				<View style={[styles.socialLiThumb, item.delete == 'yes' ? styles.socialOPacity : null]}>
					<AutoHeightImage width={65} source={require('../../assets/image/social_basic1.jpg')} />
				</View>
				<View style={[styles.socialLiInfo, item.delete == 'yes' ? styles.socialOPacity : null, item.before == 'no' ? styles.socialCnt : null]}>
					<View style={styles.socialLiInfo1}>
						<View style={styles.socialLiInfoCate}>
							<Text style={styles.socialLiInfoCateText}>{item.cate}</Text>
						</View>
						<View style={styles.socialLiInfoDate}>
							<Text style={styles.socialLiInfoDateText}>{item.date}</Text>
						</View>
					</View>
					<View style={styles.socialLiInfo2}>
						<Text style={styles.socialSubject} numberOfLines={1} ellipsizeMode='tail'>{item.subject}</Text>
					</View>
					<View style={styles.socialLiInfo3}>
						<View style={styles.socialLiInfo3Flex}>
							<AutoHeightImage width={10} source={require('../../assets/image/icon_local.png')} />
							<Text style={styles.socialLiInfo3Text}>{item.loc}</Text>
						</View>
						<View style={styles.socialLiInfo3Line}></View>
						<View style={styles.socialLiInfo3Flex}>
							<View style={styles.socialLiInfoProfile}>
								<AutoHeightImage width={20} source={require('../../assets/image/profile_sample.png')} />
							</View>
							<Text style={styles.socialLiInfo3Text}>{item.age}·{item.gender}</Text>
						</View>
					</View>
				</View>
        {item.before == 'no' ? (
        <View style={styles.socialEventCnt}>
          <Text style={styles.socialEventCntText}>N</Text>
        </View>
        ) : null}
			</TouchableOpacity>
		</View>
	)

	const onScroll = (e) => {
		const {contentSize, layoutMeasurement, contentOffset} = e.nativeEvent;
		//console.log({contentSize, layoutMeasurement, contentOffset});
		//console.log(contentOffset.y);	
	};

	//리스트 무한 스크롤
	const moreData = async () => {

	}

	const onRefresh = () => {
		if(!refreshing) {
			setRefreshing(true);
			//getItemList();
			setTimeout(() => {
				setRefreshing(false);
			}, 2000);
		}
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <Header navigation={navigation} headertitle={'나의 소셜'} />
      
      <View style={styles.viewTab}>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 1 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>setTabSt(1)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 1 ? styles.viewTabBtnTextOn : null]}>참여한 소셜</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 2 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>setTabSt(2)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 2 ? styles.viewTabBtnTextOn : null]}>내 소셜</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 3 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>setTabSt(3)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 3 ? styles.viewTabBtnTextOn : null]}>찜한 소셜</Text>
        </TouchableOpacity>
      </View>
			
      {tabSt == 1 ? (
        <View style={styles.viewTab2}>
          <TouchableOpacity
            style={[styles.viewTab2Btn, styles.mgl0]}
            activeOpacity={opacityVal}  
            onPress={()=>{
              setTabSt2(1);
              getSocialList();
            }}          
          >
            <Text style={[styles.viewTab2BtnText, tabSt2 == 1 ? styles.viewTab2BtnTextOn : null]}>신청한 소셜</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewTab2Btn]}
            activeOpacity={opacityVal}  
            onPress={()=>{
              setTabSt2(2);
              getSocialList();
            }}          
          >
            <Text style={[styles.viewTab2BtnText, tabSt2 == 2 ? styles.viewTab2BtnTextOn : null]}>참여한 소셜</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList 				
				data={socialList}
				renderItem={(getList)}
				keyExtractor={(item, index) => index.toString()}
				refreshing={refreshing}
				disableVirtualization={false}
				onScroll={onScroll}	
				onEndReachedThreshold={0.8}
				onEndReached={moreData}
				onRefresh={onRefresh}
				// ListHeaderComponent={
				// 	<View style={styles.flatListPad}></View>
				// }
        ListFooterComponent={
          <View style={styles.flatListPad}></View>
        }
				// ListEmptyComponent={
				// 	isLoading ? (
				// 	<View style={styles.notData}>
				// 		<Text style={styles.notDataText}>등록된 게시물이 없습니다.</Text>
				// 	</View>
				// 	) : (
				// 		<View style={[styles.indicator]}>
				// 			<ActivityIndicator size="large" />
				// 		</View>
				// 	)
				// }
			/>

      {/* 이미 매칭된 경우 */}
			<Modal
				visible={overPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setOverPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setOverPop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setOverPop(false)}}
						>
							<AutoHeightImage width={18} source={require("../../assets/image/popup_x.png")} />
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>이미 매칭된 이성이</Text>
							<Text style={[styles.popTitleText, styles.mgt5]}>참여한 방이예요</Text>							
						</View>					
						<View style={[styles.popTitleDescFlex, styles.mgt20]}>
							<View styles={styles.popTitleDescFlexView}>
								<Text style={[styles.popTitleDesc, styles.popTitleDescFlexDesc, styles.mgt0]}>다른 소셜에 참여 신청해주세요</Text>
							</View>
							<AutoHeightImage width={14} source={require('../../assets/image/emoticon5.png')} />
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => setOverPop(false)}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      {loading ? (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#D1913C" />
      </View>
      ) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },	
	gapBox: {height:86,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	

  cmWrap: {paddingVertical:30,paddingHorizontal:10},
  cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

  viewTab: {flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#F2F4F6',},
  viewTabBtn: {alignItems:'center',justifyContent:'center',width:widnowWidth/3,height:60,paddingTop:12,borderBottomWidth:2,borderBottomColor:'#fff'},
  viewTabBtnOn: {borderBottomColor:'#141E30'},
  viewTabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#141E30',},
  viewTabBtnTextOn: {fontFamily:Font.NotoSansSemiBold},
  viewTab2: {flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#F2F4F6'},
  viewTab2Btn: {padding:20,marginLeft:30,},
  viewTab2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#888',},
  viewTab2BtnTextOn: {color:'#141E30'},

  flatListPad: {height:20,},
  socialLi: {paddingHorizontal:20,},
	socialLiBtn: {flexDirection:'row',paddingVertical:18,borderBottomWidth:1,borderColor:'#EDEDED',position:'relative'},
  socialLiThumb: {alignItems:'center',justifyContent:'center',width:60,height:60,borderRadius:50,overflow:'hidden'},
	socialLiInfo: {width:innerWidth-60,paddingLeft:20,},
  socialCnt: {width:innerWidth-90,},
	socialLiInfo1: {flexDirection:'row',alignItems:'center',},
	socialLiInfoCate: {alignItems:'center',justifyContent:'center',width:32,height:16,backgroundColor:'#243B55',borderRadius:10,},
	socialLiInfoCateText: {fontFamily:Font.NotoSansMedium,fontSize:10,lineHeight:13,color:'#fff'},
	socialLiInfoDate: {marginLeft:4,},
	socialLiInfoDateText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:13,color:'#888'},
	socialLiInfo2: {marginVertical:8,},
	socialSubject: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:16,color:'#1e1e1e'},
	socialLiInfo3: {flexDirection:'row',alignItems:'center',},
	socialLiInfo3Flex: {flexDirection:'row',alignItems:'center',},
	socialLiInfoProfile: {alignItems:'center',justifyContent:'center',width:20,height:20,borderRadius:50,overflow:'hidden'},
	socialLiInfo3Text: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:13,color:'#1e1e1e',marginLeft:4,},
	socialLiInfo3Line: {width:1,height:12,backgroundColor:'#EDEDED',marginHorizontal:12},
  beforeSocial: {alignItems:'center',position:'relative',height:17,marginTop:30,marginBottom:10,},
  beforeSocialLine: {width:innerWidth,height:1,backgroundColor:'#D1913C',position:'absolute',left:0,top:8,},
  beforeSocialTitle: {alignItems:'center',justifyContent:'center',width:90,height:17,backgroundColor:'#fff'},
  beforeSocialTitleText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:18,color:'#D1913C'},
  socialOPacity: {opacity:0.5},
  socialEventCnt: {alignItems:'center',justifyContent:'center',minWidth:20,height:16,backgroundColor:'#fff',borderWidth:1,borderColor:'#FF1A1A',borderRadius:20,position:'absolute',right:0,top:45,},
  socialEventCntText: {fontFamily:Font.RobotoMedium,fontSize:10,lineHeight:line,color:'#FF1A1A'},

  modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight},
	popBack2: {backgroundColor:'rgba(0,0,0,0.7)',},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},	
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap'},
	popTitleFlexWrap: {position:'relative'},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E',},
  popTitleFlexText: {position:'relative',top:2,},	
	popTitleDescFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	popTitleDesc: {width:innerWidth-40,textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	popTitleDescFlexDesc: {width:'auto',position:'relative',top:1.5,},
	emoticon: {},
	popIptBox: {paddingTop:10,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {marginTop:30,},
	popBtnBoxFlex: {flexDirection:'row',justifyContent:'space-between'},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtn2: {width:(innerWidth/2)-25,},
	popBtnOff: {backgroundColor:'#EDEDED',},
	popBtnOff2: {backgroundColor:'#fff',marginTop:10,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

	prvPopBot: {width:widnowWidth,paddingTop:40,paddingBottom:10,paddingHorizontal:20,backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,position:'absolute',bottom:0,},
	prvPopBot2: {width:widnowWidth,position:'absolute',bottom:0,},
	popBotTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:20,color:'#1e1e1e',},
	popBotTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#666',marginTop:10,},

  boxShadow: {
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
		elevation: 3,
	},

  pdt0: {paddingTop:0,},
	mgt0: {marginTop:0},
	mgt5: {marginTop:5},
	mgt10: {marginTop:10},
	mgt20: {marginTop:20},
	mgt30: {marginTop:30},
	mgt40: {marginTop:40},
	mgt50: {marginTop:50},
	mgb10: {marginBottom:10},
	mgb20: {marginBottom:20},
	mgr0: {marginRight:0},
	mgl0: {marginLeft:0},
})

export default MySocial