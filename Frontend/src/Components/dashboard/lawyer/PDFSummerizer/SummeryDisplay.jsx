import React from "react";
import { FiVolume2 } from "react-icons/fi";

const SummaryDisplay = ({currentSummary}) => {
    const handlePlayAudio = () => {
        if (currentSummary?. audioUrl) {
          const audio = new Audio(currentSummary.audioUrl);
          audio.play();
        }
      };

      return (
        <div className="p-4 bg-gray-50 rounded-lg min-h-[200px] relative">
          {currentSummary ? (
            <>
              <p className="text-sm text-gray-800">{currentSummary.summary}</p>
              {currentSummary.audioUrl && (
                <button
                  onClick={handlePlayAudio}
                  className="absolute bottom-3 right-3 text-gray-600 hover:text-gray-800 transition"
                >
                  <FiVolume2 className="text-xl" />
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">Upload a PDF or select a summary to view.</p>
          )}
        </div>
      );
    };
    
    export default SummaryDisplay;