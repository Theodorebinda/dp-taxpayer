// import React, { useState } from "react";
// import { ApiInputType } from "@/types/types";
// import Input from "../commons/dynamicInput";
// import { useFormStore } from "../store/form.store";
// import SVGComponent from "../atoms/displaySVG";

// import * as XLSX from "xlsx";

// export interface FormSectionProps {
//   formFields: ApiInputType[];
//   depth: number;
//   parentProperty?: string;
// }

// function getNestedValue(obj: any, path: string) {
//   if (!obj || !path) return undefined;
//   const formattedPath = path
//     .replaceAll(/\?\./g, ".")
//     .replace(/\['(\w+)'\]/g, "$1")
//     .replace(/^\./, "")
//     .replaceAll(/\[(\d+)\]/g, "$1");

//   return formattedPath.split(".").reduce((acc, key) => acc?.[key], obj);
// }

// const FormSection: React.FC<FormSectionProps> = ({
//   formFields,
//   depth,
//   parentProperty,
// }) => {
//   const formStore = useFormStore();

//   const bgColors: string[] = [
//     "bg-green-100 dark:bg-green-900",
//     "bg-blue-100 dark:bg-blue-900",
//     "bg-red-100 dark:bg-red-900",
//     "bg-emerald-100 dark:bg-emerald-900",
//     "bg-violet-100 dark:bg-violet-900",
//     "bg-cyan-100 dark:bg-cyan-900",
//   ];

//   const getDeterministicBgColor = (key: string) => {
//     const hash = [...key].reduce((acc, char) => acc + char.charCodeAt(0), 0);
//     return bgColors[hash % bgColors.length];
//   };
//   const downloadChildrenExcelTemplate = (input: ApiInputType) => {
//     if (!input.children) return;

//     const headers = input.children.map((child) => child.property);
//     const ws = XLSX.utils.aoa_to_sheet([headers]);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "ChildrenTemplate");
//     XLSX.writeFile(wb, `${input.property}-modele.xlsx`);
//   };

//   const handleChildrenExcelImport = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     fieldKey: string,
//     input: ApiInputType
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file || !input.children) return;

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const data = evt.target?.result;
//       const workbook = XLSX.read(data, { type: "binary" });
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
//         defval: "",
//       });

//       if (!Array.isArray(rows)) return;

//       const formattedRows = rows.map((row) => {
//         return input.children!.map((child) => ({
//           property: child.property,
//           value: row[child.property] || "",
//         }));
//       });

//       // Ajoute tous les enfants importés
//       formattedRows.forEach((row) => {
//         formStore.addChild(fieldKey, row, true);
//       });
//     };

//     reader.readAsBinaryString(file);
//   };

//   const renderChildrenInput = (
//     input: ApiInputType,
//     fieldKey: string,
//     fieldValue: any,
//     isMultiple: boolean
//   ) => {
//     if (isMultiple && Array.isArray(fieldValue)) {
//       return fieldValue.map((_, index) => {
//         const childKey = `${fieldKey}?.[${index}]`;
//         return (
//           <div key={childKey} className="">
//             <button
//               type="button"
//               className="text-red-500 w-full text-right mb-2"
//               onClick={() => formStore.removeChild(childKey, index, true)}
//             >
//               Supprimer
//             </button>
//             <FormSection
//               formFields={input.children || formFields}
//               depth={depth + 1}
//               parentProperty={childKey}
//             />
//           </div>
//         );
//       });
//     } else if (!isMultiple && typeof fieldValue === "object") {
//       const childKey = `${fieldKey}`;
//       return (
//         <div key={childKey} className="">
//           <button
//             type="button"
//             className="text-red-500 w-full text-right mb-2"
//             onClick={() => formStore.removeChild(childKey, 0, false)}
//           >
//             Retirer
//           </button>
//           <FormSection
//             formFields={input.children || []}
//             depth={depth + 1}
//             parentProperty={childKey}
//           />
//         </div>
//       );
//     }

//     return null;
//   };

//   const renderField = (input: ApiInputType) => {
//     // const [canBeDisplay, setCanBeDisplay] = useState<boolean>(false)

//     const fieldKey = parentProperty
//       ? `${parentProperty}?.['${input.property}']`
//       : `['${input.property}']`;
//     const field = getNestedValue(formStore.fields, fieldKey) || "";

//     const bgColor = getDeterministicBgColor(fieldKey);

//     if (input.displayIf) {
//       const canBeDisplay = (): boolean => {
//         const parentKey = parentProperty || input.property;
//         const fieldValue = getNestedValue(formStore.fields, parentKey) || "";
//         let state = false;
//         for (const property in input.displayIf) {
//           if (fieldValue == input.displayIf[property]) state = true;
//           else state = false;
//         }
//         return state;
//       };

//       if (!canBeDisplay()) return parentProperty || `['${input.property}']`;
//     }

//     if (input.type === "children") {
//       const isMultiple = input.multiple !== false;

//       return (
//         <div
//           key={fieldKey}
//           className={`p-4 rounded-md col-span-full flex flex-col gap-3 ${
//             depth % 2 ? "bg-background" : bgColor
//           } w-full`}
//         >
//           <div className="flex items-center justify-between">
//             <h3 className="font-semibold mb-3">{input.verbose}</h3>

//             {isMultiple && input.tag == "csv" && (
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   onClick={() => downloadChildrenExcelTemplate(input)}
//                 >
//                   Télécharger modèle
//                 </button>

//                 <label className="text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
//                   Importer Excel
//                   <input
//                     type="file"
//                     accept=".xlsx"
//                     className="hidden"
//                     onChange={(e) =>
//                       handleChildrenExcelImport(e, fieldKey, input)
//                     }
//                   />
//                 </label>
//               </div>
//             )}
//           </div>

//           {field && renderChildrenInput(input, fieldKey, field, isMultiple)}

//           {!isMultiple && field ? (
//             false
//           ) : (
//             <button
//               type="button"
//               className="text-primary w-full text-left"
//               onClick={() => {
//                 const newChildren = (input.children || formFields).map(
//                   (child) => ({
//                     property: child.property,
//                     value: "",
//                   })
//                 );
//                 formStore.addChild(fieldKey, newChildren, input.multiple);
//               }}
//             >
//               {isMultiple ? "Ajouter un enfant" : "Renseigner l'information"}
//             </button>
//           )}
//         </div>
//       );
//     }

//     return (
//       <div
//         key={fieldKey}
//         className="flex flex-col w-full flex-1 md:w-[calc(50%-8px)] min-w-96 max-md:w-full max-md:min-w-full"
//       >
//         <Input
//           {...input}
//           value={{ value: field }}
//           setValue={(val) => formStore.updateField(fieldKey, val.value)}
//         />
//       </div>
//     );
//   };

//   if (!Array.isArray(formFields)) {
//     return (
//       <div className="p-8 rounded-md w-full bg-background flex flex-col items-center justify-between h-full gap-10 max-md:h-full">
//         <span className="text-bg-secondary">
//           <SVGComponent
//             width="100"
//             height="100"
//             icon={
//               '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>'
//             }
//           />
//         </span>
//         <span>Formulaire introuvable</span>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`gap-5 transition-all max-w-5xl mx-auto w-full ${
//         depth > 0 ? "pl-5 border-l-2 border-primary" : ""
//       }`}
//     >
//       <div className="flex flex-wrap gap-4 w-full">
//         {formFields.map(renderField)}
//       </div>
//     </div>
//   );
// };

// export default FormSection;
