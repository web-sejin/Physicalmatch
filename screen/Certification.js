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
    console.log('본인인증 response::', response);

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

    if (params?.type == 'IdSearchResult') {
      idSearchHandler(isSuccess, response);
    }

    if (params?.type == 'PasswordChange') {
      pwChangeHander(isSuccess, response);
    }
  };

  //회원가입 본인인증
  const registerHandler = async (isSuccess, response) => {
    if (isSuccess) {
      console.log('본인인증 완료', response);

      let sData = {
        basePath: "/api/member/",
        type: "IsPass",
        pass_type: 0,
        test_yn: 'n',
        imp_uid: response?.imp_uid,
      };  
      const impRes = await APIs.send(sData);    
      console.log('iamport_cert_join_status', impRes);
      if(impRes){
        //성공시
        let phones = phoneFormat(iamport_cert_join_status.phone);
        let date = moment(iamport_cert_join_status.birthday);
        //date = date.format('YYYY/MM/DD');
        dateAge = date.format('YYYY');

        navigation.replace('RegisterStep2', {
          age: dateAge,
          //birthday2: iamport_cert_join_status.birthday,
          hp: phones,
          //gender: iamport_cert_join_status.gender == '1' ? '남성' : '여성',
          gender: iamport_cert_join_status.gender == '1' ? 0 : 1,
        });
      }else{
        //실패
        console.log('본인인증 회원가입 실패시', iamport_cert_join_status);
        if (iamport_cert_join_status.result_text != '') {
          ToastMessage(iamport_cert_join_status.result_text);
        } else {
          ToastMessage('인증이 완료되지 못했습니다.');
        }

        navigation.reset({
          routes: [
            {
              name: 'Login',
            },
          ],
        });
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
  // const idSearchHandler = async (isSuccess, response) => {
  //   if (isSuccess) {
  //     console.log('본인인증 아이디 찾기 완료', response);

  //     const formData = new FormData();
  //     formData.append('imp_uid', response?.imp_uid);

  //     const iamport_cert_findid_status = await Api.multipartRequest(
  //       formData,
  //       '/app/iamport_cert_findid',
  //     );

  //     console.log('iamport_cert_findid_status', iamport_cert_findid_status);

  //     if (iamport_cert_findid_status.result == 'success') {
  //       navigation.replace('IdSearchResult', {
  //         id: iamport_cert_findid_status.mb_id,
  //       });
  //     } else {
  //       //실패
  //       console.log('본인인증 아이디찾기 실패시', iamport_cert_findid_status);

  //       if (iamport_cert_findid_status.result_text != '') {
  //         ToastMessage(iamport_cert_findid_status.result_text);
  //       } else {
  //         ToastMessage('인증이 완료되지 못했습니다.');
  //       }

  //       //navigation.goBack();
  //       navigation.goBack();
  //     }
  //   } else {
  //     Alert.alert(response.error_code, response.error_msg);

  //     //navigation.replace('IdSearch');
  //     navigation.goBack();
  //   }
  // };

  // //비밀번호 변경하기
  // const pwChangeHander = async (isSuccess, response) => {
  //   if (isSuccess) {
  //     console.log('본인인증 비밀번호변경 완료', response);

  //     const formData = new FormData();
  //     formData.append('imp_uid', response?.imp_uid);
  //     formData.append('mb_id', params?.id);

  //     const iamport_cert_findpw_status = await Api.multipartRequest(
  //       formData,
  //       '/app/iamport_cert_findpw',
  //     );

  //     console.log('iamport_cert_findpw_status', iamport_cert_findpw_status);

  //     if (iamport_cert_findpw_status.result == 'success') {
  //       navigation.replace('PasswordChange', {
  //         id: params?.id,
  //         unique_key: iamport_cert_findpw_status.unique_key,
  //       });
  //     } else {
  //       //실패
  //       console.log(
  //         '본인인증 비밀번호 변경 실패시',
  //         iamport_cert_findpw_status,
  //       );

  //       if (iamport_cert_findpw_status.result_text != '') {
  //         ToastMessage(iamport_cert_findpw_status.result_text);
  //       } else {
  //         ToastMessage('인증이 완료되지 못했습니다.');
  //       }

  //       //navigation.replace('PasswordSearch');
  //       navigation.goBack();
  //     }
  //   } else {
  //     Alert.alert(response.error_code, response.error_msg);

  //     //navigation.replace('PasswordSearch');
  //     navigation.goBack();
  //   }
  // };

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
