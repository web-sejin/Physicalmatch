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
import Community from './Community/Community';
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
        <View style={styles.tabIcon}>
          {screenName == 'Home' ? (
          <AutoHeightImage width={20} source={require("../assets/image/tab1_on.png")} />
          ) : (
          <AutoHeightImage width={20} source={require("../assets/image/tab1_off.png")} />
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
          <AutoHeightImage width={20} source={require("../assets/image/tab2_on.png")} />
          ) : (
          <AutoHeightImage width={20} source={require("../assets/image/tab2_off.png")} />
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
          <AutoHeightImage width={20} source={require("../assets/image/tab3_on.png")} />
          ) : (
          <AutoHeightImage width={20} source={require("../assets/image/tab3_off.png")} />
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
          <AutoHeightImage width={20} source={require("../assets/image/tab4_on.png")} />
          ) : (
          <AutoHeightImage width={20} source={require("../assets/image/tab4_off.png")} />
          )}
        </View>
        <View style={styles.tabView}>
          <Text style={[styles.tabViewText, screenName=='Mypage' ? styles.tabViewTextOn : null]}>MY</Text>
        </View>
      </TouchableOpacity> 
    </View>
  )
}

const TabNav = (props) => {
	const {navigation, userInfo, chatInfo, member_chatCnt} = props;

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){			
		}else{
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
      <Tab.Screen name="Community" component={Community} options={{}} initialParams={{}} />
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
      chatInfo : User.chatInfo
  }),
  (dispatch) => ({
      member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
      member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회      
      member_chatCnt: (user) => dispatch(UserAction.member_chatCnt(user))
  })
)(TabNav);