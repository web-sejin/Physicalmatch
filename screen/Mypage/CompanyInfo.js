import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const CompanyInfo = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [company, setCompany] = useState();

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
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

	useEffect(() => {
		getCompanyInfo();
	}, [])

	const getCompanyInfo = async () => {
		let sData = {      
			basePath: "/api/etc/index.php",
			type: "GetBusinessInfo",
		}
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			setCompany(response.data);
		}
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'사업자 정보'}/>

      <ScrollView>
				{company ? (
				<View style={styles.cmWrap}>
					{company.business_name ? (
					<View style={[styles.compView, styles.compView2]}>
						<Text style={styles.compViewTitle}>사업자명</Text>
						<Text style={styles.compViewContent}>{company.business_name}</Text>
					</View>
					) : null}
					{company.business_ceo ? (
					<View style={styles.compView}>
						<Text style={styles.compViewTitle}>대표</Text>
						<Text style={styles.compViewContent}>{company.business_ceo}</Text>
					</View>
					) : null}
					{company.business_manager ? (
					<View style={styles.compView}>
						<Text style={styles.compViewTitle}>개인정보 책임자</Text>
						<Text style={styles.compViewContent}>{company.business_manager}</Text>
					</View>
					) : null}
					{company.business_addr ? (
					<View style={styles.compView}>
						<Text style={styles.compViewTitle}>주소</Text>
						<Text style={styles.compViewContent}>{company.business_addr}</Text>
					</View>
					) : null}
					{company.business_num ? (
					<View style={styles.compView}>
						<Text style={styles.compViewTitle}>사업자등록번호</Text>
						<Text style={styles.compViewContent}>{company.business_num}</Text>
					</View>
					) : null}
					{company.business_tel ? (
					<View style={styles.compView}>
						<Text style={styles.compViewTitle}>고객센터</Text>
						<Text style={styles.compViewContent}>{company.business_tel}</Text>
					</View>
					) : null}
					{company.business_fax ? (
					<View style={styles.compView}>
						<Text style={styles.compViewTitle}>팩스</Text>
						<Text style={styles.compViewContent}>{company.business_fax}</Text>
					</View>
					) : null}
					{company.business_email ? (
					<View style={styles.compView}>
						<Text style={styles.compViewTitle}>이메일</Text>
						<Text style={styles.compViewContent}>{company.business_email}</Text>
					</View>
					) : null}
				</View>
				) : null}
      </ScrollView>

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
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

  cmWrap: {paddingVertical:30,paddingHorizontal:20},
	compView: {marginTop:20,paddingTop:20,borderTopWidth:1,borderTopColor:'#ededed'},
	compView2: {marginTop:0,paddingTop:0,borderTopWidth:0,},
	compViewTitle: {fontFamily:Font.NotoSansSemiBold,fontSize:14,lineHeight:17,color:'#333',},
	compViewContent: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:16,color:'#666',marginTop:10,},

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

export default CompanyInfo