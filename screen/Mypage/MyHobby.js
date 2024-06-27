import React, {useState, useEffect, useRef, useCallback, Component} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-community/async-storage';

import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const MyHobby = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [loading, setLoading] = useState(false);
	const [memberIdx, setMemberIdx] = useState();
	const [depth1List, setDepth1List] = useState([]); //카테고리 리스트
	const [depth2List, setDepth2List] = useState([]);
	
	const [addKeyword, setAddKeyword] = useState('');
	const [currRoomIdx, setCurrRoomIdx] = useState();
	const [depth1, setDepth1] = useState('');	
	const [keywordTotal, setKeywordTotal] = useState(12); //아직 db가 없어 임시로 12개의 데이터(1차 분류에 상관없는 모든 데이터값) 생성해서 작업하며, 추후 백엔드와 협업을 통해 변경해야 함
	const [keywordAry, setKeywordAry] = useState([]);	

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
				setMemberIdx(result);
			});
		}

		Keyboard.dismiss();
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

	useEffect(() => {
		if(memberIdx){
			getMyHobby();
		}
	}, [memberIdx])

	const getMyHobby = async () => {	
		let sData = {      
      basePath: "/api/member/index.php",
			type: "GetMyHobby",
			member_idx: memberIdx,
		}
		const response = await APIs.send(sData);		
		if(response.code == 200){
			setDepth1List(response.category);

			if(response.data.length > 0){
				let newAry = [];
				response.data.map((item, index) => {
					const exp = item.hk_names.split('|');
					for(let j=0; j<exp.length; j++){
						let newObj = {dep2Val:'', dep2Val:exp[j], dep1Idx:item.hc_idx, dep1Val:item.hc_name};
						newAry = [...newAry, newObj];
					}
					//
				});
				//console.log(newAry);
				setKeywordAry(newAry);
			}
		}
	}

	const GetHobbyList = async (idx) => {
		setCurrRoomIdx(idx);

		let sData = {      
      basePath: "/api/member/index.php",
			type: "GetHobbyList",
			hc_idx: idx,
		}
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){			
			setDepth2List(response.data);
		}
	}

	const arySet = (dep1Idx, txt) => {
		let ary = [];
		let state = true;
		if(keywordAry.length > 0){
			for(let i=0; i<keywordAry.length; i++){
				//console.log(keywordAry[i]);
				if(keywordAry[i].dep1Idx == dep1Idx && keywordAry[i].dep2Val == txt){					
					state = false;
					ToastMessage('이미 선택한 키워드입니다.');					
					return false;
				}															
			}

			if(state){
				ary = keywordAry;
				let obj = {dep2Val:txt, dep1Idx:dep1Idx, dep1Val:depth1};
				ary = [...ary, obj];

				const asc = ary.sort((a,b) => {
					if((a.dep1Idx) > (b.dep1Idx)) return 1;
					if((a.dep1Idx) < (b.dep1Idx)) return -1;
					return 0;
				});

				setKeywordAry(asc);
			}
		}else{
			let obj = {dep2Val:txt, dep1Idx:dep1Idx, dep1Val:depth1};
			ary = [...ary, obj];
			setKeywordAry(ary);
		}
	}

	const removeKeyword = (idx1, val) => {
		let selectCon = [];
		keywordAry.map((item, index) => {
			if(item.dep1Idx == idx1 && item.dep2Val == val){
				// console.log(item.dep2Val);
				// console.log(item.dep1Idx+' ::: '+idx1);
				// console.log('///////////////');
			}else{
				let obj = {dep2Val:item.dep2Val, dep1Idx:item.dep1Idx, dep1Val:item.dep1Val};
				selectCon = [...selectCon, obj];
			}
		});
		setKeywordAry(selectCon);
	}

	const addKeywordChk = async () => {
		let nextStep = false;
		if(addKeyword == '' || addKeyword.length < 2){
			ToastMessage('2글자 이상의 키워드를 입력해 주세요.');
			return false;
		}

		let sData = {      
      basePath: "/api/etc/index.php",
			type: "SetFilter",
			txt: addKeyword,
		}
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			nextStep = true;
		}

		if(nextStep){
			arySet(depth1, addKeyword);
			setAddKeyword('');
		}else{
			ToastMessage('사용할 수 없는 키워드입니다.');
			return false;
		}
	}

	const submitKeyword = async () => {
		if(keywordAry.length < 1){
			ToastMessage('1개 이상의 키워드를 선택해 주세요.');
			return false;
		}
		
		let submitAry = [];
		let key_idx = 0;
		keywordAry.map((item, index) => {
			let objList = {};
			if(key_idx != item.dep1Idx){
				const result = keywordAry.filter((value) => value.dep1Idx == item.dep1Idx);
				let names = "";
				result.map((item2, index2) => {
					if(names != ""){ names += "|"; }
					names += item2.dep2Val;
				});								
				key_idx = item.dep1Idx;
				objList = {hc_idx:key_idx, hk_names:names}
				submitAry = [...submitAry, objList]
			}
		});
		
		setLoading(true);
		let sData = {      
      basePath: "/api/member/index.php",
			type: "SetMyHobby",
			member_idx: memberIdx,
			hobby_data: submitAry,
		}
		//console.log(sData);
		const response = await APIs.send(sData);		
		setLoading(false);
		if(response.code == 200){
			navigation.navigate('ProfieModify');
		}
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'취미·관심사'} />

			<ScrollView>
				<View style={styles.cmWrap}>
					<View style={styles.cmWrapTitleBox}>
						<Text style={styles.cmWrapTitleText}>취미·관심사 키워드</Text>
					</View>
					<View style={styles.cmWrapDescBox}>
						<Text style={styles.cmWrapDescText}>나의 연애 및 결혼관이 입력되어야</Text>
						<Text style={styles.cmWrapDescText}>상대방의 연애 및 결혼관을 열 수 있어요.</Text>
					</View>
					<View style={styles.mgt50}>
						<View style={styles.selectView}>
							<RNPickerSelect
								value={depth1}
								onValueChange={(value, index) => {
									setDepth1(value);
									if(value){
										GetHobbyList(value);										
									}else{
										setCurrRoomIdx('');							
										setDepth2List([]);
									}
								}}
								placeholder={{}}
								items={depth1List.map(item => ({
									label: item.hc_name,
									value: item.hc_idx,
								 }))}
								fixAndroidTouchableBug={true}
								useNativeAndroidPickerStyle={false}
								multiline={false}
								style={{
									placeholder: {fontFamily:Font.NotoSansRegular,color: '#666'},
									inputAndroid: styles.select,
									inputAndroidContainer: styles.selectCont,
									inputIOS: styles.select,
									inputIOSContainer: styles.selectCont,
								}}
							/>
							<View style={styles.selectArr}>
								<ImgDomain fileWidth={10} fileName={'icon_arr3.png'}/>
							</View>
						</View>

						{depth1 != '' ? (
							<>
								<View style={[styles.inputFlex, styles.mgt25]}>
									<TextInput
										value={addKeyword}
										maxLength={30}                            
										onChangeText={(v) => {
											setAddKeyword(v);
										}}
										placeholder={'키워드를 입력해 주세요'}
										placeholderTextColor="#DBDBDB"
										textAlignVertical='center'
										style={[styles.input]}
										returnKyeType='done'								
									/>
									<TouchableOpacity
										style={styles.inputBtn}
										activeOpacity={opacityVal}
										onPress={()=>addKeywordChk()}
									>
										<ImgDomain fileWidth={11} fileName={'icon_plus2.png'}/>
										<Text style={styles.inputBtnText}>추가</Text>
									</TouchableOpacity>
								</View>

								<View style={styles.dep2List}>
									{depth2List.length > 0 ? (
										<>
										{depth2List.map((item, index) => {
											return (
												<TouchableOpacity
													key={index}
													style={styles.dep2Btn}
													activeOpacity={opacityVal}
													onPress={()=>{
														arySet(depth1, item.hk_name);
													}}
												>
													<Text style={styles.dep2BtnText}>{item.hk_name}</Text>
												</TouchableOpacity>
											)
										})}
										</>
									) : null}
								</View>
							</>
						) : null}

						{keywordAry.length > 0 ? (
						<View style={styles.mykeywordBox}>
							<View style={styles.mykeywordTitle}>
								<Text style={styles.mykeywordTitleText}>나의 키워드</Text>
							</View>
							<View style={styles.myKeyword}>
								{depth1List.map((item, index) => {									
									let dep2Len = keywordAry.filter((value) => value.dep1Idx == item.hc_idx);
									if(dep2Len.length > 0){
										return (
											<View key={index} style={styles.myKeywordView}>
												<View style={styles.myKeywordViewTh}>
													<Text style={styles.myKeywordViewThText}>{item.hc_name}</Text>
												</View>
												<ScrollView
													horizontal={true}
													showsHorizontalScrollIndicator = {false}
												>
													{dep2Len.map((item2, index2) => {
														return (
															<TouchableOpacity
																key={index2}
																style={styles.myKeywordBtn}
																activeOpacity={opacityVal}
																onPress={()=>{
																	removeKeyword(item2.dep1Idx, item2.dep2Val);
																}}
															>
																<Text style={styles.myKeywordBtnText}>{item2.dep2Val}</Text>
																<ImgDomain fileWidth={10} fileName={'keyword_x.png'}/>
															</TouchableOpacity>
														)
													})}
												</ScrollView>
											</View>
										)
									}
								})}
							</View>
						</View>
						) : null}
					</View>
				</View>
			</ScrollView>
			
			{depth1 != '' ? (
			<View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn, keywordAry.length > 0 ? null : styles.nextBtnOff]}
					activeOpacity={opacityVal}
					onPress={() => submitKeyword()}
				>
					<Text style={styles.nextBtnText}>저장하기</Text>
				</TouchableOpacity>
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
	cmWrapTitleBox: {position:'relative'},
	cmWrapTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmWrapTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmWrapDescBox: {marginTop:8,},
  cmWrapDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},
	
	valueTitle: {marginBottom:15,},
  valueTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:18,lineHeight:21,color:'#1e1e1e'},
  valueQuestion: {},
  valueQuestionText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
  valueQuestionDesc: {marginTop:4,},
  valueQuestionDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#666'},
  valueAnswer: {marginTop:15,},
  valueAnswerBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#fff',marginTop:12,},
  valueAnswerBtnText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#666'},
  valueAnswerBtnTextOn: {fontFamily:Font.NotoSansMedium,color:'#D1913C'},

	nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },

	selectView: {position:'relative',justifyContent:'center'},
	select: {width:innerWidth,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,paddingLeft:15,paddingRight:40,fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
	selectCont: {},
	selectArr: {position:'absolute',right:20,},
	inputFlex: {flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#EDEDED'},
	input: {width:innerWidth-44,height:36,paddingTop:0,paddingBottom:0,fontFamily:Font.NotoSansRegular,fontSize:16,lineHeight:19,color:'#1e1e1e'},
	inputBtn: {flexDirection:'row',alignItems:'center',width:44,height:36,position:'relative',top:-2},
	inputBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#DBDBDB',marginLeft:5,},

	dep2List: {flexDirection:'row',flexWrap:'wrap',marginTop:12,},
	dep2Btn: {alignItems:'center',justifyContent:'center',height:33,paddingHorizontal:14,marginTop:8,marginRight:8,borderWidth:1,borderColor:'#EDEDED',borderRadius:50,},
	dep2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#1e1e1e'},

	mykeywordBox: {marginTop:40,},
	mykeywordTitle: {},
	mykeywordTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:18,color:'#1e1e1e'},
	myKeyword: {marginTop:15,},
	myKeywordView: {flexDirection:'row',paddingVertical:15,borderBottomWidth:1,borderBottomColor:'#EDEDED'},
	myKeywordViewTh: {marginRight:20,},
	myKeywordViewThText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:27,color:'#1e1e1e'},
	myKeywordViewTd: {flexDirection:'row',flexWrap:'wrap'},
	myKeywordBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',height:27,paddingHorizontal:12,backgroundColor:'#EDF2FE',borderRadius:50,marginRight:8,},
	myKeywordBtnText: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:25,marginRight:5},

	lineView: {height:6,backgroundColor:'#F2F4F6'},
	pdt0: {paddingTop:0},
  pdt10: {paddingTop:10},
  pdt15: {paddingTop:15},
  pdt20: {paddingTop:20},
  pdt30: {paddingTop:30},
  pdt40: {paddingTop:40},
  pdb0: {paddingBottom:0},
  pdb10: {paddingBottom:10},
  pdb20: {paddingBottom:20},
  pdb30: {paddingBottom:30},
  pdb40: {paddingBottom:40},
	mgt0: {marginTop:0},
	mgt5: {marginTop:5},
	mgt10: {marginTop:10},
  mgt15: {marginTop:15},
	mgt20: {marginTop:20},
	mgt25: {marginTop:25},
	mgt30: {marginTop:30},
	mgt40: {marginTop:40},
	mgt50: {marginTop:50},
	mgb10: {marginBottom:10},
	mgb20: {marginBottom:20},
	mgr0: {marginRight:0},
  mgr10: {marginRight:10},
  mgr15: {marginRight:15},
	mgl0: {marginLeft:0},
  mgl4: {marginLeft:4},
  mgl10: {marginLeft:10},
  mgl15: {marginLeft:15},
})

export default MyHobby