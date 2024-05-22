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
import ImgDomain from '../../assets/common/ImgDomain';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 20;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;

const RegisterStep8 = ({navigation, route}) => {		
	const nextObj = {
		prvChk4:route['params']['prvChk4'],
		accessRoute:route['params']['accessRoute'],
		mb_id:route['params']['mb_id'],
		mb_pw:route['params']['mb_pw'],
		mb_nick:route['params']['mb_nick'],
		mb_gender:route['params']['mb_gender'],
		mb_local1:route['params']['mb_local1'],
		mb_local2:route['params']['mb_local2'],
		mb_class1:route['params']['mb_class1'],
		mb_class2:route['params']['mb_class2'],
		mb_job:route['params']['mb_job'],
		mb_jobDetail:route['params']['mb_jobDetail'],
		mb_height:route['params']['mb_height'],
		mb_weight:route['params']['mb_weight'],
		mb_muscle:route['params']['mb_muscle'],
		mb_fat:route['params']['mb_fat'],
		mb_no_weight:route['params']['mb_no_weight'],
		mb_no_muscle:route['params']['mb_no_muscle'],
		mb_no_fat:route['params']['mb_no_fat'],
		mb_rest:route['params']['mb_rest'],
		mb_exercise:route['params']['mb_exercise'],
		mb_physicalType:route['params']['mb_physicalType'],
		mb_drink:route['params']['mb_drink'],
		mb_smoke:route['params']['mb_smoke'],
		mb_smokeSort:route['params']['mb_smokeSort'],
		mb_mbit1:route['params']['mb_mbit1'],
		mb_mbit2:route['params']['mb_mbit2'],
		mb_mbit3:route['params']['mb_mbit3'],
		mb_mbit4:route['params']['mb_mbit4'],
		mb_religion:route['params']['mb_religion'],
		file1:route['params']['file1'],
		file2:route['params']['file2'],
		file3:route['params']['file3'],
		file4:route['params']['file4'],
		file5:route['params']['file5'],
		file6:route['params']['file6'],
		qnaList:route['params']['qnaList'],
		intro:route['params']['intro'],
		qnaListData:route['params']['qnaListData'],
	}

	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [currFocus, setCurrFocus] = useState('');
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState({});

	const [realFile1, setRealFile1] = useState({});
	const [realFile2, setRealFile2] = useState({});
	const [realFile3, setRealFile3] = useState({});
	const [realFile4, setRealFile4] = useState({});
	const [realFile5, setRealFile5] = useState({});
	const [realFile6, setRealFile6] = useState({});
	const [realFile7, setRealFile7] = useState({});
	const [realFile8, setRealFile8] = useState({});

	const [realFile1Grade, setRealFile1Grade] = useState('');
	const [realFile2Grade, setRealFile2Grade] = useState('');
	const [realFile3Grade, setRealFile3Grade] = useState('');
	const [realFile4Grade, setRealFile4Grade] = useState('');
	const [realFile5Grade, setRealFile5Grade] = useState('');
	const [realFile6Grade, setRealFile6Grade] = useState('');
	const [realFile7Grade, setRealFile7Grade] = useState('');
	const [realFile8Grade, setRealFile8Grade] = useState('');
	
	const [badgeType, setBadgeType] = useState(0);
	const [badgeModal, setBadgeModal] = useState(false);	
	const [badgeTitle, setBadgeTitle] = useState('');
	const [badgeCert, setBadgeCert] = useState(false);
	const [badgeGrade, setBadgeGrade] = useState('');

	const [jobModal, setJobModal] = useState(false);
	const [schoolModal, setSchoolModal] = useState(false);
	const [marryModal, setMarryModal] = useState(false);
	const [confirm, setConfirm] = useState(false);

	const [jobFile, setJobFile] = useState({});
	const [realJobFile, setRealJobFile] = useState({});

	const [schoolFile, setSchoolFile] = useState({});
	const [realSchoolFile, setRealSchoolFile] = useState({});
	const [schoolName, setSchoolName] = useState('');
	const [realSchoolName, setRealSchoolName] = useState('');
	const [schoolMajor, setSchoolMajor] = useState('');
	const [realSchoolMajor, setRealSchoolMajor] = useState('');

	const [marryFile, setMarryFile] = useState({});
	const [realMarryFile, setRealMarryFile] = useState({});
	const [marryState, setMarryState] = useState('');
	const [realMarryState, setRealMarryState] = useState('');

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

			if(route['params']['step8File1']){ setRealFile1(route['params']['step8File1']); }
			if(route['params']['step8File2']){ setRealFile2(route['params']['step8File2']); }
			if(route['params']['step8File3']){ setRealFile3(route['params']['step8File3']); }
			if(route['params']['step8File4']){ setRealFile4(route['params']['step8File4']); }
			if(route['params']['step8File5']){ setRealFile5(route['params']['step8File5']); }
			if(route['params']['step8File6']){ setRealFile6(route['params']['step8File6']); }
			if(route['params']['step8File7']){ setRealFile7(route['params']['step8File7']); }
			if(route['params']['step8File8']){ setRealFile8(route['params']['step8File8']); }
			if(route['params']['step8Grade1']){ setRealFile1Grade(route['params']['step8Grade1']); }
			if(route['params']['step8Grade2']){ setRealFile2Grade(route['params']['step8Grade2']); }
			if(route['params']['step8Grade3']){ setRealFile3Grade(route['params']['step8Grade3']); }
			if(route['params']['step8Grade4']){ setRealFile4Grade(route['params']['step8Grade4']); }
			if(route['params']['step8Grade5']){ setRealFile5Grade(route['params']['step8Grade5']); }
			if(route['params']['step8Grade6']){ setRealFile6Grade(route['params']['step8Grade6']); }
			if(route['params']['step8Grade7']){ setRealFile7Grade(route['params']['step8Grade7']); }
			if(route['params']['step8Grade8']){ setRealFile8Grade(route['params']['step8Grade8']); }
			if(route['params']['step8JobFile']){ setRealJobFile(route['params']['step8JobFile']); }
			if(route['params']['step8SchoolFile']){ setRealSchoolFile(route['params']['step8SchoolFile']); }
			if(route['params']['step8SchoolName']){ setRealSchoolName(route['params']['step8SchoolName']); }
			if(route['params']['step8SchoolMajor']){ setRealSchoolMajor(route['params']['step8SchoolMajor']); }
			if(route['params']['step8MarryFile']){ setRealMarryFile(route['params']['step8MarryFile']); }
			if(route['params']['step8MarryState']){ setRealMarryState(route['params']['step8MarryState']); }
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
				setBadgeModal(false);
				setJobModal(false);
				setSchoolModal(false);
				setMarryModal(false);
				setConfirm(false);
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

	const chooseImage = () => {
    ImagePicker.openPicker({
      //width: 300,
      //height: 400,
      //cropping: true,
    })
		.then(image => {
			let megabytes = parseInt(Math.floor(Math.log(image.size) / Math.log(1024)));
			let selectObj = {path: image.path, mime: image.mime, name:image.filename, size:megabytes}
			//console.log(selectObj);
			setFile(selectObj);
		})
		.finally(() => {

		});
  };

	const offBadgeModal = () => {
		setBadgeModal(false);
		setPreventBack(false);
		setBadgeCert(false);
		setBadgeGrade('');
		setBadgeType(0);
		setFile({});
	}

	const saveBadgeFileInfo = () => {
		if(!file.path){
			ToastMessage('인증 자료를 첨부해 주세요.');
			return false;
		}

		if(badgeType == 1){
			setRealFile1(file);
			setRealFile1Grade(badgeGrade);
		}else if(badgeType == 2){
			setRealFile2(file);
			setRealFile2Grade(badgeGrade);
		}else if(badgeType == 3){
			setRealFile3(file);
			setRealFile3Grade(badgeGrade);
		}else if(badgeType == 4){
			setRealFile4(file);
			setRealFile4Grade(badgeGrade);
		}else if(badgeType == 5){
			setRealFile5(file);
			setRealFile5Grade(badgeGrade);
		}else if(badgeType == 6){
			setRealFile6(file);
			setRealFile6Grade(badgeGrade);
		}else if(badgeType == 7){
			setRealFile7(file);
			setRealFile7Grade(badgeGrade);
		}else if(badgeType == 8){
			setRealFile8(file);
			setRealFile8Grade(badgeGrade);
		}

		offBadgeModal();
	}

	const jobImage = () => {
		ImagePicker.openPicker({})
		.then(image => {
			let megabytes = parseInt(Math.floor(Math.log(image.size) / Math.log(1024)));
			let selectObj = {path: image.path, mime: image.mime, name:image.filename, size:megabytes}			
			setJobFile(selectObj);
		})
		.finally(() => {});
	}

	const saveJobCert = () => {
		if(!jobFile.path){
			ToastMessage('인증 자료를 첨부해 주세요.');
			return false;
		}

		setRealJobFile(jobFile);
		setJobModal(false);
		setPreventBack(false);
		setJobFile({});
	}

	const schoolImage = () => {
		ImagePicker.openPicker({})
		.then(image => {
			let megabytes = parseInt(Math.floor(Math.log(image.size) / Math.log(1024)));
			let selectObj = {path: image.path, mime: image.mime, name:image.filename, size:megabytes}			
			setSchoolFile(selectObj);
		})
		.finally(() => {});
	}

	const saveSchoolCert = () => {
		if(schoolName == ''){
			ToastMessage('학교명을 입력해 주세요.');
			return false;
		}

		if(!schoolFile.path){
			ToastMessage('인증 자료를 첨부해 주세요.');
			return false;
		}

		setRealSchoolName(schoolName);
		setRealSchoolMajor(schoolMajor);
		setRealSchoolFile(schoolFile);
		setSchoolModal(false);
		setPreventBack(false);
		setSchoolName('');
		setSchoolMajor('');
		setSchoolFile({});
	}
	
	const marryImage = () => {
		ImagePicker.openPicker({})
		.then(image => {
			let megabytes = parseInt(Math.floor(Math.log(image.size) / Math.log(1024)));
			let selectObj = {path: image.path, mime: image.mime, name:image.filename, size:megabytes}			
			setMarryFile(selectObj);
		})
		.finally(() => {});
	}

	const saveMarryCert = () => {
		if(!marryFile.path){
			ToastMessage('인증 자료를 첨부해 주세요.');
			return false;
		}

		setRealMarryState(marryState);		
		setRealMarryFile(marryFile);
		setMarryModal(false);
		setPreventBack(false);
		setMarryState('');		
		setMarryFile({});
	}
	

	const nextStep = () => {	
		nextObj.step8File1 = realFile1;
		nextObj.step8File2 = realFile2;
		nextObj.step8File3 = realFile3;
		nextObj.step8File4 = realFile4;
		nextObj.step8File5 = realFile5;
		nextObj.step8File6 = realFile6;
		nextObj.step8File7 = realFile7;
		nextObj.step8File8 = realFile8;
		nextObj.step8Grade1 = realFile1Grade;
		nextObj.step8Grade2 = realFile1Grade;
		nextObj.step8Grade3 = realFile2Grade;
		nextObj.step8Grade4 = realFile3Grade;
		nextObj.step8Grade5 = realFile5Grade;
		nextObj.step8Grade6 = realFile6Grade;
		nextObj.step8Grade7 = realFile7Grade;
		nextObj.step8Grade8 = realFile8Grade;
		nextObj.step8JobFile = realJobFile;
		nextObj.step8SchoolFile = realSchoolFile;
		nextObj.step8SchoolName = realSchoolName;
		nextObj.step8SchoolMajor = realSchoolMajor;
		nextObj.step8MarryFile = realMarryFile;
		nextObj.step8MarryState = realMarryState;

		navigation.navigate('RegisterResult', nextObj);
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
						activeOpacity={opacityVal}
						onPress={()=>{
							nextObj.step8File1 = realFile1;
							nextObj.step8File2 = realFile2;
							nextObj.step8File3 = realFile3;
							nextObj.step8File4 = realFile4;
							nextObj.step8File5 = realFile5;
							nextObj.step8File6 = realFile6;
							nextObj.step8File7 = realFile7;
							nextObj.step8File8 = realFile8;
							nextObj.step8Grade1 = realFile1Grade;
							nextObj.step8Grade2 = realFile1Grade;
							nextObj.step8Grade3 = realFile2Grade;
							nextObj.step8Grade4 = realFile3Grade;
							nextObj.step8Grade5 = realFile5Grade;
							nextObj.step8Grade6 = realFile6Grade;
							nextObj.step8Grade7 = realFile7Grade;
							nextObj.step8Grade8 = realFile8Grade;
							nextObj.step8JobFile = realJobFile;
							nextObj.step8SchoolFile = realSchoolFile;
							nextObj.step8SchoolName = realSchoolName;
							nextObj.step8SchoolMajor = realSchoolMajor;
							nextObj.step8MarryFile = realMarryFile;
							nextObj.step8MarryState = realMarryState;
							navigation.navigate('RegisterStep5', nextObj)
						}}
					>
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText, styles.regiStateTexOn]}>기본 정보</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={[styles.regiStateCircel, styles.regiStateCircelOn]}
						activeOpacity={opacityVal}
						onPress={()=>{
							nextObj.step8File1 = realFile1;
							nextObj.step8File2 = realFile2;
							nextObj.step8File3 = realFile3;
							nextObj.step8File4 = realFile4;
							nextObj.step8File5 = realFile5;
							nextObj.step8File6 = realFile6;
							nextObj.step8File7 = realFile7;
							nextObj.step8File8 = realFile8;
							nextObj.step8Grade1 = realFile1Grade;
							nextObj.step8Grade2 = realFile1Grade;
							nextObj.step8Grade3 = realFile2Grade;
							nextObj.step8Grade4 = realFile3Grade;
							nextObj.step8Grade5 = realFile5Grade;
							nextObj.step8Grade6 = realFile6Grade;
							nextObj.step8Grade7 = realFile7Grade;
							nextObj.step8Grade8 = realFile8Grade;
							nextObj.step8JobFile = realJobFile;
							nextObj.step8SchoolFile = realSchoolFile;
							nextObj.step8SchoolName = realSchoolName;
							nextObj.step8SchoolMajor = realSchoolMajor;
							nextObj.step8MarryFile = realMarryFile;
							nextObj.step8MarryState = realMarryState;
							navigation.navigate('RegisterStep6', nextObj)
						}}
					>
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText, styles.regiStateTexOn]}>프로필 등록</Text>
					</TouchableOpacity>
          <TouchableOpacity 
						style={[styles.regiStateCircel, styles.regiStateCircelOn]}
						activeOpacity={opacityVal}
						onPress={()=>{
							nextObj.step8File1 = realFile1;
							nextObj.step8File2 = realFile2;
							nextObj.step8File3 = realFile3;
							nextObj.step8File4 = realFile4;
							nextObj.step8File5 = realFile5;
							nextObj.step8File6 = realFile6;
							nextObj.step8File7 = realFile7;
							nextObj.step8File8 = realFile8;
							nextObj.step8Grade1 = realFile1Grade;
							nextObj.step8Grade2 = realFile1Grade;
							nextObj.step8Grade3 = realFile2Grade;
							nextObj.step8Grade4 = realFile3Grade;
							nextObj.step8Grade5 = realFile5Grade;
							nextObj.step8Grade6 = realFile6Grade;
							nextObj.step8Grade7 = realFile7Grade;
							nextObj.step8Grade8 = realFile8Grade;
							nextObj.step8JobFile = realJobFile;
							nextObj.step8SchoolFile = realSchoolFile;
							nextObj.step8SchoolName = realSchoolName;
							nextObj.step8SchoolMajor = realSchoolMajor;
							nextObj.step8MarryFile = realMarryFile;
							nextObj.step8MarryState = realMarryState;
							navigation.navigate('RegisterStep7', nextObj)
						}}
					>
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

					{route['params']['mb_gender'] != 2 ? (
					<View style={[styles.badgeBox, styles.mgt40]}>
						<View style={styles.iptTit}>
              <Text style={styles.iptTitText}>피지컬</Text>
            </View>
						<View style={[styles.badgeBtnBox, styles.boxShadow]}>
							<TouchableOpacity
								style={[styles.badgeBtn]}
								activeOpacity={realFile1.path ? 1 : opacityVal}
								onPress={()=>{
									!realFile1.path ? setBadgeTitle('키 배지') : null
									!realFile1.path ? setBadgeType(1) : null
									!realFile1.path ? setBadgeModal(true) : null
									!realFile1.path ? setPreventBack(true) : null
								}}
							>
								<View style={styles.badgeBtnLeft}>									
									<ImgDomain fileWidth={45} fileName={'b_height.png'}/>
									<Text style={styles.badgeBtnLeftText}>키 배지</Text>
								</View>
								{realFile1.path ? (
									<View style={styles.stateView}>
										<Text style={styles.stateViewText}>심사중</Text>
									</View>
								) : (
									<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
								)}
							</TouchableOpacity>
							<View style={styles.btnLineBox}><View style={styles.btnLine}></View></View>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={realFile2.path ? 1 : opacityVal}
								onPress={()=>{
									!realFile2.path ? setBadgeTitle('골격근량 배지') : null
									!realFile2.path ? setBadgeType(2) : null
									!realFile2.path ? setBadgeModal(true) : null
									!realFile2.path ? setPreventBack(true) : null
								}}
							>
								<View style={styles.badgeBtnLeft}>									
									<ImgDomain fileWidth={45} fileName={'b_muscle.png'}/>
									<Text style={styles.badgeBtnLeftText}>골격근량 배지</Text>
								</View>
								{realFile2.path ? (
									<View style={styles.stateView}>
										<Text style={styles.stateViewText}>심사중</Text>
									</View>
								) : (
									<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
								)}
							</TouchableOpacity>
						</View>
					</View>
					) : null}

					<View style={[styles.badgeBox, styles.mgt40]}>
						<View style={styles.iptTit}>
              <Text style={styles.iptTitText}>경제력</Text>
            </View>
						<View style={[styles.badgeBtnBox, styles.boxShadow]}>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={realFile3.path ? 1 : opacityVal}
								onPress={()=>{
									!realFile3.path ? setBadgeTitle('개인 소득 배지') : null
									!realFile3.path ? setBadgeType(3) : null
									!realFile3.path ? setBadgeModal(true) : null
									!realFile3.path ? setPreventBack(true) : null
								}}
							>
								<View style={styles.badgeBtnLeft}>									
									<ImgDomain fileWidth={45} fileName={'b_money.png'}/>
									<Text style={styles.badgeBtnLeftText}>개인 소득 배지</Text>
								</View>
								{realFile3.path ? (
									<View style={styles.stateView}>
										<Text style={styles.stateViewText}>심사중</Text>
									</View>
								) : (
									<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
								)}
							</TouchableOpacity>
							<View style={styles.btnLineBox}><View style={styles.btnLine}></View></View>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={realFile4.path ? 1 : opacityVal}
								onPress={()=>{
									!realFile4.path ? setBadgeTitle('개인 자산 배지') : null
									!realFile4.path ? setBadgeType(4) : null
									!realFile4.path ? setBadgeModal(true) : null
									!realFile4.path ? setPreventBack(true) : null
								}}
							>
								<View style={styles.badgeBtnLeft}>									
									<ImgDomain fileWidth={45} fileName={'b_money2.png'}/>
									<Text style={styles.badgeBtnLeftText}>개인 자산 배지</Text>
								</View>
								{realFile4.path ? (
									<View style={styles.stateView}>
										<Text style={styles.stateViewText}>심사중</Text>
									</View>
								) : (
									<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
								)}
							</TouchableOpacity>
							<View style={styles.btnLineBox}><View style={styles.btnLine}></View></View>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={realFile5.path ? 1 : opacityVal}
								onPress={()=>{
									!realFile5.path ? setBadgeTitle('집안 자산 배지') : null
									!realFile5.path ? setBadgeType(5) : null
									!realFile5.path ? setBadgeModal(true) : null
									!realFile5.path ? setPreventBack(true) : null
								}}
							>
								<View style={styles.badgeBtnLeft}>									
									<ImgDomain fileWidth={45} fileName={'b_money3.png'}/>
									<Text style={styles.badgeBtnLeftText}>집안 자산 배지</Text>
								</View>
								{realFile5.path ? (
									<View style={styles.stateView}>
										<Text style={styles.stateViewText}>심사중</Text>
									</View>
								) : (
									<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
								)}
							</TouchableOpacity>
							<View style={styles.btnLineBox}><View style={styles.btnLine}></View></View>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={realFile6.path ? 1 : opacityVal}
								onPress={()=>{
									!realFile6.path ? setBadgeTitle('차량 배지') : null
									!realFile6.path ? setBadgeType(6) : null
									!realFile6.path ? setBadgeModal(true) : null
									!realFile6.path ? setPreventBack(true) : null
								}}
							>
								<View style={styles.badgeBtnLeft}>									
									<ImgDomain fileWidth={45} fileName={'b_car.png'}/>
									<Text style={styles.badgeBtnLeftText}>차량 배지</Text>
								</View>
								{realFile6.path ? (
									<View style={styles.stateView}>
										<Text style={styles.stateViewText}>심사중</Text>
									</View>
								) : (
									<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
								)}
							</TouchableOpacity>
						</View>
					</View>	

					<View style={[styles.badgeBox, styles.mgt40]}>
						<View style={styles.iptTit}>
              <Text style={styles.iptTitText}>직업 · 학력</Text>
            </View>
						<View style={[styles.badgeBtnBox, styles.boxShadow]}>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={realFile7.path ? 1 : opacityVal}
								onPress={()=>{
									!realFile7.path ? setBadgeTitle('직업 배지') : null
									!realFile7.path ? setBadgeType(7) : null
									!realFile7.path ? setBadgeModal(true) : null
									!realFile7.path ? setPreventBack(true) : null
								}}
							>
								<View style={styles.badgeBtnLeft}>									
									<ImgDomain fileWidth={45} fileName={'b_job.png'}/>
									<Text style={styles.badgeBtnLeftText}>직업 배지</Text>
								</View>
								{realFile7.path ? (
									<View style={styles.stateView}>
										<Text style={styles.stateViewText}>심사중</Text>
									</View>
								) : (
									<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
								)}
							</TouchableOpacity>
							<View style={styles.btnLineBox}><View style={styles.btnLine}></View></View>
							<TouchableOpacity
								style={styles.badgeBtn}
								activeOpacity={realFile8.path ? 1 : opacityVal}
								onPress={()=>{
									!realFile8.path ? setBadgeTitle('학력 배지') : null
									!realFile8.path ? setBadgeType(8) : null
									!realFile8.path ? setBadgeModal(true) : null
									!realFile8.path ? setPreventBack(true) : null
								}}
							>
								<View style={styles.badgeBtnLeft}>									
									<ImgDomain fileWidth={45} fileName={'b_school.png'}/>
									<Text style={styles.badgeBtnLeftText}>학력 배지</Text>
								</View>
								{realFile8.path ? (
									<View style={styles.stateView}>
										<Text style={styles.stateViewText}>심사중</Text>
									</View>
								) : (
									<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
								)}
							</TouchableOpacity>
						</View>
					</View>

					<View style={[styles.badgeBox, styles.mgt40]}>
						<View style={styles.iptTit}>
              <Text style={styles.iptTitText}>프로필 인증</Text>
            </View>
						<View style={[styles.badgeBtnBox]}>
							<TouchableOpacity
								style={[styles.badgeBtn, styles.boxShadow]}
								activeOpacity={realJobFile.path ? 1 : opacityVal}
								onPress={()=>{
									!realJobFile.path ? setJobModal(true) : null
									!realJobFile.path ? setPreventBack(true) : null
								}}
							>
								<View style={[styles.badgeBtnLeft2]}>
									<Text style={[styles.badgeBtnLeftText, styles.mgl0]}>직장 인증</Text>
									<Text style={styles.badgeBtnLeftText2}>인증 혜택</Text>
								</View>
								{realJobFile.path ? (
									<View style={styles.stateView}>
										<Text style={styles.stateViewText}>심사중</Text>
									</View>
								) : (
									<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
								)}
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.badgeBtn, styles.boxShadow, styles.mgt12]}
								activeOpacity={realSchoolFile.path ? 1 : opacityVal}
								onPress={()=>{
									!realSchoolFile.path ? setSchoolModal(true) : null
									!realSchoolFile.path ? setPreventBack(true) : null
								}}

								activeOpacity={opacityVal}
								activeOpacity={realSchoolFile.path ? 1 : opacityVal}
								onPress={()=>{
									!realSchoolFile.path ? setSchoolModal(true) : null
									!realSchoolFile.path ? setPreventBack(true) : null
								}}
							>
								<View style={[styles.badgeBtnLeft2]}>
									<Text style={[styles.badgeBtnLeftText, styles.mgl0]}>학교 인증</Text>
									<Text style={styles.badgeBtnLeftText2}>인증 혜택</Text>
								</View>
								{realSchoolFile.path ? (
									<View style={styles.stateView}>
										<Text style={styles.stateViewText}>심사중</Text>
									</View>
								) : (
									<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
								)}
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.badgeBtn, styles.boxShadow, styles.mgt12]}
								activeOpacity={realMarryFile.path ? 1 : opacityVal}
								onPress={()=>{
									!realMarryFile.path ? setMarryModal(true) : null
									!realMarryFile.path ? setPreventBack(true) : null
								}}
							>
								<View style={[styles.badgeBtnLeft2]}>
									<Text style={[styles.badgeBtnLeftText, styles.mgl0]}>혼인 정보</Text>
									<Text style={styles.badgeBtnLeftText2}>인증 혜택</Text>
								</View>
								{realMarryFile.path ? (
									<View style={styles.stateView}>
										<Text style={styles.stateViewText}>심사중</Text>
									</View>
								) : (
									<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
								)}
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>

      <View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn]}
					activeOpacity={opacityVal}
					onPress={() => {
						setConfirm(true);
						setPreventBack(true);
					}}
				>
					<Text style={styles.nextBtnText}>심사등록</Text>
				</TouchableOpacity>
			</View>

			{/* 배지선택 */}
			{badgeModal ? (
			<View style={styles.cmPop}>
				<View style={styles.prvPop}>
					<View style={styles.header}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>{badgeTitle}</Text>
						<TouchableOpacity
							style={styles.headerBackBtn2}
							activeOpacity={opacityVal}
							onPress={() => {
								offBadgeModal();								
							}}						
						>							
							<ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
						</TouchableOpacity>						
					</View>
					<ScrollView>
						<View style={[styles.cmWrap]}>
							<View style={styles.cmTitleBox}>
								<Text style={styles.cmTitleText}>배지 선택</Text>
							</View>
							<View style={styles.cmDescBox}>
								<Text style={styles.cmDescText}>인증할 배지를 선택해 주세요.</Text>
							</View>
							<View style={[styles.badgeBox, styles.mgt40]}>
								<View style={[styles.badgeBtnBox, styles.mgt0]}>
									<TouchableOpacity
										style={[
											styles.badgeBtn
											, styles.boxShadow
											, badgeGrade!= '' && badgeGrade != 'silver' ? styles.badgeBtnOff : null
											, badgeGrade=='silver' ? styles.badgeBtnOn : null
										]}
										activeOpacity={opacityVal}
										onPress={()=>{
											setBadgeCert(true);
											setBadgeGrade('silver');
										}}
									>
										<View style={[styles.badgeBtnLeft]}>
											{badgeGrade!= '' && badgeGrade != 'silver' ? (												
												<ImgDomain fileWidth={45} fileName={'b_silver_off.png'}/>
											) : (
												<ImgDomain fileWidth={45} fileName={'b_silver.png'}/>
											)}
											<View style={styles.badgeBtnLeftWrap}>
												<Text style={[
													styles.badgeBtnLeftText
													, styles.mgl0
													, badgeGrade!= '' && badgeGrade != 'silver' ? styles.badgeBtnLeftTextOff : null
													, badgeGrade=='silver' ? styles.badgeBtnLeftTextOn : null
												]}>
													프로필에 표시될 배지명
												</Text>
												<Text style={[
													styles.badgeBtnLeftText2
													, badgeGrade!= '' && badgeGrade != 'silver' ? styles.badgeBtnLeftText2Off : null
													, badgeGrade=='silver' ? styles.badgeBtnLeftText2On : null
												]}>
													배지 요약 설명
												</Text>
											</View>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.badgeBtn
											, styles.boxShadow
											, styles.mgt12
											, badgeGrade!= '' && badgeGrade != 'gold' ? styles.badgeBtnOff : null
											, badgeGrade=='gold' ? styles.badgeBtnOn : null
										]}
										activeOpacity={opacityVal}
										onPress={()=>{
											setBadgeCert(true);
											setBadgeGrade('gold');
										}}
									>
										<View style={[styles.badgeBtnLeft]}>
											{badgeGrade!= '' && badgeGrade != 'gold' ? (
												<ImgDomain fileWidth={45} fileName={'b_gold_off.png'}/>
											) : (
												<ImgDomain fileWidth={45} fileName={'b_gold.png'}/>
											)}
											<View style={styles.badgeBtnLeftWrap}>
												<Text style={[
													styles.badgeBtnLeftText
													, styles.mgl0
													, badgeGrade!= '' && badgeGrade != 'gold' ? styles.badgeBtnLeftTextOff : null
													, badgeGrade=='gold' ? styles.badgeBtnLeftTextOn : null
												]}>
													프로필에 표시될 배지명
												</Text>
												<Text style={[
													styles.badgeBtnLeftText2
													, badgeGrade!= '' && badgeGrade != 'gold' ? styles.badgeBtnLeftText2Off : null
													, badgeGrade=='gold' ? styles.badgeBtnLeftText2On : null
												]}>
													배지 요약 설명
												</Text>
											</View>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.badgeBtn
											, styles.boxShadow
											, styles.mgt12
											, badgeGrade!= '' && badgeGrade != 'dia' ? styles.badgeBtnOff : null
											, badgeGrade=='dia' ? styles.badgeBtnOn : null
										]}
										activeOpacity={opacityVal}
										onPress={()=>{
											setBadgeCert(true);
											setBadgeGrade('dia');
										}}
									>
										<View style={[styles.badgeBtnLeft]}>
											{badgeGrade!= '' && badgeGrade != 'dia' ? (
												<ImgDomain fileWidth={45} fileName={'b_diamond_off.png'}/>												
											) : (
												<ImgDomain fileWidth={45} fileName={'b_diamond.png'}/>
											)}
											<View style={styles.badgeBtnLeftWrap}>
												<Text style={[
													styles.badgeBtnLeftText
													, styles.mgl0
													, badgeGrade!= '' && badgeGrade != 'dia' ? styles.badgeBtnLeftTextOff : null
													, badgeGrade=='dia' ? styles.badgeBtnLeftTextOn : null
												]}>
													프로필에 표시될 배지명
												</Text>
												<Text style={[
													styles.badgeBtnLeftText2
													, badgeGrade!= '' && badgeGrade != 'dia' ? styles.badgeBtnLeftText2Off : null
													, badgeGrade=='dia' ? styles.badgeBtnLeftText2On : null
												]}>
													배지 요약 설명
												</Text>
											</View>
										</View>
									</TouchableOpacity>
								</View>
							</View>
							
							{badgeCert ? (
							<>
							<View style={styles.mgt40}>
								<View style={styles.iptTit}>
									<Text style={styles.iptTitText}>기준</Text>									
								</View>
								<View style={[styles.popInfoBox, styles.mgt8]}>
									<Text style={styles.popInfoBoxText}>배지 획득 기준 상세 내용</Text>
								</View>
							</View>

							<View style={styles.mgt40}>
								<View style={styles.iptTit}>
									<Text style={styles.iptTitText}>인증방법</Text>									
								</View>
								<View style={[styles.iptSubTit, styles.mgt5]}>
									<Text style={styles.iptSubTitText}>1. 인증해야 하는 자료 타이틀</Text>									
								</View>
								<View style={[styles.popInfoBox, styles.mgt8]}>
									<Text style={styles.popInfoBoxText}>자료 상세 내용</Text>
								</View>

								<View style={[styles.iptSubTit, styles.mgt10]}>
									<Text style={styles.iptSubTitText}>2. 인증해야 하는 자료 타이틀</Text>									
								</View>
								<View style={[styles.popInfoBox, styles.mgt8]}>
									<Text style={styles.popInfoBoxText}>자료 상세 내용</Text>
								</View>
							</View>

							<View style={styles.mgt40}>
								<View style={styles.iptTit}>
									<Text style={styles.iptTitText}>인증 예시</Text>									
								</View>
								<View style={[styles.iptSubTit, styles.mgt5]}>
									<Text style={styles.iptSubTitText}>제출 자료명</Text>									
								</View>
								<View style={[styles.exampleBox, styles.mgt8]}>
									<ImgDomain fileWidth={innerWidth} fileName={'example.jpg'}/>
								</View>
								<View style={styles.exampleBoxDesc}>
									<Text style={styles.exampleBoxDescText}>성함, 금액 등의 필수로 노출되어야 합니다</Text>
								</View>
							</View>

							<View style={styles.mgt40}>
								<View style={styles.iptTit}>
									<Text style={styles.iptTitText}>인증 자료 첨부</Text>									
								</View>
								<View style={[styles.iptSubTit, styles.mgt5]}>
									<Text style={styles.iptSubTitText}>주민등록번호 뒷자리는 가린 뒤 업로드 해주세요.</Text>									
								</View>
																
								{file.path ? (
									<View style={styles.fileBox}>
										<View style={styles.fileBoxLeft}>										
											<View style={styles.fileBoxLeftView}>
												<AutoHeightImage width={38} source={{ uri: file.path }} style={styles.fileBoxLeftImg} />
											</View>	
											<View style={styles.fileBoxLeftInfo}>
												<Text style={styles.fileBoxLeftInfoText}>{file.name}</Text>
												<Text style={styles.fileBoxLeftInfoText2}>{file.size} MB</Text>
											</View>
										</View>
										<TouchableOpacity 
											style={styles.fileBoxRight}
											activeOpacity={opacityVal}
											onPress={() => {
												setFile({});
											}}
										>
											<ImgDomain fileWidth={24} fileName={'icon_trash.png'}/>
										</TouchableOpacity>
									</View>
								) : (
									<View style={[styles.uploadBox, styles.mgt8]}>
										<TouchableOpacity 
											style={styles.uploadBoxBtn}
											activeOpacity={opacityVal}
											onPress={() => {chooseImage()}}
										>
											<ImgDomain fileWidth={18} fileName={'icon_upload.png'}/>
											<Text style={styles.uploadBoxBtnText}>사진 업로드</Text>
										</TouchableOpacity>
										<View style={styles.uploadBoxDesc}>
											<Text style={styles.uploadBoxDescText}>도용/위조는 중범죄이며 처벌 받을 수 있습니다.</Text>
											<Text style={styles.uploadBoxDescText}>모든 인증 서류는 인증 후 폐기됩니다.</Text>
										</View>
									</View>
								)}
							</View>
							</>
							) : null}
						</View>
					</ScrollView>
					<View style={styles.nextFix}>
						<TouchableOpacity 
							style={[styles.nextBtn, file.path ? null : styles.nextBtnOff]}
							activeOpacity={opacityVal}
							onPress={() => saveBadgeFileInfo()}
						>
							<Text style={styles.nextBtnText}>저장하기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			) : null}

			{/* 직업 인증 */}
			{jobModal ? (
			<View style={styles.cmPop}>
				<View style={styles.prvPop}>
					<View style={styles.header}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>인증</Text>
						<TouchableOpacity
							style={styles.headerBackBtn2}
							activeOpacity={opacityVal}
							onPress={() => {
								setJobModal(false);								
								setPreventBack(false);
							}}						
						>							
							<ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
						</TouchableOpacity>						
					</View>
					<ScrollView>
						<View style={styles.cmWrap}>
							<View style={styles.cmTitleBox}>
								<Text style={styles.cmTitleText}>직업 인증</Text>
							</View>
							<View style={[styles.cmDescBox, styles.cmDescBoxFlex]}>
								<Text style={styles.cmDescText}>입력한 직업</Text>
								<View style={styles.cmDescArr}>
									<ImgDomain fileWidth={5} fileName={'icon_arr6.png'}/>
								</View>
								<Text style={styles.cmDescText2}>입력한 직업 상세</Text>
							</View>

							<View style={styles.mgt30}>
								<View style={styles.iptTit}>
									<Text style={styles.iptTitText}>인증 방법</Text>
								</View>
								<View style={[styles.iptSubTit, styles.mgt5]}>
									<Text style={styles.iptSubTitText}>1. 본인의 이름과 직장명이 포함된 사원증, 명함</Text>									
								</View>
								<View style={[styles.iptSubTit, styles.mgt5]}>
									<Text style={styles.iptSubTitText}>2. 개인사업자의 경우 사업자등록증 등의 자료</Text>									
								</View>
								<View style={[styles.iptSubTit, styles.mgt5]}>
									<Text style={styles.iptSubTitText}>3. 그 외 재직을 증명할 수 있는 자료</Text>									
								</View>
							</View>

							<View style={styles.mgt40}>
								<View style={styles.iptTit}>
									<Text style={styles.iptTitText}>인증 자료 첨부</Text>
								</View>
								<View style={[styles.iptSubTit, styles.mgt5]}>
									<Text style={styles.iptSubTitText}>주민등록번호 뒷자리는 가린 뒤 업로드 해주세요</Text>									
								</View>
								{jobFile.path ? (
									<View style={styles.fileBox}>
										<View style={styles.fileBoxLeft}>										
											<View style={styles.fileBoxLeftView}>
												<AutoHeightImage width={38} source={{ uri: jobFile.path }} style={styles.fileBoxLeftImg} />
											</View>	
											<View style={styles.fileBoxLeftInfo}>
												<Text style={styles.fileBoxLeftInfoText}>{jobFile.name}</Text>
												<Text style={styles.fileBoxLeftInfoText2}>{jobFile.size} MB</Text>
											</View>
										</View>
										<TouchableOpacity 
											style={styles.fileBoxRight}
											activeOpacity={opacityVal}
											onPress={() => {
												setJobFile({});
											}}
										>
											<ImgDomain fileWidth={24} fileName={'icon_trash.png'}/>
										</TouchableOpacity>
									</View>
								) : (
									<View style={[styles.uploadBox, styles.mgt8]}>
										<TouchableOpacity 
											style={styles.uploadBoxBtn}
											activeOpacity={opacityVal}
											onPress={() => {jobImage()}}
										>											
											<ImgDomain fileWidth={18} fileName={'icon_upload.png'}/>
											<Text style={styles.uploadBoxBtnText}>사진 업로드</Text>
										</TouchableOpacity>
										<View style={styles.uploadBoxDesc}>
											<Text style={styles.uploadBoxDescText}>도용/위조는 중범죄이며 처벌 받을 수 있습니다.</Text>
											<Text style={styles.uploadBoxDescText}>모든 인증 서류는 인증 후 폐기됩니다.</Text>
										</View>
									</View>
								)}
							</View>
						</View>
					</ScrollView>
					<View style={[styles.nextFix]}>
						<TouchableOpacity 
							style={[styles.nextBtn, jobFile.path ? null : styles.nextBtnOff]}
							activeOpacity={opacityVal}
							onPress={() => saveJobCert()}
						>
							<Text style={styles.nextBtnText}>저장하기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			) : null}

			{/* 학교 인증 */}
			{schoolModal ? (
			<View style={styles.cmPop}>
				<View style={styles.prvPop}>
					<View style={styles.header}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>인증</Text>
						<TouchableOpacity
							style={styles.headerBackBtn2}
							activeOpacity={opacityVal}
							onPress={() => {
								setSchoolModal(false);								
								setPreventBack(false);
							}}						
						>
							<ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
						</TouchableOpacity>						
					</View>
					<KeyboardAvoidingView
						keyboardVerticalOffset={0}
						behavior={behavior}
						style={{flex: 1}}
					>
						<ScrollView>
							<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
								<View style={styles.cmWrap}>
									<View style={styles.cmTitleBox}>
										<Text style={styles.cmTitleText}>학교 인증</Text>
									</View>

									<View style={styles.mgt30}>
										<View style={styles.iptTit}>
											<Text style={styles.iptTitText}>학교명 <Text style={styles.red}>*</Text></Text>
										</View>
										<View style={styles.loginIptBox}>
											<TextInput
												value={schoolName}
												onChangeText={(v) => {
													setSchoolName(v);
												}}
												placeholder={'내 프로필에 드러낼 학교명을 입력해 주세요'}
												placeholderTextColor="#DBDBDB"
												style={[styles.input, styles.mgt10]}
												returnKyeType='done'
												onSubmitEditing={saveSchoolCert}
											/>
										</View>
										<View style={[styles.iptTit, styles.mgt40]}>
											<Text style={styles.iptTitText}>전공 <Text style={styles.gray}>[선택]</Text></Text>
										</View>
										<View style={styles.loginIptBox}>
											<TextInput
												value={schoolMajor}
												onChangeText={(v) => {
													setSchoolMajor(v);
												}}
												placeholder={'내 프로필에 드러낼 전공을 입력해 주세요'}
												placeholderTextColor="#DBDBDB"
												style={[styles.input, styles.mgt10]}
												returnKyeType='done'
												onSubmitEditing={saveSchoolCert}
											/>
										</View>
									</View>

									<View style={styles.mgt40}>
										<View style={styles.iptTit}>
											<Text style={styles.iptTitText}>인증 방법</Text>
										</View>
										<View style={[styles.iptSubTit, styles.mgt5]}>
											<Text style={styles.iptSubTitText}>1. 본인 이름이 포함된 졸업증명서</Text>									
										</View>
										<View style={[styles.iptSubTit, styles.mgt5]}>
											<Text style={styles.iptSubTitText}>2. 카카오톡 학생증</Text>									
										</View>
										<View style={[styles.iptSubTit, styles.mgt5]}>
											<Text style={styles.iptSubTitText}>3. 그 외 재학 또는 졸업을 증명할 수 있는 자료</Text>									
										</View>
									</View>

									<View style={styles.mgt40}>
										<View style={styles.iptTit}>
											<Text style={styles.iptTitText}>인증 자료 첨부</Text>
										</View>
										<View style={[styles.iptSubTit, styles.mgt5]}>
											<Text style={styles.iptSubTitText}>주민등록번호 뒷자리는 가린 뒤 업로드 해주세요</Text>									
										</View>
										{schoolFile.path ? (
											<View style={styles.fileBox}>
												<View style={styles.fileBoxLeft}>	
													<View style={styles.fileBoxLeftView}>
														<AutoHeightImage width={38} source={{ uri: schoolFile.path }} style={styles.fileBoxLeftImg} />
													</View>	
													<View style={styles.fileBoxLeftInfo}>
														<Text style={styles.fileBoxLeftInfoText}>{schoolFile.name}</Text>
														<Text style={styles.fileBoxLeftInfoText2}>{schoolFile.size} MB</Text>
													</View>
												</View>
												<TouchableOpacity 
													style={styles.fileBoxRight}
													activeOpacity={opacityVal}
													onPress={() => {
														setSchoolFile({});
													}}
												>
													<ImgDomain fileWidth={24} fileName={'icon_trash.png'}/>
												</TouchableOpacity>
											</View>
										) : (
											<View style={[styles.uploadBox, styles.mgt8]}>
												<TouchableOpacity 
													style={styles.uploadBoxBtn}
													activeOpacity={opacityVal}
													onPress={() => {schoolImage()}}
												>
													<ImgDomain fileWidth={18} fileName={'icon_upload.png'}/>
													<Text style={styles.uploadBoxBtnText}>사진 업로드</Text>
												</TouchableOpacity>
												<View style={styles.uploadBoxDesc}>
													<Text style={styles.uploadBoxDescText}>도용/위조는 중범죄이며 처벌 받을 수 있습니다.</Text>
													<Text style={styles.uploadBoxDescText}>모든 인증 서류는 인증 후 폐기됩니다.</Text>
												</View>
											</View>
										)}
									</View>
								</View>
							</TouchableWithoutFeedback>
						</ScrollView>
					</KeyboardAvoidingView>
					<View style={[styles.nextFix]}>
						<TouchableOpacity 
							style={[styles.nextBtn, schoolFile.path && schoolName != '' ? null : styles.nextBtnOff]}
							activeOpacity={opacityVal}
							onPress={() => saveSchoolCert()}
						>
							<Text style={styles.nextBtnText}>저장하기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			) : null}

			{/* 혼인 인증 */}
			{marryModal ? (
			<View style={styles.cmPop}>
				<View style={styles.prvPop}>
					<View style={styles.header}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>인증</Text>
						<TouchableOpacity
							style={styles.headerBackBtn2}
							activeOpacity={opacityVal}
							onPress={() => {
								setMarryModal(false);								
								setPreventBack(false);
							}}						
						>
							<ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
						</TouchableOpacity>						
					</View>
					<KeyboardAvoidingView
						keyboardVerticalOffset={0}
						behavior={behavior}
						style={{flex: 1}}
					>
						<ScrollView>
							<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
								<View style={styles.cmWrap}>
									<View style={styles.cmTitleBox}>
										<Text style={styles.cmTitleText}>혼인 정보</Text>
									</View>
									<View style={[styles.cmDescBox]}>
										<Text style={styles.cmDescText}>혼인 여부 입력 & 인증을 해주세요</Text>
										<Text style={styles.cmDescText}>입력하지 않으면 프로필에 노출 되지 않습니다.</Text>
									</View>

									<View style={styles.mgt30}>
										<View style={styles.iptTit}>
											<Text style={styles.iptTitText}>혼인 여부</Text>
										</View>
										<View style={styles.popRadioType2}>		
											<TouchableOpacity
												style={[styles.popRadioBoxBtn2, marryState == '미혼' ? styles.popRadioBoxBtn2On : null]}
												activeOpacity={opacityVal}
												onPress={()=>{setMarryState('미혼')}}
											>
												<Text style={[styles.popRadioBoxBtn2Text, marryState == '미혼' ? styles.popRadioBoxBtn2TextOn : null]}>미혼</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={[styles.popRadioBoxBtn2, marryState == '돌싱' ? styles.popRadioBoxBtn2On : null]}
												activeOpacity={opacityVal}
												onPress={()=>{setMarryState('돌싱')}}
											>
												<Text style={[styles.popRadioBoxBtn2Text, marryState == '돌싱' ? styles.popRadioBoxBtn2TextOn : null]}>돌싱</Text>
											</TouchableOpacity>							
										</View>
									</View>

									<View style={styles.mgt40}>
										<View style={styles.iptTit}>
											<Text style={styles.iptTitText}>인증 방법</Text>
										</View>
										<View style={[styles.iptSubTit, styles.mgt5]}>
											<Text style={styles.iptSubTitText}>1. 혼인 관계 증명서</Text>									
										</View>
									</View>

									<View style={styles.mgt40}>
										<View style={styles.iptTit}>
											<Text style={styles.iptTitText}>인증 자료 첨부</Text>
										</View>
										<View style={[styles.iptSubTit, styles.mgt5]}>
											<Text style={styles.iptSubTitText}>주민등록번호 뒷자리는 가린 뒤 업로드 해주세요</Text>									
										</View>
										{marryFile.path ? (
											<View style={styles.fileBox}>
												<View style={styles.fileBoxLeft}>										
													<View style={styles.fileBoxLeftView}>
														<AutoHeightImage width={38} source={{ uri: marryFile.path }} style={styles.fileBoxLeftImg} />
													</View>
													<View style={styles.fileBoxLeftInfo}>
														<Text style={styles.fileBoxLeftInfoText}>{marryFile.name}</Text>
														<Text style={styles.fileBoxLeftInfoText2}>{marryFile.size} MB</Text>
													</View>
												</View>
												<TouchableOpacity 
													style={styles.fileBoxRight}
													activeOpacity={opacityVal}
													onPress={() => {
														setMarryFile({});
													}}
												>
													<ImgDomain fileWidth={24} fileName={'icon_trash.png'}/>
												</TouchableOpacity>
											</View>
										) : (
											<View style={[styles.uploadBox, styles.mgt8]}>
												<TouchableOpacity 
													style={styles.uploadBoxBtn}
													activeOpacity={opacityVal}
													onPress={() => {marryImage()}}
												>
													<ImgDomain fileWidth={18} fileName={'icon_upload.png'}/>
													<Text style={styles.uploadBoxBtnText}>사진 업로드</Text>
												</TouchableOpacity>
												<View style={styles.uploadBoxDesc}>
													<Text style={styles.uploadBoxDescText}>도용/위조는 중범죄이며 처벌 받을 수 있습니다.</Text>
													<Text style={styles.uploadBoxDescText}>모든 인증 서류는 인증 후 폐기됩니다.</Text>
												</View>
											</View>
										)}
									</View>
								</View>
							</TouchableWithoutFeedback>
						</ScrollView>
					</KeyboardAvoidingView>
					<View style={[styles.nextFix]}>
						<TouchableOpacity 
							style={[styles.nextBtn, marryFile.path != '' ? null : styles.nextBtnOff]}
							activeOpacity={opacityVal}
							onPress={() => saveMarryCert()}
						>
							<Text style={styles.nextBtnText}>저장하기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			) : null}

			{confirm ? (
			<View style={[styles.cmPop, styles.cmPop2]}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						setConfirm(false);
						setPreventBack(false);
					}}
				>
				</TouchableOpacity>
				<View style={styles.prvPop2}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setConfirm(false);
							setPreventBack(false);
						}}
					>
						<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
					</TouchableOpacity>		
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>심사 등록</Text>
						<View style={styles.mgt20}>
							<Text style={styles.popTitleDesc}>작성하신 정보로 프로필 승인 심사를</Text>
							<Text style={styles.popTitleDesc}>제출하시겠어요?</Text>
						</View>
					</View>													
					<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						<TouchableOpacity 
							style={[styles.popBtn, styles.popBtn2]}
							activeOpacity={opacityVal}
							onPress={() => {
								setConfirm(false);
								setPreventBack(false);
							}}
						>
							<Text style={styles.popBtnText}>아니오</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.popBtn]}
							activeOpacity={opacityVal}
							onPress={() => {
								nextStep();
							}}
						>
							<Text style={styles.popBtnText}>네</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
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
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
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
  
	regiStateBarBox: {paddingTop:30,paddingBottom:56,paddingHorizontal:55,overflow:'hidden'},
  regiStateBar: {height:18,backgroundColor:'#eee',borderRadius:20,flexDirection:'row',justifyContent:'space-between'},
	regiStateCircel: {width:18,height:18,backgroundColor:'#eee',borderRadius:50,position:'relative'},
	regiStateCircelOn: {backgroundColor:'#243B55',},
	regiStateCircel2: {width:6,height:6,backgroundColor:'#fff',borderRadius:50,position:'absolute',left:6,top:6,},
	regiStateText: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:13,color:'#dbdbdb',width:60,position:'absolute',left:-20,bottom:-28,textAlign:'center',},
	regiStateTexOn: {color:'#243B55'},

	iptTit: {},
  iptTitText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#1e1e1e'},
	iptSubTit: {},
	iptSubTitText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#666'},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  
	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'#fff',},
	cmPop2: {backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,},
	prvPop: {position:'relative',zIndex:10,width:widnowWidth,height:widnowHeight,backgroundColor:'#fff',borderRadius:10,},
	prvPop2: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E'},
	popTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:24,color:'#1e1e1e',},
	popIptBox: {paddingTop:10,},
	help_box: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#EE4245',},
	txtCntText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#b8b8b8'},
	popBtnBox: {marginTop:30,},
	popBtnBoxFlex: {flexDirection:'row',justifyContent:'space-between'},
	popBtn: {width:(innerWidth/2)-25,alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtn2: {backgroundColor:'#999'},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},	

	header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},

	input: { fontFamily: Font.NotoSansRegular, width: innerWidth, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
	popRadioType2: {flexDirection:'row',flexWrap:'wrap',},
	popRadioBoxBtn2: {alignItems:'center',justifyContent:'center',height:38,borderWidth:1,borderColor:'#ededed',borderRadius:50,paddingHorizontal:16,marginTop:8,marginRight:8,},
	popRadioBoxBtn2On: {backgroundColor:'rgba(209,145,60, 0.15)',borderColor:'#D1913C'},
	popRadioBoxBtn2Text: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:19,color:'#666',},
	popRadioBoxBtn2TextOn: {color:'#D1913C'},

	boxShadow: {
		borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.5,
		elevation: 4,
	},
	badgeBtnBox: {backgroundColor:'#fff',marginTop:15,},
	badgeBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#fff',padding:20,},
	badgeBtnOff: {},
	badgeBtnOn: {shadowColor:'#D1913C',shadowOpacity:0.45,backgroundColor:'#FFFCF8'},
	badgeBtnLeft: {flexDirection:'row',alignItems:'center'},
	badgeBtnLeftWrap: {marginLeft:20,},
	badgeBtnLeftText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#1e1e1e',marginLeft:10,},
	badgeBtnLeftTextOff: {color:'#b8b8b8'},
	badgeBtnLeft2: {},
	badgeBtnLeftText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#666',marginTop:6,},
	badgeBtnLeftText2Off: {color:'#b8b8b8'},
	btnLineBox: {paddingHorizontal:15,},
	btnLine: {height:1,backgroundColor:'#EDEDED'},

	stateView: {alignItems:'center',justifyContent:'center',height:18,paddingHorizontal:6,backgroundColor:'#243B55',borderRadius:10,},
	stateViewText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:14,color:'#fff'},

	popInfoBox: {minHeight:100,backgroundColor:'#F9FAFB',paddingVertical:10,paddingHorizontal:15,borderRadius:5,},
	popInfoBoxText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:26,color:'#b8b8b8',},

	exampleBox: {borderTopLeftRadius:5,borderTopRightRadius:5,overflow:'hidden'},
	exampleBoxDesc: {borderWidth:1,borderTopWidth:0,borderColor:'#EDEDED',borderRadius:5,padding:15,},
	exampleBoxDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:20,color:'#1e1e1e'},

	uploadBox: {padding:20,borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,alignItems:'center'},
	uploadBoxBtn: {flexDirection:'row',alignItems:'center',backgroundColor:'#F9FAFB',borderRadius:50,paddingVertical:4,paddingHorizontal:13,},
	uploadBoxBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:18,color:'#243B55',marginLeft:5,},
	uploadBoxDesc: {marginTop:10,},
	uploadBoxDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:19,color:'#B8B8B8',},

	fileBox: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15,},
	fileBoxLeft: {flexDirection:'row',alignItems:'center',},
	fileBoxLeftView: {width:36,height:36,borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,overflow:'hidden'},
	fileBoxLeftImg: {},
	fileBoxLeftInfo: {marginLeft:10,},
	fileBoxLeftInfoText: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:18,color:'#1e1e1e',},
	fileBoxLeftInfoText2: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:18,color:'#B8B8B8'},
	fileBoxRight: {width:24,},

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
})

export default RegisterStep8