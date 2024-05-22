import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Swiper from 'react-native-web-swiper';
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

const NewMember = (props) => {
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
  const [newCnt, setNewCnt] = useState(1);

  const swiperRef = useRef(null);
  const etcRef = useRef(null);

  const [activeDot, setActiveDot] = useState(0);
  const [zzim, setZzim] = useState(false);
  const [reviewState, setReviewState] = useState(true);
  const [reviewScore, setReviewScore] = useState(0);  
  const [reviewPop, setReviewPop] = useState(false);

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

  const fnReview = (v) => {
    setReviewScore(v);
    setReviewPop(true);
  }

  const reviewConfirm = async () => {
    setReviewState(false);
    //setReviewScore(0);
    setReviewPop(false);

		console.log('다음 회원으로 리셋');
  }

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
    }, 1000);
  }, []);
 
  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
				<TouchableOpacity 					
					style={styles.headerBackBtn} 
					activeOpacity={opacityVal}
					onPress={() => {navigation.goBack();}} 
				>
          <ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
				</TouchableOpacity>
        <View style={styles.headerDesc}>
          <Text style={styles.headerDescText}>💝 NEW 회원 3번 평가하면 프로틴 00개</Text>
        </View>
        <View style={styles.pointState}>
          <View style={styles.mgr5}><ImgDomain fileWidth={22} fileName={'coin.png'}/></View>          
          <View style={styles.mgr5}><ImgDomain fileWidth={22} fileName={'coin.png'}/></View>
          <View><ImgDomain fileWidth={22} fileName={'coin_off.png'}/></View>
        </View>
			</View>

      {newCnt > 0 ? (
        <>
        <ScrollView>
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
                    <ImgDomain fileWidth={12} fileName={'icon_cert.png'}/>
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
              <ImgDomain fileWidth={32} fileName={'icon_cont_school.png'}/>
              <View style={styles.cmInfoBoxCont}>
                <View style={styles.cmInfoBoxContTit}>
                  <Text style={styles.cmInfoBoxContTitText}>학력</Text>                  
                  <View style={styles.certIcon}>
                    <ImgDomain fileWidth={12} fileName={'icon_cert.png'}/>
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
            
            <View style={[styles.cmInfoBoxFlex]}>
              <View style={[styles.cmInfoBox, styles.cmInfoBox2]}>
                <ImgDomain fileWidth={32} fileName={'icon_cont_mbti.png'}/>
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
                <ImgDomain fileWidth={32} fileName={'icon_cont_rel.png'}/>
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
                <ImgDomain fileWidth={32} fileName={'icon_cont_drink.png'}/>
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
                <ImgDomain fileWidth={32} fileName={'icon_cont_smoke.png'}/>
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
                <ImgDomain fileWidth={32} fileName={'icon_cont_marry.png'}/>
                <View style={styles.cmInfoBoxCont}>
                  <View style={styles.cmInfoBoxContTit}>
                    <Text style={styles.cmInfoBoxContTitText}>혼인</Text>
                    <View style={styles.certIcon}>
                      <ImgDomain fileWidth={12} fileName={'icon_cert.png'}/>
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
                <ImgDomain fileWidth={32} fileName={'icon_cont_qna.png'}/>
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
                <ImgDomain fileWidth={32} fileName={'icon_cont_qna.png'}/>
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
        </ScrollView>

        <View style={styles.starBottom}>          
          <View style={styles.starArea}>
            <TouchableOpacity
              style={styles.starBtn}
              activeOpacity={reviewState ? opacityVal : 1}
              onPress={() => reviewState ? fnReview(1) : null}
            >
              {reviewScore > 0 ? (
                <ImgDomain fileWidth={45} fileName={'star_on.png'}/>
              ) : (
                <ImgDomain fileWidth={45} fileName={'star_off.png'}/>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.starBtn}
              activeOpacity={reviewState ? opacityVal : 1}
              onPress={() => reviewState ? fnReview(2) : null}
            >
              {reviewScore > 1 ? (
                <ImgDomain fileWidth={45} fileName={'star_on.png'}/>
              ) : (
                <ImgDomain fileWidth={45} fileName={'star_off.png'}/>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.starBtn}
              activeOpacity={reviewState ? opacityVal : 1}
              onPress={() => reviewState ? fnReview(3) : null}
            >
              {reviewScore > 2 ? (
                <ImgDomain fileWidth={45} fileName={'star_on.png'}/>
              ) : (
                <ImgDomain fileWidth={45} fileName={'star_off.png'}/>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.starBtn}
              activeOpacity={reviewState ? opacityVal : 1}
              onPress={() => reviewState ? fnReview(4) : null}
            >
              {reviewScore > 3 ? (
                <ImgDomain fileWidth={45} fileName={'star_on.png'}/>
              ) : (
                <ImgDomain fileWidth={45} fileName={'star_off.png'}/>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.starBtn, styles.mgr0]}
              activeOpacity={reviewState ? opacityVal : 1}
              onPress={() => reviewState ? fnReview(5) : null}
            >
              {reviewScore > 4 ? (
                <ImgDomain fileWidth={45} fileName={'star_on.png'}/>
              ) : (
                <ImgDomain fileWidth={45} fileName={'star_off.png'}/>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
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
                <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
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
        </>
      ) : (
        <View style={styles.notMember}>
          <View style={styles.notMemberWrap}>
            <ImgDomain fileWidth={57} fileName={'icon_dot3.png'}/>
            <View style={styles.notMemberTitle}>
              <Text style={styles.notMemberTitleText}>현재 평가할 회원이 없습니다.</Text>
            </View>
            <View style={styles.notMemberDesc}>
              <Text style={styles.notMemberDescText}>주변에 피지컬 매치의</Text>
              <Text style={styles.notMemberDescText}>좋은 회원들을 소개해주세요!</Text>
            </View>
            <View style={styles.notMemberDesc2}>
              <View style={styles.notMemberDesc2View}>
                <Text style={styles.notMemberDesc2Text}>신규회원에게 프로틴 00개 증정</Text>                
              </View>
              <ImgDomain fileWidth={15} fileName={'icon_heart2.png'}/>
            </View>
          </View>

          <TouchableOpacity
            style={styles.shareBtn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('MyInvite')}}
          >            
            <Text style={styles.shareBtnText}>친구 초대하기</Text>
          </TouchableOpacity>
        </View>
      )}

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
	fullScreen: { flex: 1, },
	indicator: { width:widnowWidth, height: widnowHeight, display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	

  DetailBackBtn: {width:54,height:48,position:'absolute',left:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},
  DetailDotBtn: {width:54,height:48,position:'absolute',right:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},
  
	swiperView: { height: widnowWidth*1.25,},
	swiperWrap: {},
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

  detailInfo1: {paddingHorizontal:20,paddingTop:15,paddingBottom:20,},
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

	starBottom: {borderTopWidth:1,borderTopColor:'#F2F4F6',paddingTop:17,paddingBottom:23,},
  reviewTitle: {},
  reviewTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:17,color:'#243B55',},
  starArea: {flexDirection:'row',alignItems:'center',justifyContent:'center',},
  starBtn: {marginRight:18},
  reviewDesc: {flexDirection:'row',alignItems:'center',justifyContent:'center',},
  reviewDescText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:16,color:'#888',position:'relative',top:0.5},

  header: {height:48,backgroundColor:'#fff',position:'relative',justifyContent:'center',paddingLeft:47,paddingRight:100,},
	headerBackBtn: {width:54,height:48,position:'absolute',left:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},	
  headerDesc: {position:'relative',top:1,},
  headerDescText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#1e1e1e'},
  pointState: {flexDirection:'row',alignItems:'center',position:'absolute',right:20},
  
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

  notMember: {alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'#F2F4F6'},
  notMemberWrap: {alignItems:'center',position:'relative',top:-100},
  notMemberTitle: {marginTop:48},
  notMemberTitleText: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#888888'},
  notMemberDesc: {marginTop:15,},
  notMemberDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:16,lineHeight:28,color:'#888888'},
  notMemberDesc2: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
  notMemberDesc2View: {marginTop:10,},
  notMemberDesc2Text: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:18,color:'#888888'},
  shareBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',width:innerWidth,height:52,backgroundColor:'#243B55',borderRadius:5,position:'absolute',left:20,bottom:50,},
	shareBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#fff'},
  
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
    shadowRadius: 5,
		elevation: 5,
	},
  boxShadow2: {borderRadius:35,},
  boxShadow3: {    
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

  mgt0: {marginTop:0},
  mgt5: {marginTop:5},
  mgt10: {marginTop:10},
  mgt20: {marginTop:20},
  mgt30: {marginTop:30},
  mgt40: {marginTop:40},
  mgt50: {marginTop:50},
  mgb0: {marginBottom:0,},
  mgb10: {marginBottom:10,},
  mgl0: {marginLeft:0,},
  mgr0: {marginRight:0,},
  mgr5: {marginRight:5,},
})

export default NewMember