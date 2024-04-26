import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';

import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const RegisterStep2 = ({ navigation, route }) => {
  const radioList = [
    { 'val': 1, 'txt': '인터넷 검색' },    
    { 'val': 2, 'txt': '앱스토어 검색' },
    { 'val': 3, 'txt': '지인 소개' },
    { 'val': 4, 'txt': '커뮤니티' },    
    { 'val': 5, 'txt': '인스타그램' },
    { 'val': 6, 'txt': '페이스북' },
    { 'val': 7, 'txt': '유튜브' },
    { 'val': 8, 'txt': '네이버' }, 
    
  ];
  
  const prvChk4 = route['params']['prvChk4'];

	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
  const [active, setActive] = useState(false);
  const [accessRoute, setAccessRoute] = useState(0);

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
  
  const nextStep = () => {
    if (accessRoute == 0) {
      ToastMessage('접속 경로를 선택해 주세요.');
			return false;
    }

    navigation.navigate('RegisterStep3', {
      prvChk4:prvChk4,
      accessRoute:accessRoute, 
    })
  }
  
  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={''} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
				behavior={behavior}
				style={{flex: 1}}
      >
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.cmWrap}>
              <View style={styles.cmTitleBox}>
                <Text style={styles.cmTitleText}>피지컬 매치를</Text>
              </View>
              <View style={[styles.cmTitleBox, styles.mgt8]}>
                <Text style={styles.cmTitleText}>어떻게 알게 되었나요?</Text>
              </View>

              <View style={styles.certBox}>
                {radioList.map((item, index) => {
                  return (
                    <TouchableOpacity 
                      key={index}
                      style={[styles.radioBtn, index != 0 ? styles.mgt10 : null, item.val == accessRoute ? styles.radioBtnOn : null]}
                      activeOpacity={opacityVal}
                      onPress={() => {
                        setAccessRoute(item.val);
                        setActive(true);
                      }}
                    >
                      {item.val == accessRoute ? (
                        <>
                        <Text style={[styles.radioBtnLabel, styles.radioBtnLabelOn]}>{item.txt}</Text>
                        <View style={[styles.circle, styles.circleOn]}>
                          <View style={styles.innerCircle}></View>
                        </View>
                        </>
                      ) : (
                        <>
                        <Text style={[styles.radioBtnLabel]}>{item.txt}</Text>
                        <View style={styles.circle}></View>
                        </>    
                      )}
                    </TouchableOpacity>
                  );
                })}              
              </View>
            </View>          
          </TouchableWithoutFeedback>
        </ScrollView>
        <View style={styles.nextFix}>
          <TouchableOpacity 
            style={[styles.nextBtn, active ? null : styles.nextBtnOff]}
            activeOpacity={opacityVal}
            onPress={() => nextStep()}
          >
            <Text style={styles.nextBtnText}>다음</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>      
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: { marginTop: 62 },
  
  cmWrap: {paddingVertical:30,paddingHorizontal:20},
  cmTitleBox: {},
  cmTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:22,lineHeight:24,color:'#1e1e1e'},
  cmDescBox: {marginTop:8,},
  cmDescText: { fontFamily: Font.NotoSansRegular, fontSize: 14, lineHeight: 20, color: '#666' },
  
  certBox: { marginTop: 40, },
  radioBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, 
    paddingVertical: 18, borderWidth: 1, borderColor: '#ededed', borderRadius: 5,
  },
  radioBtnOn: {borderColor:'#D1913C',backgroundColor:'#FFFCF8'},
  radioBtnLabel: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 20, color: '#888', position:'relative'},
  radioBtnLabelOn: {color:'#D1913C'},
  circle: { width: 20, height: 20, borderWidth: 1, borderColor: '#ededed', borderRadius: 100, },
  circleOn: { borderColor: '#D1913C' },
  innerCircle: {width:12,height:12,backgroundColor:'#D1913C',borderRadius:50,position:'absolute',left:3,top:2.9,},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtn2: {backgroundColor:'#fff', borderWidth:1, borderColor:'#243B55'},
  nextBtnOff: {backgroundColor:'#DBDBDB'},
  nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  nextBtnText2: {color:'#243B55'},
  
  mgt8: { marginTop: 8, },
  mgt10: { marginTop: 10,}
})

export default RegisterStep2