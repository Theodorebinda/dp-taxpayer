import { useState, useEffect, useRef } from "react";

const ObjectToJsonDisplayer = ({
  object,
  variableName = "",
}: {
  object: Record<string, any>;
  variableName?: string;
}) => {
  const json = JSON.stringify(object, null, 2);

  // Sécurité : empêcher HTML injection
  const escapeHtml = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  // Colore les clés JSON
  const html = escapeHtml(json).replace(
    /"([^"]+)"(?=\s*:)/g,
    `<span class="dark:text-sky-400 text-green-700 font-semibold">"$1"</span>`
  );

  // Vérifie si le contenu déborde
  useEffect(() => {
    if (preRef.current) {
      const { scrollHeight, clientHeight } = preRef.current;
      setIsOverflowing(scrollHeight > clientHeight + 5);
    }
  }, [json]);

  return (
    <div className="p-4 bg-bg-secondary rounded-xl border border-slate-300 dark:border-slate-700">
      <pre
        ref={preRef}
        className={`whitespace-pre-wrap rounded-xl text-sm transition-all duration-300 ${
          expanded ? "max-h-none" : "max-h-40 overflow-hidden"
        }`}
        aria-hidden
      >
        <code
          dangerouslySetInnerHTML={{
            __html: `${
              variableName
                ? `<span class='dark:text-yellow-500 text-red-800 font-semibold'>const</span> ${variableName} = `
                : ""
            }${html}`,
          }}
        />
      </pre>

      {/* Bouton uniquement si nécessaire */}
      {isOverflowing && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-sm font-medium text-primary hover:underline transition"
          >
            {expanded ? "Afficher moins ▲" : "Afficher plus ▼"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ObjectToJsonDisplayer;
