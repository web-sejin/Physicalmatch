import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, AppState, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, PermissionsAndroid, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';
import PushNotification from 'react-native-push-notification';
import BackgroundTimer from 'react-native-background-timer';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AutoHeightImage from "react-native-auto-height-image";

import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import { setDate } from 'date-fns';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const exe_ary = [
	{exe_idx:1, exe_name:'헬스'},
	{exe_idx:2, exe_name:'필라테스'},
	{exe_idx:3, exe_name:'요가'},
	{exe_idx:4, exe_name:'테니스'},
	{exe_idx:5, exe_name:'골프'},
	{exe_idx:99, exe_name:'직접입력'}
]

const TodayExercise = (props) => {	
  const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
  const {params} = route;	
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
  const [preventBack, setPreventBack] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [loading, setLoading] = useState(false);
  const [memberIdx, setMemberIdx] = useState();
	const [memberInfo, setMemberInfo] = useState();
  const [exerList, setExerList] = useState([]);
  const [nowPage, setNowPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [tabState, setTabState] = useState(); //피드, 운동, 달력

	const [alertPop, setAlertPop] = useState(false);
	const [alertMsg, setAlertMsg] = useState('');
	const [startPop, setStartPop] = useState(false);
	const [endPop, setEndPop] = useState(false);
	const [exeList, setExeList] = useState([]);
	const [todayExe, setTodayExe] = useState(null);
	const [todayEtc, setTodayEtc] = useState('');
	const [startTime, setStartTime] = useState(null);  // 시작 시간
  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간
  const [timerRunning, setTimerRunning] = useState(false); // 타이머 상태
	const [isPaused, setIsPaused] = useState(false); // 상태 추가
	const [pausedElapsedTime, setPausedElapsedTime] = useState(0);
	const [pickDate, setPickDate] = useState('');
	const [viewDAte, setViewDate] = useState(new Date());
	const [exenIdx, setExenIdx] = useState(null);
	const [markedDates, setMarkedDates] = useState({});
	const [dateList, setDateList] = useState([]);

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	const scrollViewRef = useRef(null); // ScrollView 참조 생성
  const exePlanListRef = useRef(null); // exePlanList 참조 생성

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
      if(!tabState){
        setTabState(1);
      }

      AsyncStorage.getItem('member_idx', (err, result) => {		
				setMemberIdx(result);
			});

      if(params?.reload){								
				getMemInfo();
				if(params?.tab == 3){					
					setTabState(3);					
					if(tabState == 3){						
						getCalendarList();
					}							
					delete params?.tab;
				}else{
					getExerList(1);
					setNowPage(1);
				}
        delete params?.reload;
      }
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
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {			
			setKeyboardStatus(1);
			setTimeout(function(){
				setKeyboardStatus(2);
			}, 300);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			setKeyboardStatus(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
		if (memberIdx && tabState !== undefined) {			
			setLoading(true);
			getMemInfo();
			if(tabState == 1){
				setNowPage(1);
				getExerList(1);
			}else if(tabState == 2){
				getExeSelect();
				if(!timerRunning){ getTodayExerciseLog(); }
			}else if(tabState == 3){
				getCalendarList();
			}
		}
	}, [memberIdx, tabState]);

  const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
    //console.log(response);
		if(response.code == 200){
			setMemberInfo(response.data);
		}
	}

  const getExerList = async (viewPage) => {
    let curr_page = nowPage;
		if(viewPage){
			curr_page = viewPage;
		}

		if (exerList.length < 1) {
			curr_page = 1;
		}	

		let curr_tab = tabState;		
		if(params?.writeType){
			// setTabState(params?.writeType);
			// curr_tab = params?.writeType;
			delete params?.writeType;
		}
    
		let sData = {
			basePath: "/api/exercise/",
			type: "GetTodayExeList",
			member_idx: memberIdx,
			page:curr_page,
		};		
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){						

			//setTotalPage(Math.ceil(response.data.length/10));
			//console.log('curr_page::: ', curr_page);
			if(curr_page == 1){
				if(response.msg == 'EMPTY'){
					setNowPage(1);
					setExerList([]);
				}else{
					setExerList(response.data);
				}
			}else if(curr_page > 1 && response.msg != 'EMPTY'){					
				const addList = [...exerList, ...response.data];
				setExerList(addList);
			}
				
		}

    setTimeout(function(){
			setLoading(false);
		}, 300);
  }

  const getList = ({item, index}) => {
		return (
			<View style={styles.exeList}>
				<TouchableOpacity
					style={styles.exeButton}
					activeOpacity={opacityVal}
					onPress={()=>{						
						//navigation.navigate('TodayExerciseView', {ex_idx:item.ex_idx});
						navigation.navigate('TodayExerciseView', {exe_idx:item.exe_idx});
					}}
				>
					<ImgDomain2 fileWidth={widnowWidth/3} fileName={item.ef_file} />
				</TouchableOpacity>
			</View>
		)
	}

  const onScroll = (e) => {
		const {contentSize, layoutMeasurement, contentOffset} = e.nativeEvent;
		//console.log({contentSize, layoutMeasurement, contentOffset});
		//console.log(contentOffset.y);	
	};

  //무한 스크롤
  const moreData = async () => {				
		if (exerList.length > 0) {
			getExerList(nowPage + 1);
			setNowPage(nowPage + 1);
		}	
	}

	const onRefresh = () => {
		if(!refreshing) {
			setRefreshing(true);
			getExerList(1);
			setNowPage(1);
      setTimeout(() => setRefreshing(false), 2000);
		}
	}

	const getTodayExerciseLog = async () => {		
		let sData = {
			basePath: "/api/exercise/",
			type: "GetTodayExerciseLog",
			member_idx: memberIdx,
		};		
		const response = await APIs.send(sData);		
		//console.log(response);
		if(response.type == 'run'){
			const responseTime = new Date();
			const now = new Date(response.default_time);
			const timeDiff = responseTime - now;	
			//console.log('now ::: ',response.default_time);
			setStartTime(now);
			AsyncStorage.setItem('startTime', now.toString());
			if(pausedElapsedTime == 0){
				setElapsedTime(0);
			}
			setTimerRunning(true);
			setIsPaused(false);
			setPausedElapsedTime(0);
			setExenIdx(response.data.exen_idx);
			setTodayExe(response.data.exen_exercise_name);
			if(response.data.exen_exercise_name == '직접입력'){
				setTodayEtc(response.data.exen_exercise_etc);				
			}
			
		}
	}

	const MAX_TIME = 36000; // 최대 시간 10시간 (36,000초)

	useEffect(() => {
    PushNotification.createChannel({
      channelId: "timer-channel", // 채널 ID
      channelName: "Timer Channel", // 채널 이름
      importance: 2, // 중요도 낮춤 (0: 없음, 1: 최소, 2: 낮음, 3: 중간, 4: 높음)
      vibrate: false, // 진동 비활성화
    });
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
      BackgroundTimer.stopBackgroundTimer(); // 백그라운드 타이머 종료
    };
  }, [startTime, timerRunning]);  

  useEffect(() => {
    let interval = null;

    if (timerRunning) {
      interval = setInterval(() => {
        //setElapsedTime((new Date() - startTime) / 1000);
				const nowTime = (new Date() - startTime) / 1000 + pausedElapsedTime;

				if (nowTime >= MAX_TIME) {
					handleStop(); // 10시간이 지나면 타이머 자동 종료
				} else {
					setElapsedTime(nowTime);
				}
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerRunning, startTime]);

	const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'background' && timerRunning) {
      // 백그라운드에서도 타이머를 계속 실행
      // BackgroundTimer.runBackgroundTimer(() => {        
      //   const nowTime = (new Date() - startTime) / 1000;
			// 	if (nowTime >= MAX_TIME) {
			// 		handleStop(); // 10시간이 지나면 타이머 자동 종료
			// 		return;
			// 	}

      //   setElapsedTime(nowTime);

      //   PushNotification.localNotification({
      //     id: '999',
      //     channelId: "timer-channel",
      //     title: "타이머 실행 중",
      //     message: `경과 시간: ${nowTime.toFixed(0)} 초`,
      //     importance: "low",
      //     priority: "low",
      //     ongoing: true,
      //     silent: true,
      //     visibility: "secret", // 잠금 화면에서 알림을 숨깁니다
      //     onlyAlertOnce: true, // 알림을 한 번만 표시합니다
      //     playSound: false, // 소리 비활성화
      //     vibrate: false, // 진동 비활성화
      //   });
      // }, 1000); // 1초마다 타이머 업데이트
    } else if (nextAppState === 'active') {
      BackgroundTimer.stopBackgroundTimer(); // 앱이 활성화되면 백그라운드 타이머 종료
      PushNotification.cancelAllLocalNotifications(); // 알림 취소
    }
  };

  const handleStart = async () => {
    const now = new Date();						
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const formattedTime = koreaTime.toISOString().replace('T', ' ').slice(0, 19);		
		const spltTime = formattedTime.split(' ');
		const spltTime2 = spltTime[1].split(':');		

		let sData = {
			basePath: "/api/exercise/",
			type: "StartTodayExercise",
			member_idx: memberIdx,
			exen_start_date: spltTime[0],
			exen_start_hour: spltTime2[0],
			exen_start_minute: spltTime2[1],
			exen_start_sec: spltTime2[2],
			exen_exercise_name: todayExe,
			exen_exercise_etc: todayEtc,
		};		
		if(exenIdx){			
			sData.exen_idx = exenIdx;
		}
		//console.log(sData);
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			setStartTime(now);
			AsyncStorage.setItem('startTime', now.toString());
			if(pausedElapsedTime == 0){
				setElapsedTime(0);
			}
			setTimerRunning(true);
			setIsPaused(false);
			setPausedElapsedTime(0);
			setExenIdx(response.data.exen_idx);
		}    
  };

  const handleStop = async () => {
		const floor = Math.floor(parseInt(elapsedTime));
		let sData = {
			basePath: "/api/exercise/",
			type: "EndTodayExercise",
			member_idx: memberIdx,			
			exen_idx: exenIdx,
			exen_work_time: floor,
		};
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			setTimerRunning(false);
			setElapsedTime(0);
			setPausedElapsedTime(0);
			setIsPaused(false);
			setTodayExe(null);
			setTodayEtc('');
			setExenIdx(null);
			await AsyncStorage.removeItem('startTime');
			PushNotification.cancelAllLocalNotifications(); // 타이머가 종료되면 알림 취소
			BackgroundTimer.stopBackgroundTimer(); // 백그라운드 타이머 종료		
		}    
  };

	const handleFinish = async () => {
    // 일시 정지 상태로 전환하고 다이얼로그 표시
		const floor = Math.floor(parseInt(elapsedTime));
		let sData = {
			basePath: "/api/exercise/",
			type: "StopTodayExercise",
			member_idx: memberIdx,			
			exen_idx: exenIdx,		
			exen_running_time: floor,	
		};
		const response = await APIs.send(sData);		
		if(response.code == 200){
			setEndPop(true);
			setTimerRunning(false);
			setIsPaused(true);
			setPausedElapsedTime(elapsedTime);
		}		
  };

	const handleDialogConfirm = () => {    
		setEndPop(false);
    handleStop(); // 확인 버튼 클릭 시 타이머 멈추기
  };

	const handleDialogCancel = () => {
		setStartPop(false);
		setEndPop(false);
    handleStart();
  };

	const startPopOff = () => {
		setStartPop(false);
	}

	// 시간을 hh:mm:ss 형식으로 변환하는 함수
	const formatTime = (seconds) => {
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);

		return `${hrs.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
	};

  const moveAlimPage = async () => {
		navigation.navigate('Alim', {alarm_type:userInfo?.alarm_type});
	}

	const handleSelect = (v) => {
		if(v != '직접입력'){
			setTodayEtc('');
		}
		setTodayExe(v);
	}

	const handleTimer = async () => {
		if(!todayExe){			
			setAlertMsg('운동 종목을 선택해 주세요.');
			setAlertPop(true);
			return false;
		}

		if(todayExe == '직접입력' && todayEtc == ''){
			setAlertMsg('운동 종목을 입력해 주세요.');
			setAlertPop(true);
			return false;
		}

		setStartPop(true);
	}	

	const getExeSelect = async () => {
		let sData = {
			basePath: "/api/exercise/",
			type: "GetExeSelect",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			setExeList(response.data);
			setLoading(false);
		}
	}

	const onDayPress = async (day) => {
		const newPickDate = day.dateString;		

		const updatedMarkedDates = {...markedDates};
		Object.keys(updatedMarkedDates).forEach(date => {
			if (updatedMarkedDates[date].selected) {
				delete updatedMarkedDates[date].selected;
				delete updatedMarkedDates[date].selectedColor;
			}
		});

		updatedMarkedDates[newPickDate] = {
			...updatedMarkedDates[newPickDate],
			selected: true,
			selectedColor: '#F7B863'
		};
		
		setMarkedDates(updatedMarkedDates);
		setPickDate(newPickDate);

		let sData = {
			basePath: "/api/exercise/",
			type: "GetDateList",
			member_idx: memberIdx,
			exen_start_date: newPickDate,
		};

		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){			
			setDateList(response.data);			
		}else{
			setDateList([]);
		}

		exePlanListRef.current?.measureLayout(scrollViewRef.current, (x, y) => {
			scrollViewRef.current?.scrollTo({ y, animated: true });
		});
  };

	const getCalendarList = async (date) => {			
		setDateList([]);

		let sData = {
			basePath: "/api/exercise/",
			type: "GetCalendarList",
			member_idx: memberIdx,
		};
		if(date){
			const pick_date = date.substring(0,7);		
			sData.pick_date = pick_date;
		}

		const response = await APIs.send(sData);		
		//console.log(response);
		if(response.code == 200){
			const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
  		setMarkedDates(data);

			if(params?.calDate){				
				onDayPress(params?.calDate);
				delete params?.calDate;				
			}
		}

		setTimeout(function(){
			setLoading(false);
		}, 300);
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
				<View style={styles.headerTop}>
					<View style={styles.headerTopTitle}>
						<Text style={styles.headerTitleText}>Exercise</Text>
					</View>
					<View style={styles.headerLnb}>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								if(memberInfo?.member_type != 1){
									ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
								}else{
									navigation.navigate('Shop');
								}								
							}}					
						>
							<ImgDomain fileWidth={24} fileName={'icon_shop.png'}/>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => moveAlimPage()}
						>
							{userInfo?.is_new == 'y' ? (
								<ImgDomain fileWidth={24} fileName={'icon_alim_on.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon_alim_off.png'}/>
							)}		
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.headerBot}>
					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(1)}}
					>
						<Text style={[styles.headerTabText, tabState == 1 ? styles.headerTabTextOn : null]}>오운완 피드</Text>
						{tabState == 1 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(2)}}
					>
						<Text style={[styles.headerTabText, tabState == 2 ? styles.headerTabTextOn : null]}>오늘 운동</Text>
						{tabState == 2 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(3)}}
					>
						<Text style={[styles.headerTabText, tabState == 3 ? styles.headerTabTextOn : null]}>운동 달력</Text>
						{tabState == 3 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>
				</View>
			</View>

      {tabState == 1 ? (
        <FlatList 				
          data={exerList}
          renderItem={(getList)}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          columnWrapperStyle={{ gap:1,marginBottom:1, }} 
          refreshing={refreshing}
          disableVirtualization={false}
          onScroll={onScroll}	
          onEndReachedThreshold={0.8}
          onEndReached={moreData}
          onRefresh={onRefresh}
          //ListHeaderComponent={}
          ListEmptyComponent={
            <View style={styles.notData}>
              <Text style={styles.notDataText}>등록된 피드가 없습니다.</Text>
            </View>
          }
        />
      ) : null}

			{tabState == 2 ? (
				<ScrollView style={{flex:1}}>
					<View style={[styles.cmWrap, styles.cmWrap3]}>
						<View style={styles.selectView}>
							<RNPickerSelect
								value={todayExe}
								onValueChange={(value, index) => {
									Keyboard.dismiss();
									handleSelect(value);									
								}}
								placeholder={{
									label: '운동 종목 선택', // 여기에 원하는 플레이스홀더 텍스트를 입력합니다
									value: null, // 기본값으로 null을 설정합니다
									color: '#666' // 플레이스홀더 텍스트 색상
								}}
								items={exeList.map(item => ({
									label: item.exe_name,
									value: item.exe_name,
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
								disabled={timerRunning ? true : false}
							/>
							<View style={styles.selectArr}>
								<ImgDomain fileWidth={10} fileName={'icon_arr3.png'}/>
							</View>
						</View>
						{todayExe == '직접입력' ? (
						<View style={styles.inputView}>								
							<TextInput
								value={todayEtc}
								onChangeText={(v) => {
									setTodayEtc(v);                     
								}}
								placeholder={'운동을 입력해 주세요'}
								placeholderTextColor="#DBDBDB"
								style={[styles.input]}								
								returnKyeType='done'
								editable={timerRunning ? false : true}
							/>
						</View>
						) : null}

						
						<View style={[styles.timerView, todayExe == '직접입력' ? styles.timerView2 : null]}>
							<Text style={[styles.timerViewText, timerRunning ? styles.timerViewText2 : null]}>{formatTime(elapsedTime)}</Text>
						</View>		
						<View style={styles.timerBtnView}>
							{!timerRunning && pausedElapsedTime == 0 ? (
								<TouchableOpacity
									style={styles.timerBtn}
									activeOpacity={opacityVal}
									onPress={()=>handleTimer()}
								>
									<Text style={styles.timerBtnText}>START</Text>
								</TouchableOpacity>
							) : (
								<TouchableOpacity
									style={[styles.timerBtn, styles.timerBtn2]}
									activeOpacity={opacityVal}
									onPress={()=>handleFinish()}
								>
									<Text style={[styles.timerBtnText, styles.timerBtnText2]}>FINISH</Text>
								</TouchableOpacity>
							)}
						</View>
						<View style={styles.timerInfo}>
							<View style={styles.timerInfoTitle}>
								<Text style={[styles.timerInfoTitleText, styles.timerInfoTitleText1, styles.colorRed]}>*</Text>
								<Text style={[styles.timerInfoTitleText, styles.timerInfoTitleText2, styles.colorRed]}>오늘 운동 보상</Text>
							</View>
							<View style={styles.timerInfoDesc}>
								<Text style={[styles.timerInfoDescText, styles.colorRed]}>- 30분 이상 운동 달성 시 프로틴 보상 +3 지급 (1일 1회, 월 10회 제한)</Text>
							</View>
							<View style={[styles.timerInfoTitle, styles.mgt5]}>
								<Text style={[styles.timerInfoTitleText, styles.timerInfoTitleText1]}>*</Text>
								<Text style={[styles.timerInfoTitleText, styles.timerInfoTitleText2]}>오늘 운동 유의사항</Text>
							</View>
							<View style={styles.timerInfoDesc}>
								<Text style={[styles.timerInfoDescText]}>- 운동 시작 후 운동 종목 변경 불가하며, 직접 입력한 경우 수정 불가합니다.</Text>
							</View>
						</View>
					</View>
				</ScrollView>
			) : null}

			{tabState == 3 ? (
				<ScrollView style={{flex:1}} ref={scrollViewRef}>
					<View style={[styles.cmWrap, styles.cmWrap4, styles.cmWrap5]}>
						<Calendar
							style={styles.calendar}
								// 캘린더 내 스타일 수정
							theme={{
								dayTextColor: '#1e1e1e',
								todayTextColor: '#fff',
								todayBackgroundColor: '#FFD194',								                                     								
								textSectionTitleColor: '#1E1E1E',								
								textDisabledColor: '#DBDBDB',
								selectedDayBackgroundColor:'#243B55',
								selectedDayTextColor: '#fff',
								monthTextColor:'#1e1e1e',
								textMonthFontFamily:Font.NotoSansMedium,
								textMonthFontSize: 12,
								textDayFontSize: 14,								
							}}     
							markedDates={markedDates}
							markingType={'multi-dot'}
							dayComponent={({ date, state, marking }) => {
								const newDate = new Date(date.dateString.toString());								
								const monthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1); // 해당 월의 첫날								
								const firstDayOfWeek = monthStart.getDay(); // 첫날의 요일
								const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // 주의 시작이 월요일일 경우 조정
								const daysFromStartOfMonth = (newDate.getDate() + firstDayOfWeek); // 해당 날짜까지의 일수
								const isCurrentMonth = newDate.getMonth() === viewDAte.getMonth();

								let weekNumber = 0;
								
								if (monthStart.getMonth() === viewDAte.getMonth()) {
									weekNumber = Math.ceil(daysFromStartOfMonth / 7); // 몇 번째 주인지 계산																		
								}else if (monthStart <= viewDAte) {
									weekNumber = 1;
								} else {
									weekNumber = 0;
								}								

								return (
									<>
										{weekNumber == 1 ? (<View style={styles.dayLine}></View>) : null}
										<TouchableOpacity 
											style={[styles.dayContainer]} 
											activeOpacity={opacityVal} 
											onPress={() => isCurrentMonth ? onDayPress(date) : null}
											disabled={!isCurrentMonth}
										>										
											<View 
												style={[
													styles.day, 
													!isCurrentMonth && styles.disabledDay,
													marking?.selectedColor ? {backgroundColor:marking?.selectedColor} : null													          
											]}>
												<View style={styles.dateTextContainer}>
													<Text style={[
														styles.dateText, 
														!isCurrentMonth && styles.disabledText,
														marking?.selectedColor ? {color: '#fff'} : null
													]}>
														{date.day}
													</Text>
												</View>
												{marking?.dots && marking.dots.length > 0 && (
													<View style={styles.dotContainer}>
														{marking.dots.map((dot, index) => (
															<View key={index} style={[styles.dot, index !=0 ? styles.mgt2 : null, { backgroundColor: dot.color }]} />
														))}
													</View>
												)}
											</View>
										</TouchableOpacity>
									</>
								)
							}}					
							onDayPress={onDayPress} // 날짜 클릭 시 그 날짜 출력                    
							hideExtraDays={false} // 이전 달, 다음 달 날짜 숨기기                    
							monthFormat={'yyyy년 M월'} // 달 포맷 지정   
							minDate={new Date(viewDAte.getFullYear(), viewDAte.getMonth(), 1).toISOString().split('T')[0]}
  						maxDate={new Date(viewDAte.getFullYear(), viewDAte.getMonth() + 1, 0).toISOString().split('T')[0]}
							onMonthChange={(month) => {											
								//console.log(month);
								getCalendarList(month.dateString);
								setViewDate(new Date(month.dateString.toString()));
							}} // 달이 바뀔 때 바뀐 달 출력                 														
							// 달 이동 화살표 구현 왼쪽이면 왼쪽 화살표 이미지, 아니면 오른쪽 화살표 이미지
							renderArrow={(direction) => direction === "left" ?
								<AutoHeightImage name="left" width={22} source={require('../../assets/image/cal_prev.png')}/> : <AutoHeightImage name="right" width={22} source={require('../../assets/image/cal_next.png')}/>
							}
						/>   
						<View style={styles.calendarState}>
							<View style={styles.calendarStateView}>
								<View style={styles.calendarStateCircle}></View>
								<Text style={styles.calendarStateText}>완료 운동</Text>
							</View>
							<View style={styles.calendarStateView}>
								<View style={[styles.calendarStateCircle, styles.calendarStateCircle2]}></View>
								<Text style={styles.calendarStateText}>운동 계획</Text>
							</View>
						</View>
						<View style={[styles.popBtnBox]}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {
									navigation.navigate('ExercisePlanWrite');
								}}
							>
								<Text style={styles.popBtnText}>운동 계획 추가</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={[styles.commonLine]}></View>
					<View style={[styles.cmWrap]}>
						<View style={styles.exePlanList} ref={exePlanListRef}>
							{dateList.map((item,index)=> {								
								const seconds = item.exen_work_time;
								const minutes = Math.floor(seconds / 60);
  							const remainingSeconds = seconds % 60;
								let runningString = '';
								if(minutes > 0){
									runningString += minutes+'분';
									if(remainingSeconds > 0){
										runningString += ' '+remainingSeconds+'초';
									}
								}else{
									runningString += remainingSeconds+'초';
								}
								
								let sportsName = item.exen_exercise_name;
								if(item.exen_exercise_name == '직접입력'){
									sportsName = item.exen_exercise_etc;
								}
								
								if(item.exen_type == 0){
									return (
										<TouchableOpacity
											key={index}
											style={styles.exePlanBtn}
											activeOpacity={opacityVal}
											onPress={()=>{									
												navigation.navigate('ExerciseLogView', {exen_idx:item.exen_idx});
											}}
										>
											<View style={styles.exePlanLeft}>
												<View style={[styles.exePlanLeftCir, item.exen_type == 1 ? styles.exePlanLeftCir2 : null]}></View>
												<View style={styles.exePlanLeftCont}>
													<Text style={styles.exePlanLeftText}>{sportsName}</Text>
												</View>
											</View>
											<View style={styles.exePlanRight}>
												<Text style={styles.exePlanRightText}>{runningString}</Text>
											</View>
										</TouchableOpacity>
									)
								}else if(item.exen_type == 1){
									return (
										<TouchableOpacity
											style={styles.exePlanBtn}
											activeOpacity={opacityVal}
											onPress={()=>{									
												navigation.navigate('ExercisePlanView', {exen_idx:item.exen_idx});
											}}
										>
											<View style={styles.exePlanLeft}>
												<View style={[styles.exePlanLeftCir, styles.exePlanLeftCir2]}></View>
												<View style={styles.exePlanLeftCont}>
													<Text style={styles.exePlanLeftText}>{sportsName}</Text>
												</View>
											</View>
											<View style={styles.exePlanRight}>
												<Text style={styles.exePlanRightText}>{item.exen_start_hour} : {item.exen_start_minute}</Text>
											</View>
										</TouchableOpacity>
									)
								}
							})}

							{dateList.length > 0 ? null : (
								<View style={styles.notData}>
									<Text style={styles.notDataText}>등록된 운동이 없습니다.</Text>
								</View>
							)}

							{/* <TouchableOpacity
								style={styles.exePlanBtn}
								activeOpacity={opacityVal}
								onPress={()=>{									
									navigation.navigate('ExerciseLogView', {ex_idx:1});
								}}
							>
								<View style={styles.exePlanLeft}>
									<View style={[styles.exePlanLeftCir]}></View>
									<View style={styles.exePlanLeftCont}>
										<Text style={styles.exePlanLeftText}>직접 입력한 운동</Text>
									</View>
								</View>
								<View style={styles.exePlanRight}>
									<Text style={styles.exePlanRightText}>2분</Text>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.exePlanBtn}
								activeOpacity={opacityVal}
								onPress={()=>{									
									navigation.navigate('ExerciseLogView', {ex_idx:1});
								}}
							>
								<View style={styles.exePlanLeft}>
									<View style={[styles.exePlanLeftCir]}></View>
									<View style={styles.exePlanLeftCont}>
										<Text style={styles.exePlanLeftText}>필라테스</Text>
									</View>
								</View>
								<View style={styles.exePlanRight}>
									<Text style={styles.exePlanRightText}>10분</Text>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.exePlanBtn}
								activeOpacity={opacityVal}
								onPress={()=>{									
									navigation.navigate('ExercisePlanView', {ex_idx:1});
								}}
							>
								<View style={styles.exePlanLeft}>
									<View style={[styles.exePlanLeftCir, styles.exePlanLeftCir2]}></View>
									<View style={styles.exePlanLeftCont}>
										<Text style={styles.exePlanLeftText}>탁구</Text>
									</View>
								</View>
								<View style={styles.exePlanRight}>
									<Text style={styles.exePlanRightText}>계획</Text>
								</View>
							</TouchableOpacity> */}
						</View>
					</View>
				</ScrollView>
			) : null}

      <View style={styles.gapBox}></View>

      {(keyboardStatus == 0 || keyboardStatus == 1) && tabState == 1 ? (
			<TouchableOpacity
        style={[styles.wrtBtn, styles.wrtBtnBoxShadow, keyboardStatus == 1 ? styles.wrtBtnHide : null]}
        activeOpacity={opacityVal}
        onPress={()=>{
					if(memberInfo?.member_type != 1){
						ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
					}else{
						navigation.navigate('TodayExerciseWrite');
					}
			}}
      >
				<ImgDomain fileWidth={60} fileName={'icon_write.png'}/>
      </TouchableOpacity>
			) : null}

			<Modal
				visible={startPop}
				transparent={true}
				animationType={"none"}				
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 						
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => handleDialogCancel()}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>운동 시작</Text>							
						</View>				
						<View>
							<Text style={[styles.popTitleDesc, styles.mgt0]}>운동을 시작하시겠습니까?</Text>
							<Text style={[styles.popTitleDesc, styles.mgt5]}>시작 후 운동 종목 변경 불가합니다.</Text>							
						</View>
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => startPopOff()}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>취소</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => handleDialogCancel()}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<Modal
				visible={endPop}
				transparent={true}
				animationType={"none"}				
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 						
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => handleDialogCancel()}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>운동 종료</Text>							
						</View>				
						<View>
							<Text style={[styles.popTitleDesc, styles.mgt0]}>운동을 종료하시겠습니까?</Text>						
						</View>
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => handleDialogCancel()}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>취소</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => handleDialogConfirm()}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<Modal
				visible={alertPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setAlertPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 						
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => setAlertPop(false)}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>{alertMsg}</Text>							
						</View>										
						<View style={[styles.popBtnBox]}>							
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => setAlertPop(false)}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

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

  header: {backgroundColor:'#141E30'},
	headerTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:20,paddingBottom:10,},
	headerTopTitle: {paddingLeft:20,},
	headerTitleText: {fontFamily:Font.RobotoMedium,fontSize:24,lineHeight:26,color:'#fff'},
	headerLnb: {flexDirection:'row',alignItems:'center',paddingRight:15,},
	headerLnbBtn: {marginLeft:6,paddingHorizontal:5,},
	headerBot: {flexDirection:'row',},
	headerTab: {width:widnowWidth/3,height:60,alignItems:'center',justifyContent:'center',position:'relative',paddingTop:10,},
	headerTabText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#fff'},
	headerTabTextOn: {fontFamily:Font.NotoSansBold,color:'#FFD194'},
	activeLine: {width:widnowWidth/3,height:4,backgroundColor:'#FFD194',position:'absolute',left:0,bottom:0,zIndex:10,},

	commonLine: {width:widnowWidth,height:6,backgroundColor:'#F2F4F6'},
  cmWrap: {paddingBottom:40,paddingHorizontal:20,},
	cmWrap2: {paddingTop:30},
	cmWrap3: {paddingTop:20},
	cmWrap4: {paddingTop:15},
	cmWrap5: {paddingBottom:30},
	wrtBtn: {position:'absolute',right:20,bottom:96,width:60,height:60,zIndex:100,backgroundColor:'#fff'},
	wrtBtnHide: {opacity:0,},
	wrtBtnBoxShadow: {
    borderRadius:50,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
		elevation: 4,
	},
  exeList: {width:widnowWidth/3},
  exeButton: {},

	inputView: {marginTop:10,},
	selectView: {position:'relative',justifyContent:'center'},
	input: {width:innerWidth,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,paddingLeft:15,paddingRight:40,fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
	select: {width:innerWidth,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,paddingLeft:15,paddingRight:40,fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
	selectCont: {},
	selectArr: {position:'absolute',right:20,},
	timerView: {alignItems:'center',justifyContent:'center',backgroundColor:'#F9FAFB',height:130,borderRadius:5,marginTop:100,},
	timerView2: {marginTop:42},
	timerViewText: {fontFamily:Font.NotoSansBlack,fontSize:38,lineHeight:46,color:'#888'},
	timerViewText2: {color:'#1e1e1e'},
	timerBtnView: {alignItems:'center',marginTop:50,},
	timerBtn: {alignItems:'center',justifyContent:'center',width:180,height:58,backgroundColor:'#F7B863',borderRadius:5,},
	timerBtn2: {backgroundColor:'#ededed'},
	timerBtnText: {fontFamily:Font.NotoSansMedium,fontSize:20,lineHeight:27,color:'#fff'},
	timerBtnText2: {color:'#1E1E1E'},
	timerInfo: {marginTop:60,paddingTop:15,borderTopWidth:1,borderTopColor:'#EDEDED'},
	timerInfoTitle: {flexDirection:'row',alignItems:'center'},
	timerInfoTitleText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:15,color:'#888'},
	timerInfoTitleText1: {width:8,},
	timerInfoTitleText2: {width:innerWidth-8},
	timerInfoDesc: {paddingLeft:10,},
	timerInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:17,color:'#888'},

	dayLine: {width:innerWidth/7,height:1,backgroundColor:'#EDEDED',marginBottom:10,},
	dayContainer: {width:innerWidth/7,height:24,alignItems:'center',justifyContent:'center',},
  day: {width:24,height:24,alignItems:'center',justifyContent:'center',borderRadius:50,},
  dateTextContainer: {flex:1,justifyContent:'center',},
  dateText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:24,color:'#1e1e1e'},
  disabledDay: {opacity:0.4,},
  disabledText: {color:'#ccc',},
	dotContainer: {position:'absolute',right:-3,top:2,},
  dot: {width:5,height:5,borderRadius:10,},

	calendarState: {flexDirection:'row',borderTopWidth:1,borderTopColor:'#EDEDED',marginTop:10,paddingTop:13,},
	calendarStateView: {flexDirection:'row',alignItems:'center',marginRight:20,},
	calendarStateCircle: {width:6,height:6,backgroundColor:'#243b55',borderRadius:20,marginRight:6,},
	calendarStateCircle2: {backgroundColor:'#D1913C'},
	calendarStateText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:19,color:'#888'},

	exePlanList: {marginTop:5,},
	exePlanBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:15,borderBottomWidth:1,borderBottomColor:'#EDEDED'},
	exePlanLeft: {flexDirection:'row',alignItems:'center',width:innerWidth-50},
	exePlanLeftCir: {width:10,height:10,backgroundColor:'#243B55',borderRadius:20,},
	exePlanLeftCir2: {backgroundColor:'#D1913C'},
	exePlanLeftCont: {paddingLeft:8,},
	exePlanLeftText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
	exePlanRight: {flexDirection:'row',justifyContent:'flex-end',},
	exePlanRightText: {textAlign:'right',fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:20,color:'#888888'},

	notData: {paddingTop:50},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:13,color:'#666'},

	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight},
	popBack2: {backgroundColor:'rgba(0,0,0,0.7)',},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},	
  prvPop2: {paddingTop:20,},
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
  popInImageView: {alignItems:'center',marginBottom:20,},
  popInImageViewBox: {width:100,height:100,borderRadius:50,overflow:'hidden',alignItems:'center',justifyContent:'center'},
  popInImage: {},
	popTitle: {paddingBottom:20,},
	popTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap',},
  popTitleFlexWrap: {position:'relative'},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E',},
  popTitleText2: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#1e1e1e'},
  popTitleFlexText: {position:'relative',top:2,},
	popTitleDesc: {width:innerWidth-40,textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:21,color:'#1e1e1e',marginTop:20,},
	emoticon: {},
	popIptBox: {paddingTop:10,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {marginTop:30,},
	popBtnBoxFlex: {flexDirection:'row',justifyContent:'space-between'},
  popBtnBoxFlex2: {width:innerWidth},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtn2: {width:(innerWidth/2)-25,},
  popBtn3: {width:(innerWidth/2)-5,},
	popBtnOff: {backgroundColor:'#EDEDED',},
	popBtnOff2: {backgroundColor:'#fff',marginTop:10,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

	mgt0: {marginTop:0,},
	mgt2: {marginTop:2,},
	mgt5: {marginTop:5,},

	colorRed: {color:'#EE4245'},
})

export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(TodayExercise);