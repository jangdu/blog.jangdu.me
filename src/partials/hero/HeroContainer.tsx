import { Github, Mail } from 'lucide-react';

import { Link } from '../Link';

type HeroContainerProps = {
  name: string;
  description: string;
  avatar: React.ReactNode;
  email: string;
  githubUrl: string;
};

export const HeroContainer = ({
  name,
  description,
  avatar,
  email,
  githubUrl,
}: HeroContainerProps) => {
  return (
    <div className="flex flex-row items-center justify-center gap-4">
      {avatar}
      <div className="flex flex-col items-start gap-1">
        <h2 className="font-bold">{name}</h2>
        <p className="text-sm">{description}</p>
        <div className="flex flex-col items-start justify-start gap-1 text-sm text-muted-foreground">
          <div className="flex flex-row items-center justify-center gap-1">
            <Mail className="size-5" />
            <p>{email}</p>
          </div>
          <Link
            href={githubUrl}
            className="flex flex-row items-center justify-center gap-1 hover:underline"
            target="_blank"
          >
            <Github className="size-5" />
            <p>{githubUrl}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
