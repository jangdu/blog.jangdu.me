---
author: jangdu
pubDatetime: 2024-09-21T02:46:00Z
modDatetime: 2025-02-14T02:46:00Z
title: aws lambda nodejs 배포
slug: aws-lambda-nodejs
featured: false
draft: false
tags:
  - aws
  - nodejs
  - lambda
  - serverless
description: aws lambda nodejs 배포
---

## Serverless Frameworks

Aws, GCP, Azure 등 여러 클라우드 업체를 지원하는 서버리스 프레임워크로, `serverless.yml`을 통해서 각 클라우드에 배포를 돕습니다.

AWS의 경우, CloudFormation 선언을 생성하고 해당 생성된 파일로 severless stack을 생성 및 갱신합니다.

그 과정에서 코드의 용량에 따라서 크면 S3에, 작으면 즉시 Lambda로 업로드 해, 해당 코드를 `Lambda`에서 사용합니다.

즉, 서버리스의 코드, 인프라 등 모두 `serverless.yml`파일 하나로 쉽게 관리가 가능한 `프레임워크`입니다.

### serverless.yml 예시

```
service: node-serverless

provider:
  name: aws
  runtime: nodejs20.x
  region: ap-northeast-2

functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: hello
          method: get
```

`service`는 서버리스 스택의 이름이며,`Cloud Formation`에서 해당 이름으로,

`provider`에 정의된 배포할 업체 및 서비스, 런타임을 지정해 해당 서비스에 배포합니다.

위 `serverless.yml`에서는 functions에서 함수와 그 함수를 위한 트리거를 정의하며,

`handler.js`내부의 `hello`함수는 exports로 정의해야합니다.

`region`은 배포할 서비스의 지역이며, 기본값은 `us-east-1(미국 동부, 버지니아 북부)`로 배포됩니다.

`events`는 `/hello`로 http GET api를 생성한다는 뜻이며, 해당 api를 함수의 트리거로 적용합니다.

위 파일을 통해서 배포하면 `API Gateway`, `Lambda`, `CloudWatch Logs`를 연결해주어 API가 동작하도록 하며,  
여기서 `handler.hello` 코드의 용량에 따라서 적으면 람다에 바로, 많으면 S3에 .zip파일로 배포합니다.

## Serverless 설치

아래 명령어를 통해 serverless를 설치합니다.

```
npm install -g serverless
```

## Serverless Project 생성

Project를 만들 디렉토리내에서 다음 명령어로 serverless project를 만들어줍니다.

```
sls

# or
serverless
```

해당 명령어를 입력하면 다음과 같은 질문들이 나오는데,

필자는 `AWS / Node.js / Simple Function`템플릿을 선택했습니다.

나머지 질문들은 각 Project와 App의 이름을 입력합니다.

```
✔ Select A Template: · AWS / Node.js / Simple Function

✔ Name Your Project: · yourProjectName

✔ Create Or Select An Existing App: · Create A New App

✔ Name Your New App: · yourAppName
```

## Serverless Project 구조

정상적으로 프로젝트가 생성되면 아래의 구조로 파일이 만들어집니다.

![image](https://github.com/jangdu/blog.jangdu.me/src/content/blog/aws/aws-lambda-nodejs/image-1.png)

여기서 `serverless.yml`의 경우에는 위에서 살펴봤으므로 넘어가고 `handler.js`를 살펴보면 다음과 같습니다.

```
exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v4.0! Your function executed successfully!'
    })
  };
};
```

이 파일은 `serverless.yml`에서 정의된 hello함수가 들어있는 파일로,

요청을 받으면 간단한 메시지를 응답해주는 간단한 코드로 작성되어있습니다.

위 코드의 간단한 api를 배포해보며, `Serverless Framework`의 간편함을 알아봅시다.

## Serverless 배포

`Serverless Framework`를 사용하면 상당히 간편하게 배포가 가능합니다. 아래 명령어를 사용하여 배포하면 됩니다.

```
sls deploy

Deploying "hello" to stage "dev" (ap-northeast-2)

✔ Service deployed to stack hello-dev (24s)

endpoint: GET - your-aws-url
functions:
  hello: hello-dev-hello (1.5 kB)
```

이제 `hello-dev-hello`라는 `Lambda`함수와 해당 함수를 트리거하는 `dev-hello`라는 이름의 `API-Gateway`가 만들어졌습니다.

만들어진 endpoint에 요청해서 배포가 잘 이루어졌는지 확인해보겠습니다.

![image](https://github.com/jangdu/blog.jangdu.me/src/content/blog/aws/aws-lambda-nodejs/image-2.png)

## AWS console 확인

`AWS Console`에 접속해 lambda를 확인해보면 다음과 같이 함수와 트리거가 생성된것을 확인 할 수 있습니다.

![image](https://github.com/jangdu/blog.jangdu.me/src/content/blog/aws/aws-lambda-nodejs/image-3.png)

여기서 주의 할 점은 `Lambda`에서 사용 할 코드는 압축을 해제하고의 용량을 기준으로 **_250MB_**까지만 가능합니다.

만약 코드의 크기가 **_3MB_**보다 작을 경우에는 코드가 그대로 Lambda에 업로드되며 더 빠른 응답이 가능하지만,  
용량이 **_3MB_**보다 클 경우에는 `AWS S3`에 압축된 파일을 업로드하고 해당 람다와 연결시켜줍니다.

위 예제의 경우에는 용량이 작아 `hanlder.js`가 람다로 바로 배포됩니다.

## 배포된 Severless Project 제거

해당 서버리스 프로젝트를 삭제하는 경우에도 `CLI`를 통해서 간단하게 할 수 있습니다.

사실 `Lambda`의 경우에는 비용이 거의 나오지 않아서 삭제를 하지 않아도 큰 영향은 없지만,

배포 가능한 한도가 있으므로 테스트 후 삭제하는 습관을 등이는게 좋습니다.

아래의 명령어를 사용하면 `serverless project`를 삭제할 수 있습니다.

```
sls remove
```

---

이처럼 Serverless를 사용하면, `serverless.yml`하나만으로 생각보다 간단하게 배포가 가능합니다.

`EC2`의 경우에는 사용하지 않는 API도 시간으로 비용을 지불하기 때문에 이러한 간단한 테스트에서도 비용이 부과되며,  
컴퓨터의 스펙이나 권한문제, 배포를 위한 `git`, 배포 후 24시간을 돌리기위한 `pm2`와 같은 부분들 등  
해당 기능을 `EC2`에 올리고 `API-Gateway`와 연결해서 사용하려면 신경써야 할 부분이 한두가지가 아닙니다.

하지만 `serverless`를 사용한 `Lambda`에 배포한다면, 위처럼 빠르고 쉽게 배포 및 관리를 할 수 있다는 부분에서 큰 장점이 됩니다.

다음에는 더 복잡한 API를 통해서 serverless를 더 자세히 알아보겠습니다.
