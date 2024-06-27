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

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const AccountSet = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [memberIdx, setMemberIdx] = useState();
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [modal4, setModal4] = useState(false);

  const [onOff, setOnOff] = useState(true);
  const [onOffBg, setOnOffBg] = useState();
  const [onOffEvent, setOnOffEvent] = useState(new Animated.Value(0));

  const [onOff2, setOnOff2] = useState(true);
  const [onOffBg2, setOnOffBg2] = useState();
  const [onOffEvent2, setOnOffEvent2] = useState(new Animated.Value(0));

  const [cardOffList, setCardOffList] = useState([]);
  const [cardOffVal, setCardOffVal] = useState();
  const [cardOffValString, setCardOffValString] = useState('');

  const [accountoffList, setAccountOffList] = useState([]);
  const [accountoffVal, setAccountOffVal] = useState();
  const [accountoffValString, setAccountOffValString] = useState('');

  const [leaveValList, setLeaveValList] = useState([]);
  const [leaveVal, setLeaveVal] = useState();
  const [leaveValString, setLeaveValString] = useState('');

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
    const unsubscribe = navigationUse.addListener('beforeRemove', (e) => {
      // 뒤로 가기 이벤트가 발생했을 때 실행할 로직을 작성합니다.
      // 여기에 원하는 동작을 추가하세요.
      // e.preventDefault();를 사용하면 뒤로 가기를 막을 수 있습니다.
      //console.log('preventBack22 ::: ',preventBack);
      if (preventBack) {        
				setModal2(false);
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

  useEffect(() => {
    if(memberIdx){
      getPushList();
    }
    getDisableList();
    getDisableList2();
    getDisableList3();
  }, [memberIdx]);

  useEffect(() => {		
    let change = 0; 
    if(onOff){ change = 15; setOnOffBg('#243b55'); }else{ change = 0; setOnOffBg('#F8F9FA'); }
		Animated.timing(onOffEvent, {toValue: change, duration: 100, useNativeDriver: false,}).start();    
	}, [onOff]);

  useEffect(() => {		
    let change = 0;
    if(onOff2){ change = 15; setOnOffBg2('#243b55'); }else{ change = 0; setOnOffBg2('#F8F9FA'); }
		Animated.timing(onOffEvent2, {toValue: change, duration: 100, useNativeDriver: false,}).start();    
	}, [onOff2]);

  const chgOnOff = async () => {
    if(onOff){
      setModal2(true);
      setPreventBack(true);
    }else{
      setOnOff(true);
      updatePushList('card_yn', true);
    }
  }

  const chgOnOff2 = async () => {    
    if(onOff2){
      setModal3(true);
      setPreventBack(true);
    }else{
      setOnOff2(true);
      updatePushList('available_yn', true);
    }
  }

  const logout = async () => {        
    let sData = {
			basePath: "/api/member/",
			type: "SetLogout",
      member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
		//console.log(response);
    if(response.code == 200){
      AsyncStorage.removeItem('member_id');
      AsyncStorage.removeItem('member_idx');

      setModal(false);
      navigation.navigate('Intro2');
    }
  }

  const updatePushList = async (col, state) => {
    let yn = '';
    if(state){
      yn = 'y';
    }else{
      yn = 'n';
    }
    let sData = {
			basePath: "/api/member/",
			type: "SetPushList",
			member_idx: memberIdx,
			push_col: col,
      push_yn: yn 
		};
    const response = await APIs.send(sData);
    //console.log(response);
  }

  const submit = async (v, col, state) => {
    if(v == 'card'){
      if(!cardOffVal){
        ToastMessage('비활성화 사유를 선택해 주세요.');
        return false;
      }

      let sData = {
        basePath: "/api/member/",
        type: "SetPushList",
        member_idx: memberIdx,
        push_col: col,
        push_yn: state,
        push_reason: cardOffValString,
      };
      const response = await APIs.send(sData);
      if(response.code == 200){
        setOnOff(false);
        setModal2(false);
        setPreventBack(false);
        setCardOffVal();
        setCardOffValString('');
        ToastMessage('카드가 비활성화 되었습니다.');
      }
    }else if(v == 'account'){
      if(!accountoffVal){
        ToastMessage('비활성화 사유를 선택해 주세요.');
        return false;
      }

      let sData = {
        basePath: "/api/member/",
        type: "SetPushList",
        member_idx: memberIdx,
        push_col: col,
        push_yn: state,
        push_reason: accountoffValString,
      };
      const response = await APIs.send(sData);
      //console.log(response);
      if(response.code == 200){
        setOnOff2(false);
        setModal3(false);
        setPreventBack(false);
        setAccountOffVal();
        setAccountOffValString('');
        ToastMessage('계정이 비활성화 되었습니다.');

        navigation.navigate('Disable');
      }

    }else if(v == 'leave'){
      if(!leaveVal){
        ToastMessage('탈퇴 사유를 선택해 주세요.');
        return false;
      }

      let sData = {
        basePath: "/api/member/",
        type: "SetLeaveMember",
        member_idx: memberIdx,
        leave_reason: leaveValString,
      };
      const response = await APIs.send(sData);
      if(response.code == 200){
        AsyncStorage.removeItem('member_id');
        AsyncStorage.removeItem('member_idx');
        setModal4(false);
        setPreventBack(false);
        setLeaveVal();
        setLeaveValString('');
        navigation.navigate('Intro2');
      }
    }
  }

  const getPushList = async () => {
    let sData = {
			basePath: "/api/member/",
			type: "GetPushList",
			member_idx: memberIdx,
			push_type: 1,
		};
		const response = await APIs.send(sData);
    if(response.code == 200){
      if(response.data.card_yn == 'y'){ setOnOff(true); }else{ setOnOff(false); }
      if(response.data.available_yn == 'y'){ setOnOff2(true); }else{ setOnOff2(false); }
    }
  }

  const getDisableList = async () => {    
    let sData = {
			basePath: "/api/etc/",
			type: "GetDisabledList",
			dr_type: 0,
		};
		const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      setCardOffList(response.data);
    }
  }

  const getDisableList2 = async () => {    
    let sData = {
			basePath: "/api/etc/",
			type: "GetDisabledList",
			dr_type: 1,
		};
		const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      setAccountOffList(response.data);
    }
  }

  const getDisableList3 = async () => {    
    let sData = {
			basePath: "/api/etc/",
			type: "GetDisabledList",
			dr_type: 2,
		};
		const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      setLeaveValList(response.data);
    }
  }

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'계정관리'}/>

			<ScrollView>				
				<View style={styles.btnView}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('ModifyLogin')}}
          >
            <Text style={styles.btnText}>로그인 정보 변경</Text>            
            <ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnLine]}
            activeOpacity={opacityVal}
            onPress={()=>setModal(true)}
          >
            <Text style={styles.btnText}>로그아웃</Text>
            <ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
          </TouchableOpacity>
        </View>

        <View style={styles.lineView}></View>
        
        <View style={styles.btnView}>
          <View style={[styles.btn]}>
            <Text style={styles.btnText}>카드 활성화</Text>
            <TouchableOpacity 
              style={[styles.onOffBtn, !onOff ? styles.onOffBtn2 : null]}
              activeOpacity={opacityVal}
              onPress={()=>chgOnOff()}
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
          <View style={[styles.btn, styles.btnLine]}>
            <Text style={styles.btnText}>계정 활성화</Text>
            <TouchableOpacity 
              style={[styles.onOffBtn, !onOff2 ? styles.onOffBtn2 : null]}
              activeOpacity={opacityVal}
              onPress={()=>chgOnOff2()}
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
          <TouchableOpacity
            style={[styles.btn, styles.btnLine]}
            activeOpacity={opacityVal}
            onPress={()=>setModal4(true)}
          >
            <Text style={styles.btnText}>회원탈퇴</Text>
            <ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
          </TouchableOpacity>
        </View>
			</ScrollView>

      {/* 로그아웃 컨펌 */}
      <Modal
				visible={modal}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setModal(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setModal(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setModal(false)}}
						>							
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>로그아웃 하시겠어요?</Text>
						</View>		
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.mgt50]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => setModal(false)}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => logout()}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      {/* 카드 비활성화 */}
      {modal2 ? (
      <>
        <TouchableOpacity 
          style={[styles.popBack, styles.popBack2]} 
          activeOpacity={1} 
          onPress={()=>{
            setModal2(false);
            setPreventBack(false);
            setCardOffVal();
            setCardOffValString('');
          }}
        >
        </TouchableOpacity>
        <View style={styles.prvPopBot}>
          <TouchableOpacity
            style={styles.pop_x}					
            onPress={() => {
              setModal2(false);
              setPreventBack(false);
              setCardOffVal();
              setCardOffValString('');
            }}
          >
            <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
          </TouchableOpacity>
          <ScrollView>
            <View style={styles.popScrWrap}>
              <View style={[styles.popTitle]}>
                <Text style={styles.popBotTitleText}>카드 비활성화</Text>							
                <Text style={[styles.popBotTitleDesc]}>· 타인에게 내 프로필이 소개되지 않습니다.</Text>
                <Text style={[styles.popBotTitleDesc]}>· 나에게 이성의 프로필이 소개 되지 않습니다.</Text>
                <Text style={[styles.popBotTitleDesc]}>· 기존 소개 되었던 카드 및 계정 어플 사용이 유지 됩니다.</Text>
              </View>		
              <View style={styles.popBotDesc}>
                <Text style={styles.popBotDescText}>비활성화 이유를 알려주세요</Text>
              </View>
              <View>
                {cardOffList.map((item,index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.reseonBtn, 
                        index == 0 ? styles.mgt0 : null,
                        styles.boxShadow2,
                        item.dr_idx == cardOffVal ? styles.reseonBtnOn : null
                      ]}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        setCardOffVal(item.dr_idx)
                        setCardOffValString(item.dr_content);
                      }}
                    >
                      <Text style={[styles.reseonBtnText, item.dr_idx == cardOffVal ? styles.reseonBtnTextOn : null]}>{item.dr_content}</Text>
                    </TouchableOpacity>
                  )
                })}            
              </View>
            </View>
          </ScrollView>
          <View style={[styles.popBtnBox]}>
            <TouchableOpacity 
              style={[styles.popBtn, cardOffVal ? null : styles.popBtnOff3]}
              activeOpacity={opacityVal}
              onPress={() => {submit('card', 'card_yn', 'n')}}
            >
              <Text style={styles.popBtnText}>비활성화</Text>
            </TouchableOpacity>				
          </View>
        </View>
      </>
      ) : null}

      {/* 계정 비활성화 */}
      {modal3 ? (
      <>
        <TouchableOpacity 
          style={[styles.popBack, styles.popBack2]} 
          activeOpacity={1} 
          onPress={()=>{
            setModal3(false);
            setPreventBack(false);
            setAccountOffVal();
            setAccountOffValString('');
          }}
        >
        </TouchableOpacity>
        <View style={styles.prvPopBot}>
          <TouchableOpacity
            style={styles.pop_x}					
            onPress={() => {
              setModal3(false);
              setPreventBack(false);
              setAccountOffVal();
              setAccountOffValString('');
            }}
          >
            <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
          </TouchableOpacity>
          <ScrollView>
            <View style={styles.popScrWrap}>
              <View style={[styles.popTitle]}>
                <Text style={styles.popBotTitleText}>계정 비활성화</Text>							
                <Text style={[styles.popBotTitleDesc]}>· 어플 계정 사용이 일시 중시 됩니다.</Text>
                <Text style={[styles.popBotTitleDesc]}>· 회원 자격과 계정은 유지됩니다.</Text>
              </View>		
              <View style={styles.popBotDesc}>
                <Text style={styles.popBotDescText}>비활성화 이유를 알려주세요</Text>
              </View>
              <View>
                {accountoffList.map((item,index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.reseonBtn, 
                        index == 0 ? styles.mgt0 : null,
                        styles.boxShadow2,
                        item.dr_idx == accountoffVal ? styles.reseonBtnOn : null
                      ]}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        setAccountOffVal(item.dr_idx);
                        setAccountOffValString(item.dr_content);
                      }}
                    >
                      <Text style={[styles.reseonBtnText, item.dr_idx == accountoffVal ? styles.reseonBtnTextOn : null]}>{item.dr_content}</Text>
                    </TouchableOpacity>
                  )
                })}            
              </View>
            </View>
          </ScrollView>
          <View style={[styles.popBtnBox]}>
            <TouchableOpacity 
              style={[styles.popBtn, accountoffVal ? null : styles.popBtnOff3]}
              activeOpacity={opacityVal}
              onPress={() => {submit('account', 'available_yn', 'n')}}
            >
              <Text style={styles.popBtnText}>비활성화</Text>
            </TouchableOpacity>				
          </View>
        </View>
      </>
      ) : null}

      {modal4 ? (
      <>
        <TouchableOpacity 
          style={[styles.popBack, styles.popBack2]} 
          activeOpacity={1} 
          onPress={()=>{
            setModal4(false);
            setPreventBack(false);
            setLeaveVal();
            setLeaveValString('');
          }}
        >
        </TouchableOpacity>
        <View style={styles.prvPopBot}>
          <TouchableOpacity
            style={styles.pop_x}					
            onPress={() => {
              setModal4(false);
              setPreventBack(false);
              setLeaveVal();
              setLeaveValString('');
            }}
          >
            <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
          </TouchableOpacity>
          <ScrollView>
            <View style={styles.popScrWrap}>
              <View style={[styles.popTitle]}>
                <Text style={styles.popBotTitleText}>정말 탈퇴하시겠어요?</Text>							
                <Text style={[styles.popBotTitleDesc]}>· 지금 탈퇴하시면 <Text style={styles.notoBold}>30일</Text>간 재가입이 불가합니다.</Text>
                <Text style={[styles.popBotTitleDesc]}>· 회원 자격과 계정이 삭제됩니다.</Text>
              </View>		
              <View style={styles.popBotDesc}>
                <Text style={styles.popBotDescText}>탈퇴 이유를 알려주세요</Text>
              </View>
              <View>
                {leaveValList.map((item,index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.reseonBtn, 
                        index == 0 ? styles.mgt0 : null,
                        styles.boxShadow2,
                        item.dr_idx == leaveVal ? styles.reseonBtnOn : null
                      ]}
                      activeOpacity={opacityVal}
                      onPress={()=>{
                        setLeaveVal(item.dr_idx);
                        setLeaveValString(item.dr_content);
                      }}
                    >
                      <Text style={[styles.reseonBtnText, item.dr_idx == leaveVal ? styles.reseonBtnTextOn : null]}>{item.dr_content}</Text>
                    </TouchableOpacity>
                  )
                })}            
              </View>
            </View>
          </ScrollView>
          <View style={[styles.popBtnBox]}>
            <TouchableOpacity 
              style={[styles.popBtn, leaveVal ? null : styles.popBtnOff3]}
              activeOpacity={opacityVal}
              onPress={() => {submit('leave')}}
            >
              <Text style={styles.popBtnText}>탈퇴하기</Text>
            </TouchableOpacity>				
          </View>
        </View>
      </>
      ) : null}

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

  btnView: {paddingVertical:5,paddingHorizontal:20,},
  btn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:22,},
  btn2: {paddingVertical:15,},
  btnLine: {borderTopWidth:1,borderTopColor:'#EDEDED'},
  btnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#1e1e1e'},
  btnText2: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:19,color:'#888'},

  onOff: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
  onOffInfo: {},
  onOffInfoTitle: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},
  onOffInfoTitle2: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:17,},
  onOffInfoDesc: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:16,color:'#888888',marginTop:7,},
  onOffBtn: {width:36,height:15,backgroundColor:'rgba(36,59,85,0.4)',borderRadius:20,position:'relative'},
  onOffBtn2: {backgroundColor:'#DBDBDB'},
  onOffCircle: {width:21,height:21,borderRadius:50,position:'absolute',left:0,top:-3,}, 

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
	popBtnBox: {paddingHorizontal:20,marginTop:30,},
	popBtnBoxFlex: {flexDirection:'row',justifyContent:'space-between',paddingHorizontal:0,},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtn2: {width:(innerWidth/2)-25,},
	popBtnOff: {backgroundColor:'#EDEDED',},
	popBtnOff2: {backgroundColor:'#fff',marginTop:10,},
  popBtnOff3: {backgroundColor:'#888888',},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

  prvPopBot: {width:widnowWidth,paddingTop:50,paddingBottom:30,backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,position:'absolute',bottom:0,},
	prvPopBot2: {width:widnowWidth,position:'absolute',bottom:0,},
  popScrWrap: {paddingHorizontal:20,paddingBottom:10,},
	popBotTitleText: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1e1e1e',marginBottom:20,},
	popBotTitleDesc: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:19,color:'#243B55'},
  popBotDesc: {marginBottom:20,},
  popBotDescText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#888'},
  reseonBtn: {alignItems:'center',justifyContent:'center',width:innerWidth,height:48,backgroundColor:'#fff',marginTop:10,},
  reseonBtnOn: {shadowColor:'#D1913C',shadowOpacity:0.45,shadowRadius:4,elevation:10,borderWidth:1,borderColor:'rgba(209,145,60,0.2)'},
  reseonBtnText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:19,color:'#666'},
  reseonBtnTextOn: {fontFamily:Font.NotoSansMedium,color:'#D1913C'},

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
  boxShadow2: {
		borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.5,
		elevation: 4,
	},

  notoBold: {fontFamily:Font.NotoSansBold},
  gold: {color:'#D1913C'},

	lineView: {height:6,backgroundColor:'#F2F4F6'},
  mgt0: {marginTop:0},
  mgt5: {marginTop:5},
  mgt40: {marginTop:40},
  mgt50: {marginTop:50},
})

export default AccountSet