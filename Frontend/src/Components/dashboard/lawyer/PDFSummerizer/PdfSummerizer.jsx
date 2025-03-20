import React,{useState, useEffect, useContext} from "react";
import SummeryUploader from "./SummeryUploader";
import SummeryList from "./SummeryList";
import SummeryDisplay from "./SummeryDisplay";
import { AppContext } from "../../../../Context/AppContext";
import { toast } from "react-toastify";

const PDFSummerizer = ({className = ""}) => {
    const [summeries, setSummeries] = useState([]);
    const [currentSummery, setCurrentSummery] = useState(null);
    const {backendUrl} = useContext(AppContext);


    // fetch summery
    useEffect(() => {
        const fetchSummery = async () => {
            try {
                const response = await fetch(`${backendUrl}api/summarization/summarize`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                if(!response.ok) throw new Error("Failed to fetch summery");
                const data = await response.json();
                setSummeries(data);
                 
            } catch (error) {
                console.error("Error fetching summery:", error);
                toast.error("Failed to fetch summery");

            }
        };
        fetchSummery();
    }, []);

    return (
        <div
          className={`flex gap-4 p-4 bg-white rounded-lg shadow-md ${className}`}
        >
          {/* Left Section */}
          <div className="flex-1 max-w-[300px]">
            <SummeryUploader setCurrentSummary={setCurrentSummary} setSummaries={setSummaries} />
            <SummeryList summaries={summaries} setCurrentSummary={setCurrentSummary} />
          </div>
          {/* Right Section */}
          <div className="flex-2 relative">
            <SummeryDisplay currentSummary={currentSummary} />
          </div>
        </div>
      );
    };
    
    export default PDFSummerizer;