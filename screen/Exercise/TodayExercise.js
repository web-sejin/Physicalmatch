import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, PermissionsAndroid, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-toast-message';

import APIs from "../../assets/APIs"
import Font from "../../assets/common/Font";
import Header from '../../components/Header';
import ToastMessage from "../../components/ToastMessage";
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

const TodayExercise = (props) => {	
  const navigationUse = useNavigation();
	const {navigation, userInfo, route} = props;
  const {params} = route;	
	const [routeLoad, setRouteLoad] = useState(false);
  const [pageSt, setPageSt] = useState(false);
  const [preventBack, setPreventBack] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [loading, setLoading] = useState(false);
  const [memberIdx, setMemberIdx] = useState();
	const [memberInfo, setMemberInfo] = useState();
  const [exerList, setExerList] = useState([]);
  const [nowPage, setNowPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [tabState, setTabState] = useState(); //피드, 운동, 달력

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
      if(!tabState){
        setTabState(1);
      }

      AsyncStorage.getItem('member_idx', (err, result) => {		
				setMemberIdx(result);
			});

      if(params?.reload){				
				getMemInfo();
				setNowPage(1);
        delete params?.reload;
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
				setPreventBack(false);
				e.preventDefault();
      } else {
        //console.log('뒤로 가기 이벤트 발생!');								
      }
    });

    return unsubscribe;
  }, [navigationUse, preventBack]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {			
			setKeyboardStatus(1);
			setTimeout(function(){
				setKeyboardStatus(2);
			}, 300);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			setKeyboardStatus(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
		if(memberIdx){
			setLoading(true);
			getMemInfo();
			setNowPage(1);
			getExerList(1);			
		}
	}, [memberIdx, tabState]);

  const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
    //console.log(response);
		if(response.code == 200){
			setMemberInfo(response.data);
		}
	}

  const getExerList = async (viewPage) => {
    const ary = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let curr_page = nowPage;
		if(viewPage){
			curr_page = viewPage;
		}

		if (exerList.length < 1) {
			curr_page = 1;
		}	

		let curr_tab = tabState;		
		if(params?.writeType){
			setTabState(params?.writeType);
			curr_tab = params?.writeType;
			delete params?.writeType;
		}
    
    setExerList(ary);

    setTimeout(function(){
			setLoading(false);
		}, 300);
  }

  const getList = ({item, index}) => {		
		return (
			<View style={styles.exeList}>
				<TouchableOpacity
					style={styles.exeButton}
					activeOpacity={opacityVal}
					onPress={()=>{
						//navigation.navigate('SocialView', {social_idx:item.social_idx, social_host_sex:item.host_social_sex})								
					}}
				>
					<ImgDomain fileWidth={widnowWidth/3} fileName={'feed_'+(index+1)+'.png'} />
				</TouchableOpacity>
			</View>
		)
	}

  const onScroll = (e) => {
		const {contentSize, layoutMeasurement, contentOffset} = e.nativeEvent;
		//console.log({contentSize, layoutMeasurement, contentOffset});
		//console.log(contentOffset.y);	
	};

  //무한 스크롤
  const moreData = async () => {				
		// if (socialList.length > 0) {
		// 	getSocialList(nowPage + 1);
		// 	setNowPage(nowPage + 1);
		// }	
	}

	const onRefresh = () => {
		if(!refreshing) {
			setRefreshing(true);
			// getSocialList(1);
			// setNowPage(1);
			// //console.log('refresh!!!');
			// setTimeout(() => {
			// 	setRefreshing(false);
			// }, 2000);
		}
	}

  const moveAlimPage = async () => {
		navigation.navigate('Alim', {alarm_type:userInfo?.alarm_type});
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
				<View style={styles.headerTop}>
					<View style={styles.headerTopTitle}>
						<Text style={styles.headerTitleText}>Exercise</Text>
					</View>
					<View style={styles.headerLnb}>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								if(memberInfo?.member_type != 1){
									ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
								}else{
									navigation.navigate('Shop');
								}								
							}}					
						>
							<ImgDomain fileWidth={24} fileName={'icon_shop.png'}/>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => moveAlimPage()}
						>
							{userInfo?.is_new == 'y' ? (
								<ImgDomain fileWidth={24} fileName={'icon_alim_on.png'}/>
							) : (
								<ImgDomain fileWidth={24} fileName={'icon_alim_off.png'}/>
							)}		
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.headerBot}>
					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(1)}}
					>
						<Text style={[styles.headerTabText, tabState == 1 ? styles.headerTabTextOn : null]}>오운완 피드</Text>
						{tabState == 1 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(2)}}
					>
						<Text style={[styles.headerTabText, tabState == 21 ? styles.headerTabTextOn : null]}>오늘 운동</Text>
						{tabState == 2 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(3)}}
					>
						<Text style={[styles.headerTabText, tabState == 3 ? styles.headerTabTextOn : null]}>운동 달력</Text>
						{tabState == 3 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>
				</View>
			</View>

      <FlatList 				
				data={exerList}
				renderItem={(getList)}
				keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        columnWrapperStyle={{ gap:1,marginBottom:1, }} 
				refreshing={refreshing}
				disableVirtualization={false}
				onScroll={onScroll}	
				onEndReachedThreshold={0.8}
				onEndReached={moreData}
				onRefresh={onRefresh}
				//ListHeaderComponent={}
        ListEmptyComponent={
					<View style={styles.notData}>
						<Text style={styles.notDataText}>등록된 피드가 없습니다.</Text>
					</View>
				}
      />
      <View style={styles.gapBox}></View>

      {keyboardStatus == 0 || keyboardStatus == 1 ? (
			<TouchableOpacity
        style={[styles.wrtBtn, styles.wrtBtnBoxShadow, keyboardStatus == 1 ? styles.wrtBtnHide : null]}
        activeOpacity={opacityVal}
        onPress={()=>{
					if(memberInfo?.member_type != 1){
						ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
					}else{
						//navigation.navigate('SocialType');
					}
			}}
      >
				<ImgDomain fileWidth={60} fileName={'icon_write.png'}/>
      </TouchableOpacity>
			) : null}

			{loading ? (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#D1913C" />
      </View>
      ) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

  header: {backgroundColor:'#141E30'},
	headerTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:20,paddingBottom:10,},
	headerTopTitle: {paddingLeft:20,},
	headerTitleText: {fontFamily:Font.RobotoMedium,fontSize:24,lineHeight:26,color:'#fff'},
	headerLnb: {flexDirection:'row',alignItems:'center',paddingRight:15,},
	headerLnbBtn: {marginLeft:6,paddingHorizontal:5,},
	headerBot: {flexDirection:'row',},
	headerTab: {width:widnowWidth/3,height:60,alignItems:'center',justifyContent:'center',position:'relative',paddingTop:10,},
	headerTabText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#fff'},
	headerTabTextOn: {fontFamily:Font.NotoSansBold,color:'#FFD194'},
	activeLine: {width:widnowWidth/3,height:4,backgroundColor:'#FFD194',position:'absolute',left:0,bottom:0,zIndex:10,},

  cmWrap: {paddingBottom:40,paddingHorizontal:20,},
	cmWrap2: {paddingTop:30,},
	wrtBtn: {position:'absolute',right:20,bottom:96,width:60,height:60,zIndex:100,backgroundColor:'#fff'},
	wrtBtnHide: {opacity:0,},
	wrtBtnBoxShadow: {
    borderRadius:50,
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
		elevation: 4,
	},
  exeList: {width:widnowWidth/3},
  exeButton: {},
})

export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(TodayExercise);