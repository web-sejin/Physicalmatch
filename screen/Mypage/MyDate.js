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

const MyDate = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [btnState, setBtnState] = useState(false);

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

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'연애 및 결혼관'} />

			<ScrollView>
				<View style={styles.cmWrap}>
					<View style={styles.cmWrapTitleBox}>
						<Text style={styles.cmWrapTitleText}>연애 및 결혼관</Text>
					</View>
					<View style={styles.cmWrapDescBox}>
						<Text style={styles.cmWrapDescText}>나의 연애 및 결혼관이 입력되어야</Text>
						<Text style={styles.cmWrapDescText}>상대방의 연애 및 결혼관을 열 수 있어요.</Text>
					</View>
					<View style={styles.mgt40}>
						<View>
							<View style={styles.valueTitle}>
								<Text style={styles.valueTitleText}>첫만남</Text>
							</View>
							<View style={styles.valueQuestion}>
								<Text style={styles.valueQuestionText}><Text style={styles.roboto}>Q1.</Text> 질문 내용입니다.</Text>
							</View>                
							<View style={styles.valueAnswer}>
								<TouchableOpacity
									style={[styles.valueAnswerBtn, styles.boxShadow3, styles.boxShadow4, styles.mgt0]}
									activeOpacity={opacityVal}
								>
									<Text style={[styles.valueAnswerBtnText, styles.valueAnswerBtnTextOn]}>선택지1</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.valueAnswerBtn, styles.boxShadow3]}
									activeOpacity={opacityVal}
								>
									<Text style={styles.valueAnswerBtnText}>선택지2</Text>
								</TouchableOpacity>
							</View>                
						</View>
					</View>
					<View style={styles.mgt50}>
						<View>
							<View style={styles.valueTitle}>
								<Text style={styles.valueTitleText}>연애관</Text>
							</View>
							<View style={styles.valueQuestion}>
								<Text style={styles.valueQuestionText}><Text style={styles.roboto}>Q2.</Text> 질문 내용입니다.</Text>
							</View>
							<View style={styles.valueQuestionDesc}>
								<Text style={styles.valueQuestionDescText}>해당되는 답변을 모두 선택해 주세요</Text>
							</View>                
							<View style={styles.valueAnswer}>
								<TouchableOpacity
									style={[styles.valueAnswerBtn, styles.boxShadow3, styles.mgt0]}
									activeOpacity={opacityVal}
								>
									<Text style={styles.valueAnswerBtnText}>선택지1</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.valueAnswerBtn, styles.boxShadow3]}
									activeOpacity={opacityVal}
								>
									<Text style={styles.valueAnswerBtnText}>선택지2</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.mgt30}>
							<View style={styles.valueQuestion}>
								<Text style={styles.valueQuestionText}><Text style={styles.roboto}>Q3.</Text> 질문 내용입니다.</Text>
							</View>
							<View style={styles.valueAnswer}>
								<TouchableOpacity
									style={[styles.valueAnswerBtn, styles.boxShadow3, styles.mgt0]}
									activeOpacity={opacityVal}
								>
									<Text style={styles.valueAnswerBtnText}>선택지1</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.valueAnswerBtn, styles.boxShadow3]}
									activeOpacity={opacityVal}
								>
									<Text style={styles.valueAnswerBtnText}>선택지2</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>

			<View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn, btnState ? null : styles.nextBtnOff]}
					activeOpacity={opacityVal}
					onPress={() => {}}
				>
					<Text style={styles.nextBtnText}>저장하기</Text>
				</TouchableOpacity>
			</View>

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

	cmWrap: {paddingVertical:30,paddingHorizontal:20},
	cmWrapTitleBox: {position:'relative'},
	cmWrapTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmWrapTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmWrapDescBox: {marginTop:8,},
  cmWrapDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

	valueTitle: {marginBottom:15,},
  valueTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:18,lineHeight:21,color:'#1e1e1e'},
  valueQuestion: {},
  valueQuestionText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
  valueQuestionDesc: {marginTop:4,},
  valueQuestionDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#666'},
  valueAnswer: {marginTop:15,},
  valueAnswerBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#fff',marginTop:12,},
  valueAnswerBtnText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#666'},
  valueAnswerBtnTextOn: {fontFamily:Font.NotoSansMedium,color:'#D1913C'},

	nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
		
	boxShadow3: {    
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.4,
		elevation: 3,
	},
	boxShadow4: {borderWidth:1,borderColor:'rgba(209,145,60,0.3)',shadowColor: "#D1913C",shadowOpacity: 0.25,shadowRadius: 4.65,elevation: 6,},
	
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

export default MyDate