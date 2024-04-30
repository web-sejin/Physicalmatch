import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import FlipComponent from 'react-native-flip-component';

import Font from "../assets/common/Font";
import ToastMessage from "../components/ToastMessage";

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Home = (props) => {
	const cardData = [
		{ 'idx': 1, 'isFlipped':false, 'deg':'0deg', 'deg2':'180deg', 'name':'카드1' },
		{ 'idx': 2, 'isFlipped':false, 'deg':'0deg', 'deg2':'180deg', 'name':'카드2' },
		{ 'idx': 3, 'isFlipped':false, 'deg':'0deg', 'deg2':'180deg', 'name':'카드3' },
		{ 'idx': 4, 'isFlipped':false, 'deg':'0deg', 'deg2':'180deg', 'name':'카드4' },
		{ 'idx': 5, 'isFlipped':false, 'deg':'0deg', 'deg2':'180deg', 'name':'카드5' },
	];

	const {navigation, userInfo, chatInfo, route} = props;
	const {params} = route	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

	const [tabState, setTabState] = useState(1);
	const [todayFree, setTodayFree] = useState(2);
	const [
    nonCollidingMultiSliderValue,
    setNonCollidingMultiSliderValue,
	] = React.useState([-10, 10]);
	const [cardList, setCardList] = useState(cardData);	
	const [animation, setAnimation] = useState(new Animated.Value(180));
	const [animation2, setAnimation2] = useState(new Animated.Value(0));


	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setAll(false);
			}
		}else{
			//console.log("isFocused");
			if(route.params){
				//console.log("route on!!");
			}else{
				//console.log("route off!!");
			}
			setRouteLoad(true);
			setPageSt(!pageSt);
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	const getMatchCard = async(v) => {
		setTabState(v);
	}

	const chgFlipped = (idx) => {		
		let cont = cardList.map((item) => {
			if (item.idx === idx) {
				//console.log(item.idx+'///'+item.isFlipped);
				if(item.isFlipped){
					return { ...item, isFlipped: false };
				}else{
					return { ...item, isFlipped: true };
				}
			}else{
				return {...item, isFlipped: item.isFlipped};
			}
		});
		//console.log(cont);
		setCardList(cont);		
	}

	const ViewDetail = () => {
		//캐시 있는지 체크 후 결제 유도 or 상세페이지 이동
	}
	

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<View style={styles.header}>
				<View style={styles.headerTop}>
					<View style={styles.headerTitle}>
						<AutoHeightImage width={102} source={require('../assets/image/text_matching.png')} />
					</View>
					<View style={styles.headerLnb}>
						<TouchableOpacity
							activeOpacity={opacityVal}
							onPress={() => {}}
						>
							<AutoHeightImage width={24} source={require('../assets/image/icon_option.png')} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {}}							
						>
							<AutoHeightImage width={24} source={require('../assets/image/icon_shop.png')} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.headerLnbBtn}
							activeOpacity={opacityVal}
							onPress={() => {}}
						>
							<AutoHeightImage width={24} source={require('../assets/image/icon_alim_off.png')} />
							{/* <AutoHeightImage width={24} source={require('../assets/image/icon_alim_on.png')} /> */}
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
			<ScrollView>
				<View style={[styles.cmWrap, tabState == 1 ? styles.cmWrap2 : null]}>
					<View style={styles.todayFreeArea}>
						<TouchableOpacity
							style={styles.todayFreeBtn}
							activeOpacity={opacityVal}
							onPress={() => {
								if(todayFree < 1){
									ToastMessage('이미 모두 사용했습니다.');
									return false;
								}
								setTodayFree(todayFree - 1);
							}}
						>
							<Text style={styles.todayFreeBtnText}>무료 소개 받기 ({todayFree}/2)</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.cardView}>
						{cardList.map((item, index) => {						
							return (
								item.isFlipped ? (
									<TouchableOpacity 
										style={styles.cardBtn}
										key={index}
										activeOpacity={opacityVal}
										onPress={() => {
											ViewDetail();
										}}
									>
										<FlipComponent
											isFlipped={item.isFlipped}
											scale={1}
											scaleDuration= {0}
											rotateDuration={200}
											frontView={				
												<View style={[styles.cardCont, styles.cardBack]}>
													<Text style={{ textAlign: 'center' }}>
														Back Side1
													</Text>
												</View>														
											}
											backView={
												<View style={[styles.cardCont, styles.cardFront]}>
													<Text style={{ textAlign: 'center' }}>
														Front Side1
													</Text>
												</View>
											}
										/>
									</TouchableOpacity>
								): (
									<TouchableOpacity 
										style={styles.cardBtn}
										key={index}
										activeOpacity={opacityVal}
											onPress={() => {
												//Alert.alert('test');
												chgFlipped(item.idx)
											}}
									>
										<FlipComponent
											isFlipped={item.isFlipped}
											scale={1}
											scaleDuration= {0}
											rotateDuration={200}
											frontView={				
												<View style={[styles.cardCont, styles.cardBack]}>
													<Text style={{ textAlign: 'center' }}>
														Back Side2
													</Text>
												</View>														
											}
											backView={
												<View style={[styles.cardCont, styles.cardFront]}>
													<Text style={{ textAlign: 'center' }}>
														Front Side2
													</Text>
												</View>
											}
										/>
									</TouchableOpacity>
								)						
							)
						})}
					</View>
				</View>
			</ScrollView>
			<View style={styles.gapBox}></View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },
	gapBox: {height:86,backgroundColor:'red'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
	indicator2: { marginTop: 62 },
	text: {padding:8, color : 'black'},
	img: { marginTop: 8, height: widnowWidth, },

	header: {backgroundColor:'#141E30'},
	headerTop: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:15,paddingBottom:10,paddingHorizontal:20,},
	headerTitle: {},
	headerLnb: {flexDirection:'row',alignItems:'center',},
	headerLnbBtn: {marginLeft:16,},
	headerBot: {flexDirection:'row',},
	headerTab: {width:widnowWidth/2,height:60,alignItems:'center',justifyContent:'center',position:'relative'},
	headerTabText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#fff'},
	headerTabTextOn: {fontFamily:Font.NotoSansBold,color:'#FFD194'},
	activeLine: {width:widnowWidth/2,height:4,backgroundColor:'#FFD194',position:'absolute',left:0,bottom:0,zIndex:10,},

	todayFreeArea: {},
	todayFreeBtn: {},
	todayFreeBtnText: {},

	cmWrap: {paddingVertical:40,paddingHorizontal:20,},
	cmWrap2: {paddingTop:30,},
	cardView: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
	cardBtn: { width: ((widnowWidth / 2) - 30), height: ((widnowWidth / 2) - 30), marginTop: 20, position: 'relative' },	
	cardCont: {width: ((widnowWidth / 2) - 30), height: ((widnowWidth / 2) - 30), backfaceVisibility:'hidden'},
	cardFront: { backgroundColor: 'gray', },	
	cardBack: { backgroundColor: 'skyblue', },
	
})

export default Home