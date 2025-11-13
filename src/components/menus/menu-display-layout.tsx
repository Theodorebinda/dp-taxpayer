import { useStore } from "zustand";
import SVGComponent from "../atoms/displaySVG";
import { applictionsStore } from "../store/applications";

const DisplayLayoutMenu = () => {
  const { displayLayout, setDisplayLayout } = useStore(applictionsStore);
  return (
    <div className="top-8 right-12 z-20 flex items-center gap-2 bg-background p-1 rounded-lg">
      <button
        onClick={() => setDisplayLayout("list")}
        className={`p-2 rounded-md ${
          displayLayout === "list"
            ? "bg-primary text-background"
            : "hover:bg-muted"
        }`}
        aria-label="List layout"
      >
        <SVGComponent
          icon={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>`}
        />
      </button>
      <button
        onClick={() => setDisplayLayout("grid")}
        className={`p-2 rounded-md ${
          displayLayout === "grid"
            ? "bg-primary text-background"
            : "hover:bg-muted"
        }`}
        aria-label="Grid layout"
      >
        <SVGComponent
          icon={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`}
        />
      </button>
    </div>
  );
};

export default DisplayLayoutMenu;
