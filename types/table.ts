export interface DataTableColumnType<T> {
  property: keyof T;
  verbose: string;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  type?:
    | "text"
    | "email"
    | "boolean"
    | "enum"
    | "json"
    | "sub-tab"
    | "numeric"
    | "mobile"
    | "date"
    | "url"
    | "photo"
    | "file"
    | "svg"
    | "image"
    | "icon"
    | "link"
    | "copyable";
  enumOptions?: {
    key: string;
    color:
      | "red"
      | "green"
      | "blue"
      | "yellow"
      | "purple"
      | "indigo"
      | "pink"
      | "gray"
      | "teal"
      | "cyan"
      | "orange";
    startIcon?: string;
    endIcon?: string;
  }[];
}

export interface TableProps<T> {
  data: T[];
  dataLength: number;
  setData: (data: T[]) => void;
  setError: (data: any) => void;
  setLoading: (state: boolean) => void;
  columns: DataTableColumnType<T>[];
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  setRefreshData: () => void;
  filters?: React.ReactNode;
  searchable?: boolean;
  searchKeys?: Array<keyof T>;
  className?: string;
  viewAction: {
    url?: string;
    label?: string;
    active: boolean;
  };
  onPageChange: (page: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setRequestor: (
    path:
      | { path: string; method: "GET" }
      | { path: string; method: "POST"; body: Record<string, any> }
  ) => void;
  searching: boolean;
  setSearching: (state: boolean) => void;
  searchingError:
    | {
        code: number;
        message: string;
        [key: string]: any;
      }
    | undefined;
  setSearchingError: (error: {
    code: number;
    message: string;
    [key: string]: any;
  }) => void;
}
