import React, { useEffect, useState } from "react";
import { useStore } from "zustand";
import { ApiInputType, FormProps } from "@/types/types";
import SVGComponent from "../atoms/displaySVG";
import HttpClient from "@/utils/http-client";
import Loader from "../atoms/loader";
import { JsonFeedBacksCard } from "../atoms/display-error";
import ResizableComponent from "../commons/resizableComponent";
import Button from "../commons/button";
import Input from "./inputs/input";
import { formValueStore } from "../store/form_value.store";
import { containsFile, objectToFormData } from "./utils";

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
  const [formFields, setFormFields] = useState<ApiInputType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    { code: number; message: string; [key: string]: any } | undefined
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
          const valideData: Record<string, any> = {};
          for (const field of response.data) {
            valideData[field.property] = data?.[field.property] || null;
          }
          setValue({ ...valideData, id: data?.id || null });
        }
      } catch (err: any) {
        setError({
          code: 500,
          message:
            "Une erreur s'est produite lors du chargement du formulaire.",
          error: { message: err.message },
        });
      } finally {
        setLoading(false);
      }
    };

    if (headPath) fetchFormFields();
    else if (inputs) {
      setFormFields(inputs);
      if (data) {
        const valideData: Record<string, any> = {};
        for (const field of inputs) {
          valideData[field.property] = data?.[field.property] || null;
        }
        setValue({ ...valideData, id: data?.id || null });
      }
    }
  }, [headPath, inputs, data]);

  /* ------------------ Handle Submit ------------------ */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    let formData = containsFile(value) ? objectToFormData(value) : value;

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
    const response: any = await httpClient[method](submitPath, formData);

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
                  value={value[field.property]}
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
