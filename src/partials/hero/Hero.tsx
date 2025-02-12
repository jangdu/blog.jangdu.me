import { Section } from 'astro-boilerplate-components';

import { AppConfig } from '@/utils/AppConfig';

import { HeroContainer } from './HeroContainer';

const Hero = () => {
  return (
    <Section>
      <HeroContainer
        name={AppConfig.author}
        description="안녕하세요, typescript 개발자 장두혁입니다."
        avatar={
          <img
            className="size-24 rounded-full"
            src="/assets/images/avatar.png"
            alt="Avatar image"
            loading="lazy"
          />
        }
        email="jjd0324@gmail.com"
        githubUrl="https://github.com/jangdu"
      />
    </Section>
  );
};

export { Hero };
