import React from 'react';
import { Bell, Calendar, Grid, Eye, Settings, Upload, X, HelpCircle, User, FileText, MessageSquare } from 'lucide-react';

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white h-full flex-shrink-0">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-12">
            <div className="text-2xl font-bold tracking-tight">LawLink<span className="text-sm align-top ml-0.5">LK</span></div>
          </div>
          
          <nav className="space-y-4">
            <a href="#" className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-700/50 px-4 py-2 rounded-lg transition-colors">
              <Grid className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-700/50 px-4 py-2 rounded-lg transition-colors">
              <User className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </a>
            <a href="#" className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-700/50 px-4 py-2 rounded-lg transition-colors">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Cases</span>
            </a>
            <a href="#" className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-700/50 px-4 py-2 rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Messages</span>
            </a>
            <a href="#" className="flex items-center gap-3 text-white/90 hover:text-white hover:bg-blue-700/50 px-4 py-2 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </a>
          </nav>

          <div className="mt-12">
            <h3 className="text-sm font-semibold mb-4 px-4 text-white/70">ACTIVE CASES</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700/50 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-sm font-medium">Smith vs. Johnson</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700/50 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span className="text-sm font-medium">Estate Planning</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700/50 rounded-lg cursor-pointer transition-colors">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-sm font-medium">Corporate Merger</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white h-16 flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Account Settings</h1>
          <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Calendar className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right">
                <div className="font-medium text-gray-900">Michael Thompson</div>
                <div className="text-sm text-gray-500">Criminal Law</div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
              />
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <main className="p-8 flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="space-y-8">
                  {/* Profile Picture Section */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
                    <div className="flex items-center gap-6">
                      <img 
                        src="https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-100"
                      />
                      <div className="space-y-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload new photo
                        </button>
                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors block text-sm">
                          Remove photo
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                      <input 
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="How clients will see you"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Your legal name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                      <input 
                        type="tel"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+94 XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                      <input 
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., LLB, Attorney at Law"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Practice Areas</label>
                      <input 
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., Criminal Law, Corporate Law"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Professional Biography</label>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-32"
                        placeholder="Tell clients about your experience and expertise..."
                      ></textarea>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4">
                    <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;