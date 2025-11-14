// "use client";

// import { ReactNode } from "react";

// type RegistrationLayoutProps = {
//   sidebar: ReactNode;
//   form: ReactNode;
//   navigation: ReactNode;
// };

// export default function RegistrationLayout({
//   sidebar,
//   form,
//   navigation,
// }: RegistrationLayoutProps) {
//   return (
//     <div className="min-h-screen h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
//       <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
//         <div className="h-full bg-white/70 backdrop-blur-sm">
//           <div className="h-full max-w-2xl mx-auto px-6 py-10 flex flex-col">
//             <div className="flex-1 overflow-auto">
//               <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
//                 {form}
//                 <div className="mt-8">{navigation}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="h-full">{sidebar}</div>
//       </div>
//     </div>
//   );
// }
