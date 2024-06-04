import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Toast from 'react-native-toast-message';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

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

const Social = (props) => {
	const socialData = [
		{idx:1, cate:'1:1', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:2, cate:'미팅', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:3, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:4, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:5, cate:'1:1', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:6, cate:'미팅', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:7, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
		{idx:8, cate:'모임', date:'12.24 (수)', subject:'제목최대열다섯자까지노출됩니다.', loc:'강남역', age:'00', gender:'남', image:'', profile:''},
	];

	const calendarData = [
		{year:'2024', month:'05', monthString:'5', day:'26', dayString:'26', yoil:'일', chk:false},
		{year:'2024', month:'05', monthString:'5', day:'27', dayString:'27', yoil:'월', chk:false},
		{year:'2024', month:'05', monthString:'5', day:'28', dayString:'28', yoil:'화', chk:false},
		{year:'2024', month:'05', monthString:'5', day:'29', dayString:'29', yoil:'수', chk:false},
		{year:'2024', month:'05', monthString:'5', day:'30', dayString:'30', yoil:'목', chk:false},
		{year:'2024', month:'05', monthString:'5', day:'31', dayString:'31', yoil:'금', chk:false},

		{year:'2024', month:'06', monthString:'6', day:'01', dayString:'1', yoil:'토', chk:false},
		{year:'2024', month:'06', monthString:'6', day:'02', dayString:'2', yoil:'일', chk:false},
		{year:'2024', month:'06', monthString:'6', day:'03', dayString:'3', yoil:'월', chk:false},
		{year:'2024', month:'06', monthString:'6', day:'04', dayString:'4', yoil:'화', chk:false},
		{year:'2024', month:'06', monthString:'6', day:'05', dayString:'5', yoil:'수', chk:false},
		{year:'2024', month:'06', monthString:'6', day:'06', dayString:'6', yoil:'목', chk:false},
		{year:'2024', month:'06', monthString:'6', day:'07', dayString:'7', yoil:'금', chk:false},
		{year:'2024', month:'06', monthString:'6', day:'08', dayString:'8', yoil:'토', chk:false},	
	];

	const swp = [
    {idx:1, imgUrl:'', type:'community_guide'},
    {idx:2, imgUrl:'', type:'social_guide'},
    {idx:3, imgUrl:'', type:'shop_free'},
  ]

	const navigationUse = useNavigation();
	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route;	
	const [routeLoad, setRouteLoad] = useState(false);
	const swiperRef = useRef(null);
	const [pageSt, setPageSt] = useState(false);
	const [preventBack, setPreventBack] = useState(false);
	const [loading, setLoading] = useState(false);	
	const [keyboardStatus, setKeyboardStatus] = useState(0);
	const [socialList, setSocialList] = useState([]);
	const [filterMonth, setFilterMonth] = useState([]);
	const [calendarList, setCalendarList] = useState([]);
	const [filterCal, setFilterCal] = useState([]);
	const [filterCal2, setFilterCal2] = useState([]);

	const [overPop, setOverPop] = useState(false);
	const [guideModal, setGuideModal] = useState(false);
	const [guideModal2, setGuideModal2] = useState(false);

	const [tabState, setTabState] = useState(1); //전체, 1:1, 미팅, 모임
	const [socialSch, setSocialSch] = useState('');
	const [refreshing, setRefreshing] = useState(false);
	const [filterPop, setFilterPop] = useState(false);
	const [ageAry, setAgeAry] = useState([]);
	const [ageAryIdx, setAgeAryIdx] = useState([]);
	const [ageMinInt, setAgeMinInt] = useState();
	const [ageMaxInt, setAgeMaxInt] = useState();
	const [ageMin, setAgeMin] = useState('');
	const [ageMax, setAgeMax] = useState('');
	const [nonCollidingMultiSliderValue, setNonCollidingMultiSliderValue] = useState([]);
	const [realAgeMin, setRealAgeMin] = useState('');
	const [realAgeMax, setRealAgeMax] = useState('');
	const [filterGender, setFilterGender] = useState(0);
	const [filterPickDate, setFilterPickDate] = useState([]);
	const [swiperList, setSwiperList] = useState([]);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
		}else{
			//console.log("isFocused");
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
		const date = new Date();		
		const year = (date.getFullYear())-50;
		const year2 = (date.getFullYear())-20;		
		let month = date.getMonth() + 1;
		let monthAry = [month];
		let dateAry = [];

		for(let i=1; i<=14; i++){
			const tomorrow = new Date(date.setDate(date.getDate() + 1));
			const tomorrowYear = tomorrow.getFullYear();
			const month2 = tomorrow.getMonth() + 1;
			const month2String = ('0' + month2).slice(-2);
			const day2 = tomorrow.getDate();
			const day2String = ('0' + day2).slice(-2);

			//0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토
			let dayYoil = '';
			const dayOfWeek = new Date(tomorrowYear+'-'+month2String+'-'+day2String).getDay(); 
			if(dayOfWeek == 0){
				dayYoil = '일';
			}else if(dayOfWeek == 1){
				dayYoil = '월';
			}else if(dayOfWeek == 2){
				dayYoil = '화';
			}else if(dayOfWeek == 3){
				dayYoil = '수';
			}else if(dayOfWeek == 4){
				dayYoil = '목';
			}else if(dayOfWeek == 5){
				dayYoil = '금';
			}else if(dayOfWeek == 6){
				dayYoil = '토';
			}
			if(month != month2){				
				monthAry.push(month2);
				month = month2;
			}

			const dateObj = {year:tomorrowYear, month:month2, monthString:month2String, day:day2, dayString:day2String, yoil:dayYoil, chk:false};
			dateAry.push(dateObj);
		}

		setFilterMonth(monthAry);
		setCalendarList(dateAry);		

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
		yearString = yearString.substr(2,2);		

		let yearString2 = yearVal2.toString();
		yearString2 = yearString2.substr(2,2);
		
		setAgeMin((yearString2).toString());
		setAgeMax((yearString).toString());
		setAgeMinInt(5);
		setAgeMaxInt(cnt-5);
		setNonCollidingMultiSliderValue([5, cnt-5]);
	}, []);

	useEffect(() => {
		setLoading(true);		
		setTimeout(() => {
			setSocialList(socialData);
			setSwiperList(swp);
			setLoading(false);
		}, 1000);
	}, [])

	const getList = ({item, index}) => (
		<View style={styles.socialLi}>
			<TouchableOpacity
				style={[styles.socialLiBtn, index == 0 ? styles.pdt0 : null]}
				activeOpacity={opacityVal}
				onPress={()=>{
					if(index == 0){
						setOverPop(true);
					}else if(index == 1){
						navigation.navigate('SocialView', {idx:item.idx})
					}
				}}
			>
				<View style={styles.socialLiThumb}>
					<ImgDomain fileWidth={65} fileName={'social_basic1.jpg'}/>
				</View>
				<View style={styles.socialLiInfo}>
					<View style={styles.socialLiInfo1}>
						<View style={styles.socialLiInfoCate}>
							<Text style={styles.socialLiInfoCateText}>{item.cate}</Text>
						</View>
						<View style={styles.socialLiInfoDate}>
							<Text style={styles.socialLiInfoDateText}>{item.date}</Text>
						</View>
					</View>
					<View style={styles.socialLiInfo2}>
						<Text style={styles.socialSubject} numberOfLines={1} ellipsizeMode='tail'>{item.subject}</Text>
					</View>
					<View style={styles.socialLiInfo3}>
						<View style={styles.socialLiInfo3Flex}>
							<ImgDomain fileWidth={10} fileName={'icon_local.png'}/>
							<Text style={styles.socialLiInfo3Text}>{item.loc}</Text>
						</View>
						<View style={styles.socialLiInfo3Line}></View>
						<View style={styles.socialLiInfo3Flex}>
							<View style={styles.socialLiInfoProfile}>
								<ImgDomain fileWidth={20} fileName={'profile_sample.png'}/>
							</View>
							<Text style={styles.socialLiInfo3Text}>{item.age}·{item.gender}</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
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
			//getItemList();
			setTimeout(() => {
				setRefreshing(false);
			}, 2000);
		}
	}

	const socialSearch = async () => {
		if(socialSch.length < 2){
			ToastMessage('검색어는 2글자 이상 입력해 주세요.');
			return false;
		}
	}

	useEffect(() => {
		if(filterMonth.length == 1){			
			setFilterCal(calendarList);
		}else if(filterMonth.length == 2){
			let obj1Ary = [];
			let obj2Ary = [];
			calendarList.map((item, index) => {
				if(filterMonth[0] == item.month){
					obj1Ary.push({year:item.year, month:item.month, monthString:item.monthString, day:item.day, dayString:item.dayString, yoil:item.yoil, chk:item.chk});
				}else if(filterMonth[1] == item.month){
					obj2Ary.push({year:item.year, month:item.month, monthString:item.monthString, day:item.day, dayString:item.dayString, yoil:item.yoil, chk:item.chk});
				}
			})

			setFilterCal(obj1Ary);
			setFilterCal2(obj2Ary);
		}
	}, [filterMonth, calendarList]);

	const pickDateAry = (year, month, monthString, day, dayString, yoil, parentMonth) => {		
		let addState = true;	
		let selectCon = [];
		const fullDate = year+'-'+monthString+'-'+dayString;
		
		filterPickDate.map((item, index) => {				
			if(item.fullDate == fullDate){
				addState = false;
			}
		});
		
		if(addState){
			let ary = [...filterPickDate, {fullDate:fullDate, year:year, month:month, monthString:monthString, day:day, dayString:dayString, yoil:yoil}];
			const asc = ary.sort((a,b) => {
				if((a.year)+(a.monthString)+(a.dayString) > (b.year)+(b.monthString)+(b.dayString)) return 1;
				if((a.year)+(a.monthString)+(a.dayString) < (b.year)+(b.monthString)+(b.dayString)) return -1;
				return 0;
			});
			setFilterPickDate(asc);
		}else{
			
			filterPickDate.map((item, index) => {
				if(item.fullDate != fullDate){
					let aryList = {fullDate:item.fullDate, year:item.year, month:item.month, monthString:item.monthString, day:item.day, dayString:item.dayString, yoil:item.yoil};
					selectCon = [...selectCon, aryList];
				}
			});

			const asc = selectCon.sort((a,b) => {
				if((a.year)+(a.monthString)+(a.dayString) > (b.year)+(b.monthString)+(b.dayString)) return 1;
				if((a.year)+(a.monthString)+(a.dayString) < (b.year)+(b.monthString)+(b.dayString)) return -1;
				return 0;
			});			
			setFilterPickDate(asc);
		}

		let actCon = [];
		if(parentMonth == 1){
			actCon = filterCal.map((item) => {
				if(item.year === year && item.month === month && item.day === day){					
					if(item.chk){			
						return {...item, chk: false};
					}else{
						return {...item, chk: true};						
					}
				}else{
					return {...item, chk: item.chk};
				}
			});
			setFilterCal(actCon);
		}else if(parentMonth == 2){
			actCon = filterCal2.map((item) => {
				if(item.year === year && item.month === month && item.day === day){					
					if(item.chk){			
						return {...item, chk: false};
					}else{
						return {...item, chk: true};						
					}
				}else{
					return {...item, chk: item.chk};
				}
			});
			setFilterCal2(actCon);
		}
	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<View style={styles.header}>
				<View style={styles.headerTop}>
					<View style={styles.headerTopTitle}>
						<Text style={styles.headerTitleText}>Social</Text>
					</View>
					<View style={styles.headerLnb}>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => navigation.navigate('MySocial')}
						>
							<ImgDomain fileWidth={24} fileName={'icon_mysocial.png'}/>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {navigation.navigate('Shop')}}					
						>
							<ImgDomain fileWidth={24} fileName={'icon_shop.png'}/>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {navigation.navigate('Alim')}}
						>
							<ImgDomain fileWidth={24} fileName={'icon_alim_off.png'}/>
							{/* <ImgDomain fileWidth={24} fileName={'icon_alim_on.png'}/> */}
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.headerBot}>
					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(1)}}
					>
						<Text style={[styles.headerTabText, tabState == 1 ? styles.headerTabTextOn : null]}>전체</Text>
						{tabState == 1 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(2)}}
					>
						<Text style={[styles.headerTabText, tabState == 2 ? styles.headerTabTextOn : null]}>1:1</Text>
						{tabState == 2 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(3)}}
					>
						<Text style={[styles.headerTabText, tabState == 3 ? styles.headerTabTextOn : null]}>미팅</Text>
						{tabState == 3 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.headerTab}
						activeOpacity={opacityVal}
						onPress={() => {setTabState(4)}}
					>
						<Text style={[styles.headerTabText, tabState == 4 ? styles.headerTabTextOn : null]}>모임</Text>
						{tabState == 4 ? (<View style={styles.activeLine}></View>) : null}
					</TouchableOpacity>
				</View>
			</View>			

			<FlatList 				
				data={socialList}
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
					<View style={styles.swiperView}>
						<SwiperFlatList
							ref={swiperRef}
							index={0}
							data={swiperList}
							onChangeIndex={(obj) => {
								
							}}
							renderItem={({ item, index }) => {
								return (
									<TouchableOpacity 
										key={index}
										style={styles.commuBanner}
										activeOpacity={opacityVal}
										onPress={()=>{
											if(item.type == 'community_guide'){
												setGuideModal(true);
											}else if(item.type == 'social_guide'){
												setGuideModal2(true);
											}else if(item.type == 'shop_free'){
												navigation.navigate('Shop', {tab:2});
											}
										}}
									>
										<ImgDomain fileWidth={widnowWidth} fileName={'slide_banner'+(index+1)+'.png'} />
									</TouchableOpacity>
								)
							}}
						/>
					</View>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={styles.flatListPad}></View>
					</TouchableWithoutFeedback>
					<View style={styles.socialSchBox}>
						<View style={styles.socialSchBoxWrap}>
							<TouchableOpacity
								style={styles.socialSchBoxWrapBtn}
								activeOpacity={opacityVal}
								onPress={()=>socialSearch()}
							>
								<ImgDomain fileWidth={28} fileName={'icon_sch.png'}/>
							</TouchableOpacity>
							<TextInput
								value={socialSch}
								onChangeText={(v) => setSocialSch(v)}						
								style={[styles.socialSchBoxWrapInput]}
								returnKyeType='done'                      
							/>
						</View>
						<TouchableOpacity
							style={styles.socialSchFilterBtn}
							activeOpacity={opacityVal}
							onPress={()=>setFilterPop(true)}
						>
							<ImgDomain fileWidth={28} fileName={'icon_option2.png'}/>
						</TouchableOpacity>
					</View>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={styles.flatListPad}></View>
					</TouchableWithoutFeedback>
					</>
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
			<View style={styles.gapBox}></View>

			{keyboardStatus == 0 || keyboardStatus == 1 ? (
			<TouchableOpacity
        style={[styles.wrtBtn, styles.wrtBtnBoxShadow, keyboardStatus == 1 ? styles.wrtBtnHide : null]}
        activeOpacity={opacityVal}
        onPress={()=>{navigation.navigate('SocialType')}}
      >
				<ImgDomain fileWidth={60} fileName={'icon_write.png'}/>
      </TouchableOpacity>
			) : null}

			{/* 필터 */}
			<Modal
				visible={filterPop}
				animationType={"none"}
				onRequestClose={() => setFilterPop(false)}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.modalHeader}>					
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {
							setFilterPop(false);
						}}						
					>						
						<ImgDomain fileWidth={8} fileName={'icon_header_back.png'}/>
					</TouchableOpacity>		
					<TouchableOpacity 
						style={styles.filterResetBtn}
						activeOpacity={opacityVal}
						onPress={()=>{console.log('초기화 작업 진행!!')}}
					>
						<ImgDomain fileWidth={13} fileName={'icon_refresh.png'}/>
						<Text style={styles.filterResetText}>초기화</Text>
					</TouchableOpacity>				
				</View>
				<ScrollView>
					<View style={[styles.cmWrap, styles.cmWrap2]}>
						<View style={styles.filterTitle}>
							<Text style={styles.filterTitleText}>소셜 필터</Text>
						</View>
						<View style={[styles.msBox, styles.mgt30]}>
							<View style={[styles.msTitleBox, styles.mgb20]}>
								<Text style={styles.msTitleBoxText1}>호스트 성별</Text>
							</View>
							<View style={styles.msTitleBox}>
								<TouchableOpacity
									style={[styles.filterGenBtn, filterGender == 1 ? styles.filterGenBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										setFilterGender(1);
									}}
								>
									<Text style={[styles.filterGenBtnText, filterGender == 1 ? styles.filterGenBtnTextOn : null]}>남자</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.filterGenBtn, filterGender == 2 ? styles.filterGenBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										setFilterGender(2);
									}}
								>
									<Text style={[styles.filterGenBtnText, filterGender == 2 ? styles.filterGenBtnTextOn : null]}>여자</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.filterGenBtn, filterGender == 0 ? styles.filterGenBtnOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{
										setFilterGender(0);
									}}
								>
									<Text style={[styles.filterGenBtnText, filterGender == 0 ? styles.filterGenBtnTextOn : null]}>모두</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View style={[styles.msBox, styles.mgt50]}>
							<View style={[styles.msTitleBox, styles.mgb10]}>
								<Text style={styles.msTitleBoxText1}>호스트 나이</Text>
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
								}}
							/>
						</View>
						<View style={[styles.msBox, styles.mgt50]}>
							<View style={[styles.filterTitle]}>
								<Text style={styles.filterTitleText}>만남 날짜</Text>
							</View>							

							{filterPickDate.length > 0 ? (
							<ScrollView
								horizontal={true}
								showsHorizontalScrollIndicator = {false}
								onMomentumScrollEnd ={() => {}}
							>
								<View style={[styles.pickDateBox, styles.mgt20]}>
									{filterPickDate.map((item, index) => {
										return (
											<View key={index} style={[styles.pickDateView, index == 0 ? styles.mgl0 : null]}>
												<Text style={styles.pickDateViewText}>{item.monthString}.{item.dayString} ({item.yoil})</Text>
											</View>
										)
									})}
								</View>
							</ScrollView>
							) : null}

							{filterMonth.length >= 1 ? (
							<View style={styles.mgt20}>
								<View style={[styles.msTitleBox]}>
									<Text style={styles.msTitleBoxText1}>{filterMonth[0]}월</Text>
								</View>
								<View style={[styles.filterCalBox]}>
									{filterCal.map((item2, index2) => {
										return (
											<TouchableOpacity
												key={index2}
												style={[styles.filterCalBtn, index2%7 == 6 ? styles.mgr0 : null]}
												activeOpacity={opacityVal}
												onPress={()=>{
													pickDateAry(item2.year, item2.month, item2.monthString, item2.day, item2.dayString, item2.yoil, 1);
												}}
											>
												<View style={[styles.filterCalDay, item2.chk ? styles.filterCalDayOn : null]}>
													<Text style={[styles.filterCalDayText, item2.chk ? styles.filterCalDayTextOn : null]}>{item2.dayString}</Text>
												</View>
												<View style={styles.filterCalYoil}>
													<Text style={styles.filterCalYoilText}>{item2.yoil}</Text>
												</View>
											</TouchableOpacity>													
										)
									})}											
								</View>
							</View>
							) : null}

							{filterMonth.length > 1 ? (
							<View style={styles.mgt20}>
								<View style={[styles.msTitleBox]}>
									<Text style={styles.msTitleBoxText1}>{filterMonth[1]}월</Text>
								</View>
								<View style={[styles.filterCalBox]}>
									{filterCal2.map((item2, index2) => {
										return (
											<TouchableOpacity
												key={index2}
												style={[styles.filterCalBtn, index2%7 == 6 ? styles.mgr0 : null]}
												activeOpacity={opacityVal}
												onPress={()=>{
													pickDateAry(item2.year, item2.month, item2.monthString, item2.day, item2.dayString, item2.yoil, 2);
												}}
											>
												<View style={[styles.filterCalDay, item2.chk ? styles.filterCalDayOn : null]}>
													<Text style={[styles.filterCalDayText, item2.chk ? styles.filterCalDayTextOn : null]}>{item2.dayString}</Text>
												</View>
												<View style={styles.filterCalYoil}>
													<Text style={styles.filterCalYoilText}>{item2.yoil}</Text>
												</View>
											</TouchableOpacity>													
										)
									})}											
								</View>
							</View>
							) : null}
						</View>
					</View>
				</ScrollView>
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={[styles.nextBtn]}
						activeOpacity={opacityVal}
						onPress={() => {
							setFilterPop(false);							
						}}
					>
						<Text style={styles.nextBtnText}>적용하기</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			{/* 이미 매칭된 경우 */}
			<Modal
				visible={overPop}
				transparent={true}
				animationType={"none"}
				onRequestClose={() => setOverPop(false)}
			>
				<View style={styles.cmPop}>
					<TouchableOpacity 
						style={styles.popBack} 
						activeOpacity={1} 
						onPress={()=>{setOverPop(false)}}
					>
					</TouchableOpacity>
					<View style={styles.prvPop}>
						<TouchableOpacity
							style={styles.pop_x}					
							onPress={() => {setOverPop(false)}}
						>
							<ImgDomain fileWidth={18} fileName={'popup_x.png'}/>
						</TouchableOpacity>		
						<View>
							<Text style={styles.popTitleText}>이미 매칭된 이성이</Text>
							<Text style={[styles.popTitleText, styles.mgt5]}>참여한 방이예요</Text>							
						</View>					
						<View style={[styles.popTitleDescFlex, styles.mgt20]}>
							<View styles={styles.popTitleDescFlexView}>
								<Text style={[styles.popTitleDesc, styles.popTitleDescFlexDesc, styles.mgt0]}>다른 소셜에 참여 신청해주세요</Text>
							</View>
							<ImgDomain fileWidth={14} fileName={'emoticon5.png'}/>
						</View>
						<View style={styles.popBtnBox}>
							<TouchableOpacity 
								style={[styles.popBtn]}
								activeOpacity={opacityVal}
								onPress={() => setOverPop(false)}
							>
								<Text style={styles.popBtnText}>확인</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* 커뮤니티 가이드 */}
			<Modal
				visible={guideModal}
				animationType={"none"}
				onRequestClose={() => {setGuideModal(false)}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.modalHeader}>	
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>커뮤니티 이용 가이드</Text>
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {setGuideModal(false)}}						
					>
						<ImgDomain fileWidth={16} fileName={'icon_close2.png'}/>
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View style={styles.guidePopCont}>
						<Text style={styles.guidePopContText}>커뮤니티 가이드입니다.</Text>
					</View>
				</ScrollView>
			</Modal>

			{/* 소셜 가이드 */}
			<Modal
				visible={guideModal2}
				animationType={"none"}
				onRequestClose={() => {setGuideModal2(false)}}
			>
				{Platform.OS == 'ios' ? ( <View style={{height:stBarHt}}></View> ) : null}
				<View style={styles.modalHeader}>	
					<Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitle}>소셜 이용 가이드</Text>
					<TouchableOpacity
						style={styles.headerBackBtn2}
						activeOpacity={opacityVal}
						onPress={() => {setGuideModal2(false)}}						
					>
						<ImgDomain fileWidth={16} fileName={'icon_close2.png'}/>
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View style={styles.guidePopCont}>
						<Text style={styles.guidePopContText}>소셜 가이드입니다.</Text>
					</View>
				</ScrollView>
			</Modal>

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
	gapBox: {height:86,},
	indicator: { width:widnowWidth, height: widnowHeight, backgroundColor:'rgba(255,255,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position:'absolute', left:0, top:0, },	

	header: {backgroundColor:'#141E30'},
	headerTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:20,paddingBottom:10,},
	headerTopTitle: {paddingLeft:20,},
	headerTitleText: {fontFamily:Font.RobotoMedium,fontSize:24,lineHeight:26,color:'#fff'},
	headerLnb: {flexDirection:'row',alignItems:'center',paddingRight:15,},
	headerLnbBtn: {marginLeft:6,paddingHorizontal:5,},
	headerBot: {flexDirection:'row',},
	headerTab: {width:widnowWidth/4,height:60,alignItems:'center',justifyContent:'center',position:'relative',paddingTop:10,},
	headerTabText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#fff'},
	headerTabTextOn: {fontFamily:Font.NotoSansBold,color:'#FFD194'},
	activeLine: {width:widnowWidth/4,height:4,backgroundColor:'#FFD194',position:'absolute',left:0,bottom:0,zIndex:10,},

	modalHeader: {height:48,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingHorizontal:40},
	headerBackBtn2: {width:56,height:48,position:'absolute',left:0,top:0,zIndex:10,display:'flex',alignItems:'center',justifyContent:'center',},
	headerTitle: {textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:16,lineHeight:48,color:'#000'},
	headerDot: {width:43,height:48,position:'absolute',top:0,right:0,display:'flex',alignItems:'center',justifyContent:'center'},
	headerSubmitBtn: {alignItems:'center',justifyContent:'center',width:50,height:48,position:'absolute',right:10,top:0},
	headerSubmitBtnText: {fontFamily:Font.NotoSansMedium,fontSize:16,color:'#b8b8b8',},
	headerSubmitBtnTextOn: {color:'#243B55'},
	filterResetBtn: {flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:20,height:48,backgroundColor:'#fff',position:'absolute',top:0,right:0,zIndex:10,},
	filterResetText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#1E1E1E',marginLeft:6,},

	guidePopCont: {padding:20,},
	guidePopContText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:24,color:'#1e1e1e'},

	socialSchBox: {paddingHorizontal:20,paddingBottom:10,flexDirection:'row',justifyContent:'space-between'},
	socialSchBoxWrap: {flexDirection:'row',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,},
	socialSchBoxWrapBtn: {alignItems:'center',justifyContent:'center',width:38,height:40,backgroundColor:'#F9FAFB',},
	socialSchBoxWrapInput: {width:innerWidth-78,height:40,backgroundColor:'#F9FAFB',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e'},
	socialSchFilterBtn: {justifyContent:'center',width:28,height:40,},
	flatListPad: {height:20,},

	swiperView: {height: widnowWidth/4.9,backgroundColor:'#fff'},

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

	socialLi: {paddingHorizontal:20,},
	socialLiBtn: {flexDirection:'row',paddingVertical:18,borderBottomWidth:1,borderColor:'#EDEDED'},
	socialLiThumb: {alignItems:'center',justifyContent:'center',width:60,height:60,borderRadius:50,overflow:'hidden'},
	socialLiInfo: {width:innerWidth-60,paddingLeft:20,},
	socialLiInfo1: {flexDirection:'row',alignItems:'center',},
	socialLiInfoCate: {alignItems:'center',justifyContent:'center',width:32,height:16,backgroundColor:'#243B55',borderRadius:10,},
	socialLiInfoCateText: {fontFamily:Font.NotoSansMedium,fontSize:10,lineHeight:13,color:'#fff'},
	socialLiInfoDate: {marginLeft:4,},
	socialLiInfoDateText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:13,color:'#888'},
	socialLiInfo2: {marginVertical:8,},
	socialSubject: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:16,color:'#1e1e1e'},
	socialLiInfo3: {flexDirection:'row',alignItems:'center',},
	socialLiInfo3Flex: {flexDirection:'row',alignItems:'center',},
	socialLiInfoProfile: {alignItems:'center',justifyContent:'center',width:20,height:20,borderRadius:50,overflow:'hidden'},
	socialLiInfo3Text: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:13,color:'#1e1e1e',marginLeft:4,},
	socialLiInfo3Line: {width:1,height:12,backgroundColor:'#EDEDED',marginHorizontal:12},

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

	multiSliderDot: {width:16,height:16,backgroundColor:'#fff',borderWidth:2,borderColor:'#D1913C',borderRadius:50,position:'relative',zIndex:10,},
	multiSliderDotOff: {borderWidth:0,backgroundColor:'#F8F9FA'},

	multiSliderCustom: {flexDirection:'row',justifyContent:'space-between',position:'relative'},
	multiSliderDotBack: {width:innerWidth,height:2,backgroundColor:'#DBDBDB',position:'absolute',left:0,top:7,},
	multiSliderDotBackOn: {width:0,height:2,backgroundColor:'#D1913C',},

	filterGenBtn: {alignItems:'center',justifyContent:'center',width:(innerWidth/3)-7,height:48,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,},
	filterGenBtnOn: {backgroundColor:'#243B55',borderWidth:0,},
	filterGenBtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#666'},
	filterGenBtnTextOn: {color:'#fff'},

	nextFix: {height:112,paddingHorizontal:20,paddingTop:10,backgroundColor:'#fff'},
  nextBtn: { height: 52, backgroundColor: '#243B55', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', },
  nextBtnOff: {backgroundColor:'#DBDBDB'},
	nextBtnText: { fontFamily: Font.NotoSansMedium, fontSize: 14, lineHeight: 52, color: '#fff' },

	filterCalBox: {flexDirection:'row',flexWrap:'wrap'},
	filterCalBtn: {width:(innerWidth/7)-8.5714285714,marginTop:20,marginRight:9.9,},
	filterCalDay: {alignItems:'center',justifyContent:'center',width:42,height:42,backgroundColor:'#fff',borderWidth:1,borderColor:'#EDEDED',borderRadius:5,},
	filterCalDayOn: {backgroundColor:'#243B55',borderWidth:0,},
	filterCalDayText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:20,color:'#666'},
	filterCalDayTextOn: {color:'#fff'},
	filterCalYoil: {marginTop:8,},
	filterCalYoilText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:17,color:'#1e1e1e'},

	pickDateBox: {flexDirection:'row',flexWrap:'wrap',},
	pickDateView: {alignItems:'center',justifyContent:'center',width:71,height:33,backgroundColor:'#EDF2FE',borderRadius:50,marginLeft:8,},
	pickDateViewText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:18,color:'#222'},

	modalBox: {paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',},
	cmPop: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.7)',},
	popBack: {position:'absolute',left:0,top:0,width:widnowWidth,height:widnowHeight},
	popBack2: {backgroundColor:'rgba(0,0,0,0.7)',},
	prvPop: {position:'relative',zIndex:10,width:innerWidth,maxHeight:innerHeight,paddingTop:50,paddingBottom:20,paddingHorizontal:20,backgroundColor:'#fff',borderRadius:10,},	
	pop_x: {width:38,height:38,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10,zIndex:10},
	popTitle: {paddingBottom:20,},
	popTitleFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap'},
	popTitleFlexWrap: {position:'relative'},
	popTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:21,color:'#1E1E1E',},
  popTitleFlexText: {position:'relative',top:2,},	
	popTitleDescFlex: {flexDirection:'row',alignItems:'center',justifyContent:'center'},
	popTitleDesc: {width:innerWidth-40,textAlign:'center',fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:17,color:'#1e1e1e',marginTop:20,},
	popTitleDescFlexDesc: {width:'auto',position:'relative',top:1.5,},
	emoticon: {},
	popIptBox: {paddingTop:10,},
	alertText: {fontFamily:Font.NotoSansRegular,fontSize:11,lineHeight:15,color:'#EE4245',marginTop:5,},
	popBtnBox: {marginTop:30,},
	popBtnBoxFlex: {flexDirection:'row',justifyContent:'space-between'},
	popBtn: {alignItems:'center',justifyContent:'center',height:48,backgroundColor:'#243B55',borderRadius:5,},
	popBtn2: {width:(innerWidth/2)-25,},
	popBtnOff: {backgroundColor:'#EDEDED',},
	popBtnOff2: {backgroundColor:'#fff',marginTop:10,},
	popBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#fff'},
	popBtnOffText: {color:'#1e1e1e'},

	prvPopBot: {width:widnowWidth,paddingTop:40,paddingBottom:10,paddingHorizontal:20,backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,position:'absolute',bottom:0,},
	prvPopBot2: {width:widnowWidth,position:'absolute',bottom:0,},
	popBotTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:20,color:'#1e1e1e',},
	popBotTitleDesc: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#666',marginTop:10,},

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

	pdt0: {paddingTop:0,},
	mgt0: {marginTop:0},
	mgt5: {marginTop:5},
	mgt10: {marginTop:10},
	mgt20: {marginTop:20},
	mgt30: {marginTop:30},
	mgt40: {marginTop:40},
	mgt50: {marginTop:50},
	mgb10: {marginBottom:10},
	mgb20: {marginBottom:20},
	mgr0: {marginRight:0},
	mgl0: {marginLeft:0},
})

export default Social