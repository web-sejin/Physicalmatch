import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 20;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;

const BlockPeople = ({navigation, route}) => {	
	const scrollViewRef = useRef();
	const scrollViewRef2 = useRef();
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
  const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [preventBack, setPreventBack] = useState(false);
  const [blockNumberList, setBlockNumberList] = useState([]);
  const [blockNameList, setBlockNameList] = useState([]);
	const [realBlockNumberList, setRealBlockNumberList] = useState([]);
  const [realBlockNameList, setRealBlockNameList] = useState([]);
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [blockModal, setBlockModal] = useState(false);
	const [blockModal2, setBlockModal2] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setAll(false);
			}
		}else{
			setRouteLoad(true);
			setPageSt(!pageSt);
		}
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

  useEffect(() => {
    const unsubscribe = navigationUse.addListener('beforeRemove', (e) => {
      // 뒤로 가기 이벤트가 발생했을 때 실행할 로직을 작성합니다.
      // 여기에 원하는 동작을 추가하세요.
      // e.preventDefault();를 사용하면 뒤로 가기를 막을 수 있습니다.
      //console.log('preventBack22 ::: ',preventBack);
      if (preventBack) {        
				setPopNick(false);
				setPopGender(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);
  
	useEffect(() => {
		if (number.length === 10) {
			setNumber(number.replace(/-/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
		}

		if (number.length === 13) {
			setNumber(number.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
		}			
	}, [number]);

	const blockInsert = (v) => {
		let state = true;
		let ary = blockNumberList;
		let ary2 = blockNameList;
		if(v == 'number'){
			if(number == ''){
				ToastMessage('번호를 입력해 주세요.');
				return false;
			}

			if(number.length != 13){
				ToastMessage('번호를 정확하게 입력해 주세요.');
				return false;
			}

			for(let i=0; i<blockNumberList.length; i++){
				if(blockNumberList[i]['phoneNumber'] == number){
					state = false;
					break;
				}
			}

			if(!state){
				ToastMessage('이미 등록된 연락처입니다.');
				return false;
			}

			let blockCont = {phoneNumber : number};
			ary = [...ary, blockCont];
			setBlockNumberList(ary);
			setNumber('');

		}else if(v == 'name'){
			
			if(name == ''){
				ToastMessage('이름을 입력해 주세요.');
				return false;
			}

			for(let i=0; i<blockNameList.length; i++){
				if(blockNameList[i]['name'] == name){
					state = false;
					break;
				}
			}

			if(!state){
				ToastMessage('이미 등록된 이름입니다.');
				return false;
			}

			let blockCont = {name : name};
			ary2 = [...ary2, blockCont];
			setBlockNameList(ary2);
			setName('');
		}
	}

	const removeData = (v, z) => {
		let selectCon = [];

		if(v == 'number'){			
			blockNumberList.map((item, index) => {
				if(item.phoneNumber != z){
					let aryList = {phoneNumber : item.phoneNumber};
					selectCon = [...selectCon, aryList];
				}
			});

			setBlockNumberList(selectCon);			
			
		}else if(v == 'name'){

			blockNameList.map((item, index) => {
				if(item.name != z){
					let aryList = {name : item.name};
					selectCon = [...selectCon, aryList];
				}
			});

			setBlockNameList(selectCon);
		}
	}

  const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'지인 차단하기'} />
      <View style={styles.cmWrap}>
        <View style={styles.cmTitleBox}>
          <Text style={styles.cmTitleText}>아는 사람 피하기</Text>
        </View>
        <View style={styles.cmDescBox}>
          <Text style={styles.cmDescText}>휴대폰 번호 또는 실명을 입력해 차단합니다.</Text>
        </View>

        <View style={styles.mgt60}>
         <View style={styles.iptTit}>
            <Text style={styles.iptTitText}>차단된 연락처</Text>
            <Text style={styles.iptTitCnt}>{realBlockNumberList.length}건</Text>
          </View>
          <TouchableOpacity
            style={styles.blockBtn}
            activeOpacity={opacityVal}
            onPress={() => {
							setBlockModal(true);
							setPreventBack(true);
							setBlockNumberList(realBlockNumberList);
						}}
          >
						<ImgDomain fileWidth={18} fileName={'icon_call.png'}/>
            <Text style={styles.blockBtnText}>연락처로 차단하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mgt40}>
          <View style={styles.iptTit}>
            <Text style={styles.iptTitText}>차단된 실명</Text>
            <Text style={styles.iptTitCnt}>{realBlockNameList.length}건</Text>
          </View>
          <TouchableOpacity
            style={styles.blockBtn}
            activeOpacity={opacityVal}
            onPress={() => {
							setBlockModal2(true);
							setPreventBack(true);
							setBlockNameList(realBlockNameList);
						}}
          >
						<ImgDomain fileWidth={18} fileName={'icon_people.png'}/>
            <Text style={styles.blockBtnText}>실명으로 차단하기</Text>
          </TouchableOpacity>
        </View>
      </View>

			{blockModal ? (
      <View style={styles.cmPop}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
					}}
				>
				</TouchableOpacity>
				<KeyboardAvoidingView
					keyboardVerticalOffset={0}
					behavior={behavior}
				>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={{...styles.prvPop, }}>
							<TouchableOpacity
								style={styles.pop_x}					
								onPress={() => {
									setBlockModal(false);
									setPreventBack(false);
								}}
							>
								<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
							</TouchableOpacity>		
							<View style={styles.popTitle}>
								<Text style={styles.popTitleText}>연락처 차단</Text>
							</View>
							<View style={[styles.popIptBox]}>									
								<TextInput
									value={number}
									onChangeText={(v) => {
										setNumber(v);
									}}
                  maxLength={13}                
                  keyboardType="number-pad"
									placeholder={'010-0000-0000'}
									placeholderTextColor="#DBDBDB"
									style={[styles.input]}
									returnKyeType='done'
								/>
								<TouchableOpacity
									style={styles.btn}
									activeOpacity={opacityVal}
									onPress={() => {blockInsert('number')}}
								>
									<Text style={styles.btnText}>등록</Text>
								</TouchableOpacity>
							</View>
							<ScrollView
								ref={scrollViewRef}
								onContentSizeChange={() => {
									scrollViewRef.current.scrollToEnd({ animated: true })
								}}
							>
								<View style={styles.blockUl} onStartShouldSetResponder={() => true}>
									{blockNumberList.map((item, index) => {
										return (
											<View 
												key={index}
												style={styles.blockLi}
											>
												<Text style={styles.blockLiText}>{item.phoneNumber}</Text>
												<TouchableOpacity
													style={styles.blockRemove}
													activeOpacity={opacityVal}
													onPress={() => {
														removeData('number', item.phoneNumber);
													}}
												>
													<ImgDomain fileWidth={22} fileName={'icon_minus3.png'}/>
												</TouchableOpacity>
											</View>
										)
									})}												
								</View>
							</ScrollView>												
							<View style={styles.popBtnBox}>
								<TouchableOpacity 
									style={[styles.popBtn]}
									activeOpacity={opacityVal}
									onPress={() => {
										setRealBlockNumberList(blockNumberList);
										setBlockModal(false);
										setPreventBack(false);
									}}
								>
									<Text style={styles.popBtnText}>저장하기</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</View>
			) : null}

			{blockModal2 ? (
			<View style={styles.cmPop}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						Keyboard.dismiss();
					}}
				>
				</TouchableOpacity>
				<KeyboardAvoidingView
					keyboardVerticalOffset={0}
					behavior={behavior}
				>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={{...styles.prvPop, }}>
							<TouchableOpacity
								style={styles.pop_x}					
								onPress={() => {
									setBlockModal2(false);
									setPreventBack(false);
								}}
							>
								<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>								
							</TouchableOpacity>		
							<View style={styles.popTitle}>
								<Text style={styles.popTitleText}>실명 차단</Text>
								<Text style={styles.popTitleDesc}>실명을 통한 차단은 해당 이름을 가진</Text>
								<Text style={[styles.popTitleDesc, styles.mgt5]}>회원 전체가 차단됩니다.</Text>
							</View>
							<View style={[styles.popIptBox]}>									
								<TextInput
									value={name}
									onChangeText={(v) => {
										setName(v);
									}}          
									placeholder={'차단하고 싶은 이름을 작성해주세요.'}
									placeholderTextColor="#DBDBDB"
									style={[styles.input]}
									returnKyeType='done'
								/>
								<TouchableOpacity
									style={styles.btn}
									activeOpacity={opacityVal}
									onPress={() => {blockInsert('name')}}
								>
									<Text style={styles.btnText}>등록</Text>
								</TouchableOpacity>
							</View>
							<ScrollView
								ref={scrollViewRef2}
								onContentSizeChange={() => {
									scrollViewRef2.current.scrollToEnd({ animated: true })
								}}
							>
								<View style={styles.blockUl} onStartShouldSetResponder={() => true}>
									{blockNameList.map((item, index) => {
										return (
											<View 
												key={index}
												style={styles.blockLi}
											>
												<Text style={styles.blockLiText}>{item.name}</Text>
												<TouchableOpacity
													style={styles.blockRemove}
													activeOpacity={opacityVal}
													onPress={() => {
														removeData('name', item.name);
													}}
												>													
													<ImgDomain fileWidth={22} fileName={'icon_minus3.png'}/>
												</TouchableOpacity>
											</View>
										)
									})}												
								</View>
							</ScrollView>												
							<View style={styles.popBtnBox}>
								<TouchableOpacity 
									style={[styles.popBtn]}
									activeOpacity={opacityVal}
									onPress={() => {
										setRealBlockNameList(blockNameList);
										setBlockModal2(false);
										setPreventBack(false);
									}}
								>
									<Text style={styles.popBtnText}>저장하기</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</View>
			) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: { marginTop: 62 },
  
  cmWrap: {paddingVertical:30,paddingHorizontal:20},
  cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
	cmDescBoxFlex: {flexDirection:'row',alignItems:'center'},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},
	cmDescText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:20,color:'#B8B8B8'},
	cmDescArr: {marginHorizontal:6,position:'relative',top:1,},

  iptTit: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
  iptTitText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:17,color:'#1e1e1e'},
  iptTitCnt: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#888'},	
  blockBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,marginTop:12,},
  blockBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:18,color:'#fff',marginLeft:4,},

  input: { fontFamily: Font.NotoSansRegular, width: innerWidth-80, height: 36, backgroundColor: '#fff', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
	input2: {width: innerWidth},
	btn: {width:40,height:36,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
	btnText: {fontFamily:Font.NotoSansMedium,fontSize:15,color:'#243B55'},
  
  nextFix: {height:174,paddingHorizontal:20,paddingTop:10,},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtn2: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#243B55' },
  nextBtn3: {backgroundColor:'#fff',},
  nextBtnOff: {backgroundColor:'#DBDBDB'},
  nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  nextBtnText2: { color: '#243B55' },
  nextBtnText3: {color:'#141E30'},

  cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',zIndex:100},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},
	prvPop2: {height:innerHeight,},
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E'},
	popTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	popIptBox: {flexDirection:'row',paddingTop:10,borderBottomWidth: 1, borderColor: '#DBDBDB',},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {marginTop:30,},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},

	blockUl: {marginTop:10,},
	blockLi: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:10,paddingVertical:7,marginTop:10,},
	blockLiText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,},
	blockRemove: {},
  
  mgt0: { marginTop: 0, },
	mgt5: { marginTop: 5, },
	mgt8: { marginTop: 8, },
  mgt10: { marginTop: 10, },
  mgt40: { marginTop: 40, },
  mgt60: { marginTop: 60, },
  
})

export default BlockPeople