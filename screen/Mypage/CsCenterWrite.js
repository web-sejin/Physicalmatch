import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import RNPickerSelect from 'react-native-picker-select';

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

const CsCenterWrite = (props) => {
  const data = [
		{idx:1, txt:'문의유형1'},
		{idx:2, txt:'문의유형2'},
		{idx:3, txt:'문의유형3'},
	];

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locPop, setLocPop] = useState(false);
  const [ImagePop, setImagePop] = useState(false);
  const [cateList, setCateList] = useState(data);
  const [state, setState] = useState(false);
  const [cate, setCate] = useState('');
  const [subject, setSubject] = useState('');
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
    let totalReq = 3;
    let currReq = 0;

    if(cate != ''){ currReq++; }    
    if(subject != '' && subject.length >= 2 && subject.length <= 20){ currReq++; }    
    if(content != '' && content.length >= 3  && content.length <= 1000){ currReq++; }

    //console.log(currReq+'/'+totalReq);
    if(currReq == totalReq){
      setState(true);
    }else{
      setState(false);
    }
  }, [cate, subject, content, phoneImage]);

  const chooseImage = () => {
    ImagePicker.openPicker({
      //width: 300,
      //height: 400,
      cropping: true,
    })
		.then(image => {      
			let selectObj = {path: image.path, mime: image.mime}			
      console.log(selectObj);
      setPhoneImage(selectObj);
		})
		.finally(() => {
      
		});
  }

  const writeUpdate = async () => {    
    if(cate == ''){
      ToastMessage('문의 유형을 선택해 주세요.');
      return false;
    }
    
    if(subject == '' || subject.length < 2 || subject.length > 20){
      ToastMessage('제목을 2~20자 입력해 주세요.');
      return false;
    }

    if(content == '' || content.length < 3 || subject.length > 1000){
      ToastMessage('내용을 3~1000자 입력해 주세요.');
      return false;
    }

    Keyboard.dismiss;
    setLoading(true);
    setTimeout(function(){
      setLoading(false);
    }, 1000);
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <Header navigation={navigation} headertitle={'1:1 문의'} />
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
                  <View style={[styles.iptTit]}>
                    <Text style={styles.iptTitText}>문의 남기기</Text>
                  </View>
                  <View style={styles.selectView}>
                    <RNPickerSelect
                      value={cate}
                      onValueChange={(value, index) => {
                        setCate(value);
                      }}
                      placeholder={{
                        label: '문의 유형을 선택해주세요.',
                        inputLabel: '문의 유형을 선택해주세요.',
                        value: '',
                        color: '#666',
                      }}
                      items={cateList.map(item => ({
                        label: item.txt,
                        value: item.idx,
                      }))}
                      fixAndroidTouchableBug={true}
                      useNativeAndroidPickerStyle={false}
                      multiline={false}
                      style={{
                        placeholder: {fontFamily:Font.NotoSansRegular,color: '#666'},
                        inputAndroid: styles.select,
                        inputAndroidContainer: styles.selectCont,
                        inputIOS: styles.select,
                        inputIOSContainer: styles.selectCont,
                      }}
                    />                    
                    <View style={styles.selectArr}>
                      <ImgDomain fileWidth={10} fileName={'icon_arr3.png'}/>
                    </View>
                  </View>
                </View>
                <View style={styles.mgt20}>                  
                  <View style={[styles.loginIptBox, styles.loginIptBoxFlex, styles.mgt0]}>
                    <TextInput
                      value={subject}
                      onChangeText={(v) => {
                        if(v.length > 20){
                          let val = v.substr(0, 20);
                          setSubject(val);
                        }else{
                          setSubject(v);
                        }                      
                      }}
                      placeholder={'제목을 입력해 주세요 (최소 2자)'}
                      placeholderTextColor="#DBDBDB"
                      style={[styles.input, styles.input2, styles.inputLine0]}
                      maxLength={20}
                      returnKyeType='done'
                    />
                    <View style={styles.infoLen}>
                      <Text style={styles.infoLenText}>{subject.length}/20</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.mgt20}>
                  <TextInput
                    value={content}
                    onChangeText={(v) => {
                      if(v.length > 1000){
                        let val = v.substr(0, 1000);
                        setContent(val);
                      }else{
                        setContent(v);
                      }
                    }}
                    style={[styles.textarea]}
                    placeholder={"내용을 입력해 주세요"}
                    placeholderTextColor="#DBDBDB"
                    multiline={true}
                    returnKyeType='done'
                    maxLength={1000}
                  />
                  <View style={styles.help_box}>
                    <Text style={styles.alertText2}>최소 3자 이상 입력해 주세요.</Text>
                    <Text style={styles.txtCntText}>{content.length}/1000</Text>
                  </View>
                </View> 

                <View style={[styles.guideView, styles.mgt20]}>
                  <TouchableOpacity
                    style={styles.guideBtn}
                    activeOpacity={opacityVal}
                    onPress={()=>{navigation.goBack()}}
                  >
                    <Text style={styles.guideBtnText}>Q&A 확인하기</Text>
                    <ImgDomain fileWidth={5} fileName={'icon_arr2.png'}/>
                  </TouchableOpacity>
                </View>

                <View style={styles.mgt40}>
                  <View style={[styles.iptTit]}>                    
                  <Text style={styles.iptTitText}>사진 등록</Text>
                  </View>
                  <View style={styles.imgBox}>
                    <TouchableOpacity
                      style={[styles.imgBtn]}
                      activeOpacity={opacityVal}
                      onPress={() => chooseImage()}
                    >
                      {phoneImage.path != '' && phoneImage.path != undefined ? (
                        <AutoHeightImage width={62} source={{ uri: phoneImage.path }} />
                      ) : (
                        <ImgDomain fileWidth={62} fileName={'img_back2.png'}/>
                      )}
                    </TouchableOpacity>
                  </View>                  
                </View>                   
              </View>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>

        <View style={styles.nextFix}>
          <TouchableOpacity 
            style={[styles.nextBtn, state ? null : styles.nextBtnOff]}
            activeOpacity={opacityVal}
            onPress={() => {writeUpdate()}}
          >
            <Text style={styles.nextBtnText}>등록하기</Text>
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

  iptTit: {},  
  iptTitText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:18,color:'#1e1e1e'},
	iptSubTit: {},
	iptSubTitText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#666'},
  loginIptBox: {marginTop:20,},
  loginIptBoxFlex: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:'#DBDBDB',},
  infoChkBtn: {alignItems:'center',justifyContent:'center',width:45,height:30,backgroundColor:'#243B55',borderRadius:5,},
  infoChkBtnText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:18,color:'#fff', },
  
  infoLen: {position:'relative',top:-3,},
  infoLenText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#B8B8B8'},
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:52,color:'#fff'},

  input: {fontFamily:Font.NotoSansRegular,width:innerWidth,height:36,backgroundColor:'#fff',borderBottomWidth:1,borderColor:'#DBDBDB',paddingVertical:0,paddingHorizontal:5,fontSize:16,color:'#1e1e1e',justifyContent:'center', },
  input2: {width:innerWidth-55,},
  input3: {width:innerWidth-55,},
  input4: {width:innerWidth-25,},
  inputLine0 : {borderBottomWidth:0,},
  inputText: {fontFamily:Font.NotoSansRegular,fontSize: 16, lineHeight:21, color: '#1e1e1e',},
  textarea: {width:innerWidth,minHeight:180,paddingVertical:0,paddingHorizontal:0,textAlignVertical:'top',fontFamily:Font.NotoSansRegular,fontSize:16,},
  selectView: {position:'relative',justifyContent:'center',marginTop:20,},
	select: {width:innerWidth,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,paddingLeft:15,paddingRight:40,fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
	selectCont: {},
	selectArr: {position:'absolute',right:20,},

  help_box: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5,},
	alertText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#B8B8B8',},
	txtCntText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#b8b8b8'},

  imgBox: {flexDirection:'row',marginTop:20,},
	imgBtn: {alignItems:'center',justifyContent:'center',width:62,height:62,borderRadius:5,overflow:'hidden',position:'relative',borderWidth:1,borderColor:'#EDEDED'},
	imgText: {width:43,height:21,backgroundColor:'#fff',borderRadius:50,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:21,textAlign:'center',color:'#243B55',position:'absolute',right:5,bottom:5,},

  phoneGallery : {flexDirection:'row',height:48,marginBottom:40,},
  phoneGalleryText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:18,color:'#fff',marginLeft:8,},

  basicPic: {flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20,paddingBottom:20,},
  basicPicBtn: {alignItems:'center',justifyContent:'center',width:(innerWidth/4)-7.5,height:(innerWidth/4)-7.5,borderRadius:5,overflow:'hidden',marginRight:10,marginBottom:10,position:'relative'},
  basicPicChk: {position:'absolute',top:6,right:6,},

  guideView: {flexDirection:'row',paddingTop:20,borderTopWidth:1,borderTopColor:'#F2F4F6'},
  guideBtn: {flexDirection:'row',alignItems:'center',paddingHorizontal:15,height:37,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:50,},
	guideBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#1e1e1e',marginRight:8,position:'relative',top:1,},

  commCate: {flexDirection:'row',flexWrap:'wrap',marginTop:10,},
  commCateBtn: {alignItems:'center',justifyContent:'center',width:(innerWidth/4)-7.5,height:38,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:50,marginTop:10,marginRight:10,},
  commCateBtnOn: {backgroundColor:'#243B55',borderWidth:0,},
  commCateBtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#666'},
  commCateBtnTextOn: {color:'#fff'},

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

export default CsCenterWrite