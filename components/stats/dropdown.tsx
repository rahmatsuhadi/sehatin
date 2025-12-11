type TypePeriod = "week" | "month" | "3months";

interface DropdownPeriodProps {
  onChange: (value: TypePeriod) => void;
}

export default function DropdownPeriod({ onChange }: DropdownPeriodProps) {
  return (
    <div className="flex justify-end">
      <select
        id="stat-period"
        onChange={(v) => onChange(v.target.value as TypePeriod)}
        className="bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-xs font-bold"
      >
        <option value="week">Seminggu</option>
        <option value="month">Bulan</option>
        <option value="3months">3 Bulan</option>
      </select>
    </div>
  );
}
