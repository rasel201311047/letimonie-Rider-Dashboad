import { useMemo, useRef } from "react";
import JoditImport from "jodit-react";
import toast, { Toaster } from "react-hot-toast";

//  Safe import for Vite / ESM
const JoditEditor = (JoditImport as any).default ?? JoditImport;

interface TypeboxProps {
  value: string;
  onChange: (content: string) => void;
  onSave?: (htmlContent: string) => void;
}

export default function Typebox({ value, onChange, onSave }: TypeboxProps) {
  const editor = useRef<any>(null);

  const config = useMemo(() => {
    const isSmallScreen = window.innerWidth < 768;
    return {
      readonly: false,
      height: isSmallScreen ? 300 : 500,
      placeholder: "Start typing...",
      toolbar: true,
      statusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showPoweredBy: false,
      buttons: [
        "fontsize",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "left",
        "center",
        "right",
        "justify",
      ],
    };
  }, []);

  const handleSave = () => {
    if (editor.current) {
      const htmlContent = editor.current?.value;

      if (onSave) onSave(htmlContent);

      // Show toast notification
      toast.success("Saved successfully!");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="border rounded-lg bg-white">
        <JoditEditor
          ref={editor}
          value={value}
          config={config}
          onBlur={(newContent: string) => onChange(newContent)}
        />
      </div>

      <button
        onClick={handleSave}
        type="submit"
        className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#053F53] to-[#0470949f] py-3 text-sm font-medium text-white hover:opacity-90 transition"
      >
        Save
      </button>

      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
