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

const CommunityWrite = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberIdx, setMemberIdx] = useState();

  const [backConfirm, setBackConfirm] = useState(false);
  const [state, setState] = useState(false);
  const [cate, setCate] = useState(0); //0=>자유 // 1=>운동 // 2=>프교 // 3=>셀소
  const [subject, setSubject] = useState('');
  const [phoneImage, setPhoneImage] = useState({});
  const [content, setContent] = useState('');
  const [chk, setChk] = useState(false);

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
    let totalReq = 2;
    let currReq = 0;
    if(cate == 3){
      totalReq = 3;
    }

    let contLimitCnt = 0;
    if(cate == 1 || cate == 2){ 
      contLimitCnt = 5;
    }else if(cate == 3 || cate == 4){
      contLimitCnt = 30;
    }

    if(subject != '' && subject.length >= 2 && subject.length <= 20){ currReq++; }    
    if(content != '' && content.length >= contLimitCnt  && content.length <= 1000){ currReq++; }

    if(cate == 3){
      if(phoneImage.path != '' && phoneImage.path != undefined){
        currReq++;
      }
    }

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

  const socialWriteUpdate = async () => {    
    if(subject == '' || subject.length < 2 || subject.length > 20){
      ToastMessage('제목을 2~20자 입력해 주세요.');
      return false;
    }

    let contLimitCnt = 0;
    if(cate == 0 || cate == 1){ 
      contLimitCnt = 5;
    }else if(cate == 2 || cate == 3){
      contLimitCnt = 30;
    }

    if(content == '' || content.length < contLimitCnt || content.length > 1000){
      ToastMessage('모임 내용을 '+contLimitCnt+'~1000자 입력해 주세요.');
      return false;
    }

    if(cate == 3 && (phoneImage.path == '' || phoneImage.path == undefined)){
      ToastMessage('사진을 등록해 주세요.');
      return false;
    }

    Keyboard.dismiss();
    //setLoading(true);

    let sData = {
			basePath: "/api/community/",
			type: "SetCommunity",
      member_idx: memberIdx,
      comm_type: cate,
      comm_subject: subject,
      comm_content: content,
		};

    if(chk){
      sData.comm_care = 1;
    }else{
      sData.comm_care = 0;
    }
    
    let fileData = [];
      fileData[0] = {uri: phoneImage.path, name: 'community_image.png', type: phoneImage.mime};
      sData.comm_files = fileData;

      const formData = APIs.makeFormData(sData)
      const response = await APIs.multipartRequest(formData);
      console.log(response);
      if(response.code == 200){      
        ToastMessage('커뮤니티가 작성되었습니다.');
        setPreventBack(false);
        setTimeout(function(){
          setLoading(false);
          navigation.navigate('TabNavigation', {screen:'Community', params : {reload:true}});
        }, 500)
      }
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <Header navigation={navigation} headertitle={'글쓰기'} />
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
                    <Text style={styles.iptTitText}>카테고리를 선택해 주세요 <Text style={styles.red}>*</Text></Text>
                  </View>
                  <View style={styles.commCate}>
                    <TouchableOpacity
                      style={[styles.commCateBtn, cate == 0 ? styles.commCateBtnOn : null]}
                      activeOpacity={opacityVal}
                      onPress={()=>setCate(0)}
                    >
                      <Text style={[styles.commCateBtnText, cate == 0 ? styles.commCateBtnTextOn : null]}>자유</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.commCateBtn, cate == 1 ? styles.commCateBtnOn : null]}
                      activeOpacity={opacityVal}
                      onPress={()=>setCate(1)}
                    >
                      <Text style={[styles.commCateBtnText, cate == 1 ? styles.commCateBtnTextOn : null]}>운동</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.commCateBtn, cate == 2 ? styles.commCateBtnOn : null]}
                      activeOpacity={opacityVal}
                      onPress={()=>setCate(2)}
                    >
                      <Text style={[styles.commCateBtnText, cate == 2 ? styles.commCateBtnTextOn : null]}>프교</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.commCateBtn, cate == 3 ? styles.commCateBtnOn : null, styles.mgr0]}
                      activeOpacity={opacityVal}
                      onPress={()=>setCate(3)}
                    >
                      <Text style={[styles.commCateBtnText, cate == 3 ? styles.commCateBtnTextOn : null]}>셀소</Text>
                    </TouchableOpacity>
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
                    placeholder={"· 글 작성 전에 커뮤니티 가이드를 확인 해주세요.\n· 민감한 글은 아래 표시에 체크 해주세요"}
                    placeholderTextColor="#DBDBDB"
                    multiline={true}
                    returnKyeType='done'
                    maxLength={1000}
                  />
                  <View style={styles.help_box}>
                    {cate == 0 || cate == 1 ? (
                      <Text style={styles.alertText2}>최소 5자 이상 입력해 주세요.</Text>
                    ) : null}
                    {cate == 2 || cate == 3 ? (
                      <Text style={styles.alertText2}>최소 30자 이상 입력해 주세요.</Text>
                    ) : null}              
                    <Text style={styles.txtCntText}>{content.length}/1000</Text>
                  </View>
                </View> 

                <View style={[styles.guideView, styles.mgt20]}>
                  <TouchableOpacity
                    style={styles.guideBtn}
                    activeOpacity={opacityVal}
                    onPress={()=>{navigation.navigate('UseGuide', {guideInfo:2})}}
                  >
                    <Text style={styles.guideBtnText}>커뮤니티 이용 가이드</Text>
                    <ImgDomain fileWidth={5} fileName={'icon_arr2.png'}/>
                  </TouchableOpacity>
                </View>

                <View style={styles.mgt40}>
                  <View style={[styles.iptTit]}>                    
                    {cate == 3 ? (
                      <Text style={styles.iptTitText}>사진 등록 <Text style={styles.red}>*</Text></Text>
                    ) : (
                      <Text style={styles.iptTitText}>사진 등록</Text>
                    )}
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

                <View style={styles.mgt40}>
                  <TouchableOpacity
                    style={[styles.wrtChkBtn]}
                    activeOpacity={opacityVal}
                    onPress={()=>setChk(!chk)}
                  >
                    <View style={[styles.wrtChk, chk ? styles.wrtChkOn : null]}>
                      <ImgDomain fileWidth={10} fileName={'icon_chk1.png'}/>
                    </View>
                    <View style={[styles.wrtChkBtnView]}>
                      <Text style={[styles.wrtChkBtnText]}>민감한 내용의 사진, 글이 포함되어 있어요.</Text>  
                    </View>                    
                  </TouchableOpacity>
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
              socialWriteUpdate();
            }}
          >
            <Text style={styles.nextBtnText}>등록하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView> 

      {/* 작성 중 뒤로가기 */}
			<Modal
				visible={backConfirm}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setBackConfirm(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setBackConfirm(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setBackConfirm(false)}}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>작성된 내용이 삭제돼요</Text>
							<Text style={[styles.popTitleText, styles.mgt5]}>그래도 돌아가시겠어요?</Text>							
						</View>	
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.mgt50]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => {
                  setBackConfirm(false);
                  setPreventBack(false);
                  setLoading(true);
                  setTimeout(function(){
                    navigation.goBack();
                  }, 500);
                }}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>네</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => setBackConfirm(false)}
							>
								<Text style={styles.popBtnText}>아니오</Text>
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
  textarea: {width:innerWidth,minHeight:180,paddingVertical:0,paddingHorizontal:15,textAlignVertical:'top',fontFamily:Font.NotoSansRegular,fontSize:14,paddingTop:15,color:'#1e1e1e'},

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

export default CommunityWrite