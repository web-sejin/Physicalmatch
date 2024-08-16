import React, {useState, useEffect} from 'react';
import {Alert, View, Text, Button, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, Image} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";

const ImgDomain2 = (props) => {
  const imgDomain = 'https://physicalmatch.co.kr';
  const {fileWidth, fileName, fileName2} = props;	

  return (
    <AutoHeightImage width={fileWidth} source={{uri:imgDomain+fileName}} resizeMethod='resize' />
  )
};

export default ImgDomain2;