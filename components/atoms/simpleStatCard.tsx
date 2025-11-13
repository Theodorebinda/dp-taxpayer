export const SimpleStatCard = ({
  number,
  title,
  unit,
  width = "w-full",
  background = "bg-bg-secondary",
}: {
  number: string | number;
  title: string;
  unit: string;
  width?: string;
  background?: string;
}) => {
  return (
    <div
      className={`flex flex-col p-5 rounded-lg h-full gap-5 ${width} ${background}`}
    >
      <div className="gap-2">
        <span className="text-4xl font-bold max-md:text-2xl">{number}</span>
        <span className="ml-2">{unit}</span>
      </div>
      <span>{title}</span>
    </div>
  );
};
