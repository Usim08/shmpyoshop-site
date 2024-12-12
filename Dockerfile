# Node.js 이미지를 베이스로 사용
FROM node:22

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 의존성 파일을 복사
COPY package.json yarn.lock* package-lock.json* ./ 

# npm으로 의존성 설치
RUN npm install

# 프로젝트 파일을 컨테이너로 복사
COPY . . 

# 앱 실행 명령어
CMD ["npm", "start"]
