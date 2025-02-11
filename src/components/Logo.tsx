type LogoProps = {
  icon: React.ReactNode;
  name: string;
};

export const Logo = ({ icon, name }: LogoProps) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h1 className="font-bold text-foreground">{name}</h1>
    </div>
  );
};
