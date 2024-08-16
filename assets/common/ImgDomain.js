import React, {useState, useEffect} from 'react';
import {Alert, View, Text, Button, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, Image} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";

const ImgDomain = (props) => {
  const imgDomain = 'https://physicalmatch.co.kr/appImg/';
  const {fileWidth, fileName, fileName2, memberType} = props;	

  return (
    <AutoHeightImage width={fileWidth} source={{uri:imgDomain+fileName}} style={memberType == 0 ? styles.blurEffect : null} resizeMethod='resize' />
  )
};

const styles = StyleSheet.create({
  blurEffect: {opacity:0.5},
});

export default ImgDomain;