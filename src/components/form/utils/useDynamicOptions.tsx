import HttpClient from "@/utils/http-client";
import { iconsDictionary } from "@/components/store/icon";
import { getNestedValue } from "@/components/table/utils/utils";
import { useStore } from "zustand";
import { formValueStore } from "@/components/store/form_value.store";
import { useCallback, useEffect, useState } from "react";
import { InputOption, InputType } from "@/types/types";
import { isPlainObject, removeLastElements } from "@/utils/utils";

const useDynamicOptions = (props: InputType) => {
  const [dynamicOptions, setDynamicOptions] = useState<InputOption[]>(
    props?.options || []
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const formStore = useStore(formValueStore);

  const sortOptions = (arr: InputOption[]) =>
    [...arr].sort((a, b) =>
      a.label
        ?.toString()
        .localeCompare(b.label?.toString(), "fr", { sensitivity: "base" })
    );

  const mapStoreOptions = (value: any, tags: any): InputOption[] => {
    if (Array.isArray(value)) {
      const { keyForLabel, keyForValue } = tags;
      return value.map((item) => ({
        label: item?.[keyForLabel] ?? "null",
        value: item?.[keyForValue] ?? "null",
      }));
    }
    if (isPlainObject(value)) {
      return Object.keys(value).map((key) => ({ label: key, value: key }));
    }
    return [];
  };

  const fetchFromEndpoint = async (url: string) => {
    try {
      setSearchLoading(true);
      const httpClient = new HttpClient();
      const res: { code: number; data: InputOption[] } | false =
        await httpClient.get(url);
      return res && res.code === 200 ? sortOptions(res.data) : [];
    } catch {
      return [];
    } finally {
      setSearchLoading(false);
    }
  };

  // Recherche dynamique
  const handleSearch = useCallback(
    async (search: string) => {
      setSearchTerm(search);
      if (search?.length < 2) return;

      if (!props.endpoint || search.length < 2) return;

      const searchURL = `${props.endpoint}${
        props.endpoint.includes("?") ? "&" : "?"
      }search_term=${encodeURIComponent(search)}`;
      const data = await fetchFromEndpoint(searchURL);
      setDynamicOptions(data);
    },
    [props.endpoint]
  );

  // Fetch initial + store mapping
  useEffect(() => {
    let mounted = true;

    const loadOptions = async () => {
      const { options, endpoint, optionsTags, property, storePath } = props;

      // Icons
      if (property === "icon") {
        const iconOptions = Object.keys(iconsDictionary).map((key) => ({
          label: iconsDictionary[key].name,
          value: key,
        }));
        return mounted && setDynamicOptions(iconOptions);
      }

      // Store → options
      if (optionsTags?.getOptionValueFromStore) {
        const tags = optionsTags.getOptionValueFromStore;

        let path = tags.path as string;
        if (path?.startsWith("{PARENT_")) {
          const lvl = +(path.split("PARENT_")[1]?.[0] ?? 0) || 0;
          path = removeLastElements(storePath ?? "", "?.", lvl);
        }

        const value = path
          ? getNestedValue(formStore.value, path)
          : formStore.value;
        const mapped = mapStoreOptions(value, tags);

        return mounted && setDynamicOptions(mapped);
      }

      // Static options
      if (options && !endpoint) {
        const normalized = options.map((opt) =>
          typeof opt === "string" || typeof opt === "number"
            ? { value: opt, label: opt }
            : opt
        );
        return mounted && setDynamicOptions(normalized);
      }

      // Endpoint
      if (endpoint && props.options?.length == 0) {
        const data = await fetchFromEndpoint(endpoint);
        return mounted && setDynamicOptions(data);
      }
    };

    loadOptions();
    return () => {
      mounted = false;
    };
  }, [
    props.endpoint,
    props.options,
    props.optionsTags,
    props.property,
    formStore,
  ]);

  return { dynamicOptions, searchLoading, searchTerm, handleSearch };
};

export default useDynamicOptions;
