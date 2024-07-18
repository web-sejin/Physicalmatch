import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, BackHandler, Dimensions, ImageBackground, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';

import APIs from "../assets/APIs";
import Font from "../assets/common/Font";
import ToastMessage from "../components/ToastMessage";
import ImgDomain from '../assets/common/ImgDomain';
import ImgDomain2 from '../components/ImgDomain2';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const opacityVal2 = 0.95;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const Disable = (props) => {	
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(true);
	const [backPressCount, setBackPressCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
  const [memberIdx, setMemberIdx] = useState();
	const [memberNick, setMemberNick] = useState('');
	const [memberProfile, setMemberProfile] = useState('');

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			
		}else{		
			setRouteLoad(true);
			setPageSt(!pageSt);

      AsyncStorage.getItem('member_idx', (err, result) => {		
				//console.log('member_idx :::: ', result);		
				setMemberIdx(result);
			});
		}

		Keyboard.dismiss();
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
				//console.log(backPressCount);
        if (backPressCount === 0) {
          setBackPressCount(1);
          ToastAndroid.show('한 번 더 누르면 종료됩니다.', ToastAndroid.SHORT);
					
          setTimeout(() => {
            setBackPressCount(0);
          }, 2000); // 2초 내에 두 번 클릭을 기다림

          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [backPressCount])
  );

	useEffect(() => {
		getMemInfo();
	}, [memberIdx]);

	const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyProfile",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
    //console.log(response);
		if(response.code == 200){
			setMemberNick(response.data.info.member_nick);
			setMemberProfile(response.data.img[0].mti_img);
		}
	}

	const accountReset = async () => {
		setLoading(true);
    let sData = {
			basePath: "/api/member/index.php",
			type: "SetPushList",
			member_idx: memberIdx,
			push_col: 'available_yn',
      push_yn: 'y' 
		};
    const response = await APIs.send(sData);
    console.log(response);
		setLoading(false);
		if(response.code == 200){
    	navigation.navigate('TabNavigation');
		}
	}

	const logout = async () => {        
    let sData = {
			basePath: "/api/member/",
			type: "SetLogout",
      member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
		console.log(response);
    if(response.code == 200){
      AsyncStorage.removeItem('member_id');
      AsyncStorage.removeItem('member_idx');

      setModal(false);
      navigation.navigate('Intro2');
    }
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        <View style={styles.accImg}>						
          <ImgDomain fileWidth={42} fileName={'logo_navy.png'} />
          <View style={styles.accCircle}>
						{memberProfile != '' ? (
							<ImgDomain2 fileWidth={84} fileName={memberProfile} />
						) : (
							<ImgDomain fileWidth={84} fileName={'account_off.jpg'} />
						)}
          </View>
        </View>
        <View style={styles.accInfo}>
          <View style={styles.accInfoNick}>
            <Text style={styles.accInfoNickText}>{memberNick}</Text>
          </View>
          <View style={styles.accInfoTitle}>
            <Text style={styles.accInfoTitleText}>비활성화 상태입니다.</Text>
          </View>
          <View style={styles.accInfoDesc}>
            <Text style={styles.accInfoDescText}>피지컬 매치의 육각형 회원들이</Text>
          </View>
          <View style={styles.accInfoDesc}>
            <Text style={styles.accInfoDescText}>회원님을 기다리고 있어요!</Text>
          </View>
          <View style={styles.accInfoDesc}>
            <Text style={styles.accInfoDescText}>좋은 인연과 커뮤니티를</Text>
          </View>
          <View style={styles.accInfoDesc}>
            <Text style={styles.accInfoDescText}>다시 만나보세요</Text>
            <View style={{position:'relative',top:2,}}>
              <ImgDomain fileWidth={24} fileName={'icon_heart2.png'} />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.popBtnBox, styles.popBtnBox2]}>
        <TouchableOpacity 
          style={[styles.popBtn]}
          activeOpacity={opacityVal}
          onPress={() => {accountReset()}}
        >
          <Text style={styles.popBtnText}>비활성화 해제</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.popBtn, styles.popBtnOff2]}
          activeOpacity={opacityVal}
          onPress={() => setModal(true)}
        >
          <Text style={[styles.popBtnText, styles.popBtnOffText]}>로그아웃</Text>
        </TouchableOpacity>
      </View>

			 {/* 로그아웃 컨펌 */}
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
							<Text style={styles.popTitleText}>로그아웃 하시겠어요?</Text>
						</View>		
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.mgt50]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => setModal(false)}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => logout()}
							>
								<Text style={styles.popBtnText}>네</Text>
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
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	

	header: {backgroundColor:'#141E30'},
	headerTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:20,paddingBottom:10,},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000',paddingLeft:20,},
	headerTitleText: {fontFamily:Font.RobotoMedium,fontSize:24,lineHeight:26,color:'#fff'},
	headerLnb: {flexDirection:'row',alignItems:'center',paddingRight:15,},
	headerLnbBtn: {marginLeft:6,paddingHorizontal:5,},
	headerBot: {flexDirection:'row',},
	headerTab: {width:widnowWidth/2,height:60,alignItems:'center',justifyContent:'center',position:'relative',paddingTop:10,},
	headerTabText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#fff'},
	headerTabTextOn: {fontFamily:Font.NotoSansBold,color:'#FFD194'},
	activeLine: {width:widnowWidth/2,height:4,backgroundColor:'#FFD194',position:'absolute',left:0,bottom:0,zIndex:10,},

	modalHeader: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},
	filterResetBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:20,height:48,backgroundColor:'#fff',position:'absolute',top:0,right:0,zIndex:10,},
	filterResetText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#1E1E1E',marginLeft:6,},

	filterTitle: {},
	filterTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:18,color:'#1e1e1e'},
	filterDesc: {marginTop:6,},
	filterDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#666'},
	msBox: {},
	msTitleBox: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	msTitleBoxText1: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#1e1e1e'},
	msTitleBoxText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#888',position:'relative',top:-1,},
	msCheckBox: {flexDirection:'row',alignItems:'center'},
	msCheckBoxCircle: {width:20,height:20,backgroundColor:'#fff',borderWidth:1,borderColor:'#dbdbdb',borderRadius:50,position:'relative'},
	msCheckBoxCircleOn: {borderColor:'#243B55'},
	msCheckBoxCircleIn: {width:12,height:12,backgroundColor:'#243B55',borderRadius:50,position:'absolute',left:3,top:3,},
	msCheckBoxText: {fontFamily:Font.NotoSansRegular,fontSize:12,color:'#1e1e1e',marginLeft:6,},

	grediant: {padding:1,borderRadius:5,},
	boxShadow: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
		elevation: 5,
	},
	boxShadow2: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
		elevation: 9,
	},

	todayFreeArea: {},	
	todayFreeAreaWrap: {backgroundColor:'#fff',borderRadius:5,},
	todayFreeBtn: {height:50,alignItems:'center',justifyContent:'center',backgroundColor:'#fff',borderRadius:5,},
	todayFreeBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#d1913c'},

	cmWrap: {paddingVertical:40,paddingHorizontal:20,},
	cmWrap2: {paddingTop:30,},
	cardView: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
	dday: {width:innerWidth,height:17,backgroundColor:'#fff',marginTop:30,flexDirection:'row',justifyContent:'center',position:'relative'},
	ddayLine: {width:innerWidth,height:1,backgroundColor:'#D1913C',position:'absolute',left:0,top:8,},
	ddayText: {width:40,height:17,textAlign:'center',backgroundColor:'#fff',position:'relative',zIndex:10,fontFamily:Font.RobotoRegular,fontSize:15,lineHeight:17,color:'#D1913C'},
	cardBtn: { width: ((widnowWidth / 2) - 30), marginTop: 20, position: 'relative' },		
	cardCont: {width: ((widnowWidth / 2) - 30), backgroundColor:'#fff', backfaceVisibility:'hidden', borderTopLeftRadius:80, borderTopRightRadius:80,},	
	cardFrontInfo: {width: ((widnowWidth / 2) - 30), position:'absolute', left:0, top:0, zIndex:10,},
	peopleImgBack: {opacity:0,},
	peopleImg: {position:'absolute', left:0, top:0, zIndex:9, borderTopLeftRadius:80, borderTopRightRadius:80,},
	cardFrontInfoCont: {width: ((widnowWidth / 2) - 30), backgroundColor:'#fff', position:'absolute', left:0, bottom:0, zIndex:10, padding:10, borderRadius:5,},
	cardFrontNick: {flexDirection:'row', alignItems:'center', justifyContent:'space-between'},
	cardFrontNickText: {width:(innerWidth/2)-61,fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:19,color:'#1e1e1e',},
	cardFrontJob: {marginVertical:6,},
	cardFrontJobText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#888',},
	cardFrontContBox: {flexDirection:'row',alignItems:'center'},
	cardFrontContText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:16,color:'#1e1e1e',},
	cardFrontContTextRoboto: {fontFamily:Font.RobotoRegular,fontSize:12,},
	cardFrontContLine: {width:1,height:8,backgroundColor:'#EDEDED',position:'relative',top:1,marginHorizontal:6,},

	cardBtn2: {width: ((innerWidth / 3) - 7)},
	cardCont2: {width: ((innerWidth / 3) - 7)},
	cardFrontInfo2: {width: ((innerWidth / 3) - 7),position:'absolute',left:0,top:0,opacity:1},
	cardFrontInfoCont2: {width: ((innerWidth / 3) - 7),padding:8,},
	cardFrontDday: {},
	cardFrontDdayText: {textAlign:'center',fontFamily:Font.RobotoBold,fontSize:16,lineHeight:17,color:'#1e1e1e'},
	cardFrontNick2: {marginTop:4,},
	cardFrontNickText2: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:10,lineHeight:12,color:'#1e1e1e'},
	cardFrontContBox2: {justifyContent:'center'},
	cardFrontContText2: {fontFamily:Font.RobotoRegular,color:'#888'},

	state2Tab: {flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#EDEDED'},
	state2TabBtn: {alignItems:'center',justifyContent:'center',width:widnowWidth/3,height:50,},
	state2TabBtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,color:'#888'},
	state2TabBtnTextOn: {color:'#141E30'},

	interestBoxTitle: {},
	interestBoxTitleText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:19,color:'#1e1e1e',},
	interestBoxDesc: {flexDirection:'row',alignItems:'center',marginTop:4,},
	interestBoxDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#666',marginRight:2,},

	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight},
	popBack2: {backgroundColor:'rgba(0,0,0,0.7)',},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},	
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap'},
	popTitleFlexWrap: {position:'relative',},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E',},
  popTitleFlexText: {position:'relative',top:0.5,},	
	popTitleDesc: {width:innerWidth-40,textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	emoticon: {},
	popIptBox: {paddingTop:10,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {marginTop:30,},
	popBtnBox2: {paddingHorizontal:20,paddingTop:30,paddingBottom:50,marginTop:0},
	popBtnBoxFlex: {flexDirection:'row',justifyContent:'space-between'},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtn2: {width:(innerWidth/2)-25,},
	popBtnOff: {backgroundColor:'#EDEDED',},
	popBtnOff2: {backgroundColor:'#fff',marginTop:10,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

	prvPopBot: {width:widnowWidth,paddingTop:40,paddingBottom:10,paddingHorizontal:20,backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,position:'absolute',bottom:0,},
	prvPopBot2: {width:widnowWidth,position:'absolute',bottom:0,},
	popBotTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:20,color:'#1e1e1e',},
	popBotTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#666',marginTop:10,},

	prvPopBot2Wrap: {paddingTop:40,paddingBottom:285,paddingHorizontal:20,},
	prvPopBot2Title: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	prvPopBot2View: {flexDirection:'row',alignItems:'center',justifyContent:'center',},
	prvPopBot2View2: {marginHorizontal:8,},
	prvPopBot2ViewIn: {position:'relative',top:2,},
	prvPopBot2ViewText: {fontFamily:Font.NotoSansSemiBold,fontSize:20,lineHeight:23,color:'#fff'},
	prvPopBot2ViewText2: {color:'#FFD194'},
	prvPopBot2Desc: {alignItems:'center',justifyContent:'center',marginTop:20,},
	prvPopBot2DescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#fff'},
	
	multiSliderDot: {width:16,height:16,backgroundColor:'#fff',borderWidth:2,borderColor:'#D1913C',borderRadius:50,position:'relative',zIndex:10,},
	multiSliderDotOff: {borderWidth:0,backgroundColor:'#F8F9FA'},

	multiSliderCustom: {flexDirection:'row',justifyContent:'space-between',position:'relative'},
	multiSliderDotBack: {width:innerWidth,height:2,backgroundColor:'#DBDBDB',position:'absolute',left:0,top:7,},
	multiSliderDotBackOn: {width:0,height:2,backgroundColor:'#D1913C',},

	nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },

	pointBox: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	pointBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#D1913C',marginLeft:6},

	productList: {flexDirection:'row',justifyContent:'space-between'},
	productBtn: {width:(innerWidth/3)-7,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,paddingVertical:25,paddingHorizontal:10,},
	productBtnOn: {backgroundColor:'rgba(209,145,60,0.15)',borderColor:'#D1913C'},
	productText1: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:20,color:'#1e1e1e'},
	productBest: {height:20,paddingHorizontal:8,borderRadius:20,marginTop:5,},
	productBest2: {backgroundColor:'#FFBF1A',},
	productText2: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:18,color:'#fff'},
	productText3: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#666',marginTop:3,},
	productText3On: {color:'#1e1e1e'},
	productText4: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:5,},

	accImg: {alignItems:'center',justifyContent:'center',width:widnowWidth,height:180,backgroundColor:'#F2F4F6',position:'relative'},
	accCircle: {alignItems:'center',justifyContent:'center',width:80,height:80,borderWidth:2,borderColor:'#EDEDED',borderRadius:50,overflow:'hidden',position:'absolute',bottom:-40},
	accInfo: {paddingTop:55,paddingBottom:10,paddingHorizontal:20,},
	accInfoNick: {},
	accInfoNickText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:18,lineHeight:21,color:'#1e1e1e'},
	accInfoTitle: {marginTop:50,marginBottom:15,},
	accInfoTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#666'},
	accInfoDesc: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	accInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:16,lineHeight:28,color:'#666'},

	boxShadow: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0.5,
		elevation: 2,
	},
	
	displayNone: {display:'none'},
	mgt0: {marginTop:0,},
	mgt2: {marginTop:2,},
	mgt4: {marginTop:4,},
	mgt6: {marginTop:6,},
	mgt10: {marginTop:10,},
	mgt30: {marginTop:30,},
	mgt50: {marginTop:50,},
	mgt60: {marginTop:60,},
	mgb0: {marginBottom:0,},
	mgb10: {marginBottom:10,},
	mgb25: {marginBottom:25,},

	w33p: {width:innerWidth*0.33},
	w66p: {width:innerWidth*0.66},
	w100p: {width:innerWidth},
})

export default Disable