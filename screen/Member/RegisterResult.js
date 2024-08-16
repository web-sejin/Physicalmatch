import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Animated, Alert, BackHandler, Button, Dimensions, DeviceEventEmitter, View, Text, TextInput, TouchableOpacity, ImageBackground, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Video from 'react-native-video';
import messaging from '@react-native-firebase/messaging';

import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';
import ToastMessage from "../../components/ToastMessage";

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const RegisterResult = (props) => {
	const {navigation, userInfo, member_info, route} = props;
	const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [preventBack, setPreventBack] = useState(true);
	const [backPressCount, setBackPressCount] = useState(0);
	const [memberId, setMemberId] = useState();
	const [memberIdx, setMemberIdx] = useState();
	const [memberName, setMemberName] = useState(params?.newMemberNick ? params?.newMemberNick : '');
	const [firebaseToken, setFirebaseToken] = useState();
	const [deviceToken, setDeviceToken] = useState();
	const [loading, setLoading] = useState(false);
	const [backgroundType, setBackgroundType] = useState();
	const [backgroundUrl, setBackgroundUrl] = useState('');
	const [backgroundSubUrl, setBackgroundSubUrl] = useState('');
	const [backgroundOnlyUrl, setBackgroundOnlyUrl] = useState('');
	const [fadeAnim] = useState(new Animated.Value(1));

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

			AsyncStorage.getItem('appToken', (err, result) => {
				setFirebaseToken(result);
			});
	
			AsyncStorage.getItem('deviceId', (err, result) => {			
				setDeviceToken(result);
			});

			AsyncStorage.getItem('member_id', (err, result) => {	
				setMemberId(result);
			});

			AsyncStorage.getItem('member_idx', (err, result) => {			
				setMemberIdx(result);
			});
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
				console.log(backPressCount);
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
		setLoading(true);
		getBackground();
	}, []);

	useEffect(() => {
		if(memberIdx && !params?.newMemberNick){
			getMemInfo();
		}
	}, [memberIdx]);

	useEffect(() => {
    // 포그라운드 메시지 처리
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('포그라운드 메시지:', remoteMessage);
      ToastMessage(remoteMessage.data.subject, 3500, '1', '', remoteMessage.data.content);
      
      let mb_idx = await AsyncStorage.getItem('member_idx');
      if (mb_idx) {
        //console.log('user!!!!');
        memberHandler(mb_idx);
      }
    });

    // 백그라운드에서 알림을 탭하여 앱을 열었을 때
    const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      //console.log('백그라운드에서 알림으로 앱 열림:', remoteMessage);
      // 필요한 처리 로직 추가
      navigation.navigate('Alim');
    });

    // 앱이 종료된 상태에서 알림을 탭하여 앱을 열었을 때
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          //console.log('종료 상태에서 알림으로 앱 열림:', remoteMessage);          
          // 필요한 처리 로직 추가
          navigation.navigate('Alim');
        }
      });

    // 클린업 함수
    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };    
  }, []);

  const memberHandler = async (mb_idx) => {
    //console.log('memberHandler ::: ', mb_idx);
    const formData = new FormData();
    formData.append('type', 'GetMyInfo');
    formData.append('member_idx', mb_idx);
    //console.log(formData);
    const mem_info = await member_info(formData);

    //console.log('tabNavigation mem_info ::: ', mem_info);
  }

	const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyProfile",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
    //console.log(response.data.info);
		if(response.code == 200){
			setMemberName(response.data.info.member_nick);
		}
	}

	const getBackground = async () => {
		let sData = {
			basePath: "/api/etc/",
			type: "GetIntroBackground",
		};

		const response = await APIs.send(sData);		
		if(response.code == 200){
			setBackgroundType(response.data.intro_r_type);
			setBackgroundUrl(response.host_url+response.data.intro_r_file);
			setBackgroundSubUrl(response.host_url+response.data.intro_r_sub_file);
			setBackgroundOnlyUrl(response.data.intro_r_file);

			// 페이드 아웃 애니메이션 시작
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 1500, // 1초 동안 페이드 아웃
				delay: 100,
				useNativeDriver: true,
			}).start(() => {
				setLoading(false); // 애니메이션이 끝나면 loading 상태를 false로 설정
			});
		}
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			{backgroundType == 1 && backgroundUrl != '' ? (
				<Video
					//source={require('../assets/video/intro.mp4')}
					source={{uri:backgroundUrl}}
					poster={'https://physicalmatch.co.kr/appImg/video_intro.jpg'} // 영상 썸네일 이미지 URL
					posterResizeMode="cover"
					style={styles.fullScreen}
					paused={false} // 재생/중지 여부
					resizeMode={"cover"} // 프레임이 비디오 크기와 일치하지 않을 때 비디오 크기를 조정하는 방법을 결정합니다. cover : 비디오의 크기를 유지하면서 최대한 맞게
					//onLoad={e => console.log(e)} // 미디어가 로드되고 재생할 준비가 되면 호출되는 콜백 함수입니다.
					//onEnd={e => console.log(e)}
					repeat={true} // video가 끝나면 다시 재생할 지 여부
					onAnimatedValueUpdate={() => { }}					
				/>
			) : null}
			
			{backgroundType == 0 ? (
				<ImgDomain2 fileWidth={widnowWidth} fileName={backgroundOnlyUrl} />
			) : null}
      <View style={styles.introDescBox}>
        <View style={styles.introDescBoxWrap}>
					{memberName != '' ? (
          <Text style={styles.introDescBoxName}>{memberName}님,</Text>
					) : null}
          <Text style={[styles.introDescBoxText, styles.mgt15]}>피지컬 매치 회원으로</Text>
          <Text style={styles.introDescBoxText}>가입해주셔서 감사드립니다.</Text>
          <Text style={[styles.introDescBoxText, styles.mgt15]}>회원님이 소중한 서류를 검토중입니다.</Text>
          <Text style={styles.introDescBoxText}><Text style={styles.bold}>심사 완료까지 1-3일 정도 소요</Text>되며</Text>
          <Text style={styles.introDescBoxText}>심사 완료 시 알림을 보내드립니다.</Text>
        </View>
      </View>
			<View style={styles.introBox}>
				<TouchableOpacity
					style={[styles.introBtn, styles.boxShadow]}
					activeOpacity={opacityVal}					
					onPress={() => navigation.navigate('TabNavigation', { screen: 'Mypage' })}
				>
					<Text style={styles.introBtnText}>피지컬 매치 둘러보기</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.introBtn, styles.boxShadow, styles.mgt15]}
					activeOpacity={opacityVal}
					onPress={() => {navigation.navigate('BlockPeople')}}
				>
					<Text style={styles.introBtnText}>지인 차단하기</Text>
				</TouchableOpacity>
			</View>
			
			{loading && (
				<Animated.View style={[styles.indicator, { opacity: fadeAnim }]}>
					{backgroundType == 1 && backgroundSubUrl != '' ? (
					<ImageBackground source={{uri:backgroundSubUrl}} resizeMode="cover" >
						<View style={{width:widnowWidth, height: widnowHeight}}></View>
					</ImageBackground>				
					) : null}				
					<ActivityIndicator size="large" color="#fff" style={{position:'absolute',bottom:50,}} />
				</Animated.View>
			)}
			
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },
	fullScreen: { flex: 1, },
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, zIndex:100},		
	indicator2: { marginTop: 62 },	

  introDescBox: {width:widnowWidth, height:widnowHeight, position:'absolute', left:0, top:0, zIndex:99, alignItems:'center', justifyContent:'center'},
  introDescBoxWrap: {alignItems:'center', justifyContent:'center',position:'relative',top:-60,},
  introDescBoxName: {fontFamily:Font.NotoSansBold,fontSize:22,lineHeight:26,color:'#fff'},
  introDescBoxText: {fontFamily:Font.NotoSansRegular,fontSize:16,lineHeight:28,color:'#fff'},
	
	introBox: {position: 'absolute', left: 0, bottom: 0, zIndex: 100, paddingHorizontal: 20, paddingBottom: 60 },
	introBtn: { width: innerWidth, height: 52, backgroundColor: 'rgba(20,30,48,0.9)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection:'row'},
	introBtn2: { backgroundColor: 'rgba(0,0,0,0)', shadowColor:'transparent' },
	boxShadow: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
		elevation: 5,
	},
	introBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,fontWeight:'600',color:'#fff'},
	introArr: {position:'relative',top:-0.5,marginLeft:7},

  bold: {fontFamily:Font.NotoSansBold,},

  mgt15: {marginTop:15},
})

//export default RegisterResult
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		//member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(RegisterResult);