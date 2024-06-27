import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import ImgDomain from '../assets/common/ImgDomain';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import DeviceInfo from 'react-native-device-info';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import APIs from "../assets/APIs"

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
			}
    }

    //기기토큰 가져오기
    async function get_token() {
			await messaging()
			.getToken()
			.then(token => {
				//console.log("appToken", token);
				if(token) {
					AsyncStorage.setItem('appToken', token);
					setAppToken(token);
					movePageCheck(token);
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
		if(deviceUniq && appToken){
			memberCheck(deviceUniq, appToken);
		}
	}, [deviceUniq, appToken, memberId]);

	const memberCheck = async (v, v2) => {			
		let sData = {      
			basePath: "/api/member/index.php",
			type: "SetAutoLogin",
			member_id:memberId,
			device_id: v,
			firebase_token: v2,
		}
		const response = await APIs.send(sData);		
		//console.log('자동로그인 체크 ::::: ',response);		
		
		setTimeout(() => {
			if(response.code == 200){				
				if(response.data.member_type == 0){
					navigation.replace('RegisterResult');
				}else{
					if(response.data.available_yn == 'n'){
						navigation.replace('Disable');
					}else{
						navigation.replace('TabNavigation');
					}
				}
			}else{
				navigation.navigate('Intro2');
			}			
		}, 2000);		
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

export default Intro