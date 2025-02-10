import {
  Logo,
  NavbarTwoColumns,
  NavMenuItem,
  Section,
} from 'astro-boilerplate-components';
import { CodeXml } from 'lucide-react';

import { AppConfig } from '@/utils/AppConfig';

const siteName = AppConfig.site_name;

type NavbarProps = {
  children?: React.ReactNode;
};

const Navbar = ({ children }: NavbarProps) => (
  <Section>
    <NavbarTwoColumns>
      <a href="/">
        <Logo
          icon={<CodeXml className="me-2 size-10 text-primary" />}
          name={siteName}
        />
      </a>

      <div className="flex flex-row items-center gap-2">
        <NavMenuItem href="/posts">Blogs</NavMenuItem>
        <NavMenuItem href="https://github.com/jangdu" target="_blank">
          GitHub
        </NavMenuItem>
        {children}
      </div>
    </NavbarTwoColumns>
  </Section>
);

export { Navbar };
