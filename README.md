# SPM
쇼핑몰 프로젝트

# Port 구조
Front: http://localhost:3000
Backend: http://localhost:3001
DB: http://localhost:3002

# json DB 서버 실행
json-server --watch db.json --port 3002

# api swagger 최신화
yarn build:swagger