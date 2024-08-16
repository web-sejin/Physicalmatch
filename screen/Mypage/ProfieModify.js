import React, {useState, useEffect, useRef, useCallback, Component} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, Platform, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

import APIs from "../../assets/APIs";
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import { DrawerContentScrollView } from '@react-navigation/drawer';

const padding_top = Platform.OS === 'ios' ? 10 : 15;
const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const ProfieModify = (props) => {
  const swp = [
    {idx:1, imgUrl:'', type:'community_guide'},
    {idx:2, imgUrl:'', type:'social_guide'},
    {idx:3, imgUrl:'', type:'shop_free'},
  ]
  
	const navigationUse = useNavigation();
  const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
	const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
	const swiperRef = useRef(null);
  const [swiperList, setSwiperList] = useState([]);
  const [guideModal, setGuideModal] = useState(false);
	const [guideModal2, setGuideModal2] = useState(false);
  const [memberIdx, setMemberIdx] = useState();
  const [memberType, setMemberType] = useState();
	const [memberInfo, setMemberInfo] = useState([]);
  const [memberNick, setMemberNick] = useState('');
  const [memberBadge, setMemberBadge] = useState([]);
  const [badgeReject, setBadgeReject] = useState();
  const [memberAuth, setMemberAuth] = useState([]);
  const [authReject, setAuthReject] = useState();
  const [mbProfile, setMbProfile] = useState([]);
  const [profileReject, setProfileReject] = useState();
  const [profileConfrim, setProfileConfirm] = useState();
  const [mbPhysical, setMbPhysical] = useState('');
  const [mbShape, setMbShape] = useState('-');
  const [mbDrink, setMbDrink] = useState('');
  const [mbSmoke, setMbSmoke] = useState('');
  const [mbExe, setMbExe] = useState('-');
  const [mbInterview, setMbInterview] = useState([]);
  const [rejectMemo, setRejectMemo] = useState('');
  const [lovePoint, setLovePoint] = useState();
  const [popNick, setPopNick] = useState(false);
  const [currFocus, setCurrFocus] = useState('');
  const [nick, setNick] = useState('');
  const [nickCert, setNickCert] = useState(true);
  const [nickBtn, setNickBtn] = useState(false);
  const [authPoint, setAuthPoint] = useState();
  const [badgePoint, setBadgePoint] = useState();

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

      getMemInfo();
      getMemInfo2();

      if(params?.reload){
        // getMemInfo();
        // getMemInfo2(); 
        delete params?.reload;
      }
		}

    Keyboard.dismiss();
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

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
    const unsubscribe = navigationUse.addListener('beforeRemove', (e) => {
      // 뒤로 가기 이벤트가 발생했을 때 실행할 로직을 작성합니다.
      // 여기에 원하는 동작을 추가하세요.
      // e.preventDefault();를 사용하면 뒤로 가기를 막을 수 있습니다.
      //console.log('preventBack22 ::: ',preventBack);
      if (preventBack) {        
				setPopNick(false);
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

  useEffect(() => {
		setSwiperList(swp);
	}, [])

  useEffect(() => {
		getMemInfo();
    getMemInfo2();    
	}, [memberIdx]);

  const getMemInfo = async () => {
    setLoading(true);
		let sData = {
			basePath: "/api/member/",
			type: "GetMyProfile",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
    //console.log(response);
		if(response.code == 200){
      setLovePoint(response.love_point);
			setMemberInfo(response.data);
      setMemberNick(response.data.info.member_nick);
      setNick(response.data.info.member_nick);
      setBadgeReject(response.data.is_badge_reject);
      setAuthReject(response.data.is_auth_reject);
      if(response.data.reject_memo){
				setRejectMemo(response.data.reject_memo);
			}else{
				setRejectMemo('');
			}
      
      //피지컬
      let physicalString = '';
      if(response.data.info.member_height){ physicalString += (response.data.info.member_height+'cm'); }
      if(response.data.info.member_weight && response.data.info.member_weight != 0){ 
        if(physicalString != ''){ physicalString += ' · '; }
        physicalString += (response.data.info.member_weight+'kg'); 
      }
      if(response.data.info.member_muscle && response.data.info.member_muscle != 0){ 
        if(physicalString != ''){ physicalString += ' · '; }
        physicalString += (response.data.info.member_muscle+'kg'); 
      }
      if(response.data.info.member_fat && response.data.info.member_fat != 0){ 
        if(physicalString != ''){ physicalString += ' · '; }
        physicalString += (response.data.info.member_fat+'%');
      }
      setMbPhysical(physicalString);

      //체형
      let shapeString = '';
      response.data.info.member_physical.map((item, index) => {
        if(index != 0){ shapeString += ' · '; }
        shapeString += item.mp_name;
      })
      setMbShape(shapeString);      

      //음주
      let drinkString = '';
      if(response.data.info.member_drink_status == 0){
        drinkString = '마시지 않음';
      }else if(response.data.info.member_drink_status == 1){
        drinkString = '어쩔 수 없을 때만';
      }else if(response.data.info.member_drink_status == 2){
        drinkString = '가끔 마심';
      }else if(response.data.info.member_drink_status == 3){
        drinkString = '어느정도 즐김';
      }else if(response.data.info.member_drink_status == 4){
        drinkString = '좋아하는 편';
      }else if(response.data.info.member_drink_status == 5){
        drinkString = '매우 즐기는 편';
      }
      setMbDrink(drinkString);

      //흡연
      let smokeString = '';            
      if(response.data.info.member_smoke_status != 0 && response.data.info.member_smoke_type){
        if(response.data.info.member_smoke_type == 1){
          smokeString += '연초 ';
        }else if(response.data.info.member_smoke_type == 2){
          smokeString += '권련형 전자담배 ';
        }else if(response.data.info.member_smoke_type == 3){
          smokeString += '액상형 전자담배 ';
        }
      }
      
      if(response.data.info.member_smoke_status == 0){
        smokeString += '비흡연';
      }else if(response.data.info.member_smoke_status == 1){
        smokeString += '금연 중';
      }else if(response.data.info.member_smoke_status == 2){
        smokeString += '가끔 피움';
      }else if(response.data.info.member_smoke_status == 3){
        smokeString += '흡연 중';
      }
      setMbSmoke(smokeString);

      //운동
      let exeString = '';
      if(response.data.info.member_exercise_yn == 'y' && response.data.info.member_exercise.length > 0){
        response.data.info.member_exercise.map((item, index) => {
          if(index != 0){ exeString += ' · '; }
          exeString += item.me_name;
        });
        setMbExe(exeString);
      }

      //인터뷰
      if(response.data.interview){ setMbInterview(response.data.interview); }

      //프로필 이미지
      let profileReject = 0;
      let profileConfirm = 0;    
      //console.log(response.data.img);
      if(response.data.img.length > 0){
        setMbProfile(response.data.img);
        response.data.img.map((item, index) => {
          if(item.agree_yn == 'n'){
            profileReject = profileReject+1;
          }else if(item.agree_yn == 'i'){
            profileConfirm = profileConfirm+1;
          }
        })        
      }
      //console.log(response.data.mimg);
      if(response.data.mimg){
        if(response.data.mimg.agree_yn == 'n'){
          profileReject = profileReject+1;
        }else if(response.data.mimg.agree_yn == 'i'){
          profileConfirm = profileConfirm+1;
        }
      }

      setProfileReject(profileReject);
      setProfileConfirm(profileConfirm);

      //배지
      setMemberBadge(response.data.badge);

      //인증
      setMemberAuth(response.data.auth);
      
      setTimeout(function(){
        setLoading(false);
      }, 1000);
		}
	}

  const getMemInfo2 = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);    
    //console.log(response);
		if(response.code == 200){
			setMemberType(response.data.member_type);		
      setAuthPoint(response.auth_point ? response.auth_point : 0);
      setBadgePoint(response.badge_point ? response.badge_point : 0);
		}
	}

  const notMember = () => {
		ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
	}

  const chkNick = (v) => {
		const spe = v.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
		if(spe >= 0 || v.length < 2 || v.length > 8){
			setNickBtn(false);
		}else{
			setNickBtn(true);
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

      if(nick == memberNick){
        ToastMessage('현재 닉네임과 같습니다.');
				return false;
      }

			let sData = {      
				basePath: "/api/member/",
				type: "IsDuplicationNick",
				member_nick: nick,
			}
			const response = await APIs.send(sData);
      //console.log('checkPopVal ::: ', response);
			if(response.code == 200){
        setNickCert(true);
				modifyNick();							
			}else{
				setNickCert(false);
				ToastMessage('이미 사용 중이거나 사용할 수 없는 닉네임 입니다.');      
			}
		}
	}	

  const modifyNick = async () => {
    let sData = {      
      basePath: "/api/member/",
      type: "SetNick",
      member_idx: memberIdx,
      member_nick: nick,
    }
    const response = await APIs.send(sData);
    //console.log('modifyNick ::: ', response);
    if(response.code == 200){
      setPopNick(false);
      setMemberNick(nick);
      setPreventBack(false);
      ToastMessage('닉네임이 변경되었습니다.');   
    }else{
      ToastMessage('이미 사용 중이거나 사용할 수 없는 닉네임 입니다.');      
    }    	
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'프로필 수정'} />

			<ScrollView>
        {memberType == 1 ? (
        <View style={styles.swiperView}>
					<SwiperFlatList
            ref={swiperRef}
            index={0}
            data={swiperList}
            onChangeIndex={(obj) => {
              
            }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity 
                  key={index}
                  style={styles.commuBanner}
                  activeOpacity={opacityVal}
                  onPress={()=>{
                    if(item.type == 'community_guide'){
                      setGuideModal(true);
                    }else if(item.type == 'social_guide'){
                      setGuideModal2(true);
                    }else if(item.type == 'shop_free'){
                      navigation.navigate('Shop', {tab:2});
                    }
                  }}
                >
                  <ImgDomain fileWidth={widnowWidth} fileName={'slide_banner'+(index+1)+'.png'} />
                </TouchableOpacity>
              )
            }}
          />
				</View>
        ) : null}

        {rejectMemo != '' ? (
        <View style={{...styles.screening, paddingTop:padding_top}}>
          <View style={styles.screeningTitle}>					
            <ImgDomain fileWidth={16} fileName={'icon_screening.png'}/>
            <View style={styles.screeningView}>
              <Text style={styles.screeningText}>프로필이 반려되었습니다.</Text>
            </View>
          </View>
          <View style={styles.screeningDesc}>
            <Text style={styles.screeningDescText}>{rejectMemo}</Text>
          </View>
        </View>
        ) : null}

        <View style={styles.cmWrap}>
          {memberType == 0 && (
          <View style={styles.modiBtn}>
            <View style={styles.modiBtnTop}>
              <TouchableOpacity 
                style={styles.modiBtnTopLeft}
                activeOpacity={opacityVal}
                onPress={()=>{
                  setPopNick(true);
                  setNick(memberNick);
                  setPreventBack(true);
                }}
              >
                <Text style={[styles.modiBtnTopLeftText, styles.mgr5]}>{memberNick}</Text>
                <ImgDomain fileWidth={13} fileName={'modify_pen.png'} />
              </TouchableOpacity>
              <View style={styles.modiBtnTopRight}>
                <TouchableOpacity
                  style={styles.modiBtnTouch}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    setPopNick(true);
                    setNick(memberNick);
                    setPreventBack(true);
                  }}
                >
                  <Text style={styles.modiBtnTouchText}>수정하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          )}
          
          <TouchableOpacity
            style={styles.modiBtn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('MyProfile')}}
          >
            <View style={styles.modiBtnTop}>
              <View style={styles.modiBtnTopLeft}>
                <Text style={styles.modiBtnTopLeftText}>프로필 사진</Text>
              </View>
              <View style={styles.modiBtnTopRight}>
                {profileReject > 0 ? (
                  <View style={[styles.modiBtnState, styles.modiBtnState1, styles.mgr10]}>
                    <Text style={[styles.modiBtnStateText, styles.modiBtnStateText1]}>반려</Text>
                  </View>
                ) : (
                  profileConfrim > 0 ? (
                    <View style={[styles.modiBtnState, styles.modiBtnState3, styles.mgr10]}>
                      <Text style={[styles.modiBtnStateText, styles.modiBtnStateText3]}>심사중</Text>
                    </View>
                  ) : null
                )}                             
                <ImgDomain fileWidth={7} fileName={'icon_arr8.png'} />
              </View>
            </View>
            <View style={styles.modiImgFlex}>
              {mbProfile.map((item, index) => {
                return(
                  <View key={index} style={[styles.modiImg, index != 0 ? styles.mgl10 : null]}>
                    <ImgDomain2 fileWidth={36} fileName={item.mti_img} />
                  </View>
                )
              })}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modiBtn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('MyBadge')}}
          >
            <View style={styles.modiBtnTop}>
              <View style={styles.modiBtnTopLeft}>
                <Text style={styles.modiBtnTopLeftText}>내 배지</Text>
              </View>
              <View style={styles.modiBtnTopRight}>
                {memberBadge.length > 0 && badgeReject ? (
                  <View style={[styles.modiBtnState, styles.modiBtnState1, styles.mgr10]}>
                    <Text style={[styles.modiBtnStateText, styles.modiBtnStateText1]}>반려</Text>
                  </View>
                ) : null}
                {/* <View style={[styles.modiBtnState, styles.modiBtnState3, styles.mgr10]}>
                  <Text style={[styles.modiBtnStateText, styles.modiBtnStateText3]}>심사중</Text>
                </View> */}
                <View style={styles.modiBtnTopRightView}>
                  <Text style={styles.modiBtnTopRightViewText}>프로틴 {badgePoint}개 혜택</Text>
                </View>
                <ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
              </View>
            </View>
            
            <View style={[styles.modiImgFlex, styles.mgt5]}>
              {memberBadge.map((item, index) => {
                return(
                  <View key={index} style={[styles.modiImg, styles.modiImg2, styles.mgr15]}>
                    <ImgDomain2 fileWidth={45} fileName={item.badge_img}/>
                  </View>
                )
              })}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modiBtn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('MyCert')}}
          >
            <View style={styles.modiBtnTop}>
              <View style={styles.modiBtnTopLeft}>
                <Text style={styles.modiBtnTopLeftText}>내 인증</Text>
              </View>
              <View style={styles.modiBtnTopRight}>
                {memberAuth.length > 0 ? null : (
                  authReject ? (
                    <View style={[styles.modiBtnState, styles.modiBtnState1, styles.mgl10]}>
                      <Text style={[styles.modiBtnStateText, styles.modiBtnStateText1]}>반려</Text>
                    </View>
                  ) : null
                  // <View style={[styles.modiBtnState, styles.modiBtnState3, styles.mgl10]}>
                  //   <Text style={[styles.modiBtnStateText, styles.modiBtnStateText3]}>심사중</Text>
                  // </View>
                )}
                <View style={styles.modiBtnTopRightView}>
                  <Text style={styles.modiBtnTopRightViewText}>프로틴 {authPoint}개 혜택</Text>
                </View>
                <ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
              </View>
            </View>

            <View style={[styles.modiImgFlex]}>
              {memberAuth.map((item, index) => {
                  return(
                    <View key={index} style={[styles.modiBtnState, styles.modiBtnState2, index != 0 ? styles.mgl4 : null]}>
                      <ImgDomain fileWidth={8} fileName={'icon_chk1.png'}/>
                      <Text style={[styles.modiBtnStateText, styles.modiBtnStateText2, styles.mgl4]}>{item.auth_name}</Text>
                    </View>
                  )
                })}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modiBtn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('MyArea')}}
          >
            <View style={styles.modiBtnTop}>
              <View style={styles.modiBtnTopLeft}>
                <Text style={styles.modiBtnTopLeftText}>지역 설정</Text>
              </View>
              <View style={styles.modiBtnTopRight}>
                <ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
              </View>
            </View>
            <View style={[styles.modiLocFlex]}>
              <View style={styles.modiLocView}>
                <Text style={styles.modiLocViewText1}>주활동</Text>
                <View style={styles.modiLocViewText2View}>
                  <Text style={styles.modiLocViewText2}>{memberInfo.info?.member_main_local}</Text>
                </View>
              </View>
              <View style={styles.modiLocView}>
                <Text style={styles.modiLocViewText1}>부활동</Text>
                <View style={styles.modiLocViewText2View}>
                  {memberInfo.info?.member_sub_local ? (
                    <Text style={styles.modiLocViewText2} numberOfLines={2} ellipsizeMode='tail'>{memberInfo.info?.member_sub_local}</Text>
                  ) : (
                    <Text style={styles.modiLocViewText2}>-</Text>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modiBtn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('MyIntro')}}
          >
            <View style={styles.modiBtnTop}>
              <View style={styles.modiBtnTopLeft}>
                <Text style={styles.modiBtnTopLeftText}>내 소개</Text>
              </View>
              <View style={styles.modiBtnTopRight}>
                <ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
              </View>
            </View>
            <View style={[styles.modiCont, styles.mgt15]}>
              <Text style={styles.modiContTitle}>내 소개글</Text>              
              <Text style={styles.modiContContent}>{memberInfo.info?.member_intro}</Text>
            </View>
            <View style={[styles.modiCont, styles.mgt10]}>
              <Text style={styles.modiContTitle}>셀프 인터뷰</Text>
              {mbInterview.map((item, index) => {
                return (
                  <View key={index} style={[styles.modiQna, index == 0 ? styles.mgt10 : styles.mgt20]}>
                    <View style={styles.modiQnaLeft}>
                      <Text style={styles.modiQnaLeftText}>{index+1}.</Text>
                    </View>
                    <View style={styles.modiQnaRight}>
                      <Text style={styles.modiQnaRightTitle}>{item.mi_subject}</Text>
                      <Text style={styles.modiContContent}>{item.mi_content}</Text>
                    </View>
                  </View>
                )
              })}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modiBtn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('MyInfo')}}
          >
            <View style={styles.modiBtnTop}>
              <View style={styles.modiBtnTopLeft}>
                <Text style={styles.modiBtnTopLeftText}>기본 정보</Text>
              </View>
              <View style={styles.modiBtnTopRight}>
                <ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
              </View>
            </View>
            <View style={[styles.modiLocFlex]}>
              <View style={[styles.modiLocView, styles.modiLocView2]}>
                <Text style={[styles.modiLocViewText1, styles.width2]}>최종학력</Text>
                <Text style={styles.modiLocViewText2}>{memberInfo.info?.member_education} {memberInfo.info?.member_education_status}</Text>
              </View>
              <View style={[styles.modiLocView, styles.modiLocView2, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>직업</Text>
                {memberInfo.info?.member_job_detail ? (
                  <Text style={styles.modiLocViewText2}>{memberInfo.info?.member_job} {memberInfo.info?.member_job_detail}</Text>
                ) : (
                  <Text style={styles.modiLocViewText2}>{memberInfo.info?.member_job}</Text>
                )}                
              </View>
              <View style={[styles.modiLocView, styles.modiLocView2, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>피지컬</Text>
                <Text style={styles.modiLocViewText2}>{mbPhysical}</Text>
              </View>
              <View style={[styles.modiLocView, styles.modiLocView2, styles.mgt10]}>
                <Text style={[styles.modiLocViewText1, styles.width1]}>운동</Text>
                <View style={[styles.width1_2]}>                
                  <Text style={styles.modiLocViewText2}>{mbExe}</Text> 
                </View>
              </View>
              <View style={[styles.modiLocView, styles.modiLocView2, styles.mgt10]}>
                <Text style={[styles.modiLocViewText1, styles.width1]}>체형</Text>
                <View style={[styles.width1_2]}>
                  <Text style={styles.modiLocViewText2}>{mbShape}</Text>
                </View>
              </View>
              <View style={[styles.modiLocView, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>음주</Text>
                <View style={styles.modiLocViewText2View}>
                  <Text style={styles.modiLocViewText2} numberOfLines={2} ellipsizeMode='tail'>{mbDrink}</Text>
                </View>
              </View>
              <View style={[styles.modiLocView, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>흡연</Text>
                <View style={styles.modiLocViewText2View}>
                  <Text style={styles.modiLocViewText2} numberOfLines={2} ellipsizeMode='tail'>{mbSmoke}</Text>
                </View>
              </View>
              <View style={[styles.modiLocView, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>MBTI</Text>
                <Text style={styles.modiLocViewText2}>{memberInfo.info?.member_mbti}</Text>
              </View>
              <View style={[styles.modiLocView, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>종교</Text>
                <Text style={styles.modiLocViewText2}>{memberInfo.info?.member_religion_text}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modiBtn}
            activeOpacity={opacityVal}
            onPress={()=>{
              if(memberType != 1){
                notMember();
              }else{
                navigation.navigate('MyDate');
              }
            }}
          >
            <View style={styles.modiBtnTop}>
              <View style={styles.modiBtnTopLeft}>
                <Text style={styles.modiBtnTopLeftText}>연애 및 결혼관</Text>
              </View>
              <View style={styles.modiBtnTopRight}>
                <View style={styles.modiBtnTopRightView}>
                  {memberInfo.info?.love_cnt > 0 ? (
                    <Text style={styles.modiBtnTopRightViewText}>작성 완료</Text>
                  ) : (
                    <Text style={styles.modiBtnTopRightViewText}>프로틴 {lovePoint}개 혜택</Text>
                  )}                  
                </View>
                <ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modiBtn, styles.modiBtn2]}
            activeOpacity={opacityVal}
            onPress={()=>{
              if(memberType != 1){
                notMember();
              }else{
                navigation.navigate('MyHobby');
              }
            }}
          >
            <View style={styles.modiBtnTop}>
              <View style={styles.modiBtnTopLeft}>
                <Text style={styles.modiBtnTopLeftText}>취미·관심사 키워드</Text>
              </View>
              <View style={styles.modiBtnTopRight}>
                <ImgDomain fileWidth={7} fileName={'icon_arr8.png'}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>        
			</ScrollView>

      {/* 비회원이라면 노출 */}
      {/* 프로필 사진, 내 배지, 기본 정보 등 각각의 페이지에서 수정,심사 등록이 되기 때문에 불필요해서 주석걸었습니다. */}
      {/* <View style={styles.nextFix}>
        <TouchableOpacity 
          style={[styles.nextBtn]}
          activeOpacity={opacityVal}
          onPress={() => {}}
        >
          <Text style={styles.nextBtnText}>프로필 재심사 등록</Text>
        </TouchableOpacity>
      </View> */}

      {/* 커뮤니티 가이드 */}
			<Modal
				visible={guideModal}
				animationType={"none"}
				onRequestClose={() => {setGuideModal(false)}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.modalHeader}>	
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>커뮤니티 이용 가이드</Text>
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {setGuideModal(false)}}						
					>
						<ImgDomain fileWidth={16} fileName={'icon_close2.png'}/>
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View style={styles.guidePopCont}>
						<Text style={styles.guidePopContText}>커뮤니티 가이드입니다.</Text>
					</View>
				</ScrollView>
			</Modal>

			{/* 소셜 가이드 */}
			<Modal
				visible={guideModal2}
				animationType={"none"}
				onRequestClose={() => {setGuideModal2(false)}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.modalHeader}>	
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>소셜 이용 가이드</Text>
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {setGuideModal2(false)}}						
					>
						<ImgDomain fileWidth={16} fileName={'icon_close2.png'}/>
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View style={styles.guidePopCont}>
						<Text style={styles.guidePopContText}>소셜 가이드입니다.</Text>
					</View>
				</ScrollView>
			</Modal>

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
								<Text style={styles.popTitleDesc}>승인 전에는 수정이 가능합니다.</Text>
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
									<Text style={styles.popBtnText}>수정하기</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
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
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	
	
	swiperView: {height: widnowWidth/4.9,backgroundColor:'#fff'},	
  cmWrap: {paddingHorizontal:20,paddingTop:5,},

  screening: {alignItems:'center',justifyContent:'center',paddingVertical:10,paddingHorizontal:20,backgroundColor:'#243B55'},
	screeningTitle: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	screeningView: {marginLeft:7,},
	screeningText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:19,color:'#fff'},
	screeningDesc: {marginTop:2,},
	screeningDescText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:21,color:'#fff',opacity:0.5},

  header: {backgroundColor:'#141E30'},
	headerTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:20,paddingBottom:10,paddingHorizontal:20,},
	headerTitle: {},
	headerTitleText: {fontFamily:Font.RobotoMedium,fontSize:24,lineHeight:26,color:'#fff'},
	headerLnb: {flexDirection:'row',alignItems:'center',},
	headerLnbBtn: {marginLeft:16,},
	headerBot: {flexDirection:'row',},
	headerTab: {width:widnowWidth/4,height:60,alignItems:'center',justifyContent:'center',position:'relative',paddingTop:10,},
	headerTabText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#fff'},
	headerTabTextOn: {fontFamily:Font.NotoSansBold,color:'#FFD194'},
	activeLine: {width:widnowWidth/4,height:4,backgroundColor:'#FFD194',position:'absolute',left:0,bottom:0,zIndex:10,},

  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:52,color:'#fff'},

  modalHeader: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},
	filterResetBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:20,height:48,backgroundColor:'#fff',position:'absolute',top:0,right:0,zIndex:10,},
	filterResetText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#1E1E1E',marginLeft:6,},

	guidePopCont: {padding:20,},
	guidePopContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e'},

  modiBtn: {paddingVertical:25,borderBottomWidth:1,borderBottomColor:'#EDEDED'},
  modiBtn2: {borderBottomWidth:0,},
  modiBtnTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  modiBtnTopLeft: {flexDirection:'row',alignItems:'center'},
  modiBtnTopLeftText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:19,color:'#1e1e1e'},
  modiBtnTopRight: {flexDirection:'row',alignItems:'center'},
  modiBtnTouch: {width:60,height:30,alignItems:'center',justifyContent:'center',backgroundColor:'#243B55',borderRadius:5,},
  modiBtnTouchText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:18,color:'#fff'},
  modiBtnTopRightView: {},
  modiBtnTopRightViewText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#888',marginRight:20,},
  modiBtnState: {flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:6,height:18,borderRadius:20,},
  modiBtnState1: {backgroundColor:'rgba(255,120,122,0.15)'},
  modiBtnState2: {backgroundColor:'#D1913C'},
  modiBtnState3: {backgroundColor:'#EDF2FE'},
  modiBtnStateText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,},
  modiBtnStateText1: {color:'#DE282A'},
  modiBtnStateText2: {color:'#fff'},
  modiBtnStateText3: {color:'#1e1e1e'},
  modiImgFlex: {flexDirection:'row',alignItems:'center',flexWrap:'wrap',marginTop:15,},
  modiImg: {alignItems:'center',justifyContent:'center',width:36,height:36,borderRadius:2,overflow:'hidden'},
  modiImg2: {width:45,height:45,borderRadius:0,marginTop:10,},

  modiLocFlex: {flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',marginTop:15,},
  modiLocView: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:(innerWidth/2)-5,minHeight:48,backgroundColor:'#F9FAFB',borderRadius:5,padding:10,},
  modiLocView2: {width:innerWidth},
  modiLocViewText1: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:18,color:'#1e1e1e',width:45,},
  modiLocViewText2View: {width:innerWidth/2-65,overflow:'hidden',},
  modiLocViewText2: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:18,color:'#888',textAlign:'right'},

  modiCont: {padding:15,backgroundColor:'#F9FAFB',borderRadius:5,},
  modiContTitle: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:18,color:'#1e1e1e'},
  modiContContent: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:19,color:'#1e1e1e',marginTop:5,},
  modiQna: {flexDirection:'row'},
  modiQnaLeft: {},
  modiQnaLeftText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#1e1e1e',},
  modiQnaRight: {paddingLeft:3,},
  modiQnaRightTitle: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#1e1e1e',},
  modiContContent: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#1e1e1e',marginTop:3,},

  input: { fontFamily: Font.NotoSansRegular, width: innerWidth-40, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
	input2: {width: innerWidth},

  cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},
	prvPop2: {height:innerHeight,},
	prvPop3: {position:'absolute',left:20,top:20+(stBarHt/2),paddingHorizontal:10,},
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E'},
	popTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	popIptBox: {paddingTop:10,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {marginTop:30,},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#fff'},

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
  mgr5: {marginRight:5},
  mgr10: {marginRight:10},
  mgr15: {marginRight:15},
	mgl0: {marginLeft:0},
  mgl4: {marginLeft:4},
  mgl10: {marginLeft:10},
  mgl15: {marginLeft:15},

  width1: {width:40,},
  width1_2: {width:innerWidth-70},
  width2: {width:60,},
})

//export default ProfieModify
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(ProfieModify);