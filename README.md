# sgs-auth-project
Smilegate DEV Camp - PJ2. 인증 서버 만들기  
박소현C @JobJava

## Stack
### Backend
- Spring Boot 
- Spring Security
- MySQL
- Redis (Client Library는 Lettuce 사용)

### Frontend
- React / Redux
- React-Bootstrap

## 아키텍쳐
<img width="800" alt="아키텍쳐" src="https://user-images.githubusercontent.com/26567880/102894518-92051a80-44a6-11eb-9b0a-5902ea200a82.png">

## 기능 별 로직
- 공통 사항 : Access Token 과 Refresh Token 모두 JWT 사용

### 회원가입
[서버]
- 사용자 정보(email, nickname, name, password) 받아서 DB에 저장
- password 등록 시, Salt를 생성하고, 이 Salt 값으로 BCrypt Hasing 사용하여 password Encoding
- Salt 도 DB에 저장
- 사용자 권한 ROLE_USER 로 변경 (Email 인증을 통해 변경할 수도)
- 예외 발생 상황 : 중복 사용자 or 요청 시 잘못된 인자 값

[프론트]
- 사용자 등록 성공 시, 로그인 페이지로 이동

### Email 인증을 통한 회원가입
[서버]
- 회원가입 (회원가입만한 사용자의 권한은 ROLE_NOT_PERMITTED)
- 회원가입 완료 시, 사용자에게 인증 메일(인증 링크 포함) 보내기
- 사용자가 인증 링크를 클릭하면, 사용자 권한을 ROLE_USER 로 변경  
- ROLE_NOT_PERMITTED 사용자가 서버에 대한 서비스를 요구했을 시,   
[서버] 접근 금지  
[프론트] 회원 인증 요구 페이지로 이동

### 로그인
[서버]
- Access Token(유효시간 10분)과 Refresh Token(유효시간 2일) 발행
- Redis에 유효기간 설정하여 Refresh Token 저장 → Key : Email, Value : Refresh Token 
- 응답 헤더에 토큰들 넣어주기
- 예외 발생 상황 : 가입되지 않은 사용자 or 비밀번호 틀림 or 소셜 로그인 가입자인 경우 or 요청 시 잘못된 인자 값

[프론트]
- 응답 헤더를 통해 받은 Access Token 과 Refresh Token 쿠키에 저장

### 로그아웃
[서버]
- 사용자 Email에 해당하는 Refresh Token Redis에서 제거

[프론트]
- 쿠키에 저장된 Access Token과 Refresh Token 삭제
- 로그아웃 성공 시, 로그인 페이지로 이동

### 인증 API 요청
[프론트]
- 항상 Access Token 을 헤더에 넣고 요청함

[서버]
- 헤더에서 Access Token 받아오고, 유효성 체크 
1. Access Token 이 유효한 경우
    - 토큰으로부터 Authentication 받아옴
    - Security Context 에 Authentication 저장
    
2. Access Token 이 만료된 경우
    - Access Token 에서 UserPK(Email), Role 추출. (DB 접근 안 하고, 기존 데이터 재활용 하는 방식)
    - Redis 에서 Refresh Token 확인
    
    2-1. Refresh Token 이 유효할 경우 - Redis 에 존재 & (사용자가 갖고 있던 토큰의 UserPk 와 Redis 에 저장된 토큰의 UserPk가 같아야함)
    - Access Token 재발급
    - Email을 통해 Authentication 받아옴
    - SecurityContext 에 Authentication 객체 저장
    
    2-2. Access Token이 없거나, Access Token과 Refresh Token 둘 다 유효하지 않을 경우, Spring Security의 Filter 에서 걸림.
    - 인증 X → Authentication Entry Point
    - 권한 X → Access Denied Handler 
    - 다시 로그인 해야함
    
3. 응답 헤더에 Access Token 넣어주기

[프론트]
- 인증 성공한 경우, 재발급 받은 Access Token 쿠키에 저장. 작업 실행.
- 인증 실패한 경우, 로그인 페이지로 이동

## 스크린샷
<img width="400" alt="회원가입" src="https://user-images.githubusercontent.com/26567880/102802665-5b71c600-43fa-11eb-98e9-8b5e3b9cc1a9.png">
<img width="400" alt="인증메일" src="https://user-images.githubusercontent.com/26567880/102802693-64fb2e00-43fa-11eb-9caa-7e0d53c5fb26.png">
<img width="400" alt="로그인" src="https://user-images.githubusercontent.com/26567880/102802683-62003d80-43fa-11eb-89c9-d4be3b549ffa.png">

- 일반 User 페이지 
<img width="700" alt="사용자페이지_2" src="https://user-images.githubusercontent.com/26567880/103175277-18a56780-48ac-11eb-8348-e0ebcd4d5281.png">

- Admin 페이지
<img width="700" alt="관리자 페이지" src="https://user-images.githubusercontent.com/26567880/103175284-1f33df00-48ac-11eb-9cff-6276a8ddee22.png">

## Todo
[서버]
- OAuth2 소셜 로그인
- Swagger 로 API 관리해보기
- Admin 기능 추가

[프론트]
- ~Redux의 Store로 state를 관리하여, 사용자 정보 표시~ (Done)
- Redux의 Dispatch 사용하여, 로딩 중 스핀 띄우기
- Typescript 적용하기

