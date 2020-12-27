import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/user';
import axios from 'axios';
import Cookies from 'js-cookie';
import { DOMAIN } from '../utils/enum';
import { Button, Table } from 'react-bootstrap';

function AdminPage (props) {
  console.log('Admin Page');

  // useSelector로 현재 사용자 state 조회
  const userInfo = useSelector((state) => state.user.userInfo);
  let isAdmin = false;

  if (userInfo) {
    if (userInfo.role === 'ROLE_ADMIN') {
      console.log('role admin');
      isAdmin = true;
    }
  }

  // 전체 사용자 리스트
  const [userList, setUserList] = useState([]);

  // dispatch 사용하기
  const dispatch = useDispatch();

  /* 로그아웃 처리 */
  const onClickHandler = () => {
    const reqBody = {
      email: userInfo.email
    }

    axios({
      method: 'post',
      url: DOMAIN + '/api/user/logout',
      data: reqBody,
    })
      .then((res) => {
        console.log(res + ' Logout');

        // Cookie에서 토큰 제거하기
        Cookies.remove('access-token');
        Cookies.remove('refresh-token');

        // user state 변화주기
        dispatch(logout());

        // 로그인 페이지로 이동
        props.history.push('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /* 회원 표 그리기 */
  useEffect(() => {
    // Access Token 쿠키에서 읽고, 인증 요청 헤더에 넣기
    const jwtToken = Cookies.get('access-token');

    axios({
      method: 'get',
      url: DOMAIN + '/api/loggedInUser/allUserInfo',
      headers: {
        'access-token': jwtToken,
      },
    })
      .then((res) => {
        console.log('Drawing Chart')
        setUserList(res.data);
      })
      .catch((err) => {
        console.log(err);
        props.history.push('/login');
      });
  }, []);

  return (
    <div
      style={{
        paddingTop: '30px',
        paddingLeft: '50px',
        paddingRight: '50px',
      }}
    >
      <h2>User Page</h2>
      <Button variant='warning' type='submit' onClick={onClickHandler}>로그아웃</Button><br /><br />

      <h2>My Info</h2>
      {userInfo &&
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nick Name(Id)</th>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{userInfo.email}</td>
              <td>{userInfo.nickname}</td>
              <td>{userInfo.name}</td>
              <td>{userInfo.role}</td>
            </tr>
          </tbody>
        </Table>}
      <br />

      <h2>All User Info</h2>
      {isAdmin &&
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nick Name(Id)</th>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((u) => (
              <tr key={u.email}>
                <td>{u.email}</td>
                <td>{u.nickname}</td>
                <td>{u.name}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>}
    </div>
  );
}

export default withRouter(AdminPage);