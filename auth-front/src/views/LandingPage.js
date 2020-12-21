import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { DOMAIN } from '../utils/enum';
import { Button } from 'react-bootstrap';

function LandingPage (props) {
  const onClickHandler = () => {
    const reqBody = {
      email: 'ff@ff.com'
    }

    axios({
      method: 'post',
      url: DOMAIN + '/api/user/logout',
      data: reqBody,
    })
      .then((res) => {
        console.log(res.data);
        props.history.push('/login');
      })
      .catch((err) => {
        console.log(err);
      });

  };

  return (
    <div
      style={{
        paddingTop: '30px',
        paddingLeft: '50px',
      }}
    >
      <h2>My Page</h2>
      <Button variant='info' type='submit' onClick={onClickHandler}>로그아웃</Button>
    </div>
  );
}

export default withRouter(LandingPage);