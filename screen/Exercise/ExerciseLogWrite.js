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

const exe_ary = [
	{exe_idx:1, exe_name:'헬스'},
	{exe_idx:2, exe_name:'필라테스'},
	{exe_idx:3, exe_name:'요가'},
	{exe_idx:4, exe_name:'테니스'},
	{exe_idx:5, exe_name:'골프'},
	{exe_idx:99, exe_name:'직접입력'}
]

const ExerciseLogWrite = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route	
  const ex_idx = params['ex_idx'];
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberIdx, setMemberIdx] = useState();
  const [exeList, setExeList] = useState(exe_ary);

  const [phoneImage, setPhoneImage] = useState({});
  const [content, setContent] = useState('');   
  const [todayExe, setTodayExe] = useState(null);
	const [todayEtc, setTodayEtc] = useState('');
  const [logDate, setLogDate] = useState('');
  const [logYoil, setLogYoil] = useState('');
  const [logHour, setLogHour] = useState('');
  const [logMin, setLogMin] = useState('');
  const [logTimer, setLogTimer] = useState('');

  const [logDateTemp, setLogDateTemp] = useState('');
  const [logYoilTemp, setLogYoilTemp] = useState('');
  const [logHourTemp, setLogHourTemp] = useState('');
  const [logMinTemp, setLogMinTemp] = useState('');
  const [logTimerTemp, setLogTimerTemp] = useState('');

  const [calendarPop, setCalendarPop] = useState(false);
  const [timePop, setTimePop] = useState(false);
  const [timerPop, setTimerPop] = useState(false);

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
    if(memberIdx && ex_idx){
      setLogDate('2024-09-22');
      setLogYoil('일');
      setLogHour('11');      
      setLogMin('32');
      setLogTimer('15');
    }
  }, [memberIdx])

  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 992,
      height: 992,
      //cropping: true,
    })
		.then(image => {      
			let selectObj = {path: image.path, mime: image.mime}			
      console.log(selectObj);
      setPhoneImage(selectObj);
		})
		.finally(() => {
      
		});
  }

  const exeLogUpdate = async () => {
    if(phoneImage.path == '' || phoneImage.path == undefined){
      ToastMessage('사진을 등록해 주세요.');
      return false;
    }

    if(!todayExe){			
			ToastMessage('운동 종목을 선택해 주세요.');
			return false;
		}

		if(todayExe == 99 && todayEtc == ''){
			ToastMessage('운동 종목을 입력해 주세요.');
			return false;
		}

    Keyboard.dismiss();
    //setLoading(true);

    return false;

    let sData = {
			basePath: "/api/community/",
			type: "SetCommunity",
      member_idx: memberIdx,            
      comm_content: content,
		};
    
    let submitState = false;
    let fileData = [];
    if(phoneImage.path != undefined){
      fileData[0] = {uri: phoneImage.path, name: 'exercise_log.png', type: phoneImage.mime};
      sData.comm_files = fileData;

      const formData = APIs.makeFormData(sData)
      const response = await APIs.multipartRequest(formData);
      //console.log('111 ', response);
      if(response.code == 200){
        submitState = true;
      }
    }else{
      const response = await APIs.send(sData);    
      //console.log('222 ', response);
      if(response.code == 200){
        submitState = true;
      }
    }

      
    if(submitState){      
      ToastMessage('오운완이 작성되었습니다.');
      setPreventBack(false);
      setTimeout(function(){
        setLoading(false);
        navigation.navigate('TabNavigation', {screen:'TodayExercise', params : {reload:true, writeType:1}});
      }, 200)
    }
  }

  const handleSelect = (v) => {
		if(v != 99){
			setTodayEtc('');
		}
		setTodayExe(v);
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

  const modifyTimer = () => {    
   if(parseInt(logTimerTemp) < 0 || parseInt(logTimerTemp) > 600){
     return false;
   }   
   setLogTimer(logTimerTemp);
   setTimerPop(false);
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <Header navigation={navigation} headertitle={'운동 기록 수정'} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior={behavior}
        style={{flex: 1}}
      >
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <View style={[styles.cmWrap, styles.pdb20]}>
                <View style={styles.imgCenter}>
                  <View style={styles.imgBox}>
                    <TouchableOpacity
                      style={[styles.imgBtn, phoneImage.path != '' && phoneImage.path != undefined ? styles.imgBtn2 : null]}
                      activeOpacity={opacityVal}
                      onPress={() => chooseImage()}
                    >
                      {phoneImage.path != '' && phoneImage.path != undefined ? (
                        <AutoHeightImage width={220} source={{ uri: phoneImage.path }} />
                      ) : (
                        <ImgDomain fileWidth={36} fileName={'icon_add_img_back.png'}/>
                      )}
                    </TouchableOpacity>

                    {phoneImage.path != '' && phoneImage.path != undefined ? (
                      <TouchableOpacity 
                        style={styles.imgDeleteBtn}
                        activeOpacity={opacityVal}
                        onPress={()=>setPhoneImage({})}
                      >
                        <ImgDomain fileWidth={30} fileName={'icon_power_x.png'} />
                      </TouchableOpacity>
                    ) : null}                    
                  </View>                  
                </View>
                <View style={[styles.logInfo, styles.mgt40]}>
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
                    <Text style={styles.logInfoText}>{logDate}({logYoil})</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.logInfoView, styles.logInfoTime]}
                    activeOpacity={opacityVal}
                    onPress={()=>{                      
                      setLogHourTemp(logHour);
                      setLogMinTemp(logMin);
                      setTimePop(true);
                    }}
                  >
                    <ImgDomain fileWidth={17} fileName={'icon_exe_clock.png'} />
                    <Text style={styles.logInfoText}>{String(logHour).padStart(2, '0')}:{String(logMin).padStart(2, '0')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.logInfoView, styles.logInfoPeri]}
                    activeOpacity={opacityVal}
                    onPress={()=>{
                      setLogTimerTemp(logTimer);
                      setTimerPop(true);
                    }}
                  >
                    <ImgDomain fileWidth={17} fileName={'icon_exe_min.png'} />
                    <Text style={styles.logInfoText}>{logTimer}분</Text>
                  </TouchableOpacity>
                </View>                
                <View style={[styles.selectView, styles.mgt30]}>
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
                      value: item.exe_idx,
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
                {todayExe == 99 ? (
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
                <View style={styles.mgt20}>
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
              exeLogUpdate();
            }}
          >
            <Text style={styles.nextBtnText}>수정</Text>
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
            onPress={() => setCalendarPop(false)}
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
            onPress={() => setTimePop(false)}
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
				visible={timerPop}
				transparent={true}
				animationType={"none"}	
        onRequestClose={() => setTimerPop(false)}			
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
            onPress={() => setTimerPop(false)}					
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => setTimerPop(false)}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>운동 시간</Text>							
						</View>				
						<View style={styles.timeprInputView}>
              <TextInput
                value={logTimerTemp}
                onChangeText={(v) => {
                  setLogTimerTemp(v);
                }}
                placeholder={'운동 시간을 입력해 주세요.'}
                keyboardType="numeric"
                placeholderTextColor="#DBDBDB"
                style={[styles.input, styles.timeprInput]}                
                returnKyeType='done'                
              />
              <View style={styles.inputUnit}>
                <Text style={styles.inputUnitText}>분</Text>
              </View>
            </View>
            {parseInt(logTimerTemp) < 1 || parseInt(logTimerTemp) > 600 ? (
            <View style={styles.timerAlert}>
              <Text style={styles.timerAlertText}>운동 시간은 1~600분 사이로 입력해 주세요.</Text>
            </View>
            ) : null}
						<View style={[styles.popBtnBox]}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => modifyTimer()}
							>
								<Text style={[styles.popBtnText]}>확인</Text>
							</TouchableOpacity>
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

  imgCenter: {alignItems:'center',justifyContent:'center',},
  imgBox: {width:220,height:220,position:'relative'},
	imgBtn: {alignItems:'center',justifyContent:'center',width:220,height:220,backgroundColor:'#F9FAFB',borderRadius:5,overflow:'hidden',position:'relative',borderWidth:1,borderColor:'#EDEDED'},
  imgBtn2: {borderWidth:0,},
	imgText: {width:43,height:21,backgroundColor:'#fff',borderRadius:50,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:21,textAlign:'center',color:'#243B55',position:'absolute',right:5,bottom:5,},
  imgDeleteBtn: {width:30,height:30,backgroundColor:'#fff',borderRadius:50,overflow:'hidden',position:'absolute',right:-15,bottom:-10,},

  header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},

  logInfo: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  logInfoView: {flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#DBDBDB',paddingBottom:3,},
  logInfoDate: {width:innerWidth-180,},
  logInfoTime: {width:80,},
  logInfoPeri: {width:80,},
  logInfoText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#1e1e1e',marginLeft:9,},
  inputView: {marginTop:10,},
  selectView: {position:'relative',justifyContent:'center'},
	input: {width:innerWidth,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,paddingLeft:15,paddingRight:15,fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},  
	select: {width:innerWidth,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,paddingLeft:15,paddingRight:40,fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
	selectCont: {},
	selectArr: {position:'absolute',right:20,},
  startTimeView: {flexDirection:'row',alignItems:'center'},
  startTimeSelect: {width:(innerWidth-50)/2},
  startTimeBar: {alignItems:'center',justifyContent:'center',width:20,},
  startTimeBarText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#1e1e1e'},
  timeprInputView: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
  timeprInput: {width:200,textAlign:'center'},
  inputUnit: {width:30,alignItems:'flex-end'},
  inputUnitText: {fontFamily:Font.NotoSansRegular,fontSize:14,color:'#1e1e1e'},
  timerAlert: {marginTop:10,},
  timerAlertText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:12,color:'#EE4245'},  

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
})

export default ExerciseLogWrite