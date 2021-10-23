<p align="center">
<img src="https://user-images.githubusercontent.com/55642464/136829252-280853bd-159b-4fe3-a0c6-de72c855fd0d.png" height="120" />
<img src="https://user-images.githubusercontent.com/55642464/136829261-23ef9858-dd30-45df-a8a7-fbdca5d4537f.png" height="120" />
<img src="https://user-images.githubusercontent.com/55642464/136829270-6e7ff324-85dd-47d7-a213-0354b7f430a1.png" height="120" />
</p>
<h1 align="center">사용자 친화적 비접촉 키오스크</h1>
<p align="center">키오스크와 직접 접촉하지 않아도 카메라만을 이용하여 동작할 수 있는 키오스크 입니다.</p>
<p align="center"><a href="https://blissful-chandrasekhar-bbc6d1.netlify.app/">데모 페이지</a></p>

## 기능 설명
#### - 손가락 추적, 버튼 동작
<img src="https://user-images.githubusercontent.com/55642464/136829930-eaeff88f-22b0-4acb-a843-aeb42172d05a.png" height="350" />
카메라를 이용하여 실시간으로 검지손가락의 위치를 인식하고 화면에 표시해줍니다. 일정 시간동안 포인터가 버튼 위에 있으면 버튼이 동작됩니다.

#### - 모드 선택
<img src="https://user-images.githubusercontent.com/55642464/136830368-9d35fa3a-4514-46c4-85e7-aa81e38d6343.png" height="350" />
키오스크에 익숙하지 않은 디지털 소외계층을 위하여 일반 주문모드와 쉬운 주문모드 2가지로 주문 모드를 분류했습니다.

#### - 일반 주문
<p align="center">
<img src="https://user-images.githubusercontent.com/55642464/136830892-f40831d2-4af5-4b1f-a2ef-a02d148a7180.png" height="350" />
<img src="https://user-images.githubusercontent.com/55642464/136830935-be977331-8b07-4d80-bf4b-1da26f015fe5.png" height="350" />
<img src="https://user-images.githubusercontent.com/55642464/136830961-67a6bc45-c530-4c2a-9e11-04b6481657f0.png" height="350" />
</p>
키오스크가 익숙한 사용자들에게 추천되는 주문 방식입니다. 좌우 버튼으로 메뉴를 변경할 수 있으며, 메뉴를 선택하면 메뉴에 관한 상세 모달창이 뜹니다. 주문화면에서 하단에 포인터를 이동시키면 주문 결과창이 나타납니다.

#### - 쉬운 주문
<p align="center">
<img src="https://user-images.githubusercontent.com/55642464/136831730-b72ba683-7366-4c2b-a34c-f876e737f717.png" height="350" />
<img src="https://user-images.githubusercontent.com/55642464/136831757-f4f704d2-eda7-4144-897d-273e030f528a.png" height="350" />
</p>

키오스크 사용에 어려움이 있는 사용자들에게 추천되는 주문 방식입니다. 일반 주문 보다는 글씨와 메뉴 카드를 크게 배치 하였습니다. 버튼의 배치는 시선이 가장 자연스러운 위 -> 아래 로 배치하였으며, 버튼들은 모두 버튼이라는 것을 인지시키기 위하여 영역이 확실하도록 구분했습니다. 
쉬운 주문 모드에서는 옵션 선택은 따로 없으며, 메뉴 선택시 기본 옵션의 메뉴가 선택됩니다.

#### - 얼굴 인식, 메뉴 추천
<p align="center">
<img src="https://user-images.githubusercontent.com/55642464/136832122-d8a3542e-123f-4d86-a2be-6777b3b46214.png" height="300" />
<img src="https://user-images.githubusercontent.com/55642464/136832148-4045694b-e45e-4a4c-8bf9-2f8c8e063e4b.png" height="350" />
<img src="https://user-images.githubusercontent.com/55642464/136832407-daac8091-4ee5-415f-94b1-4176a0c70e31.png" height="250" />
</p>
키오스크 사용 시 사용자의 얼굴을 인식하여 성별, 연령대 정보를 추출합니다. 현재 사용자의 주문한 날짜, 시간대, 성별, 연령대 정보를 바탕으로 가장 주문 가능성이 높은 메뉴를 카테고리별로 3개씩 추천해줍니다. 메뉴 추천은 나이브 베이지안 방식이 사용됐습니다.


## 사용 도구
- 클라이언트 : React.js
- 서버 : Node.js (Express.js)
- 손 인식 : tensorflow.js, @MediaPipe/hand.js
- 데이터베이스 : csv 파일 사용
- db(csv 파일) 제작 : python


# 설치 방법 (Github 저장소에서 로컬에 소스코드 내려받기)
$ git clone https://github.com/hsj-96/untactkiosk2

# 내려받은 소스코드가 담긴 폴더로 이동
$ cd untactkiosk2

# 라이브러리 설치 (front, server 폴더 모두)
$ cd front
$ npm install
$ cd ../server
$ npm install

# 실행 (front 폴더에서)
$ cd front
$ npm run start
