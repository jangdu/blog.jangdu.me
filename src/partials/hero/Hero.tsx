import { Section } from 'astro-boilerplate-components';
import { Github } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AppConfig } from '@/utils/AppConfig';

import { Link } from '../Link';
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
        socialButtons={
          <>
            <Link href="https://github.com/jangdu" target="_blank">
              <Button variant="ghost" size="icon">
                <Github />
              </Button>
            </Link>
          </>
        }
      />
    </Section>
  );
};

export { Hero };
