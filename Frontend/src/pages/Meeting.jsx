import React from "react";
import videoMeet from "../Components/videoMeet";
import {useParams} from "react-router-dom";

const Meeting = () => {
    const {meetingId} = useParams();

    return(
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Scheduled Meeting </h1>
            <videoMeet meetingId={meetingId} />
        </div>
    );

};

export default Meeting;