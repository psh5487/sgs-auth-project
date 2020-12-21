import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { request } from '../utils/axios';
import { Form, Button } from 'react-bootstrap';

function RegisterPage (props) {
  const [Email, setEmail] = useState('');
  const [NickName, setNickName] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };

  const onNickNameHandler = (e) => {
    setNickName(e.currentTarget.value);
  };

  const onNameHandler = (e) => {
    setName(e.currentTarget.value);
  };

  const onPasswordHanlder = (e) => {
    setPassword(e.currentTarget.value);
  };

  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (Password === ConfirmPassword) {
      const reqBody = {
        email: Email,
        nickname: NickName,
        name: Name,
        password: Password,
      };

      request('post', '/api/user/join', reqBody)
        .then((res) => {
          console.log(res);
          if (res) {
            alert('Register Success');
            props.history.push('/login');
          } else {
            alert('Register Failed. (Already existed user)');
          }
        })
    } else {
      alert('Password is not corresponding');
    }
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
      <h2>회원가입</h2>
      <br />
      <Form onSubmit={onSubmitHandler}>
        <Form.Group controlId='formEmail'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email' value={Email} onChange={onEmailHandler} placeholder='Email' required />
        </Form.Group>

        <Form.Group controlId='formNickName'>
          <Form.Label>ID(NickName)</Form.Label>
          <Form.Control type='text' value={NickName} onChange={onNickNameHandler} placeholder='ID(NickName)' required />
        </Form.Group>

        <Form.Group controlId='formName'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text' value={Name} onChange={onNameHandler} placeholder='Name' required />
        </Form.Group>

        <Form.Group controlId='formPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={Password} onChange={onPasswordHanlder} placeholder='Password' required />
        </Form.Group>

        <Form.Group controlId='formConfirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type='password' value={ConfirmPassword} onChange={onConfirmPasswordHandler} placeholder='Confirm Password' required />
        </Form.Group>
        <br />
        <Button variant='info' type='submit'>Submit</Button>
      </Form>
    </div>
  );
}

export default withRouter(RegisterPage);