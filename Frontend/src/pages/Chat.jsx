import React from "react";
import { AppContext } from "../Context/AppContext";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import MessageContainer from "../Components/messages/MessageContainer";
import AuthDebugger from "../Components/AuthDebugger";

function Chat() {
  return (
<div className="flex flex-col h-screen w-screen bg-gray-200">      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50">
      </div>

      {/* Header */}
      <div className="z-40">
          <Header />
      </div>

        {/* Page Content */}
        <div className="flex-1 " >
          <MessageContainer/>
        </div>
        
       
      
    </div>
  );
}

export default Chat;