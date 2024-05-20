import React, {useState, useEffect, useRef, useCallback, Component} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const MyHobby = (props) => {	
	const dep1 = [
		{idx:1, txt:'활동'},
		{idx:2, txt:'감명을 준 사람'},
		{idx:3, txt:'연예인'},
	];
	
	let dep2 = [
		[
			{dep2Idx:1, dep1Idx:1, txt:'액션'},
			{dep2Idx:2, dep1Idx:1, txt:'코미디'},
			{dep2Idx:3, dep1Idx:1, txt:'멜로'},
			{dep2Idx:4, dep1Idx:1, txt:'스릴러'},
			{dep2Idx:5, dep1Idx:1, txt:'드라마'},
		],
		[
			{dep2Idx:6, dep1Idx:2, txt:'SF'},
			{dep2Idx:7, dep1Idx:2, txt:'애니'},
			{dep2Idx:8, dep1Idx:2, txt:'예능'},
			{dep2Idx:9, dep1Idx:2, txt:'유튜브'},
		],
		[
			{dep2Idx:10, dep1Idx:3, txt:'숏폼'},
			{dep2Idx:11, dep1Idx:3, txt:'디즈니'},
			{dep2Idx:12, dep1Idx:3, txt:'마블'},
		]
	]

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [loading, setLoading] = useState(false);
	const [depth1List, setDepth1List] = useState(dep1); //카테고리 리스트
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
		}

		Keyboard.dismiss();
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

	const arySet = (currRoomIdx, dep2Idx, dep1Idx, txt) => {
		let ary = [];
		if(keywordAry.length > 0){
			for(let i=0; i<keywordAry.length; i++){
				if(keywordAry[i].dep1Idx == dep1Idx && keywordAry[i].dep2Idx == dep2Idx){
					//console.log('이미 있음 ::: ',txt);
					ToastMessage('이미 선택한 키워드입니다.');
					return false;					
				}else{										
					ary = keywordAry;
					let obj = {dep2Idx:dep2Idx, dep2Val:txt, dep1Idx:dep1Idx, dep1Val:depth1};
					ary = [...ary, obj];

					const asc = ary.sort((a,b) => {
						if((a.dep1Idx)+(a.dep2Idx) > (b.dep1Idx)+(b.dep2Idx)) return 1;
						if((a.dep1Idx)+(a.dep2Idx) < (b.dep1Idx)+(b.dep2Idx)) return -1;
						return 0;
					});

					setKeywordAry(asc);
				}
			}
		}else{
			let obj = {dep2Idx:dep2Idx, dep2Val:txt, dep1Idx:dep1Idx, dep1Val:depth1};
			ary = [...ary, obj];
			setKeywordAry(ary);
		}		
	}

	const removeKeyword = (idx1, idx2) => {
		let selectCon = [];
		keywordAry.map((item, index) => {
			if(item.dep1Idx == idx1 && item.dep2Idx == idx2){
				// console.log(item.dep2Val);
				// console.log(item.dep1Idx+' ::: '+idx1);
				// console.log(item.dep2Idx+' ::: '+idx2);
				// console.log('///////////////');
			}else{
				let obj = {dep2Idx:item.dep2Idx, dep2Val:item.dep2Val, dep1Idx:item.dep1Idx, dep1Val:item.dep1Val};
				selectCon = [...selectCon, obj];
			}
		});
		setKeywordAry(selectCon);
	}

	const addKeywordChk = () => {
		if(addKeyword == '' || addKeyword.length < 2){
			ToastMessage('2글자 이상의 키워드를 입력해 주세요.');
			return false;
		}
		
		let ary = depth2List;
		let newObj = {dep2Idx:keywordTotal+1, dep1Idx:currRoomIdx, txt:addKeyword}
		ary = [...ary, newObj];
		setDepth2List(ary);
		setKeywordTotal(keywordTotal+1);
		setAddKeyword('');
	}

	const submitKeyword = async () => {
		if(keywordAry.length < 1){
			ToastMessage('1개 이상의 키워드를 선택해 주세요.');
			return false;
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
										setCurrRoomIdx(value);										
										setDepth2List(dep2[index-1]);
									}else{
										setCurrRoomIdx('');							
										setDepth2List([]);
									}
								}}
								placeholder={{
									label: '선택해주세요.',
									inputLabel: '선택해주세요.',
									value: '',
									color: '#666',
								}}
								items={depth1List.map(item => ({
									label: item.txt,
									value: item.idx,
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
							<AutoHeightImage width={10} source={require('../../assets/image/icon_arr3.png')} style={styles.selectArr} resizeMethod='resize' />
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
										<AutoHeightImage width={11} source={require('../../assets/image/icon_plus2.png')} resizeMethod='resize' />
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
														arySet(currRoomIdx, item.dep2Idx, item.dep1Idx, item.txt);
													}}
												>
													<Text style={styles.dep2BtnText}>{item.txt}</Text>
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
									let dep2Len = keywordAry.filter((value) => value.dep1Idx == item.idx);
									if(dep2Len.length > 0){
										return (
											<View key={index} style={styles.myKeywordView}>
												<View style={styles.myKeywordViewTh}>
													<Text style={styles.myKeywordViewThText}>{item.txt}</Text>
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
																	removeKeyword(item2.dep1Idx, item2.dep2Idx);
																}}
															>
																<Text style={styles.myKeywordBtnText}>{item2.dep2Val}</Text>
																<AutoHeightImage width={10} source={require('../../assets/image/keyword_x.png')} />
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