import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Video from 'react-native-video';

import Font from "../../assets/common/Font";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const RegisterResult = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);

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

	return (
		<SafeAreaView style={styles.safeAreaView}>
			{/* <Video
				source={require('../../assets/video/sample.mp4')}
				style={styles.fullScreen}
				paused={false} // 재생/중지 여부
				resizeMode={"cover"} // 프레임이 비디오 크기와 일치하지 않을 때 비디오 크기를 조정하는 방법을 결정합니다. cover : 비디오의 크기를 유지하면서 최대한 맞게
				onLoad={e => console.log(e)} // 미디어가 로드되고 재생할 준비가 되면 호출되는 콜백 함수입니다.
				repeat={true} // video가 끝나면 다시 재생할 지 여부
				onAnimatedValueUpdate={() => { }}
			/> */}
      <AutoHeightImage width={widnowWidth} source={require('../../assets/image/intro_bg.jpg')} />
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
					onPress={() => {console.log('zzz')}}
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
  introDescBoxName: {fontFamily:Font.NotoSansBold,fontSize:22,lineHeight:24,color:'#fff'},
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

export default RegisterResult