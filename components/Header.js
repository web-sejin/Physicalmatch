import React, {useState, useEffect} from 'react';
import {Alert, View, Text, Button, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, Image} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";

import Font from "../assets/common/Font";

// Text 적용
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// TextInput 적용
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const opacityVal = 0.8;

const Header = (props) => {    
	const {navigation, headertitle, backType=''} = props;	
	
	return (
		<View style={styles.header}>
			<>			
			<Text numberOfLines={1} ellipsizeMode='tail' style={[styles.headerTitle, headertitle == 'MY PAGE' ? styles.robotoMd : null]}>{headertitle}</Text>
			{backType == 'close' ? (
			<TouchableOpacity
				style={styles.headerBackBtn2}
				onPress={() => navigation.goBack()}
				activeOpacity={opacityVal}
			>
				<AutoHeightImage width={14} source={require("../assets/image/icon_close.png")} />
			</TouchableOpacity>
			) : (
			<TouchableOpacity 
			onPress={() => {
				navigation.goBack();
			}} 
			style={styles.headerBackBtn} 
			activeOpacity={opacityVal}
			>
				<AutoHeightImage width={8} source={require("../assets/image/icon_header_back.png")} />
			</TouchableOpacity>
			)}
			</>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn: {width:54,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerBackBtn2: {width:56,height:48,position:'absolute',right:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	robotoMd: {fontFamily:Font.RobotoMedium},
});

export default Header;