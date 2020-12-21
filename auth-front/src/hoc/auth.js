import React, { useEffect } from 'react';
import axios from 'axios';
import { DOMAIN } from '../utils/enum';
import Cookies from 'js-cookie';

export default function (Componet, option, adminRoute = null) {
  // option :
  // null => 아무나 접근 가능, true => 로그인한 유저만 접근 가능, false => 로그인한 유저는 접근 불가능
  function AuthCheck (props) {
    // useEffect를 사용해서 초기 검증 실행
    useEffect(() => {
      // Access Token 쿠키에서 읽고, 인증 요청 헤더에 넣기
      const jwtToken = Cookies.get('access-token');

      axios({
        method: 'get',
        url: DOMAIN + '/api/loggedInUser/myInfo',
        headers: {
          'access-token': jwtToken,
        },
      })
        .then((res) => {
          console.log('Auth check')
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
          props.history.push('/login');
        });

    }, []);

    return <Componet />;
  }

  return AuthCheck;
}