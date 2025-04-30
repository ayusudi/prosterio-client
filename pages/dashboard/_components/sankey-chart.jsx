import { useRef, useEffect } from "react";
import { Chart } from "chart.js";
import { LinearScale } from "chart.js";
import { SankeyController, Flow } from "chartjs-chart-sankey";

Chart.register(LinearScale, SankeyController, Flow);

export default function Component({ dataSankey }) {
  const chartRef = useRef(null);
  // Predefined color palette for better visualization
  const colorPalette = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9B59B6",
    "#3498DB",
    "#E74C3C",
    "#2ECC71",
    "#F1C40F",
    "#1ABC9C",
    "#D35400",
    "#8E44AD",
    "#2980B9",
    "#27AE60",
    "#F39C12",
    "#16A085",
    "#E67E22",
    "#C0392B",
    "#6C5CE7",
    "#00B894",
    "#00CEC9",
    "#55EFC4",
    "#81ECEC",
    "#74B9FF",
    "#A8E6CF",
    "#DCEDC1",
    "#FFD3B6",
    "#FFAAA5",
    "#FF8B94",
    "#FAD02E",
    "#A8E6CE",
    "#DCEDC2",
    "#FFD3B5",
    "#FFAAA6",
    "#FF8B95",
    "#45B7D2",
    "#96CEB5",
    "#FFEEAE",
    "#D4A5A6",
    "#9B59B7",
    "#3498DC",
    "#E74C3D",
    "#2ECC72",
    "#F1C40E",
    "#1ABC9D",
    "#D35401",
    "#8E44AE",
    "#2980BA",
  ];

  useEffect(() => {
    Chart.register(SankeyController, Flow);

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Create a map of target nodes to consistent colors
      const targetNodeColors = {};
      dataSankey.nodes.forEach((node, index) => {
        if (!targetNodeColors[node.name]) {
          // Use modulo to cycle through colors if we have more nodes than colors
          const colorIndex = index % colorPalette.length;
          targetNodeColors[node.name] = colorPalette[colorIndex];
        }
      });

      // Calculate node counts: sum of flows where node is source or target
      const nodeCounts = new Array(dataSankey.nodes.length).fill(0);
      dataSankey.links.forEach((link) => {
        nodeCounts[link.source] += link.value;
        nodeCounts[link.target] += link.value;
      });

      // Label nodes with counts
      const labeledNodes = dataSankey.nodes.map((node, index) => ({
        name: `${node.name} (${nodeCounts[index]})`,
      }));

      const sankeyData = {
        datasets: [
          {
            data: dataSankey.links.map((link) => ({
              from: labeledNodes[link.source].name,
              to: labeledNodes[link.target].name,
              flow: link.value,
            })),
            colorFrom: (c) => {
              // Remove count from label to find original node index
              const sourceLabel = c.dataset.data[c.dataIndex].from;
              const sourceName = sourceLabel.replace(/\s\(\d+\)$/, "");
              const colorIndex =
                dataSankey.nodes.findIndex((n) => n.name === sourceName) %
                colorPalette.length;
              return `${colorPalette[colorIndex]}CC`; // CC adds 80% opacity
            },
            colorTo: (c) => {
              const targetLabel = c.dataset.data[c.dataIndex].to;
              const targetName = targetLabel.replace(/\s\(\d+\)$/, "");
              return `${targetNodeColors[targetName]}CC`; // CC adds 80% opacity
            },
            colorMode: "gradient",
            labels: labeledNodes.map((node) => node.name),
          },
        ],
      };

      const chart = new Chart(ctx, {
        type: "sankey",
        data: sankeyData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: false, // Disable default tooltip
              external: function (context) {
                // Tooltip Element
                let tooltipEl = document.getElementById("chartjs-tooltip");

                // Create element on first render
                if (!tooltipEl) {
                  tooltipEl = document.createElement("div");
                  tooltipEl.id = "chartjs-tooltip";
                  tooltipEl.innerHTML = '<table class="tooltip-table"></table>';
                  document.body.appendChild(tooltipEl);
                }

                // Hide if no tooltip
                const tooltipModel = context.tooltip;
                if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = 0;
                  return;
                }

                // Set Text
                if (tooltipModel.body) {
                  const d =
                    tooltipModel.dataPoints[0].dataset.data[
                      tooltipModel.dataPoints[0].dataIndex
                    ];
                  const totalSource = tooltipModel.dataPoints[0].dataset.data
                    .filter((item) => item.from === d.from)
                    .reduce((sum, item) => sum + item.flow, 0);
                  const percentage = ((d.flow / totalSource) * 100).toFixed(2);

                  const tableBody = document.createElement("tbody");

                  const tr1 = document.createElement("tr");
                  tr1.innerHTML = `<td style="padding: 2px 5px;"><strong>${
                    d.from.split("(")[0]
                  } → ${d.to.split("(")[0]}</strong></td>`;

                  const tr2 = document.createElement("tr");
                  tr2.innerHTML = `<td style="padding: 2px 5px;">Count: ${d.flow}</td>`;

                  const tr3 = document.createElement("tr");
                  tr3.innerHTML = `<td style="padding: 2px 5px;">Percentage: ${percentage}%</td>`;

                  tableBody.appendChild(tr1);
                  tableBody.appendChild(tr2);
                  tableBody.appendChild(tr3);

                  const tableRoot = tooltipEl.querySelector("table");
                  // Remove old children
                  while (tableRoot.firstChild) {
                    tableRoot.firstChild.remove();
                  }
                  tableRoot.appendChild(tableBody);
                }

                // Position tooltip and set styles
                const position = context.chart.canvas.getBoundingClientRect();
                const bodyFont = {
                  family:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                  size: "14px",
                };

                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = "absolute";
                tooltipEl.style.left =
                  position.left +
                  window.pageXOffset +
                  tooltipModel.caretX +
                  "px";
                tooltipEl.style.top =
                  position.top +
                  window.pageYOffset +
                  tooltipModel.caretY +
                  "px";
                tooltipEl.style.font = bodyFont.size + " " + bodyFont.family;
                tooltipEl.style.padding = "8px 12px";
                tooltipEl.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                tooltipEl.style.color = "black";
                tooltipEl.style.borderRadius = "4px";
                tooltipEl.style.pointerEvents = "none";
                tooltipEl.style.transform = "translate(-50%, 0)";
                tooltipEl.style.transition = "all .1s ease";
                tooltipEl.style.zIndex = "9999";
              },
            },
          },
          font: {
            weight: "bold",
            backgroundColor: "#fff",
          },
          layout: {
            padding: {
              top: 10,
              bottom: 10,
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }
  }, [dataSankey]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold my-3 pl-1">
        Education to Job Title Distribution
      </h2>
      <div style={{ minHeight: "600px", width: "100%" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
