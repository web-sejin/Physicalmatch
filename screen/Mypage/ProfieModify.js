import React, {useState, useEffect, useRef, useCallback, Component} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import Swiper from 'react-native-web-swiper';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const ProfieModify = (props) => {
	const navigationUse = useNavigation();
  const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const swiperRef = useRef(null);

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
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'프로필 수정'} />

			<ScrollView>
        <View style={styles.swiperView}>
					<Swiper					
						ref={swiperRef}	
						autoplay={true}
						showsPagination={false}
						controlsProps={{
							prevTitle: '',
							nextTitle: '',
							dotsTouchable: true,
							DotComponent: ({ index, activeIndex, isActive, onPress }) => null              
						}}
						onIndexChanged={(e) => {
							//console.log(e);
							//setActiveDot(e);
						}}
					>
						<TouchableOpacity 
							style={styles.commuBanner}
							activeOpacity={opacityVal}
							onPress={()=>{}}
						>
							<AutoHeightImage width={widnowWidth} source={require('../../assets/image/social_banner.png')}	/>
						</TouchableOpacity>
						<TouchableOpacity 
							style={styles.commuBanner}
							activeOpacity={opacityVal}
							onPress={()=>{}}
						>
							<AutoHeightImage width={widnowWidth} source={require('../../assets/image/social_banner.png')}	/>
						</TouchableOpacity>
					</Swiper>
				</View>

        <View style={styles.cmWrap}>
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
                <View style={[styles.modiBtnState, styles.modiBtnState1, styles.mgr10]}>
                  <Text style={[styles.modiBtnStateText, styles.modiBtnStateText1]}>반려</Text>
                </View>                
                <AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
              </View>
            </View>
            <View style={styles.modiImgFlex}>
              <View style={[styles.modiImg]}>
                <AutoHeightImage width={36} source={require('../../assets/image/social_basic1.jpg')} />
              </View>
              <View style={[styles.modiImg, styles.mgl10]}>
                <AutoHeightImage width={36} source={require('../../assets/image/social_basic1.jpg')} />
              </View>
              <View style={[styles.modiImg, styles.mgl10]}>
                <AutoHeightImage width={36} source={require('../../assets/image/social_basic1.jpg')} />
              </View>
              <View style={[styles.modiImg, styles.mgl10]}>
                <AutoHeightImage width={36} source={require('../../assets/image/social_basic1.jpg')} />
              </View>
              <View style={[styles.modiImg, styles.mgl10]}>
                <AutoHeightImage width={36} source={require('../../assets/image/social_basic1.jpg')} />
              </View>
              <View style={[styles.modiImg, styles.mgl10]}>
                <AutoHeightImage width={36} source={require('../../assets/image/social_basic1.jpg')} />
              </View>
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
                <AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
              </View>
            </View>
            <View style={[styles.modiImgFlex, styles.mgt5]}>
              <View style={[styles.modiImg, styles.modiImg2]}>
                <AutoHeightImage width={45} source={require('../../assets/image/b_money2_1.png')} />
              </View>
              <View style={[styles.modiImg, styles.modiImg2, styles.mgl15]}>
                <AutoHeightImage width={45} source={require('../../assets/image/b_silver.png')} />
              </View>
              <View style={[styles.modiImg, styles.modiImg2, styles.mgl15]}>
                <AutoHeightImage width={45} source={require('../../assets/image/b_car1.png')} />
              </View>
              <View style={[styles.modiImg, styles.modiImg2, styles.mgl15]}>
                <AutoHeightImage width={45} source={require('../../assets/image/b_height2.png')} />
              </View>
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
                <View style={[styles.modiBtnState, styles.modiBtnState2]}>
                  <AutoHeightImage width={8} source={require('../../assets/image/icon_chk1.png')} />
                  <Text style={[styles.modiBtnStateText, styles.modiBtnStateText2, styles.mgl4]}>직장</Text>
                </View>
                <View style={[styles.modiBtnState, styles.modiBtnState2, styles.mgl4]}>
                  <AutoHeightImage width={8} source={require('../../assets/image/icon_chk1.png')} />
                  <Text style={[styles.modiBtnStateText, styles.modiBtnStateText2, styles.mgl4]}>결혼</Text>
                </View>
              </View>
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
                <AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
              </View>
            </View>
            <View style={[styles.modiLocFlex]}>
              <View style={styles.modiLocView}>
                <Text style={styles.modiLocViewText1}>주활동</Text>
                <Text style={styles.modiLocViewText2}>대전 중구</Text>
              </View>
              <View style={styles.modiLocView}>
                <Text style={styles.modiLocViewText1}>부활동</Text>
                <Text style={styles.modiLocViewText2}>대전 동구</Text>
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
                <AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
              </View>
            </View>
            <View style={[styles.modiCont, styles.mgt15]}>
              <Text style={styles.modiContTitle}>내 소개글</Text>
              <Text style={styles.modiContContent}>밝고 긍정적인 성격이며 새로운 것에 대한 도전을 즐기는 성향을 가지고 있습니다. 자기관리를 게을리 하지 않으...</Text>
            </View>
            <View style={[styles.modiCont, styles.mgt10]}>
              <Text style={styles.modiContTitle}>셀프 인터뷰</Text>
              <View style={[styles.modiQna, styles.mgt10]}>
                <View style={styles.modiQnaLeft}>
                  <Text style={styles.modiQnaLeftText}>1.</Text>
                </View>
                <View style={styles.modiQnaRight}>
                  <Text style={styles.modiQnaRightTitle}>질문 내용입니다.</Text>
                  <Text style={styles.modiContContent}>답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. </Text>
                </View>
              </View>
              <View style={[styles.modiQna, styles.mgt20]}>
                <View style={styles.modiQnaLeft}>
                  <Text style={styles.modiQnaLeftText}>2.</Text>
                </View>
                <View style={styles.modiQnaRight}>
                  <Text style={styles.modiQnaRightTitle}>질문 내용입니다.</Text>
                  <Text style={styles.modiContContent}>답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. 답변 내용입니다. </Text>
                </View>
              </View>
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
                <AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
              </View>
            </View>
            <View style={[styles.modiLocFlex]}>
              <View style={[styles.modiLocView, styles.modiLocView2]}>
                <Text style={styles.modiLocViewText1}>최종학력</Text>
                <Text style={styles.modiLocViewText2}>대학교 졸업</Text>
              </View>
              <View style={[styles.modiLocView, styles.modiLocView2, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>직업</Text>
                <Text style={styles.modiLocViewText2}>디자이너</Text>
              </View>
              <View style={[styles.modiLocView, styles.modiLocView2, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>피지컬</Text>
                <Text style={styles.modiLocViewText2}>100cm · 00kg · 00% · 00kg</Text>
              </View>
              <View style={[styles.modiLocView, styles.modiLocView2, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>운동</Text>
                <Text style={styles.modiLocViewText2}>클라이밍</Text>
              </View>
              <View style={[styles.modiLocView, styles.modiLocView2, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>체형</Text>
                <Text style={styles.modiLocViewText2}>선택사항 · 선택사항 · 선택사항</Text>
              </View>
              <View style={[styles.modiLocView, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>음주</Text>
                <Text style={styles.modiLocViewText2}>선택사항</Text>
              </View>
              <View style={[styles.modiLocView, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>흡연</Text>
                <Text style={styles.modiLocViewText2}>선택사항</Text>
              </View>
              <View style={[styles.modiLocView, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>MBTI</Text>
                <Text style={styles.modiLocViewText2}>E(I)NFJ</Text>
              </View>
              <View style={[styles.modiLocView, styles.mgt10]}>
                <Text style={styles.modiLocViewText1}>종교</Text>
                <Text style={styles.modiLocViewText2}>무교</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modiBtn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('MyDate')}}
          >
            <View style={styles.modiBtnTop}>
              <View style={styles.modiBtnTopLeft}>
                <Text style={styles.modiBtnTopLeftText}>연애 및 결혼관</Text>
              </View>
              <View style={styles.modiBtnTopRight}>
                <View style={styles.modiBtnTopRightView}>
                  <Text style={styles.modiBtnTopRightViewText}>프로틴 00개 혜택</Text>
                </View>
                <AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modiBtn, styles.modiBtn2]}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('MyHobby')}}
          >
            <View style={styles.modiBtnTop}>
              <View style={styles.modiBtnTopLeft}>
                <Text style={styles.modiBtnTopLeftText}>취미·관심사 키워드</Text>
              </View>
              <View style={styles.modiBtnTopRight}>
                <AutoHeightImage width={7} source={require('../../assets/image/icon_arr8.png')} />
              </View>
            </View>
          </TouchableOpacity>
        </View>        
			</ScrollView>

      {/* 비회원이라면 노출 */}
      <View style={styles.nextFix}>
        <TouchableOpacity 
          style={[styles.nextBtn]}
          activeOpacity={opacityVal}
          onPress={() => {}}
        >
          <Text style={styles.nextBtnText}>[비회원용]프로필 재심사 등록</Text>
        </TouchableOpacity>
      </View>

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
	
	swiperView: {height: widnowWidth/4.9,backgroundColor:'#fff'},	
  cmWrap: {paddingHorizontal:20,paddingTop:5,},

  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:52,color:'#fff'},

  modiBtn: {paddingVertical:25,borderBottomWidth:1,borderBottomColor:'#EDEDED'},
  modiBtn2: {borderBottomWidth:0,},
  modiBtnTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  modiBtnTopLeft: {},
  modiBtnTopLeftText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:19,color:'#1e1e1e'},
  modiBtnTopRight: {flexDirection:'row',alignItems:'center'},
  modiBtnTopRightView: {},
  modiBtnTopRightViewText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#888',marginRight:20,},
  modiBtnState: {flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:6,height:18,borderRadius:20,},
  modiBtnState1: {backgroundColor:'rgba(255,120,122,0.15)'},
  modiBtnState2: {backgroundColor:'#D1913C'},
  modiBtnStateText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,},
  modiBtnStateText1: {color:'#DE282A'},
  modiBtnStateText2: {color:'#fff'},
  modiImgFlex: {flexDirection:'row',alignItems:'center',marginTop:15,},
  modiImg: {alignItems:'center',justifyContent:'center',width:36,height:36,borderRadius:2,overflow:'hidden'},
  modiImg2: {width:45,height:45,borderRadius:0,marginTop:10,},

  modiLocFlex: {flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',marginTop:15,},
  modiLocView: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:(innerWidth/2)-5,height:48,backgroundColor:'#F9FAFB',borderRadius:5,paddingHorizontal:15,},
  modiLocView2: {width:innerWidth},
  modiLocViewText1: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#1e1e1e'},
  modiLocViewText2: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#888'},

  modiCont: {padding:15,backgroundColor:'#F9FAFB',borderRadius:5,},
  modiContTitle: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},
  modiContContent: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:19,color:'#1e1e1e',marginTop:5,},
  modiQna: {flexDirection:'row'},
  modiQnaLeft: {},
  modiQnaLeftText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#1e1e1e',},
  modiQnaRight: {paddingLeft:3,},

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
  mgr10: {marginRight:10},
  mgr15: {marginRight:15},
	mgl0: {marginLeft:0},
  mgl4: {marginLeft:4},
  mgl10: {marginLeft:10},
  mgl15: {marginLeft:15},
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