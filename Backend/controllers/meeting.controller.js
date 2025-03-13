import Meeting from "../models/meeting.model";
import Case from "../models/case.model";
import Lawyer from "../models/lawyer.model";
import User from "../models/user.model";

//Schedule Meeting
export const scheduleMeeting = async (req, res) => {
    try {
        const {caseId, scheduleAt} = req.body;
        const clientId = req.user._id;
        const caseData = await Case.findById(caseId);
        if(!caseData) return res.status(404).json({msg:"Case not found"});

        const lawyerId = caseData.lawyerId;
        if(!lawyerId) return res.status(404).json({msg:"Lawyer not found"});

        if(caseData.clientId.toString() !== clientId.toString()){
            return res.status(403).json({msg:"Unauthorized to schedule for this case"});
        }

        const scheduleTime = new Date(scheduleAt);
        if(scheduleTime < new Date()){
            return res.status(400).json({msg:"Schedule time cannot be in the past"});
        }

        const newMeeting = new Meeting({
            lawyerId,
            clientId,
            caseId,
            scheduleAt: scheduleTime,
        });

        await meetingModel.save();

        //Notify lawyer via websocket (optional)


        const lawyerWs = global.clients.get(lawyerId.toString());
        if(lawyerWs && lawyerWs.readyState === WebSocket.OPEN){
            lawyerWs.send(
                JSON.stringify({
                    type: "meeting",
                    meeting :{
                        _id: meeting._id,
                        caseId,
                        scheduleAt,
                        meetingId: meeting.meetingId,
                    },
                })
            );
                    }

        res.status(200).json({success: true, data: meeting, msg:"Meeting scheduled successfully"});

    } catch (error) {
        console.error("Error scheduling meeting:", error);
        res.status(500).json({success: false, msg:"Server error"});
    }
};

//Get scheduled meetings for the logged-in user

export const getMeetings = async (req, res) => {
    try {
       const userId = req.user._id;
       const isLawyer = await Lawyer.findById(userId);
       const filter = isLawyer ? {lawyerId: userId} : {clientId: userId};
       const meetings = await Meeting.find(filter)
       .populate("caseId")
       .sort({scheduleAt: 1});

       res.status(200).json({success: true, data: meetings, msg:"Meetings fetched successfully"});
    } catch (error) {
        console.error("Error fetching meetings:", error);
        res.status(500).json({success: false, msg:"Server error"});
    }
};
       