import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import FlipComponent from 'react-native-flip-component';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';

import Font from "../assets/common/Font";
import ToastMessage from "../components/ToastMessage";

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const Home = (props) => {
	const cardData = [
		{ 'idx': 1, 'isFlipped':false, 'name':'닉네임최대여덟1', 'job':'CEO', 'age':'99', 'area':'서울 강남구', 'height':180, 'weight':70, 'badgeCnt':4, 'img':'man.png', 'dday':7, 'open':true },
		{ 'idx': 2, 'isFlipped':false, 'name':'닉네임최대여덟1', 'job':'디자이너', 'age':'00', 'area':'경기 부천시', 'height':181, 'weight':71, 'badgeCnt':3, 'img':'woman.png', 'dday':7, 'open':true },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟1', 'job':'요리사', 'age':'01', 'area':'전남 곡성군', 'height':182, 'weight':72, 'badgeCnt':2, 'img':'man.png', 'dday':7, 'open':false },
		{ 'idx': 4, 'isFlipped':false, 'name':'닉네임최대여덟1', 'job':'변호사', 'age':'02', 'area':'서울 용산구', 'height':183, 'weight':73, 'badgeCnt':1, 'img':'woman.png', 'dday':7, 'open':false },
		{ 'idx': 5, 'isFlipped':false, 'name':'닉네임최대여덟2', 'job':'CEO', 'age':'99', 'area':'서울 강남구', 'height':180, 'weight':70, 'badgeCnt':4, 'img':'man.png', 'dday':6, 'open':false },
		{ 'idx': 6, 'isFlipped':false, 'name':'닉네임최대여덟2', 'job':'디자이너', 'age':'00', 'area':'경기 부천시', 'height':181, 'weight':71, 'badgeCnt':3, 'img':'woman.png', 'dday':6, 'open':false },
		{ 'idx': 7, 'isFlipped':false, 'name':'닉네임최대여덟2', 'job':'요리사', 'age':'01', 'area':'전남 곡성군', 'height':182, 'weight':72, 'badgeCnt':2, 'img':'man.png', 'dday':6, 'open':false },
		{ 'idx': 8, 'isFlipped':false, 'name':'닉네임최대여덟2', 'job':'변호사', 'age':'02', 'area':'서울 용산구', 'height':183, 'weight':73, 'badgeCnt':1, 'img':'woman.png', 'dday':6, 'open':false },
		{ 'idx': 9, 'isFlipped':false, 'name':'닉네임최대여덟3', 'job':'CEO', 'age':'99', 'area':'서울 강남구', 'height':180, 'weight':70, 'badgeCnt':4, 'img':'man.png', 'dday':5, 'open':false },
		{ 'idx': 10, 'isFlipped':false, 'name':'닉네임최대여덟3', 'job':'디자이너', 'age':'00', 'area':'경기 부천시', 'height':181, 'weight':71, 'badgeCnt':3, 'img':'woman.png', 'dday':5, 'open':false },
		{ 'idx': 11, 'isFlipped':false, 'name':'닉네임최대여덟3', 'job':'요리사', 'age':'01', 'area':'전남 곡성군', 'height':182, 'weight':72, 'badgeCnt':2, 'img':'man.png', 'dday':5, 'open':false },
		{ 'idx': 12, 'isFlipped':false, 'name':'닉네임최대여덟3', 'job':'변호사', 'age':'02', 'area':'서울 용산구', 'height':183, 'weight':73, 'badgeCnt':1, 'img':'woman.png', 'dday':5, 'open':false },
	];

	const Data1 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];

	const Data2 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
		{ 'idx': 4, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 5, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 6, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },	
	];

	const Data3 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];

	const Data4 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];
	
	const Data5 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];

	const Data6 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];

	const Data7 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },				
	];

	const Data8 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
		{ 'idx': 4, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 5, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 6, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];
	
	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);

	const [tabState, setTabState] = useState(1); //추천, 관심	
	const [tabState2, setTabState2] = useState(1); //관심[ 찜&교환, 호감, 매칭된 ]
	const [todayFree, setTodayFree] = useState(2);
	const [nonCollidingMultiSliderValue, setNonCollidingMultiSliderValue] = useState([]);
	const [cardList, setCardList] = useState(cardData);	
	const [data1List, setData1List] = useState(Data1);
	const [data2List, setData2List] = useState(Data2);
	const [data3List, setData3List] = useState(Data3);
	const [data4List, setData4List] = useState(Data4);
	const [data5List, setData5List] = useState(Data5);
	const [data6List, setData6List] = useState(Data6);
	const [data7List, setData7List] = useState(Data7);
	const [data8List, setData8List] = useState(Data8);

	const [welcomePop, setWelcomePop] = useState(false);
	const [filterPop, setFilterPop] = useState(false);
	const [leavePop, setLeavePop] = useState(false);
	const [addIntroPop, setAddIntroPop] = useState(false);
	const [unAddIntroPop1, setUnAddIntroPop1] = useState(false);
	const [unAddIntroPop2, setUnAddIntroPop2] = useState(false);
	const [cashPop, setCashPop] = useState(false);

	const [filterSave, setFilterSave] = useState(false);
	const [ageAry, setAgeAry] = useState([]);
	const [ageAryIdx, setAgeAryIdx] = useState([]);
	const [ageMinInt, setAgeMinInt] = useState();
	const [ageMaxInt, setAgeMaxInt] = useState();
	const [ageMin, setAgeMin] = useState('');
	const [ageMax, setAgeMax] = useState('');
	const [ageMin2, setAgeMin2] = useState('');
	const [ageMax2, setAgeMax2] = useState('');
	const [realAgeMin, setRealAgeMin] = useState('');
	const [realAgeMax, setRealAgeMax] = useState('');
	const [realAgeMin2, setRealAgeMin2] = useState('');
	const [realAgeMax2, setRealAgeMax2] = useState('');
	const [distanceStandard, setDistanceStandard] = useState(1);
	const [distance, setDistance] = useState(50);
	const [distance2, setDistance2] = useState(50);
	const [recentAccess, setRecentAccess] = useState(7);
	const [prdIdx, setPrdIdx] = useState(1);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){

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
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

	useEffect(() => {
		if(tabState == 1){
			let cont = cardList.map((item) => {				
				if (item.open) {
					return { ...item, isFlipped: true };					
				}else{
					return {...item, isFlipped: item.isFlipped};
				}
			});
			
			setTimeout(function(){
				setCardList(cont);		
			}, 700);
		}
	}, []);

	useEffect(() => {
		const date = new Date();
		const year = (date.getFullYear())-50;
		const year2 = (date.getFullYear())-20;

		let yaerAry = [];
		let yaerAryIdx = [];
		let cnt = 0;
		for(let i=year; i<=year2; i++){
			yaerAry.unshift(i);
			yaerAryIdx.push(cnt);
			cnt++;
		}
		setAgeAry(yaerAry);
		setAgeAryIdx(yaerAryIdx);

		const yearVal = year+4;
		const yearVal2 = year2-5;
		
		let yearString = yearVal.toString();
		yearString = yearString.substr(2,2);		

		let yearString2 = yearVal2.toString();
		yearString2 = yearString2.substr(2,2);
		
		setAgeMin((yearString2).toString());
		setAgeMax((yearString).toString());
		setAgeMin2((yearString2).toString());
		setAgeMax2((yearString).toString());
		setAgeMinInt(5);
		setAgeMaxInt(cnt-5);
		setNonCollidingMultiSliderValue([5, cnt-5]);
	}, []);

	const getMatchCard = async(v) => {
		setTabState(v);
	}

	const chgFlipped = (idx) => {				
		let cont = cardList.map((item) => {
			if (item.idx === idx) {
				//console.log(item.idx+'///'+item.isFlipped);
				if(item.isFlipped){
					return { ...item, isFlipped: false };
				}else{
					return { ...item, isFlipped: true };
				}
			}else{
				return {...item, isFlipped: item.isFlipped};
			}
		});
		//console.log(cont);
		setCardList(cont);		
	}

	const ViewDetail = () => {
		//포인트 있는지 체크 후 결제 유도 or 상세페이지 이동		
		navigation.navigate('MatchDetail')
	}

	const getInterest = async(v) => {
		setTabState2(v);
	}

	const chgFlipped2 = (list, idx) => {
		let db = '';
		if(list == 'data1'){
			db = data1List;
		}else if(list == 'data2'){
			db = data2List;
		}else if(list == 'data3'){
			db = data3List;
		}else if(list == 'data4'){
			db = data4List;
		}else if(list == 'data5'){
			db = data5List;
		}else if(list == 'data6'){
			db = data6List;
		}else if(list == 'data7'){
			db = data7List;
		}else if(list == 'data8'){
			db = data8List;
		}

		let cont = db.map((item) => {
			if (item.idx === idx) {
				//console.log(item.idx+'///'+item.isFlipped);
				if(item.isFlipped){
					return { ...item, isFlipped: false };
				}else{
					return { ...item, isFlipped: true };
				}
			}else{
				return {...item, isFlipped: item.isFlipped};
			}
		});
		
		if(list == 'data1'){
			setData1List(cont);
		}else if(list == 'data2'){
			setData2List(cont);
		}else if(list == 'data3'){
			setData3List(cont);
		}else if(list == 'data4'){
			setData4List(cont);
		}else if(list == 'data5'){
			setData5List(cont);
		}else if(list == 'data6'){
			setData6List(cont);
		}else if(list == 'data7'){
			setData7List(cont);
		}else if(list == 'data8'){
			setData8List(cont);
		}	
	} 
	

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<View style={styles.header}>
				<View style={styles.headerTop}>
					<View style={styles.headerTitle}>
						<Text style={styles.headerTitleText}>Matching</Text>
					</View>
					<View style={styles.headerLnb}>
						<TouchableOpacity
							activeOpacity={opacityVal}
							onPress={() => {setFilterPop(true)}}
						>
							<AutoHeightImage width={24} source={require('../assets/image/icon_option.png')} resizeMethod='resize' />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {}}							
						>
							<AutoHeightImage width={24} source={require('../assets/image/icon_shop.png')} resizeMethod='resize' />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {}}
						>
							<AutoHeightImage width={24} source={require('../assets/image/icon_alim_off.png')} resizeMethod='resize' />
							{/* <AutoHeightImage width={24} source={require('../assets/image/icon_alim_on.png')} resizeMethod='resize' /> */}
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.headerBot}>
					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {getMatchCard(1)}}
					>
						<Text style={[styles.headerTabText, tabState == 1 ? styles.headerTabTextOn : null]}>추천카드</Text>
						{tabState == 1 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {getMatchCard(2)}}
					>
						<Text style={[styles.headerTabText, tabState == 2 ? styles.headerTabTextOn : null]}>관심카드</Text>
						{tabState == 2 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>
				</View>
			</View>

			{tabState == 2 ? (
			<View style={styles.state2Tab}>
				<TouchableOpacity
					style={styles.state2TabBtn}
					activeOpacity={opacityVal}
					onPress={()=>{getInterest(1)}}
				>
					<Text style={[styles.state2TabBtnText, tabState2 == 1 ? styles.state2TabBtnTextOn : null]}>찜&교환한 카드</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.state2TabBtn}
					activeOpacity={opacityVal}
					onPress={()=>{getInterest(2)}}
				>
					<Text style={[styles.state2TabBtnText, tabState2 == 2 ? styles.state2TabBtnTextOn : null]}>호감 카드</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.state2TabBtn}
					activeOpacity={opacityVal}
					onPress={()=>{getInterest(3)}}
				>
					<Text style={[styles.state2TabBtnText, tabState2 == 3 ? styles.state2TabBtnTextOn : null]}>매칭된 카드</Text>
				</TouchableOpacity>
			</View>
			) : null}

			<ScrollView>
				<View style={[styles.cmWrap, tabState == 1 ? styles.cmWrap2 : null]}>					
					<View style={tabState == 2 ? styles.displayNone : null}>
						<View style={styles.todayFreeArea}>
							<View style={[styles.todayFreeAreaWrap, styles.boxShadow]}>
								<LinearGradient
									colors={['#D1913C', '#FFD194', '#D1913C']}
									start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
									style={[styles.grediant]}
								>
									{todayFree > 0 ? (
										<TouchableOpacity
											style={[styles.todayFreeBtn]}
											activeOpacity={opacityVal}
											onPress={() => {
												// if(todayFree < 1){
												// 	ToastMessage('이미 모두 사용했습니다.');
												// 	return false;
												// }
												setTodayFree(todayFree - 1);
											}}
										>
											<Text style={styles.todayFreeBtnText}>무료 소개 받기 ({todayFree}/2)</Text>
										</TouchableOpacity>
									) : (
										<>
										<TouchableOpacity
											style={[styles.todayFreeBtn]}
											activeOpacity={opacityVal}
											onPress={() => setAddIntroPop(true)}
										>
											<Text style={styles.todayFreeBtnText}>추가 소개 받기 (00개)</Text>
										</TouchableOpacity>

										<TouchableOpacity
											style={[styles.todayFreeBtn, styles.mgt10]}
											activeOpacity={opacityVal}
											onPress={() => {
												if(filterSave){
													setUnAddIntroPop2(true);
												}else{
													setUnAddIntroPop1(true);
												}
											}}
										>
											<Text style={styles.todayFreeBtnText}>추가 소개 받기 불가</Text>
										</TouchableOpacity>
										</>
									)}
								</LinearGradient>
							</View>
						</View>

						{/* D-7 */}
						<View style={styles.cardView}>
							<View style={styles.dday}>
								<View style={styles.ddayLine}></View>
								<Text style={styles.ddayText}>D-7</Text>
							</View>
							{cardList.map((item, index) => {
								return (	
									item.dday == 7 ? (							
									<TouchableOpacity 
										key={item.idx}
										style={styles.cardBtn}
										activeOpacity={opacityVal}
										onPress={() => {
											if(item.isFlipped){
												ViewDetail();
											}else{
												chgFlipped(item.idx);
											}
										}}
									>
										<FlipComponent
											isFlipped={item.isFlipped}
											scale={1}
											scaleDuration= {0}
											rotateDuration={200}
											frontView={		
												<View style={[styles.cardCont]}>																												
													<AutoHeightImage width={(innerWidth/2)-10} source={require('../assets/image/front.png')} resizeMethod='resize' />													
												</View>												
											}
											backView={
												<View style={[styles.cardCont]}>													
													<View style={styles.cardFrontInfo}>
														<AutoHeightImage width={(innerWidth/2)-10} source={require('../assets/image/front.png')} style={styles.peopleImgBack} resizeMethod='resize' />
														<AutoHeightImage width={(innerWidth/2)-10} source={require('../assets/image/man.png')} style={styles.peopleImg} resizeMethod='resize' />
														<View style={[styles.cardFrontInfoCont, styles.boxShadow2]}>
															<View style={styles.cardFrontNick}>
																<Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText}>{item.name}</Text>
																{item.badgeCnt == 1 ? (<AutoHeightImage width={26} source={require('../assets/image/b_1.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 2 ? (<AutoHeightImage width={26} source={require('../assets/image/b_2.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 3 ? (<AutoHeightImage width={26} source={require('../assets/image/b_3.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 4 ? (<AutoHeightImage width={26} source={require('../assets/image/b_4.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 5 ? (<AutoHeightImage width={26} source={require('../assets/image/b_5.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 6 ? (<AutoHeightImage width={26} source={require('../assets/image/b_6.png')} resizeMethod='resize' />) : null}
															</View>
															<View style={styles.cardFrontJob}>
																<Text style={styles.cardFrontJobText}>{item.job}</Text>
															</View>
															<View style={styles.cardFrontContBox}>
																<Text style={[styles.cardFrontContText, styles.cardFrontContTextRoboto]}>{item.age}</Text>
																<View style={styles.cardFrontContLine}></View>
																<Text style={styles.cardFrontContText}>{item.area}</Text>
															</View>
															<View style={[styles.cardFrontContBox, styles.mgt4]}>
																<Text style={[styles.cardFrontContText, styles.cardFrontContTextRoboto]}>{item.height}cm</Text>
																<View style={styles.cardFrontContLine}></View>
																<Text style={[styles.cardFrontContText, styles.cardFrontContTextRoboto]}>{item.weight}kg</Text>
															</View>
														</View>
													</View>
												</View>
											}
										/>
									</TouchableOpacity>
									) : null				
								)
							})}
						</View>

						{/* D-6 */}
						<View style={styles.cardView}>
							<View style={styles.dday}>
								<View style={styles.ddayLine}></View>
								<Text style={styles.ddayText}>D-6</Text>
							</View>
							{cardList.map((item, index) => {
								return (	
									item.dday == 6 ? (							
									<TouchableOpacity 
										key={item.idx}
										style={styles.cardBtn}
										activeOpacity={opacityVal}
										onPress={() => {
											if(item.isFlipped){
												ViewDetail();
											}else{
												chgFlipped(item.idx);
											}
										}}
									>
										<FlipComponent
											isFlipped={item.isFlipped}
											scale={1}
											scaleDuration= {0}
											rotateDuration={200}
											frontView={	
												<View style={[styles.cardCont]}>																												
													<AutoHeightImage width={(innerWidth/2)-10} source={require('../assets/image/front.png')} resizeMethod='resize' />													
												</View>												
											}
											backView={
												<View style={[styles.cardCont]}>													
													<View style={styles.cardFrontInfo}>
														<AutoHeightImage width={(innerWidth/2)-10} source={require('../assets/image/front.png')} style={styles.peopleImgBack} resizeMethod='resize' />
														<AutoHeightImage width={(innerWidth/2)-10} source={require('../assets/image/man.png')} style={styles.peopleImg} resizeMethod='resize' />
														<View style={[styles.cardFrontInfoCont, styles.boxShadow2]}>
															<View style={styles.cardFrontNick}>
																<Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText}>{item.name}</Text>
																{item.badgeCnt == 1 ? (<AutoHeightImage width={26} source={require('../assets/image/b_1.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 2 ? (<AutoHeightImage width={26} source={require('../assets/image/b_2.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 3 ? (<AutoHeightImage width={26} source={require('../assets/image/b_3.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 4 ? (<AutoHeightImage width={26} source={require('../assets/image/b_4.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 5 ? (<AutoHeightImage width={26} source={require('../assets/image/b_5.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 6 ? (<AutoHeightImage width={26} source={require('../assets/image/b_6.png')} resizeMethod='resize' />) : null}
															</View>
															<View style={styles.cardFrontJob}>
																<Text style={styles.cardFrontJobText}>{item.job}</Text>
															</View>
															<View style={styles.cardFrontContBox}>
																<Text style={styles.cardFrontContText}>{item.age}</Text>
																<View style={styles.cardFrontContLine}></View>
																<Text style={styles.cardFrontContText}>{item.area}</Text>
															</View>
															<View style={styles.cardFrontContBox}>
																<Text style={styles.cardFrontContText}>{item.height}cm</Text>
																<View style={styles.cardFrontContLine}></View>
																<Text style={styles.cardFrontContText}>{item.weight}kg</Text>
															</View>
														</View>
													</View>
												</View>
											}
										/>
									</TouchableOpacity>
									) : null				
								)
							})}
						</View>

						{/* D-5 */}
						<View style={styles.cardView}>
							<View style={styles.dday}>
								<View style={styles.ddayLine}></View>
								<Text style={styles.ddayText}>D-5</Text>
							</View>
							{cardList.map((item, index) => {
								return (	
									item.dday == 5 ? (							
									<TouchableOpacity 
										key={item.idx}
										style={styles.cardBtn}
										activeOpacity={opacityVal}
										onPress={() => {
											if(item.isFlipped){
												ViewDetail();
											}else{
												chgFlipped(item.idx);
											}
										}}
									>
										<FlipComponent
											isFlipped={item.isFlipped}
											scale={1}
											scaleDuration= {0}
											rotateDuration={200}
											frontView={			
												<View style={[styles.cardCont]}>																												
													<AutoHeightImage width={(innerWidth/2)-10} source={require('../assets/image/front.png')} resizeMethod='resize' />													
												</View>											
											}
											backView={
												<View style={[styles.cardCont]}>													
													<View style={styles.cardFrontInfo}>
														<AutoHeightImage width={(innerWidth/2)-10} source={require('../assets/image/front.png')} style={styles.peopleImgBack} resizeMethod='resize' />
														<AutoHeightImage width={(innerWidth/2)-10} source={require('../assets/image/man.png')} style={styles.peopleImg} resizeMethod='resize' />
														<View style={[styles.cardFrontInfoCont, styles.boxShadow2]}>
															<View style={styles.cardFrontNick}>
																<Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText}>{item.name}</Text>
																{item.badgeCnt == 1 ? (<AutoHeightImage width={26} source={require('../assets/image/b_1.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 2 ? (<AutoHeightImage width={26} source={require('../assets/image/b_2.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 3 ? (<AutoHeightImage width={26} source={require('../assets/image/b_3.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 4 ? (<AutoHeightImage width={26} source={require('../assets/image/b_4.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 5 ? (<AutoHeightImage width={26} source={require('../assets/image/b_5.png')} resizeMethod='resize' />) : null}
																{item.badgeCnt == 6 ? (<AutoHeightImage width={26} source={require('../assets/image/b_6.png')} resizeMethod='resize' />) : null}
															</View>
															<View style={styles.cardFrontJob}>
																<Text style={styles.cardFrontJobText}>{item.job}</Text>
															</View>
															<View style={styles.cardFrontContBox}>
																<Text style={styles.cardFrontContText}>{item.age}</Text>
																<View style={styles.cardFrontContLine}></View>
																<Text style={styles.cardFrontContText}>{item.area}</Text>
															</View>
															<View style={styles.cardFrontContBox}>
																<Text style={styles.cardFrontContText}>{item.height}cm</Text>
																<View style={styles.cardFrontContLine}></View>
																<Text style={styles.cardFrontContText}>{item.weight}kg</Text>
															</View>
														</View>
													</View>
												</View>
											}
										/>
									</TouchableOpacity>
									) : null				
								)
							})}
						</View>

					</View>
					
					<View style={tabState == 1 ? styles.displayNone : null}>
						<View style={tabState2 != 1 ? styles.displayNone : null}>			
							{/* 찜한 카드	*/}
							<View style={styles.interestBox}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>찜한 카드</Text>
								</View>
								<View style={styles.cardView}>
									{data1List.map((item, index) => {
										return (
											<TouchableOpacity 
												key={item.idx}
												style={[styles.cardBtn, styles.cardBtn2]}
												activeOpacity={opacityVal}
												onPress={() => {
													if(item.leave && !item.isFlipped){
														//chgFlipped2('data1', item.idx);
														setLeavePop(true);
													}else if(!item.leave && item.isFlipped){
														ViewDetail();
													}
												}}
											>
												<FlipComponent
													isFlipped={item.isFlipped}
													scale={1}
													scaleDuration= {0}
													rotateDuration={200}
													frontView={	
														item.leave ? (
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
															</View>
														) : (
															<View style={[styles.cardCont, styles.cardCont2]}>		
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																<View style={[styles.cardFrontInfo, styles.cardFrontInfo2]}>
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/woman2.png')} style={styles.peopleImg} resizeMethod='resize' />
																	<View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont2, styles.boxShadow2]}>
																		<View	View style={styles.cardFrontDday}>
																			<Text style={styles.cardFrontDdayText}>D-{item.dday}</Text>
																		</View>
																		<View style={styles.cardFrontNick2}>
																			<Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.name}</Text>
																		</View>
																		<View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.age}</Text>
																			<View style={styles.cardFrontContLine}></View>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.height}cm</Text>
																		</View>
																	</View>
																</View>
															</View>
														)																			
													}
													backView={
														<View style={[styles.cardCont, styles.cardCont2]}>																												
															<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
														</View>
													}
												/>
											</TouchableOpacity>
										)
									})}
								</View>
							</View>

							{/* 교환한 프로필 */}
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>교환한 프로필</Text>
								</View>
								<View style={styles.cardView}>
									{data2List.map((item, index) => {
										return (
											<TouchableOpacity 
												key={item.idx}
												style={[styles.cardBtn, styles.cardBtn2]}
												activeOpacity={opacityVal}
												onPress={() => {													
													if(item.leave && !item.isFlipped){
														//chgFlipped2('data2', item.idx);
														setLeavePop(true);
													}else if(!item.leave && item.isFlipped){
														ViewDetail();
													}
												}}
											>
												<FlipComponent
													isFlipped={item.isFlipped}
													scale={1}
													scaleDuration= {0}
													rotateDuration={200}
													frontView={		
														item.leave ? (
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
															</View>
														) : (
															<View style={[styles.cardCont, styles.cardCont2]}>		
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																<View style={[styles.cardFrontInfo, styles.cardFrontInfo2]}>
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/woman2.png')} style={styles.peopleImg} resizeMethod='resize' />
																	<View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont2, styles.boxShadow2]}>
																		<View	View style={styles.cardFrontDday}>
																			<Text style={styles.cardFrontDdayText}>D-{item.dday}</Text>
																		</View>
																		<View style={styles.cardFrontNick2}>
																			<Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.name}</Text>
																		</View>
																		<View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.age}</Text>
																			<View style={styles.cardFrontContLine}></View>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.height}cm</Text>
																		</View>
																	</View>
																</View>
															</View>
														)																								
													}
													backView={
														<View style={[styles.cardCont, styles.cardCont2, styles.boxShadow]}>																												
															<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />
														</View>	
													}
												/>
											</TouchableOpacity>
										)
									})}
								</View>
							</View>
						</View>

						<View style={tabState2 != 2 ? styles.displayNone : null}>				
							{/* 받은 좋아요 */}
							<View style={styles.interestBox}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>받은 좋아요</Text>
								</View>
								<View style={styles.cardView}>
									{data3List.map((item, index) => {
										return (
											<TouchableOpacity 
												key={item.idx}
												style={[styles.cardBtn, styles.cardBtn2]}
												activeOpacity={opacityVal}
												onPress={() => {
													if(item.leave && !item.isFlipped){
														//chgFlipped2('data3', item.idx);
														setLeavePop(true);
													}else if(!item.leave && item.isFlipped){
														ViewDetail();
													}
												}}
											>
												<FlipComponent
													isFlipped={item.isFlipped}
													scale={1}
													scaleDuration= {0}
													rotateDuration={200}
													frontView={			
														item.leave ? (
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
															</View>
														) : (
															<View style={[styles.cardCont, styles.cardCont2]}>		
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																<View style={[styles.cardFrontInfo, styles.cardFrontInfo2]}>
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/woman2.png')} style={styles.peopleImg} resizeMethod='resize' />
																	<View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont2, styles.boxShadow2]}>
																		<View	View style={styles.cardFrontDday}>
																			<Text style={styles.cardFrontDdayText}>D-{item.dday}</Text>
																		</View>
																		<View style={styles.cardFrontNick2}>
																			<Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.name}</Text>
																		</View>
																		<View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.age}</Text>
																			<View style={styles.cardFrontContLine}></View>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.height}cm</Text>
																		</View>
																	</View>
																</View>
															</View>
														)																										
													}
													backView={
														<View style={[styles.cardCont, styles.cardCont2]}>																												
															<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
														</View>	
													}
												/>
											</TouchableOpacity>
										)
									})}
								</View>
							</View>
							
							{/* 보낸 좋아요 */}
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>보낸 좋아요</Text>
								</View>
								<View style={styles.cardView}>
									{data4List.map((item, index) => {
										return (
											<TouchableOpacity 
												key={item.idx}
												style={[styles.cardBtn, styles.cardBtn2]}
												activeOpacity={opacityVal}
												onPress={() => {
													if(item.leave && !item.isFlipped){
														//chgFlipped2('data4', item.idx);
														setLeavePop(true);
													}else if(!item.leave && item.isFlipped){
														ViewDetail();
													}
												}}
											>
												<FlipComponent
													isFlipped={item.isFlipped}
													scale={1}
													scaleDuration= {0}
													rotateDuration={200}
													frontView={			
														item.leave ? (
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
															</View>
														) : (
															<View style={[styles.cardCont, styles.cardCont2]}>		
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																<View style={[styles.cardFrontInfo, styles.cardFrontInfo2]}>
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/woman2.png')} style={styles.peopleImg} resizeMethod='resize' />
																	<View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont2, styles.boxShadow2]}>
																		<View	View style={styles.cardFrontDday}>
																			<Text style={styles.cardFrontDdayText}>D-{item.dday}</Text>
																		</View>
																		<View style={styles.cardFrontNick2}>
																			<Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.name}</Text>
																		</View>
																		<View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.age}</Text>
																			<View style={styles.cardFrontContLine}></View>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.height}cm</Text>
																		</View>
																	</View>
																</View>
															</View>
														)																									
													}
													backView={
														<View style={[styles.cardCont, styles.cardCont2]}>																												
															<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
														</View>	
													}
												/>
											</TouchableOpacity>
										)
									})}
								</View>
							</View>

							{/* 주고받은 호감 */}
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>주고받은 호감</Text>
								</View>
								<View style={styles.cardView}>
									{data5List.map((item, index) => {
										return (
											<TouchableOpacity 
												key={item.idx}
												style={[styles.cardBtn, styles.cardBtn2]}
												activeOpacity={opacityVal}
												onPress={() => {
													if(item.leave && !item.isFlipped){
														//chgFlipped2('data5', item.idx);
														setLeavePop(true);
													}else if(!item.leave && item.isFlipped){
														ViewDetail();
													}
												}}
											>
												<FlipComponent
													isFlipped={item.isFlipped}
													scale={1}
													scaleDuration= {0}
													rotateDuration={200}
													frontView={			
														item.leave ? (
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
															</View>
														) : (
															<View style={[styles.cardCont, styles.cardCont2]}>		
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																<View style={[styles.cardFrontInfo, styles.cardFrontInfo2]}>
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/woman2.png')} style={styles.peopleImg} resizeMethod='resize' />
																	<View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont2, styles.boxShadow2]}>
																		<View	View style={styles.cardFrontDday}>
																			<Text style={styles.cardFrontDdayText}>D-{item.dday}</Text>
																		</View>
																		<View style={styles.cardFrontNick2}>
																			<Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.name}</Text>
																		</View>
																		<View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.age}</Text>
																			<View style={styles.cardFrontContLine}></View>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.height}cm</Text>
																		</View>
																	</View>
																</View>
															</View>
														)																									
													}
													backView={
														<View style={[styles.cardCont, styles.cardCont2]}>																												
															<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
														</View>
													}
												/>
											</TouchableOpacity>
										)
									})}
								</View>
							</View>

							{/* 받은 호감 */}
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>받은 호감</Text>
								</View>
								<View style={styles.cardView}>
									{data6List.map((item, index) => {
										return (
											<TouchableOpacity 
												key={item.idx}
												style={[styles.cardBtn, styles.cardBtn2]}
												activeOpacity={opacityVal}
												onPress={() => {
													if(item.leave && !item.isFlipped){
														//chgFlipped2('data6', item.idx);
														setLeavePop(true);
													}else if(!item.leave && item.isFlipped){
														ViewDetail();
													}
												}}
											>
												<FlipComponent
													isFlipped={item.isFlipped}
													scale={1}
													scaleDuration= {0}
													rotateDuration={200}
													frontView={			
														item.leave ? (
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
															</View>
														) : (
															<View style={[styles.cardCont, styles.cardCont2]}>		
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																<View style={[styles.cardFrontInfo, styles.cardFrontInfo2]}>
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/woman2.png')} style={styles.peopleImg} resizeMethod='resize' />
																	<View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont2, styles.boxShadow2]}>
																		<View	View style={styles.cardFrontDday}>
																			<Text style={styles.cardFrontDdayText}>D-{item.dday}</Text>
																		</View>
																		<View style={styles.cardFrontNick2}>
																			<Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.name}</Text>
																		</View>
																		<View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.age}</Text>
																			<View style={styles.cardFrontContLine}></View>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.height}cm</Text>
																		</View>
																	</View>
																</View>
															</View>
														)																										
													}
													backView={
														<View style={[styles.cardCont, styles.cardCont2]}>																												
															<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
														</View>	
													}
												/>
											</TouchableOpacity>
										)
									})}
								</View>
							</View>

							{/* 보낸 호감 */}
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>보낸 호감</Text>
								</View>
								<View style={styles.cardView}>
									{data7List.map((item, index) => {
										return (
											<TouchableOpacity 
												key={item.idx}
												style={[styles.cardBtn, styles.cardBtn2]}
												activeOpacity={opacityVal}
												onPress={() => {
													if(item.leave && !item.isFlipped){
														//chgFlipped2('data7', item.idx);
														setLeavePop(true);
													}else if(!item.leave && item.isFlipped){
														ViewDetail();
													}
												}}
											>
												<FlipComponent
													isFlipped={item.isFlipped}
													scale={1}
													scaleDuration= {0}
													rotateDuration={200}
													frontView={			
														item.leave ? (
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
															</View>
														) : (
															<View style={[styles.cardCont, styles.cardCont2]}>		
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																<View style={[styles.cardFrontInfo, styles.cardFrontInfo2]}>
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/woman2.png')} style={styles.peopleImg} resizeMethod='resize' />
																	<View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont2, styles.boxShadow2]}>
																		<View	View style={styles.cardFrontDday}>
																			<Text style={styles.cardFrontDdayText}>D-{item.dday}</Text>
																		</View>
																		<View style={styles.cardFrontNick2}>
																			<Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.name}</Text>
																		</View>
																		<View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.age}</Text>
																			<View style={styles.cardFrontContLine}></View>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.height}cm</Text>
																		</View>
																	</View>
																</View>
															</View>
														)																										
													}
													backView={
														<View style={[styles.cardCont, styles.cardCont2]}>																												
															<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
														</View>	
													}
												/>
											</TouchableOpacity>
										)
									})}
								</View>
							</View>							
						</View>

						<View style={tabState2 != 3 ? styles.displayNone : null}>			
							{/* 매칭된 이성 */}
							<View style={styles.interestBox}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>매칭된 이성</Text>
								</View>
								<View style={styles.interestBoxDesc}>
									<Text style={styles.interestBoxDescText}>매칭을 축하합니다!</Text>
									<AutoHeightImage width={12} source={require('../assets/image/icon_pang.png')} resizeMethod='resize' />
								</View>
								<View style={styles.cardView}>
									{data8List.map((item, index) => {
										return (
											<TouchableOpacity 
												key={item.idx}
												style={[styles.cardBtn, styles.cardBtn2]}
												activeOpacity={opacityVal}
												onPress={() => {
													if(item.leave && !item.isFlipped){
														//chgFlipped2('data8', item.idx);
														setLeavePop(true);
													}else if(!item.leave && item.isFlipped){
														ViewDetail();
													}
												}}
											>
												<FlipComponent
													isFlipped={item.isFlipped}
													scale={1}
													scaleDuration= {0}
													rotateDuration={200}
													frontView={			
														item.leave ? (
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
															</View>
														) : (
															<View style={[styles.cardCont, styles.cardCont2]}>		
																<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																<View style={[styles.cardFrontInfo, styles.cardFrontInfo2]}>
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} style={styles.peopleImgBack} resizeMethod='resize' />
																	<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/woman2.png')} style={styles.peopleImg} resizeMethod='resize' />
																	<View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont2, styles.boxShadow2]}>
																		<View	View style={styles.cardFrontDday}>
																			<Text style={styles.cardFrontDdayText}>D-{item.dday}</Text>
																		</View>
																		<View style={styles.cardFrontNick2}>
																			<Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.name}</Text>
																		</View>
																		<View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.age}</Text>
																			<View style={styles.cardFrontContLine}></View>
																			<Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.height}cm</Text>
																		</View>
																	</View>
																</View>
															</View>
														)																									
													}
													backView={
														<View style={[styles.cardCont, styles.cardCont2]}>																												
															<AutoHeightImage width={(innerWidth/3)-7} source={require('../assets/image/front2.png')} resizeMethod='resize' />													
														</View>	
													}
												/>
											</TouchableOpacity>
										)
									})}
								</View>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
			<View style={styles.gapBox}></View>			

			{/* 필터 */}
			<Modal
				visible={filterPop}
				animationType={"none"}
				onRequestClose={() => setFilterPop(false)}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.modalHeader}>					
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {
							setFilterPop(false);
						}}						
					>
						<AutoHeightImage width={8} source={require("../assets/image/icon_header_back.png")} resizeMethod='resize' />
					</TouchableOpacity>		
					<TouchableOpacity 
						style={styles.filterResetBtn}
						activeOpacity={opacityVal}
						onPress={()=>{console.log('초기화 작업 진행!!')}}
					>
						<AutoHeightImage width={13} source={require('../assets/image/icon_refresh.png')} resizeMethod='resize' />	
						<Text style={styles.filterResetText}>초기화</Text>
					</TouchableOpacity>				
				</View>
				<ScrollView>
					<View style={[styles.cmWrap, styles.cmWrap2]}>
						<View style={styles.filterTitle}>
							<Text style={styles.filterTitleText}>선호 카드 설정</Text>
						</View>
						<View style={styles.filterDesc}>
							<Text style={styles.filterDescText}>나에게 소개 될 카드를 설정합니다.</Text>
						</View>
						<View style={[styles.msBox, styles.mgt30]}>
							<View style={[styles.msTitleBox, styles.mgb10]}>
								<Text style={styles.msTitleBoxText1}>나이</Text>
								<Text style={styles.msTitleBoxText2}>{ageMin}년생~{ageMax}년생+</Text>
							</View>
							<MultiSlider								
								selectedStyle={{
									height:2,
									backgroundColor: '#D1913C',
								}}
								unselectedStyle={{
									height:2,
									backgroundColor: '#DBDBDB',
								}}
								optionsArray={ageAryIdx}
								values={[
									nonCollidingMultiSliderValue[0],
									nonCollidingMultiSliderValue[1],
								]}
								markerOffsetY={1}
								sliderLength={innerWidth}
								min={ageMaxInt}
								max={ageMinInt}
								step={1}
								enableLabel={false}
								enabledOne={true}
								enabledTwo={true}
								customMarker={() => (
									<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
								)}
								onValuesChange={(e) => {
									const first = ageAry[e[0]];
									const last = ageAry[e[1]];
									
									let yearString = first.toString();
									setRealAgeMin(yearString);
									yearString = yearString.substr(2,2);

									let yearString2 = last.toString();
									setRealAgeMax(yearString2);
									yearString2 = yearString2.substr(2,2);
									
									setAgeMin(yearString);
									setAgeMax(yearString2);
								}}
							/>
						</View>
						<View style={[styles.msBox, styles.mgt50]}>
							<View style={[styles.msTitleBox, styles.mgb25]}>
								<Text style={styles.msTitleBoxText1}>거리</Text>
							</View>
							<View style={[styles.msTitleBox]}>
								<TouchableOpacity 
									style={styles.msCheckBox}
									activeOpacity={opacityVal}
									onPress={()=>{setDistanceStandard(1)}}
								>
									{distanceStandard == 1 ? (
										<View style={[styles.msCheckBoxCircle, styles.msCheckBoxCircleOn]}>
											<View style={styles.msCheckBoxCircleIn}></View>
										</View>
									) : (
										<View style={styles.msCheckBoxCircle}></View>
									)}
									
									<Text style={styles.msCheckBoxText}>주활동 지역 기준</Text>
								</TouchableOpacity>
								<Text style={styles.msTitleBoxText2}>{distance}km 이내</Text>
							</View>
							<MultiSlider								
								selectedStyle={{
									height:2,
									backgroundColor: '#D1913C',
								}}
								unselectedStyle={{
									height:2,
									backgroundColor: '#DBDBDB',
								}}
								optionsArray={[10, 15, 20, 25, 30, 50, 70, 100, 150, 200, 300, 500]}
								values={[distance]}
								markerOffsetY={1}
								sliderLength={innerWidth}
								value={[0]}
								min={10}
								max={500}
								step={1}
								enableLabel={false}
								enabledOne={true}
								enabledTwo={false}
								allowOverlap={true}
								customMarker={() => (
									<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
								)}
								onValuesChange={(e) => {
									//console.log(e);
									setDistance(e[0]);
								}}
							/>
						</View>
						<View style={[styles.msBox, styles.mgt30]}>
							<View style={[styles.msTitleBox]}>
								<TouchableOpacity 
									style={styles.msCheckBox}
									activeOpacity={opacityVal}
									onPress={()=>{setDistanceStandard(2)}}
								>
									{distanceStandard == 2 ? (
										<View style={[styles.msCheckBoxCircle, styles.msCheckBoxCircleOn]}>
											<View style={styles.msCheckBoxCircleIn}></View>
										</View>
									) : (
										<View style={styles.msCheckBoxCircle}></View>
									)}
									
									<Text style={styles.msCheckBoxText}>부활동 지역 기준</Text>
								</TouchableOpacity>
								<Text style={styles.msTitleBoxText2}>{distance2}km 이내</Text>
							</View>
							<MultiSlider								
								selectedStyle={{
									height:2,
									backgroundColor: '#D1913C',
								}}
								unselectedStyle={{
									height:2,
									backgroundColor: '#DBDBDB',
								}}
								optionsArray={[10, 15, 20, 25, 30, 50, 70, 100, 150, 200, 300, 500]}
								values={[distance2]}
								markerOffsetY={1}
								sliderLength={innerWidth}
								value={[0]}
								min={10}
								max={500}
								step={1}
								enableLabel={false}
								enabledOne={true}
								enabledTwo={false}
								allowOverlap={true}
								customMarker={() => (
									<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
								)}
								onValuesChange={(e) => {
									//console.log(e);
									setDistance2(e[0]);
								}}
							/>
						</View>
						<View style={[styles.msBox, styles.mgt50]}>
							<View style={[styles.msTitleBox, styles.mgb25]}>
								<Text style={styles.msTitleBoxText1}>최근 접속일 수</Text>
								<Text style={styles.msTitleBoxText2}>{recentAccess}일 이내 접속자</Text>
							</View>
							<View style={styles.multiSliderCustom}>
								<View style={styles.multiSliderDotBack}>
									<View style={[styles.multiSliderDotBackOn, recentAccess == 14 ? styles.w33p : null, recentAccess == 21 ? styles.w66p : null, recentAccess == 28 ? styles.w100p : null]}></View>
								</View>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow]}
									activeOpacity={1}
									onPress={()=>{setRecentAccess(7)}}
								>
								</TouchableOpacity>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow, recentAccess < 14 ? styles.multiSliderDotOff : null]}
									activeOpacity={1}
									onPress={()=>{setRecentAccess(14)}}
								>									
								</TouchableOpacity>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow, recentAccess < 21 ? styles.multiSliderDotOff : null]}
									activeOpacity={1}
									onPress={()=>{setRecentAccess(21)}}
								>									
								</TouchableOpacity>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow, recentAccess < 28 ? styles.multiSliderDotOff : null]}
									activeOpacity={1}
									onPress={()=>{setRecentAccess(28)}}
								>									
								</TouchableOpacity>
							</View>
						</View>
						<View style={[styles.msBox, styles.mgt60]}>
							<View style={styles.filterTitle}>
								<Text style={styles.filterTitleText}>내 카드 설정</Text>
							</View>
							<View style={styles.filterDesc}>
								<Text style={styles.filterDescText}>내 카드가 소개 될 카드를 설정합니다.</Text>
							</View>
							<View style={[styles.msBox, styles.mgt30]}>
								<View style={[styles.msTitleBox, styles.mgb10]}>
									<Text style={styles.msTitleBoxText1}>나이</Text>
									<Text style={styles.msTitleBoxText2}>{ageMin2}년생~{ageMax2}년생+</Text>
								</View>

								<MultiSlider								
									selectedStyle={{
										height:2,
										backgroundColor: '#D1913C',
									}}
									unselectedStyle={{
										height:2,
										backgroundColor: '#DBDBDB',
									}}
									optionsArray={ageAryIdx}
									values={[
										nonCollidingMultiSliderValue[0],
										nonCollidingMultiSliderValue[1],
									]}
									markerOffsetY={1}
									sliderLength={innerWidth}
									min={ageMinInt}
									max={ageMaxInt}
									step={1}
									enableLabel={false}
									enabledOne={true}
									enabledTwo={true}
									customMarker={() => (
										<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
									)}
									onValuesChange={(e) => {
										const first = ageAry[e[0]];
										const last = ageAry[e[1]];
										
										let yearString = first.toString();
										setRealAgeMin2(yearString);
										yearString = yearString.substr(2,2);

										let yearString2 = last.toString();
										setRealAgeMax2(yearString2);
										yearString2 = yearString2.substr(2,2);
										
										setAgeMin2(yearString);
										setAgeMax2(yearString2);
									}}
								/>
							</View>
						</View>
					</View>
				</ScrollView>
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={[styles.nextBtn]}
						activeOpacity={opacityVal}
						onPress={() => {
							setFilterPop(false);
							setFilterSave(true);
						}}
					>
						<Text style={styles.nextBtnText}>저장하기</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			{/* 탈퇴 회원 알림 */}
			<Modal
				visible={leavePop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setLeavePop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setLeavePop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setLeavePop(false)}}
						>
							<AutoHeightImage width={18} source={require("../assets/image/popup_x.png")} resizeMethod='resize' />
						</TouchableOpacity>		
						<View style={[styles.popTitle, styles.popTitleFlex]}>							
							<View style={styles.popTitleFlexWrap}>
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>탈퇴한 회원이에요</Text>
              </View>
							<AutoHeightImage width={18} source={require("../assets/image/emiticon1.png")} style={styles.emoticon} resizeMethod='resize' />
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {setLeavePop(false)}}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* 추가 소개 알림 */}
			<Modal
				visible={addIntroPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setAddIntroPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setAddIntroPop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setAddIntroPop(false)}}
						>
							<AutoHeightImage width={18} source={require("../assets/image/popup_x.png")} resizeMethod='resize' />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>추가 소개 받으시겠어요?</Text>							
						</View>
						<View style={styles.pointBox}>
							<AutoHeightImage width={24} source={require('../assets/image/coin.png')} resizeMethod='resize' />
							<Text style={styles.pointBoxText}>100</Text>
						</View>						
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => {setAddIntroPop(false)}}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => {
									setAddIntroPop(false);
									setCashPop(true);
								}}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* 포인트 구매 팝업 */}
			<Modal
				visible={cashPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setCashPop(false)}
			>
				<TouchableOpacity 
					style={[styles.popBack, styles.popBack2]} 
					activeOpacity={1} 
					onPress={()=>{setCashPop(false)}}
				>
				</TouchableOpacity>
				<View style={styles.prvPopBot}>
					<View style={[styles.popTitle]}>
						<Text style={styles.popBotTitleText}>더 많은 인연을 만나보세요</Text>							
						<Text style={[styles.popBotTitleDesc]}>프로틴을 구매해 즉시 다음 인연을!</Text>
					</View>					
					<View style={styles.productList}>
						<TouchableOpacity
							style={[styles.productBtn, prdIdx==1 ? styles.productBtnOn : null]}
							activeOpacity={opacityVal}
							onPress={()=>{setPrdIdx(1)}}
						>
							<Text style={styles.productText1}>000</Text>
							<View style={styles.productBest}></View>							
							<Text style={[styles.productText3, prdIdx==1 ? styles.productText3On : null]}>개당 ￦000</Text>
							<Text style={styles.productText4}>￦50,000</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.productBtn, prdIdx==2 ? styles.productBtnOn : null]}
							activeOpacity={opacityVal}
							onPress={()=>{setPrdIdx(2)}}
						>
							<Text style={styles.productText1}>000</Text>
							<View style={[styles.productBest, styles.productBest2]}>
								<Text style={styles.productText2}>BEST</Text>
							</View>
							<Text style={[styles.productText3, prdIdx==2 ? styles.productText3On : null]}>개당 ￦000</Text>
							<Text style={styles.productText4}>￦50,000</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.productBtn, prdIdx==3 ? styles.productBtnOn : null]}
							activeOpacity={opacityVal}
							onPress={()=>{setPrdIdx(3)}}
						>
							<Text style={styles.productText1}>000</Text>
							<View style={styles.productBest}></View>
							<Text style={[styles.productText3, prdIdx==3 ? styles.productText3On : null]}>개당 ￦000</Text>
							<Text style={styles.productText4}>￦50,000</Text>
						</TouchableOpacity>
					</View>
					<View style={[styles.popBtnBox]}>
						<TouchableOpacity 
							style={[styles.popBtn]}
							activeOpacity={opacityVal}
							onPress={() => {setCashPop(false)}}
						>
							<Text style={styles.popBtnText}>지금 구매하기</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.popBtn, styles.popBtnOff2]}
							activeOpacity={opacityVal}
							onPress={() => {setCashPop(false)}}
						>
							<Text style={[styles.popBtnText, styles.popBtnOffText]}>다음에 할게요</Text>
						</TouchableOpacity>						
					</View>
				</View>
			</Modal>

			{/* 소개 카드 없음 - 필터 미사용 */}
			<Modal
				visible={unAddIntroPop1}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setUnAddIntroPop1(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setUnAddIntroPop1(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setUnAddIntroPop1(false)}}
						>
							<AutoHeightImage width={18} source={require("../assets/image/popup_x.png")} resizeMethod='resize' />
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>더 이상 소개 받을 수 있는</Text>
						</View>
						<View style={[styles.popTitle, styles.popTitleFlex]}>							
							<View style={styles.popTitleFlexWrap}>
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>카드가 없어요</Text>
              </View>
							<AutoHeightImage width={18} source={require("../assets/image/emiticon2.png")} style={styles.emoticon} resizeMethod='resize' />
						</View>
						<View>
							<Text style={[styles.popTitleDesc, styles.mgt0]}>새로운 회원이 들어올때까지 커뮤니티를 즐겨보세요!</Text>
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {}}
							>
								<Text style={styles.popBtnText}>커뮤니티 바로가기</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtnOff2]}
								activeOpacity={opacityVal}
								onPress={() => {setUnAddIntroPop1(false)}}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>다음에 할게요</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* 소개 카드 없음 - 필터 사용 */}
			<Modal
				visible={unAddIntroPop2}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setUnAddIntroPop2(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setUnAddIntroPop2(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setUnAddIntroPop2(false)}}
						>
							<AutoHeightImage width={18} source={require("../assets/image/popup_x.png")} resizeMethod='resize' />
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>더 이상 소개 받을 수 있는</Text>
						</View>
						<View style={[styles.popTitle, styles.popTitleFlex]}>							
							<View style={styles.popTitleFlexWrap}>
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>카드가 없어요</Text>
              </View>
							<AutoHeightImage width={18} source={require("../assets/image/emiticon2.png")} style={styles.emoticon} resizeMethod='resize' />
						</View>
						<View>
							<Text style={[styles.popTitleDesc, styles.mgt0]}>추가 소개를 받고 싶다면 필터 범위를 넓혀보세요!</Text>
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {
									setUnAddIntroPop2(false);
									setFilterPop(true);
								}}
							>
								<Text style={styles.popBtnText}>필터 설정 바로가기</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* 회원가입 축하 */}
			<Modal
				visible={welcomePop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setWelcomePop(false)}
			>
				<TouchableOpacity 
					style={[styles.popBack, styles.popBack2]} 
					activeOpacity={1} 
					onPress={()=>{setWelcomePop(false)}}
				>
				</TouchableOpacity>
				<View style={styles.prvPopBot2}>
					<AutoHeightImage width={widnowWidth} source={require('../assets/image/welcome.png')} resizeMethod='resize' />
				</View>
			</Modal>
			
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },
	gapBox: {height:86,},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
	indicator2: { marginTop: 62 },
	text: {padding:8, color : 'black'},
	img: { marginTop: 8, height: widnowWidth, },

	header: {backgroundColor:'#141E30'},
	headerTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:20,paddingBottom:10,paddingHorizontal:20,},
	headerTitle: {},
	headerTitleText: {fontFamily:Font.RobotoMedium,fontSize:24,lineHeight:26,color:'#fff'},
	headerLnb: {flexDirection:'row',alignItems:'center',},
	headerLnbBtn: {marginLeft:16,},
	headerBot: {flexDirection:'row',},
	headerTab: {width:widnowWidth/2,height:60,alignItems:'center',justifyContent:'center',position:'relative',paddingTop:10,},
	headerTabText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#fff'},
	headerTabTextOn: {fontFamily:Font.NotoSansBold,color:'#FFD194'},
	activeLine: {width:widnowWidth/2,height:4,backgroundColor:'#FFD194',position:'absolute',left:0,bottom:0,zIndex:10,},

	modalHeader: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},
	filterResetBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:20,height:48,backgroundColor:'#fff',position:'absolute',top:0,right:0,zIndex:10,},
	filterResetText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#1E1E1E',marginLeft:6,},

	filterTitle: {},
	filterTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:18,color:'#1e1e1e'},
	filterDesc: {marginTop:6,},
	filterDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#666'},
	msBox: {},
	msTitleBox: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	msTitleBoxText1: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#1e1e1e'},
	msTitleBoxText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#888',position:'relative',top:-1,},
	msCheckBox: {flexDirection:'row',alignItems:'center'},
	msCheckBoxCircle: {width:20,height:20,backgroundColor:'#fff',borderWidth:1,borderColor:'#dbdbdb',borderRadius:50,position:'relative'},
	msCheckBoxCircleOn: {borderColor:'#243B55'},
	msCheckBoxCircleIn: {width:12,height:12,backgroundColor:'#243B55',borderRadius:50,position:'absolute',left:3,top:3,},
	msCheckBoxText: {fontFamily:Font.NotoSansRegular,fontSize:12,color:'#1e1e1e',marginLeft:6,},

	grediant: {padding:1,borderRadius:5,},
	boxShadow: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
		elevation: 5,
	},
	boxShadow2: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
		elevation: 9,
	},

	todayFreeArea: {},	
	todayFreeAreaWrap: {backgroundColor:'#fff',borderRadius:5,},
	todayFreeBtn: {height:50,alignItems:'center',justifyContent:'center',backgroundColor:'#fff',borderRadius:5,},
	todayFreeBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#d1913c'},

	cmWrap: {paddingVertical:40,paddingHorizontal:20,},
	cmWrap2: {paddingTop:30,},
	cardView: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
	dday: {width:innerWidth,height:17,backgroundColor:'#fff',marginTop:30,flexDirection:'row',justifyContent:'center',position:'relative'},
	ddayLine: {width:innerWidth,height:1,backgroundColor:'#D1913C',position:'absolute',left:0,top:8,},
	ddayText: {width:40,height:17,textAlign:'center',backgroundColor:'#fff',position:'relative',zIndex:10,fontFamily:Font.RobotoRegular,fontSize:15,lineHeight:17,color:'#D1913C'},
	cardBtn: { width: ((widnowWidth / 2) - 30), marginTop: 20, position: 'relative' },		
	cardCont: {width: ((widnowWidth / 2) - 30), backgroundColor:'#fff', backfaceVisibility:'hidden', borderTopLeftRadius:80, borderTopRightRadius:80,},	
	cardFrontInfo: {width: ((widnowWidth / 2) - 30), position:'absolute', left:0, top:0, zIndex:10,},
	peopleImgBack: {opacity:0,},
	peopleImg: {position:'absolute', left:0, top:0, zIndex:9, borderTopLeftRadius:80, borderTopRightRadius:80,},
	cardFrontInfoCont: {width: ((widnowWidth / 2) - 30), backgroundColor:'#fff', position:'absolute', left:0, bottom:0, zIndex:10, padding:10, borderRadius:5,},
	cardFrontNick: {flexDirection:'row', alignItems:'center', justifyContent:'space-between'},
	cardFrontNickText: {width:(innerWidth/2)-61,fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:19,color:'#1e1e1e',},
	cardFrontJob: {marginVertical:6,},
	cardFrontJobText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#888',},
	cardFrontContBox: {flexDirection:'row',alignItems:'center'},
	cardFrontContText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:16,color:'#1e1e1e',},
	cardFrontContTextRoboto: {fontFamily:Font.RobotoRegular,fontSize:12,},
	cardFrontContLine: {width:1,height:8,backgroundColor:'#EDEDED',position:'relative',top:1,marginHorizontal:6,},

	cardBtn2: {width: ((innerWidth / 3) - 7)},
	cardCont2: {width: ((innerWidth / 3) - 7)},
	cardFrontInfo2: {width: ((innerWidth / 3) - 7),position:'absolute',left:0,top:0,opacity:1},
	cardFrontInfoCont2: {width: ((innerWidth / 3) - 7),padding:8,},
	cardFrontDday: {},
	cardFrontDdayText: {textAlign:'center',fontFamily:Font.RobotoBold,fontSize:16,lineHeight:17,color:'#1e1e1e'},
	cardFrontNick2: {marginTop:4,},
	cardFrontNickText2: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:10,lineHeight:12,color:'#1e1e1e'},
	cardFrontContBox2: {justifyContent:'center'},
	cardFrontContText2: {fontFamily:Font.RobotoRegular,color:'#888'},

	state2Tab: {flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#EDEDED'},
	state2TabBtn: {alignItems:'center',justifyContent:'center',width:widnowWidth/3,height:50,},
	state2TabBtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,color:'#888'},
	state2TabBtnTextOn: {color:'#141E30'},

	interestBoxTitle: {},
	interestBoxTitleText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:19,color:'#1e1e1e',},
	interestBoxDesc: {flexDirection:'row',alignItems:'center',marginTop:4,},
	interestBoxDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#666',marginRight:2,},

	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight},
	popBack2: {backgroundColor:'rgba(0,0,0,0.7)',},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},	
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap'},
	popTitleFlexWrap: {position:'relative'},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E',},
  popTitleFlexText: {position:'relative',top:0,},	
	popTitleDesc: {width:innerWidth-40,textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	emoticon: {},
	popIptBox: {paddingTop:10,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {marginTop:30,},
	popBtnBoxFlex: {flexDirection:'row',justifyContent:'space-between'},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtn2: {width:(innerWidth/2)-25,},
	popBtnOff: {backgroundColor:'#EDEDED',},
	popBtnOff2: {backgroundColor:'#fff',marginTop:10,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

	prvPopBot: {width:widnowWidth,paddingTop:40,paddingBottom:10,paddingHorizontal:20,backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,position:'absolute',bottom:0,},
	prvPopBot2: {width:widnowWidth,position:'absolute',bottom:0,},
	popBotTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:20,color:'#1e1e1e',},
	popBotTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#666',marginTop:10,},
	
	multiSliderDot: {width:16,height:16,backgroundColor:'#fff',borderWidth:2,borderColor:'#D1913C',borderRadius:50,position:'relative',zIndex:10,},
	multiSliderDotOff: {borderWidth:0,backgroundColor:'#F8F9FA'},

	multiSliderCustom: {flexDirection:'row',justifyContent:'space-between',position:'relative'},
	multiSliderDotBack: {width:innerWidth,height:2,backgroundColor:'#DBDBDB',position:'absolute',left:0,top:7,},
	multiSliderDotBackOn: {width:0,height:2,backgroundColor:'#D1913C',},

	nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },

	pointBox: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	pointBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#D1913C',marginLeft:6},

	productList: {flexDirection:'row',justifyContent:'space-between'},
	productBtn: {width:(innerWidth/3)-7,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,paddingVertical:25,paddingHorizontal:10,},
	productBtnOn: {backgroundColor:'rgba(209,145,60,0.15)',borderColor:'#D1913C'},
	productText1: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:20,color:'#1e1e1e'},
	productBest: {height:20,paddingHorizontal:8,borderRadius:20,marginTop:5,},
	productBest2: {backgroundColor:'#FFBF1A',},
	productText2: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:18,color:'#fff'},
	productText3: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#666',marginTop:3,},
	productText3On: {color:'#1e1e1e'},
	productText4: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:5,},

	boxShadow: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0.5,
		elevation: 2,
	},
	
	displayNone: {display:'none'},
	mgt0: {marginTop:0,},
	mgt2: {marginTop:2,},
	mgt4: {marginTop:4,},
	mgt6: {marginTop:6,},
	mgt10: {marginTop:10,},
	mgt30: {marginTop:30,},
	mgt50: {marginTop:50,},
	mgt60: {marginTop:60,},
	mgb0: {marginBottom:0,},
	mgb10: {marginBottom:10,},
	mgb25: {marginBottom:25,},

	w33p: {width:innerWidth*0.33},
	w66p: {width:innerWidth*0.66},
	w100p: {width:innerWidth},
})

export default Home