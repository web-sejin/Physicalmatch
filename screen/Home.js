import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {ActivityIndicator, Alert, Button, BackHandler, Dimensions, ImageBackground, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
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

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

import APIs from "../assets/APIs"
import Font from "../assets/common/Font";
import ToastMessage from "../components/ToastMessage";
import ImgDomain from '../assets/common/ImgDomain';
import Card from '../components/Card';
import Card2 from '../components/Card2';
import Card3 from '../components/Card3';
import Card4 from '../components/Card4';

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const opacityVal2 = 0.95;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const Home = (props) => {			
	const navigationUse = useNavigation();
	const {navigation, userInfo, member_info, route} = props;
	const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [backPressCount, setBackPressCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [loading2, setLoading2] = useState(false);
	const [memberIdx, setMemberIdx] = useState();
	const [memberInfo, setMemberInfo] = useState();
	const [memberPoint, setMemberPoint] = useState();

	const [tabState, setTabState] = useState(1); //추천, 관심	
	const [tabState2, setTabState2] = useState(0); //관심[ 찜&교환, 호감, 매칭된 ]
	const [todayFree, setTodayFree] = useState();
	const [nonCollidingMultiSliderValue, setNonCollidingMultiSliderValue] = useState([]);
	const [nonCollidingMultiSliderValue2, setNonCollidingMultiSliderValue2] = useState([]);
	const [cardList, setCardList] = useState([]);	
	const [data1List, setData1List] = useState([]);
	const [data2List, setData2List] = useState([]);
	const [data3List, setData3List] = useState([]);
	const [data4List, setData4List] = useState([]);
	const [data5List, setData5List] = useState([]);
	const [data6List, setData6List] = useState([]);
	const [data7List, setData7List] = useState([]);
	const [data8List, setData8List] = useState([]);

	const [welcomePop, setWelcomePop] = useState(false);
	const [welcomePoint, setWelcomePoint] = useState();
	const [filterPop, setFilterPop] = useState(false);
	const [leavePop, setLeavePop] = useState(false);
	const [leaveMsg, setLeaveMsg] = useState('');
	const [addIntroPop, setAddIntroPop] = useState(false);
	const [unAddIntroPop1, setUnAddIntroPop1] = useState(false);
	const [unAddIntroPop2, setUnAddIntroPop2] = useState(false);
	const [cashPop, setCashPop] = useState(false);

	const [filterSave, setFilterSave] = useState(false);
	const [ageAry, setAgeAry] = useState([]);
	const [ageAryIdx, setAgeAryIdx] = useState([]);
	const [ageMinInt, setAgeMinInt] = useState();
	const [ageMaxInt, setAgeMaxInt] = useState();
	const [ageMax, setAgeMax] = useState();
	const [ageMin, setAgeMin] = useState();
	const [recentAccess, setRecentAccess] = useState();
	const [prdIdx, setPrdIdx] = useState(1);
	const [skuCode, setSkuCode] = useState();

	const [productApiList, setProductApiList] = useState([]);
  const [productInappList, setProductInappList] = useState([]);
  const [platformData, setPlatformData] = useState(null);

	//필터 임시 저장
	const [tempNonCollidingMultiSliderValue, setTempNonCollidingMultiSliderValue] = useState([]);
	const [tempNonCollidingMultiSliderValue2, setTempNonCollidingMultiSliderValue2] = useState([]);
	const [tempData, setTempData] = useState({
		tempAgeMins: '',
		tempAgeMaxs: '',
		tempAgeMin2s: '',
		tempAgeMax2s: '',
		tempRealAgeMins: '',
		tempRealAgeMaxs: '',
		tempRealAgeMin2s: '',
		tempRealAgeMax2s: '',
		tempDistanceStandards: '',
		tempDistances: '',
		tempDistance2s: '',
		tempRecentAccesss: '',
		tempGender: '',
		tempGender2: '',
	});

	const [realData, setRealData] = useState({
		tempAgeMins: '',
		tempAgeMaxs: '',
		tempAgeMin2s: '',
		tempAgeMax2s: '',
		tempRealAgeMins: '',
		tempRealAgeMaxs: '',
		tempRealAgeMin2s: '',
		tempRealAgeMax2s: '',
		tempDistanceStandards: '',
		tempDistances: '',
		tempDistance2s: '',
		tempRecentAccesss: '',
		tempRealGender: 0,
		tempRealGender2: 0,
	});

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			
		}else{			
			setRouteLoad(true);
			setPageSt(!pageSt);

			//console.log('userInfo :::: ', userInfo.is_new);

			AsyncStorage.getItem('member_idx', (err, result) => {		
				setMemberIdx(result);
			});

			getInterList();
			if(params?.reload){	
        getMemberInfo();
				getMemberProtain();
				getCardList();				
        delete params?.reload;
      }			
		}

		Keyboard.dismiss();
		Toast.hide();
		return () => isSubscribed = false;
	}, [isFocused]);

	useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
				//console.log(backPressCount);
        if (backPressCount === 0) {
          setBackPressCount(1);
          ToastAndroid.show('한 번 더 누르면 종료됩니다.', ToastAndroid.SHORT);
					
          setTimeout(() => {
            setBackPressCount(0);
          }, 2000); // 2초 내에 두 번 클릭을 기다림

          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [backPressCount])
  );

	useEffect(() => {		
		if(memberIdx){			
			setLoading(true);
			getMemberInfo();
			getMemberProtain();
			getCardList();
			getInterList();
		}
	}, [memberIdx]);

	useEffect(() => {
		if(memberInfo){
			getCardFilter();
		}
	}, [memberInfo]);

	useEffect(() => {
		getDateInfo();
	}, []);

	useEffect(() => {
    getProductListApi();		
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
		setLoading2(true);
		getInterList();
	}, [tabState2]);

	//리덕스 샘플
	// const testApi = async (idx) => {
	// 	const formData = new FormData();
	// 	formData.append('type', 'GetMyProfile');
	// 	formData.append('member_idx', 1);

	// 	const mem_info = await member_info(formData);

	// 	console.log('mem_info', mem_info);
	// 	console.log('userInfo', userInfo);
	// }

	// useEffect(() => {
	// 	//로그인 api가 성공했을 때 실행 시켜 리덕스에 담는다!!
	// 	//정보수정도 같은 원리!!
	// 	testApi(1);
	// }, [])

	const getMemberInfo = async () => {
		let sData = {
			basePath: "/api/member/",
			type: "GetMyInfo",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);		
		if(response.code == 200){
      setMemberInfo(response.data);
			setMemberPoint(response.data.member_point);
			if(response.data.member_first_popup == 'y'){
				setWelcomePop(true);
				if(response.regist_point >= 0){
					setWelcomePoint(response.regist_point);
				}
				checkWelcom();		
			}
			setTodayFree(response.data.free_cnt);								
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
      setMemberPoint(response.data);
    }
  }

	const getCardFilter = async () => {
		let sData = {
			basePath: "/api/match/",
			type: "GetMyCardCof",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);		
		//console.log(response);
    if(response.code == 200){
			const memberBirth = memberInfo?.member_age;

			//선호 카드 설정 시작
			let startAge = parseInt(memberBirth)-parseInt(response.data.ms_min_age);
			let endAge = parseInt(memberBirth)+parseInt(response.data.ms_max_age);

			let findeIndex = ageAry.indexOf(startAge);
			let findeIndex2 = ageAry.indexOf(endAge);

			if(findeIndex < 0){ 
				startAge = ageAry[(ageAry.length)-1];
				findeIndex = (ageAry.length)-1;
			}

			if(findeIndex2 < 0){ 
				endAge = ageAry[0];
				findeIndex2 = 0;
			}

			let yearString = startAge.toString().substr(2,2);
			let yearString2 = endAge.toString().substr(2,2);

			setNonCollidingMultiSliderValue([findeIndex2, findeIndex]);
			//선호 카드 설정 끝

			//내 카드 설정 시작
			let startAge2 = parseInt(memberBirth)-parseInt(response.data.ms_min_open_age);
			let endAge2 = parseInt(memberBirth)+parseInt(response.data.ms_max_open_age);

			let findeIndex3 = ageAry.indexOf(startAge2);
			let findeIndex4 = ageAry.indexOf(endAge2);

			if(findeIndex3 < 0){ 
				startAge2 = ageAry[(ageAry.length)-1];
				findeIndex3 = (ageAry.length)-1;
			}

			if(findeIndex4 < 0){ 
				endAge2 = ageAry[0];
				findeIndex4 = 0;
			}

			let yearString3 = startAge2.toString().substr(2,2);
			let yearString4 = endAge2.toString().substr(2,2);	

			setNonCollidingMultiSliderValue2([findeIndex4, findeIndex3]);
			//내 카드 설정 끝

			let distance = 20;
			if(response.data.ms_distance){
				distance = parseInt(response.data.ms_distance);
			}

			let distance2 = 20;
			if(response.data.ms_sub_distance){
				distance2 = parseInt(response.data.ms_sub_distance);
			}
			
			let loginedAt = 7;
			if(response.data.ms_logined_at){
				loginedAt = parseInt(response.data.ms_logined_at);
			}
			
			setRealData({
				tempAgeMins: yearString2.toString(),
				tempAgeMaxs: yearString.toString(),
				tempAgeMin2s: yearString4.toString(),
				tempAgeMax2s: yearString3.toString(),
				tempRealAgeMins: endAge.toString(),
				tempRealAgeMaxs: startAge.toString(),
				tempRealAgeMin2s: endAge2.toString(),
				tempRealAgeMax2s: startAge2.toString(),
				tempDistanceStandards: response.data.ms_distance_type,
				tempDistances: distance,
				tempDistance2s: distance2,
				tempRecentAccesss: loginedAt,
				tempRealGender: response.data.ms_sex,
				tempRealGender2: response.data.ms_open_sex,
			});
		}
	}

	const getCardList = async () => {
		let sData = {      
      basePath: "/api/match/",
			type: "GetDailyCard",
			member_idx: memberIdx,
		}
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			const newsTest = response.data.filter(el => el.length > 0);			
			setCardList(newsTest);
			setTimeout(function(){
				setLoading(false);
			}, 100)
		}
	}

	const getDateInfo = async () => {
		const date = new Date();
		const year = (date.getFullYear())-50;
		const year2 = (date.getFullYear())-20;

		let yaerAry = [];
		let yaerAryIdx = [];
		let cnt = 0;
		for(let i=year; i<=year2; i++){			
			yaerAry.unshift(i);
			yaerAryIdx.push(cnt);
			cnt++;
		}		
		
		setAgeMax(yaerAry[cnt-1]);
		setAgeMin(yaerAry[0]);

		setAgeAry(yaerAry);
		setAgeAryIdx(yaerAryIdx);
		setAgeMinInt(5);
		setAgeMaxInt(cnt-5);
	}	

	const getInterList = async () => {
		//console.log('getInterList !!!!!');
		let sData = {      
      basePath: "/api/match/",
			type: "GetInterestCard",
			member_idx: memberIdx,
			tab: tabState2
		}
		const response = await APIs.send(sData);		
		if(response.code == 200){
			if(tabState2 == 0){
				if(response.data[0].length > 0){setData1List(response.data[0]);}else{setData1List([]);}
				if(response.data[1].length > 0){setData2List(response.data[1]);}else{setData2List([]);}
				
			}else if(tabState2 == 1){
				//console.log(response.data);
				if(response.data[0].length > 0){setData3List(response.data[0]);}else{setData3List([]);}
				if(response.data[1].length > 0){setData4List(response.data[1]);}else{setData4List([]);}
				if(response.data[2].length > 0){setData5List(response.data[2]);}else{setData5List([]);}
				if(response.data[3].length > 0){setData6List(response.data[3]);}else{setData6List([]);}
				if(response.data[4].length > 0){setData7List(response.data[4]);}else{setData7List([]);}
			}else if(tabState2 == 2){
				if(response.data[0].length > 0){setData8List(response.data[0]);}else{setData8List([]);}				
			}
			
		}

		setTimeout(() => {
			setLoading2(false);
		}, 100);
	}

	const getProductListApi = async () => {
    let sData = {
			basePath: "/api/etc/",
			type: "GetProductList",
      sort: 0,
		};

		const response = await APIs.send(sData);
    //console.log(response);
    if(response.code == 200 && response.data){
      setProductApiList(response.data);     
      setPrdIdx(response.data[0].pd_idx);
      
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

	const getMatchCard = async(v) => {
		setTabState(v);
		//setLoading(true);
		if(v == 1){			
			getCardList();
		}else if(v == 2){			
			getInterList();
		}
	}

	const saveFilterSubmit = async () => {
		// console.log('a ::: ',realAgeMin-realAgeMax);
		// console.log('b ::: ',realAgeMin2-realAgeMax2);
		// console.log('realAgeMin ::: ',realAgeMin2);
		// console.log('realAgeMax ::: ',realAgeMax2);
		// if(realAgeMin-realAgeMax < 5 || realAgeMin2-realAgeMax2 < 5){
		// 	ToastMessage('나이는 5살 이상으로만 설정이 가능합니다.');
		// 	return false;
		// }
		if(realData.tempRealAgeMins-realData.tempRealAgeMaxs < 5 || realData.tempRealAgeMin2s-realData.tempRealAgeMax2s < 5){
			ToastMessage('나이는 5살 이상으로만 설정이 가능합니다.');
			return false;
		}

		const msMinAge = realData.tempRealAgeMins-(memberInfo?.member_age);
		const msMaxAge = (memberInfo?.member_age)-realData.tempRealAgeMaxs;
		const msMinOpenAge = realData.tempRealAgeMin2s-(memberInfo?.member_age);
		const msMaxOpenAge = (memberInfo?.member_age)-realData.tempRealAgeMax2s;

		let sData = {
			basePath: "/api/match/",
			type: "SetMyCardCof",
			member_idx: memberIdx,
			ms_min_age: msMaxAge,
			ms_max_age: msMinAge,
			ms_distance_type: realData.tempDistanceStandards,
			ms_distance: realData.tempDistances,			
			ms_logined_at: realData.tempRecentAccesss,
			ms_min_open_age: msMaxOpenAge,
			ms_max_open_age: msMinOpenAge,
			ms_sex: realData.tempRealGender,
			ms_open_sex: realData.tempRealGender2
		};

		if(memberInfo?.member_sub_local != ''){
			sData.ms_sub_distance = realData.tempDistance2s;
		}

		let msg = '';
		const response = await APIs.send(sData);
		//console.log(response);
		if(response.code == 200){
			msg = '필터가 수정되었습니다.';
			setFilterSave(true);
		}else{
			msg = '잠시후 다시 이용해 주세요.';
		}
				
		setFilterPop(false);	
		setTimeout(function(){
			ToastMessage(msg);
		}, 100);
	}

	const getProductList = ({item, index}) => {
    const priceComma = item.pd_price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    return (
      <TouchableOpacity
        style={[styles.productBtn, prdIdx==item.pd_idx ? styles.productBtnOn : null, styles.mgr10, productApiList.length == index+1 ? styles.mgr40 : null]}
        activeOpacity={opacityVal}
        onPress={()=>{
          setPrdIdx(item.pd_idx);
          if(Platform.OS === 'ios'){
            setSkuCode(item.pd_code_ios);
          }else{
            setSkuCode(item.pd_code_aos);
          }
        }}
      >
        <Text style={styles.productText1}>{item.pd_name}</Text>
        {item.pd_best == 'y' ? (
          <View style={[styles.productBest, styles.productBest2]}>
            <Text style={styles.productText2}>BEST</Text>
          </View>
        ) : (
          <View style={styles.productBest}></View>
        )}        
        <Text style={[styles.productText3, prdIdx==item.pd_idx ? styles.productText3On : null]}>개당 ￦{item.pd_content}</Text>
        <Text style={styles.productText4}>￦{priceComma}</Text>
      </TouchableOpacity>
    )
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
        //console.log('_getProducts success');
    } catch (err){
        console.warn("IAP error code ", err.code);
        console.warn("IAP error message ", err.message);
        console.warn("IAP error ", err);
    }
  }

  const _requestPurchase = async (sku) => {
    //console.log("IAP req", sku);
    let iapObj = {skus: [sku], sku: sku};
    let getItems = await getProducts(iapObj);
    //console.log('getItems :::: ', getItems);

		let amount = 0;
    if(prdIdx == 19){
      amount = 30;
    }else if(prdIdx == 20){
      amount = 100;
    }else if(prdIdx == 21){
      amount = 200;
    }else if(prdIdx == 22){
      amount = 500;
    }else if(prdIdx == 23){
      amount = 1000;
    }else if(prdIdx == 24){
      amount = 2000;
    }else if(prdIdx == 25){
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
        console.log('err1', err);
      });
    } catch (err) {      
      console.log('err2', err.message);
    }
  }

  const buyProduct = async () => {  
		setLoading2(true);
    setCashPop(false);
    _requestPurchase(skuCode);
		setTimeout(() => { setLoading2(false); }, 3000);
  }

	const nonCollidingMultiSliderValuesChange = (a,b) => {
		setNonCollidingMultiSliderValue([a,b]);
	}

	const nonCollidingMultiSliderValuesChange2 = (a,b) => {
		setNonCollidingMultiSliderValue2([a,b]);
	}

	const resetFilter = async () => {
		let sData = {
			basePath: "/api/match/",
			type: "ClearMyCardCof",
			member_idx: memberIdx,
		};

		const response = await APIs.send(sData);
		//console.log('resetFilter ::: ', response);
    if(response.code == 200){
			const memberBirth = memberInfo?.member_age;

			//선호 카드 설정 시작
			let startAge = parseInt(memberBirth)-parseInt(response.data.ms_min_age);
			let endAge = parseInt(memberBirth)+parseInt(response.data.ms_max_age);

			let findeIndex = ageAry.indexOf(startAge);
			let findeIndex2 = ageAry.indexOf(endAge);

			if(findeIndex < 0){ 
				startAge = ageAry[(ageAry.length)-1];
				findeIndex = (ageAry.length)-1;
			}

			if(findeIndex2 < 0){ 
				endAge = ageAry[0];
				findeIndex2 = 0;
			}

			let yearString = startAge.toString().substr(2,2);
			let yearString2 = endAge.toString().substr(2,2);						

			setNonCollidingMultiSliderValue([findeIndex2, findeIndex]);
			//선호 카드 설정 끝

			//내 카드 설정 시작
			let startAge2 = parseInt(memberBirth)-parseInt(response.data.ms_min_open_age);
			let endAge2 = parseInt(memberBirth)+parseInt(response.data.ms_max_open_age);

			let findeIndex3 = ageAry.indexOf(startAge2);
			let findeIndex4 = ageAry.indexOf(endAge2);

			if(findeIndex3 < 0){ 
				startAge2 = ageAry[(ageAry.length)-1];
				findeIndex3 = (ageAry.length)-1;
			}

			if(findeIndex4 < 0){ 
				endAge2 = ageAry[0];
				findeIndex4 = 0;
			}

			let yearString3 = startAge2.toString().substr(2,2);
			let yearString4 = endAge2.toString().substr(2,2);			

			setNonCollidingMultiSliderValue2([findeIndex4, findeIndex3]);
			//내 카드 설정 끝

			let distance = 20;
			if(response.data.ms_distance){
				distance = parseInt(response.data.ms_distance);
			}

			let distance2 = 20;
			if(response.data.ms_sub_distance){
				distance2 = parseInt(response.data.ms_sub_distance);
			}
			
			let loginedAt = 7;
			if(response.data.ms_logined_at){
				loginedAt = parseInt(response.data.ms_logined_at);
			}			
			
			setRealData({
				tempAgeMins: yearString2.toString(),
				tempAgeMaxs: yearString.toString(),
				tempAgeMin2s: yearString4.toString(),
				tempAgeMax2s: yearString3.toString(),
				tempRealAgeMins: endAge.toString(),
				tempRealAgeMaxs: startAge.toString(),
				tempRealAgeMin2s: endAge2.toString(),
				tempRealAgeMax2s: startAge2.toString(),
				tempDistanceStandards: response.data.ms_distance_type,
				tempDistances: distance,
				tempDistance2s: distance2,
				tempRecentAccesss: loginedAt,
				tempRealGender: 0,
				tempRealGender2: 0,
			});
		}
	}

	const offFilterPop = () => {
		setNonCollidingMultiSliderValue(tempNonCollidingMultiSliderValue);
		setNonCollidingMultiSliderValue2(tempNonCollidingMultiSliderValue2);
		setRealData({
			tempAgeMins: tempData.tempAgeMins,
			tempAgeMaxs: tempData.tempAgeMaxs,
			tempAgeMin2s: tempData.tempAgeMin2s,
			tempAgeMax2s: tempData.tempAgeMax2s,
			tempRealAgeMins: tempData.tempRealAgeMins,
			tempRealAgeMaxs: tempData.tempRealAgeMaxs,
			tempRealAgeMin2s: tempData.tempRealAgeMin2s,
			tempRealAgeMax2s: tempData.tempRealAgeMax2s,
			tempDistanceStandards: tempData.tempDistanceStandards,
			tempDistances: tempData.tempDistances,
			tempDistance2s: tempData.tempDistance2s,
			tempRecentAccesss: tempData.tempRecentAccesss,
			tempRealGender: tempData.tempGender,
			tempRealGender2: tempData.tempGender2,
		});

		setFilterPop(false);
	}

	const modalPopOn = (v) => {
		if(v == '1'){
			setLeaveMsg('계정을 비활성화 한 회원이에요');
		}else if(v == '2'){
			setLeaveMsg('카드를 비활성화 한 회원이에요');
		}else if(v == '3'){
			setLeaveMsg('탈퇴한 회원이에요');
		}else if(v == '4'){
			setLeaveMsg('차단된 회원이에요');
		}else if(v == '5'){
			setLeaveMsg('신고한 회원이에요');
		}else if(v == '6'){
			setLeaveMsg('카드를 비활성화한 회원이에요');
		}else if(v == '7'){
			setLeaveMsg('이미 지인이 된 회원이에요');
		}
		setLeavePop(true);
	}

	const modalPopOff = (v) => {
		setLeavePop(true);
	}

	const addCardList = async () => {
		//setLoading(true);		
		setAddIntroPop(false);
		let openType = 0;
		if(todayFree < 1){
			openType = 1;
		}else{
			openType = 0;
		}
		
		let sData = {
			basePath: "/api/match/",
			type: "SetDailyCard",
			member_idx: memberIdx,
			open_type: openType,
		};
		const response = await APIs.send(sData);		
		//console.log('addCardList ::: ', response);
		if(response.code == 200){
			if(response.add_yn == 'y'){
				getMemberProtain();
				const newsTest = response.data.filter(el => el.length > 0);			
				setCardList(newsTest);

				if(openType == 0){
					setTodayFree(todayFree - 1);
				}
			}else{
				//ageMax, ageMin, 500, 500, 28
				
				// const [realData, setRealData] = useState({
				// 	tempAgeMins: '',
				// 	tempAgeMaxs: '',
				// 	tempAgeMin2s: '',
				// 	tempAgeMax2s: '',
				// 	tempRealAgeMins: '',
				// 	tempRealAgeMaxs: '',
				// 	tempRealAgeMin2s: '',
				// 	tempRealAgeMax2s: '',
				// 	tempDistanceStandards: '',
				// 	tempDistances: '',
				// 	tempDistance2s: '',
				// 	tempRecentAccesss: '',
				// });
				//console.log('realData ::: ', realData);
				if(realData.tempDistanceStandards == 0 
						&& realData.tempRealAgeMins == ageMin 
						&& realData.tempRealAgeMaxs == ageMax
						&& realData.tempDistances == 500
						&& realData.tempRecentAccesss == 28
						&& realData.tempRealAgeMin2s == ageMin
						&& realData.tempRealAgeMax2s == ageMax
				){
					setUnAddIntroPop1(true);
				}else if(realData.tempDistanceStandards == 1
					&& realData.tempRealAgeMins == ageMin 
					&& realData.tempRealAgeMaxs == ageMax
					&& realData.tempDistance2s == 500
					&& realData.tempRecentAccesss == 28
					&& realData.tempRealAgeMin2s == ageMin
					&& realData.tempRealAgeMax2s == ageMax
				){
					setUnAddIntroPop1(true);
				}else{
					setUnAddIntroPop2(true);
				}
				
				// if(filterSave){
				// 	setUnAddIntroPop2(true);
				// }else{
				// 	setUnAddIntroPop1(true);
				// }
			}
		}		
		setTimeout(() => {
			setLoading(false);
		}, 200);
	}

	const checkWelcom = async () => {
		let sData = {
			basePath: "/api/etc/",
			type: "SetFirstPopup",
			member_idx: memberIdx,
		};
		const response = await APIs.send(sData);
		//console.log(response);
		setAddIntroPop(false);
	}
	
	const toastConfig2 = {
		custom_type: (internalState) => (
			<View
				style={{
					backgroundColor: '#000',
					borderRadius: 10,
					paddingVertical: 10,
					paddingHorizontal: 20,
					opacity: 0.8,
				}}
			>
				<Text
					style={{
						textAlign: 'center',
						color: '#FFFFFF',
						fontSize: 15,
						lineHeight: 22,
						fontFamily: Font.NotoSansRegular,
						letterSpacing: -0.38,
					}}
				>
					{internalState.text1}
				</Text>
			</View>
		),
  };	

	const moveAlimPage = async () => {
		//navigation.navigate('Alim', {alarm_type:userInfo?.alarm_type, prevStack:'Home'});
		navigation.navigate('Alim', {alarm_type:userInfo?.alarm_type});
	}

	const headerHeight = 48;
	const keyboardVerticalOffset = Platform.OS === "ios" ? headerHeight : 0;
	const behavior = Platform.OS === "ios" ? "padding" : "height";
	
	return (
		<SafeAreaView style={styles.safeAreaView}>

			<View style={styles.header}>
				<View style={styles.headerTop}>
					<View style={styles.headerTitle}>
						<Text style={styles.headerTitleText}>Matching</Text>
					</View>
					<View style={styles.headerLnb}>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								setTempNonCollidingMultiSliderValue(nonCollidingMultiSliderValue);
								setTempNonCollidingMultiSliderValue2(nonCollidingMultiSliderValue2);
								setTempData({
									tempAgeMins: realData.tempAgeMins,
									tempAgeMaxs: realData.tempAgeMaxs,
									tempAgeMin2s: realData.tempAgeMin2s,
									tempAgeMax2s: realData.tempAgeMax2s,
									tempRealAgeMins: realData.tempRealAgeMins,
									tempRealAgeMaxs: realData.tempRealAgeMaxs,
									tempRealAgeMin2s: realData.tempRealAgeMin2s,
									tempRealAgeMax2s: realData.tempRealAgeMax2s,
									tempDistanceStandards: realData.tempDistanceStandards,
									tempDistances: realData.tempDistances,
									tempDistance2s: realData.tempDistance2s,
									tempRecentAccesss: realData.tempRecentAccesss,
									tempGender: realData.tempRealGender,
									tempGender2: realData.tempRealGender2,
								});
								setFilterPop(true);
							}}
						>
							<ImgDomain fileWidth={24} fileName={'icon_option.png'} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {navigation.navigate('Shop')}}
						>
							<ImgDomain fileWidth={24} fileName={'icon_shop.png'} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => moveAlimPage()}
						>
							{userInfo?.is_new == 'y' ? (
								<ImgDomain fileWidth={24} fileName={'icon_alim_on.png'} />
							) : (
								<ImgDomain fileWidth={24} fileName={'icon_alim_off.png'} />
							)}							
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.headerBot}>
					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {getMatchCard(1)}}
					>
						<Text style={[styles.headerTabText, tabState == 1 ? styles.headerTabTextOn : null]}>추천카드</Text>
						{tabState == 1 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {getMatchCard(2)}}
					>
						<Text style={[styles.headerTabText, tabState == 2 ? styles.headerTabTextOn : null]}>관심카드</Text>
						{tabState == 2 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>
				</View>
			</View>

			{tabState == 2 ? (
			<View style={styles.state2Tab}>
				<TouchableOpacity
					style={styles.state2TabBtn}
					activeOpacity={opacityVal}
					onPress={()=>setTabState2(0)}
				>
					<Text style={[styles.state2TabBtnText, tabState2 == 0 ? styles.state2TabBtnTextOn : null]}>찜&교환한 카드</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.state2TabBtn}
					activeOpacity={opacityVal}
					onPress={()=>setTabState2(1)}
				>
					<Text style={[styles.state2TabBtnText, tabState2 == 1 ? styles.state2TabBtnTextOn : null]}>호감 카드</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.state2TabBtn}
					activeOpacity={opacityVal}
					onPress={()=>setTabState2(2)}
				>
					<Text style={[styles.state2TabBtnText, tabState2 == 2 ? styles.state2TabBtnTextOn : null]}>매칭된 카드</Text>
				</TouchableOpacity>
			</View>
			) : null}

			<ScrollView>
				<View style={[styles.cmWrap, tabState == 1 ? styles.cmWrap2 : null]}>
					{tabState == 1 && cardList.length > 0 ? (
					<View>
						<View style={styles.todayFreeArea}>
							<View style={[styles.todayFreeAreaWrap, styles.boxShadow]}>
								<LinearGradient
									colors={['#D1913C', '#FFD194', '#D1913C']}
									start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
									style={[styles.grediant]}
								>
									{todayFree > 0 ? (
										<TouchableOpacity
											style={[styles.todayFreeBtn]}
											activeOpacity={opacityVal}
											onPress={() => {
												// if(todayFree < 1){
												// 	ToastMessage('이미 모두 사용했습니다.');
												// 	return false;
												// }
												addCardList();												
											}}
										>
											<Text style={styles.todayFreeBtnText}>무료 소개 받기 ({todayFree}/2)</Text>
										</TouchableOpacity>
									) : (
										<TouchableOpacity
											style={[styles.todayFreeBtn]}
											activeOpacity={opacityVal}
											onPress={() => setAddIntroPop(true)}
										>
											<Text style={styles.todayFreeBtnText}>추가 소개 받기</Text>
										</TouchableOpacity>
									)}
								</LinearGradient>
							</View>							
						</View>

						<View style={[styles.newCardSection]}>							
							{cardList.map((item, index) => {								
								return (
									<View key={index} style={[styles.cardView, styles.cardView2]}>		
										{item.map((item2, index2) => {
											const dday = 7-parseInt(item2.diff_date);
											return (
												index2 == 0 ? (
												<View key={index2} style={styles.dday}>
													<View style={styles.ddayLine}></View>
													<Text style={styles.ddayText}>D-{dday}</Text>
												</View>
												) : null
											)
										})}


										{item.map((item2, index2) => {																							
											const job = item2.member_job+" "+item2.member_job_detail;
											let openState = false;
											if((index == 0 && (index2 == 0 || index2 == 1)) || item2.open_yn == 'y'){
												openState = true;
											}
											
											if(item2.available_yn == 'n' || item2.card_yn == 'n' || item2.delete_yn == 'y' || item2.block_yn == 'y' || item2.rel_yn == 'y'){
												openState = false;
											}
											return (													
												<View key={index2}>																								
													<Card 
														navigation={navigation}
														//key={index}											
														propsMemberIdx={item2.member_idx}
														propsJob={job}
														propsAge={item2.member_age}
														propsArea={item2.member_main_local}
														propsHeight={item2.member_height}
														propsWeight={item2.member_weight}
														propsOpen={openState}
														propsNick={item2.member_nick}
														propsBadgeCnt={item2.badge_cnt}														
														propsMrIdx={item2.mr_idx}
														propsAvailableState={item2.available_yn}
														propsCardState={item2.card_yn}
														propsDeleteState={item2.delete_yn}
														propsBlockState={item2.block_yn}
														propsReportState={item2.report_yn}
														propsRelState={item2.rel_yn}
														propsImg={item2.mpi_img}
														myMemberIdx={memberIdx}
														ModalEvent={modalPopOn}
													/>
												</View>
											)
										})}
									</View>									
								)														
							})}
						</View>	
					</View>
					) : null}
					{tabState == 1 && cardList.length < 1 ? (
						<View style={styles.notData}>
							<Text style={styles.notDataText}>내역이 없습니다.</Text>
						</View>
					) : null}

					{tabState == 2 ? (
					<View>
						{tabState2 == 0 ? (
						<View>			
							{/* 찜한 카드	*/}							
							<View style={styles.interestBox}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>찜한 카드</Text>
								</View>
								{data1List.length > 0 ? (
									loading2 ? (
										<View style={[styles.indicator3]}><ActivityIndicator size="large" color="#D1913C" /></View>
									) : (
										<View style={styles.cardView}>
											{data1List.map((item, index) => {	
												if(item.leave && !item.isFlipped){
													return (
														<TouchableOpacity 
															key={index}
															style={[styles.cardBtn, styles.cardBtn2]}
															activeOpacity={opacityVal2}
															onPress={() => {													
																setLeavePop(true);
															}}
														>
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
															</View>
														</TouchableOpacity>
													)
												}else{
													return (
														<Card3
															navigation={navigation}
															key={index}													
															propsNick={item.member_nick}
															propsAge={item.member_age}													
															propsHeight={item.member_height}											
															//propsFlip={item.isFlipped}
															viewOrder={index+1}
															myMemberIdx={memberIdx}
															propsMemberIdx={item.member_idx}
															propsAvailableState={item.available_yn}
															propsCardState={item.card_yn}
															propsDeleteState={item.delete_yn}
															propsBlockState={item.block_yn}
															propsImg={item.mpi_img}
															propsDday={item.diff_date}
															propsReportState={item.report_yn}
															ModalEvent={modalPopOn}
														/>
													)
												}
											})}
										</View>
									)
									
								) : (
									<View style={styles.notData}>
										<Text style={styles.notDataText}>내역이 없습니다.</Text>
									</View>
								)}								
							</View>
							

							{/* 교환한 프로필 */}							
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>교환한 프로필</Text>
								</View>
								{data2List.length > 0 ? (
									loading2 ? (
										<View style={[styles.indicator3]}><ActivityIndicator size="large" color="#D1913C" /></View>
									) : (
										<View style={styles.cardView}>
											{data2List.map((item, index) => {
												if(item.leave && !item.isFlipped){
													return (
														<TouchableOpacity 
															key={index}
															style={[styles.cardBtn, styles.cardBtn2]}
															activeOpacity={opacityVal2}
															onPress={() => {													
																setLeavePop(true);
															}}
														>
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
															</View>
														</TouchableOpacity>
													)
												}else{
													return (														
														<Card4
															navigation={navigation}
															key={index}													
															propsNick={item.member_nick}
															propsAge={item.member_age}													
															propsHeight={item.member_height}											
															//propsFlip={item.isFlipped}
															viewOrder={index+1}
															myMemberIdx={memberIdx}
															propsMemberIdx={item.member_idx}
															propsAvailableState={item.available_yn}
															propsCardState={item.card_yn}
															propsDeleteState={item.delete_yn}
															propsBlockState={item.block_yn}
															propsImg={item.mpi_img}
															propsDday={item.diff_date}
															propsReportState={item.report_yn}
															ModalEvent={modalPopOn}
														/>
													)
												}
											})}
										</View>
									)
								) : (
									<View style={styles.notData}>
										<Text style={styles.notDataText}>내역이 없습니다.</Text>
									</View>
								)}
							</View>							
						</View>
						) : null}

						{tabState2 == 1 ? (
						<View>				
							{/* 받은 좋아요 */}							
							<View style={styles.interestBox}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>받은 좋아요</Text>
								</View>
								{data3List.length > 0 ? (
									loading2 ? (
										<View style={[styles.indicator3]}><ActivityIndicator size="large" color="#D1913C" /></View>
									) : (
										<View style={styles.cardView}>
											{data3List.map((item, index) => {
												if(item.leave && !item.isFlipped){
													return (
														<TouchableOpacity 
															key={index}
															style={[styles.cardBtn, styles.cardBtn2]}
															activeOpacity={opacityVal2}
															onPress={() => {													
																setLeavePop(true);
															}}
														>
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
															</View>
														</TouchableOpacity>
													)
												}else{
													return (
														<Card3
															navigation={navigation}
															key={index}													
															propsNick={item.member_nick}
															propsAge={item.member_age}													
															propsHeight={item.member_height}											
															//propsFlip={item.isFlipped}
															viewOrder={index+1}
															myMemberIdx={memberIdx}
															propsMemberIdx={item.member_idx}
															propsAvailableState={item.available_yn}
															propsCardState={item.card_yn}
															propsDeleteState={item.delete_yn}
															propsBlockState={item.block_yn}
															propsImg={item.mpi_img}
															propsDday={item.diff_date}
															propsReportState={item.report_yn}
															ModalEvent={modalPopOn}
														/>
													)
												}
											})}
										</View>
									)
								) : (
									<View style={styles.notData}>
										<Text style={styles.notDataText}>내역이 없습니다.</Text>
									</View>
								)}
							</View>							
							
							{/* 보낸 좋아요 */}							
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>보낸 좋아요</Text>
								</View>
								{data4List.length > 0 ? (
									loading2 ? (
										<View style={[styles.indicator3]}><ActivityIndicator size="large" color="#D1913C" /></View>
									) : (
										<View style={styles.cardView}>
											{data4List.map((item, index) => {
												if(item.leave && !item.isFlipped){
													return (
														<TouchableOpacity 
															key={index}
															style={[styles.cardBtn, styles.cardBtn2]}
															activeOpacity={opacityVal2}
															onPress={() => {													
																setLeavePop(true);
															}}
														>
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
															</View>
														</TouchableOpacity>
													)
												}else{
													return (
														<Card3
															navigation={navigation}
															key={index}													
															propsNick={item.member_nick}
															propsAge={item.member_age}													
															propsHeight={item.member_height}											
															//propsFlip={item.isFlipped}
															viewOrder={index+1}
															myMemberIdx={memberIdx}
															propsMemberIdx={item.member_idx}
															propsAvailableState={item.available_yn}
															propsCardState={item.card_yn}
															propsDeleteState={item.delete_yn}
															propsBlockState={item.block_yn}
															propsImg={item.mpi_img}
															propsDday={item.diff_date}
															propsReportState={item.report_yn}
															ModalEvent={modalPopOn}
														/>
													)
												}
											})}
										</View>
									)
								) : (
									<View style={styles.notData}>
										<Text style={styles.notDataText}>내역이 없습니다.</Text>
									</View>
								)}
							</View>

							{/* 주고받은 호감 */}							
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>주고받은 호감</Text>
								</View>
								{data5List.length > 0 ? (
									loading2 ? (
										<View style={[styles.indicator3]}><ActivityIndicator size="large" color="#D1913C" /></View>
									) : (
										<View style={styles.cardView}>
											{data5List.map((item, index) => {
												if(item.leave && !item.isFlipped){
													return (
														<TouchableOpacity 
															key={index}
															style={[styles.cardBtn, styles.cardBtn2]}
															activeOpacity={opacityVal2}
															onPress={() => {													
																setLeavePop(true);
															}}
														>
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
															</View>
														</TouchableOpacity>
													)
												}else{
													return (
														<Card3
															navigation={navigation}
															key={index}													
															propsNick={item.member_nick}
															propsAge={item.member_age}													
															propsHeight={item.member_height}											
															//propsFlip={item.isFlipped}
															viewOrder={index+1}
															myMemberIdx={memberIdx}
															propsMemberIdx={item.member_idx}
															propsAvailableState={item.available_yn}
															propsCardState={item.card_yn}
															propsDeleteState={item.delete_yn}
															propsBlockState={item.block_yn}
															propsImg={item.mpi_img}
															propsDday={item.diff_date}
															propsReportState={item.report_yn}
															ModalEvent={modalPopOn}
														/>
													)
												}
											})}
										</View>
									)
								) : (
									<View style={styles.notData}>
										<Text style={styles.notDataText}>내역이 없습니다.</Text>
									</View>
								)}
							</View>

							{/* 받은 호감 */}							
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>받은 호감</Text>
								</View>
								{data6List.length > 0 ? (
									loading2 ? (
										<View style={[styles.indicator3]}><ActivityIndicator size="large" color="#D1913C" /></View>
									) : (
										<View style={styles.cardView}>
											{data6List.map((item, index) => {
												if(item.leave && !item.isFlipped){
													return (
														<TouchableOpacity 
															key={index}
															style={[styles.cardBtn, styles.cardBtn2]}
															activeOpacity={opacityVal2}
															onPress={() => {													
																setLeavePop(true);
															}}
														>
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
															</View>
														</TouchableOpacity>
													)
												}else{
													return (
														<Card3
															navigation={navigation}
															key={index}													
															propsNick={item.member_nick}
															propsAge={item.member_age}													
															propsHeight={item.member_height}											
															//propsFlip={item.isFlipped}
															viewOrder={index+1}
															myMemberIdx={memberIdx}
															propsMemberIdx={item.member_idx}
															propsAvailableState={item.available_yn}
															propsCardState={item.card_yn}
															propsDeleteState={item.delete_yn}
															propsBlockState={item.block_yn}
															propsImg={item.mpi_img}
															propsDday={item.diff_date}
															propsReportState={item.report_yn}
															ModalEvent={modalPopOn}
														/>
													)
												}
											})}
										</View>
									)
								) : (
									<View style={styles.notData}>
										<Text style={styles.notDataText}>내역이 없습니다.</Text>
									</View>
								)}
							</View>

							{/* 보낸 호감 */}							
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>보낸 호감</Text>
								</View>
								{data7List.length > 0 ? (
									loading2 ? (
										<View style={[styles.indicator3]}><ActivityIndicator size="large" color="#D1913C" /></View>
									) : (
										<View style={styles.cardView}>
											{data7List.map((item, index) => {
												if(item.leave && !item.isFlipped){
													return (
														<TouchableOpacity 
															key={index}
															style={[styles.cardBtn, styles.cardBtn2]}
															activeOpacity={opacityVal2}
															onPress={() => {													
																setLeavePop(true);
															}}
														>
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
															</View>
														</TouchableOpacity>
													)
												}else{
													return (
														<Card3
															navigation={navigation}
															key={index}													
															propsNick={item.member_nick}
															propsAge={item.member_age}													
															propsHeight={item.member_height}											
															//propsFlip={item.isFlipped}
															viewOrder={index+1}
															myMemberIdx={memberIdx}
															propsMemberIdx={item.member_idx}
															propsAvailableState={item.available_yn}
															propsCardState={item.card_yn}
															propsDeleteState={item.delete_yn}
															propsBlockState={item.block_yn}
															propsImg={item.mpi_img}
															propsDday={item.diff_date}
															propsReportState={item.report_yn}
															ModalEvent={modalPopOn}
														/>
													)
												}
											})}
										</View>
									)
								) : (
									<View style={styles.notData}>
										<Text style={styles.notDataText}>내역이 없습니다.</Text>
									</View>
								)}
							</View>
						</View>
						) : null}
						
						{tabState2 == 2 ? (
						<View>			
							{/* 매칭된 이성 */}							
							<View style={styles.interestBox}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>매칭된 이성</Text>
								</View>
								{data8List.length > 0 ? (
									loading2 ? (
										<View style={[styles.indicator3]}><ActivityIndicator size="large" color="#D1913C" /></View>
									) : (
										<>
										<View style={styles.interestBoxDesc}>
											<Text style={styles.interestBoxDescText}>매칭을 축하합니다!</Text>										
											<ImgDomain fileWidth={12} fileName={'icon_pang.png'} />
										</View>
										<View style={styles.cardView}>
											{data8List.map((item, index) => {
												if(item.leave && !item.isFlipped){
													return (
														<TouchableOpacity 
															key={index}
															style={[styles.cardBtn, styles.cardBtn2]}
															activeOpacity={opacityVal2}
															onPress={() => {													
																setLeavePop(true);
															}}
														>
															<View style={[styles.cardCont, styles.cardCont2]}>																												
																<ImgDomain fileWidth={(innerWidth/3)-7} fileName={'front2.png'} />
															</View>
														</TouchableOpacity>
													)
												}else{
													return (
														<Card3
															navigation={navigation}
															key={index}													
															propsNick={item.member_nick}
															propsAge={item.member_age}													
															propsHeight={item.member_height}											
															//propsFlip={item.isFlipped}
															viewOrder={index+1}
															myMemberIdx={memberIdx}
															propsMemberIdx={item.member_idx}
															propsAvailableState={item.available_yn}
															propsCardState={item.card_yn}
															propsDeleteState={item.delete_yn}
															propsBlockState={item.block_yn}
															propsImg={item.mpi_img}
															propsDday={item.diff_date}
															propsReportState={item.report_yn}
															ModalEvent={modalPopOn}
														/>
													)
												}
											})}
										</View>
										</>
									)
								) : (
									<View style={styles.notData}>
										<Text style={styles.notDataText}>내역이 없습니다.</Text>
									</View>
								)}
							</View>
						</View>
						) : null}
					</View>
					) : null}
				</View>
			</ScrollView>
			<View style={styles.gapBox}></View>			

			{/* 필터 */}
			<Modal
				visible={filterPop}
				animationType={"none"}
				onRequestClose={() => offFilterPop()}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.modalHeader}>					
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => offFilterPop()}						
					>							
						<ImgDomain fileWidth={8} fileName={'icon_header_back.png'} />
					</TouchableOpacity>		
					<TouchableOpacity 
						style={styles.filterResetBtn}
						activeOpacity={opacityVal}
						onPress={()=>resetFilter()}
					>
						<ImgDomain fileWidth={13} fileName={'icon_refresh.png'} />
						<Text style={styles.filterResetText}>초기화</Text>
					</TouchableOpacity>				
				</View>
				<ScrollView>
					<View style={[styles.cmWrap, styles.cmWrap2]}>
						<View style={styles.filterTitle}>
							<Text style={styles.filterTitleText}>선호 카드 설정</Text>
						</View>
						<View style={styles.filterDesc}>
							<Text style={styles.filterDescText}>나에게 소개 될 카드를 설정합니다.</Text>
						</View>
						<View style={[styles.msBox, styles.mgt30]}>
							<View style={[styles.msTitleBox, styles.mgb10]}>
								<Text style={styles.msTitleBoxText1}>나이</Text>
								<Text style={styles.msTitleBoxText2}>{realData.tempAgeMins}년생~{realData.tempAgeMaxs}년생+</Text>
							</View>
							<MultiSlider								
								selectedStyle={{
									height:2,
									backgroundColor: '#D1913C',
								}}
								unselectedStyle={{
									height:2,
									backgroundColor: '#DBDBDB',
								}}
								optionsArray={ageAryIdx}
								values={[
									nonCollidingMultiSliderValue[0],
									nonCollidingMultiSliderValue[1],
								]}
								markerOffsetY={1}
								sliderLength={innerWidth}								
								min={ageMaxInt}
								max={ageMinInt}
								step={1}
								enableLabel={false}
								enabledOne={true}
								enabledTwo={true}
								smoothSnapped={true}
								customMarker={() => (
									<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
								)}
								onValuesChange={(e) => {
									//console.log(e);
									const first = ageAry[e[0]];
									const last = ageAry[e[1]];
																		
									let yearString = first.toString();
									let yearString2 = last.toString();

									let yearString3 = yearString.substr(2,2);
									let yearString4 = yearString2.substr(2,2);
									
									let findeIndex = ageAry.indexOf(first);
									let findeIndex2 = ageAry.indexOf(last);


									setRealData(prevData => ({
										...prevData,
										tempAgeMins: yearString3,
										tempAgeMaxs: yearString4,
										tempRealAgeMins: yearString,
										tempRealAgeMaxs: yearString2,
									}));

									nonCollidingMultiSliderValuesChange(findeIndex, findeIndex2);
								}}
							/>
						</View>			
						<View style={[styles.msBox, styles.mgt20]}>
							<View style={[styles.msTitleBox, styles.mgb20]}>
								<Text style={styles.msTitleBoxText1}>성별</Text>
							</View>
							<View style={[styles.msTitleBox]}>
								<View style={styles.genderRadio}>
									<TouchableOpacity
										style={styles.genderBtn}
										activeOpacity={opacityVal}
										onPress={()=>{
											setRealData(prevData => ({
												...prevData,
												tempRealGender: 0,
											}));
										}}
									>
										{realData.tempRealGender == 0 ? (
											<ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
										) : (
											<ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
										)}
										<Text style={styles.genderBtnText}>모두</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.genderBtn}
										activeOpacity={opacityVal}
										onPress={()=>{
											setRealData(prevData => ({
												...prevData,
												tempRealGender: 1,
											}));
										}}
									>
										{realData.tempRealGender == 1 ? (
											<ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
										) : (
											<ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
										)}
										<Text style={styles.genderBtnText}>남자</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.genderBtn}
										activeOpacity={opacityVal}
										onPress={()=>{
											setRealData(prevData => ({
												...prevData,
												tempRealGender: 2,
											}));
										}}
									>
										{realData.tempRealGender == 2 ? (
											<ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
										) : (
											<ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
										)}
										<Text style={styles.genderBtnText}>여자</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>						
						<View style={[styles.msBox, styles.mgt30]}>
							<View style={[styles.msTitleBox, styles.mgb20]}>
								<Text style={styles.msTitleBoxText1}>거리</Text>
							</View>
							<View style={[styles.msTitleBox]}>
								<TouchableOpacity 
									style={styles.msCheckBox}
									activeOpacity={opacityVal}
									onPress={()=>{
										//setDistanceStandard(0)
										setRealData(prevData => ({
											...prevData,
											tempDistanceStandards: 0,
										}));
									}}
								>
									<View style={[styles.msCheckBoxCircle]}>
										{realData.tempDistanceStandards == 0 ? (
											<ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />	
										) : (
											<ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
										)}
									</View>
									
									<Text style={styles.msCheckBoxText}>주활동 지역 기준</Text>
								</TouchableOpacity>
								<Text style={styles.msTitleBoxText2}>{realData.tempDistances}km 이내</Text>
							</View>
							<MultiSlider								
								selectedStyle={{
									height:2,
									backgroundColor: '#D1913C',
								}}
								unselectedStyle={{
									height:2,
									backgroundColor: '#DBDBDB',
								}}
								optionsArray={[10, 15, 20, 25, 30, 50, 70, 100, 150, 200, 300, 500]}
								values={[parseInt(realData.tempDistances)]}
								markerOffsetY={1}
								sliderLength={innerWidth}
								enableTap={true}
								value={[0]}
								min={10}
								max={500}
								step={1}
								enableLabel={false}
								enabledOne={true}
								enabledTwo={false}
								allowOverlap={true}
								smoothSnapped={true}
								customMarker={() => (
									<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
								)}
								onValuesChange={(e) => {
									//console.log(e);
									//setDistance(e[0]);
									setRealData(prevData => ({
										...prevData,
										tempDistances: e[0],
									}));
								}}
							/>
						</View>
						{memberInfo?.member_sub_local != '' ? (
						<View style={[styles.msBox, styles.mgt30]}>
							<View style={[styles.msTitleBox]}>
								<TouchableOpacity 
									style={styles.msCheckBox}
									activeOpacity={opacityVal}
									onPress={()=>{
										//setDistanceStandard(1)
										setRealData(prevData => ({
											...prevData,
											tempDistanceStandards: 1,
										}));
									}}
								>
									<View style={[styles.msCheckBoxCircle]}>
										{realData.tempDistanceStandards == 1 ? (
											<ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />	
										) : (
											<ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />	
										)}
									</View>
									
									<Text style={styles.msCheckBoxText}>부활동 지역 기준</Text>
								</TouchableOpacity>
								<Text style={styles.msTitleBoxText2}>{realData.tempDistance2s}km 이내</Text>
							</View>
							<MultiSlider								
								selectedStyle={{
									height:2,
									backgroundColor: '#D1913C',
								}}
								unselectedStyle={{
									height:2,
									backgroundColor: '#DBDBDB',
								}}
								optionsArray={[10, 15, 20, 25, 30, 50, 70, 100, 150, 200, 300, 500]}
								values={[parseInt(realData.tempDistance2s)]}
								markerOffsetY={1}
								sliderLength={innerWidth}
								value={[0]}
								min={10}
								max={500}
								step={1}
								enableLabel={false}
								enabledOne={true}
								enabledTwo={false}
								allowOverlap={true}
								smoothSnapped={true}
								customMarker={() => (
									<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
								)}
								onValuesChange={(e) => {
									//console.log(e);
									//setDistance2(e[0]);
									setRealData(prevData => ({
										...prevData,
										tempDistance2s: e[0],
									}));
								}}
							/>
						</View>
						) : null}			
						<View style={[styles.msBox, styles.mgt30]}>
							<View style={[styles.msTitleBox, styles.mgb20]}>
								<Text style={styles.msTitleBoxText1}>최근 접속일 수</Text>
								<Text style={styles.msTitleBoxText2}>{realData.tempRecentAccesss}일 이내 접속자</Text>
							</View>
							<View style={styles.multiSliderCustom}>
								<View style={styles.multiSliderDotBack}>
									<View style={[styles.multiSliderDotBackOn, realData.tempRecentAccesss == 14 ? styles.w33p : null, realData.tempRecentAccesss == 21 ? styles.w66p : null, realData.tempRecentAccesss == 28 ? styles.w100p : null]}></View>
								</View>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow]}
									activeOpacity={1}
									onPress={()=>{
										//setRecentAccess(7)
										setRealData(prevData => ({
											...prevData,
											tempRecentAccesss: 7,
										}));
									}}
								>
								</TouchableOpacity>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow, realData.tempRecentAccesss < 14 ? styles.multiSliderDotOff : null]}
									activeOpacity={1}
									onPress={()=>{
										//setRecentAccess(14)
										setRealData(prevData => ({
											...prevData,
											tempRecentAccesss: 14,
										}));
									}}
								>									
								</TouchableOpacity>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow, realData.tempRecentAccesss < 21 ? styles.multiSliderDotOff : null]}
									activeOpacity={1}
									onPress={()=>{
										//setRecentAccess(21)
										setRealData(prevData => ({
											...prevData,
											tempRecentAccesss: 21,
										}));
									}}
								>									
								</TouchableOpacity>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow, realData.tempRecentAccesss < 28 ? styles.multiSliderDotOff : null]}
									activeOpacity={1}
									onPress={()=>{
										//setRecentAccess(28)
										setRealData(prevData => ({
											...prevData,
											tempRecentAccesss: 28,
										}));
									}}
								>									
								</TouchableOpacity>
							</View>
						</View>
					</View>
					<View style={styles.cmLine}></View>
					<View style={[styles.cmWrap]}>
						<View style={[styles.msBox]}>
							<View style={styles.filterTitle}>
								<Text style={styles.filterTitleText}>내 카드 설정</Text>
							</View>
							<View style={styles.filterDesc}>
								<Text style={styles.filterDescText}>내 카드가 소개 될 카드를 설정합니다.</Text>
							</View>
							<View style={[styles.msBox, styles.mgt30]}>
								<View style={[styles.msTitleBox, styles.mgb10]}>
									<Text style={styles.msTitleBoxText1}>나이</Text>									
									<Text style={styles.msTitleBoxText2}>{realData.tempAgeMin2s}년생~{realData.tempAgeMax2s}년생+</Text>
								</View>

								<MultiSlider								
									selectedStyle={{
										height:2,
										backgroundColor: '#D1913C',
									}}
									unselectedStyle={{
										height:2,
										backgroundColor: '#DBDBDB',
									}}
									optionsArray={ageAryIdx}
									values={[
										nonCollidingMultiSliderValue2[0],
										nonCollidingMultiSliderValue2[1],
									]}
									markerOffsetY={1}
									sliderLength={innerWidth}
									min={ageMinInt}
									max={ageMaxInt}
									step={1}
									enableLabel={false}
									enabledOne={true}
									enabledTwo={true}
									smoothSnapped={true}
									customMarker={() => (
										<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
									)}
									onValuesChange={(e) => {
										const first = ageAry[e[0]];
										const last = ageAry[e[1]];
										
										let yearString = first.toString();
										let yearString2 = last.toString();

										let yearString3 = yearString.substr(2,2);
										let yearString4 = yearString2.substr(2,2);

										let findeIndex = ageAry.indexOf(first);
										let findeIndex2 = ageAry.indexOf(last);

										setRealData(prevData => ({
											...prevData,
											tempAgeMin2s: yearString3,
											tempAgeMax2s: yearString4,
											tempRealAgeMin2s: yearString,
											tempRealAgeMax2s: yearString2,
										}));

										nonCollidingMultiSliderValuesChange2(findeIndex, findeIndex2);
									}}
								/>
							</View>
							<View style={[styles.msBox, styles.mgt20]}>
							<View style={[styles.msTitleBox, styles.mgb20]}>
								<Text style={styles.msTitleBoxText1}>성별</Text>
							</View>
							<View style={[styles.msTitleBox]}>
								<View style={styles.genderRadio}>
									<TouchableOpacity
										style={styles.genderBtn}
										activeOpacity={opacityVal}
										onPress={()=>{
											setRealData(prevData => ({
												...prevData,
												tempRealGender2: 0,
											}));
										}}
									>
										{realData.tempRealGender2 == 0 ? (
											<ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
										) : (
											<ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
										)}
										<Text style={styles.genderBtnText}>모두</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.genderBtn}
										activeOpacity={opacityVal}
										onPress={()=>{
											setRealData(prevData => ({
												...prevData,
												tempRealGender2: 1,
											}));
										}}
									>
										{realData.tempRealGender2 == 1 ? (
											<ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
										) : (
											<ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
										)}
										<Text style={styles.genderBtnText}>남자</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.genderBtn}
										activeOpacity={opacityVal}
										onPress={()=>{
											setRealData(prevData => ({
												...prevData,
												tempRealGender2: 2,
											}));
										}}
									>
										{realData.tempRealGender2 == 2 ? (
											<ImgDomain fileWidth={20} fileName={'icon_radio_on.png'} />
										) : (
											<ImgDomain fileWidth={20} fileName={'icon_radio_off.png'} />
										)}
										<Text style={styles.genderBtnText}>여자</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>		
						</View>
					</View>
				</ScrollView>
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={[styles.nextBtn]}
						activeOpacity={opacityVal}
						onPress={() => {saveFilterSubmit()}}
					>
						<Text style={styles.nextBtnText}>저장하기</Text>
					</TouchableOpacity>
				</View>

				<Toast config={toastConfig2} />
			</Modal>

			{/* 탈퇴 회원 알림 */}
			<Modal
				visible={leavePop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setLeavePop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setLeavePop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setLeavePop(false)}}
						>								
							<ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle, styles.popTitleFlex]}>							
							<View style={styles.popTitleFlexWrap}>
								<Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>{leaveMsg}</Text>
							</View>
							<ImgDomain fileWidth={18} fileName={'emiticon1.png'} />
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {setLeavePop(false)}}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* 추가 소개 알림 */}
			<Modal
				visible={addIntroPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setAddIntroPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setAddIntroPop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setAddIntroPop(false)}}
						>								
							<ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View style={[styles.popTitle]}>
							<Text style={styles.popTitleText}>추가 소개 받으시겠어요?</Text>							
						</View>
						<View style={styles.pointBox}>
							<ImgDomain fileWidth={24} fileName={'coin.png'} />
							<Text style={styles.pointBoxText}>5</Text>
						</View>						
						<View style={[styles.popBtnBox, styles.popBtnBoxFlex]}>
						<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2, styles.popBtnOff]}
								activeOpacity={opacityVal}
								onPress={() => {setAddIntroPop(false)}}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>아니오</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtn2]}
								activeOpacity={opacityVal}
								onPress={() => {									
									if(memberPoint < 5){
										setAddIntroPop(false);
										setCashPop(true);
									}else{
										addCardList();
									}									
								}}
							>
								<Text style={styles.popBtnText}>네</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* 포인트 구매 팝업 */}
			<Modal
				visible={cashPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setCashPop(false)}
			>
				<TouchableOpacity 
					style={[styles.popBack, styles.popBack2]} 
					activeOpacity={1} 
					onPress={()=>{setCashPop(false)}}
				>
				</TouchableOpacity>
				<View style={[styles.prvPopBot, styles.prvPopBot3]}>
					<View style={[styles.popTitle, styles.pdl20, styles.pdr20]}>
						<Text style={styles.popBotTitleText}>더 많은 인연을 만나보세요</Text>							
						<Text style={[styles.popBotTitleDesc]}>프로틴을 구매해 즉시 다음 인연을!</Text>
					</View>					
					<View style={styles.productList}>
						<FlatList
              data={productApiList}
              renderItem={getProductList}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true} // row instead of column
              // Add the 4 properties below for snapping
              snapToAlignment={"start"} 
              snapToInterval={(innerWidth/3)+3} // Adjust to your content width
              decelerationRate={"fast"}      
              style={{paddingLeft:20,}} 
              showsHorizontalScrollIndicator={false}
            />
					</View>
					<View style={[styles.popBtnBox, styles.pdl20, styles.pdr20]}>
						<TouchableOpacity 
							style={[styles.popBtn]}
							activeOpacity={opacityVal}
							onPress={() => buyProduct()}
						>
							<Text style={styles.popBtnText}>지금 구매하기</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.popBtn, styles.popBtnOff2]}
							activeOpacity={opacityVal}
							onPress={() => setCashPop(false)}
						>
							<Text style={[styles.popBtnText, styles.popBtnOffText]}>다음에 할게요</Text>
						</TouchableOpacity>						
					</View>
				</View>
			</Modal>

			{/* 소개 카드 없음 - 필터 미사용 */}
			<Modal
				visible={unAddIntroPop1}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setUnAddIntroPop1(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setUnAddIntroPop1(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setUnAddIntroPop1(false)}}
						>								
							<ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>더 이상 소개 받을 수 있는</Text>
						</View>
						<View style={[styles.popTitle, styles.popTitleFlex]}>							
							<View style={styles.popTitleFlexWrap}>
								<Text style={[styles.popTitleText, styles.popTitleFlexText]}>카드가 없어요</Text>
							</View>
							<ImgDomain fileWidth={18} fileName={'emiticon2.png'} />
						</View>
						<View>
							<Text style={[styles.popTitleDesc, styles.mgt0]}>새로운 회원이 들어올때까지 커뮤니티를 즐겨보세요!</Text>
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {
									setUnAddIntroPop1(false);
									navigation.navigate('Community');
								}}
							>
								<Text style={styles.popBtnText}>커뮤니티 바로가기</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[styles.popBtn, styles.popBtnOff2]}
								activeOpacity={opacityVal}
								onPress={() => {setUnAddIntroPop1(false)}}
							>
								<Text style={[styles.popBtnText, styles.popBtnOffText]}>다음에 할게요</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* 소개 카드 없음 - 필터 사용 */}
			<Modal
				visible={unAddIntroPop2}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setUnAddIntroPop2(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setUnAddIntroPop2(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setUnAddIntroPop2(false)}}
						>								
							<ImgDomain fileWidth={18} fileName={'popup_x.png'} />
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>더 이상 소개 받을 수 있는</Text>
						</View>
						<View style={[styles.popTitle, styles.popTitleFlex]}>							
							<View style={styles.popTitleFlexWrap}>
								<Text style={[styles.popTitleText]}>카드가 없어요</Text>
							</View>
							<ImgDomain fileWidth={14} fileName={'emiticon2.png'} />
						</View>
						<View>
							<Text style={[styles.popTitleDesc, styles.mgt0]}>추가 소개를 받고 싶다면 필터 범위를 넓혀보세요!</Text>
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => {
									setTempNonCollidingMultiSliderValue(nonCollidingMultiSliderValue);
									setTempNonCollidingMultiSliderValue2(nonCollidingMultiSliderValue2);
									setTempData({
										tempAgeMins: realData.tempAgeMins,
										tempAgeMaxs: realData.tempAgeMaxs,
										tempAgeMin2s: realData.tempAgeMin2s,
										tempAgeMax2s: realData.tempAgeMax2s,
										tempRealAgeMins: realData.tempRealAgeMins,
										tempRealAgeMaxs: realData.tempRealAgeMaxs,
										tempRealAgeMin2s: realData.tempRealAgeMin2s,
										tempRealAgeMax2s: realData.tempRealAgeMax2s,
										tempDistanceStandards: realData.tempDistanceStandards,
										tempDistances: realData.tempDistances,
										tempDistance2s: realData.tempDistance2s,
										tempRecentAccesss: realData.tempRecentAccesss
									});
									setUnAddIntroPop2(false);
									setFilterPop(true);
								}}
							>
								<Text style={styles.popBtnText}>필터 설정 바로가기</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* 회원가입 축하 */}
			<Modal
				visible={welcomePop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setWelcomePop(false)}
			>
				<TouchableOpacity 
					style={[styles.popBack, styles.popBack2]} 
					activeOpacity={1} 
					onPress={()=>setWelcomePop(false)}
				>
				</TouchableOpacity>
				<View style={[styles.prvPopBot2, styles.prvPopBot4]}>
					<ImageBackground source={{uri:'https://physicalmatch.co.kr/appImg/welcome.png'}} resizeMode="cover" >
						<View style={styles.prvPopBot2Wrap}>
							<View style={styles.prvPopBot2Title}>
								<View style={styles.prvPopBot2View}>
									<ImgDomain fileWidth={20} fileName={'icon_match_success.png'} />
									<View style={styles.prvPopBot2ViewIn}>
										<Text style={styles.prvPopBot2ViewText}>가입축하</Text>
									</View>
								</View>
								<View style={[styles.prvPopBot2View, styles.prvPopBot2View2]}>
									<ImgDomain fileWidth={24} fileName={'coin2.png'} />
									<View style={styles.prvPopBot2ViewIn}>
										<Text style={[styles.prvPopBot2ViewText, styles.prvPopBot2ViewText2]}>{welcomePoint}개</Text>
									</View>
								</View>
								<View style={styles.prvPopBot2View}>
									<View style={styles.prvPopBot2ViewIn}>
										<Text style={styles.prvPopBot2ViewText}>증정</Text>
									</View>
									<ImgDomain fileWidth={20} fileName={'icon_match_success.png'} />
								</View>
							</View>
							<View style={styles.prvPopBot2Desc}>
								<Text style={styles.prvPopBot2DescText}>하이엔드 소개팅 앱 피지컬 매치에서</Text>
								<Text style={styles.prvPopBot2DescText}>NO.1 육각형 회원들과 만나 보세요</Text>
							</View>
						</View>							
					</ImageBackground>
					{/* <AutoHeightImage width={widnowWidth} source={require('../assets/image/welcome.png')} resizeMethod='resize' /> */}
				</View>
			</Modal>

			{loading && tabState == 1 ? ( <View style={[styles.indicator]}><ActivityIndicator size="large" color="#D1913C" /></View> ) : null}      
			
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({	
	safeAreaView: { flex: 1, backgroundColor: '#fff' },
	gapBox: {height:86,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	
  indicator2: { backgroundColor:'rgba(0,0,0,0.5)'},
	indicator3: {paddingVertical:50,},

	header: {backgroundColor:'#141E30'},
	headerTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:20,paddingBottom:10,},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000',paddingLeft:20,},
	headerTitleText: {fontFamily:Font.RobotoMedium,fontSize:24,lineHeight:26,color:'#fff'},
	headerLnb: {flexDirection:'row',alignItems:'center',paddingRight:15,},
	headerLnbBtn: {marginLeft:6,paddingHorizontal:5,},
	headerBot: {flexDirection:'row',},
	headerTab: {width:widnowWidth/2,height:60,alignItems:'center',justifyContent:'center',position:'relative',paddingTop:10,},
	headerTabText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#fff'},
	headerTabTextOn: {fontFamily:Font.NotoSansBold,color:'#FFD194'},
	activeLine: {width:widnowWidth/2,height:4,backgroundColor:'#FFD194',position:'absolute',left:0,bottom:0,zIndex:10,},

	modalHeader: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},
	filterResetBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:20,height:48,backgroundColor:'#fff',position:'absolute',top:0,right:0,zIndex:10,},
	filterResetText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#1E1E1E',marginLeft:6,},

	filterTitle: {},
	filterTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:18,color:'#1e1e1e'},
	filterDesc: {marginTop:6,},
	filterDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#666'},
	msBox: {},
	msTitleBox: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	msTitleBoxText1: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#1e1e1e'},
	msTitleBoxText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#888',position:'relative',top:-1,},
	msCheckBox: {flexDirection:'row',alignItems:'center'},
	msCheckBoxCircle: {},
	msCheckBoxCircleOn: {},
	msCheckBoxCircleIn: {},
	msCheckBoxText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#1e1e1e',marginLeft:6,},

	grediant: {padding:1,borderRadius:5,},
	boxShadow: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
		elevation: 5,
	},
	boxShadow2: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
		elevation: 9,
	},

	todayFreeArea: {},	
	todayFreeAreaWrap: {backgroundColor:'#fff',borderRadius:5,},
	todayFreeBtn: {height:50,alignItems:'center',justifyContent:'center',backgroundColor:'#fff',borderRadius:5,},
	todayFreeBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#d1913c'},

	cmLine: {width:widnowHeight,height:6,backgroundColor:'#F2F4F6',},
	cmWrap: {paddingVertical:40,paddingHorizontal:20,},
	cmWrap2: {paddingTop:30,},
	cardView: {flexDirection: 'row',flexWrap: 'wrap'},
	cardView2: {justifyContent: 'space-between',},
	dday: {width:innerWidth,height:17,backgroundColor:'#fff',marginTop:30,flexDirection:'row',justifyContent:'center',position:'relative'},
	ddayLine: {width:innerWidth,height:1,backgroundColor:'#D1913C',position:'absolute',left:0,top:8,},
	ddayText: {width:40,height:17,textAlign:'center',backgroundColor:'#fff',position:'relative',zIndex:10,fontFamily:Font.RobotoRegular,fontSize:15,lineHeight:17,color:'#D1913C'},
	cardBtn: { width: ((widnowWidth / 2) - 30), marginTop: 20, position: 'relative' },		
	cardCont: {width: ((widnowWidth / 2) - 30), backgroundColor:'#fff', backfaceVisibility:'hidden', borderTopLeftRadius:80, borderTopRightRadius:80,},	
	cardFrontInfo: {width: ((widnowWidth / 2) - 30), position:'absolute', left:0, top:0, zIndex:10,},
	peopleImgBack: {opacity:0,},
	peopleImg: {position:'absolute', left:0, top:0, zIndex:9, borderTopLeftRadius:80, borderTopRightRadius:80,},
	cardFrontInfoCont: {width: ((widnowWidth / 2) - 30), backgroundColor:'#fff', position:'absolute', left:0, bottom:0, zIndex:10, padding:10, borderRadius:5,},
	cardFrontNick: {flexDirection:'row', alignItems:'center', justifyContent:'space-between'},
	cardFrontNickText: {width:(innerWidth/2)-61,fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:19,color:'#1e1e1e',},
	cardFrontJob: {marginVertical:6,},
	cardFrontJobText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:17,color:'#888',},
	cardFrontContBox: {flexDirection:'row',alignItems:'center'},
	cardFrontContText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:16,color:'#1e1e1e',},
	cardFrontContTextRoboto: {fontFamily:Font.RobotoRegular,fontSize:12,},
	cardFrontContLine: {width:1,height:8,backgroundColor:'#EDEDED',position:'relative',top:1,marginHorizontal:6,},

	cardBtn2: {width: ((innerWidth / 3) - 7)},
	cardCont2: {width: ((innerWidth / 3) - 7)},
	cardFrontInfo2: {width: ((innerWidth / 3) - 7),position:'absolute',left:0,top:0,opacity:1},
	cardFrontInfoCont2: {width: ((innerWidth / 3) - 7),padding:8,},
	cardFrontDday: {},
	cardFrontDdayText: {textAlign:'center',fontFamily:Font.RobotoBold,fontSize:16,lineHeight:17,color:'#1e1e1e'},
	cardFrontNick2: {marginTop:4,},
	cardFrontNickText2: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:10,lineHeight:12,color:'#1e1e1e'},
	cardFrontContBox2: {justifyContent:'center'},
	cardFrontContText2: {fontFamily:Font.RobotoRegular,color:'#888'},

	state2Tab: {flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#EDEDED'},
	state2TabBtn: {alignItems:'center',justifyContent:'center',width:widnowWidth/3,height:50,},
	state2TabBtnText: {fontFamily:Font.NotoSansMedium,fontSize:12,color:'#888'},
	state2TabBtnTextOn: {color:'#141E30'},

	interestBoxTitle: {},
	interestBoxTitleText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:22,color:'#1e1e1e',},
	interestBoxDesc: {flexDirection:'row',alignItems:'center',marginTop:4,},
	interestBoxDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#666',marginRight:2,},

	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight},
	popBack2: {backgroundColor:'rgba(0,0,0,0.7)',},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},	
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap'},
	popTitleFlexWrap: {position:'relative',},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:25,color:'#1E1E1E',},
  popTitleFlexText: {position:'relative',top:0.5,},	
	popTitleDesc: {width:innerWidth-40,textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#1e1e1e',marginTop:20,},
	emoticon: {},
	popIptBox: {paddingTop:10,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {marginTop:30,},
	popBtnBox2: {paddingHorizontal:20,paddingTop:30,paddingBottom:50,marginTop:0},
	popBtnBoxFlex: {flexDirection:'row',justifyContent:'space-between'},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtn2: {width:(innerWidth/2)-25,},
	popBtnOff: {backgroundColor:'#EDEDED',},
	popBtnOff2: {backgroundColor:'#fff',marginTop:10,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

	prvPopBot: {width:widnowWidth,paddingTop:40,paddingBottom:10,paddingHorizontal:20,backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,position:'absolute',bottom:0,},
	prvPopBot2: {width:widnowWidth,position:'absolute',bottom:0,},
	prvPopBot3: {paddingHorizontal:0,},
	prvPopBot4: {borderTopLeftRadius:20,borderTopRightRadius:20,overflow:'hidden'},
	popBotTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:20,color:'#1e1e1e',},
	popBotTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#666',marginTop:10,},

	prvPopBot2Wrap: {paddingTop:40,paddingBottom:285,paddingHorizontal:20,},
	prvPopBot2Title: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	prvPopBot2View: {flexDirection:'row',alignItems:'center',justifyContent:'center',},
	prvPopBot2View2: {marginHorizontal:8,},
	prvPopBot2ViewIn: {position:'relative',top:2,},
	prvPopBot2ViewText: {fontFamily:Font.NotoSansSemiBold,fontSize:20,lineHeight:23,color:'#fff'},
	prvPopBot2ViewText2: {color:'#FFD194'},
	prvPopBot2Desc: {alignItems:'center',justifyContent:'center',marginTop:20,},
	prvPopBot2DescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#fff'},
	
	multiSliderDot: {width:16,height:16,backgroundColor:'#fff',borderWidth:2,borderColor:'#D1913C',borderRadius:50,position:'relative',zIndex:10,},
	multiSliderDotOff: {borderWidth:0,backgroundColor:'#F8F9FA'},

	multiSliderCustom: {flexDirection:'row',justifyContent:'space-between',position:'relative'},
	multiSliderDotBack: {width:innerWidth,height:2,backgroundColor:'#DBDBDB',position:'absolute',left:0,top:7,},
	multiSliderDotBackOn: {width:0,height:2,backgroundColor:'#D1913C',},

	nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 50, color: '#fff' },

	pointBox: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	pointBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#D1913C',marginLeft:6},

	productList: {flexDirection:'row',justifyContent:'space-between'},
	productBtn: {width:(innerWidth/3)-7,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,paddingVertical:25,paddingHorizontal:10,},
	productBtnOn: {backgroundColor:'rgba(209,145,60,0.15)',borderColor:'#D1913C'},
	productText1: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:22,color:'#1e1e1e'},
	productBest: {height:20,paddingHorizontal:8,borderRadius:20,marginTop:5,},
	productBest2: {backgroundColor:'#FFBF1A',},
	productText2: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:18,color:'#fff'},
	productText3: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#666',marginTop:3,},
	productText3On: {color:'#1e1e1e'},
	productText4: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:5,},

	accImg: {alignItems:'center',justifyContent:'center',width:widnowWidth,height:180,backgroundColor:'#F2F4F6',position:'relative'},
	accCircle: {alignItems:'center',justifyContent:'center',width:80,height:80,borderWidth:2,borderColor:'#EDEDED',borderRadius:50,overflow:'hidden',position:'absolute',bottom:-40},
	accInfo: {paddingTop:55,paddingBottom:10,paddingHorizontal:20,},
	accInfoNick: {},
	accInfoNickText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:18,lineHeight:21,color:'#1e1e1e'},
	accInfoTitle: {marginTop:50,marginBottom:15,},
	accInfoTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#666'},
	accInfoDesc: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	accInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:16,lineHeight:28,color:'#666'},

	notData: {paddingTop:30},
	notDataText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:13,color:'#666'},

	genderRadio: {flexDirection:'row',gap:30,},
	genderBtn: {flexDirection:'row',alignItems:'center',},
	genderBtnText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:16,color:'#1e1e1e',marginLeft:6,},

	boxShadow: {
		shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0.5,
		elevation: 2,
	},
	
	displayNone: {display:'none'},
	pdl20: {paddingLeft:20},
  pdr20: {paddingRight:20},
	mgt0: {marginTop:0,},
	mgt2: {marginTop:2,},
	mgt4: {marginTop:4,},
	mgt6: {marginTop:6,},
	mgt10: {marginTop:10,},
	mgt20: {marginTop:20,},
	mgt30: {marginTop:30,},
	mgt50: {marginTop:50,},
	mgt60: {marginTop:60,},
	mgb0: {marginBottom:0,},
	mgb10: {marginBottom:10,},
	mgb20: {marginBottom:20,},
	mgb25: {marginBottom:25,},
	mgr0: {marginRight:0},
  mgr10: {marginRight:10},
  mgr15: {marginRight:15},
  mgr20: {marginRight:20},
  mgr30: {marginRight:30},
  mgr40: {marginRight:40},
	mgl0: {marginLeft:0},
  mgl10: {marginLeft:10},
  mgl15: {marginLeft:15},

	w33p: {width:innerWidth*0.33},
	w66p: {width:innerWidth*0.66},
	w100p: {width:innerWidth},
})

export default connect(
	({ User }) => ({
		userInfo: User.userInfo, //회원정보
	}),
	(dispatch) => ({
		member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
	})
)(Home);