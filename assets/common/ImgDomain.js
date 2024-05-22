import React, {useState, useEffect} from 'react';
import {Alert, View, Text, Button, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, Image} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";

const ImgDomain = (props) => {
  const imgDomain = 'https://cnj02.cafe24.com/appImg/';
  const {fileWidth, fileName, fileName2} = props;	

  return (
    <AutoHeightImage width={fileWidth} source={{uri:imgDomain+fileName}} resizeMethod='resize' />
  )
};

export default ImgDomain;