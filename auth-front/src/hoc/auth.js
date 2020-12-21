import React, { useEffect } from 'react';
import axios from 'axios';
import DOMAIN from '../utils/enum';

export default function (Componet, option, adminRoute = null) {
  // option : null => 아무나 출입가능, true => 로그인한 유저만 출입 가능, false => 로그인한 유저는 출입 불가능
  function AuthCheck (props) {
    // useEffect를 사용해서 초기 검증 실행
    useEffect(() => {
      // 토큰 읽기

      // 사용자 정보 받기
      // 로그인을 하지 않았을 때(option이 true) 로그인 강제 이동
      // 로그인 했을 경우
      // 관리자인 경우 - 관리자 페이지로 이동
      // 관리자 아닌 경우 - LandingPage로 이동
      axios({
        method: 'post',
        url: DOMAIN + '/api/loggedInUser/myInfo',
        data: reqBody,
      })
        .then((res) => {
          // state 변경
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);

    return <Componet />;
  }

  return AuthCheck;
}