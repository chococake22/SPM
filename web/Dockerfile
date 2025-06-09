FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 전체 소스 복사 (tsconfig.json 포함)
COPY . .

# 의존성 설치
RUN yarn install --frozen-lockfile

# 빌드
RUN yarn build

# 포트 열기
EXPOSE 3000

# 앱 실행
CMD ["yarn", "start"]
