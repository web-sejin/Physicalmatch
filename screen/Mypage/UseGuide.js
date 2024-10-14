import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { WebView } from 'react-native-webview';
import RenderHtml from 'react-native-render-html';

import APIs from "../../assets/APIs";
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

const UseGuide = (props) => {
  const webViews = useRef();
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [tabSt, setTabSt] = useState(3);
  const [tabCont, setTabCont] = useState();

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

      if(params?.guideInfo){
        setTabSt(params?.guideInfo);
        delete params?.guideInfo;
      }
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
    getCont();
  }, [tabSt]);

  const getCont = async () => {
    let sData = {      
      basePath: "/api/etc/",
			type: "GetGuide",
      tab: tabSt,
		}
		const response = await APIs.send(sData);
    //console.log(response);
		if(response.code == 200){
      // const source = {
      //   html: response.data
      // };
      setTabCont(response.data);
    }
  }

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'이용 가이드'}/>

      <View style={styles.viewTab}>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 0 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>setTabSt(3)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 0 ? styles.viewTabBtnTextOn : null]}>오운완</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 1 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>setTabSt(1)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 1 ? styles.viewTabBtnTextOn : null]}>소셜</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 2 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>setTabSt(2)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 2 ? styles.viewTabBtnTextOn : null]}>커뮤니티</Text>
        </TouchableOpacity>
      </View>

      {tabCont ? (
        <View style={{flex:1}}>
          <WebView
            ref={webViews}
            source={{uri: tabCont}}
            useWebKit={false}						
            javaScriptEnabledAndroid={true}
            allowFileAccess={true}
            renderLoading={true}
            mediaPlaybackRequiresUserAction={false}
            setJavaScriptEnabled = {false}
            scalesPageToFit={true}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}						
            originWhitelist={['*']}
            javaScriptEnabled={true}
            textZoom = {100}
          />
        </View>
        // <ScrollView style={styles.scrollView}>
        //   <View style={styles.cmWrap}>
        //     <RenderHtml
        //       contentWidth={widnowWidth}
        //       source={tabCont}            
        //     />
        //   </View>
        // </ScrollView>
      ) : (
        <View style={[styles.indicator]}>
          <ActivityIndicator size="large" color="#D1913C" />
        </View>
      )}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },	
	gapBox: {height:80,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

  cmWrap: {paddingHorizontal:20},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

	viewTab: {flexDirection:'row',},
  viewTabBtn: {alignItems:'center',justifyContent:'center',width:widnowWidth/3,height:60,paddingTop:12,borderBottomWidth:2,borderBottomColor:'#fff'},
  viewTabBtnOn: {borderBottomColor:'#141E30'},
  viewTabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#141E30',},
  viewTabBtnTextOn: {fontFamily:Font.NotoSansSemiBold},
  viewTab2: {flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#F2F4F6'},
  viewTab2Btn: {padding:20,marginLeft:30,},
  viewTab2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#888',},
  viewTab2BtnTextOn: {color:'#141E30'},

  scrollView: {flex:1,backgroundColor:'#F2F4F6'},

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

export default UseGuide