import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Platform, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Postcode from '@actbase/react-daum-postcode';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';

import APIs from "../../assets/APIs";
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';

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

const SocialWrite = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(true);
  const [loading, setLoading] = useState(false);
  const [locPop, setLocPop] = useState(false);
  const [backConfirm, setBackConfirm] = useState(false);
  const [ImagePop, setImagePop] = useState(false);

  const [state, setState] = useState(false);
  const [cate, setCate] = useState(route['params']['wrtType']); //0=>1:1 // 1=>미팅 // 2=>모임
  const [subject, setSubject] = useState('');
  const [today, setToday] = useState('');
  const [calendarState, setCalendarState] = useState(false);
  const [pickDate, setPickDate] = useState('');
  const [meetDate, setMeetDate] = useState('');
  const [meetYoil, setMeetYoil] = useState('');
  const [meetLocal, setMeetLocal] = useState('');
  const [meetLocalDetail, setMeetLocalDetail] = useState('');
  const [womanCnt, setWomanCnt] = useState(2);
  const [ManCnt, setManCnt] = useState(2);
  const [peopleCnt, setPeopleCnt] = useState(2);
  const [imageType, setImageType] = useState(0); //1=>기본 사진, 2=>핸드폰 갤러리
  const [appImage, setAppImage] = useState();
  const [phoneImage, setPhoneImage] = useState({});
  const [content, setContent] = useState('');
  const [hostFriend, setHostFriend] = useState('');
  const [guestFriend, setGuestFriend] = useState('');
  const [memberIdx, setMemberIdx] = useState();
  const [memberSex, setMemberSex] = useState();
  const [basicPicture, setBasicPicture] = useState([]);
  const [pickedPicture, setPickedPicture] = useState();
  const [gender, setGender] = useState(0);
  const [genderType, setGenderType] = useState(0);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
		}else{
			//console.log("isFocused");
      //setCate();
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
				setBackConfirm(true);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

  useEffect(() => {
		if (memberIdx) {
			getMemInfo();	
      getBasicPicture();
		}
	}, [memberIdx]);

  useEffect(() => {
    let totalReq = 7;
    let currReq = 0;
    if(cate == 1 || cate == 2){
      //totalReq = 8;
      totalReq = 7;
    }

    if(subject != '' && subject.length >= 5 && subject.length <= 20){ currReq++; }
    if(meetDate != ''){ currReq++; }
    if(meetLocal != ''){ currReq++; }
    //if(imageType != 0){ currReq++; }
    if(appImage){ currReq++; }
    if(content != '' && content.length >= 10  && content.length <= 300){ currReq++; }
    if(hostFriend != ''){ currReq++; }
    if(guestFriend != ''){ currReq++; }

    console.log(cate+'/'+currReq+'/'+totalReq);
    if(currReq == totalReq){
      setState(true);
    }else{
      setState(false);
    }
  }, [subject, meetDate, meetLocal, womanCnt, ManCnt, peopleCnt, imageType, content, hostFriend, guestFriend]);

  useEffect(() => {
    const date = new Date();		
		const year = (date.getFullYear());
    const month = date.getMonth() + 1;
    const monthPad = (month.toString()).padStart(2, '0');
    const day = date.getDate();    
    const dayPad = (day.toString()).padStart(2, '0');
    const dateStr = year+'-'+monthPad+'-'+dayPad;    
    setToday(dateStr);
  }, [])

  const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);    
		if(response.code == 200){
      setMemberSex(response.data.member_sex);
		}
	}

  const getBasicPicture = async () => {
    let sData = {
			basePath: "/api/social/",
			type: "GetSocialBasicImg",
		};
	
		const response = await APIs.send(sData);
		//console.log(response);
    if(response.code == 200){      
      setBasicPicture(response.data);
    }
  }

  const pickedDateSet = () => {
    if(pickDate == ''){
      ToastMessage('날짜를 선택해 주세요.');
      return false;
    }

    const splt = pickDate.split('-');
    const spltRes = splt[1]+'.'+splt[2];
    setMeetDate(spltRes);

    //0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토
    let yoilResult = '';
    const dayOfWeek = new Date(pickDate).getDay();    
    switch(dayOfWeek){
      case 0 : yoilResult = '일'; break;
      case 1 : yoilResult = '월'; break;
      case 2 : yoilResult = '화'; break;
      case 3 : yoilResult = '수'; break;
      case 4 : yoilResult = '목'; break;
      case 5 : yoilResult = '금'; break;
      case 6 : yoilResult = '토'; break;
    }    
    setMeetYoil(yoilResult);
    setCalendarState(false);
  }

  const pickedDateSet2 = (date) => {
    const splt = date.split('-');
    const spltRes = splt[1]+'.'+splt[2];
    setMeetDate(spltRes);

    //0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토
    let yoilResult = '';
    const dayOfWeek = new Date(date).getDay();    
    switch(dayOfWeek){
      case 0 : yoilResult = '일'; break;
      case 1 : yoilResult = '월'; break;
      case 2 : yoilResult = '화'; break;
      case 3 : yoilResult = '수'; break;
      case 4 : yoilResult = '목'; break;
      case 5 : yoilResult = '금'; break;
      case 6 : yoilResult = '토'; break;
    }    

    //console.log(yoilResult);
    setMeetYoil(yoilResult);
    setCalendarState(false);
  }

  const fnCount = (v) => {
    if(v == 'm'){
      // if(cate == 1){
      //   if(womanCnt > 2){
      //     if(womanCnt == ManCnt){
      //       setManCnt(ManCnt-1);
      //     }else if(womanCnt > ManCnt){
      //       setWomanCnt(womanCnt-1);
      //     }
      //   }
      // }else if(cate == 2){
      //   if(peopleCnt > 2){
      //     setPeopleCnt(peopleCnt-1);
      //   }
      // }

      if(gender == 0 && genderType == 0){ //상관없음 + 성비 맞추기
        if(womanCnt > 2){
          if(womanCnt == ManCnt){
            setManCnt(ManCnt-1);
          }else if(womanCnt > ManCnt){
            setWomanCnt(womanCnt-1);
          }
        }
      }else if(gender == 1 || (gender == 0 && genderType == 1)){ //상관없음 + 성비 무관
        if(peopleCnt > 2){
          setPeopleCnt(peopleCnt-1);
        }
      }
    }else if(v == 'p'){
      // if(cate == 1){
      //   if(womanCnt == ManCnt){
      //     setWomanCnt(womanCnt+1);
      //   }else{
      //     setManCnt(ManCnt+1);
      //   }        
      // }else if(cate == 2){
      //   setPeopleCnt(peopleCnt+1);
      // }
      if(gender == 0 && genderType == 0){ //상관없음 + 성비 맞추기
        if(womanCnt < 10 || ManCnt < 10){
          if(womanCnt == ManCnt){
            setWomanCnt(womanCnt+1);
          }else{
            setManCnt(ManCnt+1);
          }  
        }
      }else if(gender == 1 || (gender == 0 && genderType == 1)){ //상관없음 + 성비 무관
        if(peopleCnt < 30){
          setPeopleCnt(peopleCnt+1);
        }
      }
    }
  }

  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 1024,
      height: 1024*1.355,
      cropping: true,
    })
		.then(image => {      
			let selectObj = {path: image.path, mime: image.mime}			
      console.log(selectObj);
      setPhoneImage(selectObj);
      setImageType(2);
      setAppImage();
      setImagePop(false);      
		})
		.finally(() => {
      
		});
  }

  const pickAppImg = (v, url) => {
    setImageType(1);
    setAppImage(v);
    setPickedPicture(url);
    setPhoneImage({});
    setImagePop(false);
  }

  const socialWriteUpdate = async () => {    
    if(subject == '' || subject.length < 5 || subject.length > 20){
      ToastMessage('모임 제목을 5~20자 입력해 주세요.');
      Keyboard.dismiss();
      return false;
    }

    if(meetDate == ''){ 
      ToastMessage('만날 날짜를 선택해 주세요.');
      Keyboard.dismiss();
      return false;
    }

    if(meetLocal == ''){ 
      ToastMessage('만날 장소를 검색해 주세요.');
      Keyboard.dismiss();
      return false;
    }

    if(imageType == 0){ 
      ToastMessage('모임을 소개할 수 있는 이미지를 등록해 주세요.');
      Keyboard.dismiss();
      return false;
    }

    if(content == '' || content.length < 10 || content.length > 300){
      ToastMessage('모임 내용을 10~300자 입력해 주세요.');
      Keyboard.dismiss();
      return false;
    }

    if(hostFriend == ''){
      ToastMessage('호스트의 지인이 참여하는지 선택해주세요.');
      Keyboard.dismiss();
      return false;
    }

    if(guestFriend == ''){
      ToastMessage('게스트의 지인이 참여 허용 여부를 선택해주세요.');
      Keyboard.dismiss();
      return false;
    }

    Keyboard.dismiss();
    setLoading(true);

    let sData = {
			basePath: "/api/social/",
			type: "SetSocial",
      member_idx: memberIdx,
      social_type: cate,
      social_date: pickDate,
      social_subject: subject,
      social_content: content,
      social_location: meetLocal,
      host_guest_yn: hostFriend,
      guest_guest_yn: guestFriend,
		};

    if(cate == 1){ 
      sData.social_mcnt = ManCnt;
      sData.social_wcnt = womanCnt;
    }else if(cate == 2){
      sData.social_cnt = peopleCnt;
    }

    if(imageType == 1){
      //앱에서 제공하는 사진
      sData.social_default_files = pickedPicture;
    }else if(imageType == 2){
      //기기 내 갤러리 사진
      let fileData = [];
      fileData[0] = {uri: phoneImage.path, name: 'phone_image.png', type: phoneImage.mime};
      sData.social_files = fileData;
    }
    
    const formData = APIs.makeFormData(sData)
		const response = await APIs.multipartRequest(formData);
		//console.log(response);
    if(response.code == 200){      
      ToastMessage('소셜이 작성되었습니다.');
      setPreventBack(false);
      setTimeout(function(){
        setLoading(false);
        navigation.navigate('TabNavigation', {screen:'Social', params : {reload:true, writeType:cate}});
      }, 200)
    }
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <Header navigation={navigation} headertitle={'글쓰기'} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior={behavior}
        style={{flex: 1}}
      >
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <View style={[styles.cmWrap, styles.pdb10]}>
                <View>
                  <View style={[styles.iptTit]}>
                    <Text style={styles.iptTitText}>제목을 입력해 주세요 <Text style={styles.red}>*</Text></Text>
                  </View>
                  <View style={[styles.loginIptBox, styles.loginIptBoxFlex]}>
                    <TextInput
                      value={subject}
                      onChangeText={(v) => {
                        if(v.length > 20){
                          let val = v.substr(0, 20);
                          setSubject(val);
                        }else{
                          setSubject(v);
                        }                      
                      }}
                      placeholder={'제목을 입력해 주세요 (최소 5자)'}
                      placeholderTextColor="#DBDBDB"
                      style={[styles.input, styles.input2, styles.inputLine0]}
                      maxLength={20}
                      returnKyeType='done'
                    />
                    <View style={styles.infoLen}>
                      <Text style={styles.infoLenText}>{subject.length}/20</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.mgt50}>
                  <View style={styles.iptTit}>
                    <Text style={styles.iptTitText}>언제 만날까요? <Text style={styles.red}>*</Text></Text>
                  </View>
                  <View style={[styles.loginIptBox, styles.loginIptBoxFlex]}>
                    <TouchableOpacity                    
                      style={[styles.input, /*styles.input3,*/ styles.inputLine0]}
                      activeOpacity={opacityVal}
                      onPress={()=>setCalendarState(true)}
                    >
                      {meetDate != '' ? (
                        <Text style={styles.inputText}>{meetDate} ({meetYoil})</Text>
                      ) : (
                        <Text style={[styles.inputText, styles.gray2]}>날짜를 선택해 주세요</Text>
                      )}
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      style={styles.infoChkBtn}
                      activeOpacity={opacityVal}
                      onPress={() => pickedDateSet()}       
                    >
                      <Text style={styles.infoChkBtnText}>확인</Text>
                    </TouchableOpacity> */}
                  </View>     
                        
                </View>                            
              </View>

              {calendarState ? (
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
                  [pickDate]: { selected: true, marked: true, },
                }}        
                minDate={today}     
                onDayPress={(day) => {
                  //console.log(day);
                  setPickDate(day.dateString);
                  pickedDateSet2(day.dateString);
                }} // 날짜 클릭 시 그 날짜 출력                    
                hideExtraDays={false} // 이전 달, 다음 달 날짜 숨기기                    
                monthFormat={'yyyy년 M월'} // 달 포맷 지정                    
                //onMonthChange={(month) => {console.log(month)}} // 달이 바뀔 때 바뀐 달 출력
                
                // 달 이동 화살표 구현 왼쪽이면 왼쪽 화살표 이미지, 아니면 오른쪽 화살표 이미지
                renderArrow={(direction) => direction === "left" ?
                  <AutoHeightImage name="left" width={22} source={require('../../assets/image/cal_prev.png')}/> : <AutoHeightImage name="right" width={22} source={require('../../assets/image/cal_next.png')}/>
                }
              />   
              ) : null}

              <View style={[styles.cmWrap, styles.pdt0, styles.mgt50,]}>
                <View>
                  <View style={[styles.iptTit]}>
                    <Text style={styles.iptTitText}>어디서 만날까요? <Text style={styles.red}>*</Text></Text>
                  </View>
                  <View style={[styles.loginIptBox, styles.loginIptBoxFlex]}>
                    <View style={styles.locIcon}>
                      <ImgDomain fileWidth={17} fileName={'icon_local.png'}/>
                    </View>
                    <TouchableOpacity                    
                      style={[styles.input, styles.input4, styles.inputLine0]}
                      activeOpacity={opacityVal}
                      onPress={()=>setLocPop(true)}
                    >
                      {meetLocal != '' ? (
                        <Text style={styles.inputText}>{meetLocal}</Text>
                      ) : (
                        <Text style={[styles.inputText, styles.gray2]}>장소를 검색해 주세요</Text>
                      )}                      
                    </TouchableOpacity>              
                  </View>
                </View>
                
                <View style={styles.mgt50}>
                  <View style={[styles.iptTit]}>
                    <Text style={styles.iptTitText}>성별을 선택해 주세요. <Text style={styles.red}>*</Text></Text>
                  </View>
                  <View style={styles.genderRadioBox}>
                    {cate == 0 ? (
                      <>
                      <TouchableOpacity
                        style={[styles.genderRadioBoxBtn, gender == 0 ? styles.genderRadioBoxBtnOn : null]}
                        activeOpacity={opacityVal}
                        onPress={()=>setGender(0)}
                      >
                        <Text style={[styles.genderRadioBoxText, gender == 0 ? styles.genderRadioBoxTextOn : null]}>상관없음</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.genderRadioBoxBtn, gender == 1 ? styles.genderRadioBoxBtnOn : null]}
                        activeOpacity={opacityVal}
                        onPress={()=>setGender(1)}
                      >
                        <Text style={[styles.genderRadioBoxText, gender == 1 ? styles.genderRadioBoxTextOn : null]}>남성만</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.genderRadioBoxBtn, gender == 2 ? styles.genderRadioBoxBtnOn : null]}
                        activeOpacity={opacityVal}
                        onPress={()=>setGender(2)}
                      >
                        <Text style={[styles.genderRadioBoxText, gender == 2 ? styles.genderRadioBoxTextOn : null]}>여성만</Text>
                      </TouchableOpacity>
                      </>
                    ) : (
                      <>
                      <TouchableOpacity
                        style={[styles.genderRadioBoxBtn, styles.genderRadioBoxBtn2, gender == 0 ? styles.genderRadioBoxBtnOn : null]}
                        activeOpacity={opacityVal}
                        onPress={()=>setGender(0)}
                      >
                        <Text style={[styles.genderRadioBoxText, gender == 0 ? styles.genderRadioBoxTextOn : null]}>상관없음</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.genderRadioBoxBtn, styles.genderRadioBoxBtn2, gender == 1 ? styles.genderRadioBoxBtnOn : null]}
                        activeOpacity={opacityVal}
                        onPress={()=>setGender(1)}
                      >
                        {memberSex == 0 ? (
                          <Text style={[styles.genderRadioBoxText, gender == 1 ? styles.genderRadioBoxTextOn : null]}>남성만</Text>
                        ) : (
                          <Text style={[styles.genderRadioBoxText, gender == 1 ? styles.genderRadioBoxTextOn : null]}>여성만</Text>
                        )}                        
                      </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>

                {cate == 1 || cate == 2 ? (
                <View style={styles.mgt50}>
                  <View style={[styles.iptTit]}>
                    <Text style={styles.iptTitText}>인원 수를 선택해 주세요 <Text style={styles.red}>*</Text></Text>

                    {gender == 0 ? (
                    <View style={styles.countGender}>
                      <TouchableOpacity
                        style={styles.countGenderBtn}
                        activeOpacity={opacityVal}
                        onPress={()=>setGenderType(0)}
                      >
                        {genderType == 0 ? (
                          <ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
                        ) : (
                          <ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
                        )}
                        <Text style={styles.countGenderBtnText}>성비 맞추기</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.countGenderBtn}
                        activeOpacity={opacityVal}
                        onPress={()=>setGenderType(1)}
                      >
                        {genderType == 1 ? (
                          <ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
                        ) : (
                          <ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
                        )}
                        <Text style={styles.countGenderBtnText}>성비 무관</Text>
                      </TouchableOpacity>
                    </View>
                    ) : null}
                  </View>
                  <View style={styles.countBox}>
                    <TouchableOpacity
                      style={styles.countBoxBtn}
                      activeOpacity={opacityVal}
                      onPress={()=>fnCount('m')}
                    >
                      <ImgDomain fileWidth={24} fileName={'icon_minus.png'}/>
                    </TouchableOpacity>
                    <View style={styles.countBoxBtnView}>
                      {/* {cate == 1 ? (<Text style={styles.countBoxBtnText}>{womanCnt}:{ManCnt}</Text>) : null}
                      {cate == 2 ? (<Text style={styles.countBoxBtnText}>{peopleCnt}</Text>) : null} */}

                      {gender == 0 && genderType == 0 ? (             
                        <View style={styles.countBoxBtnFlex}>
                          <ImgDomain fileWidth={28} fileName={'icon_gender_man.png'} />
                          <View style={styles.countBoxBtnFlexInner}>
                            <Text style={styles.countBoxBtnText}>{womanCnt}:{ManCnt}</Text>
                          </View>
                          <ImgDomain fileWidth={28} fileName={'icon_gender_woman.png'} />
                        </View>                                                             
                      ) : null}

                      {gender == 1 || (gender == 0 && genderType == 1) ? (
                        <View style={styles.countBoxBtnFlex}>
                          {gender == 1 && memberSex == 0 ? (
                            <ImgDomain fileWidth={28} fileName={'icon_gender_man.png'} />
                          ) : null}
                          {gender == 1 && memberSex == 1 ? (
                            <ImgDomain fileWidth={28} fileName={'icon_gender_woman.png'} />
                          ) : null}
                          {gender == 0 && genderType == 1 ? (
                            <ImgDomain fileWidth={28} fileName={'icon_gender_all.png'} />
                          ) : null}
                          <View style={styles.countBoxBtnFlexInner2}>
                            <Text style={styles.countBoxBtnText}>{peopleCnt}</Text>
                          </View>
                        </View>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      style={styles.countBoxBtn}
                      activeOpacity={opacityVal}
                      onPress={()=>fnCount('p')}
                    >
                      <ImgDomain fileWidth={24} fileName={'icon_plus.png'}/>
                    </TouchableOpacity>
                  </View>
                </View>
                ) : null}

                <View style={styles.mgt50}>
                  <View style={[styles.iptTit]}>
                    <Text style={styles.iptTitText}>모임을 소개해 주세요 <Text style={styles.red}>*</Text></Text>
                  </View>
                  <View style={styles.imgBox}>
                    <TouchableOpacity
                      style={[styles.imgBtn]}
                      activeOpacity={opacityVal}
                      onPress={() => setImagePop(true)}
                    >                      
                      {imageType == 1 ? (<ImgDomain2 fileWidth={110} fileName={pickedPicture}/>) : null}                      
                      {imageType == 2 ? (<AutoHeightImage width={110} source={{ uri: phoneImage.path }} />) : null}
                      {imageType == 0 ? (<ImgDomain fileWidth={110} fileName={'img_back2.png'}/>) : null}                        						
                      <Text style={styles.imgText}>필수</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    value={content}
                    onChangeText={(v) => {
                      if(v.length > 300){
                        let val = v.substr(0, 300);
                        setContent(val);
                      }else{
                        setContent(v);
                      }
                    }}
                    style={[styles.textarea]}
                    placeholder="어떤 만남을 어떤 사람과 함께하고 싶은지 자세히 작성해 보세요."
                    placeholderTextColor="#DBDBDB"
                    multiline={true}
                    returnKyeType='done'
                    maxLength={300}
                  />
                  <View style={styles.help_box}>
                    <View style={styles.alertTextView}>
                      {content.length < 10 ? (
                      <Text style={[styles.alertText2, styles.alertText3]}>최소 10자 이상 입력해 주세요.</Text>
                      ) : null}
                    </View>
                    <Text style={styles.txtCntText}>{content.length}/300</Text>
                  </View>
                </View>
                
                <View style={styles.mgt50}>
                  <View style={[styles.iptTit]}>
                    <Text style={styles.iptTitText}>호스트의 지인이 참여 신청할 예정인가요? <Text style={styles.red}>*</Text></Text>
                  </View>
                  <View style={styles.friendBox}>
                    <TouchableOpacity
                      style={[styles.friendBtn, hostFriend == 'y' ? styles.friendBtnOn : null]}
                      activeOpacity={opacityVal}
                      onPress={()=>setHostFriend('y')}
                    >
                      <Text style={[styles.friendBtnText, hostFriend == 'y' ? styles.friendBtnTextOn : null]}>네</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.friendBtn, hostFriend == 'n' ? styles.friendBtnOn : null]}
                      activeOpacity={opacityVal}
                      onPress={()=>setHostFriend('n')}
                    >
                      <Text style={[styles.friendBtnText, hostFriend == 'n' ? styles.friendBtnTextOn : null]}>아니오</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.mgt50}>
                  <View style={[styles.iptTit]}>
                    <Text style={styles.iptTitText}>게스트의 지인 신청을 허용할까요? <Text style={styles.red}>*</Text></Text>
                  </View>
                  <View style={styles.friendBox}>
                    <TouchableOpacity
                      style={[styles.friendBtn, guestFriend == 'y' ? styles.friendBtnOn : null]}
                      activeOpacity={opacityVal}
                      onPress={()=>setGuestFriend('y')}
                    >
                      <Text style={[styles.friendBtnText, guestFriend == 'y' ? styles.friendBtnTextOn : null]}>네</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.friendBtn, guestFriend == 'n' ? styles.friendBtnOn : null]}
                      activeOpacity={opacityVal}
                      onPress={()=>setGuestFriend('n')}
                    >
                      <Text style={[styles.friendBtnText, guestFriend == 'n' ? styles.friendBtnTextOn : null]}>아니오</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.mgt15}>
                  <View style={styles.warn}>
                    <Text style={styles.warnText}>주의해주세요!</Text>
                  </View>
                  <View style={styles.warn2}>
                    <Text style={styles.warn2Text}>호스트 혹은 게시트의 지인이 참여하더라도, 지인의 계정으로</Text>
                    <Text style={styles.warn2Text}>해당 소셜룸에 참여 신청이 되어 있어야 합니다.</Text>
                  </View>
                  <View style={styles.warn3}>
                    <View style={styles.warn3dot}><Text style={styles.warn3dotText}>·</Text></View>
                    <View style={styles.warn3TextView}>
                      <Text style={styles.warn3Text}>소셜 룸에 신청되지 않은 참석자 참석 불가</Text>
                    </View>
                  </View>
                  <View style={styles.warn3}>
                  <View style={styles.warn3dot}><Text style={styles.warn3dotText}>·</Text></View>
                    <View style={styles.warn3TextView}>
                      <Text style={styles.warn3Text}>소셜 룸에 설정된 지인 참여 여부와 다르게</Text>
                    </View>
                  </View>
                  <View style={styles.warn3}>
                  <View style={styles.warn3dot}><Text style={styles.warn3dotText}>·</Text></View>
                    <View style={styles.warn3TextView}>
                      <Text style={styles.warn3Text}>호스트 혹은 게스트의 지인이 참석할 경우 고객센터를 통해 신고</Text>
                    </View>
                  </View>
                </View>

              </View>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>

        <View style={styles.nextFix}>
          <TouchableOpacity 
            style={[styles.nextBtn, state ? null : styles.nextBtnOff]}
            activeOpacity={opacityVal}
            onPress={() => {socialWriteUpdate()}}
          >
            <Text style={styles.nextBtnText}>등록하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>            

      {/* 주소 검색 */}
      <Modal
				visible={locPop}
				animationType={"none"}
				onRequestClose={() => setLocPop(false)}
			>
        <TouchableOpacity
          style={styles.pop_x}					
          onPress={() => setLocPop(false)}
        >
          <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
        </TouchableOpacity>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
        <Postcode
          style={{ width: widnowWidth, height: innerHeight-50, marginTop:65, }}
          jsOptions={{ animation: true }}
          onSelected={data => {
            //console.log(JSON.stringify(data))
            const kakaoAddr = data;
            //console.log(kakaoAddr);	
            //setMeetLocal(kakaoAddr.sido+' '+kakaoAddr.sigungu+' '+kakaoAddr.buildingName);
            setMeetLocal(kakaoAddr.sido+' '+kakaoAddr.sigungu);
            setMeetLocalDetail(kakaoAddr.address);
            setLocPop(false);
          }}
        />
      </Modal>

      {/* 사진 선택 */}
      <Modal
				visible={ImagePop}
				animationType={"none"}
				onRequestClose={() => setImagePop(false)}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
        <View style={styles.header}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>사진 선택</Text>
          <TouchableOpacity
            style={styles.headerBackBtn2}
            activeOpacity={opacityVal}
            onPress={() => {setImagePop(false)}}						
          >
            <ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
          </TouchableOpacity>
        </View>
        <View style={[styles.cmWrap, styles.pdb20]}>
          <TouchableOpacity
            style={[styles.nextBtn, styles.phoneGallery]}
            activeOpacity={opacityVal}
            onPress={() => chooseImage()}
          >
            <ImgDomain fileWidth={15} fileName={'icon_gallery.png'}/>
            <Text style={styles.phoneGalleryText}>갤러리</Text>
          </TouchableOpacity>
          <View style={[styles.iptTit]}>
            <Text style={styles.iptTitText}>기본 사진</Text>
          </View>          
        </View>
        <ScrollView>
          <View style={styles.basicPic}>
            {basicPicture.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.basicPicBtn, (index+1)/4 == 1 ? styles.mgr0 : null]}
                  activeOpacity={opacityVal}
                  onPress={() => pickAppImg(item.sbi_idx, item.sbi_img)}
                >
                  <ImgDomain2 fileWidth={(innerWidth/4)-7.5} fileName={item.sbi_img}/>
                  <View style={styles.basicPicChk}>
                    {imageType == 1 && appImage == item.sbi_idx ? (
                      <ImgDomain fileWidth={20} fileName={'icon_chk_on.png'}/>                  
                    ) : (
                      <ImgDomain fileWidth={20} fileName={'icon_chk_off.png'}/>
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>    
        </ScrollView>
      </Modal>

      {/* 작성 중 뒤로가기 */}
			<Modal
				visible={backConfirm}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setBackConfirm(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setBackConfirm(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setBackConfirm(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>작성된 내용이 삭제돼요</Text>
							<Text style={[styles.popTitleText, styles.mgt5]}>그래도 돌아가시겠어요?</Text>							
						</View>	
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.mgt50]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => {
                  setBackConfirm(false);
                  setPreventBack(false);
                  setLoading(true);
                  setTimeout(function(){
                    navigation.goBack();
                  }, 500);
                }}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>네</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => setBackConfirm(false)}
							>
								<Text style={styles.popBtnText}>아니오</Text>
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
	safeAreaView: { flex: 1, backgroundColor: '#fff' },	
	gapBox: {height:86,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	

  cmWrap: {paddingVertical:30,paddingHorizontal:20},
  cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

  iptTit: {},  
  iptTitText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:18,color:'#1e1e1e'},
	iptSubTit: {},
	iptSubTitText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#666'},
  loginIptBox: {marginTop:20,},
  loginIptBoxFlex: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:'#DBDBDB',},
  infoChkBtn: {alignItems:'center',justifyContent:'center',width:45,height:30,backgroundColor:'#243B55',borderRadius:5,},
  infoChkBtnText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:18,color:'#fff', },
  
  infoLen: {position:'relative',top:-3,},
  infoLenText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#B8B8B8'},
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:52,color:'#fff'},

  input: {fontFamily:Font.NotoSansRegular,width:innerWidth,height:36,backgroundColor:'#fff',borderBottomWidth:1,borderColor:'#DBDBDB',paddingVertical:0,paddingHorizontal:5,fontSize:16,color:'#1e1e1e',justifyContent:'center', },
  input2: {width:innerWidth-55,},
  input3: {width:innerWidth-55,},
  input4: {width:innerWidth-25,},
  inputLine0 : {borderBottomWidth:0,},
  inputText: {fontFamily:Font.NotoSansRegular,fontSize: 16, lineHeight:21, color: '#1e1e1e',},
  textarea: {width:innerWidth,minHeight:180,paddingVertical:0,paddingHorizontal:15,borderWidth:1,borderColor:'#EDEDED',borderRadius:5,textAlignVertical:'top',fontFamily:Font.NotoSansRegular,fontSize:14,marginTop:30,paddingTop:15,color:'#1e1e1e',paddingTop:15,},

  help_box: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5,},
  alertTextView: {minWidth:1,},
	alertText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#B8B8B8',},
  alertText3: {color:'#EE4245',},
	txtCntText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#b8b8b8'},

  locIcon: {justifyContent:'center',width:17,height:36,},

  countBox: {flexDirection:'row',alignItems:'center',marginTop:15,},
  countBoxBtn: {width:24,height:24,},
  countBoxBtnView: {alignItems:'center',justifyContent:'center',minWidth:42,height:32,marginHorizontal:10,},
  countBoxBtnFlex: {alignItems:'center',justifyContent:'center',flexDirection:'row'},
  countBoxBtnFlexInner: {alignItems:'center',justifyContent:'center',minWidth:40,marginHorizontal:8,},
  countBoxBtnFlexInner2: {alignItems:'center',justifyContent:'center',minWidth:30,marginLeft:8,},
  countBoxBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#1e1e1e'},

  imgBox: {flexDirection:'row',marginTop:20,},
	imgBtn: {alignItems:'center',justifyContent:'center',width:110,height:110,borderRadius:5,overflow:'hidden',position:'relative',borderWidth:1,borderColor:'#EDEDED'},
	imgText: {width:43,height:21,backgroundColor:'#fff',borderRadius:50,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:21,textAlign:'center',color:'#243B55',position:'absolute',right:5,bottom:5,},

  phoneGallery : {flexDirection:'row',height:48,marginBottom:40,},
  phoneGalleryText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:18,color:'#fff',marginLeft:8,},

  basicPic: {flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20,paddingBottom:20,},
  basicPicBtn: {alignItems:'center',justifyContent:'center',width:(innerWidth/4)-7.5,height:(innerWidth/4)-7.5,borderRadius:5,overflow:'hidden',marginRight:10,marginBottom:10,position:'relative'},
  basicPicChk: {position:'absolute',top:6,right:6,},

  friendBox: {marginTop:10,},
  friendBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,marginTop:10,},
  friendBtnOn: {backgroundColor:'#243B55',borderWidth:0,},
  friendBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:19,color:'#666'},
  friendBtnTextOn: {color:'#fff'},

  genderRadioBox: {flexDirection:'row',gap:10,marginTop:20,},
  genderRadioBoxBtn: {alignItems:'center',justifyContent:'center',width:(innerWidth/3)-6.6666,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,},
  genderRadioBoxBtn2: {width:(innerWidth/2)-5},
  genderRadioBoxBtnOn: {backgroundColor:'#243B55',borderWidth:0,},
  genderRadioBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:19,color:'#666666'},
  genderRadioBoxTextOn: {fontFamily:Font.NotoSansMedium,color:'#fff'},

  warn: {},
  warnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#888'},
  warn2: {marginVertical:4,},
  warn2Text: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:17,color:'#888'},
  warn3: {flexDirection:'row',},
  warn3dot: {alignItems:'center',width:10,},
  warn3dotText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:17,color:'#888'},
  warn3TextView: {width:innerWidth-10,},
  warn3Text: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:17,color:'#888'},

  countGender: {flexDirection:'row',gap:30,marginTop:20,paddingBottom:10,},
  countGenderBtn: {flexDirection:'row',alignItems:'center',},
  countGenderBtnText : {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#1E1E1E',marginLeft:6},

  header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},

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

export default SocialWrite