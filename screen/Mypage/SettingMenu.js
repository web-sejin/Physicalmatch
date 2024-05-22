import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import VersionCheck from 'react-native-version-check';

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

const SettingMenu = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [currVer, setCurrVer] = useState('');
  const [latestVer, setLatestVer] = useState('');
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);

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
    setCurrVer(VersionCheck.getCurrentVersion());  

    //추후에 스토어에 업로드 된 버전 넣어줘야 함
    //VersionCheck.getLatestVersion().then(latestVersion => {
      //console.log(latestVersion);   
    //});
  }, [])

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'설정'}/>

			<ScrollView>				
				<View style={styles.btnView}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('PushSet')}}
          >
            <Text style={styles.btnText}>PUSH 설정</Text>            
						<ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnLine]}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('BlockPeople')}}
          >
            <Text style={styles.btnText}>지인 차단</Text>
            <ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnLine]}
            activeOpacity={opacityVal}
            onPress={()=>{navigation.navigate('AccountSet')}}
          >
            <Text style={styles.btnText}>계정관리</Text>
            <ImgDomain fileWidth={6} fileName={'icon_arr8.png'}/>
          </TouchableOpacity>
        </View>
			</ScrollView>

      <View style={styles.appVersion}>
        <TouchableOpacity
          style={styles.appVersionBtn}
          activeOpacity={opacityVal}
          onPress={()=>{setModal(true);}}
        >
          <Text style={styles.appVersionBtnText}>사용 중인 앱 버전</Text>
        </TouchableOpacity>
        <View style={styles.appVersionLine}></View>
        <TouchableOpacity
          style={styles.appVersionBtn}
          activeOpacity={opacityVal}
          onPress={()=>{setModal2(true);}}
        >
          <Text style={styles.appVersionBtnText}>최신 버전</Text>
        </TouchableOpacity>
      </View>

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
							<Text style={styles.popTitleText}>사용 중인 앱 버전</Text>							
              <Text style={[styles.popTitleDesc]}>현재 사용 중인 앱의 버전은</Text>
              <Text style={[styles.popTitleDesc, styles.mgt5]}><Text style={[styles.gold, styles.notoBold]}>{currVer}</Text> 입니다.</Text>
						</View>		
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => setModal(false)}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      <Modal
				visible={modal2}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setModal2(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setModal2(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setModal2(false)}}
						>
							<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>최신 버전</Text>
              {latestVer != '' ? (
                <>
                  <Text style={[styles.popTitleDesc]}>앱의 최신 버전은</Text>
                  <Text style={[styles.popTitleDesc, styles.mgt5]}><Text style={[styles.gold, styles.notoBold]}>{latestVer}</Text> 입니다.</Text>
                </>
              ) : (
                <>
                  <Text style={[styles.popTitleDesc]}>스토어에 출시 전입니다.</Text>
                  <Text style={[styles.popTitleDesc, styles.mgt5]}>조금만 기다려 주세요.</Text>
                </>
              )}				
						</View>		
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => setModal2(false)}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

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

  appVersion: {flexDirection:'row',alignItems:'center',justifyContent:'center',paddingBottom:40},
  appVersionBtn: {},
  appVersionBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#DBDBDB'},
  appVersionLine: {width:1,height:10,backgroundColor:'#EDEDED',marginHorizontal:10,},

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
	popBtnBox: {marginTop:30,},
	popBtnBoxFlex: {flexDirection:'row',justifyContent:'space-between'},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtn2: {width:(innerWidth/2)-25,},
	popBtnOff: {backgroundColor:'#EDEDED',},
	popBtnOff2: {backgroundColor:'#fff',marginTop:10,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

  notoBold: {fontFamily:Font.NotoSansBold},
  gold: {color:'#D1913C'},

	lineView: {height:6,backgroundColor:'#F2F4F6'},
  mgt5: {marginTop:5,},
})

export default SettingMenu