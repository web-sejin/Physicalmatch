import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Swiper from 'react-native-web-swiper';
import Toast from 'react-native-toast-message';

import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const MatchDetail = (props) => {
  const reportList = [
    { val: 1, txt: '당일 약속 취소 / 과도한 지각',},
    { val: 2, txt: '무리한 스킨십 시도',},
    { val: 3, txt: '허위 프로필 (사진 도용 등)',},
    { val: 4, txt: '비방 / 혐오 / 욕설',},
    { val: 5, txt: '비매너 행위',},
    { val: 6, txt: '기타',},
  ]

	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [currFocus, setCurrFocus] = useState('');	
	const [preventBack, setPreventBack] = useState(false);

  const swiperRef = useRef(null);
  const etcRef = useRef(null);

  const [activeDot, setActiveDot] = useState(0);
  const [zzim, setZzim] = useState(false);
  const [reviewState, setReviewState] = useState(true);
  const [reviewScore, setReviewScore] = useState(0);
  const [report, setReport] = useState('');
  const [reportEtc, setReportEtc] = useState('');

  const [dotPop, setDotPop] = useState(false);
  const [reportPop, setReportPop] = useState(false);
  const [reviewPop, setReviewPop] = useState(false);
  const [sotongPop, setSotongPop] = useState(false);
  const [sotongTypeText, setSotongTypeText] = useState('');
  const [sotongTypePoint, setSotongTypePoint] = useState(0);
  const [sendPop, setSendPop] = useState(false);
  const [preLikePop, setPreLikePop] = useState(false);
  const [preLikeCont, setPreLikeCont] = useState('');
  const [cashType, setCashType] = useState(0);
  const [cashPop, setCashPop] = useState(false);
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
				setReportPop(false);
        setSotongPop(false);
				setPreventBack(false);
        setPreLikePop(false);
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

  useEffect(() => {
    if(report != ''){
      if(report == '기타'){
        setTimeout(function(){
          etcRef.current?.focus();
        }, 100)
      }else{
        setReportEtc('');
      }
    }
  }, [report])

  const fnReview = (v) => {
    setReviewScore(v);
    setReviewPop(true);
  }

  const reviewConfirm = async () => {
    setReviewState(false);
    setReviewScore(0);
    setReviewPop(false);    
  }

  const reportPopClose = () => {
    setPreventBack(false);
    setReportPop(false);
    setReport('');
    setReportEtc('');
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
  
  const sotongClose = () => {
    setSotongPop(false);
    setPreventBack(false);
    setSotongTypeText('');
    setSotongTypePoint(0);
  }

  const sotongSend = (v, z) => {
    setSotongPop(false);
    setPreventBack(false);
    setSotongTypeText(v);
    setSotongTypePoint(z);
  }

  const sotongSendClose = () => {
    setSendPop(false);
    setSotongTypeText('');
    setSotongTypePoint(0);
  }

  const preLikePopClose = () => {
    setPreLikePop(false);
    setPreventBack(false);
    setPreLikeCont('');
  }

  const submitPreLike = async () => {
    preLikePopClose();
    ToastMessage('프리미엄 좋아요를 보냈습니다.');
  }

  const cashPopClose = () => {
    setCashPop(false);
    setCashType(0);
    setPrdIdx(1);
  }

  const cashBuy = async () => {
    
  }
 
  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<ScrollView>
        <TouchableOpacity 
          onPress={() => {navigation.goBack()}} 
          style={styles.DetailBackBtn} 
          activeOpacity={opacityVal}
          >
          <AutoHeightImage width={8} source={require("../../assets/image/icon_header_back2.png")} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {setDotPop(true)}} 
          style={styles.DetailDotBtn} 
          activeOpacity={opacityVal}
          >
          <AutoHeightImage width={24} source={require("../../assets/image/icon_hd_dot.png")} />
        </TouchableOpacity>

        <View style={styles.swiperView}>
					<Swiper					
						ref={swiperRef}	
            controlsProps={{
              prevTitle: '',
              nextTitle: '',
              dotsTouchable: true,
              DotComponent: ({ index, activeIndex, isActive, onPress }) => <View style={[styles.swiperDot, isActive ? styles.swiperDotOn : null]} onPress={console.log(onPress)}></View>              
            }}
						onIndexChanged={(e) => {
							//console.log(e);
							setActiveDot(e);
						}}
					>
						<View style={styles.swiperWrap}>
							<AutoHeightImage width={widnowWidth} source={require("../../assets/image/sample.jpg")} />
						</View>
						<View style={styles.swiperWrap}>
							<AutoHeightImage width={widnowWidth} source={require("../../assets/image/sample.jpg")} />
						</View>
						<View style={styles.swiperWrap}>
							<AutoHeightImage width={widnowWidth} source={require("../../assets/image/sample.jpg")} />
						</View>
            <View style={styles.swiperWrap}>
							<AutoHeightImage width={widnowWidth} source={require("../../assets/image/sample.jpg")} />
						</View>
					</Swiper>
				</View>
				<View style={styles.pagination}>
					<TouchableOpacity
						style={[styles.paginationBtn, activeDot == 0 ? styles.paginationActive : null]}
						activeOpacity={opacityVal}
						onPress={() => {
							setActiveDot(0);
							swiperRef.current.goTo(0);
						}}
					>
						<AutoHeightImage width={46} source={require("../../assets/image/sample.jpg")} style={[styles.paginationImg]} />
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.paginationBtn, activeDot == 1 ? styles.paginationActive : null]}
						activeOpacity={opacityVal}
						onPress={() => {
							setActiveDot(1);
							swiperRef.current.goTo(1);
						}}
					>
            <AutoHeightImage width={46} source={require("../../assets/image/sample.jpg")} style={[styles.paginationImg]} />
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.paginationBtn, activeDot == 2 ? styles.paginationActive : null]}
						activeOpacity={opacityVal}
						onPress={() => {
							setActiveDot(2);
							swiperRef.current.goTo(2);
						}}
					>
						<AutoHeightImage width={46} source={require("../../assets/image/sample.jpg")} style={[styles.paginationImg]} />
					</TouchableOpacity>
          <TouchableOpacity
						style={[styles.paginationBtn, activeDot == 3 ? styles.paginationActive : null]}
						activeOpacity={opacityVal}
						onPress={() => {
							setActiveDot(3);
							swiperRef.current.goTo(3);
						}}
					>
						<AutoHeightImage width={46} source={require("../../assets/image/sample.jpg")} style={[styles.paginationImg]} />
					</TouchableOpacity>
				</View>

        <View style={styles.detailInfo1}>
          <View style={[styles.detailInfo1Wrap, styles.boxShadow]}>
            <View style={styles.detailInfo1View}>
              <Text style={styles.detailInfo1ViewText}>닉네임최대여덟자</Text>
              <Text style={styles.detailInfo1ViewAge}><Text style={styles.roboto}>1999</Text>년생</Text>
            </View>
            <View style={styles.detailInfo1BadgeBox}>
              <AutoHeightImage width={45} source={require('../../assets/image/b_money2_1.png')} style={styles.detailInfo1Badge} />
              <AutoHeightImage width={45} source={require('../../assets/image/b_money1_2.png')} style={styles.detailInfo1Badge} />
              <AutoHeightImage width={45} source={require('../../assets/image/b_car3.png')} style={styles.detailInfo1Badge} />
              <AutoHeightImage width={45} source={require('../../assets/image/b_school1.png')} style={styles.detailInfo1Badge} />
            </View>
            <TouchableOpacity
              style={styles.zzimBtn}
              activeOpacity={opacityVal}
              onPress={() => {setZzim(!zzim)}}
            >
              {zzim ? (
                <AutoHeightImage width={18} source={require('../../assets/image/icon_zzim_on.png')} />
              ) : (
                <AutoHeightImage width={18} source={require('../../assets/image/icon_zzim_off.png')} />
              )}              
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailInfo2}>
          <View style={styles.detailInfo2TextBox}>
            <Text style={styles.detailInfo2Text}>좋아요를 수락하시겠습니까?</Text>
          </View>
          <View style={styles.detailInfo2Text2Box}>
            <Text style={styles.detailInfo2Text2}>2024.03.14</Text>
            <Text style={styles.detailInfo2Text2}>12:53</Text>
          </View>
          <LinearGradient
            colors={['#D1913C', '#FFD194', '#D1913C']}
            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
            style={[styles.grediant, styles.mgt20]}
          >
            <TouchableOpacity
              style={styles.detailInfo2Btn}
              activeOpacity={opacityVal}
              onPress={() => {}}
            >
              <Text style={styles.detailInfo2BtnText}>수락</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.border}></View>

        <View style={[styles.detailInfoCm]}>
          <View style={styles.cmTitle}>
            <Text style={styles.cmTitleText}>Physical</Text>
          </View>
          <View style={styles.physicalBox1}>
            <View style={styles.physicalBox1Cont}>
              <Text style={styles.physicalBox1ContText1}>키</Text>
              <Text style={styles.physicalBox1ContText2}>000 cm</Text>
            </View>
            <View style={styles.physicalBox1Cont}>
              <Text style={styles.physicalBox1ContText1}>몸무게</Text>
              <Text style={styles.physicalBox1ContText2}>00 kg</Text>
            </View>
            <View style={styles.physicalBox1Cont}>
              <Text style={styles.physicalBox1ContText1}>체지방률</Text>
              <Text style={styles.physicalBox1ContText2}>00 %</Text>
            </View>
            <View style={styles.physicalBox1Cont}>
              <Text style={styles.physicalBox1ContText1}>골격근량</Text>
              <Text style={styles.physicalBox1ContText2}>00 kg</Text>
            </View>
          </View>

          <View style={styles.physicalBox2}>
            <View style={styles.physicalBox2Tab}>
              <Text style={styles.physicalBox2TabText}>소두</Text>
            </View>
            <View style={styles.physicalBox2Tab}>
              <Text style={styles.physicalBox2TabText}>비율이 좋은</Text>
            </View>
            <View style={styles.physicalBox2Tab}>
              <Text style={styles.physicalBox2TabText}>팔다리가 긴</Text>
            </View>
          </View>

          <View style={styles.cmInfoBox}>
            <AutoHeightImage width={32} source={require('../../assets/image/icon_cont_muscle.png')} />
            <View style={styles.cmInfoBoxCont}>
              <View style={styles.cmInfoBoxContTit}>
                <Text style={styles.cmInfoBoxContTitText}>운동</Text>
              </View>
              <View style={styles.cmInfoBoxContUl}>
                <View style={styles.cmInfoBoxContLi}>
                  <Text style={styles.cmInfoBoxContWrapText}>매주 N일 <Text style={styles.bold}>헬스</Text>을(를) 해요</Text>
                </View>
                <View style={styles.cmInfoBoxContLi}>
                  <Text style={styles.cmInfoBoxContWrapText}>매주 N일 <Text style={styles.bold}>클라이밍</Text>을(를) 해요</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.border}></View>

        <View style={[styles.detailInfoCm]}>
          <View style={styles.cmTitle}>
            <Text style={styles.cmTitleText}>Profile</Text>
          </View>

          <View style={[styles.cmInfoBox, styles.mgt0]}>
            <AutoHeightImage width={32} source={require('../../assets/image/icon_cont_loc.png')} />
            <View style={styles.cmInfoBoxCont}>
              <View style={styles.cmInfoBoxContTit}>
                <Text style={styles.cmInfoBoxContTitText}>지역</Text>
              </View>              
              <View style={styles.cmInfoBoxContUl}>
                <View style={[styles.cmInfoBoxContLi]}>
                  <Text style={styles.cmInfoBoxContWrapText}>주 활동 지역 :</Text>
                  <Text style={[styles.cmInfoBoxContWrapText2, styles.bold]}>인천 연수구</Text>
                </View>
                <View style={[styles.cmInfoBoxContLi]}>
                  <Text style={styles.cmInfoBoxContWrapText}>부 활동 지역 :</Text>
                  <Text style={[styles.cmInfoBoxContWrapText2, styles.bold]}>인천 남동구</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.cmInfoBox]}>
            <AutoHeightImage width={32} source={require('../../assets/image/icon_cont_job.png')} />
            <View style={styles.cmInfoBoxCont}>
              <View style={styles.cmInfoBoxContTit}>
                <Text style={styles.cmInfoBoxContTitText}>직업</Text>
                <AutoHeightImage width={12} source={require('../../assets/image/icon_cert.png')} style={styles.certIcon} />
              </View>              
              <View style={styles.cmInfoBoxContUl}>
                <View style={[styles.cmInfoBoxContLi]}>
                  <Text style={[styles.cmInfoBoxContWrapText, styles.bold]}>직업최대열자입력가능</Text>
                  <Text style={[styles.cmInfoBoxContWrapText2]}>직업상세최대열자입력</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.cmInfoBox]}>
            <AutoHeightImage width={32} source={require('../../assets/image/icon_cont_school.png')} />
            <View style={styles.cmInfoBoxCont}>
              <View style={styles.cmInfoBoxContTit}>
                <Text style={styles.cmInfoBoxContTitText}>학력</Text>
                <AutoHeightImage width={12} source={require('../../assets/image/icon_cert.png')} style={styles.certIcon} />
              </View>              
              <View style={styles.cmInfoBoxContUl}>
                <View style={[styles.cmInfoBoxContLi]}>
                  <Text style={[styles.cmInfoBoxContWrapText, styles.bold]}>ㅇㅇ대학교 졸업</Text>
                  <Text style={[styles.cmInfoBoxContWrapText2]}>ㅇㅇㅇㅇㅇ 전공</Text>
                </View>
              </View>              
            </View>
          </View>

          <TouchableOpacity
            style={styles.valuesBtn}
            activeOpacity={opacityVal}
            onPress={() => {console.log('연애 및 결혼관 페이지 만들기')}}
          >
            <Text style={styles.valuesBtnText}>연애 및 결혼관</Text>
            <AutoHeightImage width={10} source={require('../../assets/image/icon_arr7.png')} />
          </TouchableOpacity>
          
          <View style={[styles.cmInfoBoxFlex]}>
            <View style={[styles.cmInfoBox, styles.cmInfoBox2]}>
              <AutoHeightImage width={32} source={require('../../assets/image/icon_cont_mbti.png')} />
              <View style={styles.cmInfoBoxCont}>
                <View style={styles.cmInfoBoxContTit}>
                  <Text style={styles.cmInfoBoxContTitText}>MBTI</Text>
                </View>              
                <View style={styles.cmInfoBoxContUl}>
                  <View style={[styles.cmInfoBoxContLi]}>
                    <Text style={[styles.cmInfoBoxContWrapText]}>E(I)ST(F)J</Text>
                  </View>
                </View>              
              </View>
            </View>

            <View style={[styles.cmInfoBox, styles.cmInfoBox2]}>
              <AutoHeightImage width={32} source={require('../../assets/image/icon_cont_rel.png')} />
              <View style={styles.cmInfoBoxCont}>
                <View style={styles.cmInfoBoxContTit}>
                  <Text style={styles.cmInfoBoxContTitText}>종교</Text>
                </View>              
                <View style={styles.cmInfoBoxContUl}>
                  <View style={[styles.cmInfoBoxContLi]}>
                    <Text style={[styles.cmInfoBoxContWrapText]}>무교</Text>
                  </View>
                </View>              
              </View>
            </View>

            <View style={[styles.cmInfoBox, styles.cmInfoBox2]}>
              <AutoHeightImage width={32} source={require('../../assets/image/icon_cont_drink.png')} />
              <View style={styles.cmInfoBoxCont}>
                <View style={styles.cmInfoBoxContTit}>
                  <Text style={styles.cmInfoBoxContTitText}>음주</Text>
                </View>              
                <View style={styles.cmInfoBoxContUl}>
                  <View style={[styles.cmInfoBoxContLi]}>
                    <Text style={[styles.cmInfoBoxContWrapText]}>어쩔 수 없을 때만</Text>
                  </View>
                </View>              
              </View>
            </View>

            <View style={[styles.cmInfoBox, styles.cmInfoBox2]}>
              <AutoHeightImage width={32} source={require('../../assets/image/icon_cont_smoke.png')} />
              <View style={styles.cmInfoBoxCont}>
                <View style={styles.cmInfoBoxContTit}>
                  <Text style={styles.cmInfoBoxContTitText}>흡연</Text>
                </View>              
                <View style={styles.cmInfoBoxContUl}>
                  <View style={[styles.cmInfoBoxContLi]}>
                    <Text style={[styles.cmInfoBoxContWrapText]}>액상형 전자담배</Text>
                  </View>
                </View>              
              </View>
            </View>

            <View style={[styles.cmInfoBox, styles.cmInfoBox2]}>
              <AutoHeightImage width={32} source={require('../../assets/image/icon_cont_marry.png')} />
              <View style={styles.cmInfoBoxCont}>
                <View style={styles.cmInfoBoxContTit}>
                  <Text style={styles.cmInfoBoxContTitText}>혼인</Text>
                  <AutoHeightImage width={12} source={require('../../assets/image/icon_cert.png')} style={styles.certIcon} />
                </View>              
                <View style={styles.cmInfoBoxContUl}>
                  <View style={[styles.cmInfoBoxContLi]}>
                    <Text style={[styles.cmInfoBoxContWrapText]}>미혼</Text>
                  </View>
                </View>              
              </View>
            </View>
          </View>

          <View style={styles.myIntroCont}>
            <Text style={styles.myIntroContText}>
              밝고 긍정적인 성격이며 새로운 것에 대한 도전을 즐기는 성향을 가지고 있습니다. 자기관리를 게을리 하지 않으나 완벽주의는 아닙니다. 서로 존중하며, 상호 간 부족한 면이 있다면 충족시켜 줄 수 있는 진지한 만남을 희망합니다.
            </Text>
          </View>
        </View>

        <View style={styles.border}></View>

        <View style={[styles.detailInfoCm]}>
          <View style={[styles.detailQnaBox, styles.mgt0]}>
            <View style={[styles.cmInfoBox, styles.mgt0]}>
              <AutoHeightImage width={32} source={require('../../assets/image/icon_cont_qna.png')} />
              <View style={styles.cmInfoBoxCont}>
                <View style={styles.cmInfoBoxContTit}>
                  <Text style={styles.cmInfoBoxContTitText}>질문 내용</Text>
                </View>
              </View>
            </View>
            <View style={[styles.myIntroCont, styles.mgt10]}>
              <Text style={styles.myIntroContText}>답변 내용이 노출됩니다.</Text>
            </View>
          </View>
          <View style={[styles.detailQnaBox, styles.mgt30]}>
            <View style={[styles.cmInfoBox, styles.mgt0]}>
              <AutoHeightImage width={32} source={require('../../assets/image/icon_cont_qna.png')} />
              <View style={styles.cmInfoBoxCont}>
                <View style={styles.cmInfoBoxContTit}>
                  <Text style={styles.cmInfoBoxContTitText}>질문 내용</Text>
                </View>
              </View>
            </View>
            <View style={[styles.myIntroCont, styles.mgt10]}>
              <Text style={styles.myIntroContText}>답변 내용이 노출됩니다.</Text>
            </View>
          </View>
        </View>

        <View style={styles.border}></View>

        <View style={[styles.detailInfoCm, styles.detailInfoCm2]}>
          <View style={styles.cmTitle}>
            <Text style={styles.cmTitleText}>Interest</Text>
          </View>
          <View style={[styles.detailInterestBox, styles.mgt0]}>
            <View style={[styles.cmInfoBoxContTit, styles.mgb10]}>
              <Text style={styles.cmInfoBoxContTitText}>운동</Text>
            </View>
            <ScrollView
              horizontal={true}
							showsHorizontalScrollIndicator = {false}
							onMomentumScrollEnd ={() => {}}
            >
              <View style={[styles.interestKeyword, styles.mgl0]}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
              <View style={styles.interestKeyword}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
              <View style={styles.interestKeyword}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
              <View style={styles.interestKeyword}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
              <View style={styles.interestKeyword}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
              <View style={styles.interestKeyword}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
            </ScrollView>
          </View>

          <View style={[styles.detailInterestBox, styles.mgt20]}>
            <View style={[styles.cmInfoBoxContTit, styles.mgb10]}>
              <Text style={styles.cmInfoBoxContTitText}>여행</Text>
            </View>
            <ScrollView
              horizontal={true}
							showsHorizontalScrollIndicator = {false}
							onMomentumScrollEnd ={() => {}}
            >
              <View style={[styles.interestKeyword, styles.mgl0]}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
              <View style={styles.interestKeyword}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
              <View style={styles.interestKeyword}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
              <View style={styles.interestKeyword}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
              <View style={styles.interestKeyword}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
              <View style={styles.interestKeyword}>
                <Text style={styles.interestKeywordText}>#관심사_키워드</Text>
              </View>
            </ScrollView>
          </View>
        </View>
        
        {reviewState ? (
        <>
        <View style={styles.border}></View>

        <View style={[styles.detailInfoCm, styles.detailInfoCm3]}>
          <View style={styles.reviewTitle}>
            <Text style={styles.reviewTitleText}>ㅇㅇ님은 어떠셨어요?</Text>
          </View>
          <View style={styles.starArea}>
            <TouchableOpacity
              style={styles.starBtn}
              activeOpacity={opacityVal}
              onPress={() => {fnReview(1)}}
            >
              {reviewScore > 0 ? (
                <AutoHeightImage width={50} source={require('../../assets/image/star_on.png')} />
              ) : (
                <AutoHeightImage width={50} source={require('../../assets/image/star_off.png')} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.starBtn}
              activeOpacity={opacityVal}
              onPress={() => {fnReview(2)}}
            >
              {reviewScore > 1 ? (
                <AutoHeightImage width={50} source={require('../../assets/image/star_on.png')} />
              ) : (
                <AutoHeightImage width={50} source={require('../../assets/image/star_off.png')} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.starBtn}
              activeOpacity={opacityVal}
              onPress={() => {fnReview(3)}}
            >
              {reviewScore > 2 ? (
                <AutoHeightImage width={50} source={require('../../assets/image/star_on.png')} />
              ) : (
                <AutoHeightImage width={50} source={require('../../assets/image/star_off.png')} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.starBtn}
              activeOpacity={opacityVal}
              onPress={() => {fnReview(4)}}
            >
              {reviewScore > 3 ? (
                <AutoHeightImage width={50} source={require('../../assets/image/star_on.png')} />
              ) : (
                <AutoHeightImage width={50} source={require('../../assets/image/star_off.png')} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.starBtn, styles.mgr0]}
              activeOpacity={opacityVal}
              onPress={() => {fnReview(5)}}
            >
              {reviewScore > 4 ? (
                <AutoHeightImage width={50} source={require('../../assets/image/star_on.png')} />
              ) : (
                <AutoHeightImage width={50} source={require('../../assets/image/star_off.png')} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.reviewDesc}>
            <Text style={styles.reviewDescText}>매력도 평가는 상대방에게 전달되지 않습니다</Text>
            <AutoHeightImage width={13} source={require('../../assets/image/emiticon3.png')} />
          </View>
        </View>
        </>
        ) : null}

				<View style={styles.gapBox}></View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.likeBtn, styles.boxShadow, styles.boxShadow2]}
        activeOpacity={opacityVal}
        onPress={()=>{
          setSotongPop(true);
				  setPreventBack(true);
        }}
      >
        <AutoHeightImage width={60} source={require('../../assets/image/icon_like.png')} />
      </TouchableOpacity>

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
          <TouchableOpacity
            style={styles.dotPopBtn}
            activeOpacity={opacityVal}
            onPress={()=>{
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
      
      {/* 리뷰 점수 팝업 */}
			<Modal
				visible={reviewPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setReviewPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setReviewPop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setReviewPop(false)}}
						>
							<AutoHeightImage width={18} source={require("../../assets/image/popup_x.png")} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>{reviewScore}점으로</Text>
              <Text style={[styles.popTitleText, styles.mgt5]}>평가하시겠어요?</Text>
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {reviewConfirm()}}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      {/* 마음 소통 팝업 */}
      {sotongPop ? (
        <>
          <TouchableOpacity 
            style={[styles.popBack, styles.popBack2]} 
            activeOpacity={1} 
            onPress={()=>sotongClose()}
          >
          </TouchableOpacity>
          <View style={styles.prvPopBot}>
            <View style={[styles.popTitle, styles.popTitleFlex]}>
              <Text style={styles.popBotTitleText}>마음을 보내보세요</Text>
              <AutoHeightImage width={20} source={require('../../assets/image/icon_message.png')} style={styles.emoticon} />
            </View>
            <ScrollView>
              <TouchableOpacity
                style={[styles.sotongBtn, styles.mgt0]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  sotongSend('호감을', 100);
                  setSendPop(true);
                }}
              >
                <Text style={styles.sotongBtnText}>호감</Text>
                <AutoHeightImage width={24} source={require('../../assets/image/coin.png')} />
                <Text style={styles.sotongBtnText2}>100</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sotongBtn}
                activeOpacity={opacityVal}
                onPress={()=>{
                  sotongSend('좋아요를', 200);
                  setSendPop(true);
                }}
              >
                <Text style={styles.sotongBtnText}>좋아요</Text>
                <AutoHeightImage width={24} source={require('../../assets/image/coin.png')} />
                <Text style={styles.sotongBtnText2}>200</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sotongBtn}
                activeOpacity={opacityVal}
                onPress={()=>{
                  setPreLikePop(true);
                  setSotongPop(false);
                }}
              >
                <Text style={styles.sotongBtnText}>프리미엄</Text>
                <AutoHeightImage width={24} source={require('../../assets/image/coin.png')} />
                <Text style={styles.sotongBtnText2}>500</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sotongBtn}
                activeOpacity={opacityVal}
                onPress={() => {
                  setCashType(1);
                  setCashPop(true);
                  setSotongPop(false);
                }}
              >
                <Text>캐시 구매(임시)</Text>
              </TouchableOpacity>
            </ScrollView>
            <View style={[styles.popBtnBox, styles.mgt20]}>         
              <TouchableOpacity 
                style={[styles.popBtn, styles.popBtnOff2, styles.mgt0]}
                activeOpacity={opacityVal}
                onPress={() => sotongClose()}
              >
                <Text style={[styles.popBtnText, styles.popBtnOffText]}>다음에 할게요</Text>
              </TouchableOpacity>						
            </View>
          </View>
        </>
      ) : null}

      {/* 호감, 좋아요 보내기 */}
			<Modal
				visible={sendPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => sotongSendClose()}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>sotongSendClose()}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => sotongSendClose()}
						>
							<AutoHeightImage width={18} source={require("../../assets/image/popup_x.png")} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>{sotongTypeText} 보내시겠어요?</Text>							
						</View>
						<View style={styles.pointBox}>
							<AutoHeightImage width={24} source={require('../../assets/image/coin.png')} />
							<Text style={styles.pointBoxText}>{sotongTypePoint}</Text>
						</View>						
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => sotongSendClose()}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => {
									sotongSendClose();
                  ToastMessage(sotongTypeText+' 보냈습니다.');
								}}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      {/* 프리미엄 좋아요 보내기 */}
      {preLikePop ? (
      <View style={styles.cmPop}>
        <TouchableOpacity 
          style={styles.popBack} 
          activeOpacity={1} 
          onPress={()=>{
            preLikePopClose();
            Keyboard.dismiss();
          }}
        >
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{...styles.prvPop, top:keyboardHeight}}>
            <TouchableOpacity
              style={styles.pop_x}					
              onPress={() => preLikePopClose()}
            >
              <AutoHeightImage width={18} source={require("../../assets/image/popup_x.png")} />
            </TouchableOpacity>		
            <View style={[styles.popTitle]}>
              <Text style={styles.popTitleText}>프리미엄 좋아요를 보내시겠어요?</Text>
              <Text style={styles.popTitleDesc}>상대방이 무료로 수락할 수 있습니다</Text>
              <Text style={[styles.popTitleDesc, styles.mgt5]}>메세지와 함께 보내보세요</Text>
            </View>
            <KeyboardAwareScrollView
              keyboardVerticalOffset={0}
              behavior={behavior}
            >
              <View>
                <TextInput
									value={preLikeCont}
									onChangeText={(v) => {
                    if(v.length > 500){
                      setPreLikeCont(v.substr(0, 500));
                    }else{
										  setPreLikeCont(v);
                    }
									}}
									style={[styles.textarea]}
									onFocus={()=>{
                    setCurrFocus('preLike');
                  }}
									multiline={true}
									returnKyeType='done'
									maxLength={500}
								/>
                <View style={styles.help_box}>
									<Text style={styles.txtCntText}>{preLikeCont.length}/500</Text>
								</View>
              </View>
            </KeyboardAwareScrollView>
            <View style={styles.popBtnBox}>
              <TouchableOpacity 
                style={[styles.popBtn]}
                activeOpacity={opacityVal}
                onPress={() => submitPreLike()}
              >
                <Text style={styles.popBtnText}>프리미엄 좋아요 보내기</Text>
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
				onRequestClose={() => cashPopClose()}
			>
				<TouchableOpacity 
					style={[styles.popBack, styles.popBack2]} 
					activeOpacity={1} 
					onPress={()=>cashPopClose()}
				>
				</TouchableOpacity>
				<View style={styles.prvPopBot}>
          <View style={styles.popInImageView}>
            <AutoHeightImage width={100} source={require('../../assets/image/sample2.jpg')} style={styles.popInImage} />
          </View>
					<View style={[styles.popTitle]}>
            {cashType == 1 ? (
            <>
						<Text style={[styles.popBotTitleText, styles.popBotTitleTextLine]}>개팅님을 놓치지 마세요!</Text>							
						<Text style={[styles.popBotTitleDesc]}>프로틴을 구매해 즉시 마음을 보내보세요</Text>
            </>
            ) : null}

            {cashType == 2 ? (
            <>
						<Text style={[styles.popBotTitleText, styles.popBotTitleTextLine]}>번호를 오픈하시겠어요?</Text>							
						<Text style={[styles.popBotTitleDesc]}>프로틴을 구매해 번호를 오픈할 수 있어요</Text>
            </>
            ) : null}

            {cashType == 3 ? (
            <>
						<Text style={[styles.popBotTitleText, styles.popBotTitleTextLine]}>매칭 성공률을 높여보세요!</Text>							
						<Text style={[styles.popBotTitleDesc]}>프로틴을 구매해 프로필을 추가 오픈할 수 있어요</Text>
            </>
            ) : null}
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
							onPress={() => cashBuy()}
						>
							<Text style={styles.popBtnText}>지금 구매하기</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.popBtn, styles.popBtnOff2]}
							activeOpacity={opacityVal}
							onPress={() => cashPopClose()}
						>
							<Text style={[styles.popBtnText, styles.popBtnOffText]}>다음에 할게요</Text>
						</TouchableOpacity>						
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },
	fullScreen: { flex: 1, },
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
	indicator2: { marginTop: 62 },	

  DetailBackBtn: {width:54,height:48,position:'absolute',left:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},
  DetailDotBtn: {width:54,height:48,position:'absolute',right:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},
  
	swiperView: { height: widnowWidth*1.25,},
	swiperWrap: {},
	pagination: {flexDirection:'row',justifyContent:'center',marginTop:15},
	paginationBtn: {width:46,height:46,overflow:'hidden',borderRadius:5,marginHorizontal:6,alignItems:'center',justifyContent:'center'},
  // paginationActive: {borderWidth:2,borderColor:'#D1913C'},
  paginationImg: {},
  swiperDot: {width:10,height:4,backgroundColor:'#fff',borderRadius:50,opacity:0.3,marginHorizontal:2.5},
  swiperDotOn: {width:20,opacity:1,},

  detailInfo1: {paddingHorizontal:20,paddingTop:15,paddingBottom:30,},
  detailInfo1Wrap: {backgroundColor:'#fff',padding:20,position:'relative'},
  detailInfo1View: {},
  detailInfo1ViewText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:20,lineHeight:26,color:'#1e1e1e'},
  detailInfo1ViewAge: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:10,},
  detailInfo1BadgeBox: {flexDirection:'row',justifyContent:'center',flexWrap:'wrap',marginTop:6,},
  detailInfo1Badge: {marginTop:10,marginHorizontal:10,},
  zzimBtn: {alignItems:'center',justifyContent:'center',width:38,height:38,position:'absolute',top:14,right:10,},

  detailInfo2: {paddingHorizontal:20,paddingBottom:30,alignItems:'center'},
  detailInfo2TextBox: {},
  detailInfo2Text: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:20,lineHeight:26,color:'#1e1e1e'},
  detailInfo2Text2Box: {flexDirection:'row',alignItems:'center',paddingHorizontal:7,paddingTop:6,paddingBottom:3,backgroundColor:'#F9FAFB',borderRadius:50,marginTop:10,},
  detailInfo2Text2: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#1E1E1E',marginHorizontal:5},
  detailInfo2Btn: {alignItems:'center',justifyContent:'center',width:innerWidth,height:52,backgroundColor:'#fff',borderRadius:5,},
  detailInfo2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#D1913C'},

  detailInfoCm: {paddingVertical:30,paddingHorizontal:20,},
  detailInfoCm2: {paddingRight:0,},
  detailInfoCm3: {paddingBottom:50,},
  cmTitle: {marginBottom:20,},
  cmTitleText: {fontFamily:Font.RobotoBold,fontSize:24,lineHeight:26,color:'#243B55'},
  cmInfoBoxFlex: {flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',},
  cmInfoBox: {flexDirection:'row',marginTop:30,},
  cmInfoBox2: {width:(innerWidth/2)-10},
  cmInfoBoxCont: {width:innerWidth-32,paddingLeft:10,},
  cmInfoBoxContTit: {flexDirection:'row',paddingTop:8,},
  cmInfoBoxContTitText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#243B55'},
  certIcon: {marginLeft:4,},
  cmInfoBoxContUl: {marginTop:2,},
  cmInfoBoxContLi: {flexDirection:'row',marginTop:8,},
  cmInfoBoxContWrapText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#1E1E1E'},
  cmInfoBoxContWrapText2: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#1E1E1E',marginLeft:8},

  physicalBox1: {flexDirection:'row',justifyContent:'space-between'},
  physicalBox1Cont: {width:(innerWidth/4)-7.5,alignItems:'center',padding:8,backgroundColor:'#F9FAFB',borderRadius:5,},
  physicalBox1ContText1: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#1E1E1E'},
  physicalBox1ContText2: {fontFamily:Font.RobotoMedium,fontSize:13,lineHeight:15,color:'#1E1E1E',marginTop:6},
  physicalBox2: {flexDirection:'row',flexWrap:'wrap',marginTop:12,},
  physicalBox2Tab: {justifyContent:'center',height:33,paddingHorizontal:14,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:50,marginRight:8,marginTop:8,},
  physicalBox2TabText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:18,color:'#1e1e1e'},

  valuesBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',height:52,backgroundColor:'#243B55',borderRadius:5,marginTop:40,},
  valuesBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff',marginRight:6,},

  myIntroCont: {backgroundColor:'#F9FAFB',paddingVertical:10,paddingHorizontal:15,borderRadius:5,marginTop:30,},
  myIntroContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:26,color:'#1e1e1e'},

  interestKeyword: {justifyContent:'center',height:33,paddingHorizontal:14,backgroundColor:'#EDF2FE',borderRadius:50,marginLeft:8},
  interestKeywordText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#1e1e1e'},

  reviewTitle: {},
  reviewTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#243B55',},
  starArea: {flexDirection:'row',alignItems:'center',justifyContent:'center',marginVertical:25,},
  starBtn: {marginRight:20},
  reviewDesc: {flexDirection:'row',alignItems:'center',justifyContent:'center',},
  reviewDescText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:16,color:'#888',position:'relative',top:0.5},

  input: { fontFamily: Font.NotoSansRegular, width: innerWidth-40, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
	input2: {width: innerWidth},
  textarea: {width:innerWidth-40,height:141,paddingVertical:0,paddingHorizontal:15,borderWidth:1,borderColor:'#EDEDED',borderRadius:5,textAlignVertical:'top',fontFamily:Font.NotoSansRegular,fontSize:14,},

  modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight},
	popBack2: {backgroundColor:'rgba(0,0,0,0.7)',},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},	
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
  popInImageView: {alignItems:'center',marginBottom:20,},
  popInImage: {borderRadius:50,},
	popTitle: {paddingBottom:20,},
	popTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap'},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E'},
	popTitleDesc: {width:innerWidth-40,textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	emoticon: {position:'relative',top:-2,marginLeft:2,},
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
  popBotTitleTextLine: {lineHeight:22,},
	popBotTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#666',marginTop:10,},

  dotPop: {width:100,backgroundColor:'#fff',borderRadius:10,overflow:'hidden',position:'absolute',top:48,right:20,alignItems:'center'},
  dotPopBtn: {padding:12,},
  dotPopBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#1e1e1e'},
  dotPopBtnLine: {width:80,height:1,backgroundColor:'#EDEDED',borderRadius:5,},

  reportRadio: {paddingTop:10,paddingBottom:5,},
  reportRadioBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,},
  reportRadioBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:22,color:'#1e1e1e'},

  likeBtn: {position:'absolute',right:20,bottom:20,width:60,height:60,},
  sotongBtn: {height:52,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:10,},
  sotongBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:22,color:'#1e1e1e',marginRight:15,},
  sotongBtnText2: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:22,color:'#D1913C',marginLeft:4,},

  pointBox: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	pointBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#D1913C',marginLeft:6},

  help_box: {flexDirection:'row',alignItems:'center',justifyContent:'flex-end',marginTop:5,},
	txtCntText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#b8b8b8'},

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

  bold: {fontFamily:Font.NotoSansBold,},
  roboto: {fontFamily:Font.RobotoMedium,fontSize:15,},
  grediant: {padding:1,borderRadius:5,},
  border: {height:6,backgroundColor:'#F2F4F6'},
  boxShadow: {
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
		elevation: 5,
	},
  boxShadow2: {borderRadius:35,},

  mgt0: {marginTop:0},
  mgt5: {marginTop:5},
  mgt10: {marginTop:10},
  mgt20: {marginTop:20},
  mgt30: {marginTop:30},
  mgb0: {marginBottom:0,},
  mgb10: {marginBottom:10,},
  mgl0: {marginLeft:0,},
  mgr0: {marginRight:0,},
})

export default MatchDetail