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
import Postcode from '@actbase/react-daum-postcode';
import WheelPicker from 'react-native-wheely';
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 20;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;

const classList = [
	{ val: 1, txt: '대학교' },
	{ val: 2, txt: '해외대' },
	{ val: 3, txt: '전문대' },
	{ val: 4, txt: '고등학교' },
	{ val: 5, txt: '중학교' },
]

const classList2 = [
	{ val: 1, txt: '졸업' },
	{ val: 2, txt: '재학중' },
	{ val: 3, txt: '중퇴' },
]

const phyList = [
	{ val: 1, txt: '팔다리가 긴', chk:false },
	{ val: 2, txt: '비율이 좋은', chk:false },
	{ val: 3, txt: '성난 팔뚝', chk:false },
	{ val: 4, txt: '튼튼한 하체', chk:false },
	{ val: 5, txt: '소두', chk:false },
	{ val: 6, txt: '체형 종류1', chk:false },
	{ val: 7, txt: '체형 종류2', chk:false },
	{ val: 8, txt: '체형 종류3', chk:false },
	{ val: 9, txt: '체형 종류4', chk:false },
	{ val: 10, txt: '체형 종류5', chk:false },
	{ val: 11, txt: '체형 종류6', chk:false },
	{ val: 12, txt: '체형 종류7', chk:false },
	{ val: 13, txt: '체형 종류8', chk:false },
	{ val: 14, txt: '체형 종류9', chk:false },
]

const sprotList = [
	{ val: 1, txt: '헬스' },
	{ val: 2, txt: '필라테스' },
	{ val: 3, txt: '클라이밍' },
	{ val: 4, txt: '댄스' },
	{ val: 5, txt: '수영' },
	{ val: 6, txt: '등산' },
	{ val: 7, txt: '골프' },
	{ val: 8, txt: '축구' },
	{ val: 9, txt: '복싱' },
	{ val: 10, txt: '테니스' },
	{ val: 11, txt: '요가' },
]

const drinkList = [
	{ val: 1, txt: '마시지 않음' },
	{ val: 2, txt: '어쩔 수 없을 때만' },
	{ val: 3, txt: '가끔 마심' },
	{ val: 4, txt: '어느정도 즐김' },
	{ val: 5, txt: '좋아하는 편' },
	{ val: 6, txt: '매우 즐기는 편' },
]

const smokeList = [
	{ val: 1, txt: '비흡연' },
	{ val: 2, txt: '금연 중' },
	{ val: 3, txt: '가끔 피움' },
	{ val: 4, txt: '흡연 중' },
]

const smokeSortList = [
	{ val: 1, txt: '연초' },
	{ val: 2, txt: '권련형 전자담배' },
	{ val: 3, txt: '액상형 전자담배' },
]

const relList = [
	{ val: 1, txt: '무교' },
	{ val: 2, txt: '기독교' },
	{ val: 3, txt: '천주교' },
	{ val: 4, txt: '불교' },
	{ val: 5, txt: '기타' },
]

const exeData = [
	{ key : 1, period : '주', day : 4, sort : '헬스' },
	{ key : 2, period : '주', day : 3, sort : '필라테스' },
	{ key : 3, period : '월', day : 20, sort : '수영' },
]

