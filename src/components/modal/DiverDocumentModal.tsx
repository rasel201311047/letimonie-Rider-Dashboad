import { X } from "lucide-react";

interface DiverDocumentModalProps {
  open: boolean;
  driverId: string | null;
  onClose: () => void;
}

export default function DiverDocumentModal({
  open,

  onClose,
}: DiverDocumentModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-4xl h-[85%] max-h-[800px] rounded-2xl shadow-2xl p-6 relative flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6 ">
          <h2 className="text-2xl font-bold text-gray-800">Driver Documents</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* VTC Card Section */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 ">
              VTC Card
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="">
                <img
                  src="https://i.ibb.co.com/TBNLqH11/Rectangle-161124491.png"
                  alt="VTC Card Front"
                  className="w-full h-64 object-contain hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                  onClick={() =>
                    window.open(
                      "https://i.ibb.co.com/TBNLqH11/Rectangle-161124491.png",
                      "_blank"
                    )
                  }
                />
              </div>
              <div className=" ">
                <img
                  src="https://i.ibb.co.com/HDD0hyY9/Rectangle-161124490.png"
                  alt="VTC Card Back"
                  className="w-full h-64 object-contain hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                  onClick={() =>
                    window.open(
                      "https://i.ibb.co.com/HDD0hyY9/Rectangle-161124490.png",
                      "_blank"
                    )
                  }
                />
              </div>
            </div>
          </section>

          {/* Driving License Section */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 ">
              Driving License
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg ">
                <img
                  src=" https://i.ibb.co.com/bgCLz5yn/Rectangle-161124491-1.png"
                  alt="Driving License Front"
                  className="w-full h-64 object-contain hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                  onClick={() =>
                    window.open(
                      " https://i.ibb.co.com/bgCLz5yn/Rectangle-161124491-1.png",
                      "_blank"
                    )
                  }
                />
              </div>
              <div className=" ">
                <img
                  src="https://i.ibb.co.com/6RFRGhBq/Rectangle-161124490-1.png"
                  alt="Driving License Back"
                  className="w-full h-64 object-contain hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                  onClick={() =>
                    window.open(
                      "https://i.ibb.co.com/6RFRGhBq/Rectangle-161124490-1.png",
                      "_blank"
                    )
                  }
                />
              </div>
            </div>
          </section>

          {/* Vehicle Photo Section */}
          <section className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 ">
              Vehicle Photos
            </h3>
            <div className="">
              <img
                src="https://i.ibb.co.com/6RkshDyc/Rectangle-161124491-2.png"
                alt="Vehicle Front"
                className=" object-cover hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                onClick={() =>
                  window.open(
                    "https://i.ibb.co.com/6RkshDyc/Rectangle-161124491-2.png",
                    "_blank"
                  )
                }
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
