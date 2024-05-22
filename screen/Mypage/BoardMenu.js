import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
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
import ImgDomain from '../../assets/common/ImgDomain';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const BoardMenu = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);

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

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'공지/안내'}/>

			<ScrollView>				
				<View style={styles.btnView}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('Notice')}}
          >
            <Text style={styles.btnText}>공지사항</Text>
            <ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnLine]}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('UseGuide')}}
          >
            <Text style={styles.btnText}>이용 가이드</Text>
            <ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnLine]}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('Qna')}}
          >
            <Text style={styles.btnText}>{'Q&A'}</Text>
            <ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
          </TouchableOpacity>
        </View>

        <View style={styles.lineView}></View>

        <View style={styles.btnView}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('About')}}
          >
            <Text style={styles.btnText}>피지컬 매치란?</Text>
            <ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnLine]}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('CsCenter')}}
          >
            <Text style={styles.btnText}>고객센터</Text>
            <ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
          </TouchableOpacity>
        </View>

        <View style={styles.lineView}></View>

        <View style={styles.btnView}>
          <TouchableOpacity
            style={[styles.btn, styles.btn2]}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('Privacy')}}
          >
            <Text style={styles.btnText2}>개인정보 처리방침 / 이용약관</Text>
            <ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
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

  btnView: {paddingVertical:5,paddingHorizontal:20,},
  btn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:22,},
  btn2: {paddingVertical:15,},
  btnLine: {borderTopWidth:1,borderTopColor:'#EDEDED'},
  btnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#1e1e1e'},
  btnText2: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:19,color:'#888'},

	lineView: {height:6,backgroundColor:'#F2F4F6'},
})

export default BoardMenu