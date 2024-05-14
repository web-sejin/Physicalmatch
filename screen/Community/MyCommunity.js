import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Image, Dimensions, ImageBackground, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import Swiper from 'react-native-web-swiper';

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

const MyCommunity = (props) => {
	const socialData = [
		{idx:1, cate:'자유', date:'12.24 (수)', subject:'제목이 입력됩니다.', viewCnt:'152', reviewCnt:'3', image:'', profile:'', blur:false},
		{idx:2, cate:'운동', date:'12.24 (수)', subject:'제목이 입력됩니다.', viewCnt:'152', reviewCnt:'3', image:'', profile:'', blur:true},
		{idx:3, cate:'프교', date:'12.24 (수)', subject:'제목이 입력됩니다.', viewCnt:'152', reviewCnt:'3', image:'', profile:'', blur:true},
		{idx:4, cate:'셀소', date:'12.24 (수)', subject:'제목이 입력됩니다.', viewCnt:'152', reviewCnt:'3', image:'', profile:'', blur:false},
		{idx:5, cate:'자유', date:'12.24 (수)', subject:'제목이 입력됩니다.', viewCnt:'152', reviewCnt:'3', image:'', profile:'', blur:false},
		{idx:6, cate:'운동', date:'12.24 (수)', subject:'제목이 입력됩니다.', viewCnt:'152', reviewCnt:'3', image:'', profile:'', blur:false},
		{idx:7, cate:'프교', date:'12.24 (수)', subject:'제목이 입력됩니다.', viewCnt:'152', reviewCnt:'3', image:'', profile:'', blur:false},
		{idx:8, cate:'셀소', date:'12.24 (수)', subject:'제목이 입력됩니다.', viewCnt:'152', reviewCnt:'3', image:'', profile:'', blur:true},
	];

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const swiperRef = useRef(null);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [socialList, setSocaiList] = useState(socialData);

  const [tabSt, setTabSt] = useState(1);
	const [sch, setSCh] = useState('');	

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
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {			
			setKeyboardStatus(1);
			setTimeout(function(){
				setKeyboardStatus(2);
			}, 300);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			setKeyboardStatus(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

	const getList = ({item, index}) => (
		<View style={[styles.commLi, index == 0 ? styles.mgt0 : null]}>
			<TouchableOpacity
				style={[styles.commLiBtn, index == 0 ? styles.pdt0 : null]}
				activeOpacity={opacityVal}
				onPress={()=>{
					navigation.navigate('CommunityView', {idx:item.idx, cateName:item.cate})
				}}
			>
				<View style={styles.commLiProfile}>
					<AutoHeightImage width={40} source={require('../../assets/image/profile_sample.png')} />
				</View>
				<View style={[styles.commLiInfo, item.idx == 4 ? styles.commLiInfo2 : null]}>
					<View style={styles.commLiInfoSubject}>
						<Text style={styles.commLiInfoSubjectText} numberOfLines={1} ellipsizeMode='tail'>{item.subject}</Text>
						{item.blur ? (<AutoHeightImage width={13} source={require('../../assets/image/icon_alert2.png')} style={styles.commLiInfoAlert} />) : null}						
					</View>
					<View style={styles.commLiSubInfo}>
						<View style={styles.commLiSubView}>
							<AutoHeightImage width={16} source={require('../../assets/image/icon_view.png')} />
							<Text style={styles.commLiSubViewText}>{item.viewCnt}</Text>
						</View>
						<View style={[styles.commLiSubView, styles.commLiSubView2]}>
							<AutoHeightImage width={16} source={require('../../assets/image/icon_review.png')} />
							<Text style={styles.commLiSubViewText}>{item.reviewCnt}</Text>
						</View>
						<View style={styles.commLiSubLine}></View>
						<View style={styles.commLiSubView}>
							<Text style={styles.commLiSubViewText}>{item.date}</Text>
						</View>            
					</View>
          <View style={[styles.socialEventCnt, item.idx == 4 ? styles.socialEventCnt2 : null]}>
            <Text style={styles.socialEventCntText}>N</Text>
          </View>
				</View>
				{item.idx != 4 ? (
				<ImageBackground
					style={styles.commLiThumb}
					source={require('../../assets/image/social_basic1.jpg')}
					resizeMode='cover'
					blurRadius={item.blur ? 15 : 0}
				>
					{item.blur ? (<AutoHeightImage width={20} source={require('../../assets/image/icon_blurview.png')} />) : null}					
				</ImageBackground>
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

	const Search = async () => {
		if(sch.length < 2){
			ToastMessage('검색어는 2글자 이상 입력해 주세요.');
			return false;
		}
	}

  useEffect(() => {
		getMyList();
	}, [tabSt])

  const getMyList = async (v) => {
    //console.log(tabSt+'///'+tabSt2);
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <Header navigation={navigation} headertitle={'나의 커뮤니티'} />
      <View style={styles.viewTab}>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 1 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>setTabSt(1)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 1 ? styles.viewTabBtnTextOn : null]}>프로필 교환</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 2 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>setTabSt(2)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 2 ? styles.viewTabBtnTextOn : null]}>작성한 글</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 3 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>setTabSt(3)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 3 ? styles.viewTabBtnTextOn : null]}>참여한 글</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 4 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>setTabSt(4)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 4 ? styles.viewTabBtnTextOn : null]}>북마크</Text>
        </TouchableOpacity>
      </View>
			
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.flatListPad}></View>
			</TouchableWithoutFeedback>
			<View style={styles.socialSchBox}>
				<View style={styles.socialSchBoxWrap}>
					<TouchableOpacity
						style={styles.socialSchBoxWrapBtn}
						activeOpacity={opacityVal}
						onPress={()=>Search()}
					>
						<AutoHeightImage width={28} source={require('../../assets/image/icon_sch.png')} />
					</TouchableOpacity>
					<TextInput
						value={sch}
						onChangeText={(v) => setSch(v)}
						style={[styles.socialSchBoxWrapInput]}
						returnKyeType='done'                      
					/>
				</View>
			</View>
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
				ListHeaderComponent={
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={styles.flatListPad}></View>
					</TouchableWithoutFeedback>
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

	viewTab: {flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#F2F4F6',},
  viewTabBtn: {alignItems:'center',justifyContent:'center',width:widnowWidth/4,height:60,paddingTop:12,borderBottomWidth:2,borderBottomColor:'#fff',},
  viewTabBtnOn: {borderBottomColor:'#141E30'},
  viewTabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#141E30',},
  viewTabBtnTextOn: {fontFamily:Font.NotoSansSemiBold},
  viewTab2: {flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#F2F4F6'},
  viewTab2Btn: {padding:20,marginLeft:30,},
  viewTab2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#888',},
  viewTab2BtnTextOn: {color:'#141E30'},

	socialSchBox: {paddingHorizontal:20,paddingBottom:10,flexDirection:'row',justifyContent:'space-between'},
	socialSchBoxWrap: {flexDirection:'row',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,},
	socialSchBoxWrapBtn: {alignItems:'center',justifyContent:'center',width:38,height:40,backgroundColor:'#F9FAFB',},
	socialSchBoxWrapInput: {width:innerWidth-38,height:40,backgroundColor:'#F9FAFB',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},	
	flatListPad: {height:20,},	

	cmWrap: {paddingBottom:40,paddingHorizontal:20,},
	cmWrap2: {paddingTop:30,},	

	commLi: {marginTop:5,},
	commLiBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:20,},
	commLiProfile: {alignItems:'center',justifyContent:'center',width:38,height:38,borderRadius:50,overflow:'hidden'},
	commLiInfo: {width:innerWidth-80,paddingHorizontal:10,position:'relative'},
	commLiInfo2: {width:innerWidth-38,paddingRight:0,},
	commLiInfoSubject: {flexDirection:'row',alignItems:'center',paddingRight:25,},
	commLiInfoSubjectText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#1e1e1e'},
	commLiInfoAlert: {marginLeft:4,},
	commLiSubInfo: {flexDirection:'row',alignItems:'center',marginTop:3,paddingRight:25,},
	commLiSubView: {flexDirection:'row',alignItems:'center',},
	commLiSubView2: {marginLeft:4,},
	commLiSubViewText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:14,color:'#B8B8B8'},
	commLiSubLine: {width:1,height:6,backgroundColor:'#EDEDED',marginHorizontal:7,position:'relative',top:1,},
	commLiThumb : {alignItems:'center',justifyContent:'center',width:42,height:42,borderWidth:1,borderColor:'#EDEDED',borderRadius:5,overflow:'hidden'},
	socialEventCnt: {alignItems:'center',justifyContent:'center',minWidth:20,height:16,backgroundColor:'#fff',borderWidth:1,borderColor:'#FF1A1A',borderRadius:20,position:'absolute',right:10,top:10,},
  socialEventCnt2: {right:0},
  socialEventCntText: {fontFamily:Font.RobotoMedium,fontSize:10,lineHeight:line,color:'#FF1A1A'},

	filterTitle: {},
	filterTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:18,color:'#1e1e1e'},
	filterDesc: {marginTop:6,},
	filterDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#666'},
	msBox: {},
	msTitleBox: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	msTitleBoxText1: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#1e1e1e'},
	msTitleBoxText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#888',position:'relative',top:-1,},
	msCheckBox: {flexDirection:'row',alignItems:'center'},
	msCheckBoxCircle: {width:20,height:20,backgroundColor:'#fff',borderWidth:1,borderColor:'#dbdbdb',borderRadius:50,position:'relative'},
	msCheckBoxCircleOn: {borderColor:'#243B55'},
	msCheckBoxCircleIn: {width:12,height:12,backgroundColor:'#243B55',borderRadius:50,position:'absolute',left:3,top:3,},
	msCheckBoxText: {fontFamily:Font.NotoSansRegular,fontSize:12,color:'#1e1e1e',marginLeft:6,},

	multiSliderDot: {width:16,height:16,backgroundColor:'#fff',borderWidth:2,borderColor:'#D1913C',borderRadius:50,position:'relative',zIndex:10,},
	multiSliderDotOff: {borderWidth:0,backgroundColor:'#F8F9FA'},

	multiSliderCustom: {flexDirection:'row',justifyContent:'space-between',position:'relative'},
	multiSliderDotBack: {width:innerWidth,height:2,backgroundColor:'#DBDBDB',position:'absolute',left:0,top:7,},
	multiSliderDotBackOn: {width:0,height:2,backgroundColor:'#D1913C',},

	filterGenBtn: {alignItems:'center',justifyContent:'center',width:(innerWidth/3)-7,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,},
	filterGenBtnOn: {backgroundColor:'#243B55',borderWidth:0,},
	filterGenBtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#666'},
	filterGenBtnTextOn: {color:'#fff'},

	nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },

	filterCalBox: {flexDirection:'row',flexWrap:'wrap'},
	filterCalBtn: {width:(innerWidth/7)-8.5714285714,marginTop:20,marginRight:9.9,},
	filterCalDay: {alignItems:'center',justifyContent:'center',width:42,height:42,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,},
	filterCalDayOn: {backgroundColor:'#243B55',borderWidth:0,},
	filterCalDayText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#666'},
	filterCalDayTextOn: {color:'#fff'},
	filterCalYoil: {marginTop:8,},
	filterCalYoilText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#1e1e1e'},

	pickDateBox: {flexDirection:'row',flexWrap:'wrap',},
	pickDateView: {alignItems:'center',justifyContent:'center',width:71,height:33,backgroundColor:'#EDF2FE',borderRadius:50,marginLeft:8,},
	pickDateViewText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:18,color:'#222'},

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
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
		elevation: 5,
	},
	boxShadow2: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
		elevation: 9,
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

export default MyCommunity