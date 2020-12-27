import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user';
import axios from 'axios';
import { DOMAIN } from '../utils/enum';
import Cookies from 'js-cookie';

function Auth (Componet, option, props) {
  // dispatch 사용하기
  const dispatch = useDispatch();

  function AuthCheck (props) {
    // Access Token 쿠키에서 읽고, 인증 요청 헤더에 넣기
    const jwtToken = Cookies.get('access-token');

    useEffect(() => {
      axios({
        method: 'get',
        url: DOMAIN + '/api/loggedInUser/myInfo',
        headers: {
          'access-token': jwtToken,
        },
      })
        .then((res) => {
          console.log('Auth check');
          const user = res.data;
          console.log(user);

          // user state 변화주기
          dispatch(login(user));

          // Cookie에 토큰 저장
          Cookies.set('access-token', res.headers['access-token']);
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

export default Auth;