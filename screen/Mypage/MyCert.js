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

const MyCert = (props) => {
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
	const [deletePop, setDeletePop] = useState(false);
	const [deleteType, setDeleteType] = useState(); //1=>직장, 2=>학교, 3=>혼인
	const [file, setFile] = useState({});

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
		if(realJobFile.path){ nextObj.step8JobFile = realJobFile; }
		if(realSchoolFile.path){ nextObj.step8SchoolFile = realSchoolFile; }
		nextObj.step8SchoolName = realSchoolName; 
		nextObj.step8SchoolMajor = realSchoolMajor;
		if(realMarryFile.path){ nextObj.step8MarryFile = realMarryFile; }
		nextObj.step8MarryState = realMarryState;

		console.log(nextObj);
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'내 인증'} />

			<ScrollView>
				<View style={styles.cmWrap}>
					<View style={styles.cmTitleBox}>
						<Text style={styles.cmTitleText}>프로필 인증하고</Text>
						<Text style={[styles.cmTitleText, styles.mgt8]}>신뢰도를 높이세요!</Text>
					</View>
					<View style={styles.cmDescBox}>
						<Text style={styles.cmDescText}>신뢰도를 높이면 매칭율이 증가해요.</Text>
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
									<Text style={styles.badgeBtnLeftText2}>포인트 지급</Text>
								</View>
								<View style={styles.badgeBtnRight}>
									{realJobFile.path ? (
										<View style={styles.stateView}>
											<Text style={styles.stateViewText}>심사중</Text>
										</View>
									) : (
										<>
										<View style={styles.stateView2}>
											<Text style={styles.stateViewText2}>반려</Text>
										</View>
										<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
										</>									
									)}
								</View>
							</TouchableOpacity>

							{/* <TouchableOpacity
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
									<Text style={styles.badgeBtnLeftText2}>포인트 지급</Text>
								</View>
								<View style={styles.badgeBtnRight}>
									{realSchoolFile.path ? (
										<View style={styles.stateView}>
											<Text style={styles.stateViewText}>심사중</Text>
										</View>
									) : (
										<>
										<View style={styles.stateView2}>
											<Text style={styles.stateViewText2}>반려</Text>
										</View>
										<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
										</>									
									)}
								</View>
							</TouchableOpacity> */}
							<View style={[styles.badgeBtn, styles.boxShadow, styles.mgt12]}>
								<View style={[styles.badgeBtnLeft2]}>
									<Text style={[styles.badgeBtnLeftText, styles.mgl0]}>학교 인증</Text>
									<Text style={styles.badgeBtnLeftText2}>포인트 지급</Text>
								</View>
								<View style={styles.badgeBtnRight}>
									<TouchableOpacity
										activeOpacity={opacityVal}
										onPress={()=>{
											setDeleteType(2);
											setDeletePop(true);
										}}
									>										
										<ImgDomain fileWidth={25} fileName={'icon_trash.png'}/>
									</TouchableOpacity>		
								</View>
							</View>

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
									<Text style={styles.badgeBtnLeftText2}>포인트 지급</Text>
								</View>
								<View style={styles.badgeBtnRight}>
									{realMarryFile.path ? (
										<View style={styles.stateView}>
											<Text style={styles.stateViewText}>심사중</Text>
										</View>
									) : (
										<>
										<View style={styles.stateView2}>
											<Text style={styles.stateViewText2}>반려</Text>
										</View>
										<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
										</>									
									)}
								</View>
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
								<Text style={styles.cmTitleText3}>직업 인증</Text>
							</View>
							<View style={styles.reject}>
								<View style={styles.rejectBox}>
									<Text style={styles.rejectText}>반려 사유 메세지</Text>
								</View>
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
										<Text style={styles.cmTitleText3}>학교 인증</Text>
									</View>
									<View style={styles.reject}>
										<View style={styles.rejectBox}>
											<Text style={styles.rejectText}>반려 사유 메세지</Text>
										</View>
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
										<Text style={styles.cmTitleText3}>혼인 정보</Text>
									</View>
									<View style={styles.reject}>
										<View style={styles.rejectBox}>
											<Text style={styles.rejectText}>반려 사유 메세지</Text>
										</View>
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

			{/* 배지 삭제 컨펌 */}
      <Modal
				visible={deletePop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setDeletePop(false)}
			>
				<View style={[styles.cmPop, styles.cmPop2]}>
					<TouchableOpacity 
						style={[styles.popBack]} 
						activeOpacity={1} 
						onPress={()=>{setDeletePop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop2}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setDeletePop(false)}}
						>
							<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
              <Text style={styles.popTitleText}>인증 항목을 삭제하시겠어요?</Text>
						</View>
            <View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.mgt50]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => {
                  setDeletePop(false);
                }}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => setDeletePop(false)}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

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

	badgeBtnRight: {flexDirection:'row',alignItems:'center'},
	stateView: {alignItems:'center',justifyContent:'center',height:18,paddingHorizontal:6,backgroundColor:'#243B55',borderRadius:10,},
	stateViewText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:14,color:'#fff'},
	stateView2: {alignItems:'center',justifyContent:'center',height:18,paddingHorizontal:6,backgroundColor:'rgba(238,66,69,0.15)',borderRadius:10,marginRight:5,},
	stateViewText2: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:14,color:'#EE4245'},

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

	reject: {marginTop:10,},
  rejectBox: {padding:15,backgroundColor:'rgba(255,120,122,0.1)',borderRadius:5,},
  rejectText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#DE282A'},

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

export default MyCert