import axios from 'axios';
import {BASE_URL, BASE_PATH} from "./Constants";

class APIs {
    state;
    constructor(){
        //super(props);

        this.state = {
            isLoading: false,
            url: BASE_URL,
            path: BASE_PATH,
            option: {
                method: 'POST',
                headers: {
                //Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                },
                body: null,
            },
            dataSource: {},
        }
    }

    //formdata 로 변경
    makeFormData(datas = {}) {
        let formData = new FormData();
        for (let [key, value] of Object.entries(datas)) {
            let is_array = Array.isArray(value);
            if(is_array){
                //console.log(key+'////'+value);
                value.forEach((val,idx) => {
                    formData.append(`${key}[]`,val)
                });
            }else{
                formData.append(key, value);
            }
        }
        // this.state.option.body = formdata;
        return formData
    }

    // 기본
    
    send = async (datas, method = 'POST') => {
        try {
            const response = await axios(BASE_URL + datas.basePath, {
                method,
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'multipart/form-data',
                    'Cache-Control': 'no-cache',
                    'Accept-Encoding': 'gzip, deflate',
                    'cache-control': 'no-cache',
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                    //'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
                },
                data: datas,
            });
            const responseJson = await response.data;
            return responseJson;
        } catch (error) {
            console.log('APIs send error', error)
            return {
                code: -9999,
                message: error,
            };
        }
    }

    multipartRequest = async (
        body,
        stringify = true,
        method = 'POST'
    ) => {
        //console.log('body ::: ',body);
        try {
            const response = await fetch(BASE_URL + body._parts[0][1], {
                method,
                headers: {
                    'Accept': '*/*',
                    'content-type': 'multipart/form-data',
                    'Cache-Control': 'no-cache',
                    'Accept-Encoding': 'gzip, deflate',
                    'cache-control': 'no-cache',
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                    //'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
                },
                credentials : 'include',
                body: body,
            });

            const responseJson = await response.json();
            return responseJson;

        } catch (error) {
            return {
                message: error,
            };
        }
    };
}

export default new APIs();