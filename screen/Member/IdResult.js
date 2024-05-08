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

const IdResult = ({navigation, route}) => {	
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
  const [certnumber, setCertnumber] = useState('');
  const [certSt, setCertSt] = useState(false);

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
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'아이디 찾기'} />
      <KeyboardAwareScrollView
        behavior="padding"
        keyboardShouldPersistTaps="always"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.cmWrap}>
            <View style={styles.cmTitleBox}>
              <Text style={styles.cmTitleText}>physical123</Text>
            </View>

            <View style={styles.cmDescBox}>
							<Text style={styles.cmDescText}>고객님의 정보와 일치하는 아이디는 위와 같습니다.</Text>
            </View>
          </View>          
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      <View style={styles.nextFix}>
				<TouchableOpacity 
					style={[styles.nextBtn, styles.nextBtn3]}
					activeOpacity={opacityVal}
					onPress={() => navigation.navigate('FindPw')}
				>
					<Text style={[styles.nextBtnText, styles.nextBtnText3]}>비밀번호 찾기</Text>
				</TouchableOpacity>
        <TouchableOpacity 
					style={[styles.nextBtn, styles.mgt10]}
					activeOpacity={opacityVal}
					onPress={() => navigation.navigate('Login')}
				>
					<Text style={styles.nextBtnText}>로그인</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: { marginTop: 62 },
  
  cmWrap: {paddingTop:60,paddingBottom:30,paddingHorizontal:20},
  cmTitleBox: {},
  cmTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:22,lineHeight:25,color:'#1e1e1e',textAlign:'center',},
  cmDescBox: {marginTop:50,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666',textAlign:'center'},

  certBox: {marginTop:45,},
	
	findInfo: { width:192, paddingTop: 8, paddingBottom:7, paddingHorizontal: 14, borderWidth: 1, borderColor: '#EDEDED', borderRadius:50,marginVertical: 30, },
	findInfoText: {fontFamily:Font.NotoSansRegular, fontSize:12, lineHeight:14,color:'#666'},
  
  nextFix: {height:174,paddingHorizontal:20,paddingTop:10,},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtn2: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#243B55' },
  nextBtn3: {backgroundColor:'#fff',},
  nextBtnOff: {backgroundColor:'#DBDBDB'},
  nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  nextBtnText2: { color: '#243B55' },
  nextBtnText3: {color:'#141E30'},
  
  mgt8: { marginTop: 8, },
  mgt10: { marginTop: 10, }
  
})

export default IdResult