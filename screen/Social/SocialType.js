import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

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

const SocialType = (props) => {

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wrtCate, setWrtCate] = useState(0);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
      setWrtCate(0);
		}else{
			//console.log("isFocused");
			setRouteLoad(true);
			setPageSt(!pageSt);
		}

		Keyboard.dismiss();
		Toast.hide();
    setLoading(false);
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

  const selectType = (v) => {
    setWrtCate(v);
    setLoading(true);
    setTimeout(function(){
      setLoading(false);      
      navigation.navigate('SocialWrite', {wrtType: v});      
    }, 1000);
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <Header navigation={navigation} />
      <ScrollView>
        <View style={styles.cmWrap}>
          <View style={styles.cmTitleBox}>
            <Text style={styles.cmTitleText}>어떤 소셜 룸을 만들까요?</Text>
          </View>
          <View style={styles.cmDescBox}>
            <Text style={styles.cmDescText}>소셜 룸을 자유롭게 선택하여</Text>
            <Text style={styles.cmDescText}>새로운 만남의 기회를 열어보세요!</Text>
          </View>
          <View style={[styles.wrtType, styles.mgt50]}>
            <TouchableOpacity
              style={[styles.wrtTypeBtn, styles.boxShadow, wrtCate == 1 ? styles.wrtTypeBtnOn : null]}
              activeOpacity={opacityVal}
              onPress={()=>selectType(1)}
            >
              <Text style={[styles.wrtTypeBtnText1, wrtCate == 1 ? styles.wrtTypeBtnText1On : null]}>1:1</Text>
              <View style={[styles.wrtTypeBtnText2Box]}>
                <Text style={[styles.wrtTypeBtnText2, wrtCate == 1 ? styles.wrtTypeBtnText2On : null]}>호스트와 1:1로</Text>
                <Text style={[styles.wrtTypeBtnText2, wrtCate == 1 ? styles.wrtTypeBtnText2On : null]}>깊이 있게 만나요</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.wrtTypeBtn, styles.boxShadow, wrtCate == 2 ? styles.wrtTypeBtnOn : null]}
              activeOpacity={opacityVal}
              onPress={()=>selectType(2)}
            >
              <Text style={[styles.wrtTypeBtnText1, wrtCate == 2 ? styles.wrtTypeBtnText1On : null]}>미팅</Text>
              <View style={[styles.wrtTypeBtnText2Box]}>
                <Text style={[styles.wrtTypeBtnText2, wrtCate == 2 ? styles.wrtTypeBtnText2On : null]}>다수 : 다수로</Text>
                <Text style={[styles.wrtTypeBtnText2, wrtCate == 2 ? styles.wrtTypeBtnText2On : null]}>성별비를 맞춰</Text>
                <Text style={[styles.wrtTypeBtnText2, wrtCate == 2 ? styles.wrtTypeBtnText2On : null]}>함께 만나요</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.wrtTypeBtn, styles.boxShadow, wrtCate == 3 ? styles.wrtTypeBtnOn : null]}
              activeOpacity={opacityVal}
              onPress={()=>selectType(3)}
            >
              <Text style={[styles.wrtTypeBtnText1, wrtCate == 3 ? styles.wrtTypeBtnText1On : null]}>모임</Text>
              <View style={[styles.wrtTypeBtnText2Box]}>
                <Text style={[styles.wrtTypeBtnText2, wrtCate == 3 ? styles.wrtTypeBtnText2On : null]}>성별 상관없이</Text>
                <Text style={[styles.wrtTypeBtnText2, wrtCate == 3 ? styles.wrtTypeBtnText2On : null]}>2인 이상</Text>
                <Text style={[styles.wrtTypeBtnText2, wrtCate == 3 ? styles.wrtTypeBtnText2On : null]}>가볍게 만나요</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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

  cmWrap: {paddingVertical:30,paddingHorizontal:20},
  cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

  wrtType: {flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  wrtTypeBtn: {alignItems:'center',justifyContent:'center',width:(innerWidth/3)-7,height:149,backgroundColor:'#fff'},
  wrtTypeBtnOn: {backgroundColor:'#243B55'},
  wrtTypeBtnText1: {fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E'},
  wrtTypeBtnText1On: {color:'#fff'},
  wrtTypeBtnText2Box: {height:60,justifyContent:'center',marginTop:13,},
  wrtTypeBtnText2: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:20,color:'#1E1E1E'},
  wrtTypeBtnText2On: {color:'#fff'},

  boxShadow: {
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
		elevation: 3,
	},

  pdt0: {paddingTop:0,},
	mgt0: {marginTop:0},
	mgt5: {marginTop:5},
	mgt10: {marginTop:10},
	mgt20: {marginTop:20},
	mgt30: {marginTop:30},
	mgt40: {marginTop:40},
	mgt50: {marginTop:50},
	mgb10: {marginBottom:10},
	mgb20: {marginBottom:20},
	mgr0: {marginRight:0},
	mgl0: {marginLeft:0},
})

export default SocialType