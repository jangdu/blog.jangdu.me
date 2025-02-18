---
author: jangdu
pubDatetime: 2024-04-22T22:26:00Z
modDatetime: 2024-04-22T22:26:00Z
title: TypeORM orderBy 여러가지 기준으로 정렬
slug: typeorm-multiple-orderby
featured: false
draft: false
tags:
  - node
  - typeorm
  - nestjs
description: TypeORM orderBy 여러가지 기준으로 정렬하는 방법
---

Nest.js와 TypeORM을 사용하는 프로젝트에서 데이터를 조회할 때, 어떤 기준으로 순서를 정렬해야 할 때가 있는데,

이때 TypeORM에서 제공하는 메서드를 사용하면 쉽게 구현할 수 있습니다.

> 본 포스트에서는 조회 메서드를 사용하는 방법에 대해서는 다루지 않고 orderBy를 사용하는 방법에 대해서만 다루겠습니다.

## TypeORM에서 ORDER BY 사용하기

rating(별점) 컬럼을 기준으로 별점이 높은 순서대로 데이터를 정렬하는 코드를 예시로 들어보겠습니다.

typeORM에서 데이터를 조회할 때는, `find()`나, `createQueryBuilder()` 메서드 등을 사용해서 데이터를 조회할 수 있습니다.

먼저 createQueryBuilder() 메서드를 사용해서 정렬하는 방법은 다음과 같습니다.

```javascript
async findAllPosts(): Promise<Post[]> {
  return this.createQueryBuilder('post')
    .orderBy('post.rating', 'DESC')
    .getMany();
}
```

위 코드에서는 rating 컬럼을 기준으로 내림차순으로 정렬을 한 뒤에 리턴을 합니다.

이렇게 하면 rating 컬럼의 값이 높은 순서대로 데이터를 조회할 수 있습니다.  
즉, 별점 순으로 조회를 할 때 사용합니다.

물론 `find()` 메서드를 사용할 때도 정렬을 할 수 있습니다.

`find()` 메서드를 사용할 때는 `order` 옵션에 넣어주면 됩니다.  
아래 코드는 위 코드와 동일한 결과를 리턴하는 코드입니다.

```javascript
async findAllPost(id: number): Promise<Post> {
  return this.postRepository.find({
    order: { rating: 'DESC' },
  });
}
```

위처럼 typeORM에서는 간단하게 `orderBy`나 `order`를 사용해 데이터를 정렬할 수 있습니다.

## 여러 기준으로 정렬하기

만약 별점이 동일한 데이터가 있을 때 최신글을 먼저 보여주고 싶다면 orderBy를 여러번 사용하면 됩니다.

```javascript
// 쿼리빌더로 조회하기
async findAllPosts(): Promise<Post[]> {
  return this.createQueryBuilder('post')
    .orderBy('post.rating', 'DESC')
    .addOrderBy('post.createdAt', 'DESC')
    .getMany();
}
```

위처럼 여러 기준으로 정렬할 때는 `addOrderBy()` 메서드를 사용하면 됩니다.

위 코드에서는 우선 `orderBy()` 메서드로 rating을 기준으로 정렬한 뒤, `addOrderBy()` 메서드로 createdAt을 기준으로 정렬합니다.

```javascript
// find()로 조회하기
async findAllPost(id: number): Promise<Post> {
  return this.postRepository.find({
    order: { rating: 'DESC', createdAt: 'DESC' },
  });
}
```

order 옵션에 여러 기준을 넣어주면, 첫 번째 기준으로 정렬한 뒤에, 두 번째 기준으로 정렬합니다.

위 두 방법 모두 먼저 rating으로 정렬한 뒤에, createdAt으로 정렬합니다.

즉, 결과는 rating이 높은 순서대로 정렬하고, rating이 동일할 때는 createdAt을 기준으로 최신글을 우선으로 보여줍니다.

---

데이터를 조회할 때 어떤 기준으로 정렬이 필요 할 때,

쿼리빌더로 조회할 때는 `orderBy()` 메서드를 사용하고, find()로 조회할 때는 `order` 옵션에 넣어주면 됩니다.

여러 기준으로 정렬할 때는 `addOrderBy()` 메서드를 사용하거나, `order` 옵션에 여러 기준을 넣어주면 됩니다.

물론, 여러 JOIN을 사용할 때도 orderBy를 사용할 수 있습니다.

이렇게 TypeORM에서 제공하는 메서드를 사용하면 쉽게 여러 기준으로 데이터를 정렬할 수 있습니다.
