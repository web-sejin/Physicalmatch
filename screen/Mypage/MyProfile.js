import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import RenderHtml from 'react-native-render-html';
import { WebView } from 'react-native-webview';

import APIs from "../../assets/APIs";
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const MyProfile = (props) => {
	const webViews = useRef();
	const navigationUse = useNavigation();
	const {navigation, userInfo, member_info, member_logout, member_out, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [memberIdx, setMemberIdx] = useState();
	const [reject, setReject] = useState(false);
	const [rejectMemo, setRejectMemo] = useState('');

  const [file1, setFile1] = useState({});
	const [file1Base, setFile1Base] = useState(0); //0:기존 없음, 1:기존 있음
	const [file1St, setFile1St] = useState(0); //0:없음 1:그대로, 2:변경 또는 추가, 3:삭제
	const [file1Idx, setFile1Idx] = useState();

	const [file2, setFile2] = useState({});
	const [file2Base, setFile2Base] = useState(0);
	const [file2St, setFile2St] = useState(0);
	const [file2Idx, setFile2Idx] = useState();

	const [file3, setFile3] = useState({});
	const [file3Base, setFile3Base] = useState(0);
	const [file3St, setFile3St] = useState(0);
	const [file3Idx, setFile3Idx] = useState();

	const [file4, setFile4] = useState({});
	const [file4Base, setFile4Base] = useState(0);
	const [file4St, setFile4St] = useState(0);
	const [file4Idx, setFile4Idx] = useState();

	const [file5, setFile5] = useState({});
	const [file5Base, setFile5Base] = useState(0);
	const [file5St, setFile5St] = useState(0);
	const [file5Idx, setFile5Idx] = useState();

	const [file6, setFile6] = useState({});
	const [file6Base, setFile6Base] = useState(0);
	const [file6St, setFile6St] = useState(0);
	const [file6Idx, setFile6Idx] = useState();

  const [file7, setFile7] = useState({});
	const [file7Base, setFile7Base] = useState(0);
	const [file7St, setFile7St] = useState(0);
	const [file7Idx, setFile7Idx] = useState();

	const [guideModal, setGuideModal] = useState(false);
	const [guideCont, setGuideCont] = useState();

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
		getMemImg();
		getGuideCont();
	}, [memberIdx]);

	const getMemImg = async () => {		
		//setLoading(true);
		let sData = {
			basePath: "/api/member/",
			type: "GetMyProfile",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
    //console.log(response.data);
		if(response.code == 200){
			setReject(false);
			response.data.img.map((item, index) => {
				if(item.agree_yn == 'n'){
					setReject(true);
					setRejectMemo(response.data.info.reject_memo2);
				}
				if(index == 0){
					setFile1(item);
					setFile1Base(1);
					setFile1St(1);
					setFile1Idx(item.mti_idx);
				}else if(index == 1){
					setFile2(item);
					setFile2Base(1);
					setFile2St(1);
					setFile2Idx(item.mti_idx);
				}else if(index == 2){
					setFile3(item);
					setFile3Base(1);
					setFile3St(1);
					setFile3Idx(item.mti_idx);
				}else if(index == 3){
					setFile4(item);
					setFile4Base(1);
					setFile4St(1);
					setFile4Idx(item.mti_idx);
				}else if(index == 4){
					setFile5(item);
					setFile5Base(1);
					setFile5St(1);
					setFile5Idx(item.mti_idx);
				}else if(index == 5){
					setFile6(item);
					setFile6Base(1);
					setFile6St(1);
					setFile6Idx(item.mti_idx);
				}
			})

			if(response.data.mimg){				
				setFile7(response.data.mimg);
				setFile7Base(1);
				setFile7St(1);
				setFile7Idx(response.data.mimg.mti_idx);
			}

			setTimeout(function(){
				setLoading(false);
			}, 500)
		}
	}

	const chooseImage = (v) => {
		let imgWidth = 1024;
		let imgHeight = 1024*1.355;
		if(v == 7){
			imgHeight = 1024;
		}

    ImagePicker.openPicker({
      width: imgWidth,
      height: imgHeight,
      cropping: true,
    })
		.then(image => {
			let selectObj = {idx: v, path: image.path, mime: image.mime}			
			if(v == 1){
				setFile1(selectObj);
				setFile1St(2);
			}else if(v == 2){
				setFile2(selectObj);
				setFile2St(2);
			}else if(v == 3){
				setFile3(selectObj);
				setFile3St(2);
			}else if(v == 4){
				setFile4(selectObj);
				setFile4St(2);
			}else if(v == 5){
				setFile5(selectObj);
				setFile5St(2);
			}else if(v == 6){
				setFile6(selectObj);
				setFile6St(2);
			}else if(v == 7){
				setFile7(selectObj);
				setFile7St(2);
			}
		})
		.finally(() => {

		});
  };

	const submit = async () => {
		if((!file1.path && !file1.mti_img) || (!file2.path && !file2.mti_img) || (!file3.path && !file3.mti_img)){
			ToastMessage('대표 및 필수 영역의 사진을 등록해 주세요.');
			return false;
		}

		const fileData = [];
		const idxData = [];

		if(file1St == 2){		
			fileData[fileData.length] = {uri: file1.path, name: 'profile1.png', type: file1.mime}; 
			if(file1Idx){ idxData.push(file1Idx); }
		}

		if(file2St == 2){
			//console.log('2');
			fileData[fileData.length] = {uri: file2.path, name: 'profile2.png', type: file2.mime};
			if(file2Idx){ idxData.push(file2Idx); }
		}

		if(file3St == 2){
			fileData[fileData.length] = {uri: file3.path, name: 'profile3.png', type: file3.mime};
			if(file3Idx){ idxData.push(file3Idx); }
		}

		if(file4St == 2 || file4St == 3){
			if(file4St == 2){
				fileData[fileData.length] = {uri: file4.path, name: 'profile4.png', type: file4.mime}; 
			}
			if(file4Idx){ idxData.push(file4Idx); }
		}

		if(file5St == 2 || file5St == 3){
			if(file5St == 2){
				fileData[fileData.length] = {uri: file5.path, name: 'profile5.png', type: file5.mime}; 
			}
			if(file5Idx){ idxData.push(file5Idx); }
		}

		if(file6St == 2 || file6St == 3){
			if(file6St == 2){
				fileData[fileData.length] = {uri: file6.path, name: 'profile6.png', type: file6.mime}; 
			}
			if(file6Idx){ idxData.push(file6Idx); }
		}

		const miniFileData = [];
		const miniIdxData = [];
		if(file7St == 2 || file7St == 3){
			if(file7St == 2){
				miniFileData.push({uri: file7.path, name: 'mini_profile.png', type: file7.mime}); 
			}
			if(file7Idx){ miniIdxData.push(file7Idx); }
		}

		// console.log('miniFileData ::: ', miniFileData);
		// console.log('miniIdxData ::: ', miniIdxData);

		if(fileData.length < 1 && idxData.length < 1 && miniFileData.length < 1 && miniIdxData.length < 1){
			ToastMessage('변경된 내용이 없어 심사등록을 할 수 없습니다.');
			return false;
		}
		
		// console.log('fileData ::: ', fileData);
		// console.log('idxData ::: ', idxData);

		let sData = {
			basePath: "/api/member/",
			type: "SetProfileImg",
			member_idx: memberIdx,
			member_files: fileData,
			chk_idx: idxData,
			mini_files: miniFileData,
			chk_mini_idx: miniIdxData,
		};

		const formData = APIs.makeFormData(sData)		
		const response = await APIs.multipartRequest(formData);    
		//console.log(response);
		if(response.code == 200){
			ToastMessage('심사 등록이 완료되었습니다.');

			setTimeout(function(){
				navigation.navigate('ProfieModify', {reload:true});
			}, 500);
		}
	}

	const deleteImg = (v) => {
		if(v == 1){
			setFile1({});
			if(file1Base == 1){ setFile1St(3); }else{ setFile1St(0); }			
		}else if(v == 2){
			setFile2({});
			if(file2Base == 1){ setFile2St(3); }else{ setFile2St(0); }			
		}else if(v == 3){
			setFile3({});
			if(file3Base == 1){ setFile3St(3); }else{ setFile3St(0); }			
		}else if(v == 4){
			setFile4({});
			if(file4Base == 1){ setFile4St(3); }else{ setFile4St(0); }			
		}else if(v == 5){
			setFile5({});
			if(file5Base == 1){ setFile5St(3); }else{ setFile5St(0); }			
		}else if(v == 6){
			setFile6({});
			if(file6Base == 1){ setFile6St(3); }else{ setFile6St(0); }			
		}else if(v == 7){
			setFile7({});
			if(file7Base == 1){ setFile7St(3); }else{ setFile7St(0); }			
		}
	}

	const getGuideCont = async () => {
		let sData = {      
      basePath: "/api/etc/",
			type: "GetProfileGuide",
		}
		const response = await APIs.send(sData);		
		if(response.code == 200){
			// const source = {
      //   html: response.data
      // };
      setGuideCont(response.data);
		}
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'프로필 사진'} />
			<ScrollView>
        <View style={[styles.cmWrap, reject ? styles.cmWrap2 : null ]}>
					{reject ? (
					<View style={styles.reject}>
						<View style={styles.rejectBox}>
							<Text style={styles.rejectText}>{rejectMemo}</Text>
						</View>
					</View>
					) : null}
					<View style={styles.regiTypingView}>
						<View style={styles.cmTitleBox}>
							<Text style={styles.cmTitleText}>사진을 등록해 주세요!</Text>
						</View>
						<View style={styles.cmDescBox}>
							<Text style={styles.cmDescText}>나를 잘 드러내는 얼굴, 전신 각 1장은 필수입니다.</Text>
						</View>
					</View>

					<View style={styles.imgBox}>
						<View style={styles.imgBoxView}>
							{file1.path || file1.mti_img ? (
								<TouchableOpacity style={[styles.imgBtnClose]} activeOpacity={opacityVal} onPress={() => {deleteImg(1)}}>
									<ImgDomain fileWidth={20} fileName={'icon_power_x.png'}/>
								</TouchableOpacity>
							) : null}
							<TouchableOpacity
								style={[styles.imgBtn]}
								activeOpacity={opacityVal}
								onPress={() => {chooseImage(1)}}
							>
								{file1.mti_img ? (<ImgDomain2 fileWidth={(innerWidth/3)-7} fileName={file1.mti_img}/>) : null}
								{file1.path ? (<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file1.path }} />) : null}
								{!file1.path && !file1.mti_img ? (<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>) : null}
								<Text style={styles.imgText}>대표</Text>
							</TouchableOpacity>
						</View>
						
						<View style={styles.imgBoxView}>
							{file2.path || file2.mti_img ? (
								<TouchableOpacity style={[styles.imgBtnClose]} activeOpacity={opacityVal} onPress={() => {deleteImg(2)}}>
									<ImgDomain fileWidth={20} fileName={'icon_power_x.png'}/>
								</TouchableOpacity>
							) : null}
							<TouchableOpacity
								style={[styles.imgBtn]}
								activeOpacity={opacityVal}
								onPress={() => {chooseImage(2)}}
							>
								{file2.mti_img ? (<ImgDomain2 fileWidth={(innerWidth/3)-7} fileName={file2.mti_img}/>) : null}
								{file2.path ? (<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file2.path }} />) : null}
								{!file2.path && !file2.mti_img ? (<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>) : null}
								<Text style={styles.imgText}>필수</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.imgBoxView}>
							{file3.path || file3.mti_img ? (
								<TouchableOpacity style={[styles.imgBtnClose]} activeOpacity={opacityVal} onPress={() => {deleteImg(3)}}>
									<ImgDomain fileWidth={20} fileName={'icon_power_x.png'}/>
								</TouchableOpacity>
							) : null}
							<TouchableOpacity
								style={[styles.imgBtn]}
								activeOpacity={opacityVal}
								onPress={() => {chooseImage(3)}}
							>
								{file3.mti_img ? (<ImgDomain2 fileWidth={(innerWidth/3)-7} fileName={file3.mti_img}/>) : null}
								{file3.path ? (<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file3.path }} />) : null}
								{!file3.path && !file3.mti_img ? (<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>) : null}
								<Text style={styles.imgText}>필수</Text>
							</TouchableOpacity>
						</View>

						<View style={[styles.imgBoxView, styles.mgt10]}>
							{file4.path || file4.mti_img ? (
								<TouchableOpacity style={[styles.imgBtnClose]} activeOpacity={opacityVal} onPress={() => {deleteImg(4)}}>
									<ImgDomain fileWidth={20} fileName={'icon_power_x.png'}/>
								</TouchableOpacity>
							) : null}
							<TouchableOpacity
								style={[styles.imgBtn]}
								activeOpacity={opacityVal}
								onPress={() => {chooseImage(4)}}
							>
								{file4.mti_img ? (<ImgDomain2 fileWidth={(innerWidth/3)-7} fileName={file4.mti_img}/>) : null}
								{file4.path ? (<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file4.path }} />) : null}
								{!file4.path && !file4.mti_img ? (<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>) : null}
							</TouchableOpacity>
						</View>

						<View style={[styles.imgBoxView, styles.mgt10]}>
							{file5.path || file5.mti_img ? (
								<TouchableOpacity style={[styles.imgBtnClose]} activeOpacity={opacityVal} onPress={() => {deleteImg(5)}}>
									<ImgDomain fileWidth={20} fileName={'icon_power_x.png'}/>
								</TouchableOpacity>
							) : null}
							<TouchableOpacity
								style={[styles.imgBtn]}
								activeOpacity={opacityVal}
								onPress={() => {chooseImage(5)}}
							>
								{file5.mti_img ? (<ImgDomain2 fileWidth={(innerWidth/3)-7} fileName={file5.mti_img}/>) : null}
								{file5.path ? (<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file5.path }} />) : null}
								{!file5.path && !file5.mti_img ? (<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>) : null}
							</TouchableOpacity>
						</View>
						
						<View style={[styles.imgBoxView, styles.mgt10]}>
							{file6.path || file6.mti_img ? (
								<TouchableOpacity style={[styles.imgBtnClose]} activeOpacity={opacityVal} onPress={() => {deleteImg(6)}}>
									<ImgDomain fileWidth={20} fileName={'icon_power_x.png'}/>
								</TouchableOpacity>
							) : null}
							<TouchableOpacity
								style={[styles.imgBtn]}
								activeOpacity={opacityVal}
								onPress={() => {chooseImage(6)}}
							>
								{file6.mti_img ? (<ImgDomain2 fileWidth={(innerWidth/3)-7} fileName={file6.mti_img}/>) : null}
								{file6.path ? (<AutoHeightImage width={(innerWidth/3)-7} source={{ uri: file6.path }} />) : null}
								{!file6.path && !file6.mti_img ? (<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'img_back.jpg'}/>) : null}
							</TouchableOpacity>
						</View>
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

          <View style={styles.mgt50}>
            <View style={styles.miniTitle}>
              <Text style={styles.miniTitleText1}>미니 프로필 등록</Text>
              <Text style={styles.miniTitleText2}>[선택]</Text>
            </View>
            <View style={styles.miniDesc}>
              <Text style={styles.miniDescText}>얼굴이 잘 보이는 사진으로 등록해 주세요</Text>
            </View>
            <View style={styles.reqUl}>                  
              <View style={[styles.reqLi, styles.boxShadow2]}>
                <TouchableOpacity
                  style={styles.reqUser}
                  activeOpacity={opacityVal}
                  onPress={()=>chooseImage(7)}
                >
									{file7.mti_img ? (<ImgDomain2 fileWidth={46} fileName={file7.mti_img}/>) : null}
									{file7.path ? (<AutoHeightImage width={46} source={{ uri: file7.path }} />) : null}
									{!file7.path && !file7.mti_img ? (<ImgDomain fileWidth={46} fileName={'img_back2.png'}/>) : null}                  
                </TouchableOpacity>
                <View style={styles.reqUserInfo}>
                  <View style={styles.tradeState}>
                    <View style={styles.tradeStateView}>
                      <Text style={styles.tradeStateText}>프로필 교환이 도착했어요</Text>
                    </View>
										<ImgDomain fileWidth={12} fileName={'icon_profile_msg.png'}/>
                  </View>
                  <View style={styles.reqUserNick}>
                    <Text style={styles.reqUserNickText}>자동생성닉네임</Text>                          
                  </View>
                  <View style={styles.reqUserDetail}>
                    <Text style={styles.reqUserDetailText}>수락까지 잠시 기다려주세요!</Text>
                  </View>
                </View>
								{file7.path || file7.mti_img ? (
                <TouchableOpacity
                  style={styles.reqOkBtn}
                  activeOpacity={opacityVal}
                  onPress={() => deleteImg(7)}
                >									
									<ImgDomain fileWidth={25} fileName={'icon_trash.png'}/>
                </TouchableOpacity>
								) : null}
              </View>
            </View>
          </View>
				</View>
			</ScrollView>

      <View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn, (file1.path || file1.mti_img) && (file2.path || file2.mti_img) && (file3.path || file3.mti_img) ? null : styles.nextBtnOff]}
					activeOpacity={opacityVal}
					onPress={() => submit()}
				>
					<Text style={styles.nextBtnText}>심사등록</Text>
				</TouchableOpacity>
			</View>

      <Modal
				visible={guideModal}
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
        <ActivityIndicator size="large" color="#D1913C" />
      </View>
      ) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },	
	gapBox: {height:80,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

  reject: {marginBottom:30,},
  rejectBox: {padding:15,backgroundColor:'rgba(255,120,122,0.1)',borderRadius:5,},
  rejectText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#DE282A'},

  cmWrap: {paddingTop:30,paddingBottom:50,paddingHorizontal:20},
	cmWrap2: {paddingTop:0,},
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

  miniTitle: {flexDirection:'row',},
  miniTitleText1: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:19,color:'#1e1e1e'},
  miniTitleText2: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#B8B8B8',marginLeft:2,},
  miniDesc: {marginTop:8,},
  miniDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#1e1e1e'},
  reqUl: {marginTop:20,},
  reqLi: {flexDirection:'row',alignItems:'center',paddingHorizontal:15,paddingVertical:13,paddingRight:75,backgroundColor:'#fff',borderRadius:5,},
  reqUser: {alignItems:'center',justifyContent:'center',width:46,height:46,borderRadius:50,overflow:'hidden',borderWidth:1,borderColor:'#ededed'},
  reqUserInfo: {width:innerWidth-137,paddingLeft:15,},
  reqUserInfo2: {width:innerWidth-91},
  tradeState: {flexDirection:'row',alignItems:'center',marginBottom:5,},
  tradeStateView: {position:'relative',top:0.5},
  tradeStateText: {fontFamily:Font.NotoSansSemiBold,fontSize:12,lineHeight:17,color:'#1e1e1e'},
  reqUserNick: {},
  reqUserNickText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,lineHeight:17,color:'#D1913C'},
  reqUserDetail: {flexDirection:'row',alignItems:'center',marginTop:4,},
  reqUserDetailText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:17,color:'#666',},
  reqDtLine: {width:1,height:8,backgroundColor:'#EDEDED',marginHorizontal:6,position:'relative',top:-0.5},
  reqOkBtn: {alignItems:'center',justifyContent:'center',width:35,height:35,position:'absolute',right:5,},
  reqOkBtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#243B55'},
  
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
	imgBoxView: {position:'relative'},
	imgBtnClose: {alignItems:'center',justifyContent:'center',width:25,height:25,backgroundColor:'#fff',borderRadius:50,position:'absolute',top:-10,right:-10,zIndex:10,},
	imgBtn: {borderRadius:5,overflow:'hidden',position:'relative',borderWidth:1,borderColor:'#EDEDED'},
	imgText: {width:43,height:21,backgroundColor:'#fff',borderRadius:50,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:21,textAlign:'center',color:'#243B55',position:'absolute',right:5,bottom:5,},

	guideBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',width:140,height:37,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:50,marginTop:20,},
	guideBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#1e1e1e',marginRight:8,position:'relative',top:1,},

	header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},

	guidePopCont: {padding:20,},
	guidePopContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e'},

	red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

  boxShadow2: {
    borderRadius:5,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
		elevation: 4,
	},

	lineView: {height:6,backgroundColor:'#F2F4F6'},
	pdt0: {paddingTop:0},
  pdt10: {paddingTop:10},
  pdt15: {paddingTop:15},
  pdt20: {paddingTop:20},
  pdt30: {paddingTop:30},
  pdt40: {paddingTop:40},
  pdb0: {paddingBottom:0},
  pdb10: {paddingBottom:10},
  pdb20: {paddingBottom:20},
  pdb30: {paddingBottom:30},
  pdb40: {paddingBottom:40},
	mgt0: {marginTop:0},
	mgt5: {marginTop:5},
	mgt10: {marginTop:10},
  mgt15: {marginTop:15},
	mgt20: {marginTop:20},
	mgt30: {marginTop:30},
	mgt40: {marginTop:40},
	mgt50: {marginTop:50},
	mgb10: {marginBottom:10},
	mgb20: {marginBottom:20},
	mgr0: {marginRight:0},
  mgr10: {marginRight:10},
  mgr15: {marginRight:15},
	mgl0: {marginLeft:0},
  mgl4: {marginLeft:4},
  mgl10: {marginLeft:10},
  mgl15: {marginLeft:15},
})

export default MyProfile