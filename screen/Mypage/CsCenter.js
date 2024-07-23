import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-community/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import APIs from "../../assets/APIs";
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import ImgDomain from '../../assets/common/ImgDomain';
import ImgDomain2 from '../../components/ImgDomain2';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const CsCenter = (props) => {
	const navigationUse = useNavigation();
	const {navigation, route} = props;
	const {params} = route  
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [noticeList, setNoticeList] = useState([]);  
	const [openIdx, setOpenIdx] = useState();
  const [memberIdx, setMemberIdx] = useState();
  const [memberInfo, setMemberInfo] = useState();

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

      if(params?.reload){        
        onRefresh();
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
		if(memberIdx){
			getInquery();
      getMemInfo();
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

  const getInquery = async () => {
    let sData = {      
      basePath: "/api/etc/",
			type: "GetInquiryList",
      member_idx: memberIdx,
		}
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			setNoticeList(response.data);
		}
  }

  const openCont = (idx) => {
    let updateAry = [...noticeList];
    const result = updateAry.findIndex((v) => v.inquiry_idx === idx);
    updateAry[result].is_chk = !(updateAry[result].is_chk);    
    setNoticeList(updateAry);
  }

  const getList = ({item, index}) => {
    let stateString = '';
    if(item.inquiry_status == 0){
      stateString = '문의 접수';
    }else if(item.inquiry_status == 1){
      stateString = '확인중';
    }else if(item.inquiry_status == 2){
      stateString = '답변 완료';
    }    

    return(
      <View style={[styles.guidePopContBox]}>
        <TouchableOpacity
          style={[styles.guidePopContBtn, item.open ? styles.guidePopContBtn2 : null, index == 0 ? styles.pdt10 : null]}
          activeOpacity={opacityVal}
          onPress={()=>{openCont(item.inquiry_idx)}}
        >
          <View style={{width:innerWidth-20}}>
            <View style={styles.guidePopContBtnTitle}>
              <View style={styles.ansState}>
                <Text style={styles.ansStateText}>{stateString}</Text>
              </View>
              <View style={styles.csTitle}>
                <Text style={styles.guidePopContBtnText}>{item.inquiry_subject}</Text>
              </View>
            </View>
            <View style={styles.guidePopContBtnDate}>
              <Text style={styles.guidePopContBtnDateText}>{item.ic_name} · {item.created_at}</Text>
            </View>
          </View>
          {item.is_chk ? (
            <ImgDomain fileWidth={10} fileName={'icon_arr4.png'}/>
          ) : (
            <ImgDomain fileWidth={10} fileName={'icon_arr3.png'}/>
          )}
        </TouchableOpacity>
        {item.is_chk ? (
          <>
          <View style={styles.csContent}>
            {item.file.length > 0 ? (
              item.file.map((item2, index2) => {
                return (
                  <View key={index2} style={styles.csContImg}>
                    <ImgDomain2 fileWidth={innerWidth} fileName={item2.if_file} />
                  </View>
                )
              })
            ) : null}
            <View style={styles.csContentView}>
              <Text style={styles.csContentViewText}>{item.inquiry_content}</Text>
            </View>
          </View>
          {item.inquiry_status == 2 ? (
          <View style={styles.guidePopCont2}>
            <View style={styles.ansTitle}>
              <Text style={styles.ansTitleText}>답변</Text>
            </View>
            <View style={styles.ansDatetime}>
              <Text style={styles.ansDatetimeText}>{item.updated_at}</Text>
            </View>
            <Text style={styles.guidePopCont2Text}>{item.inquiry_reply}</Text>
          </View>
          ) : null}
          </>
        ) : null}
      </View>
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
			getInquery();
		}
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'고객센터'}/>
      <View style={styles.csInfo}>
        <View style={styles.csInfoWrap}>
          <Text style={styles.csInfoText}>평일 10:00~17:00 (주말·공휴일 제외) 영업시간 내 순차적으로 답변드립니다.</Text>
        </View>
      </View>

      <FlatList 				
				style={styles.cmWrap}
				data={noticeList}
				renderItem={(getList)}
				keyExtractor={(item, index) => index.toString()}
				refreshing={refreshing}
				disableVirtualization={false}
				onScroll={onScroll}	
				onEndReachedThreshold={0.8}
				onEndReached={moreData}
				onRefresh={onRefresh}
				ListFooterComponent={<View style={{height:10,backgroundColor:'#fff'}}></View>}
				ListEmptyComponent={
					<View style={styles.notData}>
						<Text style={styles.notDataText}>등록된 게시물이 없습니다.</Text>
					</View>
				}
			/>

      <View style={styles.nextFix}>
        <TouchableOpacity 
					style={[styles.nextBtn]}
					activeOpacity={opacityVal}
					onPress={() => {            
            if(memberInfo?.member_type != 1){
              ToastMessage('앗! 정회원만 이용할 수 있어요🥲');
            }else{
              navigation.navigate('CsCenterWrite');
            }
          }}
				>
					<Text style={styles.nextBtnText}>1:1 문의 남기기</Text>
				</TouchableOpacity>
			</View>

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
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(0,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

  cmWrap: {paddingHorizontal:20,},
	guidePopContBox: {},
	guidePopContBtn: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',position:'relative',paddingVertical:20,borderBottomWidth:1,borderBottomColor:'#DBDBDB'},
	guidePopContBtn2: {/*borderBottomWidth:0,paddingBottom:11,*/},
	guidePopContBtnTitle: {flexDirection:'row',},
  ansState: {alignItems:'center',justifyContent:'center',paddingHorizontal:6,height:18,backgroundColor:'#243B55',borderRadius:10,},
  ansStateText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#fff'},
  csTitle: {width:innerWidth-90,paddingLeft:5,},
	guidePopContBtnText: {fontFamily:Font.NotoSansSemiBold,fontSize:14,lineHeight:18,color:'#1e1e1e',marginLeft:2,},
  guidePopContBtnDate: {marginTop:4,},
  guidePopContBtnDateText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#888'},
	guidePopCont2: {paddingVertical:10,paddingHorizontal:15,backgroundColor:'#F9FAFB',borderBottomWidth:1,borderBottomColor:'#DBDBDB',},
	guidePopCont2Text: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e',},

  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },

  csInfo: {paddingTop:20,paddingHorizontal:20,paddingBottom:10,},
  csInfoWrap: {padding:5,backgroundColor:'#EDF2FE',borderRadius:2,},
  csInfoText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#1e1e1e'},
  csContent: {paddingTop:20,paddingBottom:10,},
  csContImg: {borderRadius:5,marginBottom:15,overflow:'hidden'},
  csContentView: {},
  csContentViewText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e',},
  ansTitle: {},
  ansTitleText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#1e1e1e',},
  ansDatetime: {marginBottom:5,},
  ansDatetimeText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#888'},

  notData: {paddingTop:50},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:13,color:'#666'},

	red: {color:'#EE4245'},
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

export default CsCenter