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

import APIs from '../../assets/APIs';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';
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
  const {navigation, userInfo, route} = props;
  const {params} = route
  const social_idx = params['social_idx'];
  const host_sex = params['social_host_sex'];
  const paramsString = JSON.stringify({social_idx:social_idx, social_host_sex:host_sex});
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
  const [loading2, setLoading2] = useState(false);
  const [dotPop, setDotPop] = useState(false);
  const [leavePop, setLeavePop] = useState(false);
  const [leavePopText, setLeavePopText] = useState('');
  const [orderPop, setOrderPop] = useState(false);
  const [warnPop, setWarnPop] = useState(false);
  const [readyPop, setReadyPop] = useState(false);
  const [miniProfilePop, setMiniProfilePop] = useState(false);
  const [bigImgPop, setBigImgPop] = useState(false);
  const [reportPop, setReportPop] = useState(false);
  const [cashPop, setCashPop] = useState(false);
  const [prdIdx, setPrdIdx] = useState(1);
  const [skuCode, setSkuCode] = useState();
  const [socialPop, setSocialPop] = useState(false);
  const [socialPop2, setSocialPop2] = useState(false);
  const [blockPop, setBlockPop] = useState(false);
  const [fullPop, setFullPop] = useState(false);
  const [fullPop2, setFullPop2] = useState(false);
  const [fullPop3, setFullPop3] = useState(false);
  const [focusState, setFocusState] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [productApiList, setProductApiList] = useState([]);
  const [productInappList, setProductInappList] = useState([]);
  const [platformData, setPlatformData] = useState(null);

  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout2, setLayout2] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [layout3, setLayout3] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const [deleteState, setDeleteState] = useState(false); //글 삭제 여부
  const [userType, setUserType] = useState(); //1=>호스트, 2=>게스트
  const [writerIdx, setWriteIdx] = useState();
  const [useStatus, setUseStatus] = useState(true); //match_yn 이 y 라면 false
  const [nick, setNick] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');  
  const [dateDiff, setDateDiff] = useState('');
  const [datetime, setDatetime] = useState('');
  const [subject, setSubject] = useState('');
  const [meetDate, setMeetDate] = useState('');
  const [meetLocal, setMeetLocal] = useState('');
  const [meetCate, setMeetCate] = useState('');
  const [meetCnt, setMeetCnt] = useState('');
  const [meetManCnt, setMeetManCnt] = useState('');
  const [meetWomanCnt, setMeetWomanCnt] = useState('');

  const [content, setContent] = useState('');
  const [reviewType, setReviewType] = useState(0); //0=>댓글, 1=>대댓글
  const [reviewCont, setReviewCont] = useState('');
  const [orderChg, setOrderChg] = useState(0); //0=>끌어올리기 한 적 없음(무료), 1=>끌어올리기 한 적 있음(유료), 2=>포인트 부족
  const [miniChg, setMiniChg] = useState(0); //0=>포인트 있음, 1=>포인트 부족
  const [report, setReport] = useState('');
  const [reportEtc, setReportEtc] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportMemberIdx, setReportMemberIdx] = useState();
  const [reportBoardIdx, setReportBoardIdx] = useState();  
  const [bookSt, setBookSt] = useState(false);
  const [profileState, setProfileState] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [profileImg2, setProfileImg2] = useState('');
  const [visualImg, setVisualImg] = useState('');
  const [hostGuest, setHostGuest] = useState('');
  const [guestGuest, setGuestGuest] = useState('');
  const [commentCnt, setCommentCnt] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const [subReviewNick, setSubReivewNick] = useState('');
  const [subReviewIdx, setSubReviewIdx] = useState();
  const [pbIdx, setPbIdx] = useState();
  const [manCnt, setManCnt] = useState(0);
  const [womanCnt, setWomanCnt] = useState(0);
  const [confirmManCnt, setConfirmManCnt] = useState(0);
  const [confirmWomanCnt, setConfirmWomanCnt] = useState(0);
  const [sjIdx, setSjIdx] = useState();
  const [diffDate, setDiffDate] = useState();
  const [joinAv, setJoinAv] = useState(0);

  const [reqList, setReqList] = useState([]);
  const [acceptList, setAcceptList] = useState([]);
  const [joinList, setJoinList] = useState([]);
  
  const [memberIdx, setMemberIdx] = useState();
  const [memberInfo, setMemberInfo] = useState({});
  const [memberPoint, setMemberPoint] = useState();
  const [guestPartyState, setGuestPartyState] = useState();  

  const [miniUserIdx, setMiniUserIdx] = useState();
  const [miniUserImg, setMiniUserImg] = useState('');

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
      
		}else{
			//console.log("isFocused");
			setRouteLoad(true);
			setPageSt(!pageSt);

      AsyncStorage.getItem('member_idx', (err, result) => {		        
				setMemberIdx(result);
			});

      //console.log('social_idx :::: ',social_idx);
      if(memberIdx){
        getSocialDetail();
        getMemberProtain();
      }
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

  useEffect(() => {
    if(memberIdx){
      setLoading(true);
      getMemInfo();
      getSocialDetail(); 
    }
  }, [memberIdx]);

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
            console.log(err);
          })
          .then(() => {
            purchaseUpdateSubscription = purchaseUpdatedListener(async(purchase) => {
              console.log('purchaseUpdatedListener Android', purchase);
              const receipt = purchase.transactionReceipt;

              if(receipt){
                await finishTransaction({purchase, isConsumable: true})
                .catch((error) => {
                  console.log(error)
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

  const getSocialDetail = async () => {
    //console.log('social_idx ::: ', social_idx);
    let sData = {
			basePath: "/api/social/",
			type: "GetSocialDetail",
			member_idx: memberIdx,
      social_idx: social_idx,
		};

		const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      if(response.data.social.is_my_social == 'y'){
        setUserType(1);
        if(response.data.join.request.length > 0){
          //console.log(response.data.join.request);
          setReqList(response.data.join.request);
        }else{
          setReqList([]);
        }
                
        if(response.data.join.accept.length > 0){
          let newAccept = [];
          response.data.join.accept.map((item, index) => {
            let flippedState = true;            
            if(item.report_yn == 'y' || item.leave_yn == 'y' || item.available_yn == 'n' || item.card_yn == 'n'){
              flippedState = false;
            }

            newAccept.push({
              'sj_idx': item.sj_idx,
              'social_idx': item.social_idx,
              'member_idx': item.member_idx,
              'guest_social_nick': item.guest_social_nick,
              'sj_status': item.sj_status,
              'noti_status': item.noti_status,
              'created_at': item.created_at,
              'accepted_at': item.accepted_at,
              'rejected_at': item.rejected_at,
              'requested_at': item.requested_at,
              'confirmed_at': item.confirmed_at,
              'is_expire': item.is_expire,
              'mini_pofile_img': item.mini_pofile_img,
              'main_profile_img': item.main_profile_img,
              'member_age': item.member_age,
              'member_sex': item.member_sex,
              'member_main_local': item.member_main_local,
              'member_height': item.member_height,
              'report_yn': item.report_yn,
              'leave_yn': item.leave_yn,
              'card_yn': item.card_yn,
              'available_yn': item.available_yn,
              'isFlipped':flippedState,
              'dateDiff':item.dateDiff
            });
          })
          setAcceptList(newAccept);
        }else{
          setAcceptList([]);
        }

        if(response.data.join.join.length > 0){
          let newJoin = [];
          response.data.join.join.map((item, index) => {
            let flippedState = true;            
            if(item.report_yn == 'y' || item.leave_yn == 'y' || item.available_yn == 'n' || item.card_yn == 'n'){
              flippedState = false;
            }

            newJoin.push({
              'sj_idx': item.sj_idx,
              'social_idx': item.social_idx,
              'member_idx': item.member_idx,
              'guest_social_nick': item.guest_social_nick,
              'sj_status': item.sj_status,
              'noti_status': item.noti_status,
              'created_at': item.created_at,
              'accepted_at': item.accepted_at,
              'rejected_at': item.rejected_at,
              'requested_at': item.requested_at,
              'confirmed_at': item.confirmed_at,
              'is_expire': item.is_expire,
              'mini_pofile_img': item.mini_pofile_img,
              'main_profile_img': item.main_profile_img,
              'member_age': item.member_age,
              'member_sex': item.member_sex,
              'member_main_local': item.member_main_local,
              'member_height': item.member_height,
              'report_yn': item.report_yn,
              'leave_yn': item.leave_yn,
              'card_yn': item.card_yn,
              'available_yn': item.available_yn,
              'isFlipped':flippedState,
              'dateDiff':item.dateDiff
            });
          })
          setJoinList(newJoin);
        }else{
          setJoinList([]);
        }
      }else{
        setUserType(2);
        if(response.data.join.request[0] == null){
          setGuestPartyState();
        }else{   
          setGuestPartyState(response.data.join.request[0].sj_status);
          setSjIdx(response.data.join.request[0].sj_idx);
        }
      }

      if(response.data.img[0] == undefined){
        setVisualImg('');
      }else{
        setVisualImg(response.data.img[0].si_img);
      }

      setProfileImg2(response.data.social.host_profile_img);

      if(response.data.social.mini_profile_img){
        setProfileState(1);
        setProfileImg(response.data.social.mini_profile_img);        
      }else{
        setProfileState(0);
        if(host_sex == 0){
          setProfileImg('profile_sample.png');
        }else if(host_sex == 1){
          setProfileImg('profile_sample2.png');
        }
      }

      if(response.data.social.is_bookmark == 'y'){
        setBookSt(true);
      }else{
        setBookSt(false);
      }

      setUseStatus(response.data.social.match_yn);
      setPbIdx(response.data.social.pb_idx);
      setWriteIdx(response.data.social.member_idx);
      setNick(response.data.social.host_social_nick);
      setAge(response.data.social.host_social_age);      
      setHeight(response.data.social.host_height);
      setDateDiff(response.data.social.diff_date);
      setDatetime(response.data.social.AgoTime);
      setSubject(response.data.social.social_subject);
      setMeetDate(response.data.social.social_date_text);      
      setMeetLocal(response.data.social.social_location);      
      setJoinAv(response.joinAv);

      //0=> // 1=>미팅 // 2=>모임
      if(response.data.social.social_type == 0){
        setMeetCate('1:1');
      }else if(response.data.social.social_type == 1){
        setMeetCate('미팅');
        setMeetCnt(response.data.social.social_mcnt+':'+response.data.social.social_wcnt);
        setMeetManCnt(response.data.social.social_mcnt);
        setMeetWomanCnt(response.data.social.social_wcnt);
      }else if(response.data.social.social_type == 2){
        setMeetCate('모임');
        setMeetCnt(response.data.social.social_cnt);
      }

      setManCnt(response.data.social.social_mcnt);
      setWomanCnt(response.data.social.social_wcnt);
      setConfirmManCnt(response.data.social.social_join_mcnt);
      setConfirmWomanCnt(response.data.social.social_join_wcnt);
   
      setContent(response.data.social.social_content);
      setHostGuest(response.data.social.host_guest_yn);
      setGuestGuest(response.data.social.guest_guest_yn);

      //console.log(response.data.comment.length);
      setCommentCnt(response.data.comment.length);
      if(response.data.comment.length > 0){
        setCommentList(response.data.comment);
      }else{
        setCommentList([]);
      }

      if(response.data.social.delete_yn == 'y'){
        setDeleteState(true);
      }      
      
      //0=>끌어올리기 한 적 없음(무료), 1=>끌어올리기 한 적 있음(유료)
      if(response.data.social.is_update == 0){
        setOrderChg(0);
      }else if(response.data.social.is_update > 0){
        setOrderChg(1);
      }      

      setTimeout(() => {
        setLoading(false);
      }, 100); 
    }
  }

  const getReportList = async () => {
    let sData = {
			basePath: "/api/etc/",
			type: "GetReportReasonList",
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

    if(report == 6 && (reportEtc == '' || reportEtc.length < 3)){
      ToastMessage('상세 사유를 3자 이상 입력해 주세요.');
      return false;
    }

    setLoading2(true);
    let sData = {
			basePath: "/api/social/",
			type: "SetReportPost",
      rp_type: reportType,
      member_idx: memberIdx,
      rp_member_idx: reportMemberIdx,
      rp_post_idx: reportBoardIdx,
      rr_idx: report,
      rp_content: reportEtc,
		};
		const response = await APIs.send(sData);
    if(response.code == 200){
      reportPopClose();
      ToastMessage('신고접수가 완료되었습니다.');
      if(reportType == 'social'){
        setTimeout(function(){
          setLoading2(false);
          navigation.navigate('Social', {reload: true});
        } ,300)      
      }else if(reportType == 'socialComment'){
        getSocialDetail();
        setTimeout(() => {
          setLoading2(false);
        }, 200);
      }
    } 
  }

  const reportPopClose = () => {
    setPreventBack(false);
    setReportPop(false);
    setReport('');
    setReportEtc('');
    setReportType('');
    setReportMemberIdx();
    setReportBoardIdx();
  }

  const submitComment = async () => {
    if(memberInfo?.member_type != 1){
      ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
      return false;
    }

    if(reviewCont == ''){
      ToastMessage('댓글 내용을 입력해 주세요.');
      return false;
    }

    let sData2 = {
			basePath: "/api/etc/",
			type: "SetFilter",
      txt: reviewCont,
		};
    const response2 = await APIs.send(sData2);    
    if(response2.code == 400){
      ToastMessage('사용할 수없는 단어를 사용했습니다.\n내용을 다시 입력해 주세요.');
      return false;
    }
    
    Keyboard.dismiss();
    setLoading2(true);
    let sData = {
			basePath: "/api/social/",
			type: "SetSocialComment",
      social_idx: social_idx,
			member_idx: memberIdx,
      sc_type: reviewType,
      sc_content: reviewCont,      
      params:paramsString,
		};

    if(reviewType == 1){
      sData.sc_org_idx = subReviewIdx;
      sData.push_idx = 13;
    }else{
      sData.push_idx = 12;
    }

		const response = await APIs.send(sData);
    console.log(response);
    if(response.code == 200){
      setCommentCnt(response.data.comment.length);
      setCommentList(response.data.comment);
      setReviewCont('');
      setReviewType(0);
      setSubReivewNick('');
      setSubReviewIdx();
      setTimeout(function(){
        setLoading2(false);
        scrollRef.current?.scrollTo({y:layout3.y+10});
      },300);    
    }
  }

  const socialBook = async () => {
    let sData = {};
    if(bookSt){
      sData = {
        basePath: "/api/social/",
        type: "DeletePostBookMark",		
        pb_idx: pbIdx,
      };
    }else{      
      sData = {
        basePath: "/api/social/",
        type: "SetPostBookMark",
        member_idx: memberIdx,
        pb_type: 'social',			
        pb_post_idx: social_idx,
      };
    }

    const response = await APIs.send(sData);
    if(response.code == 200){
      setBookSt(!bookSt);
    }
  }

  const socialUpdate = async () => {
    //추후 끌어올리기 포인트와 회원 포인트 조회 해야함
    
    let sData = {
      basePath: "/api/social/",
      type: "SetSocialUpdate",		
      social_idx: social_idx,
    };
    const response = await APIs.send(sData);
    if(response.code == 200){
      getMemberProtain();
      setOrderChg(1);
      setOrderPop(false);      
      ToastMessage('끌어올리기가 진행되었습니다.');
    }
  }

  const deleteComment = async (idx) => {
    let sData = {
      basePath: "/api/social/",
      type: "DeleteSocialComment",		
      sc_idx: idx,
      member_idx: memberIdx,
      social_idx: social_idx,
    };
    const response = await APIs.send(sData);        
    if(response.code == 200){
      setCommentCnt(response.data.comment.length);
      setCommentList(response.data.comment);
    }
  }

  const deleteSocial = async () => {
    let sData = {
      basePath: "/api/social/",
      type: "DeleteSocial",		
      social_idx: social_idx,
    };
    const response = await APIs.send(sData);
    if(response.code == 200){
      setDotPop(false);
      navigation.navigate('Social', {reload: true});
    }else{
      ToastMessage('잠시후 다시 이용해 주세요.');
    }
  }

  const socialBlock = async () => {
    setBlockPop(false);
    setLoading2(true);
    let sData = {
      basePath: "/api/social/",
      type: "SetReportMember",		
      member_idx: memberIdx,
      rm_member_idx: writerIdx,
    };
    const response = await APIs.send(sData);
    if(response.code == 200){
      setTimeout(function(){
        setLoading2(false);
        navigation.navigate('Social', {reload: true});
      }, 200);
    }else{
      setTimeout(function(){
        setLoading2(false);
        ToastMessage('잠시후 다시 이용해 주세요.');
      }, 200);
    }
  }

  const openReportPop = (rp_type, rp_member_idx, rp_post_idx) => {
    setReportType(rp_type);
    setReportMemberIdx(rp_member_idx);
    setReportBoardIdx(rp_post_idx);
    setReportPop(true);
    setDotPop(false);
    setPreventBack(true);
  }

  const submitParty = async () => {      
    setLoading2(true);
    setSocialPop(false);  
    let sData = {
      basePath: "/api/social/",
      type: "SetSocialJoin",		      
      social_idx: social_idx,
      member_idx: memberIdx,
      push_idx:6,
      params:paramsString,
    };
    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      setGuestPartyState(0);
      getMemberProtain();
      
      setTimeout(function(){
        setLoading2(false);
        ToastMessage('참여 신청이 완료되었습니다.');
      }, 200);
    }else{
      setTimeout(function(){
        setLoading2(false);
        ToastMessage('잠시후 다시 이용해 주세요.');
      }, 200);
    }
  }

  const socialAgree = async () => {    
    setLoading2(true);
    setSocialPop2(false);    
    let sData = {
      basePath: "/api/social/",
      type: "SetSocialState",		      
      sj_idx: sjIdx,
      sj_status: 1,
      member_idx:memberIdx,
      social_idx:social_idx,
      push_idx:7,
      params:paramsString,
    };
    const response = await APIs.send(sData);
    //console.log(response.data.join.accept);
    if(response.code == 200){
      if(response.data.join.request.length > 0){
        setReqList(response.data.join.request);
      }else{
        setReqList([]);
      }
      
      if(response.data.join.accept.length > 0){
        //console.log(response.data.join.accept);
        let newAccept = [];
        response.data.join.accept.map((item, index) => {          
          let flippedState = true;            
          if(item.report_yn == 'y' || item.leave_yn == 'y' || item.available_yn == 'n' || item.card_yn == 'n'){
            flippedState = false;
          }

          newAccept.push({
            'sj_idx': item.sj_idx,
            'social_idx': item.social_idx,
            'member_idx': item.member_idx,
            'guest_social_nick': item.guest_social_nick,
            'sj_status': item.sj_status,
            'noti_status': item.noti_status,
            'created_at': item.created_at,
            'accepted_at': item.accepted_at,
            'rejected_at': item.rejected_at,
            'requested_at': item.requested_at,
            'confirmed_at': item.confirmed_at,
            'is_expire': item.is_expire,
            'mini_pofile_img': item.mini_pofile_img,
            'main_profile_img': item.main_profile_img,
            'member_age': item.member_age,
            'member_sex': item.member_sex,
            'member_main_local': item.member_main_local,
            'member_height': item.member_height,
            'leave_yn': item.leave_yn,
            'card_yn': item.card_yn,
            'available_yn': item.available_yn,
            'isFlipped':flippedState,
            'dateDiff':item.dateDiff
          });
        })
        setAcceptList(newAccept);
      }else{
        setAcceptList([]);
      }

      if(response.data.join.join.length > 0){
        let newJoin = [];
        response.data.join.join.map((item, index) => {
          let flippedState = true;            
          if(item.report_yn == 'y' || item.leave_yn == 'y' || item.available_yn == 'y' || item.card_yn == 'n'){
            flippedState = false;
          }

          newJoin.push({
            'sj_idx': item.sj_idx,
            'social_idx': item.social_idx,
            'member_idx': item.member_idx,
            'guest_social_nick': item.guest_social_nick,
            'sj_status': item.sj_status,
            'noti_status': item.noti_status,
            'created_at': item.created_at,
            'accepted_at': item.accepted_at,
            'rejected_at': item.rejected_at,
            'requested_at': item.requested_at,
            'confirmed_at': item.confirmed_at,
            'is_expire': item.is_expire,
            'mini_pofile_img': item.mini_pofile_img,
            'main_profile_img': item.main_profile_img,
            'member_age': item.member_age,
            'member_sex': item.member_sex,
            'member_main_local': item.member_main_local,
            'member_height': item.member_height,
            'leave_yn': item.leave_yn,
            'card_yn': item.card_yn,
            'available_yn': item.available_yn,
            'isFlipped':flippedState,
            'dateDiff':item.dateDiff
          });
        })
        setJoinList(newJoin);
      }else{
        setJoinList([]);
      }

      setTimeout(function(){
        setLoading2(false);
      }, 200);
    }else{
      setLoading2(false);
      ToastMessage('잠시후 다시 이용해 주세요.');
    }    
  }

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
    }
    
    try {
      await requestPurchase(iapObj)
      .then(async (result) => {
          //console.log('IAP req sub', result);
          if (Platform.OS === 'android'){
            //console.log('dataAndroid', result[0].dataAndroid);
            // can do your API call here to save the purchase details of particular user
            inappPayResult.biling_id = result[0].transactionId;
            inappPayResult.biling_token = result[0].purchaseToken;
            inappPayResult.biling_payment = 'card';            
            inappPayResult.paymented_at = result[0].transactionDate;            
          } else if (Platform.OS === 'ios'){
            //console.log(result);
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
    setLoading2(true);
    setCashPop(false);
    _requestPurchase(skuCode);
    setTimeout(() => { setLoading2(false); }, 3000);
  }

  const setOpenMiniProfile = async () => {
    setMiniProfilePop(false);
    let sData = {
      basePath: "/api/social/",
      type: "OpenMemberProfile",
      member_idx:memberIdx,
      user_idx:miniUserIdx,
      social_idx:social_idx,

    };
    const response = await APIs.send(sData);
    if(response.code == 200){
      if(response.data.join.request.length > 0){
        //console.log(response.data.join.request);
        setReqList(response.data.join.request);
      }else{
        setReqList([]);
      }
      setBigImgPop(true);      
    }else{
      ToastMessage('잠시후 다시 이용해 주세요.');
    }    
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardVerticalOffset+15}
        behavior={behavior}
        style={{flex:1}}
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
              onPress={() => {
                if(memberInfo?.member_type != 1){
									ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
								}else{
									setDotPop(true);
								}                
              }} 
              style={styles.DetailDotBtn} 
              activeOpacity={opacityVal}
              >              
              <ImgDomain fileWidth={24} fileName={'icon_hd_dot.png'}/>
            </TouchableOpacity>

            <View style={styles.viewVisual}>
              <ImgDomain2 fileWidth={widnowWidth} fileName={visualImg}/>
            </View>

            <View style={[styles.cmView, styles.pdt15, styles.pdb30, styles.zindex2000]}>
              <View style={styles.nickArea}>
                <View style={styles.nickView}>
                  <View style={styles.nickViewImg}>
                    {profileState == 1 ? (
                      <ImgDomain2 fileWidth={38} fileName={profileImg}/>
                    ) : (
                      <ImgDomain fileWidth={38} fileName={profileImg}/>
                    )}
                  </View>              
                  <Text style={styles.nickViewText}>{nick} · {age}</Text>
                </View>
                <View style={styles.insertTime}>
                  <Text style={styles.insertTimeText}>{datetime}</Text>
                </View>
              </View>

              <View style={styles.viewSubject}>
                <View style={[styles.viewSubjectArea, userType == 1 ? styles.viewSubjectArea2 : null]}>
                  <Text style={styles.viewSubjectText}>{subject}</Text>
                </View>
                {userType == 2 ? (
                  <TouchableOpacity
                    style={styles.viewBookBtn}
                    activeOpacity={opacityVal}
                    onPress={()=>{
                      socialBook()
                      //setCashPop(true);
                    }}
                  >
                    {bookSt ? (
                      <ImgDomain fileWidth={18} fileName={'icon_zzim_on.png'}/>
                    ): (
                      <ImgDomain fileWidth={18} fileName={'icon_zzim_off.png'}/>
                    )}                    
                  </TouchableOpacity>
                ) : null}
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

              <View style={[styles.viewSubInfo4, styles.zindex2000]}>
                
                  <View style={[styles.viewSubInfo4List, styles.zindex2000]}>                  
                    {hostGuest == 'y' ? (
                      <>
                        <ImgDomain fileWidth={20} fileName={'icon_power_o.png'}/>
                        <Text style={styles.viewSubInfo4ListText}>호스트의 동성 지인도 참여하는 모임이에요</Text>
                      </>
                    ) : null}
                    
                    {hostGuest == 'n' ? (
                      <>
                        <ImgDomain fileWidth={20} fileName={'icon_power_x.png'}/>
                        <Text style={styles.viewSubInfo4ListText}>호스트의 지인이 없는 방이에요</Text>
                      </>
                    ) : null}
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
                  {guestGuest == 'y' ? (
                    <>
                      <ImgDomain fileWidth={20} fileName={'icon_power_o.png'}/>
                      <Text style={styles.viewSubInfo4ListText}>게스트의 동성 지인도 참여 신청이 가능해요</Text>
                    </>
                  ) : null}

                  {guestGuest == 'n' ? (
                    <>
                      <ImgDomain fileWidth={20} fileName={'icon_power_x.png'}/>
                      <Text style={styles.viewSubInfo4ListText}>게스트의 지인 참여는 불가해요</Text>
                    </>
                  ) : null}
                </View>
              </View>
                  
              {userType == 2 && !guestPartyState && guestPartyState != 0 ? (
                <>
                <View style={styles.mgt30}>
                  <TouchableOpacity 
                    style={[styles.nextBtn]}
                    activeOpacity={opacityVal}
                    onPress={() => {
                      if(memberInfo?.member_type != 1){
                        ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
                      }else{
                        // let joinAv = false;
                        // if(meetCate == '미팅'){
                        //   if(memberInfo?.member_sex == 0){ 
                        //     if(meetManCnt > confirmManCnt){
                        //       joinAv = true;
                        //     }else{
                        //       joinAv = false;
                        //     }
                        //   }else if(memberInfo?.member_sex == 1){
                        //     if(meetWomanCnt > confirmWomanCnt){
                        //       joinAv = true;
                        //     }else{
                        //       joinAv = false;
                        //     }
                        //   }
                        // }else if(meetCate == '모임'){
                        //   console.log(meetCate,' ::: ', meetCnt);
                        //   if(meetCnt > confirmManCnt+confirmWomanCnt){
                        //     joinAv = true;
                        //   }else{
                        //     joinAv = false;
                        //   }
                        // }
                        console.log('joinAv :::: ',joinAv);
                        if(joinAv == 0){
                          if(memberPoint < 5){
                            setCashPop(true);
                          }else{
                            setSocialPop(true);
                          }
                        }else if(joinAv == 1){
                          setFullPop3(true);
                        }else if(joinAv == 2){
                          setFullPop(true);
                        }else if(joinAv == 3){
                          setFullPop2(true);
                        }
                      }                      
                    }}
                  >
                    <Text style={styles.nextBtnText}>참여 신청하기</Text>
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
                <View style={[styles.cmViewTitle, reqList.length < 1 ? styles.mgb10 : null]}>
                  <Text style={styles.cmViewTitleText}>신청자</Text>
                </View>
                <View style={styles.reqUl}>
                  {reqList.length < 1 ? (
                    <View style={[styles.notData, styles.pdt0]}>
                      <Text style={styles.notDataText}>신청한 회원이 없습니다.</Text>
                    </View>
                  ) : null}
                  {reqList.map((item, index) => {
                    let profile_img = 'profile_logo.png';
                    if(item.mini_pofile_img){
                      profile_img = item.mini_pofile_img;
                    }else if(item.main_profile_img){
                      profile_img = item.main_profile_img;
                    }

                    return (
                      <View key={index} style={[styles.reqLi, styles.boxShadow2, index == 0 ? styles.mgt0 : null]}>
                        <TouchableOpacity
                          style={styles.reqUser}
                          activeOpacity={opacityVal}
                          onPress={()=>{
                            if(item.report_yn == 'y'){
                              setLeavePopText('신고한 회원이에요');
                              setLeavePop(true);
                            }else if(item.leave_yn == 'y'){
                              setLeavePopText('탈퇴한 회원이에요');
                              setLeavePop(true);
                            }else if(item.available_yn == 'n'){
                              setLeavePopText('계정비활성화 회원이에요');
                              setLeavePop(true);
                            }else if(item.card_yn == 'n'){
                              setLeavePopText('카드를 비활성화한 회원이에요');
                              setLeavePop(true);
                            }else{
                              setMiniUserImg(profile_img);
                              if(item.profile_open_yn == 'y'){
                                setBigImgPop(true);
                              }else{
                                if(memberPoint < 5){
                                  setMiniChg(1);
                                }else{
                                  setMiniChg(0);
                                  setMiniUserIdx(item.member_idx);                                
                                }
                                setMiniProfilePop(true);
                              }      
                            }                      
                          }}
                        >   
                          {item.profile_open_yn == 'n' ? (
                            <BlurView style={styles.blurView2} blurType="light" blurAmount={3} />
                          ) : null}
                          {item.mini_pofile_img ? (
                            <ImgDomain2 fileWidth={46} fileName={profile_img}/>
                          ) : (
                            item.main_profile_img ? (
                              <ImgDomain2 fileWidth={46} fileName={item.main_profile_img}/>
                            ) : (
                              <ImgDomain fileWidth={46} fileName={'profile_logo.png'}/>
                            )
                          )}
                          
                        </TouchableOpacity>
                        <View style={styles.reqUserInfo}>
                          <View style={styles.reqUserNick}>
                            <Text style={styles.reqUserNickText}>{item.guest_social_nick}</Text>
                          </View>
                          <View style={styles.reqUserDetail}>
                            <Text style={styles.reqUserDetailText}>{item.member_age}년생</Text>
                            <View style={styles.reqDtLine}></View>
                            <Text style={styles.reqUserDetailText}>{item.member_main_local}</Text>
                          </View>
                        </View>                        
                        {useStatus ? (
                        <TouchableOpacity
                          style={styles.reqOkBtn}
                          activeOpacity={opacityVal}
                          onPress={() => {
                            if(item.report_yn == 'y'){
                              setLeavePopText('신고한 회원이에요');
                              setLeavePop(true);
                            }else if(item.leave_yn == 'y'){
                              setLeavePopText('탈퇴한 회원이에요');
                              setLeavePop(true);
                            }else if(item.available_yn == 'n'){
                              setLeavePopText('계정비활성화 회원이에요');
                              setLeavePop(true);
                            }else if(item.card_yn == 'n'){
                              setLeavePopText('카드를 비활성화한 회원이에요');
                              setLeavePop(true);
                            }else{
                              setSjIdx(item.sj_idx);
                              setSocialPop2(true);    
                            }                            
                          }}
                        >
                          <Text style={styles.reqOkBtnText}>수락</Text>
                        </TouchableOpacity>
                        ) : null}
                      </View>
                    )
                  })}
                </View>     

                <View style={styles.mgt40}>
                  <View style={[styles.cmViewTitle, acceptList.length < 1 ? styles.mgb10 : null]}>
                    <Text style={styles.cmViewTitleText}>수락자</Text>
                  </View>
                  <View style={styles.cardView}>
                    {acceptList.length < 1 ? (
                      <View style={[styles.notData, styles.pdt0]}>
                        <Text style={styles.notDataText}>수락한 회원이 없습니다.</Text>
                      </View>
                    ) : null}
                    {acceptList.map((item, index) => {
                      if(!item.isFlipped){
                        return (
													<TouchableOpacity 
														key={index}
														style={[styles.cardBtn, styles.cardBtn2, (index+1)%3 == 0 ? styles.mgr0 : null]}
														activeOpacity={opacityVal2}
														onPress={() => {
                              if(item.report_yn == 'y'){
                                setLeavePopText('신고한 회원이에요');
                              }else if(item.leave_yn == 'y'){
                                setLeavePopText('탈퇴한 회원이에요');
                              }else if(item.available_yn == 'n'){
                                setLeavePopText('계정비활성화 회원이에요');
                              }else if(item.card_yn == 'n'){
                                setLeavePopText('카드를 비활성화한 회원이에요');                                
                              }
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
                            propsNick={item.guest_social_nick}													
                            propsAge={item.member_age}													
                            propsHeight={item.member_height}													
                            propsFlip={item.isFlipped}
                            propsDday={item.dateDiff}
                            propsSreen={'SocialView'}
                            viewOrder={index+1}
                            propsSjIdx={item.sj_idx}
                            propsSocialIdx={social_idx}
                            propsMemberIdx={item.member_idx}
                            propsState={item.sj_status}
                            propsImg={item.main_profile_img}
                          />
                        )
                      }
                    })}

                    {/* {data1List.map((item, index) => {
                      if(item.leave && !item.isFlipped){
												return (
													<TouchableOpacity 
														key={index}
														style={[styles.cardBtn, styles.cardBtn2, (index+1)%3 == 0 ? styles.mgr0 : null]}
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
                            viewOrder={index+1}
													/>
												)
											}
                    })} */}
                  </View>              
                </View>

                <View style={styles.mgt40}>
                  <View style={[styles.cmViewTitle, joinList.length < 1 ? styles.mgb10 : null]}>
                    <Text style={styles.cmViewTitleText}>참여자</Text>
                  </View>
                  <View style={styles.cardView}>
                    {joinList.length < 1 ? (
                      <View style={[styles.notData, styles.pdt0]}>
                        <Text style={styles.notDataText}>참여한 회원이 없습니다.</Text>
                      </View>
                    ) : null}

                    {joinList.map((item, index) => {
                      if(!item.isFlipped){
                        return (
													<TouchableOpacity 
														key={index}
														style={[styles.cardBtn, styles.cardBtn2, (index+1)%3 == 0 ? styles.mgr0 : null]}
														activeOpacity={opacityVal2}
														onPress={() => {                            
                              if(item.report_yn == 'y'){
                                setLeavePopText('신고한 회원이에요');
                              }else if(item.leave_yn == 'y'){
                                setLeavePopText('탈퇴한 회원이에요');
                              }else if(item.available_yn == 'n'){
                                setLeavePopText('계정비활성화 회원이에요');
                              }else if(item.card_yn == 'n'){
                                setLeavePopText('카드를 비활성화한 회원이에요');                                
                              }
                              setLeavePop(true);
															
														}}
													>
														<View style={[styles.cardCont, styles.cardCont2]}>																												
															<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
														</View>                            
													</TouchableOpacity>
												)
                      }else{
                        console.log('!!!!!!! ',item);
                        return (
                          <Card2 
                            navigation={navigation}
                            key={index}
                            propsNick={item.guest_social_nick}													
                            propsAge={item.member_age}													
                            propsHeight={item.member_height}													
                            propsFlip={item.isFlipped}
                            //propsDday={item.dday}
                            propsDday={item.dateDiff}                            
                            propsSreen={'SocialView'}
                            viewOrder={index+1}
                            propsSjIdx={item.sj_idx}
                            propsSocialIdx={social_idx}
                            propsMemberIdx={item.member_idx}
                            propsState={item.sj_status}
                            propsImg={item.main_profile_img}
                          />
                        )
                      }
                    })}

                    {/* {data1List2.map((item, index) => {
                      if(item.leave && !item.isFlipped){
												return (
													<TouchableOpacity 
														key={index}
														style={[styles.cardBtn, styles.cardBtn2, (index+1)%3 == 0 ? styles.mgr0 : null]}
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
                            viewOrder={index+1}
													/>
												)
											}
                    })} */}
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
            ) : null}

            {userType == 2 && (guestPartyState || guestPartyState == 0) ? (
            <>
              <View style={[styles.cmView, styles.pdb30, styles.pdt30]}>
                <View style={styles.cmViewTitle}>
                  <Text style={styles.cmViewTitleText}>신청 현황</Text>
                </View>

                {guestPartyState == 0 ? (
                <TouchableOpacity 
                  style={styles.reqStateBox}
                  activeOpacity={1}
                  onPress={()=>{setReadyPop(true)}}
                >                  
                  <ImageBackground source={{uri:'https://physicalmatch.co.kr/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>                    
                    <View style={[styles.cardBtn, styles.cardBtn3]}>                      
                      <View style={[styles.cardCont, styles.cardCont3]}>																												                        											
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
                ) : null}

                {guestPartyState == 1 || guestPartyState == 3 ? (
                <TouchableOpacity 
                  style={styles.reqStateBox}
                  activeOpacity={1}
                  onPress={()=>{
                    //console.log('dateDiff ::: ',dateDiff);
                    if(dateDiff > 0){
                      navigation.navigate(
                        'MatchDetail', 
                        {
                          accessType:'social', 
                          mb_member_idx:writerIdx,
                          commIdx:social_idx, 
                          commIdx2:sjIdx,
                          currState:guestPartyState,
                          writeType:userType, //1:내 글, 2:남의 글
                          social_host_sex:host_sex,
                        }
                      )
                    }
                  }}
                >                                        
                  <ImageBackground source={{uri:'https://physicalmatch.co.kr/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>
                    <View style={[styles.cardBtn, styles.cardBtn3]}>                      
                      {dateDiff > 0 ? (
                        <View style={[styles.cardCont, styles.cardCont3]}>		
                          <View style={styles.peopleImgBack}>
                            <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                          </View>
                          <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                            <View style={styles.peopleImgBack}>
                              <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                            </View>
                            <View style={styles.peopleImg}>
                              <ImgDomain2 fileWidth={110} fileName={profileImg2} />
                            </View>
                            <View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont3, styles.boxShadow3]}>
                              <View	View style={styles.cardFrontDday}>
                                <Text style={styles.cardFrontDdayText}>D-{dateDiff}</Text>
                              </View>
                              <View style={styles.cardFrontNick2}>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{nick}</Text>
                              </View>
                              <View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
                                <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{age}</Text>
                                <View style={styles.cardFrontContLine}></View>
                                <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{height}cm</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View style={[styles.cardCont, styles.cardCont2, styles.back]}>    
                          <View style={{...styles.boxShadow, borderTopLeftRadius:80, borderTopRightRadius:80,}}>
                            <ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />     
                          </View>      
                        </View>
                      )}                      
                    </View>           
                    <View style={styles.reqStateInfo}>
                      <View style={styles.reqStateTitle}>
                        <Text style={styles.reqStateTitleText}>참여를 확정해 주세요!</Text>
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
                ) : null}

                {guestPartyState == 5 ? (
                <TouchableOpacity 
                  style={styles.reqStateBox}
                  activeOpacity={1}
                  onPress={()=>{
                    if(dateDiff > 0){
                      navigation.navigate(
                        'MatchDetail', 
                        {
                          accessType:'social', 
                          mb_member_idx:writerIdx,
                          commIdx:social_idx, 
                          commIdx2:sjIdx,
                          currState:guestPartyState,
                          writeType:userType, //1:내 글, 2:남의 글
                        }
                      )
                    }
                  }}
                >                            
                  <ImageBackground source={{uri:'https://physicalmatch.co.kr/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>
                    <View style={[styles.cardBtn, styles.cardBtn3]}>
                      {dateDiff > 0 ? (
                        <View style={[styles.cardCont, styles.cardCont3]}>		
                          <View style={styles.peopleImgBack}>
                            <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                          </View>
                          <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                            <View style={styles.peopleImgBack}>
                              <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                            </View>
                            <View style={styles.peopleImg}>
                              <ImgDomain2 fileWidth={110} fileName={profileImg2} />
                            </View>
                            <View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont3, styles.boxShadow3]}>
                              <View	View style={styles.cardFrontDday}>
                                <Text style={styles.cardFrontDdayText}>D-{dateDiff}</Text>
                              </View>
                              <View style={styles.cardFrontNick2}>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{nick}</Text>
                              </View>
                              <View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
                                <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{age}</Text>
                                <View style={styles.cardFrontContLine}></View>
                                <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{height}cm</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View style={[styles.cardCont, styles.cardCont2, styles.back]}>    
                          <View style={styles.boxShadow}>
                            <ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />     
                          </View>      
                        </View>
                      )} 
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
                ) : null}

                {guestPartyState == 4 ? (
                <TouchableOpacity 
                  style={styles.reqStateBox}
                  activeOpacity={1}
                  onPress={()=>{
                    if(dateDiff > 0){
                      navigation.navigate(
                        'MatchDetail', 
                        {
                          accessType:'social', 
                          mb_member_idx:writerIdx,
                          commIdx:social_idx, 
                          commIdx2:sjIdx,
                          currState:guestPartyState,
                          writeType:userType, //1:내 글, 2:남의 글
                        }
                      )
                    }
                  }}
                >                            
                  <ImageBackground source={{uri:'https://physicalmatch.co.kr/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>
                    <View style={[styles.cardBtn, styles.cardBtn3]}>
                      {dateDiff > 0 ? (
                        <View style={[styles.cardCont, styles.cardCont3]}>		
                          <View style={styles.peopleImgBack}>
                            <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                          </View>
                          <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                            <View style={styles.peopleImgBack}>
                              <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                            </View>
                            {/* <AutoHeightImage width={110} source={{uri:'https://physicalmatch.co.kr/appImg/woman2.png'}} resizeMethod='resize' style={styles.peopleImg} /> */}
                            <View style={styles.peopleImg}>
                              <ImgDomain2 fileWidth={110} fileName={profileImg2} />
                            </View>
                            <View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont3, styles.boxShadow3]}>
                              <View	View style={styles.cardFrontDday}>
                                <Text style={styles.cardFrontDdayText}>D-{dateDiff}</Text>
                              </View>
                              <View style={styles.cardFrontNick2}>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{nick}</Text>
                              </View>
                              <View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
                                <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{age}</Text>
                                <View style={styles.cardFrontContLine}></View>
                                <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{height}cm</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View style={[styles.cardCont, styles.cardCont2, styles.back]}>    
                          <View style={styles.boxShadow}>
                            <ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />     
                          </View>      
                        </View>
                      )}
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
                ) : null}
              </View>

              <View style={styles.lineView}></View>
            </>
            ) : null}

            <View style={[styles.pdb30, styles.pdt30]}>
              {userType == 2 ? (
                <View style={[styles.cmViewTitle, styles.cmView]}>
                  <Text style={styles.cmViewTitleText}>댓글</Text>
                </View>
              ) : null}

              <View style={[styles.reviewWrap, styles.pdt0]}>                
                {memberInfo?.member_type != 1 ? (
                <>
                <View style={{height:5,}}></View>
                <BlurView style={styles.blurView} blurType="light" blurAmount={2} />
                <View style={styles.blurAlert}>
                  <Text style={styles.blurAlertText}>댓글은 정회원만</Text>
                  <Text style={styles.blurAlertText}>작성 및 열람이 가능합니다.</Text>
                </View>
                </>
                ) : null}

                <View style={styles.cmView}>
                  {commentCnt < 1 ? (
                    <View style={[styles.notData, styles.pdt0]}>
                      <Text style={styles.notDataText}>등록된 댓글이 없습니다.</Text>
                    </View>
                  ) : null}

                  {commentList.map((item, index) => {
                    return (
                      <View key={index} style={[styles.reviewDepth, item.sc_type == 1 && index != 0 ? styles.mgt20 : null, index == 0 ? styles.mgt0 : null,]}>
                        {item.sc_type == 1 ? ( <View style={styles.subReviewBox}></View> ) : null}        
                        {item.member_sex == 0 ? (
                          <ImgDomain fileWidth={28} fileName={'profile_sample.png'}/>
                        ) : null}                                  
                        {item.member_sex == 1 ? (
                          <ImgDomain fileWidth={28} fileName={'profile_sample2.png'}/>
                        ) : null}                                  
                        <View style={[styles.reviewInfo, item.sc_type == 1 ? styles.reviewInfo2 : null]}>
                          <View style={styles.reviewNickDate}>
                            <Text style={styles.reviewNickText}>{item.sc_social_nick}</Text>
                            <Text style={styles.reviewDateText}>{item.created_at.replaceAll('-', '.')}</Text>
                          </View>
                          <View style={styles.reviewCont}>
                            {item.delete_yn == 'y' ? (
                              <Text style={[styles.reviewContText, styles.reviewContText2]}>삭제된 댓글입니다.</Text>
                            ) : (
                              <Text style={styles.reviewContText}>{item.sc_content}</Text>
                            )}                            
                          </View>
                          <View style={styles.reviewBtnBox}>
                            {item.sc_type == 0 ? (
                              <>
                              <TouchableOpacity
                                style={styles.reviewBtn}
                                activeOpacity={opacityVal}
                                onPress={()=>{
                                  setReviewCont('');
                                  setReviewType(1);
                                  setSubReivewNick(item.sc_social_nick);
                                  setSubReviewIdx(item.sc_idx);
                                  setTimeout(function(){
                                    scrollRef.current?.scrollTo({y:layout3.y+10});
                                  }, 100)
                                }}
                              >
                                <Text style={styles.reviewBtnText}>대댓글달기</Text>
                              </TouchableOpacity>
                              <View style={styles.reviewBtnLine}></View>
                              </>
                            ) : null}                                                          

                            {item.is_my_comment == 'y' ? (                              
                              <TouchableOpacity
                                style={styles.reviewBtn}
                                activeOpacity={opacityVal}
                                onPress={()=>deleteComment(item.sc_idx)}
                              >
                                <Text style={styles.reviewBtnText}>삭제하기</Text>
                              </TouchableOpacity>                                                            
                            ) : (
                              <TouchableOpacity
                                style={styles.reviewBtn}
                                activeOpacity={opacityVal}
                                onPress={()=>openReportPop('socialComment', item.member_idx, item.sc_idx)}
                              >
                                <Text style={styles.reviewBtnText}>신고하기</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </View>

                {memberInfo?.member_type != 1 ? ( <View style={{height:5,}}></View> ) : null}
              </View>
            </View>

            <View style={styles.reviewSubmitArea} onLayout={onLayout3}>
              {reviewType == 0 ? (
                <TextInput
                  value={reviewCont}
                  onChangeText={(v) => setReviewCont(v)}
                  onFocus={()=>setFocusState(true)}
                  onBlur={()=>setFocusState(false)}
                  placeholder={'댓글을 입력해 주세요'}
                  placeholderTextColor="#B8B8B8"
                  style={styles.reviewIpt}
                  returnKyeType='done'
                  onSubmitEditing={submitComment}
                  readOnly={memberInfo?.member_type != 1 ? true : false}
                />                
              ) : (
                <>
                  <View style={styles.reviewInReview}>
                    <Text style={styles.reviewInReviewText}>{subReviewNick}에게 대댓글 달기</Text>
                    <TouchableOpacity
                      style={styles.reviewInCancel}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        setReviewCont('');
                        setReviewType(0);
                        setSubReivewNick('');
                        setSubReviewIdx();
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
                    onSubmitEditing={submitComment}             
                  />
                </>
              )}
              <TouchableOpacity
                style={styles.reviewSubmitBtn}
                activeOpacity={opacityVal}
                onPress={()=>submitComment()}                
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
            !deleteState ? (
            <>
            <TouchableOpacity
              style={styles.dotPopBtn}
              activeOpacity={opacityVal}
              onPress={()=>{
                if(orderChg == 1 &&  memberPoint < 1){
                  setOrderChg(2);
                }
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
              onPress={()=>deleteSocial()}
            >
              <Text style={styles.dotPopBtnText}>삭제하기</Text>
            </TouchableOpacity>
            </>
            ) : null
          ): (
            <>
            <TouchableOpacity
              style={styles.dotPopBtn}
              activeOpacity={opacityVal}
              onPress={()=>openReportPop('social', writerIdx, social_idx)}
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
        <KeyboardAvoidingView
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior={behavior}
        >
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
            <View>
              <View style={styles.reportRadio}>
                {reportList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.reportRadioBtn, index == 0 ? styles.mgt0 : null]}
                      activeOpacity={opacityVal}
                      onPress={() => setReport(item.rr_idx)}
                    >
                      <Text style={styles.reportRadioBtnText}>{item.rr_content}</Text>
                      {report == item.rr_idx ? (                        
                        <ImgDomain fileWidth={20} fileName={'icon_radio_on.png'}/>
                      ) : (
                        <ImgDomain fileWidth={20} fileName={'icon_radio_off.png'}/>
                      )}
                    </TouchableOpacity>
                  )
                })}                  
              </View>
              {report == 6 ? (
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
            </View>
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
        </KeyboardAvoidingView>          
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
						onPress={()=>setOrderPop(false)}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => setOrderPop(false)}
						>							
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>            						

            {orderChg == 2 ? (
              <View>
                <Text style={styles.popTitleText}>지금 끌어 올리시겠어요?</Text>
                <Text style={[styles.popTitleDesc]}>프로틴을 충전하고 내 방을 상단 노출 해보세요!</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.popTitleText}>소셜 룸을 끌어 올리시겠어요?</Text>
              </View>
            )}
            
            {orderChg != 0 ? (
            <View style={[styles.pointBox, styles.mgt20]}>
              <ImgDomain fileWidth={24} fileName={'coin.png'}/>
							<Text style={styles.pointBoxText}>1</Text>
						</View>
            ) : null}

            <View style={[styles.popBtnBox, orderChg == 0 ? styles.mgt50 : null]}>
              {orderChg == 2 ? (
                <TouchableOpacity 
                  style={[styles.popBtn]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    setOrderPop(false);
                    navigation.navigate('Shop');
                  }}
                >
                  <Text style={styles.popBtnText}>상점으로 이동</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                style={[styles.popBtn]}
                  activeOpacity={opacityVal}
                  onPress={() => socialUpdate()}
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
							<Text style={styles.pointBoxText}>5</Text>
						</View>

            <View style={[styles.popBtnBox]}>
              {miniChg == 0 ? (
                <TouchableOpacity 
                  style={[styles.popBtn]}
                  activeOpacity={opacityVal}
                  onPress={() => setOpenMiniProfile()}
                >
                  <Text style={styles.popBtnText}>오픈하기</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                style={[styles.popBtn]}
                  activeOpacity={opacityVal}
                  onPress={() => {
                    setMiniProfilePop(false);
                    navigation.navigate('Shop');
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
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
            <ScrollView>
              <ImgDomain2 fileWidth={innerWidth-20} fileName={miniUserImg} />
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
							<Text style={styles.popTitleText}>{nick}님을 차단하시겠어요?</Text>							
              <Text style={[styles.popTitleDesc]}>차단한 회원과는 서로</Text>
              <Text style={[styles.popTitleDesc, styles.mgt5]}>프로필 교환 및 소셜 신청이 불가하고</Text>
              <Text style={[styles.popTitleDesc, styles.mgt5]}>추천 카드에 추천되지 않습니다.</Text>
						</View>		
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => setBlockPop(false)}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => socialBlock()}
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
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>{leavePopText}</Text>
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
				<View style={[styles.prvPopBot, styles.prvPopBot3]}>
					<View style={[styles.popTitle, styles.pdl20, styles.pdr20]}>
						<Text style={styles.popBotTitleText}>지금 이 소셜, 놓치지 마세요!</Text>							
						<Text style={[styles.popBotTitleDesc]}>프로틴을 구매해 바로 신청할 수 있어요</Text>
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
					</View>
					<View style={[styles.popBtnBox, styles.pdl20, styles.pdr20]}>
						<TouchableOpacity 
							style={[styles.popBtn]}
							activeOpacity={opacityVal}
							onPress={() => buyProduct()}
						>
							<Text style={styles.popBtnText}>지금 구매하기</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.popBtn, styles.popBtnOff2]}
							activeOpacity={opacityVal}
              onPress={() => {
                setCashPop(false);
                navigation.navigate('Shop');
            }}
						>
							<Text style={[styles.popBtnText, styles.popBtnOffText]}>상점 이동하기</Text>
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
              <Text style={styles.pointBoxText}>5</Text>
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
								onPress={() => submitParty()}
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
								onPress={() => socialAgree()}
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
      
      <Modal
				visible={fullPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setFullPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setFullPop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setFullPop(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View style={[styles.popTitle, styles.popTitleFlex]}>							
							<View style={styles.popTitleFlexWrap}>
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>참여 확정 인원이 꽉 찼어요</Text>
              </View>
              <ImgDomain fileWidth={18} fileName={'emiticon1.png'}/>
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {setFullPop(false)}}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      <Modal
				visible={fullPop2}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setFullPop2(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setFullPop2(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setFullPop2(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View style={[styles.popTitle, styles.popTitleFlex]}>							
							<View style={styles.popTitleFlexWrap}>
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>성별 제한이 있는 소셜이에요</Text>
              </View>
              <ImgDomain fileWidth={18} fileName={'emiticon1.png'}/>
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {setFullPop2(false)}}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      <Modal
				visible={fullPop3}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setFullPop3(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setFullPop3(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setFullPop3(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View style={[styles.popTitle, styles.popTitleFlex]}>							
							<View style={styles.popTitleFlexWrap}>
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>본인의 소셜에는 참여할 수 없어요.</Text>
              </View>
              <ImgDomain fileWidth={18} fileName={'emiticon1.png'}/>
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {setFullPop3(false)}}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      {loading ? ( <View style={[styles.indicator]}><ActivityIndicator size="large" color="#D1913C" /></View> ) : null}
      {loading2 ? ( <View style={[styles.indicator, styles.indicator2]}><ActivityIndicator size="large" color="#fff" /></View> ) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },	
	gapBox: {height:86,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	
  indicator2: { backgroundColor:'rgba(0,0,0,0.5)'},

  DetailBackBtn: {width:54,height:48,position:'absolute',left:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},
  DetailDotBtn: {width:54,height:48,position:'absolute',right:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},

  cmView: {paddingHorizontal:20,zIndex:1000},
  cmViewTitle: {marginBottom:20,},
  cmViewTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:19,color:'#1e1e1e'},

  nickArea: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingBottom:15,borderBottomWidth:1,borderBottomColor:'#ededed',marginBottom:20,},
  nickView: {flexDirection:'row',alignItems:'center'},
  nickViewImg: {width:38,height:38,borderRadius:50,overflow:'hidden'},
  nickViewText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#1e1e1e',marginLeft:10,},
  insertTime: {},
  insertTimeText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:15,color:'#888'},

  viewSubject: {flexDirection:'row',/*justifyContent:'space-between',*/alignItems:'flex-start'},
  viewSubjectArea: {width:innerWidth-36,},
  viewSubjectArea2: {width:innerWidth},
  viewSubjectText: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:24,color:'#1e1e1e',},
  viewBookBtn: {width:26,alignItems:'flex-end',},
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
  viewTabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:19,color:'#141E30',},
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

  cardView: { flexDirection: 'row', flexWrap: 'wrap', },
	dday: {width:innerWidth,height:17,backgroundColor:'#fff',marginTop:30,flexDirection:'row',justifyContent:'center',position:'relative'},
	ddayLine: {width:innerWidth,height:1,backgroundColor:'#D1913C',position:'absolute',left:0,top:8,},
	ddayText: {width:40,height:17,textAlign:'center',backgroundColor:'#fff',position:'relative',zIndex:10,fontFamily:Font.RobotoRegular,fontSize:15,lineHeight:17,color:'#D1913C'},
	cardBtn: { width: ((widnowWidth / 2) - 30), marginBottom:20, position: 'relative' },		
	cardCont: {width: ((widnowWidth / 2) - 30), backgroundColor:'#fff', backfaceVisibility:'hidden', borderTopLeftRadius:80, borderTopRightRadius:80,},	
	cardFrontInfo: {width: ((widnowWidth / 2) - 30), position:'absolute', left:0, top:0, zIndex:10,},
	peopleImgBack: {opacity:0,},
	peopleImg: {position:'absolute', left:0, top:0, zIndex:9, borderTopLeftRadius:80, borderTopRightRadius:80, overflow:'hidden'},
	cardFrontInfoCont: {width: ((widnowWidth / 2) - 30), backgroundColor:'#fff', position:'absolute', left:0, bottom:0, zIndex:10, padding:10, borderRadius:5,},
	cardFrontNick: {flexDirection:'row', alignItems:'center', justifyContent:'space-between'},
	cardFrontNickText: {width:(innerWidth/2)-61,fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:19,color:'#1e1e1e',},
	cardFrontJob: {marginVertical:6,},
	cardFrontJobText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#888',},
	cardFrontContBox: {flexDirection:'row',alignItems:'center'},
	cardFrontContText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:16,color:'#1e1e1e',},
	cardFrontContTextRoboto: {fontFamily:Font.RobotoRegular,fontSize:12,},
	cardFrontContLine: {width:1,height:8,backgroundColor:'#EDEDED',position:'relative',top:1,marginHorizontal:6,},

	cardBtn2: {width: ((innerWidth / 3) - 7),marginRight:10.5},
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

  reviewWrap: {alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',paddingTop:20,minHeight:100,},  
  blurView: {width:widnowWidth,height:'100%',position:'absolute',left:0,top:0,zIndex:10000,},
  blurView2: {width:66,height:66,position:'absolute',left:-10,top:-10,zIndex:100,},
  blurAlert: {position:'absolute',zIndex:10001,},
  blurAlertText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:28,color:'#243B55'},
  reviewDepth: {flexDirection:'row',flexWrap:'wrap',marginTop:30,},
  reviewDepth2: {width:innerWidth-34,marginTop:20,},
  subReviewBox: {width:34,},
  reviewInfo: {width:innerWidth-28,paddingLeft:6,},
  reviewInfo2: {width:innerWidth-62,},
  reviewNickDate: {flexDirection:'row',alignItems:'center'},
  reviewNickText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:28,color:'#1e1e1e'},
  reviewDateText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:28,color:'#B8B8B8',marginLeft:6,},
  reviewCont: {marginTop:6,},
  reviewContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#1e1e1e'},
  reviewContText2: {color:'#666'},
  reviewBtnBox: {flexDirection:'row',alignItems:'center',marginTop:9,},
  reviewBtn: {},
  reviewBtnText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:19,color:'#666'},
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
	input2: {width: innerWidth-40},

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
  prvPopBot3: {paddingHorizontal:0,},
	popBotTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:20,lineHeight:26,color:'#1e1e1e',},
	popBotTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#666',marginTop:10,},

  dotPop: {width:100,backgroundColor:'#fff',borderRadius:10,overflow:'hidden',position:'absolute',top:48+stBarHt,right:20,alignItems:'center'},
  dotPopBtn: {padding:12,},
  dotPopBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#1e1e1e'},
  dotPopBtnLine: {width:80,height:1,backgroundColor:'#EDEDED',borderRadius:5,},

  pointBox: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	pointBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#D1913C',marginLeft:6},

  warnPop: {width:widnowWidth-20,backgroundColor:'#fff',padding:15,position:'absolute',top:32,left:-10,borderWidth:1,borderColor:'#EDEDED',borderRadius:5,zIndex:2000,},
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
	productText1: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:22,color:'#1e1e1e'},
	productBest: {height:20,paddingHorizontal:8,borderRadius:20,marginTop:5,},
	productBest2: {backgroundColor:'#FFBF1A',},
	productText2: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:18,color:'#fff'},
	productText3: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#666',marginTop:3,},
	productText3On: {color:'#1e1e1e'},
	productText4: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:5,},

  notData: {width:innerWidth,paddingTop:20},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:13,color:'#666'},

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
  pdt40: {paddingTop:40},
  pdb0: {paddingBottom:0},
  pdb10: {paddingBottom:10},
  pdb20: {paddingBottom:20},
  pdb30: {paddingBottom:30},
  pdb40: {paddingBottom:40},
  pdl20: {paddingLeft:20},
  pdr20: {paddingRight:20},
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
  mgr10: {marginRight:10},
  mgr15: {marginRight:15},
  mgr20: {marginRight:20},
  mgr30: {marginRight:30},
  mgr40: {marginRight:40},
	mgl0: {marginLeft:0},
  mgl10: {marginLeft:10},
  mgl15: {marginLeft:15},
  zindex10: {zIndex:10,},
  zindex100: {zIndex:100,},
  zindex1000: {zIndex:1000,},
  zindex2000: {zIndex:2000,},
})

export default SocialView