import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CircleProgressProps {
  percent: number; // 0 - 100
  size?: number; // ukuran px
  strokeWidth?: number;
  color?: string;
  icon?: IconDefinition;
}

export default function CircleProgress({
  percent,
  size = 64,
  strokeWidth = 6,
  color = "#58CC02",
  icon,
}: CircleProgressProps) {
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const clamped = Math.min(Math.max(percent, 0), 100);
  const offset = circumference - (circumference * clamped) / 100;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="absolute text-gray-400 text-sm"
        />
      )}

      {/* Jika mau menampilkan angkanya */}
      {/* <span className="absolute text-xs">{clamped}%</span> */}
    </div>
  );
}
