import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
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
  DeviceEventEmitter,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import PushNotification from 'react-native-push-notification';
import BackgroundTimer from 'react-native-background-timer';

import Home from './Home';
import Social from './Social/Social';
import Community from './Community/Community';
import Mypage from './Mypage/Mypage';
import TodayExercise from './Exercise/TodayExercise';
import Alim from './Mypage/Alim';

const Tab = createBottomTabNavigator();

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const TabBarMenu = (props) => {
  const {state, navigation} = props;
  const [memberIdx, setMemberIdx] = useState();
  const [memberType, setMemberType] = useState(0);
  const [matchBan, setMatchBan] = useState();
  const [socialBan, setSocialBan] = useState();
  const [commBan, setCommBan] = useState();
  const [exeBan, setExeBan] = useState();
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
      memoizedGetMemInfo();
    }
  }, [memberIdx, memoizedGetMemInfo]);

  const memoizedGetMemInfo = useCallback(async () => {
    getMemInfo();
  }, [memberIdx]);

  const getMemInfo = async () => {
    let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};
	
		const response = await APIs.send(sData);    
    //console.log('response ::: ',response.data.is_exercise_ban);
    if(response.code == 200){
		  setMemberType(response.data.member_type);
      //setMatchBan(response.data.is_match_ban);
      setMatchBan(response.data.is_match_ban);
      setSocialBan(response.data.is_social_ban);
      setCommBan(response.data.is_comm_ban);
      setExeBan(response.data.is_exercise_ban);
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
            if(matchBan == 'y'){
              ToastMessage('앗! 매칭을 이용할 수 없어요🥲');  
            }else{
              navigation.navigate('Home');
            }
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
          if(socialBan == 'y'){
            ToastMessage('앗! 소셜을 이용할 수 없어요🥲');  
          }else{
            navigation.navigate('Social');
          }          
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
          if(exeBan == 'y'){
            ToastMessage('앗! 오운완을 이용할 수 없어요🥲');  
          }else{
            navigation.navigate('TodayExercise');
          }          
        }}
      >
        <View style={styles.tabIcon}>
          {screenName == 'TodayExercise' ? (
            <ImgDomain fileWidth={20} fileName={'tab5_on.png'} />
          ) : (
            <ImgDomain fileWidth={20} fileName={'tab5_off.png'} />
          )}
        </View>
        <View style={styles.tabView}>
          <Text style={[styles.tabViewText, screenName=='TodayExercise' ? styles.tabViewTextOn : null]}>오운완</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.TabBarBtn} 
        activeOpacity={opacityVal}
        onPress={() => {
          if(commBan == 'y'){
            ToastMessage('앗! 커뮤니티를 이용할 수 없어요🥲');  
          }else{
            navigation.navigate('Community');
          }
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
	const {navigation, userInfo, member_info, route} = props;
  const [startTime, setStartTime] = useState(null);  // 시작 시간
  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간
  const [timerRunning, setTimerRunning] = useState(false); // 타이머 상태

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'background' && timerRunning) {
      BackgroundTimer.runBackgroundTimer(() => {        
        const nowTime = (new Date() - startTime) / 1000;
        setElapsedTime(nowTime);

        PushNotification.localNotification({
          id: '999',
          channelId: "timer-channel",
          title: "타이머 실행 중",
          message: `경과 시간: ${nowTime.toFixed(0)} 초`,
          importance: "low",
          priority: "low",
          ongoing: true,
          silent: true,
          visibility: "secret",
          onlyAlertOnce: true,
          playSound: false,
          vibrate: false,
        });
      }, 1000);
    } else if (nextAppState === 'active') {
      BackgroundTimer.stopBackgroundTimer();
      PushNotification.cancelAllLocalNotifications();
    }
  };

  const handleStart = async () => {
    const now = new Date();
    setStartTime(now);
    await AsyncStorage.setItem('startTime', now.toString());
    setElapsedTime(0);
    setTimerRunning(true);
  };

  const handleStop = async () => {
    setTimerRunning(false);
    setElapsedTime(0);
    await AsyncStorage.removeItem('startTime');
    PushNotification.cancelAllLocalNotifications();
    BackgroundTimer.stopBackgroundTimer();
  };

  useEffect(() => {
    let interval = null;

    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedTime((new Date() - startTime) / 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerRunning, startTime]);
  
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

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('state', (e) => {
  //     const currentRouteName = e.data.state.routes[e.data.state.index].name;
  //     console.log('userInfo :::::', userInfo.is_new);
  //   });

  //   return unsubscribe;
  // }, [props.navigation]);

  useEffect(() => {
    // 포그라운드 메시지 처리
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      //console.log('포그라운드 메시지:', remoteMessage);
      const rawParams = remoteMessage.data.params;
      let parsedParams = null;
      try {
        // 문자열을 JSON으로 파싱
        const rawParams2 = JSON.parse(rawParams);
        if(rawParams2.tabState){
          parsedParams = rawParams2.tabState;
        }else{
          parsedParams = null;
        }
      } catch (e) {
        parsedParams = null;
        //console.error("Failed to parse params:", e);
      }      

      ToastMessage(remoteMessage.data.subject, 3500, '1', '', remoteMessage.data.content, parsedParams);
      
      let mb_idx = await AsyncStorage.getItem('member_idx');
      if (mb_idx) {
        //console.log('user!!!!');
        memberHandler(mb_idx);
      }
    });

    // 백그라운드에서 알림을 탭하여 앱을 열었을 때
    const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      //console.log('백그라운드에서 알림으로 앱 열림:', remoteMessage);
      const rawParams = remoteMessage.data.params;
      let parsedParams = null;
      try {
        // 문자열을 JSON으로 파싱
        const rawParams2 = JSON.parse(rawParams);
        if(rawParams2.tabState){
          parsedParams = rawParams2.tabState;
        }else{
          parsedParams = null;
        }
      } catch (e) {
        parsedParams = null;
        //console.error("Failed to parse params:", e);
      }      
      // 필요한 처리 로직 추가      
      //navigation.navigate('Alim', {alarm_type:parsedParams, prevStack:'Home'});
      navigation.navigate('Alim', {alarm_type:parsedParams});
    });

    // 앱이 종료된 상태에서 알림을 탭하여 앱을 열었을 때
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          //console.log('종료 상태에서 알림으로 앱 열림:', remoteMessage);          
          const rawParams = remoteMessage.data.params;
          let parsedParams = null;
          try {
            // 문자열을 JSON으로 파싱
            const rawParams2 = JSON.parse(rawParams);
            if(rawParams2.tabState){
              parsedParams = rawParams2.tabState;
            }else{
              parsedParams = null;
            }
          } catch (e) {
            parsedParams = null;
            //console.error("Failed to parse params:", e);
          }          
          // 필요한 처리 로직 추가
          //navigation.navigate('Alim', {alarm_type:parsedParams, prevStack:'Home'});
          navigation.navigate('Alim', {alarm_type:parsedParams});
        }
      });

    // 클린업 함수
    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };    
  }, []);

  const memberHandler = async (mb_idx) => {
    //console.log('memberHandler ::: ', mb_idx);
    const formData = new FormData();
    formData.append('type', 'GetMyInfo');
    formData.append('member_idx', mb_idx);
    //console.log(formData);
    const mem_info = await member_info(formData);

    //console.log('tabNavigation mem_info ::: ', mem_info);
  }

	return (
		<>
    <Tab.Navigator       
      screenOptions={{headerShown: false}}
      tabBar={ (props) => <TabBarMenu {...props} /> }
      backBehavior={'history'}
    >
      <Tab.Screen name="Home" component={Home} options={{}} initialParams={{}} />
      <Tab.Screen name="Social" component={Social} options={{}} initialParams={{}} />
      <Tab.Screen name="TodayExercise" component={TodayExercise} options={{}} initialParams={{}} />
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
  TabBarBtn: {width:'20%',height:86,display:'flex',alignItems:'center',paddingTop:14,},
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