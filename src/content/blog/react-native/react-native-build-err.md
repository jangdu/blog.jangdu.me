---
author: jangdu
pubDatetime: 2024-04-23T22:31:00Z
modDatetime: 2024-04-23T22:31:00Z
title: react-native run ios 시뮬레이터 build 에러 해결
slug: react-native-build-err
featured: false
draft: false
tags:
  - react-native
  - ios
  - troubleshooting
description: react-native run ios 시뮬레이터 build error 해결하기
---

react-native로 개발을 하는 도중 `yarn start`, `npx react-native run-ios`등 명령어를 사용해도 ios 시뮬레이터가 열리지 않는 문제가 발생했습니다.

```bash
react-native run-ios
```

위 명령어를 통해서 프로젝트를 실행하게되면, ios 시뮬레이터가 자동으로 켜지면서 해당 프로젝트가 시뮬레이터 내부에서 실행되어야하지만,  
다음과 같은 에러가 나오면서 빌드를 실패했다는 메시지를 띄우고 시뮬레이터에서 실행하지 않는 문제가 발생했습니다.

![image](@assets/images/react-native-build-err/img-1.png)

직접적으로 XCode에 들어가서 project의 파일을 가져와서 react-native ios 시뮬레이터를 실행하면 잘 작동하지만, 귀찮은 과정을 최소화하고 더 간단하게 구성해봅시다.

## 시뮬레이터 실행하는 명령어

`react-native cli`에서 `--simulator` 옵션을 사용해서 해당 문제를 해결할 수 있습니다.

저의 경우에는 아래의 명령어를 사용해서, 자동으로 ios 시뮬레이터가 열리고 빌드 후 실행 할 수 있었습니다.

```bash
npx react-native run-ios --simulator=\"iPhone 15 pro\" --mode Debug
```

위 명령어에서 `\"iPhone 15 pro\"`는 실행 할 ios의 모델을 의미합니다.

현재 사용 할 모델을 어떻게 작성할 지 모른다면, 아래의 명령어를 통해서 실행할 수 있는 ios의 모델들을 조회 할 수 있습니다.

```bash
xcrun simctl list devices
```

## package.json 수정

다음과 같은 명령어를 외울수도 없고, 계속해서 저런 명령어를 사용하는 것 역시 귀찮으므로, 해당 명령어를 `yarn ios`명령어를 통해서 실행할 수 있도록 `package.json`을 수정하겠습니다.

```json
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios --simulator=\"iPhone 15 pro\" --mode Debug",
  }
```

위와같이 package.json을 수정하면 이제 터미널에서 간단하게 사용하는게 가능합니다.

```bash
yarn ios
```

이제 터미널에서 간단하게 `yarn ios`명령어를 사용해도 해당 프로젝트가 시뮬레이터에서 자동으로 열리게됩니다.
