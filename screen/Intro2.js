import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, BackHandler, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';

import APIs from '../assets/APIs';
import Font from "../assets/common/Font";
import ImgDomain from '../assets/common/ImgDomain';
import ImgDomain2 from '../components/ImgDomain2';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Intro2 = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);	
	const [backPressCount, setBackPressCount] = useState(0);
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
			setBackgroundType(response.data.intro_i_type);
			setBackgroundUrl(response.host_url+response.data.intro_i_file);
			setBackgroundOnlyUrl(response.data.intro_i_file);
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
			
			<View style={styles.introTextBox}>
				<ImgDomain fileWidth={38} fileName={'intro_logo.png'} />
				<View style={styles.introTextView}>
					<Text style={styles.introText}>기다리던</Text>
					<Text style={styles.introText}>그 인연을</Text>
					<Text style={styles.introText}>지금, 여기서</Text>
				</View>
			</View>
			<View style={styles.introBox}>
				<TouchableOpacity
					style={[styles.introBtn]}
					activeOpacity={opacityVal}
					onPress={() => {navigation.navigate('RegisterStep1')}}
				>
					<Text style={styles.introBtnText}>피지컬 매치 시작하기</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.introBtn, styles.mgt15]}
					activeOpacity={opacityVal}
					onPress={() => {
						navigation.navigate('Login');
					}}
				>
					<Text style={styles.introBtnText}>로그인하기</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.introBtn, styles.introBtn2, styles.mgt15]}
					activeOpacity={opacityVal}
					onPress={() => {navigation.navigate('CsCenter')}}
				>
					<Text style={styles.introBtnText}>피지컬 매치 알아보기</Text>
					<View style={styles.introArr}>
						<ImgDomain fileWidth={8} fileName={'intro2_arr.png'}/>
					</View>					
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

	mgt15: {marginTop:15},

	introTextBox: {position:'absolute',left:0,top:105,zIndex:100,paddingHorizontal:48,},
	introTextView: {marginTop:40,},
	introText: {fontFamily:Font.NotoSansBold,fontSize:24,lineHeight:36,color:'#fff'},
	
	introBox: {position: 'absolute', left: 0, bottom: 0, zIndex: 100, paddingHorizontal: 20, paddingBottom: 60 },
	introBtn: { width: innerWidth, height: 52, backgroundColor: 'rgba(20,30,48,0.9)', borderRadius: 5, alignItems: 'center', justifyContent: 'center', flexDirection:'row'},
	introBtn2: { backgroundColor: 'rgba(0,0,0,0)', shadowColor:'transparent' },
	boxShadow: {
		borderWidth: 1,
		borderColor: '#000',
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
		elevation: 5,
	},
	introBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#fff'},
	introArr: {position:'relative',top:0,marginLeft:7},
})

export default Intro2