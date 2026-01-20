import React, { useEffect, useState } from "react";
import { useStore } from "zustand";
import { ApiInputType, FormProps, ValueType } from "@/types/types";
import { evaluateDisplayIf } from "@/modules/formEngine/validators";
import SVGComponent from "../atoms/displaySVG";
import HttpClient from "@/utils/http-client";
import Loader from "../atoms/loader";
import { JsonFeedBacksCard } from "../atoms/display-error";
import ResizableComponent from "../commons/resizableComponent";
import Button from "../commons/button";
import Input from "./inputs/input";
import { formValueStore } from "../store/form_value.store";
import { containsFile, objectToFormData } from "./utils";

const buildVisiblePayload = (
  fields: ApiInputType[],
  values: Record<string, unknown>
) => {
  const payload: Record<string, unknown> = {};

  const extractVisibleValues = (
    fieldsToProcess: ApiInputType[],
    currentValues: Record<string, unknown>
  ) => {
    for (const field of fieldsToProcess) {
      if (!evaluateDisplayIf(field.displayIf, currentValues)) {
        continue;
      }

      const fieldValue = currentValues[field.property];

      if (field.type === "children" && field.children?.length) {
        if (field.multiple && Array.isArray(fieldValue)) {
          const childrenArray = fieldValue.map((childObj) => {
            if (typeof childObj === "object" && childObj !== null) {
              const childPayload: Record<string, unknown> = {};
              field.children!.forEach((childField) => {
                const childValues = childObj as Record<string, unknown>;
                if (!evaluateDisplayIf(childField.displayIf, childValues)) {
                  return;
                }
                const childValue = childValues[childField.property];
                if (
                  childValue !== undefined &&
                  childValue !== null &&
                  childValue !== ""
                ) {
                  childPayload[childField.property] = childValue;
                }
              });
              return childPayload;
            }
            return childObj;
          });
          payload[field.property] = childrenArray;
        } else if (
          !field.multiple &&
          typeof fieldValue === "object" &&
          fieldValue !== null &&
          !Array.isArray(fieldValue)
        ) {
          const childPayload: Record<string, unknown> = {};
          const childValues = fieldValue as Record<string, unknown>;
          field.children.forEach((childField) => {
            if (!evaluateDisplayIf(childField.displayIf, childValues)) {
              return;
            }
            const childValue = childValues[childField.property];
            if (
              childValue !== undefined &&
              childValue !== null &&
              childValue !== ""
            ) {
              childPayload[childField.property] = childValue;
            }
          });
          payload[field.property] = childPayload;
        }
        continue;
      }

      if (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== ""
      ) {
        payload[field.property] = fieldValue;
      }
    }
  };

  extractVisibleValues(fields, values || {});

  if ("id" in values && values.id != null) {
    payload.id = values.id;
  }

  return payload;
};

