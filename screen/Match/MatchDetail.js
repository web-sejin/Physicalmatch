import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';

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

  const inviteList = [
    {idx:1, txt:'초중고 동창'},
    {idx:2, txt:'친척'},
    {idx:3, txt:'동호회 지인'},
    {idx:4, txt:'대학 동기 '},
    {idx:5, txt:'보는 눈이 높은'},
    {idx:6, txt:'회사 동료'},
    {idx:7, txt:'지인'},
    {idx:8, txt:'결혼하고 싶어 하는'},
    {idx:9, txt:'만년 솔로인'},
    {idx:10, txt:'이별의 슬픔을 겪고 있는'},
    {idx:11, txt:'형제'},
  ]

  const swp = [
    {idx:1, imgUrl:''},
    {idx:2, imgUrl:''},
    {idx:3, imgUrl:''},
    {idx:4, imgUrl:''},
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
  const [loading, setLoading] = useState(false);

  const swiperRef = useRef(null);
  const etcRef = useRef(null);

  const [activeDot, setActiveDot] = useState(0);
  const [zzim, setZzim] = useState(false);
  const [reviewState, setReviewState] = useState(true);
  const [reviewScore, setReviewScore] = useState(0);
  const [report, setReport] = useState('');
  const [reportEtc, setReportEtc] = useState('');
  const [matchState, setMatchState] = useState(0);

  const [dotPop, setDotPop] = useState(false);
  const [reportPop, setReportPop] = useState(false);
  const [reviewPop, setReviewPop] = useState(false);
  const [sotongPop, setSotongPop] = useState(false);
  const [sotongTypeText, setSotongTypeText] = useState('');
  const [sotongTypePoint, setSotongTypePoint] = useState(0);
  const [sendPop, setSendPop] = useState(false);
  const [preLikePop, setPreLikePop] = useState(false);
  const [preLikeCont, setPreLikeCont] = useState('');
  const [cashType, setCashType] = useState(0); //1:소통 보내기, 2:번호 오픈, 3:연애관 팝업
  const [cashPop, setCashPop] = useState(false);
  const [prdIdx, setPrdIdx] = useState(1);
  const [matchPop, setMatchPop] = useState(false);
  const [numbOpenPop, setNumbOpenPop] = useState(false);
  const [valuesConfirm, setValuesConfirm] = useState(false);
  const [valuesDisable, setValuesDisable] = useState(false);
  const [valuesPop, setValuesPop] = useState(false);
  const [socialType, setSocialType] = useState(); //1:게스트->호스트 , 2:호스트->게스트
  const [socialPop, setSocialPop] = useState(false);
  const [socialPop2, setSocialPop2] = useState(false);
  const [socialState, setSocialState] = useState(0); //1::수락, 2:거절
  const [numberTradePop, setNumberTradePop] = useState(false);
  const [numberTradePop2, setNumberTradePop2] = useState(false);
  
  const [swiperList, setSwiperList] = useState([]);
  const [warterList, setWarterList] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');

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
        setPreLikePop(false);
        setMatchPop(false);
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

  useEffect(() => {
    setLoading(true);
    setPhoneNumber('01000000000');
    setSwiperList(swp);

    let warterAry = [];
    for(let i=0; i<50; i++){
      warterAry = [...warterAry, {order:i}];
    }
    setWarterList(warterAry);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

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
  }, [report]);

  const fnReview = (v) => {
    setReviewScore(v);
    setReviewPop(true);
  }

  const reviewConfirm = async () => {
    setReviewState(false);
    //setReviewScore(0);
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
    //1:소통 보내기, 2:번호 오픈, 3:연애관 팝업
    console.log('cashType ::: ',cashType);
    if(cashType == 1){

    }else if(cashType == 2){
      setMatchState(2);
    }else if(cashType == 3){
      
    }
    cashPopClose();
  }

  const shareApp = () => {
    setMatchPop(false);
    setPreventBack(false);
    navigation.navigate('MyInvite')
  }

  const copyToClipboard = async (v) => {
    try {
      await Clipboard.setString(v);
      if(Platform.OS == 'ios'){
        ToastMessage('클립보드에 복사되었습니다.');
      }
    } catch(e) {
      if(Platform.OS == 'ios'){
        ToastMessage('복사가 실패하였습니다.');
      }
    }
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    console.log(text);
  };

  const product = [
    {idx:1, subject:'상품명1', desc:'100', price:'50,000', best:false},
    {idx:2, subject:'상품명2', desc:'200', price:'50,000', best:true},
    {idx:3, subject:'상품명3', desc:'300', price:'50,000', best:false},
    {idx:4, subject:'상품명4', desc:'400', price:'50,000', best:false},
    {idx:5, subject:'상품명5', desc:'500', price:'50,000', best:false},
    {idx:6, subject:'상품명6', desc:'600', price:'50,000', best:false},
  ]

  const getProductList = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[styles.productBtn, prdIdx==item.idx ? styles.productBtnOn : null, styles.mgr10, product.length == index+1 ? styles.mgr40 : null]}
        activeOpacity={opacityVal}
        onPress={()=>{setPrdIdx(item.idx)}}
      >
        <Text style={styles.productText1}>{item.subject}</Text>
        {item.best ? (
          <View style={[styles.productBest, styles.productBest2]}>
            <Text style={styles.productText2}>BEST</Text>
          </View>
        ) : (
          <View style={styles.productBest}></View>
        )}        
        <Text style={[styles.productText3, prdIdx==item.idx ? styles.productText3On : null]}>개당 ￦{item.desc}</Text>
        <Text style={styles.productText4}>￦{item.price}</Text>
      </TouchableOpacity>
    )
  }
 
  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";  

	return (
		<SafeAreaView style={styles.safeAreaView}>
      {!loading ? (
      <>
			<ScrollView>
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

        <View style={styles.swiperView}>
          <SwiperFlatList
            ref={swiperRef}
            //autoplay
            //autoplayDelay={2}
            //autoplayLoop
            index={0}
            showPagination
            paginationStyle={{alignItems:'center',justifyContent:'center',gap:5,}}
            paginationStyleItem={{width:10,height:4,backgroundColor:'#fff',borderRadius:50,opacity:0.3,margin:0,marginHorizontal:0}}
            paginationStyleItemActive={{width:20,opacity:1,}}
            paginationStyleItemInactive={{backgroundColor:'#fff',opacity:0.3,}}
            data={swiperList}
            onChangeIndex={(obj) => {
              setActiveDot(obj.index);
            }}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.swiperWrap}>                
                <AutoHeightImage width={widnowWidth} source={{uri:'https://cnj02.cafe24.com/appImg/sample.jpg'}} resizeMethod='resize' />
                <View style={styles.warterMark}>
                  <View style={styles.warterMarkWrap}>
                    {warterList.map((item2, index2) => {
                      return (
                        <View key={index2} style={styles.warterMarkView}><Text style={styles.warterMarkText}>{phoneNumber}</Text></View>
                      )
                    })}                    
                  </View>
                </View>
              </View>
            )}
          />
				</View>
				<View style={styles.pagination}>
          {swiperList.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={[styles.paginationBtn, activeDot == index ? styles.paginationActive : null]}
                activeOpacity={opacityVal}
                onPress={() => {
                  swiperRef.current.scrollToIndex({index:index})
                }}
              >                
               <AutoHeightImage width={46} source={{uri:'https://cnj02.cafe24.com/appImg/sample.jpg'}} resizeMethod='resize' style={[styles.paginationImg]} />                
              </TouchableOpacity>
            )
          })}
				</View>

        <View style={styles.detailInfo1}>
          <View style={[styles.detailInfo1Wrap, styles.boxShadow]}>
            <View style={styles.detailInfo1View}>
              <Text style={styles.detailInfo1ViewText}>닉네임최대여덟자</Text>
              <Text style={styles.detailInfo1ViewAge}><Text style={styles.roboto}>1999</Text>년생</Text>
            </View>
            <View style={styles.detailInfo1BadgeBox}>
              <View style={styles.detailInfo1Badge}><ImgDomain fileWidth={45} fileName={'b_money2_1.png'}/></View>
              <View style={styles.detailInfo1Badge}><ImgDomain fileWidth={45} fileName={'b_money1_2.png'}/></View>
              <View style={styles.detailInfo1Badge}><ImgDomain fileWidth={45} fileName={'b_car3.png'}/></View>
              <View style={styles.detailInfo1Badge}><ImgDomain fileWidth={45} fileName={'b_school1.png'}/></View>
            </View>
            <TouchableOpacity
              style={styles.zzimBtn}
              activeOpacity={opacityVal}
              onPress={() => {setZzim(!zzim)}}
            >
              {zzim ? (
                <ImgDomain fileWidth={18} fileName={'icon_zzim_on.png'}/>
              ) : (
                <ImgDomain fileWidth={18} fileName={'icon_zzim_off.png'}/>
              )}              
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailInfo2}>          
          {matchState == 0 ? (
            <>
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
                onPress={() => {
                  setMatchState(1);
                  setMatchPop(true);
                  setPreventBack(true);
                }}
              >
                <Text style={styles.detailInfo2BtnText}>수락</Text>
              </TouchableOpacity>
            </LinearGradient>
            </>
          ) : null}

          {matchState == 1 ? (
          <LinearGradient
            colors={['#D1913C', '#FFD194', '#D1913C']}
            start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
            style={[styles.grediant]}
          >
            <TouchableOpacity
              style={styles.detailInfo2Btn}
              activeOpacity={opacityVal}
              onPress={() => setNumbOpenPop(true)}
            >
              <Text style={styles.detailInfo2BtnText}>번호 오픈</Text>
            </TouchableOpacity>
          </LinearGradient>
          ) : null}

          {matchState == 2 ? (
          <TouchableOpacity
            style={[styles.detailInfo2Btn, styles.detailInfo2BtnGray]}
            activeOpacity={opacityVal}
            onPress={() => copyToClipboard(phoneNumber)}
          >
            <Text style={styles.detailInfo2BtnText, styles.detailInfo2BtnGrayText}>{phoneNumber}</Text>            
            <ImgDomain fileWidth={10} fileName={'icon_copy.png'}/>
          </TouchableOpacity>
          ) : null}
        </View>


        {/* 소셜에서 게스트가 호스트 프로필로 들어왔을 때 */}
        <View style={styles.detailInfo2}>
          <View style={styles.detailInfo2TextBox}>
            <Text style={styles.detailInfo2Text}>최종 참여를 신청 하시겠습니까?</Text>
          </View>
          <View style={[styles.pointBox, styles.mgt20]}> 
            <ImgDomain fileWidth={24} fileName={'coin.png'}/>
            <Text style={styles.pointBoxText}>500</Text>
          </View>
          <TouchableOpacity 
            style={[styles.nextBtn, styles.mgt20]}
            activeOpacity={opacityVal}
            onPress={() => {
              setSocialType(1);
              setSocialPop(true);
            }}
          >
            <Text style={styles.nextBtnText}>신청하기</Text>
          </TouchableOpacity>
        </View>

        {/* 소셜에서 게스트가 호스트 프로필로 들어왔을 때 */}
        <View style={styles.detailInfo2}>
          <View style={styles.detailInfo2TextBox}>
            <Text style={styles.detailInfo2Text}>최종 참여를 수락 하시겠습니까?</Text>
          </View>
          <View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.popBtnBoxFlex2]}>
            <TouchableOpacity 
              style={[styles.popBtn, styles.popBtn3]}
              activeOpacity={opacityVal}
              onPress={() => {
                setSocialType(1);
                setSocialPop2(true);
              }}
            >
              <Text style={[styles.popBtnText]}>수락</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.popBtn, styles.popBtn3, styles.popBtnOff]}
              activeOpacity={opacityVal}
              onPress={() => {}}
            >
              <Text style={[styles.popBtnText, styles.popBtnOffText]}>거절</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 소셜에서 호스트가 게스트 프로필로 들어왔을 때 */}
        <View style={styles.detailInfo2}>                    
          <View style={styles.detailInfo2TextBox}>
            <Text style={styles.detailInfo2Text}>최종 참여를 초대 하시겠습니까?</Text>
          </View>
          <View style={[styles.pointBox, styles.mgt20]}>
            <ImgDomain fileWidth={24} fileName={'coin.png'}/>
            <Text style={styles.pointBoxText}>500</Text>
          </View>
          <TouchableOpacity 
            style={[styles.nextBtn, styles.mgt20]}
            activeOpacity={opacityVal}
            onPress={() => {
              // setSocialType(2);
              // setSocialPop(true);

              setCashType(4);
              setCashPop(true);
            }}
          >
            <Text style={styles.nextBtnText}>초대하기</Text>
          </TouchableOpacity>         
        </View>

        {/* 소셜에서 호스트가 게스트 프로필로 들어왔을 때 */}
        <View style={styles.detailInfo2}>
          <View style={styles.detailInfo2TextBox}>
            <Text style={styles.detailInfo2Text}>최종 참여를 수락 하시겠습니까?</Text>
          </View>
          <View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.popBtnBoxFlex2]}>
            <TouchableOpacity 
              style={[styles.popBtn, styles.popBtn3]}
              activeOpacity={opacityVal}
              onPress={() => {
                setSocialType(2);
                setSocialPop2(true);
              }}
            >
              <Text style={[styles.popBtnText]}>수락</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.popBtn, styles.popBtn3, styles.popBtnOff]}
              activeOpacity={opacityVal}
              onPress={() => {}}
            >
              <Text style={[styles.popBtnText, styles.popBtnOffText]}>거절</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 소셜 관련 */}
        <View style={styles.detailInfo2}>
          <View style={styles.detailInfo2TextBox}>
            <Text style={styles.detailInfo2Text}>최종 참여를 초대 했어요</Text>
            <Text style={styles.detailInfo2Text3}>응답을 기다려주세요!</Text>
          </View>
        </View>

        {/* 소셜 관련 */}
        <View style={styles.detailInfo2}>
          <View style={styles.detailInfo2TextBox}>
            <View style={styles.textFlex}>
              <Text style={styles.detailInfo2Text}>소셜룸에 참여하지 못했어요</Text>
              <ImgDomain fileWidth={20} fileName={'emiticon4.png'}/>
            </View>
            <Text style={styles.detailInfo2Text3}>다른 소셜룸을 만나보세요!</Text>
          </View>
        </View>
        


        {/* 커뮤니티 - 번호 교환 수락(한 쪽이 신청한 상황) */}
        <View style={styles.detailInfo2}>
          <View style={styles.detailInfo2TextBox}>
            <Text style={styles.detailInfo2Text}>번호 교환을 수락 하시겠습니까?</Text>
          </View>
          <TouchableOpacity 
            style={[styles.nextBtn, styles.mgt20]}
            activeOpacity={opacityVal}
            onPress={() => {
              setNumberTradePop(true);
            }}
          >
            <Text style={styles.nextBtnText}>수락</Text>
          </TouchableOpacity> 
        </View>

        {/* 커뮤니티 - 번호 교환 수락(양쪽 모두 신청하지 않은 상황) */}
        <View style={styles.detailInfo2}>
          <View style={styles.detailInfo2TextBox}>
            <Text style={styles.detailInfo2Text}>번호를 교환 하시겠습니까?</Text>
          </View>
          <View style={[styles.pointBox, styles.mgt20]}>            
            <ImgDomain fileWidth={24} fileName={'coin.png'}/>
            <Text style={styles.pointBoxText}>500</Text>
          </View>
          <TouchableOpacity 
            style={[styles.nextBtn, styles.mgt20]}
            activeOpacity={opacityVal}
            onPress={() => {
              //캐시 부족
              //setCashType(1);
              //setCashPop(true);

              //교환 가능
              setNumberTradePop2(true);
            }}
          >
            <Text style={styles.nextBtnText}>번호 교환 신청하기</Text>
          </TouchableOpacity> 
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
            <ImgDomain fileWidth={32} fileName={'icon_cont_muscle.png'}/>
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
            <ImgDomain fileWidth={32} fileName={'icon_cont_loc.png'}/>
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
            <ImgDomain fileWidth={32} fileName={'icon_cont_job.png'}/>
            <View style={styles.cmInfoBoxCont}>
              <View style={styles.cmInfoBoxContTit}>
                <Text style={styles.cmInfoBoxContTitText}>직업</Text>                
                <View style={styles.certIcon}>
                  <ImgDomain fileWidth={12} fileName={'icon_cert.png'} />
                </View>
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
            <ImgDomain fileWidth={32} fileName={'icon_cont_school.png'} />
            <View style={styles.cmInfoBoxCont}>
              <View style={styles.cmInfoBoxContTit}>
                <Text style={styles.cmInfoBoxContTitText}>학력</Text>
                <View style={styles.certIcon}>
                  <ImgDomain fileWidth={12} fileName={'icon_cert.png'} />
                </View>
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
            onPress={() => {
              //상세 프로필 오픈 컨펌
              //setValuesConfirm(true);

              //나의 연애관 입력 유도 팝업
              //setValuesDisable(true);

              //포인트 구매
              setCashType(3);
              setCashPop(true);
            }}
          >
            <Text style={styles.valuesBtnText}>연애 및 결혼관</Text>            
            <ImgDomain fileWidth={8} fileName={'icon_arr7.png'} />
          </TouchableOpacity>
          
          <View style={[styles.cmInfoBoxFlex]}>
            <View style={[styles.cmInfoBox, styles.cmInfoBox2]}>
              <ImgDomain fileWidth={32} fileName={'icon_cont_mbti.png'} />
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
              <ImgDomain fileWidth={32} fileName={'icon_cont_rel.png'} />
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
              <ImgDomain fileWidth={32} fileName={'icon_cont_drink.png'} />
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
              <ImgDomain fileWidth={32} fileName={'icon_cont_smoke.png'} />
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
              <ImgDomain fileWidth={32} fileName={'icon_cont_marry.png'} />
              <View style={styles.cmInfoBoxCont}>
                <View style={styles.cmInfoBoxContTit}>
                  <Text style={styles.cmInfoBoxContTitText}>혼인</Text>
                  <View style={styles.certIcon}>
                    <ImgDomain fileWidth={12} fileName={'icon_cert.png'} />
                  </View>
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
              <ImgDomain fileWidth={32} fileName={'icon_cont_qna.png'} />
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
              <ImgDomain fileWidth={32} fileName={'icon_cont_qna.png'} />
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
         
        {/* 매칭된 사람에게 또는 평가를 한 사람에게 별점 숨김 처리 */}
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
                onPress={() => reviewState ? fnReview(1) : null}
              >
                {reviewScore > 0 ? (
                  <ImgDomain fileWidth={50} fileName={'star_on.png'} />
                ) : (
                  <ImgDomain fileWidth={50} fileName={'star_off.png'} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.starBtn}
                activeOpacity={opacityVal}
                onPress={() => reviewState ? fnReview(2) : null}
              >
                {reviewScore > 1 ? (
                  <ImgDomain fileWidth={50} fileName={'star_on.png'} />
                ) : (
                  <ImgDomain fileWidth={50} fileName={'star_off.png'} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.starBtn}
                activeOpacity={opacityVal}
                onPress={() => reviewState ? fnReview(3) : null}
              >
                {reviewScore > 2 ? (
                  <ImgDomain fileWidth={50} fileName={'star_on.png'} />
                ) : (
                  <ImgDomain fileWidth={50} fileName={'star_off.png'} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.starBtn}
                activeOpacity={opacityVal}
                onPress={() => reviewState ? fnReview(4) : null}
              >
                {reviewScore > 3 ? (
                  <ImgDomain fileWidth={50} fileName={'star_on.png'} />
                ) : (
                  <ImgDomain fileWidth={50} fileName={'star_off.png'} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.starBtn, styles.mgr0]}
                activeOpacity={opacityVal}
                onPress={() => reviewState ? fnReview(5) : null}
              >
                {reviewScore > 4 ? (
                  <ImgDomain fileWidth={50} fileName={'star_on.png'} />
                ) : (
                  <ImgDomain fileWidth={50} fileName={'star_off.png'} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.reviewDesc}>
              <Text style={styles.reviewDescText}>매력도 평가는 상대방에게 전달되지 않습니다</Text>
              <ImgDomain fileWidth={13} fileName={'emiticon3.png'} />
            </View>
          </View>
          </>
        ) : null}
      </ScrollView>

      <TouchableOpacity
        style={[styles.likeBtn, styles.boxShadow, styles.boxShadow2]}
        activeOpacity={opacityVal}
        onPress={()=>{
          setSotongPop(true);
				  setPreventBack(true);
        }}
      >
        <ImgDomain fileWidth={60} fileName={'icon_like.png'} />
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
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
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
                        <ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
                      ) : (
                        <ImgDomain fileWidth={18} fileName={'icon_radio_off.png'} />
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
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
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
              <View style={styles.popTitleFlexWrap}>
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>마음을 보내보세요</Text>
              </View>
              <ImgDomain fileWidth={20} fileName={'icon_message.png'} />
            </View>
            <ScrollView>
              <TouchableOpacity
                style={[styles.sotongBtn]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  sotongSend('호감을', 100);
                  setSendPop(true);
                }}
              >
                <Text style={styles.sotongBtnText}>호감</Text>
                <ImgDomain fileWidth={24} fileName={'coin.png'} />
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
                <ImgDomain fileWidth={24} fileName={'coin.png'} />
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
                <ImgDomain fileWidth={24} fileName={'coin.png'} />
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
                <Text style={styles.popBtnOffText}>캐시 구매 팝업 확인 목적 임시버튼</Text>
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
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>{sotongTypeText} 보내시겠어요?</Text>							
						</View>
						<View style={styles.pointBox}>
              <ImgDomain fileWidth={24} fileName={'coin.png'} />
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
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
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
				<View style={[styles.prvPopBot, styles.prvPopBot3]}>
          <View style={styles.popInImageView}>
            <View style={styles.popInImageViewBox}>              
              <ImgDomain fileWidth={100} fileName={'sample2.jpg'} />
            </View>
          </View>
          <View style={[styles.popTitle, styles.pdl20, styles.pdr20]}>
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

            {cashType == 4 ? (
            <>
						<Text style={[styles.popBotTitleText, styles.popBotTitleTextLine]}>즐거운 만남에 초대하세요!</Text>							
						<Text style={[styles.popBotTitleDesc]}>프로틴을 구매해 즉시 초대할 수 있어요</Text>
            </>
            ) : null}
					</View>					
					<View style={styles.productList}>
            <FlatList
              data={product}
              renderItem={getProductList}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true} // row instead of column
              // Add the 4 properties below for snapping
              snapToAlignment={"start"} 
              snapToInterval={(innerWidth/3)+3} // Adjust to your content width
              decelerationRate={"fast"}      
              style={{paddingLeft:20,}} 
              showsHorizontalScrollIndicator={false}
            />
						{/* <TouchableOpacity
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
						</TouchableOpacity> */}
					</View>
					<View style={[styles.popBtnBox, styles.pdl20, styles.pdr20]}>
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

      {/* 매칭 완료 팝업 */}      
      {matchPop ? (
      <>
        <TouchableOpacity 
          style={[styles.popBack, styles.popBack2]} 
          activeOpacity={1} 
        >
        </TouchableOpacity>
        <View style={styles.prvPopBot}>
          <View style={[styles.popTitle, styles.popTitleFlex]}>
            <ImgDomain fileWidth={20} fileName={'icon_match_success.png'} />
            <ImgDomain fileWidth={20} fileName={'sample2.jpg'} />
            <View style={styles.popTitleFlexWrap}>
              <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>매칭을 축하합니다!</Text>
            </View>            
          </View>
          <View style={styles.popInImageView}>
            <View style={styles.popInImageViewBox}>
              <ImgDomain fileWidth={100} fileName={'sample.jpg'} />
            </View>
            <View style={styles.popInImageNick}>
              <Text style={styles.popInImageNickText}>닉네임최대여덟자</Text>
            </View>
          </View>
          <View style={styles.popSubTitle}>
            <Text style={styles.popSubTitleText}>주변에 피지컬 매치의</Text>
            <Text style={styles.popSubTitleText}>좋은 회원들을 소개해주세요!</Text>
          </View>
          <ScrollView>
            <View style={styles.inviteList}>
              {inviteList.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={styles.inviteListTab}
                  >
                    <Text style={styles.inviteListTabText}>{item.txt}</Text>
                  </View>
                )
              })}
            </View>
          </ScrollView>
          <View style={styles.newProteinCnt}>
            <View style={styles.newProteinCntWrap}>
              <Text style={styles.newProteinCntText}>신규 회원에게 프로틴 <Text style={styles.bold}>00</Text>개 증정</Text>
            </View>
            <ImgDomain fileWidth={12} fileName={'icon_heart.png'} />
          </View>
          <View style={[styles.popBtnBox, styles.mgt20]}>    
            <TouchableOpacity 
							style={[styles.popBtn]}
							activeOpacity={opacityVal}
							onPress={() => shareApp()}
						>
							<Text style={styles.popBtnText}>친구 초대하기</Text>
						</TouchableOpacity>     
            <TouchableOpacity 
              style={[styles.popBtn, styles.popBtnOff2]}
              activeOpacity={opacityVal}
              onPress={() => {
                setMatchPop(false);
                setPreventBack(false);
              }}
            >
              <Text style={[styles.popBtnText, styles.popBtnOffText]}>다음에 할게요</Text>
            </TouchableOpacity>						
          </View>
        </View>
      </>
      ) : null}

      {/* 번호 오픈 */}
			<Modal
				visible={numbOpenPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setNumbOpenPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>setNumbOpenPop(false)}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => setNumbOpenPop(false)}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>번호를 오픈하시겠어요?</Text>							
						</View>
						<View style={styles.pointBox}>
              <ImgDomain fileWidth={24} fileName={'coin.png'} />
							<Text style={styles.pointBoxText}>000</Text>
						</View>						
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => setNumbOpenPop(false)}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => {
                  setCashType(2);
                  setCashPop(true);
									// setMatchState(2);
                  setNumbOpenPop(false);
								}}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      {/* 상세 프로필 오픈 컨펌 */}
			<Modal
				visible={valuesConfirm}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setValuesConfirm(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>setValuesConfirm(false)}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => setValuesConfirm(false)}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>매칭율을 높이는 상세 프로필</Text>			
              <Text style={[styles.popTitleText, styles.mgt5]}>오픈하시겠어요?</Text>
						</View>
						<View style={styles.pointBox}>
              <ImgDomain fileWidth={24} fileName={'coin.png'} />
							<Text style={styles.pointBoxText}>000</Text>
						</View>						
						<View style={[styles.popBtnBox]}>
              <TouchableOpacity 
                style={[styles.popBtn]}
                activeOpacity={opacityVal}
                onPress={() => {
                  setValuesConfirm(false);
                  setValuesPop(true);
                }}
              >
                <Text style={styles.popBtnText}>상세 프로필 확인하기</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.popBtn, styles.popBtnOff2]}
                activeOpacity={opacityVal}
                onPress={() => setValuesConfirm(false)}
              >
                <Text style={[styles.popBtnText, styles.popBtnOffText]}>다음에 할게요</Text>
              </TouchableOpacity>						
            </View>
					</View>
				</View>
			</Modal>

      {/* 나의 연애관 입력 유도 */}
			<Modal
				visible={valuesDisable}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setValuesDisable(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>setValuesDisable(false)}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => setValuesDisable(false)}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>								
            <View style={[styles.popTitle, styles.popTitleFlex]}>
              <View style={styles.popTitleFlexWrap}>
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>앗!</Text>
              </View>
              <ImgDomain fileWidth={18} fileName={'emiticon4.png'} />
            </View>
            <View>
              <Text style={[styles.popTitleDesc, styles.mgt0]}>나의 연애 및 결혼관 정보를 입력해야</Text>
              <Text style={[styles.popTitleDesc, styles.mgt5]}>프로필을 추가로 열 수 있어요</Text>
            </View>

						<View style={[styles.popBtnBox]}>
              <TouchableOpacity 
                style={[styles.popBtn]}
                activeOpacity={opacityVal}
                onPress={() => {
                  console.log('작업해야 함');
                }}
              >
                <Text style={styles.popBtnText}>프로필 수정하러 가기</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.popBtn, styles.popBtnOff2]}
                activeOpacity={opacityVal}
                onPress={() => setValuesDisable(false)}
              >
                <Text style={[styles.popBtnText, styles.popBtnOffText]}>다음에 할게요</Text>
              </TouchableOpacity>						
            </View>
					</View>
				</View>
			</Modal>

      {/* 연애관 팝업 */}
      <Modal
				visible={valuesPop}
				animationType={"none"}
        onRequestClose={() => {setValuesPop(false)}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.header}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>연애 및 결혼관</Text>
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {setValuesPop(false)}}						
					>
            <ImgDomain fileWidth={8} fileName={'icon_header_back.png'} />
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View style={styles.cmWrap}>
						<View style={styles.cmWrapTitleBox}>
							<Text style={styles.cmWrapTitleText}>연애 및 결혼관</Text>
						</View>
            <View style={styles.cmWrapDescBox}>
              <Text style={styles.cmWrapDescText}>나의 연애 및 결혼관이 입력되어야</Text>
              <Text style={styles.cmWrapDescText}>상대방의 연애 및 결혼관을 열 수 있어요.</Text>
            </View>
            <View style={styles.mgt40}>
              <View>
                <View style={styles.valueTitle}>
                  <Text style={styles.valueTitleText}>첫만남</Text>
                </View>
                <View style={styles.valueQuestion}>
                  <Text style={styles.valueQuestionText}><Text style={styles.roboto}>Q1.</Text> 질문 내용입니다.</Text>
                </View>                
                <View style={styles.valueAnswer}>
                  <TouchableOpacity
                    style={[styles.valueAnswerBtn, styles.boxShadow3, styles.boxShadow4, styles.mgt0]}
                    activeOpacity={1}
                  >
                    <Text style={[styles.valueAnswerBtnText, styles.valueAnswerBtnTextOn]}>선택지1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.valueAnswerBtn, styles.boxShadow3]}
                    activeOpacity={1}
                  >
                    <Text style={styles.valueAnswerBtnText}>선택지2</Text>
                  </TouchableOpacity>
                </View>                
              </View>
            </View>
            <View style={styles.mgt50}>
              <View>
                <View style={styles.valueTitle}>
                  <Text style={styles.valueTitleText}>연애관</Text>
                </View>
                <View style={styles.valueQuestion}>
                  <Text style={styles.valueQuestionText}><Text style={styles.roboto}>Q2.</Text> 질문 내용입니다.</Text>
                </View>
                <View style={styles.valueQuestionDesc}>
                  <Text style={styles.valueQuestionDescText}>해당되는 답변을 모두 선택해 주세요</Text>
                </View>                
                <View style={styles.valueAnswer}>
                  <TouchableOpacity
                    style={[styles.valueAnswerBtn, styles.boxShadow3, styles.mgt0]}
                    activeOpacity={1}
                  >
                    <Text style={styles.valueAnswerBtnText}>선택지1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.valueAnswerBtn, styles.boxShadow3]}
                    activeOpacity={1}
                  >
                    <Text style={styles.valueAnswerBtnText}>선택지2</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.mgt30}>
                <View style={styles.valueQuestion}>
                  <Text style={styles.valueQuestionText}><Text style={styles.roboto}>Q3.</Text> 질문 내용입니다.</Text>
                </View>
                <View style={styles.valueAnswer}>
                  <TouchableOpacity
                    style={[styles.valueAnswerBtn, styles.boxShadow3, styles.mgt0]}
                    activeOpacity={1}
                  >
                    <Text style={styles.valueAnswerBtnText}>선택지1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.valueAnswerBtn, styles.boxShadow3]}
                    activeOpacity={1}
                  >
                    <Text style={styles.valueAnswerBtnText}>선택지2</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
					</View>
				</ScrollView>
			</Modal>

      {/* 소셜 관련 팝업 */}
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
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View>
              {socialType == 1 ? (
							  <Text style={styles.popTitleText}>소셜에 최종 참여하시겠어요?</Text>
              ) : (              
                <Text style={styles.popTitleText}>최종 초대를 하시겠어요?</Text>
              )}
						</View>
            
            <View style={[styles.pointBox, styles.mgt20]}>
              <ImgDomain fileWidth={24} fileName={'coin.png'} />
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

      {/* 소셜 관련 팝업2 */}
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
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View>
              {socialType == 1 ? (
							  <Text style={styles.popTitleText}>최종 참여 초대에 수락하시겠어요?</Text>
              ) : (              
                <Text style={styles.popTitleText}>최종 참여 신청에 수락하시겠어요?</Text>
              )}
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

      {/* 커뮤니티 관련 팝업 */}
			<Modal
				visible={numberTradePop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setNumberTradePop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setNumberTradePop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setNumberTradePop(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View>
            <Text style={styles.popTitleText}>번호 교환을 수락하시겠어요?</Text>
						</View>

            <View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.mgt50]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => {
                  setNumberTradePop(false);
                }}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => setNumberTradePop(false)}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      {/* 커뮤니티 관련 팝업2 */}
			<Modal
				visible={numberTradePop2}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setNumberTradePop2(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setNumberTradePop2(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setNumberTradePop2(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View>
            <Text style={styles.popTitleText}>번호를 교환 하시겠어요?</Text>
						</View>
            <View style={[styles.pointBox, styles.mgt20]}>
              <ImgDomain fileWidth={24} fileName={'coin.png'} />
              <Text style={styles.pointBoxText}>500</Text>
            </View>
            <View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => {
                  setNumberTradePop2(false);
                }}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => setNumberTradePop2(false)}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
      </>
      ) : (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#D1913C" />
      </View>
      )}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },  
	fullScreen: { flex: 1, },
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255, 0.3)', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	

  DetailBackBtn: {width:54,height:48,position:'absolute',left:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},
  DetailDotBtn: {width:54,height:48,position:'absolute',right:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},
  
	swiperView: {height:widnowWidth*1.25,},
	swiperWrap: {position:'relative',overflow:'hidden'},
  warterMark: {width:widnowWidth,height:widnowWidth*1.25,position:'absolute',left:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},
  warterMarkWrap: {width:widnowWidth*1.5,flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'center',transform: [{rotate: '-45deg'}],gap:60},
  warterMarkView: {},
  warterMarkText: {fontFamily:Font.RobotoMedium,fontSize:13,color:'#fff',opacity:0.2},
	pagination: {flexDirection:'row',justifyContent:'center',marginTop:15},
	paginationBtn: {width:46,height:46,overflow:'hidden',borderWidth:2,borderColor:'transparent',borderRadius:5,marginHorizontal:6,alignItems:'center',justifyContent:'center'},
  paginationActive: {borderWidth:2,borderColor:'#D1913C'},
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
  detailInfo2Text3: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#1E1E1E',marginTop:20},
  detailInfo2Btn: {alignItems:'center',justifyContent:'center',width:innerWidth,height:52,backgroundColor:'#fff',borderRadius:5,},
  detailInfo2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#D1913C'},
  detailInfo2BtnGray: {flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#F8F8F8',borderWidth:0,},
  detailInfo2BtnGrayText: {color:'#1E1E1E',marginRight:6,},

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

  header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},
  
  cmWrap: {paddingVertical:30,paddingHorizontal:20},
	cmWrap2: {paddingTop:0,paddingBottom:40,paddingHorizontal:20},
	cmWrap3: {paddingTop:20,},
	cmWrapTitleBox: {position:'relative'},
	cmWrapTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmWrapTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmWrapDescBox: {marginTop:8,},
  cmWrapDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

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
  popInImageViewBox: {width:100,height:100,borderRadius:50,overflow:'hidden',alignItems:'center',justifyContent:'center'},
  popInImage: {},
	popTitle: {paddingBottom:20,},
	popTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap',},
  popTitleFlexWrap: {position:'relative'},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E',},
  popTitleFlexText: {position:'relative',top:2,},
	popTitleDesc: {width:innerWidth-40,textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
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
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

  prvPopBot: {width:widnowWidth,maxHeight:innerHeight,paddingTop:40,paddingBottom:10,paddingHorizontal:20,backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,position:'absolute',bottom:0,},
	prvPopBot2: {width:widnowWidth,position:'absolute',bottom:0,},
  prvPopBot3: {paddingHorizontal:0,},
	popBotTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:20,lineHeight:24,color:'#1e1e1e',},
  popBotTitleTextLine: {lineHeight:22,},
	popBotTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#666',marginTop:10,},

  dotPop: {width:100,backgroundColor:'#fff',borderRadius:10,overflow:'hidden',position:'absolute',top:48+stBarHt,right:20,alignItems:'center'},
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
	pointBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#D1913C',marginLeft:6},

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

  popInImageNick: {marginTop:20,},
  popInImageNickText: {fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:22,color:'#1e1e1e'},
  popSubTitle: {alignItems:'center',borderTopWidth:1,borderTopColor:'#ededed',paddingTop:20,marginBottom:30,},
  popSubTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:27,color:'#1e1e1e'},
  inviteList: {flexDirection:'row',justifyContent:'center',flexWrap:'wrap',paddingHorizontal:20,},
  inviteListTab: {alignItems:'center',justifyContent:'center',height:33,paddingHorizontal:14,borderWidth:1,borderColor:'#ededed',borderRadius:50,marginHorizontal:4,marginBottom:8},
  inviteListTabText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#1e1e1e'},
  newProteinCnt: {flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:22},
  newProteinCntWrap: {position:'relative'},
  newProteinCntText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

  valueTitle: {marginBottom:15,},
  valueTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:18,lineHeight:21,color:'#1e1e1e'},
  valueQuestion: {},
  valueQuestionText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
  valueQuestionDesc: {marginTop:4,},
  valueQuestionDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#666'},
  valueAnswer: {marginTop:15,},
  valueAnswerBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#fff',marginTop:12,},
  valueAnswerBtnText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#666'},
  valueAnswerBtnTextOn: {fontFamily:Font.NotoSansMedium,color:'#D1913C'},

  nextBtn: { width:innerWidth, height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:52,color:'#fff'},

  textFlex: {flexDirection:'row',alignItems:'center',},
  
  bold: {fontFamily:Font.NotoSansBold,},
  roboto: {fontFamily:Font.RobotoMedium,fontSize:15,},
  grediant: {padding:1,borderRadius:5,},
  border: {height:6,backgroundColor:'#F2F4F6'},
  boxShadow: {
    backgroundColor:'#fff',
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
		elevation: 5,
	},
  boxShadow2: {borderRadius:35,},
  boxShadow3: {    
    backgroundColor:'#fff',
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.4,
		elevation: 3,
	},
  boxShadow4: {borderWidth:1,borderColor:'rgba(209,145,60,0.3)',shadowColor: "#D1913C",shadowOpacity: 0.25,shadowRadius: 4.65,elevation: 6,},

  pdl20: {paddingLeft:20},
  pdr20: {paddingRight:20},
  mgt0: {marginTop:0},
  mgt5: {marginTop:5},
  mgt10: {marginTop:10},
  mgt20: {marginTop:20},
  mgt30: {marginTop:30},
  mgt40: {marginTop:40},
  mgt50: {marginTop:50},
  mgb0: {marginBottom:0,},
  mgb10: {marginBottom:10,},
  mgr10: {marginRight:10},
  mgr15: {marginRight:15},
  mgr20: {marginRight:20},
  mgr30: {marginRight:30},
  mgr40: {marginRight:40},
	mgl0: {marginLeft:0},
  mgl10: {marginLeft:10},
  mgl15: {marginLeft:15},
})

export default MatchDetail