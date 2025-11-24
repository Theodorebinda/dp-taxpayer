import TextInput from "../inputs/textInput";
import PasswordInput from "../inputs/passwordInput";
import SelectInput from "../inputs/selectInput";
import MultiSelectInput from "../inputs/multiSelectInput";
import BooleanInput from "../inputs/booleanInput";
import InputFile from "../inputs/inputFile";
import InputWebcam from "../inputs/webCam";
import PhoneNumberInput from "../inputs/inputMobile";
import TextAreaInput from "../inputs/textArea";
// import CodeDisplayInput from "../inputs/codeDisplayer";
import CsvExcelImportInput from "../inputs/csvImporter";
import ChildrenInput from "../inputs/childrenInput";
import useDynamicOptions from "./useDynamicOptions";
import { InputType } from "@/types/types";

export const InputPerType = ({ depth = 0, ...props }: InputType) => {
  const { dynamicOptions, searchLoading, handleSearch } =
    useDynamicOptions(props);

  const commonSelectProps = {
    ...props,
    options: dynamicOptions,
    searchLoading,
    ...(props.endpoint && { onSearch: handleSearch }),
  };

  switch (props.type) {
    case "multi_select":
      return props.tag === "searchable" ? (
        <SelectInput {...commonSelectProps} />
      ) : (
        <MultiSelectInput {...props} options={dynamicOptions} />
      );

    case "select":
      return <SelectInput {...commonSelectProps} />;

    case "boolean":
      return <BooleanInput {...props} />;

    case "file":
      return <InputFile {...props} />;

    case "webcam":
      return <InputWebcam {...props} />;

    case "mobile":
      return <PhoneNumberInput {...props} />;

    case "text_area":
      return <TextAreaInput {...props} />;

    case "password":
      return <PasswordInput {...props} />;

    case "json":

    case "children":
      return props.tag === "csv" ? (
        <CsvExcelImportInput {...props} />
      ) : (
        <ChildrenInput {...props} depth={depth} />
      );

    default:
      return <TextInput {...props} />;
  }
};
