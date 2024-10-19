
# base image는 node image로 시작한다. npm과 yarn이 모두 설치되어 있다.
FROM nginx:stable-alpine

# nginx의 기본 service를 제거한다.
RUN rm -rf /etc/nginx/sites-enabled/default

# nginx에 serving할 html의 설정파일을 복사한다.
COPY nginx.conf /etc/nginx/conf.d

# 작업영역을 선택한다. mkdir, cd를 동시에 진행한다 생각하면 된다.
WORKDIR /code

# 배포할 파일을 복사한다.
COPY dist/ dist/



# frontend Port를 설정한다.
EXPOSE 5000

# container가 종료될 때 정상종료를 유도한다.
STOPSIGNAL SIGTERM

# nginx를 global 설정
# Docker에서는 nginx가 daemon으로 실행되지 않도록 한다.
# daemon으로 실행하지 않으면 container가 바로 종료된다.
CMD ["nginx", "-g", "daemon off;"]