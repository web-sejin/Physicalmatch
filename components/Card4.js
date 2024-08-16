import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, ImageBackground, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Font from '../assets/common/Font';
import ImgDomain from '../assets/common/ImgDomain';
import ImgDomain2 from './ImgDomain2';

const imgDomain = 'https://physicalmatch.co.kr/appImg/';
const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.95;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;
const radius = widnowWidth >= 640 ? 240 : 90;
const radius2 = widnowWidth >= 640 ? 15 : 5;

const Card4 = (props) => {
	const navigationUse = useNavigation();

	const {navigation, propsNick, propsAge, propsHeight, viewOrder, myMemberIdx, propsMemberIdx, propsAvailableState, propsCardState, propsDeleteState, propsBlockState, ModalEvent, propsImg, propsDday, propsReportState} = props;  
  const spin = useSharedValue(0);

	const frontAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(spin.value, [0, 1], [0, 180]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinValue}deg`, { duration: 300 }),
        },
      ],
    };
  }, []);
	const backAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(spin.value, [0, 1], [180, 360]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinValue}deg`, { duration: 300 }),
        },
      ],
    };
  }, []);

	const onFlip = async () => {
    //propsMrIdx
    let sData = {      
      basePath: "/api/match/",
			type: "OpenDailyCard",
      member_idx: myMemberIdx,
			mr_idx: propsMrIdx,
		}
		const response = await APIs.send(sData);
    //console.log(response);
		if(response.code == 200){
			spin.value = spin.value ? 0 : 1;
		}    
  };

  const ViewDetail = () => {
    navigation.navigate(
      'MatchDetail', 
      {
        accessType:'community', 
        mb_member_idx:propsMemberIdx,
        // commIdx:item.cpc_idx, 
        // currState:item.cpc_type,
        // reqMbIdx:item.cpc_request_member_idx,
        // recMbIdx:item.cpc_permit_member_idx,
      }
    )
    // navigation.navigate(
    //   'MatchDetail', 
    //   {
    //     accessType:'community', 
    //     mb_member_idx:propsMemberIdx,
    //     // cpcIdx:item.cpc_idx, 
    //     // currState:item.cpc_type,
    //     // reqMbIdx:item.cpc_request_member_idx,
    //     // recMbIdx:item.cpc_permit_member_idx, 
    //     cpcIdx:60, 
    //     currState:2,
    //     reqMbIdx:35,
    //     recMbIdx:138,  
    //   }
    // )
	}

	return (
    <View style={[styles.cardBtn, styles.cardBtn2, viewOrder%3 == 0 ? styles.mgr0 : null]}>
      <TouchableOpacity 
        style={[styles.fakeView]} 
        activeOpacity={opacityVal}
        onPress={()=>{          
          if(propsReportState == 'y'){
            ModalEvent(5)
          }else if(propsAvailableState == 'n'){
            ModalEvent(1)
          }else if(propsDeleteState == 'y'){
            ModalEvent(3)
          }else if(propsBlockState == 'y'){
            ModalEvent(4)
          }else if(propsCardState == 'n'){
            ModalEvent(6)
          }else{
            if(spin.value == 0){
              ViewDetail();
            }else if(spin.value == 1){
              onFlip();
            }
          }
        }}
      >
        {propsAvailableState == 'n' || propsDeleteState == 'y' || propsBlockState == 'y' ? (
          <View style={[styles.cardCont, styles.cardCont2]}>
            <ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
          </View>
        ) : (
          <>
            <Animated.View style={[styles.cardCont, styles.cardCont2, styles.front, frontAnimatedStyle]}>
              <View style={[styles.cardFrontInfo, styles.cardFrontInfo2]}>
                <View style={styles.peopleImgBack}>
                  <ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
                </View>
                <View style={styles.peopleImg}>
                  <ImgDomain2 fileWidth={(innerWidth/3)-7} fileName={propsImg} />
                </View>
                <View style={[styles.cardFrontInfoCont, styles.cardFrontInfoCont2, styles.boxShadow2]}>
                  <View	View style={styles.cardFrontDday}>
                    <Text style={styles.cardFrontDdayText}>D-{propsDday}</Text>
                  </View>
                  <View style={styles.cardFrontNick2}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.cardFrontNickText2}>{propsNick}</Text>
                  </View>
                  <View style={[styles.cardFrontContBox, styles.cardFrontContBox2, styles.mgt4]}>
                    <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{propsAge}</Text>
                    <View style={styles.cardFrontContLine}></View>
                    <Text style={[styles.cardFrontContText, styles.cardFrontContText2]}>{propsHeight}cm</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            <Animated.View style={[styles.cardCont, styles.cardCont2, styles.back, backAnimatedStyle]}>    
              <View style={styles.boxShadow}>
                <ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />     
                </View>      
            </Animated.View>
          </>
        )}                      
      </TouchableOpacity>  
    </View>
	)
}

