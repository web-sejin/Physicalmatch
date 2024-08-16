import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';

import APIs from "../../assets/APIs";
import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const FindPw = (props) => {	
  const {navigation, route} = props;
	const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
  const [id, setId] = useState(params?.result_id);
  const [certnumber, setCertnumber] = useState('');
  const [certSt, setCertSt] = useState(false);
  const [certIdx, setCertIdx] = useState();

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
      
      if(params?.certState == 'y'){
        setCertSt(true);
        setCertIdx(params?.idx);
      }
		}
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);
  
  const fnCert = async () => {
		if(id == ""){
			ToastMessage('아이디를 입력해 주세요.');
			return false;
		}

    navigation.navigate('Certification', {type:'Pw_find', member_id:id});

    // let sData = {
    //   basePath: "/api/member/",
    //   type: 'IsPass',
    //   pass_type: 2,
    //   member_phone: '010-0000-0000',
    //   member_id: id,
    //   test_yn: 'y'
    // }
    // const response = await APIs.send(sData);    
    // if(response.code == 200){
    //   setCertnumber('010-0000-0000');
    //   setCertSt(true);
    // }else{
    //   ToastMessage('일치하는 정보가 없습니다.');
    //   setCertSt(false);
    // }
  }

  const result_pw = async () => {
    if(id == ""){
			ToastMessage('아이디를 입력해 주세요.');
			return false;
    }
    
    if(!certSt){
			ToastMessage('번호 인증을 완료해 주세요.');
			return false;
    }
    
    // let sData = {
		// 	basePath: "/api/member/",
		// 	type: "SetFindPw",
    //   member_id: id,
		// 	member_phone: certnumber,
		// };

		// const response = await APIs.send(sData);
    // console.log(response);
    // if(response.code == 200){
    //   navigation.navigate('PwResult', {idx:response.data});
    // }else{ 
    //   ToastMessage('일치하는 정보가 없습니다.');
    //   return false;
    // } 
    navigation.navigate('PwResult', {idx:certIdx});
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'비밀번호 찾기'} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
				behavior={behavior}
				style={{flex: 1}}
      >
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.cmWrap}>
              <View style={styles.cmTitleBox}>
                <Text style={styles.cmTitleText}>아이디</Text>
              </View>
              <View style={styles.loginIptBox}>
                <TextInput
                  value={id}
                  onChangeText={(v) => {setId(v)}}
                  placeholder={'아이디를 입력해 주세요.'}
                  placeholderTextColor="#DBDBDB"
                  style={[styles.input]}
                  returnKyeType='done'
                  //onSubmitEditing={}
                />
              </View>

              <View style={styles.certBox}>
                <TouchableOpacity 
                  style={[styles.nextBtn, styles.nextBtn2]}
                  activeOpacity={opacityVal}
                  onPress={() => fnCert()}
                >
                  <Text style={[styles.nextBtnText, styles.nextBtnText2]}>휴대폰 번호 인증</Text>
                </TouchableOpacity>
              </View>
            </View>          
          </TouchableWithoutFeedback>
        </ScrollView>
        <View style={styles.nextFix}>
          <TouchableOpacity 
            style={[styles.nextBtn, certSt ? null : styles.nextBtnOff]}
            activeOpacity={opacityVal}
            onPress={() => result_pw()}
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
  cmTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:22,lineHeight:25,color:'#1e1e1e'},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

  loginIptBox: {marginTop:15,},
  input: { fontFamily: Font.NotoSansRegular, width: innerWidth, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
  certBox: {marginTop:40,},
	
	findInfo: { width:192, paddingTop: 8, paddingBottom:7, paddingHorizontal: 14, borderWidth: 1, borderColor: '#EDEDED', borderRadius:50,marginVertical: 30, },
	findInfoText: {fontFamily:Font.NotoSansRegular, fontSize:12, lineHeight:14,color:'#666'},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtn2: {backgroundColor:'#fff', borderWidth:1, borderColor:'#243B55'},
  nextBtnOff: {backgroundColor:'#DBDBDB'},
  nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  nextBtnText2: {color:'#243B55'},
  
  mgt8: {marginTop:8,}
})

export default FindPw