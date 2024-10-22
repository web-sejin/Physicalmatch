import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

const ToastMessage = ( message, duration, position, offset, message2 = '', tabState = '0') => {
	//console.log('parsedParams :::: ', tabState);
	Toast.show({
		type    : 'custom_type', //success | error | info
		position: position == '1' ? 'top' : 'bottom',
		text1   : message,
		text2   : message2,
		props: { tabState: tabState },
		visibilityTime: duration ? duration : 2000,
		autoHide: true,
		topOffset: (Platform.OS === 'ios' ? 10 : 10),
		bottomOffset: offset ? offset + 100 : 100,
		onShow: () => {},
		onHide: () => {}
	});
}

export default ToastMessage;