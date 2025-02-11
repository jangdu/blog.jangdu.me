import { NavbarTwoColumns } from 'astro-boilerplate-components';
import { CodeXml } from 'lucide-react';

import { Logo } from '@/components/Logo';
import { NavbarContainer } from '@/container/navbar/NavbarContainer';
import { Link } from '@/partials/Link';
import { AppConfig } from '@/utils/AppConfig';

const siteName = AppConfig.site_name;

type NavbarProps = {
  children?: React.ReactNode;
};

const Navbar = ({ children }: NavbarProps) => (
  <NavbarContainer>
    <NavbarTwoColumns>
      <a href="/">
        <Logo
          icon={<CodeXml className="size-8 text-primary " />}
          name={siteName}
        />
      </a>

      <div className="flex flex-row items-center gap-2">
        <Link href="/posts">Blogs</Link>
        <Link href="https://github.com/jangdu" target="_blank">
          GitHub
        </Link>
        {children}
      </div>
    </NavbarTwoColumns>
  </NavbarContainer>
);

export { Navbar };
