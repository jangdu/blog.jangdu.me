type HomeContainerProps = {
  children: React.ReactNode;
};

const HomeContainer = ({ children }: HomeContainerProps) => {
  return <div>{children}</div>;
};

export { HomeContainer };
