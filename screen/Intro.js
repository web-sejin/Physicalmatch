import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import ImgDomain from '../assets/common/ImgDomain';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import PushNotification from 'react-native-push-notification';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Intro = (props) => {
	const {navigation, member_login, member_info} = props;
	const [appToken, setAppToken] = useState();
	
	useEffect(() => {
		setTimeout(() => {
			//navigation.navigate('Intro2');
			navigation.replace('TabNavigation');
		}, 2000);	
	}, []);

	return (
		<SafeAreaView style={styles.safeAreaView}>
			{/* <Header navigation={navigation} headertitle={'기본양식'} /> */}
			<View style={styles.splash}>
				<ImgDomain fileWidth={80} fileName={'logo.png'} />
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#141E30'},
	splash: {flex:1,alignItems:'center',justifyContent:'center'},
  logo: {position:'relative',top:-60,},
})

export default Intro