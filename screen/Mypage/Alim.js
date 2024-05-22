import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';

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

const Alim = (props) => {
  const data = [
    {idx:1, cate:'유형', date:'2024.00.00', yoil:'MON', time:'00:00', subject:'디바이스 알림창에 노출되는 문구는 20자까지 입력 가능합니다.', content:'서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다.'},
    {idx:2, cate:'유형', date:'2024.00.00', yoil:'MON', time:'00:00', subject:'디바이스 알림창에 노출되는 문구는 20자까지 입력 가능합니다.', content:'서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다.'},
    {idx:3, cate:'유형', date:'2024.00.00', yoil:'MON', time:'00:00', subject:'디바이스 알림창에 노출되는 문구는 20자까지 입력 가능합니다.', content:'서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다.'},
    {idx:4, cate:'유형', date:'2024.00.00', yoil:'MON', time:'00:00', subject:'디바이스 알림창에 노출되는 문구는 20자까지 입력 가능합니다.', content:'서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다.'},
    {idx:5, cate:'유형', date:'2024.00.00', yoil:'MON', time:'00:00', subject:'디바이스 알림창에 노출되는 문구는 20자까지 입력 가능합니다.', content:'서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다.'},
    {idx:6, cate:'유형', date:'2024.00.00', yoil:'MON', time:'00:00', subject:'디바이스 알림창에 노출되는 문구는 20자까지 입력 가능합니다.', content:'서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다.'},
  ]

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [tabSt, setTabSt] = useState(1);
  const [alimList, setAlimList] = useState(data);

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

  const getList = ({item, index}) => {
		return (
      <TouchableOpacity
        style={[styles.alimLi, index != 0 ? styles.alimLiBo : null]}
        activeOpacity={1}            
      >
        <View style={styles.alimInfo}>
          <View style={styles.alimType}>
            <Text style={styles.alimTypeText}>유형</Text>
          </View>
          <View style={styles.alimDate}>
            <Text style={styles.alimDateText}>2024.00.00</Text>
          </View>
          <View style={styles.alimDate}>
            <Text style={styles.alimDateText}>MON</Text>
          </View>
          <View style={styles.alimDate}>
            <Text style={styles.alimDateText}>00:00</Text>
          </View>
        </View>
        <View style={styles.alimSubject}>
          <Text style={styles.alimSubjectText}>디바이스 알림창에 노출되는 문구는 20자까지 입력 가능합니다.</Text>
        </View>
        <View style={styles.alimCont}>
          <Text style={styles.alimContText} numberOfLines={3} ellipsizeMode='tail'>
            서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다. 서브 설명은 3줄까지 입력 가능합니다.
          </Text>
        </View>
      </TouchableOpacity>
    )
	}

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

  const change = async (v) => {
    setTabSt(v);
  }

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'알림'}/>

      <View style={styles.viewTab}>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 1 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>change(1)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 1 ? styles.viewTabBtnTextOn : null]}>일반 알림</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 2 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>change(2)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 2 ? styles.viewTabBtnTextOn : null]}>댓글 알림</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.cmWrap}
				data={alimList}
				renderItem={(getList)}
				keyExtractor={(item, index) => index.toString()}
				refreshing={refreshing}
				disableVirtualization={false}
				onScroll={onScroll}	
				onEndReachedThreshold={0.8}
				onEndReached={moreData}
				onRefresh={onRefresh}
				ListHeaderComponent={<View style={{height:10,backgroundColor:'#fff'}}></View>}
        ListFooterComponent={<View style={{height:10,backgroundColor:'#fff'}}></View>}
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

  cmWrap: {paddingHorizontal:20,},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

  viewTab: {flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#F2F4F6'},
  viewTabBtn: {alignItems:'center',justifyContent:'center',width:widnowWidth/2,height:60,paddingTop:12,borderBottomWidth:2,borderBottomColor:'#fff'},
  viewTabBtnOn: {borderBottomColor:'#141E30'},
  viewTabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#141E30',},
  viewTabBtnTextOn: {fontFamily:Font.NotoSansSemiBold},
  viewTab2: {flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#F2F4F6'},
  viewTab2Btn: {padding:20,marginLeft:30,},
  viewTab2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#888',},
  viewTab2BtnTextOn: {color:'#141E30'},

  alimLi: {paddingVertical:20,},
  alimLiBo: {borderTopWidth:1,borderTopColor:'#DBDBDB'},
  alimInfo: {flexDirection:'row',alignItems:'center'},
  alimType: {alignItems:'center',justifyContent:'center',height:18,paddingHorizontal:6,backgroundColor:'#243B55',borderRadius:10,},
  alimTypeText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#fff'},
  alimDate: {},
  alimDateText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#888',marginLeft:5,},
  alimSubject: {marginTop:10,},
  alimSubjectText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
  alimCont: {marginTop:6,},
  alimContText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:18,color:'#888'},

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

export default Alim