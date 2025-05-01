"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend as ChartJSLegend,
} from "chart.js";
import { useRef, useEffect, useState } from "react";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, ChartJSLegend);

export default function Page({ data }) {
  // State for external tooltip
  const [tooltipState, setTooltipState] = useState({
    opacity: 0,
    top: 0,
    left: 0,
    label: "",
    value: 0,
    percentage: 0,
    color: "",
  });
  const jobColorPalette = [
    "#E91E63", // Pink
    "#9C27B0", // Purple
    "#2196F3", // Blue
    "#00BCD4", // Cyan
    "#4CAF50", // Green
    "#FFEB3B", // Yellow
    "#FF9800", // Orange
    "#795548", // Brown
    "#607D8B", // Blue Grey
    "#F44336", // Red
    "#3F51B5", // Indigo
    "#009688", // Teal
    "#8BC34A", // Light Green
    "#FFC107", // Amber
    "#FF5722", // Deep Orange
  ];

  // Prepare data for Doughnut chart
  const pieColors = ["#0088FE", "#00C49F", "#FFBB28"];

  // Calculate total employees for center text
  const totalEmployees = data?.experience_level_distribution?.reduce(
    (sum, item) => sum + item.total_employees,
    0
  );

  // Prepare Chart.js data
  const doughnutData = {
    labels: data?.experience_level_distribution?.map(
      (item) => `${item.experience_level} (${item.total_employees})`
    ),
    datasets: [
      {
        data: data?.experience_level_distribution?.map(
          (item) => item.total_employees
        ),
        backgroundColor: pieColors,
        borderColor: pieColors.map((color) => color + "88"),
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  // Chart.js options with center text plugin and external tooltip
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        enabled: false, // Disable default tooltip
      },
    },
    onHover: (event, elements) => {
      if (elements && elements.length > 0) {
        const element = elements[0];
        const dataset = doughnutData.datasets[element.datasetIndex];
        const index = element.index;
        const value = dataset.data[index];
        const label = doughnutData.labels[index].split(" (")[0];
        const percentage = Math.round((value / totalEmployees) * 100);
        const color = dataset.backgroundColor[index];

        // Get position for tooltip - fixed positioning
        const rect = event.chart.canvas.getBoundingClientRect();

        // Calculate position based on chart center and segment angle
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Get the angle of the segment's midpoint
        const startAngle = element.startAngle;
        const endAngle = element.endAngle;
        const midAngle = (startAngle + endAngle) / 2;

        // Calculate position at 70% of the radius from center
        const radius = (Math.min(rect.width, rect.height) / 2) * 0.7;
        const x = centerX + Math.cos(midAngle) * radius;
        const y = centerY + Math.sin(midAngle) * radius;

        setTooltipState({
          opacity: 1,
          top: y,
          left: x,
          label,
          value,
          percentage,
          color,
        });
      } else {
        setTooltipState((prev) => ({ ...prev, opacity: 0 }));
      }
    },
  };

  // Reference for the chart canvas
  const chartRef = useRef(null);

  // Effect to draw center text
  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const originalDraw = chart.draw;
      chart.draw = function () {
        originalDraw.apply(this, arguments);
        const width = this.width;
        const height = this.height;
        const ctx = this.ctx;
        ctx.restore();
        ctx.font = "bold 20px Arial";
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        const centerX = width / 2;
        const centerY = height / 3 + 24;
        ctx.fillText("Total", centerX, centerY - 45);
        ctx.fillText("IT Talent", centerX, centerY - 15);
        ctx.font = "bold 22px Arial";
        ctx.fillText(totalEmployees, centerX, centerY + 15);
        ctx.save();
      };
    }
  }, [totalEmployees]);

  // Prepare data for Job Title Distribution chart
  const jobTitleData = data?.job_title_distribution.sort(
    (a, b) => b.total_employees - a.total_employees
  );

  // Prepare data for Top Skills chart
  const topSkillsData = data?.top_skills.sort(
    (a, b) => b.total_employees - a.total_employees
  );

  return (
    <div className="flex flex-col pt-3 gap-4">
      <div className="flex flex-1">
        <div className="w-2/5 relative">
          <h2 className="text-2xl font-bold mb-5 text-center">
            Experience Level Distribution
          </h2>
          <div style={{ height: "300px", position: "relative" }}>
            <Doughnut
              data={doughnutData}
              options={doughnutOptions}
              ref={chartRef}
            />

            {/* External tooltip */}
            <div
              className="absolute z-10 bg-white p-3 rounded shadow-md border border-gray-200"
              style={{
                color: "#282828",
                opacity: tooltipState.opacity,
                top: tooltipState.top,
                left: tooltipState.left,
                transform: "translate(25%, -10%)",
                pointerEvents: "none",
                transition: "opacity 0.2s",
              }}
            >
              <div className="flex items-center mb-1">
                <span className="font-semibold">{tooltipState.label}</span>
              </div>
              <div>
                Employees:{" "}
                <span className="font-semibold">{tooltipState.value}</span>
              </div>
              <div>
                Percentage:{" "}
                <span className="font-semibold">
                  {tooltipState.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <h2 className="text-2xl font-bold mb-2 m-auto text-center">
            Top 10 Skills
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topSkillsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="skill" type="category" width={150} />
              <RechartsTooltip />
              <Bar dataKey="total_employees">
                {topSkillsData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={jobColorPalette[index % jobColorPalette.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="text-2xl font-bold mb-4 mx-2">Job Title Distribution</h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={jobTitleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="job_title"
              angle={0}
              textAnchor="center"
              interval={0}
              height={120}
              tick={(props) => {
                const { x, y, payload } = props;
                const words = payload.value.split(" ");
                const lineHeight = 16;

                return (
                  <g transform={`translate(${x},${y})`}>
                    {words.map((word, index) => (
                      <text
                        key={index}
                        x={0}
                        y={12}
                        dy={index * lineHeight}
                        textAnchor="end"
                        fill="#666"
                        fontSize={16}
                      >
                        {word}
                      </text>
                    ))}
                  </g>
                );
              }}
            />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="total_employees">
              {jobTitleData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={jobColorPalette[jobColorPalette.length - index - 1]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
