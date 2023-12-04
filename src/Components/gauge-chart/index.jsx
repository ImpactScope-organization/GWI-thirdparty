import React, { useRef, useEffect, useState } from "react";

const CustomGaugeChart = ({ percentage = 0 }) => {
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const svgRef = useRef(null);

  const calculateSize = () => {
    const svgElement = svgRef.current;
    if (svgElement) {
      const rect = svgElement.getBoundingClientRect();
      setSvgSize({ width: rect.width, height: rect.height });
    }
  };

  useEffect(() => {
    calculateSize();
    window.addEventListener("resize", calculateSize);
    return () => window.removeEventListener("resize", calculateSize);
  }, []);

  const radius = 150;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  const progress = ((180 - (180 * percentage) / 100) * circumference) / 360;
  const center = radius + strokeWidth;

  return (
    <div style={{ width: "100%", maxWidth: "300px" }} ref={svgRef}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${radius * 2 + strokeWidth * 2} ${
          radius + strokeWidth * 2
        }`}
        ref={svgRef}
      >
        <text
          x={center}
          y={center - 25}
          textAnchor="middle"
          fontSize="18"
          fill="#6C7275"
          className="font-light text-foggyGrey"
        >
          Greenwash Risk
        </text>
        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          fontSize="26"
          fill="#141718"
          className="font-bold text-blackText"
        >
          {percentage}%
        </text>
        <circle
          r={radius}
          cx={center}
          cy={center + 36}
          fill="none"
          stroke="#ccc"
          strokeWidth={strokeWidth}
        />
        <circle
          r={radius}
          cx={center}
          cy={center + 36}
          fill="none"
          stroke="#F2BC00"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="square"
          // transform={`rotate(${strokeWidth} ${center} ${center})`}
        />
      </svg>
    </div>
  );
};

export default CustomGaugeChart;
