import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';

import APIs from '../../assets/APIs';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const paddTop = Platform.OS === 'ios' ? 0 : 15;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

LocaleConfig.locales['fr'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: "오늘"
};
LocaleConfig.defaultLocale = 'fr';

const TodayExerciseWrite = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberIdx, setMemberIdx] = useState();

  const [state, setState] = useState(false);    ;
  const [phoneImage, setPhoneImage] = useState({});
  const [content, setContent] = useState('');  

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
		}else{
			//console.log("isFocused");      
			setRouteLoad(true);
			setPageSt(!pageSt);

      AsyncStorage.getItem('member_idx', (err, result) => {
				//console.log('member_idx :::: ', result);
				setMemberIdx(result);
			});
		}

		Keyboard.dismiss();
		Toast.hide();
    setLoading(false);
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
    let totalReq = 1;
    let currReq = 0;
    
    if(phoneImage.path != '' && phoneImage.path != undefined){
      currReq++;
    }

    //console.log(currReq+'/'+totalReq);
    if(currReq == totalReq){
      setState(true);
    }else{
      setState(false);
    }
  }, [phoneImage]);

  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 992,
      height: 992,
      //cropping: true,
    })
		.then(image => {      
			let selectObj = {path: image.path, mime: image.mime}			
      console.log(selectObj);
      setPhoneImage(selectObj);
		})
		.finally(() => {
      
		});
  }

  const uploadUpdate = async () => { 
    if(phoneImage.path == '' || phoneImage.path == undefined){
      ToastMessage('사진을 등록해 주세요.');
      return false;
    }

    Keyboard.dismiss();
    //setLoading(true);

    let sData = {
			basePath: "/api/community/",
			type: "SetCommunity",
      member_idx: memberIdx,            
      comm_content: content,
		};
    
    let submitState = false;
    let fileData = [];
    if(phoneImage.path != undefined){
      fileData[0] = {uri: phoneImage.path, name: 'community_image.png', type: phoneImage.mime};
      sData.comm_files = fileData;

      const formData = APIs.makeFormData(sData)
      const response = await APIs.multipartRequest(formData);
      //console.log('111 ', response);
      if(response.code == 200){
        submitState = true;
      }
    }else{
      const response = await APIs.send(sData);    
      //console.log('222 ', response);
      if(response.code == 200){
        submitState = true;
      }
    }

      
    if(submitState){      
      ToastMessage('오운완이 작성되었습니다.');
      setPreventBack(false);
      setTimeout(function(){
        setLoading(false);
        navigation.navigate('TabNavigation', {screen:'TodayExercise', params : {reload:true, writeType:1}});
      }, 200)
    }
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <Header navigation={navigation} headertitle={'오운완 등록'} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior={behavior}
        style={{flex: 1}}
      >
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <View style={[styles.cmWrap, styles.pdb20]}>
                <View>
                  <View style={styles.imgBox}>
                    <TouchableOpacity
                      style={[styles.imgBtn, phoneImage.path != '' && phoneImage.path != undefined ? styles.imgBtn2 : null]}
                      activeOpacity={opacityVal}
                      onPress={() => chooseImage()}
                    >
                      {phoneImage.path != '' && phoneImage.path != undefined ? (
                        <AutoHeightImage width={220} source={{ uri: phoneImage.path }} />
                      ) : (
                        <ImgDomain fileWidth={36} fileName={'icon_add_img_back.png'}/>
                      )}
                    </TouchableOpacity>
                  </View>                  
                </View>
                <View style={styles.mgt30}>
                  <TextInput
                    value={content}
                    onChangeText={(v) => {
                      setContent(v);
                    }}
                    style={[styles.textarea]}
                    placeholder={"내용을 입력하세요."}
                    placeholderTextColor="#B8B8B8"
                    multiline={true}
                    returnKyeType='done'
                  />
                </View>                            
              </View>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>

        <View style={styles.nextFix}>
          <TouchableOpacity 
            style={[styles.nextBtn, state ? null : styles.nextBtnOff]}
            activeOpacity={opacityVal}
            onPress={() => {
              uploadUpdate();
            }}
          >
            <Text style={styles.nextBtnText}>업로드</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView> 

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
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	

  cmWrap: {paddingVertical:30,paddingHorizontal:20},
  cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},
    
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:52,color:'#fff'},

  textarea: {width:innerWidth,height:220,paddingVertical:12,paddingHorizontal:15,textAlignVertical:'top',fontFamily:Font.NotoSansRegular,fontSize:14,color:'#1e1e1e',borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,},

  help_box: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5,},
  alertTextView: {minWidth:1,},
	alertText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#B8B8B8',},
  alertText3: {color:'#EE4245',},
	txtCntText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#b8b8b8'},

  imgBox: {alignItems:'center',justifyContent:'center'},
	imgBtn: {alignItems:'center',justifyContent:'center',width:220,height:220,backgroundColor:'#F9FAFB',borderRadius:5,overflow:'hidden',position:'relative',borderWidth:1,borderColor:'#EDEDED'},
  imgBtn2: {borderWidth:0,},
	imgText: {width:43,height:21,backgroundColor:'#fff',borderRadius:50,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:21,textAlign:'center',color:'#243B55',position:'absolute',right:5,bottom:5,},

  phoneGallery : {flexDirection:'row',height:48,marginBottom:40,},
  phoneGalleryText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:18,color:'#fff',marginLeft:8,},

  basicPic: {flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20,paddingBottom:20,},
  basicPicBtn: {alignItems:'center',justifyContent:'center',width:(innerWidth/4)-7.5,height:(innerWidth/4)-7.5,borderRadius:5,overflow:'hidden',marginRight:10,marginBottom:10,position:'relative'},
  basicPicChk: {position:'absolute',top:6,right:6,},  

  wrtChkBtn: {flexDirection:'row',alignItems:'center'},
  wrtChk: {alignItems:'center',justifyContent:'center',width:18,height:18,backgroundColor:'#fff',borderWidth:1,borderColor:'#DBDBDB',borderRadius:2,marginRight:5,},
  wrtChkOn: {backgroundColor:'#243B55',borderWidth:0,},
  wrtChkBtnView: {},
  wrtChkBtnText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:16,color:'#1e1e1e'},

  header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},

  modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},
	prvPop2: {height:innerHeight,},
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E'},
	popTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
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

  red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

  pdt0: {paddingTop:0},
  pdt10: {paddingTop:10},
  pdb0: {paddingBottom:0},
  pdb10: {paddingBottom:10},
  pdb20: {paddingBottom:20},
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
	mgl0: {marginLeft:0},
})

export default TodayExerciseWrite