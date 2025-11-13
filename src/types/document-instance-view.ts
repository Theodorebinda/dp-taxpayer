export interface DocumentInstanceViewData {
  id: string;
  templateId: string;
  modelLineId: string;
  renderedHtml: string;
  operationId: string;
  taxPayerId: string;
  expireOn: string;
  isActive: string;
  createdAt: string;
  operation: Record<string, any>;
  taxPayer: Record<string, any>;
  datas: any[];
  template: Template;
}

export type Template = {
  id: string;
  name: string;
  description: string;
  version: string;
  htmlContent: string;
  documentValidity: string;
  format: "A4" | "A5" | "SQUARE" | "CUSTOM";
  customWidth: number;
  customHeight: number;
  model: { id: string; name: string };
  type: { id: string; name: string };
  orientation?: "portrait" | "landscape";
  backgroundImage: string | null;
};
