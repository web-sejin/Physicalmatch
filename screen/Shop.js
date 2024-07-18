import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import {connect} from 'react-redux';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AsyncStorage from '@react-native-community/async-storage';
import RNIap, {
  initConnection, endConnection,
  getProducts, getSubscriptions, Product,
  requestPurchase, requestSubscription, 
  flushFailedPurchasesCachedAsPendingAndroid,
  clearProductsIOS, clearTransactionIOS, validateReceiptIos,getReceiptIOS,
  purchaseErrorListener, purchaseUpdatedListener, getAvailablePurchases,
  finishTransaction
} from 'react-native-iap';

import APIs from '../assets/APIs';
import Font from "../assets/common/Font";
import ToastMessage from "../components/ToastMessage";
import Header from '../components/Header';
import ImgDomain from '../assets/common/ImgDomain';
import ImgDomain2 from '../components/ImgDomain2';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const Shop = (props) => {  
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
  const [protainList, setProtainList] = useState([]);
  const [freeList, setFreeList] = useState([]);
  const [prdIdx, setPrdIdx] = useState();
  const [memberIdx, setMemberIdx] = useState();
  const [memberInfo, setMemberInfo] = useState();
  const [memberPoint, setMemberPoint] = useState();

	const [skuCode, setSkuCode] = useState();
	const [productApiList, setProductApiList] = useState([]);
  const [productInappList, setProductInappList] = useState([]);
  const [platformData, setPlatformData] = useState(null);

  let purchaseUpdateSubscription = null;
  let purchaseErrorSubscription = null;

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

      if(params){
        if(params.tab == 2){
          setLoading(true);
          change(params.tab);        
        }
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
    getProductListApi();
    getEventList();
  }, []);

	useEffect(()=>{    
    if(platformData){
      initConnection().then(async(result) => {
        //console.log('result :::: ', result);
        if(Platform.OS == 'android'){

          // Platform ANDROID
          flushFailedPurchasesCachedAsPendingAndroid()        
          .catch((err) => {
            console.log(err);
          })
          .then(() => {
            purchaseUpdateSubscription = purchaseUpdatedListener(async(purchase) => {
              console.log('purchaseUpdatedListener Android', purchase);
              const receipt = purchase.transactionReceipt;

              if(receipt){
                await finishTransaction({purchase, isConsumable: true})
                .catch((error) => {
                  console.log(error)
                })
              }
              setLoading(false);
            })
          })        

          purchaseErrorSubscription = purchaseErrorListener(async(error) => {
            console.log('purchaseErrorListener', error);
            let msg = '';
            if(error?.responseCode == -2){msg = '현재 기기의 플레이스토어 미지원'}
            if(error?.responseCode == -1){msg = '서비스 연결 해제'}
            if(error?.responseCode == 1){msg = '사용자 취소'}
            if(error?.responseCode == 2){msg = '서비스 이용 불가'}
            if(error?.responseCode == 3){msg = '사용자 결제 오류 : 기기 문제 혹은 플레이스토어 오류'}
            if(error?.responseCode == 4){msg = '사용 불가 상품'}
            if(error?.responseCode == 5){msg = '개발자 오류'}
            if(error?.responseCode == 6){msg = '구글플레이 내부 오류'}
            if(error?.responseCode == 7){msg = '이미 구입한 상품'}
            if(error?.responseCode == 8){msg = '구입 실패'}
            if(error?.responseCode == 12){msg = '네트워크 오류'}
            
            setLoading(false);
          })
          // Platform ANDROID END

        }else{

          // Platform IOS
          purchaseUpdateSubscription = purchaseUpdatedListener(async(purchase) => {
            //console.log('purchaseUpdatedListener IOS', purchase);
            const receipt = purchase.transactionReceipt;

            if(receipt){
              await finishTransaction({purchase, isConsumable: true})
              .catch((error) => {
                console.log(error)
              });

              await clearProductsIOS();
              await clearTransactionIOS();
              setLoading(false);
            }else{

            }
          });

          purchaseErrorSubscription = purchaseErrorListener(async(error) => {
            console.log('purchaseErrorListener', error);
            let msg = '';
            if(error?.responseCode == -2){msg = '현재 기기의 플레이스토어 미지원'}
            if(error?.responseCode == -1){msg = '서비스 연결 해제'}
            if(error?.responseCode == 1){msg = '사용자 취소'}
            if(error?.responseCode == 2){msg = '서비스 이용 불가'}
            if(error?.responseCode == 3){msg = '사용자 결제 오류 : 기기 문제 혹은 플레이스토어 오류'}
            if(error?.responseCode == 4){msg = '사용 불가 상품'}
            if(error?.responseCode == 5){msg = '개발자 오류'}
            if(error?.responseCode == 6){msg = '구글플레이 내부 오류'}
            if(error?.responseCode == 7){msg = '이미 구입한 상품'}
            if(error?.responseCode == 8){msg = '구입 실패'}
            if(error?.responseCode == 12){msg = '네트워크 오류'}

            await clearProductsIOS();
            await clearTransactionIOS();
            setLoading(false);
          });
          // Platform IOS END        

        }
        
        if(result){
          await _getProducts();
        }
      }).catch(error => {
        console.log('initConnection error', error)
      });

      return () => {
        //console.log('return unmount')
        if(purchaseUpdateSubscription){
            //console.log('return purchaseUpdateSubscription');
            purchaseUpdateSubscription.remove()
            purchaseUpdateSubscription = null
        }
        if(purchaseErrorSubscription){
            //console.log('return purchaseErrorSubscription');
            purchaseErrorSubscription.remove()
            purchaseErrorSubscription = null
        }
        endConnection()
      }
    }
  }, [platformData]);

  useEffect(() => {
    if(memberIdx){
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
    //console.log(response.data.member_point);
		if(response.code == 200){
      setMemberInfo(response.data);

      const protainComma = response.data.member_point.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      setMemberPoint(protainComma);
    }
  }

  const getMemberProtain = async () => {
    let sData = {
			basePath: "/api/member/",
			type: "GetMyPoint",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
    //console.log(response);
		if(response.code == 200){      
      const protainComma = response.data.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      setMemberPoint(protainComma);
    }
  }

  const getProductListApi = async () => {
    let sData = {
			basePath: "/api/etc/",
			type: "GetProductList",
      sort: 1,
		};

		const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200 && response.data){
      setProtainList(response.data);           
      
      if(Platform.OS === 'ios'){
        setSkuCode(response.data[0].pd_code_ios);
      }else{
        setSkuCode(response.data[0].pd_code_aos);
      }
      
      // 플랫폼에 따른 데이터 설정
      const values = {
        ios: response.ios, // iOS일 때 데이터
        android: response.aos, // Android일 때 데이터        
      };      

      // Platform.select 사용      
      const selectedValue = Platform.select(values);
      //console.log("selectedValue ::: ", selectedValue);
      setPlatformData(selectedValue);

    }else{
      setProductApiList([]);
    }
  }

  const getList = ({item, index}) => {
		return (
      <View style={[styles.listView, index == 0 ? styles.mgt40 : null]}>
        <View style={styles.listTitle}>
          <Text style={styles.listTitleText}>{item.subject}</Text>
        </View>
        <View style={styles.listSubTitle}>
          <Text style={styles.listSubTitleText}>{item.descrition}</Text>
        </View>

        <View style={styles.prdList}>
          {item.product.map((item2, index2) => {
            return (
              <TouchableOpacity
                key={index2}
                style={[styles.prdLi, index2 == 0 ? styles.mgt0 : null]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  setLoading(true);
                  if(Platform.OS === 'ios'){
                    _requestPurchase(item2.pd_code_ios, item2.pd_idx);
                  }else{
                    _requestPurchase(item2.pd_code_aos, item2.pd_idx);
                  }                  
                  setTimeout(() => { setLoading(false); }, 3000);
                }}
              >
                <ImgDomain2 fileWidth={innerWidth} fileName={item2.pi_img}/>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
	}

  const getList2 = ({item, index}) => {
		return (
      <View style={[styles.listView, index == 0 ? styles.mgt40 : null]}>
        <View style={styles.listTitle}>
          <Text style={styles.listTitleText}>{item.ev_subject}</Text>
        </View>

        <View style={[styles.prdList]}>
          <View style={[styles.freeLi]}>
            <ImgDomain2 fileWidth={innerWidth} fileName={item.ev_img}/>
            <View style={[styles.freeView, styles.boxShadow2]}>
              <TouchableOpacity
                style={[styles.freeBtn]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  navigation.navigate(item.ev_screen_name);
                }}
              >
                <ImgDomain fileWidth={16} fileName={'icon_money.png'}/>
                <View style={styles.freeBtnTextView}>
                  <Text style={styles.freeBtnText}>이벤트 참여하고 무료 프로틴 받기</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.freeCont}>
                <Text style={styles.freeContText}>{item.ev_content}</Text>
              </View>
              {item.ev_sub_content != '' ? (
              <View style={styles.freeSubCont}>
                <Text style={styles.freeSubContText}>{item.ev_sub_content}</Text>
              </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    )
	}

  const getEventList = async () => {
    let sData = {
			basePath: "/api/etc/",
			type: "GetEventList",
      sort: 1,
		};

		const response = await APIs.send(sData);    
    if(response.code == 200){
      setFreeList(response.data);
    }
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
			getProductListApi();
			setTimeout(() => {
				setRefreshing(false);
			}, 2000);
		}
	}

  const onScroll2 = (e) => {
		const {contentSize, layoutMeasurement, contentOffset} = e.nativeEvent;
		//console.log({contentSize, layoutMeasurement, contentOffset});
		//console.log(contentOffset.y);	
	};

	//리스트 무한 스크롤
	const moreData2 = async () => {

	}

	const onRefresh2 = () => {
		if(!refreshing) {
			setRefreshing(true);
			getEventList();
			setTimeout(() => {
				setRefreshing(false);
			}, 2000);
		}
	}

  const change = async (v) => {
    setTabSt(v);
    setLoading(false);
  }

  const itemSkus = platformData;

  const endConnection = () => {}

  const _getProducts = async () => {    
    try {
        const products = await getProducts({skus:itemSkus});
        //console.log('Products', products);

        if (products.length !== 0){
          setProductInappList(products);
        }
        console.log('_getProducts success');
    } catch (err){
        console.warn("IAP error code ", err.code);
        console.warn("IAP error message ", err.message);
        console.warn("IAP error ", err);
    }
  }

  const _requestPurchase = async (sku, pd_idx) => {
    //console.log("IAP req", sku);
    //setLoading2(true);
    let iapObj = {skus: [sku], sku: sku};
    let getItems = await getProducts(iapObj);
    //console.log('getItems :::: ', getItems);

    let amount = 0;
    if(pd_idx == 19){
      amount = 30;
    }else if(pd_idx == 20){
      amount = 100;
    }else if(pd_idx == 21){
      amount = 200;
    }else if(pd_idx == 22){
      amount = 500;
    }else if(pd_idx == 23){
      amount = 1000;
    }else if(pd_idx == 24){
      amount = 2000;
    }else if(pd_idx == 25){
      amount = 4500;
    }

    const inappPayResult = {
      basePath: "/api/order/",
      type: "SetProductOrder",		
      member_idx: memberIdx,
      pd_idx: prdIdx,
      pd_code: getItems[0].productId,
      pd_name: getItems[0].name,
      pd_price: getItems[0].price,
      pd_amount: amount,
    };

    try {
      await requestPurchase(iapObj)
      .then(async (result) => {
          //console.log('IAP req sub', result);
          if (Platform.OS === 'android'){
            //console.log('dataAndroid', result[0].dataAndroid);                    
            // can do your API call here to save the purchase details of particular user
            inappPayResult.biling_id = result[0].transactionId;
            inappPayResult.biling_token = result[0].purchaseToken;
            inappPayResult.biling_payment = 'card';            
            inappPayResult.paymented_at = result[0].transactionDate;
          } else if (Platform.OS === 'ios'){
            //console.log(result);
            //console.log(result.transactionReceipt);
            // can do your API call here to save the purchase details of particular user
            inappPayResult.biling_id = result.transactionId;
            inappPayResult.biling_token = result.transactionReceipt;
            inappPayResult.biling_payment = 'card';            
            inappPayResult.paymented_at = result.transactionDate;
          }

          //console.log("inappPayResult : ", inappPayResult);
          const response = await APIs.send(inappPayResult);
          //console.log(response);
          if(response.code == 200){
            getMemberProtain();
            ToastMessage('프로틴이 충전되었습니다.');
          }else{
            ToastMessage('잠시후 다시 이용해 주세요.');
          }
      })
      .catch((err) => {
        //setLoading2(false);
        console.log('err1', err);
      });
    } catch (err) {
      //setLoading2(false);
      console.log('err2', err.message);
    }
  }

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'상점'} />

      <View style={styles.viewTab}>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 1 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>change(1)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 1 ? styles.viewTabBtnTextOn : null]}>프로틴 샵</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewTabBtn, tabSt == 2 ? styles.viewTabBtnOn : null]}
          activeOpacity={opacityVal}
          onPress={()=>change(2)}
        >
          <Text style={[styles.viewTabBtnText, tabSt == 2 ? styles.viewTabBtnTextOn : null]}>무료 충전</Text>
        </TouchableOpacity>
      </View>      

      {tabSt == 1 ? (
        <FlatList        
          data={protainList}
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
              <View style={styles.currPoint}>
                <Text style={styles.currPointText1}>내 프로틴</Text>
                <Text style={styles.currPointText2}>{memberPoint}</Text>
              </View>

              <View style={styles.currPointPage}>
                <TouchableOpacity
                  style={styles.currPointBtn}
                  activeOpacity={opacityVal}
                  onPress={()=>{navigation.navigate('MyPoint')}}
                >
                  <Text style={styles.currPointBtnText}>이용 내역</Text>
                  <ImgDomain fileWidth={5} fileName={'icon_arr2.png'}/>
                </TouchableOpacity>
              </View>
            </>
          }
          ListFooterComponent={
            <View style={styles.prdFooter}>
              <View style={styles.footerTitle}>
                <Text style={styles.footerTitleText}>결제 및 환불 안내</Text>
              </View>
              <View style={styles.footerCont}>
                <Text style={styles.footerContText}>결제 및 환불 안내 내용이 표시됩니다.</Text>
              </View>

              <TouchableOpacity 
                style={[styles.nextBtn, styles.nextBtnOff]}
                activeOpacity={opacityVal}
                onPress={() => {navigation.navigate('CsCenter')}}
              >
                <Text style={styles.nextBtnText}>결제 및 환불 관련 문의</Text>
              </TouchableOpacity>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.notData}>
              <Text style={styles.notDataText}>등록된 상품이 없습니다.</Text>
            </View>
          }
        />
      ) : null}

      {tabSt == 2 ? (
        <FlatList        
          data={freeList}
          renderItem={(getList2)}
          keyExtractor={(item, index) => index.toString()}
          refreshing={refreshing}
          disableVirtualization={false}
          onScroll={onScroll2}	
          onEndReachedThreshold={0.8}
          onEndReached={moreData2}
          onRefresh={onRefresh2}
          ListHeaderComponent={
            <View style={styles.currPoint}>
              <Text style={styles.currPointText1}>내 프로틴</Text>
              <Text style={styles.currPointText2}>{memberPoint}</Text>
            </View>
          }
          ListFooterComponent={<View style={{height:50,backgroundColor:'#fff'}}></View>}
          ListEmptyComponent={
            <View style={styles.notData}>
              <Text style={styles.notDataText}>등록된 이벤트가 없습니다.</Text>
            </View>
          }
        />
      ) : null}

			{loading ? (
      <View style={[styles.indicator]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
      ) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },	
	gapBox: {height:80,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },		

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

  listView: {marginTop:40,},
  listTitle: {paddingHorizontal:20,},
  listTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:19,color:'#1e1e1e'},
  listSubTitle: {paddingHorizontal:20,marginTop:8,},
  listSubTitleText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#666'},
  prdList: {paddingHorizontal:20,paddingBottom:10,marginTop:20,},
  prdLi: {marginTop:10,},

  currPoint: {flexDirection:'row',alignItems:'center',paddingTop:30,paddingHorizontal:20,},
  currPointText1: {fontFamily:Font.NotoSansSemiBold,fontSize:22,lineHeight:25,color:'#1e1e1e'},
  currPointText2: {fontFamily:Font.NotoSansBold,fontSize:22,lineHeight:25,color:'#D1913C',marginLeft:5,},

  currPointPage: {flexDirection:'row',paddingHorizontal:20,marginTop:20,},
  currPointBtn: {flexDirection:'row',alignItems:'center',paddingHorizontal:15,height:37,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:50,},
	currPointBtnText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:15,color:'#1e1e1e',marginRight:8,position:'relative',top:2,},

  prdFooter: {paddingTop:25,paddingBottom:50,paddingHorizontal:20,backgroundColor:'#F9FAFB',marginTop:40,},
  footerTitle: {},
  footerTitleText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#888'},
  footerCont: {marginTop:4,marginBottom:40,},
  footerContText: {fontFamily:Font.NotoSansRegular,fontSize:10,lineHeight:17,color:'#888'},

  nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:52,color:'#fff'},

  freeLi: {},
  freeThumb: {borderTopLeftRadius:10,borderTopRightRadius:10,position:'relative',zIndex:10,},
  freeView: {backgroundColor:'#fff',paddingHorizontal:15,paddingTop:20,paddingBottom:25,borderBottomLeftRadius:10,borderBottomRightRadius:10,},
  freeBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',width:innerWidth-30,height:52,backgroundColor:'#141E30',borderRadius:5,},
  freeBtnTextView: {position:'relative',top:1.5,marginLeft:4,},
  freeBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#fff'},
  freeCont: {marginTop:20,},
  freeContText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:24,color:'#1e1e1e'},
  freeSubCont: {paddingTop:20,marginTop:30,borderTopWidth:1,borderTopColor:'#B8B8B8'},
  freeSubContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#888',},

  notData: {paddingTop:50},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:13,color:'#666'},

	red: {color:'#EE4245'},
	gray: {color:'#B8B8B8'},
	gray2: {color:'#DBDBDB'},

  boxShadow2: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
		elevation: 5,
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

export default Shop