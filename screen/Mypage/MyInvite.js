import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, ImageBackground, Pressable, StyleSheet, ScrollView, Share, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import KakaoShareLink from 'react-native-kakao-share-link';
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

const MyInvite = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route;	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [memberIdx, setMemberIdx] = useState();
	const [shareImg, setShareImg] = useState('');
	const [registPoint, setRegistPoint] = useState();

	const tagData = ['초중고 동창', '친척', '동호회 지인', '대학동기', '결혼하고 싶어 하는', '회사 동료', '지인', '형제·자매', '외로워하는', '친구', '소개팅 해 달라고 보채는', '보는 눈이 높은', '만년 솔로인', '이별의 슬픔을 겪고 있는'];

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

			AsyncStorage.getItem('member_idx', (err, result) => {		        
				setMemberIdx(result);
			});
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
		if(memberIdx){
			getMemInfo();
		}
	}, [memberIdx])

	useEffect(() => {		
		getShareImg();
	}, []);	

	const getMemInfo = async () => {
    let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
		if(response.code == 200){        
      setRegistPoint(response.regist_point);
    }
  }

	const getShareImg = async (v) => {
		let sData = {
			basePath: "/api/etc/",
			type: "GetKakaoShareThumbnail",
		};		
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			if(v == 'direct'){
				onPressShare(response.data);
			}else{
				setShareImg(response.data);
			}			
		}
	}

	const onPressShare = useCallback(async (v) => {
		const img_url = v ? v : shareImg;
		//console.log('img_url ::: ', img_url);

		try {
				const response = await KakaoShareLink.sendFeed({
						content: {
							title: '피지컬 매치',
							imageUrl: img_url,
							link: {
								webUrl: '',
								mobileWebUrl: '',
							},
							//description: 'description',
						},
						buttons: [
								{
										title: "앱에서 보기",
										link: {
												androidExecutionParams: [
														{ key: "deviceVer", value: "from Kakao App" },
												],
												iosExecutionParams: [
														{ key: "deviceVer", value: "from Kakao App" },
												],
										},
								},
						],
				});
				//console.log(response);
		} catch (e) {
				console.error(e);
				console.error(e.message);
		}
	}, []);	

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'지인 초대하기'}/>

			<ImageBackground source={{uri:'https://physicalmatch.co.kr/appImg/invite_background.png'}} resizeMode='cover' style={{flex:1}}>
				<View style={styles.inviteBox}>
					<View style={styles.inviteView1}>
						<Text style={styles.inviteText1}>피지컬 매치의</Text>
					</View>
					<View style={styles.inviteView2}>
						<Text style={styles.inviteText2}>매력적인 회원들을</Text>
						<Text style={styles.inviteText2}>주변에 소개해주세요!</Text>
					</View>
					<View style={styles.inviteView3}>
						<ImgDomain fileWidth={20} fileName={'icon_heart3.png'} />
						<Text style={styles.inviteText3}>신규 회원 프로틴 {registPoint}개 증정</Text>
						<ImgDomain fileWidth={20} fileName={'icon_heart3.png'} />
					</View>
					<View style={styles.tagBox}>
						{tagData.map((item, index) => {
							let tagState = true;
							if(index==1 || index==3 || index==8 || index==10 || index==13){
								tagState = false;
							}
							return (
								<View key={index} style={[styles.tagView, !tagState ? styles.tagView2 : null]}>
									<Text style={[styles.tagText, !tagState ? styles.tagText2 : null]}>{item}</Text>
								</View>
							)
						})}						
					</View>
				</View>
			</ImageBackground>
			
			<TouchableOpacity
				style={styles.kakaoShare}
				activeOpacity={opacityVal}
				onPress={()=>{					
					if(shareImg != ''){
						onPressShare();	
					}else{
						//console.log('no shareImg!!');
						getShareImg('direct');
					}					
				}}
			>
				<ImgDomain fileWidth={20} fileName={'icon_kakao.png'}/>	
				<View style={styles.kakaoShareView}>
					<Text style={styles.kakaoShareText}>카톡으로 공유하기</Text>
				</View>
			</TouchableOpacity>

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
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

  reject: {paddingHorizontal:20,paddingBottom:10,},
  rejectBox: {padding:15,backgroundColor:'rgba(255,120,122,0.1)',borderRadius:5,},
  rejectText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#DE282A'},

  cmWrap: {paddingTop:30,paddingBottom:50,paddingHorizontal:20},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

	kakaoShare: {flexDirection:'row',alignItems:'center',justifyContent:'center',width:innerWidth,height:52,backgroundColor:'#FFE812',borderRadius:5,position:'absolute',left:20,bottom:50,},
	kakaoShareView: {marginLeft:6,},
	kakaoShareText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#3C1E1E'},

	inviteBox: {alignItems:'center',paddingTop:widnowHeight/10,},
	inviteView1: {},
	inviteText1: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:27,color:'#fff'},
	inviteView2: {marginTop:5,},
	inviteText2: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:24,lineHeight:32,color:'#fff'},
	inviteView3: {flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:17,},
	inviteText3: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:18,lineHeight:22,color:'#fff'},

	tagBox: {flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:8,paddingHorizontal:30,marginTop:50,},
	tagView: {alignItems:'center',justifyContent:'center',height:33,paddingHorizontal:14,backgroundColor:'#fff',borderRadius:50,},
	tagView2: {backgroundColor:'rgba(82,186,218,0.15)',borderWidth:1,borderColor:'#9CCBD9'},
	tagText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:19,color:'#1e1e1e'},
	tagText2: {color:'#9CCBD9'},

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

export default MyInvite