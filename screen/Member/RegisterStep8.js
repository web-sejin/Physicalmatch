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
import { ScrollView as GestureHandlerScrollView } from 'react-native-gesture-handler'
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';

import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 20;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;

const RegisterStep8 = ({navigation, route}) => {		
	// const nextObj = {
	// 	prvChk4:route['params']['prvChk4'],
	// 	accessRoute:route['params']['accessRoute'],
	// 	mb_id:route['params']['mb_id'],
	// 	mb_pw:route['params']['mb_pw'],
	// 	mb_nick:route['params']['mb_nick'],
	// 	mb_gender:route['params']['mb_gender'],
	// 	mb_local1:route['params']['mb_local1'],
	// 	mb_local2:route['params']['mb_local2'],
	// 	mb_class1:route['params']['mb_class1'],
	// 	mb_class2:route['params']['mb_class2'],
	// 	mb_job:route['params']['mb_job'],
	// 	mb_jobDetail:route['params']['mb_jobDetail'],
	// 	mb_height:route['params']['mb_height'],
	// 	mb_weight:route['params']['mb_weight'],
	// 	mb_muscle:route['params']['mb_muscle'],
	// 	mb_fat:route['params']['mb_fat'],
	// 	mb_no_weight:route['params']['mb_no_weight'],
	// 	mb_no_muscle:route['params']['mb_no_muscle'],
	// 	mb_no_fat:route['params']['mb_no_fat'],
	// 	mb_rest:route['params']['mb_rest'],
	// 	mb_exercise:route['params']['mb_exercise'],
	// 	mb_physicalType:route['params']['mb_physicalType'],
	// 	mb_drink:route['params']['mb_drink'],
	// 	mb_smoke:route['params']['mb_smoke'],
	// 	mb_smokeSort:route['params']['mb_smokeSort'],
	// 	mb_mbit1:route['params']['mb_mbit1'],
	// 	mb_mbit2:route['params']['mb_mbit2'],
	// 	mb_mbit3:route['params']['mb_mbit3'],
	// 	mb_mbit4:route['params']['mb_mbit4'],
	// 	mb_religion:route['params']['mb_religion'],
	// }

	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [currFocus, setCurrFocus] = useState('');
	const [preventBack, setPreventBack] = useState(false);
	const [file1, setFile1] = useState({});
	const [file2, setFile2] = useState({});
	const [file3, setFile3] = useState({});
	const [file4, setFile4] = useState({});
	const [file5, setFile5] = useState({});
	const [file6, setFile6] = useState({});
	const [guideModal, setGuideModal] = useState(false);

	const [nextOpen, setNextOpen] = useState(false);	

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
				
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

	const chooseImage = (v) => {
    ImagePicker.openPicker({
      //width: 300,
      //height: 400,
      cropping: true,
    })
		.then(image => {
			let selectObj = {idx: v, path: image.path, mime: image.mime}			
			if(v == 1){
				setFile1(selectObj);
			}else if(v == 2){
				setFile2(selectObj);
			}else if(v == 3){
				setFile3(selectObj);
			}else if(v == 4){
				setFile4(selectObj);
			}else if(v == 5){
				setFile5(selectObj);
			}else if(v == 6){
				setFile6(selectObj);
			}
		})
		.finally(() => {

		});
  };

	const nextStep = () => {
		if(!file1.path || !file2.path || !file3.path){
			ToastMessage('대표 및 필수 영역의 사진을 등록해 주세요.');
			return false;
		}		
		
		nextObj.file1 = file1;
		nextObj.file2 = file2;
		nextObj.file3 = file3;
		nextObj.file4 = file4;
		nextObj.file5 = file5;
		nextObj.file6 = file6;
		if(route['params']['qnaList']){
			nextObj.qnaList = route['params']['qnaList'];
		}
		if(route['params']['intro']){
			nextObj.intro = route['params']['intro'];
		}
		if(route['params']['qnaListData']){
			nextObj.qnaListData = route['params']['qnaListData'];
		}
		navigation.navigate('RegisterStep7', nextObj);
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'인증'} />

			<View style={styles.regiStateBarBox}>
				<View style={styles.regiStateBar}>
					<TouchableOpacity 
            style={[styles.regiStateCircel, styles.regiStateCircelOn]}
            onPress={()=>{
							nextObj.file1 = file1;
							nextObj.file2 = file2;
							nextObj.file3 = file3;
							nextObj.file4 = file4;
							nextObj.file5 = file5;
							nextObj.file6 = file6;
							if(route['params']['qnaList']){
								nextObj.qnaList = route['params']['qnaList'];
							}
							if(route['params']['intro']){
								nextObj.intro = route['params']['intro'];
							}
							if(route['params']['qnaListData']){
								nextObj.qnaListData = route['params']['qnaListData'];
							}

							navigation.navigate('RegisterStep5', nextObj);
            }}
          >
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText, styles.regiStateTexOn]}>기본 정보</Text>
					</TouchableOpacity>
          <TouchableOpacity style={[styles.regiStateCircel, styles.regiStateCircelOn]}>
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText, styles.regiStateTexOn]}>프로필 등록</Text>
					</TouchableOpacity>
          <TouchableOpacity style={[styles.regiStateCircel, styles.regiStateCircelOn]}>
						<View style={styles.regiStateCircel2}></View>
            <Text style={[styles.regiStateText, styles.regiStateTexOn]}>소개글</Text>
					</TouchableOpacity>
          <View style={[styles.regiStateCircel, styles.regiStateCircelOn]}>
						<View style={styles.regiStateCircel2}></View>
            <Text style={[styles.regiStateText, styles.regiStateTexOn]}>인증</Text>
					</View>
				</View>
			</View>

			<ScrollView>		
				<View style={styles.cmWrap}>
					<View style={styles.cmTitleBox}>
						<Text style={styles.cmTitleText}>배지 & 인증으로</Text>
						<Text style={[styles.cmTitleText, styles.mgt8]}>프로필을 업그레이드!</Text>
					</View>
					<View style={styles.cmDescBox}>
						<Text style={styles.cmDescText}>프로필 신뢰도와 매칭율이 증가해요.</Text>
					</View>

					<View style={[styles.badgeBox, styles.mgt40]}>
						<View style={styles.iptTit}>
              <Text style={styles.iptTitText}>피지컬</Text>
            </View>
						<View style={styles.badgeBtnBox}>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<View style={styles.badgeBtnLeft}>
									<AutoHeightImage width={45} source={require('../../assets/image/b_height.png')} />
									<Text style={styles.badgeBtnLeftText}>키 배지</Text>
								</View>
								<AutoHeightImage width={24} source={require('../../assets/image/icon_arr5.png')} />
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<View style={styles.badgeBtnLeft}>
									<AutoHeightImage width={45} source={require('../../assets/image/b_muscle.png')} />
									<Text style={styles.badgeBtnLeftText}>골격근량 배지</Text>
								</View>
								<AutoHeightImage width={24} source={require('../../assets/image/icon_arr5.png')} />
							</TouchableOpacity>
						</View>
					</View>

					<View style={[styles.badgeBox, styles.mgt40]}>
						<View style={styles.iptTit}>
              <Text style={styles.iptTitText}>경제력</Text>
            </View>
						<View style={styles.badgeBtnBox}>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<View style={styles.badgeBtnLeft}>
									<AutoHeightImage width={45} source={require('../../assets/image/b_money.png')} />
									<Text style={styles.badgeBtnLeftText}>개인 소득 배지</Text>
								</View>
								<AutoHeightImage width={24} source={require('../../assets/image/icon_arr5.png')} />
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<View style={styles.badgeBtnLeft}>
									<AutoHeightImage width={45} source={require('../../assets/image/b_money2.png')} />
									<Text style={styles.badgeBtnLeftText}>개인 자산 배지</Text>
								</View>
								<AutoHeightImage width={24} source={require('../../assets/image/icon_arr5.png')} />
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<View style={styles.badgeBtnLeft}>
									<AutoHeightImage width={45} source={require('../../assets/image/b_money3.png')} />
									<Text style={styles.badgeBtnLeftText}>집안 자산 배지</Text>
								</View>
								<AutoHeightImage width={24} source={require('../../assets/image/icon_arr5.png')} />
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<View style={styles.badgeBtnLeft}>
									<AutoHeightImage width={45} source={require('../../assets/image/b_car.png')} />
									<Text style={styles.badgeBtnLeftText}>차량 배지</Text>
								</View>
								<AutoHeightImage width={24} source={require('../../assets/image/icon_arr5.png')} />
							</TouchableOpacity>
						</View>
					</View>	

					<View style={[styles.badgeBox, styles.mgt40]}>
						<View style={styles.iptTit}>
              <Text style={styles.iptTitText}>직업 · 학력</Text>
            </View>
						<View style={styles.badgeBtnBox}>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<View style={styles.badgeBtnLeft}>
									<AutoHeightImage width={45} source={require('../../assets/image/b_job.png')} />
									<Text style={styles.badgeBtnLeftText}>직업 배지</Text>
								</View>
								<AutoHeightImage width={24} source={require('../../assets/image/icon_arr5.png')} />
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={opacityVal}
								onPress={()=>{}}
							>
								<View style={styles.badgeBtnLeft}>
									<AutoHeightImage width={45} source={require('../../assets/image/b_school.png')} />
									<Text style={styles.badgeBtnLeftText}>학력 배지</Text>
								</View>
								<AutoHeightImage width={24} source={require('../../assets/image/icon_arr5.png')} />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>

      <View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn, file1.path && file2.path && file3.path ? null : styles.nextBtnOff]}
					activeOpacity={opacityVal}
					onPress={() => nextStep()}
				>
					<Text style={styles.nextBtnText}>저장하기</Text>
				</TouchableOpacity>
			</View>

		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: { marginTop: 62 },

	cmWrap: {paddingVertical:30,paddingHorizontal:20},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 24, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},
  
	regiStateBarBox: {paddingTop:30,paddingBottom:56,paddingHorizontal:55,overflow:'hidden'},
  regiStateBar: {height:18,backgroundColor:'#eee',borderRadius:20,flexDirection:'row',justifyContent:'space-between'},
	regiStateCircel: {width:18,height:18,backgroundColor:'#eee',borderRadius:50,position:'relative'},
	regiStateCircelOn: {backgroundColor:'#243B55',},
	regiStateCircel2: {width:6,height:6,backgroundColor:'#fff',borderRadius:50,position:'absolute',left:6,top:6,},
	regiStateText: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:13,color:'#dbdbdb',width:60,position:'absolute',left:-20,bottom:-28,textAlign:'center',},
	regiStateTexOn: {color:'#243B55'},

	iptTit: {},
  iptTitText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#1e1e1e'},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  
	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},
	prvPop2: {height:innerHeight,},
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E'},
	popTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	popIptBox: {paddingTop:10,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {marginTop:30,},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},	

	header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},

	red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

	mgt0: { marginTop: 0, },
	mgt8: { marginTop: 8, },
  mgt10: { marginTop: 10, },
	mgt20: { marginTop: 20, },
	mgt30: { marginTop: 30, },
	mgt40: { marginTop: 40, },
	mgt50: { marginTop: 50, },
	pdb0: {paddingBottom:0},
})

export default RegisterStep8