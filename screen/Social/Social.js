import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Social = (props) => {
	const socialData = [
		{idx:1, cate:'1:1', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:2, cate:'미팅', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:3, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:4, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:5, cate:'1:1', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:6, cate:'미팅', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:7, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:8, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
	];

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [socialList, setSocaiList] = useState(socialData);

	const [tabState, setTabState] = useState(1); //전체, 1:1, 미팅, 모임
	const [socialSch, setSocialSch] = useState('');
	const [refreshing, setRefreshing] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
		}else{
			//console.log("isFocused");
			setRouteLoad(true);
			setPageSt(!pageSt);
		}

		Keyboard.dismiss();
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

	const getList = ({item, index}) => (
		<View style={styles.socialLi}>
			<TouchableOpacity
				style={[styles.socialLiBtn, index == 0 ? styles.pdt0 : null]}
				activeOpacity={opacityVal}
				onPress={()=>{}}
			>
				<View style={styles.socialLiThumb}>
					<AutoHeightImage width={60} source={require('../../assets/image/social_basic1.jpg')} />
				</View>
				<View style={styles.socialLiInfo}>
					<View style={styles.socialLiInfo1}>
						<View style={styles.socialLiInfoCate}>
							<Text style={styles.socialLiInfoCateText}>{item.cate}</Text>
						</View>
						<View style={styles.socialLiInfoDate}>
							<Text style={styles.socialLiInfoDateText}>{item.date}</Text>
						</View>
					</View>
					<View style={styles.socialLiInfo2}>
						<Text style={styles.socialSubject} numberOfLines={1} ellipsizeMode='tail'>{item.subject}</Text>
					</View>
					<View style={styles.socialLiInfo3}>
						<View style={styles.socialLiInfo3Flex}>
							<AutoHeightImage width={10} source={require('../../assets/image/icon_local.png')} />
							<Text style={styles.socialLiInfo3Text}>{item.loc}</Text>
						</View>
						<View style={styles.socialLiInfo3Line}></View>
						<View style={styles.socialLiInfo3Flex}>
							<View style={styles.socialLiInfoProfile}>
								<AutoHeightImage width={20} source={require('../../assets/image/profile_sample.png')} />
							</View>
							<Text style={styles.socialLiInfo3Text}>{item.age}·{item.gender}</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)

	const onScroll = (e) => {
		const {contentSize, layoutMeasurement, contentOffset} = e.nativeEvent;
		//console.log({contentSize, layoutMeasurement, contentOffset});
		//console.log(contentOffset.y);	
	};

	//중고 리스트 무한 스크롤
	const moreData = async () => {

	}

	const onRefresh = () => {
		if(!refreshing) {
			setRefreshing(true);
			//getItemList();
			setTimeout(() => {
				setRefreshing(false);
			}, 2000);
		}
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<View style={styles.header}>
				<View style={styles.headerTop}>
					<View style={styles.headerTitle}>
						<Text style={styles.headerTitleText}>Social</Text>
					</View>
					<View style={styles.headerLnb}>
						<TouchableOpacity
							activeOpacity={opacityVal}
							onPress={() => {}}
						>
							<AutoHeightImage width={24} source={require('../../assets/image/icon_mysocial.png')} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {}}							
						>
							<AutoHeightImage width={24} source={require('../../assets/image/icon_shop.png')} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {}}
						>
							<AutoHeightImage width={24} source={require('../../assets/image/icon_alim_off.png')} />
							{/* <AutoHeightImage width={24} source={require('../assets/image/icon_alim_on.png')} /> */}
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.headerBot}>
					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(1)}}
					>
						<Text style={[styles.headerTabText, tabState == 1 ? styles.headerTabTextOn : null]}>전체</Text>
						{tabState == 1 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(2)}}
					>
						<Text style={[styles.headerTabText, tabState == 2 ? styles.headerTabTextOn : null]}>1:1</Text>
						{tabState == 2 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(3)}}
					>
						<Text style={[styles.headerTabText, tabState == 3 ? styles.headerTabTextOn : null]}>미팅</Text>
						{tabState == 3 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(4)}}
					>
						<Text style={[styles.headerTabText, tabState == 4 ? styles.headerTabTextOn : null]}>모임</Text>
						{tabState == 4 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>
				</View>
			</View>
			<TouchableOpacity 
				style={styles.socialBanner}
				activeOpacity={opacityVal}
				onPress={()=>{}}
			>
				<AutoHeightImage width={widnowWidth} source={require('../../assets/image/social_banner.png')}	/>
			</TouchableOpacity>
			<View style={styles.socialSchBox}>
				<View style={styles.socialSchBoxWrap}>
					<TouchableOpacity
						style={styles.socialSchBoxWrapBtn}
						activeOpacity={opacityVal}
						onPress={()=>{}}
					>
						<AutoHeightImage width={28} source={require('../../assets/image/icon_sch.png')} />
					</TouchableOpacity>
					<TextInput
						value={socialSch}
						onChangeText={(v) => setSocialSch(v)}
						style={[styles.socialSchBoxWrapInput]}
						returnKyeType='done'                      
					/>
				</View>
				<TouchableOpacity
					style={styles.socialSchFilterBtn}
					activeOpacity={opacityVal}
					onPress={()=>{}}
				>
					<AutoHeightImage width={28} source={require('../../assets/image/icon_option2.png')} />
				</TouchableOpacity>
			</View>
			<FlatList 
				data={socialList}
				renderItem={(getList)}
				keyExtractor={(item, index) => index.toString()}
				refreshing={refreshing}
				disableVirtualization={false}
				onScroll={onScroll}	
				onEndReachedThreshold={0.8}
				onEndReached={moreData}
				onRefresh={onRefresh}
				// ListEmptyComponent={
				// 	isLoading ? (
				// 	<View style={styles.notData}>
				// 		<Text style={styles.notDataText}>등록된 게시물이 없습니다.</Text>
				// 	</View>
				// 	) : (
				// 		<View style={[styles.indicator]}>
				// 			<ActivityIndicator size="large" />
				// 		</View>
				// 	)
				// }
			/>
			<View style={styles.gapBox}></View>

			<TouchableOpacity
        style={[styles.wrtBtn, styles.wrtBtnBoxShadow]}
        activeOpacity={opacityVal}
        onPress={()=>{}}
      >
        <AutoHeightImage width={60} source={require('../../assets/image/icon_write.png')} />
      </TouchableOpacity>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },	
	gapBox: {height:86,},
	indicator: { height: widnowHeight - 185, display: 'flex', alignItems: 'center', justifyContent: 'center' },
	indicator2: { marginTop: 62 },

	header: {backgroundColor:'#141E30'},
	headerTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:20,paddingBottom:10,paddingHorizontal:20,},
	headerTitle: {},
	headerTitleText: {fontFamily:Font.RobotoMedium,fontSize:24,lineHeight:26,color:'#fff'},
	headerLnb: {flexDirection:'row',alignItems:'center',},
	headerLnbBtn: {marginLeft:16,},
	headerBot: {flexDirection:'row',},
	headerTab: {width:widnowWidth/4,height:60,alignItems:'center',justifyContent:'center',position:'relative'},
	headerTabText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#fff'},
	headerTabTextOn: {fontFamily:Font.NotoSansBold,color:'#FFD194'},
	activeLine: {width:widnowWidth/4,height:4,backgroundColor:'#FFD194',position:'absolute',left:0,bottom:0,zIndex:10,},

	modalHeader: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},
	filterResetBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:20,height:48,backgroundColor:'#fff',position:'absolute',top:0,right:0,zIndex:10,},
	filterResetText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#1E1E1E',marginLeft:6,},

	socialSchBox: {padding:20,paddingBottom:30,flexDirection:'row',justifyContent:'space-between'},
	socialSchBoxWrap: {flexDirection:'row',},
	socialSchBoxWrapBtn: {alignItems:'center',justifyContent:'center',width:38,height:40,backgroundColor:'#F9FAFB',borderWidth:1,borderRightWidth:0,borderColor:'#EDEDED',borderTopLeftRadius:5,borderBottomLeftRadius:5,},
	socialSchBoxWrapInput: {width:innerWidth-78,height:40,backgroundColor:'#F9FAFB',borderWidth:1,borderLeftWidth:0,borderColor:'#EDEDED',borderTopRightRadius:5,borderBottomRightRadius:5,fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},
	socialSchFilterBtn: {justifyContent:'center',width:28,height:40,},

	cmWrap: {paddingBottom:40,paddingHorizontal:20,},
	wrtBtn: {position:'absolute',right:20,bottom:96,width:60,height:60,zIndex:100,},
	wrtBtnBoxShadow: {
    borderRadius:50,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
		elevation: 1,
	},

	socialLi: {paddingHorizontal:20,},
	socialLiBtn: {flexDirection:'row',paddingVertical:18,borderBottomWidth:1,borderColor:'#EDEDED'},
	socialLiThumb: {alignItems:'center',justifyContent:'center',width:60,height:60,borderRadius:50,overflow:'hidden'},
	socialLiInfo: {width:innerWidth-60,paddingLeft:20,},
	socialLiInfo1: {flexDirection:'row',alignItems:'center',},
	socialLiInfoCate: {alignItems:'center',justifyContent:'center',width:32,height:16,backgroundColor:'#243B55',borderRadius:10,},
	socialLiInfoCateText: {fontFamily:Font.NotoSansMedium,fontSize:10,lineHeight:13,color:'#fff'},
	socialLiInfoDate: {marginLeft:4,},
	socialLiInfoDateText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:13,color:'#888'},
	socialLiInfo2: {marginVertical:8,},
	socialSubject: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:16,color:'#1e1e1e'},
	socialLiInfo3: {flexDirection:'row',alignItems:'center',},
	socialLiInfo3Flex: {flexDirection:'row',alignItems:'center',},
	socialLiInfoProfile: {alignItems:'center',justifyContent:'center',width:20,height:20,borderRadius:50,overflow:'hidden'},
	socialLiInfo3Text: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:13,color:'#1e1e1e',marginLeft:4,},
	socialLiInfo3Line: {width:1,height:12,backgroundColor:'#EDEDED',marginHorizontal:12},

	pdt0: {paddingTop:0,},
})

export default Social