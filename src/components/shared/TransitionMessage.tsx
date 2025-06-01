
type Props = {
  message: string;
};

export const TransitionMessage = ({ message }: Props) => (
  <div className="mb-6 p-4 bg-muted rounded-xl shadow-sm text-muted-foreground text-sm text-center animate-fade-in">
    {message}
  </div>
);
