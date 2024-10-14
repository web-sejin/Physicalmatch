import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Image, Dimensions, ImageBackground, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import AsyncStorage from '@react-native-community/async-storage';
import { WebView } from 'react-native-webview';

import APIs from '../../assets/APIs';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const Community = (props) => {
	const swp = [
    {idx:1, imgUrl:'', type:'community_guide'},
    {idx:2, imgUrl:'', type:'social_guide'},
    {idx:3, imgUrl:'', type:'shop_free'},
		{idx:4, imgUrl:'', type:'exercise_guide'},
  ]
	const webViews = useRef();
  const webViews2 = useRef();
	const webViews3 = useRef();
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const swiperRef = useRef(null);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [memberIdx, setMemberIdx] = useState();
	const [memberInfo, setMemberInfo] = useState();
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [nowPage, setNowPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	
	const [commList, setCommList] = useState([]);
	const [swiperList, setSwiperList] = useState([]);
	const [resetState, setResetState] = useState(false);
	const [guideModal, setGuideModal] = useState(false);
	const [guideModal2, setGuideModal2] = useState(false);
	const [guideModal3, setGuideModal3] = useState(false);
	const [guideComm, setGuideComm] = useState('');
  const [guideSocial, setGuideSocial] = useState('');
	const [guideExercise, setGuideExercise] = useState('');

	const [tabState, setTabState] = useState(0); //자유, 운동, 프교, 셀소
	const [commSch, setCommSch] = useState('');	

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
		}else{
			//console.log("isFocused");
			setRouteLoad(true);
			setPageSt(!pageSt);

			//console.log('userInfo comm :::: ', userInfo.is_new);

			AsyncStorage.getItem('member_idx', (err, result) => {		
				setMemberIdx(result);
			});

			if(params?.reload){	
				//console.log('reload!!!');
				getMemInfo();
        getCommList(1);
				setNowPage(1);
        delete params?.reload;
      }
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

	useEffect(() => {
		setSwiperList(swp);
		getGuide1();
		//getGuide2();
		//getGuide3();
	}, []);

	useEffect(() => {
		if(memberIdx){
			setLoading(true);
			getMemInfo();			
			getCommList(1);
			setNowPage(1);
		}
	}, [memberIdx, tabState]);

	useEffect(() => {
		if(resetState){
			setLoading(true);			
			getCommList(1);	
			setNowPage(1);		
			setResetState(false);			
		}
	}, [resetState]);

	const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
    //console.log(response);
		if(response.code == 200){
			setMemberInfo(response.data);
		}
	}

	const getCommList = async (viewPage) => {
		let curr_page = nowPage;
		if(viewPage){
			curr_page = viewPage;
		}
		if(commList.length < 1){
			curr_page = 1;
		}

		let curr_tab = tabState;		
		if(params?.writeType){
			setTabState(params?.writeType);
			curr_tab = params?.writeType;
			delete params?.writeType;
		}
		let sData = {
			basePath: "/api/community/",
			type: "GetCommunityList",
			member_idx: memberIdx,
			comm_type: curr_tab,
			comm_sch: commSch,
			page:curr_page,
		};
		//console.log('sData ::: ', sData);
		const response = await APIs.send(sData);		
		//console.log('curr_page::: ', curr_page);
		//console.log('curr_tab::: ', curr_tab);
		//console.log(response);
		if(response.code == 200){		
			//setTotalPage(Math.ceil(response.data.length/10));								
			if(curr_page == 1){					
				if(response.msg == 'EMPTY'){
					setNowPage(1);
					setCommList([]);
					//console.log('1');
				}else{
					setCommList(response.data);
				}
			}else if(curr_page > 1 && response.msg != 'EMPTY'){								
				//console.log(response.data);
				const addList = [...commList, ...response.data];
				setCommList(addList);
			}
				
		}
		setTimeout(function(){
			setLoading(false);
		}, 300);
	}

	const getList = ({item, index}) => {
		let cateString = '';
		if(item.comm_type == 0){
			cateString = '자유';
		}else if(item.comm_type == 1){
			cateString = '운동';
		}else if(item.comm_type == 2){
			cateString = '프교';
		}else if(item.comm_type == 3){
			cateString = '셀소';
		}

		return (
			<View style={[styles.commLi, index == 0 ? styles.mgt0 : null]}>
				<TouchableOpacity
					style={[styles.commLiBtn, index == 0 ? styles.pdt0 : null]}
					activeOpacity={opacityVal}
					onPress={()=>{
						navigation.navigate('CommunityView', {comm_idx:item.comm_idx, cateName:cateString});
					}}
				>
					<View style={styles.commLiProfile}>										
						{item.host_comm_sex == 0 ? (
							<ImgDomain fileWidth={40} fileName={'profile_sample.png'}/>
						) : (
							<ImgDomain fileWidth={40} fileName={'profile_sample2.png'}/>
						)}
					</View>
					<View style={[styles.commLiInfo, item.ci_img ? null : styles.commLiInfo2]}>
						<View style={styles.commLiInfoSubject}>
							<Text style={styles.commLiInfoSubjectText} numberOfLines={1} ellipsizeMode='tail'>{item.comm_subject}</Text>
							{item.comm_care == 1 ? (
								<View style={styles.commLiInfoAlert}>
									<ImgDomain fileWidth={13} fileName={'icon_alert2.png'}/>
								</View>							
							) : null}						
						</View>
						<View style={styles.commLiSubInfo}>
							<View style={styles.commLiSubView}>
								<ImgDomain fileWidth={16} fileName={'icon_view.png'}/>
								<Text style={styles.commLiSubViewText}>{item.comm_view}</Text>
							</View>
							<View style={[styles.commLiSubView, styles.commLiSubView2]}>
								<ImgDomain fileWidth={16} fileName={'icon_review.png'}/>
								<Text style={styles.commLiSubViewText}>{item.comment_cnt}</Text>
							</View>
							<View style={styles.commLiSubLine}></View>
							<View style={styles.commLiSubView}>
								<Text style={styles.commLiSubViewText}>{item.comm_date_text}</Text>
							</View>
						</View>
					</View>
					{item.ci_img ? (
					<ImageBackground
						style={styles.commLiThumb}						
						source={{uri:`https://physicalmatch.co.kr/${item.ci_img}`}}
						resizeMode='cover'
						blurRadius={item.comm_care == 1 ? 6 : 0}
					>					
						{item.comm_care == 1 ? (<ImgDomain fileWidth={20} fileName={'icon_blurview.png'} />) : null}	
					</ImageBackground>
					) : null}
				</TouchableOpacity>
			</View>
		)
	}

	const onScroll = (e) => {
		const {contentSize, layoutMeasurement, contentOffset} = e.nativeEvent;
		//console.log({contentSize, layoutMeasurement, contentOffset});
		//console.log(contentOffset.y);	
	};

	//리스트 무한 스크롤
	const moreData = async () => {		
		//console.log('moreData nowPage ::::', nowPage);
		if (commList.length > 0) {
			getCommList(nowPage + 1);
			setNowPage(nowPage + 1);
		}
	}

	const onRefresh = () => {
		if(!refreshing) {
			setRefreshing(true);
			getCommList(1);
			setNowPage(1);
			//console.log('refresh!!!');
			setTimeout(() => {
				setRefreshing(false);
			}, 2000);
		}
	}

	const Search = async () => {
		if(commSch.length < 2){
			ToastMessage('검색어는 2글자 이상 입력해 주세요.');
			return false;
		}

		setLoading(true);
		getCommList(1);
		setNowPage(1);
	}

	const getGuide1 = async () => {
    let sData = {
			basePath: "/api/etc/",
			type: "GetGuide",
			tab: 1,
		};

		const response = await APIs.send(sData);    		
    setGuideSocial(response.data);
  }

  const getGuide2 = async () => {
    let sData = {      
      basePath: "/api/etc/",
			type: "GetGuide",
      tab: 2,
		}

		const response = await APIs.send(sData);
    setGuideComm(response.data);
  }

	const getGuide3 = async () => {
    let sData = {      
      basePath: "/api/etc/",
			type: "GetGuide",
      tab: 3,
		}

		const response = await APIs.send(sData);
    setGuideExercise(response.data);
  }

	const moveAlimPage = async () => {
		console.log('alarm_type ::: ', userInfo?.alarm_type);
		navigation.navigate('Alim', {alarm_type:userInfo?.alarm_type});
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<View style={styles.header}>
				<View style={styles.headerTop}>
					<View style={styles.headerTopTitle}>
						<Text style={styles.headerTitleText}>Community</Text>
					</View>
					<View style={styles.headerLnb}>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								if(memberInfo?.member_type != 1){
									ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
								}else{
									navigation.navigate('MyCommunity');
								}
							}}
						>
							<ImgDomain fileWidth={24} fileName={'icon_mycommuity.png'} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								if(memberInfo?.member_type != 1){
									ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
								}else{
									navigation.navigate('Shop');
								}
							}}		
						>
							<ImgDomain fileWidth={24} fileName={'icon_shop.png'} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => moveAlimPage()}
						>
							{userInfo?.is_new == 'y' ? (
								<ImgDomain fileWidth={24} fileName={'icon_alim_on.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon_alim_off.png'}/>
							)}
						</TouchableOpacity>
					</View>
				</View>
				{/* <ScrollView horizontal={true} showsHorizontalScrollIndicator = {false} ></ScrollView> */}
				<View style={styles.headerBot}>
					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(0)}}
					>
						<Text style={[styles.headerTabText, tabState == 0 ? styles.headerTabTextOn : null]}>자유</Text>
						{tabState == 0 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(1)}}
					>
						<Text style={[styles.headerTabText, tabState == 1 ? styles.headerTabTextOn : null]}>운동</Text>
						{tabState == 1 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(2)}}
					>
						<Text style={[styles.headerTabText, tabState == 2 ? styles.headerTabTextOn : null]}>프교</Text>
						{tabState == 2 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(3)}}
					>
						<Text style={[styles.headerTabText, tabState == 3 ? styles.headerTabTextOn : null]}>셀소</Text>
						{tabState == 3 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					{/* <TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(5)}}
					>
						<Text style={[styles.headerTabText, tabState == 5 ? styles.headerTabTextOn : null]}>추가1</Text>
						{tabState == 5 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(6)}}
					>
						<Text style={[styles.headerTabText, tabState == 6 ? styles.headerTabTextOn : null]}>추가2</Text>
						{tabState == 6 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity> */}
				</View>
				
			</View>
			
			<FlatList 				
				data={commList}
				renderItem={(getList)}
				keyExtractor={(item, index) => index.toString()}
				refreshing={refreshing}
				disableVirtualization={false}
				onScroll={onScroll}	
				onEndReachedThreshold={0.8}
				onEndReached={moreData}
				onRefresh={onRefresh}
				ListHeaderComponent={
					<>
					{/* 깃허브에 2024.10.11 자로 스와이퍼 버전 있습니다. */}
					<View style={styles.swiperView}>
						<TouchableOpacity 
							style={styles.commuBanner}
							activeOpacity={opacityVal}
							onPress={()=>{
								setGuideModal(true);
							}}
						>
							<ImgDomain fileWidth={widnowWidth} fileName={'slide_banner1.png'} />
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
								<ImgDomain fileWidth={28} fileName={'icon_sch.png'}/>
							</TouchableOpacity>
							<TextInput
								value={commSch}
								onChangeText={(v) => setCommSch(v)}
								style={[styles.socialSchBoxWrapInput]}
								returnKyeType='done'  
								onSubmitEditing={Search}
							/>
						</View>
						<TouchableOpacity
							style={styles.socialSchFilterBtn}
							activeOpacity={opacityVal}
							onPress={()=>{
								setCommSch('');
								setResetState(true);
							}}
						>
							<ImgDomain fileWidth={22} fileName={'icon_refresh.png'}/>
						</TouchableOpacity>
					</View>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={styles.flatListPad}></View>
					</TouchableWithoutFeedback>
					</>					
				}
				ListEmptyComponent={
					<View style={styles.notData}>
						<Text style={styles.notDataText}>등록된 커뮤니티가 없습니다.</Text>
					</View>
				}
			/>
			<View style={styles.gapBox}></View>

			{keyboardStatus == 0 || keyboardStatus == 1 ? (
			<TouchableOpacity
				style={[styles.wrtBtn, styles.wrtBtnBoxShadow, keyboardStatus == 1 ? styles.wrtBtnHide : null]}
        activeOpacity={opacityVal}
        onPress={()=>{
					if(memberInfo?.member_type != 1){
						ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
					}else{
						navigation.navigate('CommunityWrite');
					}
				}}
      >
				<ImgDomain fileWidth={60} fileName={'icon_write.png'}/>
      </TouchableOpacity>
			) : null}

			{/* 커뮤니티 가이드 */}
			<Modal
				visible={guideModal}
				animationType={"none"}
				onRequestClose={() => {setGuideModal(false)}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.modalHeader}>	
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>커뮤니티 이용 가이드</Text>
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {setGuideModal(false)}}						
					>
						<ImgDomain fileWidth={16} fileName={'icon_close2.png'}/>
					</TouchableOpacity>
				</View>
				<View style={styles.guidePopCont}>
					<WebView
						ref={webViews}
						source={{uri: guideComm}}
						useWebKit={false}						
						javaScriptEnabledAndroid={true}
						allowFileAccess={true}
						renderLoading={true}
						mediaPlaybackRequiresUserAction={false}
						setJavaScriptEnabled = {false}
						scalesPageToFit={true}
						allowsFullscreenVideo={true}
						allowsInlineMediaPlayback={true}						
						originWhitelist={['*']}
						javaScriptEnabled={true}
						textZoom = {100}
					/>
				</View>
			</Modal>

			{/* 소셜 가이드 */}
			<Modal
				visible={guideModal2}
				animationType={"none"}
				onRequestClose={() => {setGuideModal2(false)}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.modalHeader}>	
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>소셜 이용 가이드</Text>
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {setGuideModal2(false)}}						
					>
						<ImgDomain fileWidth={16} fileName={'icon_close2.png'}/>
					</TouchableOpacity>
				</View>
				<View style={styles.guidePopCont}>
					<WebView
						ref={webViews2}
						source={{uri: guideSocial}}
						useWebKit={false}						
						javaScriptEnabledAndroid={true}
						allowFileAccess={true}
						renderLoading={true}
						mediaPlaybackRequiresUserAction={false}
						setJavaScriptEnabled = {false}
						scalesPageToFit={true}
						allowsFullscreenVideo={true}
						allowsInlineMediaPlayback={true}						
						originWhitelist={['*']}
						javaScriptEnabled={true}
						textZoom = {100}
					/>
				</View>
			</Modal>

			{/* 오운완 가이드 */}
			<Modal
				visible={guideModal3}
				animationType={"none"}
				onRequestClose={() => {setGuideModal3(false)}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.modalHeader}>	
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>오운완 이용 가이드</Text>
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {setGuideModal3(false)}}						
					>
						<ImgDomain fileWidth={16} fileName={'icon_close2.png'}/>
					</TouchableOpacity>
				</View>
				<View style={styles.guidePopCont}>
					<WebView
						ref={webViews3}
						source={{uri: guideExercise}}
						useWebKit={false}						
						javaScriptEnabledAndroid={true}
						allowFileAccess={true}
						renderLoading={true}
						mediaPlaybackRequiresUserAction={false}
						setJavaScriptEnabled = {false}
						scalesPageToFit={true}
						allowsFullscreenVideo={true}
						allowsInlineMediaPlayback={true}						
						originWhitelist={['*']}
						javaScriptEnabled={true}
						textZoom = {100}
					/>
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

	header: {backgroundColor:'#141E30'},
	headerTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:20,paddingBottom:10,},
	headerTopTitle: {paddingLeft:20,},
	headerTitleText: {fontFamily:Font.RobotoMedium,fontSize:24,lineHeight:26,color:'#fff'},
	headerLnb: {flexDirection:'row',alignItems:'center',paddingRight:15,},
	headerLnbBtn: {marginLeft:6,paddingHorizontal:5,},
	headerBot: {flexDirection:'row',},
	headerTab: {width:widnowWidth/4,height:60,alignItems:'center',justifyContent:'center',position:'relative',paddingTop:10,},
	headerTabText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#fff'},
	headerTabTextOn: {fontFamily:Font.NotoSansBold,color:'#FFD194'},
	activeLine: {width:widnowWidth/4,height:4,backgroundColor:'#FFD194',position:'absolute',left:0,bottom:0,zIndex:10,},

	modalHeader: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},
	filterResetBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:20,height:48,backgroundColor:'#fff',position:'absolute',top:0,right:0,zIndex:10,},
	filterResetText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#1E1E1E',marginLeft:6,},

	guidePopCont: {flex:1,},
	guidePopContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e'},

	socialSchBox: {paddingHorizontal:20,paddingBottom:10,flexDirection:'row',justifyContent:'space-between'},
	socialSchBoxWrap: {flexDirection:'row',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,},
	socialSchBoxWrapBtn: {alignItems:'center',justifyContent:'center',width:38,height:40,backgroundColor:'#F9FAFB',},
	socialSchBoxWrapInput: {width:innerWidth-78,height:40,backgroundColor:'#F9FAFB',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#1e1e1e'},	
	socialSchFilterBtn: {justifyContent:'center',width:28,height:40,},
	flatListPad: {height:20,},

	swiperView: {height: widnowWidth/4.9,backgroundColor:'#fff'},

	cmWrap: {paddingBottom:40,paddingHorizontal:20,},
	cmWrap2: {paddingTop:30,},
	wrtBtn: {position:'absolute',right:20,bottom:96,width:60,height:60,zIndex:100,backgroundColor:'#fff'},
	wrtBtnHide: {opacity:0,},
	wrtBtnBoxShadow: {
    borderRadius:50,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
		elevation: 4,
	},

	commLi: {marginTop:5,},
	commLiBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:20,},
	commLiProfile: {alignItems:'center',justifyContent:'center',width:38,height:38,borderRadius:50,overflow:'hidden'},
	commLiInfo: {width:innerWidth-80,paddingHorizontal:10,},
	commLiInfo2: {width:innerWidth-38,paddingRight:0,},
	commLiInfoSubject: {flexDirection:'row',alignItems:'center',},
	commLiInfoSubjectText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:19,color:'#1e1e1e'},
	commLiInfoAlert: {marginLeft:4,},
	commLiSubInfo: {flexDirection:'row',alignItems:'center',marginTop:5},
	commLiSubView: {flexDirection:'row',alignItems:'center',},
	commLiSubView2: {marginLeft:4,},
	commLiSubViewText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:14,color:'#B8B8B8'},
	commLiSubLine: {width:1,height:6,backgroundColor:'#EDEDED',marginHorizontal:7,position:'relative',top:1,},
	commLiThumb: {alignItems:'center',justifyContent:'center',width:42,height:42,borderWidth:1,borderColor:'#EDEDED',borderRadius:5,overflow:'hidden'},


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

	notData: {paddingTop:50},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:13,color:'#666'},

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

export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(Community);