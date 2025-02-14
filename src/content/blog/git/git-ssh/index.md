---
author: jangdu
pubDatetime: 2024-09-21T02:46:00Z
modDatetime: 2024-09-21T02:46:00Z
title: git ssh 설정
slug: git-ssh
featured: false
draft: false
tags:
  - git
description: git ssh 설정
---

github을 사용해서 push나 pull을 할 때마다, 로그인을 하거나 패스워드를 입력하는 과정은 매우 귀찮습니다.

SSH key를 맥에 설정하고 해당 과정을 줄여 귀찮음을 덜어내는 방법이 있습니다.

해당 글은 github 계정이 존재한다고 가정하고 작성합니다.

## SSH(Secure Shell Protocol), SSH Key란?

`SSH(Secure Shell Protocol)`공개적인 통신을 할 때 보안을 위해 사용하는 암호화된 프로토콜입니다.  
이 방식을 통해서 Github의 Repository에 접근 및 데이터를 사용할 수 있습니다.

SSH를 통해서 연결 시 컴퓨터에 있는 어떤 Key를 사용해서 인증하는데, 이 키를 생성해 Github를 사용하면 됩니다.

## SSH Key 생성

터미널에서 아래의 명령어를 통해 Key를 생성합니다. 이메일은 Github에서 사용하는 이메일을 사용합니다.

```
ssh-keygen -t ed25519 -C "your_email@example.com"
```

위 명령어를 입력하면 아래와 같은 질문들이 나오는데,  
key를 저장할 위치와 사용 할 암호를 입력하거나 엔터를 눌러 기본값을 적용하면 됩니다.

```
Enter file in which to save the key:
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

## ssh-agent에 Key 추가

생성한 키를 관리하려면 `ssh-agent`에 키를 추가하고 관리해야 합니다.  
1\. 아래 명령어를 통해서 ssh-agent를 시작합니다.

```
eval "$(ssh-agent -s)"
```

2\. ssh-agent에 키를 자동으로 로드하고 저장하기 위한 `~/.ssh/config`를 수정합니다.

```
➜  ~ open ~/.ssh/config

The file /Users/user/.ssh/config does not exist.
```

위 명령어의 결과 값이 위와 같다면 ~/.ssh/config가 없다는 것이므로 만들고 열어주면 됩니다.

```
➜  ~ touch ~/.ssh/config

➜  ~ open ~/.ssh/config
```

3\. 열린 파일에 다음과 같은 내용을 붙여넣습니다. 위 Key에서 생성할 때 Key가 저장된 위치를 적으면 됩니다.

만약 키를 만들 때 암호를 넣지 않았다면 `UseKeychain yes`는 생략합니다.

```
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```

4\. 마지막으로 아래의 명령어를 통해서 만들어진 Key를 keychain에 추가합니다.

```
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

## Github에 Key 추가

아래의 명령어를 통해서 만들어진 Key를 복사합니다.

```
pbcopy < ~/.ssh/id_ed25519.pub
```

그리고 Github 페이지로 들어가서 계정 settings에 들어갑니다.

[##_Image|kage@coOevV/btsJIksQVaR/zmEZt49hV1rxsxt0PMYmnK/img.png|CDM|1.3|{"originWidth":1245,"originHeight":592,"style":"alignCenter","caption":"ssh-key 등록하기"}_##]

이미지와 같이 **SSH and GPG keys** 메뉴를 클릭하고 **New SSH key**를 클릭 후,

Title과 복사된 키를 붙여넣고 추가하면 됩니다.

```
git push origin main
```

이제 귀찮은 과정없이 컴퓨터에서 생성하고 등록된 키를 사용해서 Github과 소통할 수 있습니다.
