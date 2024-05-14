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

import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 20;
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

	const qnaTab = [
		{idx:1, txt:'BEST',},
		{idx:2, txt:'질문탭1'},
		{idx:3, txt:'질문탭2'},
		{idx:4, txt:'질문탭3'},
		{idx:5, txt:'질문탭4'},
		{idx:6, txt:'질문탭5'},
	]

	const qnaListData= [
		{idx:1, subject:'질문1 제목', best:true, chk:false},
		{idx:2, subject:'질문2 제목 질문2 제목 질문2 제목 질문2 제목 질문2 제목', best:true, chk:false},
		{idx:3, subject:'질문3 제목', best:false, chk:false},
		{idx:4, subject:'질문4 제목', best:false, chk:false},
		{idx:5, subject:'질문5 제목', best:false, chk:false},
		{idx:6, subject:'질문6 제목', best:false, chk:false},
		{idx:7, subject:'질문7 제목', best:false, chk:false},
		{idx:8, subject:'질문8 제목', best:false, chk:false},
		{idx:9, subject:'질문9 제목', best:false, chk:false},
		{idx:10, subject:'질문10 제목', best:false, chk:false},
		{idx:11, subject:'질문11 제목', best:false, chk:false},
		{idx:12, subject:'질문12 제목', best:false, chk:false},
		{idx:13, subject:'질문13 제목', best:false, chk:false},
	]

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

	const [guideModal, setGuideModal] = useState(false);
	const [qnaModal, setQnaModal] = useState(false);
	const [writeModal, setWriteModal] = useState(false);
	const [qnaList, setQnaList] = useState(qnaData);
	const [activeTab, setActiveTab] = useState(1);
	const [apiQnaTab, setApiQnaTab] = useState(qnaTab);
	const [apiQnaListData, setapiQnaListData] = useState(qnaListData);

	const [currQnaBox, setCurrQnaBox] = useState(0);
	const [ingIdx, setIngIdx] = useState(0);
	const [ingSubject, setIngSubject] = useState('');
	const [ingContent, setIngContent] = useState('');

	const [intro, setIntro] = useState('');
	const [nextOpen, setNextOpen] = useState(false);

	const [st1, setSt1] = useState(false);
	const [st2, setSt2] = useState(false);
	const [st3, setSt3] = useState(false);
	const [st4, setSt4] = useState(false);

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
				setQnaModal(false);
				setWriteModal(false);
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);
	
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

	const WritePopOff = () => {
		setWriteModal(false);
		setPreventBack(false);
		setIngIdx(0);
		setIngSubject('');
		setIngContent('');
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
				}

				return {...item, subject: ingSubject, content: ingContent, listIdx: ingIdx};
			}else{
				return {...item, subject: item.subject, content: item.content, listIdx: item.listIdx};
			}
		});		
		setQnaList(selectCon);

		let selectCon3 = apiQnaListData.map((item) => {
			if(chg && item.idx == offIdx){
				return {...item, chk: false};
			}else{
				if(item.idx === ingIdx){							
					return {...item, chk: true};
				}else{
					return {...item, chk: item.chk};
				}
			}
		})
		setapiQnaListData(selectCon3);

		setQnaModal(false);
		setPreventBack(false);
		WritePopOff();
	}

	const nextStep = () => {		
		const nextObj = {};

		if(intro.length < 50){
			ToastMessage('자기소개를 50자 이상 작성해 주세요.');
			return false;
		}

		if(!nextOpen){
			ToastMessage('1~3번째 질문 작성을 완성해 주세요.');
			return false;
		}
		
		nextObj.qnaList = qnaList;
		nextObj.intro = intro;
		nextObj.qnaListData = apiQnaListData;
		console.log(nextObj);
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
								<AutoHeightImage 
									width={5}
									source={require("../../assets/image/icon_arr2.png")}
								/>
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
									<Text style={styles.alertText}>최소 50자 이상 입력해 주세요.</Text>
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
												<AutoHeightImage width={12} source={require("../../assets/image/icon_close3.png")} />							
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
														<Text style={styles.qnaAfterSubject}>{item.subject}/{item.listIdx}</Text>
														<Text style={styles.qnaAfterContent}>{item.content}</Text>
													</View>
												) : (
													<View style={styles.qnaBefore}>
														<AutoHeightImage width={24} source={require("../../assets/image/icon_plus4.png")} />							
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
								<AutoHeightImage width={10} source={require("../../assets/image/icon_plus5.png")} />	
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
        onRequestClose={() => {setGuideModal(false)}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.header}>						
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {setGuideModal(false)}}						
					>
						<AutoHeightImage width={16} source={require("../../assets/image/icon_close2.png")} />
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View style={styles.cmWrap}>
						<View style={styles.cmTitleBox}>
							<Text style={styles.cmTitleText}>자기소개 가이드를</Text>
							<Text style={[styles.cmTitleText, styles.mgt8]}>참고해보세요!</Text>
						</View>
						
						<View style={styles.mgt20}>
							<View style={styles.guidePopContBox}>
								<TouchableOpacity
									style={[styles.guidePopContBtn, st1 ? styles.guidePopContBtn2 : null]}
									activeOpacity={opacityVal}
									onPress={()=>{setSt1(!st1)}}
								>
									<View style={styles.guidePopContBtnTitle}>
										<AutoHeightImage width={14} source={require('../../assets/image/ic1.png')} />
										<Text style={styles.guidePopContBtnText}>피지컬 강조형</Text>
									</View>
									{st1 ? (
										<AutoHeightImage width={10} source={require('../../assets/image/icon_arr4.png')} style={styles.guidePopContArr} />
									) : (
										<AutoHeightImage width={10} source={require('../../assets/image/icon_arr3.png')} style={styles.guidePopContArr} />
									)}
								</TouchableOpacity>
								{st1 ? (
								<View style={styles.guidePopCont2}>
									<Text style={styles.guidePopCont2Text}>관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.</Text>
								</View>
								) : null}
							</View>

							<View style={styles.guidePopContBox}>
								<TouchableOpacity
									style={[styles.guidePopContBtn, st2 ? styles.guidePopContBtn2 : null]}
									activeOpacity={opacityVal}
									onPress={()=>{setSt2(!st2)}}
								>
									<View style={styles.guidePopContBtnTitle}>
										<AutoHeightImage width={14} source={require('../../assets/image/ic2.png')} />
										<Text style={styles.guidePopContBtnText}>취미 강조형</Text>
									</View>
									{st2 ? (
										<AutoHeightImage width={10} source={require('../../assets/image/icon_arr4.png')} style={styles.guidePopContArr} />
									) : (
										<AutoHeightImage width={10} source={require('../../assets/image/icon_arr3.png')} style={styles.guidePopContArr} />
									)}
								</TouchableOpacity>
								{st2 ? (
								<View style={styles.guidePopCont2}>
									<Text style={styles.guidePopCont2Text}>관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.</Text>
								</View>
								) : null}
							</View>

							<View style={styles.guidePopContBox}>
								<TouchableOpacity
									style={[styles.guidePopContBtn, st3 ? styles.guidePopContBtn2 : null]}
									activeOpacity={opacityVal}
									onPress={()=>{setSt3(!st3)}}
								>
									<View style={styles.guidePopContBtnTitle}>
										<AutoHeightImage width={14} source={require('../../assets/image/ic3.png')} />
										<Text style={styles.guidePopContBtnText}>자기소개 가이드 제목</Text>
									</View>
									{st3 ? (
										<AutoHeightImage width={10} source={require('../../assets/image/icon_arr4.png')} style={styles.guidePopContArr} />
									) : (
										<AutoHeightImage width={10} source={require('../../assets/image/icon_arr3.png')} style={styles.guidePopContArr} />
									)}
								</TouchableOpacity>
								{st3 ? (
								<View style={styles.guidePopCont2}>
									<Text style={styles.guidePopCont2Text}>관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.</Text>
								</View>
								) : null}
							</View>

							<View style={styles.guidePopContBox}>
								<TouchableOpacity
									style={[styles.guidePopContBtn, st4 ? styles.guidePopContBtn2 : null]}
									activeOpacity={opacityVal}
									onPress={()=>{setSt4(!st4)}}
								>
									<View style={styles.guidePopContBtnTitle}>
										<AutoHeightImage width={14} source={require('../../assets/image/ic4.png')} />
										<Text style={styles.guidePopContBtnText}>자기소개 가이드 제목</Text>
									</View>
									{st4 ? (
										<AutoHeightImage width={10} source={require('../../assets/image/icon_arr4.png')} style={styles.guidePopContArr} />
									) : (
										<AutoHeightImage width={10} source={require('../../assets/image/icon_arr3.png')} style={styles.guidePopContArr} />
									)}
								</TouchableOpacity>
								{st4 ? (
								<View style={styles.guidePopCont2}>
									<Text style={styles.guidePopCont2Text}>관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.관리자가 작성한 예시글이 보여집니다.</Text>
								</View>
								) : null}
							</View>
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
							<AutoHeightImage width={8} source={require("../../assets/image/icon_header_back.png")} />
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
											, activeTab == item.idx ? styles.qnaTabBtnOn : null
											, index == 0 ? styles.mgl0 : null
											, index+1 == qnaTab.length ? styles.mgr20 : null
										]}
										activeOpacity={opacityVal}
										onPress={() => {
											setActiveTab(item.idx);
											console.log('각 탭에 맞는 리스트 뽑아야 함');
										}}
									>
										<Text style={[styles.qnaTabBtnText, activeTab == item.idx ? styles.qnaTabBtnTextOn : null]}>{item.txt}</Text>
									</TouchableOpacity>
								)
							})}
						</ScrollView>
					</View>
					
					<ScrollView>
						<View style={[styles.cmWrap, styles.cmWrap2]}>
							<View style={styles.questionBox}>
								{apiQnaListData.map((item, index) => {
									return (
										<TouchableOpacity
											key={item.idx}
											style={[
												styles.questionBtn
												, styles.boxShadow
												, index == 0 ? styles.mgt0 : null
												, item.best || item.chk ? styles.questionBest : null
											]}
											activeOpacity={item.chk ? 1 : opacityVal}
											onPress={() => {												
												item.chk ? null : setIngIdx(item.idx);
												item.chk ? null : setIngSubject(item.subject);
												item.chk ? null : setWriteModal(true);
												item.chk ? null : setPreventBack(true);
											}}
										>
											<Text style={[
												styles.questionBtnText
												, item.best ? styles.questionBtnText2 : null
												, item.chk ? styles.questionBtnText3 : null
											]}>
												{item.subject}
											</Text>
											{item.best && !item.chk ? (<View style={styles.qnaBest}><Text style={styles.qnaBestText}>BEST</Text></View>) : null}
											{item.chk ? (
												<AutoHeightImage 
													width={18} 
													source={require("../../assets/image/icon_chk4.png")} 
													style={styles.qnaChkIcon}
												/>
											) : null}
										</TouchableOpacity>
									)
								})}
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
							onPress={WritePopOff}
						>
							<AutoHeightImage width={16} source={require("../../assets/image/icon_close2.png")} />
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
									onPress={WritePopOff}
								>
									<AutoHeightImage width={12} source={require("../../assets/image/icon_pen.png")} />
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
								placeholder="답변을 입력해 주세요."
								placeholderTextColor="#DBDBDB"
								multiline={true}
								returnKyeType='done'
								maxLength={300}
							/>
							<View style={styles.help_box}>
								<Text style={styles.alertText}>최소 5자 이상 입력해 주세요.</Text>
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

	input: {},
	textarea: {width:innerWidth,minHeight:180,paddingVertical:0,paddingHorizontal:15,borderWidth:1,borderColor:'#EDEDED',borderRadius:5,textAlignVertical:'top',fontFamily:Font.NotoSansRegular,fontSize:14,},
  
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
	input2: {width:innerWidth-40,paddingVertical:4,backgroundColor:'#fff',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:20},
	inputChg: {flexDirection:'row',alignItems:'center',width:40,height:37,backgroundColor:'#fff'},
	inputChgText: {fontFamily:Font.NotoSansRegular,fontSize:13,color:'#b8b8b8',marginLeft:3,},
	textarea2: {height:180,borderWidth:0,borderRadius:0,paddingHorizontal:0},

	guidePopContBox: {marginTop:20,},
	guidePopContBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',position:'relative',paddingBottom:20,borderBottomWidth:1,borderBottomColor:'#DBDBDB'},
	guidePopContBtn2: {borderBottomWidth:0,paddingBottom:14,},
	guidePopContBtnTitle: {flexDirection:'row',alignItems:'center',},
	guidePopContBtnText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,color:'#1e1e1e',marginLeft:2,},
	guidePopCont2: {paddingVertical:10,paddingHorizontal:15,backgroundColor:'#F9FAFB',borderRadius:5,},
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

export default MyIntro