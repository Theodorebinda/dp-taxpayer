export function validateImageUrl(url: string | null): string | null {
  if (url == null) return null;
  else
    return isValidUrlRegex(url)
      ? url
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}${
          url[0] == "/" ? "" : "/"
        }${url}`;
}

export function isValidUrlRegex(url: string): boolean {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)" +
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" +
      "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" +
      "(\\#[-a-zA-Z\\d_]*)?$",
    "i"
  );
  return urlPattern.test(url);
}

export function formatPhoneNumber(phone?: string): string | false {
  if (!phone || typeof phone !== "string") {
    return false;
  }
  if (!phone?.startsWith("+") || phone.length < 4) {
    return phone;
  }

  try {
    const countryCode = phone.slice(0, 4);
    const firstPart = phone.slice(4, 7);
    const secondPart = phone.slice(7, 10);
    const thirdPart = phone.slice(10);

    return `${countryCode} ${firstPart} ${secondPart} ${thirdPart}`;
  } catch (error) {
    console.log(error);
    return phone;
  }
}

export function formatNumberWithGroups(number: string | number): string {
  const numStr = String(number).replace(/\D/g, "");

  if (numStr.length === 0) {
    return numStr;
  }

  let result = "";
  for (let i = numStr.length - 1, count = 0; i >= 0; i--) {
    result = numStr[i] + result;
    count++;
    if (count % 3 === 0 && i !== 0) {
      result = " " + result;
    }
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getValueFromPath(obj: Record<string, any>, path: string) {
  // Divise le chemin en segments en utilisant le point comme séparateur
  const segments = path.split(".");

  // Parcourt chaque segment du chemin
  for (const segment of segments) {
    // Vérifie si le segment est un tableau (par exemple, "childs[0]")
    if (segment.includes("[")) {
      // Extrait le nom de la propriété et l'indice
      const [prop, index] = segment.split(/\[|\]/g);
      obj = obj[prop][index];
    } else {
      // Sinon, accède simplement à la propriété
      obj = obj[segment];
    }

    // Si à un moment donné obj est undefined, on retourne undefined
    if (obj === undefined) {
      return undefined;
    }
  }

  // Retourne la valeur finale trouvée
  return obj;
}

export function isNumeric(value: unknown): boolean {
  if (typeof value === "number") {
    return !isNaN(value) && isFinite(value);
  }

  if (typeof value === "string") {
    return value.trim() !== "" && !isNaN(Number(value));
  }

  return false;
}

export const greeting = () => {
  const currentHours = new Date().getHours();
  if (currentHours < 12) {
    return "Bonjour";
  } else if (currentHours < 18) {
    return "Bon après-midi";
  } else {
    return "Bonsoir";
  }
};

export const getFullImageUrl = (url: string | null) => {
  if (url == null || url.length == 0) return "";
  if (url.startsWith("http")) return url;
  else
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${
      url[0] == "/" ? "" : "/"
    }${url}`;
};

export function capitalizeFirst(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function isPlainObject(obj: unknown): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export function removeLastElements(
  str: string,
  separator: string,
  n: number = 1
): string {
  if (!str || n < 0) return str;
  const parts = str.split(separator);
  if (n >= parts.length) return "";
  return parts.slice(0, parts.length - n).join(separator);
}

/**
 * Convertit une date au format DD/MM/YYYY ou autre format en YYYY-MM-DD pour les inputs date HTML
 * @param dateString - Date au format DD/MM/YYYY, YYYY-MM-DD, ISO string, ou autre format
 * @returns Date au format YYYY-MM-DD ou chaîne vide si invalide
 */
export function formatDateForInput(
  dateString: string | null | undefined
): string {
  if (!dateString) return "";

  try {
    // Si c'est déjà au format YYYY-MM-DD, le retourner tel quel
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Si c'est au format DD/MM/YYYY (ex: "15/05/1990")
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    }

    // Si c'est un ISO string avec l'heure, extraire juste la date
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    // Essayer de parser avec new Date
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }

    return "";
  } catch {
    return "";
  }
}
