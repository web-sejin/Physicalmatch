import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, PermissionsAndroid, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import Contacts from 'react-native-contacts';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

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
	const [appToken, setAppToken] = useState();
	const [deviceToken, setDeviceToken] = useState('');
	const [firebaseToken, setFirebaseToken] = useState('');
	const [contacts, setContacts] = useState([]);

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
				//console.log('login appToken :::: ', result);
				if(result){
					setFirebaseToken(result);
				}else{
					requestUserPermission();
				}
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

	useEffect(() => {		
		if(contacts.length > 0){
			//saveMyContacts();
		}
	}, [contacts]);

	useEffect(() => {
    const fetchContacts = async () => {
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );
        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission to access contacts was denied');
          return;
        }
      }
			
			let numberAry = [];

      Contacts.getAll()
			.then(contacts => {
				//console.log('contacts :::: ',contacts);
				contacts.forEach((contactList, index) => {					
					//console.log(contactList.phoneNumbers[0]?.number);
					numberAry.push(contactList.phoneNumbers[0]?.number);					
				});		
				
				const set = new Set(numberAry);
				setContacts([...set]);
			})
			.catch(error => {
				console.log('Error fetching contacts: ', error);
			});
    };

    fetchContacts();
  }, []);

	async function requestUserPermission() {
		const authStatus = await messaging().requestPermission();
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;

			console.log('login Authorization status1:', authStatus);
		if (enabled) {
			console.log('login Authorization status2:', authStatus);
			await get_token();
		}
	}

	//기기토큰 가져오기
	async function get_token() {
		await messaging()
		.getToken()
		.then(token => {
			console.log("login appToken", token);
			if(token) {
				AsyncStorage.setItem('appToken', token);
				setFirebaseToken(token);
				return true;
			} else {
				return false;
			}
		});
	}
  
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
			member_pbook: contacts,
		}
		//console.log('login sData :::: ',sData);
		const response = await APIs.send(sData);				
		//console.log(response);
		if(response.code == 200){
			setLoading(false);			
			AsyncStorage.setItem('member_id', id);
			AsyncStorage.setItem('member_idx', response.data.member_idx);
			//console.log(response.data);
			saveRedux(
				response.data.member_idx, 
				response.data.member_type, 
				response.data.is_match_ban, 
				response.data.is_social_ban, 
				response.data.is_comm_ban,
				response.data.available_yn,
				response.data.member_nick,
			);						

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

	const saveRedux = async (idx, type, is_match_ban, is_social_ban, is_comm_ban, available_yn, nick) => {
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
		// console.log('type ::: ', type);
		// console.log('is_match_ban ::: ', is_match_ban);
		// console.log('is_social_ban ::: ', is_social_ban);
		// console.log('is_comm_ban ::: ', is_comm_ban);
		// console.log('available_yn ::: ', available_yn);
		// return false;

		if(type == 0){
			navigation.reset({
				index: 0,
				routes: [{ name: 'RegisterResult', params: { newMemberNick: 'nick' } }],
			});	
		}else if(type == 2 && is_match_ban == 'y' && is_social_ban == 'y' && is_comm_ban == 'y'){
			//navigation.replace('TabNavigation', {screen: 'Mypage'});
			navigation.reset({
				index: 0,
				routes: [{ name: 'TabNavigation', params: { screen: 'Mypage' } }],
			});	
		}else{
			if(available_yn == 'n'){
				//navigation.replace('Disable');
				navigation.reset({
					index: 0,
					routes: [{ name: 'Disable' }],
				});
			}else{
				//navigation.replace('TabNavigation');
				navigation.reset({
					index: 0,
					routes: [{ name: 'TabNavigation' }],
				});				
			}
		}	
	}

	const saveMyContacts = async () => {
		console.log(contacts);
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
	findInfoText: {fontFamily:Font.NotoSansRegular, fontSize:12, lineHeight:17,color:'#666', textAlign:'center'},
  
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