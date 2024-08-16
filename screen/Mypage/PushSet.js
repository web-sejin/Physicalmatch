import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';
import { compose } from 'redux';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 1;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const PushSet = (props) => {
	const navigationUse = useNavigation();
  const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
  //console.log('userInfo ::: ', userInfo);
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [memberIdx, setMemberIdx] = useState();
  const [memberInfo, setMemberInfo] = useState();
  
  const [allControl, setAllControl] = useState(false);
  const [onOffAll, setOnOffAll] = useState();
  const [onOffAllBg, setOnOffAllBg] = useState();
  const [onOffAllEvent, setOnOffAllEvent] = useState(new Animated.Value(0));
  
  const [onOff, setOnOff] = useState();
  const [onOffBg, setOnOffBg] = useState();
  const [onOffEvent, setOnOffEvent] = useState(new Animated.Value(0));

  const [onOff2, setOnOff2] = useState();
  const [onOffBg2, setOnOffBg2] = useState();
  const [onOffEvent2, setOnOffEvent2] = useState(new Animated.Value(0));

  const [onOff3, setOnOff3] = useState();
  const [onOffBg3, setOnOffBg3] = useState();
  const [onOffEvent3, setOnOffEvent3] = useState(new Animated.Value(0));

  const [onOff4, setOnOff4] = useState();
  const [onOffBg4, setOnOffBg4] = useState();
  const [onOffEvent4, setOnOffEvent4] = useState(new Animated.Value(0));

  const [onOff5, setOnOff5] = useState();
  const [onOffBg5, setOnOffBg5] = useState();
  const [onOffEvent5, setOnOffEvent5] = useState(new Animated.Value(0));

  const [onOff6, setOnOff6] = useState();
  const [onOffBg6, setOnOffBg6] = useState();
  const [onOffEvent6, setOnOffEvent6] = useState(new Animated.Value(0));

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

      AsyncStorage.getItem('member_idx', (err, result) => {		
				//console.log('member_idx :::: ', result);		
				setMemberIdx(result);
			});
		}

    Keyboard.dismiss();
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

  useEffect(() => {
    if(memberIdx){
      getMemInfo();      
    }
  }, [memberIdx])

  useEffect(() => {		
    let change = 0; 
    if(onOffAll){ change = 15; setOnOffAllBg('#243b55'); }else{ change = 0; setOnOffAllBg('#F8F9FA'); }
		Animated.timing(onOffAllEvent, {toValue: change, duration: 100, useNativeDriver: false,}).start();
	}, [onOffAll]);
  
  useEffect(() => {		
    let change = 0; 
    if(onOff){ change = 15; setOnOffBg('#243b55'); }else{ change = 0; setOnOffBg('#F8F9FA'); }
		Animated.timing(onOffEvent, {toValue: change, duration: 100, useNativeDriver: false,}).start();
    chkOnOffState();
	}, [onOff]);

  useEffect(() => {		
    let change = 0;
    if(onOff2){ change = 15; setOnOffBg2('#243b55'); }else{ change = 0; setOnOffBg2('#F8F9FA'); }
		Animated.timing(onOffEvent2, {toValue: change, duration: 100, useNativeDriver: false,}).start();
    chkOnOffState();
	}, [onOff2]);

  useEffect(() => {		
    let change = 0;
    if(onOff3){ change = 15; setOnOffBg3('#243b55'); }else{ change = 0; setOnOffBg3('#F8F9FA'); }
		Animated.timing(onOffEvent3, {toValue: change, duration: 100, useNativeDriver: false,}).start();
    chkOnOffState();
	}, [onOff3]);

  useEffect(() => {		
    let change = 0;
    if(onOff4){ change = 15; setOnOffBg4('#243b55'); }else{ change = 0; setOnOffBg4('#F8F9FA'); }
		Animated.timing(onOffEvent4, {toValue: change, duration: 100, useNativeDriver: false,}).start();
    chkOnOffState();
	}, [onOff4]);

  useEffect(() => {		
    let change = 0;
    if(onOff5){ change = 15; setOnOffBg5('#243b55'); }else{ change = 0; setOnOffBg5('#F8F9FA'); }
		Animated.timing(onOffEvent5, {toValue: change, duration: 100, useNativeDriver: false,}).start();
    chkOnOffState();
	}, [onOff5]);

  useEffect(() => {		
    let change = 0;
    if(onOff6){ change = 15; setOnOffBg6('#243b55'); }else{ change = 0; setOnOffBg6('#F8F9FA'); }
		Animated.timing(onOffEvent6, {toValue: change, duration: 100, useNativeDriver: false,}).start();
    chkOnOffState();
	}, [onOff6]);

  const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);    
		if(response.code == 200){
			setMemberInfo(response.data);
      getPushList();
		}
	}

  const getPushList = async () => {
    let sData = {
			basePath: "/api/member/index.php",
			type: "GetPushList",
			member_idx: memberIdx,
			push_type: 0,
		};
		const response = await APIs.send(sData);    
    //console.log(response);
    if(response.code == 200){      
      if(response.data.match_push_yn == 'y'){ setOnOff(true); }else{ setOnOff(false); }
      if(response.data.social_push_yn == 'y'){ setOnOff2(true); }else{ setOnOff2(false); }
      if(response.data.community_push_yn == 'y'){ setOnOff3(true); }else{ setOnOff3(false); }
      if(response.data.reply_push_yn == 'y'){ setOnOff4(true); }else{ setOnOff4(false); }      
      if(response.data.system_push_yn == 'y'){ setOnOff5(true); }else{ setOnOff5(false); }
      if(response.data.event_push_yn == 'y'){ setOnOff6(true); }else{ setOnOff6(false); }
    }
  }

  const updatePushList = async (col, state) => {
    //console.log(col+" ::: "+state);
    let yn = '';
    if(state){
      yn = 'y';
    }else{
      yn = 'n';
    }
    let sData = {
			basePath: "/api/member/index.php",
			type: "SetPushList",
			member_idx: memberIdx,
			push_col: col,
      push_yn: yn 
		};
    const response = await APIs.send(sData);
    //console.log(response);
  }

  const chkOnOffState = () => {
    if(memberInfo?.member_type == 1){
      if(onOff && onOff2 && onOff3 && onOff4 && onOff5 && onOff6){
        setOnOffAll(true);
      }else{
        setOnOffAll(false);
      }
    }else{
      if(onOff5 && onOff6){
        setOnOffAll(true);
      }else{
        setOnOffAll(false);
      }
    }    
  }

  const chgOnOff = async () => {
    setOnOff(!onOff);
    updatePushList('match_push_yn', !onOff);
  }

  const chgOnOff2 = async () => {
    setOnOff2(!onOff2);
    updatePushList('social_push_yn', !onOff2);
  }

  const chgOnOff3 = async () => {
    setOnOff3(!onOff3);
    updatePushList('community_push_yn', !onOff3);
  }

  const chgOnOff4 = async () => {
    setOnOff4(!onOff4);
    updatePushList('reply_push_yn', !onOff4);
  }

  const chgOnOff5 = async () => {
    setOnOff5(!onOff5);
    updatePushList('system_push_yn', !onOff5);
  }

  const chgOnOff6 = async () => {
    setOnOff6(!onOff6);
    updatePushList('event_push_yn', !onOff6);
  }

  const chgOnOffAll = async () => {
    if(onOffAll){
      setOnOffAll(false);
      if(memberInfo?.member_type == 1){      
        setOnOff(false);
        setOnOff2(false);
        setOnOff3(false);
        setOnOff4(false);
      }
      setOnOff5(false);
      setOnOff6(false);
    }else{
      setOnOffAll(true);
      if(memberInfo?.member_type == 1){
        setOnOff(true);
        setOnOff2(true);
        setOnOff3(true);
        setOnOff4(true);
      }
      setOnOff5(true);
      setOnOff6(true);
    }    

    updatePushList('all', !onOffAll);
  }

  const notMember = () => {
		ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'PUSH 설정'}/>

      <ScrollView>
        <View style={[styles.cmWrap,]}>

          <View style={[styles.allSet]}>
            <View style={styles.onOff}>
              <View style={styles.onOffInfo}>
                <Text style={styles.onOffInfoTitle2}>전체 ON/OFF</Text>
              </View>
              <TouchableOpacity 
                style={[styles.onOffBtn, !onOffAll ? styles.onOffBtn2 : null]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  setAllControl(true);
                  chgOnOffAll();
                }}
              >
                <Animated.View 
                  style={{
                    ...styles.onOffCircle,
                    ...styles.boxShadow,
                    backgroundColor:onOffAllBg,
                    left:onOffAllEvent,
                  }}
                ></Animated.View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.mgt30]}>
            <View style={styles.cmTitle}>
              <Text style={styles.cmTitleText}>일반 PUSH</Text>
            </View>
            <View style={styles.onOff}>
              <View style={styles.onOffInfo}>
                <Text style={styles.onOffInfoTitle}>매칭 알림</Text>
                <Text style={styles.onOffInfoDesc}>호감, 좋아요, 매칭 도착 알림</Text>
              </View>
              <TouchableOpacity 
                style={[styles.onOffBtn, !onOff ? styles.onOffBtn2 : null, memberInfo?.member_type == 0 ? styles.onOffBtn3 : opacityVal]}
                activeOpacity={memberInfo?.member_type == 0 ? 1 : opacityVal}
                onPress={()=>{
                  if(memberInfo?.member_type != 0){  
                    setAllControl(false);
                    chgOnOff();
                  }
                }}
              >
                <Animated.View 
                  style={{
                    ...styles.onOffCircle,
                    ...styles.boxShadow,
                    backgroundColor:onOffBg,
                    left:onOffEvent,
                  }}
                ></Animated.View>
              </TouchableOpacity>
            </View>
            <View style={[styles.onOff, styles.mgt25]}>
              <View style={styles.onOffInfo}>
                <Text style={styles.onOffInfoTitle}>소셜 알림</Text>
                <Text style={styles.onOffInfoDesc}>소셜 신청, 수락, 거절, 댓글 도착 알림</Text>
              </View>
              <TouchableOpacity 
                style={[styles.onOffBtn, !onOff2 ? styles.onOffBtn2 : null, memberInfo?.member_type == 0 ? styles.onOffBtn3 : opacityVal]}
                activeOpacity={memberInfo?.member_type == 0 ? 1 : opacityVal}
                onPress={()=>{
                  if(memberInfo?.member_type != 0){  
                    setAllControl(false);
                    chgOnOff2();
                  }
                }}
              >
                <Animated.View 
                  style={{
                    ...styles.onOffCircle,
                    ...styles.boxShadow,
                    backgroundColor:onOffBg2,
                    left:onOffEvent2,
                  }}
                ></Animated.View>
              </TouchableOpacity>
            </View>
            <View style={[styles.onOff, styles.mgt25]}>
              <View style={styles.onOffInfo}>
                <Text style={styles.onOffInfoTitle}>커뮤니티 알림</Text>
                <Text style={styles.onOffInfoDesc}>프로필 교환 신청, 수락, 거절 도착 알림</Text>
              </View>
              <TouchableOpacity 
                style={[styles.onOffBtn, !onOff3 ? styles.onOffBtn2 : null, memberInfo?.member_type == 0 ? styles.onOffBtn3 : opacityVal]}
                activeOpacity={memberInfo?.member_type == 0 ? 1 : opacityVal}
                onPress={()=>{
                  if(memberInfo?.member_type != 0){  
                    setAllControl(false);
                    chgOnOff3();
                  }
                }}
              >
                <Animated.View 
                  style={{
                    ...styles.onOffCircle,
                    ...styles.boxShadow,
                    backgroundColor:onOffBg3,
                    left:onOffEvent3,
                  }}
                ></Animated.View>
              </TouchableOpacity>
            </View>
            <View style={[styles.onOff, styles.mgt25]}>
              <View style={styles.onOffInfo}>
                <Text style={styles.onOffInfoTitle}>커뮤니티 댓글 알림</Text>
                <Text style={styles.onOffInfoDesc}>커뮤니티 내 댓글, 대댓글 도착 알림</Text>
              </View>
              <TouchableOpacity 
                style={[styles.onOffBtn, !onOff4 ? styles.onOffBtn2 : null, memberInfo?.member_type == 0 ? styles.onOffBtn3 : opacityVal]}
                activeOpacity={memberInfo?.member_type == 0 ? 1 : opacityVal}
                onPress={()=>{
                  if(memberInfo?.member_type != 0){  
                    setAllControl(false);
                    chgOnOff4();
                  }
                }}
              >
                <Animated.View 
                  style={{
                    ...styles.onOffCircle,
                    ...styles.boxShadow,
                    backgroundColor:onOffBg4,
                    left:onOffEvent4,
                  }}
                ></Animated.View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.mgt50]}>
            <View style={styles.cmTitle}>
              <Text style={styles.cmTitleText}>시스템 PUSH</Text>
            </View>
            <View style={styles.onOff}>
              <View style={styles.onOffInfo}>
                <Text style={styles.onOffInfoTitle}>시스템 필수 알림</Text>
                <Text style={styles.onOffInfoDesc}>심사 통과, 거절, 신고 처리 등 알림</Text>
              </View>
              <TouchableOpacity 
                style={[styles.onOffBtn, !onOff5 ? styles.onOffBtn2 : null]}
                activeOpacity={opacityVal}
                onPress={()=>chgOnOff5()}
              >
                <Animated.View 
                  style={{
                    ...styles.onOffCircle,
                    ...styles.boxShadow,
                    backgroundColor:onOffBg5,
                    left:onOffEvent5,
                  }}
                ></Animated.View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.mgt50]}>
            <View style={styles.cmTitle}>
              <Text style={styles.cmTitleText}>이벤트 PUSH</Text>
            </View>
            <View style={styles.onOff}>
              <View style={styles.onOffInfo}>
                <Text style={styles.onOffInfoTitle}>이벤트/혜택 알림</Text>
                <Text style={styles.onOffInfoDesc}>이벤트, 할인, 무료 프로틴 등 혜택 알림</Text>
              </View>
              <TouchableOpacity 
                style={[styles.onOffBtn, !onOff6 ? styles.onOffBtn2 : null]}
                activeOpacity={opacityVal}
                onPress={()=>chgOnOff6()}
              >
                <Animated.View 
                  style={{
                    ...styles.onOffCircle,
                    ...styles.boxShadow,
                    backgroundColor:onOffBg6,
                    left:onOffEvent6,
                  }}
                ></Animated.View>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>

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
	gapBox: {height:80,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

  cmWrap: {paddingTop:30,paddingBottom:50,paddingHorizontal:20,},
	cmTitle: {marginBottom:30,},
  cmTitleText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#1e1e1e'},

  allSet: {paddingBottom:20,borderBottomWidth:1,borderBottomColor:'#DBDBDB'},
  onOff: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
  onOffInfo: {},
  onOffInfoTitle: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},
  onOffInfoTitle2: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:17,color:'#1e1e1e'},
  onOffInfoDesc: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:16,color:'#888888',marginTop:7,},
  onOffBtn: {width:36,height:15,backgroundColor:'rgba(36,59,85,0.4)',borderRadius:20,position:'relative'},
  onOffBtn2: {backgroundColor:'#DBDBDB'},
  onOffBtn3: {/*opacity:0.5*/},
  onOffCircle: {width:21,height:21,borderRadius:50,position:'absolute',left:0,top:-3,opacity:1,},

  boxShadow: {    
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
		elevation: 4,
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
  mgt15: {marginTop:15},
	mgt20: {marginTop:20},
  mgt25: {marginTop:25},
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

//export default PushSet
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
		member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
		member_out: (user) => dispatch(UserAction.member_out(user)), //회원탈퇴
	})
)(PushSet);