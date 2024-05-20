import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { ScrollView as GestureHandlerScrollView } from 'react-native-gesture-handler'
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';

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

const MyProfile = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);

  const [file1, setFile1] = useState({});
	const [file2, setFile2] = useState({});
	const [file3, setFile3] = useState({});
	const [file4, setFile4] = useState({});
	const [file5, setFile5] = useState({});
	const [file6, setFile6] = useState({});
  const [file7, setFile7] = useState({});
	const [guideModal, setGuideModal] = useState(false);

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
				setGuideModal(false);
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

	const chooseImage = (v) => {
		let imgWidth = widnowWidth;
		let imgHeight = widnowWidth*1.355;
		if(v == 7){
			imgHeight = widnowWidth;
		}

    ImagePicker.openPicker({
      width: imgWidth,
      height: imgHeight,
      cropping: true,
    })
		.then(image => {
			let selectObj = {idx: v, path: image.path, mime: image.mime}			
			if(v == 1){
				setFile1(selectObj);
			}else if(v == 2){
				setFile2(selectObj);
			}else if(v == 3){
				setFile3(selectObj);
			}else if(v == 4){
				setFile4(selectObj);
			}else if(v == 5){
				setFile5(selectObj);
			}else if(v == 6){
				setFile6(selectObj);
			}else if(v == 7){
				setFile7(selectObj);
			}
		})
		.finally(() => {

		});
  };

	const submit = () => {
    const nextObj = {};

		if(!file1.path || !file2.path || !file3.path){
			ToastMessage('대표 및 필수 영역의 사진을 등록해 주세요.');
			return false;
		}		
		
    if(file1.path){ nextObj.file1 = file1; }
		if(file2.path){ nextObj.file2 = file2; }
    if(file3.path){ nextObj.file3 = file3; }
    if(file4.path){ nextObj.file4 = file4; }
    if(file5.path){ nextObj.file5 = file5; }
    if(file6.path){ nextObj.file6 = file6; }
    if(file7.path){ nextObj.file7 = file7; }
		
		console.log(nextObj);
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'프로필 사진'} />

      <View style={styles.reject}>
       <View style={styles.rejectBox}>
          <Text style={styles.rejectText}>반려 사유 메세지</Text>
        </View>
      </View>

			<ScrollView>
        <View style={styles.cmWrap}>
					<View style={styles.regiTypingView}>
						<View style={styles.cmTitleBox}>
							<Text style={styles.cmTitleText}>사진을 등록해 주세요!</Text>
						</View>
						<View style={styles.cmDescBox}>
							<Text style={styles.cmDescText}>나를 잘 드러내는 얼굴, 전신 각 1장은 필수입니다.</Text>
						</View>
					</View>

					<View style={styles.imgBox}>
						<TouchableOpacity
							style={[styles.imgBtn]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(1)}}
						>
							{file1.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file1.path }} />
							) : (
								<AutoHeightImage 
									width={(innerWidth/3)-7}
									source={require("../../assets/image/img_back.jpg")}
								/>
							)}							
							<Text style={styles.imgText}>대표</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.imgBtn]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(2)}}
						>
							{file2.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file2.path }} />
							) : (
								<AutoHeightImage 
									width={(innerWidth/3)-7}
									source={require("../../assets/image/img_back.jpg")}
								/>
							)}
							<Text style={styles.imgText}>필수</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.imgBtn]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(3)}}
						>
							{file3.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file3.path }} />
							) : (
								<AutoHeightImage 
									width={(innerWidth/3)-7}
									source={require("../../assets/image/img_back.jpg")}
								/>
							)}
							<Text style={styles.imgText}>필수</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.imgBtn, styles.mgt10]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(4)}}
						>
							{file4.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file4.path }} />
							) : (
								<AutoHeightImage 
									width={(innerWidth/3)-7}
									source={require("../../assets/image/img_back.jpg")}
								/>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.imgBtn, styles.mgt10]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(5)}}
						>
							{file5.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file5.path }} />
							) : (
								<AutoHeightImage 
									width={(innerWidth/3)-7}
									source={require("../../assets/image/img_back.jpg")}
								/>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.imgBtn, styles.mgt10]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(6)}}
						>
							{file6.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file6.path }} />
							) : (
								<AutoHeightImage 
									width={(innerWidth/3)-7}
									source={require("../../assets/image/img_back.jpg")}
								/>
							)}
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={styles.guideBtn}
						activeOpacity={opacityVal}
						onPress={()=>{
							setGuideModal(true);
							setPreventBack(true);
						}}
					>
						<Text style={styles.guideBtnText}>사진 등록 가이드</Text>
						<AutoHeightImage 
							width={5}
							source={require("../../assets/image/icon_arr2.png")}
						/>
					</TouchableOpacity>

          <View style={styles.mgt50}>
            <View style={styles.miniTitle}>
              <Text style={styles.miniTitleText1}>미니 프로필 등록</Text>
              <Text style={styles.miniTitleText2}>[선택]</Text>
            </View>
            <View style={styles.miniDesc}>
              <Text style={styles.miniDescText}>얼굴이 잘 보이는 사진으로 등록해 주세요</Text>
            </View>
            <View style={styles.reqUl}>                  
              <View style={[styles.reqLi, styles.boxShadow2]}>
                <TouchableOpacity
                  style={styles.reqUser}
                  activeOpacity={opacityVal}
                  onPress={()=>chooseImage(7)}
                >
                  {file7.path ? (
                    <AutoHeightImage width={46} source={{ uri: file7.path }} />                    
                  ) : (
                    <AutoHeightImage width={46} source={require("../../assets/image/img_back2.png")} />
                  )}		                  
                </TouchableOpacity>
                <View style={styles.reqUserInfo}>
                  <View style={styles.tradeState}>
                    <View style={styles.tradeStateView}>
                      <Text style={styles.tradeStateText}>프로필 교환이 도착했어요</Text>
                    </View>
                    <AutoHeightImage width={12} source={require('../../assets/image/icon_profile_msg.png')} />
                  </View>
                  <View style={styles.reqUserNick}>
                    <Text style={styles.reqUserNickText}>자동생성닉네임</Text>                          
                  </View>
                  <View style={styles.reqUserDetail}>
                    <Text style={styles.reqUserDetailText}>수락까지 잠시 기다려주세요!</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.reqOkBtn}
                  activeOpacity={opacityVal}
                  onPress={() => setFile7({})}
                >
                  <AutoHeightImage width={25} source={require('../../assets/image/icon_trash.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
				</View>
			</ScrollView>

      <View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn, file1.path && file2.path && file3.path ? null : styles.nextBtnOff]}
					activeOpacity={opacityVal}
					onPress={() => submit()}
				>
					<Text style={styles.nextBtnText}>심사등록</Text>
				</TouchableOpacity>
			</View>

      <Modal
				visible={guideModal}
				animationType={"none"}
				onRequestClose={() => {setGuideModal(false)}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.header}>	
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>사진 심사 기준</Text>
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {setGuideModal(false)}}						
					>
						<AutoHeightImage width={16} source={require("../../assets/image/icon_close2.png")} />
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View style={styles.guidePopCont}>
						<Text style={styles.guidePopContText}>사진 심사 기준입니다.</Text>
					</View>
				</ScrollView>
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

  reject: {paddingHorizontal:20,paddingBottom:10,},
  rejectBox: {padding:15,backgroundColor:'rgba(255,120,122,0.1)',borderRadius:5,},
  rejectText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#DE282A'},

  cmWrap: {paddingTop:30,paddingBottom:50,paddingHorizontal:20},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},
  
	regiStateBarBox: {paddingTop:30,paddingBottom:56,paddingHorizontal:55,overflow:'hidden'},
  regiStateBar: {height:18,backgroundColor:'#eee',borderRadius:20,flexDirection:'row',justifyContent:'space-between'},
	regiStateCircel: {width:18,height:18,backgroundColor:'#eee',borderRadius:50,position:'relative'},
	regiStateCircelOn: {backgroundColor:'#243B55',},
	regiStateCircel2: {width:6,height:6,backgroundColor:'#fff',borderRadius:50,position:'absolute',left:6,top:6,},
	regiStateText: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:13,color:'#dbdbdb',width:60,position:'absolute',left:-20,bottom:-28,textAlign:'center',},
	regiStateTexOn: {color:'#243B55'},

  miniTitle: {flexDirection:'row',},
  miniTitleText1: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:19,color:'#1e1e1e'},
  miniTitleText2: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#B8B8B8',marginLeft:2,},
  miniDesc: {marginTop:8,},
  miniDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#1e1e1e'},
  reqUl: {marginTop:20,},
  reqLi: {flexDirection:'row',alignItems:'center',paddingHorizontal:15,paddingVertical:13,paddingRight:75,backgroundColor:'#fff',borderRadius:5,},
  reqUser: {alignItems:'center',justifyContent:'center',width:46,height:46,borderRadius:50,overflow:'hidden',borderWidth:1,borderColor:'#ededed'},
  reqUserInfo: {width:innerWidth-137,paddingLeft:15,},
  reqUserInfo2: {width:innerWidth-91},
  tradeState: {flexDirection:'row',alignItems:'center',marginBottom:5,},
  tradeStateView: {position:'relative',top:0.5},
  tradeStateText: {fontFamily:Font.NotoSansSemiBold,fontSize:12,lineHeight:17,color:'#1e1e1e'},
  reqUserNick: {},
  reqUserNickText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,lineHeight:17,color:'#D1913C'},
  reqUserDetail: {flexDirection:'row',alignItems:'center',marginTop:4,},
  reqUserDetailText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:17,color:'#666',},
  reqDtLine: {width:1,height:8,backgroundColor:'#EDEDED',marginHorizontal:6,position:'relative',top:-0.5},
  reqOkBtn: {alignItems:'center',justifyContent:'center',width:35,height:35,position:'absolute',right:5,},
  reqOkBtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#243B55'},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  
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
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},

	imgBox: {flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',alignItems:'flex-start',marginTop:30,},
	imgBtn: {borderRadius:5,overflow:'hidden',position:'relative',borderWidth:1,borderColor:'#EDEDED'},
	imgText: {width:43,height:21,backgroundColor:'#fff',borderRadius:50,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:21,textAlign:'center',color:'#243B55',position:'absolute',right:5,bottom:5,},

	guideBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',width:140,height:37,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:50,marginTop:20,},
	guideBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#1e1e1e',marginRight:8,position:'relative',top:1,},

	header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},

	guidePopCont: {padding:20,},
	guidePopContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e'},

	red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

  boxShadow2: {
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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

export default MyProfile