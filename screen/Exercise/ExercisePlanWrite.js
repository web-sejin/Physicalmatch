import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';

import APIs from '../../assets/APIs';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const paddTop = Platform.OS === 'ios' ? 0 : 15;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

LocaleConfig.locales['fr'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: "오늘"
};
LocaleConfig.defaultLocale = 'fr';

const alim_ary = [
  {alim_idx:0, alim_desc:'알림 없음'},
  {alim_idx:1, alim_desc:'정시'},
  {alim_idx:2, alim_desc:'30분 전'},
  {alim_idx:3, alim_desc:'1시간 전'},
  {alim_idx:4, alim_desc:'3시간 전'},
  {alim_idx:5, alim_desc:'직접 설정'},
]

const ExercisePlanWrite = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route	
  const exen_idx = params ? params['exen_idx'] : null;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberIdx, setMemberIdx] = useState();
  const [exeList, setExeList] = useState([]);

  const [content, setContent] = useState('');   
  const [todayExe, setTodayExe] = useState(null);
	const [todayEtc, setTodayEtc] = useState('');
  const [logDate, setLogDate] = useState('');
  const [logYoil, setLogYoil] = useState('');
  const [logHour, setLogHour] = useState('');
  const [logMin, setLogMin] = useState('');
  const [radio, setRadio] = useState(8);
  const [alimIdx, setAlimIdx] = useState(0);
  const [alimDesc, setAlimDesc] = useState('알림 없음');
  const [alimDirectHour, setAlimDirectHour] = useState('');
  const [alimDirectMin, setAlimDirectMin] = useState('');

  const [logDateTemp, setLogDateTemp] = useState('');
  const [logYoilTemp, setLogYoilTemp] = useState('');
  const [logHourTemp, setLogHourTemp] = useState('');
  const [logMinTemp, setLogMinTemp] = useState('');
  const [alimIdxTemp, setAlimIdxTemp] = useState();
  const [alimDescTemp, setAlimDescTemp] = useState('');
  const [alimDirectHourTemp, setAlimDirectHourTemp] = useState('');
  const [alimDirectMinTemp, setAlimDirectMinTemp] = useState('');

  const [calendarPop, setCalendarPop] = useState(false);
  const [timePop, setTimePop] = useState(false);
  const [alimPop, setAlimPop] = useState(false);
  const [exePop, setExePop] = useState(false);

  const hourItems = [];
  for(let i=1; i<=24; i++){
    const label = `${i}`.padStart(2, '0');
    hourItems.push({ label: label, value: i }); 
  }

  const minItems = [];
  for(let i=0; i<=59; i++){
    const label = `${i}`.padStart(2, '0');
    minItems.push({ label: label, value: i }); 
  }

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
		}else{
			//console.log("isFocused");      
			setRouteLoad(true);
			setPageSt(!pageSt);

      AsyncStorage.getItem('member_idx', (err, result) => {
				//console.log('member_idx :::: ', result);
				setMemberIdx(result);
			});
		}

		Keyboard.dismiss();
		Toast.hide();
    setLoading(false);
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

  // useEffect(() => {
  //   let totalReq = 1;
  //   let currReq = 0;
    
  //   if(phoneImage.path != '' && phoneImage.path != undefined){
  //     currReq++;
  //   }

  //   //console.log(currReq+'/'+totalReq);
  //   if(currReq == totalReq){
  //     //setState(true);
  //   }else{
  //     //setState(false);
  //   }
  // }, [phoneImage]);
  useEffect(() => {
    getExeSelect();
    if(!exen_idx){          
      const tempDate = new Date();
      setLogHour(tempDate.getHours());
      setLogMin(tempDate.getMinutes());
    }
  }, [memberIdx]);

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
      if(exen_idx){
        getExeDetail();
      }      
		}
	}

  const getExeDetail = async () => {
    let sData = {
			basePath: "/api/exercise/",
			type: "GetPlanDetail",
			exen_idx: exen_idx,
      member_idx: memberIdx
		};

		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
      const logDateObj = new Date(response.data.exen_start_date);
      const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
      const dayOfWeek = daysOfWeek[logDateObj.getDay()];

			setLogDate(response.data.exen_start_date);      
      setLogYoil(dayOfWeek);      
      setLogHour(response.data.exen_start_hour);      
      setLogMin(response.data.exen_start_minute);            
      setContent(response.data.exen_content);
      setTodayExe(response.data.exen_exercise_name);
      if(response.data.exen_exercise_name == '직접입력'){
        setTodayEtc(response.data.exen_exercise_etc);
      }      
      setAlimIdx(response.data.exen_alim);
      if(response.data.exen_alim == 5){
        setAlimDirectHour(response.data.exen_alim_hour);
        setAlimDirectMin(response.data.exen_alim_minute); 
      }
      if(response.data.exen_repeat >= 7){
        setRadio(response.data.exen_repeat);
      }else{
        setRadio(0);
      }
			setLoading(false);
		}
  }

  const exePlanUpdate = async () => {
    if(logDate == ''){
      ToastMessage('운동 시작 날짜를 선택해 주세요.');
      return false;
    }

    if(logHour == ''){
      ToastMessage('운동 시작 시간을 선택해 주세요.');
      return false;
    }
    
    if(!todayExe){			
			ToastMessage('운동 종목을 선택해 주세요.');
			return false;
		}

		if(todayExe == '직접입력' && todayEtc == ''){
			ToastMessage('운동 종목을 입력해 주세요.');
			return false;
		}

    Keyboard.dismiss();
    setLoading(true);

    let apiType = 'SetPlan';
    if(exen_idx){
      apiType = 'UpdatePlan';
    }

    let repeat = radio;
    if(radio == 0){
      if(logYoil == '일'){
        repeat = 0;
      }else if(logYoil == '월'){
        repeat = 1;
      }else if(logYoil == '화'){
        repeat = 2;
      }else if(logYoil == '수'){
        repeat = 3;
      }else if(logYoil == '목'){
        repeat = 4;
      }else if(logYoil == '금'){
        repeat = 5;
      }else if(logYoil == '토'){
        repeat = 6;
      }
    }

    let sData = {
			basePath: "/api/exercise/",
			type: apiType,
      member_idx: memberIdx,
      exen_start_date: logDate,
      exen_start_hour: String(logHour).padStart(2, '0'),
      exen_start_minute: String(logMin).padStart(2, '0'),      
      exen_exercise_name: todayExe,
      exen_exercise_etc: todayEtc,
      exen_repeat: repeat,
      exen_alim: alimIdx,
      exen_alim_hour: alimDirectHour,
      exen_alim_minute: alimDirectMin,
      exen_content: content,      
		};

    if(exen_idx){
      sData.exen_idx = exen_idx;
    }
    
    let submitState = false;
    const response = await APIs.send(sData);    
    //console.log(response);
    if(response.code == 200){
      submitState = true;
    }
      
    if(submitState){      
      if(exen_idx){
        ToastMessage('운동계획이 수정되었습니다.');
      }else{
        ToastMessage('운동계획이 작성되었습니다.');
      }      
      setPreventBack(false);
      setTimeout(function(){
        setLoading(false);        
        navigation.navigate('TodayExercise', {reload:true, tab:3});
      }, 200)
    }else{
      ToastMessage('잠시후 다시 이용해 주세요.');
      setLoading(false);
    }
  }

  const handleSelect = (v) => {
		if(v != '직접입력'){
			setTodayEtc('');
		}
		setTodayExe(v);
    setExePop(false);
	}

  const modifyDate = () => {    
    const logDateObj = new Date(logDateTemp);
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = daysOfWeek[logDateObj.getDay()];
    
    setLogDate(logDateTemp);
    setLogYoil(dayOfWeek);
    setCalendarPop(false);
  }

  const modifyTime = () => {
    setLogHour(logHourTemp);
    setLogMin(logMinTemp);
    setTimePop(false);
  }

  const modifyAlim = () => {
    if(alimIdxTemp == 5){
      if(alimDirectHourTemp == '' && alimDirectMinTemp == ''){
        return false;
      }else{
        setAlimDirectHour(alimDirectHourTemp);
        setAlimDirectMin(alimDirectMinTemp);    
      }
    }
    setAlimIdx(alimIdxTemp);   
    setAlimDesc(alimDescTemp);
    setAlimPop(false);
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <Header navigation={navigation} headertitle={'운동 계획'} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior={behavior}
        style={{flex: 1}}
      >
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <View style={[styles.cmWrap, styles.pdb20]}>                
                <View style={[styles.logInfo]}>
                  <TouchableOpacity 
                    style={[styles.logInfoView, styles.logInfoDate]}
                    activeOpacity={opacityVal}
                    onPress={()=>{                      
                      setLogDateTemp(logDate);
                      setLogYoilTemp(logYoil);
                      setCalendarPop(true);
                    }}                    
                  >
                    <ImgDomain fileWidth={17} fileName={'icon_exe_date.png'} />
                    {logDate != '' ? (
                      <Text style={styles.logInfoText}>{logDate}({logYoil})</Text>
                    ) : (
                      <Text style={styles.logInfoText}>운동 시작 날짜를 선택해 주세요.</Text>
                    )}                    
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.logInfoView, styles.logInfoTime, styles.mgt30]}
                    activeOpacity={opacityVal}
                    onPress={()=>{                      
                      setLogHourTemp(logHour);
                      setLogMinTemp(logMin);
                      setTimePop(true);
                    }}
                  >
                    <ImgDomain fileWidth={17} fileName={'icon_exe_clock.png'} />
                    {logHour != '' ? (
                      <Text style={styles.logInfoText}>{String(logHour).padStart(2, '0')}:{String(logMin).padStart(2, '0')}</Text>
                    ) : (
                      <Text style={styles.logInfoText}>운동 시작 시간을 선택해 주세요.</Text>
                    )}                  
                  </TouchableOpacity>
                </View>                
                <View style={[styles.selectView, styles.mgt40]}>
                  {/* <RNPickerSelect
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
                  /> */}

                  <TouchableOpacity
                    style={styles.select}
                    activeOpacity={opacityVal}
                    onPress={()=>{
                      Keyboard.dismiss();
                      setExePop(true);
                    }}
                  >
                    {todayExe ? (
                      <Text style={[styles.selectText, styles.selectText2]}>{todayExe}</Text>
                    ) : (
                      <Text style={styles.selectText}>운동 종목 선택</Text>
                    )}                    
                    <View style={styles.selectArr}>
                      <ImgDomain fileWidth={10} fileName={'icon_arr3.png'}/>
                    </View>
                  </TouchableOpacity>
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
                  />
                </View>
                ) : null}
                <View style={[styles.mgt40]}>
                  <View style={styles.planWriteTh}>
                    <Text style={styles.planWriteThText}>반복 설정</Text>                    
                  </View>
                  <View style={[styles.planWriteRadio]}>
                    <TouchableOpacity
                      style={styles.planWriteRadioBtn}
                      activeOpacity={opacityVal}
                      onPress={()=>setRadio(8)}                                         
                    >
                      {radio == 8 ? (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
                      ) : (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
                      )}
                      <Text style={styles.planWriteRadioBtnText}>반복 없음</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.planWriteRadioBtn}
                      activeOpacity={opacityVal}
                      onPress={()=>setRadio(7)}                                         
                    >
                      {radio == 7 ? (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
                      ) : (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
                      )}
                      <Text style={styles.planWriteRadioBtnText}>매일</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.planWriteRadioBtn}
                      activeOpacity={opacityVal}
                      onPress={()=>setRadio(0)}                                         
                    >
                      {radio == 0 ? (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
                      ) : (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
                      )}
                      <Text style={styles.planWriteRadioBtnText}>매주</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.mgt40]}>
                  <View style={styles.planWriteTh}>
                    <Text style={styles.planWriteThText}>알림</Text>                    
                  </View>
                  <View style={styles.alimPopBtnView}>
                    <TouchableOpacity
                      style={styles.alimPopBtn}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        setAlimIdxTemp(alimIdx);
                        setAlimDescTemp(alimDesc);
                        if(alimIdx == 5){
                          setAlimDirectHourTemp(alimDirectHour);
                          setAlimDirectMinTemp(alimDirectMin);
                        }
                        setAlimPop(true);
                      }}
                    >
                      {alimIdx == 5 ? (
                        <Text style={styles.alimPopBtnText}>{alimDirectHour}시간 {alimDirectMin}분 전</Text>
                      ) : (
                        <Text style={styles.alimPopBtnText}>{alimDesc}</Text>
                      )}                      
                      <ImgDomain fileWidth={6} fileName={'icon_arr9.png'} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.mgt40}>
                  <TextInput
                    value={content}
                    onChangeText={(v) => {
                      setContent(v);
                    }}
                    style={[styles.textarea]}
                    placeholder={"메모를 입력하세요."}
                    placeholderTextColor="#B8B8B8"
                    multiline={true}
                    returnKyeType='done'
                  />
                </View>                       
              </View>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>

        <View style={styles.nextFix}>
          <TouchableOpacity 
            style={[styles.nextBtn]}
            activeOpacity={opacityVal}
            onPress={() => {
              exePlanUpdate();
            }}
          >
            {exen_idx ? (
              <Text style={styles.nextBtnText}>수정</Text>
            ): (
              <Text style={styles.nextBtnText}>추가</Text>
            )}            
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {loading ? (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#D1913C" />
      </View>
      ) : null}

      <Modal
				visible={calendarPop}
				transparent={true}
				animationType={"none"}	
        onRequestClose={() => setCalendarPop(false)}			
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
							onPress={() => setCalendarPop(false)}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>운동 시작 날짜</Text>							
						</View>				
						<View style={styles.calendarView}>
              <Calendar
                style={styles.calendar}
                  // 캘린더 내 스타일 수정
                theme={{
                  dayTextColor: '#1e1e1e',
                  todayTextColor: '#fff',
                  todayBackgroundColor: '#FFD194',
                  textDayFontSize: 14,                                     
                  textMonthFontSize: 12,                    
                  textSectionTitleColor: 'rgba(138, 138, 138, 1)',
                  textDisabledColor: '#DBDBDB',
                  selectedDayBackgroundColor:'#243B55',
                  selectedDayTextColor: '#fff',
                  monthTextColor:'#1e1e1e',
                  textMonthFontFamily:Font.NotoSansMedium,
                  textMonthFontSize:12,
                }}
                markedDates={{
                  [logDateTemp]: { selected: true, marked: true, },
                }}                         
                onDayPress={(day) => {
                  //console.log(day);
                  setLogDateTemp(day.dateString);
                }} // 날짜 클릭 시 그 날짜 출력                    
                hideExtraDays={false} // 이전 달, 다음 달 날짜 숨기기                    
                monthFormat={'yyyy년 M월'} // 달 포맷 지정                                    
                // 달 이동 화살표 구현 왼쪽이면 왼쪽 화살표 이미지, 아니면 오른쪽 화살표 이미지
                renderArrow={(direction) => direction === "left" ?
                  <AutoHeightImage name="left" width={22} source={require('../../assets/image/cal_prev.png')}/> : <AutoHeightImage name="right" width={22} source={require('../../assets/image/cal_next.png')}/>
                }
              />
            </View>
						<View style={[styles.popBtnBox]}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => modifyDate()}
							>
								<Text style={[styles.popBtnText]}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      <Modal
				visible={timePop}
				transparent={true}
				animationType={"none"}	
        onRequestClose={() => setTimePop(false)}			
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
							onPress={() => setTimePop(false)}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>운동 시작 시간</Text>							
						</View>				
						<View style={styles.startTimeView}>
              <RNPickerSelect
                value={logHourTemp}
                onValueChange={(value, index) => {
                  Keyboard.dismiss();
                  setLogHourTemp(value);									
                }}
                placeholder={{
                  label: '선택',
                  value: null,
                  color: '#666'
                }}
                items={hourItems}
                fixAndroidTouchableBug={true}
                useNativeAndroidPickerStyle={false}
                multiline={false}							
                style={{
                  placeholder: {fontFamily:Font.NotoSansRegular,color: '#666'},
                  inputAndroid: [styles.select, styles.startTimeSelect],
                  inputAndroidContainer: styles.selectCont,
                  inputIOS: [styles.select, styles.startTimeSelect],
                  inputIOSContainer: styles.selectCont,
                }}
              />
              <View style={styles.startTimeBar}>
                <Text style={styles.startTimeBarText}>:</Text>
              </View>
              <RNPickerSelect
                value={logMinTemp}
                onValueChange={(value, index) => {
                  Keyboard.dismiss();
                  setLogMinTemp(value);									
                }}
                placeholder={{
                  label: '선택',
                  value: null,
                  color: '#666'
                }}
                items={minItems}
                fixAndroidTouchableBug={true}
                useNativeAndroidPickerStyle={false}
                multiline={false}							
                style={{
                  placeholder: {fontFamily:Font.NotoSansRegular,color: '#666'},
                  inputAndroid: [styles.select, styles.startTimeSelect],
                  inputAndroidContainer: styles.selectCont,
                  inputIOS: [styles.select, styles.startTimeSelect],
                  inputIOSContainer: styles.selectCont,
                }}
              />
            </View>
						<View style={[styles.popBtnBox]}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => modifyTime()}
							>
								<Text style={[styles.popBtnText]}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      <Modal
				visible={alimPop}
				transparent={true}
				animationType={"none"}	
        onRequestClose={() => setAlimPop(false)}			
			>        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "position"} 
          style={{ flex: 1 }}
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
                onPress={() => setAlimPop(false)}
              >
                <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
              </TouchableOpacity>		
              <View style={[styles.popTitle]}>
                <Text style={styles.popTitleText}>알림</Text>							
              </View>				
              <View style={styles.alimListView}>
                {alim_ary.map((item, index) => {
                  return (
                    <TouchableOpacity 
                      key={index}
                      style={[styles.alimListBtn, index != 0 ? styles.mgt20 : null]}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        setAlimIdxTemp(item.alim_idx);
                        setAlimDescTemp(item.alim_desc);
                        if(item.alim_idx != 5){
                          setAlimDirectHourTemp('');
                          setAlimDirectMinTemp('');
                        }
                      }}
                    >
                      <Text style={[styles.alimListBtnText]}>{item.alim_desc}</Text>
                      {alimIdxTemp == item.alim_idx ? (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
                      ) : (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
                      )}                    
                    </TouchableOpacity>
                  )
                })}
                {alimIdxTemp == 5 ? (
                <View style={styles.alimInputView}>
                  <TextInput
                    value={alimDirectHourTemp}
                    onChangeText={(v) => {
                      setAlimDirectHourTemp(v);                     
                    }}
                    placeholder={'0'}
                    placeholderTextColor="#DBDBDB"
                    style={[styles.alimInput]}                    
                    returnKyeType='done'
                  />
                  <Text style={styles.alimInputNext}>시간</Text>
                  <TextInput
                    value={alimDirectMinTemp}
                    onChangeText={(v) => {
                      setAlimDirectMinTemp(v);                     
                    }}
                    placeholder={'0'}
                    placeholderTextColor="#DBDBDB"
                    style={[styles.alimInput, styles.mgl20]}                    
                    returnKyeType='done'
                    keyboardType="numeric"
                  />
                  <Text style={styles.alimInputNext}>분 전</Text>
                </View>
                ) : null}
                {alimIdxTemp == 5 && alimDirectHourTemp == '' && alimDirectMinTemp == '' ? (
                <View style={styles.timerAlert}>
                  <Text style={styles.timerAlertText}>시간을 입력해 주세요.</Text>
                </View>
                ) : null}
              </View>
              <View style={[styles.popBtnBox]}>
                <TouchableOpacity 
                  style={[styles.popBtn]}
                  activeOpacity={opacityVal}
                  onPress={() => modifyAlim()}
                >
                  <Text style={[styles.popBtnText]}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
			</Modal>

      <Modal
				visible={exePop}
				transparent={true}
				animationType={"none"}	
        onRequestClose={() => setExePop(false)}			
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
							onPress={() => setExePop(false)}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>운동 종목</Text>							
						</View>				
						<View style={styles.exeListView}>
              <ScrollView>
                {exeList.map((item, index) => {                  
                  return (
                    <TouchableOpacity 
                      key={index}
                      style={[styles.alimListBtn, index != 0 ? styles.mgt20 : null]}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        handleSelect(item.exe_name);
                      }}
                    >
                      <Text style={[styles.alimListBtnText]}>{item.exe_name}</Text>
                      {todayExe == item.exe_name ? (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
                      ) : (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
                      )}                    
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },	
	gapBox: {height:86,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	

  cmWrap: {paddingVertical:30,paddingHorizontal:20},
  cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},
    
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:52,color:'#fff'},

  textarea: {width:innerWidth,height:220,paddingVertical:12,paddingHorizontal:15,textAlignVertical:'top',fontFamily:Font.NotoSansRegular,fontSize:14,color:'#1e1e1e',borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,},

  imgBox: {alignItems:'center',justifyContent:'center'},
	imgBtn: {alignItems:'center',justifyContent:'center',width:220,height:220,backgroundColor:'#F9FAFB',borderRadius:5,overflow:'hidden',position:'relative',borderWidth:1,borderColor:'#EDEDED'},
  imgBtn2: {borderWidth:0,},
	imgText: {width:43,height:21,backgroundColor:'#fff',borderRadius:50,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:21,textAlign:'center',color:'#243B55',position:'absolute',right:5,bottom:5,},

  header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},

  logInfo: {},
  logInfoView: {flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#DBDBDB',paddingBottom:3,},
  logInfoDate: {},
  logInfoTime: {},
  logInfoText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#1e1e1e',marginLeft:9,},
  inputView: {marginTop:10,},
  selectView: {position:'relative',justifyContent:'center'},
	input: {width:innerWidth,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,paddingLeft:15,paddingRight:15,fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},  
	//select: {width:innerWidth,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,paddingLeft:15,paddingRight:40,fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
  select: {justifyContent:'center',width:innerWidth,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,paddingLeft:15,paddingRight:40,fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e',position:'relative'},
  selectText: {fontFamily:Font.NotoSansRegular,color: '#666'},
  selectText2: {color:'#1e1e1e'},
	selectCont: {},
	selectArr: {position:'absolute',right:20,},
  startTimeView: {flexDirection:'row',alignItems:'center'},
  startTimeSelect: {width:(innerWidth-50)/2},
  startTimeBar: {alignItems:'center',justifyContent:'center',width:20,},
  startTimeBarText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#1e1e1e'},
  timeprInputView: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
  timeprInput: {width:100,textAlign:'center'},
  inputUnit: {width:30,alignItems:'flex-end'},
  inputUnitText: {fontFamily:Font.NotoSansRegular,fontSize:14,color:'#1e1e1e'},
  timerAlert: {marginTop:10,},
  timerAlertText: {fontFamily:Font.NotoSansRegular,fontSize:12,color:'#EE4245'},  

  planWriteTh: {},
  planWriteThText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
  planWriteRadio: {flexDirection:'row',flexWrap:'wrap',marginTop:15,},
  planWriteRadioBtn: {flexDirection:'row',alignItems:'center',marginRight:30,},
  planWriteRadioBtnText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:20,color:'#1e1e1e',marginLeft:6,},

  alimPopBtnView: {marginTop:15,},
  alimPopBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',width:innerWidth,height:52,borderWidth:1,borderColor:'#243B55',borderRadius:5,},
  alimPopBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#243B55',marginRight:10,},
  alimListView: {},
  exeListView: {maxHeight:innerHeight*0.64},
  alimListBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  alimListBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
  alimInputView: {flexDirection:'row',alignItems:'flex-end',marginTop:10,},
  alimInput: {width:80,height:34,backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#DBDBDB',textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:16,color:'#1e1e1e',padding:0,},
  alimInputNext: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:22,color:'#1e1e1e',marginLeft:5,},

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
  popBtnBoxFlex: {flexDirection:'row',justifyContent:'space-between'},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtn2: {width:(innerWidth/2)-25,},
	popBtnOff: {backgroundColor:'#EDEDED',},
	popBtnOff2: {backgroundColor:'#fff',marginTop:10,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

  red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

  pdt0: {paddingTop:0},
  pdt10: {paddingTop:10},
  pdb0: {paddingBottom:0},
  pdb10: {paddingBottom:10},
  pdb20: {paddingBottom:20},
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
	mgl0: {marginLeft:0},
  mgl20: {marginLeft:20}
})

export default ExercisePlanWrite