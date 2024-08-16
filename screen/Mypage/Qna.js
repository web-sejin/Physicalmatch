import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import APIs from "../../assets/APIs";
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

const Qna = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [refreshing, setRefreshing] = useState(false);
	const [qnaList, setQnaList] = useState([]);
	const [apiList, setApiList] = useState([]);
	const [openIdx, setOpenIdx] = useState();
	const [openIdx2, setOpenIdx2] = useState();

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

	const openContDp1 = (v) => {	
		let qnaListCust = [...qnaList];		
		if(qnaListCust[v].open){
			qnaListCust[v].open = false;
		}else{
			qnaListCust[v].open = true;
		}		
    qnaListCust[v].open = !(qnaListCust[v].open);
		setQnaList(qnaListCust);
	}

	useEffect(() => {
		getApiEvent();
	}, []);

	const getApiEvent = async () => {
		let sData = {      
      basePath: "/api/etc/",
			type: "GetQnA",
		}
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			setApiList(response.data);
		}
	}

  const openCont = (v, z, y) => {    
    let qnaListCust = [...qnaList];
    qnaListCust[v][1][z].open = !(qnaListCust[v][1][z].open);
    setQnaList(qnaListCust);
  }

	const getList = ({item, index}) => (
		<View style={styles.pointDateView}>
			<TouchableOpacity 
				style={[styles.pointDate, index == 0 ? styles.mgt15 : null]}
				activeOpacity={opacityVal}
				onPress={()=>{
					//openContDp1(index);
					if(index == openIdx){
						setOpenIdx();						
					}else{
						setOpenIdx(index);
					}
					setOpenIdx2();
				}}
			>
				<Text style={styles.pointDateText}>{index+1}. {item.title}</Text>       

				{openIdx == index ? (
					<View style={styles.pointDateArr}>
						<ImgDomain fileWidth={10} fileName={'icon_arr4.png'}/>
					</View>
				) : (
					<View style={styles.pointDateArr}>
						<ImgDomain fileWidth={10} fileName={'icon_arr3.png'}/>
					</View>
				)}
			</TouchableOpacity>
			
			{openIdx == index ? (
			<View style={styles.pointDateBox}>
				{item.data.map((item2, index2) => {
					let splt = '';
					let splt2 = '';
					if(item2.qna_screen_info){
						splt = item2.qna_screen_info.split('|');
						splt2 = item2.qna_screen.split('|');
					}
					return (						
						<View key={index2} style={[styles.guidePopContBox]}>
							<TouchableOpacity
								style={[styles.guidePopContBtn, openIdx2 == index2 ? styles.guidePopContBtn2 : null]}
								activeOpacity={opacityVal}
								onPress={()=>{
									//openCont(index, index2, item2.idx)
									if(index2 == openIdx2){
										setOpenIdx2();
									}else{
										setOpenIdx2(index2);
									}
								}}
							>
								<View style={styles.qFlex}>
									<View style={styles.qLeft}>
										<Text style={styles.qLeftText}>Q.</Text>
									</View>
									<View style={styles.qRight}>
										<View style={styles.guidePopContBtnTitle}>
											<Text style={styles.guidePopContBtnText}>{item2.qna_question}</Text>
										</View>
										<View style={styles.guidePopContBtnDate}>
											<Text style={styles.guidePopContBtnDateText}>{item2.created_at}</Text>
										</View>
									</View>
								</View>
								{openIdx2 == index2 ? (
									<View style={styles.pointDateArr}>
										<ImgDomain fileWidth={10} fileName={'icon_arr4.png'}/>
									</View>
								) : (
									<View style={styles.pointDateArr}>
										<ImgDomain fileWidth={10} fileName={'icon_arr3.png'}/>
									</View>
								)}
							</TouchableOpacity>
							{openIdx2 == index2 ? (
							<View style={styles.guidePopCont2}>
								<Text style={styles.guidePopCont2Text}>{item2.qna_answer}</Text>

								{item2.qna_screen_info ? (
									<View style={styles.moveNaviBox}>
										{splt.map((item3, index3) => {
											return (
												<TouchableOpacity
													style={styles.moveNavi}
													activeOpacity={opacityVal}
													onPress={() => {
														//console.log(splt2[index3]);
														navigation.navigate(splt2[index3]);
													}}
												>
													<Text style={styles.moveNaviText}>{item3}</Text>
												</TouchableOpacity>
											)
										})}
										
									</View>									
								) : null}
							</View>
							) : null}
						</View>
					)
				})}
			</View>
			) : null}

		</View>
  );

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
			//getItemList();
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
			<Header navigation={navigation} headertitle={'Q&A'}/>
			
			<FlatList 				
				style={styles.cmWrap}
				data={apiList}
				renderItem={getList}
				keyExtractor={(item, index) => index.toString()}
				refreshing={refreshing}
				disableVirtualization={false}
				onScroll={onScroll}	
				onEndReachedThreshold={0.8}
				onEndReached={moreData}
				onRefresh={onRefresh}
				ListFooterComponent={
					<View style={{height:50,backgroundColor:'#fff'}}></View>
				}
				ListEmptyComponent={
					<View style={styles.notData}>
						<Text style={styles.notDataText}>등록된 게시물이 없습니다.</Text>
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

  cmWrap: {paddingHorizontal:20},
	regiTypingView: {paddingTop:30,},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},
	
	pointDateView: {},
	pointDate: {justifyContent:'center',marginTop:35,paddingRight:20,paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#B8B8B8',position:'relative',},
	pointDateText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:19,color:'#1e1e1e'},
	pointDateArr: {position:'absolute',right:0,},
	pointDateBox: {},
	pointDateBoxWrap: {paddingVertical:15,paddingHorizontal:5,borderBottomWidth:1,borderBottomColor:'#ededed'},
	pointUse: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	pointUseDate: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#888888'},
	pointUseType: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,},
	pointUseMethod: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:4,marginBottom:8,},
	pointUseMethodText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},
	pointUsePoint: {fontFamily:Font.NotoSansBold,fontSize:14,lineHeight:17,},
	pointRemain: {alignItems:'flex-end'},
	pointRemainText: {textAlign:'right',fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#1e1e1e'},

  guidePopContBox: {},
	guidePopContBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',position:'relative',paddingVertical:20,borderBottomWidth:1,borderBottomColor:'#DBDBDB'},
	guidePopContBtn2: {borderBottomWidth:0,paddingBottom:11,},
  qFlex: {flexDirection:'row',},
  qLeft: {width:16,},
  qLeftText: {fontFamily:Font.RobotoMedium,fontSize:15,lineHeight:16,color:'#1e1e1e'},
  qRight: {width:innerWidth-26,},
	guidePopContBtnTitle: {flexDirection:'row',alignItems:'center',},
	guidePopContBtnText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,lineHeight:17,color:'#1e1e1e',marginLeft:2,},
  guidePopContBtnDate: {marginTop:4,},
  guidePopContBtnDateText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#888'},
	guidePopCont2: {paddingVertical:10,paddingHorizontal:15,backgroundColor:'#F9FAFB',borderBottomWidth:1,borderBottomColor:'#DBDBDB'},
	guidePopCont2Text: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e',},

	moveNaviBox: {flexDirection:'row',marginTop:10,gap:5,},
	moveNavi: {alignItems:'center',justifyContent:'center',paddingHorizontal:10,height:35,backgroundColor:'#243B55',borderRadius:5,},
	moveNaviText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:14,color:'#fff'},

	notData: {paddingTop:50},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:13,color:'#666'},

	red: {color:'#F22D2D'},
	blue: {color:'#116FDA'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

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

export default Qna