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

const stBarHt = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;
const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const innerHeight = widnowHeight - 40 - stBarHt;
const opacityVal = 0.8;
const opacityVal2 = 0.95;
const LabelTop = Platform.OS === "ios" ? 1.5 : 0;

const Home = (props) => {
	const cardData = [
		{ 'idx': 1, 'isFlipped':false, 'name':'닉네임최대여덟1', 'job':'CEO', 'age':'99', 'area':'서울 강남구', 'height':180, 'weight':70, 'badgeCnt':4, 'img':'man.png', 'dday':7, 'open':true },
		{ 'idx': 2, 'isFlipped':false, 'name':'닉네임최대여덟1', 'job':'디자이너', 'age':'00', 'area':'경기 부천시', 'height':181, 'weight':71, 'badgeCnt':3, 'img':'woman.png', 'dday':7, 'open':true },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟1', 'job':'요리사', 'age':'01', 'area':'전남 곡성군', 'height':182, 'weight':72, 'badgeCnt':2, 'img':'man.png', 'dday':7, 'open':false },
		{ 'idx': 4, 'isFlipped':false, 'name':'닉네임최대여덟1', 'job':'변호사', 'age':'02', 'area':'서울 용산구', 'height':183, 'weight':73, 'badgeCnt':1, 'img':'woman.png', 'dday':7, 'open':false },
		{ 'idx': 5, 'isFlipped':false, 'name':'닉네임최대여덟2', 'job':'CEO', 'age':'99', 'area':'서울 강남구', 'height':180, 'weight':70, 'badgeCnt':4, 'img':'man.png', 'dday':6, 'open':false },
		{ 'idx': 6, 'isFlipped':false, 'name':'닉네임최대여덟2', 'job':'디자이너', 'age':'00', 'area':'경기 부천시', 'height':181, 'weight':71, 'badgeCnt':3, 'img':'woman.png', 'dday':6, 'open':false },
		{ 'idx': 7, 'isFlipped':false, 'name':'닉네임최대여덟2', 'job':'요리사', 'age':'01', 'area':'전남 곡성군', 'height':182, 'weight':72, 'badgeCnt':2, 'img':'man.png', 'dday':6, 'open':false },
		{ 'idx': 8, 'isFlipped':false, 'name':'닉네임최대여덟2', 'job':'변호사', 'age':'02', 'area':'서울 용산구', 'height':183, 'weight':73, 'badgeCnt':1, 'img':'woman.png', 'dday':6, 'open':false },
		{ 'idx': 9, 'isFlipped':false, 'name':'닉네임최대여덟3', 'job':'CEO', 'age':'99', 'area':'서울 강남구', 'height':180, 'weight':70, 'badgeCnt':4, 'img':'man.png', 'dday':5, 'open':false },
		{ 'idx': 10, 'isFlipped':false, 'name':'닉네임최대여덟3', 'job':'디자이너', 'age':'00', 'area':'경기 부천시', 'height':181, 'weight':71, 'badgeCnt':3, 'img':'woman.png', 'dday':5, 'open':false },
		{ 'idx': 11, 'isFlipped':false, 'name':'닉네임최대여덟3', 'job':'요리사', 'age':'01', 'area':'전남 곡성군', 'height':182, 'weight':72, 'badgeCnt':2, 'img':'man.png', 'dday':5, 'open':false },
		{ 'idx': 12, 'isFlipped':false, 'name':'닉네임최대여덟3', 'job':'변호사', 'age':'02', 'area':'서울 용산구', 'height':183, 'weight':73, 'badgeCnt':1, 'img':'woman.png', 'dday':5, 'open':false },
	];

	const Data1 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];

	const Data2 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
		{ 'idx': 4, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 5, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 6, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },	
	];

	const Data3 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];

	const Data4 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];
	
	const Data5 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];

	const Data6 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];

	const Data7 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },				
	];

	const Data8 = [
		{ 'idx': 1, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 2, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 3, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
		{ 'idx': 4, 'isFlipped':true, 'name':'닉네임최대여덟1', 'age':'99', 'height':160, 'img':'man.png', 'dday':7, 'leave':false },
		{ 'idx': 5, 'isFlipped':true, 'name':'닉네임최대여덟2', 'age':'00', 'height':165, 'img':'woman.png', 'dday':6, 'leave':false },
		{ 'idx': 6, 'isFlipped':false, 'name':'닉네임최대여덟3', 'age':'01', 'height':162, 'img':'man.png', 'dday':4, 'leave':true },		
	];

	let timeOut;
	
	const navigationUse = useNavigation();
	const {navigation, userInfo, member_info, route} = props;
	const {params} = route;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [backPressCount, setBackPressCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [loading2, setLoading2] = useState(false);

	const [tabState, setTabState] = useState(1); //추천, 관심	
	const [tabState2, setTabState2] = useState(1); //관심[ 찜&교환, 호감, 매칭된 ]
	const [todayFree, setTodayFree] = useState(2);
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
	const [filterPop, setFilterPop] = useState(false);
	const [leavePop, setLeavePop] = useState(false);
	const [addIntroPop, setAddIntroPop] = useState(false);
	const [unAddIntroPop1, setUnAddIntroPop1] = useState(false);
	const [unAddIntroPop2, setUnAddIntroPop2] = useState(false);
	const [cashPop, setCashPop] = useState(false);

	const [filterSave, setFilterSave] = useState(false);
	const [ageAry, setAgeAry] = useState([]);
	const [ageAryIdx, setAgeAryIdx] = useState([]);
	const [ageMinInt, setAgeMinInt] = useState();
	const [ageMaxInt, setAgeMaxInt] = useState();
	const [ageMin, setAgeMin] = useState('');
	const [ageMax, setAgeMax] = useState('');
	const [ageMin2, setAgeMin2] = useState('');
	const [ageMax2, setAgeMax2] = useState('');
	const [realAgeMin, setRealAgeMin] = useState('');
	const [realAgeMax, setRealAgeMax] = useState('');
	const [realAgeMin2, setRealAgeMin2] = useState('');
	const [realAgeMax2, setRealAgeMax2] = useState('');
	const [distanceStandard, setDistanceStandard] = useState(1);
	const [distance, setDistance] = useState(50);
	const [distance2, setDistance2] = useState(50);
	const [recentAccess, setRecentAccess] = useState(7);
	const [prdIdx, setPrdIdx] = useState(1);
	const [skuCode, setSkuCode] = useState();

	const [productApiList, setProductApiList] = useState([]);
  const [productInappList, setProductInappList] = useState([]);
  const [platformData, setPlatformData] = useState(null);

	//필터 임시 저장
	const [tempAgeMin, setTempAgeMin] = useState('');
	const [tempAgeMax, setTempAgeMax] = useState('');
	const [tempAgeMin2, setTempAgeMin2] = useState('');
	const [tempAgeMax2, setTempAgeMax2] = useState('');
	const [tempNonCollidingMultiSliderValue, setTempNonCollidingMultiSliderValue] = useState([]);
	const [tempNonCollidingMultiSliderValue2, setTempNonCollidingMultiSliderValue2] = useState([]);
	const [tempRealAgeMin, setTempRealAgeMin] = useState('');
	const [tempRealAgeMax, setTempRealAgeMax] = useState('');
	const [tempRealAgeMin2, setTempRealAgeMin2] = useState('');
	const [tempRealAgeMax2, setTempRealAgeMax2] = useState('');
	const [tempDistanceStandard, setTempDistanceStandard] = useState();
	const [tempDistance, setTempDistance] = useState();
	const [tempDistance2, setTempDistance2] = useState();
	const [tempRecentAccess, setTempRecentAccess] = useState();

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			
		}else{			
			setRouteLoad(true);
			setPageSt(!pageSt);

			//console.log('userInfo ::: ', userInfo);
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
		setLoading(true);		
		setTimeout(() => {
			setCardList(cardData);
			setLoading(false);
		}, 300);
	}, []);

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
		setAgeAry(yaerAry);
		setAgeAryIdx(yaerAryIdx);

		const yearVal = year+4;
		const yearVal2 = year2-5;
		
		let yearString = yearVal.toString();
		setRealAgeMax(yearString);
		setRealAgeMax2(yearString);
		yearString = yearString.substr(2,2);		

		let yearString2 = yearVal2.toString();
		setRealAgeMin(yearString2);
		setRealAgeMin2(yearString2);
		yearString2 = yearString2.substr(2,2);
		
		setAgeMin((yearString2).toString());
		setAgeMax((yearString).toString());
		setAgeMin2((yearString2).toString());
		setAgeMax2((yearString).toString());
		setAgeMinInt(5);
		setAgeMaxInt(cnt-5);
		setNonCollidingMultiSliderValue([5, cnt-5]);
		setNonCollidingMultiSliderValue2([5, cnt-5]);
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
		setLoading(true);
		if(v == 1){			
			setTimeout(() => {
				setCardList(cardData);
				setLoading(false);
			}, 300);

		}else if(v == 2){			
			setTimeout(() => {							
				if(tabState2 == 1){
					setData1List(Data1);
					setData2List(Data2);
				}else if(tabState2 == 2){
					setData3List(Data3);
					setData4List(Data4);
					setData5List(Data5);
					setData5List(Data6);
					setData5List(Data7);
				}else if(tabState2 == 3){
					setData8List(Data8);
				}
				setLoading(false);
			}, 300);
		}
	}

	const getInterest = async (v) => {
		setTabState2(v);
		setLoading(true);
		setTimeout(() => {							
			if(v == 1){
				setData1List(Data1);
				setData2List(Data2);
			}else if(v == 2){
				setData3List(Data3);
				setData4List(Data4);
				setData5List(Data5);
				setData5List(Data6);
				setData5List(Data7);
			}else if(v == 3){
				setData8List(Data8);
			}
			setLoading(false);
		}, 300);
		
		
	}

	const saveFilterSubmit = async () => {
		// console.log('a ::: ',realAgeMin-realAgeMax);
		// console.log('b ::: ',realAgeMin2-realAgeMax2);
		if(realAgeMin-realAgeMax < 5 || realAgeMin2-realAgeMax2 < 5){
			ToastMessage('나이는 5살 이상으로만 설정이 가능합니다.');
			return false;
		}
		
		setFilterPop(false);
		setFilterSave(true);
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
        console.log('_getProducts success');
    } catch (err){
        console.warn("IAP error code ", err.code);
        console.warn("IAP error message ", err.message);
        console.warn("IAP error ", err);
    }
  }

  const _requestPurchase = async (sku) => {
    //console.log("IAP req", sku);
    //setLoading2(true);
    let iapObj = {skus: [sku], sku: sku};
    let getItems = await getProducts(iapObj);
    console.log('getItems :::: ', getItems);
    try {
      await requestPurchase(iapObj)
      .then(async (result) => {
          //console.log('IAP req sub', result);
          if (Platform.OS === 'android'){
            console.log('dataAndroid', result[0].dataAndroid);
            // console.log("purchaseToken : ", result.purchaseToken);
            // console.log("packageNameAndroid : ", result.packageNameAndroid);
            // console.log("productId : ", result.productId);
            console.log("성공");
            // let inappPayResult =JSON.stringify({
            //     type: "inappResult",
            //     code: result.productId,
            //     tno: result.transactionId,
            //     token: result.purchaseToken,
            // });
            // console.log("inappPayResult : ", inappPayResult);            
            // can do your API call here to save the purchase details of particular user
          } else if (Platform.OS === 'ios'){
            console.log(result);
            //console.log(result.transactionReceipt);
            // can do your API call here to save the purchase details of particular user
          }

          setLoading(false);
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

  const buyProduct = async () => {  
    setCashPop(false);
    _requestPurchase(skuCode);
  }

	const nonCollidingMultiSliderValuesChange = (a,b) => {
		setNonCollidingMultiSliderValue([a,b]);
	}

	const nonCollidingMultiSliderValuesChange2 = (a,b) => {
		setNonCollidingMultiSliderValue2([a,b]);
	}

	const resetFilter = () => {
		getDateInfo();
		setDistanceStandard(1);
		setDistance(50);
		setDistance2(50);
		setRecentAccess(7);
	}

	const offFilterPop = () => {
		setAgeMin(tempAgeMin);
		setAgeMax(tempAgeMax);
		setAgeMin2(tempAgeMin2);
		setAgeMax2(tempAgeMax2);
		setNonCollidingMultiSliderValue(tempNonCollidingMultiSliderValue);
		setNonCollidingMultiSliderValue2(tempNonCollidingMultiSliderValue2);
		setRealAgeMin(tempRealAgeMin);
		setRealAgeMax(tempRealAgeMax);
		setRealAgeMin2(tempRealAgeMin2);
		setRealAgeMax2(tempRealAgeMax2);
		setDistanceStandard(tempDistanceStandard);
		setDistance(tempDistance);
		setDistance2(tempDistance2);
		setRecentAccess(tempRecentAccess);

		setFilterPop(false);
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
								setTempAgeMin(ageMin);
								setTempAgeMax(ageMax);
								setTempAgeMin2(ageMin2);
								setTempAgeMax2(ageMax2);
								setTempNonCollidingMultiSliderValue(nonCollidingMultiSliderValue);
								setTempNonCollidingMultiSliderValue2(nonCollidingMultiSliderValue2);
								setTempRealAgeMin(realAgeMin);
								setTempRealAgeMax(realAgeMax);
								setTempRealAgeMin2(realAgeMin2);
								setTempRealAgeMax2(realAgeMax2);
								setTempDistanceStandard(distanceStandard);
								setTempDistance(distance);
								setTempDistance2(distance2);
								setTempRecentAccess(recentAccess);	
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
							onPress={() => {navigation.navigate('Alim')}}
						>
							{/* <ImgDomain fileWidth={24} fileName={'icon_alim_off.png'} /> */}
							<ImgDomain fileWidth={24} fileName={'icon_alim_on.png'} />
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
					onPress={()=>{getInterest(1)}}
				>
					<Text style={[styles.state2TabBtnText, tabState2 == 1 ? styles.state2TabBtnTextOn : null]}>찜&교환한 카드</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.state2TabBtn}
					activeOpacity={opacityVal}
					onPress={()=>{getInterest(2)}}
				>
					<Text style={[styles.state2TabBtnText, tabState2 == 2 ? styles.state2TabBtnTextOn : null]}>호감 카드</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.state2TabBtn}
					activeOpacity={opacityVal}
					onPress={()=>{getInterest(3)}}
				>
					<Text style={[styles.state2TabBtnText, tabState2 == 3 ? styles.state2TabBtnTextOn : null]}>매칭된 카드</Text>
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
												setTodayFree(todayFree - 1);
											}}
										>
											<Text style={styles.todayFreeBtnText}>무료 소개 받기 ({todayFree}/2)</Text>
										</TouchableOpacity>
									) : (
										<>
										<TouchableOpacity
											style={[styles.todayFreeBtn]}
											activeOpacity={opacityVal}
											onPress={() => setAddIntroPop(true)}
										>
											<Text style={styles.todayFreeBtnText}>추가 소개 받기 (00개)</Text>
										</TouchableOpacity>

										<TouchableOpacity
											style={[styles.todayFreeBtn, styles.mgt10]}
											activeOpacity={opacityVal}
											onPress={() => {
												if(filterSave){
													setUnAddIntroPop2(true);
												}else{
													setUnAddIntroPop1(true);
												}
											}}
										>
											<Text style={styles.todayFreeBtnText}>추가 소개 받기 불가</Text>
										</TouchableOpacity>
										</>
									)}
								</LinearGradient>
							</View>
						</View>								

						{/* D-7 */}
						<View style={styles.cardView}>
							<View style={styles.dday}>
								<View style={styles.ddayLine}></View>
								<Text style={styles.ddayText}>D-7</Text>
							</View>
							{cardList.map((item, index) => {
								return (	
									item.dday == 7 ? (
										<Card 
											navigation={navigation}
											key={index}
											propsNick={item.name}
											propsJob={item.job}
											propsAge={item.age}
											propsArea={item.area}
											propsHeight={item.height}
											propsWeight={item.weight}
											propsBadgeCnt={item.badgeCnt}
											propsFlip={item.isFlipped}
											propsOpen={item.open}
										/>
									) : null				
								)
							})}
						</View>

						{/* D-6 */}
						<View style={styles.cardView}>
							<View style={styles.dday}>
								<View style={styles.ddayLine}></View>
								<Text style={styles.ddayText}>D-6</Text>
							</View>
							{cardList.map((item, index) => {
								return (	
									item.dday == 6 ? (
										<Card 
											navigation={navigation}
											key={index}
											propsNick={item.name}
											propsJob={item.job}
											propsAge={item.age}
											propsArea={item.area}
											propsHeight={item.height}
											propsWeight={item.weight}
											propsBadgeCnt={item.badgeCnt}
											propsFlip={item.isFlipped}
											propsOpen={item.open}
										/>
									) : null				
								)
							})}
						</View>

						{/* D-5 */}
						<View style={styles.cardView}>
							<View style={styles.dday}>
								<View style={styles.ddayLine}></View>
								<Text style={styles.ddayText}>D-5</Text>
							</View>
							{cardList.map((item, index) => {
								return (	
									item.dday == 5 ? (
										<Card 
											navigation={navigation}
											key={index}
											propsNick={item.name}
											propsJob={item.job}
											propsAge={item.age}
											propsArea={item.area}
											propsHeight={item.height}
											propsWeight={item.weight}
											propsBadgeCnt={item.badgeCnt}
											propsFlip={item.isFlipped}
											propsOpen={item.open}
										/>
									) : null				
								)
							})}
						</View>

					</View>
					) : null}

					{tabState == 2 ? (
					<View>
						{tabState2 == 1 ? (
						<View>			
							{/* 찜한 카드	*/}
							{data1List.length > 0 ? (
							<View style={styles.interestBox}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>찜한 카드</Text>
								</View>
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
												<Card2 
													navigation={navigation}
													key={index}
													propsNick={item.name}													
													propsAge={item.age}													
													propsHeight={item.height}													
													propsFlip={item.isFlipped}
													propsDday={item.dday}
												/>
											)
										}
									})}
								</View>
							</View>
							) : null}

							{/* 교환한 프로필 */}
							{data2List.length > 0 ? (
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>교환한 프로필</Text>
								</View>
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
												<Card2 
													navigation={navigation}
													key={index}
													propsNick={item.name}													
													propsAge={item.age}													
													propsHeight={item.height}													
													propsFlip={item.isFlipped}
													propsDday={item.dday}
												/>
											)
										}
									})}
								</View>
							</View>
							) : null}
						</View>
						) : null}

						{tabState2 == 2 ? (
						<View>				
							{/* 받은 좋아요 */}
							{data3List.length > 0 ? (
							<View style={styles.interestBox}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>받은 좋아요</Text>
								</View>
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
												<Card2 
													navigation={navigation}
													key={index}
													propsNick={item.name}													
													propsAge={item.age}													
													propsHeight={item.height}													
													propsFlip={item.isFlipped}
													propsDday={item.dday}
												/>
											)
										}
									})}
								</View>
							</View>
							) : null}
							
							{/* 보낸 좋아요 */}
							{data4List.length > 0 ? (
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>보낸 좋아요</Text>
								</View>
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
												<Card2 
													navigation={navigation}
													key={index}
													propsNick={item.name}													
													propsAge={item.age}													
													propsHeight={item.height}													
													propsFlip={item.isFlipped}
													propsDday={item.dday}
												/>
											)
										}
									})}
								</View>
							</View>
							) : null}

							{/* 주고받은 호감 */}
							{data5List.length > 0 ? (
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>주고받은 호감</Text>
								</View>
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
												<Card2 
													navigation={navigation}
													key={index}
													propsNick={item.name}													
													propsAge={item.age}													
													propsHeight={item.height}													
													propsFlip={item.isFlipped}
													propsDday={item.dday}
												/>
											)
										}
									})}
								</View>
							</View>
							) : null}

							{/* 받은 호감 */}
							{data6List.length > 0 ? (
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>받은 호감</Text>
								</View>
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
												<Card2 
													navigation={navigation}
													key={index}
													propsNick={item.name}													
													propsAge={item.age}													
													propsHeight={item.height}													
													propsFlip={item.isFlipped}
													propsDday={item.dday}
												/>
											)
										}
									})}
								</View>
							</View>
							) : null}

							{/* 보낸 호감 */}
							{data7List.length > 0 ? (
							<View style={[styles.interestBox, styles.mgt50]}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>보낸 호감</Text>
								</View>
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
												<Card2 
													navigation={navigation}
													key={index}
													propsNick={item.name}													
													propsAge={item.age}													
													propsHeight={item.height}													
													propsFlip={item.isFlipped}
													propsDday={item.dday}
												/>
											)
										}
									})}
								</View>
							</View>
							) : null}					
						</View>
						) : null}
						
						{tabState2 == 3 ? (
						<View>			
							{/* 매칭된 이성 */}
							{data8List.length > 0 ? (
							<View style={styles.interestBox}>
								<View style={styles.interestBoxTitle}>
									<Text style={styles.interestBoxTitleText}>매칭된 이성</Text>
								</View>
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
												<Card2 
													navigation={navigation}
													key={index}
													propsNick={item.name}													
													propsAge={item.age}													
													propsHeight={item.height}													
													propsFlip={item.isFlipped}
													propsDday={item.dday}
												/>
											)
										}
									})}
								</View>
							</View>
							) : null}
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
								<Text style={styles.msTitleBoxText2}>{ageMin}년생~{ageMax}년생+</Text>
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
								customMarker={() => (
									<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
								)}
								onValuesChange={(e) => {
									//console.log(e);
									const first = ageAry[e[0]];
									const last = ageAry[e[1]];
									
									let yearString = first.toString();
									setRealAgeMin(yearString);
									yearString = yearString.substr(2,2);

									let yearString2 = last.toString();
									setRealAgeMax(yearString2);
									yearString2 = yearString2.substr(2,2);
									
									setAgeMin(yearString);
									setAgeMax(yearString2);
									//setNonCollidingMultiSliderValue(e);

									nonCollidingMultiSliderValuesChange(yearString, yearString2);
								}}
							/>
						</View>
						<View style={[styles.msBox, styles.mgt50]}>
							<View style={[styles.msTitleBox, styles.mgb25]}>
								<Text style={styles.msTitleBoxText1}>거리</Text>
							</View>
							<View style={[styles.msTitleBox]}>
								<TouchableOpacity 
									style={styles.msCheckBox}
									activeOpacity={opacityVal}
									onPress={()=>{setDistanceStandard(1)}}
								>
									{distanceStandard == 1 ? (
										<View style={[styles.msCheckBoxCircle, styles.msCheckBoxCircleOn]}>
											<View style={styles.msCheckBoxCircleIn}></View>
										</View>
									) : (
										<View style={styles.msCheckBoxCircle}></View>
									)}
									
									<Text style={styles.msCheckBoxText}>주활동 지역 기준</Text>
								</TouchableOpacity>
								<Text style={styles.msTitleBoxText2}>{distance}km 이내</Text>
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
								values={[distance]}
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
								customMarker={() => (
									<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
								)}
								onValuesChange={(e) => {
									//console.log(e);
									setDistance(e[0]);
								}}
							/>
						</View>
						<View style={[styles.msBox, styles.mgt30]}>
							<View style={[styles.msTitleBox]}>
								<TouchableOpacity 
									style={styles.msCheckBox}
									activeOpacity={opacityVal}
									onPress={()=>{setDistanceStandard(2)}}
								>
									{distanceStandard == 2 ? (
										<View style={[styles.msCheckBoxCircle, styles.msCheckBoxCircleOn]}>
											<View style={styles.msCheckBoxCircleIn}></View>
										</View>
									) : (
										<View style={styles.msCheckBoxCircle}></View>
									)}
									
									<Text style={styles.msCheckBoxText}>부활동 지역 기준</Text>
								</TouchableOpacity>
								<Text style={styles.msTitleBoxText2}>{distance2}km 이내</Text>
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
								values={[distance2]}
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
								customMarker={() => (
									<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
								)}
								onValuesChange={(e) => {
									//console.log(e);
									setDistance2(e[0]);
								}}
							/>
						</View>
						<View style={[styles.msBox, styles.mgt50]}>
							<View style={[styles.msTitleBox, styles.mgb25]}>
								<Text style={styles.msTitleBoxText1}>최근 접속일 수</Text>
								<Text style={styles.msTitleBoxText2}>{recentAccess}일 이내 접속자</Text>
							</View>
							<View style={styles.multiSliderCustom}>
								<View style={styles.multiSliderDotBack}>
									<View style={[styles.multiSliderDotBackOn, recentAccess == 14 ? styles.w33p : null, recentAccess == 21 ? styles.w66p : null, recentAccess == 28 ? styles.w100p : null]}></View>
								</View>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow]}
									activeOpacity={1}
									onPress={()=>{setRecentAccess(7)}}
								>
								</TouchableOpacity>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow, recentAccess < 14 ? styles.multiSliderDotOff : null]}
									activeOpacity={1}
									onPress={()=>{setRecentAccess(14)}}
								>									
								</TouchableOpacity>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow, recentAccess < 21 ? styles.multiSliderDotOff : null]}
									activeOpacity={1}
									onPress={()=>{setRecentAccess(21)}}
								>									
								</TouchableOpacity>
								<TouchableOpacity 
									style={[styles.multiSliderDot, styles.boxShadow, recentAccess < 28 ? styles.multiSliderDotOff : null]}
									activeOpacity={1}
									onPress={()=>{setRecentAccess(28)}}
								>									
								</TouchableOpacity>
							</View>
						</View>
						<View style={[styles.msBox, styles.mgt60]}>
							<View style={styles.filterTitle}>
								<Text style={styles.filterTitleText}>내 카드 설정</Text>
							</View>
							<View style={styles.filterDesc}>
								<Text style={styles.filterDescText}>내 카드가 소개 될 카드를 설정합니다.</Text>
							</View>
							<View style={[styles.msBox, styles.mgt30]}>
								<View style={[styles.msTitleBox, styles.mgb10]}>
									<Text style={styles.msTitleBoxText1}>나이</Text>
									<Text style={styles.msTitleBoxText2}>{ageMin2}년생~{ageMax2}년생+</Text>
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
									customMarker={() => (
										<View style={[styles.multiSliderDot, styles.boxShadow]}></View>
									)}
									onValuesChange={(e) => {
										const first = ageAry[e[0]];
										const last = ageAry[e[1]];
										
										let yearString = first.toString();
										setRealAgeMin2(yearString);
										yearString = yearString.substr(2,2);

										let yearString2 = last.toString();
										setRealAgeMax2(yearString2);
										yearString2 = yearString2.substr(2,2);
										
										setAgeMin2(yearString);
										setAgeMax2(yearString2);
										//setNonCollidingMultiSliderValue2(e);

										nonCollidingMultiSliderValuesChange2(yearString, yearString2);
									}}
								/>
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
								<Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>탈퇴한 회원이에요</Text>
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
							<Text style={styles.pointBoxText}>100</Text>
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
									setAddIntroPop(false);
									setCashPop(true);
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
								onPress={() => {navigation.navigate('Community')}}
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
								<Text style={[styles.popBotTitleText, styles.popTitleFlexText]}>카드가 없어요</Text>
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
									setTempAgeMin(ageMin);
									setTempAgeMax(ageMax);
									setTempAgeMin2(ageMin2);
									setTempAgeMax2(ageMax2);
									setTempNonCollidingMultiSliderValue(nonCollidingMultiSliderValue);
									setTempNonCollidingMultiSliderValue2(nonCollidingMultiSliderValue2);
									setTempRealAgeMin(realAgeMin);
									setTempRealAgeMax(realAgeMax);
									setTempRealAgeMin2(realAgeMin2);
									setTempRealAgeMax2(realAgeMax2);
									setTempDistanceStandard(distanceStandard);
									setTempDistance(distance);
									setTempDistance2(distance2);
									setTempRecentAccess(recentAccess);									
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
					onPress={()=>{setWelcomePop(false)}}
				>
				</TouchableOpacity>
				<View style={styles.prvPopBot2}>
					<ImageBackground source={{uri:'https://cnj02.cafe24.com/appImg/welcome.png'}} resizeMode="cover" >
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
										<Text style={[styles.prvPopBot2ViewText, styles.prvPopBot2ViewText2]}>00개</Text>
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

			{loading ? ( <View style={[styles.indicator]}><ActivityIndicator size="large" color="#D1913C" /></View> ) : null}
      {loading2 ? ( <View style={[styles.indicator, styles.indicator2]}><ActivityIndicator size="large" color="#fff" /></View> ) : null}
			
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({	
	safeAreaView: { flex: 1, backgroundColor: '#fff' },
	gapBox: {height:86,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	
  indicator2: { backgroundColor:'rgba(0,0,0,0.5)'},

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
	filterResetText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#1E1E1E',marginLeft:6,},

	filterTitle: {},
	filterTitleText: {fontFamily:Font.NotoSansSemiBold,fontSize:16,lineHeight:18,color:'#1e1e1e'},
	filterDesc: {marginTop:6,},
	filterDescText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:17,color:'#666'},
	msBox: {},
	msTitleBox: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	msTitleBoxText1: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:16,color:'#1e1e1e'},
	msTitleBoxText2: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#888',position:'relative',top:-1,},
	msCheckBox: {flexDirection:'row',alignItems:'center'},
	msCheckBoxCircle: {width:20,height:20,backgroundColor:'#fff',borderWidth:1,borderColor:'#dbdbdb',borderRadius:50,position:'relative'},
	msCheckBoxCircleOn: {borderColor:'#243B55'},
	msCheckBoxCircleIn: {width:12,height:12,backgroundColor:'#243B55',borderRadius:50,position:'absolute',left:3,top:3,},
	msCheckBoxText: {fontFamily:Font.NotoSansRegular,fontSize:12,color:'#1e1e1e',marginLeft:6,},

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

	cmWrap: {paddingVertical:40,paddingHorizontal:20,},
	cmWrap2: {paddingTop:30,},
	cardView: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
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
	interestBoxTitleText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:19,color:'#1e1e1e',},
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
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E',},
  popTitleFlexText: {position:'relative',top:0.5,},	
	popTitleDesc: {width:innerWidth-40,textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
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
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

	prvPopBot: {width:widnowWidth,paddingTop:40,paddingBottom:10,paddingHorizontal:20,backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,position:'absolute',bottom:0,},
	prvPopBot2: {width:widnowWidth,position:'absolute',bottom:0,},
	prvPopBot3: {paddingHorizontal:0,},
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
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },

	pointBox: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	pointBoxText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#D1913C',marginLeft:6},

	productList: {flexDirection:'row',justifyContent:'space-between'},
	productBtn: {width:(innerWidth/3)-7,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,paddingVertical:25,paddingHorizontal:10,},
	productBtnOn: {backgroundColor:'rgba(209,145,60,0.15)',borderColor:'#D1913C'},
	productText1: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:22,color:'#1e1e1e'},
	productBest: {height:20,paddingHorizontal:8,borderRadius:20,marginTop:5,},
	productBest2: {backgroundColor:'#FFBF1A',},
	productText2: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:18,color:'#fff'},
	productText3: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:17,color:'#666',marginTop:3,},
	productText3On: {color:'#1e1e1e'},
	productText4: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:5,},

	accImg: {alignItems:'center',justifyContent:'center',width:widnowWidth,height:180,backgroundColor:'#F2F4F6',position:'relative'},
	accCircle: {alignItems:'center',justifyContent:'center',width:80,height:80,borderWidth:2,borderColor:'#EDEDED',borderRadius:50,overflow:'hidden',position:'absolute',bottom:-40},
	accInfo: {paddingTop:55,paddingBottom:10,paddingHorizontal:20,},
	accInfoNick: {},
	accInfoNickText: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:18,lineHeight:21,color:'#1e1e1e'},
	accInfoTitle: {marginTop:50,marginBottom:15,},
	accInfoTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#666'},
	accInfoDesc: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	accInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:16,lineHeight:28,color:'#666'},

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
	mgt30: {marginTop:30,},
	mgt50: {marginTop:50,},
	mgt60: {marginTop:60,},
	mgb0: {marginBottom:0,},
	mgb10: {marginBottom:10,},
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