const Form: React.FC<FormProps> = ({
  title,
  onSuccess,
  onSubmit,
  actions,
  topInputsBlock,
  displayHeader = true,
  headPath,
  submitPath,
  inputs,
  data,
  setLoadingState,
  submitMethod,
  doBeforSubmit,
  loadingState,
  displaySubmitButton = false,
  updateExternalStore,
}) => {
  type FormSubmitResponse = {
    code: number;
    message: string;
    data: Record<string, unknown>;
  };
  const [formFields, setFormFields] = useState<ApiInputType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    { code: number; message: string; [key: string]: unknown } | undefined
  >();

  const { value, setValue, setValueKey } = useStore(formValueStore);

  /* ------------------ Load Form Fields ------------------ */
  useEffect(() => {
    const fetchFormFields = async () => {
      setLoading(true);
      const httpClient = new HttpClient();

      try {
        const response:
          | { code: number; message: string; data: ApiInputType[] }
          | false = headPath
          ? await httpClient.get(headPath)
            : { code: 200, message: "OK", data: inputs || [] };
        
     

        if (!response) {
          console.log(httpClient.error);
          setError(
            httpClient.error || { code: 500, message: "Erreur inconnue" }
          );
          setLoading(false);
          return;
        }

        setFormFields(response.data);
        if (data) {
          const valideData: Record<string, unknown> = {};
          for (const field of response.data) {
            valideData[field.property] = data?.[field.property] || null;
          }
          setValue({ ...valideData, id: data?.id || null });
        }


        console.log({response})
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError({
          code: 500,
          message:
            "Une erreur s'est produite lors du chargement du formulaire.",
          error: { message },
        });
      } finally {
        setLoading(false);
      }
    };

    if (headPath) fetchFormFields();
    else if (inputs) {
      setFormFields(inputs);
      if (data) {
        const valideData: Record<string, unknown> = {};
        for (const field of inputs) {
          valideData[field.property] = data?.[field.property] || null;
        }
        setValue({ ...valideData, id: data?.id || null });
      }
    }
  }, [headPath, inputs, data, setValue]);

  /* ------------------ Handle Submit ------------------ */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    const visiblePayload = buildVisiblePayload(formFields, value || {});
    let formData = containsFile(visiblePayload)
      ? objectToFormData(visiblePayload)
      : visiblePayload;

    if (doBeforSubmit && !(formData instanceof FormData))
      formData = doBeforSubmit(formData);

    if (onSubmit) return onSubmit(formData);

    if (!submitPath) {
      return setError({
        code: 500,
        message: "Le chemin de soumission n'a pas été spécifié.",
      });
    }

    const httpClient = new HttpClient();
    if (setLoadingState) setLoadingState(true);

    const method = submitMethod || (data ? "patch" : "post");
    const response = (await httpClient[method](
      submitPath,
      formData
    )) as FormSubmitResponse | undefined;

    if (response && response.code < 399) {
      onSuccess?.(response);
      setValue({});
    } else {
      setError({
        code: httpClient.error?.code || 500,
        message:
          httpClient.error?.message ||
          "Une erreur s'est produite. Veuillez réessayer plus tard.",
        error: httpClient.error,
      });
    }

    if (setLoadingState) setLoadingState(false);
  };

  if (loading) return <Loader />;

  if (formFields.length === 0) {
    return (
      <div className="p-8 rounded-md bg-background flex flex-col items-center justify-between h-full gap-10">
        <SVGComponent
          width="100"
          height="100"
          icon='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>'
        />
        <span>{error?.message || "Formulaire introuvable"}</span>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col w-full transition-all"
      onSubmit={handleSubmit}
    >
      {displayHeader && (
        <>
          <div className="p-8 rounded-md bg-background flex items-center justify-between border-b-2 border-dashed max-md:flex-col max-md:gap-5">
            <h1 className="text-xl font-bold max-md:w-full text-left">
              {title}
            </h1>
            {actions}
          </div>
          {topInputsBlock}
        </>
      )}

      <div className="flex gap-5 max-md:flex-col-reverse">
        <div className="p-8 bg-background rounded-md space-y-5 flex-1">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5">
            {(formFields || [])?.map((field) => {
              const options = field?.optionsTags?.getParentProperties
                ? formFields
                    .map((field) => {
                      if (field.type == "children") return null;
                      return { value: field.property, label: field.verbose };
                    })
                    .filter((field) => field !== null)
                : field.options;
              return (
                <Input
                  key={field.property}
                  {...field}
                  parentValue={value}
                  value={value[field.property] as ValueType}
                  options={options}
                  parentFields={formFields}
                  setValue={(v) => {
                    setValueKey(field.property, v);
                    if (updateExternalStore)
                      updateExternalStore(field.property, v);
                  }}
                  depth={0}
                  storePath={`${field.property}`}
                >
                  {field.children || formFields}
                </Input>
              );
            })}
          </div>
          {!displayHeader && actions}
          {displaySubmitButton && (
            <Button className="w-full" type="submit" isLoading={loadingState}>
              Soumettre
            </Button>
          )}
        </div>

        {error && (
          <ResizableComponent>
            <JsonFeedBacksCard
              message={error.message}
              code={error.code}
              status={error.code < 400 ? "success" : "error"}
              errorDetails={error}
              showActions={false}
            />
          </ResizableComponent>
        )}
      </div>
    </form>
  );
};

export default Form;
