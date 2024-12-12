# 1. 사용하려는 Node.js 버전 지정
FROM node:20

# 2. 작업 디렉터리 설정
WORKDIR /app

# 3. 종속성 파일 복사 (package.json, lock 파일)
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 4. 의존성 설치 (yarn이나 npm 사용)
RUN yarn install

# 5. 애플리케이션 코드 복사
COPY . .

# 6. 앱 실행 포트 설정 (예: 3000)
EXPOSE 3000

# 7. 애플리케이션 실행 명령어
CMD ["yarn", "start"]
