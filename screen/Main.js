import React, {useState, useEffect, useRef} from 'react';
import {Alert, BackHandler, Button, Dimensions, FlatList, LogBox, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View} from 'react-native';
import { CALL_PERMISSIONS_NOTI, usePermissions } from '../hooks/usePermissions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import store from '../redux/configureStore';
import {Provider} from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import Font from '../assets/common/Font';

import Intro from './Intro';
import Intro2 from './Intro2';
import TabNavigation from './TabNavigation';
import Login from './Member/Login';
import FindId from './Member/FindId';
import IdResult from './Member/IdResult';
import FindPw from './Member/FindPw';
import PwResult from './Member/PwResult';
import RegisterStep1 from './Member/RegisterStep1';
import RegisterStep2 from './Member/RegisterStep2';
import RegisterStep3 from './Member/RegisterStep3';
import RegisterStep4 from './Member/RegisterStep4';
import RegisterStep5 from './Member/RegisterStep5';
import RegisterStep6 from './Member/RegisterStep6';
import RegisterStep7 from './Member/RegisterStep7';
import RegisterStep8 from './Member/RegisterStep8';
import RegisterResult from './Member/RegisterResult';
import BlockPeople from './Member/BlockPeople';
import MatchDetail from './Match/MatchDetail';
import SocialType from './Social/SocialType';
import SocialWrite from './Social/SocialWrite';
import SocialView from './Social/socialView';
import MySocial from './Social/MySocial';
import CommunityWrite from './Community/CommunityWrite';
import MyCommunity from './Community/MyCommunity';
import CommunityView from './Community/CommunityView';
import ProfieModify from './Mypage/ProfieModify';
import MyProfile from './Mypage/MyProfile';
import MyBadge from './Mypage/MyBadge';
import MyCert from './Mypage/MyCert';
import MyArea from './Mypage/MyArea';
import MyIntro from './Mypage/MyIntro';
import MyInfo from './Mypage/MyInfo';
import MyDate from './Mypage/MyDate';
import MyHobby from './Mypage/MyHobby';
import MyPoint from './Mypage/MyPoint';
import MyCharm from './Mypage/MyCharm';
import NewMember from './Mypage/NewMember';
import MyInvite from './Mypage/MyInvite';
import BoardMenu from './Mypage/BoardMenu';
import SettingMenu from './Mypage/SettingMenu';
import Notice from './Mypage/Notice';
import UseGuide from './Mypage/UseGuide';
import About from './Mypage/About';
import Qna from './Mypage/Qna';
import CsCenter from './Mypage/CsCenter';
import Privacy from './Mypage/Privacy';
import CsCenterWrite from './Mypage/CsCenterWrite';
import PushSet from './Mypage/PushSet';
import AccountSet from './Mypage/AccountSet';
import ModifyLogin from './Mypage/ModifyLogin';
import Alim from './Mypage/Alim';
import Shop from './Shop';
import Shop2 from './Shop2';
import CompanyInfo from './Mypage/CompanyInfo';
import Disable from './Disable';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

