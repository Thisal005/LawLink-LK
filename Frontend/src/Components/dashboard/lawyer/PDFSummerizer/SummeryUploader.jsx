import React, { useContext } from "react";
import { FiUpload } from "react-icons/fi";
import { AppContext } from "../../../../Context/AppContext";
import { toast } from "react-toastify";


const SummeryUploader = ({setCurrentSummary, setSummaries}) => {
    const {backendUrl} = useContext(AppContext);
    

    const handelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("pdf", file);

        try {
            const response = await fetch(`${backendUrl}/api/summarization/summarize`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentSummary({summary: data.summary, audioUrl: data.audioUrl});
                setSummaries((prev) => [
                    {
                        _id: Date.now(),
                        summary: data.summary,
                        audioUrl: data.audioUrl,
                        createdAt: new Date(),
                    },
                    ...prev,
                ]);
            } else {
                console.error("Error uploading PDF:", response.statusText);
            }
        } catch (error) {
            console.error("Error uploading PDF:", error);
            toast.error("Failed to upload PDF.");
            }
    };

    return (
        <div className="mb-4">
          <h4 className="text-gray-700 text-base font-semibold mb-2">Upload Your PDF</h4>
          <label
            className="block border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-gray-400 transition"
          >
            <input type="file" accept=".pdf" onChange={handelUpload} className="hidden" />
            <FiUpload className="mx-auto text-2xl text-gray-500" />
            <p className="mt-1 text-sm text-gray-600">Upload PDF</p>
          </label>
        </div>
      );
    };
    
    export default SummeryUploader;