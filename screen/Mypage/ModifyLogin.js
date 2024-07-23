import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
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

const ModifyLogin = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [memberIdx, setMemberIdx] = useState();
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [state, setState] = useState(false);
	const [id, setId] = useState();
	const [phone, setPhone] = useState();
	const [newPhone, setNewPhone] = useState();
	const [pw, setPw] = useState('');
	const [pw2, setPw2] = useState('');
	const [pw3, setPw3] = useState('');

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
				//console.log('member_idx :::: ', result);		
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
		if(pw != "" && pw2 != "" && pw3 != "" && pw2.length >= 6 && pw2.length <= 16 && pw != pw2 && pw2 == pw3){			
			setState(true);
		}else{
			setState(false);
		}
	}, [pw, pw2, pw3]);

	useEffect(() => {
		if(memberIdx){
			getMemInfo();
		}
	}, [memberIdx])

	const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);	
		//console.log(response);
		if(response.code == 200){
			setId(response.data.member_id);
			setPhone(response.data.member_phone);
		}
	}

	const fnCert = async () => {
		setNewPhone();
    let sData = {
      basePath: "/api/member/",
      type: 'IsPass',
      pass_type: 3,
      member_phone: '010-9999-7570',
      test_yn: 'n'
    }
    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      setNewPhone('010-9999-7571');
    }else{
      if(response.msg == 'MANAGER BAN'){
				setNewPhone();
        ToastMessage('회원가입이 제한된 번호입니다.');
        return false;
      }else if(response.msg == 'DUPLICATION PHONE'){
				setNewPhone();
        ToastMessage('이미 가입된 번호입니다.');
        return false;
      }
    }
	}

	const update = async () => {
		if(!pw || pw == ""){
			ToastMessage('기존 비밀번호를 입력해 주세요.');
			return false;
		}		

		if(!pw2 || pw2 == ""){
			ToastMessage('변경할 비밀번호를 입력해 주세요.');
			return false;
		}

		const num = pw2.search(/[0-9]/g);
		const eng = pw2.search(/[a-z]/ig);
		const spe = pw2.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

		if (pw2.length < 6 || pw2.length > 16) {
			ToastMessage('비밀번호는 영문, 숫자, 특수문자를 활용해 6~16자리 수를 입력해 주세요.');
			return false;
		}

		if(pw == pw2){
			ToastMessage('기존 비밀번호와 변경할 비밀번호가 같습니다.\n다시 입력해 주세요.');
			return false;
    }

		if(!pw3 || pw3 == ""){
			ToastMessage('변경할 비밀번호를 한 번 더 입력해 주세요.');
			return false;
    }
    
    if(pw2 != pw3){
			ToastMessage('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
			return false;
    }

		// if(!cert){
		// 	ToastMessage('휴대폰 번호를 인증해 주세요.');
		// 	return false;
		// }

		let sData = {
			basePath: "/api/member/",
			type: "SetMemberInfo",
      member_idx: memberIdx,
      member_pw: pw,
      member_new_pw: pw2,
      member_new_repw: pw3,
		};
		if(newPhone){
			sData.member_phone = phone;
			sData.member_new_phone = newPhone;
		}
		const response = await APIs.send(sData);		
		console.log(response);
		if(response.code == 200){
			ToastMessage('정보수정이 완료되었습니다.');
			setPw('');
			setPw2('');
			setPw3('');
			setNewPhone();
			setPhone(response.data.member_phone);
		}else{
			if(response.msg == 'INCORRECT PW'){
				ToastMessage('현재 비밀번호가 일치하지 않습니다.');
				Keyboard.dismiss();		
				return false;
			}
		}
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'로그인 정보 변경'}/>

			<ScrollView>		
        <View style={styles.cmWrap}>
					<View>
						<View style={styles.title}>
							<Text style={styles.titleText}>아이디</Text>
						</View>
						<View style={styles.input}>
							<Text style={styles.inputText}>{id}</Text>
						</View>
					</View>

					<View style={styles.mgt40}>
						<View style={styles.title}>
							<Text style={styles.titleText}>비밀번호 변경</Text>
						</View>
						<TextInput
							secureTextEntry={true}
							value={pw}
							onChangeText={(v) => setPw(v)}
							placeholder={'기존 비밀번호'}
							placeholderTextColor="#DBDBDB"
							style={[styles.input, styles.input2]}
							returnKyeType='done'
						/>
						<TextInput
							secureTextEntry={true}
							value={pw2}
							onChangeText={(v) => setPw2(v)}
							placeholder={'영문, 숫자, 특수문자 6~16자'}
							placeholderTextColor="#DBDBDB"
							style={[styles.input, styles.input2, styles.mgt15]}
							maxLength={16}
							returnKyeType='done'
						/>
						<TextInput
							secureTextEntry={true}
							value={pw3}
							onChangeText={(v) => setPw3(v)}
							placeholder={'비밀번호 확인'}
							placeholderTextColor="#DBDBDB"
							style={[styles.input, styles.input2, styles.mgt15]}
							maxLength={16}
							returnKyeType='done'
						/>
					</View>

					<View style={styles.mgt40}>
						<View style={[styles.title, styles.mgb15]}>
							<Text style={styles.titleText}>휴대폰 번호 변경</Text>
						</View>
						<TouchableOpacity 
							style={[styles.nextBtn, styles.nextBtn2]}
							activeOpacity={opacityVal}
							onPress={() => fnCert()}
						>
							<Text style={[styles.nextBtnText, styles.nextBtnText2]}>휴대폰 번호 인증</Text>
						</TouchableOpacity>
					</View>
        </View>			
			</ScrollView>

			<View style={styles.nextFix}>
				<TouchableOpacity 
					style={[styles.nextBtn, state ? null : styles.nextBtnOff]}
					activeOpacity={opacityVal}
					onPress={() => {update()}}
				>
					<Text style={styles.nextBtnText}>수정하기</Text>
				</TouchableOpacity>
			</View>	

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

  cmWrap: {paddingTop:30,paddingBottom:50,paddingHorizontal:20},

	title: {marginBottom:10,},
	titleText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},

	input: {justifyContent:'center',width:innerWidth,height:36,borderBottomWidth:1,borderBottomColor:'#1e1e1e',fontFamily:Font.NotoSansRegular,fontSize:15,color:'#1e1e1e',},
	input2: {borderBottomColor:'#DBDBDB'},
	inputText: {fontFamily:Font.NotoSansRegular,fontSize:16,lineHeight:19,color:'#1e1e1e'},	

	nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { alignContent:'center',justifyContent:'center',height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
	nextBtn2: {backgroundColor:'#fff',borderWidth:1,borderColor:'#243B55'},
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#fff'},
	nextBtnText2: {color:'#243B55'},

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
	mgb15: {marginBottom:15},
	mgb20: {marginBottom:20},
	mgr0: {marginRight:0},
  mgr10: {marginRight:10},
  mgr15: {marginRight:15},
	mgl0: {marginLeft:0},
  mgl4: {marginLeft:4},
  mgl10: {marginLeft:10},
  mgl15: {marginLeft:15},
})

export default ModifyLogin