import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ViewCaseCard = ({ title, description, expanded, onSendOffer }) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);
  const [isSending, setIsSending] = React.useState(false);

  const handleSendOfferClick = async (e) => {
    e.stopPropagation();
    setIsSending(true);
    try {
      await onSendOffer();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div
        className="p-6 cursor-pointer flex justify-between items-start"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className={`mt-2 text-gray-600 ${isExpanded ? "" : "line-clamp-2"}`}>
            {description}
          </p>
        </div>
        <button className="ml-4 p-1 hover:bg-gray-100 rounded">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="mt-4 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Here's how I can assist you:</h4>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Review Documents: I’ll check any relevant paperwork to understand your case.</li>
                <li>Negotiation: I’ll work to resolve this efficiently on your behalf.</li>
              </ul>
            </div>
            <button
              className={`px-6 py-2 text-white rounded-lg ${
                isSending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleSendOfferClick}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "WRITE AN OFFER"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCaseCard;