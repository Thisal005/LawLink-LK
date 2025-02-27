import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../Context/AppContext'; // Adjust path as needed

const AuthDebugger = () => {
  const { backendUrl, userData, lawyerData } = useContext(AppContext);
  const [debugInfo, setDebugInfo] = useState({});
  const [testResult, setTestResult] = useState('');

  const checkCookies = () => {
    const cookies = document.cookie;
    setDebugInfo(prev => ({
      ...prev,
      cookies: cookies || 'No cookies found'
    }));
  };

  const checkUserData = () => {
    setDebugInfo(prev => ({
      ...prev,
      userData: userData ? JSON.stringify(userData, null, 2) : 'No user data',
      lawyerData: lawyerData ? JSON.stringify(lawyerData, null, 2) : 'No lawyer data'
    }));
  };

  const testBackendConnection = async () => {
    try {
      setTestResult('Testing...');
      const response = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true
      });
      setTestResult(`Success! Response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setTestResult(`Error: ${error.message}. ${error.response ? JSON.stringify(error.response.data) : ''}`);
    }
  };

  const testMessageEndpoint = async () => {
    try {
      setTestResult('Testing message endpoint...');
      const receiverId = "67b96ed0823f5c33a83ec119";
      const response = await axios.post(
        `${backendUrl}/api/messages/send/${receiverId}`,
        { message: "Test message from debugger" },
        { withCredentials: true }
      );
      setTestResult(`Message endpoint success! Response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setTestResult(`Message endpoint error: ${error.message}. ${error.response ? JSON.stringify(error.response.data) : ''}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 my-4">
      <h2 className="text-xl font-bold mb-4">Auth Debugger</h2>
      
      <div className="space-y-2 mb-4">
        <button 
          onClick={checkCookies}
          className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
        >
          Check Cookies
        </button>
        
        <button 
          onClick={checkUserData}
          className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
        >
          Check User Data
        </button>
        
        <button 
          onClick={testBackendConnection}
          className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
        >
          Test Backend Connection
        </button>
        
        <button 
          onClick={testMessageEndpoint}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Test Message Endpoint
        </button>
      </div>
      
      <div className="mt-4">
        <h3 className="font-bold">Debug Info:</h3>
        <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto max-h-40">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
      
      <div className="mt-4">
        <h3 className="font-bold">Test Result:</h3>
        <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto max-h-40">
          {testResult}
        </pre>
      </div>
    </div>
  );
};

export default AuthDebugger;