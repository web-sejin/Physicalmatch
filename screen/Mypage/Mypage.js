import React, {useState, useEffect, useRef, useCallback, Component} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';

const padding_top = Platform.OS === 'ios' ? 10 : 15;
const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const Mypage = (props) => {
	const swp = [
    {idx:1, imgUrl:'', type:'community_guide'},
    {idx:2, imgUrl:'', type:'social_guide'},
    {idx:3, imgUrl:'', type:'shop_free'},
  ]

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const swiperRef = useRef(null);
	const [swiperList, setSwiperList] = useState([]);
	const [guideModal, setGuideModal] = useState(false);
	const [guideModal2, setGuideModal2] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setAll(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	useEffect(() => {
		setSwiperList(swp);
	}, [])

	const notMember = () => {
		ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
	}
 
	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'MY PAGE'} />

			<View style={{...styles.screening, paddingTop:padding_top}}>
				<View style={styles.screeningTitle}>					
					<ImgDomain fileWidth={16} fileName={'icon_screening.png'}/>
					<View style={styles.screeningView}>
						<Text style={styles.screeningText}>프로필이 심사 중에 있습니다.</Text>
					</View>
				</View>
				<View style={styles.screeningDesc}>
					<Text style={styles.screeningDescText}>심사 완료까지 1~2일이 소요됩니다.</Text>
				</View>
			</View>			

			<ScrollView>
				<View style={styles.myProfInfo}>
					<TouchableOpacity
						style={styles.myProfInfoBtn}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('MatchDetail')}}
					>
						<ImgDomain fileWidth={36} fileName={'icon_my_sch.png'}/>
					</TouchableOpacity>
					<View style={styles.myProfInfoThumb}>
						{/* <AutoHeightImage width={110} source={{uri:'https://cnj02.cafe24.com/appImg/woman2.png'}} resizeMethod='resize' /> */}
						<ImgDomain fileWidth={104} fileName={'my_basic_prof.jpg'}/>
					</View>				
					<TouchableOpacity
						style={styles.myProfInfoBtn}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('ProfieModify')}}						
					>
						<ImgDomain fileWidth={36} fileName={'icon_my_pencel.png'}/>
						{/* <ImgDomain fileWidth={36} fileName={'icon_eraser.png'}/> */}
					</TouchableOpacity>

					<View style={styles.myProfInfoNick}>
						<Text style={styles.myProfInfoNickText}>닉네임최대여덟자</Text>
					</View>
				</View>

				<View style={styles.lineView}></View>

				<View style={styles.mypageMenu}>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('MyPoint')}}
					>
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<ImgDomain fileWidth={32} fileName={'mypage_menu1.png'}/>
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>내 프로틴</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
						</View>
					</TouchableOpacity>
					<View style={styles.mypageMenuLine}></View>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('MyCharm')}}
					>						
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<ImgDomain fileWidth={16} fileName={'mypage_menu2.png'}/>
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>내 매력지수</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
						</View>
					</TouchableOpacity>
					<View style={styles.mypageMenuLine}></View>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('NewMember')}}
					>
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<ImgDomain fileWidth={20} fileName={'mypage_menu3.png'}/>
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>새로운 회원 평가하기</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<View style={styles.mypageMenuBtnRightView}>
								<Text style={styles.mypageMenuBtnRightViewText}>프로틴 00개 혜택</Text>
							</View>
							<ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
						</View>
					</TouchableOpacity>
					<View style={styles.mypageMenuLine}></View>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('MyInvite')}}
					>
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<ImgDomain fileWidth={20} fileName={'mypage_menu4.png'}/>
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>지인 초대하기</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<View style={styles.mypageMenuBtnRightView}>
								<Text style={styles.mypageMenuBtnRightViewText}>프로틴 00개 혜택</Text>
							</View>
							<ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
						</View>
					</TouchableOpacity>
					<View style={styles.mypageMenuLine}></View>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('BoardMenu')}}
					>
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<ImgDomain fileWidth={20} fileName={'mypage_menu5.png'}/>
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>공지/안내</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
						</View>
					</TouchableOpacity>
					<View style={styles.mypageMenuLine}></View>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('SettingMenu')}}
					>
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<ImgDomain fileWidth={20} fileName={'mypage_menu6.png'}/>
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>설정</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>notMember()}
					>
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<ImgDomain fileWidth={20} fileName={'mypage_menu6.png'}/>
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>비회원용 토스트 메세지</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
						</View>
					</TouchableOpacity>					
				</View>

				<View style={styles.swiperView}>
					<SwiperFlatList
							ref={swiperRef}
							index={0}
							data={swiperList}
							onChangeIndex={(obj) => {
								
							}}
							renderItem={({ item, index }) => {
								return (
									<TouchableOpacity 
										key={index}
										style={styles.commuBanner}
										activeOpacity={opacityVal}
										onPress={()=>{
											if(item.type == 'community_guide'){
												setGuideModal(true);
											}else if(item.type == 'social_guide'){
												setGuideModal2(true);
											}else if(item.type == 'shop_free'){
												navigation.navigate('Shop', {tab:2});
											}
										}}
									>
										<ImgDomain fileWidth={widnowWidth} fileName={'slide_banner'+(index+1)+'.png'} />
									</TouchableOpacity>
								)
							}}
						/>
				</View>
				<View style={styles.gapBox}></View>
			</ScrollView>

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
				<ScrollView>
					<View style={styles.guidePopCont}>
						<Text style={styles.guidePopContText}>커뮤니티 가이드입니다.</Text>
					</View>
				</ScrollView>
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
				<ScrollView>
					<View style={styles.guidePopCont}>
						<Text style={styles.guidePopContText}>소셜 가이드입니다.</Text>
					</View>
				</ScrollView>
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
	headerTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:20,paddingBottom:10,paddingHorizontal:20,},
	headerTitle: {},
	headerTitleText: {fontFamily:Font.RobotoMedium,fontSize:24,lineHeight:26,color:'#fff'},
	headerLnb: {flexDirection:'row',alignItems:'center',},
	headerLnbBtn: {marginLeft:16,},
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

	guidePopCont: {padding:20,},
	guidePopContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e'},

	myProfInfo: {flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'center',paddingTop:40,paddingBottom:50},
	myProfInfoBtn: {},
	myProfInfoThumb: {alignItems:'center',justifyContent:'center',width:102,height:102,backgroundColor:'#fff',borderWidth:2,borderColor:'#EDEDED',borderRadius:50,overflow:'hidden',marginHorizontal:15,},
	myProfInfoNick: {width:innerWidth,paddingTop:20,},
	myProfInfoNickText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:20,lineHeight:23,color:'#1e1e1e'},

	mypageMenu: {},
	mypageMenuBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',padding:20,},
	mypageMenuLine: {width:innerWidth,height:1,backgroundColor:'#EDEDED',marginHorizontal:20,},
	mypageMenuBtnLeft: {flexDirection:'row',alignItems:'center'},
	mypageMenuBtnIcon: {alignItems:'center',justifyContent:'center',width:32,height:32,},
	mypageMenuBtnName: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:18,color:'#1e1e1e',marginLeft:10,},
	mypageMenuBtnNameText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:18,color:'#1e1e1e'},
	mypageMenuBtnRight: {flexDirection:'row',alignItems:'center'},
	mypageMenuBtnRightView: {marginRight:20,},
	mypageMenuBtnRightViewText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:15,color:'#888'},
	
	swiperView: {height: widnowWidth/4.9,backgroundColor:'#fff'},

	screening: {alignItems:'center',justifyContent:'center',paddingVertical:10,paddingHorizontal:20,backgroundColor:'#243B55'},
	screeningTitle: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	screeningView: {marginLeft:7,},
	screeningText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:19,color:'#fff'},
	screeningDesc: {marginTop:2,},
	screeningDescText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:21,color:'#fff',opacity:0.5},

	lineView: {height:6,backgroundColor:'#F2F4F6'},
	pdt0: {paddingTop:0},
  pdt10: {paddingTop:10},
  pdt15: {paddingTop:15},
  pdt20: {paddingTop:20},
  pdt30: {paddingTop:30},
  pdt40: {paddingTop:40},
  pdb0: {paddingBottom:0},
  pdb10: {paddingBottom:10},
  pdb20: {paddingBottom:20},
  pdb30: {paddingBottom:30},
  pdb40: {paddingBottom:40},
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
  mgr15: {marginRight:15},
	mgl0: {marginLeft:0},
  mgl15: {marginLeft:15},
})

export default Mypage