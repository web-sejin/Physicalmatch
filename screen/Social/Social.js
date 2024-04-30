import React, {useState, useEffect, useRef, useCallback} from 'react';
import {ActivityIndicator, Alert, Animated, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import FlipComponent from 'react-native-flip-component';

//import Font from "../../assets/common/Font";
//import ToastMessage from "../../components/ToastMessage";
//import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const Social = ({ navigation, route }) => {
	const cardData = [
		{ 'idx': 1, 'isFlipped':false, 'deg':'0deg', 'deg2':'180deg', 'name':'카드1' },
		{ 'idx': 2, 'isFlipped':false, 'deg':'0deg', 'deg2':'180deg', 'name':'카드2' },
		{ 'idx': 3, 'isFlipped':false, 'deg':'0deg', 'deg2':'180deg', 'name':'카드3' },
		{ 'idx': 4, 'isFlipped':false, 'deg':'0deg', 'deg2':'180deg', 'name':'카드4' },
		{ 'idx': 5, 'isFlipped':false, 'deg':'0deg', 'deg2':'180deg', 'name':'카드5' },
	];

	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
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
			setRouteLoad(true);
			setPageSt(!pageSt);
		}

		return () => isSubscribed = false;
	}, [isFocused]);

	useEffect(() => {
		cardList.map((item) => {			
		});
	}, []);

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
			{/* <Header navigation={navigation} headertitle={'기본양식'} /> */}
			<View style={{padding:20}}>
				<MultiSlider
					selectedStyle={{
						backgroundColor: 'gold',
					}}
					unselectedStyle={{
						backgroundColor: 'silver',
					}}
					values={[
						nonCollidingMultiSliderValue[0],
						nonCollidingMultiSliderValue[1],
					]}
					markerOffsetY={1}
					sliderLength={widnowWidth-50}
					value={[0]}
					min={-50}
					max={50}
					step={5}
					enableLabel={true}
					enabledOne={true}
					enabledTwo={true}
					onValuesChange={(e) => {
						console.log(e);
					}}
				/>
			</View>
			<ScrollView>
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
			</ScrollView>
			<View style={styles.gapBox}></View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: { flex: 1, backgroundColor: '#fff' },
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: { height: widnowHeight - 185, display: 'flex', alignItems: 'center', justifyContent: 'center' },
	indicator2: { marginTop: 62 },
	
	cardView: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 20 },
	cardBtn: { width: ((widnowWidth / 2) - 30), height: ((widnowWidth / 2) - 30), marginTop: 20, position: 'relative' },	
	cardCont: {width: ((widnowWidth / 2) - 30), height: ((widnowWidth / 2) - 30), backfaceVisibility:'hidden'},
	cardFront: { backgroundColor: 'gray', },	
	cardBack: { backgroundColor: 'skyblue', },	
})

export default Social