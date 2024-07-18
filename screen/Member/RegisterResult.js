import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, BackHandler, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Video from 'react-native-video';

import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const RegisterResult = (props) => {
	const {navigation, userInfo, member_info, route} = props;
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [preventBack, setPreventBack] = useState(true);
	const [backPressCount, setBackPressCount] = useState(0);
	const [memberId, setMemberId] = useState();
	const [memberIdx, setMemberIdx] = useState();
	const [firebaseToken, setFirebaseToken] = useState();
	const [deviceToken, setDeviceToken] = useState();

	const [backgroundType, setBackgroundType] = useState();
	const [backgroundUrl, setBackgroundUrl] = useState('');
	const [backgroundOnlyUrl, setBackgroundOnlyUrl] = useState('');

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
				//console.log('appToken :::: ', result);
				setFirebaseToken(result);
			});
	
			AsyncStorage.getItem('deviceId', (err, result) => {		
				//console.log('deviceId :::: ', result);		
				setDeviceToken(result);
			});

			AsyncStorage.getItem('member_id', (err, result) => {		
				//console.log('member_id :::: ', result);		
				setMemberId(result);
			});

			AsyncStorage.getItem('member_idx', (err, result) => {		
				//console.log('member_idx :::: ', result);		
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
		getBackground();
	}, []);

	const getBackground = async () => {
		let sData = {
			basePath: "/api/etc/",
			type: "GetIntroBackground",
		};

		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			setBackgroundType(response.data.intro_r_type);
			setBackgroundUrl(response.host_url+response.data.intro_r_file);
			setBackgroundOnlyUrl(response.data.intro_r_file);
		}
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			{backgroundType == 1 && backgroundUrl != '' ? (
				<Video
					//source={require('../assets/video/intro.mp4')}
					source={{uri:backgroundUrl}}
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
          <Text style={styles.introDescBoxName}>홍길동님,</Text>
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
			
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },
	fullScreen: { flex: 1, },
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
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
	introBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,fontWeight:'600',color:'#fff'},
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