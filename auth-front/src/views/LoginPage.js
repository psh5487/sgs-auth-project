import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { request } from '../utils/axios';
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

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const reqBody = {
      email: Email,
      password: Password,
    };

    request('post', '/api/user/login', reqBody)
      .then((res) => {
        console.log(res);
        if (res) {
          props.history.push('/');
        } else {
          alert('Login Failed');
        }
      })
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
    </div>
  );
}

export default withRouter(LoginPage);