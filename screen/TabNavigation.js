import React, {useState, useEffect, useCallback} from 'react';
import {
  Alert,
  BackHandler,
  Button,
  Dimensions,
  Platform,
  StyleSheet,  
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AutoHeightImage from "react-native-auto-height-image";
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect, useIsFocused, useRoute } from '@react-navigation/native';
import Font from '../assets/common/Font';

import Home from './Home';
import Social from './Social/Social';
import NoticeList from './Community/NoticeList';
import Mypage from './Mypage/Mypage';

const Tab = createBottomTabNavigator();

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const TabBarMenu = (props) => {
  const {state, navigation, chatInfo} = props;
  const screenName = state.routes[state.index].name;  

  //console.log('screenName : ',screenName);
  if(screenName == 'Home' || screenName == 'Match' || screenName == 'Chat' || screenName == 'Room'){        
    
  }

  return (
    <View style={styles.TabBarMainContainer}>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('Home');
        }}
      >
        {screenName == 'Home' ? (
          <>
          {/* <AutoHeightImage width={20} source={require("../assets/img/tab_icon1_on.png")} style={styles.selectArr} /> */}
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>홈</Text>
          </View>
          </>
        ) : (
          <>
          {/* <AutoHeightImage width={20} source={require("../assets/img/tab_icon1_off.png")} style={styles.selectArr} /> */}
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText]}>홈</Text>
          </View>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('Social');
        }}
      >
        {screenName == 'Social' ? (
          <>
          {/* <AutoHeightImage width={26} source={require("../assets/img/tab_icon2_on.png")} style={styles.selectArr} /> */}
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>소셜</Text>
          </View>
          </>
        ) : (
          <>
          {/* <AutoHeightImage width={26} source={require("../assets/img/tab_icon2_off.png")} style={styles.selectArr} /> */}
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText]}>소셜</Text>
          </View>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('NoticeList');
        }}
      >
        <View style={styles.chatWrap}>
          {screenName == 'NoticeList' ? (
            <>
            {/* <AutoHeightImage width={24} source={require("../assets/img/tab_icon3_on.png")} style={styles.selectArr} /> */}
            <View style={styles.tabView}>
              <Text style={[styles.tabViewText, styles.tabViewTextOn]}>공지사항</Text>
            </View>          
            </>
          ) : (
            <>
            {/* <AutoHeightImage width={24} source={require("../assets/img/tab_icon3_off.png")} style={styles.selectArr} /> */}
            <View style={styles.tabView}>
              <Text style={[styles.tabViewText]}>공지사항</Text>
            </View>
            </>
          )}
          {chatInfo?.total_unread > 0 ? (
          <View style={styles.alimCircle}><Text style={styles.alimCircleText}>{chatInfo?.total_unread}</Text></View>
          ) : null}
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('Mypage');
        }}
      >
        {screenName == 'Mypage' ? (
          <>
          {/* <AutoHeightImage width={18} source={require("../assets/img/tab_icon4_on.png")} style={styles.selectArr} /> */}
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>마이페이지</Text>
          </View>
          </>
        ) : (
          <>
          {/* <AutoHeightImage width={18} source={require("../assets/img/tab_icon4_off.png")} style={styles.selectArr} /> */}
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText]}>마이페이지</Text>
          </View>
          </>
        )}
      </TouchableOpacity>
      {/* <PushChk navigation={navigation} /> */}      
    </View>
  )
}

const TabNav = (props) => {
	const {navigation, userInfo, chatInfo, member_chatCnt} = props;
  const [pushVisible, setPushVisible] = useState(false);
  const [state, setState] = useState(false);
  const [naviIntent, setNaviIntent] = useState('');
  const [naviProp, setNaviProp] = useState({});
  const [content, setContent] = useState('');

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){}
		}else{
			//setRouteLoad(true);
			//setPageSt(!pageSt);
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	return (
		<>
    <Tab.Navigator       
      screenOptions={{headerShown: false}}
      tabBar={ (props) => <TabBarMenu {...props} /> }
      backBehavior={'history'}
    >
      <Tab.Screen name="Home" component={Home} options={{}} initialParams={{}} />
      <Tab.Screen name="Social" component={Social} options={{}} initialParams={{}} />
      <Tab.Screen name="NoticeList" component={NoticeList} options={{}} initialParams={{}} />
      <Tab.Screen name="Mypage" component={Mypage} options={{}} />
    </Tab.Navigator>
    </>
	)
}

const styles = StyleSheet.create({
  TabBarMainContainer: {
    position:'absolute',
    bottom:0,
    zIndex:1,
    width:'100%',
    height:80,
    backgroundColor:'#fff',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15.0,
    elevation: 10,
  },
  TabBarBtn: {width:'25%',height:80,display:'flex',justifyContent:'center',alignItems:'center'},
  TabBarBtnText: {},
  TabBarBtnText2: {color:'#EC5663'},
  tabView: {marginTop:8},
  tabViewText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#C5C5C6'},
  tabViewTextOn: {fontFamily:Font.NotoSansBold,color:'#353636'},
  chatWrap: {position:'relative'},
  alimCircle: {alignItems:'center',justifyContent:'center',width:20,height:20,backgroundColor:'#DF4339',borderRadius:50,position:'absolute',top:-10,right:-10,},
  alimCircleText: {fontFamily:Font.NotoSansRegular,fontSize:8,lineHeight:22,color:'#fff'},

  modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,padding:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-100)},  
  avatarDesc: {},
  avatarDescText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919',paddingHorizontal:20,},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
});

export default connect(
  ({ User }) => ({
      userInfo: User.userInfo, //회원정보      
      chatInfo : User.chatInfo
  }),
  (dispatch) => ({
      member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
      member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회      
      member_chatCnt: (user) => dispatch(UserAction.member_chatCnt(user))
  })
)(TabNav);