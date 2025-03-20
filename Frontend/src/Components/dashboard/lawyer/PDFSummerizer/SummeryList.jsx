import React from "react";

const SummeryList = ({summaries, setCurrentSummary}) => {
    const displayedSummaries = summaries.slice(0, 5); 
    
    return (
        <div>
          <h4 className="text-gray-700 text-base font-semibold mb-2">Previous Summaries</h4>
          {displayedSummaries.length === 0 ? (
            <p className="text-sm text-gray-500">No summaries yet.</p>
          ) : (
            <ul className="list-none p-0 max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {displayedSummaries.map((summary) => (
                <li
                  key={summary._id}
                  onClick={() => setCurrentSummary(summary)}
                  className="p-2 bg-blue-50 mb-2 cursor-pointer text-sm rounded hover:bg-blue-100 transition"
                >
                  Summary {new Date(summary.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };

export default SummeryList;