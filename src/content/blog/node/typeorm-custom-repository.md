---
author: jangdu
pubDatetime: 2024-04-22T22:23:00Z
modDatetime: 2024-04-22T22:23:00Z
title: TypeORM 0.3 커스텀 레포지토리 사용하기
slug: typeorm-custom-repository
featured: false
draft: false
tags:
  - node
  - typeorm
  - nestjs
description: TypeORM 0.3 버전에서 커스텀 레포지토리 사용하는 방법
---

기존 typeORM에서는 `@EntityRepository()` 데코레이터를 사용하여 커스텀 레포지토리를 만들 수 있었지만,

typeORM이 0.3으로 올라가면서 `@EntityRepository()` 데코레이터를 지원하지 않게되며,

커스텀 레포지토리를 사용하는 방법이 달라졌습니다.

이번 글에서는 typeORM v0.3에서 달라진 커스텀 레포지토리를 사용하는 방법을 알아보겠습니다.

## TypeORM 0.2 Custom Repository (기존 방식)

기존에는 `@EntityRepository()` 데코레이터를 사용하여 커스텀 레포지토리를 만들 수 있었습니다.

```javascript
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByName(name: string): Promise<User> {
    return this.findOne({ name });
  }
}
```


위와 같이 `@EntityRepository()` 데코레이터를 사용하여 커스텀 레포지토리를 만들고,

아래의 코드처럼 `UserRepository`를 Service에서 주입하여 사용할 수 있었습니다.

```javascript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  async findByName(name: string): Promise<User> {
    return this.userRepository.findByName(name);
  }
}
```

하지만, typeORM 0.3에서는 `@EntityRepository()` 데코레이터를 더이상 지원하지 않게 되면서,

레포지토리를 사용하는 방법이 조금 달라졌습니다.

## TypeORM 0.3 Repository

`typeORM 0.3`에서는 `@injectRepository()` 데코레이터를 사용하여 service에서 Entity를 Repository로 바로 주입받을 수 있습니다.

> 아래 코드에서의 `User`는 `User Entity`를 의미합니다.

```javascript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByName(name: string): Promise<User> {
    return this.userRepository.findOne({ name });
  }
}
```

위와 같이 `@InjectRepository()` 데코레이터를 사용하여 `User Entity`를 바로 주입받으면,

0.2에서의 커스텀 레포지토리를 사용하는 것과 거의 동일하게 사용할 수 있습니다.

하지만, Entity를 Repository로 바로 주입받는 방식은 `Repository`의 메소드를 직접 사용하는 방식이기 때문에,

Repository Layer를 생략하게 되어 Service Layer에서 Repository의 메소드를 직접 사용하는 방식이 됩니다.

저는 개인적으로 비즈니스 로직과 데이터베이스 간의 의존성 분리를 위해서,

위 방식보다는 `Custom Repository`를 사용하는 방식을 선호합니다.

## TypeORM 0.3 Custom Repository

0.3에서의 커스텀 레포지토리를 사용하는 방법은 기존 0.2에서의 방식과 유사하게 사용할 수 있습니다.

바로 코드로 알아보겠습니다.

```javascript
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private dataSource: DataSource,
  ) {}

  async findByName(name: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.name = :name', { name })
      .getOneOrFail();
  }
}
```

위와 같이 `UserRepository`를 만들고, `Repository<User>`를 상속받아 사용할 수 있습니다.

`UserRepository`에서는 `DataSource`를 주입받고, `EntityManager`을 생성하여 `Repository<User>`를 초기화합니다.

이후, 이 `UserRepository`를 Service에서도 주입받아 사용할 수 있습니다.

```javascript
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findByName(name: string): Promise<User> {
    return this.userRepository.findByName(name);
  }
}
```

위와 같이 `UserRepository`를 Service에서 주입받아 커스텀 레포지토리를 사용하면,

Service Layer에서 Repository Layer를 분리하여 사용할 수 있습니다.

또한, `Repository<User>`를 상속받아 사용하므로, `Service`에서도 `Repository`의 메소드를 쉽게 사용할 수 있습니다.

---

이번 글에서는 typeORM 0.3에서 커스텀 레포지토리를 사용하는 방법을 알아보았습니다.

typeORM 0.3에서는 `@EntityRepository()` 데코레이터를 사용하지 않고, `@InjectRepository()` 데코레이터를 사용하여 Entity를 Repository로 주입받을 수 있습니다.

또한, 커스텀 레포지토리를 사용하는 방법도 알아보았는데,

커스텀 레포지토리를 사용하면 Service Layer와 Repository Layer를 분리하여 사용할 수 있으며,

데이터베이스와 비즈니스 로직을 분리하여 사용할 수 있게되며, 코드의 가독성과 유지보수성을 높일 수 있습니다.
