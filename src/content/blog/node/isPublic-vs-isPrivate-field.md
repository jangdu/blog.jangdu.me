---
author: jangdu
pubDatetime: 2024-10-27T10:45:00Z
modDatetime: 2024-10-27T10:45:00Z
title: boolean 필드 네이밍 (isPublic vs isPrivate)
slug: isPublic-vs-isPrivate-field
featured: false
draft: false
tags:
  - node
  - typeorm
  - nestjs
description: isPublic과 isPrivate 등 boolean 필드 네이밍에 대한 고민
---

이번 글에서는 NestJS 기반 파일 공유 시스템을 개발하는 과정에서 발생한 boolean 필드 네이밍에 대한 문제를 고민한 과정을 다룹니다.

- NestJS v9.0
- TypeORM v0.3

## isPrivate과 isPublic

파일 공유 시스템을 개발하던 중, 파일의 `공개/비공개` 여부를 나타내는 boolean 필드를 고민하며,  
다음과 같은 두 가지 선택지가 있었습니다.

- isPrivate: boolean
- isPublic: boolean

### isPrivate으로 작성한 코드

처음에는 다음과 같이 필드명을 `isPrivate`으로 `Entity`를 작성했습니다.

```javascript
// file.entity.ts 일부
@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  isPrivate: boolean;

  ...
}
```

`isPrivate`으로 코드를 작성하면 다음과 같이 로직을 작성하게 됩니다.  
아래 코드는 유저가 어떤 파일에 **_접근이 가능한지 아닌지를 판단하기 위한 로직_**의 예제입니다.

아래의 코드는 `file.private`을 통해 해당 파일의 공개 여부를 확인하고,  
비공개 파일인 경우에는 접근한 유저의 권한을 확인하는 로직이 작성되어 있습니다.

```javascript
// 파일 접근 권한을 확인하는 로직이 들어있는 함수
async getFileAccess(fileId: number, userId: number) {
  const file = await this.fileRepository.findOne(fileId);

  // 이중 부정이 발생하는 경우
  if (!file.isPrivate) {
    // 파일이 공개인 경우
    return this.generatePublicAccess(file);
  } else {
    // 파일이 비공개인 경우 유저가 해당 파일의 권한을 가졌는지 체크
    if (await this.checkUserAccess(file, userId)) {
      return true
    }
    return false
  }
}
```

공개된 파일인 경우에는 유저의 권한을 체크할 필요없이 true를 리턴하기 위해서,  
해당 파일이 공개된 파일인지 먼저 체크하기 위해 `!file.isPrivate`을 조건문에 넣어 작성했습니다.

위 코드와 같이 간단한 구현에서는 해당 부분이 복잡해 보이지 않지만,  
조금만 더 복잡한 기능을 구현하면 부정문이 중첩되며 더 복잡해질 수 있습니다.

또한 `!`가 코드에 있으면 한번더 생각해 보게되기 때문에 가독성의 측면에서도 문제가 있고,

`isPrivate`에 값이 없는 경우 무조건 공개적으로 처리가 되기 때문에 보안적 측면에서도 문제가 될수 있으므로, 따로 예외처리가 필요하게 됩니다.

예를들어 `isPrivate`이 `nullable`하다면 null에 대한 처리가 있습니다.

### isPublic으로 작성한 코드

반면, `isPublic`으로 필드명으로 엔티티를 작성하면, 다음과 같이 엔티티와 로직을 작성할 수 있게됩니다.

아래의 코드는 `file.isPublic`을 통해 해당 파일의 공개 여부를 확인하고,  
비공개 파일인 경우에는 접근한 유저의 권한을 확인하는 `isPrivate`과 동일한 로직이 작성되어 있습니다.

```javascript
// file.entity.ts 일부
@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isPublic: boolean;

  ...
}

// file.service.ts 일부
async validateFileAccess(fileId: number, userId: number): Promise<boolean> {
  const file = await this.fileRepository.findOne(fileId);

  // 조건문 단순화
  if (file.isPublic) {
    return true;
  }

  return this.userHasAccess(userId, fileId);
}

...
```

위 코드를 살펴보면, `isPrivate`으로 작성한 코드와 달리 공개여부를 확인하는 조건문의 이중 부정문을 피할 수 있습니다.

따라서 코드의 의도가 명확해 가독성이 개선됩니다.

보안적인 관점에서도 `isPublic`의 값이 `null`이나 `undefined`이면 false로 반환되기 때문에,  
알아서 비공개된 파일로 처리가 되며, 해당 예외처리를 생략할 수 있습니다.

---

위에서 언급한 부분 이외에도 `isPublic`으로 코드를 작성하면 테스트나 로깅처리시 더 직관적으로 처리할 수 있습니다.

작은 네이밍 결정이 전체 시스템의 설계와 사용성에 큰 영향을 미칠 수 있으므로, 네이밍에 대한 고민이 필요합니다.  
특히 보안과 관련된 필드의 경우, 기본값과 네이밍이 매우 중요한 역할을 합니다.

일반적으로 부정의 의미를 가진 변수나 필드명은 피하는 편이고,

`is`, `has`, `can`, `should`와 같은 접두사를 사용한 네이밍을 통해 읽기 편한 코드를 지향합니다.
