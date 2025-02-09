import {
  Logo,
  NavbarTwoColumns,
  NavMenuItem,
  Section,
} from 'astro-boilerplate-components';

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
          icon={
            <svg
              className="mr-1 size-10 stroke-cyan-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M0 0h24v24H0z" stroke="none"></path>
              <rect x="3" y="12" width="6" height="8" rx="1"></rect>
              <rect x="9" y="8" width="6" height="12" rx="1"></rect>
              <rect x="15" y="4" width="6" height="16" rx="1"></rect>
              <path d="M4 20h14"></path>
            </svg>
          }
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
