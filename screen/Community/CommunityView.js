import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Image, Dimensions, ImageBackground, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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

const line = Platform.OS === 'ios' ? 15 : 14;
const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const CommunityView = (props) => {    
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route	
  const comm_idx = params['comm_idx'];
  const cate_name = params['cateName'];
  const paramsString = JSON.stringify({comm_idx:comm_idx, cateName:cate_name});
  const scrollRef = useRef();	
  const etcRef = useRef(null);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [currFocus, setCurrFocus] = useState('');		
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [productApiList, setProductApiList] = useState([]);
  const [productInappList, setProductInappList] = useState([]); 
  const [platformData, setPlatformData] = useState(null);
  const [hostUrl, setHostUrl] = useState('');

  const [deleteState, setDeleteState] = useState(false); //글 삭제 여부
  const [userType, setUserType] = useState(2); //1=>호스트, 2=>게스트
  const [dotPop, setDotPop] = useState(false);
  const [reportPop, setReportPop] = useState(false);
  const [cashPop, setCashPop] = useState(false);
  const [prdIdx, setPrdIdx] = useState();
  const [skuCode, setSkuCode] = useState();
  const [blockPop, setBlockPop] = useState(false);
  const [tradePop, setTradePop] = useState(false); //프로필,번호 등 교환
  const [tradeType, setTradeType] = useState(0); //1=>프로필교환 보내기, 2=>프로필교환 수락, 3=>번호교환 수락, 4=>번호교환 보내기
  const [tradeSort, setTradeSort] = useState('');
  const [tradeCrIdx, setTradeCrIdx] = useState();
  const [receiveMemberIdx, setReceiveMemberIdx] = useState();
  const [falsePop, setFalsePop] = useState(false);
  const [focusState, setFocusState] = useState(false);
  const [leavePop, setLeavePop] = useState(false);
  const [leavePopText, setLeavePopText] = useState('');

  const [report, setReport] = useState('');
  const [reportEtc, setReportEtc] = useState('');
  const [reportType, setReportType] = useState();
  const [reportMemberIdx, setReportMemberIdx] = useState();
  const [reportBoardIdx, setReportBoardIdx] = useState();  

  const [reviewType, setReviewType] = useState(0); //0=>댓글, 1=>대댓글
  const [reviewCont, setReviewCont] = useState('');

  const [bookSt, setBookSt] = useState(false);
  const [goodSt, setGoodSt] = useState(0); //0=>선택x, 1:싫어요, 2:좋아요요
  const [goodCnt, setGoodCnt] = useState(0);
  const [hateCnt, setHateCnt] = useState(0);

  const [cashPopNick, setCashPopNick] = useState('');
  const [hostMemberIdx, setHostMemberIdx] = useState();
  const [hostSex, setHostSex] = useState();
  const [pbIdx, setPbIdx] = useState();
  const [sjIdx, setSjIdx] = useState();
  const [nick, setNick] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [img, setImg] = useState('');
  const [imgBlur, setImgBlur] = useState();
  const [datetime, setDatetime] = useState('');  
  const [commentCnt, setCommentCnt] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const [subReviewIdx, setSubReviewIdx] = useState();
  const [subReivewNick, setSubReivewNick] = useState('');

  const [receiveList, setReceiveList] = useState([]);
  const [sendList, setSendList] = useState([]);
  
  const [memberIdx, setMemberIdx] = useState();
  const [memberInfo, setMemberInfo] = useState({});
  const [memberPoint, setMemberPoint] = useState();

  const [permitCpcIdx, setPermitCpcIdx] = useState(); 

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

      console.log('comm_idx :::: ',comm_idx);
      if(memberIdx){
        //console.log('get change list');
        getReceive();
        getSend();
      }
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

  useEffect(() => {
    if(memberIdx){
      setLoading(true);
      getMemInfo();
      getCommDetail();
      getReceive();
      getSend();
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
              //console.log('purchaseUpdatedListener Android', purchase);
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
            //console.log('purchaseErrorListener', error);
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

  const getCommDetail = async () => {

    let sData = {
			basePath: "/api/community/",
			type: "GetCommunityDetail",
			member_idx: memberIdx,
      comm_idx: comm_idx,
		};

    if(params?.needUpdate == 1){
      sData.is_update = 'y';
    }

		const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      setHostMemberIdx(response.data.comm.member_idx);
      setHostSex(response.data.comm.host_comm_sex);
      if(response.data.comm.member_idx == memberIdx){
        setUserType(1);
      }else{
        setUserType(2);
      }
    }

    if(response.data.comm.is_bookmark == 'y'){
      setBookSt(true);
    }else{
      setBookSt(false);
    }

    setPbIdx(response.data.comm.pb_idx);
    setNick(response.data.comm.host_comm_nick);
    setSubject(response.data.comm.comm_subject);
    setContent(response.data.comm.comm_content);
    if(response.data.comm.host_comm_sex == 0){
      setProfileImg('profile_sample.png');
    }else if(response.data.comm.host_comm_sex == 1){
      setProfileImg('profile_sample2.png');
    }  

    if(response.data.img[0] == undefined){
      setImg('');
    }else{      
      setImg(response.data.img[0].ci_img);
    }
  
    setImgBlur(response.data.comm.comm_care);
    setDatetime(response.data.comm.AgoTime);
    if(response.data.comm.like_type == 1 || response.data.comm.like_type == 2){
      setGoodSt(response.data.comm.like_type);
    }else{
      setGoodSt(0);
    }

    if(response.data.like[0].like_count > 0){
      setGoodCnt(response.data.like[0].like_count);    
    }else{
      setGoodCnt(0);
    }

    if(response.data.like[0].dislike_count > 0){      
      setHateCnt(response.data.like[0].dislike_count);
    }else{
      setHateCnt(0);
    }

    setCommentCnt(response.data.comment.length);
    if(response.data.comment.length > 0){
      setCommentList(response.data.comment);
    }else{
      setCommentList([]);
    }

    if(response.data.comm.delete_yn == 'y'){
      setDeleteState(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 100); 
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

  const getReceive = async () => {
    let sData = {
			basePath: "/api/community/",
			type: "GetReceiveProfile",
      comm_idx: comm_idx,
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);    
    //console.log(response);
    if(response.code == 200 && response.data){
      setReceiveList(response.data);
      setHostUrl('https://'+response.httpHost);
    }else{
      setReceiveList([]);
    }
  }

  const getSend = async () => {
    let sData = {
			basePath: "/api/community/",
			type: "GetSendProfile",
      comm_idx: comm_idx,
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200 && response.data){
      setSendList(response.data);
      setHostUrl('https://'+response.httpHost);
    }else{
      setSendList([]);
    }
  }
    
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
    //console.log(response);
    if(response.code == 200){
      reportPopClose();
      ToastMessage('신고접수가 완료되었습니다.');
      if(reportType == 'comm'){
        setTimeout(function(){
          setLoading2(false);
          navigation.navigate('Community', {reload: true});
        } ,300)      
      }else if(reportType == 'commComment'){
        getCommDetail();
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
  }

  const closeTradePop = async () => {    
    setTradePop(false);
    setTradeType(0);
    setReceiveMemberIdx();
    setTradeSort('');
    setTradeCrIdx();
    setPermitCpcIdx();
  }

  const deleteCommunity = async () => {
    let sData = {
      basePath: "/api/community/",
      type: "DeleteCommunity",		
      comm_idx: comm_idx,
    };
    const response = await APIs.send(sData);
    if(response.code == 200){
      setDotPop(false);
      navigation.navigate('Community', {reload: true});
    }else{
      ToastMessage('잠시후 다시 이용해 주세요.');
    }
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
			basePath: "/api/community/",
			type: "SetComment",
      my_board: hostMemberIdx == memberIdx ? 0 : 1,
			my_nick: hostMemberIdx == memberIdx ? nick : '',
      member_idx: memberIdx,
      comment_main_idx: comm_idx,
      comment_type: 1,
      comment_depth: reviewType,
      comment_main_idx: comm_idx,
      comment_content: reviewCont,
      params: paramsString,
      
		};

    if(reviewType == 1){
      sData.comment_idx = subReviewIdx;
      sData.push_idx = 19;
    }else{
      sData.push_idx = 18;
    }
    
		const response = await APIs.send(sData);    
    //console.log(response);
    if(response.code == 200){
      setCommentCnt(response.data.comment.length);
      setCommentList(response.data.comment);
      setReviewCont('');
      setReviewType(0);      
      setSubReviewIdx();
      setSubReivewNick('');
      setTimeout(function(){
        setLoading2(false);
        scrollRef.current?.scrollTo({y:layout3.y+10});
      },300);  
    }
  }

  const commBook = async () => {
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
        pb_type: 'comm',			
        pb_post_idx: comm_idx,
      };
    }

    const response = await APIs.send(sData);
    if(response.code == 200){
      setBookSt(!bookSt);
    }
  }

  const deleteComment = async (idx) => {
    let sData = {
      basePath: "/api/community/",
      type: "DeleteCommComment",		
      comment_idx: idx,      
      comm_idx: comm_idx,
      member_idx: memberIdx,
    };
    const response = await APIs.send(sData);            
    if(response.code == 200){
      setCommentCnt(response.data.comment.length);
      setCommentList(response.data.comment);
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

  const communityBlock = async () => {
    let sData = {
      basePath: "/api/social/",
      type: "SetReportMember",		
      member_idx: memberIdx,
      rm_member_idx: hostMemberIdx,
    };
    const response = await APIs.send(sData);
    if(response.code == 200){
      setBlockPop(false);
      navigation.navigate('Community', {reload: true});
    }else{
      ToastMessage('잠시후 다시 이용해 주세요.');
    }
  }

  const likeEvent = async (state) => {
    if(goodSt == 0){      
      setGoodSt(state);
      if(state == 1){
        setHateCnt((hateCnt*1)+1);
      }else if(state == 2){
        setGoodCnt((goodCnt*1)+1);
      }      
    }else{
      if(goodSt == state){
        setGoodSt(0);
        if(state == 1){
          setHateCnt((hateCnt*1)-1);
        }else if(state == 2){
          setGoodCnt((goodCnt*1)-1);
        }
      }else{
        setGoodSt(state);
        if(state == 1){
          setGoodCnt((goodCnt*1)-1);
          setHateCnt((hateCnt*1)+1);          
        }else if(state == 2){
          setGoodCnt((goodCnt*1)+1);
          setHateCnt((hateCnt*1)-1);
        }
      }
    }

    let sData = {
      basePath: "/api/community/",
      type: "SetCommunityLike",		      
      member_idx: memberIdx,         
      comm_idx: comm_idx,
      cl_type: state,
    };
    const response = await APIs.send(sData);  
  }

  const profileChange = async () => {
    let usePoint = 0;
    if(tradeType == 1 || tradeType == 2 || tradeType == 3){
      usePoint = 5;
    }else if(tradeType == 4){
      usePoint = 20;
    }

    closeTradePop();
    if(memberPoint < usePoint){      
      setCashPop(true);
      return false;
    }

    setLoading2(true);
    if(tradeType == 1){
      //프로필 교환 신청
      let sData = {
        basePath: "/api/community/",
        type: "SetProfileChange",	
        comm_idx: comm_idx,   
        member_idx: memberIdx,               
        receive_member_idx: receiveMemberIdx,
        params: paramsString,
        push_idx: 14,
      };

      if(tradeSort == 'comment'){
        sData.cr_idx = tradeCrIdx;
      }else if(tradeSort == 'host'){
        sData.hostNick = nick;
      }

      if(hostMemberIdx == memberIdx){
        sData.my_board = 0;
        sData.my_nick = nick;
      }else{
        sData.my_board = 1;        
      }

      const response = await APIs.send(sData);  
      if(response.code == 200){
        getSend();
        getMemberProtain();
        setTimeout(function(){
          setLoading2(false);
          ToastMessage('프로필 교환을 요청했습니다.');
        }, 100);      
      }else if(response.code == 300){
        ToastMessage(response.msg);
      }else{
        setTimeout(function(){
          setLoading2(false);
          ToastMessage('잠시후 다시 이용해 주세요.');
        }, 100);
      }
      closeTradePop();

    }else if(tradeType == 2){
      //프로필 교환 수락
      let sData = {
        basePath: "/api/community/",
        type: "SetProfileChangePermit",	
        cpc_idx: permitCpcIdx,
        params: paramsString,
        push_idx: 15,
      };
      const response = await APIs.send(sData); 
      //console.log(response);
      if(response.code == 200){
        getReceive();        
        setTimeout(function(){
          setLoading2(false);
          ToastMessage('프로필 교환을 수락했습니다.');
        }, 100);
      }else{        
        setTimeout(function(){
          setLoading2(false);
          ToastMessage('잠시후 다시 이용해 주세요.');
        }, 100);
      }
      closeTradePop();
    }
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
        console.log('_getProducts success');
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
            //console.log('dataAndroid', result[0]);       
            //console.log("성공"); 
            // can do your API call here to save the purchase details of particular user
            inappPayResult.biling_id = result[0].transactionId;
            inappPayResult.biling_token = result[0].purchaseToken;
            inappPayResult.biling_payment = 'card';            
            inappPayResult.paymented_at = result[0].transactionDate;                                    
          } else if (Platform.OS === 'ios'){
            //console.log(result);            
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
      console.log('현재 포인트 :::: ', response.data);
      setMemberPoint(response.data);
    }
  }

  const buyProduct = async () => {
    setLoading2(true);
    setCashPop(false);
    _requestPurchase(skuCode);
    setTimeout(() => { setLoading2(false); }, 3000);
  }

  const checkRelation = async (type, sort, idx, nickname, comment_idx) => {
		let sData = {
			basePath: "/api/community/",
			type: "GetCommCheck",
			member_idx: memberIdx,
			receive_member_idx: idx,
		};		
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){			
      setTradeType(type);
      setTradePop(true);
      setTradeSort(sort);
      setReceiveMemberIdx(idx);
      setCashPopNick(nickname);
      if(sort == 'comment'){
        setTradeCrIdx(comment_idx);
      }
		}else{
			setFalsePop(true);
		}
	}

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

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

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>	
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>{cate_name}</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerBackBtn} 
          activeOpacity={opacityVal}
        >          
          <ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            if(memberInfo?.member_type != 1){
              ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
            }else{
              setDotPop(true);
            }            
          }} 
          style={styles.headerBackBtn2} 
          activeOpacity={opacityVal}
          >
          <ImgDomain fileWidth={24} fileName={'icon_hd_dot2.png'}/>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardVerticalOffset+15}
        behavior={behavior}
        style={{flex:1}}
      >
        <ScrollView ref={scrollRef}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>              
              <View style={[styles.cmView, styles.pdt30, styles.pdb40]}>
                <View style={styles.viewTitle}>
                  <View style={[styles.viewTitleArea, userType == 1 ? styles.viewTitleArea2 : null]}>
                    <Text style={styles.viewTitleAreaText}>{subject}</Text>
                  </View>
                  {userType == 2 ? (
                    <TouchableOpacity
                      style={styles.viewBookBtn}
                      activeOpacity={opacityVal}
                      onPress={()=>commBook()}
                    >
                      {bookSt ? (
                        <ImgDomain fileWidth={18} fileName={'icon_zzim_on.png'}/>
                      ): (
                        <ImgDomain fileWidth={18} fileName={'icon_zzim_off.png'}/>
                      )}                    
                    </TouchableOpacity>
                  ) : null}
                </View>                

                <View style={styles.viewProf}>
                  <View style={styles.viewProfWrap}>
                    <View style={styles.viewProfImg}>
                      <ImgDomain fileWidth={32} fileName={profileImg}/>
                    </View>
                    <View style={styles.viewProfNick}>
                      <Text style={styles.viewProfNickText}>{nick}</Text>
                    </View>
                    {userType == 2 ? (
                    <TouchableOpacity
                      activeOpacity={opacityVal}
                      //onPress={()=>profileChange('host', hostMemberIdx)}
                      onPress={()=>{
                        if(memberInfo?.member_type != 1){
                          ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
                        }else{                                                  
                          checkRelation(1, 'host', hostMemberIdx, nick);                        
                        }
                      }}
                    >
                      <ImgDomain fileWidth={30} fileName={'icon_profile_trade.png'}/>
                    </TouchableOpacity>
                    ) : null}
                  </View>
                  <View style={styles.viewProfDate}>
                    <Text style={styles.viewProfDateText}>{datetime}</Text>
                  </View>
                </View>                

                <View style={styles.viewProfCont}>
                  <Text style={styles.viewProfContText}>{content}</Text>
                </View>

                {img || img != '' ? (
                  <View style={styles.viewProfContImg}>
                    {/* {imgBlur == 1 ? (
                      <BlurView style={styles.blurView2} blurType="light" blurAmount={10} />
                    ) : null} */}
                    <ImgDomain2 fileWidth={innerWidth} fileName={img}/>
                  </View>
                ) : null}                

                <View style={styles.voteArea}>
                  <View style={styles.voteView}>
                    <View style={[styles.voteViewCnt, styles.mgr15]}>
                      <Text style={styles.voteViewCntText}>{goodCnt}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.voteViewCntBtn]}
                      activeOpacity={memberInfo?.member_type != 1 ? 1 : opacityVal}
                      onPress={()=>{
                        if(memberInfo?.member_type == 1){
                          if(userType == 2){
                            likeEvent(2);
                          }else if(userType == 1){
                            ToastMessage('글 작성자는 이용할 수 없습니다.');
                          }
                        }                        
                      }}
                    >
                      {goodSt == 2 ? (
                        <ImgDomain fileWidth={38} fileName={'good_on.png'} memberType={memberInfo?.member_type} />
                      ) : (
                        <ImgDomain fileWidth={38} fileName={'good_off.png'} memberType={memberInfo?.member_type} />
                      )}                      
                    </TouchableOpacity>
                  </View>
                  <View style={styles.voteCenter}></View>
                  <View style={styles.voteView}>                    
                    <TouchableOpacity
                      style={[styles.voteViewCntBtn]}
                      activeOpacity={memberInfo?.member_type == 0 ? 1 : opacityVal}
                      onPress={()=>{             
                        if(memberInfo?.member_type == 1){           
                          if(userType == 2){
                            likeEvent(1);
                          }else if(userType == 1){
                            ToastMessage('글 작성자는 이용할 수 없습니다.');
                          }
                        }                      
                      }}
                    >
                      {goodSt == 1 ? (
                        <ImgDomain fileWidth={38} fileName={'hate_on.png'} memberType={memberInfo?.member_type} />
                      ) : (
                        <ImgDomain fileWidth={38} fileName={'hate_off.png'} memberType={memberInfo?.member_type} />
                      )}
                    </TouchableOpacity>
                    <View style={[styles.voteViewCnt, styles.mgl15]}>
                      <Text style={styles.voteViewCntText}>{hateCnt}</Text>
                    </View>
                  </View>
                </View>
              </View>               

              {receiveList.length > 0 || sendList.length > 0 ? (
                <>
                <View style={styles.lineView}></View>

                <View style={[styles.cmView, styles.pdt30, styles.pdb40]}>
                  <View style={styles.tradeTitle}>
                    <View style={styles.tradeTitleWrap}>
                      <Text style={styles.tradeTitleText}>프로필 교환 신청</Text>
                      <View style={styles.tradeTitleLine}></View>
                    </View>
                  </View>

                  {receiveList.length > 0 ? (
                  <View style={styles.mgt30}>
                    <View style={styles.cmViewTitle2}>
                      <Text style={styles.cmViewTitleText2}>받은 프로필 교환</Text>
                    </View>
                    {receiveList.length < 1 ? (
                      <View style={[styles.notData]}>
                        <Text style={styles.notDataText}>받은 프로필이 없습니다.</Text>
                      </View>
                    ) : null}
                    <View style={styles.reqUl}>     
                      {receiveList.map((item, index) => {
                        //const profileImg = hostUrl+item.send_profile;
                        if(item.cpc_type == 0){
                          return (                        
                            <View key={index} style={[styles.reqLi, styles.boxShadow2, index == 0 ? styles.mgt0 : null]}>
                              <TouchableOpacity
                                style={styles.reqUser}
                                activeOpacity={1}
                              >
                                <ImgDomain2 fileWidth={46} fileName={item.send_profile} />
                              </TouchableOpacity>
                              <View style={styles.reqUserInfo}>
                                <View style={styles.tradeState}>
                                  <View style={styles.tradeStateView}>
                                    <Text style={styles.tradeStateText}>프로필 교환이 도착했어요</Text>
                                  </View>
                                  <ImgDomain fileWidth={12} fileName={'icon_profile_msg.png'}/>
                                </View>
                                <View style={styles.reqUserNick}>
                                  <Text style={styles.reqUserNickText}>{item.send_nick}</Text>                          
                                </View>
                                <View style={styles.reqUserDetail}>
                                  <Text style={styles.reqUserDetailText}>{item.send_age}년생</Text>
                                  <View style={styles.reqDtLine}></View>
                                  <Text style={styles.reqUserDetailText}>{item.send_local}</Text>
                                </View>
                              </View>
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
                                    setTradeType(2);
                                    setTradePop(true);
                                    setPermitCpcIdx(item.cpc_idx);
                                  }                                  
                                }}
                              >
                                <Text style={styles.reqOkBtnText}>수락</Text>
                              </TouchableOpacity>
                            </View>                                                
                          )
                        }else if(item.cpc_type == 1 || item.cpc_type == 2){
                          return (
                            <TouchableOpacity 
                              key={index}
                              style={[styles.reqLi, styles.boxShadow2, styles.reqStateBox]}
                              activeOpacity={1}           
                              onPress={()=>{
                                if(item.diff_date < 1){
                                  ToastMessage('기간이 만료되었습니다.');
                                  return false;
                                }

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
                                  navigation.navigate(
                                    'MatchDetail', 
                                    {
                                      accessType:'community', 
                                      mb_member_idx:item.send_member_idx,
                                      commIdx:item.cpc_idx, 
                                      currState:item.cpc_type,
                                      reqMbIdx:item.cpc_request_member_idx,
                                      recMbIdx:item.cpc_permit_member_idx,                                
                                    }
                                  )
                                }
                              }}
                            >                  
                              <ImageBackground source={{uri:'https://physicalmatch.co.kr/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>
                                <View style={[styles.cardBtn, styles.cardBtn3]}>
                                  <View style={[styles.cardCont, styles.cardCont3]}>		
                                    <View style={styles.peopleImgBack}>
                                      <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                                    </View>
                                    <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                                      <View style={styles.peopleImgBack}>
                                        <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                                      </View>
                                      {item.diff_date > 0 ? (
                                      <>
                                        <View style={styles.peopleImg}>
                                          <ImgDomain2 fileWidth={110} fileName={item.send_profile} />
                                        </View>
                                        <View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont3, styles.boxShadow3]}>
                                          <View	View style={styles.cardFrontDday}>
                                            {item.diff_date >= 0 ? (
                                              <Text style={styles.cardFrontDdayText}>D-{item.diff_date}</Text>
                                            ) : (
                                              <Text style={styles.cardFrontDdayText}>D-0</Text>
                                            )}
                                          </View>
                                          <View style={styles.cardFrontNick2}>
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.send_nick}</Text>
                                          </View>
                                          <View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
                                            <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.send_age}</Text>
                                            {item.send_height != 0 ? ( <View style={styles.cardFrontContLine}></View> ) : null}
                                            {item.send_height != 0 ? ( <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.send_height}cm</Text> ) : null}
                                          </View>
                                        </View>
                                      </>
                                      ) : (
                                        <View style={styles.peopleImg}>
                                          <ImgDomain fileWidth={110} fileName={'front2.png'} />     
                                        </View>
                                      )}
                                    </View>
                                  </View>
                                </View>           
                                <View style={styles.reqStateInfo}>
                                  <View style={styles.reqStateTitle}>
                                    <Text style={styles.reqStateTitleText}>교환이 수락 되었어요</Text>
                                  </View>                          
                                  <ImgDomain fileWidth={32} fileName={'icon_heart3.png'}/>
                                  <View style={styles.reqStateCont}>
                                    <Text style={styles.reqStateContText}>번호를 교환하고</Text>
                                    <Text style={styles.reqStateContText}>인연을 시작해보세요!</Text>
                                  </View>
                                </View>         
                              </ImageBackground>
                            </TouchableOpacity>
                          )
                        }else if(item.cpc_type == 3){
                          return (
                            <TouchableOpacity 
                              key={index}
                              style={[styles.reqLi, styles.boxShadow2, styles.reqStateBox]}
                              activeOpacity={1}           
                              onPress={()=>{
                                if(item.diff_date < 1){
                                  ToastMessage('기간이 만료되었습니다.');
                                  return false;
                                }

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
                                  navigation.navigate(
                                    'MatchDetail', 
                                    {
                                      accessType:'community', 
                                      mb_member_idx:item.send_member_idx,
                                      commIdx:item.cpc_idx, 
                                      currState:item.cpc_type,
                                      reqMbIdx:item.cpc_request_member_idx,
                                      recMbIdx:item.cpc_permit_member_idx,                                
                                    }
                                  )
                                }
                              }}
                            >                  
                              <ImageBackground source={{uri:'https://physicalmatch.co.kr/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>
                                <View style={[styles.cardBtn, styles.cardBtn3]}>
                                  <View style={[styles.cardCont, styles.cardCont3]}>		
                                    <View style={styles.peopleImgBack}>
                                      <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                                    </View>
                                    <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                                      <View style={styles.peopleImgBack}>
                                        <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                                      </View>
                                      {item.diff_date > 0 ? (
                                        <>
                                        <View style={styles.peopleImg}>
                                          <ImgDomain2 fileWidth={110} fileName={item.send_profile} />
                                        </View>
                                        <View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont3, styles.boxShadow3]}>
                                          <View	View style={styles.cardFrontDday}>
                                            {item.diff_date >= 0 ? (
                                              <Text style={styles.cardFrontDdayText}>D-{item.diff_date}</Text>
                                            ) : (
                                              <Text style={styles.cardFrontDdayText}>D-0</Text>
                                            )}
                                          </View>
                                          <View style={styles.cardFrontNick2}>
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.send_nick}</Text>
                                          </View>
                                          <View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
                                            <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.send_age}</Text>
                                            {item.send_height != 0 ? ( <View style={styles.cardFrontContLine}></View> ) : null}
                                            {item.send_height != 0 ? ( <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.send_height}cm</Text> ) : null}
                                          </View>
                                        </View>
                                        </>
                                      ) : (
                                        <View style={styles.peopleImg}>
                                          <ImgDomain fileWidth={110} fileName={'front2.png'} />     
                                        </View>
                                      )}
                                    </View>
                                  </View>
                                </View>           
                                <View style={styles.reqStateInfo}>
                                  <View style={styles.reqStateTitle}>
                                    <Text style={styles.reqStateTitleText}>교환이 완료 되었어요</Text>
                                  </View>
                                  <ImgDomain fileWidth={32} fileName={'icon_heart3.png'}/>
                                  <View style={styles.reqStateCont}>
                                    <Text style={styles.reqStateContText}>프로필에 오픈된 번호를</Text>
                                    <Text style={styles.reqStateContText}>지금 바로 확인해보세요!</Text>
                                  </View>
                                </View>         
                              </ImageBackground>
                            </TouchableOpacity>
                          )
                        }
                      })}
                    </View> 
                  </View>
                  ) : null}

                  {sendList.length > 0 ? (
                  <View style={styles.mgt30}>
                    <View style={styles.cmViewTitle2}>
                      <Text style={styles.cmViewTitleText2}>보낸 프로필 교환</Text>
                    </View>
                    {sendList.length < 1 ? (
                      <View style={[styles.notData]}>
                        <Text style={styles.notDataText}>보낸 프로필이 없습니다.</Text>
                      </View>
                    ) : null}
                    
                    <View style={styles.reqUl}>                  
                      {sendList.map((item, index) => {                      
                        const profileImg = hostUrl+item.receive_profile;
                        if(item.cpc_type == 0){
                          return (
                            <View key={index} style={[styles.reqLi, styles.boxShadow2, index == 0 ? styles.mgt0 : null]}>
                              <ImageBackground
                                style={styles.reqUser}
                                source={{uri:profileImg}}
                                resizeMode='cover'
                                blurRadius={5}
                              />
                              <View style={[styles.reqUserInfo, styles.reqUserInfo2]}>
                                <View style={styles.tradeState}>
                                  <View style={styles.tradeStateView}>
                                    <Text style={styles.tradeStateText}>{item.receive_nick}님에게 프로필 교환을 신청했어요.</Text>
                                  </View>
                                </View>
                                <View style={styles.reqUserDetail}>
                                  <Text style={styles.reqUserDetailText}>수락까지 잠시 기다려주세요!</Text>
                                </View>
                              </View>
                            </View>
                          )
                        }else if(item.cpc_type == 1 || item.cpc_type == 2){
                          return (
                            <TouchableOpacity 
                              key={index}
                              style={[styles.reqLi, styles.boxShadow2, styles.reqStateBox]}
                              activeOpacity={1}
                              onPress={()=>{
                                if(item.diff_date < 1){
                                  ToastMessage('기간이 만료되었습니다.');
                                  return false;
                                }

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
                                  navigation.navigate(
                                    'MatchDetail', 
                                    {
                                      accessType:'community', 
                                      mb_member_idx:item.receive_member_idx,
                                      commIdx:item.cpc_idx, 
                                      currState:item.cpc_type,
                                      reqMbIdx:item.cpc_request_member_idx,
                                      recMbIdx:item.cpc_permit_member_idx,
                                    }
                                  )
                                }
                              }}
                            >                  
                              <ImageBackground source={{uri:'https://physicalmatch.co.kr/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>
                                <View style={[styles.cardBtn, styles.cardBtn3]}>
                                  <View style={[styles.cardCont, styles.cardCont3]}>		
                                    <View style={styles.peopleImgBack}>
                                      <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                                    </View>
                                    <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                                      <View style={styles.peopleImgBack}>
                                        <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                                      </View>
                                      {item.diff_date > 0 ? (
                                        <>
                                        <View style={styles.peopleImg}>
                                          <ImgDomain2 fileWidth={110} fileName={item.receive_profile} />
                                        </View>                          
                                        <View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont3, styles.boxShadow3]}>
                                          <View	View style={styles.cardFrontDday}>
                                            {item.diff_date >= 0 ? (
                                              <Text style={styles.cardFrontDdayText}>D-{item.diff_date}</Text>
                                            ) : (
                                              <Text style={styles.cardFrontDdayText}>D-0</Text>
                                            )}
                                          </View>
                                          <View style={styles.cardFrontNick2}>
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.receive_nick}</Text>
                                          </View>
                                          <View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
                                            <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.receive_age}</Text>
                                            {item.receive_height != 0 ? ( <View style={styles.cardFrontContLine}></View> ) : null}
                                            {item.receive_height != 0 ? ( <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.receive_height}cm</Text> ) : null}                                        
                                          </View>
                                        </View>
                                        </>
                                      ) : (
                                        <View style={styles.peopleImg}>
                                          <ImgDomain fileWidth={110} fileName={'front2.png'} />     
                                        </View>
                                      )}
                                    </View>
                                  </View>
                                </View>           
                                <View style={styles.reqStateInfo}>
                                  <View style={styles.reqStateTitle}>
                                    <Text style={styles.reqStateTitleText}>교환이 수락 되었어요</Text>
                                  </View>
                                  <ImgDomain fileWidth={32} fileName={'icon_heart3.png'}/>
                                  <View style={styles.reqStateCont}>
                                    <Text style={styles.reqStateContText}>번호를 교환하고</Text>
                                    <Text style={styles.reqStateContText}>인연을 시작해보세요!</Text>
                                  </View>
                                </View>         
                              </ImageBackground>
                            </TouchableOpacity>
                          )
                        }else if(item.cpc_type == 3){
                          console.log(item);
                          return (                            
                            <TouchableOpacity 
                              key={index}
                              style={[styles.reqLi, styles.boxShadow2, styles.reqStateBox]}
                              activeOpacity={1}
                              onPress={()=>{
                                //console.log(item.send_member_idx);
                                //console.log(item.receive_member_idx);
                                if(item.diff_date < 1){
                                  ToastMessage('기간이 만료되었습니다.');
                                  return false;
                                }

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
                                  navigation.navigate(
                                    'MatchDetail', 
                                    {
                                      accessType:'community', 
                                      mb_member_idx:item.receive_member_idx,
                                      commIdx:item.cpc_idx, 
                                      currState:item.cpc_type,
                                      reqMbIdx:item.cpc_request_member_idx,
                                      recMbIdx:item.cpc_permit_member_idx,
                                    }
                                  )
                                }
                              }}
                            >                  
                              <ImageBackground source={{uri:'https://physicalmatch.co.kr/appImg/social_req_bg.png'}} resizeMode='cover' style={styles.reqStateWrap}>
                                <View style={[styles.cardBtn, styles.cardBtn3]}>
                                  <View style={[styles.cardCont, styles.cardCont3]}>		
                                    <View style={styles.peopleImgBack}>
                                      <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                                    </View>
                                    <View style={[styles.cardFrontInfo, styles.cardFrontInfo3]}>
                                      <View style={styles.peopleImgBack}>
                                        <ImgDomain fileWidth={110} fileName={'front2.png'}/>
                                      </View>
                                      {item.diff_date > 0 ? (
                                        <>
                                        <View style={styles.peopleImg}>
                                          <ImgDomain2 fileWidth={110} fileName={item.receive_profile} />
                                        </View>                           
                                        <View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont3, styles.boxShadow3]}>
                                          <View	View style={styles.cardFrontDday}>
                                            {item.diff_date >= 0 ? (
                                              <Text style={styles.cardFrontDdayText}>D-{item.diff_date}</Text>
                                            ) : (
                                              <Text style={styles.cardFrontDdayText}>D-0</Text>
                                            )}                                        
                                          </View>
                                          <View style={styles.cardFrontNick2}>
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{item.receive_nick}</Text>
                                          </View>
                                          <View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
                                            <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.receive_age}</Text>
                                            {item.receive_height != 0 ? ( <View style={styles.cardFrontContLine}></View> ) : null}
                                            {item.receive_height != 0 ? ( <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{item.receive_height}cm</Text> ) : null}                                        
                                          </View>
                                        </View>
                                        </>
                                      ) : (
                                        <View style={styles.peopleImg}>
                                          <ImgDomain fileWidth={110} fileName={'front2.png'} />     
                                        </View>
                                      )}
                                    </View>
                                  </View>
                                </View>           
                                <View style={styles.reqStateInfo}>
                                  <View style={styles.reqStateTitle}>
                                    <Text style={styles.reqStateTitleText}>교환이 완료 되었어요</Text>
                                  </View>
                                  <ImgDomain fileWidth={32} fileName={'icon_heart3.png'}/>
                                  <View style={styles.reqStateCont}>
                                    <Text style={styles.reqStateContText}>프로필에 오픈된 번호를</Text>
                                    <Text style={styles.reqStateContText}>지금 바로 확인해보세요!</Text>
                                  </View>
                                </View>    
                              </ImageBackground>
                            </TouchableOpacity>
                          )
                        }
                      })}
                    </View>  
                  </View>
                  ) : null}
                </View>
                </>
              ) : null}

              <View style={styles.lineView}></View>

              <View style={[styles.pdt40, styles.pdb30]}>
                <View style={[styles.cmViewTitle, styles.cmView, styles.mgb0]}>
                  <Text style={styles.cmViewTitleText}>댓글</Text>
                </View>
                
                <View style={styles.reviewWrap}>
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
                      <View style={styles.notData}>
                        <Text style={styles.notDataText}>등록된 댓글이 없습니다.</Text>
                      </View>
                    ) : null}
                    {commentList.map((item, index) => {
                      return (
                        <View key={index} style={[styles.reviewDepth, item.comment_depth == 1 && index != 0 ? styles.mgt20 : null, index == 0 ? styles.mgt0 : null,]}>
                          {item.comment_depth == 1 ? ( <View style={styles.subReviewBox}></View> ) : null}        
                          {item.member_sex == 0 ? (
                            <ImgDomain fileWidth={28} fileName={'profile_sample.png'}/>
                          ) : null}                                  
                          {item.member_sex == 1 ? (
                            <ImgDomain fileWidth={28} fileName={'profile_sample2.png'}/>
                          ) : null}                                  
                          <View style={[styles.reviewInfo, item.comment_depth == 1 ? styles.reviewInfo2 : null]}>
                            <View style={styles.reviewNickDate}>
                              <Text style={styles.reviewNickText}>{item.comment_nick}</Text>
                              <Text style={styles.reviewDateText}>{item.created_at.replaceAll('-', '.')}</Text>
                                {memberIdx != item.member_idx ? (
                                  <TouchableOpacity
                                    style={styles.reviewTradeBtn}
                                    activeOpacity={opacityVal}
                                    onPress={()=>{
                                      if(memberInfo?.member_type != 1){
                                        ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
                                      }else{                                                  
                                        // if(memberInfo?.member_sex == item.member_sex){                                          
                                        //   // ToastMessage('성별이 같은 경우 프로필 교환을 할 수 없습니다.');
                                        //   // return false;
                                        // }
                                        
                                        checkRelation(1, 'comment', item.member_idx, item.comment_nick,item.comment_idx);
                                      }                                     
                                    }}
                                  >
                                    <ImgDomain fileWidth={30} fileName={'icon_profile_trade.png'}/>
                                  </TouchableOpacity>
                                ) : null}
                            </View>
                            <View style={styles.reviewCont}>
                              {item.delete_yn == 'y' ? (
                                <Text style={[styles.reviewContText, styles.reviewContText2]}>삭제된 댓글입니다.</Text>
                              ) : (
                                <Text style={styles.reviewContText}>{item.comment_content}</Text>
                              )}                            
                            </View>
                            <View style={styles.reviewBtnBox}>
                              {item.comment_depth == 0 ? (
                                <>
                                <TouchableOpacity
                                  style={styles.reviewBtn}
                                  activeOpacity={opacityVal}
                                  onPress={()=>{
                                    setReviewCont('');
                                    setReviewType(1);
                                    setSubReivewNick(item.comment_nick);
                                    setSubReviewIdx(item.comment_idx);
                                    setTimeout(function(){
                                      scrollRef.current?.scrollTo({y:layout3.y+10});
                                    }, 100)
                                  }}
                                >
                                  <Text style={styles.reviewBtnText}>대댓글달기</Text>
                                </TouchableOpacity>
                                {item.delete_yn != 'y' || (item.is_my_comment != 'y' && item.delete_yn == 'y') ? (<View style={styles.reviewBtnLine}></View>) : null}
                                </>
                              ) : null}                                                          

                              {item.is_my_comment == 'y' ? (    
                                item.delete_yn != 'y' ?
                                <TouchableOpacity
                                  style={styles.reviewBtn}
                                  activeOpacity={opacityVal}
                                  onPress={()=>deleteComment(item.comment_idx)}
                                >
                                  <Text style={styles.reviewBtnText}>삭제하기</Text>
                                </TouchableOpacity>    
                                : null                                                        
                              ) : (
                                <TouchableOpacity
                                  style={styles.reviewBtn}
                                  activeOpacity={opacityVal}
                                  onPress={()=>openReportPop('commComment', item.member_idx, item.comment_idx)}
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
                    readOnly={memberInfo?.member_type != 1 ? true : false}
                    onSubmitEditing={submitComment}
                  />                
                ) : (
                  <>
                    <View style={styles.reviewInReview}>
                      <Text style={styles.reviewInReviewText}>{subReivewNick}에게 대댓글 달기</Text>
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
            <View style={styles.dotPopBtnLine}></View>
            <TouchableOpacity
              style={styles.dotPopBtn}
              activeOpacity={opacityVal}
              onPress={()=>{
                deleteCommunity();                
              }}
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
              onPress={()=>openReportPop('comm', hostMemberIdx, comm_idx)}
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
								onPress={() => {
                  setBlockPop(false);
                }}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => communityBlock()}
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

      {/* 포인트 구매 팝업 */}
			<Modal
				visible={cashPop}
        //visible={true}
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
						<Text style={styles.popBotTitleText}>{cashPopNick}님과의</Text>
            <Text style={styles.popBotTitleText}>인연을 놓치지 마세요!</Text>
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
							onPress={() => buyProduct()}
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
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
              {tradeType == 1 ? (<Text style={styles.popTitleText}>프로필을 교환하시겠어요?</Text>) : null}
              {tradeType == 2 ? (<Text style={styles.popTitleText}>교환을 수락하시겠어요?</Text>) : null}
              {tradeType == 3 ? (<Text style={styles.popTitleText}>번호 교환을 수락하시겠어요?</Text>) : null}
              {tradeType == 4 ? (<Text style={styles.popTitleText}>번호를 교환하시겠어요?</Text>) : null}
						</View>
            <View style={[styles.pointBox, styles.mgt20]}>
              <ImgDomain fileWidth={24} fileName={'coin.png'}/>
              {tradeType == 1 ? (<Text style={styles.pointBoxText}>5</Text>) : null}
              {tradeType == 2 ? (<Text style={styles.pointBoxText}>5</Text>) : null}
              {tradeType == 3 ? (<Text style={styles.pointBoxText}>5</Text>) : null}
              {tradeType == 4 ? (<Text style={styles.pointBoxText}>20</Text>) : null}
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
								onPress={() => profileChange()}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      <Modal
				visible={falsePop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setFalsePop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setFalsePop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setFalsePop(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>							
							<View style={styles.popTitleFlexWrap}>
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>지인과는 프로필 교환을</Text>
              </View>
              <View style={styles.popTitleFlex}>
                <Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>할 수 없습니다.</Text>
                <ImgDomain fileWidth={18} fileName={'emiticon1.png'}/>
              </View>              
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {setFalsePop(false)}}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

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
  prvPopBot3: {paddingHorizontal:0,},
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
  
  reviewWrap: {alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',paddingTop:20,minHeight:100,},  
  blurView: {width:widnowWidth,height:'100%',position:'absolute',left:0,top:20,zIndex:10000,},
  blurView2: {width:innerWidth,height:'100%',position:'absolute',left:0,top:0,zIndex:10000,},
  blurAlert: {position:'absolute',zIndex:10001},
  blurAlertText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:28,color:'#243B55'},
  reviewDepth: {flexDirection:'row',flexWrap:'wrap',marginTop:30,},
  reviewDepth2: {width:innerWidth-34,marginTop:20,},
  subReviewBox: {width:34,},
  reviewInfo: {width:innerWidth-28,paddingLeft:6,},
  reviewInfo2: {width:innerWidth-62,},
  reviewNickDate: {flexDirection:'row',alignItems:'center',position:'relative',paddingRight:40,},
  reviewNickText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:28,color:'#1e1e1e'},
  reviewDateText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:28,color:'#B8B8B8',marginLeft:6,},
  reviewTradeBtn: {position:'absolute',top:-1,right:0,},
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

  //paddingHorizontal:15,paddingVertical:13,paddingRight:75,
  reqStateBox: {paddingHorizontal:0,paddingVertical:0,paddingRight:0,backgroundColor:'#fff'},  
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
	peopleImg: {position:'absolute', left:0, top:0, zIndex:9, borderTopLeftRadius:80, borderTopRightRadius:80,overflow:'hidden'},
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
	input2: {width: innerWidth-40},

  viewTitle: {flexDirection:'row',justifyContent:'space-between',paddingBottom:20,borderBottomWidth:1,borderBottomColor:'#EDEDED'},
  viewTitleArea: {width:innerWidth-40},
  viewTitleArea2: {width:innerWidth},
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
  viewProfContImg: {marginTop:20,position:'relative',overflow:'hidden'},

  voteArea: {flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:30,},
  voteView: {flexDirection:'row',alignItems:'center',},
  voteCenter: {width:20,height:1,},
  voteViewCntBtn: {},
  voteViewCnt: {},
  voteViewCntText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,lineHeight:17,color:'#1e1e1e'},

  notData: {width:innerWidth,paddingTop:20},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:13,color:'#666'},

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

  productList: {flexDirection:'row',justifyContent:'space-between',position:'relative',},
	productBtn: {width:(innerWidth/3)-7,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,paddingVertical:25,paddingHorizontal:10,},
	productBtnOn: {backgroundColor:'rgba(209,145,60,0.15)',borderColor:'#D1913C'},
	productText1: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:22,color:'#1e1e1e'},
	productBest: {width:46,height:20,paddingHorizontal:8,borderRadius:20,marginTop:5,},
	productBest2: {backgroundColor:'#FFBF1A',},
	productText2: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:18,color:'#fff'},
	productText3: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#666',marginTop:3,},
	productText3On: {color:'#1e1e1e'},
	productText4: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:5,},

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
})

export default CommunityView