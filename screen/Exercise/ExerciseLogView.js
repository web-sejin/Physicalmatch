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
import ImgDomain2 from '../../components/ImgDomain2';

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

const ExerciseLogView = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route	
  const exen_idx = params['exen_idx'];
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [memberIdx, setMemberIdx] = useState();
  const [memberInfo, setMemberInfo] = useState({});
  const [detailInfo, setDetailInfo] = useState({});

  const [dotPop, setDotPop] = useState(false);
  const [deletePop, setDeletePop] = useState(false);

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
    if(memberIdx){
      setLoading(true);
      getMemInfo();
      getExeDetail();
    }
  }, [memberIdx]);

  const getMemInfo = async () => {    
    let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
		if(response.code == 200){
      setMemberInfo(response.data);
    }
  }

  const getExeDetail = async () => {
    let sData = {
			basePath: "/api/exercise/",
			type: "GetLogDetail",
			exen_idx: exen_idx,
      member_idx: memberIdx
		};
    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      setDetailInfo(response.data);
      setLoading(false);
    }
  }

  const submitDelete = async () => {
    setDeletePop(false);
    setLoading2(true);

    let sData = {
			basePath: "/api/exercise/",
			type: "DeleteLogDetail",
			exen_idx: exen_idx,
      member_idx: memberIdx
		};
    const response = await APIs.send(sData);
    //console.log(response);
    
    setTimeout(function(){      
      setLoading2(false);
      navigation.navigate('TodayExercise', {reload:true, tab:3});
    }, 500);
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>      
      <View style={styles.header}>	
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>운동 기록</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerBackBtn} 
          activeOpacity={opacityVal}
        >          
          <ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setDotPop(true)} 
          style={styles.headerBackBtn2} 
          activeOpacity={opacityVal}
          >
          <ImgDomain fileWidth={24} fileName={'icon_hd_dot2.png'}/>
        </TouchableOpacity>
      </View>
  
      <ScrollView>
        <View style={styles.cmView}>
          <View style={styles.logImgView}>
            <View style={[styles.logImg, detailInfo?.exen_img ? styles.logImg2 : null]}>            
              {detailInfo?.exen_img ? (
                <ImgDomain2 fileWidth={220} fileName={detailInfo?.exen_img} />
              ) : (
                <ImgDomain fileWidth={220} fileName={'exercise_base.jpg'} />
              )}              
            </View>
          </View>
          <View style={styles.logInfoView}>
            <View style={styles.logInfo}>
              <View style={styles.logInfoLeft}>
                <Text style={styles.logInfoText}>{detailInfo?.exen_start_date}</Text>
              </View>
              <View style={styles.logInfoRight}>
                <Text style={[styles.logInfoText, styles.logInfoText2]}>
                  {detailInfo?.exen_start_hour}:{detailInfo?.exen_start_minute}:{detailInfo?.exen_start_sec} ~ {detailInfo?.end_time} {detailInfo?.run_time}
                </Text>
              </View>
            </View>
            <View style={[styles.logInfo, styles.mgt10]}>
              <View style={styles.logInfoLeft}>
                <Text style={styles.logInfoText}>운동 종목</Text>
              </View>
              <View style={styles.logInfoRight}>
                {detailInfo?.exen_exercise_name == '직접입력' ? (
                  <Text style={[styles.logInfoText, styles.logInfoText2]}>{detailInfo?.exen_exercise_etc}</Text>
                ) : (
                  <Text style={[styles.logInfoText, styles.logInfoText2]}>{detailInfo?.exen_exercise_name}</Text>
                )}  
              </View>
            </View>
            {detailInfo?.exen_content ? (
            <View style={[styles.logInfo2, styles.mgt10]}>
              <Text style={styles.logInfo2Text}>{detailInfo?.exen_content}</Text>
            </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <Modal
				visible={dotPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setDotPop(false)}
			>
        <TouchableOpacity 
          style={[styles.popBack, styles.popBack2]} 
          activeOpacity={1} 
          onPress={()=>setDotPop(false)}
        >
        </TouchableOpacity>
				<View style={styles.dotPop}>          
          <TouchableOpacity
            style={styles.dotPopBtn}
            activeOpacity={opacityVal}
            onPress={()=>{
              setDotPop(false);
              navigation.navigate('ExerciseLogWrite', {exen_idx:exen_idx});
            }}
          >
            <Text style={styles.dotPopBtnText}>운동 기록 수정</Text>
          </TouchableOpacity>
          <View style={styles.dotPopBtnLine}></View>
          <TouchableOpacity
            style={styles.dotPopBtn}
            activeOpacity={opacityVal}
            onPress={()=>{
              setDotPop(false)
              setDeletePop(true);
            }}
          >
            <Text style={styles.dotPopBtnText}>삭제하기</Text>
          </TouchableOpacity>  
        </View>
			</Modal>

      <Modal
				visible={deletePop}
				transparent={true}
				animationType={"none"}	
        onRequestClose={() => setDeletePop(false)}			
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 						
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => setDeletePop(false)}
						>
              <ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>운동 기록 삭제</Text>							
						</View>				
						<View>
							<Text style={[styles.popTitleDesc, styles.mgt0]}>운동 기록을 삭제하시겠습니까?</Text>						
						</View>
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => setDeletePop(false)}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>취소</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}								
                onPress={() => submitDelete()}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

      {loading ? ( <View style={[styles.indicator]}><ActivityIndicator size="large" color="#D1913C" /></View> ) : null}
      {loading2 ? ( <View style={[styles.indicator, styles.indicator2]}><ActivityIndicator size="large" color="#D1913C" /></View> ) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },	
	gapBox: {height:86,},
  indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },
  indicator2: { backgroundColor:'rgba(0,0,0,0.5)'},			

  header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn: {width:54,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerBackBtn2: {width:54,height:48,position:'absolute',right:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},

  cmView: {paddingVertical:30,paddingHorizontal:20},
  logImgView: {alignItems:'center'},
  logImg: {alignItems:'center',justifyContent:'center',width:220,height:220,borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,overflow:'hidden'},
  logImg2: {borderWidth:0,},
  logInfoView: {marginTop:30,},
  logInfo: {flexDirection:'row',justifyContent:'space-between',padding:15,backgroundColor:'#F9FAFB',borderRadius:5,},
  logInfoLeft: {},
  logInfoRight: {},
  logInfoText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#1e1e1e'},
  logInfoText2: {textAlign:'right',color:'#888'},
  logInfo2: {minHeight:120,padding:15,backgroundColor:'#F9FAFB',borderRadius:5,},
  logInfo2Text: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:20,color:'#1e1e1e'},

  modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight},
	popBack2: {backgroundColor:'rgba(0,0,0,0.7)',},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},	
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap'},
	popTitleFlexWrap: {position:'relative'},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E',},
  popTitleFlexText: {position:'relative',top:2,},	
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

  dotPop: {width:110,backgroundColor:'#fff',borderRadius:10,overflow:'hidden',position:'absolute',top:48+stBarHt,right:20,alignItems:'center'},
  dotPopBtn: {padding:12,},
  dotPopBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:17,color:'#1e1e1e'},
  dotPopBtnLine: {width:80,height:1,backgroundColor:'#EDEDED',borderRadius:5,},

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

export default ExerciseLogView