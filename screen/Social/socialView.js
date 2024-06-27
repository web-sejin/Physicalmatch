import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, ImageBackground, Image, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import { BlurView } from "@react-native-community/blur";

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';
import Card2 from '../../components/Card2';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const opacityVal2 = 0.95;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const SocialView = (props) => {
  const Data1 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },
    { 'idx': 4, 'isFlipped':true, 'name':'닉네임최대여덟4', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':false },		
	];

  const Data2 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },
    { 'idx': 4, 'isFlipped':true, 'name':'닉네임최대여덟4', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':false },		
	];
  
  const reportList = [
    { val: 1, txt: '욕설 / 인신공격',},
    { val: 2, txt: '허위 내용 (사진 및 프로필 도용)',},
    { val: 3, txt: '선정성',},
    { val: 4, txt: '홍보 및 판촉',},
    { val: 5, txt: '종교 & 정치적 혐오 발언',},
    { val: 6, txt: '기타',},
  ]

  const {navigation, userInfo, chatInfo, route} = props;
  const {params} = route
  const viewIdx = params['idx'];
  const scrollRef = useRef();	
  const etcRef = useRef(null);
  const navigationUse = useNavigation();
  const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [currFocus, setCurrFocus] = useState('');		
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dotPop, setDotPop] = useState(false);
  const [leavePop, setLeavePop] = useState(false);
  const [orderPop, setOrderPop] = useState(false);
  const [warnPop, setWarnPop] = useState(false);
  const [readyPop, setReadyPop] = useState(false);
  const [miniProfilePop, setMiniProfilePop] = useState(false);
  const [bigImgPop, setBigImgPop] = useState(false);
  const [reportPop, setReportPop] = useState(false);
  const [cashPop, setCashPop] = useState(false);
  const [prdIdx, setPrdIdx] = useState(1);
  const [socialPop, setSocialPop] = useState(false);
  const [socialPop2, setSocialPop2] = useState(false);
  const [blockPop, setBlockPop] = useState(false);
  const [focusState, setFocusState] = useState(false);

  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout2, setLayout2] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [layout3, setLayout3] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const [data1List, setData1List] = useState(Data1);
  const [data1List2, setData1List2] = useState(Data2);

  const [userType, setUserType] = useState(2); //1=>호스트, 2=>게스트
  const [userType2, setUserType2] = useState(0); //1=>정회원, 0=>비회원
  const [nick, setNick] = useState('');
  const [age, setAge] = useState('');
  const [datetime, setDatetime] = useState('');
  const [subject, setSubject] = useState('');
  const [meetDate, setMeetDate] = useState('');
  const [meetLocal, setMeetLocal] = useState('');
  const [meetCate, setMeetCate] = useState('');
  const [meetCnt, setMeetCnt] = useState('');
  const [content, setContent] = useState('');
  const [upPoint ,setUpPoint] = useState(0);
  const [reviewType, setReviewType] = useState(1); //1=>댓글, 2=>대댓글
  const [reviewCont, setReviewCont] = useState('');
  const [orderChg, setOrderChg] = useState(0); //0=>끌어올리기 한 적 없음(무료), 1=>끌어올리기 한 적 있음(유료), 2=>포인트 부족
  const [miniPoint, setMiniPoint] = useState(0);
  const [miniChg, setMiniChg] = useState(0); //0=>포인트 있음, 1=>포인트 부족
  const [report, setReport] = useState('');
  const [reportEtc, setReportEtc] = useState('');
  const [reportType, setReportType] = useState(); //1=>소셜글, 2=>댓글, 3=>대댓글  

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
      
		}else{
			//console.log("isFocused");
			setRouteLoad(true);
			setPageSt(!pageSt);

      //임시
      setNick('자동 생성 닉네임');
      setAge('89');
      setDatetime('8분 전');
      setSubject('제목이 입력되는 영역입니다.');
      setMeetDate('2024.12.31');
      setMeetLocal('강남역');
      setMeetCate('미팅');
      setMeetCnt('3:3');
      setContent('내용이 입력되는 영역입니다. 자유롭게 내용을 입력해 주세요. 자유롭게 내용을 입력해 주세요. 자유롭게 내용을 입력해 주세요. 자유롭게 내용을 입력해 주세요. 자유롭게 내용을 입력해 주세요. 자유롭게 내용을 입력해 주세요.');
      setUpPoint(100);
      setOrderChg(0);
      setMiniPoint(200);
      setMiniChg(0);
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

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardStatus(true);
			if(Platform.OS != 'ios'){
				if(currFocus == 'report'){
					setKeyboardHeight((e.endCoordinates.height/1.6)*-1);
        }else if(currFocus == 'preLike'){	
          setKeyboardHeight((e.endCoordinates.height/2)*-1);
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

  const onLayout = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout({ x, y, width, height }); };
  const onLayout2 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout2({ x, y, width, height }); };
  const onLayout3 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout3({ x, y, width, height }); };  

  const ViewDetail = () => {
		//포인트 있는지 체크 후 결제 유도 or 상세페이지 이동		
		navigation.navigate('MatchDetail')
	}

  const submitReport = async () => {
    if(report == ''){
      ToastMessage('신고 사유를 선택해 주세요.');
      return false;
    }

    if(report == '기타' && (reportEtc == '' || reportEtc.length < 3)){
      ToastMessage('상세 사유를 3자 이상 입력해 주세요.');
      return false;
    }

    ToastMessage('신고접수가 완료되었습니다.');
    reportPopClose();
  }

  const reportPopClose = () => {
    setPreventBack(false);
    setReportPop(false);
    setReport('');
    setReportEtc('');
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior={behavior}
      >
        <ScrollView ref={scrollRef}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
            <TouchableOpacity 
              onPress={() => {navigation.goBack()}} 
              style={styles.DetailBackBtn} 
              activeOpacity={opacityVal}
              >              
              <ImgDomain fileWidth={8} fileName={'icon_header_back2.png'}/>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {setDotPop(true)}} 
              style={styles.DetailDotBtn} 
              activeOpacity={opacityVal}
              >              
              <ImgDomain fileWidth={24} fileName={'icon_hd_dot.png'}/>
            </TouchableOpacity>

            <View style={styles.viewVisual}>
              <ImgDomain fileWidth={widnowWidth} fileName={'social_view_sample.jpg'}/>
            </View>

            <View style={[styles.cmView, styles.pdt15, styles.pdb30]}>
              <View style={styles.nickArea}>
                <View style={styles.nickView}>
                  <ImgDomain fileWidth={38} fileName={'profile_sample.png'}/>
                  <Text style={styles.nickViewText}>{nick} · {age}</Text>
                </View>
                <View style={styles.insertTime}>
                  <Text style={styles.insertTimeText}>{datetime}</Text>
                </View>
              </View>

              <View style={styles.viewSubject}>
                <Text style={styles.viewSubjectText}>{subject}</Text>
              </View>

              <View style={styles.viewSubInfo1}>
                <View style={styles.viewSubInfo1View}>                  
                  <ImgDomain fileWidth={10} fileName={'social_view_date.png'}/>
                  <Text style={styles.viewSubInfo1Text}>{meetDate}</Text>
                </View>
                <View style={styles.viewSubInfo1View}>
                  <ImgDomain fileWidth={10} fileName={'social_view_local.png'}/>
                  <Text style={styles.viewSubInfo1Text}>{meetLocal}</Text>
                </View>
              </View>

              <View style={styles.viewSubInfo2}>
                <View style={styles.keywordView}>
                  <Text style={styles.keywordViewText}>{meetCate}</Text>
                </View>
                {meetCate != '1:1' ? (
                <View style={styles.keywordView}>
                  <Text style={styles.keywordViewText}>{meetCnt}</Text>
                </View>
                ) : null}
              </View>

              <View style={styles.viewSubInfo3}>
                <Text style={styles.contentText}>{content}</Text>
              </View>

              <View style={[styles.viewSubInfo4, styles.zindex10]}>
                <View style={[styles.viewSubInfo4List, styles.zindex10]}>                  
                  <ImgDomain fileWidth={20} fileName={'icon_power_o.png'}/>
                  <Text style={styles.viewSubInfo4ListText}>호스트의 동성 지인도 참여하는 모임이에요</Text>
                  <TouchableOpacity
                    style={styles.viewAlert}
                    activeOpacity={opacityVal}
                    onPress={()=>setWarnPop(true)}
                  >
                    <ImgDomain fileWidth={16} fileName={'icon_alert2.png'}/>
                  </TouchableOpacity>

                  {warnPop ? (
                  <TouchableOpacity 
                    style={{...styles.warnPop, ...styles.boxShadow}}
                    activeOpacity={1}
                    onPress={()=>setWarnPop(false)}
                  >
                    <View style={styles.wranTri}>
                      <ImgDomain fileWidth={20} fileName={'warn_pop_top.png'}/>
                    </View>
                    <View style={styles.warnView}>
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
                  </TouchableOpacity>
                  ) : null}
                </View>
                <View style={styles.viewSubInfo4List}>                  
                  <ImgDomain fileWidth={20} fileName={'icon_power_x.png'}/>
                  <Text style={styles.viewSubInfo4ListText}>호스트의 지인이 없는 방이에요</Text>
                </View>
                <View style={styles.viewSubInfo4List}>
                  <ImgDomain fileWidth={20} fileName={'icon_power_o.png'}/>
                  <Text style={styles.viewSubInfo4ListText}>게스트의 동성 지인도 참여 신청이 가능해요</Text>
                </View>
                <View style={styles.viewSubInfo4List}>
                  <ImgDomain fileWidth={20} fileName={'icon_power_x.png'}/>
                  <Text style={styles.viewSubInfo4ListText}>게스트의 지인 참여는 불가해요</Text>
                </View>
              </View>
                  
              {userType == 2 ? (
                <>
                <View style={styles.mgt30}>
                  <TouchableOpacity 
                    style={[styles.nextBtn]}
                    activeOpacity={opacityVal}
                    onPress={() => setSocialPop(true)}
                  >
                    <Text style={styles.nextBtnText}>참여 신청하기</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.mgt30}>
                  <TouchableOpacity 
                    style={[styles.nextBtn]}
                    activeOpacity={opacityVal}
                    onPress={() => setCashPop(true)}
                  >
                    <Text style={styles.nextBtnText}>참여 포인트 부족</Text>
                  </TouchableOpacity>
                </View>
                </>
              ) : null}
            </View>

            <View style={styles.lineView}></View>

            {userType == 1 ? (
            <>
              <View style={styles.viewTab} onLayout={onLayout}>
                <TouchableOpacity
                  style={[styles.viewTabBtn, styles.viewTabBtnOn]}
                  activeOpacity={1}
                >
                  <Text style={[styles.viewTabBtnText, styles.viewTabBtnTextOn]}>모집현황</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewTabBtn}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    scrollRef.current?.scrollTo({y:layout2.y});
                  }}
                >
                  <Text style={styles.viewTabBtnText}>댓글</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.cmView, styles.pdt30, styles.pdb30]}>
                <View style={styles.cmViewTitle}>
                  <Text style={styles.cmViewTitleText}>신청자</Text>
                </View>
                <View style={styles.reqUl}>
                  <View style={[styles.reqLi, styles.boxShadow2, styles.mgt0]}>
                    <TouchableOpacity
                      style={styles.reqUser}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        setMiniChg(0);
                        setMiniProfilePop(true);
                      }}
                    >                      
                      <ImgDomain fileWidth={46} fileName={'sample3.png'}/>
                    </TouchableOpacity>
                    <View style={styles.reqUserInfo}>
                      <View style={styles.reqUserNick}>
                        <Text style={styles.reqUserNickText}>자동생성닉네임</Text>
                      </View>
                      <View style={styles.reqUserDetail}>
                        <Text style={styles.reqUserDetailText}>1999년생</Text>
                        <View style={styles.reqDtLine}></View>
                        <Text style={styles.reqUserDetailText}>전남 곡성군</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.reqOkBtn}
                      activeOpacity={opacityVal}
                      onPress={() => setSocialPop2(true)}
                    >
                      <Text style={styles.reqOkBtnText}>수락</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.reqLi, styles.boxShadow2,]}>
                    <TouchableOpacity
                      style={styles.reqUser}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        setMiniChg(1);
                        setMiniProfilePop(true);
                      }}
                    >                      
                      <ImgDomain fileWidth={46} fileName={'sample3.png'}/>
                    </TouchableOpacity>
                    <View style={styles.reqUserInfo}>
                      <View style={styles.reqUserNick}>
                        <Text style={styles.reqUserNickText}>자동생성닉네임</Text>
                      </View>
                      <View style={styles.reqUserDetail}>
                        <Text style={styles.reqUserDetailText}>1999년생</Text>
                        <View style={styles.reqDtLine}></View>
                        <Text style={styles.reqUserDetailText}>전남 곡성군</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.reqOkBtn}
                      activeOpacity={opacityVal}
                      onPress={() => setSocialPop2(true)}
                    >
                      <Text style={styles.reqOkBtnText}>수락</Text>
                    </TouchableOpacity>
                  </View>
                </View>     

                <View style={styles.mgt40}>
                  <View style={styles.cmViewTitle}>
                    <Text style={styles.cmViewTitleText}>수락자</Text>
                  </View>
                  <View style={styles.cardView}>
                    {data1List.map((item, index) => {
                      if(item.leave && !item.isFlipped){
												return (
													<TouchableOpacity 
														key={index}
														style={[styles.cardBtn, styles.cardBtn2]}
														activeOpacity={opacityVal2}
														onPress={() => {													
															setLeavePop(true);
														}}
													>
														<View style={[styles.cardCont, styles.cardCont2]}>																												
															<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
														</View>
													</TouchableOpacity>
												)
											}else{
												return (
													<Card2 
														navigation={navigation}
														key={index}
														propsNick={item.name}													
														propsAge={item.age}													
														propsHeight={item.height}													
														propsFlip={item.isFlipped}
														propsDday={item.dday}
                            propsSreen={'SocialView'}
													/>
												)
											}
                    })}
                  </View>              
                </View>

                <View style={styles.mgt20}>
                  <View style={styles.cmViewTitle}>
                    <Text style={styles.cmViewTitleText}>참여자</Text>
                  </View>
                  <View style={styles.cardView}>
                    {data1List2.map((item, index) => {
                      if(item.leave && !item.isFlipped){
												return (
													<TouchableOpacity 
														key={index}
														style={[styles.cardBtn, styles.cardBtn2]}
														activeOpacity={opacityVal2}
														onPress={() => {													
															setLeavePop(true);
														}}
													>
														<View style={[styles.cardCont, styles.cardCont2]}>																												
															<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
														</View>
													</TouchableOpacity>
												)
											}else{
												return (
													<Card2 
														navigation={navigation}
														key={index}
														propsNick={item.name}													
														propsAge={item.age}													
														propsHeight={item.height}													
														propsFlip={item.isFlipped}
														propsDday={item.dday}
                            propsSreen={'SocialView'}
													/>
												)
											}
                    })}
                  </View> 
                </View>
              </View>

              <View style={styles.lineView}></View>

              <View style={styles.viewTab} onLayout={onLayout2}>
                <TouchableOpacity
                  style={[styles.viewTabBtn]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    scrollRef.current?.scrollTo({y:layout.y});
                  }}
                >
                  <Text style={[styles.viewTabBtnText]}>모집현황</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.viewTabBtn, styles.viewTabBtnOn]}
                  activeOpacity={1}
                >
                  <Text style={[styles.viewTabBtnText, styles.viewTabBtnTextOn]}>댓글</Text>
                </TouchableOpacity>
              </View>
            </>
            ) : (
            <>
              <View style={[styles.cmView, styles.pdb30, styles.pdt30]}>
                <View style={styles.cmViewTitle}>
                  <Text style={styles.cmViewTitleText}>신청 현황</Text>
                </View>

                <TouchableOpacity 
                  style={styles.reqStateBox}
                  activeOpacity={opacityVal}
                  onPress={()=>{setReadyPop(true)}}
                >                  
                  <ImageBackground source={{uri:'https://cnj02.cafe24.com/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>                    
                    <View style={[styles.cardBtn, styles.cardBtn3]}>                      
                      <View style={[styles.cardCont, styles.cardCont2]}>																												                        											
                        <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                      </View>
                    </View>           
                    <View style={styles.reqStateInfo}>
                      <View style={[styles.reqStateTitle, styles.mgb20]}>
                        <Text style={styles.reqStateTitleText}>신청이 완료되었어요</Text>
                      </View>                      
                      <ImgDomain fileWidth={32} fileName={'icon_heart2.png'}/>
                      <View style={styles.reqStateCont}>
                        <Text style={styles.reqStateContText}>잠시만 기다려주세요!</Text>
                        <Text style={styles.reqStateContText}>호스트의 수락 후</Text>
                        <Text style={styles.reqStateContText}>최종 참여 확정을</Text>
                        <Text style={styles.reqStateContText}>할 수 있어요</Text>
                      </View>
                    </View>         
                  </ImageBackground>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.reqStateBox}
                  activeOpacity={opacityVal}
                  onPress={()=>{navigation.navigate('MatchDetail')}}
                >                                        
                  <ImageBackground source={{uri:'https://cnj02.cafe24.com/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>
                    <View style={[styles.cardBtn, styles.cardBtn3]}>
                      <View style={[styles.cardCont, styles.cardCont3]}>		
                        <View style={styles.peopleImgBack}>
                          <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                        </View>
                        <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                          <View style={styles.peopleImgBack}>
                            <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                          </View>
                          <AutoHeightImage width={110} source={{uri:'https://cnj02.cafe24.com/appImg/woman2.png'}} resizeMethod='resize' style={styles.peopleImg} />
                          <View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont3, styles.boxShadow3]}>
                            <View	View style={styles.cardFrontDday}>
                              <Text style={styles.cardFrontDdayText}>D-7</Text>
                            </View>
                            <View style={styles.cardFrontNick2}>
                              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>닉네임최대여덟자</Text>
                            </View>
                            <View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
                              <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>99</Text>
                              <View style={styles.cardFrontContLine}></View>
                              <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>100cm</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>           
                    <View style={styles.reqStateInfo}>
                      <View style={styles.reqStateTitle}>
                        <Text style={styles.reqStateTitleText}>참여를 확정해주세요!</Text>
                      </View>                      
                      <ImgDomain fileWidth={32} fileName={'icon_heart3.png'}/>
                      <View style={styles.reqStateCont}>
                        <Text style={styles.reqStateContText}>참여 신청이 수락되었어요</Text>
                        <Text style={styles.reqStateContText}>프로필을 확인하고</Text>
                        <Text style={styles.reqStateContText}>참여를 확정해 주세요!</Text>
                      </View>
                    </View>         
                  </ImageBackground>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.reqStateBox}
                  activeOpacity={opacityVal}
                  onPress={()=>{navigation.navigate('MatchDetail')}}
                >                            
                  <ImageBackground source={{uri:'https://cnj02.cafe24.com/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>
                    <View style={[styles.cardBtn, styles.cardBtn3]}>
                      <View style={[styles.cardCont, styles.cardCont3]}>		
                        <View style={styles.peopleImgBack}>
                          <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                        </View>
                        <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                          <View style={styles.peopleImgBack}>
                            <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                          </View>
                          <AutoHeightImage width={(innerWidth/3)-7} source={{uri:'https://cnj02.cafe24.com/appImg/woman2.png'}} resizeMethod='resize' style={styles.peopleImg} />
                          <View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont3, styles.boxShadow3]}>
                            <View	View style={styles.cardFrontDday}>
                              <Text style={styles.cardFrontDdayText}>D-7</Text>
                            </View>
                            <View style={styles.cardFrontNick2}>
                              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>닉네임최대여덟자</Text>
                            </View>
                            <View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
                              <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>99</Text>
                              <View style={styles.cardFrontContLine}></View>
                              <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>100cm</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>           
                    <View style={styles.reqStateInfo}>
                      <View style={styles.reqStateTitle}>
                        <Text style={styles.reqStateTitleText}>참여를 확정하시겠어요?</Text>
                      </View>
                      <ImgDomain fileWidth={32} fileName={'icon_heart3.png'}/>
                      <View style={styles.reqStateCont}>
                        <Text style={styles.reqStateContText}>최종 참여 확정</Text>
                        <Text style={styles.reqStateContText}>요청이 도착했어요!</Text>
                        <Text style={styles.reqStateContText}>참여를 확정해 주세요</Text>
                      </View>
                    </View>         
                  </ImageBackground>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.reqStateBox}
                  activeOpacity={opacityVal}
                  onPress={()=>{navigation.navigate('MatchDetail')}}
                >                            
                  <ImageBackground source={{uri:'https://cnj02.cafe24.com/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>
                    <View style={[styles.cardBtn, styles.cardBtn3]}>
                      <View style={[styles.cardCont, styles.cardCont3]}>		                        
                        <View style={styles.peopleImgBack}>
                          <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                        </View>
                        <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                          <View style={styles.peopleImgBack}>
                            <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                          </View>
                          <AutoHeightImage width={(innerWidth/3)-7} source={{uri:'https://cnj02.cafe24.com/appImg/woman2.png'}} resizeMethod='resize' style={styles.peopleImg} />
                          <View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont3, styles.boxShadow3]}>
                            <View	View style={styles.cardFrontDday}>
                              <Text style={styles.cardFrontDdayText}>D-7</Text>
                            </View>
                            <View style={styles.cardFrontNick2}>
                              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>닉네임최대여덟자</Text>
                            </View>
                            <View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
                              <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>99</Text>
                              <View style={styles.cardFrontContLine}></View>
                              <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>100cm</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>           
                    <View style={styles.reqStateInfo}>
                      <View style={styles.reqStateTitle}>
                        <Text style={styles.reqStateTitleText}>참여가 확정되었어요!</Text>
                      </View>                      
                      <ImgDomain fileWidth={32} fileName={'icon_clap.png'}/>
                      <View style={styles.reqStateCont}>
                        <Text style={styles.reqStateContText}>만남일을 확인하고</Text>
                        <Text style={styles.reqStateContText}>즐거운 만남에 참석해보세요!</Text>
                        <Text style={styles.reqStateContText}>당일 취소는 삼가주세요!</Text>
                      </View>
                    </View>         
                  </ImageBackground>
                </TouchableOpacity>
              </View>

              <View style={styles.lineView}></View>
            </>
            )}

            <View style={[styles.pdb30, styles.pdt30]}>
              {userType == 2 ? (
                <View style={[styles.cmViewTitle, styles.cmView, styles.mgb0]}>
                  <Text style={styles.cmViewTitleText}>댓글</Text>
                </View>
              ) : null}

              <View style={styles.reviewWrap}>
                {userType2 == 0 ? (
                <>
                <BlurView
                  style={styles.blurView}
                  blurType="light"
                  blurAmount={3}
                />
                <View style={styles.blurAlert}>
                  <Text style={styles.blurAlertText}>댓글은 정회원만</Text>
                  <Text style={styles.blurAlertText}>작성 및 열람이 가능합니다.</Text>
                </View>
                </>
                ) : null}
                <View style={styles.cmView}>
                  <View style={[styles.reviewDepth, styles.mgt0]}>                    
                    <ImgDomain fileWidth={28} fileName={'profile_sample2.png'}/>
                    <View style={styles.reviewInfo}>
                      <View style={styles.reviewNickDate}>
                        <Text style={styles.reviewNickText}>자동 생성 닉네임</Text>
                        <Text style={styles.reviewDateText}>12.31 22:22</Text>
                      </View>
                      <View style={styles.reviewCont}>
                        <Text style={styles.reviewContText}>댓글 내용이 입력됩니다. 내용을 자유롭게 입력해주세요.</Text>
                      </View>
                      <View style={styles.reviewBtnBox}>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>{
                            setReviewCont('');
                            setReviewType(2);
                            scrollRef.current?.scrollTo({y:layout3.y});
                          }}
                        >
                          <Text style={styles.reviewBtnText}>대댓글달기</Text>
                        </TouchableOpacity>
                        <View style={styles.reviewBtnLine}></View>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>{
                            setReportType(2);
                            setReportPop(true);
                            setDotPop(false);
                            setPreventBack(true);
                          }}
                        >
                          <Text style={styles.reviewBtnText}>신고하기</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={[styles.reviewDepth, styles.reviewDepth2]}>
                        <ImgDomain fileWidth={28} fileName={'profile_sample2.png'}/>
                        <View style={[styles.reviewInfo, styles.reviewInfo2]}>
                          <View style={styles.reviewNickDate}>
                            <Text style={styles.reviewNickText}>자동 생성 닉네임</Text>
                            <Text style={styles.reviewDateText}>12.31 22:22</Text>
                          </View>
                          <View style={styles.reviewCont}>
                            <Text style={styles.reviewContText}>댓글 내용이 입력됩니다. 내용을 자유롭게 입력해주세요.</Text>
                          </View>
                          <View style={styles.reviewBtnBox}>
                            <TouchableOpacity
                              style={styles.reviewBtn}
                              activeOpacity={opacityVal}
                              onPress={()=>{
                                setReportType(3);
                                setReportPop(true);
                                setDotPop(false);
                                setPreventBack(true);
                              }}
                            >
                              <Text style={styles.reviewBtnText}>신고하기</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>            
                  </View>
                  <View style={[styles.reviewDepth]}>
                    <ImgDomain fileWidth={28} fileName={'profile_sample2.png'}/>
                    <View style={styles.reviewInfo}>
                      <View style={styles.reviewNickDate}>
                        <Text style={styles.reviewNickText}>자동 생성 닉네임</Text>
                        <Text style={styles.reviewDateText}>12.31 22:22</Text>
                      </View>
                      <View style={styles.reviewCont}>
                        <Text style={styles.reviewContText}>댓글 내용이 입력됩니다. 내용을 자유롭게 입력해주세요.</Text>
                      </View>
                      <View style={styles.reviewBtnBox}>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>{
                            setReviewCont('');
                            setReviewType(2);
                            scrollRef.current?.scrollTo({y:layout3.y});
                          }}
                        >
                          <Text style={styles.reviewBtnText}>대댓글달기</Text>
                        </TouchableOpacity>
                        <View style={styles.reviewBtnLine}></View>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>{
                            setReportType(2);
                            setReportPop(true);
                            setDotPop(false);
                            setPreventBack(true);
                          }}
                        >
                          <Text style={styles.reviewBtnText}>신고하기</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>          
                  <View style={[styles.reviewDepth]}>                    
                    <ImgDomain fileWidth={28} fileName={'profile_sample.png'}/>
                    <View style={styles.reviewInfo}>
                      <View style={styles.reviewNickDate}>
                        <Text style={styles.reviewNickText}>자동 생성 닉네임</Text>
                        <Text style={styles.reviewDateText}>12.31 22:22</Text>
                      </View>
                      <View style={styles.reviewCont}>
                        <Text style={styles.reviewContText}>댓글 내용이 입력됩니다. 내용을 자유롭게 입력해주세요.</Text>
                      </View>
                      <View style={styles.reviewBtnBox}>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>{}}
                        >
                          <Text style={styles.reviewBtnText}>삭제하기</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.reviewSubmitArea} onLayout={onLayout3}>
              {reviewType == 1 ? (
                <TextInput
                  value={reviewCont}
                  onChangeText={(v) => setReviewCont(v)}
                  onFocus={()=>setFocusState(true)}
                  onBlur={()=>setFocusState(false)}
                  placeholder={'댓글을 입력해 주세요'}
                  placeholderTextColor="#B8B8B8"
                  style={styles.reviewIpt}
                  returnKyeType='done'
                  readOnly={userType2 == 0 ? true : false}
                />                
              ) : (
                <>
                  <View style={styles.reviewInReview}>
                    <Text style={styles.reviewInReviewText}>000에게 대댓글 달기</Text>
                    <TouchableOpacity
                      style={styles.reviewInCancel}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        setReviewCont('');
                        setReviewType(1);
                      }}
                    >
                      <Text style={styles.reviewInCancelText}>취소</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    value={reviewCont}
                    onChangeText={(v) => setReviewCont(v)}
                    onFocus={()=>setFocusState(true)}
                    onBlur={()=>setFocusState(false)}
                    placeholder={'대댓글을 입력해 주세요'}
                    placeholderTextColor="#B8B8B8"
                    style={styles.reviewIpt}
                    returnKyeType='done'                    
                  />
                </>
              )}
              <TouchableOpacity
                style={styles.reviewSubmitBtn}
                activeOpacity={opacityVal}
                onPress={()=>{
                  if(userType2 == 0){
                    ToastMessage('정회원만 댓글 작성이 가능합니다.');
                  }else{

                  }
                }}
              >
                <Text style={styles.reviewSubmitBtnText}>등록</Text>
              </TouchableOpacity>
            </View>
            </>
          </TouchableWithoutFeedback>          
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 신고 버튼 팝업 */}
			<Modal
				visible={dotPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setDotPop(false)}
			>
        <TouchableOpacity 
          style={[styles.popBack, styles.popBack2]} 
          activeOpacity={1} 
          onPress={()=>{setDotPop(false)}}
        >
        </TouchableOpacity>
				<View style={styles.dotPop}>
          {userType == 1 ? (
            <>
            <TouchableOpacity
              style={styles.dotPopBtn}
              activeOpacity={opacityVal}
              onPress={()=>{
                setDotPop(false);
                setOrderPop(true);
              }}
            >
              <Text style={styles.dotPopBtnText}>끌어올리기</Text>
            </TouchableOpacity>
            <View style={styles.dotPopBtnLine}></View>
            <TouchableOpacity
              style={styles.dotPopBtn}
              activeOpacity={opacityVal}
              onPress={()=>{
                setDotPop(false);
                navigation.navigate('Home', {isSubmit: true});
              }}
            >
              <Text style={styles.dotPopBtnText}>삭제하기</Text>
            </TouchableOpacity>
            </>
          ): (
            <>
            <TouchableOpacity
              style={styles.dotPopBtn}
              activeOpacity={opacityVal}
              onPress={()=>{
                setReportType(1);
                setReportPop(true);
                setDotPop(false);
                setPreventBack(true);
              }}
            >
              <Text style={styles.dotPopBtnText}>신고하기</Text>
            </TouchableOpacity>
            <View style={styles.dotPopBtnLine}></View>
            <TouchableOpacity
              style={styles.dotPopBtn}
              activeOpacity={opacityVal}
              onPress={()=>{
                setDotPop(false);
                setBlockPop(true);
              }}
            >
              <Text style={styles.dotPopBtnText}>차단하기</Text>
            </TouchableOpacity>
            </>
          )}          
          <View style={styles.dotPopBtnLine}></View>
          <TouchableOpacity
            style={styles.dotPopBtn}
            activeOpacity={opacityVal}
            onPress={()=>{setDotPop(false)}}
          >
            <Text style={styles.dotPopBtnText}>취소</Text>
          </TouchableOpacity>
        </View>
			</Modal>

      {/* 신고 사유 팝업 */}
      {reportPop ? (
      <View style={styles.cmPop}>
        <TouchableOpacity 
          style={styles.popBack} 
          activeOpacity={1} 
          onPress={()=>{
            reportPopClose();
            Keyboard.dismiss();
          }}
        >
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{...styles.prvPop, top:keyboardHeight}}>
            <TouchableOpacity
              style={styles.pop_x}					
              onPress={() => reportPopClose()}
            >
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
            </TouchableOpacity>		
            <View style={[styles.popTitle]}>
              <Text style={styles.popTitleText}>신고 사유</Text>
            </View>
            <KeyboardAwareScrollView
              keyboardVerticalOffset={0}
              behavior={behavior}
            >
              <View style={styles.reportRadio}>
                {reportList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.reportRadioBtn, index == 0 ? styles.mgt0 : null]}
                      activeOpacity={opacityVal}
                      onPress={() => setReport(item.txt)}
                    >
                      <Text style={styles.reportRadioBtnText}>{item.txt}</Text>
                      {report == item.txt ? (                        
                        <ImgDomain fileWidth={20} fileName={'icon_radio_on.png'}/>
                      ) : (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_off.png'}/>
                      )}
                    </TouchableOpacity>
                  )
                })}                  
              </View>
              {report == '기타' ? (
              <View style={[styles.popIptBox]}>		
                <TextInput
                  value={reportEtc}
                  ref={etcRef}
                  onChangeText={(v) => {
                    setReportEtc(v);
                  }}
                  onFocus={()=>{
                    setCurrFocus('report');
                  }}
                  placeholder={'상세 사유를 작성해 주세요. (최소 3자)'}
                  placeholderTextColor="#DBDBDB"
                  style={[styles.input, styles.input2]}
                  returnKyeType='done'                      
                />
              </View>
              ) : null}
            </KeyboardAwareScrollView>
            <View style={styles.popBtnBox}>
              <TouchableOpacity 
                style={[styles.popBtn]}
                activeOpacity={opacityVal}
                onPress={() => submitReport()}
              >
                <Text style={styles.popBtnText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>              
      </View>
      ) : null}
      
      {/* 끌어올리기 */}
			<Modal
				visible={orderPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setOrderPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setOrderPop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setOrderPop(false)}}
						>							
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>소셜 룸을 끌어 올리시겠어요?</Text>
						</View>

            {orderChg == 2 ? (
            <View>
							<Text style={[styles.popTitleDesc]}>프로틴을 충전하고 내 방을 상단 노출 해보세요!</Text>
						</View>
            ) : null}
            
            {orderChg != 0 ? (
            <View style={[styles.pointBox, styles.mgt20]}>
              <ImgDomain fileWidth={24} fileName={'coin.png'}/>
							<Text style={styles.pointBoxText}>{upPoint}</Text>
						</View>
            ) : null}

            <View style={[styles.popBtnBox, orderChg == 0 ? styles.mgt50 : null]}>
              {orderChg == 2 ? (
                <TouchableOpacity 
                  style={[styles.popBtn]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    console.log('작업해야 함');
                  }}
                >
                  <Text style={styles.popBtnText}>상점으로 이동</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                style={[styles.popBtn]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    console.log('작업해야 함');
                  }}
                >
                  <Text style={styles.popBtnText}>끌어올리기</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.popBtn, styles.popBtnOff2]}
                activeOpacity={opacityVal}
                onPress={() => setOrderPop(false)}
              >
                <Text style={[styles.popBtnText, styles.popBtnOffText]}>다음에 할게요</Text>
              </TouchableOpacity>						
            </View>
					</View>
				</View>
			</Modal>

      {/* 프로필 미니 사진 오픈 */}
			<Modal
				visible={miniProfilePop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setMiniProfilePop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setMiniProfilePop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setMiniProfilePop(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
            {miniChg == 0 ? (
              <View>
                <Text style={styles.popTitleText}>프로필 미니 사진을</Text>
                <Text style={[styles.popTitleText, styles.mgt5]}>오픈하시겠어요?</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.popTitleText}>프로틴을 충전하고</Text>
                <Text style={[styles.popTitleText, styles.mgt5]}>미니 사진을 오픈해보세요!</Text>
              </View>
            )}

            <View style={[styles.pointBox, styles.mgt20]}>
              <ImgDomain fileWidth={24} fileName={'coin.png'}/>
							<Text style={styles.pointBoxText}>{miniPoint}</Text>
						</View>

            <View style={[styles.popBtnBox]}>
              {miniChg == 0 ? (
                <TouchableOpacity 
                  style={[styles.popBtn]}
                  activeOpacity={opacityVal}
                  onPress={() => {         
                    setMiniProfilePop(false);
                    setBigImgPop(true);
                  }}
                >
                  <Text style={styles.popBtnText}>오픈하기</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                style={[styles.popBtn]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    console.log('작업해야 함');
                  }}
                >
                  <Text style={styles.popBtnText}>상점으로 이동</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.popBtn, styles.popBtnOff2]}
                activeOpacity={opacityVal}
                onPress={() => setMiniProfilePop(false)}
              >
                <Text style={[styles.popBtnText, styles.popBtnOffText]}>다음에 할게요</Text>
              </TouchableOpacity>						
            </View>
					</View>
				</View>
			</Modal>
      
      {/* 프로필 미니 사진 */}
      <Modal
				visible={bigImgPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setBigImgPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setBigImgPop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setBigImgPop(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
            <ScrollView>
              <AutoHeightImage width={innerWidth-20} source={{uri:'https://cnj02.cafe24.com/appImg/sample2.jpg'}} resizeMethod='resize' />
            </ScrollView>
					</View>
				</View>
			</Modal>

      {/* 수락 대기 */}
			<Modal
				visible={readyPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setReadyPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setReadyPop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setReadyPop(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>아직 프로필을 볼 수 없어요</Text>							
              <Text style={[styles.popTitleDesc]}>호스트의 수락을</Text>
              <Text style={[styles.popTitleDesc, styles.mgt5]}>조금만 더 기다려주세요!</Text>
						</View>		
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => setReadyPop(false)}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      {/* 차단 */}
			<Modal
				visible={blockPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setBlockPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setBlockPop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setBlockPop(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>개팅님을 차단하시겠어요?</Text>							
              <Text style={[styles.popTitleDesc]}>차단한 회원과는 서로</Text>
              <Text style={[styles.popTitleDesc, styles.mgt5]}>프로필 교환 및 소셜 신청이 불가하고</Text>
              <Text style={[styles.popTitleDesc, styles.mgt5]}>추천 카드에 추천되지 않습니다.</Text>
						</View>		
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => {
                  setBlockPop(false);
                }}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => setBlockPop(false)}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
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
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View style={[styles.popTitle, styles.popTitleFlex]}>							
							<View style={styles.popTitleFlexWrap}>
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>탈퇴한 회원이에요</Text>
              </View>
              <ImgDomain fileWidth={18} fileName={'emiticon1.png'}/>
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
						<Text style={styles.popBotTitleText}>지금 이 소셜, 놓치지 마세요!</Text>							
						<Text style={[styles.popBotTitleDesc]}>프로틴을 구매해 바로 신청할 수 있어요</Text>
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

      {/* 소셜 참여 신청 */}
      <Modal
				visible={socialPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setSocialPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setSocialPop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setSocialPop(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
              <Text style={styles.popTitleText}>소셜에 신청하시겠어요?</Text>
						</View>
            <View style={[styles.pointBox, styles.mgt20]}>
              <ImgDomain fileWidth={24} fileName={'coin.png'}/>
              <Text style={styles.pointBoxText}>500</Text>
            </View>
            <View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => {
                  setSocialPop(false);
                }}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => setSocialPop(false)}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      {/* 소셜 신청 수락 */}
      <Modal
				visible={socialPop2}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setSocialPop2(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setSocialPop2(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setSocialPop2(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
              <Text style={styles.popTitleText}>소셜 신청에 수락하시겠어요?</Text>
						</View>
            <View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.mgt50]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => {
                  setSocialPop2(false);
                }}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => setSocialPop2(false)}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      {/* 소셜 신청 수락 */}
      <Modal
				visible={warnPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setWarnPop(false)}
			>
				<TouchableOpacity 
          style={styles.popBack} 
          activeOpacity={1} 
          onPress={()=>{setWarnPop(false)}}
        >
        </TouchableOpacity>
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

  DetailBackBtn: {width:54,height:48,position:'absolute',left:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},
  DetailDotBtn: {width:54,height:48,position:'absolute',right:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},

  cmView: {paddingHorizontal:20,},
  cmViewTitle: {marginBottom:20,},
  cmViewTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:19,color:'#1e1e1e'},

  nickArea: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingBottom:15,borderBottomWidth:1,borderBottomColor:'#ededed',marginBottom:20,},
  nickView: {flexDirection:'row',alignItems:'center'},
  nickViewText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#1e1e1e',marginLeft:10,},
  insertTime: {},
  insertTimeText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:15,color:'#888'},
  viewSubject: {flexDirection:'row',},
  viewSubjectText: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:24,color:'#1e1e1e',},
  viewSubInfo1: {flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:2,},
  viewSubInfo1View: {flexDirection:'row',alignItems:'center',marginRight:6,},
  viewSubInfo1Text: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:15,color:'#666',marginLeft:4,},
  viewSubInfo2: {flexDirection:'row',flexWrap:'wrap'},
  keywordView: {alignItems:'center',justifyContent:'center',minWidth:40,height:20,paddingHorizontal:7,backgroundColor:'#243B55',borderRadius:10,marginTop:10,marginRight:4,},
  keywordViewText: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:14,color:'#fff'},
  viewSubInfo3: {marginTop:20,},
  contentText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:25,color:'#1e1e1e'},
  viewSubInfo4: {paddingTop:5,borderTopWidth:1,borderTopColor:'#ededed',marginTop:20,},
  viewSubInfo4List: {flexDirection:'row',alignItems:'center',position:'relative',marginTop:15,},
  viewSubInfo4ListText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:16,color:'#243B55',marginLeft:6,},
  viewAlert: {position:'absolute',top:1.5,right:0,},

  viewTab: {flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#F2F4F6'},
  viewTabBtn: {alignItems:'center',justifyContent:'center',width:widnowWidth/2,height:60,paddingTop:10,borderBottomWidth:2,borderBottomColor:'#fff'},
  viewTabBtnOn: {borderBottomColor:'#141E30'},
  viewTabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:18,color:'#141E30',},
  viewTabBtnTextOn: {fontFamily:Font.NotoSansSemiBold},

  reqUl: {},
  reqLi: {flexDirection:'row',alignItems:'center',paddingHorizontal:15,paddingVertical:13,paddingRight:75,backgroundColor:'#fff',borderRadius:5,marginTop:12,position:'relative'},
  reqUser: {alignItems:'center',justifyContent:'center',width:46,height:46,borderRadius:50,overflow:'hidden',borderWidth:1,borderColor:'#ededed'},
  reqUserInfo: {width:innerWidth-137,paddingLeft:15,},
  reqUserNick: {},
  reqUserNickText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,lineHeight:17,color:'#D1913C'},
  reqUserDetail: {flexDirection:'row',alignItems:'center',marginTop:4,},
  reqUserDetailText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:17,color:'#666',},
  reqDtLine: {width:1,height:8,backgroundColor:'#EDEDED',marginHorizontal:6,position:'relative',top:-0.5},
  reqOkBtn: {alignItems:'center',justifyContent:'center',width:46,height:30,backgroundColor:'#F2F4F6',borderRadius:5,position:'absolute',right:15,},
  reqOkBtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#243B55'},

  cardView: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
	dday: {width:innerWidth,height:17,backgroundColor:'#fff',marginTop:30,flexDirection:'row',justifyContent:'center',position:'relative'},
	ddayLine: {width:innerWidth,height:1,backgroundColor:'#D1913C',position:'absolute',left:0,top:8,},
	ddayText: {width:40,height:17,textAlign:'center',backgroundColor:'#fff',position:'relative',zIndex:10,fontFamily:Font.RobotoRegular,fontSize:15,lineHeight:17,color:'#D1913C'},
	cardBtn: { width: ((widnowWidth / 2) - 30), marginBottom:20, position: 'relative' },		
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

  cardBtn3: {width:110,marginBottom:0},
  cardCont3: {width:110},
  cardFrontInfo3: {width:110},
  cardFrontInfoCont3: {width:110,padding:8,},

  reviewWrap: {alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',paddingTop:20,},
  blurView: {width:widnowWidth,height:widnowHeight,position:'absolute',left:0,top:0,zIndex:100,},
  blurAlert: {position:'absolute',zIndex:101},
  blurAlertText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:28,color:'#243B55'},
  reviewDepth: {flexDirection:'row',flexWrap:'wrap',marginTop:30,},
  reviewDepth2: {width:innerWidth-34,marginTop:20,},
  reviewInfo: {width:innerWidth-28,paddingLeft:6,},
  reviewInfo2: {width:innerWidth-62,},
  reviewNickDate: {flexDirection:'row',alignItems:'center'},
  reviewNickText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:28,color:'#1e1e1e'},
  reviewDateText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:28,color:'#B8B8B8',marginLeft:6,},
  reviewCont: {marginTop:6,},
  reviewContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#1e1e1e'},
  reviewBtnBox: {flexDirection:'row',alignItems:'center',marginTop:9,},
  reviewBtn: {},
  reviewBtnText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:17,color:'#666'},
  reviewBtnLine: {width:1,height:8,backgroundColor:'#EDEDED',position:'relative',top:1,marginHorizontal:6,},
  reviewSubmitArea: {flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',paddingTop:15,paddingBottom:25,paddingHorizontal:20,borderTopWidth:1,borderTopColor:'#F2F4F6'},
  reviewIpt: {width:innerWidth-50,paddingVertical:3,backgroundColor:'#F9FAFB',borderRadius:5,paddingLeft:15,fontFamily:Font.NotoSansRegular,fontSize:14,color:'#1e1e1e'},
  reviewSubmitBtn: {alignItems:'center',justifyContent:'center',width:40,height:44,},
  reviewSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:19,color:'#243B55'},
  reviewInReview: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:innerWidth,paddingHorizontal:10,marginBottom:10,},
  reviewInReviewText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#1e1e1e'},
  reviewInCancel: {},
  reviewInCancelText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:15,color:'#666'},

  reqStateBox: {borderRadius:20,overflow:'hidden'},  
  reqStateWrap: {flexDirection:'row',justifyContent:'space-between',width:innerWidth,paddingHorizontal:30,paddingVertical:15,},
  reqStateInfo: {alignItems:'flex-end',width:innerWidth-170,paddingLeft:15,},
  reqStateTitle: {marginTop:15,marginBottom:35,},
  reqStateTitleText: {textAlign:'right',fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:18,color:'#D1913C'},
  reqStateCont: {alignItems:'flex-end',marginTop:6,},
  reqStateContText: {textAlign:'right',fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:19,color:'#1e1e1e'},

  input: { fontFamily: Font.NotoSansRegular, width: innerWidth-40, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
	input2: {width: innerWidth},

  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:52,color:'#fff'},

  modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight},
	popBack2: {backgroundColor:'rgba(0,0,0,0.7)',},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},	
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap'},
	popTitleFlexWrap: {position:'relative',},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E',},
  popTitleFlexText: {position:'relative',top:0.5,},	
	popTitleDescFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	popTitleDesc: {width:innerWidth-40,textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	popTitleDescFlexDesc: {width:'auto',position:'relative',top:1.5,},
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

  dotPop: {width:100,backgroundColor:'#fff',borderRadius:10,overflow:'hidden',position:'absolute',top:48+stBarHt,right:20,alignItems:'center'},
  dotPopBtn: {padding:12,},
  dotPopBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#1e1e1e'},
  dotPopBtnLine: {width:80,height:1,backgroundColor:'#EDEDED',borderRadius:5,},

  pointBox: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	pointBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#D1913C',marginLeft:6},

  warnPop: {width:widnowWidth-20,backgroundColor:'#fff',padding:15,position:'absolute',top:32,left:-10,borderWidth:1,borderColor:'#EDEDED',borderRadius:5,},
  wranTri: {position:'absolute',top:-15.5,right:7},
  warnView: {position:'relative'},
  warn: {},
  warnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#D1913C'},
  warn2: {marginVertical:6,},
  warn2Text: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#1e1e1e'},
  warn3: {flexDirection:'row',},
  warn3dot: {alignItems:'center',width:10,},
  warn3dotText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#1e1e1e'},
  warn3TextView: {width:innerWidth-10,},
  warn3Text: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#1e1e1e'},

  reportRadio: {paddingTop:10,paddingBottom:5,},
  reportRadioBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,},
  reportRadioBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:22,color:'#1e1e1e'},

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
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
		elevation: 3,
	},

  boxShadow2: {
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
		elevation: 4,
	},

  boxShadow3: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
		elevation: 9,
	},

  lineView: {height:6,backgroundColor:'#F2F4F6'},
  pdt0: {paddingTop:0},
  pdt10: {paddingTop:10},
  pdt15: {paddingTop:15},
  pdt20: {paddingTop:20},
  pdt30: {paddingTop:30},
  pdb10: {paddingBottom:10},
  pdb20: {paddingBottom:20},
  pdb30: {paddingBottom:30},
	mgt0: {marginTop:0},
  mgt4: {marginTop:4},
	mgt5: {marginTop:5},
	mgt10: {marginTop:10},
	mgt20: {marginTop:20},
	mgt30: {marginTop:30},
	mgt40: {marginTop:40},
	mgt50: {marginTop:50},
  mgb0: {marginBottom:0},
	mgb10: {marginBottom:10},
	mgb20: {marginBottom:20},
	mgr0: {marginRight:0},
	mgl0: {marginLeft:0},
  zindex10: {zIndex:10,},
})

export default SocialView