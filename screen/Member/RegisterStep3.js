import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const RegisterStep3 = ({navigation, route}) => {	
  // console.log('phonenumber3 ::: ', route['params']['phonenumber']);
	// console.log('age3 ::: ', route['params']['age']);

  const prvChk4 = route['params']['prvChk4'];
  const accessRoute = route['params']['accessRoute'];
  const phonenumber = route['params']['phonenumber'];
  const age = route['params']['age'];
  const gender = route['params']['gender'];
  const name = route['params']['name'];

	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
  const [state, setState] = useState(false);
  const [id, setId] = useState('');
  const [certId, setCertId] = useState(false);  
  const [loading, setLoading] = useState(false);

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

  const nextStep = () => {
    if(!id || id == ""){      
			ToastMessage('아이디를 입력해 주세요.');
			return false;
		}

    if(id.length < 6 || id.length > 30){
      ToastMessage('아이디를 6~30자 내로 입력해 주세요.');
			return false;
    }

    if(!certId){
      Keyboard.dismiss();
			ToastMessage('아이디 중복확인을 진행해 주세요.');      
			return false;
		}

    const korean = id.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/);
    const num = id.search(/[0-9]/g);
    const eng = id.search(/[a-z]/ig);		
    
    // 사용가능 특수문자 = @ . - _ ( )
    const spe = id.search(/[\{\}\[\]\/?,;:|\*~`!^\+<>\#$%&\\\=\\'\"]/g);

    
    if(korean > -1){      
      ToastMessage('한글은 사용할 수 없습니다.');
			return false;
    }
    
    if(spe > -1){      
      ToastMessage('사용할 수 있는 특수문자는 @.-_() 입니다.');
			return false;
    }

    navigation.navigate('RegisterStep4', {
      prvChk4:prvChk4,
      accessRoute:accessRoute,
      phonenumber:phonenumber,
      age:age,
      gender: gender,
      name: name,
      member_id:id,
    })
  }

  const cert_id = async () => {
    if(!id || id == ""){
			ToastMessage('아이디를 입력해 주세요.');
			return false;
		}

    if(id.length < 6 || id.length > 30){
      ToastMessage('아이디를 6~30자 내로 입력해 주세요.');
			return false;
    }

    const korean = id.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/);
    const num = id.search(/[0-9]/g);
    const eng = id.search(/[a-z]/ig);		

    if(korean > -1){      
      ToastMessage('한글은 사용할 수 없습니다.');
			return false;
    }
    
    // 사용가능 특수문자 = @ . - _ ( )
    const spe = id.search(/[\{\}\[\]\/?,;:|\*~`!^\+<>\#$%&\\\=\\'\"]/g);

    if(spe > -1){
      ToastMessage('사용할 수 있는 특수문자는 @.-_() 입니다.');
			return false;
    }
    
    Keyboard.dismiss();

    let sData = {      
      basePath: "/api/member/index.php",
			type: "IsDuplicationId",
      member_id: id,
		}
		const response = await APIs.send(sData);
    if(response.code == 200){
      setCertId(true);
      setState(true);
      ToastMessage('사용할 수 있는 아이디 입니다.');
    }else{
      setCertId(false);
      setState(false);
      ToastMessage('이미 사용 중이거나 사용할 수 없는 아이디 입니다.');      
    }    
  }

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={''} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
				behavior={behavior}
				style={{flex: 1}}
      >
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.cmWrap}>
              <View style={styles.cmTitleBox}>
                <Text style={styles.cmTitleText}>계정 생성을 위한</Text>
              </View>
              <View style={[styles.cmTitleBox, styles.mgt8]}>
                <Text style={styles.cmTitleText}>아이디를 입력해 주세요.</Text>
              </View>
              <View style={styles.cmDescBox}>
                <Text style={styles.cmDescText}>아이디는 이메일 형식으로도 가능합니다.</Text>
              </View>
              <View style={styles.iptTit}>
                <Text style={styles.iptTitText}>아이디</Text>
              </View>
              <View style={styles.loginIptBox}>
                <TextInput
                  value={id}
                  maxLength={30}                            
                  onChangeText={(v) => {
                    setId(v);
                    setCertId(false);
                    setState(false);
                  }}
                  placeholder={'영문, 숫자, 특수문자(_, -, @, .) 6~30자'}
                  placeholderTextColor="#DBDBDB"
                  style={[styles.input, styles.inputWithBtn]}
                  returnKyeType='done'
                  onSubmitEditing={nextStep}
                />
                <TouchableOpacity
                  style={styles.infoChkBtn}
                  activeOpacity={opacityVal}
                  onPress={() => {cert_id()}}       
                >
                  <Text style={styles.infoChkBtnText}>중복확인</Text>
                </TouchableOpacity>
              </View>            
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        <View style={styles.nextFix}>
          <TouchableOpacity 
            style={[styles.nextBtn, state ? null : styles.nextBtnOff]}
            activeOpacity={opacityVal}
            onPress={() => {nextStep()}}
          >
            <Text style={styles.nextBtnText}>다음</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {loading ? (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#D1913C" />
      </View>
      ) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	
  
  cmWrap: {paddingVertical:30,paddingHorizontal:20},
  cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

  iptTit: {marginTop:40,},
  iptTitText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#1e1e1e'},
  loginIptBox: {marginTop:10,position:'relative',},
	input: { fontFamily: Font.NotoSansRegular, width: innerWidth, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 15, color: '#1e1e1e', },
  inputWithBtn: { paddingRight: 70 },
  infoChkBtn: { alignItems:'center',justifyContent:'center',width:60, height:30, backgroundColor:'#243B55',borderRadius:5, position: 'absolute', right:0, bottom:5,},
  infoChkBtnText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#fff', },
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  
  mgt8: { marginTop: 8, },
  mgt10: { marginTop: 10,}
})

export default RegisterStep3