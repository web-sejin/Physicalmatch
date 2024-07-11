import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';

import APIs from "../../assets/APIs";
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import ImgDomain from '../../assets/common/ImgDomain';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const MyPoint = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [refreshing, setRefreshing] = useState(false);
	const [pointList, setPointList] = useState([]);
	const [currPoint, setCurrPoint] = useState(0);
	const [memberIdx, setMemberIdx] = useState();

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
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

	useEffect(() => {
		if(memberIdx){
			getMyPoint();
			getMyPointList();
		}
	}, [memberIdx]);

	const getMyPoint = async () => {
		let sData = {      
      basePath: "/api/member/",
			type: "GetMyPoint",
			member_idx: memberIdx,
		}
		const response = await APIs.send(sData);
		if(response.code == 200){
			setCurrPoint(response.data);
		}
	}

	const getMyPointList = async () => {
		let sData = {      
      basePath: "/api/member/",
			type: "GetPointList",
			member_idx: memberIdx,
		}
		const response = await APIs.send(sData);		
		if(response.code == 200){
			if(response.msg == 'EMPTY'){
				setPointList([]);				
			}else if(response.data.length > 0){
				setPointList(response.data);								
			}
		}
	}

	const getList = ({item, index}) => (		
		<View style={styles.pointDateView}>
			<View style={styles.pointDate}>
				<Text style={styles.pointDateText}>{item.date}</Text>
			</View>
			<View style={styles.pointDateBox}>
				{item.list.map((item2, index2) => {					
					return (
						<View key={index2} style={styles.pointDateBoxWrap}>
							<View style={styles.pointUse}>
								<Text style={styles.pointUseDate}>{item2.created_His}</Text>
								{item2.pl_type == 0 ? (
									<Text style={[styles.pointUseType, styles.red]}>충전</Text>
								) : (
									<Text style={[styles.pointUseType, styles.blue]}>사용</Text>
								)}								
							</View>
							<View style={styles.pointUseMethod}>
								<Text style={styles.pointUseMethodText}>{item2.pl_content}</Text>
								<Text style={[styles.pointUsePoint, item2.pl_type == 0 ? styles.red : null, item2.pl_type == 1 ? styles.blue : null]}>{item2.pl_point}</Text>
							</View>
							<View style={styles.pointRemain}>
								<Text style={[styles.pointRemainText]}>{item2.pl_left_point}</Text>
							</View>
						</View>
					)
				})}					
			</View>
		</View>
	)

	const onScroll = (e) => {
		const {contentSize, layoutMeasurement, contentOffset} = e.nativeEvent;
		//console.log({contentSize, layoutMeasurement, contentOffset});
		//console.log(contentOffset.y);	
	};

	//리스트 무한 스크롤
	const moreData = async () => {

	}

	const onRefresh = () => {
		if(!refreshing) {
			setRefreshing(true);
			getMyPointList();
			setTimeout(() => {
				setRefreshing(false);
			}, 2000);
		}
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<View style={styles.header}>
				<TouchableOpacity 					
					style={styles.headerBackBtn} 
					activeOpacity={opacityVal}
					onPress={() => {navigation.goBack();}} 
				>
					<ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.headerShopBtn}
					activeOpacity={opacityVal}
					onPress={() => {navigation.navigate('Shop')}}							
				>
					<ImgDomain fileWidth={24} fileName={'icon_shop2.png'}/>
				</TouchableOpacity>
			</View>
			
			<FlatList 				
				style={styles.cmWrap}
				data={pointList}
				renderItem={(getList)}
				keyExtractor={(item, index) => index.toString()}
				refreshing={refreshing}
				disableVirtualization={false}
				onScroll={onScroll}	
				onEndReachedThreshold={0.8}
				onEndReached={moreData}
				onRefresh={onRefresh}
				ListHeaderComponent={
					<>
					<View style={styles.regiTypingView}>
						<View style={styles.cmTitleBox}>
							<Text style={styles.cmTitleText}>내 프로틴</Text>
						</View>
					</View>

					<View style={styles.mgt25}>
						<View style={styles.currPoint}>
							<Text style={styles.currPointText}>잔여 프로틴</Text>
							<Text style={styles.currPointText2}>{currPoint}</Text>
						</View>
					</View>
					</>
				}
				ListFooterComponent={
					<View style={{height:50,backgroundColor:'#fff'}}></View>
				}
				ListEmptyComponent={
					<View style={styles.notData}>
						<Text style={styles.notDataText}>포인트를 사용한 내역이 없습니다.</Text>
					</View>
				}
			/>	

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

	header: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn: {width:54,height:48,position:'absolute',left:0,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},
	headerShopBtn: {width:54,height:48,position:'absolute',right:5,top:0,zIndex:10,alignItems:'center',justifyContent:'center',},
	headerBackBtn2: {width:56,height:48,position:'absolute',right:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	robotoMd: {fontFamily:Font.RobotoMedium},	

  cmWrap: {paddingHorizontal:20},
	regiTypingView: {paddingTop:30,},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

	currPoint: {flexDirection:'row',alignItems:'center',paddingBottom:6,},
	currPointText: {fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:19,color:'#1e1e1e'},
	currPointText2: {fontFamily:Font.RobotoBold,fontSize:16,lineHeight:19,color:'#D1913C',paddingBottom:2,marginLeft:6,},
	pointDateView: {},
	pointDate: {marginTop:30,},
	pointDateText: {fontFamily:Font.NotoSansSemiBold,fontSize:15,lineHeight:17,color:'#1e1e1e'},
	pointDateBox: {borderTopWidth:1,borderTopColor:'#B8B8B8',marginTop:15,},
	pointDateBoxWrap: {paddingVertical:15,paddingHorizontal:5,borderBottomWidth:1,borderBottomColor:'#ededed'},
	pointUse: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	pointUseDate: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#888888'},
	pointUseType: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,},
	pointUseMethod: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:4,marginBottom:8,},
	pointUseMethodText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},
	pointUsePoint: {fontFamily:Font.NotoSansBold,fontSize:14,lineHeight:17,},
	pointRemain: {alignItems:'flex-end'},
	pointRemainText: {textAlign:'right',fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#1e1e1e'},

	notData: {paddingTop:50},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:13,color:'#666'},

	red: {color:'#F22D2D'},
	blue: {color:'#116FDA'},
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
	mgt25: {marginTop:25},
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

export default MyPoint