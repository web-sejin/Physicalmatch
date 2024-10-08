import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';

import APIs from "../../assets/APIs";
import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 20;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;

const MyBadge = (props) => {
	const {navigation, userInfo, route} = props;
  const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
	const navigationUse = useNavigation();
	const [keyboardStatus, setKeyboardStatus] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);	
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);
	const [memberIdx, setMemberIdx] = useState();
	const [memberSex, setMemberSex] = useState();
	const [deletePop, setDeletePop] = useState(false);
	const [file, setFile] = useState({});

	const [realFile1, setRealFile1] = useState({});
	const [realFile2, setRealFile2] = useState({});
	const [realFile3, setRealFile3] = useState({});
	const [realFile4, setRealFile4] = useState({});
	const [realFile5, setRealFile5] = useState({});
	const [realFile6, setRealFile6] = useState({});
	const [realFile7, setRealFile7] = useState({});
	const [realFile8, setRealFile8] = useState({});

	const [realFile1Grade, setRealFile1Grade] = useState('');
	const [realFile2Grade, setRealFile2Grade] = useState('');
	const [realFile3Grade, setRealFile3Grade] = useState('');
	const [realFile4Grade, setRealFile4Grade] = useState('');
	const [realFile5Grade, setRealFile5Grade] = useState('');
	const [realFile6Grade, setRealFile6Grade] = useState('');
	const [realFile7Grade, setRealFile7Grade] = useState('');
	const [realFile8Grade, setRealFile8Grade] = useState('');
	
	const [file1Url, setFile1Url] = useState('');
	const [file2Url, setFile2Url] = useState('');
	const [file3Url, setFile3Url] = useState('');
	const [file4Url, setFile4Url] = useState('');
	const [file5Url, setFile5Url] = useState('');
	const [file6Url, setFile6Url] = useState('');
	const [file7Url, setFile7Url] = useState('');
	const [file8Url, setFile8Url] = useState('');

	const [badgeGnb, setBadgeGnb] = useState([]);
	const [badge2dp, setBadge2dp] = useState([]);
	const [badgeSub, setBadgeSub] = useState();
	const [certInfo, setCertInfo] = useState('');
	
	const [badgeMbIdx, setBadgeMbIdx] = useState();
	const [badgeType, setBadgeType] = useState(0);
	const [badgeModal, setBadgeModal] = useState(false);	
	const [badgeTitle, setBadgeTitle] = useState('');
	const [badgeCert, setBadgeCert] = useState(false);
	const [badgeGrade, setBadgeGrade] = useState();
	const [confirm, setConfirm] = useState(false);

	const [rejectIdx, setRejectIdx] = useState();
	const [rejectMemo, setRejectMemo] = useState();

	const [fileCert, setFileCert] = useState(false);
	const [fileAry, setFileAry] = useState([]);
	const [fileType, setFileType] = useState(); //0:필수, 1:택1

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

			AsyncStorage.getItem('member_idx', (err, result) => {		
				//console.log('member_idx :::: ', result);		
				setMemberIdx(result);
			});
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
				setBadgeModal(false);
				setConfirm(false);
				setPreventBack(false);
				offBadgeModal();
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

	useEffect(() => {
		if(memberIdx){
			//setLoading(true);
			getMemInfo();
			getBadgeInfo();
		}
	}, [memberIdx]);

	useEffect(() => {
		//console.log('fileAry change ::: ', fileAry);		
		setFileCert(false);
		for(let i=0; i<fileAry.length; i++){
			if(fileAry[i].path){				
				setFileCert(true);				
			}
		}
	}, [fileAry]);

	const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			setMemberSex(response.data.member_sex);
		}
	}

	const getBadgeInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyBadgeList",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);		
		//console.log(response);
		if(response.code == 200){
			setBadgeGnb(response.data);
		}
	}

	useEffect(() => {
		if(rejectIdx){
			getBadgeSubInfo(rejectIdx);
		}
	}, [badge2dp])

	const getBadge2dp = async (idx) => {
		let gender = '';
		if(memberSex == 0){
			gender = 'm';
		}else{
			gender = 'w'
		}

		let sData = {      
      basePath: "/api/member/",
			type: "GetBadgeDetail",
			bc_idx: idx,
			m_sex: gender,
		}
		//console.log(idx);
		const response = await APIs.send(sData);
		//console.log(response);
		setBadge2dp(response.data);
	}

	const getBadgeSubInfo = async (idx) => {		
		setBadgeCert(true);
		setBadgeGrade(idx);
		if(rejectIdx){
			setRejectIdx(idx);
		}

		const result = badge2dp.filter((v) => v.badge_idx == idx);
		//console.log('getBadgeSubInfo ::: ', result);
		setBadgeSub(result);
		
		let ary = [];
		const selectObj = {path: '', mime: '', name:'', size:''}
		if(result[0].ex.length > 0){						
			result[0].ex.map((item, index) => {				
				ary.push(selectObj)
			});	
		}
		setFileAry(ary);
		setFileType();
	}

	const chooseImage = (n) => {
    ImagePicker.openPicker({
      //width: 300,
      //height: 400,
      cropping: true,
    })
		.then(image => {
			//console.log('image :::: ',image);
			let megabytes = parseInt(Math.floor(Math.log(image.size) / Math.log(1024)));
			let fileName = image.filename ? image.filename : '인증자료.png';
			let selectObj = {path: image.path, mime: image.mime, name:fileName, size:megabytes}

			setFileAry(prevFileAry => {
				const newFileAry = [...prevFileAry];
				newFileAry[n] = selectObj;
				return newFileAry;
			});
		})
		.finally(() => {

		});
  };

	const offBadgeModal = () => {
		setBadgeModal(false);
		setPreventBack(false);
		setBadgeCert(false);
		setBadgeGrade('');
		setBadgeType(0);
		setBadgeMbIdx();
		setFile({});
		setRejectIdx();
		setRejectMemo();
		setBadge2dp([]);
	}

	const saveBadgeFileInfo = async () => {
		if(!fileCert){
			ToastMessage('인증 자료를 1개 이상 첨부해 주세요.');
			return false;
		}

		if(badgeType == 1){
			setRealFile1(file);
			setRealFile1Grade(badgeGrade);
		}else if(badgeType == 2){
			setRealFile2(file);
			setRealFile2Grade(badgeGrade);
		}else if(badgeType == 3){
			setRealFile3(file);
			setRealFile3Grade(badgeGrade);
		}else if(badgeType == 4){
			setRealFile4(file);
			setRealFile4Grade(badgeGrade);
		}else if(badgeType == 5){
			setRealFile5(file);
			setRealFile5Grade(badgeGrade);
		}else if(badgeType == 6){
			setRealFile6(file);
			setRealFile6Grade(badgeGrade);
		}else if(badgeType == 7){
			setRealFile7(file);
			setRealFile7Grade(badgeGrade);
		}else if(badgeType == 8){
			setRealFile8(file);
			setRealFile8Grade(badgeGrade);
		}

		const fileData = [];	
		//fileData[0] = {uri: file.path, name: 'badgeAuthFile.png', type: file.mime};	

		let sData = {
			basePath: "/api/member/",
			type: "SetMyBadge",
			member_idx: memberIdx,
			//mb_file: fileData,
		};

		if(rejectIdx){ 
			sData.badge_idx = rejectIdx; 
		}else{
			sData.badge_idx = badgeGrade;
		}

		if(badgeMbIdx){ sData.mb_idx = badgeMbIdx; }		

		if(fileAry[0] && fileAry[0].path){ sData.mb_file = [{uri: fileAry[0].path, name: fileAry[0].name, type: fileAry[0].mime}]; }
		if(fileAry[1] && fileAry[1].path){ sData.mb_file1 = [{uri: fileAry[1].path, name: fileAry[1].name, type: fileAry[1].mime}]; }
		if(fileAry[2] && fileAry[2].path){ sData.mb_file2 = [{uri: fileAry[2].path, name: fileAry[2].name, type: fileAry[2].mime}]; }
		if(fileAry[3] && fileAry[3].path){ sData.mb_file3 = [{uri: fileAry[3].path, name: fileAry[3].name, type: fileAry[3].mime}]; }
		if(fileAry[4] && fileAry[4].path){ sData.mb_file4 = [{uri: fileAry[4].path, name: fileAry[4].name, type: fileAry[4].mime}]; }
		if(fileAry[5] && fileAry[5].path){ sData.mb_file5 = [{uri: fileAry[5].path, name: fileAry[5].name, type: fileAry[5].mime}]; }
		if(fileAry[6] && fileAry[6].path){ sData.mb_file6 = [{uri: fileAry[6].path, name: fileAry[6].name, type: fileAry[6].mime}]; }
		if(fileAry[7] && fileAry[7].path){ sData.mb_file7 = [{uri: fileAry[7].path, name: fileAry[7].name, type: fileAry[7].mime}]; }
		if(fileAry[8] && fileAry[8].path){ sData.mb_file8 = [{uri: fileAry[8].path, name: fileAry[8].name, type: fileAry[8].mime}]; }
		if(fileAry[9] && fileAry[9].path){ sData.mb_file9 = [{uri: fileAry[9].path, name: fileAry[9].name, type: fileAry[9].mime}]; }
		
		const formData = APIs.makeFormData(sData)
		const response = await APIs.multipartRequest(formData);					
		if(response.code == 200){
			getBadgeInfo();
			ToastMessage('심사가 등록되었습니다.');
		}else{
			ToastMessage('잠시후 다시 시도해 주세요.');
		}
		setFileType();
		setFileCert(false);
		setFileAry([]);
		offBadgeModal();
	}

	const nextStep = () => {	
		let nextObj = {      
      basePath: "/api/member/",
			type: "SetMyBadge",
			member_idx: memberIdx,
			mb_idx: badgeType,
		}
		
		console.log('realFile1 ::: ', realFile1);
		console.log('realFile2 ::: ', realFile2);
		console.log('realFile3 ::: ', realFile3);
		console.log('realFile4 ::: ', realFile4);
		console.log('realFile5 ::: ', realFile5);
		console.log('realFile6 ::: ', realFile6);
		console.log('realFile7 ::: ', realFile7);
		console.log('realFile8 ::: ', realFile8);

		//console.log(nextObj);
	}

	const deleteBadge = async () => {
		//console.log(badgeTitle+'///'+badgeType);

		let sData = {      
      basePath: "/api/member/",
			type: "DeleteMyBadge",
			member_idx: memberIdx,
			mb_idx: badgeType,
		}
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			setDeletePop(false);
			getBadgeInfo();
			ToastMessage('정상적으로 삭제되었습니다.');
		}
	}

	const deleteFileAry = (index) => {
		setFileAry(prevFileAry => {
			const newFileAry = [...prevFileAry];
			newFileAry[index] = {path: '', mime: '', name: '', size: ''};
			return newFileAry;
		});
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'내 배지'} />

			<ScrollView>
				<View style={styles.cmWrap}>
					<View style={styles.cmTitleBox}>
						<Text style={styles.cmTitleText}>배지 & 인증으로</Text>
						<Text style={[styles.cmTitleText, styles.mgt8]}>프로필을 업그레이드!</Text>
					</View>
					<View style={styles.cmDescBox}>
						<Text style={styles.cmDescText}>프로필 신뢰도와 매칭율이 증가해요.</Text>
					</View>

					{/* 성별이 여자인 경우 안보이게!!! */}
					{badgeGnb.map((item, index) => {						
						if(item.lists.length > 0){
							if((item.title == '피지컬' && memberSex != 1) || item.title != '피지컬'){
								return (
									<View key={index} style={[styles.badgeBox, styles.mgt40]}>
										<View style={styles.iptTit}>
											<Text style={styles.iptTitText}>{item.title}</Text>
										</View>
										<View style={[styles.badgeBtnBox, styles.boxShadow, styles.flowHidden]}>
											{item.lists.map((item2, index2) => {
												let opt = 0.8;
												if((item2.bc_idx == 1 && realFile1.path) || (item2.bc_idx == 2 && realFile2.path) || (item2.bc_idx == 3 && realFile3.path) || (item2.bc_idx == 4 && realFile4.path) || (item2.bc_idx == 5 && realFile5.path) || (item2.bc_idx == 6 && realFile6.path) || (item2.bc_idx == 7 && realFile7.path )|| (item2.bc_idx == 8 && realFile8.path)){ opt = 1 }																				
												return (
													item2.auth_yn == 'y' || item2.auth_yn == 'i' ? (
														<View key={index2}>
															{index2 != 0 ? (<View style={styles.btnLineBox}><View style={styles.btnLine}></View></View>) : null}
															<View style={[styles.badgeBtn]}>
																<View style={styles.badgeBtnLeft}>
																	<ImgDomain2 fileWidth={45} fileName={item2.bc_img}/>
																	<View style={[styles.badgeBtnLeftWrap, styles.mgl10]}>
																		<Text style={[styles.badgeBtnLeftText,styles.mgl0]}>{item2.bc_name}</Text>
																		<Text style={[styles.badgeBtnLeftText2]}>{item2.badge_info}</Text>
																	</View>
																</View>
																{item2.auth_yn == 'y' ? (
																	<TouchableOpacity
																		activeOpacity={opacityVal}
																		onPress={()=>{
																			setBadgeTitle(item2.bc_name);
																			setBadgeType(item2.mb_idx);																																						
																			setDeletePop(true);
																		}}
																	>
																		<ImgDomain fileWidth={25} fileName={'icon_trash.png'}/>
																	</TouchableOpacity>
																) : (
																	<View style={styles.badgeBtnRight}>
																		<View style={styles.stateView}>
																			<Text style={styles.stateViewText}>심사중</Text>
																		</View>
																	</View>
																)}
															</View>
														</View>
													) : (
														<View key={index2}>
															{index2 != 0 ? (<View style={styles.btnLineBox}><View style={styles.btnLine}></View></View>) : null}
															<TouchableOpacity
																style={styles.badgeBtn}
																activeOpacity={opt}
																onPress={()=>{																	
																	setBadgeTitle(item2.bc_name);
																	setBadgeType(item2.bc_idx);																																		
																	getBadge2dp(item2.bc_idx);																			
																	if(item2.auth_yn == 'n'){
																		setRejectIdx(item2.badge_idx);
																		setRejectMemo(item2.reject_memo);
																		setBadgeMbIdx(item2.mb_idx);
																	}

																	if(item2.bc_idx == 1){																	
																		!realFile1.path ? setBadgeModal(true) : null
																		!realFile1.path ? setPreventBack(true) : null		
																	}else if(item2.bc_idx == 2){
																		!realFile2.path ? setBadgeModal(true) : null
																		!realFile2.path ? setPreventBack(true) : null																	
																	}else if(item2.bc_idx == 3){
																		!realFile3.path ? setBadgeModal(true) : null
																		!realFile3.path ? setPreventBack(true) : null
																	}else if(item2.bc_idx == 4){
																		!realFile4.path ? setBadgeModal(true) : null
																		!realFile4.path ? setPreventBack(true) : null
																	}else if(item2.bc_idx == 5){
																		!realFile5.path ? setBadgeModal(true) : null
																		!realFile5.path ? setPreventBack(true) : null
																	}else if(item2.bc_idx == 6){
																		!realFile6.path ? setBadgeModal(true) : null
																		!realFile6.path ? setPreventBack(true) : null
																	}else if(item2.bc_idx == 7){
																		!realFile7.path ? setBadgeModal(true) : null
																		!realFile7.path ? setPreventBack(true) : null
																	}else if(item2.bc_idx == 8){
																		!realFile8.path ? setBadgeModal(true) : null
																		!realFile8.path ? setPreventBack(true) : null
																	}
																}}
															>
																<View style={styles.badgeBtnLeft}>
																	<ImgDomain2 fileWidth={45} fileName={item2.bc_img}/>
																	<View style={[styles.badgeBtnLeftWrap, styles.mgl10]}>
																		<Text style={[styles.badgeBtnLeftText,styles.mgl0]}>{item2.bc_name}</Text>
																	</View>
																</View>																

																{(item2.bc_idx == 1 && realFile1.path) || (item2.bc_idx == 2 && realFile2.path) || (item2.bc_idx == 3 && realFile3.path)  || (item2.bc_idx == 4 && realFile4.path)  || (item2.bc_idx == 5 && realFile5.path)  || (item2.bc_idx == 6 && realFile6.path)  || (item2.bc_idx == 7 && realFile7.path)  || (item2.bc_idx == 8 && realFile8.path) ? (
																	<View style={styles.stateView}><Text style={styles.stateViewText}>심사중</Text></View>
																) : (
																	<>
																	<View style={styles.badgeBtnRight}>
																		{item2.mb_file && item2.auth_yn == 'n' ? (
																			<View style={styles.stateView2}>
																				<Text style={styles.stateViewText2}>반려</Text>
																			</View>																	
																		) : null}
																		<ImgDomain fileWidth={24} fileName={'icon_arr5.png'}/>
																	</View>
																	</>
																)}
															</TouchableOpacity>
														</View>
													)
													
												)
											})}
										</View>
									</View>
								)
							}
						}
					})}					
				</View>
			</ScrollView>

			{/* <View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn]}
					activeOpacity={opacityVal}
					onPress={() => {
						setConfirm(true);
						setPreventBack(true);
					}}
				>
					<Text style={styles.nextBtnText}>심사 등록</Text>
				</TouchableOpacity>
			</View> */}

			{/* 배지선택 */}
			{badgeModal ? (
			<View style={styles.cmPop}>
				<View style={styles.prvPop}>
					<View style={styles.header}>
						<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>{badgeTitle}</Text>
						<TouchableOpacity
							style={styles.headerBackBtn2}
							activeOpacity={opacityVal}
							onPress={() => offBadgeModal()}						
						>							
							<ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
						</TouchableOpacity>						
					</View>
					<ScrollView>
						<View style={[styles.cmWrap]}>
							<View style={styles.cmTitleBox}>
								<Text style={styles.cmTitleText}>배지 선택</Text>
							</View>
							<View style={styles.cmDescBox}>
								<Text style={styles.cmDescText}>인증할 배지를 선택해 주세요.</Text>
							</View>

							{rejectIdx ? (
							<View style={[styles.reject, styles.mgt20]}>
								<View style={styles.rejectBox}>
									<Text style={styles.rejectText}>{rejectMemo}</Text>
								</View>
							</View>
							) : null}
							
							<View style={[styles.badgeBox, rejectIdx ? styles.mgt20 : styles.mgt40]}>
								<View style={[styles.badgeBtnBox, styles.mgt0]}>
									{badge2dp.map((item, index) => {
										return (
											<TouchableOpacity
												key={index}
												style={[
													styles.badgeBtn
													, styles.boxShadow
													, badgeGrade != undefined && badgeGrade != '' && badgeGrade != item.badge_idx ? styles.badgeBtnOff : null
													, badgeGrade==item.badge_idx ? styles.badgeBtnOn : null
													, index != 0 ? styles.mgt12 : null
												]}
												activeOpacity={opacityVal}
												onPress={()=>{
													getBadgeSubInfo(item.badge_idx);
												}}
											>
												<View style={[styles.badgeBtnLeft]}>
													{badgeGrade!= '' && badgeGrade != item.badge_idx ? (												
														<ImgDomain2 fileWidth={45} fileName={item.badge_img}/>
													) : (
														<ImgDomain2 fileWidth={45} fileName={item.badge_img}/>
													)}
													<View style={styles.badgeBtnLeftWrap}>
														<Text style={[
															styles.badgeBtnLeftText
															, styles.mgl0
															, badgeGrade != undefined && badgeGrade != '' && badgeGrade != item.badge_idx ? styles.badgeBtnLeftTextOff : null
															, badgeGrade==item.badge_idx ? styles.badgeBtnLeftTextOn : null
														]}>
															{item.badge_name}
														</Text>
														<Text style={[
															styles.badgeBtnLeftText2
															, badgeGrade != undefined && badgeGrade != '' && badgeGrade != item.badge_idx ? styles.badgeBtnLeftText2Off : null
															, badgeGrade==item.badge_idx ? styles.badgeBtnLeftText2On : null
														]}>
															{item.badge_info}
														</Text>
													</View>
												</View>
											</TouchableOpacity>
										)
									})}
									
									{/* <TouchableOpacity
										style={[
											styles.badgeBtn
											, styles.boxShadow
											, badgeGrade!= '' && badgeGrade != 'silver' ? styles.badgeBtnOff : null
											, badgeGrade=='silver' ? styles.badgeBtnOn : null
										]}
										activeOpacity={opacityVal}
										onPress={()=>{
											setBadgeCert(true);
											setBadgeGrade('silver');
										}}
									>
										<View style={[styles.badgeBtnLeft]}>
											{badgeGrade!= '' && badgeGrade != 'silver' ? (												
												<ImgDomain fileWidth={45} fileName={'b_silver_off.png'}/>
											) : (
												<ImgDomain fileWidth={45} fileName={'b_silver.png'}/>
											)}
											<View style={styles.badgeBtnLeftWrap}>
												<Text style={[
													styles.badgeBtnLeftText
													, styles.mgl0
													, badgeGrade!= '' && badgeGrade != 'silver' ? styles.badgeBtnLeftTextOff : null
													, badgeGrade=='silver' ? styles.badgeBtnLeftTextOn : null
												]}>
													프로필에 표시될 배지명
												</Text>
												<Text style={[
													styles.badgeBtnLeftText2
													, badgeGrade!= '' && badgeGrade != 'silver' ? styles.badgeBtnLeftText2Off : null
													, badgeGrade=='silver' ? styles.badgeBtnLeftText2On : null
												]}>
													배지 요약 설명
												</Text>
											</View>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.badgeBtn
											, styles.boxShadow
											, styles.mgt12
											, badgeGrade!= '' && badgeGrade != 'gold' ? styles.badgeBtnOff : null
											, badgeGrade=='gold' ? styles.badgeBtnOn : null
										]}
										activeOpacity={opacityVal}
										onPress={()=>{
											setBadgeCert(true);
											setBadgeGrade('gold');
										}}
									>
										<View style={[styles.badgeBtnLeft]}>
											{badgeGrade!= '' && badgeGrade != 'gold' ? (
												<ImgDomain fileWidth={45} fileName={'b_gold_off.png'}/>
											) : (
												<ImgDomain fileWidth={45} fileName={'b_gold.png'}/>
											)}
											<View style={styles.badgeBtnLeftWrap}>
												<Text style={[
													styles.badgeBtnLeftText
													, styles.mgl0
													, badgeGrade!= '' && badgeGrade != 'gold' ? styles.badgeBtnLeftTextOff : null
													, badgeGrade=='gold' ? styles.badgeBtnLeftTextOn : null
												]}>
													프로필에 표시될 배지명
												</Text>
												<Text style={[
													styles.badgeBtnLeftText2
													, badgeGrade!= '' && badgeGrade != 'gold' ? styles.badgeBtnLeftText2Off : null
													, badgeGrade=='gold' ? styles.badgeBtnLeftText2On : null
												]}>
													배지 요약 설명
												</Text>
											</View>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.badgeBtn
											, styles.boxShadow
											, styles.mgt12
											, badgeGrade!= '' && badgeGrade != 'dia' ? styles.badgeBtnOff : null
											, badgeGrade=='dia' ? styles.badgeBtnOn : null
										]}
										activeOpacity={opacityVal}
										onPress={()=>{
											setBadgeCert(true);
											setBadgeGrade('dia');
										}}
									>
										<View style={[styles.badgeBtnLeft]}>
											{badgeGrade!= '' && badgeGrade != 'dia' ? (
												<ImgDomain fileWidth={45} fileName={'b_diamond_off.png'}/>												
											) : (
												<ImgDomain fileWidth={45} fileName={'b_diamond.png'}/>
											)}
											<View style={styles.badgeBtnLeftWrap}>
												<Text style={[
													styles.badgeBtnLeftText
													, styles.mgl0
													, badgeGrade!= '' && badgeGrade != 'dia' ? styles.badgeBtnLeftTextOff : null
													, badgeGrade=='dia' ? styles.badgeBtnLeftTextOn : null
												]}>
													프로필에 표시될 배지명
												</Text>
												<Text style={[
													styles.badgeBtnLeftText2
													, badgeGrade!= '' && badgeGrade != 'dia' ? styles.badgeBtnLeftText2Off : null
													, badgeGrade=='dia' ? styles.badgeBtnLeftText2On : null
												]}>
													배지 요약 설명
												</Text>
											</View>
										</View>
									</TouchableOpacity> */}
								</View>
							</View>
							
							{badgeCert ? (
							<>
							<View style={styles.mgt40}>
								<View style={styles.iptTit}>
									<Text style={styles.iptTitText}>기준</Text>									
								</View>
								<View style={[styles.popInfoBox, styles.mgt8]}>
									<Text style={styles.popInfoBoxText}>{badgeSub[0]?.badge_standard}</Text>
								</View>
							</View>

							<View style={styles.mgt40}>
								<View style={styles.iptTit}>
									<Text style={styles.iptTitText}>인증방법</Text>									
								</View>
								{badgeSub[0]?.auth.map((item, index) => {
									return (
										<View key={index}>
											<View style={[styles.iptSubTit, index == 0 ? styles.mgt10 : styles.mgt20]}>
												<Text style={styles.iptSubTitText}>{index+1}. {item.ba_subject}</Text>									
											</View>
											{item.ba_content && (
											<View style={[styles.popInfoBox, styles.mgt8]}>
												<Text style={styles.popInfoBoxText}>{item.ba_content}</Text>
											</View>
											)}
										</View>
									)
								})}
							</View>

							<View style={styles.mgt40}>
								<View style={styles.iptTit}>
									<Text style={styles.iptTitText}>인증 예시</Text>									
								</View>
								{/* <View style={[styles.iptSubTit, styles.mgt5]}>
									<Text style={styles.iptSubTitText}>{badgeSub[0].badge_auth_info1}</Text>									
								</View>
								<View style={[styles.exampleBox, styles.mgt8]}>
									<ImgDomain2 fileWidth={innerWidth} fileName={badgeSub[0].badge_auth_img}/>
								</View>
								<View style={styles.exampleBoxDesc}>
									<Text style={styles.exampleBoxDescText}>{badgeSub[0].badge_auth_info2}</Text>
								</View> */}
								{badgeSub[0]?.ex.map((item, index) => {
									return (
										<View key={index} style={index == 0 ? styles.mgt10 : styles.mgt20}>
											<View style={[styles.iptSubTit, styles.mgt5]}>
												<Text style={styles.iptSubTitText}>{item.be_subject}</Text>
											</View>
											<View style={[styles.exampleBox, styles.mgt8]}>
												<ImgDomain2 fileWidth={innerWidth} fileName={item.be_img}/>
											</View>
											{/* <View style={styles.exampleBoxDesc}>
												<Text style={styles.exampleBoxDescText}>{badgeSub[0].badge_auth_info2}</Text>
											</View> */}
										</View>
									)
								})}
							</View>

							<View style={styles.mgt40}>
								<View style={styles.iptTit}>
									<Text style={styles.iptTitText}>인증 자료 첨부</Text>									
								</View>
								{/* <View style={[styles.iptSubTit, styles.mgt5]}>
									<Text style={styles.iptSubTitText}>{badgeSub[0].badge_auth_info3}</Text>									
								</View> */}

								{badgeSub[0]?.ex.map((item, index) => {
									return (
										<View key={index} style={styles.mgt10}>
											<View style={[styles.iptSubTit]}>
												<Text style={styles.iptSubTitText}>{item.be_subject}</Text>
											</View>
											{fileAry[index].path ? (
												<View style={styles.fileBox}>
													<View style={styles.fileBoxLeft}>										
														<View style={styles.fileBoxLeftView}>
															<AutoHeightImage width={38} source={{ uri: fileAry[index].path }} style={styles.fileBoxLeftImg} />
														</View>	
														<View style={styles.fileBoxLeftInfo}>
															<Text style={styles.fileBoxLeftInfoText}>{fileAry[index].name}</Text>
															<Text style={styles.fileBoxLeftInfoText2}>{fileAry[index].size} MB</Text>
														</View>
													</View>
													<TouchableOpacity 
														style={styles.fileBoxRight}
														activeOpacity={opacityVal}
														onPress={() => deleteFileAry(index)}
													>
														<ImgDomain fileWidth={24} fileName={'icon_trash.png'}/>
													</TouchableOpacity>
												</View>
											) : (
												<View style={[styles.uploadBox, styles.mgt8]}>
													<TouchableOpacity 
														style={styles.uploadBoxBtn}
														activeOpacity={opacityVal}
														onPress={() => {chooseImage(index)}}
													>
														<ImgDomain fileWidth={18} fileName={'icon_upload.png'}/>
														<Text style={styles.uploadBoxBtnText}>사진 업로드</Text>
													</TouchableOpacity>
													<View style={styles.uploadBoxDesc}>
														<Text style={styles.uploadBoxDescText}>도용/위조는 중범죄이며 처벌 받을 수 있습니다.</Text>
														<Text style={styles.uploadBoxDescText}>모든 인증 서류는 인증 후 폐기됩니다.</Text>
													</View>
												</View>
											)}											
										</View>
									)
								})}
																
								{/* {file.path ? (
									<View style={styles.fileBox}>
										<View style={styles.fileBoxLeft}>										
											<View style={styles.fileBoxLeftView}>
												<AutoHeightImage width={38} source={{ uri: file.path }} style={styles.fileBoxLeftImg} />
											</View>	
											<View style={styles.fileBoxLeftInfo}>
												<Text style={styles.fileBoxLeftInfoText}>{file.name}</Text>
												<Text style={styles.fileBoxLeftInfoText2}>{file.size} MB</Text>
											</View>
										</View>
										<TouchableOpacity 
											style={styles.fileBoxRight}
											activeOpacity={opacityVal}
											onPress={() => {
												setFile({});
											}}
										>
											<ImgDomain fileWidth={24} fileName={'icon_trash.png'}/>
										</TouchableOpacity>
									</View>
								) : (
									<View style={[styles.uploadBox, styles.mgt8]}>
										<TouchableOpacity 
											style={styles.uploadBoxBtn}
											activeOpacity={opacityVal}
											onPress={() => {chooseImage()}}
										>
											<ImgDomain fileWidth={18} fileName={'icon_upload.png'}/>
											<Text style={styles.uploadBoxBtnText}>사진 업로드</Text>
										</TouchableOpacity>
										<View style={styles.uploadBoxDesc}>
											<Text style={styles.uploadBoxDescText}>도용/위조는 중범죄이며 처벌 받을 수 있습니다.</Text>
											<Text style={styles.uploadBoxDescText}>모든 인증 서류는 인증 후 폐기됩니다.</Text>
										</View>
									</View>
								)} */}
							</View>
							</>
							) : null}
						</View>
					</ScrollView>
					<View style={styles.nextFix}>
						<TouchableOpacity 
							style={[styles.nextBtn, fileCert ? null : styles.nextBtnOff]}
							activeOpacity={opacityVal}
							onPress={() => saveBadgeFileInfo()}
						>
							<Text style={styles.nextBtnText}>저장하기</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			) : null}

			{/* 배지 삭제 컨펌 */}
      <Modal
				visible={deletePop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setDeletePop(false)}
			>
				<View style={[styles.cmPop, styles.cmPop2]}>
					<TouchableOpacity 
						style={[styles.popBack]} 
						activeOpacity={1} 
						onPress={()=>{setDeletePop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop2}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setDeletePop(false)}}
						>
							<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
              <Text style={styles.popTitleText}>{badgeTitle}를 삭제하시겠어요?</Text>
						</View>
            <View style={[styles.popBtnBox, styles.popBtnBoxFlex, styles.mgt50]}>
						  <TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => setDeletePop(false)}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => deleteBadge()}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{confirm ? (
			<View style={[styles.cmPop, styles.cmPop2]}>
				<TouchableOpacity 
					style={styles.popBack} 
					activeOpacity={1} 
					onPress={()=>{
						setConfirm(false);
						setPreventBack(false);
					}}
				>
				</TouchableOpacity>
				<View style={styles.prvPop2}>
					<TouchableOpacity
						style={styles.pop_x}					
						onPress={() => {
							setConfirm(false);
							setPreventBack(false);
						}}
					>
						<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
					</TouchableOpacity>		
					<View style={styles.popTitle}>
						<Text style={styles.popTitleText}>심사 등록</Text>
						<View style={styles.mgt20}>
							<Text style={styles.popTitleDesc}>작성하신 정보로 프로필 승인 심사를</Text>
							<Text style={styles.popTitleDesc}>제출하시겠어요?</Text>
						</View>
					</View>													
					<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						<TouchableOpacity 
							style={[styles.popBtn, styles.popBtn2]}
							activeOpacity={opacityVal}
							onPress={() => {
								setConfirm(false);
								setPreventBack(false);
							}}
						>
							<Text style={styles.popBtnText}>아니오</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.popBtn]}
							activeOpacity={opacityVal}
							onPress={() => {
								nextStep();
							}}
						>
							<Text style={styles.popBtnText}>네</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			) : null}

			{loading ? (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
      ) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },	
	gapBox: {height:86,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

	cmWrap: {paddingVertical:30,paddingHorizontal:20},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
	cmDescBoxFlex: {flexDirection:'row',alignItems:'center'},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},
	cmDescText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:20,color:'#B8B8B8'},
	cmDescArr: {marginHorizontal:6,position:'relative',top:1,},
	cmTitleText3: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:19,color:'#1e1e1e'},
	cmDescText3: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#1e1e1e'},
  
	regiStateBarBox: {paddingTop:30,paddingBottom:56,paddingHorizontal:55,overflow:'hidden'},
  regiStateBar: {height:18,backgroundColor:'#eee',borderRadius:20,flexDirection:'row',justifyContent:'space-between'},
	regiStateCircel: {width:18,height:18,backgroundColor:'#eee',borderRadius:50,position:'relative'},
	regiStateCircelOn: {backgroundColor:'#243B55',},
	regiStateCircel2: {width:6,height:6,backgroundColor:'#fff',borderRadius:50,position:'absolute',left:6,top:6,},
	regiStateText: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:13,color:'#dbdbdb',width:60,position:'absolute',left:-20,bottom:-28,textAlign:'center',},
	regiStateTexOn: {color:'#243B55'},

	iptTit: {},
  iptTitText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:18,color:'#1e1e1e'},
	iptSubTit: {},
	iptSubTitText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:15,color:'#666'},
  
  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },
  
	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'#fff',},
	cmPop2: {backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,},
	prvPop: {position:'relative',zIndex:10,width:widnowWidth,height:widnowHeight,backgroundColor:'#fff',borderRadius:10,},
	prvPop2: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E'},
	popTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:24,color:'#1e1e1e',},
	popIptBox: {paddingTop:10,},
	help_box: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#EE4245',},
	txtCntText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#b8b8b8'},
	popBtnBox: {marginTop:30,},
	popBtnBoxFlex: {flexDirection:'row',justifyContent:'space-between'},
	popBtn: {width:(innerWidth/2)-25,alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtn2: {backgroundColor:'#999'},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},	

	header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},

	input: { fontFamily: Font.NotoSansRegular, width: innerWidth, height: 36, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DBDBDB', paddingVertical: 0, paddingHorizontal: 5, fontSize: 16, color: '#1e1e1e', },
	popRadioType2: {flexDirection:'row',flexWrap:'wrap',},
	popRadioBoxBtn2: {alignItems:'center',justifyContent:'center',height:38,borderWidth:1,borderColor:'#ededed',borderRadius:50,paddingHorizontal:16,marginTop:8,marginRight:8,},
	popRadioBoxBtn2On: {backgroundColor:'rgba(209,145,60, 0.15)',borderColor:'#D1913C'},
	popRadioBoxBtn2Text: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:19,color:'#666',},
	popRadioBoxBtn2TextOn: {color:'#D1913C'},

	boxShadow: {
		borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.5,
		elevation: 4,
	},
	badgeBox: {backgroundColor:'#fff'},
	flowHidden: {},
	badgeBtnBox: {backgroundColor:'#fff',marginTop:15,},
	badgeBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#fff',paddingVertical:18,paddingHorizontal:20,borderWidth:1,borderColor:'rgba(209,145,60,0)'},
	badgeBtnOff: {},
	badgeBtnOn: {shadowColor:'#D1913C',shadowOpacity:0.45,backgroundColor:'#FFFCF8',borderColor:'rgba(209,145,60,0.1)'},
	badgeBtnLeft: {flexDirection:'row',alignItems:'center'},
	badgeBtnLeftWrap: {marginLeft:20,},
	badgeBtnLeftText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#1e1e1e',marginLeft:10,},
	badgeBtnLeftTextOff: {color:'#b8b8b8'},
	badgeBtnLeft2: {},
	badgeBtnLeftText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#666',marginTop:6,},
	badgeBtnLeftText2Off: {color:'#b8b8b8'},
	btnLineBox: {paddingHorizontal:15,},
	btnLine: {height:1,backgroundColor:'#EDEDED'},

	badgeBtnRight: {flexDirection:'row',alignItems:'center'},
	stateView: {alignItems:'center',justifyContent:'center',height:18,paddingHorizontal:6,backgroundColor:'#243B55',borderRadius:10,},
	stateViewText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#fff'},
	stateView2: {alignItems:'center',justifyContent:'center',height:18,paddingHorizontal:6,backgroundColor:'rgba(238,66,69,0.15)',borderRadius:10,marginRight:5,},
	stateViewText2: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245'},

	popInfoBox: {minHeight:100,backgroundColor:'#F9FAFB',paddingVertical:10,paddingHorizontal:15,borderRadius:5,},
	popInfoBoxText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:26,color:'#b8b8b8',},

	exampleBox: {borderTopLeftRadius:5,borderTopRightRadius:5,overflow:'hidden'},
	exampleBoxDesc: {borderWidth:1,borderTopWidth:0,borderColor:'#EDEDED',borderRadius:5,padding:15,},
	exampleBoxDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:20,color:'#1e1e1e'},

	uploadBox: {padding:20,borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,alignItems:'center'},
	uploadBoxBtn: {flexDirection:'row',alignItems:'center',backgroundColor:'#F9FAFB',borderRadius:50,paddingVertical:4,paddingHorizontal:13,},
	uploadBoxBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:18,color:'#243B55',marginLeft:5,},
	uploadBoxDesc: {marginTop:10,},
	uploadBoxDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:19,color:'#B8B8B8',},

	fileBox: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15,},
	fileBoxLeft: {flexDirection:'row',alignItems:'center',},
	fileBoxLeftView: {width:36,height:36,borderWidth:1,borderColor:'#DBDBDB',borderRadius:5,overflow:'hidden'},
	fileBoxLeftImg: {},
	fileBoxLeftInfo: {marginLeft:10,},
	fileBoxLeftInfoText: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:18,color:'#1e1e1e',},
	fileBoxLeftInfoText2: {fontFamily:Font.NotoSansMedium,fontSize:11,lineHeight:18,color:'#B8B8B8'},
	fileBoxRight: {width:24,},

	reject: {},
  rejectBox: {padding:15,backgroundColor:'rgba(255,120,122,0.1)',borderRadius:5,},
  rejectText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#DE282A'},

	red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},
	
	mgl0: {marginLeft:0,},
	mgl10: {marginLeft:10,},
	mgt0: { marginTop: 0, },
	mgt5: { marginTop: 5, },
	mgt8: { marginTop: 8, },
  mgt10: { marginTop: 10, },
	mgt12: { marginTop: 12, },
	mgt20: { marginTop: 20, },
	mgt30: { marginTop: 30, },
	mgt40: { marginTop: 40, },
	mgt50: { marginTop: 50, },
	pdb0: {paddingBottom:0},
	pdb20: {paddingBottom:20},
})

export default MyBadge