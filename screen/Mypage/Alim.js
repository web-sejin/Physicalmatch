import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import APIs from "../../assets/APIs";
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import { advanceAnimationByFrame } from 'react-native-reanimated';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const Alim = (props) => {
	const navigationUse = useNavigation();
	const {navigation, userInfo, member_info, route} = props;
	const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [tabSt, setTabSt] = useState(0);
  const [otherTabNew, setOtherTabNew] = useState(false);
  const [alimList, setAlimList] = useState([]);
  const [memberIdx, setMemberIdx] = useState(userInfo?.data.member_idx);
  const [memberInfo, setMemberInfo] = useState();
  const [nowPage, setNowPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);

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

      if(userInfo?.data.member_idx){        
        setMemberIdx(userInfo?.data.member_idx);
      }else{
        AsyncStorage.getItem('member_idx', (err, result) => {		
          setMemberIdx(result);
        });
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
    if(memberIdx){     
      setLoading(true);
      getMemInfo();
      getAlimList(tabSt, 1);
      setNowPage(1);
    }
  }, [memberIdx]);

  const getMemInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);    
		if(response.code == 200){
			setMemberInfo(response.data);		
		}
	}

  const getAlimList = async (type, viewPage) => {    
    let curr_page = nowPage;
		if(viewPage){
			curr_page = viewPage;
		}

    let sData = {      
      basePath: "/api/etc/",
			type: "GetAlarmList",
      member_idx: memberIdx,
      alarm_type: type,
		}
		const response = await APIs.send(sData);
    //console.log(response);
		if(response.code == 200){      
      console.log(memberInfo);
      setOtherTabNew(response.is_new);
      if(curr_page == 1){
				if(response.msg == 'EMPTY'){
					setNowPage(1);
					setAlimList([]);
				}else{
					setAlimList(response.data);
				}
			}else if(curr_page > 1 && response.msg != 'EMPTY'){					
				const addList = [...socialList, ...response.data];
				setAlimList(addList);
			}
    }else{
      setAlimList([]);
    }
    
    setLoading(false);
  }

  const moveScreen = async (v, alarm_idx, sceenName) => {
    //console.log(alarm_idx);
    //console.log('sceenName ::: ', sceenName);
    let moveState = 0;
    if((sceenName == 'Home' || sceenName == 'MatchDetail') && memberInfo?.is_match_ban == 'y'){
      moveState = 1;
    }else if(sceenName == 'SocialView' && memberInfo?.is_social_ban == 'y'){
      moveState = 2;
    }else if(sceenName == 'CommunityView' && memberInfo?.is_comm_ban == 'y'){
      moveState = 3;
    }

    if(moveState == 0){    
      if(v){
        const itemParams = v;
        const itemParamsObj = JSON.parse(itemParams);      
        navigation.navigate(sceenName, itemParamsObj)
      }else{
        navigation.navigate(sceenName);
      }
    }else{
      if(moveState == 1){
        ToastMessage('앗! 매칭을 이용할 수 없어요🥲');
      }else if(moveState == 2){
        ToastMessage('앗! 소셜을 이용할 수 없어요🥲');
      }else if(moveState == 3){
        ToastMessage('앗! 커뮤니티를 이용할 수 없어요🥲');
      }
    }
  }

  const getList = ({item, index}) => {
    // const itemParams = item.params;
    // const itemParamsObj = JSON.parse(itemParams);
    // if(itemParams){      
    //   console.log(item.alarm_idx+':::::'+itemParamsObj);
    //  }
		return (
      <TouchableOpacity
        style={[styles.alimLi, index != 0 ? styles.alimLiBo : null]}
        activeOpacity={opacityVal}
        onPress={()=>{
          moveScreen(item.params, item.alarm_idx, item.push_screen);
        }}
      >
        <View style={styles.alimInfo}>
          {item.alarm_category ? (
          <View style={styles.alimType}>
            <Text style={styles.alimTypeText}>{item.alarm_category}</Text>
          </View>
          ) : null}
          <View style={styles.alimDate}>
            <Text style={styles.alimDateText}>{item.created_at_text}</Text>
          </View>
        </View>
        <View style={styles.alimSubject}>
          <Text style={styles.alimSubjectText} numberOfLines={1} ellipsizeMode='tail'>{item.alarm_subject}</Text>
        </View>
        <View style={styles.alimCont}>
          <Text style={styles.alimContText} numberOfLines={3} ellipsizeMode='tail'>
          {item.alarm_content}
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
		if(totalPage > nowPage){
			//console.log('moreData nowPage ::::', nowPage);
			getAlimList(tabSt, nowPage+1);
			setNowPage(nowPage+1);	
		}
	}

	const onRefresh = () => {
		if(!refreshing) {
			setRefreshing(true);
			getAlimList(tabSt, 1);
			setNowPage(1);
			//console.log('refresh!!!');
			setTimeout(() => {
				setRefreshing(false);
			}, 2000);
		}
	}

  const change = async (v) => {
    setLoading(true);
    setTabSt(v);
    getAlimList(v);
  }

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'알림'}/>

      <View style={styles.viewTab}>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 0 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>change(0)}
        >
          <View style={styles.newChk}>
            <Text style={[styles.viewTabBtnText, tabSt == 0 ? styles.viewTabBtnTextOn : null]}>일반 알림</Text>
            {tabSt == 1 && otherTabNew == 'y' ? (<View style={styles.newChkCircle}></View>) : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 1 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>{
            if(memberInfo?.member_type != 1){
              ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
            }else{
              change(1);
            }            
          }}
        >
          <View style={styles.newChk}>
            <Text style={[styles.viewTabBtnText, tabSt == 1 ? styles.viewTabBtnTextOn : null]}>댓글 알림</Text>
            {tabSt == 0 && otherTabNew == 'y' ? (<View style={styles.newChkCircle}></View>) : null}
          </View>          
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
				ListEmptyComponent={
					<View style={styles.notData}>
						<Text style={styles.notDataText}>등록된 알림이 없습니다.</Text>
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

  cmWrap: {paddingHorizontal:20,},
	cmTitleBox: {position:'relative'},
	cmTitleText: { fontFamily: Font.NotoSansSemiBold, fontSize: 22, lineHeight: 25, color: '#1e1e1e', position: 'relative', zIndex: 10, paddingLeft:1, },
	cmTitleLine: { width: 61, height: 14, backgroundColor: '#ffd194', position: 'absolute',left:0,bottom:-1,zIndex:9,opacity:0.3},
  cmDescBox: {marginTop:8,},
  cmDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#666'},

  viewTab: {flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#F2F4F6'},
  viewTabBtn: {alignItems:'center',justifyContent:'center',width:widnowWidth/2,height:60,paddingTop:12,borderBottomWidth:2,borderBottomColor:'#fff'},
  viewTabBtnOn: {borderBottomColor:'#141E30'},
  newChk: {position:'relative'},
  newChkCircle: {width:5,height:5,backgroundColor:'#EE4245',borderRadius:50,position:'absolute',top:-2,right:-7,},
  viewTabBtnText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:18,color:'#141E30',},
  viewTabBtnTextOn: {fontFamily:Font.NotoSansSemiBold},
  viewTab2: {flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#F2F4F6'},
  viewTab2Btn: {padding:20,marginLeft:30,},
  viewTab2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#888',},
  viewTab2BtnTextOn: {color:'#141E30'},

  alimLi: {paddingVertical:20,},
  alimLiBo: {borderTopWidth:1,borderTopColor:'#DBDBDB'},
  alimInfo: {flexDirection:'row',alignItems:'center'},
  alimType: {alignItems:'center',justifyContent:'center',height:18,paddingHorizontal:6,backgroundColor:'#243B55',borderRadius:10,marginRight:5,},
  alimTypeText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:16,color:'#fff'},
  alimDate: {},
  alimDateText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:15,color:'#888',},
  alimSubject: {marginTop:10,},
  alimSubjectText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e'},
  alimCont: {marginTop:6,},
  alimContText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:18,color:'#888'},

  notData: {paddingTop:50},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:13,color:'#666'},

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

//export default Alim
export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(Alim);