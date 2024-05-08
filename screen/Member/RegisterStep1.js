import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const RegisterStep1 = ({navigation, route}) => {	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [preventBack, setPreventBack] = useState(false);
	const [active, setActive] = useState(false);
	const [allChk, setAllChk] = useState(false);
	const [chk1, setCk1] = useState(false);
	const [chk2, setCk2] = useState(false);
	const [chk3, setCk3] = useState(false);
	const [chk4, setCk4] = useState(false);
	const [prvPopSt, setPrvPopSt] = useState(false);
	const [prvTitle, setPrvTitle] = useState('');
	const [prvContent, setPrvContent] = useState('');

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
				setPrvPopSt(false);    
				setPreventBack(false);
        e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');   				
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);
	
	function nextStep(){
		if(!chk1){ ToastMessage('서비스 이용약관에 동의해 주세요.'); return false; }
		if(!chk2){ ToastMessage('개인정보 수집 및 이용에 동의해 주세요.'); return false; }
		if(!chk3){ ToastMessage('민감정보 이용에 동의해 주세요.'); return false; }

		navigation.navigate('RegisterStep2', {
      prvChk4:chk4, 
    })
	}

	const popupAction = (idx) => {
		if(idx == 1){
			setPrvTitle('서비스 이용약관');
			setPrvContent('서비스 이용약관 약관입니다.');
		}else if(idx == 2){
			setPrvTitle('개인정보 수집 및 이용약관');
			setPrvContent('개인정보 수집 및 이용 동의 약관입니다.');
		}else if(idx == 3){
			setPrvTitle('민감정보 이용약관');
			setPrvContent('민감정보 이용 동의 약관입니다.');
		}else if(idx == 4){
			setPrvTitle('마케팅 수신 약관');
			setPrvContent('마케팅 수신 동의 약관입니다.');
		}
		setPrvPopSt(true);
		setPreventBack(true);
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";	

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'이용약관 동의'} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
				behavior={behavior}
				style={{flex: 1}}
      >
				<ScrollView>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={styles.cmWrap}>
							<View style={styles.chkView}>
								<TouchableOpacity
									style={styles.chkboxBtn}
									activeOpacity={0.9}
									onPress={() => {
										if (allChk) {
											setAllChk(false);
											setCk1(false);
											setCk2(false);
											setCk3(false);
											setCk4(false);
											setActive(false);
										} else {
											setAllChk(true);
											setCk1(true);
											setCk2(true);
											setCk3(true);
											setCk4(true);
											setActive(true);
										}
									}}
								>
									<View style={[styles.chkBox, styles.boxShadow]}>{allChk ? (<View style={styles.chkBoxCont}></View>) : null}</View>
									<Text style={styles.allChkLabel}>전체 동의</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.etcChkBox}>
								<View style={styles.chkView}>
									<TouchableOpacity
										style={styles.chkboxBtn}
										activeOpacity={opacityVal}
										onPress={() => {
											setCk1(!chk1);
											if (!chk1 && chk2 && chk3 && chk4) {
												setAllChk(true);
											} else {
												setAllChk(false);
											}

											if (!chk1 && chk2 && chk3) {
												setActive(true);
											} else {
												setActive(false);
											}
										}}
									>
										<View style={styles.chkBox}>{chk1 ? (<View style={styles.chkBoxCont}></View>) : null}</View>
										<Text style={styles.etcChkLabel}><Text style={styles.req}>[필수]</Text> 서비스 이용약관</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.prvBtn}
										activeOpacity={opacityVal}
										onPress={()=>{ popupAction(1) }}
									>
										<Text style={styles.prvBtnText}>약관보기</Text>
									</TouchableOpacity>
								</View>

								<View style={[styles.chkView, styles.mgt25]}>
									<TouchableOpacity
										style={styles.chkboxBtn}
										activeOpacity={opacityVal}
										onPress={() => {
											setCk2(!chk2);
											if (chk1 && !chk2 && chk3 && chk4) {
												setAllChk(true);
											} else {
												setAllChk(false);
											}

											if (chk1 && !chk2 && chk3) {
												setActive(true);
											} else {
												setActive(false);
											}
										}}
									>
										<View style={styles.chkBox}>{chk2 ? (<View style={styles.chkBoxCont}></View>) : null}</View>
										<Text style={styles.etcChkLabel}><Text style={styles.req}>[필수]</Text> 개인정보 수집 및 이용 동의</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.prvBtn}
										activeOpacity={opacityVal}
										onPress={()=>{ popupAction(2) }}
									>
										<Text style={styles.prvBtnText}>약관보기</Text>
									</TouchableOpacity>
								</View>

								<View style={[styles.chkView, styles.mgt25]}>
									<TouchableOpacity
										style={styles.chkboxBtn}
										activeOpacity={opacityVal}
										onPress={() => {
											setCk3(!chk3);
											if (chk1 && chk2 && !chk3 && chk4) {
												setAllChk(true);
											} else {
												setAllChk(false);
											}

											if (chk1 && chk2 && !chk3) {
												setActive(true);
											} else {
												setActive(false);
											}
										}}
									>
										<View style={styles.chkBox}>{chk3 ? (<View style={styles.chkBoxCont}></View>) : null}</View>
										<Text style={styles.etcChkLabel}><Text style={styles.req}>[필수]</Text> 민감정보 이용 동의</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.prvBtn}
										activeOpacity={opacityVal}
										onPress={()=>{ popupAction(3) }}
									>
										<Text style={styles.prvBtnText}>약관보기</Text>
									</TouchableOpacity>
								</View>

								<View style={[styles.chkView, styles.mgt25]}>
									<TouchableOpacity
										style={styles.chkboxBtn}
										activeOpacity={opacityVal}
										onPress={() => {
											setCk4(!chk4);
											if (chk1 && chk2 && chk3 && !chk4) {
												setAllChk(true);
											} else {
												setAllChk(false);
											}
										}}
									>
										<View style={styles.chkBox}>{chk4 ? (<View style={styles.chkBoxCont}></View>) : null}</View>
										<Text style={styles.etcChkLabel}><Text style={styles.sel}>[선택]</Text> 마케팅 수신 동의</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.prvBtn}
										activeOpacity={opacityVal}
										onPress={()=>{ popupAction(4) }}
									>
										<Text style={styles.prvBtnText}>약관보기</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={[styles.nextBtn, active ? null : styles.nextBtnOff]}
						activeOpacity={opacityVal}
						onPress={() => nextStep()}
					>
						<Text style={styles.nextBtnText}>다음</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
					
			{prvPopSt ? (
			<>
			<View style={styles.popBack}></View>
			<View style={styles.prvPop}>
				<TouchableOpacity
					style={styles.pop_x}					
					onPress={() => {
						setPrvPopSt(false);
						setPreventBack(false);
					}}
				>
					<AutoHeightImage
						width={18}
						source={require("../../assets/image/popup_x.png")}
					/>
				</TouchableOpacity>
				<View style={styles.popTitle}>
					<Text style={styles.popTitleText}>{prvTitle}</Text>
				</View>
				<ScrollView>
					<View style={styles.prvPopCont}>
						<Text style={styles.prvPopContText}>{prvContent}</Text>
					</View>
				</ScrollView>
			</View>
			</>
			) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: { marginTop: 62 },
  
  cmWrap: {paddingVertical:30,paddingHorizontal:20},
  cmTitleBox: {},
  cmTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:22,lineHeight:25,color:'#1e1e1e'},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},
	
	etcChkBox: {marginTop:25,paddingTop:25,borderTopWidth:1,borderTopColor:'#dbdbdb'},
	chkView: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
	chkboxBtn: {flexDirection:'row',alignItems:'center'},
	chkBox: { width: 21, height: 21, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbdbdb', borderRadius: 2, position: 'relative' },
	chkBoxCont: {width:12,height:12,backgroundColor:'#D1913C',borderRadius:2,position:'absolute',left:3,top:3,},
	allChkLabel: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:20,color:'#1E1E1E',marginLeft:8, position:'relative',top:LabelTop},
	etcChkLabel: {fontFamily: Font.NotoSansRegular, fontSize: 15, lineHeight: 20, color: '#1E1E1E',marginLeft:8 },
	req: { color: '#D1913C', },
	prvBtn: {borderBottomWidth:1,borderBottomColor:'#b8b8b8'},
	prvBtnText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#b8b8b8',},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,},
	nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
	nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
	
	boxShadow: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.2,
		elevation: 4,
		position:'relative'
	},

	mgt25: {marginTop:25},

	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.7},
	prvPop: {position:'absolute',left:20,top:stBarHt,width:innerWidth,height:innerHeight,backgroundColor:'#fff',borderRadius:10},
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingTop:50,paddingBottom:20,},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:20,},
	prvPopCont: {padding:20,paddingTop:10,},
	prvPopContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:19,}
})

export default RegisterStep1