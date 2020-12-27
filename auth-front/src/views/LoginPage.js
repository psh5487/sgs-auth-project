import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { DOMAIN } from '../utils/enum';
import Cookies from 'js-cookie';
import { Form, Button } from 'react-bootstrap';

function LoginPage (props) {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };

  const onPasswordHanlder = (e) => {
    setPassword(e.currentTarget.value);
  };

  // dispatch 사용하기
  const dispatch = useDispatch();

  // 로그인 버튼 핸들러
  const onSubmitHandler = (e) => {
    e.preventDefault();

    const reqBody = {
      email: Email,
      password: Password,
    };

    axios({
      method: 'post',
      url: DOMAIN + '/api/user/login',
      data: reqBody,
    })
      .then((res) => {
        console.log('Login');

        const user = res.data;
        console.log(user);

        // user state 변화주기
        dispatch(login(user));

        // Cookie에 토큰 저장
        Cookies.set('access-token', res.headers['access-token']);
        Cookies.set('refresh-token', res.headers['refresh-token']);

        // 랜딩페이지로 이동
        props.history.push('/');
      })
      .catch((err) => {
        console.log(err);
        alert('Login Failed. ' + err);
      });
  };

  return (
    <div
      style={{
        paddingTop: '30px',
        paddingLeft: '50px',
        paddingRight: '100px',
        width: '60%'
      }}
    >
      <h2>Log In</h2>
      <br />
      <Form onSubmit={onSubmitHandler}>
        <Form.Group controlId='formEmail'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email' value={Email} onChange={onEmailHandler} placeholder='Email' required />
        </Form.Group>

        <Form.Group controlId='formPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={Password} onChange={onPasswordHanlder} placeholder='Password' required />
        </Form.Group>
        <br />
        <Button variant='info' type='submit'>로그인</Button>
      </Form>
      <br />
      <Link to='/register'>
        <Button variant='warning' type='submit'>회원가입</Button>
      </Link>
    </div>
  );
}

export default withRouter(LoginPage);