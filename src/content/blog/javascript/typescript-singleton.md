---
author: jangdu
pubDatetime: 2024-10-05T00:57:00Z
modDatetime: 2024-10-05T00:57:00Z
title: 디자인 패턴 - typescript 싱글톤 패턴
slug: typescript-singleton
featured: false
draft: false
tags:
  - javascript
  - typescript
  - design-pattern
description: typescript로 작성하는 싱글톤 패턴
---

## 싱글톤 패턴

`싱글톤 패턴`은 클래스의 인스턴스를 하나의 객체로 제한하는 디자인 패턴으로  
해당 객체가 프로그램 전체에서 사용할 수 있도록 구성하여, 코드의 재사용성을 높이고 메모리의 사용량을 최소화합니다.

싱글톤 패턴은 전역 상태를 관리하거나 공유 리소스에 대한 접근을 제어할 때 주로 사용합니다.

## 일반적인 클래스

우선 일반적인 클래스를 구현하는 방식은 다음과 같습니다.

```javascript
import { Repository } from "typeorm"
import { Post } from "../entity/Post"
import { AppDataSource } from "../data-source"

export class NonSingletonPostService {
    private postRepository: Repository<Post>

    constructor() {
        this.postRepository = AppDataSource.getRepository(Post)
    }

    async getAllPosts(): Promise<Post[]> {
        return this.postRepository.find()
    }

    // ...
}
```

해당 클래스를 통해서 인스턴스를 생성하려면 아래와 같이 `new`키워드를 사용해 생성해야 합니다.

```javascript
const service1 = new NonSingletonPostService()
const service2 = new NonSingletonPostService()

console.log(service1 === service2)  // false
```

위 `console`을 통해서 알 수 있듯이 생성된 인스턴스들은 서로 별개의 메모리에 존재하며,  
생성할 때마다 독립적인 친구를 생성해 불필요한 리소스를 잡아먹습니다.

또한 각 인스턴스가 독립적인 상태를 가지므로 일관된 상태나 동작을 보장할 수 없습니다.

특히, 위 예제의 경우에는 `new NonSingletonPostService()`을 사용할 때  
새로운 repository가 만들어질 수 있고, 데이터베이스와의 불필요한 연결이 발생할 수 있습니다.

## 싱글톤 패턴 typscript 예제

싱글톤 패턴은 정적인 인스턴스 변수를 통해 유일한 인스턴스를 저장하고,

생성자를 `private`으로 선언해, 외부에서 `new`키워드를 통한 인스턴스 생성을 방지합니다.

자세한 내용은 아래 예제를 통해 살펴보겠습니다.

아래 코드는 싱글톤 패턴으로 `class`를 작성하는 대표적인 예시입니다.

```javascript
import { Repository } from "typeorm"
import { Post } from "../entity/Post"
import { AppDataSource } from "../data-source"

export class SingletonPostService {
    private static instance: SingletonPostService
    private postRepository: Repository<Post>

    private constructor() {
        this.postRepository = AppDataSource.getRepository(Post)
    }

    public static getInstance(): SingletonPostService {
        if (!SingletonPostService.instance) {
            SingletonPostService.instance = new SingletonPostService()
        }
        return SingletonPostService.instance
    }

    async getAllPosts(): Promise<Post[]> {
        return this.postRepository.find()
    }

    // 다른 메서드들...
}
```

해당 코드를 자세히 살펴보면

1.  `private static`을 사용해 유일한 `instance`를 해당 변수에 저장합니다.
2.  `private constructor()`를 통해 클래스의 외부에서 `new`키워드로 인스턴스를 생성하지 못하게 합니다.
3.  `public static getInstance()` 메서드를 통해서 클래스의 인스턴스를 얻을 수 있는 유일한 방법으로 제한합니다.
4.  `getInstance`를 살펴보면 해당 인스턴스가 존재하지 않으면 생성하고, 인스턴스가 있다면 해당 인스턴스를 리턴합니다.

위 클래스를 통해 인스턴스를 생성하려면, 아래와 같은 방법을 사용합니다.

```javascript
// 사용 예:
const service1 = SingletonPostService.getInstance()
const service2 = SingletonPostService.getInstance()

console.log(service1 === service2)  // true
```

싱글톤 패턴으로 작성된 클래스의 인스턴스 생성은 위에서 정의한 `getInstance() 메서드를` 통해서만 가능하며,  
해당 메서드를 통해서 프로그램의 전체에서 동일한 인스턴스에 쉽게 접근할 수 있습니다.

위 코드에서 `console.log`로 해당 인스턴스가 동일한 인스턴스인 것을 확인할 수 있습니다.

## 싱글톤 클래스 확장

`typescript`에서는 싱글톤으로 작성된 클래스 확장이 가능하며, 파생 클래스는 부모의 클래스 인스턴스를 상속합니다.  
클래스 확장은 다음과 같이 작성합니다.

```javascript
class ExtendedSingleton extends SingletonPostService {
  public new() {
    // method
  }
}

const newInstance = ExtendedSingleton.getInstance()

newInstance.new()
```

위에 작성된 클래스인 `ExtendedSingleton`는 부모인 `SingletonPostService`를 상속하며,  
해당 클래스의 인스턴스는 부모의 메서드인 `getInstance()`를 통해서 생성합니다.

생성된 인스턴스는 위와 동일하게 사용이 가능합니다.

## 싱글톤 패턴의 특징

위에서 설명한 대로 `싱글톤 패턴`으로 클래스를 작성하면 프로그램 전체에 하나의 인스턴스만 존재합니다.  
따라서 하나의 인스턴스를 사용하는 싱글톤 패턴의 특징은 다음과 같습니다.

### 싱글톤 패턴의 장점

- 클래스의 인스턴스 생성 제어
- 하나의 인스턴스만 생성해 효율적인 메모리 및 리소스 최소화
- 프로그램 전체에서 동일한 인스턴스에 쉽게 접근이 가능
- 인스턴스들이 동일하기 때문에 쉽게 상태 공유가 가능
- 하나의 `repository`를 생성하므로 효율적인 데이터베이스 연결 관리
- 필요할 때만 인스턴스를 생성해 성능 향상

### 싱글톤 패턴의 단점

- 전역 상태로 인한 단위테스트가 어려울 수 있음
- 다른 클래스들이 해당 클래스에 의존해 결합도 증가

---

싱글톤 패턴은 전체 프로그램에서 공유해야 하는 상태나 리소스 관리에 적합하지만,  
테스트를 할 때의 복잡성이나 다른 클래스들의 결합도 증가의 단점이 있습니다.

이러한 단점들은 **_의존성 주입(DI, Dependency Injection)_**을 통해서 강한 결합도를 해결해,  
테스트나 유지보수가 더 쉬워지게 하거나

**_팩토리 패턴_**을 사용해 싱글톤의 인스턴스 생성을 제어하는 방법을 통해서  
테스트 시 인스턴스를 초기화해 테스트의 독립성을 유지할 수 있습니다.

아니면, **_모듈 패턴_**을 통해 전역 상태 문제를 완화하여  
인스턴스의 접근을 제어하고 필요시 인스턴스를 초기화할 수 있습니다.

위와 같은 방법들을 적절하게 조합해 `싱글톤 패턴`의 장점은 유지하면서, 단점을 최소화해 사용할 수 있습니다.
