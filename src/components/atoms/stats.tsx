// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// export default function StatisticsChart(props: { monthlyEntry: number }) {
//   const data = {
//     labels: ["May", "Jun", "Jul", "Aug", "Sep"],
//     datasets: [
//       {
//         label: "Income",
//         data: [0, 0, 0, 0, 0],
//         backgroundColor: "rgba(132, 255, 132, 0.7)",
//         borderRadius: 4,
//       },
//       {
//         label: "Spend",
//         data: [0, 0, 0, 0, 0],
//         backgroundColor: "rgba(54, 162, 235, 0.7)",
//         borderRadius: 4,
//       },
//       {
//         label: "pemnding",
//         data: [0, 0, 0, 0, 0],
//         backgroundColor: "rgba(54, 162, 235, 0.7)",
//         borderRadius: 4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           color: "#333",
//           font: {
//             size: 12,
//           },
//         },
//       },
//       tooltip: {
//         backgroundColor: "#000",
//         bodyColor: "#fff",
//         titleColor: "#black",
//       },
//     },
//     scales: {
//       x: {
//         ticks: {
//           color: "#666",
//         },
//         grid: {
//           display: false,
//         },
//       },
//       y: {
//         ticks: {
//           color: "#666",
//         },
//         grid: {
//           color: "#e5e5e5",
//         },
//       },
//     },
//   };

//   return (
//     <div className="bg-background rounded-lg p-6 flex-1 max-md:h-fit w-full h-full flex flex-col gap-5">
//       <h2 className="text-lg font-semibold text-foreground">Statistics</h2>
//       <div className="flex gap-5">
//         <div className="flex-1 rounded-lg flex flex-col bg-bg-secondary p-5">
//           <span className="">entrées</span>
//           <h2 className="text-4xl max-md:text-xl font-bold">
//             {props.monthlyEntry} fc
//           </h2>
//           <span>par mois</span>
//         </div>
//         <div className="flex-1 rounded-lg flex flex-col bg-bg-secondary p-5">
//           <span className="">sorties</span>
//           <h2 className="text-4xl max-md:text-xl font-bold">0 fc</h2>
//           <span>par mois</span>
//         </div>
//       </div>
//       <div className="relative h-full w-full max-h-96">
//         <Bar data={data} options={options as any} />
//       </div>
//     </div>
//   );
// }
