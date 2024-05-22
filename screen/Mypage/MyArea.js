import React, {useState, useEffect, useRef, useCallback, Component} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import Postcode from '@actbase/react-daum-postcode';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const MyArea = (props) => {
	const {navigation, userInfo, chatInfo, route} = props;
  const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [currFocus, setCurrFocus] = useState('');
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);

	const [popLocal, setPopLocal] = useState(false);
	const [popLocal2, setPopLocal2] = useState(false);
	const [localType, setLocalType] = useState(0);
	const [locBtn, setLocBtn] = useState(false);
	const [local1, setLocal1] = useState('');
	const [local2, setLocal2] = useState('');
	const [realLocal1, setRealLocal1] = useState('');
	const [realLocal2, setRealLocal2] = useState('');

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
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'지역 설정'} />

			<ScrollView>
				<View style={styles.cmWrap}>
					<View style={styles.cmTitleBox}>
						<Text style={styles.cmTitleText}>활동 지역을</Text>
						<Text style={[styles.cmTitleText, styles.mgt8]}>변경해주세요!</Text>
					</View>
					<View style={styles.mgt40}>
						<View style={[styles.popIptBox]}>									
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>주 활동 지역 <Text style={styles.red}>*</Text></Text>
							</View>
							<TouchableOpacity
								style={styles.localBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									setLocalType(1);
									setPopLocal2(true);
								}}
							>
								{local1 != '' ? (
									<Text style={[styles.localBtnText, styles.localBtnText2]}>{local1}</Text>
								) : (
									<Text style={styles.localBtnText}>구까지만 표시 돼요</Text>
								)}
							</TouchableOpacity>
						</View>			
						<View style={[styles.popIptBox, styles.mgt30]}>
							<View	style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>부 활동 지역 <Text style={styles.gray}>[선택]</Text></Text>
							</View>
							<TouchableOpacity
								style={styles.localBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									setLocalType(2);
									setPopLocal2(true);
								}}
							>
								{local2 != '' ? (
									<Text style={[styles.localBtnText, styles.localBtnText2]}>{local2}</Text>
								) : (
									<Text style={styles.localBtnText}>주 활동 지역과 겹치면 안 적어도 돼요</Text>
								)}							
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>

			<View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn, local1 ? null : styles.nextBtnOff]}
					activeOpacity={opacityVal}
					onPress={() => {}}
				>
					<Text style={styles.nextBtnText}>저장하기</Text>
				</TouchableOpacity>
			</View>

			{popLocal ? (
			<>
			<TouchableOpacity 
				style={styles.popBack} 
				activeOpacity={1} 
				onPress={()=>{
					Keyboard.dismiss();
				}}
			>
			</TouchableOpacity>
			<View style={{...styles.prvPop}}>
				<TouchableOpacity
					style={styles.pop_x}					
					onPress={() => {
						setPopLocal(false);
						setPreventBack(false);
					}}
				>
					<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
				</TouchableOpacity>		
				<View style={styles.popTitle}>
					<Text style={styles.popTitleText}>활동 지역을 입력해 주세요</Text>
				</View>
				<View style={[styles.popIptBox]}>									
					<View style={styles.popRadioTitle}>
						<Text style={styles.popRadioTitleText}>주 활동 지역 <Text style={styles.red}>*</Text></Text>
					</View>
					<TouchableOpacity
						style={styles.localBtn}
						activeOpacity={opacityVal}
						onPress={() => {
							setLocalType(1);
							setPopLocal2(true);
						}}
					>
						{local1 != '' ? (
							<Text style={[styles.localBtnText, styles.localBtnText2]}>{local1}</Text>
						) : (
							<Text style={styles.localBtnText}>구까지만 표시 돼요</Text>
						)}
					</TouchableOpacity>
				</View>			
				<View style={[styles.popIptBox, styles.mgt20]}>
					<View	style={styles.popRadioTitle}>
						<Text style={styles.popRadioTitleText}>부 활동 지역 <Text style={styles.gray}>[선택]</Text></Text>
					</View>
					<TouchableOpacity
						style={styles.localBtn}
						activeOpacity={opacityVal}
						onPress={() => {
							setLocalType(2);
							setPopLocal2(true);
						}}
					>
						{local2 != '' ? (
							<Text style={[styles.localBtnText, styles.localBtnText2]}>{local2}</Text>
						) : (
							<Text style={styles.localBtnText}>주 활동 지역과 겹치면 안 적어도 돼요</Text>
						)}							
					</TouchableOpacity>
				</View>											
				<View style={styles.popBtnBox}>
					<TouchableOpacity 
						style={[styles.popBtn, locBtn ? null : styles.nextBtnOff]}
						activeOpacity={opacityVal}
						onPress={() => {checkPopVal('local')}}
					>
						<Text style={styles.popBtnText}>저장하기</Text>
					</TouchableOpacity>
				</View>
			</View>
			</>
			) : null}

			{popLocal2 ? (
			<>
			<TouchableOpacity 
				style={[styles.popBack, styles.popBack2]} 
				activeOpacity={1} 
				onPress={()=>{
					Keyboard.dismiss();
				}}
			>
			</TouchableOpacity>	
			<View style={{...styles.prvPop}}>
				<TouchableOpacity
					style={styles.pop_x}					
					onPress={() => {
						setPopLocal2(false);
						setPreventBack(false);
					}}
				>
					<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
				</TouchableOpacity>
				<Postcode
					style={{ width: innerWidth-40, height: innerHeight-90, }}
					jsOptions={{ animation: true }}
					onSelected={data => {
						//console.log(JSON.stringify(data))
						const kakaoAddr = data;
						//console.log(data);				
						if(localType == 1){
							setLocal1(kakaoAddr.sido+' '+kakaoAddr.sigungu);
							setLocBtn(true);
						}else if(localType == 2){
							setLocal2(kakaoAddr.sido+' '+kakaoAddr.sigungu);
						}
						setPopLocal2(false);
					}}
				/>
			</View>
			</>
			) : null}

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
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
	cmDescBoxFlex: {flexDirection:'row',alignItems:'center'},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},
	cmDescText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:20,color:'#B8B8B8'},
	cmDescArr: {marginHorizontal:6,position:'relative',top:1,},
	cmTitleText3: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:19,color:'#1e1e1e'},
	cmDescText3: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#1e1e1e'},

	nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },

	popIptBox: {paddingTop:10,},
	popRadioTitle: {},
	popRadioTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
	popRadioTitleText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},

	localBtn: {borderBottomWidth:1,borderBottomColor:'#888888',marginTop:10,paddingTop:12,paddingBottom:6,paddingHorizontal:5,},
	localBtnText: {fontFamily:Font.NotoSansRegular,fontSize:16,lineHeight:18,color:'#DBDBDB'},
	localBtnText2: {color:'#333'},

	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},

	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,},
	popBack2: {backgroundColor:'rgba(0,0,0,0.7)'},
	prvPop: {position:'absolute',top:20,left:20,zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},
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

	red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

	mgl0: {marginLeft:0,},
	mgt0: { marginTop: 0, },
	mgt5: { marginTop: 5, },
	mgt8: { marginTop: 8, },
  mgt10: { marginTop: 10, },
	mgt12: { marginTop: 12, },
	mgt20: { marginTop: 20, },
	mgt30: { marginTop: 30, },
	mgt40: { marginTop: 40, },
	mgt50: { marginTop: 50, },
	pdb0: {paddingBottom:0},
	pdb20: {paddingBottom:20},
})

export default MyArea