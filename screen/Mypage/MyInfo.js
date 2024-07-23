import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import WheelPicker from 'react-native-wheely';
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import APIs from "../../assets/APIs";
import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

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

const drinkList = [
	{ val: 0, txt: '마시지 않음' },
	{ val: 1, txt: '어쩔 수 없을 때만' },
	{ val: 2, txt: '가끔 마심' },
	{ val: 3, txt: '어느정도 즐김' },
	{ val: 4, txt: '좋아하는 편' },
	{ val: 5, txt: '매우 즐기는 편' },
]

const smokeList = [
	{ val: 0, txt: '비흡연' },
	{ val: 1, txt: '금연 중' },
	{ val: 2, txt: '가끔 피움' },
	{ val: 3, txt: '흡연 중' },
]

const smokeSortList = [
	{ val: 1, txt: '연초' },
	{ val: 2, txt: '권련형 전자담배' },
	{ val: 3, txt: '액상형 전자담배' },
]

const MyInfo = (props) => {
	const {navigation, userInfo, member_info, route} = props;
	const {params} = route
	const scrollViewRef = useRef();
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [currFocus, setCurrFocus] = useState('');
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);
	const [memberIdx, setMemberIdx] = useState();

	const [heightList, setHeightList] = useState([]);
	const [weightList, setWeightList] = useState([]);
	const [muscleList, setMuscleList] = useState([]);
	const [fatList, setFatList] = useState([]);
	const [exeList, setExeList] = useState([]);
	const [sportList, setSportList] = useState([]);
	const [relList, setRelList] = useState([]);
	const [jobList, setJobList] = useState([]);
	const [jobList2, setJobList2] = useState([]);
	
	const [nickCert, setNickCert] = useState(true);
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
	const [realGender, setRealGender] = useState();
	const [realClass, setRealClass] = useState('');
	const [realClass2, setRealClass2] = useState('');
	const [job, setJob] = useState('');
	const [job1, setJob1] = useState('');
	const [job2, setJob2] = useState('');
	const [realJob, setRealJob] = useState('');
	const [jobDetail, setJobDetail] = useState('');
	const [realJobDetail, setRealJobDetail] = useState('');
	const [phyAry, setPhyAry] = useState([]);
	const [phyAryCnt, setPhyAryCnt] = useState(0);
	const [realPhyAry, setRealPhyAry] = useState([]);
	const [realPhyAryCnt, setRealPhyAryCnt] = useState(0);
	const [realDrink, setRealDrink] = useState();
	const [realDrinkText, setRealDrinkText] = useState('');
	const [realSmoke, setRealSmoke] = useState();
	const [realSmokeText, setRealSmokeText] = useState('');
	const [realSmokeSort, setRealSmokeSort] = useState();
	const [realSmokeSortText, setRealSmokeSortText] = useState('');
	const [realRel, setRealRel] = useState();
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
	const [localDetail1, setLocalDetail1] = useState('');
	const [localDetail2, setLocalDetail2] = useState('');
	const [realLocal1, setRealLocal1] = useState('');
	const [realLocal2, setRealLocal2] = useState('');
	const [realLocalDetail1, setRealLocalDetail1] = useState('');
	const [realLocalDetail2, setRealLocalDetail2] = useState('');
	const [heightIdx, setHeightIdx] = useState(30);
	const [height, setHeight] = useState('170cm');
	const [weightIdx, setWeightIdx] = useState(30);
	const [weight, setWeight] = useState('60kg');
	const [muscleIdx, setMuscleIdx] = useState(25);
	const [muscle, setMuscle] = useState('25kg');
	const [fatIdx, setFatIdx] = useState(15);
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
	const [exeSportIdx, setExeSportIdx] = useState();
	const [exeSport, setExeSport] = useState('');
	const [exeRest, setExeRest] = useState(false);	
	const [realRest, setRealRest] = useState(false);
	const [realExeList, setRealExeList] = useState([]);
	const [nextOpen, setNextOpen] = useState(false);
	const [outerScrollEnabled, setOuterScrollEnabled] = useState(true);
	const [mbPhysical, setMbPhysical] = useState('');
	const [saveDrink, setSaveDrink] = useState('');
	const [saveSmoke, setSaveSmoke] = useState('');
	const [saveSmoke2, setSaveSmoke2] = useState('');
	
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
		if(memberIdx){
			setLoading(true);
			getMemInfo();
			getMemInfo2();
		}
	}, [memberIdx]);

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
		if(realDrink != undefined && realSmoke != undefined){
			if(realSmoke == 0){
				setPopDrink(false);
				setPreventBack(false);
			}else{
				if(realSmokeSort != undefined){
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

	useEffect(() => {
		getSportData();
		getRelData();
		getJobData();
	}, []);

	const getSportData = async () => {
		let sData = {      
      basePath: "/api/member/index.php",
			type: "GetExerciseList",
		}
		const response = await APIs.send(sData);		
		if(response.code == 200){
			setSportList(response.data);
		}
	}

	const getSportData2 = async (exe) => {
		let sData = {      
      basePath: "/api/member/index.php",
			type: "GetExerciseList",
		}
		const response = await APIs.send(sData);		
		if(response.code == 200){
			const resAry = response.data;
			let exeAddList;
			let exeAddList2 = exeList;
			exe.map((item, index) => {	
				exeAddList = {me_rank:item.me_rank, me_cycle:item.me_cycle, me_count:item.me_count, me_name:item.me_name};
				exeAddList2 = [...exeAddList2, exeAddList];
			});
			setExeList(exeAddList2);
			setRealExeList(exeAddList2);
		}
	}

	const getRelData = async () => {
		let sData = {      
      basePath: "/api/member/index.php",
			type: "GetReligionList",
		}
		const response = await APIs.send(sData);		
		if(response.code == 200){
			setRelList(response.data);
		}
	}

	const getJobData = async () => {
		let sData = {      
      basePath: "/api/member/index.php",
			type: "GetCompanyList",
		}
		const response = await APIs.send(sData);
		if(response.code == 200){
			setJobList(response.data);
		}		
	}

	const getJobData2 = async (idx, name) => {
		setJob(name);
		setJob1(name);
		setJobBtn(true);

		let sData = {      
      basePath: "/api/member/index.php",
			type: "GetCareerList",
			company_idx: idx,
		}
		const response = await APIs.send(sData);
		if(response.code == 200){
			setJobList2(response.data);
		}
	}

	const getPhyData = async (v) => {
		console.log('getPhyData');
		setPhyAry([]);
		setPhyAryCnt(0)		
		setRealPhyAry([]);
		setRealPhyAryCnt(0);

		let sData = {      
      basePath: "/api/member/index.php",
			type: "GetPhysicalList",
      physical_type: v,
		}
		const response = await APIs.send(sData);		
		//console.log(response.data);

		let phyArray = [...phyAry];
		if(response.code == 200){
			setPhyAry(response.data);			
		}
	}

	const getPhyData2 = async (v, list) => {
		setPhyAry([]);
		setPhyAryCnt(0)		
		setRealPhyAry([]);
		setRealPhyAryCnt(0);

		let sData = {      
      basePath: "/api/member/index.php",
			type: "GetPhysicalList",
      physical_type: v,
		}
		const response = await APIs.send(sData);			
		if(response.code == 200){			
			const resAry = response.data;
			let newAry = [...resAry];
	
			//let fakePhy = list.replace('[', '').replace(']', '').replaceAll('"', '');						
			//let fakeSplt = fakePhy.split(',');						
			// for(let i=0; i<list.length; i++){
			// 	const trimVal = list[i].trim();
			// 	const result = resAry.findIndex((value) => value.physical_name == trimVal);
			// 	newAry[result].chk = true;
			// }			
			list.map((item, index) => {
				const result = resAry.findIndex((value) => value.physical_name == item.mp_name);
				newAry[result].chk = true;
			})

			setPhyAry(newAry);
			setRealPhyAry(newAry);
			setPhyAryCnt(list.length);
			setRealPhyAryCnt(list.length);
		}
	}

	const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyProfile",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
		//console.log(response);		
		if(response.data.info.member_exercise_yn == 'y'){ 
			getSportData2(response.data.info.member_exercise);
		}else{
			setExeRest(true); setRealRest(true); 
		}

		if(response.data.info.member_sex){ 
			setRealGender(response.data.info.member_sex);			
			getPhyData2(response.data.info.member_sex, response.data.info.member_physical);
		}		

		if(response.data.info.member_nick){ setRealNick(response.data.info.member_nick); }		
		if(response.data.info.member_main_local){ setRealLocal1(response.data.info.member_main_local); }
		if(response.data.info.member_main_local_detail){ setRealLocalDetail1(response.data.info.member_main_local_detail); }
		if(response.data.info.member_sub_local){ setRealLocal2(response.data.info.member_sub_local); }
		if(response.data.info.member_sub_local_detail){ setRealLocalDetail2(response.data.info.member_sub_local_detail); }	
		if(response.data.info.member_education){ setRealClass(response.data.info.member_education); }
		if(response.data.info.member_education_status){ setRealClass2(response.data.info.member_education_status); }
		if(response.data.info.member_job){ setRealJob(response.data.info.member_job); }
		if(response.data.info.member_job_detail){ setRealJobDetail(response.data.info.member_job_detail); }

		let physicalString = '';
		if(response.data.info.member_height){ 
			let ary = [];
			for(let i=140; i<=216; i++){ ary.push(i); }	
			const aryIndx = ary.findIndex((value) => value == response.data.info.member_height);						
			setHeightIdx(aryIndx);
			setHeight(response.data.info.member_height);
			setRealHeight(response.data.info.member_height);

      physicalString += (response.data.info.member_height+'cm'); 
		}

		if(response.data.info.member_weight && response.data.info.member_weight != 0){ 
			let ary2 = [];
			for(let i=30; i<=120; i++){ ary2.push(i); }	
			const aryIndx = ary2.findIndex((value) => value == response.data.info.member_weight);
			setWeightIdx(aryIndx);
			setWeight(response.data.info.member_weight);			
			setRealWeight(response.data.info.member_weight);
			setNoWeight(false);
			setRealNoWeight(false);

			if(physicalString != ''){ physicalString += ' · '; }
      physicalString += (response.data.info.member_weight+'kg'); 
		}else{
			setNoWeight(true);
			setRealNoWeight(true);
		}

		if(response.data.info.member_muscle && response.data.info.member_muscle != 0){
			let ary3 = [];
			for(let i=0; i<=100; i++){ ary3.push(i); }
			const aryIndx = ary3.findIndex((value) => value == response.data.info.member_muscle);
			setMuscleIdx(aryIndx);
			setMuscle(response.data.info.member_muscle);
			setRealMuscle(response.data.info.member_muscle);
			setNoMuscle(false);
			setRealNoMuscle(false);

			if(physicalString != ''){ physicalString += ' · '; }
      physicalString += (response.data.info.member_muscle+'kg'); 
		}else{
			setNoMuscle(true);
			setRealNoMuscle(true);
		}		

		if(response.data.info.member_fat && response.data.info.member_fat != 0){
			let ary4 = [];
			for(let i=0; i<=100; i++){ ary4.push(i); }
			const aryIndx = ary4.findIndex((value) => value == response.data.info.member_fat);
			setFatIdx(aryIndx);
			setFat(response.data.info.member_fat);
			setRealFat(response.data.info.member_fat);
			setNoFat(false);
			setRealNoFat(false);

			if(physicalString != ''){ physicalString += ' · '; }
      physicalString += (response.data.info.member_fat+'%');
		}else{
			setNoFat(true);
			setRealNoFat(true); 
		}

		setMbPhysical(physicalString);

		if(response.data.info.member_drink_status){
			setRealDrink(response.data.info.member_drink_status);
			setRealDrinkText(drinkList[response.data.info.member_drink_status].txt);
		}
		if(response.data.info.member_smoke_status){
			setRealSmoke(response.data.info.member_smoke_status);
			setRealSmokeText(smokeList[response.data.info.member_smoke_status].txt);
		}

		if(response.data.info.member_smoke_type != '' && response.data.info.member_smoke_type != 'NULL'){
			setRealSmokeSort(response.data.info.member_smoke_type);			
			setRealSmokeSortText(smokeSortList[response.data.info.member_smoke_type].txt);
		}
		if(response.data.info.member_religion){ setRealRel(response.data.info.member_religion); }
		
		setTimeout(function(){
			setLoading(false);
		}, 1000)
	}

	const getMemInfo2 = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);	
		if(response.data.member_mbti){
			let state = 0;
			let state2 = false;
			let mbtiRes1 = '';
			let mbtiRes2 = '';
			let mbtiRes3 = '';
			let mbtiRes4 = '';
			const splt = response.data.member_mbti.split('|');			
			for(let i=0; i<splt.length; i++){
				if(splt[i] != ''){
					if(i == 0){
						setMbti1(splt[i]);
						setMbti1_2(splt[i]);			
						state = state+1;
						mbtiRes1 = splt[i];
					}else if(i == 1){
						setMbti2(splt[i]);
						setMbti2_2(splt[i]);			
						mbtiRes1 += '('+splt[i]+')';
					}else if(i == 2){
						setMbti3(splt[i]);
						setMbti3_2(splt[i]);			
						state = state+1;
						mbtiRes2 = splt[i];
					}else if(i == 3){
						setMbti4(splt[i]);
						setMbti4_2(splt[i]);			
						mbtiRes2 += '('+splt[i]+')';
					}else if(i == 4){
						setMbti5(splt[i]);
						setMbti5_2(splt[i]);			
						state = state+1;
						mbtiRes3 = splt[i];
					}else if(i == 5){
						setMbti6(splt[i]);
						setMbti6_2(splt[i]);			
						mbtiRes3 += '('+splt[i]+')';
					}else if(i == 6){
						setMbti7(splt[i]);
						setMbti7_2(splt[i]);			
						state = state+1;
						mbtiRes4 = splt[i];
					}else if(i == 7){
						setMbti8(splt[i]);
						setMbti8_2(splt[i]);
						state2 = true;
						mbtiRes4 += '('+splt[i]+')';
					}
				}				
			}
			
			setMbtiRes1(mbtiRes1);
			setRealMbti1(mbtiRes1);
			setMbtiRes2(mbtiRes2);
			setRealMbti2(mbtiRes2);
			setMbtiRes3(mbtiRes3);
			setRealMbti3(mbtiRes3);
			setMbtiRes4(mbtiRes4);
			setRealMbti4(mbtiRes4);
		}
	}

	const chkTotalVal = () => {
		if(realNick && realGender != undefined && realLocal1 && realJob && realHeight && (realRest || realExeList.length > 0) && realPhyAryCnt > 0 && realRel && realClass && realClass2 && realDrink != undefined && realSmoke != undefined && realMbti1 && realMbti2 && realMbti3 && realMbti4){
			setNextOpen(true);
		}else{
			setNextOpen(false);
		}
	}

	const physical_ary = (v) => {
		let add_state = true;		
		let selectCon = phyAry.map((item) => {						
			if(item.physical_idx === v){
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
			if(item.me_rank != v){
				let exeAddList = {me_rank:item.me_rank, me_cycle:item.me_cycle, me_count:item.me_count, me_name:item.me_name};
				selectCon = [...selectCon, exeAddList];
			}
		});

		let selectCon2 = selectCon.map((item, index) => {
			return {...item, me_rank: index+1};
		});

		setExeList(selectCon2);
	}

	const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
		let cycleText = '';
		if(item.me_cycle == 0){
			cycleText = '주';
		}else if(item.me_cycle == 1){
			cycleText = '월';
		}
    return (
      // <ScaleDecorator>
        <View style={[styles.exeSortCont]}>
					<TouchableOpacity
						style={styles.exeSortContBtn1}
						activeOpacity={opacityVal}
						onPress={() => {
							removeSport(item.me_rank);
						}}
					>
						<ImgDomain fileWidth={22} fileName={'icon_minus1.png'} />						
					</TouchableOpacity>
					<View style={styles.exeSortContBox}>
						<Text style={[styles.exeSortContBoxText, styles.exeSortContBoxText1]}>{cycleText} {item.me_count}일</Text>
						<Text style={[styles.exeSortContBoxText, styles.exeSortContBoxText2]}>{item.me_name}</Text>
					</View>
					<TouchableOpacity
						style={styles.exeSortContBtn2}
						activeOpacity={opacityVal}		
						onPressIn={drag}							
					>
						<ImgDomain fileWidth={18} fileName={'icon_chg.png'}/>
					</TouchableOpacity>
				</View>
      // </ScaleDecorator>
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

	const checkPopVal = async (v) => {
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

			let sData = {      
				basePath: "/api/member/index.php",
				type: "IsDuplicationNick",
				member_nick: nick,
			}
			const response = await APIs.send(sData);
			if(response.code == 200){
				setPopNick(false);
				setRealNick(nick);
				setPreventBack(false);
				setNickCert(true);
				//ToastMessage('사용할 수 있는 닉네임 입니다.');
			}else{
				setNickCert(false);
				ToastMessage('이미 사용 중이거나 사용할 수 없는 닉네임 입니다.');      
			}

			
		}else if(v == 'local'){
			if(local1 == ''){
				ToastMessage('주 활동 지역을 입력해 주세요.');
				return false;
			}								

			setPopLocal(false);
			setRealLocal1(local1);
			setRealLocalDetail1(localDetail1);
			if(local2 != ''){
				setRealLocal2(local2);
				setRealLocalDetail2(localDetail2);
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
			if(!noWeight){
				setRealWeight(weight);
			}
			if(!noMuscle){
				setRealMuscle(muscle);
			}
			if(!noFat){
				setRealFat(fat);
			}
			setRealNoWeight(noWeight);
			setRealNoMuscle(noMuscle);
			setRealNoFat(noFat);
			setPopPhysical2(false);
			setPreventBack(false);			

			let physicalString = height.replace('cm', '')+'cm';
			if(!noWeight){
				if(physicalString != ''){ physicalString += ' · '; }
      	physicalString += (weight.replace('kg', '')+'kg'); 
			}
			if(!noMuscle){
				if(physicalString != ''){ physicalString += ' · '; }
      	physicalString += (muscle.replace('kg', '')+'kg'); 				
			}
			if(!noFat){
				if(physicalString != ''){ physicalString += ' · '; }
      	physicalString += (fat.replace('%', '')+'%'); 
			}

			//console.log(physicalString);
			setMbPhysical(physicalString);
			
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
					ToastMessage('0일 이상을 입력해 주세요.');
					return false;
				}

				if(exeSport == ''){
					ToastMessage('종목을 선택해 주세요.');
					return false;
				}

				const sportAryChk = exeList.find(it => it.me_name == exeSport);
				if(sportAryChk){
					ToastMessage('이미 선택한 종목입니다.\n다른 종목을 선택해 주세요.');
					return false;
				}							
				
				cycle = 0;
				if(exePeri == '월'){
					cycle = 1;
				}else if(exePeri == '주'){
					cycle = 0;
				}

				const keyOd = (exeList.length)+1;
				let exeAddList = {me_rank:keyOd, me_cycle:cycle, me_count:exeDay, me_name:exeSport};
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
			setExeSportIdx();
			setExeSport('');
		}
	}

	const nextStep = async () => {
		//if(realNick == ''){ ToastMessage('닉네임을 입력해 주세요.'); return false; }
		//if(realGender != 0 && realGender != 1){ ToastMessage('성별을 선택해 주세요.'); return false; }
		//if(realLocal1 == ''){ ToastMessage('주 활동 지역을 입력해 주세요.'); return false; }
		if(realClass == '' || realClass2 == ''){ ToastMessage('최종학력을 선택해 주세요.'); return false; }
		if(realJob == ''){ ToastMessage('직업을 압력 또는 선택해 주세요.'); return false; }
		if(realHeight == ''){ ToastMessage('피지컬(키)을 선택해 주세요.'); return false; }
		if(!realRest && realExeList.length < 1){ ToastMessage('운동을 선택해 주세요.'); return false; }
		if(realPhyAryCnt < 1){ ToastMessage('체형을 2~5개를 선택해 주세요.'); return false; }
		if(realDrink == undefined || realSmoke == undefined){ ToastMessage('음주 · 흡연을 선택해 주세요.'); return false; }
		if(realMbti1 == '' || realMbti2 == '' || realMbti3 == '' || realMbti4 == ''){ ToastMessage('MBTI를 선택해 주세요.'); return false; }
		if(realRel == '' || realRel == undefined){ ToastMessage('종교를 선택해 주세요.'); return false; }

		const nextObj = {
			basePath: "/api/member/",
			type:'SetBasicInfo',
			member_idx:memberIdx,						
			member_education:realClass,
			member_education_status:realClass2,
			member_job:realJob,
			member_job_detail:realJobDetail,
			member_height:realHeight,
			member_weight:!noWeight ? realWeight : 0,
			member_muscle:!noMuscle ? realMuscle : 0,
			member_fat:!noFat ? realFat : 0,
			member_no_weight:realNoWeight,
			member_no_muscle:realNoMuscle,
			member_no_fat:realFat,
			member_exercise:realExeList,
			member_drink_status:realDrink,
			member_smoke_status:realSmoke,
			member_mbti:mbti1_2+'|'+mbti2_2+'|'+mbti3_2+'|'+mbti4_2+'|'+mbti5_2+'|'+mbti6_2+'|'+mbti7_2+'|'+mbti8_2,
			member_religion:realRel,
		}

		// console.log('realHeight ::: ', realHeight);
		// console.log('realWeight ::: ', realWeight);
		// console.log('realMuscle ::: ', realMuscle);
		// console.log('realFat ::: ', realFat);

		if(realSmokeSort){
			nextObj.member_smoke_type = realSmokeSort;
		}
	
		const phyTypeTrue = [];
		for(let i=0; i<realPhyAry.length; i++){
			if(realPhyAry[i].chk){
				phyTypeTrue.push(realPhyAry[i].physical_name);
			}
		}
		nextObj.member_physical = phyTypeTrue;
				
		//console.log(nextObj);
		//return false
		const response = await APIs.send(nextObj);
		//console.log(response);
		if(response.code == 200){
			ToastMessage('정보가 수정되었습니다.');
			// const formData = new FormData();
			// formData.append('type', 'GetMyInfo');
			// formData.append('member_idx', idx);
			// const mem_info = await member_info(formData);

			setTimeout(function(){
				navigation.navigate('ProfieModify', {reload:true});
			}, 500);
		}		
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'기본 정보'} />

			<ScrollView>		
				<View style={styles.regiStepList}>
					{/* <TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopNick(true);
							setNick(realNick);
							setPreventBack(true);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							{realNick ? (
								<ImgDomain fileWidth={24} fileName={'icon1_2.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon1.png'}/>
							)}
							<Text style={styles.regiStep5BtnLeftText}>닉네임</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realNick}</Text>
							<ImgDomain fileWidth={20} fileName={'icon_arr1.png'}/>
						</View>
					</TouchableOpacity> */}

					{/* <TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopGender(true);
							setPreventBack(true);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							{realGender == 0 || realGender == 1 ? (
								<ImgDomain fileWidth={24} fileName={'icon2_2.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon2.png'}/>
							)}
							<Text style={styles.regiStep5BtnLeftText}>성별</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							{realGender == 0 ? (<Text style={styles.regiStep5BtnRightText}>남자</Text>) : null}
							{realGender == 1 ? (<Text style={styles.regiStep5BtnRightText}>여자</Text>) : null}
							<ImgDomain fileWidth={20} fileName={'icon_arr1.png'}/>
						</View>
					</TouchableOpacity> */}

					{/* <TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopLocal(true);
							setPreventBack(true);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							{realLocal1 ? (
								<ImgDomain fileWidth={24} fileName={'icon3_2.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon3.png'}/>
							)}
							<Text style={styles.regiStep5BtnLeftText}>지역</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realLocal1}</Text>
							<ImgDomain fileWidth={20} fileName={'icon_arr1.png'}/>
						</View>
					</TouchableOpacity> */}

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopClass(true);
							setPreventBack(true);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							{realClass ? (
								<ImgDomain fileWidth={24} fileName={'icon4_2.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon4.png'}/>
							)}
							<Text style={styles.regiStep5BtnLeftText}>최종학력</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realClass} {realClass2}</Text>
							<ImgDomain fileWidth={20} fileName={'icon_arr1.png'}/>
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
							{realJob ? (
								<ImgDomain fileWidth={24} fileName={'icon5_2.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon5.png'}/>
							)}
							<Text style={styles.regiStep5BtnLeftText}>직업</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realJob}</Text>
							<ImgDomain fileWidth={20} fileName={'icon_arr1.png'}/>
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
							{realHeight ? (
								<ImgDomain fileWidth={24} fileName={'icon6_2.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon6.png'}/>
							)}
							<Text style={styles.regiStep5BtnLeftText}>피지컬</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							{realHeight ? (
							<Text style={styles.regiStep5BtnRightText}>{mbPhysical}</Text>
							) : null}
							<ImgDomain fileWidth={20} fileName={'icon_arr1.png'}/>
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
							{exeRest || realExeList.length > 0 ? (
								<ImgDomain fileWidth={24} fileName={'icon7_2.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon7.png'}/>
							)}
							<Text style={styles.regiStep5BtnLeftText}>운동</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							{exeRest ? (
							<Text style={styles.regiStep5BtnRightText}>쉬고 있어요</Text>
							) : null}

							{realExeList.length > 0 ? (
							<Text style={styles.regiStep5BtnRightText}>{realExeList.length}가지 선택</Text>
							) : null}
							<ImgDomain fileWidth={20} fileName={'icon_arr1.png'}/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {			
							if(realGender == undefined){
								ToastMessage('성별을 먼저 선택해 주세요.');
								return false;								
							}else{
								if(realPhyAry.length > 0){
									setPhyAry(realPhyAry);
								}
								setPopPhysical(true);
								setPreventBack(true);
							}																		
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							{realPhyAryCnt >= 2 ? (
								<ImgDomain fileWidth={24} fileName={'icon8_2.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon8.png'}/>
							)}
							<Text style={styles.regiStep5BtnLeftText}>체형</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realPhyAryCnt}가지 선택</Text>
							<ImgDomain fileWidth={20} fileName={'icon_arr1.png'}/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.regiStep5Btn}
						activeOpacity={opacityVal}
						onPress={() => {
							setPopDrink(true);
							setPreventBack(true);
							setSaveDrink(realDrink);
							setSaveSmoke(realSmoke);
							setSaveSmoke2(realSmokeSort);
						}}
					>
						<View style={styles.regiStep5BtnLeft}>
							{realDrink != undefined && realSmoke != undefined ? (								
								<ImgDomain fileWidth={24} fileName={'icon9_2.png'}/>
							) : (								
								<ImgDomain fileWidth={24} fileName={'icon9.png'}/>
							)}
							<Text style={styles.regiStep5BtnLeftText}>음주 · 흡연</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							{realDrink != undefined && realSmoke != undefined ? (
							<Text style={styles.regiStep5BtnRightText}>입력완료</Text>	
							) : null}
							<ImgDomain fileWidth={20} fileName={'icon_arr1.png'}/>
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
							{realMbti1 && realMbti2 && realMbti3 && realMbti4 ? (
								<ImgDomain fileWidth={24} fileName={'icon10_2.png'}/>								
							) : (
								<ImgDomain fileWidth={24} fileName={'icon10.png'}/>
							)}
							<Text style={styles.regiStep5BtnLeftText}>MBTI</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							<Text style={styles.regiStep5BtnRightText}>{realMbti1}{realMbti2}{realMbti3}{realMbti4}</Text>
							<ImgDomain fileWidth={20} fileName={'icon_arr1.png'}/>
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
							{realRel ? (
								<ImgDomain fileWidth={24} fileName={'icon11_2.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon11.png'}/>
							)}
							<Text style={styles.regiStep5BtnLeftText}>종교</Text>
						</View>
						<View style={styles.regiStep5BtnRight}>
							{realRel == 1 ? (<Text style={styles.regiStep5BtnRightText}>무교</Text>) : null}
							{realRel == 2 ? (<Text style={styles.regiStep5BtnRightText}>기독교</Text>) : null}
							{realRel == 3 ? (<Text style={styles.regiStep5BtnRightText}>천주교</Text>) : null}
							{realRel == 4 ? (<Text style={styles.regiStep5BtnRightText}>불교</Text>) : null}
							{realRel == 5 ? (<Text style={styles.regiStep5BtnRightText}>기타</Text>) : null}
							<ImgDomain fileWidth={20} fileName={'icon_arr1.png'}/>
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
					<Text style={styles.nextBtnText}>저장하기</Text>
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
								<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
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
								{nickCert ? null : (
									<Text style={styles.alertText}>* 이미 사용 중이거나 사용할 수 없는 닉네임 입니다.</Text>
								)}								
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
						<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
					</TouchableOpacity>			
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>성별을 선택해 주세요</Text>
					</View>
					<ScrollView>
						<View style={styles.popRadioBox}>
							<TouchableOpacity
								style={[styles.popRadioBoxBtn, realGender == 0 ? styles.popRadioBoxBtnOn : null]}
								activeOpacity={opacityVal}
								onPress={()=>{									
									setPopGender(false);
									setRealGender(0);
									setPreventBack(false);
									getPhyData(0);
								}}
							>
								<Text style={[styles.popRadioBoxBtnText, realGender == 0 ? styles.popRadioBoxBtnTextOn : null]}>남자</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.popRadioBoxBtn,  realGender == 1 ? styles.popRadioBoxBtnOn : null]}
								activeOpacity={opacityVal}
								onPress={()=>{
									setPopGender(false);
									setRealGender(1);
									setPreventBack(false);
									getPhyData(1);
								}}
							>
								<Text style={[styles.popRadioBoxBtnText, realGender == 1 ? styles.popRadioBoxBtnTextOn : null]}>여자</Text>
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
						<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
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
			<>
			<TouchableOpacity 
				style={styles.popBack} 
				activeOpacity={1} 
				onPress={()=>{
					Keyboard.dismiss();
				}}
			>
			</TouchableOpacity>	
			<View style={{...styles.prvPop, ...styles.prvPop3}}>
				<TouchableOpacity
					style={styles.pop_x}					
					onPress={() => {
						setPopLocal2(false);
						setPreventBack(false);
					}}
				>
					<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
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
							setLocalDetail1(kakaoAddr.address);
							setLocBtn(true);
						}else if(localType == 2){
							setLocal2(kakaoAddr.sido+' '+kakaoAddr.sigungu);
							setLocalDetail2(kakaoAddr.address);
						}
						setPopLocal2(false);
					}}
				/>
			</View>
			</>
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
						<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
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
							<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
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
											{jobList.map((item, index) => {
												return (
													<TouchableOpacity
														key={index}
														style={[styles.jobSelect, index == 0 ? styles.mgt0 : null]}
														activeOpacity={opacityVal}
														onPress={()=>{
															getJobData2(item.company_idx, item.company_name);															
														}}
													>
														<Text style={styles.jobSelectText}>{item.company_name}</Text>
													</TouchableOpacity>
												)
											})}
										</View>
									</ScrollView>
								</View>
								<View style={styles.jobBox}>
									<View style={styles.jobBoxTitle}>
										<Text style={styles.jobBoxTitleText}>직무</Text>
									</View>
									<ScrollView>
										<View style={styles.jobList}>
											{jobList2.map((item, index) => {
												return (
													<TouchableOpacity
														key={index}
														style={[styles.jobSelect, index == 0 ? styles.mgt0 : null]}
														activeOpacity={opacityVal}
														onPress={(v)=>{
															setJob(`${job1} (${item.career_name})`);
															setJob2(item.career_name);
															setJobBtn(true);
														}}
													>
														<Text style={styles.jobSelectText}>{item.career_name}</Text>
													</TouchableOpacity>
												)
											})}
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
						<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
					</TouchableOpacity>			
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>피지컬을 선택해 주세요</Text>
					</View>
					<ScrollView
						scrollEnabled={true}
						nestedScrollEnabled={true}
					>
						<View style={styles.popRadioBox}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>키 <Text style={styles.red}>*</Text></Text>
							</View>
							{heightList.length > 0 ? (
							<View style={styles.wheelpciker}>
								<WheelPicker
									flatListProps={{ nestedScrollEnabled: true }}									
									options={heightList}
									itemHeight={40}
									selectedIndex={heightIdx}
									visibleRest={1}
									itemTextStyle={styles.activeStyle2}
									containerStyle={styles.activeStyle3}									
									onChange={(index) => {
										//console.log(index);
										setHeightIdx(index);
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
									onPress={() => {
										if(noWeight){
											setWeightIdx(30);
											setWeight('60kg');
										}else{
											setWeight(0);
										}
										setNoWeight(!noWeight);
									}}
								>
									{noWeight ? (
										<ImgDomain fileWidth={20} fileName={'icon_chk3.png'}/>
									) : (
										<ImgDomain fileWidth={20} fileName={'icon_chk2.png'}/>
									)}
									<Text style={styles.notPickBtnText}>선택안함</Text>
								</TouchableOpacity>
							</View>
							{!noWeight && weightList.length > 0 ? (
							<View style={styles.wheelpciker}>
								<WheelPicker
									flatListProps={{ nestedScrollEnabled: true }}									
									options={weightList}
									itemHeight={40}
									selectedIndex={weightIdx}
									visibleRest={1}
									itemTextStyle={styles.activeStyle2}
									containerStyle={styles.activeStyle3}									
									onChange={(index) => {
										setWeightIdx(index);
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
									onPress={() => {
										if(noMuscle){
											setMuscleIdx(25);
											setMuscle('25kg');
										}else{
											setMuscle(0);
										}
										setNoMuscle(!noMuscle);
									}}
								>
									{noMuscle ? (
										<ImgDomain fileWidth={20} fileName={'icon_chk3.png'}/>
									) : (
										<ImgDomain fileWidth={20} fileName={'icon_chk2.png'}/>
									)}
									<Text style={styles.notPickBtnText}>선택안함</Text>
								</TouchableOpacity>
							</View>
							{!noMuscle && muscleList.length > 0 ? (
							<View style={styles.wheelpciker}>
								<WheelPicker
									flatListProps={{ nestedScrollEnabled: true }}									
									options={muscleList}
									itemHeight={40}
									selectedIndex={muscleIdx}
									visibleRest={1}
									itemTextStyle={styles.activeStyle2}
									containerStyle={styles.activeStyle3}
									onChange={(index) => {	
										setMuscleIdx(index);									
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
									onPress={() => {
										if(noMuscle){
											setFatIdx(15);
											setFat('15%');
										}else{
											setFat(0);
										}
										setNoFat(!noFat);
									}}
								>
									{noFat ? (
										<ImgDomain fileWidth={20} fileName={'icon_chk3.png'}/>
									) : (
										<ImgDomain fileWidth={20} fileName={'icon_chk2.png'}/>
									)}
									<Text style={styles.notPickBtnText}>선택안함</Text>
								</TouchableOpacity>
							</View>
							{!noFat && fatList.length > 0 ? (
							<View style={styles.wheelpciker}>
								<WheelPicker
									flatListProps={{ nestedScrollEnabled: true }}									
									options={fatList}
									itemHeight={40}
									selectedIndex={fatIdx}
									visibleRest={1}
									itemTextStyle={styles.activeStyle2}
									containerStyle={styles.activeStyle3}
									onChange={(index) => {										
										setFatIdx(index);
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
						setExeSportIdx();
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
							setExeSportIdx();
							setExeSport('');
						}}
					>
						<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
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
									<ImgDomain fileWidth={11} fileName={'icon_plus2.png'}/>
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
									<ImgDomain fileWidth={11} fileName={'icon_plus1.png'}/>
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
							keyExtractor={(item) => item.me_rank}
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
									<ImgDomain fileWidth={10} fileName={'icon_chk1.png'}/>
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
											<ImgDomain fileWidth={18} fileName={'icon_minus2.png'}/>
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
											<ImgDomain fileWidth={18} fileName={'icon_plus3.png'}/>
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
									{sportList.map((item, index) => {
										return(
											<TouchableOpacity
												key={index}
												style={[styles.phyBtn, exeSport == item.exercise_name ? styles.phyBtnOn : null]}
												activeOpacity={opacityVal}
												onPress={() => {
													setExeSportIdx(item.exercise_idx);
													setExeSport(item.exercise_name);
												}}
											>
												<Text style={[styles.phyBtnText, exeSport == item.exercise_name ? styles.phyBtnTextOn : null]}>{item.exercise_name}</Text>
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
						<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
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
											physical_ary(item.physical_idx);
											//console.log(phyAry.length);											
											//setPhyAry([item.val, ...phyAry]);
										}}
									>
										<Text style={[styles.phyBtnText, item.chk ? styles.phyBtnTextOn : null]}>{item.physical_name}</Text>
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

						setRealDrink(saveDrink);
						setRealSmoke(saveSmoke);
						setRealSmokeSort(saveSmoke2);
					}}
				>
				</TouchableOpacity>
				<View style={[styles.prvPop]}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setPopDrink(false);
							setPreventBack(false);

							setRealDrink(saveDrink);
							setRealSmoke(saveSmoke);
							setRealSmokeSort(saveSmoke2);
						}}
					>
						<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
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
											style={[styles.popRadioBoxBtn, styles.popRadioBoxBtn3, realDrink == item.val ? styles.popRadioBoxBtnOn : null]}
											activeOpacity={opacityVal}
											onPress={()=>{
												setRealDrink(item.val);
												setRealDrinkText(item.txt);
											}}
										>
											<Text style={[styles.popRadioBoxBtnText, realDrink == item.val ? styles.popRadioBoxBtnTextOn : null]}>{item.txt}</Text>
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
											style={[styles.popRadioBoxBtn, styles.popRadioBoxBtn3, realSmoke == item.val ? styles.popRadioBoxBtnOn : null]}
											activeOpacity={opacityVal}
											onPress={()=>{
												if(item.val == 0){
													setRealSmokeSort();
													setRealSmokeSortText('');
												}
												setRealSmoke(item.val);									
												setRealSmokeText(item.txt);
											}}
										>
											<Text style={[styles.popRadioBoxBtnText, realSmoke == item.val ? styles.popRadioBoxBtnTextOn : null]}>{item.txt}</Text>
										</TouchableOpacity>
									)
								})}
							</View>
						</View>
						{realSmoke && realSmoke != 0 ? (
						<View style={[styles.popRadioBox, styles.mgt30]}>
							<View style={styles.popRadioTitle}>
								<Text style={styles.popRadioTitleText}>종류</Text>
							</View>
							<View style={styles.popRadioFlex}>
								{smokeSortList.map((item, index)=>{
									return (
										<TouchableOpacity
											key={index}
											style={[styles.popRadioBoxBtn, styles.popRadioBoxBtn3, realSmokeSort == item.val ? styles.popRadioBoxBtnOn : null]}
											activeOpacity={opacityVal}
											onPress={()=>{
												setRealSmokeSort(item.val);
												setRealSmokeSortText(item.txt);
											}}
										>
											<Text style={[styles.popRadioBoxBtnText, realSmokeSort == item.val ? styles.popRadioBoxBtnTextOn : null]}>{item.txt}</Text>
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
						<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
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
										if(mbti2 != ''){ setMbti2('I'); }
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
										if(mbti2 != ''){ setMbti2('E'); }
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
										<View style={styles.popRadioBoxBtn4Img}>
											<ImgDomain fileWidth={30} fileName={'mbti_1_on.png'}/>
										</View>
									) : (
										<View style={styles.popRadioBoxBtn4Img}>
											<ImgDomain fileWidth={30} fileName={'mbti_1.png'}/>
										</View>
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
										if(mbti4 != ''){ setMbti4('N'); }
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
										if(mbti4 != ''){ setMbti4('S'); }
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
													setMbti4('S');
												}			
											}else{
												setMbti4('');
											}					
										}
									}}
								>
									{mbti4 != '' ? (										
										<View style={styles.popRadioBoxBtn4Img}>
											<ImgDomain fileWidth={30} fileName={'mbti_2_on.png'}/>
										</View>
									) : (
										<View style={styles.popRadioBoxBtn4Img}>
											<ImgDomain fileWidth={30} fileName={'mbti_2.png'}/>
										</View>
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
										if(mbti6 != ''){ setMbti6('F'); }
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
										if(mbti6 != ''){ setMbti6('T'); }
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
											ToastMessage('T 와 F 중 하나를 먼저 선택해 주세요.');
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
										<View style={styles.popRadioBoxBtn4Img}>
											<ImgDomain fileWidth={30} fileName={'mbti_3_on.png'}/>
										</View>
									) : (
										<View style={styles.popRadioBoxBtn4Img}>
											<ImgDomain fileWidth={30} fileName={'mbti_3.png'}/>
										</View>
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
										if(mbti8 != ''){ setMbti8('P'); }
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
										if(mbti8 != ''){ setMbti8('J'); }
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
											ToastMessage('J 와 P 중 하나를 먼저 선택해 주세요.');
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
										<View style={styles.popRadioBoxBtn4Img}>
											<ImgDomain fileWidth={30} fileName={'mbti_4_on.png'}/>
										</View>
									) : (
										<View style={styles.popRadioBoxBtn4Img}>
											<ImgDomain fileWidth={30} fileName={'mbti_4.png'}/>
										</View>
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
						<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
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
										style={[styles.popRadioBoxBtn, item.religion_idx == realRel ? styles.popRadioBoxBtnOn : null]}
										activeOpacity={opacityVal}
										onPress={()=>{
											setPopRel(false);
											setRealRel(item.religion_idx);
											setPreventBack(false);
										}}
									>
										<Text style={[styles.popRadioBoxBtnText, item.religion_idx == realRel ? styles.popRadioBoxBtnTextOn : null]}>{item.religion_name}</Text>
									</TouchableOpacity>
								)
							})}
						</View>
					</ScrollView>
				</View>
			</View>
			) : null}

			{loading ? (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
      ) : null}

		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },	
	gapBox: {height:86,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

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
	popRadioBoxBtn4TextDesc: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:15,color:'#666'},

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

export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
		member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
		member_out: (user) => dispatch(UserAction.member_out(user)), //회원탈퇴
	})
)(MyInfo);