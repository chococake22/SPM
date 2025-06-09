FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 전체 프로젝트 복사 전 필요한 파일 먼저 복사
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 전체 소스 복사
COPY . .

# 포트 오픈
EXPOSE 3001

# Swagger 빌드 후 서버 실행
CMD ["sh", "-c", "yarn build:swagger && yarn start"]
