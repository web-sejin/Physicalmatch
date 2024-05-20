import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';

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

const Privacy = (props) => {
  const data = [
    {idx:1, subject:'개인정보 처리방침', content:'내용이 입력됩니다.1', open:false,},
    {idx:2, subject:'서비스 이용약관', content:'내용이 입력됩니다.5', open:false,},
  ]

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [st1, setSt1] = useState(false);
  const [st2, setSt2] = useState(false);
  const [onOff, setOnOff] = useState();
  const [onOffBg, setOnOffBg] = useState();
  const [onOffEvent, setOnOffEvent] = useState(new Animated.Value(0));

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
    let change = 0;
    
    if(onOff){
      change = 15;
      setOnOffBg('#243b55');
    }else{
      change = 0;
      setOnOffBg('#F8F9FA');
    }

		Animated.timing(
			onOffEvent, {toValue: change, duration: 100, useNativeDriver: false,}
		).start();
	}, [onOff]);

  const chgOnOff = async () => {
    setOnOff(!onOff);
  }

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'약관'}/>

      <ScrollView>
        <View style={[styles.cmWrap, styles.pdt10]}>
          <View style={[styles.guidePopContBox]}>
            <TouchableOpacity
              style={[styles.guidePopContBtn, st1 ? styles.guidePopContBtn2 : null]}
              activeOpacity={opacityVal}
              onPress={()=>{setSt1(!st1)}}
            >
              <View style={{width:innerWidth-20}}>
                <View style={styles.guidePopContBtnTitle}>
                  <Text style={styles.guidePopContBtnText}>개인정보 처리방침</Text>
                </View>
              </View>
              {st1 ? (
                <AutoHeightImage width={10} source={require('../../assets/image/icon_arr4.png')} />
              ) : (
                <AutoHeightImage width={10} source={require('../../assets/image/icon_arr3.png')} />
              )}
            </TouchableOpacity>
            {st1 ? (
            <View style={styles.guidePopCont2}>
              <Text style={styles.guidePopCont2Text}>내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. </Text>
            </View>
            ) : null}
          </View>
          <View style={[styles.guidePopContBox]}>
            <TouchableOpacity
              style={[styles.guidePopContBtn, st2 ? styles.guidePopContBtn2 : null]}
              activeOpacity={opacityVal}
              onPress={()=>{setSt2(!st2)}}
            >
              <View style={{width:innerWidth-20}}>
                <View style={styles.guidePopContBtnTitle}>
                  <Text style={styles.guidePopContBtnText}>서비스 이용약관</Text>
                </View>
              </View>
              {st2 ? (
                <AutoHeightImage width={10} source={require('../../assets/image/icon_arr4.png')} />
              ) : (
                <AutoHeightImage width={10} source={require('../../assets/image/icon_arr3.png')} />
              )}
            </TouchableOpacity>
            {st2 ? (
            <View style={styles.guidePopCont2}>
              <Text style={styles.guidePopCont2Text}>내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. 내용이 입력됩니다. </Text>
            </View>
            ) : null}
          </View>
        </View>

        <View style={styles.lineView}></View>

        <View style={[styles.cmWrap, styles.onOff]}>
          <View style={styles.onOffInfo}>
            <Text style={styles.onOffInfoTitle}>개인정보 수집 및 이용 동의</Text>
            <Text style={styles.onOffInfoDesc}>홍보 및 마케팅 목적</Text>
          </View>
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

  cmWrap: {paddingVertical:30,paddingHorizontal:20,},
	guidePopContBox: {},
	guidePopContBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',position:'relative',paddingVertical:20,borderBottomWidth:1,borderBottomColor:'#DBDBDB'},
	guidePopContBtn2: {borderBottomWidth:0,paddingBottom:11,},
	guidePopContBtnTitle: {flexDirection:'row',alignItems:'center',},
	guidePopContBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginLeft:2,},
	guidePopCont2: {paddingVertical:10,paddingHorizontal:15,backgroundColor:'#F9FAFB',borderBottomWidth:1,borderBottomColor:'#DBDBDB'},
	guidePopCont2Text: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e',},

  onOff: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  onOffInfo: {},
  onOffInfoTitle: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},
  onOffInfoDesc: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:16,color:'#888888',marginTop:7,},
  onOffBtn: {width:36,height:15,backgroundColor:'rgba(36,59,85,0.4)',borderRadius:20,position:'relative'},
  onOffBtn2: {backgroundColor:'#DBDBDB'},
  onOffCircle: {width:21,height:21,borderRadius:50,position:'absolute',left:0,top:-3,},  

	red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

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

export default Privacy