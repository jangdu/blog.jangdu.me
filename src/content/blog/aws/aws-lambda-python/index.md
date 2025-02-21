---
author: jangdu
pubDatetime: 2024-05-11T00:39:00Z
modDatetime: 2024-05-11T00:39:00Z
title: AWS lambda Container Image로 배포하기 (with python, tensorflow)
slug: aws-lambda-python
featured: false
draft: false
tags:
  - aws
  - python
  - docker
  - lambda
  - serverless
description: aws lambda에 docker 이미지를 사용해서 배포하는 방법 (with python, tensorflow)
---

python 코드를 text로 받아 파싱 후 실행한 결과를 response로 보내는 api를 만들어보며, `AWS lambda`에 docker로 말아서 올려보는 방법을 알아보겠습니다.

여기서 python 코드에는 tensorflow 코드를 실행하며, 라이브러리와 함께 container를 CLI로 배포하는 과정을 다룹니다.

람다 함수에서 python 컨테이너 이미지를 빌드해 배포하는 방법은 3가지가 있는데, 이 글에서는 Lambda 전용 컨테이너 이미지를 CLI를 통해 빌드 후 ECR로 이미지를 배포하는 방법에 대해서만 다루겠습니다.

aws에서는 python Container를 v3.8 ~ v3.12까지 지원합니다.  
그 이후의 버전의 이미지는 [AWS Minimal container image](https://docs.aws.amazon.com/linux/al2023/ug/minimal-container.html)를 기반으로 사용합니다. 자세한 내용은 해당 링크를 통해서 살펴볼 수 있습니다.

저는 이번에는 `v3.12`를 사용해서 빌드하겠습니다.

> 본 글에서 AWS `IAM` 계정이나 권한, `docker`, `AWS CLI`는 이미 세팅이 되어있다는 기준으로 작성되었습니다.

## 필요한 파일 작성하기

배포를 위해 필요한 파일은 다음과 같습니다. (`.gitignore`는 무시하셔도 괜찮습니다.)

![image](@assets/images/aws-lambda-python/img-1.png)

### lambda_function.py 작성

lambda에서 실행 할 python 코드는 아래와 같이 작성했습니다.

```python
import tensorflow as tf
import json import io
import sys

def handler(event, context):
    old_stdout = sys.stdout
    new_stdout = io.StringIO()
    sys.stdout = new_stdout
    code_text = event['data']
    exec(code_text, globals())

    sys.stdout = old_stdout
    printed_output = new_stdout.getvalue()

    # ensure_ascii=False를 추가하여 유니코드 문자를 그대로 유지하고, 결과를 UTF-8로 인코딩
    utf8_output = json.dumps(printed_output, ensure_ascii=False).encode('utf-8')

    return { 'statusCode': 200, 'data': utf8_output }
```

위 코드는 간단한 python 코드를 request로 받아서 실행 후, 그 결과를 response하는 코드입니다.  
본 글에서 python 코드는 비교적 중요하지 않아 자세한 설명은 생략하겠습니다.

위 코드에서는 tensorflow를 import해서 tensorflow를 사용한 코드를 실행 할 수 있다는 부분만 보시면 됩니다.

### requirements.txt 작성하기

requirements파일에는 python 이미지에서 사용 할 외부 라이브러리를 명시해주는 파일입니다.

해당 파일에 작성해둔 라이브러리를 빌드해서 람다로 배포하기위해 필요합니다.

```text
boto3
numpy
Pillow
tensorflow
```

위 처럼 그냥 사용 할 라이브러리를 적어두시기만 하시면 됩니다.

### Dockerfile 작성하기

```dockerfile
FROM public.ecr.aws/lambda/python:3.12

COPY requirements.txt ${LAMBDA_TASK_ROOT}

RUN pip install -r requirements.txt

COPY lambda_function.py ${LAMBDA_TASK_ROOT}

CMD [ "lambda_function.handler" ]
```

**${LAMBDA_TASK_ROOT}**는 AWS Lambda 함수에서 사용되는 환경 변수 중 하나로, Lambda 함수의 루트 디렉토리를 나타냅니다.

Dockerfile도 위와 같이 간단하게 `requirements.txt`와 `lambda_function.py`를 루트 디렉토리에 복사해 실행해 이미지를 생성하도록 작성합니다.

### docker build

```bash
docker build --platform linux/amd64 -t docker-image:test .
```

위 명령어를 통해서 도커 이미지를 빌드합니다. `docker-image`는 이미지의 이름이고, `test`로 태그를 지정해서 빌드합니다.

## ECR 생성하기

이미지를 Lambda에 연결하기 위해서, 위 과정을 통해서 빌드한 이미지를 `AWS ECR`로 배포하는 과정은 다음과 같습니다.

우선 현재 cmd에 aws 계정 등록이 되어있지 않다면 다음 명령어로 등록을 진행합니다.

```bash
aws configure
```

AWS 계정이 등록이 완료되면, `aws ecr CLI`를 사용해서 Docker CLI를 ECR 레지스트리에 인증합니다.

```bash
aws ecr get-login-password --region <aws_region> | docker login --username AWS --password-stdin <aws계정_id>.dkr.ecr.<aws_region>.amazonaws.com
```

레지스트리에 인증 후, `aws ecr create-repository` 명령어를 사용하여 Amazon ECR에 레포지토리를 생성합니다.

> ECR의 레포지토리는 반드시 Lambda 함수와 동일한 Region내에 생성해야만 합니다.

```bash
aws ecr create-repository --repository-name <repo_name> --region <aws_region> --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE
```

레포지토리가 성공적으로 생성되면 다음과 같은 응답이 표시됩니다.

```json
{
  "repository": {
    "repositoryArn": "arn:aws:ecr:us-east-1:111122223333:repository/hello-world",
    "registryId": "111122223333",
    "repositoryName": "hello-world",
    "repositoryUri": "111122223333.dkr.ecr.us-east-1.amazonaws.com/hello-world",
    "createdAt": "2023-03-09T10:39:01+00:00",
    "imageTagMutability": "MUTABLE",
    "imageScanningConfiguration": {
      "scanOnPush": true
    },
    "encryptionConfiguration": {
      "encryptionType": "AES256"
    }
  }
}
```

위 응답에서 `repositoryUri`를 미리 복사합니다.

## 생성된 ECR에 배포하기

위에서 생성한 로컬의 도커 이미지를 ECR 리포지토리에 배포하기 위해, 다음 `docker tag`명령어를 사용해 최신 버전으로 태그를 바꿔줍니다.

`repositoryUri`은 ECR 레포지토리를 생성할 때의 응답에서 복사해 사용하고, url의 뒤에 latest를 적어 최신 버전을 명시합니다.

```bash
docker tag docker-image:test <ECRrepositoryUri>:latest
```

태그를 완료한 뒤 docker push 명령을 실행하여 Amazon ECR 레포지토리에 이미지를 배포합니다. 위에서 바꾼 태그를 포함해서 명령어를 실행시켜줍니다.

```bash
docker push <ECRrepositoryUri>:latest
```

## 배포된 ECR 이미지로 람다 생성하기

아래의 명령어로 배포된 ECR 레포지토리 이미지를 사용해서 `Lambda`함수를 생성해줍니다.  
CLI를 통한 함수를 생성시, Role을 포함시켜 명령어를 실행해야합니다.

```bash
aws lambda create-function \
--function-name <function_name> \
--package-type Image \
--code ImageUri=<ECRrepositoryUri>:latest \
--role <role_arn> \
--memory-size 2048 \
--timeout 60
```

빌드된 도커 이미지가 커지면, 기본 시간이나 메모리가 부족할 수 있으므로, `--memory-size`와 `--timeout 60`옵션을 포함해서 생성해야합니다.그렇지 않으면 메모리나 시간이 부족해 함수가 실행되지 않을 수 있습니다.

이제 AWS Console에서 생성한 리전의 lambda와 ECR에서 배포된 함수나 이미지를 확인해 볼 수 있습니다.

## 생성된 람다 함수를 실행해 테스트하기

테스트용 함수를 CLI로 실행하기 위해서 request에 필요한 `input.json`파일을 생성합니다.

다음 json에서는 이미지가 잘 빌드되어 배포됐는지를 확인하기 위해, 간단한 tensorflow를 실행해보는 코드를 텍스트로 전달하기위한 데이터를 작성합니다.

```json
{
  "data": "tensor = tf.constant([[8, 4], [3, 4]])\nresult = tf.math.add(tensor, tensor)"
}
```

다음 명령어를 사용해서 실제 lambda 함수에 api를 보내, 테스트를 진행합니다. function_name은 위에서 생성한 함수의 이름입니다.

```bash
aws lambda invoke --function-name <function_name> --payload fileb://input.json response.json
```

위 명령어를 통해서 실제 생성된 람다 함수에 요청을 보내며, 성공적으로 실행된 응답은 response.json으로 저장됩니다.

제대로 배포가 되었다면 다음과 같은 결과를 볼 수 있습니다.

```json
{
  "statusCode": 200,
  "data": "\"TensorFlow operation result:\\n[[16 8]\\n [6 8]]\\n\""
}
```

## 수정하기

이미 배포된 람다 및 ECR이미지를 수정 할 수 있습니다.  
아래 순서로 진행하면 되며, tag를 사용해서 버전을 관리하는 것도 가능합니다.

수정된 코드나 파일을 다시 도커로 빌드합니다.

```bash
docker build --platform linux/amd64 -t docker-image:test .
```

빌드된 이미지를 기존에 배포된 ECR uri를 명령어에 포함해 tag를 수정하고, 수정된 태그를 추가 배포합니다.

```bash
docker tag docker-image:test <ECRrepositoryUri>:latest
docker push <ECRrepositoryUri>
```

수정된 이미지를 배포한 뒤, 람다 함수에 배포된 이미지로 교체 연결해주면 수정이 완료됩니다.

```bash
aws lambda update-function-code \
--function-name <function_name> \
--image-uri <ECRrepositoryUri>:latest
```

새로 수정 후 빌드 및 배포된 람다 함수의 api나 실행 명령어를 통해서 실행, 테스트 해보세요.
