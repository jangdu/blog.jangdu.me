import { Button } from '@/components/ui/button';

type CopyButtonProps = {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
};

const CopyButton = ({ icon, text, onClick }: CopyButtonProps) => {
  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      {icon}
      {text}
    </Button>
  );
};

export { CopyButton };
