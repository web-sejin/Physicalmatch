import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Image, Dimensions, ImageBackground, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import Swiper from 'react-native-web-swiper';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const line = Platform.OS === 'ios' ? 15 : 14;
const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const CommunityView = (props) => {
  const reportList = [
    { val: 1, txt: '욕설 / 인신공격',},
    { val: 2, txt: '허위 내용 (사진 및 프로필 도용)',},
    { val: 3, txt: '선정성',},
    { val: 4, txt: '홍보 및 판촉',},
    { val: 5, txt: '종교 & 정치적 혐오 발언',},
    { val: 6, txt: '기타',},
  ]

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route	
  const viewIdx = params['idx'];
  const scrollRef = useRef();	
  const etcRef = useRef(null);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [currFocus, setCurrFocus] = useState('');		
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(2); //1=>호스트, 2=>게스트

  const [dotPop, setDotPop] = useState(false);
  const [reportPop, setReportPop] = useState(false);
  const [cashPop, setCashPop] = useState(false);
  const [prdIdx, setPrdIdx] = useState(2);
  const [blockPop, setBlockPop] = useState(false);
  const [tradePop, setTradePop] = useState(false); //프로필,번호 등 교환
  const [tradeType, setTradeType] = useState(0); //1=>프로필교환 보내기, 2=>프로필교환 수락, 3=>번호교환 수락, 4=>번호교환 보내기
  const [focusState, setFocusState] = useState(false);

  const [report, setReport] = useState('');
  const [reportEtc, setReportEtc] = useState('');
  const [reportType, setReportType] = useState(); //1=>소셜글, 2=>댓글, 3=>대댓글

  const [reviewType, setReviewType] = useState(1); //1=>댓글, 2=>대댓글
  const [reviewCont, setReviewCont] = useState('');

  const [bookSt, setBookSt] = useState(false);
  const [goodSt, setGoodSt] = useState(0); //0=>선택x, 1:좋아요, 2:싫어요
  const [goodCnt, setGoodCnt] = useState(3);
  const [hateCnt, setHateCnt] = useState(0);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
		}else{
			//console.log("isFocused");
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

  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout2, setLayout2] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [layout3, setLayout3] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const onLayout = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout({ x, y, width, height }); };
  const onLayout2 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout2({ x, y, width, height }); };
  const onLayout3 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout3({ x, y, width, height }); };  

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

  const closeTradePop = async () => {    
    setTradePop(false);
    setTradeType(0);
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>	
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>{params['cateName']}</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerBackBtn} 
          activeOpacity={opacityVal}
        >
          <AutoHeightImage width={8} source={require("../../assets/image/icon_header_back.png")} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {setDotPop(true)}} 
          style={styles.headerBackBtn2} 
          activeOpacity={opacityVal}
          >
          <AutoHeightImage width={24} source={require("../../assets/image/icon_hd_dot2.png")} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior={behavior}
        style={{flex:1}}
      >
        <ScrollView ref={scrollRef}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>              
              <View style={[styles.cmView, styles.pdt30, styles.pdb40]}>
                <View style={styles.viewTitle}>
                  <View style={styles.viewTitleArea}>
                    <Text style={styles.viewTitleAreaText}>제목이 입력되는 영역입니다.</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewBookBtn}
                    activeOpacity={opacityVal}
                    onPress={()=>setBookSt(!bookSt)}
                  >
                    {bookSt ? (
                      <AutoHeightImage width={18} source={require('../../assets/image/icon_zzim_on.png')} />
                    ): (
                      <AutoHeightImage width={18} source={require('../../assets/image/icon_zzim_off.png')} />
                    )}                    
                  </TouchableOpacity>
                </View>                

                <View style={styles.viewProf}>
                  <View style={styles.viewProfWrap}>
                    <View style={styles.viewProfImg}>
                      <AutoHeightImage width={32} source={require('../../assets/image/profile_sample.png')} />  
                    </View>
                    <View style={styles.viewProfNick}>
                      <Text style={styles.viewProfNickText}>자동 생성 닉네임</Text>
                    </View>
                    {userType == 2 ? (
                    <TouchableOpacity
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        setTradeType(1);
                        setTradePop(true);
                        //setCashPop(true);
                      }}
                    >
                      <AutoHeightImage width={30} source={require('../../assets/image/icon_profile_trade.png')} />
                    </TouchableOpacity>
                    ) : null}
                  </View>
                  <View style={styles.viewProfDate}>
                    <Text style={styles.viewProfDateText}>8분 전</Text>
                  </View>
                </View>                

                <View style={styles.viewProfCont}>
                  <Text style={styles.viewProfContText}>
                  내용이 입력되는 영역입니다. 자유롭게 내용을 입력해 주세요. 자유롭게 내용을 입력해 주세요. 자유롭게 내용을 입력해 주세요. 자유롭게 내용을 입력해 주세요. 자유롭게 내용을 입력해 주세요.
                  </Text>
                </View>

                <View style={styles.viewProfContImg}>
                  <AutoHeightImage width={innerWidth} source={require('../../assets/image/commu_sample.jpg')} />
                </View>

                <View style={styles.voteArea}>
                  <View style={styles.voteView}>
                    <View style={[styles.voteViewCnt, styles.mgr15]}>
                      <Text style={styles.voteViewCntText}>{goodCnt}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.voteViewCntBtn}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        if(goodSt == 0){
                          setGoodSt(1);
                          setGoodCnt(goodCnt+1);
                        }else{
                          if(goodSt == 1){
                            setGoodSt(0);
                            setGoodCnt(goodCnt-1);
                          }else if(goodSt == 2){
                            setGoodSt(1);
                            setGoodCnt(goodCnt+1);
                            setHateCnt(hateCnt-1);
                          }
                        }                  
                      }}
                    >
                      {goodSt == 1 ? (
                        <AutoHeightImage width={38} source={require('../../assets/image/good_on.png')} />
                      ) : (
                        <AutoHeightImage width={38} source={require('../../assets/image/good_off.png')} />
                      )}                      
                    </TouchableOpacity>
                  </View>
                  <View style={styles.voteCenter}></View>
                  <View style={styles.voteView}>                    
                    <TouchableOpacity
                      style={styles.voteViewCntBtn}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        if(goodSt == 0){
                          setGoodSt(2);
                          setHateCnt(hateCnt+1);
                        }else{
                          if(goodSt == 1){
                            setGoodSt(2);
                            setGoodCnt(goodCnt-1);
                            setHateCnt(hateCnt+1);
                          }else if(goodSt == 2){ 
                            setGoodSt(0);
                            setHateCnt(hateCnt-1);                            
                          }
                        }
                      }}
                    >
                      {goodSt == 2 ? (
                        <AutoHeightImage width={38} source={require('../../assets/image/hate_on.png')} />
                      ) : (
                        <AutoHeightImage width={38} source={require('../../assets/image/hate_off.png')} />
                      )}
                    </TouchableOpacity>
                    <View style={[styles.voteViewCnt, styles.mgl15]}>
                      <Text style={styles.voteViewCntText}>{hateCnt}</Text>
                    </View>
                  </View>
                </View>
              </View>               

              <View style={styles.lineView}></View>

              <View style={[styles.cmView, styles.pdt30, styles.pdb40]}>
                <View style={styles.tradeTitle}>
                  <View style={styles.tradeTitleWrap}>
                    <Text style={styles.tradeTitleText}>프로필 교환 신청</Text>
                    <View style={styles.tradeTitleLine}></View>
                  </View>
                </View>

                <View style={styles.mgt30}>
                  <View style={styles.cmViewTitle2}>
                    <Text style={styles.cmViewTitleText2}>받은 프로필 교환</Text>
                  </View>
                  <View style={styles.reqUl}>                  
                    <View style={[styles.reqLi, styles.boxShadow2, styles.mgt0]}>
                      <TouchableOpacity
                        style={styles.reqUser}
                        activeOpacity={1}
                      >
                        <AutoHeightImage width={46} source={require("../../assets/image/sample3.png")} />
                      </TouchableOpacity>
                      <View style={styles.reqUserInfo}>
                        <View style={styles.tradeState}>
                          <View style={styles.tradeStateView}>
                            <Text style={styles.tradeStateText}>프로필 교환이 도착했어요</Text>
                          </View>
                          <AutoHeightImage width={12} source={require('../../assets/image/icon_profile_msg.png')} />
                        </View>
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
                        onPress={() => {
                          setTradeType(2);
                          setTradePop(true);
                        }}
                      >
                        <Text style={styles.reqOkBtnText}>수락</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.reqLi, styles.boxShadow2,]}>
                      <TouchableOpacity
                        style={styles.reqUser}
                        activeOpacity={1}
                      >
                        <AutoHeightImage width={46} source={require("../../assets/image/sample3.png")} />
                      </TouchableOpacity>
                      <View style={styles.reqUserInfo}>
                        <View style={styles.tradeState}>
                          <View style={styles.tradeStateView}>
                            <Text style={styles.tradeStateText}>프로필 교환이 도착했어요</Text>
                          </View>
                          <AutoHeightImage width={12} source={require('../../assets/image/icon_profile_msg.png')} />
                        </View>
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
                        onPress={() => {
                          setTradeType(2);
                          setTradePop(true);
                        }}
                      >
                        <Text style={styles.reqOkBtnText}>수락</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.reqLi, styles.boxShadow2, styles.reqStateBox]}
                      activeOpacity={opacityVal}
                      onPress={()=>{navigation.navigate('MatchDetail')}}
                    >                  
                      <ImageBackground source={require('../../assets/image/social_req_bg.png')} resizeMode='cover' style={styles.reqStateWrap}>                    
                        <View style={[styles.cardBtn, styles.cardBtn3]}>
                          <View style={[styles.cardCont, styles.cardCont3]}>		
                            <AutoHeightImage width={110} source={require('../../assets/image/front2.png')} style={styles.peopleImgBack} />
                            <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                              <AutoHeightImage width={110} source={require('../../assets/image/front2.png')} style={styles.peopleImgBack} />
                              <AutoHeightImage width={110} source={require('../../assets/image/woman2.png')} style={styles.peopleImg} />
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
                            <Text style={styles.reqStateTitleText}>교환이 수락 되었어요</Text>
                          </View>
                          <AutoHeightImage width={32} source={require("../../assets/image/icon_heart3.png")} />
                          <View style={styles.reqStateCont}>
                            <Text style={styles.reqStateContText}>번호를 교환하고</Text>
                            <Text style={styles.reqStateContText}>인연을 시작해보세요!</Text>
                          </View>
                        </View>         
                      </ImageBackground>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.reqLi, styles.boxShadow2, styles.reqStateBox]}
                      activeOpacity={opacityVal}
                      onPress={()=>{navigation.navigate('MatchDetail')}}
                    >                  
                      <ImageBackground source={require('../../assets/image/social_req_bg.png')} resizeMode='cover' style={styles.reqStateWrap}>                    
                        <View style={[styles.cardBtn, styles.cardBtn3]}>
                          <View style={[styles.cardCont, styles.cardCont3]}>		
                            <AutoHeightImage width={110} source={require('../../assets/image/front2.png')} style={styles.peopleImgBack} />
                            <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                              <AutoHeightImage width={110} source={require('../../assets/image/front2.png')} style={styles.peopleImgBack} />
                              <AutoHeightImage width={110} source={require('../../assets/image/woman2.png')} style={styles.peopleImg} />
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
                            <Text style={styles.reqStateTitleText}>교환이 완료 되었어요</Text>
                          </View>
                          <AutoHeightImage width={32} source={require("../../assets/image/icon_heart3.png")} />
                          <View style={styles.reqStateCont}>
                            <Text style={styles.reqStateContText}>프로필에 오픈된 번호를</Text>
                            <Text style={styles.reqStateContText}>지금 바로 확인해보세요!</Text>
                          </View>
                        </View>         
                      </ImageBackground>
                    </TouchableOpacity>
                  </View>  
                </View>

                <View style={styles.mgt30}>
                  <View style={styles.cmViewTitle2}>
                    <Text style={styles.cmViewTitleText2}>보낸 프로필 교환</Text>
                  </View>
                  <View style={styles.reqUl}>                  
                    <View style={[styles.reqLi, styles.boxShadow2, styles.mgt0]}>
                      <ImageBackground
                        style={styles.reqUser}
                        source={require('../../assets/image/sample3.png')}
                        resizeMode='cover'
                        blurRadius={5}
                      />
                      <View style={[styles.reqUserInfo, styles.reqUserInfo2]}>
                        <View style={styles.tradeState}>
                          <View style={styles.tradeStateView}>
                            <Text style={styles.tradeStateText}>0000님에게 프로필 교환을 신청했어요.</Text>
                          </View>
                        </View>
                        <View style={styles.reqUserDetail}>
                          <Text style={styles.reqUserDetailText}>수락까지 잠시 기다려주세요!</Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.reqLi, styles.boxShadow2,]}>
                      <ImageBackground
                        style={styles.reqUser}
                        source={require('../../assets/image/sample3.png')}
                        resizeMode='cover'
                        blurRadius={5}
                      />
                      <View style={[styles.reqUserInfo, styles.reqUserInfo2]}>
                        <View style={styles.tradeState}>
                          <View style={styles.tradeStateView}>
                            <Text style={styles.tradeStateText}>0000님에게 프로필 교환을 신청했어요.</Text>
                          </View>
                        </View>
                        <View style={styles.reqUserDetail}>
                          <Text style={styles.reqUserDetailText}>수락까지 잠시 기다려주세요!</Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity 
                      style={[styles.reqLi, styles.boxShadow2, styles.reqStateBox]}
                      activeOpacity={opacityVal}
                      onPress={()=>{navigation.navigate('MatchDetail')}}
                    >                  
                      <ImageBackground source={require('../../assets/image/social_req_bg.png')} resizeMode='cover' style={styles.reqStateWrap}>                    
                        <View style={[styles.cardBtn, styles.cardBtn3]}>
                          <View style={[styles.cardCont, styles.cardCont3]}>		
                            <AutoHeightImage width={110} source={require('../../assets/image/front2.png')} style={styles.peopleImgBack} />
                            <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                              <AutoHeightImage width={110} source={require('../../assets/image/front2.png')} style={styles.peopleImgBack} />
                              <AutoHeightImage width={110} source={require('../../assets/image/woman2.png')} style={styles.peopleImg} />
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
                            <Text style={styles.reqStateTitleText}>교환이 수락 되었어요</Text>
                          </View>
                          <AutoHeightImage width={32} source={require("../../assets/image/icon_heart3.png")} />
                          <View style={styles.reqStateCont}>
                            <Text style={styles.reqStateContText}>번호를 교환하고</Text>
                            <Text style={styles.reqStateContText}>인연을 시작해보세요!</Text>
                          </View>
                        </View>         
                      </ImageBackground>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.reqLi, styles.boxShadow2, styles.reqStateBox]}
                      activeOpacity={opacityVal}
                      onPress={()=>{navigation.navigate('MatchDetail')}}
                    >                  
                      <ImageBackground source={require('../../assets/image/social_req_bg.png')} resizeMode='cover' style={styles.reqStateWrap}>                    
                        <View style={[styles.cardBtn, styles.cardBtn3]}>
                          <View style={[styles.cardCont, styles.cardCont3]}>		
                            <AutoHeightImage width={110} source={require('../../assets/image/front2.png')} style={styles.peopleImgBack} />
                            <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                              <AutoHeightImage width={110} source={require('../../assets/image/front2.png')} style={styles.peopleImgBack} />
                              <AutoHeightImage width={110} source={require('../../assets/image/woman2.png')} style={styles.peopleImg} />
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
                            <Text style={styles.reqStateTitleText}>교환이 완료 되었어요</Text>
                          </View>
                          <AutoHeightImage width={32} source={require("../../assets/image/icon_heart3.png")} />
                          <View style={styles.reqStateCont}>
                            <Text style={styles.reqStateContText}>프로필에 오픈된 번호를</Text>
                            <Text style={styles.reqStateContText}>지금 바로 확인해보세요!</Text>
                          </View>
                        </View>         
                      </ImageBackground>
                    </TouchableOpacity>
                  </View>  
                </View>
              </View>

              <View style={styles.lineView}></View>

              <View style={[styles.cmView, styles.pdt40, styles.pdb30]}>
                <View style={styles.cmViewTitle}>
                  <Text style={styles.cmViewTitleText}>댓글</Text>
                </View>
                
                <View style={[styles.reviewDepth, styles.mgt0]}>
                  <AutoHeightImage width={28} source={require("../../assets/image/profile_sample2.png")} />                
                  <View style={styles.reviewInfo}>
                    <View style={styles.reviewNickDate}>
                      <Text style={styles.reviewNickText}>자동 생성 닉네임</Text>
                      <Text style={styles.reviewDateText}>12.31 22:22</Text>
                      <TouchableOpacity
                        style={styles.reviewTradeBtn}
                        activeOpacity={opacityVal}
                        onPress={()=>{

                        }}
                      >
                        <AutoHeightImage width={30} source={require('../../assets/image/icon_profile_trade.png')} />
                      </TouchableOpacity>
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
                      <AutoHeightImage width={28} source={require("../../assets/image/profile_sample2.png")} />
                      <View style={[styles.reviewInfo, styles.reviewInfo2]}>
                        <View style={styles.reviewNickDate}>
                          <Text style={styles.reviewNickText}>자동 생성 닉네임</Text>
                          <Text style={styles.reviewDateText}>12.31 22:22</Text>
                          <TouchableOpacity
                            style={styles.reviewTradeBtn}
                            activeOpacity={opacityVal}
                            onPress={()=>{

                            }}
                          >
                            <AutoHeightImage width={30} source={require('../../assets/image/icon_profile_trade.png')} />
                          </TouchableOpacity>
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
                  <AutoHeightImage width={28} source={require("../../assets/image/profile_sample2.png")} />
                  <View style={styles.reviewInfo}>
                    <View style={styles.reviewNickDate}>
                      <Text style={styles.reviewNickText}>자동 생성 닉네임</Text>
                      <Text style={styles.reviewDateText}>12.31 22:22</Text>
                      <TouchableOpacity
                        style={styles.reviewTradeBtn}
                        activeOpacity={opacityVal}
                        onPress={()=>{

                        }}
                      >
                        <AutoHeightImage width={30} source={require('../../assets/image/icon_profile_trade.png')} />
                      </TouchableOpacity>
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
                  <AutoHeightImage width={28} source={require("../../assets/image/profile_sample.png")} />
                  <View style={styles.reviewInfo}>
                    <View style={styles.reviewNickDate}>
                      <Text style={styles.reviewNickText}>자동 생성 닉네임</Text>
                      <Text style={styles.reviewDateText}>12.31 22:22</Text>
                      <TouchableOpacity
                        style={styles.reviewTradeBtn}
                        activeOpacity={opacityVal}
                        onPress={()=>{

                        }}
                      >
                        <AutoHeightImage width={30} source={require('../../assets/image/icon_profile_trade.png')} />
                      </TouchableOpacity>
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
                  onPress={()=>{}}
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
							<AutoHeightImage width={18} source={require("../../assets/image/popup_x.png")} />
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
              <AutoHeightImage width={18} source={require("../../assets/image/popup_x.png")} />
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
                        <AutoHeightImage width={20} source={require('../../assets/image/icon_radio_on.png')} />
                      ) : (
                        <AutoHeightImage width={20} source={require('../../assets/image/icon_radio_off.png')} />
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
						<Text style={styles.popBotTitleText}>개팅님과의</Text>
            <Text style={styles.popBotTitleText}>인연을 놓치지 마세요!</Text>
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

      {/* 프로필, 번호 교환 */}
      <Modal
				visible={tradePop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => closeTradePop()}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>closeTradePop()}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => closeTradePop()}
						>
							<AutoHeightImage width={18} source={require("../../assets/image/popup_x.png")} />
						</TouchableOpacity>		
						<View>
              {tradeType == 1 ? (<Text style={styles.popTitleText}>프로필을 교환하시겠어요?</Text>) : null}
              {tradeType == 2 ? (<Text style={styles.popTitleText}>교환을 수락하시겠어요?</Text>) : null}
              {tradeType == 3 ? (<Text style={styles.popTitleText}>번호 교환을 수락하시겠어요?</Text>) : null}
              {tradeType == 4 ? (<Text style={styles.popTitleText}>번호를 교환하시겠어요?</Text>) : null}
						</View>
            <View style={[styles.pointBox, styles.mgt20]}>
              <AutoHeightImage width={24} source={require('../../assets/image/coin.png')} />
              <Text style={styles.pointBoxText}>500</Text>
            </View>
            <View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => closeTradePop()}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => closeTradePop()}
							>
								<Text style={styles.popBtnText}>네</Text>
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
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },			

  header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn: {width:54,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerBackBtn2: {width:54,height:48,position:'absolute',right:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},

  cmView: {paddingHorizontal:20,},
  cmViewTitle: {marginBottom:20,},
  cmViewTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:19,color:'#1e1e1e'},
  cmViewTitle2: {},
  cmViewTitleText2: {fontFamily:Font.NotoSansSemiBold,fontSize:13,lineHeight:17,color:'#1e1e1e'},

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
  popTitleFlexText: {position:'relative',top:2,},	
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

  tradeTitle: {flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#EDEDED',},
  tradeTitleWrap: {position:'relative',paddingBottom:9,},
  tradeTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,lineHeight:17,color:'#1e1e1e'},
  tradeTitleLine: {width:97,height:2,backgroundColor:'#141E30',position:'absolute',left:0,bottom:-1,},

  reqUl: {marginTop:15,},
  reqLi: {flexDirection:'row',alignItems:'center',paddingHorizontal:15,paddingVertical:13,paddingRight:75,backgroundColor:'#fff',borderRadius:5,marginTop:12,position:'relative'},
  reqUser: {alignItems:'center',justifyContent:'center',width:46,height:46,borderRadius:50,overflow:'hidden',borderWidth:1,borderColor:'#ededed'},
  reqUserInfo: {width:innerWidth-137,paddingLeft:15,},
  reqUserInfo2: {width:innerWidth-91},
  tradeState: {flexDirection:'row',alignItems:'center',marginBottom:5,},
  tradeStateView: {position:'relative',top:0.5},
  tradeStateText: {fontFamily:Font.NotoSansSemiBold,fontSize:12,lineHeight:17,color:'#1e1e1e'},
  reqUserNick: {},
  reqUserNickText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,lineHeight:17,color:'#D1913C'},
  reqUserDetail: {flexDirection:'row',alignItems:'center',marginTop:4,},
  reqUserDetailText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:17,color:'#666',},
  reqDtLine: {width:1,height:8,backgroundColor:'#EDEDED',marginHorizontal:6,position:'relative',top:-0.5},
  reqOkBtn: {alignItems:'center',justifyContent:'center',width:46,height:30,backgroundColor:'#F2F4F6',borderRadius:5,position:'absolute',right:15,},
  reqOkBtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#243B55'},
  
  reviewDepth: {flexDirection:'row',flexWrap:'wrap',marginTop:30,},
  reviewDepth2: {width:innerWidth-34,marginTop:20,},
  reviewInfo: {width:innerWidth-28,paddingLeft:6,},
  reviewInfo2: {width:innerWidth-62,},
  reviewNickDate: {flexDirection:'row',alignItems:'center',position:'relative',paddingRight:40,},
  reviewNickText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:28,color:'#1e1e1e'},
  reviewDateText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:28,color:'#B8B8B8',marginLeft:6,},
  reviewTradeBtn: {position:'absolute',top:-1,right:0,},
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

  //paddingHorizontal:15,paddingVertical:13,paddingRight:75,
  reqStateBox: {paddingHorizontal:0,paddingVertical:0,paddingRight:0,backgroundColor:'transparent'},  
  reqStateWrap: {flexDirection:'row',justifyContent:'space-between',width:innerWidth,paddingHorizontal:30,paddingVertical:15,backgroundColor:'#fff',borderRadius:5,overflow:'hidden'},
  reqStateInfo: {alignItems:'flex-end',width:innerWidth-170,paddingLeft:15,},
  reqStateTitle: {marginTop:15,marginBottom:35,},
  reqStateTitleText: {textAlign:'right',fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:18,color:'#D1913C'},
  reqStateCont: {alignItems:'flex-end',marginTop:6,},
  reqStateContText: {textAlign:'right',fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:19,color:'#1e1e1e'},

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

  input: { fontFamily: Font.NotoSansRegular, width: innerWidth-40, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
	input2: {width: innerWidth},

  viewTitle: {flexDirection:'row',justifyContent:'space-between',paddingBottom:20,borderBottomWidth:1,borderBottomColor:'#EDEDED'},
  viewTitleArea: {width:innerWidth-40},
  viewTitleAreaText: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:22,color:'#1e1e1e'},
  viewBookBtn: {width:26,alignItems:'center',},
  viewProf: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginVertical:20,},
  viewProfWrap: {flexDirection:'row',alignItems:'center',},
  viewProfImg: {alignItems:'center',justifyContent:'center',width:30,height:30,borderRadius:50,overflow:'hidden'},
  viewProfNick: {marginLeft:10,marginRight:6,},
  viewProfNickText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#1e1e1e'},
  viewProfDate: {},
  viewProfDateText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:16,color:'#888'},
  viewProfCont: {},
  viewProfContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:25,color:'#1e1e1e'},
  viewProfContImg: {marginTop:20,},

  voteArea: {flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:30,},
  voteView: {flexDirection:'row',alignItems:'center',},
  voteCenter: {width:20,height:1,},
  voteViewCntBtn: {},
  voteViewCnt: {},
  voteViewCntText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,lineHeight:17,color:'#1e1e1e'},

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
  popTitleFlexText: {position:'relative',top:0,},	
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
  pdt40: {paddingTop:40},
  pdb0: {paddingBottom:0},
  pdb10: {paddingBottom:10},
  pdb20: {paddingBottom:20},
  pdb30: {paddingBottom:30},
  pdb40: {paddingBottom:40},
	mgt0: {marginTop:0},
	mgt5: {marginTop:5},
	mgt10: {marginTop:10},
	mgt20: {marginTop:20},
	mgt30: {marginTop:30},
	mgt40: {marginTop:40},
	mgt50: {marginTop:50},
	mgb10: {marginBottom:10},
	mgb20: {marginBottom:20},
	mgr0: {marginRight:0},
  mgr15: {marginRight:15},
	mgl0: {marginLeft:0},
  mgl15: {marginLeft:15},
})

export default CommunityView