import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {connect} from 'react-redux';

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

const MyCharm = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);

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

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} />

			<ScrollView>
        <View style={styles.cmWrap}>
					<View style={styles.regiTypingView}>
						<View style={styles.cmTitleBox}>
							<Text style={styles.cmTitleText}>나의 매력지수</Text>
						</View>
            <View style={styles.cmDescBox}>
							<Text style={styles.cmDescText}>피지컬 매치 회원들이 평가한</Text>
              <Text style={styles.cmDescText}>나의 매력지수를 확인해 보세요!</Text>
						</View>
					</View>

					<View style={styles.progress}>
						<View style={styles.progressWrap}>
							<AnimatedCircularProgress
								size={194}
								width={25}
								fill={80}
								tintColor="#8AA6EE"
								onAnimationComplete={() => console.log('onAnimationComplete')}
								backgroundColor="#F2F4F6"
								rotation={0}
								lineCap="round"
								delay={250}
							/>
							<View style={styles.progressInfo}>
								<View>
									<View style={styles.progressInfo1}>
										<AutoHeightImage width={12} source={require('../../assets/image/star.png')} />
										<View style={styles.progressInfo1TextView}>
											<Text style={styles.progressInfo1Text}>4.5</Text>
										</View>
									</View>
									<View style={styles.progressInfo2}>
										<Text style={styles.progressInfo2Text}>상위 10%</Text>
									</View>
								</View>
							</View>
						</View>						
					</View>					
				</View>

				<View style={styles.lineView}></View>

				<View style={[styles.cmWrap, styles.pdb10]}>
					<View style={styles.charmTitle}>
						<Text style={styles.charmTitleText}>매력지수를 높여보세요!</Text>
					</View>
					<TouchableOpacity
						style={[styles.charmBtn, styles.borderNot]}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('MyProfile')}}
					>
						<View style={styles.charmBtnLeft}>
							<AutoHeightImage width={13} source={require('../../assets/image/icon_charm1.png')} />
							<View style={[styles.charmBtnTitle, styles.charmBtnTitle2]}>
								<Text style={styles.charmBtnTitleText}>더 멋진 프로필 사진으로!</Text>
							</View>
						</View>
						<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.charmBtn]}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('MyIntro')}}
					>
						<View style={styles.charmBtnLeft}>
							<AutoHeightImage width={13} source={require('../../assets/image/icon_charm2.png')} />
							<View style={styles.charmBtnTitle}>
								<Text style={styles.charmBtnTitleText}>내 소개를 더 상세하게</Text>
							</View>
						</View>
						<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.charmBtn]}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('MyBadge')}}
					>
						<View style={styles.charmBtnLeft}>
							<AutoHeightImage width={13} source={require('../../assets/image/icon_charm3.png')} />
							<View style={styles.charmBtnTitle}>
								<Text style={styles.charmBtnTitleText}>배지로 프로필 업그레이드</Text>
							</View>
						</View>
						<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.charmBtn]}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('MyCert')}}
					>
						<View style={styles.charmBtnLeft}>
							<AutoHeightImage width={13} source={require('../../assets/image/icon_charm4.png')} />
							<View style={styles.charmBtnTitle}>
								<Text style={styles.charmBtnTitleText}>인증하고 신뢰도 다지기</Text>
							</View>
						</View>
						<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.charmBtn]}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('MyDate')}}
					>
						<View style={styles.charmBtnLeft}>
							<AutoHeightImage width={13} source={require('../../assets/image/icon_charm5.png')} />
							<View style={styles.charmBtnTitle}>
								<Text style={styles.charmBtnTitleText}>가치관 입력해 호감도 UP!</Text>
							</View>
						</View>
						<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.charmBtn]}
						activeOpacity={opacityVal}
						onPress={()=>{navigation.navigate('MyHobby')}}
					>
						<View style={styles.charmBtnLeft}>
							<AutoHeightImage width={13} source={require('../../assets/image/icon_charm6.png')} />
							<View style={styles.charmBtnTitle}>
								<Text style={styles.charmBtnTitleText}>관심을 끄는 취미 · 관심사</Text>
							</View>
						</View>
						<AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
					</TouchableOpacity>
				</View>
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
	gapBox: {height:80,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

  reject: {paddingHorizontal:20,paddingBottom:10,},
  rejectBox: {padding:15,backgroundColor:'rgba(255,120,122,0.1)',borderRadius:5,},
  rejectText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#DE282A'},

  cmWrap: {paddingTop:30,paddingBottom:40,paddingHorizontal:20},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

	progress: {alignItems:'center',justifyContent:'center',marginTop:40,},
	progressWrap: {width:194,height:194,position:'relative'},
	progressInfo: {alignItems:'center',justifyContent:'center',width:194,height:194,position:'absolute',left:0,top:0,},
	progressInfo1: {flexDirection:'row',alignItems:'center',justifyContent:'center',},
	progressInfo1TextView: {position:'relative',top:0.5,marginLeft:4,},
	progressInfo1Text: {fontFamily:Font.RobotoRegular,fontSize:14,lineHeight:16,color:'#888'},
	progressInfo2: {marginTop:2,},
	progressInfo2Text: {fontFamily:Font.NotoSansSemiBold,fontSize:16,color:'#1e1e1e',},

	charmTitle: {marginBottom:20,},
	charmTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:19,color:'#1e1e1e'},
	charmBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:20,borderTopWidth:1,borderTopColor:'#EDEDED'},
	charmBtnLeft: {flexDirection:'row',alignItems:'center'},
	charmBtnTitle: {marginLeft:2,position:'relative'},
	charmBtnTitle2: {top:1,},
	charmBtnTitleText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,},

	red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

  boxShadow2: {
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
		elevation: 4,
	},

	borderNot: {borderTopWidth:0},
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
  mgt15: {marginTop:15},
	mgt20: {marginTop:20},
	mgt30: {marginTop:30},
	mgt40: {marginTop:40},
	mgt50: {marginTop:50},
	mgb10: {marginBottom:10},
	mgb20: {marginBottom:20},
	mgr0: {marginRight:0},
  mgr10: {marginRight:10},
  mgr15: {marginRight:15},
	mgl0: {marginLeft:0},
  mgl4: {marginLeft:4},
  mgl10: {marginLeft:10},
  mgl15: {marginLeft:15},
})

export default MyCharm