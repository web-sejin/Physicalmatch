import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import APIs from "../../assets/APIs";
import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 20;
const paddTop = Platform.OS === 'ios' ? 0 : 15;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;

const MyIntro = (props) => {
	const qnaData = [
		{key:1, subject:'', content:'', listIdx:''},
		{key:2, subject:'', content:'', listIdx:''},
		{key:3, subject:'', content:'', listIdx:''},
	]

	const {navigation, userInfo, route} = props;
  const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [currFocus, setCurrFocus] = useState('');
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);
	const [memberIdx, setMemberIdx] = useState();

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
	const [notfirst, setNotFirst] = useState(false);
	const [notfirstIdx, setNotFirstIdx] = useState();

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

			AsyncStorage.getItem('member_idx', (err, result) => {		
				//console.log('member_idx :::: ', result);		
				setMemberIdx(result);
			});
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
			//console.log('writeModal ::: ',writeModalRef.current);
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
		subjectRef.current = ingSubject;
	}, [ingSubject]);

	useEffect(() => {
		//console.log('qnaListChk ::: ',qnaListChk);
	}, [qnaListChk]);

	useEffect(() => {
		if(memberIdx){
			getMemInfo();
		}
	}, [memberIdx]);
	
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

	const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyProfile",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			if(response.data.info.member_intro){ 
				setIntro(response.data.info.member_intro); 
			}

			let selectCon = response.data.interview.map((item, index) => {
				return {...item, key:index+1, subject: item.mi_subject, content: item.mi_content, listIdx: item.mi_idx};
			});			
			setQnaList(selectCon);

			let selectCon2 = qnaListChk;
			response.data.interview.map((item, index) => {
				selectCon2 = [...selectCon2, item.mi_subject];
			})
			setQnaListChk(selectCon2);
		}
	}

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
				let qnaList = {key : item.key, subject : item.subject, content : item.content, listIdx: item.listIdx, mi_subject : item.subject, mi_content : item.content};
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

		if(/\S/.test(ingContent) == false){
      ToastMessage('질문에 대한 답변을 빈 여백으로만 작성할 수 없습니다.');
      Keyboard.dismiss();
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
					let selectCon2 = [];
					qnaListChk.map((item2, index2) => {
						if(item.subject != item2){
							let ary2 = item2;
							selectCon2 = [...selectCon2, ary2];
						}
					});					
					selectCon2 = [...new Set(selectCon2)];
					//console.log('qnaSuccess :::: ', selectCon2);
					setQnaListChk(selectCon2);
				}

				return {...item, subject: ingSubject, content: ingContent, listIdx: ingIdx, mi_subject: ingSubject, mi_content: ingContent,};
			}else{
				return {...item, subject: item.subject, content: item.content, listIdx: item.listIdx, mi_subject: item.subject, mi_content: item.content,};
			}
		});		
		setQnaList(selectCon);

		setQnaModal(false);
		setPreventBack(false);
		WritePopOff();
	}

	const nextStep = async () => {		
		const nextObj = {
			basePath: "/api/member/",
			type: "SetIntroduce",
			member_idx: memberIdx,
		};

		if(intro.length < 50){
			ToastMessage('자기소개를 50자 이상 작성해 주세요.');
			return false;
		}

		if(/\S/.test(intro) == false){
      ToastMessage('자기소개를 빈 여백으로만 작성할 수 없습니다.');
      Keyboard.dismiss();
      return false;
    }

		if(!nextOpen){
			ToastMessage('1~3번째 질문 작성을 완성해 주세요.');
			return false;
		}
				
		nextObj.member_intro = intro;

		let qnaListAry = [];
		qnaList.map((item2, index2) => {
			qnaListAry = [...qnaListAry, {mi_content: item2.mi_content, mi_subject: item2.mi_subject}];
		})		

		nextObj.member_interview = qnaListAry;
		//console.log(nextObj);
		//return false;
		const response = await APIs.send(nextObj);		
		if(response.code == 200){
			ToastMessage('내 소개가 수정되었습니다.');

			const formData = new FormData();
			formData.append('type', 'GetMyInfo');
			formData.append('member_idx', memberIdx);
			//const mem_info = await member_info(formData);

			setTimeout(function(){
				navigation.navigate('ProfieModify', {reload:true});
			}, 500);
		}
	}

	const listAryChk = (idx) => {		
		let ary = qnaListChk;

		const result = ary.filter((v) => v == idx);
		if(result.length > 0){
			//console.log('1');
		}else{
			ary.push(idx);			
		}
		//console.log('listAryChk :::: ', ary);
		setQnaListChk(ary);
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'내 소개'} />

			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<>				
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
									//console.log(item);
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
													if(item.subject != ''){
														setNotFirst(true);
													}
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
												key={index}
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
					</TouchableWithoutFeedback>
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
	cmWrap2: {paddingTop:0,paddingBottom:40,paddingHorizontal:20},
	cmWrap3: {paddingTop:20,},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},	

	input: {color:'#1e1e1e'},
	textarea: {width:innerWidth,minHeight:180,paddingVertical:0,paddingHorizontal:15,borderWidth:1,borderColor:'#EDEDED',borderRadius:5,textAlignVertical:'top',fontFamily:Font.NotoSansRegular,fontSize:14,color: '#1e1e1e',paddingTop:paddTop,},
  
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
	addBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#243B55',marginLeft:5,},

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

	ingBox: {flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:'#DBDBDB',marginBottom:10,},
	input2: {width:innerWidth-40,paddingVertical:4,backgroundColor:'#fff',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:20,color:'#1e1e1e'},
	inputChg: {flexDirection:'row',alignItems:'center',width:40,height:37,backgroundColor:'#fff'},
	inputChgText: {fontFamily:Font.NotoSansRegular,fontSize:13,color:'#b8b8b8',marginLeft:3,},
	textarea2: {height:180,borderWidth:0,borderRadius:0,paddingHorizontal:0,color:'#1e1e1e'},

	guidePopContBox: {marginTop:20,},
	guidePopContBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',position:'relative',paddingBottom:20,borderBottomWidth:1,borderBottomColor:'#DBDBDB'},
	guidePopContBtn2: {borderBottomWidth:0,paddingBottom:14,},
	guidePopContBtnTitle: {flexDirection:'row',alignItems:'center',},
	guidePopContBtnText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,color:'#1e1e1e',marginLeft:2,},
	guidePopCont2: {paddingTop:10,paddingBottom:15,paddingHorizontal:15,backgroundColor:'#F9FAFB',borderRadius:5,},
	guidePopCont2Text: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e',},

	notData: {marginTop:50},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,color:'#666'},

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

export default MyIntro