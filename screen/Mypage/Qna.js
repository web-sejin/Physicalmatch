import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {connect} from 'react-redux';

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const Qna = (props) => {
	const data = [
		[
			'질문 대분류',
			[
				{idx:1, subject:'공지 제목1', date:'2024.00.00', content:'내용이 입력됩니다.1', open:false,},
        {idx:2, subject:'공지 제목2', date:'2024.00.00', content:'내용이 입력됩니다.2', open:false,},
			],
			false
		],
		[
			'질문 대분류2',
			[
				{idx:3, subject:'공지 제목3', date:'2024.00.00', content:'내용이 입력됩니다.3', open:false,},
        {idx:4, subject:'공지 제목4', date:'2024.00.00', content:'내용이 입력됩니다.4', open:false,},
			],
			false
		],
		[
			'질문 대분류3',
			[
				{idx:5, subject:'공지 제목5', date:'2024.00.00', content:'내용이 입력됩니다.5', open:false,},
			],
			false
		],
	];

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [refreshing, setRefreshing] = useState(false);
	const [qnaList, setQnaList] = useState(data);

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
    qnaListCust[v][2] = !(qnaListCust[v][2]);
		setQnaList(qnaListCust);
	}

  const openCont = (v, z, y) => {    
    let qnaListCust = [...qnaList];
    qnaListCust[v][1][z].open = !(qnaListCust[v][1][z].open);
    setQnaList(qnaListCust);
  }

	const getList = useCallback(({item, index}) => {    
    return(
      <View style={styles.pointDateView}>
        <TouchableOpacity 
					style={[styles.pointDate, index == 0 ? styles.mgt15 : null]}
					activeOpacity={opacityVal}
					onPress={()=>{openContDp1(index)}}
				>
          <Text style={styles.pointDateText}>{index+1}. {item[0]}</Text>

					{item[2] ? (
						<AutoHeightImage width={10} source={require('../../assets/image/icon_arr4.png')} style={styles.pointDateArr} />
					) : (
						<AutoHeightImage width={10} source={require('../../assets/image/icon_arr3.png')} style={styles.pointDateArr} />
					)}
        </TouchableOpacity>
				{item[2] ? (
        <View style={styles.pointDateBox}>
          {item[1].map((item2, index2) => {
            return (						
              <View style={[styles.guidePopContBox]}>
                <TouchableOpacity
                  style={[styles.guidePopContBtn, item2.open ? styles.guidePopContBtn2 : null]}
                  activeOpacity={opacityVal}
                  onPress={()=>{openCont(index, index2, item2.idx)}}
                >
                  <View style={styles.qFlex}>
                    <View style={styles.qLeft}>
                      <Text style={styles.qLeftText}>Q.</Text>
                    </View>
                    <View style={styles.qRight}>
                      <View style={styles.guidePopContBtnTitle}>
                        <Text style={styles.guidePopContBtnText}>{item2.subject}</Text>
                      </View>
                      <View style={styles.guidePopContBtnDate}>
                        <Text style={styles.guidePopContBtnDateText}>{item2.date}</Text>
                      </View>
                    </View>
                  </View>
                  {item2.open ? (
                    <AutoHeightImage width={10} source={require('../../assets/image/icon_arr4.png')} />
                  ) : (
                    <AutoHeightImage width={10} source={require('../../assets/image/icon_arr3.png')} />
                  )}
                </TouchableOpacity>
                {item2.open ? (
                <View style={styles.guidePopCont2}>
                  <Text style={styles.guidePopCont2Text}>{item2.content}</Text>
                </View>
                ) : null}
              </View>
            )
          })}
        </View>
				) : null}
      </View>
    )
  }, []);

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
				data={qnaList}
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
	pointDate: {justifyContent:'center',marginTop:35,paddingRight:20,paddingVertical:15,borderBottomWidth:1,borderBottomColor:'#B8B8B8',position:'relative',},
	pointDateText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:17,color:'#1e1e1e'},
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