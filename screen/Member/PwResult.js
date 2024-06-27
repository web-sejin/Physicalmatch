import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';

import APIs from "../../assets/APIs";
import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const PwResult = (props) => {	
	const {navigation, route} = props;
	const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const [loading, setLoading] = useState(false);
  const [state, setState] = useState(false);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState(''); 
	const [idx, setIdx] = useState(params?.idx);

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
  
  const changeInfo = async () => {
		if(!pw || pw == ""){
			ToastMessage('비밀번호를 입력해 주세요.');
			return false;
		}

		const num = pw.search(/[0-9]/g);
		const eng = pw.search(/[a-z]/ig);
		const spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

		if (pw.length < 6 || pw.length > 16) {
			ToastMessage('비밀번호는 영문, 숫자, 특수문자를 활용해 6~16자리 수를 입력해 주세요.');
			return false;
		}

    if(!pw2 || pw2 == ""){
			ToastMessage('비밀번호를 한 번 더 입력해 주세요.');
			return false;
    }
    
    if(pw != pw2){
			ToastMessage('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
			return false;
    }

		setLoading(true);
		let sData = {
			basePath: "/api/member/",
			type: "UpdatePw",
      member_idx: idx,
			member_pw: pw,
		};

		const response = await APIs.send(sData);
		console.log(response);
		if(response.code == 200){
			ToastMessage('비밀번호가 변경되었습니다. 잠시후 로그인 화면으로 이동합니다.');
			setTimeout(function(){
				setLoading(false);
				navigation.navigate('Login');
			}, 2000);
		}else{
			
		}
		return false;
  }

  const checkVal = () => {
    if (pw != '' && pw2 != '') { 
      setState(true);
    }
  }

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'비밀번호 찾기'} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
				behavior={behavior}
				style={{flex: 1}}
      >
				<ScrollView>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={styles.cmWrap}>
							<View style={styles.cmTitleBox}>
								<Text style={styles.cmTitleText}>새 비밀번호</Text>
							</View>
							<View style={styles.loginIptBox}>
								<TextInput
									secureTextEntry={true}
									value={pw}
									onChangeText={(v) => {
										setPw(v)
										checkVal()
									}}
									placeholder={'영문, 숫자, 특수문자 6~16자'}
									placeholderTextColor="#DBDBDB"
									style={[styles.input]}
									returnKyeType='done'
									onSubmitEditing={changeInfo}
								/>
							</View>
							<View style={[styles.loginIptBox]}>
								<TextInput
									secureTextEntry={true}
									value={pw2}
									onChangeText={(v) => {
										setPw2(v)
										checkVal()
									}}
									placeholder={'비밀번호 확인'}
									placeholderTextColor="#DBDBDB"
									style={[styles.input]}
									returnKyeType='done'
									onSubmitEditing={changeInfo}
								/>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={[styles.nextBtn, state ? null : styles.nextBtnOff]}
						activeOpacity={opacityVal}
						onPress={() => changeInfo()}
					>
						<Text style={styles.nextBtnText}>저장</Text>
					</TouchableOpacity>
				</View>
      </KeyboardAvoidingView> 

			{loading ? (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#D1913C" />
      </View>
      ) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	
  
  cmWrap: {paddingVertical:30,paddingHorizontal:20},
  cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

  loginIptBox: {marginTop:15,},
	input: { fontFamily: Font.NotoSansRegular, width: innerWidth, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
	
	bold: {fontFamily:Font.NotoSansBold},
})

export default PwResult