// Text 적용
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// TextInput 적용
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const WholeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown:false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="TabNavigation"
        component={TabNavigation}
        // options={{ headerShown: false, animationEnabled: false }}
      />
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Intro2" component={Intro2} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="FindId" component={FindId} />      
      <Stack.Screen name="IdResult" component={IdResult} />
      <Stack.Screen name="FindPw" component={FindPw} />
      <Stack.Screen name="PwResult" component={PwResult} />
      <Stack.Screen name="RegisterStep1" component={RegisterStep1} />
      <Stack.Screen name="RegisterStep2" component={RegisterStep2} />
      <Stack.Screen name="RegisterStep3" component={RegisterStep3} />
      <Stack.Screen name="RegisterStep4" component={RegisterStep4} />
      <Stack.Screen name="RegisterStep5" component={RegisterStep5} />
      <Stack.Screen name="RegisterStep6" component={RegisterStep6} />
      <Stack.Screen name="RegisterStep7" component={RegisterStep7} />
      <Stack.Screen name="RegisterStep8" component={RegisterStep8} />
      <Stack.Screen name="RegisterResult" component={RegisterResult} />
      <Stack.Screen name="BlockPeople" component={BlockPeople} />
      <Stack.Screen name="MatchDetail" component={MatchDetail} />
      <Stack.Screen name="SocialType" component={SocialType} />
      <Stack.Screen name="SocialWrite" component={SocialWrite} />
      <Stack.Screen name="SocialView" component={SocialView} />
      <Stack.Screen name="MySocial" component={MySocial} />
      <Stack.Screen name="CommunityWrite" component={CommunityWrite} />
      <Stack.Screen name="MyCommunity" component={MyCommunity} />
      <Stack.Screen name="CommunityView" component={CommunityView} />
      <Stack.Screen name="ProfieModify" component={ProfieModify} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="MyBadge" component={MyBadge} />
      <Stack.Screen name="MyCert" component={MyCert} />
      <Stack.Screen name="MyArea" component={MyArea} />      
      <Stack.Screen name="MyInfo" component={MyInfo} />
      <Stack.Screen name="MyIntro" component={MyIntro} />
      <Stack.Screen name="MyDate" component={MyDate} />
      <Stack.Screen name="MyHobby" component={MyHobby} />
      <Stack.Screen name="MyPoint" component={MyPoint} />
      <Stack.Screen name="MyCharm" component={MyCharm} />
      <Stack.Screen name="NewMember" component={NewMember} />
      <Stack.Screen name="MyInvite" component={MyInvite} />
      <Stack.Screen name="BoardMenu" component={BoardMenu} />
      <Stack.Screen name="Notice" component={Notice} />
      <Stack.Screen name="UseGuide" component={UseGuide} />
      <Stack.Screen name="Qna" component={Qna} />
      <Stack.Screen name="About" component={About} />      
      <Stack.Screen name="CsCenter" component={CsCenter} />
      <Stack.Screen name="CsCenterWrite" component={CsCenterWrite} />
      <Stack.Screen name="Privacy" component={Privacy} />      
      <Stack.Screen name="SettingMenu" component={SettingMenu} />
      <Stack.Screen name="PushSet" component={PushSet} />
      <Stack.Screen name="AccountSet" component={AccountSet} />
      <Stack.Screen name="ModifyLogin" component={ModifyLogin} />
      <Stack.Screen name="Alim" component={Alim} />
      <Stack.Screen name="Shop" component={Shop} />
      <Stack.Screen name="Shop2" component={Shop2} />
      <Stack.Screen name="CompanyInfo" component={CompanyInfo} />
      <Stack.Screen name="Disable" component={Disable} />
    </Stack.Navigator>
  );
};

const Main = () => {    
  usePermissions(CALL_PERMISSIONS_NOTI);
  const [toastState, setToastState] = useState(false);

  const toastConfig = {
		custom_type: (internalState) => (
			<View
				style={{
					backgroundColor: '#000',
					borderRadius: 10,
					paddingVertical: 10,
					paddingHorizontal: 20,
					opacity: 0.8,
				}}
			>
				<Text
					style={{
						textAlign: 'center',
						color: '#FFFFFF',
						fontSize: 15,
						lineHeight: 22,
						fontFamily: Font.NotoSansRegular,
						letterSpacing: -0.38,
					}}
				>
					{internalState.text1}
				</Text>
			</View>
		),
  };
  
  useEffect(() => {
    setTimeout(function () {
      setToastState(true);
    }, 500);
  })
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer >
            <WholeStack />
          </NavigationContainer> 
        </PaperProvider>
        {toastState ? (<Toast config={toastConfig} />) : null}
      </Provider>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
})

export default Main;