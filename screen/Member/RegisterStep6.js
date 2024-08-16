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
import { ScrollView as GestureHandlerScrollView } from 'react-native-gesture-handler'
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import { WebView } from 'react-native-webview';
import RenderHtml from 'react-native-render-html';

import APIs from "../../assets/APIs"
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

const RegisterStep6 = ({navigation, route}) => {		
	// console.log('phonenumber6 ::: ', route['params']['phonenumber']);
	// console.log('age6 ::: ', route['params']['age']);
	
	const nextObj = {
		prvChk4:route['params']['prvChk4'],
		accessRoute:route['params']['accessRoute'],
		phonenumber:route['params']['phonenumber'],
		age:route['params']['age'],
		gender:route['params']['gender'],
		name:route['params']['name'],
		member_id:route['params']['member_id'],
		member_pw:route['params']['member_pw'],
		member_nick:route['params']['member_nick'],
		member_sex:route['params']['member_sex'],
		member_main_local:route['params']['member_main_local'],		
		member_main_local_detail:route['params']['member_main_local_detail'],
		member_sub_local:route['params']['member_sub_local'],
		member_sub_local_detail:route['params']['member_sub_local_detail'],
		member_education:route['params']['member_education'],
		member_education_status:route['params']['member_education_status'],
		member_job:route['params']['member_job'],
		member_job_detail:route['params']['member_job_detail'],
		member_height:route['params']['member_height'],
		member_weight:route['params']['member_weight'],
		member_muscle:route['params']['member_muscle'],
		member_fat:route['params']['member_fat'],
		member_no_weight:route['params']['member_no_weight'],
		member_no_muscle:route['params']['member_no_muscle'],
		member_no_fat:route['params']['member_no_fat'],
		member_rest:route['params']['member_rest'],
		member_exercise:route['params']['member_exercise'],
		member_physicalType:route['params']['member_physicalType'],
		member_drink_status:route['params']['member_drink_status'],
		member_drinkText:route['params']['member_drinkText'],
		member_smoke_status:route['params']['member_smoke_status'],
		member_smokeText:route['params']['member_smokeText'],
		member_smoke_type:route['params']['member_smoke_type'],
		member_smokeSortText:route['params']['member_smokeSortText'],
		member_mbit1:route['params']['member_mbit1'],
		member_mbit2:route['params']['member_mbit2'],
		member_mbit3:route['params']['member_mbit3'],
		member_mbit4:route['params']['member_mbit4'],
		mbti_result:route['params']['mbti_result'],
		member_religion:route['params']['member_religion'],
	}

	const webViews = useRef();
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [currFocus, setCurrFocus] = useState('');
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);
	const [file1, setFile1] = useState({});
	const [file2, setFile2] = useState({});
	const [file3, setFile3] = useState({});
	const [file4, setFile4] = useState({});
	const [file5, setFile5] = useState({});
	const [file6, setFile6] = useState({});
	const [guideModal, setGuideModal] = useState(false);
	const [guideCont, setGuideCont] = useState();

	const [nextOpen, setNextOpen] = useState(false);	

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

			if(route['params']['file1']){
				let selectObj = {idx: route['params']['file1']['idx'], path: route['params']['file1']['path'], mime: route['params']['file1']['mime']}
				setFile1(selectObj);
			}
	
			if(route['params']['file2']){
				let selectObj = {idx: route['params']['file2']['idx'], path: route['params']['file2']['path'], mime: route['params']['file2']['mime']}
				setFile2(selectObj);
			}
	
			if(route['params']['file3']){
				let selectObj = {idx: route['params']['file3']['idx'], path: route['params']['file3']['path'], mime: route['params']['file3']['mime']}
				setFile3(selectObj);
			}
	
			if(route['params']['file4']){
				let selectObj = {idx: route['params']['file4']['idx'], path: route['params']['file4']['path'], mime: route['params']['file4']['mime']}
				setFile4(selectObj);
			}
			
			if(route['params']['file5']){
				let selectObj = {idx: route['params']['file5']['idx'], path: route['params']['file5']['path'], mime: route['params']['file5']['mime']}
				setFile5(selectObj);
			}
	
			if(route['params']['file6']){
				let selectObj = {idx: route['params']['file6']['idx'], path: route['params']['file6']['path'], mime: route['params']['file6']['mime']}
				setFile6(selectObj);
			}
		}
		Keyboard.dismiss();
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
				setGuideModal(false);
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

	useEffect(() => {
		getGuideCont();
	}, [])

	const getGuideCont = async () => {
		let sData = {      
      basePath: "/api/etc/",
			type: "GetProfileGuide",
		}
		const response = await APIs.send(sData);		
		//console.log('response ::: ', response);
		if(response.code == 200){
			// const source = {
      //   html: response.data
      // };			
      setGuideCont(response.data);
		}
	}

	const chooseImage = (v) => {
    ImagePicker.openPicker({
      width: 1024,
      height: 1024*1.355,
      cropping: true,
    })
		.then(image => {
			let selectObj = {idx: v, path: image.path, mime: image.mime}			
			if(v == 1){
				setFile1(selectObj);
			}else if(v == 2){
				setFile2(selectObj);
			}else if(v == 3){
				setFile3(selectObj);
			}else if(v == 4){
				setFile4(selectObj);
			}else if(v == 5){
				setFile5(selectObj);
			}else if(v == 6){
				setFile6(selectObj);
			}
		})
		.finally(() => {

		});
  };

	const nextStep = async () => {
		const fileData = [];		
		if(!file1.path || !file2.path || !file3.path){
			ToastMessage('대표 및 필수 영역의 사진을 등록해 주세요.');
			return false;
		}		
		
		if(file1.path){ 
			nextObj.file1 = file1; 		
			fileData[0] = {uri: file1?.path, name: 'profile1.png', type: file1?.mime};
		}

		if(file2.path){ 
			nextObj.file2 = file2;
			fileData[1] = {uri: file2?.path, name: 'profile2.png', type: file2?.mime};
		}

    if(file3.path){ 
			nextObj.file3 = file3; 
			fileData[2] = {uri: file3?.path, name: 'profile3.png', type: file3?.mime};
		}

    if(file4.path){ 
			nextObj.file4 = file4; 
			fileData[fileData.length] = {uri: file4?.path, name: 'profile4.png', type: file4?.mime};
		}

    if(file5.path){ 
			nextObj.file5 = file5; 
			fileData[fileData.length] = {uri: file5?.path, name: 'profile5.png', type: file5?.mime};
		}
		
    if(file6.path){ 
			nextObj.file6 = file6; 
			fileData[fileData.length] = {uri: file6?.path, name: 'profile6.png', type: file6?.mime};
		}

		if(route['params']['qnaList']){ nextObj.qnaList = route['params']['qnaList']; }
		if(route['params']['member_intro']){ nextObj.member_intro = route['params']['member_intro']; }
		//if(route['params']['qnaListData']){ nextObj.qnaListData = route['params']['qnaListData']; }
		if(route['params']['qnaListChk']){ nextObj.qnaListChk = route['params']['qnaListChk']; }
		if(route['params']['step8File1']){ nextObj.step8File1 = route['params']['step8File1']; }
		if(route['params']['step8File2']){ nextObj.step8File2 = route['params']['step8File2']; }
		if(route['params']['step8File3']){ nextObj.step8File3 = route['params']['step8File3']; }
		if(route['params']['step8File4']){ nextObj.step8File4 = route['params']['step8File4']; }
		if(route['params']['step8File5']){ nextObj.step8File5 = route['params']['step8File5']; }
		if(route['params']['step8File6']){ nextObj.step8File6 = route['params']['step8File6']; }
		if(route['params']['step8File7']){ nextObj.step8File7 = route['params']['step8File7']; }
		if(route['params']['step8File8']){ nextObj.step8File8 = route['params']['step8File8']; }
		if(route['params']['step8Grade1']){ nextObj.step8Grade1 = route['params']['step8Grade1']; }
		if(route['params']['step8Grade2']){ nextObj.step8Grade2 = route['params']['step8Grade2']; }
		if(route['params']['step8Grade3']){ nextObj.step8Grade3 = route['params']['step8Grade3']; }
		if(route['params']['step8Grade4']){ nextObj.step8Grade4 = route['params']['step8Grade4']; }
		if(route['params']['step8Grade5']){ nextObj.step8Grade5 = route['params']['step8Grade5']; }
		if(route['params']['step8Grade6']){ nextObj.step8Grade6 = route['params']['step8Grade6']; }
		if(route['params']['step8Grade7']){ nextObj.step8Grade7 = route['params']['step8Grade7']; }
		if(route['params']['step8Grade8']){ nextObj.step8Grade8 = route['params']['step8Grade8']; }
		if(route['params']['step8JobFile']){ nextObj.step8JobFile = route['params']['step8JobFile']; }
		if(route['params']['step8SchoolFile']){ nextObj.step8SchoolFile = route['params']['step8SchoolFile']; }
		if(route['params']['step8SchoolName']){ nextObj.step8SchoolName = route['params']['step8SchoolName']; }
		if(route['params']['step8SchoolMajor']){ nextObj.step8SchoolMajor = route['params']['step8SchoolMajor']; }
		if(route['params']['step8MarryFile']){ nextObj.step8MarryFile = route['params']['step8MarryFile']; }
		if(route['params']['step8MarryState']){ nextObj.step8MarryState = route['params']['step8MarryState']; }
		if(route['params']['file1Url']){ nextObj.file1Url = route['params']['file1Url']; }
		if(route['params']['file2Url']){ nextObj.file2Url = route['params']['file2Url']; }
		if(route['params']['file3Url']){ nextObj.file3Url = route['params']['file3Url']; }
		if(route['params']['file4Url']){ nextObj.file4Url = route['params']['file4Url']; }
		if(route['params']['file5Url']){ nextObj.file5Url = route['params']['file5Url']; }
		if(route['params']['file6Url']){ nextObj.file6Url = route['params']['file6Url']; }
		if(route['params']['file7Url']){ nextObj.file7Url = route['params']['file7Url']; }
		if(route['params']['file8Url']){ nextObj.file8Url = route['params']['file8Url']; }
		if(route['params']['jobFileUrl']){ nextObj.jobFileUrl = route['params']['jobFileUrl']; }
		if(route['params']['schoolFileUrl']){ nextObj.schoolFileUrl = route['params']['schoolFileUrl']; }
		if(route['params']['marryFileUrl']){ nextObj.marryFileUrl = route['params']['marryFileUrl']; }		

		//console.log('fileData :::: ', fileData);
		setLoading(true);
		let sData = {      
      basePath: "/api/member/index.php",
			type: "SetTempImage",
			dir:'profile',
      files: fileData,			
		}
		const formData = APIs.makeFormData(sData)
		const response = await APIs.multipartRequest(formData);		
		//console.log('!!!!!!!! ',response);
		if(response.code == 200){
			nextObj.fileResData = response.data;
			setLoading(false);
		}

		//console.log(nextObj);

		navigation.navigate('RegisterStep7', nextObj);
	}

	const source = {
    html: '<p style="color: red;">This is a red paragraph.</p>'
  };

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'프로필 등록'} />

			<View style={styles.regiStateBarBox}>
				<View style={styles.regiStateBar}>
					<TouchableOpacity 
            style={[styles.regiStateCircel, styles.regiStateCircelOn]}
						activeOpacity={opacityVal}
            onPress={()=>{
							nextObj.file1 = file1;
							nextObj.file2 = file2;
							nextObj.file3 = file3;
							nextObj.file4 = file4;
							nextObj.file5 = file5;
							nextObj.file6 = file6;
							if(route['params']['qnaList']){ nextObj.qnaList = route['params']['qnaList']; }														
							if(route['params']['member_intro']){ nextObj.member_intro = route['params']['member_intro']; }
							//if(route['params']['qnaListData']){ nextObj.qnaListData = route['params']['qnaListData']; }
							if(route['params']['qnaListChk']){ nextObj.qnaListChk = route['params']['qnaListChk']; }
							if(route['params']['step8File1']){ nextObj.step8File1 = route['params']['step8File1']; }
							if(route['params']['step8File2']){ nextObj.step8File2 = route['params']['step8File2']; }
							if(route['params']['step8File3']){ nextObj.step8File3 = route['params']['step8File3']; }
							if(route['params']['step8File4']){ nextObj.step8File4 = route['params']['step8File4']; }
							if(route['params']['step8File5']){ nextObj.step8File5 = route['params']['step8File5']; }
							if(route['params']['step8File6']){ nextObj.step8File6 = route['params']['step8File6']; }
							if(route['params']['step8File7']){ nextObj.step8File7 = route['params']['step8File7']; }
							if(route['params']['step8File8']){ nextObj.step8File8 = route['params']['step8File8']; }
							if(route['params']['step8Grade1']){ nextObj.step8Grade1 = route['params']['step8Grade1']; }
							if(route['params']['step8Grade2']){ nextObj.step8Grade2 = route['params']['step8Grade2']; }
							if(route['params']['step8Grade3']){ nextObj.step8Grade3 = route['params']['step8Grade3']; }
							if(route['params']['step8Grade4']){ nextObj.step8Grade4 = route['params']['step8Grade4']; }
							if(route['params']['step8Grade5']){ nextObj.step8Grade5 = route['params']['step8Grade5']; }
							if(route['params']['step8Grade6']){ nextObj.step8Grade6 = route['params']['step8Grade6']; }
							if(route['params']['step8Grade7']){ nextObj.step8Grade7 = route['params']['step8Grade7']; }
							if(route['params']['step8Grade8']){ nextObj.step8Grade8 = route['params']['step8Grade8']; }
							if(route['params']['step8JobFile']){ nextObj.step8JobFile = route['params']['step8JobFile']; }
							if(route['params']['step8SchoolFile']){ nextObj.step8SchoolFile = route['params']['step8SchoolFile']; }
							if(route['params']['step8SchoolName']){ nextObj.step8SchoolName = route['params']['step8SchoolName']; }
							if(route['params']['step8SchoolMajor']){ nextObj.step8SchoolMajor = route['params']['step8SchoolMajor']; }
							if(route['params']['step8MarryFile']){ nextObj.step8MarryFile = route['params']['step8MarryFile']; }
							if(route['params']['step8MarryState']){ nextObj.step8MarryState = route['params']['step8MarryState']; }
							if(route['params']['file1Url']){ nextObj.file1Url = route['params']['file1Url']; }
							if(route['params']['file2Url']){ nextObj.file2Url = route['params']['file2Url']; }
							if(route['params']['file3Url']){ nextObj.file3Url = route['params']['file3Url']; }
							if(route['params']['file4Url']){ nextObj.file4Url = route['params']['file4Url']; }
							if(route['params']['file5Url']){ nextObj.file5Url = route['params']['file5Url']; }
							if(route['params']['file6Url']){ nextObj.file6Url = route['params']['file6Url']; }
							if(route['params']['file7Url']){ nextObj.file7Url = route['params']['file7Url']; }
							if(route['params']['file8Url']){ nextObj.file8Url = route['params']['file8Url']; }
							if(route['params']['jobFileUrl']){ nextObj.jobFileUrl = route['params']['jobFileUrl']; }
							if(route['params']['schoolFileUrl']){ nextObj.schoolFileUrl = route['params']['schoolFileUrl']; }
							if(route['params']['marryFileUrl']){ nextObj.marryFileUrl = route['params']['marryFileUrl']; }

							navigation.navigate('RegisterStep5', nextObj);
            }}
          >
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText, styles.regiStateTexOn]}>기본 정보</Text>
					</TouchableOpacity>
          <View style={[styles.regiStateCircel, styles.regiStateCircelOn]}>
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText, styles.regiStateTexOn]}>프로필 등록</Text>
					</View>
          <View style={[styles.regiStateCircel]}>
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText]}>소개글</Text>
					</View>
          <View style={[styles.regiStateCircel]}>
						<View style={styles.regiStateCircel2}></View>
						<Text style={[styles.regiStateText]}>인증</Text>
					</View>
				</View>
			</View>

			<ScrollView>		
				<View style={styles.cmWrap}>
					<View style={styles.regiTypingView}>
						<View style={styles.cmTitleBox}>
							<Text style={styles.cmTitleText}>사진을 등록해 주세요!</Text>
						</View>
						<View style={styles.cmDescBox}>
							<Text style={styles.cmDescText}>나를 잘 드러내는 얼굴, 전신 각 1장은 필수입니다.</Text>
						</View>
					</View>

					<View style={styles.imgBox}>
						<TouchableOpacity
							style={[styles.imgBtn]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(1)}}
						>
							{file1.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file1.path }} />
							) : (
								<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>
							)}							
							<Text style={styles.imgText}>대표</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.imgBtn]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(2)}}
						>
							{file2.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file2.path }} />
							) : (
								<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>
							)}
							<Text style={styles.imgText}>필수</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.imgBtn]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(3)}}
						>
							{file3.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file3.path }} />
							) : (
								<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>
							)}
							<Text style={styles.imgText}>필수</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.imgBtn, styles.mgt10]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(4)}}
						>
							{file4.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file4.path }} />
							) : (
								<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.imgBtn, styles.mgt10]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(5)}}
						>
							{file5.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file5.path }} />
							) : (
								<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.imgBtn, styles.mgt10]}
							activeOpacity={opacityVal}
							onPress={() => {chooseImage(6)}}
						>
							{file6.path ? (
								<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file6.path }} />
							) : (
								<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>
							)}
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={styles.guideBtn}
						activeOpacity={opacityVal}
						onPress={()=>{
							setGuideModal(true);
							setPreventBack(true);
						}}
					>
						<Text style={styles.guideBtnText}>사진 등록 가이드</Text>
						<ImgDomain fileWidth={5} fileName={'icon_arr2.png'}/>
					</TouchableOpacity>

					<View style={styles.alertBox}>
						<ImgDomain fileWidth={19} fileName={'icon_alert.png'}/>
						<Text style={styles.alertTxt}>주의해주세요</Text>
						<Text style={styles.alertTxt2}>타인의 사진을 무단 도용 시,</Text>
						<Text style={styles.alertTxt2}>관련 법에 따라 처벌을 받을 수 있습니다.</Text>
					</View>
				</View>
			</ScrollView>

      <View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn, file1.path && file2.path && file3.path ? null : styles.nextBtnOff]}
					activeOpacity={opacityVal}
					onPress={() => nextStep()}
				>
					<Text style={styles.nextBtnText}>저장하기</Text>
				</TouchableOpacity>
			</View>

			<Modal
				visible={guideModal}
				//visible={true}
				animationType={"none"}
				onRequestClose={() => {
					setGuideModal(false);
					setPreventBack(false);
				}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.header}>	
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>사진 심사 기준</Text>
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {
							setGuideModal(false);
							setPreventBack(false);
						}}						
					>
						<ImgDomain fileWidth={16} fileName={'icon_close2.png'}/>
					</TouchableOpacity>
				</View>
				<View style={{flex:1}}>
					<WebView
						ref={webViews}
						source={{uri: guideCont}}
						useWebKit={false}						
						javaScriptEnabledAndroid={true}
						allowFileAccess={true}
						renderLoading={true}
						mediaPlaybackRequiresUserAction={false}
						setJavaScriptEnabled = {false}
						scalesPageToFit={true}
						allowsFullscreenVideo={true}
						allowsInlineMediaPlayback={true}						
						originWhitelist={['*']}
						javaScriptEnabled={true}
						textZoom = {100}
					/>
				</View>
				{/* <ScrollView>
					<View style={styles.guidePopCont}>
						<RenderHtml
              contentWidth={widnowWidth}
              source={guideCont}            
            />
					</View>
				</ScrollView> */}
			</Modal>

			{loading ? (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
      ) : null}

		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

	cmWrap: {paddingVertical:30,paddingHorizontal:20},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},
  
	regiStateBarBox: {paddingTop:30,paddingBottom:56,paddingHorizontal:55,overflow:'hidden'},
  regiStateBar: {height:18,backgroundColor:'#eee',borderRadius:20,flexDirection:'row',justifyContent:'space-between'},
	regiStateCircel: {width:18,height:18,backgroundColor:'#eee',borderRadius:50,position:'relative'},
	regiStateCircelOn: {backgroundColor:'#243B55',},
	regiStateCircel2: {width:6,height:6,backgroundColor:'#fff',borderRadius:50,position:'absolute',left:6,top:6,},
	regiStateText: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:13,color:'#dbdbdb',width:60,position:'absolute',left:-20,bottom:-28,textAlign:'center',},
	regiStateTexOn: {color:'#243B55'},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  
	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},
	prvPop2: {height:innerHeight,},
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E'},
	popTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	popIptBox: {paddingTop:10,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {marginTop:30,},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},

	imgBox: {flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',alignItems:'flex-start',marginTop:30,},
	imgBtn: {borderRadius:5,overflow:'hidden',position:'relative',borderWidth:1,borderColor:'#EDEDED'},
	imgText: {width:43,height:21,backgroundColor:'#fff',borderRadius:50,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:21,textAlign:'center',color:'#243B55',position:'absolute',right:5,bottom:5,},

	guideBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',width:140,height:37,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:50,marginTop:20,},
	guideBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#1e1e1e',marginRight:8,position:'relative',top:1,},

	alertBox: {alignItems:'center',marginTop:50,},
	alertTxt: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:13,lineHeight:18,color:'#D1913C',marginTop:5,marginBottom:10,},
	alertTxt2: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:18,color:'#666',},

	header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},

	guidePopCont: {paddingHorizontal:20,},
	guidePopContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e'},

	red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

	mgt0: { marginTop: 0, },
	mgt8: { marginTop: 8, },
  mgt10: { marginTop: 10, },
	mgt20: { marginTop: 20, },
	mgt30: { marginTop: 30, },
	pdb0: {paddingBottom:0},
})

export default RegisterStep6