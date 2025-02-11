import { BaseContainer } from '../BaseContainer';

type NavbarContainerProps = {
  children: React.ReactNode;
};

export const NavbarContainer = ({ children }: NavbarContainerProps) => {
  return <BaseContainer>{children}</BaseContainer>;
};