const styles = StyleSheet.create({
  front: {position: 'absolute',},
  back: {},
	fakeView: {},
  cardBtn: { width: ((widnowWidth / 2) - 30), marginTop: 20, position: 'relative' },		
	cardCont: {width: ((widnowWidth / 2) - 30), backgroundColor:'#fff', backfaceVisibility:'hidden', borderTopLeftRadius:radius, borderTopRightRadius:radius,},	
	cardFrontInfo: {width: ((widnowWidth / 2) - 30), /*position:'absolute', left:0, top:0, zIndex:10,*/},
	peopleImgBack: {opacity:0,},
	peopleImg: {position:'absolute', left:0, top:0, zIndex:9, borderTopLeftRadius:radius, borderTopRightRadius:radius,overflow:'hidden'},
	cardFrontInfoCont: {width: ((widnowWidth / 2) - 30), backgroundColor:'#fff', position:'absolute', left:0, bottom:0, zIndex:100, paddingVertical:12, paddingHorizontal:10, borderRadius:5,},
	cardFrontNick: {flexDirection:'row', alignItems:'center', justifyContent:'space-between'},
	cardFrontNickText: {width:(innerWidth/2)-61,fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:19,color:'#1e1e1e',},
	cardFrontJob: {marginVertical:6,},
	cardFrontJobText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#888',},
	cardFrontContBox: {flexDirection:'row',alignItems:'center'},
	cardFrontContText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:16,color:'#1e1e1e',},
	cardFrontContTextRoboto: {fontFamily:Font.RobotoRegular,fontSize:12,},
	cardFrontContLine: {width:1,height:8,backgroundColor:'#EDEDED',position:'relative',top:1,marginHorizontal:6,},

	cardBtn2: {width: ((innerWidth / 3) - 7),marginRight:10,},
	cardCont2: {width: ((innerWidth / 3) - 7)},
	cardFrontInfo2: {width: ((innerWidth / 3) - 7),/*position:'absolute',left:0,top:0,opacity:1*/},
	cardFrontInfoCont2: {width: ((innerWidth / 3) - 7),paddingVertical:8, paddingHorizontal:8,},
	cardFrontDday: {},
	cardFrontDdayText: {textAlign:'center',fontFamily:Font.RobotoBold,fontSize:16,lineHeight:17,color:'#1e1e1e'},
	cardFrontNick2: {marginTop:4,},
	cardFrontNickText2: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:10,lineHeight:12,color:'#1e1e1e'},
	cardFrontContBox2: {justifyContent:'center'},
	cardFrontContText2: {fontFamily:Font.RobotoRegular,color:'#888'},

  cardBtn3: {marginTop:0,marginBottom:20},

  boxShadow: {
    borderRadius:radius2,
    borderTopLeftRadius:radius,
    borderTopRightRadius:radius,    
    backgroundColor:'#fff',
		shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
		elevation: 7,
	},
	boxShadow2: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
		elevation: 9,
	},

  mgt0: {marginTop:0,},
	mgt2: {marginTop:2,},
	mgt4: {marginTop:4,},
	mgt6: {marginTop:6,},
	mgt10: {marginTop:10,},
	mgt30: {marginTop:30,},
	mgt50: {marginTop:50,},
	mgt60: {marginTop:60,},
	mgb0: {marginBottom:0,},
	mgb10: {marginBottom:10,},
	mgb25: {marginBottom:25,},
  mgr0: {marginRight:0},
  mgr10: {marginRight:10},
  mgr20: {marginRight:20},

	w33p: {width:innerWidth*0.33},
	w66p: {width:innerWidth*0.66},
	w100p: {width:innerWidth},
})

export default Card4