import React, {useState, useEffect, useRef,useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Swiper from 'react-native-web-swiper';

//import Font from "../../assets/common/Font";
//import ToastMessage from "../../components/ToastMessage";
//import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const NoticeList = ({navigation, route}) => {	
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
	const [activeDot, setActiveDot] = useState(0);
	const swiperRef = useRef(null);

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

	return (
		<SafeAreaView style={styles.safeAreaView}>
			{/* <Header navigation={navigation} headertitle={'기본양식'} /> */}			
			<ScrollView>				
				<View style={styles.swiperView}>
					<Swiper					
						ref={swiperRef}	
						controlsEnabled={false}
						onIndexChanged={(e) => {
							//console.log(e);
							setActiveDot(e);
						}}
					>
						<View style={styles.swiperWrap}>
							<AutoHeightImage width={widnowWidth} source={require("../../assets/image/book_img1.jpg")} />
						</View>
						<View style={styles.swiperWrap}>
							<AutoHeightImage width={widnowWidth} source={require("../../assets/image/book_img2.jpg")} />
						</View>
						<View style={styles.swiperWrap}>
							<AutoHeightImage width={widnowWidth} source={require("../../assets/image/book_img3.jpg")} />
						</View>
					</Swiper>
				</View>
				<View style={styles.pagination}>
					<TouchableOpacity
						style={[styles.paginationBtn]}
						activeOpacity={opacityVal}
						onPress={() => {
							setActiveDot(0);
							swiperRef.current.goTo(0);
						}}
					>
						<AutoHeightImage
							width={(widnowWidth / 6) - 10}
							source={require("../../assets/image/book_img1.jpg")}
							style={[activeDot == 0 ? styles.paginationActive : null]}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.paginationBtn]}
						activeOpacity={opacityVal}
						onPress={() => {
							setActiveDot(1);
							swiperRef.current.goTo(1);
						}}
					>
						<AutoHeightImage
							width={(widnowWidth / 6) - 10}
							source={require("../../assets/image/book_img2.jpg")}
							style={[activeDot == 1 ? styles.paginationActive : null]}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.paginationBtn]}
						activeOpacity={opacityVal}
						onPress={() => {
							setActiveDot(2);
							swiperRef.current.goTo(2);
						}}
					>
						<AutoHeightImage
							width={(widnowWidth / 6) - 10}
							source={require("../../assets/image/book_img3.jpg")}
							style={[activeDot == 2 ? styles.paginationActive : null]}
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.gapBox}></View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	gapBox: {height:80,backgroundColor:'#fff'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
	indicator2: { marginTop: 62 },
	
	pagination: {},
	swiperView: { height: 250, },
	swiperWrap: { height: 250, },
	pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
	paginationBtn: { width: (widnowWidth / 6), paddingHorizontal: 5, },
	paginationActive: {borderWidth:2,borderColor:'red'},	
})

export default NoticeList