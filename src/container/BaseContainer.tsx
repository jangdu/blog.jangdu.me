type BaseContainerProps = {
  children: React.ReactNode;
};

export const BaseContainer = ({ children }: BaseContainerProps) => {
  return <div className="mx-auto max-w-screen-md p-3">{children}</div>;
};
