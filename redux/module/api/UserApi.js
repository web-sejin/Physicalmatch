/**
 * Post API
 *
 */
import { BASE_URL } from '../../../Utils/APIConstant';
import ApiManager from '../../../Utils/ApiManager';
const $http = new ApiManager();

export default {
  //회원 로그인
	member_login: async (data) => {
		const url = `${BASE_URL}api/member/`;
		//method : member_sendSms
		//return await $http.multipart(url + 'member_login', data);
    return await $http.multipart(url, data); 
	},
  //회원 정보 확인
	member_info: async (data) => {
		const url = `${BASE_URL}api/member/`;
		// const payloadString = Object.entries(data).map( ([key,value]) => ( value && key+'='+value )).filter(v=>v).join('&');
		// console.log('member_info - payloadString : ', payloadString);
		// return await $http.get(url + 'GetMyInfo?' + payloadString, data);
    return await $http.multipart(url, data); 
	},
  //회원정보 변경
  member_update: async (data) => {
    const url = `${BASE_URL}api/`;
    //method : member_update
    return await $http.multipart(url, data);
  },
  //로그아웃
  member_logout: async (data) => {
    const url = `${BASE_URL}api/`;
    //method : member_logout
    return await $http.post(url + 'logout', data);
  },
  //탈퇴하기
  member_out: async (data) => {
    const url = `${BASE_URL}api/`;
    //method : member_out
    return await $http.multipart(url + 'out_member', data);
  },

};