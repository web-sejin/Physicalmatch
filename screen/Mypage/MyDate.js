import React, {useState, useEffect, useRef, useCallback, Component} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage';

import APIs from "../../assets/APIs";
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

const MyDate = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);
	const [keyboardStatus, setKeyboardStatus] = useState(0);	
	const [memberIdx, setMemberIdx] = useState();
	const [questionList, setQuestionList] = useState([]);
	const [questionTotal, setQuestionTotal] = useState();
	const [currCnt, setCurrCnt] = useState(0);

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
			getQuestion();
		}
	}, [memberIdx])

	const getQuestion = async () => {
		let sData = {      
      basePath: "/api/member/index.php",
			type: "GetQuestion",
			member_idx: memberIdx,
		}
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			setQuestionList(response.data);
			setQuestionTotal(response.qCount);

			let chkCnt = 0;
			response.data.map((item, index) => {
				item.data.map((item2, index2) => {			
					for(let i=0; i<item2.answer.length; i++){
						if(item2.answer[i].is_chk == 'y'){
							chkCnt = chkCnt+1;		
							break;
						}						
					}					
				});
			})
			setCurrCnt(chkCnt);
		}
	}

	const updateQuestion = async (is_multi, la_idx, is_chk, idx, idx2, idx3) => {				
		let updateAry = [...questionList];
		let addState = true;
		let chgCnt = currCnt;

		//console.log('is_multi ::: ', is_multi);		
		
		if(is_multi == 'n'){
			updateAry[idx].data[idx2].answer.map((item, index) => {
				if(la_idx != item.la_idx){
					if(updateAry[idx].data[idx2].answer[index].is_chk == 'y'){
						if(chgCnt <= 1){
							chgCnt = 0;
						}else{
							chgCnt = chgCnt-1;
						}
					}
					updateAry[idx].data[idx2].answer[index].is_chk = 'n';					
				}
			})
		}else if(is_multi == 'y'){
			for(let i=0; i<updateAry[idx].data[idx2].answer.length; i++){				
				if(la_idx != updateAry[idx].data[idx2].answer[i].la_idx){
					if(updateAry[idx].data[idx2].answer[i].is_chk == 'y'){
						addState = false;
						break;
					}
				}
			}
		}

		if(is_chk == 'y'){
			updateAry[idx].data[idx2].answer[idx3].is_chk = 'n';
			if(addState){
				if(chgCnt <= 1){
					chgCnt = 0;
				}else{
					chgCnt = chgCnt-1;
				}		
			}
		}else{
			updateAry[idx].data[idx2].answer[idx3].is_chk = 'y';
			//console.log('addState :::: ',addState);
			if(addState){				
				chgCnt = chgCnt+1;				
			}
		}

		setCurrCnt(chgCnt);
		setQuestionList(updateAry);
	}

	const saveQuestion = async () => {
		if(currCnt != questionTotal){
			ToastMessage('모든 질문에 답변을 선택해 주세요.');
			return false;
		}

		let submitAry = [];
		questionList.map((item, index) => {
			item.data.map((item2, index2) => {				
				let laIdx = '';
				item2.answer.map((item3, index3) => {
					if(item3.is_chk == 'y'){
						if(laIdx != ''){ laIdx += '|'; }
						laIdx += item3.la_idx;
					}
				});

				if(laIdx != ''){
					const questionObject = {lq_idx:item2.question.lq_idx, la_idx:laIdx};
					submitAry = [...submitAry, questionObject];
				}
			})
		});

		setLoading(true);
		let sData = {      
      basePath: "/api/member/index.php",
			type: "SetQuestion",
			member_idx: memberIdx,
			question_data: submitAry,
		}

		const response = await APIs.send(sData);
		//console.log(response);
		setLoading(false);
		if(response.code == 200){
			navigation.navigate('ProfieModify', {reload:true});
		}
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'연애 및 결혼관'} />

			<ScrollView>
				<View style={styles.cmWrap}>
					<View style={styles.cmWrapTitleBox}>
						<Text style={styles.cmWrapTitleText}>연애 및 결혼관</Text>
					</View>
					<View style={styles.cmWrapDescBox}>
						<Text style={styles.cmWrapDescText}>나의 연애 및 결혼관이 입력되어야</Text>
						<Text style={styles.cmWrapDescText}>상대방의 연애 및 결혼관을 열 수 있어요.</Text>
					</View>
					{questionList.map((item, index) => {						
						return (
							<View key={index} style={[index == 0 ? styles.mgt40 : styles.mgt50]}>
								<View>
									<View style={styles.valueTitle}>
										<Text style={styles.valueTitleText}>{item.title}</Text>
									</View>
									{item.data.map((item2, index2) => {
										return (
											<View key={index2} style={[index2 != 0 ? styles.mgt30 : null]}>
												<View style={styles.valueQuestion}>
												 {item2.question.is_multi == 'y' ? (
													<Text style={styles.valueQuestionText}>													
														<Text style={styles.roboto}>Q{index2+1}.</Text> {item2.question.lq_content} (다중선택)
													</Text>
													) : (
														<Text style={styles.valueQuestionText}>
															<Text style={styles.roboto}>Q{index2+1}.</Text> {item2.question.lq_content}																											
														</Text>
													)}
												</View>   
												<View style={styles.valueAnswer}>
													{item2.answer.map((item3, index3) => {
														return (
															<TouchableOpacity
																key={index3}
																style={[styles.valueAnswerBtn, styles.boxShadow3, index3 == 0 ? styles.mgt0 : null, item3.is_chk == 'y' ? styles.boxShadow4 : null]}
																activeOpacity={opacityVal}
																onPress={() => {
																	updateQuestion(item2.question.is_multi, item3.la_idx, item3.is_chk, index, index2, index3);																	
																}}
															>
																<Text style={[styles.valueAnswerBtnText, item3.is_chk == 'y' ? styles.valueAnswerBtnTextOn : null]}>{item3.la_content}</Text>
															</TouchableOpacity>
														)
													})}													
												</View>  
											</View>
										)
									})}								              									              
								</View>
							</View>
						)
					})}
				</View>
			</ScrollView>

			<View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn, currCnt === questionTotal ? null : styles.nextBtnOff]}
					activeOpacity={opacityVal}
					onPress={() => saveQuestion()}
				>
					{/* <Text style={styles.nextBtnText}>저장하기 {currCnt}/{questionTotal}</Text> */}
					<Text style={styles.nextBtnText}>저장하기</Text>
				</TouchableOpacity>
			</View>

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
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

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
  valueAnswerBtn: {alignItems:'center',justifyContent:'center',minHeight:48,backgroundColor:'#fff',marginTop:12,padding:5,},
  valueAnswerBtnText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#666'},
  valueAnswerBtnTextOn: {fontFamily:Font.NotoSansMedium,color:'#D1913C'},

	nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 21, color: '#fff' },
		
	boxShadow3: {    
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.4,
		elevation: 3,
	},
	boxShadow4: {borderWidth:1,borderColor:'rgba(209,145,60,0.3)',shadowColor: "#D1913C",shadowOpacity: 0.25,shadowRadius: 4.65,elevation: 6,},
	
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

export default MyDate