import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
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

import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';
import { DrawerContentScrollView } from '@react-navigation/drawer';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 20;
const paddTop = Platform.OS === 'ios' ? 0 : 15;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;

const RegisterStep7 = ({navigation, route}) => {		
	const qnaData = [
		{key:1, subject:'', content:'', listIdx:''},
		{key:2, subject:'', content:'', listIdx:''},
		{key:3, subject:'', content:'', listIdx:''},
	]

	// console.log('phonenumber7 ::: ', route['params']['phonenumber']);
	// console.log('age7 ::: ', route['params']['age']);

	const nextObj = {
		prvChk4:route['params']['prvChk4'],
		accessRoute:route['params']['accessRoute'],
		phonenumber:route['params']['phonenumber'],
		age:route['params']['age'],
		gender:route['params']['gender'],
		name:route['params']['name'],
		member_id:route['params']['member_id'],
		member_pw:route['params']['member_pw'],
		member_nick:route['params']['member_nick'],
		member_sex:route['params']['member_sex'],
		member_main_local:route['params']['member_main_local'],		
		member_main_local_detail:route['params']['member_main_local_detail'],
		member_sub_local:route['params']['member_sub_local'],
		member_sub_local_detail:route['params']['member_sub_local_detail'],
		member_education:route['params']['member_education'],
		member_education_status:route['params']['member_education_status'],
		member_job:route['params']['member_job'],
		member_job_detail:route['params']['member_job_detail'],
		member_height:route['params']['member_height'],
		member_weight:route['params']['member_weight'],
		member_muscle:route['params']['member_muscle'],
		member_fat:route['params']['member_fat'],
		member_no_weight:route['params']['member_no_weight'],
		member_no_muscle:route['params']['member_no_muscle'],
		member_no_fat:route['params']['member_no_fat'],
		member_rest:route['params']['member_rest'],
		member_exercise:route['params']['member_exercise'],
		member_physicalType:route['params']['member_physicalType'],
		member_drink_status:route['params']['member_drink_status'],
		member_drinkText:route['params']['member_drinkText'],
		member_smoke_status:route['params']['member_smoke_status'],
		member_smokeText:route['params']['member_smokeText'],
		member_smoke_type:route['params']['member_smoke_type'],
		member_smokeSortText:route['params']['member_smokeSortText'],
		member_smoke_type:route['params']['member_smoke_type'],
		member_mbit1:route['params']['member_mbit1'],
		member_mbit2:route['params']['member_mbit2'],
		member_mbit3:route['params']['member_mbit3'],
		member_mbit4:route['params']['member_mbit4'],
		mbti_result:route['params']['mbti_result'],
		member_religion:route['params']['member_religion'],
		file1:route['params']['file1'],
		file2:route['params']['file2'],
		file3:route['params']['file3'],
		file4:route['params']['file4'],
		file5:route['params']['file5'],
		file6:route['params']['file6'],	
		fileResData:route['params']['fileResData'],
	}	

	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [currFocus, setCurrFocus] = useState('');
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);

	const [guideModal, setGuideModal] = useState(false);
	const [qnaModal, setQnaModal] = useState(false);
	const [writeModal, setWriteModal] = useState(false);
	const [qnaList, setQnaList] = useState(qnaData);
	const [activeTab, setActiveTab] = useState();
	const [apiQnaTab, setApiQnaTab] = useState([]);
	const [apiQnaListData, setapiQnaListData] = useState([]);
	const [qnaListChk, setQnaListChk] = useState([]);
	const [guideIntro, setGuideIntro] = useState([]);

	const [currQnaBox, setCurrQnaBox] = useState(0);
	const [ingIdx, setIngIdx] = useState(0);
	const [ingSubject, setIngSubject] = useState('');
	const [ingContent, setIngContent] = useState('');
	const [ingPlaceholder, setIngPlaceholder] = useState('');

	const [intro, setIntro] = useState('');
	const [nextOpen, setNextOpen] = useState(false);

	const [guideOpen, setGuideOpen] = useState();

	const writeModalRef = useRef(writeModal);
  const subjectRef = useRef(ingSubject);

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

			if(route['params']['qnaList']){ setQnaList(route['params']['qnaList']); }
			if(route['params']['member_intro']){ setIntro(route['params']['member_intro']); }
			//if(route['params']['qnaListData']){ setapiQnaListData(route['params']['qnaListData']); }			
			if(route['params']['qnaListChk']){ setQnaListChk(route['params']['qnaListChk']); }
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
				if(writeModalRef.current){					
					let selectCon = [];
					//console.log('qnaListChk back ::: ',qnaListChk);
					qnaListChk.map((item, index) => {
						//console.log(item+'/////'+subjectRef.current);								
						if(item != subjectRef.current){
							let ary = item;
							selectCon = [...selectCon, ary];
						}
					});			
					//console.log('selectCon ::: ',selectCon);		
					setQnaListChk(selectCon);					
					
					setWriteModal(false);
					setIngIdx(0);
					setIngSubject('');
					setIngContent('');
					setIngPlaceholder('');
				}else{
					setQnaModal(false);
					setPreventBack(false);
				}							
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

	useEffect(() => {
    writeModalRef.current = writeModal;
  }, [writeModal]);

	useEffect(() => {
		//console.log('qnaListChk ::: ',qnaListChk);
	}, [qnaListChk]);

	useEffect(() => {
		subjectRef.current = ingSubject;
	}, [ingSubject]);
	
	useEffect(() => {
		let cnt = 0;
		qnaList.map((item, index) => {		
			if(index == 0 && item.listIdx){ cnt = cnt + 1; }
			if(index == 1 && item.listIdx){ cnt = cnt + 1; }
			if(index == 2 && item.listIdx){ cnt = cnt + 1; }
		})

		if(cnt == 3){
			setNextOpen(true);
		}else{
			setNextOpen(false);
		}
	}, [qnaList]);

	useEffect(() => {
		setLoading(true);
		getQnaTabData();
		getGuideIntro();
	}, []);

	const getQnaTabData = async () => {
		let sData = {      
      basePath: "/api/member/",
			type: "GetInterviewList",
			interview_category: 10
		}
		const response = await APIs.send(sData);
		if(response.code == 200){
			//console.log(response.data.category);
			setApiQnaTab(response.data.category);
			setActiveTab(10);
			if(response.data.list == false){
				setapiQnaListData([]);
			}else{
				setapiQnaListData(response.data.list);				
			}
		}
	}

	const getGuideIntro = async () => {
		let sData = {      
      basePath: "/api/member/",
			type: "GetIntroduceList",
		}
		const response = await APIs.send(sData);
		if(response.code == 200){			
			setGuideIntro(response.data);
		}	
		setLoading(false);
	}

	const getActiveList = async (idx) => {
		setActiveTab(idx);

		let sData = {      
      basePath: "/api/member/",
			type: "GetInterviewList",
			interview_category: idx
		}
		const response = await APIs.send(sData);
		if(response.code == 200){
			//console.log(response.data.list);
			if(response.data.list == false){
				setapiQnaListData([]);
			}else{
				setapiQnaListData(response.data.list);				
			}
		}
	}

	const addInterview = () => {
		const order = (qnaList.length)+1;
		let addList = [...qnaList, {key:order, subject:'', content:'', listIdx: ''}];					
		setQnaList(addList);
	}

	const removeQna = (v, z) => {
		let selectCon = [];
		qnaList.map((item, index) => {
			if(item.key != v){
				let qnaList = {key : item.key, subject : item.subject, content : item.content, listIdx: item.listIdx};
				selectCon = [...selectCon, qnaList];
			}
		});

		let selectCon2 = selectCon.map((item, index) => {
			return {...item, key: index+1};
		});

		setQnaList(selectCon2);

		let selectCon3 = apiQnaListData.map((item) => {
			if(item.idx == z){
				return {...item, chk: false};
			}else{
				return {...item, chk: item.chk};
			}
		})
		setapiQnaListData(selectCon3);
	}

	const WritePopOff = (v) => {
		if(v == 'remove'){
			let selectCon = [];
			qnaListChk.map((item, index) => {
				//console.log(item+'/////'+ingIdx);								
				if(item != ingSubject){
					let ary = item;
					selectCon = [...selectCon, ary];
				}
			});
			
			setQnaListChk(selectCon);
		}
		setWriteModal(false);
		setPreventBack(false);
		setIngIdx(0);
		setIngSubject('');
		setIngContent('');
		setIngPlaceholder('');
	}

	const qnaSuccess = () => {
		if(ingContent.length < 5){
			ToastMessage('질문에 대한 답변을 5자 이상 입력해 주세요.');
			return false;
		}
		
		let chg = false;
		let offIdx = 0;
		let selectCon = qnaList.map((item) => {
			if(item.key === currQnaBox){
				if(item.listIdx != ''){
					chg = true;
					offIdx = item.listIdx;
					
					//console.log('offIdx :::: ',offIdx);
					let selectCon = [];
					qnaListChk.map((item2, index2) => {
						if(item.listIdx != item2){
							let ary2 = item2;
							selectCon = [...selectCon, ary2];
						}
					});					
					//console.log('selectCon :::: ', selectCon);
					setQnaListChk(selectCon);
				}

				return {...item, subject: ingSubject, content: ingContent, listIdx: ingIdx};
			}else{
				return {...item, subject: item.subject, content: item.content, listIdx: item.listIdx};
			}
		});		
		setQnaList(selectCon);

		// let selectCon3 = apiQnaListData.map((item) => {
		// 	if(chg && item.idx == offIdx){
		// 		return {...item, chk: false};
		// 	}else{
		// 		if(item.idx === ingIdx){							
		// 			return {...item, chk: true};
		// 		}else{
		// 			return {...item, chk: item.chk};
		// 		}
		// 	}
		// })
		// setapiQnaListData(selectCon3);

		setQnaModal(false);
		setPreventBack(false);
		WritePopOff();
	}

	const nextStep = () => {		
		if(intro.length < 50){
			ToastMessage('자기소개를 50자 이상 작성해 주세요.');
			return false;
		}

		if(!nextOpen){
			Keyboard.dismiss();
			ToastMessage('1~3번째 질문 작성을 완성해 주세요.');
			return false;
		}
		
		nextObj.qnaList = qnaList;
		nextObj.member_intro = intro;
		//nextObj.qnaListData = apiQnaListData;
		if(route['params']['step8File1']){ nextObj.step8File1 = route['params']['step8File1']; }
		if(route['params']['step8File2']){ nextObj.step8File2 = route['params']['step8File2']; }
		if(route['params']['step8File3']){ nextObj.step8File3 = route['params']['step8File3']; }
		if(route['params']['step8File4']){ nextObj.step8File4 = route['params']['step8File4']; }
		if(route['params']['step8File5']){ nextObj.step8File5 = route['params']['step8File5']; }
		if(route['params']['step8File6']){ nextObj.step8File6 = route['params']['step8File6']; }
		if(route['params']['step8File7']){ nextObj.step8File7 = route['params']['step8File7']; }
		if(route['params']['step8File8']){ nextObj.step8File8 = route['params']['step8File8']; }
		if(route['params']['step8Grade1']){ nextObj.step8Grade1 = route['params']['step8Grade1']; }
		if(route['params']['step8Grade2']){ nextObj.step8Grade2 = route['params']['step8Grade2']; }
		if(route['params']['step8Grade3']){ nextObj.step8Grade3 = route['params']['step8Grade3']; }
		if(route['params']['step8Grade4']){ nextObj.step8Grade4 = route['params']['step8Grade4']; }
		if(route['params']['step8Grade5']){ nextObj.step8Grade5 = route['params']['step8Grade5']; }
		if(route['params']['step8Grade6']){ nextObj.step8Grade6 = route['params']['step8Grade6']; }
		if(route['params']['step8Grade7']){ nextObj.step8Grade7 = route['params']['step8Grade7']; }
		if(route['params']['step8Grade8']){ nextObj.step8Grade8 = route['params']['step8Grade8']; }
		if(route['params']['step8JobFile']){ nextObj.step8JobFile = route['params']['step8JobFile']; }
		if(route['params']['step8SchoolFile']){ nextObj.step8SchoolFile = route['params']['step8SchoolFile']; }
		if(route['params']['step8SchoolName']){ nextObj.step8SchoolName = route['params']['step8SchoolName']; }
		if(route['params']['step8SchoolMajor']){ nextObj.step8SchoolMajor = route['params']['step8SchoolMajor']; }
		if(route['params']['step8MarryFile']){ nextObj.step8MarryFile = route['params']['step8MarryFile']; }
		if(route['params']['step8MarryState']){ nextObj.step8MarryState = route['params']['step8MarryState']; }
		if(route['params']['file1Url']){ nextObj.file1Url = route['params']['file1Url']; }
		if(route['params']['file2Url']){ nextObj.file2Url = route['params']['file2Url']; }
		if(route['params']['file3Url']){ nextObj.file3Url = route['params']['file3Url']; }
		if(route['params']['file4Url']){ nextObj.file4Url = route['params']['file4Url']; }
		if(route['params']['file5Url']){ nextObj.file5Url = route['params']['file5Url']; }
		if(route['params']['file6Url']){ nextObj.file6Url = route['params']['file6Url']; }
		if(route['params']['file7Url']){ nextObj.file7Url = route['params']['file7Url']; }
		if(route['params']['file8Url']){ nextObj.file8Url = route['params']['file8Url']; }
		if(route['params']['jobFileUrl']){ nextObj.jobFileUrl = route['params']['jobFileUrl']; }
		if(route['params']['schoolFileUrl']){ nextObj.schoolFileUrl = route['params']['schoolFileUrl']; }
		if(route['params']['marryFileUrl']){ nextObj.marryFileUrl = route['params']['marryFileUrl']; }		
		navigation.navigate('RegisterStep8', nextObj);
	}

	const listAryChk = (idx) => {		
		let ary = qnaListChk;

		const result = ary.filter((v) => v == idx);
		if(result.length > 0){
			//console.log('1');
		}else{
			ary.push(idx);			
		}
		//console.log(ary);
		setQnaListChk(ary);
	}

	const backNav = (page) => {
		nextObj.qnaList = qnaList;
		nextObj.member_intro = intro;
		//nextObj.qnaListData = apiQnaListData;		
		nextObj.qnaListChk = qnaListChk;
		nextObj.step8File1 = route['params']['step8File1'];
		nextObj.step8File2 = route['params']['step8File2'];
		nextObj.step8File3 = route['params']['step8File3'];
		nextObj.step8File4 = route['params']['step8File4'];
		nextObj.step8File5 = route['params']['step8File5'];
		nextObj.step8File6 = route['params']['step8File6'];
		nextObj.step8File7 = route['params']['step8File7'];
		nextObj.step8File8 = route['params']['step8File8'];
		nextObj.step8Grade1 = route['params']['step8Grade1'];
		nextObj.step8Grade2 = route['params']['step8Grade2'];
		nextObj.step8Grade3 = route['params']['step8Grade3'];
		nextObj.step8Grade4 = route['params']['step8Grade4'];
		nextObj.step8Grade5 = route['params']['step8Grade5'];
		nextObj.step8Grade6 = route['params']['step8Grade6'];
		nextObj.step8Grade7 = route['params']['step8Grade7'];
		nextObj.step8Grade8 = route['params']['step8Grade8'];
		nextObj.step8JobFile = route['params']['step8JobFile'];
		nextObj.step8SchoolFile = route['params']['step8SchoolFile'];
		nextObj.step8SchoolName = route['params']['step8SchoolName'];
		nextObj.step8SchoolMajor = route['params']['step8SchoolMajor'];
		nextObj.step8MarryFile = route['params']['step8MarryFile'];
		nextObj.step8MarryState = route['params']['step8MarryState'];
		nextObj.file1Url = route['params']['file1Url'];
		nextObj.file2Url = route['params']['file2Url'];
		nextObj.file3Url = route['params']['file3Url'];
		nextObj.file4Url = route['params']['file4Url'];
		nextObj.file5Url = route['params']['file5Url'];
		nextObj.file6Url = route['params']['file6Url'];
		nextObj.file7Url = route['params']['file7Url'];
		nextObj.file8Url = route['params']['file8Url'];
		nextObj.jobFileUrl = route['params']['jobFileUrl'];
		nextObj.schoolFileUrl = route['params']['schoolFileUrl'];
		nextObj.marryFileUrl = route['params']['marryFileUrl'];
		
		navigation.navigate(page, nextObj)
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'소개글'} />
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<>
				<View style={styles.regiStateBarBox}>
					<View style={styles.regiStateBar}>
						<TouchableOpacity 
							style={[styles.regiStateCircel, styles.regiStateCircelOn]}
							activeOpacity={opacityVal}
							onPress={()=>backNav('RegisterStep5')}
						>
							<View style={styles.regiStateCircel2}></View>
							<Text style={[styles.regiStateText, styles.regiStateTexOn]}>기본 정보</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.regiStateCircel, styles.regiStateCircelOn]}
							activeOpacity={opacityVal}
							onPress={()=>backNav('RegisterStep6')}
						>
							<View style={styles.regiStateCircel2}></View>
							<Text style={[styles.regiStateText, styles.regiStateTexOn]}>프로필 등록</Text>
						</TouchableOpacity>
						<View style={[styles.regiStateCircel, styles.regiStateCircelOn]}>
							<View style={styles.regiStateCircel2}></View>
							<Text style={[styles.regiStateText, styles.regiStateTexOn]}>소개글</Text>
						</View>
						<View style={[styles.regiStateCircel]}>
							<View style={styles.regiStateCircel2}></View>
							<Text style={[styles.regiStateText]}>인증</Text>
						</View>
					</View>
				</View>
				
				<KeyboardAvoidingView
					keyboardVerticalOffset={0}
					behavior={behavior}
					style={{flex:1}}
				>				
					<ScrollView>							
						<View style={styles.cmWrap}>
							<View style={styles.cmTitleBox}>
								<Text style={styles.cmTitleText}>자기소개를 해주세요!</Text>
							</View>
							<View style={styles.cmDescBox}>
								<Text style={styles.cmDescText}>자세할수록 꼭 맞는 이성을 만날 수 있어요.</Text>
							</View>

							<TouchableOpacity
								style={styles.guideBtn}
								activeOpacity={opacityVal}
								onPress={()=>{
									setGuideModal(true);									
									setPreventBack(true);
								}}
							>
								<Text style={styles.guideBtnText}>자기소개 가이드</Text>
								<ImgDomain fileWidth={5} fileName={'icon_arr2.png'}/>
							</TouchableOpacity>

							<View style={styles.mgt20}>
								<TextInput
									value={intro}
									onChangeText={(v) => {
										setIntro(v);
									}}
									style={[styles.input, styles.textarea]}
									placeholder="자기소개 작성하기"
									placeholderTextColor="#DBDBDB"
									multiline={true}
									returnKyeType='done'
									scrollEnabled={false}
									maxLength={1000}
								/>
								<View style={styles.help_box}>
									<View style={styles.alertTextView}>
										{intro.length < 50 ? (
											<Text style={styles.alertText}>최소 50자 이상 입력해 주세요.</Text>
										) : null}
									</View>
									<Text style={styles.txtCntText}>{intro.length}/1,000</Text>
								</View>
							</View>

							<View style={styles.mgt70}>
								<View style={styles.cmTitleBox}>
									<Text style={styles.cmTitleText}>셀프 인터뷰</Text>
								</View>
								<View style={styles.cmDescBox}>
									<Text style={styles.cmDescText}>최소 3가지 질문을 입력해 주세요.</Text>
								</View>
							</View>

							<View style={styles.qnaBox}>
								{qnaList.map((item, index) => {
									return (
										<View key={index} style={[styles.qnaBtnView, index == 0 ? styles.mgt0 : null]}>
											{index > 2 ? (
											<TouchableOpacity
												style={styles.qnaBtnX}
												activeOpacity={0.5}
												onPress={()=>{removeQna(item.key, item.listIdx)}}
											>
												<ImgDomain fileWidth={12} fileName={'icon_close3.png'}/>
											</TouchableOpacity>
											) : null}

											<TouchableOpacity
												style={[styles.qnaBtn]}
												activeOpacity={opacityVal}
												onPress={() => {
													setCurrQnaBox(item.key);
													setQnaModal(true);
													setPreventBack(true);
												}}
											>				
												{item.subject != '' ? (
													<View style={styles.qnaAfter}>
														<Text style={styles.qnaAfterSubject}>{item.subject}</Text>
														<Text style={styles.qnaAfterContent}>{item.content}</Text>
													</View>
												) : (
													<View style={styles.qnaBefore}>
														<ImgDomain fileWidth={24} fileName={'icon_plus4.png'}/>
														<Text style={styles.qnaBeforeText}>질문을 선택해 주세요.</Text>
													</View>
												)}
											</TouchableOpacity>
										</View>
									)
								})}
							</View>
							<TouchableOpacity
								style={styles.addBtn}
								activeOpacity={opacityVal}
								onPress={() => {addInterview()}}
							>
								<ImgDomain fileWidth={10} fileName={'icon_plus5.png'}/>
								<Text style={styles.addBtnText}>인터뷰 추가</Text>
							</TouchableOpacity>
						</View>					
					</ScrollView>

					<View style={styles.nextFix}>
						<TouchableOpacity 
							style={[styles.nextBtn, intro.length >= 50 && nextOpen ? null : styles.nextBtnOff]}
							activeOpacity={opacityVal}
							onPress={() => nextStep()}
						>
							<Text style={styles.nextBtnText}>저장하기</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</>
			</TouchableWithoutFeedback>

			<Modal
				visible={guideModal}
				animationType={"none"}
        onRequestClose={() => {
					setGuideModal(false);
					setGuideOpen();
				}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.header}>						
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {
							setGuideModal(false);
							setGuideOpen();
						}}						
					>
						<ImgDomain fileWidth={16} fileName={'icon_close2.png'}/>
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View style={styles.cmWrap}>
						<View style={styles.cmTitleBox}>
							<Text style={styles.cmTitleText}>자기소개 가이드를</Text>
							<Text style={[styles.cmTitleText, styles.mgt8]}>참고해보세요!</Text>
						</View>
						
						<View style={styles.mgt20}>
							{guideIntro.map((item, index) => {
								return (
									<View key={index} style={styles.guidePopContBox}>
										<TouchableOpacity
											style={[styles.guidePopContBtn, guideOpen == item.it_idx ? styles.guidePopContBtn2 : null]}
											activeOpacity={opacityVal}
											onPress={()=>{
												if(guideOpen == item.it_idx){
													setGuideOpen();
												}else{
													setGuideOpen(item.it_idx);
												}												
											}}
										>
											<View style={styles.guidePopContBtnTitle}>
												<ImgDomain2 fileWidth={14} fileName={item.it_img}/>
												<Text style={styles.guidePopContBtnText}>{item.it_subject}</Text>
											</View>
											{guideOpen == item.it_idx ? (
												<ImgDomain fileWidth={10} fileName={'icon_arr4.png'}/>
											) : (
												<ImgDomain fileWidth={10} fileName={'icon_arr3.png'}/>
											)}
										</TouchableOpacity>
										{guideOpen == item.it_idx ? (
										<View style={styles.guidePopCont2}>
											<Text style={styles.guidePopCont2Text}>{item.it_content}</Text>
										</View>
										) : null}
									</View>
								)
							})}
						</View>
					</View>
				</ScrollView>
			</Modal>

			{qnaModal ? (
			<View style={[styles.cmPop]}>
				<View style={styles.prvPop}>
					<View style={styles.header}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>질문 선택</Text>
						<TouchableOpacity
							style={styles.headerBackBtn2}
							activeOpacity={opacityVal}
							onPress={() => {
								setQnaModal(false);
								setPreventBack(false);
							}}						
						>
							<ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
						</TouchableOpacity>						
					</View>

					<View style={styles.qnaTabArea}>
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator = {false}
							onMomentumScrollEnd ={() => {}}
						>
							{apiQnaTab.map((item, index) => {
								return (
									<TouchableOpacity
										key={index}
										style={[
											styles.qnaTabBtn
											, activeTab == item.ic_idx ? styles.qnaTabBtnOn : null
											, index == 0 ? styles.mgl0 : null
											, index+1 == apiQnaTab.length ? styles.mgr20 : null
										]}
										activeOpacity={opacityVal}
										onPress={() => {
											getActiveList(item.ic_idx);											
										}}
									>
										<Text style={[styles.qnaTabBtnText, activeTab == item.ic_idx ? styles.qnaTabBtnTextOn : null]}>{item.ic_name}</Text>
									</TouchableOpacity>
								)
							})}
						</ScrollView>
					</View>
					
					<ScrollView>
						<View style={[styles.cmWrap, styles.cmWrap2]}>
							<View style={styles.questionBox}>
								{apiQnaListData.length > 0 ? (
									apiQnaListData.map((item, index) => {
										let checked = false;
										const result = qnaListChk.filter((v) => v == item.interview_question);
										return (
											<TouchableOpacity
												key={item.interview_idx}
												style={[
													styles.questionBtn
													, styles.boxShadow
													, index == 0 ? styles.mgt0 : null
													, item.best_yn == 'y' || result.length > 0 ? styles.questionBest : null
												]}
												activeOpacity={result.length > 0 ? 1 : opacityVal}
												onPress={() => {
													if(result.length < 1){
														setIngIdx(item.interview_idx);
														setIngSubject(item.interview_question);
														setIngPlaceholder(item.interview_answer);
														setWriteModal(true);
														setPreventBack(true);
													}
													// result.length > 0 ? null : setIngIdx(item.interview_idx);
													// result.length > 0 ? null : setIngSubject(item.interview_question);
													// result.length > 0 ? null : setIngPlaceholder(item.interview_answer);
													// result.length > 0 ? null : setWriteModal(true);
													// result.length > 0 ? null : setPreventBack(true);
													listAryChk(item.interview_question);													
												}}
											>
												<Text style={[
													styles.questionBtnText
													, item.best_yn == 'y' ? styles.questionBtnText2 : null
													, result.length > 0 ? styles.questionBtnText3 : null
												]}>
													{item.interview_question}
												</Text>
												{item.best_yn == 'y' && result.length < 1 ? (<View style={styles.qnaBest}><Text style={styles.qnaBestText}>BEST</Text></View>) : null}
												{result.length > 0 ? (
													<ImgDomain fileWidth={18} fileName={'icon_chk4.png'}/>
												) : null}
											</TouchableOpacity>											
										)
									})
								) : (
									<View style={styles.notData}>
										<Text style={styles.notDataText}>선택할 수 있는 질문이 없습니다.</Text>
									</View>
								)}
							</View>
						</View>
					</ScrollView>
					
				</View>
			</View>
			) : null}

			{writeModal ? (
			<View style={[styles.cmPop]}>
				<View style={styles.prvPop}>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<>
						<View style={styles.header}>
							<TouchableOpacity
								style={styles.headerBackBtn2}
								activeOpacity={opacityVal}
								onPress={() => WritePopOff('remove')}
							>
								<ImgDomain fileWidth={16} fileName={'icon_close2.png'}/>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.headerSubmitBtn]}
								activeOpacity={opacityVal}
								onPress={() => {qnaSuccess()}}
							>
								<Text style={[styles.headerSubmitBtnText, ingContent.length >=5 ? styles.headerSubmitBtnTextOn : null]}>완료</Text>
							</TouchableOpacity>
						</View>
						<KeyboardAwareScrollView
							keyboardShouldPersistTaps="always"
						>				
							<View style={[styles.cmWrap, styles.cmWrap3]}>
								<View style={styles.ingBox}>
									<TextInput
										value={ingSubject}
										placeholder={'질문 제목을 입력해 주세요.'}
										placeholderTextColor="#DBDBDB"
										style={[styles.input2]}
										returnKyeType='done'
										readOnly={true}
									/>
									<TouchableOpacity
										style={styles.inputChg}
										activeOpacity={opacityVal}
										onPress={() => WritePopOff('remove')}
									>
										<ImgDomain fileWidth={12} fileName={'icon_pen.png'}/>
										<Text style={styles.inputChgText}>변경</Text>
									</TouchableOpacity>
								</View>
								<TextInput
									value={ingContent}
									onChangeText={(v) => {				
										if(v.length > 300){
											let val = v.substr(0, 300);
											setIngContent(val);
										}else{
											setIngContent(v);
										}        
									}}
									style={[styles.textarea, styles.textarea2]}
									//placeholder="답변을 입력해 주세요."
									placeholder={ingPlaceholder}
									placeholderTextColor="#DBDBDB"
									multiline={true}
									returnKyeType='done'
									maxLength={300}
								/>
								<View style={styles.help_box}>
									<View style={styles.alertTextView}>
										{ingContent.length < 5 ? (
											<Text style={styles.alertText}>최소 5자 이상 입력해 주세요.</Text>
										) : null}
									</View>									
									<Text style={styles.txtCntText}>{ingContent.length}/300</Text>
								</View>
							</View>
						</KeyboardAwareScrollView>
						</>
					</TouchableWithoutFeedback>
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
	cmWrap2: {paddingTop:0,paddingBottom:40,paddingHorizontal:20},
	cmWrap3: {paddingTop:20,},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
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

	input: {color:'#1e1e1e'},
	textarea: {width:innerWidth,minHeight:180,paddingVertical:0,paddingHorizontal:15,paddingTop:15,borderWidth:1,borderColor:'#EDEDED',borderRadius:5,textAlignVertical:'top',fontFamily:Font.NotoSansRegular,fontSize:14,color:'#1e1e1e',paddingTop:15,},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  
	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'#fff',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,},
	prvPop: {position:'relative',zIndex:10,width:widnowWidth,height:widnowHeight,backgroundColor:'#fff',borderRadius:10,},
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E'},
	popTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	popIptBox: {paddingTop:10,},
	help_box: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5,},
	alertTextView: {minWidth:1,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#EE4245',},
	txtCntText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#b8b8b8'},
	popBtnBox: {marginTop:30,},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},

	imgBox: {flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',alignItems:'flex-start',marginTop:30,},
	imgBtn: {borderRadius:5,overflow:'hidden',position:'relative',borderWidth:1,borderColor:'#EDEDED'},
	imgText: {width:43,height:21,backgroundColor:'#fff',borderRadius:50,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:21,textAlign:'center',color:'#243B55',position:'absolute',right:5,bottom:5,},

	guideBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',width:140,height:37,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:50,marginTop:20,},
	guideBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#1e1e1e',marginRight:8,position:'relative',top:1,},

	header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},

	guidePopCont: {padding:20,},
	guidePopContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e'},

	qnaBox: {marginTop:25,},
	qnaBtnView: {marginTop:10,position:'relative'},
	qnaBtnX: {width:32,height:32,position:'absolute',top:0,right:0,zIndex:10,alignItems:'center',justifyContent:'center'},
	qnaBtn: {paddingVertical:20,paddingHorizontal:15,backgroundColor:'#F9FAFB',borderRadius:5},
	qnaBefore: {alignItems:'center'},
	qnaBeforeText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#b8b8b8',marginTop:10,},
	qnaAfter: {},
	qnaAfterSubject: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
	qnaAfterContent: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#1e1e1e',marginTop:12,},
	addBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',height:52,backgroundColor:'#fff',borderWidth:1,borderColor:'#243B55',borderRadius:5,marginTop:20,},
	addBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#243B55',marginLeft:5,},

	qnaTabArea: {padding:20,paddingRight:0,},
	qnaTabBtn: {alignItems:'center',justifyContent:'center',height:35,paddingHorizontal:16,backgroundColor:'#fff',borderWidth:1,borderColor:'#DBDBDB',borderRadius:50,marginLeft:6,},
	qnaTabBtnOn: {backgroundColor:'#243B55',borderWidth:0,},
	qnaTabBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#666'},
	qnaTabBtnTextOn: {color:'#fff'},
	questionBox: {paddingTop:10,},
	questionBtn: {padding:15,backgroundColor:'#fff',borderRadius:5,marginTop:12,},
	questionBest: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	questionBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#1e1e1e'},
	questionBtnText2: {width:innerWidth-110,},
	questionBtnText3: {width:innerWidth-50,color:'#b8b8b8'},
	qnaBest: {alignItems:'center',justifyContent:'center',width:45,height:18,backgroundColor:'#D1913C',borderRadius:20,},
	qnaBestText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:15,color:'#fff',},
	qnaChkIcon: {},

	notData: {marginTop:50},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,color:'#666'},

	boxShadow: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
		elevation: 8,
	},

	ingBox: {flexDirection:'row',borderBottomWidth:1,borderColor:'#DBDBDB',marginBottom:10,},
	input2: {width:innerWidth-40,height:40,backgroundColor:'#fff',fontFamily:Font.NotoSansMedium,fontSize:16,color:'#1e1e1e'},
	inputChg: {flexDirection:'row',alignItems:'center',width:40,height:37,},
	inputChgText: {fontFamily:Font.NotoSansRegular,fontSize:13,color:'#b8b8b8',marginLeft:3,},
	textarea2: {height:180,borderWidth:0,borderRadius:0,paddingHorizontal:0},

	guidePopContBox: {marginTop:20,},
	guidePopContBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',position:'relative',paddingBottom:20,borderBottomWidth:1,borderBottomColor:'#DBDBDB'},
	guidePopContBtn2: {borderBottomWidth:0,paddingBottom:14,},
	guidePopContBtnTitle: {flexDirection:'row',alignItems:'center',},
	guidePopContBtnText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,lineHeight:17,color:'#1e1e1e',marginLeft:2,},
	guidePopCont2: {paddingTop:10,paddingBottom:15,paddingHorizontal:15,backgroundColor:'#F9FAFB',borderRadius:5,},
	guidePopCont2Text: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e',},

	red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

	mgl0: {marginLeft:0,},
	mgr20: {marginRight:20,},
	mgt0: { marginTop: 0, },
	mgt8: { marginTop: 8, },
  mgt10: { marginTop: 10, },
	mgt20: { marginTop: 20, },
	mgt30: { marginTop: 30, },
	mgt40: { marginTop: 40, },
	mgt70: { marginTop: 70, },
	pdb0: {paddingBottom:0},
})

export default RegisterStep7