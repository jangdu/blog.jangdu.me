type HeroContainerProps = {
  name: string;
  description: string;
  avatar: React.ReactNode;
  socialButtons: React.ReactNode;
};

export const HeroContainer = ({
  name,
  description,
  avatar,
  socialButtons,
}: HeroContainerProps) => {
  return (
    <div className="flex flex-row items-center justify-center gap-4">
      {avatar}
      <div className="flex flex-col items-start gap-1">
        <h2 className="font-bold">@{name}</h2>
        <p className="text-sm">{description}</p>
        <div className="flex flex-row items-start justify-start gap-1">
          {socialButtons}
        </div>
      </div>
    </div>
  );
};
