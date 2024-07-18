import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';

import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Login = (props) => {	
	const {navigation, userInfo, member_info, member_login, route} = props;
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
	const [deviceToken, setDeviceToken] = useState('');
	const [firebaseToken, setFirebaseToken] = useState('');

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

			AsyncStorage.getItem('appToken', (err, result) => {
				//console.log('appToken :::: ', result);
				setFirebaseToken(result);
			});
	
			AsyncStorage.getItem('deviceId', (err, result) => {		
				//console.log('deviceId :::: ', result);		
				setDeviceToken(result);
			});
		}
		Keyboard.dismiss();
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);
  
  const sendLogin = async () => {
		let appToken = '';
		let deviceId = '';
		
		if(!id || id == ""){
			ToastMessage('아이디를 입력해 주세요.');
			return false;
		}

		if(!pw || pw == ""){
			ToastMessage('비밀번호를 입력해 주세요.');
			return false;
		}

		setLoading(true);

		let sData = {      
      basePath: "/api/member/index.php",
			type: "SetLogin",
			member_id: id,
			member_pw: pw,
			device_id: deviceToken,
			firebase_token: firebaseToken,
		}
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			setLoading(false);
			AsyncStorage.setItem('member_id', id);
			AsyncStorage.setItem('member_idx', response.data.member_idx);
			saveRedux(response.data.member_idx, response.data.member_type);						
		}else{
			setLoading(false);
			if(response.msg == 'INVALID ID'){
				ToastMessage('아이디를 다시 확인해 주세요.');
				return false;
			}else if(response.msg == 'INVALID PW'){
				ToastMessage('비밀번호를 다시 확인해 주세요.');
				return false;
			}
		}
  }

	const saveRedux = async (idx, type) => {
		const formData = new FormData();
		formData.append('type', 'GetMyInfo');
		formData.append('member_idx', idx);
		const mem_info = await member_info(formData);

		const formData2 = new FormData();
		formData2.append('type', 'SetLogin');
		formData2.append('member_id', id);
		formData2.append('member_pw', pw);
		formData2.append('device_id', deviceToken);
		formData2.append('firebase_token', firebaseToken);
		//const mem_login = await member_login(formData2);
		
		//console.log('mem_info', mem_info);
		if(type == 0){
			navigation.navigate('RegisterResult');
		}else if(type == 1){
			//최종 승인
			navigation.navigate('TabNavigation', {screen:'Home'});
		}else if(type == 2){
			//관리자 + 신규회원평가 인증
			navigation.navigate('TabNavigation', {screen:'Mypage'});
		}
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={''} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
				behavior={behavior}
				style={{flex: 1}}
      >
				<ScrollView>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={styles.cmWrap}>
							<View style={styles.cmTitleBox}>
								<Text style={styles.cmTitleText}>로그인</Text>
								{/* <View style={styles.cmTitleLine}></View> */}
							</View>
							<View style={styles.cmDescBox}>
								<Text style={styles.cmDescText}>아이디와 비밀번호를 입력해 주세요.</Text>
							</View>
							<View style={styles.loginIptBox}>
								<TextInput
									//keyboardType='email-address'
									value={id}
									onChangeText={(v) => {setId(v)}}
									placeholder={'아이디를 입력해 주세요.'}
									placeholderTextColor="#DBDBDB"
									style={[styles.input]}
									returnKyeType='done'
									onSubmitEditing={sendLogin}
								/>
							</View>
							<View style={[styles.loginIptBox, styles.loginIptBox2]}>
								<TextInput
									secureTextEntry={true}
									value={pw}
									onChangeText={(v) => {setPw(v)}}
									placeholder={'비밀번호를 입력해 주세요.'}
									placeholderTextColor="#DBDBDB"
									style={[styles.input]}
									returnKyeType='done'
									onSubmitEditing={sendLogin}
								/>
							</View>
							<TouchableOpacity
								style={styles.findInfo}
								activeOpacity={opacityVal}
								onPress={() => {navigation.navigate('FindId')}}
							>
								<Text style={styles.findInfoText}>아이디·비밀번호를 잊어버렸어요</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={styles.nextBtn}
						activeOpacity={opacityVal}
						onPress={() => sendLogin()}
					>
						<Text style={styles.nextBtnText}>로그인</Text>
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
	cmTitleText: { fontFamily: Font.NotoSansBold, fontSize: 22, lineHeight: 24, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

  loginIptBox: {marginTop:40,},
	loginIptBox2: {marginTop:30},
	input: { fontFamily: Font.NotoSansRegular, width: innerWidth, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
	
	findInfo: { width:192, paddingTop: 8, paddingBottom:7, borderWidth: 1, borderColor: '#EDEDED', borderRadius:50,marginVertical: 30, },
	findInfoText: {fontFamily:Font.NotoSansRegular, fontSize:12, lineHeight:14,color:'#666', textAlign:'center'},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,},
	nextBtn: {height:52,backgroundColor:'#243B55',borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
	
	bold: {fontFamily:Font.NotoSansBold},
})

//export default Login
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //회원 로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(Login);