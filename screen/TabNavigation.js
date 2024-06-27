import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
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

import APIs from "../assets/APIs";
import ToastMessage from "../components/ToastMessage";
import Font from '../assets/common/Font';
import ImgDomain from '../assets/common/ImgDomain';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

import Home from './Home';
import Social from './Social/Social';
import Community from './Community/Community';
import Mypage from './Mypage/Mypage';

const Tab = createBottomTabNavigator();

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const TabBarMenu = (props) => {
  const {state, navigation, chatInfo} = props;
  const [memberIdx, setMemberIdx] = useState();
  const [memberType, setMemberType] = useState(0);
  const screenName = state.routes[state.index].name; 

  //console.log('screenName : ',screenName);
  useEffect(() => {
    AsyncStorage.getItem('member_idx', (err, result) => {		
      //console.log('member_idx :::: ', result);		
      setMemberIdx(result);
    });
  }, []);

  useEffect(() => {
    if(memberIdx){
      getMemInfo();
    }
  }, [memberIdx]);

  const getMemInfo = async () => {
    let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};
	
		const response = await APIs.send(sData);
    if(response.code == 200){
		  setMemberType(response.data.member_type);
    }
  }

  return (
    <>
    <View style={styles.TabBarMainContainer}>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          if(memberType == 1){
            navigation.navigate('Home');
          }else{
            ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
            return false;
          }          
        }}
      >
        <View style={styles.tabIcon}>
          {screenName == 'Home' ? (
            <ImgDomain fileWidth={20} fileName={'tab1_on.png'} />
          ) : (
            <ImgDomain fileWidth={20} fileName={'tab1_off.png'} />
          )}
        </View>
        <View style={styles.tabView}>
          <Text style={[styles.tabViewText, screenName=='Home' ? styles.tabViewTextOn : null]}>매칭</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('Social');
        }}
      >
        <View style={styles.tabIcon}>
          {screenName == 'Social' ? (
            <ImgDomain fileWidth={20} fileName={'tab2_on.png'} />
          ) : (
            <ImgDomain fileWidth={20} fileName={'tab2_off.png'} />
          )}
        </View>
        <View style={styles.tabView}>
          <Text style={[styles.tabViewText, screenName=='Social' ? styles.tabViewTextOn : null]}>소셜</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('Community');
        }}
      >
        <View style={styles.tabIcon}>
          {screenName == 'Community' ? (
            <ImgDomain fileWidth={20} fileName={'tab3_on.png'} />
          ) : (
            <ImgDomain fileWidth={20} fileName={'tab3_off.png'} />
          )}
        </View>
        <View style={styles.tabView}>
          <Text style={[styles.tabViewText, screenName=='Community' ? styles.tabViewTextOn : null]}>커뮤니티</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          navigation.navigate('Mypage');
        }}
      >
        <View style={styles.tabIcon}>
          {screenName == 'Mypage' ? (
            <ImgDomain fileWidth={20} fileName={'tab4_on.png'} />
          ) : (
            <ImgDomain fileWidth={20} fileName={'tab4_off.png'} />
          )}
        </View>
        <View style={styles.tabView}>
          <Text style={[styles.tabViewText, screenName=='Mypage' ? styles.tabViewTextOn : null]}>MY</Text>
        </View>
      </TouchableOpacity> 
    </View>
    </>
  )
}

const TabNavigation = (props) => {
	const {navigation, userInfo, route} = props;    

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){			
		}else{
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
  }

  if (Platform.OS === 'ios') { PushNotificationIOS.setApplicationIconBadgeNumber(0); }

  useEffect(() => {
    //포그라운드 상태
     messaging().onMessage((remoteMessage) => {
       console.log('포그라운드 ::: ',remoteMessage);     
     });
 
     //백그라운드 상태
     messaging().onNotificationOpenedApp((remoteMessage) => {
       //console.log('onNotificationOpenedApp', remoteMessage);
       console.log('백그라운드 ::: ', remoteMessage);     
     });
 
     //종료상태
     messaging().getInitialNotification().then((remoteMessage) => {
       // console.log('getInitialNotification', remoteMessage);
       console.log('종료상태 ::: ',remoteMessage)
     });
 
   }, []);

	return (
		<>
    <Tab.Navigator       
      screenOptions={{headerShown: false}}
      tabBar={ (props) => <TabBarMenu {...props} /> }
      backBehavior={'history'}
    >
      <Tab.Screen name="Home" component={Home} options={{}} initialParams={{}} />
      <Tab.Screen name="Social" component={Social} options={{}} initialParams={{}} />
      <Tab.Screen name="Community" component={Community} options={{}} initialParams={{}} />
      <Tab.Screen name="Mypage" component={Mypage} options={{}} />
    </Tab.Navigator>    
    </>
	)
}

const styles = StyleSheet.create({
  indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },
  TabBarMainContainer: {
    position:'absolute',
    bottom:0,
    zIndex:1,
    width:'100%',
    height:86,
    backgroundColor:'#fff',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    borderTopWidth:1,
    borderTopColor:'#F2F4F6',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 15.0,
    // elevation: 10,
  },
  TabBarBtn: {width:'25%',height:86,display:'flex',alignItems:'center',paddingTop:14,},
  tabIcon: {height:24,alignItems:'center',justifyContent:'center'},
  tabView: {marginTop:5},
  tabViewText: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:17,color:'#DBDBDB'},
  tabViewTextOn: {color:'#243B55'},
});

export default connect(
  ({ User }) => ({
      userInfo: User.userInfo, //회원정보      
  }),
  (dispatch) => ({
      member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
      member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회     
  })
)(TabNavigation);