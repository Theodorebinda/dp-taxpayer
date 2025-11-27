export type InputOption = {
  value: string | number | string[];
  label: string | number | boolean;
  children?: InputOption[];
};

export type DisplayIfValueType = string | number | boolean | null;

export type DisplayIf = {
  property: string;
  condition?: "IN" | "IS" | "NOT" | "LIKE" | "NOT IN";
  value: DisplayIfValueType | DisplayIfValueType[];
};

export type ApiInputType = {
  id?: string;
  verbose: string;
  property: string;
  type:
    | "text"
    | "number"
    | "select"
    | "multi_select"
    | "date"
    | "file"
    | "float"
    | "boolean"
    | "children"
    | "webcam"
    | "id_scan"
    | "mobile"
    | "email"
    | "password"
    | "text_area"
    | "json"
    | "code"
    | "address";
  placeholder?: string;
  options?: Array<InputOption>;
  optionsTags?: {
    getParentProperties: boolean;
    getOptionValueFromStore?: {
      path: string;
      keyForLabel: string;
      keyForValue: string;
    };
  };
  endpoint?: string;
  children?: ApiInputType[];
  isOptional?: boolean;
  isReadOnly?: boolean;
  multiple?: boolean;
  imageOption?: {
    aspectRatio: number;
  };
  tag?: "foreign_key" | "csv" | "searchable";
  filterOption?: {
    property?: string;
  };
  childrenConfig?: {
    addChildButtonLabel?: string;
    childLabel?: string; // the label to put to replace the label : Enfant #1
    childrenMaxDepth?: // keep null for undefined childs
    | number
      | null
      | {
          return: number | null;
          if: { [property: string]: string | number | boolean };
          else: number | null;
        };
    childrenLimit?: {
      return: number;
      returnFromStorePath?: string; // put the store path here. Make sure it always a number
    };
  };
  /* 
      
        you can put any you want. This key will be mapped in the client app to display the component 
        Make sur the property key is one of the form field. 
        The property key is the path of the key. For exemple, for key that are object you can specify the path like a Javascript object. E.g. : 
  
      */
  displayIf?: DisplayIf | DisplayIf[];

  style?: {
    colSpan?: "full";
    childrenColumns?: 1 | 2;
  };
  codeEditorConfig?: {
    language: "javascript" | "json" | "markdown";
  };
  doc?: string; // put this to explain correctly the utility of a field
};

export type InputValueType = {
  id?: string;
  errorMessage?: string;
  value: any;
  children?: Record<string, InputValueType>;
};

export type ValueType =
  | null
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[]
  | Record<string, any>
  | Record<string, any>[];

export interface InputType extends ApiInputType {
  id?: string;
  parentValue?: Record<string, any> | null;
  grandparentValue?: Record<string, any> | null;
  parentFields?: ApiInputType[];
  depth?: number;
  value: ValueType;
  storePath?: string;
  setValue: (value: ValueType) => void;
  onSearch?: (value: string) => void;
}

export type ApiResponse = {
  code: number;
  message: string;
  data: any;
};

export interface FormData {
  id: string;
  values: Record<string, InputValueType | FormData[]>;
}

export interface FormProps {
  title: string;
  onSuccess?: (data: {
    code: number;
    message: string;
    data: Record<string, any>;
  }) => void;
  actions?: React.ReactNode;
  topInputsBlock?: React.ReactNode;
  values?: Record<string, InputValueType | FormData[]>;
  displayHeader?: boolean;
  gridCols?: "grid-cols-2" | "grid-cols-1";
  headPath?: string;
  submitPath?: string;
  inputs?: ApiInputType[];
  data?: Record<string, any>;
  submitMethod?: "post" | "patch" | "put";
  loadingState?: boolean;
  displaySubmitButton?: boolean;
  updateExternalStore?: (key: string, data: any) => void;

  setLoadingState?: (state: boolean) => void;
  onSubmit?: (data: Record<string, any>) => void;
  doBeforSubmit?: (data: Record<string, any>) => Record<string, any>;
}

export interface SimpleIndicatorProps {
  icon?: string;
  value: string | number;
  progressComment: string;
  title: string;
  unit?: string;
  color:
    | "text-green-500"
    | "text-red-500"
    | "text-yellow-500"
    | "text-blue-500"
    | "text-indigo-500"
    | "text-purple-500"
    | "text-pink-500";
  background?: string;
  width?: string;
}
