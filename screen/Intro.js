import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, Platform, PermissionsAndroid, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImgDomain from '../assets/common/ImgDomain';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import DeviceInfo from 'react-native-device-info';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import APIs from "../assets/APIs"
import Contacts from 'react-native-contacts';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 20;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;

const Intro = (props) => {
	const {navigation, member_login, member_info} = props;
	const [memberId, setMemberId] = useState();
	const [appToken, setAppToken] = useState();
	const [deviceUniq, setDeviceUniq] = useState();
	const [contacts, setContacts] = useState([]);
	const [contactsPermission, setContactsPermission] = useState(false);

	//토큰값 구하기
  useEffect(() => {
    PushNotification.setApplicationIconBadgeNumber(0);

    async function requestUserPermission() {
			const authStatus = await messaging().requestPermission();
			const enabled =
				authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
				authStatus === messaging.AuthorizationStatus.PROVISIONAL;

				//console.log('Authorization status1:', authStatus);
			if (enabled) {
				//console.log('Authorization status2:', authStatus);
				await get_token();
			}else{
				//setAppToken('');
				//movePageCheck('');
			}
    }

    //기기토큰 가져오기
    async function get_token() {
			await messaging()
			.getToken()
			.then(token => {
				console.log("appToken", token);
				if(token) {
					AsyncStorage.setItem('appToken', token);
					setAppToken(token);
					//movePageCheck(token);
					return true;
				} else {
					return false;
				}
			});
    }

    requestUserPermission();

    return messaging().onTokenRefresh(token => {
      setAppToken(token);
    });
  } ,[]);
	
	useEffect(()=>{
		DeviceInfo.getUniqueId().then(uniqueId => {
			AsyncStorage.setItem('deviceId', uniqueId);
			setDeviceUniq(uniqueId);
			//console.log('uniqueId :::: ', uniqueId);
			// iOS: "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"
			// Android: "dd96dec43fb81c97"
		});
	}, [])

	useEffect(()=>{
		AsyncStorage.getItem('member_id', (err, result) => {		
			//console.log('member_id :::: ', result);		
			setMemberId(result);
		});
	}, []);
	
	useEffect(() => {		
		if(deviceUniq && appToken && contactsPermission){
			//console.log('contactsPermission ::: ',contactsPermission);
			memberCheck(deviceUniq, appToken);
		}
	}, [deviceUniq, appToken, memberId, contactsPermission]);

	useEffect(() => {
    const fetchContacts = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
				if(!granted){					
					setContactsPermission(true);
					//console.log('111');
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
				setContactsPermission(true);
				//console.log('222');
			})
			.catch(error => {
				console.log('Error fetching contacts: ', error);
				setContactsPermission(true);
				//console.log('333');
			});
    };

    fetchContacts();
  }, []);

	const memberCheck = async (v, v2) => {			
		//console.log('contacts ::: ',contacts);
		let sData = {      
			basePath: "/api/member/",
			type: "SetAutoLogin",
			member_id:memberId,
			device_id: v,
			firebase_token: v2,
			member_pbook: contacts,
		}
		//console.log('sData ::: ',sData);
		const response = await APIs.send(sData);		
		//console.log('자동로그인 체크 ::::: ',response);		
		if(response.code == 200){
			saveRedux(response.data.member_idx);
		}
		setTimeout(() => {
			if(response.code == 200){						
				if(response.data.member_type == 0){
					//navigation.replace('RegisterResult', {newMemberNick:response.data.member_nick});
					navigation.reset({
						index: 0,
						routes: [{ name: 'RegisterResult', params: { newMemberNick: response.data.member_nick } }],
					});	
				}else if(response.data.member_type == 2 || response.data.is_match_ban == 'y' || response.data.is_social_ban == 'y' || response.data.is_comm_ban == 'y'){
					//navigation.replace('TabNavigation', {screen: 'Mypage'});
					navigation.reset({
						index: 0,
						routes: [{ name: 'TabNavigation', params: { screen: 'Mypage' } }],
					});	
				}else{
					if(response.data.available_yn == 'n'){
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
			}else{				
				navigation.reset({
					index: 0,
					routes: [{ name: 'Intro2' }],
				});
			}			
		}, 2000);		
	}

	const saveRedux = async (idx) => {
		const formData = new FormData();
		formData.append('type', 'GetMyInfo');
		formData.append('member_idx', idx);
		const mem_info = await member_info(formData);
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			{/* <Header navigation={navigation} headertitle={'기본양식'} /> */}
			<View style={styles.splash}>
				<ImgDomain fileWidth={80} fileName={'logo.png'} />
			</View>

			<View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#141E30'},
	splash: {flex:1,alignItems:'center',justifyContent:'center'},
  logo: {position:'relative',top:-60,},
	indicator: { width:widnowWidth, height: widnowHeight-stBarHt, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position:'absolute', left:0, top:0, paddingBottom:50,},		
})

//export default Intro
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //회원 로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(Intro);