const RegisterStep5 = ({navigation, route}) => {	
	const prvChk4 = route['params']['prvChk4'];
  const accessRoute = route['params']['accessRoute'];
  const mb_id = route['params']['mb_id'];
	const mb_pw = route['params']['mb_pw'];

	const scrollViewRef = useRef();
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [currFocus, setCurrFocus] = useState('');
	const [preventBack, setPreventBack] = useState(false);
	const [step, setStep] = useState(1);
	const [heightList, setHeightList] = useState([]);
	const [weightList, setWeightList] = useState([]);
	const [muscleList, setMuscleList] = useState([]);
	const [fatList, setFatList] = useState([]);
	const [exeList, setExeList] = useState([]);

	const [popNick, setPopNick] = useState(false);
	const [popGender, setPopGender] = useState(false);
	const [popLocal, setPopLocal] = useState(false);
	const [popLocal2, setPopLocal2] = useState(false);
	const [localType, setLocalType] = useState(0);
	const [popClass, setPopClass] = useState(false);
	const [popJob, setPopJob] = useState(false);
	const [popPhysical2, setPopPhysical2] = useState(false);
	const [popExe, setPopExe] = useState(false);
	const [popPhysical, setPopPhysical] = useState(false);
	const [popDrink, setPopDrink] = useState(false);
	const [popMbti, setPopMbti] = useState(false);
	const [popRel, setPopRel] = useState(false);

	const [nickBtn, setNickBtn] = useState(false);
	const [locBtn, setLocBtn] = useState(false);
	const [jobBtn, setJobBtn] = useState(false);
	const [exeBtn, setExeBtn] = useState(false);
	const [phyBtn, setPhyBtn] = useState(false);
	const [mbtiBtn, setMbtiBtn] = useState(false);

	const [nick, setNick] = useState('');
	const [realNick, setRealNick] = useState('');
	const [realGender, setRealGender] = useState(0);
	const [realClass, setRealClass] = useState('');
	const [realClass2, setRealClass2] = useState('');
	const [job, setJob] = useState('');
	const [job1, setJob1] = useState('');
	const [job2, setJob2] = useState('');
	const [realJob, setRealJob] = useState('');
	const [jobDetail, setJobDetail] = useState('');
	const [realJobDetail, setRealJobDetail] = useState('');
	const [phyAry, setPhyAry] = useState(phyList);
	const [phyAryCnt, setPhyAryCnt] = useState(0);
	const [realPhyAry, setRealPhyAry] = useState([]);
	const [realPhyAryCnt, setRealPhyAryCnt] = useState(0);
	const [realDrink, setRealDrink] = useState('');
	const [realSmoke, setRealSmoke] = useState('');
	const [realSmokeSort, setRealSmokeSort] = useState('');
	const [realRel, setRealRel] = useState('');
	const [mbtiRes1, setMbtiRes1] = useState('');
	const [mbtiRes2, setMbtiRes2] = useState('');
	const [mbtiRes3, setMbtiRes3] = useState('');
	const [mbtiRes4, setMbtiRes4] = useState('');
	const [mbti1, setMbti1] = useState('');
	const [mbti2, setMbti2] = useState('');
	const [mbti3, setMbti3] = useState('');
	const [mbti4, setMbti4] = useState('');
	const [mbti5, setMbti5] = useState('');
	const [mbti6, setMbti6] = useState('');
	const [mbti7, setMbti7] = useState('');
	const [mbti8, setMbti8] = useState('');
	const [mbti1_2, setMbti1_2] = useState('');
	const [mbti2_2, setMbti2_2] = useState('');
	const [mbti3_2, setMbti3_2] = useState('');
	const [mbti4_2, setMbti4_2] = useState('');
	const [mbti5_2, setMbti5_2] = useState('');
	const [mbti6_2, setMbti6_2] = useState('');
	const [mbti7_2, setMbti7_2] = useState('');
	const [mbti8_2, setMbti8_2] = useState('');
	const [realMbti1, setRealMbti1] = useState('');
	const [realMbti2, setRealMbti2] = useState('');
	const [realMbti3, setRealMbti3] = useState('');
	const [realMbti4, setRealMbti4] = useState('');
	const [local1, setLocal1] = useState('');
	const [local2, setLocal2] = useState('');
	const [realLocal1, setRealLocal1] = useState('');
	const [realLocal2, setRealLocal2] = useState('');
	const [height, setHeight] = useState('170cm');
	const [weight, setWeight] = useState('60kg');
	const [muscle, setMuscle] = useState('25kg');
	const [fat, setFat] = useState('15%');
	const [noWeight, setNoWeight] = useState(false);
	const [noMuscle, setNoMuscle] = useState(false);
	const [noFat, setNoFat] = useState(false);
	const [realHeight, setRealHeight] = useState('');
	const [realWeight, setRealWeight] = useState('');
	const [realMuscle, setRealMuscle] = useState('');
	const [realNoWeight, setRealNoWeight] = useState(false);
	const [realNoMuscle, setRealNoMuscle] = useState(false);
	const [realNoFat, setRealNoFat] = useState(false);
	const [realFat, setRealFat] = useState('');
	const [exeAddSt, setExeAddSt] = useState(false);
	const [exePeri, setExePeri] = useState('');
	const [exeDay, setExeDay] = useState('0');
	const [exeSport, setExeSport] = useState('');
	const [exeRest, setExeRest] = useState(false);	
	const [realRest, setRealRest] = useState(false);
	const [realExeList, setRealExeList] = useState([]);
	const [nextOpen, setNextOpen] = useState(false);
	const [outerScrollEnabled, setOuterScrollEnabled] = useState(true)

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

			if(route['params']['mb_nick']){ setRealNick(route['params']['mb_nick']);}
			if(route['params']['mb_gender']){ setRealGender(route['params']['mb_gender']);}
			if(route['params']['mb_local1']){ setRealLocal1(route['params']['mb_local1']);}
			if(route['params']['mb_local2']){ setRealLocal2(route['params']['mb_local2']);}
			if(route['params']['mb_class1']){ setRealClass(route['params']['mb_class1']);}
			if(route['params']['mb_class2']){ setRealClass2(route['params']['mb_class2']);}
			if(route['params']['mb_job']){ setRealJob(route['params']['mb_job']);}
			if(route['params']['mb_jobDetail']){ setRealJobDetail(route['params']['mb_jobDetail']);}
			if(route['params']['mb_height']){ setRealHeight(route['params']['mb_height']);}
			if(route['params']['mb_weight']){ setRealWeight(route['params']['mb_weight']);}
			if(route['params']['mb_muscle']){ setRealMuscle(route['params']['mb_muscle']);}
			if(route['params']['mb_fat']){ setRealFat(route['params']['mb_fat']);}
			if(route['params']['mb_no_weight']){ setRealNoWeight(route['params']['mb_no_weight']);}
			if(route['params']['mb_no_muscle']){ setRealNoMuscle(route['params']['mb_no_muscle']);}
			if(route['params']['mb_no_fat']){ setRealNoFat(route['params']['mb_no_fat']);}
			if(route['params']['mb_rest']){ setRealRest(route['params']['mb_rest']);}
			if(route['params']['mb_exercise']){ setRealExeList(route['params']['mb_exercise']);}
			if(route['params']['mb_physicalType']){ setRealPhyAry(route['params']['mb_physicalType']);}
			if(route['params']['mb_drink']){ setRealDrink(route['params']['mb_drink']);}
			if(route['params']['mb_smoke']){ setRealSmoke(route['params']['mb_smoke']);}
			if(route['params']['mb_smokeSort']){ setRealSmokeSort(route['params']['mb_smokeSort']);}
			if(route['params']['mb_mbit1']){ setRealMbti1(route['params']['mb_mbit1']);}
			if(route['params']['mb_mbit2']){ setRealMbti2(route['params']['mb_mbit2']);}
			if(route['params']['mb_mbit3']){ setRealMbti3(route['params']['mb_mbit3']);}
			if(route['params']['mb_mbit4']){ setRealMbti4(route['params']['mb_mbit4']);}
			if(route['params']['mb_religion']){ setRealRel(route['params']['mb_religion']);}
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
				setPopNick(false);
				setPopGender(false);
				setPopLocal(false);
				setPopLocal2(false);
				setPopClass(false);
				setPopJob(false);
				setPopPhysical2(false);
				setPopExe(false);
				setPopPhysical(false);
				setPopDrink(false);
				setPopMbti(false);
				setPopRel(false);
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

	useEffect(() => {
		let ary = [];
		for(let i=140; i<=216; i++){
			ary.push(i+'cm');
		}	
		setHeightList(ary);

		let ary2 = [];
		for(let i=30; i<=120; i++){
			ary2.push(i+'kg');
		}	
		setWeightList(ary2);

		let ary3 = [];
		let ary4 = [];
		for(let i=0; i<=100; i++){
			ary3.push(i+'kg');
			ary4.push(i+'%');
		}	
		setMuscleList(ary3);
		setFatList(ary4);
	}, []);

	useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardStatus(true);
			if(Platform.OS != 'ios'){
				if(currFocus == 'nick'){
					setKeyboardHeight((e.endCoordinates.height/2)*-1);
				}else if(currFocus == 'job1'){
					setKeyboardHeight(0);
				}else if(currFocus == 'job2'){
					setKeyboardHeight((e.endCoordinates.height)*-1);
				}else{
					setKeyboardHeight(0);
				}
				//console.log('currFocus ::: ',currFocus);
			}
			//console.log(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
			if(Platform.OS != 'ios'){
				setKeyboardHeight(0);
			}
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [currFocus]);

	useEffect(() => {
		chkTotalVal();
	}, [realNick, realGender, realLocal1, realLocal2, realJob, realJobDetail, realHeight, realWeight, realMuscle, realFat, realRest, realExeList, realPhyAryCnt, realRel, realMbti1, realMbti2, realMbti3, realMbti4]);

	useEffect(() => {		
		if(realClass != "" && realClass2 != ""){
			setPopClass(false);
			setPreventBack(false);
		}
		chkTotalVal();
	}, [realClass, realClass2]);  

	useEffect(() => {
		if(realDrink != '' && realSmoke != ''){
			if(realSmoke == '비흡연'){
				setPopDrink(false);
				setPreventBack(false);
			}else{
				if(realSmokeSort != ''){
					setPopDrink(false);
					setPreventBack(false);
				}
			}
		}
		chkTotalVal();
	}, [realDrink, realSmoke, realSmokeSort])

	useEffect(() => {
		if(mbti1 != ''){
			setMbtiRes1(mbti1);
			if(mbti2 != ''){				
				if(mbti1 == mbti2){
					if(mbti1 == 'E'){
						setMbtiRes1(mbti1+'(I)');
					}else{
						setMbtiRes1(mbti1+'(E)');
					}					
				}else{
					setMbtiRes1(mbti1+'('+mbti2+')');
				}
			}else{
				setMbtiRes1(mbti1);
			}
		}

		if(mbti3 != ''){
			setMbtiRes2(mbti3);
			if(mbti4 != ''){				
				if(mbti3 == mbti4){
					if(mbti3 == 'S'){
						setMbtiRes2(mbti3+'(N)');
					}else{
						setMbtiRes2(mbti3+'(S)');
					}					
				}else{
					setMbtiRes2(mbti3+'('+mbti4+')');
				}
			}else{
				setMbtiRes2(mbti3);
			}
		}

		if(mbti5 != ''){
			setMbtiRes3(mbti5);
			if(mbti6 != ''){				
				if(mbti5 == mbti6){
					if(mbti5 == 'T'){
						setMbtiRes3(mbti5+'(F)');
					}else{
						setMbtiRes3(mbti5+'(T)');
					}					
				}else{
					setMbtiRes3(mbti5+'('+mbti6+')');
				}
			}else{
				setMbtiRes3(mbti5);
			}
		}

		if(mbti7 != ''){
			setMbtiRes4(mbti7);
			if(mbti8 != ''){				
				if(mbti7 == mbti8){
					if(mbti7 == 'J'){
						setMbtiRes4(mbti7+'(P)');
					}else{
						setMbtiRes4(mbti7+'(J)');
					}					
				}else{
					setMbtiRes4(mbti7+'('+mbti8+')');
				}
			}else{
				setMbtiRes4(mbti7);
			}
		}

		if(mbti1 != '' && mbti3 != '' && mbti5 != '' && mbti7 != ''){
			setMbtiBtn(true);
		}else{
			setMbtiBtn(false);
		}
	}, [mbti1,mbti2,mbti3,mbti4,mbti5,mbti6,mbti7,mbti8])

	useEffect(() => {
		if(phyAryCnt >= 2 && phyAryCnt <= 5){
			setPhyBtn(true);
		}else{
			setPhyBtn(false);
		}
	}, [phyAryCnt]);

	useEffect(() => {
		if(exeRest){
			setExeBtn(true);
		}else{
			setExeBtn(false);
		}
	}, [exeRest]);

	useEffect(() => {
		if(exeList.length > 0 || (exePeri != '' && exeDay != '0' && exeSport != '')){
			setExeBtn(true);
		}else{
			setExeBtn(false);
		}
	}, [exePeri, exeDay, exeSport, exeList]);

	const chkTotalVal = () => {
		if(realNick && realGender && realLocal1 && realJob && realHeight && (realRest || realExeList.length > 0) && realPhyAryCnt > 0 && realRel && realClass && realClass2 && realDrink && realSmoke && realMbti1 && realMbti2 && realMbti3 && realMbti4){
			setNextOpen(true);
		}else{
			setNextOpen(false);
		}
	}

	const physical_ary = (v) => {
		let add_state = true;
		
		let selectCon = phyAry.map((item) => {
			if(item.val === v){							
				if(item.chk){			
					setPhyAryCnt(phyAryCnt-1);
					return {...item, chk: false};
				}else{
					if(phyAryCnt >= 5){
						add_state = false;
					}else{
						setPhyAryCnt(phyAryCnt+1);
						return {...item, chk: true};
					}
				}
			}else{
				return {...item, chk: item.chk};
			}
		});

		if(add_state){
			setPhyAry(selectCon);			
		}else{
			ToastMessage('최대 5개까지만 선택이 가능합니다.');
			return false;
		}
	}

	const removeSport = (v) => {	
    let selectCon = [];
		exeList.map((item, index) => {
			if(item.key != v){
				let exeAddList = {key : item.key, period : item.period, day : item.day, sort : item.sort};
				selectCon = [...selectCon, exeAddList];
			}
		});

		let selectCon2 = selectCon.map((item, index) => {
			return {...item, key: index+1};
		});

		setExeList(selectCon2);
	}

	const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
      <ScaleDecorator>
        <View style={[styles.exeSortCont]}>
					<TouchableOpacity
						style={styles.exeSortContBtn1}
						activeOpacity={opacityVal}
						onPress={() => {
							removeSport(item.key);
						}}
					>
						<AutoHeightImage
							width={22}
							source={require("../../assets/image/icon_minus1.png")}
						/>									
					</TouchableOpacity>
					<View style={styles.exeSortContBox}>
						<Text style={[styles.exeSortContBoxText, styles.exeSortContBoxText1]}>{item.period} {item.day}일</Text>
						<Text style={[styles.exeSortContBoxText, styles.exeSortContBoxText2]}>{item.sort}</Text>
					</View>
					<TouchableOpacity
						style={styles.exeSortContBtn2}
						activeOpacity={opacityVal}		
						onLongPress={drag}							
					>
						<AutoHeightImage
							width={18}
							source={require("../../assets/image/icon_chg.png")}
						/>									
					</TouchableOpacity>
				</View>
      </ScaleDecorator>
    );
  };
											
	const periCount = (v) => {
		if(exePeri == ''){
			ToastMessage('주기를 먼저 선택해 주세요.');
			return false;
		}
		const dayInt = exeDay*1;
		let maxDay = 0;
		if(exePeri == '주'){
			maxDay = 7;
		}else{
			maxDay = 30;
		}

		if(v == 'minus'){
			if(dayInt < 1){
				setExeDay('0');
			}else{
				setExeDay((dayInt-1).toString());
			}
		}else if(v == 'plus'){			
			if(dayInt >= maxDay){
				setExeDay(maxDay.toString());
			}else{
				setExeDay((dayInt+1).toString());
			}			
		}
	}

	const checkPopVal = (v) => {
		if(v == 'nick'){
			if(nick == ''){
				ToastMessage('닉네임을 입력해 주세요.');
				return false;
			}

			const spe = nick.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
			if(spe >= 0){
				ToastMessage('닉네임은 한글, 숫자, 영문만 사용 가능합니다.');
				return false;
			}

			if(nick.length < 2 || nick.length > 8){
				ToastMessage('닉네임은 2~8자리 입력이 가능합니다.');
				return false;
			}

			setPopNick(false);
			setRealNick(nick);
			setPreventBack(false);
		}else if(v == 'local'){
			if(local1 == ''){
				ToastMessage('주 활동 지역을 입력해 주세요.');
				return false;
			}

			setPopLocal(false);
			setRealLocal1(local1);
			if(local2 != ''){
				setRealLocal2(local2);
			}
			setPreventBack(false);

		}else if(v == 'job'){
			if(job == ''){
				ToastMessage('직업을 입력 또는 선택해 주세요.');
				return false;
			}

			setPopJob(false);
			setRealJob(job);
			setRealJobDetail(jobDetail);
			setPreventBack(false);

		}else if(v == 'physical'){
			if(phyAryCnt < 2 || phyAryCnt > 5){
				ToastMessage('체형은 2개 이상 5개 이하로 선택해 주세요.');
				return false;
			}
			
			setRealPhyAry(phyAry);
			setRealPhyAryCnt(phyAryCnt);
			setPopPhysical(false);
			setPreventBack(false);
		}else if(v == 'mbti'){
			if(mbtiRes1 == '' || mbtiRes2 == '' || mbtiRes3 == '' || mbtiRes4 == ''){
				ToastMessage('MBTI를 완성해 주세요.');
				return false;
			}

			setPopMbti(false);
			setRealMbti1(mbtiRes1);
			setRealMbti2(mbtiRes2);
			setRealMbti3(mbtiRes3);
			setRealMbti4(mbtiRes4);
			setMbti1_2(mbti1);
			setMbti2_2(mbti2);
			setMbti3_2(mbti3);
			setMbti4_2(mbti4);
			setMbti5_2(mbti5);
			setMbti6_2(mbti6);
			setMbti7_2(mbti7);
			setMbti8_2(mbti8);
			setPreventBack(false);
		}else if(v == 'physical2'){

			setRealHeight(height);
			setRealWeight(weight);
			setRealMuscle(muscle);
			setRealFat(fat);
			setRealNoWeight(noWeight);
			setRealNoMuscle(noMuscle);
			setRealNoFat(noFat);
			setPopPhysical2(false);
			setPreventBack(false);
		}else if(v == 'exe'){

			if(exeList.length < 1 && !exeRest && !exeAddSt){
				ToastMessage('운동을 쉬고 있어요에 체크하거나 운동을 추가해 주세요.');
				return false;
			}else if(exeRest){
				setRealRest(true);
				setPopExe(false);
				setPreventBack(false);
			}else if(exeAddSt){		
				if(exePeri == ''){
					ToastMessage('주기를 선택해 주세요.');
					return false;
				}

				if(exeDay == '0'){
					ToastMessage('0일 이상의 수를 입력해 주세요.');
					return false;
				}

				if(exeSport == ''){
					ToastMessage('종목을 선택해 주세요.');
					return false;
				}
				
				const keyOd = (exeList.length)+1;
				let exeAddList = {key : keyOd, period : exePeri, day : exeDay, sort : exeSport};
				let exeAddList2 = [...exeList, exeAddList];					
				setExeList(exeAddList2);							
			}
			
			if(!exeAddSt){
				setRealExeList(exeList);
				setPopExe(false);
				setPreventBack(false);
			}

			setExeAddSt(false);
			setExePeri('');
			setExeDay('0');
			setExeSport('');
		}
	}	

	const nextStep = () => {
		if(realNick == ''){ ToastMessage('닉네임을 입력해 주세요.'); return false; }
		if(realGender == ''){ ToastMessage('성별을 선택해 주세요.'); return false; }
		if(realLocal1 == ''){ ToastMessage('주 활동 지역을 입력해 주세요.'); return false; }
		if(realClass == '' || realClass2 == ''){ ToastMessage('최종 학력을 선택해 주세요.'); return false; }
		if(realJob == ''){ ToastMessage('직업을 압력 또는 선택해 주세요.'); return false; }
		if(realHeight == ''){ ToastMessage('피지컬(키)을 선택해 주세요.'); return false; }
		if(!realRest && realExeList.length < 1){ ToastMessage('운동을 선택해 주세요.'); return false; }
		if(realPhyAryCnt < 1){ ToastMessage('체형을 2~5개를 선택해 주세요.'); return false; }
		if(realDrink == '' || realSmoke == ''){ ToastMessage('음주 · 흡연을 선택해 주세요.'); return false; }
		if(realMbti1 == '' || realMbti2 == '' || realMbti3 == '' || realMbti4 == ''){
			ToastMessage('MBTI를 선택해 주세요.'); return false;
		}
		if(realRel == ''){ ToastMessage('종교를 선택해 주세요.'); return false; }

		const nextObj = {
			prvChk4:prvChk4,
			accessRoute:accessRoute,
			mb_id:mb_id,
			mb_pw:mb_pw,
			mb_nick:realNick,
			mb_gender:realGender,
			mb_local1:realLocal1,
			mb_local2:realLocal2,
			mb_class1:realClass,
			mb_class2:realClass2,
			mb_job:realJob,
			mb_jobDetail:realJobDetail,
			mb_height:realHeight,
			mb_weight:realWeight,
			mb_muscle:realMuscle,
			mb_fat:realFat,
			mb_no_weight:realNoWeight,
			mb_no_muscle:realNoMuscle,
			mb_no_fat:realFat,
			mb_rest:realRest,
			mb_exercise:realExeList,
			mb_physicalType:realPhyAry,
			mb_drink:realDrink,
			mb_smoke:realSmoke,
			mb_smokeSort:realSmokeSort,
			mb_mbit1:realMbti1,
			mb_mbit2:realMbti2,
			mb_mbit3:realMbti3,
			mb_mbit4:realMbti4,
			mb_religion:realRel
		}

		if(route['params']['file1']){ nextObj.file1 = route['params']['file1']; }
		if(route['params']['file2']){ nextObj.file2 = route['params']['file2']; }
		if(route['params']['file3']){ nextObj.file3 = route['params']['file3']; }
		if(route['params']['file4']){ nextObj.file4 = route['params']['file4']; }
		if(route['params']['file5']){ nextObj.file5 = route['params']['file5']; }
		if(route['params']['file6']){ nextObj.file6 = route['params']['file6']; }
		if(route['params']['qnaList']){ nextObj.qnaList = route['params']['qnaList']; }
		if(route['params']['intro']){ nextObj.intro = route['params']['intro']; }
		if(route['params']['qnaListData']){ nextObj.qnaListData = route['params']['qnaListData']; }
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

		navigation.navigate('RegisterStep6', nextObj);
	}

	const chkNick = (v) => {
		const spe = v.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
		if(spe >= 0 || v.length < 2 || v.length > 8){
			setNickBtn(false);
		}else{
			setNickBtn(true);
		}
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'회원가입'} />

			<View style={styles.regiStateBarBox}>
				<View style={styles.regiStateBar}>
					<View style={[styles.regiStateCircel, step >= 1 ? styles.regiStateCircelOn : null]}>
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText, step >= 1 ? styles.regiStateTexOn : null]}>기본 정보</Text>
					</View>
					<View style={[styles.regiStateCircel, step >= 2 ? styles.regiStateCircelOn : null]}>
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText, step >= 2 ? styles.regiStateTexOn : null]}>프로필 등록</Text>
					</View>
					<View style={[styles.regiStateCircel, step >= 3 ? styles.regiStateCircelOn : null]}>
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText, step >= 3 ? styles.regiStateTexOn : null]}>소개글</Text>
					</View>
					<View style={[styles.regiStateCircel, step >= 4 ? styles.regiStateCircelOn : null]}>
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText, step >= 4 ? styles.regiStateTexOn : null]}>인증</Text>
					</View>
				</View>
			</View>

			<ScrollView>		
				<View style={styles.regiStepList}>
					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopNick(true);
							setNick(realNick);
							setPreventBack(true);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							<AutoHeightImage
								width={24}
								source={require("../../assets/image/icon1.png")}
								style={styles.introArr}
							/>
							<Text style={styles.regiStep5BtnLeftText}>닉네임</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realNick}</Text>
							<AutoHeightImage
								width={20}
								source={require("../../assets/image/icon_arr1.png")}
								style={styles.introArr}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopGender(true);
							setPreventBack(true);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							<AutoHeightImage
								width={24}
								source={require("../../assets/image/icon2.png")}
								style={styles.introArr}
							/>
							<Text style={styles.regiStep5BtnLeftText}>성별</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							{realGender == 0 ? null : (
								realGender == 1 ? (
									<Text style={styles.regiStep5BtnRightText}>남자</Text>
								) : (
									<Text style={styles.regiStep5BtnRightText}>여자</Text>
								)
							)}
							<AutoHeightImage
								width={20}
								source={require("../../assets/image/icon_arr1.png")}
								style={styles.introArr}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopLocal(true);
							setPreventBack(true);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							<AutoHeightImage
								width={24}
								source={require("../../assets/image/icon3.png")}
								style={styles.introArr}
							/>
							<Text style={styles.regiStep5BtnLeftText}>지역</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realLocal1}</Text>
							<AutoHeightImage
								width={20}
								source={require("../../assets/image/icon_arr1.png")}
								style={styles.introArr}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopClass(true);
							setPreventBack(true);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							<AutoHeightImage
								width={24}
								source={require("../../assets/image/icon4.png")}
								style={styles.introArr}
							/>
							<Text style={styles.regiStep5BtnLeftText}>최종학력</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realClass} {realClass2}</Text>
							<AutoHeightImage
								width={20}
								source={require("../../assets/image/icon_arr1.png")}
								style={styles.introArr}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopJob(true);
							setPreventBack(true);

							if(realJob) setJob(realJob)
							if(realJobDetail) setJobDetail(realJobDetail)
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							<AutoHeightImage
								width={24}
								source={require("../../assets/image/icon5.png")}
								style={styles.introArr}
							/>
							<Text style={styles.regiStep5BtnLeftText}>직업</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realJob}</Text>
							<AutoHeightImage
								width={20}
								source={require("../../assets/image/icon_arr1.png")}
								style={styles.introArr}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {														
							if(realHeight != '') setHeight(realHeight); 
							if(realWeight != '') setWeight(realWeight); 
							if(realMuscle != '') setMuscle(realMuscle); 
							if(realFat != '') setFat(realFat); 
							setNoWeight(realNoWeight);
							setNoMuscle(realNoMuscle);
							setNoFat(realNoFat);

							setPopPhysical2(true);
							setPreventBack(true);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							<AutoHeightImage
								width={24}
								source={require("../../assets/image/icon6.png")}
								style={styles.introArr}
							/>
							<Text style={styles.regiStep5BtnLeftText}>피지컬</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							{realHeight ? (
							<Text style={styles.regiStep5BtnRightText}>{realHeight}</Text>
							) : null}
							<AutoHeightImage
								width={20}
								source={require("../../assets/image/icon_arr1.png")}
								style={styles.introArr}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							if(realExeList.length > 0){
								setExeList(realExeList);
							}

							setPopExe(true);
							setPreventBack(true);							
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							<AutoHeightImage
								width={24}
								source={require("../../assets/image/icon7.png")}
								style={styles.introArr}
							/>
							<Text style={styles.regiStep5BtnLeftText}>운동</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							{exeRest ? (
							<Text style={styles.regiStep5BtnRightText}>쉬고 있어요</Text>
							) : null}

							{realExeList.length > 0 ? (
							<Text style={styles.regiStep5BtnRightText}>{realExeList.length}가지</Text>
							) : null}
							<AutoHeightImage
								width={20}
								source={require("../../assets/image/icon_arr1.png")}
								style={styles.introArr}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {							
							if(realPhyAry.length > 0){
								setPhyAry(realPhyAry);
							}
							setPopPhysical(true);
							setPreventBack(true);							
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							<AutoHeightImage
								width={24}
								source={require("../../assets/image/icon8.png")}
								style={styles.introArr}
							/>
							<Text style={styles.regiStep5BtnLeftText}>체형</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realPhyAryCnt}가지 선택</Text>
							<AutoHeightImage
								width={20}
								source={require("../../assets/image/icon_arr1.png")}
								style={styles.introArr}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopDrink(true);
							setPreventBack(true);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							<AutoHeightImage
								width={24}
								source={require("../../assets/image/icon9.png")}
								style={styles.introArr}
							/>
							<Text style={styles.regiStep5BtnLeftText}>음주 · 흡연</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							{realDrink != '' && realSmoke != '' ? (
							<Text style={styles.regiStep5BtnRightText}>입력완료</Text>	
							) : null}
							<AutoHeightImage
								width={20}
								source={require("../../assets/image/icon_arr1.png")}
								style={styles.introArr}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopMbti(true);
							setPreventBack(true);

							if(mbti1_2){setMbti1(mbti1_2)}
							if(mbti2_2){setMbti2(mbti2_2)}
							if(mbti3_2){setMbti3(mbti3_2)}
							if(mbti4_2){setMbti4(mbti4_2)}
							if(mbti5_2){setMbti5(mbti5_2)}
							if(mbti6_2){setMbti6(mbti6_2)}
							if(mbti7_2){setMbti7(mbti7_2)}
							if(mbti8_2){setMbti8(mbti8_2)}
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							<AutoHeightImage
								width={24}
								source={require("../../assets/image/icon10.png")}							
							/>
							<Text style={styles.regiStep5BtnLeftText}>MBTI</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realMbti1}{realMbti2}{realMbti3}{realMbti4}</Text>
							<AutoHeightImage
								width={20}
								source={require("../../assets/image/icon_arr1.png")}							
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopRel(true);
							setPreventBack(true);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							<AutoHeightImage
								width={24}
								source={require("../../assets/image/icon11.png")}
								style={styles.introArr}
							/>
							<Text style={styles.regiStep5BtnLeftText}>종교</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realRel}</Text>
							<AutoHeightImage
								width={20}
								source={require("../../assets/image/icon_arr1.png")}
								style={styles.introArr}
							/>
						</View>
					</TouchableOpacity>
				</View>		
			</ScrollView>

      <View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn, nextOpen ? null : styles.nextBtnOff]}
					activeOpacity={opacityVal}
					onPress={() => nextStep()}
				>
					<Text style={styles.nextBtnText}>다음</Text>
				</TouchableOpacity>
			</View>
						
			{/* 닉네임 */}
			{popNick ? (
			<View style={styles.cmPop}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
					}}
				>
				</TouchableOpacity>
				<KeyboardAvoidingView
					keyboardVerticalOffset={0}
					behavior={behavior}
				>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={{...styles.prvPop, top:keyboardHeight}}>
							<TouchableOpacity
								style={styles.pop_x}					
								onPress={() => {
									setPopNick(false);
									setPreventBack(false);
								}}
							>
								<AutoHeightImage
									width={18}
									source={require("../../assets/image/popup_x.png")}
								/>
							</TouchableOpacity>		
							<View style={styles.popTitle}>
								<Text style={styles.popTitleText}>닉네임을 입력해 주세요</Text>
								<Text style={styles.popTitleDesc}>프로필 작성 후 변경이 불가합니다.</Text>
							</View>
							<View style={[styles.popIptBox]}>									
								<TextInput
									value={nick}
									onChangeText={(v) => {
										setNick(v);
										chkNick(v);
									}}
									onFocus={()=>{
										setCurrFocus('nick');
									}}
									placeholder={'한글, 숫자, 영문만 사용 가능 / 2~8자'}
									placeholderTextColor="#DBDBDB"
									style={[styles.input]}
									returnKyeType='done'
								/>
								<Text style={styles.alertText}>* 이미 존재하는 닉네임입니다.</Text>
							</View>															
							<View style={styles.popBtnBox}>
								<TouchableOpacity 
									style={[styles.popBtn, nickBtn ? null : styles.nextBtnOff]}
									activeOpacity={opacityVal}
									onPress={() => {checkPopVal('nick')}}
								>
									<Text style={styles.popBtnText}>저장하기</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</View>
			) : null}

			{/*성별*/}
			{popGender ? (
			<View style={styles.cmPop}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
						setPopGender(false);
					}}
				>
				</TouchableOpacity>
				<View style={styles.prvPop}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setPopGender(false);
							setPreventBack(false);
						}}
					>
						<AutoHeightImage
							width={18}
							source={require("../../assets/image/popup_x.png")}
						/>
					</TouchableOpacity>			
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>성별을 선택해 주세요</Text>
					</View>
					<ScrollView>
						<View style={styles.popRadioBox}>
							<TouchableOpacity
								style={[styles.popRadioBoxBtn, realGender == 1 ? styles.popRadioBoxBtnOn : null]}
								activeOpacity={opacityVal}
								onPress={()=>{
									setPopGender(false);
									setRealGender(1);
									setPreventBack(false);
								}}
							>
								<Text style={[styles.popRadioBoxBtnText, realGender == 1 ? styles.popRadioBoxBtnTextOn : null]}>남자</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.popRadioBoxBtn,  realGender == 2 ? styles.popRadioBoxBtnOn : null]}
								activeOpacity={opacityVal}
								onPress={()=>{
									setPopGender(false);
									setRealGender(2);
									setPreventBack(false);
								}}
							>
								<Text style={[styles.popRadioBoxBtnText, realGender == 2 ? styles.popRadioBoxBtnTextOn : null]}>여자</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			</View>
			) : null}

			{/*지역*/}
			{popLocal ? (
			<View style={styles.cmPop}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
					}}
				>
				</TouchableOpacity>
				<View style={{...styles.prvPop}}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setPopLocal(false);
							setPreventBack(false);
						}}
					>
						<AutoHeightImage
							width={18}
							source={require("../../assets/image/popup_x.png")}
						/>
					</TouchableOpacity>		
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>활동 지역을 입력해 주세요</Text>
					</View>
					<View style={[styles.popIptBox]}>									
						<View style={styles.popRadioTitle}>
							<Text style={styles.popRadioTitleText}>주 활동 지역 <Text style={styles.red}>*</Text></Text>
						</View>
						<TouchableOpacity
							style={styles.localBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								setLocalType(1);
								setPopLocal2(true);
							}}
						>
							{local1 != '' ? (
								<Text style={[styles.localBtnText, styles.localBtnText2]}>{local1}</Text>
							) : (
								<Text style={styles.localBtnText}>구까지만 표시 돼요</Text>
							)}
						</TouchableOpacity>
					</View>			
					<View style={[styles.popIptBox, styles.mgt20]}>
						<View	style={styles.popRadioTitle}>
							<Text style={styles.popRadioTitleText}>부 활동 지역 <Text style={styles.gray}>[선택]</Text></Text>
						</View>
						<TouchableOpacity
							style={styles.localBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								setLocalType(2);
								setPopLocal2(true);
							}}
						>
							{local2 != '' ? (
								<Text style={[styles.localBtnText, styles.localBtnText2]}>{local2}</Text>
							) : (
								<Text style={styles.localBtnText}>주 활동 지역과 겹치면 안 적어도 돼요</Text>
							)}							
						</TouchableOpacity>
					</View>												
					<View style={styles.popBtnBox}>
						<TouchableOpacity 
							style={[styles.popBtn, locBtn ? null : styles.nextBtnOff]}
							activeOpacity={opacityVal}
							onPress={() => {checkPopVal('local')}}
						>
							<Text style={styles.popBtnText}>저장하기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			) : null}

			{popLocal2 ? (
			<View style={styles.cmPop}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
					}}
				>
				</TouchableOpacity>	
				<View style={{...styles.prvPop}}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setPopLocal2(false);
							setPreventBack(false);
						}}
					>
						<AutoHeightImage
							width={18}
							source={require("../../assets/image/popup_x.png")}
						/>
					</TouchableOpacity>
					<Postcode
						style={{ width: innerWidth-40, height: innerHeight-90, }}
						jsOptions={{ animation: true }}
						onSelected={data => {
							//console.log(JSON.stringify(data))
							const kakaoAddr = data;
							//console.log(data);				
							if(localType == 1){
								setLocal1(kakaoAddr.sido+' '+kakaoAddr.sigungu);
								setLocBtn(true);
							}else if(localType == 2){
								setLocal2(kakaoAddr.sido+' '+kakaoAddr.sigungu);
							}
							setPopLocal2(false);
						}}
					/>
				</View>
			</View>
			) : null}

			{/*학력*/}
			{popClass ? (
			<View style={[styles.cmPop]}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
						setPopClass(false);
						setPreventBack(false);
					}}
				>
				</TouchableOpacity>
				<View style={[styles.prvPop]}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setPopClass(false);
							setPreventBack(false);
						}}
					>
						<AutoHeightImage
							width={18}
							source={require("../../assets/image/popup_x.png")}
						/>
					</TouchableOpacity>			
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>최종 학력을 입력해 주세요</Text>
					</View>
					<ScrollView>
						<View style={styles.popRadioBox}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>학교</Text>
							</View>
							{classList.map((item, index)=>{
								return (
									<TouchableOpacity
										key={index}
										style={[styles.popRadioBoxBtn, realClass == item.txt ? styles.popRadioBoxBtnOn : null]}
										activeOpacity={opacityVal}
										onPress={()=>{
											setRealClass(item.txt);									
										}}
									>
										<Text style={[styles.popRadioBoxBtnText, realClass == item.txt ? styles.popRadioBoxBtnTextOn : null]}>{item.txt}</Text>
									</TouchableOpacity>
								)
							})}
						</View>
						<View style={[styles.popRadioBox, styles.mgt30]}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>학력 상태</Text>
							</View>
							<View style={styles.popRadioType2}>
								{classList2.map((item, index)=>{
									return (
										<TouchableOpacity
											key={index}
											style={[styles.popRadioBoxBtn2, realClass2 == item.txt ? styles.popRadioBoxBtn2On : null]}
											activeOpacity={opacityVal}
											onPress={()=>{												
												setRealClass2(item.txt);									
											}}
										>
											<Text style={[styles.popRadioBoxBtn2Text, realClass2 == item.txt ? styles.popRadioBoxBtn2TextOn : null]}>{item.txt}</Text>
										</TouchableOpacity>
									)
								})}
							</View>
						</View>
					</ScrollView>
				</View>
			</View>
			) : null}

			{/*직업*/}
			{popJob ? (
			<View style={styles.cmPop}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
						setPopClass(false);
						setPreventBack(false);
					}}
				></TouchableOpacity>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={{...styles.prvPop, top:keyboardHeight}}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {
								setPopJob(false);
								setPreventBack(false);
							}}
						>
							<AutoHeightImage
								width={18}
								source={require("../../assets/image/popup_x.png")}
							/>
						</TouchableOpacity>	
						<View style={[styles.popTitle, styles.popTitleJob]}>
							<Text style={styles.popTitleText}>어떤 일을 하시나요?</Text>
						</View>
						<KeyboardAwareScrollView
							keyboardVerticalOffset={0}
							behavior={behavior}
						>
							<View style={[styles.popRadioBox, styles.popTitleJob2]}>
								<View style={styles.popRadioTitle}>
									<Text style={styles.popRadioTitleText}>직업</Text>
								</View>
								<View style={[styles.popIptBox]}>									
									<TextInput
										value={job}
										onChangeText={(v) => {
											setJob(v);
											if(v.length >= 2){
												setJobBtn(true);
											}else{
												setJobBtn(false);
											}
										}}
										onFocus={()=>{
											setCurrFocus('job1');
										}}
										placeholder={'한글, 숫자, 영문만 사용 가능 / 최대 15자'}
										placeholderTextColor="#DBDBDB"
										style={[styles.input, styles.input2]}
										returnKyeType='done'
										maxLength={15}
									/>
								</View>	
							</View>

							<View style={styles.jobBoxWrap}>
								<View style={styles.jobBox}>
									<View style={styles.jobBoxTitle}>
										<Text style={styles.jobBoxTitleText}>기업·근로형태</Text>
									</View>
									<ScrollView>
										<View style={styles.jobList}>
										<TouchableOpacity
												style={[styles.jobSelect, styles.mgt0]}
												activeOpacity={opacityVal}
												onPress={(v)=>{
													setJob('대분류명1');
													setJob1('대분류명1');
													setJobBtn(true);
												}}
											>
												<Text style={styles.jobSelectText}>대분류명1</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.jobSelect}
												activeOpacity={opacityVal}
												onPress={(v)=>{
													setJob('대분류명2');
													setJob1('대분류명2');
													setJobBtn(true);
												}}
											>
												<Text style={styles.jobSelectText}>대분류명2</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.jobSelect}
												activeOpacity={opacityVal}
												onPress={(v)=>{
													setJob('대분류명3');
													setJob1('대분류명3');
													setJobBtn(true);
												}}
											>
												<Text style={styles.jobSelectText}>대분류명3</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.jobSelect}
												activeOpacity={opacityVal}
												onPress={(v)=>{
													setJob('대분류명4');
													setJob1('대분류명4');
													setJobBtn(true);
												}}
											>
												<Text style={styles.jobSelectText}>대분류명4</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.jobSelect}
												activeOpacity={opacityVal}
												onPress={(v)=>{
													setJob('대분류명5');
													setJob1('대분류명5');
													setJobBtn(true);
												}}
											>
												<Text style={styles.jobSelectText}>대분류명5</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.jobSelect}
												activeOpacity={opacityVal}
												onPress={(v)=>{
													setJob('대분류명6');
													setJob1('대분류명6');
													setJobBtn(true);
												}}
											>
												<Text style={styles.jobSelectText}>대분류명6</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.jobSelect}
												activeOpacity={opacityVal}
												onPress={(v)=>{
													setJob('대분류명7');
													setJob1('대분류명7');
													setJobBtn(true);
												}}
											>
												<Text style={styles.jobSelectText}>대분류명7</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.jobSelect}
												activeOpacity={opacityVal}
												onPress={(v)=>{
													setJob('대분류명8');
													setJob1('대분류명8');
													setJobBtn(true);
												}}
											>
												<Text style={styles.jobSelectText}>대분류명8</Text>
											</TouchableOpacity>
										</View>
									</ScrollView>
								</View>
								<View style={styles.jobBox}>
									<View style={styles.jobBoxTitle}>
										<Text style={styles.jobBoxTitleText}>직무</Text>
									</View>
									<ScrollView>
										<View style={styles.jobList}>
											<TouchableOpacity
												style={[styles.jobSelect, styles.mgt0]}
												activeOpacity={opacityVal}
												onPress={(v)=>{
													setJob(job1+' (업직종명1)');
													setJob2('업직종명1');
													setJobBtn(true);
												}}
											>
												<Text style={styles.jobSelectText}>업직종명1</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.jobSelect}
												activeOpacity={opacityVal}
												onPress={(v)=>{
													setJob(job1+' (업직종명2)');
													setJob2('업직종명2');
													setJobBtn(true);
												}}
											>
												<Text style={styles.jobSelectText}>업직종명2</Text>
											</TouchableOpacity>
										</View>
									</ScrollView>
								</View>
							</View>

							<View style={[styles.popRadioBox, styles.mgt30, styles.pdb0, styles.popTitleJob2]}>
								<View style={styles.popRadioTitle}>
									<Text style={styles.popRadioTitleText}>직업 상세 입력 <Text style={styles.span}>[선택]</Text></Text>
								</View>
								<View style={[styles.popIptBox]}>									
									<TextInput
										value={jobDetail}
										onChangeText={(v) => {
											setJobDetail(v);
										}}
										onFocus={()=>{
											setCurrFocus('job2');
										}}
										placeholder={'업직종, 직책, 직위, 부업, 근무형태 등'}
										placeholderTextColor="#DBDBDB"
										style={[styles.input, styles.input2]}
										returnKyeType='done'
									/>
								</View>	
							</View>						
						</KeyboardAwareScrollView>					
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn, jobBtn ? null : styles.nextBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => {checkPopVal('job')}}
							>
								<Text style={styles.popBtnText}>저장하기</Text>
							</TouchableOpacity>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</View>
			) : null}
			
			{/*피지컬*/}
			{popPhysical2 ? (
			<View style={[styles.cmPop]}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						setPopPhysical2(false);
						setPreventBack(false);
					}}
				>
				</TouchableOpacity>
				<View style={[styles.prvPop]}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setPopPhysical2(false);
							setPreventBack(false);
						}}
					>
						<AutoHeightImage
							width={18}
							source={require("../../assets/image/popup_x.png")}
						/>
					</TouchableOpacity>			
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>피지컬을 입력해 주세요</Text>
					</View>
					<ScrollView
						scrollEnabled={true}
					>
						<View style={styles.popRadioBox}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>키 <Text style={styles.red}>*</Text></Text>
							</View>
							{heightList.length > 0 ? (
							<View style={styles.wheelpciker}>
								<WheelPicker
									flatListProps={{ nestedScrollEnabled: true }}
									selectedIndex={height}
									options={heightList}
									itemHeight={40}
									selectedIndex={30}
									visibleRest={1}
									itemTextStyle={styles.activeStyle2}
									containerStyle={styles.activeStyle3}									
									onChange={(index) => {
										//console.log(heightList[index]);
										setHeight(heightList[index]);
									}}
								/>
							</View>
							) : null}
						</View>
						<View style={[styles.popRadioBox, styles.mgt30]}>
							<View style={[styles.popRadioTitle, styles.popRadioTitleFlex]}>
								<Text style={styles.popRadioTitleText}>몸무게</Text>
								<TouchableOpacity
									style={styles.notPickBtn}
									activeOpacity={opacityVal}
									onPress={() => {setNoWeight(!noWeight)}}
								>
									{noWeight ? (
										<AutoHeightImage
											width={20}
											source={require("../../assets/image/icon_chk3.png")}
										/>
									) : (
										<AutoHeightImage
											width={20}
											source={require("../../assets/image/icon_chk2.png")}
										/>
									)}
									<Text style={styles.notPickBtnText}>선택안함</Text>
								</TouchableOpacity>
							</View>
							{!noWeight && weightList.length > 0 ? (
							<View style={styles.wheelpciker}>
								<WheelPicker
									flatListProps={{ nestedScrollEnabled: true }}
									selectedIndex={muscle}
									options={weightList}
									itemHeight={40}
									selectedIndex={30}
									visibleRest={1}
									itemTextStyle={styles.activeStyle2}
									containerStyle={styles.activeStyle3}									
									onChange={(index) => {
										setWeight(weightList[index]);
									}}
								/>
							</View>
							) : null}
						</View>
						<View style={[styles.popRadioBox, styles.mgt30]}>
							<View style={[styles.popRadioTitle, styles.popRadioTitleFlex]}>
								<Text style={styles.popRadioTitleText}>골격근량</Text>
								<TouchableOpacity
									style={styles.notPickBtn}
									activeOpacity={opacityVal}
									onPress={() => {setNoMuscle(!noMuscle)}}
								>
									{noMuscle ? (
										<AutoHeightImage
											width={20}
											source={require("../../assets/image/icon_chk3.png")}
										/>
									) : (
										<AutoHeightImage
											width={20}
											source={require("../../assets/image/icon_chk2.png")}
										/>
									)}
									<Text style={styles.notPickBtnText}>선택안함</Text>
								</TouchableOpacity>
							</View>
							{!noMuscle && muscleList.length > 0 ? (
							<View style={styles.wheelpciker}>
								<WheelPicker
									flatListProps={{ nestedScrollEnabled: true }}
									selectedIndex={muscle}
									options={muscleList}
									itemHeight={40}
									selectedIndex={25}
									visibleRest={1}
									itemTextStyle={styles.activeStyle2}
									containerStyle={styles.activeStyle3}
									onChange={(index) => {										
										setMuscle(muscleList[index]);
									}}
								/>
							</View>
							) : null}
						</View>
						<View style={[styles.popRadioBox, styles.mgt30]}>
							<View style={[styles.popRadioTitle, styles.popRadioTitleFlex]}>
								<Text style={styles.popRadioTitleText}>체지방률</Text>
								<TouchableOpacity
									style={styles.notPickBtn}
									activeOpacity={opacityVal}
									onPress={() => {setNoFat(!noFat)}}
								>
									{noFat ? (
										<AutoHeightImage
											width={20}
											source={require("../../assets/image/icon_chk3.png")}
										/>
									) : (
										<AutoHeightImage
											width={20}
											source={require("../../assets/image/icon_chk2.png")}
										/>
									)}
									<Text style={styles.notPickBtnText}>선택안함</Text>
								</TouchableOpacity>
							</View>
							{!noFat && fatList.length > 0 ? (
							<View style={styles.wheelpciker}>
								<WheelPicker
									flatListProps={{ nestedScrollEnabled: true }}
									selectedIndex={fat}
									options={fatList}
									itemHeight={40}
									selectedIndex={15}
									visibleRest={1}
									itemTextStyle={styles.activeStyle2}
									containerStyle={styles.activeStyle3}
									onChange={(index) => {
										setFat(fatList[index]);
									}}
								/>
							</View>
							) : null}
						</View>
					</ScrollView>
					<View style={styles.popBtnBox}>
						<TouchableOpacity 
							style={[styles.popBtn]}
							activeOpacity={opacityVal}
							onPress={() => {checkPopVal('physical2')}}
						>
							<Text style={styles.popBtnText}>저장하기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			) : null}

			{/*운동*/}
			{popExe ? (
			<View style={[styles.cmPop]}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
						setPopExe(false);
						setPreventBack(false);
						setExeAddSt(false);
						setExePeri('');
						setExeDay('0');
						setExeSport('');
					}}
				>
				</TouchableOpacity>
				<View style={[styles.prvPop]}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							Keyboard.dismiss();
							setPopExe(false);
							setPreventBack(false);
							setExeAddSt(false);
							setExePeri('');
							setExeDay('0');
							setExeSport('');
						}}
					>
						<AutoHeightImage
							width={18}
							source={require("../../assets/image/popup_x.png")}
						/>
					</TouchableOpacity>			
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>어떤 운동을 하시나요?</Text>
					</View>
					<View style={styles.popRadioBox}>
						<View style={[styles.popRadioTitle, styles.popRadioTitleFlex]}>
							<Text style={styles.popRadioTitleText}>나의 운동({exeList.length})</Text>
							{exeAddSt ? (
								<TouchableOpacity
									style={styles.exeAddBtn}
									activeOpacity={1}
								>
									<AutoHeightImage
										width={11}
										source={require("../../assets/image/icon_plus2.png")}
									/>
									<Text style={[styles.exeAddBtnText, styles.gray2]}>추가</Text>
								</TouchableOpacity>
							) : (
								<TouchableOpacity
									style={styles.exeAddBtn}
									activeOpacity={opacityVal}
									onPress={() => {
										setExeAddSt(true);
										setExeRest(false);
									}}
								>
									<AutoHeightImage
										width={11}
										source={require("../../assets/image/icon_plus1.png")}
									/>
									<Text style={styles.exeAddBtnText}>추가</Text>
								</TouchableOpacity>
							)}
						</View>						
					</View>
					{exeList.length > 0 ? (
					<View style={styles.exeSortBox}>				
						<DraggableFlatList
							data={exeList}
							onDragEnd={({ data }) => {
								setExeList(data);								
							}}
							keyExtractor={(item) => item.key}
							renderItem={renderItem}
							ref={scrollViewRef}
						/>														
					</View>
					) : (
						!exeAddSt ? (
						<View style={[styles.exeSortBox, styles.exeRestBox]}>
							<TouchableOpacity
								style={styles.restBtn}
								activeOpacity={opacityVal}
								onPress={() => {
									setExeRest(!exeRest);
								}}
							>
								<View style={[styles.restBtnChk, exeRest ? styles.restBtnChkOn : null]}>
									<AutoHeightImage
										width={10}
										source={require("../../assets/image/icon_chk1.png")}
									/>
								</View>
								<Text style={styles.restBtnText}>운동을 쉬고 있어요</Text>
							</TouchableOpacity>
						</View>
						) : null
					)}

					{exeAddSt ? (
					<ScrollView>
						<View onStartShouldSetResponder={() => true}>
							<View style={[styles.popRadioBox, styles.mgt20]}>
								<View style={[styles.popRadioTitle]}>
									<Text style={styles.popRadioTitleText}>주기</Text>
								</View>						
								<View style={styles.periFlex}>
									<View style={styles.popRadioType2}>
										<TouchableOpacity
											style={[styles.popRadioBoxBtn2, styles.popRadioBoxBtn5, exePeri == '주' ? styles.popRadioBoxBtn2On : null]}
											activeOpacity={opacityVal}
											onPress={()=>{												
												setExePeri('주');		
												if(exeDay > 7){
													setExeDay('7');
												}
											}}
										>
											<Text style={[styles.popRadioBoxBtn2Text, styles.popRadioBoxBtn5Text, exePeri == '주' ? styles.popRadioBoxBtn2TextOn : null]}>주</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={[styles.popRadioBoxBtn2, styles.popRadioBoxBtn5, exePeri == '월' ? styles.popRadioBoxBtn2On : null]}
											activeOpacity={opacityVal}
											onPress={()=>{												
												setExePeri('월');									
											}}
										>
											<Text style={[styles.popRadioBoxBtn2Text, styles.popRadioBoxBtn5Text, exePeri == '월' ? styles.popRadioBoxBtn2TextOn : null]}>월</Text>
										</TouchableOpacity>
									</View>
									<View style={styles.periDayCnt}>
										<TouchableOpacity
											style={styles.periDayCntBtn}
											activeOpacity={opacityVal}
											onPress={() => {periCount('minus')}}
										>
											<AutoHeightImage
												width={18}
												source={require("../../assets/image/icon_minus2.png")}
											/>
										</TouchableOpacity>
										<TextInput
										value={exeDay}
										keyboardType = 'numeric'
										onChangeText={(v) => {
											
											if(exePeri == '주'){
												if(v*1 > 7){ setExeDay('7') }
											}else{
												if(v*1 > 30){ setExeDay('30') }
											}
										}}
										style={[styles.periDayIpt]}
									/>
										<TouchableOpacity
											style={styles.periDayCntBtn}
											activeOpacity={opacityVal}
											onPress={() => {periCount('plus')}}
										>
											<AutoHeightImage
												width={18}
												source={require("../../assets/image/icon_plus3.png")}
											/>
										</TouchableOpacity>
										<Text style={styles.periDayUnit}>일</Text>
									</View>
								</View>
							</View>
							<View style={[styles.popRadioBox, styles.mgt20]}>
								<View style={[styles.popRadioTitle]}>
									<Text style={styles.popRadioTitleText}>종목</Text>
								</View>						
								<View style={styles.physicalList}>
									{sprotList.map((item, index) => {
										return(
											<TouchableOpacity
												key={index}
												style={[styles.phyBtn, exeSport == item.txt ? styles.phyBtnOn : null]}
												activeOpacity={opacityVal}
												onPress={() => {
													setExeSport(item.txt);
												}}
											>
												<Text style={[styles.phyBtnText, exeSport == item.txt ? styles.phyBtnTextOn : null]}>{item.txt}</Text>
											</TouchableOpacity>
										)
									})}							
								</View>
							</View>
						</View>
					</ScrollView>
					) : null}
					<View style={styles.popBtnBox}>
						<TouchableOpacity 
							style={[styles.popBtn, exeBtn ? null : styles.nextBtnOff]}
							activeOpacity={opacityVal}
							onPress={() => {checkPopVal('exe')}}
						>
							<Text style={styles.popBtnText}>저장하기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			) : null}

			{/*체형*/}
			{popPhysical ? (
			<View style={[styles.cmPop]}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
						setPopPhysical(false);
						setPreventBack(false);
					}}
				>
				</TouchableOpacity>
				<View style={[styles.prvPop]}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setPopPhysical(false);
							setPreventBack(false);
						}}
					>
						<AutoHeightImage
							width={18}
							source={require("../../assets/image/popup_x.png")}
						/>
					</TouchableOpacity>			
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>체형을 선택해 주세요</Text>
						<Text style={styles.popTitleDesc}>2개 이상 선택해 주세요 (최대 5개)</Text>
					</View>
					<ScrollView>
						<View style={styles.physicalList}>
							{phyAry.map((item, index) => {
								return(
									<TouchableOpacity
										key={index}
										style={[styles.phyBtn, item.chk ? styles.phyBtnOn : null]}
										activeOpacity={opacityVal}
										onPress={() => {
											physical_ary(item.val);
											//console.log(phyAry.length);											
											//setPhyAry([item.val, ...phyAry]);
										}}
									>
										<Text style={[styles.phyBtnText, item.chk ? styles.phyBtnTextOn : null]}>{item.txt}</Text>
									</TouchableOpacity>
								)
							})}							
						</View>
					</ScrollView>
					<View style={styles.popBtnBox}>
						<TouchableOpacity 
							style={[styles.popBtn, phyBtn ? null : styles.nextBtnOff]}
							activeOpacity={opacityVal}
							onPress={() => {checkPopVal('physical')}}
						>
							<Text style={styles.popBtnText}>저장하기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			) : null}

			{/*음주&흡연*/}
			{popDrink ? (
			<View style={[styles.cmPop]}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
						setPopDrink(false);
					}}
				>
				</TouchableOpacity>
				<View style={[styles.prvPop]}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setPopDrink(false);
							setPreventBack(false);
						}}
					>
						<AutoHeightImage
							width={18}
							source={require("../../assets/image/popup_x.png")}
						/>
					</TouchableOpacity>			
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>음주 · 흡연을 즐기시나요?</Text>
					</View>
					<ScrollView>
						<View style={styles.popRadioBox}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>음주</Text>
							</View>
							<View style={styles.popRadioFlex}>
								{drinkList.map((item, index)=>{
									return (
										<TouchableOpacity
											key={index}
											style={[styles.popRadioBoxBtn, styles.popRadioBoxBtn3, realDrink == item.txt ? styles.popRadioBoxBtnOn : null]}
											activeOpacity={opacityVal}
											onPress={()=>{
												setRealDrink(item.txt);									
											}}
										>
											<Text style={[styles.popRadioBoxBtnText, realDrink == item.txt ? styles.popRadioBoxBtnTextOn : null]}>{item.txt}</Text>
										</TouchableOpacity>
									)
								})}
							</View>
						</View>
						<View style={[styles.popRadioBox, styles.mgt30]}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>흡연</Text>
							</View>
							<View style={styles.popRadioFlex}>
								{smokeList.map((item, index)=>{
									return (
										<TouchableOpacity
											key={index}
											style={[styles.popRadioBoxBtn, styles.popRadioBoxBtn3, realSmoke == item.txt ? styles.popRadioBoxBtnOn : null]}
											activeOpacity={opacityVal}
											onPress={()=>{
												setRealSmoke(item.txt);									
											}}
										>
											<Text style={[styles.popRadioBoxBtnText, realSmoke == item.txt ? styles.popRadioBoxBtnTextOn : null]}>{item.txt}</Text>
										</TouchableOpacity>
									)
								})}
							</View>
						</View>
						{realSmoke != '' && realSmoke != '비흡연' ? (
						<View style={[styles.popRadioBox, styles.mgt30]}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>종류</Text>
							</View>
							<View style={styles.popRadioFlex}>
								{smokeSortList.map((item, index)=>{
									return (
										<TouchableOpacity
											key={index}
											style={[styles.popRadioBoxBtn, styles.popRadioBoxBtn3, realSmokeSort == item.txt ? styles.popRadioBoxBtnOn : null]}
											activeOpacity={opacityVal}
											onPress={()=>{
												setRealSmokeSort(item.txt);									
											}}
										>
											<Text style={[styles.popRadioBoxBtnText, realSmokeSort == item.txt ? styles.popRadioBoxBtnTextOn : null]}>{item.txt}</Text>
										</TouchableOpacity>
									)
								})}
							</View>
						</View>
						) : null}
					</ScrollView>
				</View>
			</View>
			) : null}

			{/*mbti*/}
			{popMbti ? (
			<View style={[styles.cmPop]}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
						setPopMbti(false);
						setPreventBack(false);
					}}
				>
				</TouchableOpacity>
				<View style={[styles.prvPop]}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setPopMbti(false);
							setPreventBack(false);
							setPreventBack(false);
						}}
					>
						<AutoHeightImage
							width={18}
							source={require("../../assets/image/popup_x.png")}
						/>
					</TouchableOpacity>			
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>나의 성격 유형</Text>
						<Text style={styles.popTitleDesc}>나의 성격 유형은 {mbtiRes1}{mbtiRes2}{mbtiRes3}{mbtiRes4} 에요</Text>
					</View>
					<ScrollView>
						<View style={styles.popRadioBox}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>에너지의 방향</Text>
							</View>
							<View style={styles.popRadioFlex}>
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti1 == 'E' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										setMbti1('E');
									}}
								>
									<Text style={[styles.popRadioBoxBtn4Text, mbti1 == 'E' ? styles.popRadioBoxBtnTextOn : null]}>E</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti1 == 'E' ? styles.popRadioBoxBtnTextOn : null]}>외향적</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti1 == 'E' ? styles.popRadioBoxBtnTextOn : null]}>사교적</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti1 == 'I' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										setMbti1('I');			
									}}
								>
									<Text style={[styles.popRadioBoxBtn4Text, mbti1 == 'I' ? styles.popRadioBoxBtnTextOn : null]}>I</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti1 == 'I' ? styles.popRadioBoxBtnTextOn : null]}>내향적</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti1 == 'I' ? styles.popRadioBoxBtnTextOn : null]}>깊이 있는 관계</Text>
								</TouchableOpacity>	
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti2 != '' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										if(mbti1 == ''){
											ToastMessage('E 와 I 중 하나를 먼저 선택해 주세요.');
										}else{
											if(mbti2 == ''){
												if(mbti1 == 'E'){
													setMbti2('I');
												}else{
													setMbti2('E');
												}
											}else{
												setMbti2('');
											}
										}
									}}
								>
									{mbti2 != '' ? (
										<AutoHeightImage
											width={30}
											source={require("../../assets/image/mbti_1_on.png")}
											style={styles.popRadioBoxBtn4Img}
										/>
									) : (
										<AutoHeightImage
											width={30}
											source={require("../../assets/image/mbti_1.png")}
											style={styles.popRadioBoxBtn4Img}
										/>
									)}
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti2 != '' ? styles.popRadioBoxBtnTextOn : null]}>거의</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti2 != '' ? styles.popRadioBoxBtnTextOn : null]}>반반이예요</Text>
								</TouchableOpacity>								
							</View>
						</View>						

						<View style={[styles.popRadioBox, styles.mgt30]}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>정보 인식 방식</Text>
							</View>
							<View style={styles.popRadioFlex}>
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti3 == 'S' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										setMbti3('S');
									}}
								>
									<Text style={[styles.popRadioBoxBtn4Text, mbti3 == 'S' ? styles.popRadioBoxBtnTextOn : null]}>S</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti3 == 'S' ? styles.popRadioBoxBtnTextOn : null]}>구체적</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti3 == 'S' ? styles.popRadioBoxBtnTextOn : null]}>사실적</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti3 == 'N' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										setMbti3('N');			
									}}
								>
									<Text style={[styles.popRadioBoxBtn4Text, mbti3 == 'N' ? styles.popRadioBoxBtnTextOn : null]}>N</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti3 == 'N' ? styles.popRadioBoxBtnTextOn : null]}>추상적</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti3 == 'N' ? styles.popRadioBoxBtnTextOn : null]}>상징적</Text>
								</TouchableOpacity>	
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti4 != '' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										if(mbti3 == ''){
											ToastMessage('S 와 N 중 하나를 먼저 선택해 주세요.');
										}else{
											if(mbti4 == ''){
												if(mbti3 == 'S'){
													setMbti4('N');
												}else{
													setMbti4('N');
												}			
											}else{
												setMbti4('');
											}					
										}
									}}
								>
									{mbti4 != '' ? (
										<AutoHeightImage
											width={30}
											source={require("../../assets/image/mbti_2_on.png")}
											style={styles.popRadioBoxBtn4Img}
										/>
									) : (
										<AutoHeightImage
											width={30}
											source={require("../../assets/image/mbti_2.png")}
											style={styles.popRadioBoxBtn4Img}
										/>
									)}
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti4 != '' ? styles.popRadioBoxBtnTextOn : null]}>거의</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti4 != '' ? styles.popRadioBoxBtnTextOn : null]}>반반이예요</Text>
								</TouchableOpacity>								
							</View>
						</View>

						<View style={[styles.popRadioBox, styles.mgt30]}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>가치판단 증거</Text>
							</View>
							<View style={styles.popRadioFlex}>
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti5 == 'T' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										setMbti5('T');
									}}
								>
									<Text style={[styles.popRadioBoxBtn4Text, mbti5 == 'T' ? styles.popRadioBoxBtnTextOn : null]}>T</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti5 == 'T' ? styles.popRadioBoxBtnTextOn : null]}>논리적</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti5 == 'T' ? styles.popRadioBoxBtnTextOn : null]}>객관적 원칙</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti5 == 'F' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										setMbti5('F');			
									}}
								>
									<Text style={[styles.popRadioBoxBtn4Text, mbti5 == 'F' ? styles.popRadioBoxBtnTextOn : null]}>F</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti5 == 'F' ? styles.popRadioBoxBtnTextOn : null]}>감성적</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti5 == 'F' ? styles.popRadioBoxBtnTextOn : null]}>인간적</Text>
								</TouchableOpacity>	
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti6 != '' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										if(mbti5 == ''){
											ToastMessage('S 와 N 중 하나를 먼저 선택해 주세요.');
										}else{
											if(mbti6 == ''){
												if(mbti5 == 'T'){
													setMbti6('F');
												}else{
													setMbti6('T');
												}			
											}else{
												setMbti6('');
											}					
										}
									}}
								>
									{mbti6 != '' ? (
										<AutoHeightImage
											width={30}
											source={require("../../assets/image/mbti_3_on.png")}
											style={styles.popRadioBoxBtn4Img}
										/>
									) : (
										<AutoHeightImage
											width={30}
											source={require("../../assets/image/mbti_3.png")}
											style={styles.popRadioBoxBtn4Img}
										/>
									)}
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti6 != '' ? styles.popRadioBoxBtnTextOn : null]}>거의</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti6 != '' ? styles.popRadioBoxBtnTextOn : null]}>반반이예요</Text>
								</TouchableOpacity>								
							</View>
						</View>
						
						<View style={[styles.popRadioBox, styles.mgt30]}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>생활 방식</Text>
							</View>
							<View style={styles.popRadioFlex}>
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti7 == 'J' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										setMbti7('J');
									}}
								>
									<Text style={[styles.popRadioBoxBtn4Text, mbti7 == 'J' ? styles.popRadioBoxBtnTextOn : null]}>J</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti7 == 'J' ? styles.popRadioBoxBtnTextOn : null]}>목표지향</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti7 == 'J' ? styles.popRadioBoxBtnTextOn : null]}>계획적</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti7 == 'P' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										setMbti7('P');			
									}}
								>
									<Text style={[styles.popRadioBoxBtn4Text, mbti7 == 'P' ? styles.popRadioBoxBtnTextOn : null]}>P</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti7 == 'P' ? styles.popRadioBoxBtnTextOn : null]}>유연한</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti7 == 'P' ? styles.popRadioBoxBtnTextOn : null]}>즉흥적인</Text>
								</TouchableOpacity>	
								<TouchableOpacity
									style={[styles.popRadioBoxBtn4, mbti8 != '' ? styles.popRadioBoxBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										if(mbti7 == ''){
											ToastMessage('S 와 N 중 하나를 먼저 선택해 주세요.');
										}else{
											if(mbti8 == ''){
												if(mbti7 == 'J'){
													setMbti8('P');
												}else{
													setMbti8('J');
												}			
											}else{
												setMbti8('');
											}					
										}
									}}
								>
									{mbti8 != '' ? (
										<AutoHeightImage
											width={30}
											source={require("../../assets/image/mbti_4_on.png")}
											style={styles.popRadioBoxBtn4Img}
										/>
									) : (
										<AutoHeightImage
											width={30}
											source={require("../../assets/image/mbti_4.png")}
											style={styles.popRadioBoxBtn4Img}
										/>
									)}
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti8 != '' ? styles.popRadioBoxBtnTextOn : null]}>거의</Text>
									<Text style={[styles.popRadioBoxBtn4TextDesc, mbti8 != '' ? styles.popRadioBoxBtnTextOn : null]}>반반이예요</Text>
								</TouchableOpacity>								
							</View>
						</View>
					</ScrollView>
					<View style={styles.popBtnBox}>
						<TouchableOpacity 
							style={[styles.popBtn, mbtiBtn ? null : styles.nextBtnOff]}
							activeOpacity={opacityVal}
							onPress={() => {checkPopVal('mbti')}}
						>
							<Text style={styles.popBtnText}>저장하기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			) : null}

			{/*종교*/}
			{popRel ? (
			<View style={styles.cmPop}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
						setPopRel(false);
						setPreventBack(false);
					}}
				>
				</TouchableOpacity>
				<View style={styles.prvPop}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setPopRel(false);
							setPreventBack(false);							
						}}
					>
						<AutoHeightImage
							width={18}
							source={require("../../assets/image/popup_x.png")}
						/>
					</TouchableOpacity>			
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>종교를 선택해 주세요</Text>
					</View>
					<ScrollView>
						<View style={styles.popRadioBox}>
							{relList.map((item, index) => {
								return(
									<TouchableOpacity
										key={index}
										style={[styles.popRadioBoxBtn, item.txt == realRel ? styles.popRadioBoxBtnOn : null]}
										activeOpacity={opacityVal}
										onPress={()=>{
											setPopRel(false);
											setRealRel(item.txt);
											setPreventBack(false);
										}}
									>
										<Text style={[styles.popRadioBoxBtnText, item.txt == realRel ? styles.popRadioBoxBtnTextOn : null]}>{item.txt}</Text>
									</TouchableOpacity>
								)
							})}
						</View>
					</ScrollView>
				</View>
			</View>
			) : null}

		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: { marginTop: 62 },
  
	regiStateBarBox: {paddingTop:30,paddingBottom:56,paddingHorizontal:55,overflow:'hidden'},
  regiStateBar: {height:18,backgroundColor:'#eee',borderRadius:20,flexDirection:'row',justifyContent:'space-between'},
	regiStateCircel: {width:18,height:18,backgroundColor:'#eee',borderRadius:50,position:'relative'},
	regiStateCircelOn: {backgroundColor:'#243B55',},
	regiStateCircel2: {width:6,height:6,backgroundColor:'#fff',borderRadius:50,position:'absolute',left:6,top:6,},
	regiStateText: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:13,color:'#dbdbdb',width:60,position:'absolute',left:-20,bottom:-28,textAlign:'center',},
	regiStateTexOn: {color:'#243B55'},

	regiStepList: {paddingBottom:20,},
	regiStep5Btn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:18,paddingHorizontal:30,borderBottomWidth:1,borderBottomColor:'#EDEDED'},
	regiStep5BtnLeft: {flexDirection:'row',alignItems:'center',},
	regiStep5BtnLeftText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e',marginLeft:10,},
	regiStep5BtnRight: {flexDirection:'row',alignItems:'center',},
	regiStep5BtnRightText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#888',marginRight:15,},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  
	input: { fontFamily: Font.NotoSansRegular, width: innerWidth-40, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
	input2: {width: innerWidth},
  
	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},
	prvPop2: {height:innerHeight,},
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E'},
	popTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	popIptBox: {paddingTop:10,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {marginTop:30,},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},

	popRadioBox: {paddingBottom:10,},
	popRadioTitle: {},
	popRadioTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
	popRadioTitleText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},
	span: {fontFamily:Font.NotoSansRegular,color:'#B8B8B8'},
	popRadioFlex: {flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},
	popRadioBoxBtn: {height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,marginTop:10,paddingHorizontal:15,justifyContent:'center'},
	popRadioBoxBtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,color:'#666'},
	
	popRadioType2: {flexDirection:'row',flexWrap:'wrap',},
	popRadioBoxBtn2: {justifyContent:'center',height:38,borderWidth:1,borderColor:'#ededed',borderRadius:50,paddingHorizontal:16,marginTop:8,marginRight:8,},
	popRadioBoxBtn2On: {backgroundColor:'rgba(209,145,60, 0.15)',borderColor:'#D1913C'},
	popRadioBoxBtn2Text: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:38,color:'#666',},
	popRadioBoxBtn2TextOn: {color:'#D1913C'},

	popRadioBoxBtn3: {width:(innerWidth/2)-25},

	popRadioBoxBtn4: {width:(innerWidth/3)-20,height:(innerWidth/3)-20,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,marginTop:10,},
	popRadioBoxBtn4Text: {fontFamily:Font.NotoSansMedium,fontSize:24,lineHeight:31,color:'#666',marginBottom:5,},
	popRadioBoxBtn4Img: {marginBottom:5,},
	popRadioBoxBtn4TextDesc: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:15},

	popRadioBoxBtn5: {width:52,height:33,paddingHorizontal:0,},
	popRadioBoxBtn5Text: {textAlign:'center',fontSize:13,lineHeight:33,color:'#1e1e1e'},

	popRadioBoxBtnOn: {backgroundColor:'rgba(209,145,60, 0.15)',borderColor:'#D1913C'},
	popRadioBoxBtnTextOn: {color:'#D1913C'},

	jobBoxWrap: {flexDirection:'row',justifyContent:'space-between',height:innerHeight-364,},
	jobBox: {width:(innerWidth/2)-25,backgroundColor:'#F9FAFB',paddingHorizontal:10,paddingBottom:15,},
	jobBoxTitle: {borderBottomWidth:1,borderBottomColor:'#EDEDED'},
	jobBoxTitleText: {textAlign:'center',paddingVertical:12,fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#243b55',},
	jobList: {paddingTop:12,},
	jobSelect: {marginTop:12,},
	jobSelectText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:18,color:'#1e1e1e'},

	typingFactory: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,
	paddingLeft:12,display:'flex',justifyContent:'center',position:'relative',},
	typingFactoryOn: {borderColor:'#31B481'},
	myFactoryText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:56,color:'#8791A1'},
	myFactoryText2: {color:'#000'},
	myFactoryTextOn: {fontFamily:Font.NotoSansMedium,color:'#31B481'},
	myFactoryArr: {position:'absolute',right:20,top:21,},
	addBtn: {width:innerWidth,height:58,backgroundColor:'#E3E9ED',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:20,},
	addBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:19,color:'#8791A1',marginLeft:8},
	modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,height:154,padding:30,paddingLeft:20,paddingRight:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},	
	photoBoxBtn: {width:102,height:102,borderRadius:12,overflow:'hidden',alignItems:'center',justifyContent:'center',marginTop:10,},
	photoBox: {marginTop:10,borderWidth:1,borderColor:'#E1E1E1',borderRadius:12,overflow:'hidden'},
	resetBtn: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',width:75,height:24,backgroundColor:'#31B481',borderRadius:12,},
	resetBtnText: {fontFamily:Font.NotoSansBold,fontSize:13,lineHeight:22,color:'#fff',marginLeft:5,},
	timeBox: {position:'absolute',right:20,top:21,},
	timeBoxText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:19,color:'#000'},
	findLocal: {marginTop:10,},
	findLocalBtn: {width:innerWidth,height:58,backgroundColor:'#E9ECF0',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',},
	findLocalBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#8791A1',marginLeft:5},
	toastModal: {width:widnowWidth,height:(widnowHeight - 125),display:'flex',alignItems:'center',justifyContent:'flex-end'},

	modalCont2: {width:innerWidth,borderRadius:10,position:'absolute',left:20,bottom:35},
	modalCont2Box: {},
	modalCont2Btn: {width:innerWidth,height:58,backgroundColor:'#F1F1F1',display:'flex',alignItems:'center',justifyContent:'center',},
	choice: {borderTopLeftRadius:12,borderTopRightRadius:12,borderBottomWidth:1,borderColor:'#B1B1B1'},
	modify: {borderBottomWidth:1,borderColor:'#B1B1B1'},
	delete: {borderBottomLeftRadius:12,borderBottomRightRadius:12,},
	cancel: {backgroundColor:'#fff',borderRadius:12,marginTop:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:19,color:'#007AFF'},
	modalCont2BtnText2: {color:'#DF4339'},

	certDisabled: {backgroundColor:'#efefef'},
	certDisabledText: {color:'#aaa'},
	certChkBtn2Disabled: {backgroundColor:'#efefef'},
	certChkBtn2DisabledText: {color:'#aaa'},

	physicalList: {flexDirection:'row',flexWrap:'wrap',justifyContent:'center'},
	phyBtn: {justifyContent:'center',height:33,marginHorizontal:4,paddingHorizontal:14,borderWidth:1,borderColor:'#EDEDED',borderRadius:50,marginTop:8,},
	phyBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#1E1E1E'},
	phyBtnOn: {backgroundColor:'rgba(209,145,60,0.1)',borderColor:'#D1913C'},
	phyBtnTextOn: {color:'#D1913C'},

	localBtn: {borderBottomWidth:1,borderBottomColor:'#DBDBDB',marginTop:10,paddingTop:12,paddingBottom:6,paddingHorizontal:5,},
	localBtnText: {fontFamily:Font.NotoSansRegular,fontSize:16,lineHeight:18,color:'#DBDBDB'},
	localBtnText2: {color:'#333'},

	wheelpciker: {borderRadius:5,overflow:'hidden',marginTop:10,},
	activeStyle2: {fontFamily:Font.NotoSansMedium,fontSize:15,color:'#1e1e1e',width:innerWidth-40,height:40,textAlign:'center',lineHeight:40},
	activeStyle3: {backgroundColor:'#f9f9f9'},

	exeAddBtn: {flexDirection:'row',alignItems:'center'},
	exeAddBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:18,color:'#D1913C',marginLeft:5,},

	exeSortBox: {paddingBottom:20,borderBottomWidth:1,borderBottomColor:'#DBDBDB',maxHeight:165,},
	exeRestBox: {paddingBottom:0,paddingTop:20,marginTop:10,borderBottomWidth:0,borderTopWidth:1,borderTopColor:'#DBDBDB'},
	exeSortCont: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:8,},
	exeSortContBtn1: {width:22,height:22,backgroundColor:'#fff',alignItems:'center'},
	exeSortContBox: {width:innerWidth-92,height:32,backgroundColor:'#F9FAFB',flexDirection:'row',alignItems:'center',paddingHorizontal:15,},
	exeSortContBoxText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#1e1e1e'},
	exeSortContBoxText1: {width:65,},
	exeSortContBoxText2: {},
	exeSortContBtn2: {width:18,height:22,backgroundColor:'#fff'},

	periFlex: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
	periDayCnt: {flexDirection:'row',alignItems:'center',position:'relative',top:2,},
	periDayCntBtn: {width:18,height:18,},
	periDayIpt: {fontFamily:Font.NotoSansMedium,width:26,height:20,backgroundColor:'#fff',paddingVertical:0,fontSize:13,lineHeight:18,color:'#1e1e1e',textAlign:'center',marginHorizontal:2,},
	periDayUnit: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:18,color:'#1e1e1e',marginLeft:10,},

	restBtn: {flexDirection:'row',alignItems:'center'},
	restBtnChk: {width:20,height:20,borderWidth:1,backgroundColor:'#fff',borderColor:'#dbdbdb',borderRadius:50,alignItems:'center',justifyContent:'center'},
	restBtnChkOn: {backgroundColor:'#D1913C',borderWidth:0,},
	restBtnText : {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:18,color:'#1e1e1e',marginLeft:8,},

	notPickBtn: {flexDirection:'row',alignItems:'center'},
	notPickBtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,color:'#243B55',marginLeft:5,},

	red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

	mgt0: { marginTop: 0, },
	mgt8: { marginTop: 8, },
  mgt10: { marginTop: 10, },
	mgt20: { marginTop: 20, },
	mgt30: { marginTop: 30, },
	pdb0: {paddingBottom:0},
})

export default RegisterStep5