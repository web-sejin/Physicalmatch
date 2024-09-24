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

const TodayExerciseView = (props) => {    
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route	
  const ex_idx = params['ex_idx'];
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
  const [focusState, setFocusState] = useState(false);
  const [dotPop, setDotPop] = useState(false);
  const [reportPop, setReportPop] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [deletePop, setDeletePop] = useState(false);

  const [profileImg, setProfileImg] = useState('profile_sample.png');
  const [nick, setNick] = useState('법정에선골룸');
  const [datetime, setDatetime] = useState('2024-09-04 14:03');
  const [content, setContent] = useState('내용이 입력되는 영역입니다. 자유롭게 내용을 입력해 주세요. 자유롭게 내용을 입력해 주세요. 자유롭게 내용을 입력해 주세요.');
  const [zzim, setZzim] = useState(false);
	const [zzimCnt, setZzimCnt] = useState(5);

  const [memberIdx, setMemberIdx] = useState();
  const [memberInfo, setMemberInfo] = useState({});

  const [report, setReport] = useState('');
  const [reportEtc, setReportEtc] = useState('');
  const [reportType, setReportType] = useState();
  const [reportMemberIdx, setReportMemberIdx] = useState();
  const [reportBoardIdx, setReportBoardIdx] = useState();  

  const [reviewType, setReviewType] = useState(0); //0=>댓글, 1=>대댓글
  const [reviewCont, setReviewCont] = useState('');
  const [subReviewIdx, setSubReviewIdx] = useState();
  const [subReivewNick, setSubReivewNick] = useState('');

  const [receiveList, setReceiveList] = useState([]);
  const [sendList, setSendList] = useState([]);

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
      
      if(memberIdx){        
        //getReceive();
        //getSend();
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
      //setLoading(true);
      getMemInfo();
      //getCommDetail();
      //getReceive();
      //getSend();
    }
  }, [memberIdx]);

  useEffect(() => {
    getReportList();
  }, []);

  const getMemInfo = async () => {    
    let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
		if(response.code == 200){
      setMemberInfo(response.data);
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

  const zzimLike = async () => {
		setZzim(!zzim);
		if(zzim){
			if(zzimCnt > 0){
				setZzimCnt(zzimCnt-1);
			}		
		}else{
			setZzimCnt(zzimCnt+1);
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

    return false;
  
    setLoading(true);
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
      //setCommentCnt(response.data.comment.length);
      //setCommentList(response.data.comment);
      setReviewCont('');
      setReviewType(0);      
      setSubReviewIdx();
      setSubReivewNick('');
      setTimeout(function(){
        setLoading(false);
        scrollRef.current?.scrollTo({y:layout3.y+10});
      },300);  
    }
  }

  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [layout2, setLayout2] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [layout3, setLayout3] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const onLayout = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout({ x, y, width, height }); };
  const onLayout2 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout2({ x, y, width, height }); };
  const onLayout3 = (event) => { const { x, y, width, height } = event.nativeEvent.layout; setLayout3({ x, y, width, height }); };  

  const openReportPop = (rp_type, rp_member_idx, rp_post_idx) => {
    setReportType(rp_type);
    setReportMemberIdx(rp_member_idx);
    setReportBoardIdx(rp_post_idx);
    setReportPop(true);
    setDotPop(false);
    setPreventBack(true);
  }

  const reportPopClose = () => {
    setPreventBack(false);
    setReportPop(false);
    setReport('');
    setReportEtc('');
  }

  const submitReport = async () => {

  }

  const submitDelete = async () => {
    setDeletePop(false);
    setLoading2(true);
    setTimeout(function(){      
      setLoading2(false);
    }, 2000);
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>	
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>오운완</Text>
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
        keyboardVerticalOffset={0}
        behavior={behavior}
        style={{flex:1}}
      >
        <ScrollView ref={scrollRef}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <View style={[styles.cmView, styles.pdb40]}>
								<View style={styles.viewProf}>
                  <View style={styles.viewProfWrap}>
                    <View style={styles.viewProfImg}>
                      <ImgDomain fileWidth={32} fileName={profileImg}/>
                    </View>
                    <View style={styles.viewProfNick}>
                      <Text style={styles.viewProfNickText}>{nick}</Text>
                    </View>
                  </View>
                  <View style={styles.viewProfDate}>
                    <Text style={styles.viewProfDateText}>{datetime}</Text>
                  </View>
                </View>
								<View style={styles.viewImg}>
									<ImgDomain fileWidth={innerWidth} fileName={'feed_1.png'} />
								</View>
								<View style={styles.viewZzim}>
									<TouchableOpacity
										style={styles.viewZzimBtn}
										activeOpacity={opacityVal}
										onPress={()=>zzimLike()}
									>
										{zzim ? (
											<ImgDomain fileWidth={24} fileName={'icon_zzim_on2.png'}/>										
										): (
											<ImgDomain fileWidth={24} fileName={'icon_zzim_off2.png'}/>
										)}
										<Text style={styles.zzimCnt}>{zzimCnt}</Text>
									</TouchableOpacity>
								</View>
								<View style={styles.viewCont}><Text style={styles.viewContText}>{content}</Text></View>
              </View>
							
							<View style={styles.lineView}></View>

							<View style={[styles.cmView, styles.pdt40]}>
                <View style={[styles.cmViewTitle, styles.mgb0]}>
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

                  {/* <View style={styles.notData}>
                    <Text style={styles.notDataText}>등록된 댓글이 없습니다.</Text>
                  </View> */}
                  
                  {memberInfo?.member_type != 1 ? ( <View style={{height:5,}}></View> ) : null}

                  <View style={[styles.reviewDepth, styles.mgt0]}>
                    <ImgDomain fileWidth={28} fileName={'profile_sample.png'}/>
                    <View style={[styles.reviewInfo]}>
                      <View style={styles.reviewNickDate}>
                        <Text style={styles.reviewNickText}>자동 생성 닉네임</Text>
                        <Text style={styles.reviewDateText}>12.31 22:22</Text>
                      </View>
                      <View style={styles.reviewCont}>
                        <Text style={styles.reviewContText}>댓글 내용이 입력됩니다. 내용을 자유롭게 입력해주세요.</Text>
                        {/* <Text style={[styles.reviewContText, styles.reviewContText2]}>삭제된 댓글입니다.</Text> */}
                      </View>
                      <View style={styles.reviewBtnBox}>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>{
                            setReviewCont('');
                            setReviewType(1);
                            //setSubReivewNick(item.comment_nick);
                            //setSubReviewIdx(item.comment_idx);
                            setTimeout(function(){
                              scrollRef.current?.scrollTo({y:layout3.y+10});
                            }, 100)
                          }}
                        >
                          <Text style={styles.reviewBtnText}>대댓글달기</Text>
                        </TouchableOpacity>
                        <View style={styles.reviewBtnLine}></View>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>deleteComment(item.comment_idx)}
                        >
                          <Text style={styles.reviewBtnText}>삭제하기</Text>
                        </TouchableOpacity>
                        <View style={styles.reviewBtnLine}></View>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>openReportPop('commComment', item.member_idx, item.comment_idx)}
                        >
                          <Text style={styles.reviewBtnText}>신고하기</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.reviewDepth, styles.mgt20]}>
                    <View style={styles.subReviewBox}></View>
                    <ImgDomain fileWidth={28} fileName={'profile_sample2.png'}/>
                    <View style={[styles.reviewInfo, styles.reviewInfo2]}>
                      <View style={styles.reviewNickDate}>
                        <Text style={styles.reviewNickText}>자동 생성 닉네임</Text>
                        <Text style={styles.reviewDateText}>12.31 22:22</Text>
                      </View>
                      <View style={styles.reviewCont}>
                        <Text style={styles.reviewContText}>댓글 내용이 입력됩니다. 내용을 자유롭게 입력해주세요.</Text>
                        {/* <Text style={[styles.reviewContText, styles.reviewContText2]}>삭제된 댓글입니다.</Text> */}
                      </View>
                      <View style={styles.reviewBtnBox}>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>deleteComment(item.comment_idx)}
                        >
                          <Text style={styles.reviewBtnText}>삭제하기</Text>
                        </TouchableOpacity>
                        <View style={styles.reviewBtnLine}></View>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>openReportPop('commComment', item.member_idx, item.comment_idx)}
                        >
                          <Text style={styles.reviewBtnText}>신고하기</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.reviewDepth,]}>
                    <ImgDomain fileWidth={28} fileName={'profile_sample.png'}/>
                    <View style={[styles.reviewInfo]}>
                      <View style={styles.reviewNickDate}>
                        <Text style={styles.reviewNickText}>자동 생성 닉네임</Text>
                        <Text style={styles.reviewDateText}>12.31 22:22</Text>
                      </View>
                      <View style={styles.reviewCont}>
                        <Text style={styles.reviewContText}>댓글 내용이 입력됩니다. 내용을 자유롭게 입력해주세요.</Text>
                        {/* <Text style={[styles.reviewContText, styles.reviewContText2]}>삭제된 댓글입니다.</Text> */}
                      </View>
                      <View style={styles.reviewBtnBox}>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>{
                            setReviewCont('');
                            setReviewType(1);
                            //setSubReivewNick(item.comment_nick);
                            //setSubReviewIdx(item.comment_idx);
                            setTimeout(function(){
                              scrollRef.current?.scrollTo({y:layout3.y+10});
                            }, 100)
                          }}
                        >
                          <Text style={styles.reviewBtnText}>대댓글달기</Text>
                        </TouchableOpacity>
                        <View style={styles.reviewBtnLine}></View>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>deleteComment(item.comment_idx)}
                        >
                          <Text style={styles.reviewBtnText}>삭제하기</Text>
                        </TouchableOpacity>
                        <View style={styles.reviewBtnLine}></View>
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          activeOpacity={opacityVal}
                          onPress={()=>openReportPop('commComment', item.member_idx, item.comment_idx)}
                        >
                          <Text style={styles.reviewBtnText}>신고하기</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
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
          <TouchableOpacity
            style={styles.dotPopBtn}
            activeOpacity={opacityVal}
            onPress={()=>{
              setDotPop(false);
              setDeletePop(true);
            }}
          >
            <Text style={styles.dotPopBtnText}>삭제하기</Text>
          </TouchableOpacity>
          <View style={styles.dotPopBtnLine}></View>
          <TouchableOpacity
            style={styles.dotPopBtn}
            activeOpacity={opacityVal}
            onPress={()=>openReportPop('exe', 2, 1)}
          >
            <Text style={styles.dotPopBtnText}>신고하기</Text>
          </TouchableOpacity>    
          {/* <View style={styles.dotPopBtnLine}></View>
          <TouchableOpacity
            style={styles.dotPopBtn}
            activeOpacity={opacityVal}
            onPress={()=>{setDotPop(false)}}
          >
            <Text style={styles.dotPopBtnText}>취소</Text>
          </TouchableOpacity> */}
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

      <Modal
				visible={deletePop}
				transparent={true}
				animationType={"none"}				
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 						
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => setDeletePop(false)}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>삭제</Text>							
						</View>				
						<View>
							<Text style={[styles.popTitleDesc, styles.mgt0]}>해당 게시물을 삭제하시겠습니까?</Text>						
						</View>
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => setDeletePop(false)}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>취소</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => submitDelete()}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{loading ? ( <View style={[styles.indicator]}><ActivityIndicator size="large" color="#D1913C" /></View> ) : null}
      {loading2 ? ( <View style={[styles.indicator, styles.indicator2]}><ActivityIndicator size="large" color="#D1913C" /></View> ) : null}
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

  cmView: {paddingVertical:30,paddingHorizontal:20},
  cmViewTitle: {marginBottom:20,},
  cmViewTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:19,color:'#1e1e1e'},
  cmViewTitle2: {},
  cmViewTitleText2: {fontFamily:Font.NotoSansSemiBold,fontSize:13,lineHeight:17,color:'#1e1e1e'},

  notData: {},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:13,color:'#666'},

	viewProf: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
  viewProfWrap: {flexDirection:'row',alignItems:'center',},
  viewProfImg: {alignItems:'center',justifyContent:'center',width:30,height:30,borderRadius:50,overflow:'hidden'},
  viewProfNick: {marginLeft:10,marginRight:6,},
  viewProfNickText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#1e1e1e'},
  viewProfDate: {},
  viewProfDateText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:16,color:'#888'},
  viewProfCont: {},
  viewProfContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:25,color:'#1e1e1e'},
  viewProfContImg: {marginTop:20,position:'relative',overflow:'hidden'},
	viewImg: {borderRadius:5,overflow:'hidden',marginTop:20,},
	viewZzim: {flexDirection:'row'},
	viewZzimBtn: {flexDirection:'row',alignItems:'center',marginTop:15,},
	zzimCnt: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:19,color:'#666',marginLeft:10,},
	viewCont: {marginTop:15,},
	viewContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:21,color:'#1e1e1e'},

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

  dotPop: {width:100,backgroundColor:'#fff',borderRadius:10,overflow:'hidden',position:'absolute',top:48+stBarHt,right:20,alignItems:'center'},
  dotPopBtn: {padding:12,},
  dotPopBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#1e1e1e'},
  dotPopBtnLine: {width:80,height:1,backgroundColor:'#EDEDED',borderRadius:5,},

  reportRadio: {paddingTop:10,paddingBottom:5,},
  reportRadioBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20,},
  reportRadioBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:22,color:'#1e1e1e'},

  input: { fontFamily: Font.NotoSansRegular, width: innerWidth-40, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
	input2: {width: innerWidth},

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

export default TodayExerciseView