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
import AsyncStorage from '@react-native-community/async-storage';
import RNIap, {
  initConnection, endConnection,
  getProducts, getSubscriptions, Product,
  requestPurchase, requestSubscription, 
  flushFailedPurchasesCachedAsPendingAndroid,
  clearProductsIOS, clearTransactionIOS, validateReceiptIos,getReceiptIOS,
  purchaseErrorListener, purchaseUpdatedListener, getAvailablePurchases,
  finishTransaction
} from 'react-native-iap';

import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';
import ProfieModify from '../Mypage/ProfieModify';
import ImgDomain2 from '../../components/ImgDomain2';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const paddTop = Platform.OS === 'ios' ? 0 : 15;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const MatchDetail = (props) => {
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

	const {navigation, userInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [currFocus, setCurrFocus] = useState('');	
	const [preventBack, setPreventBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [memberIdx, setMemberIdx] = useState();
  const [memberInfo, setMemberInfo] = useState({});
  const [memberPoint, setMemberPoint] = useState();
  const [profileInfo, setProfileInfo] = useState();
  const [profilePhysical, setProfilePhysical] = useState([]);
  const [profileJob, setProfileJob] = useState();
  const [profileSchool, setProfileSchool] = useState();
  const [profileMarry, setProfileMarry] = useState();
  const [profileMbti, setProfileMbti] = useState('');
  const [profileRel, setProfileRel] = useState('');
  const [profileDrink, setProfileDrink] = useState('');
  const [profileSmoke, setProfileSmoke] = useState('');
  const [profileSmokeType, setProfileSmokeType] = useState('');
  const [profileDateQna, setProfileDateQna] = useState([]);
  const [profileInterview, setProfileInterview] = useState([]);
  const [profileHobby, setProfileHobby] = useState([]);
  const [profileImg, setProfileImg] = useState([]);
  const [likeDate, setLikeDate] = useState('');
  const [likeTime, setLikeTime] = useState('');

  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('');
  const lastOffset = useRef(0);
  const etcRef = useRef(null);

  const [activeDot, setActiveDot] = useState(0);
  const [zzim, setZzim] = useState(false);
  const [reviewState, setReviewState] = useState();
  const [reviewScore, setReviewScore] = useState(0);
  const [report, setReport] = useState('');
  const [reportEtc, setReportEtc] = useState('');
  const [matchState, setMatchState] = useState(); //0:좋아요 보냄, 1:좋아요 받음, 2:번호 오픈 전, 3:번호 오픈 후
  const [matchPremium, setMatchPremium] = useState(false); //프리미엄 좋아요

  const [popState, setPopState] = useState();
  const [dotPop, setDotPop] = useState(false);
  const [reportPop, setReportPop] = useState(false);
  const [reviewPop, setReviewPop] = useState(false);
  const [sotongPop, setSotongPop] = useState(false);
  const [sotongType, setSotongType] = useState(''); //feel:호감, like:좋아요
  const [sotongTypeText, setSotongTypeText] = useState('');
  const [sotongTypePoint, setSotongTypePoint] = useState(0);
  const [sendPop, setSendPop] = useState(false);
  const [preLikePop, setPreLikePop] = useState(false);
  const [preLikeCont, setPreLikeCont] = useState('');
  const [cashType, setCashType] = useState(0); //1:소통 보내기, 2:번호 오픈, 3:연애관 팝업, 4:커뮤니티-초대, 5:커뮤니티-신청, 6:커뮤니티-수락
  const [cashPop, setCashPop] = useState(false);
  const [prdIdx, setPrdIdx] = useState(1);
  const [skuCode, setSkuCode] = useState();
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
  const [registPoint, setRegistPoint] = useState();

  const [reportList, setReportList] = useState([]);
  const [productApiList, setProductApiList] = useState([]);
  const [productInappList, setProductInappList] = useState([]);
  const [platformData, setPlatformData] = useState(null);

  const [curr_state, setCurrState] = useState(params?.currState);
  const [curr_req_mb_idx, setCurrReqMbIdx] = useState(params?.reqMbIdx);
  const [curr_rec_mb_idx, setCurrRecMbIdx] = useState(params?.recMbIdx);

  const accessType = params?.accessType;
  const mb_member_idx = params?.mb_member_idx;  
  const comm_idx = params?.commIdx;
  const comm_idx2 = params?.commIdx2;  
  const write_type = params?.writeType;

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){

		}else{      
			setRouteLoad(true);
			setPageSt(!pageSt);

      AsyncStorage.getItem('member_idx', (err, result) => {		        
				setMemberIdx(result);
			});
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
    if(memberIdx){
      setLoading(true);
      getMemInfo();
      getProfileInfo();
      getProfileDateQna();
    }
  }, [memberIdx])

  useEffect(() => {    
    let warterAry = [];
    for(let i=0; i<100; i++){
      warterAry = [...warterAry, {order:i}];
    }
    setWarterList(warterAry);
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

  useEffect(() => {
    getReportList();
    getProductListApi();
  }, []);

  useEffect(()=>{    
    if(platformData){
      initConnection().then(async(result) => {
        //console.log('result :::: ', result);
        if(Platform.OS == 'android'){

          // Platform ANDROID
          flushFailedPurchasesCachedAsPendingAndroid()        
          .catch((err) => {
            console.log('1111',err);
          })
          .then(() => {
            purchaseUpdateSubscription = purchaseUpdatedListener(async(purchase) => {
              console.log('purchaseUpdatedListener Android', purchase);
              const receipt = purchase.transactionReceipt;

              if(receipt){
                await finishTransaction({purchase, isConsumable: true})
                .catch((error) => {
                  console.log('2222',err);
                })
              }
              setLoading(false);
            })
          })        

          purchaseErrorSubscription = purchaseErrorListener(async(error) => {
            console.log('purchaseErrorListener', error);
            let msg = '';
            if(error?.responseCode == -2){msg = '현재 기기의 플레이스토어 미지원'}
            if(error?.responseCode == -1){msg = '서비스 연결 해제'}
            if(error?.responseCode == 1){msg = '사용자 취소'}
            if(error?.responseCode == 2){msg = '서비스 이용 불가'}
            if(error?.responseCode == 3){msg = '사용자 결제 오류 : 기기 문제 혹은 플레이스토어 오류'}
            if(error?.responseCode == 4){msg = '사용 불가 상품'}
            if(error?.responseCode == 5){msg = '개발자 오류'}
            if(error?.responseCode == 6){msg = '구글플레이 내부 오류'}
            if(error?.responseCode == 7){msg = '이미 구입한 상품'}
            if(error?.responseCode == 8){msg = '구입 실패'}
            if(error?.responseCode == 12){msg = '네트워크 오류'}
            
            setLoading(false);
          })
          // Platform ANDROID END

        }else{

          // Platform IOS
          purchaseUpdateSubscription = purchaseUpdatedListener(async(purchase) => {
            //console.log('purchaseUpdatedListener IOS', purchase);
            const receipt = purchase.transactionReceipt;

            if(receipt){
              await finishTransaction({purchase, isConsumable: true})
              .catch((error) => {
                console.log(error)
              });

              await clearProductsIOS();
              await clearTransactionIOS();
              setLoading(false);
            }else{

            }
          });

          purchaseErrorSubscription = purchaseErrorListener(async(error) => {
            console.log('purchaseErrorListener', error);
            let msg = '';
            if(error?.responseCode == -2){msg = '현재 기기의 플레이스토어 미지원'}
            if(error?.responseCode == -1){msg = '서비스 연결 해제'}
            if(error?.responseCode == 1){msg = '사용자 취소'}
            if(error?.responseCode == 2){msg = '서비스 이용 불가'}
            if(error?.responseCode == 3){msg = '사용자 결제 오류 : 기기 문제 혹은 플레이스토어 오류'}
            if(error?.responseCode == 4){msg = '사용 불가 상품'}
            if(error?.responseCode == 5){msg = '개발자 오류'}
            if(error?.responseCode == 6){msg = '구글플레이 내부 오류'}
            if(error?.responseCode == 7){msg = '이미 구입한 상품'}
            if(error?.responseCode == 8){msg = '구입 실패'}
            if(error?.responseCode == 12){msg = '네트워크 오류'}

            await clearProductsIOS();
            await clearTransactionIOS();
            setLoading(false);
          });
          // Platform IOS END        

        }
        
        if(result){
          await _getProducts();
        }
      }).catch(error => {
        console.log('initConnection error', error)
      });

      return () => {
        //console.log('return unmount')
        if(purchaseUpdateSubscription){
            //console.log('return purchaseUpdateSubscription');
            purchaseUpdateSubscription.remove()
            purchaseUpdateSubscription = null
        }
        if(purchaseErrorSubscription){
            //console.log('return purchaseErrorSubscription');
            purchaseErrorSubscription.remove()
            purchaseErrorSubscription = null
        }
        endConnection()
      }
    }
  }, [platformData]);  

  const getMemInfo = async () => {
    let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
		if(response.code == 200){      
      setMemberInfo(response.data);
      setMemberPoint(response.data.member_point);
      setPhoneNumber(response.data.member_phone);
      setRegistPoint(response.regist_point);
    }
  }

  const getMemberProtain = async () => {
    let sData = {
			basePath: "/api/member/",
			type: "GetMyPoint",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
    //console.log(response);
		if(response.code == 200){      
      setMemberPoint(response.data);
    }
  }

  const getProfileInfo = async () => {
    let profileType = 0;
    if(accessType == 'match'){
      profileType = 0;
    }else if(accessType == 'social'){
      profileType = 1;
    }else if(accessType == 'community'){
      profileType = 2;
    }

    let sData = {
			basePath: "/api/member/",
			type: "GetProfile",
      member_idx: memberIdx,
			user_idx: mb_member_idx,
      profile_type: profileType,
		};

		const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      setProfileInfo(response.data);
      
      if(response.data.img.length > 0){
        setSwiperList(response.data.img);
        setProfileImg(response.data.img[0].mpi_img);
      }

      if(response.data.info.is_bookmark == 'y'){ setZzim(true); }else{ setZzim(false); }
       
      if(response.data.info.member_physical){
        const physicalArray = [];
        const memberPhysical = response.data.info.member_physical.split('|');
        memberPhysical.map((item) => {
          physicalArray.push(item);
        });
        setProfilePhysical(physicalArray);
      }

      if(response.data.auth.length > 0){
        response.data.auth.map((item, index) => {
          if(item.pa_idx == 1){
            if(item.auth_yn == 'y'){ setProfileJob(item); }else{ setProfileJob(); }
          }else if(item.pa_idx == 2){
            if(item.auth_yn == 'y'){ setProfileSchool(item); }else{ setProfileSchool(); }
          }else if(item.pa_idx == 3){
            if(item.auth_yn == 'y'){ setProfileMarry(item); }else{ setProfileMarry(); }
          }
        });
      }

      let physicalMbtiString = '';
      const physicalMbti = response.data.info.member_mbti.split('|');
      physicalMbti.map((item, index) => {
        if((index%2) == 1 && item != ''){
          physicalMbtiString += `(${item})`;          
        }else{
          physicalMbtiString += item;
        }        
      });
      setProfileMbti(physicalMbtiString);

      let relString = '';
      if(response.data.info.member_religion == 1){
        relString = '무교';
      }else if(response.data.info.member_religion == 2){
        relString = '기독교';
      }else if(response.data.info.member_religion == 3){
        relString = '천주교';
      }else if(response.data.info.member_religion == 4){
        relString = '불교';
      }else if(response.data.info.member_religion == 5){
        relString = '기타';
      }
      setProfileRel(relString);

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
      setProfileDrink(drinkString);

      let smokeString = '';
      if(response.data.info.member_smoke_status == 0){
        smokeString = '비흡연';
      }else if(response.data.info.member_smoke_status == 1){
        smokeString = '가끔 피움';
      }else if(response.data.info.member_smoke_status == 2){
        smokeString = '흡연 중';
      }
      setProfileSmoke(smokeString);

      let smokeTypeString = '';
      if(response.data.info.member_smoke_type == 1){
        smokeTypeString = '연초';
      }else if(response.data.info.member_smoke_type == 2){
        smokeTypeString = '권련형 전자담배';
      }else if(response.data.info.member_smoke_type == 3){
        smokeTypeString = '액상형 전자담배';
      }
      setProfileSmokeType(smokeTypeString);

      if(response.data.interview){
        setProfileInterview(response.data.interview);
      }else{
        setProfileInterview([]);
      }

      if(response.data.hobby){
        setProfileHobby(response.data.hobby);
      }else{
        setProfileHobby([]);
      }

      if(response.data.info.is_before_score){
        if(response.data.info.is_before_score == 'y'){
          setReviewState(false);
        }else if(response.data.info.is_before_score == 'n'){
          setReviewState(true);
        }
      }else if(response.data.info.is_after_score){
        if(response.data.info.is_after_score == 'y'){
          setReviewState(false);
        }else if(response.data.info.is_after_score == 'n'){
          setReviewState(true);
        }
      }

      if(response.data.content && response.data.feel_yn == 'n'){
        if(response.data.content.request_member_idx == memberIdx && response.data.content.ml_status == 0){
          setMatchState(0);
        }else if(response.data.content.receive_member_idx == memberIdx && response.data.content.ml_status == 0){      
          setMatchState(1);
          if(response.data.content.ml_type == 1){
            setMatchPremium(true);
          }else{
            setMatchPremium(false);
          }
        }else if(response.data.content.ml_status == 1 && response.data.content.request_member_idx == memberIdx && response.data.content.request_open_status == 1){
          setMatchState(3);
        }else if(response.data.content.ml_status == 1 && response.data.content.receive_member_idx == memberIdx && response.data.content.receive_open_status == 1){          
          setMatchState(3);
        }else if(response.data.content.ml_status == 1 && (response.data.content.request_open_status == 0 || response.data.content.receive_open_status == 0)){
          setMatchState(2);
        }
        
        const like_date = response.data.content.created_at.split(' ');
        setLikeDate(like_date[0].replaceAll('-', '.'));
        setLikeTime(like_date[1].substr(0, 5));
      }
    }
    setLoading(false);
  }

  const getProfileDateQna = async () => {
    let sData = {
			basePath: "/api/member/",
			type: "GetQuestion",
      member_idx: mb_member_idx,
		};

		const response = await APIs.send(sData);
    if(response.code == 200){
      setProfileDateQna(response.data);
    }else{
      setProfileDateQna([]);
    }
  }

  const getReportList = async () => {
    let sData = {
			basePath: "/api/etc/",
			type: "GetReportReasonList2",
		};

		const response = await APIs.send(sData);    
    if(response.code == 200){
      setReportList(response.data);
    }
  }

  const getProductListApi = async () => {
    let sData = {
			basePath: "/api/etc/",
			type: "GetProductList",
      sort: 0,
		};

		const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200 && response.data){
      setProductApiList(response.data);     
      setPrdIdx(response.data[0].pd_idx);
      
      if(Platform.OS === 'ios'){
        setSkuCode(response.data[0].pd_code_ios);
      }else{
        setSkuCode(response.data[0].pd_code_aos);
      }
      
      // 플랫폼에 따른 데이터 설정
      const values = {
        ios: response.ios, // iOS일 때 데이터
        android: response.aos, // Android일 때 데이터        
      };      

      // Platform.select 사용      
      const selectedValue = Platform.select(values);
      //console.log("selectedValue ::: ", selectedValue);
      setPlatformData(selectedValue);

    }else{
      setProductApiList([]);
    }
  }

  const fnReview = (v) => {
    setReviewScore(v);
    setReviewPop(true);
  }

  const reviewConfirm = async () => {
    let ms_type = 0;
    if(profileInfo?.info.is_before_score){
      ms_type = 0;
    }else if(profileInfo?.info.is_before_score){
      ms_type = 1;
    }

    let sData = {
			basePath: "/api/member/",
			type: "SetMemberSocre",
      ms_type: ms_type,
      member_idx: memberIdx,
      user_idx: mb_member_idx,
      ms_score: reviewScore,
		};

		const response = await APIs.send(sData);
    if(response.code == 200){
      setReviewState(false); 
      ToastMessage('평가가 완료되었습니다.');
    }else{
      setReviewScore(0);
      ToastMessage('잠시후 다시 이용해 주세요.');
    }
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

    let sData = {
			basePath: "/api/match/",
			type: "SetReportMember",
      member_idx: memberIdx,
      rm_member_idx: mb_member_idx,
      rm_content: report == '기타' ? reportEtc : report,
		};
    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      reportPopClose();
      ToastMessage('신고접수가 완료되었습니다.');      
      // setTimeout(function(){
      //   navigation.navigate('Home', {reload: true});
      // } ,300);    
    }
  }  
  
  const sotongClose = () => {
    setSotongPop(false);
    setPreventBack(false);
    setSotongType('');
    setSotongTypeText('');
    setSotongTypePoint(0);
  }

  const sotongSend = (v, z, type) => {
    setSotongPop(false);
    setPreventBack(false);
    setSotongType(type);
    setSotongTypeText(v);
    setSotongTypePoint(z);
  }

  const sotongSendClose = () => {
    setSendPop(false);
    setSotongType('');
    setSotongTypeText('');
    setSotongTypePoint(0);
  }

  const submitSotong = async () => {
    let sData = {};    
    console.log(mb_member_idx);
    const paramsString = JSON.stringify({accessType:'match', mb_member_idx:mb_member_idx});
    if(sotongType == 'feel'){      
      sData = {
        basePath: "/api/match/",
        type: "SetMemberFeel",		
        member_idx: memberIdx,        	
        receive_member_idx: mb_member_idx,
        push_idx: 1,
        params: paramsString,
      };
    }else if(sotongType == 'like'){
      sData = {
        basePath: "/api/match/",
        type: "SetMemberLike",		
        member_idx: memberIdx,        	
        receive_member_idx: mb_member_idx,
        ml_type: 0,
        push_idx: 3,
        params: paramsString,
      };
    }

    const response = await APIs.send(sData);
    console.log(response);
    if(response.code == 200){      
      getProfileInfo();
      ToastMessage(sotongTypeText+' 보냈습니다.');
      sotongSendClose();
    }        
  }

  const preLikePopClose = () => {
    setPreLikePop(false);
    setPreventBack(false);
    setPreLikeCont('');
  }

  const submitPreLike = async () => {
    if(preLikeCont.length < 2){
      ToastMessage('메세지를 2글자 이상 작성해 주세요.');
      return false;
    }
    const paramsString = JSON.stringify({accessType:'match', mb_member_idx:mb_member_idx});
    let sData = {
      basePath: "/api/match/",
      type: "SetMemberLike",		
      member_idx: memberIdx,        	
      receive_member_idx: mb_member_idx,
      ml_type: 1,
      ml_memo: preLikeCont,
      push_idx: 4,
      params:paramsString,
    };
    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){      
      ToastMessage('프리미엄 좋아요를 보냈습니다.');
      preLikePopClose();
    }
    
  }

  const cashPopClose = () => {
    setCashPop(false);
    setCashType(0);
    setPrdIdx(1);
  }

  const cashBuy = async () => {
    //1:소통 보내기, 2:번호 오픈, 3:연애관 팝업
    //console.log('cashType ::: ',cashType);
    if(cashType == 1){

    }else if(cashType == 2){
      setMatchState(2);
    }else if(cashType == 3){
      
    }
    setLoading2(true);
    cashPopClose();
    _requestPurchase(skuCode);
    setTimeout(() => { setLoading2(false); }, 3000);
  }

  const shareApp = () => {
    setMatchPop(false);
    setPreventBack(false);
    navigation.navigate('MyInvite');
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

  const getProductList = ({item, index}) => {
    const priceComma = item.pd_price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    return (
      <TouchableOpacity
        style={[styles.productBtn, prdIdx==item.pd_idx ? styles.productBtnOn : null, styles.mgr10, productApiList.length == index+1 ? styles.mgr40 : null]}
        activeOpacity={opacityVal}
        onPress={()=>{
          setPrdIdx(item.pd_idx);
          if(Platform.OS === 'ios'){
            setSkuCode(item.pd_code_ios);
          }else{
            setSkuCode(item.pd_code_aos);
          }
        }}
      >
        <Text style={styles.productText1}>{item.pd_name}</Text>
        {item.pd_best == 'y' ? (
          <View style={[styles.productBest, styles.productBest2]}>
            <Text style={styles.productText2}>BEST</Text>
          </View>
        ) : (
          <View style={styles.productBest}></View>
        )}        
        <Text style={[styles.productText3, prdIdx==item.pd_idx ? styles.productText3On : null]}>개당 ￦{item.pd_content}</Text>
        <Text style={styles.productText4}>￦{priceComma}</Text>
      </TouchableOpacity>
    )
  }

  const itemSkus = platformData;

  const endConnection = () => {}

  const _getProducts = async () => {    
    try {
        const products = await getProducts({skus:itemSkus});
        //console.log('Products', products);

        if (products.length !== 0){
          setProductInappList(products);
        }
        //console.log('_getProducts success');
    } catch (err){
        console.warn("IAP error code ", err.code);
        console.warn("IAP error message ", err.message);
        console.warn("IAP error ", err);
    }
  }

  const _requestPurchase = async (sku) => {
    //console.log("IAP req", sku);
    //setLoading2(true);
    let iapObj = {skus: [sku], sku: sku};
    let getItems = await getProducts(iapObj);
    //console.log('getItems :::: ', getItems);

    let amount = 0;
    if(prdIdx == 19){
      amount = 30;
    }else if(prdIdx == 20){
      amount = 100;
    }else if(prdIdx == 21){
      amount = 200;
    }else if(prdIdx == 22){
      amount = 500;
    }else if(prdIdx == 23){
      amount = 1000;
    }else if(prdIdx == 24){
      amount = 2000;
    }else if(prdIdx == 25){
      amount = 4500;
    }

    const inappPayResult = {
      basePath: "/api/order/",
      type: "SetProductOrder",		
      member_idx: memberIdx,
      pd_idx: prdIdx,
      pd_code: getItems[0].productId,
      pd_name: getItems[0].name,
      pd_price: getItems[0].price,
      pd_amount: amount,
    };

    try {
      await requestPurchase(iapObj)
      .then(async (result) => {
          //console.log('IAP req sub', result);
          if (Platform.OS === 'android'){
            //console.log('dataAndroid', result[0].dataAndroid);
            //console.log("성공");                     
            // can do your API call here to save the purchase details of particular user
            inappPayResult.biling_id = result[0].transactionId;
            inappPayResult.biling_token = result[0].purchaseToken;
            inappPayResult.biling_payment = 'card';            
            inappPayResult.paymented_at = result[0].transactionDate;
          } else if (Platform.OS === 'ios'){
            console.log(result);
            //console.log(result.transactionReceipt);
            // can do your API call here to save the purchase details of particular user
            inappPayResult.biling_id = result.transactionId;
            inappPayResult.biling_token = result.transactionReceipt;
            inappPayResult.biling_payment = 'card';            
            inappPayResult.paymented_at = result.transactionDate;
          }

          //console.log("inappPayResult : ", inappPayResult);
          const response = await APIs.send(inappPayResult);
          //console.log(response);
          if(response.code == 200){
            getMemberProtain();
            ToastMessage('프로틴이 충전되었습니다.');
          }else{
            ToastMessage('잠시후 다시 이용해 주세요.');
          }
      })
      .catch((err) => {
        //setLoading2(false);
        console.log('err1', err);
      });
    } catch (err) {
      //setLoading2(false);
      console.log('err2', err.message);
    }
  }

  const buyProduct = async () => {  
    setCashPop(false);
    _requestPurchase(skuCode);
  }

  const matchZzim = async () => {    
    let sData = {};
    if(zzim){
      sData = {
        basePath: "/api/match/",
        type: "DeleteMemberBookMark",		
        member_idx: memberIdx,        	
        mb_member_idx: mb_member_idx,
      };
    }else{      
      sData = {
        basePath: "/api/match/",
        type: "SetMemberBookMark",
        member_idx: memberIdx,        	
        mb_member_idx: mb_member_idx,
      };
    }
   
    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      setZzim(!zzim);
    }
      
  }

  const scoreOff = () => {
    setReviewPop(false);
    setReviewScore(0);
  }

  const acceptLike = async () => {
    let sData = {
      basePath: "/api/match/",
      type: "AcceptMemberLike",		
      ml_idx: profileInfo?.content.ml_idx,
      member_idx: memberIdx,
      user_idx: mb_member_idx,      
    };

    const response = await APIs.send(sData);
    if(response.code == 200){
      getProfileInfo();
      setMatchPop(true);
      setPreventBack(true);
    }        
  }

  const openPhonenumber = async () => {  
    if(memberPoint < 30){
      setCashType(2);
      setCashPop(true);
      setSotongPop(false);
    }else{
      let sData = {
        basePath: "/api/match/",
        type: "OpenMemberPhone",		
        ml_idx: profileInfo?.content.ml_idx,    
      };
  
      const response = await APIs.send(sData);
      if(response.code == 200){
        getProfileInfo();
        setNumbOpenPop(false);
        ToastMessage('번호가 오픈되었습니다.');
      }
    }    
  }

  const lastJoinSocial = async () => {
    //console.log(socialType);
    let socialMsg = '';
    let socialState = '';
    const paramsString = JSON.stringify({social_idx:comm_idx, social_host_sex:params?.social_host_sex});
    if(socialType == 1){      
      socialMsg = '최종 참여를 신청했습니다.'
      socialState = 3;
    }else if(socialType == 2){
      socialMsg = '최종 초대를 전송했습니다.'
      socialState = 5;
    }

    let sData = {
      basePath: "/api/social/",
      type: "SetSocialState",		
      sj_idx: comm_idx2,
      sj_status: socialState,
      member_idx: memberIdx,
      social_idx: comm_idx,
      params:paramsString,
    };

    if(socialType == 1){      
      sData.push_idx = 8;
    }else if(socialType == 2){
      sData.push_idx = 9;
    }

    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      setCurrState(socialState);
      ToastMessage(socialMsg);
    }else{
      ToastMessage('잠시후 다시 이용해 주세요.');
    }
    setSocialPop(false);
  }

  const lastPermitSocial = async () => {
    //console.log(socialType);    
    const paramsString = JSON.stringify({social_idx:comm_idx, social_host_sex:params?.social_host_sex});

    let sData = {
      basePath: "/api/social/",
      type: "SetSocialState",		
      sj_idx: comm_idx2,
      sj_status: 4,
      member_idx: memberIdx,
      social_idx: comm_idx,
      params: paramsString,
    };
    if(socialType == 1){
      sData.push_idx = 10;
    }else{
      sData.push_idx = 11;
    }
    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      setCurrState(4);
      ToastMessage('최종 참여 수락이 되었습니다.');
    }else{
      ToastMessage('잠시후 다시 이용해 주세요.');
    }
    setSocialPop2(false);
  }

  const changeTradeProfile = async () => {    
    const paramsString = JSON.stringify({
      accessType:'community', 
      mb_member_idx:mb_member_idx, 
      commIdx:comm_idx, 
      currState:curr_state,
      reqMbIdx:curr_req_mb_idx,
      recMbIdx:curr_rec_mb_idx,   
    });    
    let sData = {
      basePath: "/api/community/",
      type: "SetNumberChange",		
      cpc_idx: comm_idx,
      cpc_type: 2,
      request_member_idx: memberIdx,
      permit_member_idx: mb_member_idx,
      params: paramsString,
      push_idx: 16,
    };

    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      ToastMessage('번호 교환을 신청했습니다.');
      setCurrState(2);

      console.log(memberIdx);
      console.log(mb_member_idx);
      setCurrReqMbIdx(memberIdx);
      setCurrRecMbIdx(mb_member_idx);
    }else{
      ToastMessage('잠시후 다시 이용해 주세요.');
    }

    setNumberTradePop2(false);
  }

  const permitTradeProfile = async () => {
    const paramsString = JSON.stringify({
      accessType:'community', 
      mb_member_idx:mb_member_idx, 
      commIdx:comm_idx, 
      currState:curr_state,
      reqMbIdx:curr_req_mb_idx,
      recMbIdx:curr_rec_mb_idx,   
    }); 
    let sData = {
      basePath: "/api/community/",
      type: "SetNumberChange",		
      cpc_idx: comm_idx,
      cpc_type: 3,
      request_member_idx: mb_member_idx,
      permit_member_idx: memberIdx,
      params: paramsString,
      push_idx: 17,
    };

    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      ToastMessage('번호 교환을 수락했습니다.');
      setCurrState(3);
    }else{
      ToastMessage('잠시후 다시 이용해 주세요.');
    }

    setNumberTradePop(false);
  }

  const openSubProfile = async () => {
    let sData = {
      basePath: "/api/match/",
      type: "OpenSubProfile",
      member_idx: memberIdx,
    };

    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      getMemberProtain();
      setValuesConfirm(false);
      setValuesPop(true);
    }    
  }

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const currentOffset = contentOffset.x;
    const itemWidth = layoutMeasurement.width;

    // 방향 계산
    if (currentOffset > lastOffset.current) {
      setDirection('right');
    } else if (currentOffset < lastOffset.current) {
      setDirection('left');
    }
    lastOffset.current = currentOffset;

    // 현재 인덱스 계산
    const newIndex = Math.round(currentOffset / itemWidth);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }

    //console.log(`Direction: ${direction}, Current Index: ${newIndex}`);
    setActiveDot(newIndex);
  };

  const CustomPagination = ({ size, activeIndex }) => {
    const pageWidth = ((size-1)*10)+((size-1)*5)+20;
    return (
    <View style={{...styles.paginationContainer, width:pageWidth}}>
      {Array.from({ length: size }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === activeIndex ? styles.paginationDotActive : null
          ]}
        />
      ))}
    </View>
    )
  };
 
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
        {profileInfo?.info.member_idx != memberIdx ? (
        <TouchableOpacity 
          onPress={() => {setDotPop(true)}} 
          style={styles.DetailDotBtn} 
          activeOpacity={opacityVal}
        >
          <ImgDomain fileWidth={24} fileName={'icon_hd_dot.png'}/>
        </TouchableOpacity>
        ) : null}

        {swiperList.length > 0 ? (
        <>
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
              //onScroll={handleScroll}
              scrollEventThrottle={16}
              onChangeIndex={(obj) => {
                setActiveDot(obj.index);
              }}
              renderItem={({ item, index }) => (
                <View key={index} style={styles.swiperWrap}>
                  <ImgDomain2 fileWidth={widnowWidth} fileName={item.mpi_img} />
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
            {/* <CustomPagination size={swiperList.length} activeIndex={activeDot} /> */}
          </View>
          <View style={styles.pagination}>
            {swiperList.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.paginationBtn, activeDot == index ? styles.paginationActive : null]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    setActiveDot(index);
                    swiperRef.current.scrollToIndex({index:index})
                  }}
                >                
                  <ImgDomain2 fileWidth={46} fileName={item.mpi_img} />
                </TouchableOpacity>
              )
            })}
          </View>
        </>
        ) : null}

        <View style={styles.detailInfo1}>
          <View style={[styles.detailInfo1Wrap, styles.boxShadow]}>
            <View style={styles.detailInfo1View}>
              <Text style={styles.detailInfo1ViewText}>{profileInfo?.info.member_nick}</Text>
              <Text style={styles.detailInfo1ViewAge}><Text style={styles.roboto}>{profileInfo?.info.member_age}</Text>년생</Text>
            </View>
            {profileInfo?.badge.length > 0 ? (
            <View style={styles.detailInfo1BadgeBox}>
              {profileInfo?.badge.map((item, index) => {
                return (
                  <View key={index} style={styles.detailInfo1Badge}><ImgDomain2 fileWidth={45} fileName={item.badge_img}/></View>
                )
              })}                        
            </View>
            ) : null}

            {profileInfo?.bookmark_yn == 'y' && profileInfo?.info.member_idx != memberIdx ? (
            <TouchableOpacity
              style={styles.zzimBtn}
              activeOpacity={opacityVal}
              onPress={() => matchZzim()}
            >
              {zzim ? (
                <ImgDomain fileWidth={18} fileName={'icon_zzim_on.png'}/>
              ) : (
                <ImgDomain fileWidth={18} fileName={'icon_zzim_off.png'}/>
              )}              
            </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {accessType == 'match' ? (
          <View>
            {matchState == 0 ? (
              <View style={styles.detailInfo2}>
                <View style={styles.detailInfo2TextBox}>
                  <Text style={styles.detailInfo2Text}>좋아요를 보냈어요</Text>
                <Text style={styles.detailInfo2Text3}>응답을 기다려주세요!</Text>
                </View>
                <View style={styles.detailInfo2Text2Box}>
                  <Text style={styles.detailInfo2Text2}>{likeDate}</Text>
                  <Text style={styles.detailInfo2Text2}>{likeTime}</Text>
                </View>
              </View>
            ) : null}

            {matchState == 1 ? (
              <View style={styles.detailInfo2}>
                <View style={styles.detailInfo2TextBox}>
                  <Text style={styles.detailInfo2Text}>좋아요를 수락하시겠습니까?</Text>
                </View>
                <View style={styles.detailInfo2Text2Box}>
                  <Text style={styles.detailInfo2Text2}>{likeDate}</Text>
                  <Text style={styles.detailInfo2Text2}>{likeTime}</Text>
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
                      if(!matchPremium && memberPoint < 5){
                        setCashType(1);
                        setCashPop(true);
                        setSotongPop(false);
                      }else{
                        acceptLike();
                      }                   
                    }}
                  >
                    <Text style={styles.detailInfo2BtnText}>수락</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ) : null}

            {matchState == 2 ? (
              <View style={styles.detailInfo2}>
                <LinearGradient
                  colors={['#D1913C', '#FFD194', '#D1913C']}
                  start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                  style={[styles.grediant]}
                >
                  <TouchableOpacity
                    style={styles.detailInfo2Btn}
                    activeOpacity={opacityVal}
                    onPress={() => {                      
                      setNumbOpenPop(true);                      
                    }}
                  >
                    <Text style={styles.detailInfo2BtnText}>번호 오픈</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ) : null}

            {matchState == 3 ? (
              <View style={styles.detailInfo2}>
                <TouchableOpacity
                  style={[styles.detailInfo2Btn, styles.detailInfo2BtnGray]}
                  activeOpacity={opacityVal}
                  onPress={() => copyToClipboard(phoneNumber)}
                >
                  <Text style={styles.detailInfo2BtnText, styles.detailInfo2BtnGrayText}>{phoneNumber}</Text>            
                  <ImgDomain fileWidth={10} fileName={'icon_copy.png'}/>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : null}


        {accessType == 'social' ? (
          <View>
            {write_type == 1 ? (
              //소셜에서 호스트가 게스트 프로필로 들어왔을 때
              <>
                {curr_state == 1 ? (
                <View style={styles.detailInfo2}>                    
                  <View style={styles.detailInfo2TextBox}>
                    <Text style={styles.detailInfo2Text}>최종 참여를 초대 하시겠습니까?</Text>
                  </View>
                  <View style={[styles.pointBox, styles.mgt20]}>
                    <ImgDomain fileWidth={24} fileName={'coin.png'}/>
                    <Text style={styles.pointBoxText}>20</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.nextBtn, styles.mgt20]}
                    activeOpacity={opacityVal}
                    onPress={() => {                                 
                      if(memberPoint < 20){
                        setCashType(4);
                        setCashPop(true);
                      }else{
                        setSocialType(2);
                        setSocialPop(true);
                      }
                    }}
                  >
                    <Text style={styles.nextBtnText}>초대하기</Text>
                  </TouchableOpacity>         
                </View>
                ) : null}

                {curr_state == 3 ? (
                <View style={styles.detailInfo2}>
                  <View style={styles.detailInfo2TextBox}>
                    <Text style={styles.detailInfo2Text}>최종 참여를 수락 하시겠습니까?</Text>
                  </View>
                  <View style={[styles.pointBox, styles.mgt20]}>
                    <ImgDomain fileWidth={24} fileName={'coin.png'}/>
                    <Text style={styles.pointBoxText}>5</Text>
                  </View>
                  <View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.popBtnBoxFlex2]}>
                    <TouchableOpacity 
                      style={[styles.popBtn, styles.popBtn3]}
                      activeOpacity={opacityVal}
                      onPress={() => {                                          
                        if(memberPoint < 5){
                          setCashType(6);
                          setCashPop(true);
                        }else{
                          setSocialType(1);
                          setSocialPop2(true);
                        }
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
                ) : null}

                {curr_state == 5 ? (
                <View style={styles.detailInfo2}>
                  <View style={styles.detailInfo2TextBox}>
                    <Text style={styles.detailInfo2Text}>최종 초대를 전송 했어요</Text>
                    <Text style={styles.detailInfo2Text3}>응답을 기다려주세요!</Text>
                  </View>
                </View>
                ) : null}

                {curr_state == 2 ? (
                  <View style={styles.detailInfo2}>
                    <View style={styles.detailInfo2TextBox}>
                      <View style={styles.textFlex}>
                        <Text style={styles.detailInfo2Text}>소셜룸에 참여하지 못했어요</Text>
                        <ImgDomain fileWidth={20} fileName={'emiticon4.png'}/>
                      </View>
                      <Text style={styles.detailInfo2Text3}>다른 소셜룸을 만나보세요!</Text>
                    </View>
                  </View>
                ) : null}
              </>
            ) : null}

            {write_type == 2 ? ( 
              //소셜에서 게스트가 호스트 프로필로 들어왔을 때              
              <>
                {curr_state == 1 ? (
                <View style={styles.detailInfo2}>
                  <View style={styles.detailInfo2TextBox}>
                    <Text style={styles.detailInfo2Text}>최종 참여를 신청 하시겠습니까?</Text>
                  </View>
                  <View style={[styles.pointBox, styles.mgt20]}> 
                    <ImgDomain fileWidth={24} fileName={'coin.png'}/>
                    <Text style={styles.pointBoxText}>20</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.nextBtn, styles.mgt20]}
                    activeOpacity={opacityVal}
                    onPress={() => {
                      if(memberPoint < 20){
                        setCashType(5);
                        setCashPop(true);
                      }else{
                        setSocialType(1);
                        setSocialPop(true);
                      }
                    }}
                  >
                    <Text style={styles.nextBtnText}>신청하기</Text>
                  </TouchableOpacity>
                </View>
                ) : null}

                {curr_state == 3 ? (
                <View style={styles.detailInfo2}>
                  <View style={styles.detailInfo2TextBox}>
                    <Text style={styles.detailInfo2Text}>최종 참여를 신청 했어요</Text>
                    <Text style={styles.detailInfo2Text3}>응답을 기다려주세요!</Text>
                  </View>
                </View>
                ) : null}

                {curr_state == 5 ? (
                <View style={styles.detailInfo2}>
                  <View style={styles.detailInfo2TextBox}>
                    <Text style={styles.detailInfo2Text}>최종 참여를 수락 하시겠습니까?</Text>
                  </View>
                  <View style={[styles.pointBox, styles.mgt20]}>
                    <ImgDomain fileWidth={24} fileName={'coin.png'}/>
                    <Text style={styles.pointBoxText}>5</Text>
                  </View>
                  <View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.popBtnBoxFlex2]}>
                    <TouchableOpacity 
                      style={[styles.popBtn, styles.popBtn3]}
                      activeOpacity={opacityVal}
                      onPress={() => {                    
                        if(memberPoint < 5){
                          setCashType(6);
                          setCashPop(true);
                        }else{
                          setSocialType(1);
                          setSocialPop2(true);
                        }
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
                ) : null}

                {curr_state == 2 ? (
                  <View style={styles.detailInfo2}>
                    <View style={styles.detailInfo2TextBox}>
                      <View style={styles.textFlex}>
                        <Text style={styles.detailInfo2Text}>소셜룸에 참여하지 못했어요</Text>
                        <ImgDomain fileWidth={20} fileName={'emiticon4.png'}/>
                      </View>
                      <Text style={styles.detailInfo2Text3}>다른 소셜룸을 만나보세요!</Text>
                    </View>
                  </View>
                ) : null}
              </>
            ) : null} 
            
          </View>
        ) : null}

        
        {accessType == 'community' ? (
          <View>            
            {/* 커뮤니티 - 번호 교환 수락(양쪽 모두 신청하지 않은 상황) */}
            {curr_state == 1 ? (
            <View style={styles.detailInfo2}>
              <View style={styles.detailInfo2TextBox}>
                <Text style={styles.detailInfo2Text}>번호를 교환 하시겠습니까?</Text>
              </View>
              <View style={[styles.pointBox, styles.mgt20]}>            
                <ImgDomain fileWidth={24} fileName={'coin.png'}/>
                <Text style={styles.pointBoxText}>20</Text>
              </View>
              <TouchableOpacity 
                style={[styles.nextBtn, styles.mgt20]}
                activeOpacity={opacityVal}
                onPress={() => {
                  if(memberPoint < 20){
                    setCashType(1);
                    setCashPop(true);
                  }else{
                    setNumberTradePop2(true);
                  }
                }}
              >
                <Text style={styles.nextBtnText}>번호 교환 신청하기</Text>
              </TouchableOpacity> 
            </View>
            ) : null}

            {/* 커뮤니티 - 번호 교환 수락(한 쪽이 신청한 상황) */}
            {curr_state == 2 ? (
            <View style={styles.detailInfo2}>
              {curr_req_mb_idx == memberIdx ? (
                <View style={styles.detailInfo2TextBox}>
                  <Text style={styles.detailInfo2Text}>번호 교환을 신청했어요</Text>
                  <Text style={styles.detailInfo2Text3}>응답을 기다려주세요!</Text>
                </View>
              ) : null}

              {curr_rec_mb_idx == memberIdx ? (
                <>
                  <View style={styles.detailInfo2TextBox}>
                    <Text style={styles.detailInfo2Text}>번호 교환을 수락하시겠습니까?</Text>
                  </View>
                  <View style={[styles.pointBox, styles.mgt20]}>            
                    <ImgDomain fileWidth={24} fileName={'coin.png'}/>
                    <Text style={styles.pointBoxText}>5</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.nextBtn, styles.mgt20]}
                    activeOpacity={opacityVal}
                    onPress={() => {
                      if(memberPoint < 5){
                        setCashType(1);
                        setCashPop(true);
                      }else{
                        setNumberTradePop(true);
                      }
                    }}
                  >
                    <Text style={styles.nextBtnText}>수락</Text>
                  </TouchableOpacity> 
                </>
              ) : null}
              
            </View>
            ) : null}

            {curr_state == 3 ? (
              <View style={styles.detailInfo2}>
                <TouchableOpacity
                  style={[styles.detailInfo2Btn, styles.detailInfo2BtnGray]}
                  activeOpacity={opacityVal}
                  onPress={() => copyToClipboard(phoneNumber)}
                >
                  <Text style={styles.detailInfo2BtnText, styles.detailInfo2BtnGrayText}>{phoneNumber}</Text>            
                  <ImgDomain fileWidth={10} fileName={'icon_copy.png'}/>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : null}
        
        <View style={styles.border}></View>

        <View style={[styles.detailInfoCm]}>
          <View style={styles.cmTitle}>
            <Text style={styles.cmTitleText}>Physical</Text>
          </View>
          <View style={styles.physicalBox1}>
            <View style={styles.physicalBox1Cont}>
              <Text style={styles.physicalBox1ContText1}>키</Text>
              {profileInfo?.info.member_height != 0 ? (
                <Text style={styles.physicalBox1ContText2}>{profileInfo?.info.member_height} cm</Text>
              ) : null}
            </View>
            <View style={styles.physicalBox1Cont}>
              <Text style={styles.physicalBox1ContText1}>몸무게</Text>
              {profileInfo?.info.member_weight != 0 ? (
                <Text style={styles.physicalBox1ContText2}>{profileInfo?.info.member_weight} kg</Text>
              ) : (
                <Text style={styles.physicalBox1ContText2}>비공개</Text>
              )}
              
            </View>
            <View style={styles.physicalBox1Cont}>
              <Text style={styles.physicalBox1ContText1}>체지방률</Text>
              {profileInfo?.info.member_fat != 0 ? (
                <Text style={styles.physicalBox1ContText2}>{profileInfo?.info.member_fat} %</Text>
              ) : (
                <Text style={styles.physicalBox1ContText2}>비공개</Text>
              )}
            </View>
            <View style={styles.physicalBox1Cont}>
              <Text style={styles.physicalBox1ContText1}>골격근량</Text>
              {profileInfo?.info.member_muscle != 0 ? (
                <Text style={styles.physicalBox1ContText2}>{profileInfo?.info.member_muscle} kg</Text>
              ) : (
                <Text style={styles.physicalBox1ContText2}>비공개</Text>
              )}
            </View>
          </View>

          <View style={styles.physicalBox2}>
            {profilePhysical.map((item, index) => {
              return (
                <View key={index} style={styles.physicalBox2Tab}>
                  <Text style={styles.physicalBox2TabText}>{item}</Text>
                </View>
              )
            })}
          </View>

          
          <View style={styles.cmInfoBox}>
            <ImgDomain fileWidth={32} fileName={'icon_cont_muscle.png'}/>
            <View style={styles.cmInfoBoxCont}>
              <View style={styles.cmInfoBoxContTit}>
                <Text style={styles.cmInfoBoxContTitText}>운동</Text>
              </View>
              {profileInfo?.exercise.length > 0 ? (
                <View style={styles.cmInfoBoxContUl}>
                  {profileInfo?.exercise.map((item, index) => {
                    let cycleString = '';
                    if(item.me_cycle == 0){
                      cycleString = '주';
                    }else{
                      cycleString = '월';
                    }
                    return (
                      <View key={index} style={styles.cmInfoBoxContLi}>
                        <Text style={styles.cmInfoBoxContWrapText}>매{cycleString} {item.me_count}일 <Text style={styles.bold}>{item.me_name}</Text>을(를) 해요</Text>
                      </View>
                    )
                  })}
                </View>
              ) : (
                <View style={styles.cmInfoBoxContUl}>
                  <View style={styles.cmInfoBoxContLi}>
                    <Text style={styles.cmInfoBoxContWrapText}>쉬고 있어요</Text>
                  </View>
                </View>
              )}
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
                  <Text style={[styles.cmInfoBoxContWrapText2, styles.bold]}>{profileInfo?.info.member_main_local}</Text>
                </View>
                {profileInfo?.info.member_sub_local ? (
                <View style={[styles.cmInfoBoxContLi]}>
                  <Text style={styles.cmInfoBoxContWrapText}>부 활동 지역 :</Text>
                  <Text style={[styles.cmInfoBoxContWrapText2, styles.bold]}>{profileInfo?.info.member_sub_local}</Text>
                </View>
                ) : null}
              </View>
            </View>
          </View>

          <View style={[styles.cmInfoBox]}>            
            <ImgDomain fileWidth={32} fileName={'icon_cont_job.png'}/>
            <View style={styles.cmInfoBoxCont}>
              <View style={styles.cmInfoBoxContTit}>
                <Text style={styles.cmInfoBoxContTitText}>직업</Text>       
                {profileJob ? (
                <View style={styles.certIcon}>
                  <ImgDomain fileWidth={12} fileName={'icon_cert.png'} />
                </View>
                ) : null}
              </View>              
              <View style={styles.cmInfoBoxContUl}>
                <View style={[styles.cmInfoBoxContLi]}>
                  <Text style={[styles.cmInfoBoxContWrapText, styles.bold]}>{profileInfo?.info.member_job}</Text>
                  <Text style={[styles.cmInfoBoxContWrapText2]}>{profileInfo?.info.member_job_detail}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.cmInfoBox]}>
            <ImgDomain fileWidth={32} fileName={'icon_cont_school.png'} />
            <View style={styles.cmInfoBoxCont}>
              <View style={styles.cmInfoBoxContTit}>
                <Text style={styles.cmInfoBoxContTitText}>학력</Text>
                {profileSchool ? (
                <View style={styles.certIcon}>
                  <ImgDomain fileWidth={12} fileName={'icon_cert.png'} />
                </View>
                ) : null}
              </View>              
              <View style={styles.cmInfoBoxContUl}>
                <View style={[styles.cmInfoBoxContLi]}>
                  <Text style={[styles.cmInfoBoxContWrapText, styles.bold]}>{profileSchool?.mpa_info1}{profileInfo?.info.member_education} {profileInfo?.info.member_education_status}</Text>
                  {profileSchool?.mpa_info2 != '' ? (
                  <Text style={[styles.cmInfoBoxContWrapText2]}>{profileSchool?.mpa_info2} 전공</Text>
                  ) : null}
                </View>
              </View>              
            </View>
          </View>

          <TouchableOpacity
            style={styles.valuesBtn}
            activeOpacity={opacityVal}
            onPress={() => {                     
              if(profileInfo?.info.member_idx == memberIdx && profileInfo?.info.is_my_love == 'y'){
                setValuesPop(true);
              }else if(profileInfo?.info.is_my_love == 'n'){
                //나의 연애관 입력 유도 팝업
                setValuesDisable(true);
              }else if(profileInfo?.info.is_user_love == 'n'){
                ToastMessage(`${profileInfo?.info.member_nick}님이 아직 등록하지 않았어요`);
              }else{
                //상세 프로필 오픈 컨펌
                if(memberPoint < 5){
                  setCashType(3);
                  setCashPop(true);
                  setSotongPop(false);
                }else{
                  setValuesConfirm(true);
                }
              }
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
                  <View style={[styles.cmInfoBoxContLi, styles.cmInfoBoxHalf]}>
                    <Text style={[styles.cmInfoBoxContWrapText]}>{profileMbti}</Text>
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
                  <View style={[styles.cmInfoBoxContLi, styles.cmInfoBoxHalf]}>
                    <Text style={[styles.cmInfoBoxContWrapText]}>{profileRel}</Text>
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
                  <View style={[styles.cmInfoBoxContLi, styles.cmInfoBoxHalf]}>
                    <Text style={[styles.cmInfoBoxContWrapText]}>{profileDrink}</Text>
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
                  <View style={[styles.cmInfoBoxContLi, styles.cmInfoBoxHalf]}>
                    <Text style={[styles.cmInfoBoxContWrapText]}>{profileSmoke} {profileSmokeType}</Text>
                  </View>
                </View>              
              </View>
            </View>

            {profileMarry ? (
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
                  <View style={[styles.cmInfoBoxContLi, styles.cmInfoBoxHalf]}>
                    <Text style={[styles.cmInfoBoxContWrapText]}>{profileMarry?.mpa_info1}</Text>
                  </View>
                </View>              
              </View>
            </View>
            ) : null}
          </View>

          <View style={styles.myIntroCont}>
            <Text style={styles.myIntroContText}>{profileInfo?.info.member_intro}</Text>
          </View>
        </View>

        {profileInterview.length > 0 ? (
          <>
            <View style={styles.border}></View>
            <View style={[styles.detailInfoCm]}>
              {profileInterview.map((item, index) => {
                return (
                  <View key={index} style={[styles.detailQnaBox, index == 0 ? styles.mgt0 : styles.mgt30]}>
                    <View style={[styles.cmInfoBox, styles.mgt0]}>
                      <ImgDomain fileWidth={32} fileName={'icon_cont_qna.png'} />
                      <View style={styles.cmInfoBoxCont}>
                        <View style={styles.cmInfoBoxContTit}>
                          <Text style={styles.cmInfoBoxContTitText}>{item.mi_subject}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.myIntroCont, styles.mgt10]}>
                      <Text style={styles.myIntroContText}>{item.mi_content}</Text>
                    </View>
                  </View>
                )
              })}            
            </View>
          </>
        ) : null}

        {profileHobby.length > 0 ? (
          <>
          <View style={styles.border}></View>

          <View style={[styles.detailInfoCm, styles.detailInfoCm2]}>
            <View style={styles.cmTitle}>
              <Text style={styles.cmTitleText}>Interest</Text>
            </View>
            {profileHobby.map((item, index) => {
              const hobbySplt = item.hk_names.split('|');
              return (
                <View key={index} style={[styles.detailInterestBox, index == 0 ? styles.mgt0 : styles.mgt20]}>
                  <View style={[styles.cmInfoBoxContTit, styles.mgb10]}>
                    <Text style={styles.cmInfoBoxContTitText}>{item.hc_name}</Text>
                  </View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator = {false}
                    onMomentumScrollEnd ={() => {}}
                  >
                    {hobbySplt.map((item2, index2) => {
                      return (
                        <View key={index2} style={[styles.interestKeyword, index2 == 0 ? styles.mgl0 : null]}>
                        <Text style={styles.interestKeywordText}>#{item2}</Text>
                      </View>
                      )
                    })}
                  </ScrollView>
                </View>
              )
            })}
          </View>
          </>
        ) : null}
         
        {/* 매칭된 사람에게 또는 평가를 한 사람에게 별점 숨김 처리 */}
        {reviewState && profileInfo?.info.member_idx != memberIdx ? (
          <>
          <View style={styles.border}></View>
          <View style={[styles.detailInfoCm, styles.detailInfoCm3]}>
            <View style={styles.reviewTitle}>
              <Text style={styles.reviewTitleText}>{profileInfo?.info.member_nick}님은 어떠셨어요?</Text>
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

      {profileInfo?.like_yn == 'y' && profileInfo?.info.member_idx != memberIdx ? (
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
      ) : null}

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
                      onPress={() => setReport(item.rr_content)}
                    >
                      <Text style={styles.reportRadioBtnText}>{item.rr_content}</Text>
                      {report == item.rr_content ? (                        
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
      
      {/* 리뷰 점수 팝업 */}
			<Modal
				visible={reviewPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => scoreOff()}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>scoreOff()}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => scoreOff()}
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
              {profileInfo?.feel_yn == 'y' ? (
              <TouchableOpacity
                style={[styles.sotongBtn]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  if(memberPoint < 10000000){
                    setCashType(1);
                    setCashPop(true);
                    setSotongPop(false);
                  }else{
                    sotongSend('호감을', 1, 'feel');
                    setSendPop(true);
                  }                  
                }}
              >
                <Text style={styles.sotongBtnText}>호감</Text>
                <ImgDomain fileWidth={24} fileName={'coin.png'} />
                <Text style={styles.sotongBtnText2}>1</Text>
              </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={styles.sotongBtn}
                activeOpacity={opacityVal}
                onPress={()=>{
                  if(memberPoint < 10){
                    setCashType(1);
                    setCashPop(true);
                    setSotongPop(false);
                  }else{
                    sotongSend('좋아요를', 10, 'like');
                    setSendPop(true);
                  }                   
                }}
              >
                <Text style={styles.sotongBtnText}>좋아요</Text>
                <ImgDomain fileWidth={24} fileName={'coin.png'} />
                <Text style={styles.sotongBtnText2}>10</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sotongBtn}
                activeOpacity={opacityVal}
                onPress={()=>{                  
                  if(memberPoint < 15){
                    setCashType(1);
                    setCashPop(true);
                    setSotongPop(false);
                  }else{
                    setPreLikePop(true);
                    setSotongPop(false);
                  }
                }}
              >
                <Text style={styles.sotongBtnText}>프리미엄</Text>
                <ImgDomain fileWidth={24} fileName={'coin.png'} />
                <Text style={styles.sotongBtnText2}>15</Text>
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
								onPress={() => submitSotong()}
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
              <ImgDomain2 fileWidth={100} fileName={profileImg} />
            </View>
          </View>
          <View style={[styles.popTitle, styles.pdl20, styles.pdr20]}>
            {cashType == 1 ? (
            <>
						<Text style={[styles.popBotTitleText, styles.popBotTitleTextLine]}>{profileInfo.info.member_nick}님을 놓치지 마세요!</Text>							
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

            {cashType == 5 ? (
              <>
              <Text style={[styles.popBotTitleText, styles.popBotTitleTextLine]}>즐거운 만남에 신청하세요!</Text>							
              <Text style={[styles.popBotTitleDesc]}>프로틴을 구매해 즉시 신청할 수 있어요</Text>
              </>
            ) : null}

            {cashType == 6 ? (
              <>
              <Text style={[styles.popBotTitleText, styles.popBotTitleTextLine]}>즐거운 만남에 수락하세요!</Text>							
              <Text style={[styles.popBotTitleDesc]}>프로틴을 구매해 즉시 수락할 수 있어요</Text>
              </>
            ) : null}
					</View>					
					<View style={styles.productList}>
            <FlatList
              data={productApiList}
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
            <View style={styles.popTitleFlexWrap}>
              <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>매칭을 축하합니다!</Text>
            </View>            
          </View>
          <View style={styles.popInImageView}>
            <View style={styles.popInImageViewBox}>
              <ImgDomain2 fileWidth={100} fileName={profileImg} />
            </View>
            <View style={styles.popInImageNick}>
              <Text style={styles.popInImageNickText}>{profileInfo?.info.member_nick}</Text>
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
              <Text style={styles.newProteinCntText}>신규 회원에게 프로틴 <Text style={styles.bold}>{registPoint}</Text>개 증정</Text>
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
							<Text style={styles.pointBoxText}>30</Text>
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
								onPress={() => openPhonenumber()}
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
							<Text style={styles.pointBoxText}>5</Text>
						</View>						
						<View style={[styles.popBtnBox]}>
              <TouchableOpacity 
                style={[styles.popBtn]}
                activeOpacity={opacityVal}
                onPress={() => openSubProfile()}
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
                  setValuesDisable(false);                  
                  setTimeout(function(){
                    navigation.navigate('MyDate');
                  }, 100);                  
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
            {profileDateQna.map((item, index) => {
              return (
                <View key={index} style={[index == 0 ? styles.mgt40 : styles.mgt50]}>
                  <View>
                    <View style={styles.valueTitle}>
                      <Text style={styles.valueTitleText}>{item.title}</Text>
                    </View>
                    {item.data.map((item2, index2) => {
                      return (
                        <View key={index2} style={[index2 != 0 ? styles.mgt30 : null]}>
                          <View style={styles.valueQuestion}>
                          {item2.question.is_multi == 'y' ? (
                            <Text style={styles.valueQuestionText}>													
                              <Text style={styles.roboto}>Q{index2+1}.</Text> {item2.question.lq_content} (다중선택)
                            </Text>
                            ) : (
                              <Text style={styles.valueQuestionText}>
                                <Text style={styles.roboto}>Q{index2+1}.</Text> {item2.question.lq_content}																											
                              </Text>
                            )}
                          </View>   
                          <View style={styles.valueAnswer}>
                            {item2.answer.map((item3, index3) => {
                              return (
                                <TouchableOpacity
                                  key={index3}
                                  style={[styles.valueAnswerBtn, styles.boxShadow3, index3 == 0 ? styles.mgt0 : null, item3.is_chk == 'y' ? styles.boxShadow4 : null]}
                                  activeOpacity={1}
                                >
                                  <Text style={[styles.valueAnswerBtnText, item3.is_chk == 'y' ? styles.valueAnswerBtnTextOn : null]}>{item3.la_content}</Text>
                                </TouchableOpacity>
                              )
                            })}													
                          </View>  
                        </View>
                      )
                    })}								              									              
                  </View>
                </View>
              )
            })}            
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
							<Text style={styles.pointBoxText}>20</Text>
						</View>

            <View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => setSocialPop(false)}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => lastJoinSocial()}
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

            <View style={[styles.pointBox, styles.mgt20]}>
              <ImgDomain fileWidth={24} fileName={'coin.png'} />
							<Text style={styles.pointBoxText}>5</Text>
						</View>

            <View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
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
								onPress={() => lastPermitSocial()}
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
            <View style={[styles.pointBox, styles.mgt20]}>
              <ImgDomain fileWidth={24} fileName={'coin.png'} />
              <Text style={styles.pointBoxText}>5</Text>
            </View>
            <View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
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
								onPress={() => permitTradeProfile()}
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
              <Text style={styles.pointBoxText}>20</Text>
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
								onPress={() => changeTradeProfile()}
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
  
	swiperView: {height:widnowWidth*1.25,position:'relative'},
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

  detailInfo2: {paddingHorizontal:20,paddingBottom:30,alignItems:'center',},
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
  cmInfoBoxHalf: {width:(innerWidth/2)-52,},
  cmInfoBoxContWrapText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#1E1E1E'},
  cmInfoBoxContWrapText2: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#1E1E1E',marginLeft:8},

  physicalBox1: {flexDirection:'row',justifyContent:'space-between',},
  physicalBox1Cont: {width:(innerWidth/4)-7.5,alignItems:'center',padding:8,backgroundColor:'#F9FAFB',borderRadius:5,},
  physicalBox1ContText1: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#1E1E1E'},
  physicalBox1ContText2: {fontFamily:Font.RobotoMedium,fontSize:13,lineHeight:15,color:'#1E1E1E',marginTop:6},
  physicalBox2: {flexDirection:'row',flexWrap:'wrap',marginTop:12,},
  physicalBox2Tab: {justifyContent:'center',height:33,paddingHorizontal:14,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:50,marginRight:8,marginTop:8,},
  physicalBox2TabText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:18,color:'#1e1e1e'},

  valuesBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',height:52,backgroundColor:'#243B55',borderRadius:5,marginTop:40,},
  valuesBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#fff',marginRight:6,},

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
  textarea: {width:innerWidth-40,height:141,paddingVertical:0,paddingTop:15,paddingHorizontal:15,borderWidth:1,borderColor:'#EDEDED',borderRadius:5,textAlignVertical:'top',fontFamily:Font.NotoSansRegular,fontSize:14,color:'#1e1e1e',paddingTop:paddTop,},

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
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

  prvPopBot: {width:widnowWidth,maxHeight:innerHeight,paddingTop:40,paddingBottom:10,paddingHorizontal:20,backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,position:'absolute',bottom:0,},
	prvPopBot2: {width:widnowWidth,position:'absolute',bottom:0,},
  prvPopBot3: {paddingHorizontal:0,},
	popBotTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:20,lineHeight:25,color:'#1e1e1e',},
  popBotTitleTextLine: {},
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
	productText1: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:22,color:'#1e1e1e'},
	productBest: {height:20,paddingHorizontal:8,borderRadius:20,marginTop:5,},
	productBest2: {backgroundColor:'#FFBF1A',},
	productText2: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:18,color:'#fff'},
	productText3: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#666',marginTop:3,},
	productText3On: {color:'#1e1e1e'},
	productText4: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:5,},

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

  paginationContainer: {width:widnowWidth,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,position:'absolute',left:0,bottom:20,zIndex:10,},
  paginationDot: {width:10,height:4,backgroundColor:'#fff',borderRadius:50,opacity:0.3,margin:0,marginHorizontal:0},
  paginationDotActive: {width:20,opacity:1},

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
  mgr0: {marginRight:0,},
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