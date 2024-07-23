import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import IMP from 'iamport-react-native';
import { WebView } from 'react-native-webview';

import Loading from '../Loading';
import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const RegisterStep2 = ({ navigation, route }) => {  
  const prvChk4 = route['params']['prvChk4'];
  const [isModalVisible, setIsModalVisible] = useState(false);
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
  const [active, setActive] = useState(false);
  const [routeList, setRouteList] = useState([]);
  const [accessRoute, setAccessRoute] = useState(0);
  const [loading, setLoading] = useState(false);
  const [phonenumber, setPhonenumber] = useState(route['params']['hp'] ? route['params']['hp'] : '');
  const [age, setAge] = useState(route['params']['age'] ? route['params']['age'] : '');

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
    setLoading(true);
    getRoute();    
  }, []);

  const getRoute = async () => {
    let sData = {      
      basePath: "/api/member/",
			type: "GetConnectList",
		}
		const response = await APIs.send(sData); 
    setRouteList(response.data);
    setLoading(false);
  }
  
  const nextStep = async () => {
    if (accessRoute == 0) {
      ToastMessage('접속 경로를 선택해 주세요.');
			return false;
    }    

    //본인 인증 작업    
    //navigation.navigate('Certification', {type:'Join'});

    // 현재는 본인인증을 하지 못해 번호와 나이를 얻을 수 없기 때문에 테스트 모드(test_yn='y')를 통해서 번호와 나이를 얻는다.
    // 본인인증을 이용할 때는 테스트 모드를 해제(test_yn='n')하고 번호를 넣어 중복가입인지 1년 이상 이용할 수 없는 회원인지 조회한다
    // 로그인 정보 변경(ModifyLogin.js) 파일도 함께 수정한다.
    let apiNumber = '';
    let apiAge = '';
    let sData = {
      basePath: "/api/member/",
      type: 'IsPass',
      pass_type: 0,
      //member_phone: 번호 넣기,
      test_yn: 'y'
    }
    const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200){
      apiNumber = response.member_phone;
      apiAge = response.member_age;
      setPhonenumber(apiNumber);
      setAge(apiAge);

      navigation.navigate('RegisterStep3', {
        prvChk4:prvChk4,
        accessRoute:accessRoute, 
        phonenumber:apiNumber,
        age:apiAge,
      });
    }else{
      if(response.msg == 'MANAGER BAN'){
        ToastMessage('회원가입이 제한된 번호입니다.');
        return false;
      }else if(response.msg == 'DUPLICATION PHONE'){
        ToastMessage('이미 가입된 번호입니다.');
        return false;
      }
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
                <Text style={styles.cmTitleText}>피지컬 매치를</Text>
              </View>
              <View style={[styles.cmTitleBox, styles.mgt8]}>
                <Text style={styles.cmTitleText}>어떻게 알게 되었나요?</Text>
              </View>

              <View style={styles.certBox}>
                {routeList.map((item, index) => {                  
                  return (
                    <TouchableOpacity 
                      key={index}
                      style={[styles.radioBtn, index != 0 ? styles.mgt10 : null, item.cp_idx == accessRoute ? styles.radioBtnOn : null]}
                      activeOpacity={opacityVal}
                      onPress={() => {
                        setAccessRoute(item.cp_idx);
                        setActive(true);
                      }}
                    >
                      {item.cp_idx == accessRoute ? (
                        <>
                        <Text style={[styles.radioBtnLabel, styles.radioBtnLabelOn]}>{item.cp_name}</Text>
                        <View style={[styles.circle, styles.circleOn]}>
                          <View style={styles.innerCircle}></View>
                        </View>
                        </>
                      ) : (
                        <>
                        <Text style={[styles.radioBtnLabel]}>{item.cp_name}</Text>
                        <View style={styles.circle}></View>
                        </>    
                      )}
                    </TouchableOpacity>
                  );
                })}              
              </View>
            </View>          
          </TouchableWithoutFeedback>
        </ScrollView>
        <View style={styles.nextFix}>
          <TouchableOpacity 
            style={[styles.nextBtn, active ? null : styles.nextBtnOff]}
            activeOpacity={opacityVal}
            onPress={() => nextStep()}
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
  cmTitleBox: {},
  cmTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:22,lineHeight:25,color:'#1e1e1e'},
  cmDescBox: {marginTop:8,},
  cmDescText: { fontFamily: Font.NotoSansRegular, fontSize: 14, lineHeight: 20, color: '#666' },
  
  certBox: { marginTop: 40, },
  radioBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, 
    paddingVertical: 18, borderWidth: 1, borderColor: '#ededed', borderRadius: 5,
  },
  radioBtnOn: {borderColor:'#D1913C',backgroundColor:'#FFFCF8'},
  radioBtnLabel: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 20, color: '#888', position:'relative'},
  radioBtnLabelOn: {color:'#D1913C'},
  circle: { width: 20, height: 20, borderWidth: 1, borderColor: '#ededed', borderRadius: 100, },
  circleOn: { borderColor: '#D1913C' },
  innerCircle: {width:12,height:12,backgroundColor:'#D1913C',borderRadius:50,position:'absolute',left:3,top:2.9,},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtn2: {backgroundColor:'#fff', borderWidth:1, borderColor:'#243B55'},
  nextBtnOff: {backgroundColor:'#DBDBDB'},
  nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  nextBtnText2: {color:'#243B55'},
  
  mgt8: { marginTop: 8, },
  mgt10: { marginTop: 10,}
})

export default RegisterStep2