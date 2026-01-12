type BadgeProps = {
  label: string;
  icon?: React.ReactNode | string;
};
export function Badge({ label, icon }: BadgeProps) {
  return (
    <span
      className={`flex justify-start items-center gap-2 px-3 py-1 rounded-full  text-sm dark:bg-white/12 dark:text-white/95 dark: border-white/10 dark:font-semibold bg-primary/10 text-primary  font-semibold`}
    >
      {icon && <div className="w-2 h2 ">{icon}</div>}
      {label}
    </span>
  );
}
