import React, {useState, useEffect, useRef, useCallback, Component} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
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

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const Mypage = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const swiperRef = useRef(null);

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

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'MY PAGE'} />

			<ScrollView>
				<View style={styles.myProfInfo}>
					<TouchableOpacity
						style={styles.myProfInfoBtn}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('MatchDetail')}}
					>
						<AutoHeightImage width={36} source={require('../../assets/image/icon_my_sch.png')} />
					</TouchableOpacity>
					<View style={styles.myProfInfoThumb}>
						<AutoHeightImage width={104} source={require('../../assets/image/my_basic_prof.jpg')} />
					</View>				
					<TouchableOpacity
						style={styles.myProfInfoBtn}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('ProfieModify')}}						
					>
						<AutoHeightImage width={36} source={require('../../assets/image/icon_my_pencel.png')} />
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
						onPress={()=>{

						}}
					>
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<AutoHeightImage width={32} source={require('../../assets/image/mypage_menu1.png')} />
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>내 프로틴</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
						</View>
					</TouchableOpacity>
					<View style={styles.mypageMenuLine}></View>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>{

						}}
					>						
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<AutoHeightImage width={16} source={require('../../assets/image/mypage_menu2.png')} />
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>내 매력지수</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
						</View>
					</TouchableOpacity>
					<View style={styles.mypageMenuLine}></View>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>{

						}}
					>
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<AutoHeightImage width={20} source={require('../../assets/image/mypage_menu3.png')} />
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>새로운 회원 평가하기</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<View style={styles.mypageMenuBtnRightView}>
								<Text style={styles.mypageMenuBtnRightViewText}>프로틴 00개 혜택</Text>
							</View>
							<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
						</View>
					</TouchableOpacity>
					<View style={styles.mypageMenuLine}></View>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>{

						}}
					>
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<AutoHeightImage width={20} source={require('../../assets/image/mypage_menu4.png')} />
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>지인 초대하기</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<View style={styles.mypageMenuBtnRightView}>
								<Text style={styles.mypageMenuBtnRightViewText}>프로틴 00개 혜택</Text>
							</View>
							<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
						</View>
					</TouchableOpacity>
					<View style={styles.mypageMenuLine}></View>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>{

						}}
					>
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<AutoHeightImage width={20} source={require('../../assets/image/mypage_menu5.png')} />
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>공지/안내</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
						</View>
					</TouchableOpacity>
					<View style={styles.mypageMenuLine}></View>
					<TouchableOpacity
						style={styles.mypageMenuBtn}
						activeOpacity={opacityVal}
						onPress={()=>{

						}}
					>
						<View style={styles.mypageMenuBtnLeft}>
							<View style={styles.mypageMenuBtnIcon}>
								<AutoHeightImage width={20} source={require('../../assets/image/mypage_menu6.png')} />
							</View>
							<View style={styles.mypageMenuBtnName}>
								<Text style={styles.mypageMenuBtnNameText}>설정</Text>
							</View>
						</View>
						<View style={styles.mypageMenuBtnRight}>
							<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
						</View>
					</TouchableOpacity>
				</View>

				<View style={styles.swiperView}>
					<Swiper					
						ref={swiperRef}	
						autoplay={true}
						showsPagination={false}
						controlsProps={{
							prevTitle: '',
							nextTitle: '',
							dotsTouchable: true,
							DotComponent: ({ index, activeIndex, isActive, onPress }) => null              
						}}
						onIndexChanged={(e) => {
							//console.log(e);
							//setActiveDot(e);
						}}
					>
						<TouchableOpacity 
							style={styles.commuBanner}
							activeOpacity={opacityVal}
							onPress={()=>{}}
						>
							<AutoHeightImage width={widnowWidth} source={require('../../assets/image/social_banner.png')}	/>
						</TouchableOpacity>
						<TouchableOpacity 
							style={styles.commuBanner}
							activeOpacity={opacityVal}
							onPress={()=>{}}
						>
							<AutoHeightImage width={widnowWidth} source={require('../../assets/image/social_banner.png')}	/>
						</TouchableOpacity>
					</Swiper>
				</View>
				<View style={styles.gapBox}></View>
			</ScrollView>

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