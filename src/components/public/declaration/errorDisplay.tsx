export const ErrorDisplay: React.FC<{
  error: { message: string } | null;
  className?: string;
}> = ({ error, className }) => {
  if (!error) return null;

  return (
    <div className={` ${className}`}>
      <div className="bg-destructive/10 border  rounded-xl p-4 flex items-start gap-3">
        <div className="shrink-0 w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center mt-0.5">
          <span className="text-destructive text-xs font-bold">!</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-destructive mb-1">Erreur</h4>
          <p className="text-sm text-destructive/90">{error.message}</p>
        </div>
      </div>
    </div>
  );
};
