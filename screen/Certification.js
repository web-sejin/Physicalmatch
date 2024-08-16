import React from 'react';
//import Layout from '../../components/common/Layout';
import IMP, {IMPConst} from 'iamport-react-native';
import Loading from './Loading';
import {Alert} from 'react-native';
import APIs from '../assets/APIs';
import ToastMessage from '../components/ToastMessage';

const Certification = props => {
  const {navigation, route} = props;
  const {params} = route;

  //결제 저장 데이터
  const data = {
    merchant_uid: `mid_${new Date().getTime()}`,
    m_redirect_url: IMPConst.M_REDIRECT_URL,
  };

  const callback = response => {
    //console.log('본인인증 response::', response);

    //response:: {"imp_uid": "imp_835217626476", "merchant_uid": "mid_1719463217604", "request_id": "req_1719463218082", "success": "true"}
    const {imp_success, success} = response;

    const isSuccess = !(
      imp_success === 'false' ||
      imp_success === false ||
      success === 'false' ||
      success === false
    );

    if (params?.type == 'Join') {
      registerHandler(isSuccess, response);
    }

    if (params?.type == 'Id_find') {
      idSearchHandler(isSuccess, response);
    }

    if (params?.type == 'Pw_find') {
      pwChangeHander(isSuccess, response);
    }

    if (params?.type == 'change_number') {
      numberChangeHander(isSuccess, response);
    }
  };

  //회원가입 본인인증
  const registerHandler = async (isSuccess, response) => {
    if (isSuccess) {
      //console.log('본인인증 완료', response);

      let sData = {
        basePath: "/api/member/",
        type: "IsPass",
        pass_type: 0,
        test_yn: 'n',
        imp_uid: response?.imp_uid,
      };  
      const impRes = await APIs.send(sData);    
      console.log('iamport_cert_join_status', impRes);

      if(impRes.code == 200){
        //성공시
        let dateAge = impRes.birth.split('-');
        navigation.replace('RegisterStep3', {
          age: dateAge[0],
          phonenumber: impRes.phone,
          gender: impRes.gender == 'male' ? 0 : 1,
          name: impRes.name,
          accessRoute:params?.route,
          prvChk4:params?.prvChk4,
        });
      }else{
        //실패
        console.log('본인인증 회원가입 실패시', impRes);
        if (impRes.msg != '') {
          ToastMessage(impRes.msg);
        } else {
          ToastMessage('인증이 완료되지 못했습니다.');
        }

        // navigation.reset({
        //   routes: [
        //     {
        //       name: 'Login',
        //     },
        //   ],
        // });
        setTimeout(function(){
          navigation.goBack();
        }, 2000);
      }
    } else {
      Alert.alert(response.error_code, response.error_msg);
      navigation.reset({
        routes: [
          {
            name: 'Login',
          },
        ],
      });
    }
  };

  //아이디 찾기
  const idSearchHandler = async (isSuccess, response) => {
    if (isSuccess) {
      console.log('본인인증 아이디 찾기 완료', response);

      let sData = {
        basePath: "/api/member/",
        type: "IsPass",
        pass_type: 1,
        test_yn: 'n',
        imp_uid: response?.imp_uid,
      };  
      const impRes = await APIs.send(sData);    
      console.log('iamport_cert_findid_status', impRes);

      if (impRes.code == 200) {
        navigation.navigate('FindId', {
          id: impRes.id,
        });
      } else {
        //실패
        console.log('본인인증 아이디찾기 실패시', impRes);

        if (impRes.msg != '') {
          ToastMessage(impRes.msg);
        } else {
          ToastMessage('인증이 완료되지 못했습니다.');
        }

        setTimeout(function(){
          navigation.goBack();
        }, 2000);
      }
    } else {
      Alert.alert(response.error_code, response.error_msg);

      //navigation.replace('IdSearch');
      setTimeout(function(){
        navigation.goBack();
      }, 2000);
    }
  };

  //비밀번호 변경하기
  const pwChangeHander = async (isSuccess, response) => {
    if (isSuccess) {
      let sData = {
        basePath: "/api/member/",
        type: "IsPass",
        pass_type: 2,
        member_id: params?.member_id,
        test_yn: 'n',
        imp_uid: response?.imp_uid,
      };  
      const impRes = await APIs.send(sData);    
      console.log('iamport_cert_findpw_status', impRes);

      if (impRes.code == 200) {
        navigation.navigate('FindPw', {
          idx: impRes.data,
          certState: 'y',
        });
      } else {
        //실패
        console.log('본인인증 비밀번호찾기 실패시', impRes);

        if (impRes.msg != '') {
          ToastMessage(impRes.msg);
        } else {
          ToastMessage('인증이 완료되지 못했습니다.');
        }

        setTimeout(function(){
          navigation.goBack();
        }, 2000);
      }
    } else {
      Alert.alert(response.error_code, response.error_msg);

      //navigation.replace('PasswordSearch');
      setTimeout(function(){
        navigation.goBack();
      }, 2000);
    }
  };

  //로그인 정보 변경 - 핸드폰번호
  const numberChangeHander = async (isSuccess, response) => {
    if (isSuccess) {
      //console.log('본인인증 완료', response);

      let sData = {
        basePath: "/api/member/",
        type: "IsPass",
        pass_type: 3,
        test_yn: 'n',
        imp_uid: response?.imp_uid,
      };  
      const impRes = await APIs.send(sData);    
      console.log('iamport_cert_cange_status', impRes);

      if(impRes.code == 200){
        //성공시
        navigation.replace('ModifyLogin', {          
          phonenumber: impRes.phone,          
        });
      }else{
        //실패
        console.log('본인인증 번호변경 실패시', impRes);
        if (impRes.msg != '') {
          ToastMessage(impRes.msg);
        } else {
          ToastMessage('인증이 완료되지 못했습니다.');
        }
        setTimeout(function(){
          navigation.goBack();
        }, 2000);
      }
    } else {
      Alert.alert(response.error_code, response.error_msg);
      setTimeout(function(){
        navigation.goBack();
      }, 2000);
    }
  };

  return (
    <IMP.Certification
      userCode="imp36280332"
      loading={<Loading />}
      data={data}
      callback={callback} // 결제 종료 후 콜백
    />
  );
};

export default Certification;
