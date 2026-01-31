
import React, { useState, useEffect } from 'react';
import { VerificationOutcome, Decision } from '../types';
import { StatusBadge } from './StatusBadge';
import { Icons } from '../constants';

export const AdminDashboard: React.FC = () => {
  const [history, setHistory] = useState<VerificationOutcome[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pass, setPass] = useState('');
  const [selectedCase, setSelectedCase] = useState<VerificationOutcome | null>(null);
  const [officerComment, setOfficerComment] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('kyc_history') || '[]');
    setHistory(data);
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (pass === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid Credentials. Please use the demo password: admin123');
    }
  };

  const autofillAndLogin = () => {
    setPass('admin123');
    setIsLoggedIn(true);
  };

  const handleUpdateDecision = (newDecision: Decision) => {
    if (!selectedCase) return;

    const updatedHistory = history.map(item => {
      if (item.id === selectedCase.id) {
        return {
          ...item,
          decision: newDecision,
          officerComments: officerComment,
          reviewedBy: 'MEITY-OFF-441',
          reviewTimestamp: new Date().toLocaleString()
        };
      }
      return item;
    });

    setHistory(updatedHistory);
    localStorage.setItem('kyc_history', JSON.stringify(updatedHistory));
    
    // Langfuse logging simulation
    console.debug(`[Audit Log] Case ${selectedCase.id} resolved as ${newDecision} by MEITY-OFF-441`);
    
    setSelectedCase(null);
    setOfficerComment('');
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-20 animate-in fade-in zoom-in duration-300">
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-green-500"></div>
          <div className="flex justify-center mb-6">
            <Icons.Logo />
          </div>
          <h2 className="text-2xl font-bold text-[#000080] mb-2 text-center">Officer Authentication</h2>
          <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest mb-8 font-bold">Secure Gateway V4.2</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Officer ID</label>
              <input type="text" defaultValue="MEITY-OFF-441" disabled className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-mono" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Passcode</label>
              <input 
                type="password" 
                placeholder="Enter admin123" 
                value={pass} 
                onChange={(e) => setPass(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
              />
            </div>
            <button type="submit" className="w-full py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-all shadow-lg active:scale-95">
              Secure Login
            </button>
            
            <div className="pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={autofillAndLogin}
                className="w-full py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Use Demo Credentials (admin123)
              </button>
            </div>
          </form>
          
          <div className="mt-8 flex items-center justify-center space-x-2 opacity-40">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            <span className="text-[9px] font-bold uppercase tracking-widest">STQC Certified Environment</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">National Oversight Center</h1>
          <p className="text-slate-500 text-sm">Real-time Human-in-the-Loop (HITL) Verification Queue</p>
        </div>
        <div className="flex space-x-3">
           <button 
             onClick={() => window.print()}
             className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-tighter hover:bg-slate-50 transition-all shadow-sm"
           >
             Export Audit Log
           </button>
           <button 
             onClick={() => { localStorage.removeItem('kyc_history'); setHistory([]); setSelectedCase(null); }}
             className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold uppercase tracking-tighter hover:bg-red-100 transition-all"
           >
             Reset Simulation
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-600 group hover:shadow-md transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Live Queue</span>
          <p className="text-3xl font-bold text-navy-900 leading-none">{history.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-red-500 group hover:shadow-md transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Deepfake Detected</span>
          <p className="text-3xl font-bold text-red-600 leading-none">{history.filter(h => h.isAiGenerated).length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500 group hover:shadow-md transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">HITL Pending</span>
          <p className="text-3xl font-bold text-amber-600 leading-none">{history.filter(h => h.decision === 'REVIEW').length}</p>
          {history.filter(h => h.decision === 'REVIEW').length > 0 && (
            <span className="inline-block mt-2 text-[8px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded animate-pulse uppercase">Attention Required</span>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-green-600 group hover:shadow-md transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">System Trust Avg</span>
          <p className="text-3xl font-bold text-green-600 leading-none">
            {history.length ? (history.reduce((acc, curr) => acc + (1 - curr.overallScore), 0) / history.length * 100).toFixed(0) : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center space-x-3">
               <h3 className="font-bold text-navy-900 uppercase tracking-widest text-xs">Citizen Verification Feed</h3>
               <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Live</span>
             </div>
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Gateway Sync OK</span>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">AI Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`transition-all cursor-pointer ${selectedCase?.id === item.id ? 'bg-blue-50' : 'hover:bg-slate-50'} ${item.decision === 'REVIEW' ? 'border-l-4 border-l-amber-400' : ''}`}
                    onClick={() => setSelectedCase(item)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-blue-900">{item.id}</span>
                        <span className="text-[9px] text-slate-400 uppercase mt-0.5">{item.timestamp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-grow w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                             className={`h-full transition-all duration-1000 ${item.overallScore > 0.6 ? 'bg-red-500' : item.overallScore > 0.3 ? 'bg-amber-500' : 'bg-green-500'}`} 
                             style={{ width: `${item.overallScore * 100}%` }}
                           ></div>
                        </div>
                        <span className="font-mono text-xs font-bold">{(item.overallScore * 100).toFixed(0)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge type="decision" value={item.decision} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${item.decision === 'REVIEW' ? 'bg-amber-600 text-white shadow-sm' : 'text-blue-600 hover:bg-blue-50'}`}>
                        {item.decision === 'REVIEW' ? 'Audit Now' : 'Details'}
                      </button>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p className="text-xs font-bold uppercase tracking-[0.2em]">No Active Applications Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-full sticky top-24 transition-all">
          {selectedCase ? (
            <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
              <div className={`p-6 border-b border-slate-100 text-white ${selectedCase.decision === 'REVIEW' ? 'bg-amber-600' : 'bg-navy-900'}`}>
                 <div className="flex justify-between items-center mb-1">
                   <h3 className="font-bold uppercase tracking-widest text-[10px] opacity-70">
                     {selectedCase.decision === 'REVIEW' ? 'Priority Audit Required' : 'Case Review'}
                   </h3>
                   <button onClick={() => setSelectedCase(null)} className="text-white hover:opacity-100 opacity-60 transition-opacity">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                 </div>
                 <h2 className="text-xl font-bold font-mono">{selectedCase.id}</h2>
              </div>
              
              <div className="p-6 space-y-6 flex-grow overflow-y-auto">
                {selectedCase.decision === 'REVIEW' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3">
                    <div className="mt-0.5"><Icons.Alert /></div>
                    <div>
                      <p className="text-[11px] font-bold text-amber-900 uppercase tracking-tight">System Ambiguity Detected</p>
                      <p className="text-[10px] text-amber-700 leading-tight mt-1">AI confidence below 70% threshold. Requires officer visual confirmation of document artifacts and liveness metadata.</p>
                    </div>
                  </div>
                )}

                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Forensic Metrics</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`p-3 rounded border text-center ${selectedCase.documentScore > 0.4 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Document</span>
                      <span className={`text-lg font-bold ${selectedCase.documentScore > 0.4 ? 'text-red-600' : 'text-navy-900'}`}>{(selectedCase.documentScore * 100).toFixed(0)}</span>
                    </div>
                    <div className={`p-3 rounded border text-center ${selectedCase.biometricScore > 0.4 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Biometric</span>
                      <span className={`text-lg font-bold ${selectedCase.biometricScore > 0.4 ? 'text-red-600' : 'text-navy-900'}`}>{(selectedCase.biometricScore * 100).toFixed(0)}</span>
                    </div>
                    <div className={`p-3 rounded border text-center ${selectedCase.behaviorScore > 0.4 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Bot Risk</span>
                      <span className={`text-lg font-bold ${selectedCase.behaviorScore > 0.4 ? 'text-red-600' : 'text-navy-900'}`}>{(selectedCase.behaviorScore * 100).toFixed(0)}</span>
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Rationale</h4>
                   <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed font-medium">
                     "{selectedCase.details}"
                   </div>
                </section>

                <section className="space-y-3">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Officer Final Assessment</h4>
                   <textarea 
                     className="w-full p-4 border border-slate-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 shadow-inner bg-slate-50/50"
                     placeholder="State your findings for this manual override..."
                     value={officerComment}
                     onChange={(e) => setOfficerComment(e.target.value)}
                   />
                </section>

                {selectedCase.reviewedBy && (
                   <section className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-[10px] animate-in slide-in-from-bottom-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        <span className="font-bold text-blue-900 uppercase tracking-widest">Historical Audit Reference</span>
                      </div>
                      <p className="text-blue-800">Reviewer ID: <span className="font-mono font-bold">{selectedCase.reviewedBy}</span></p>
                      <p className="text-blue-800">Finalized On: {selectedCase.reviewTimestamp}</p>
                      {selectedCase.officerComments && <p className="mt-3 font-medium italic bg-white p-2 rounded border border-blue-200">"{selectedCase.officerComments}"</p>}
                   </section>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleUpdateDecision('REJECT')}
                  className="px-4 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs uppercase hover:bg-red-50 transition-all shadow-sm active:scale-95"
                >
                  Override: Reject
                </button>
                <button 
                  onClick={() => handleUpdateDecision('ACCEPT')}
                  className="px-4 py-3 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase shadow-lg hover:bg-blue-800 transition-all active:scale-95"
                >
                  Approve Application
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 h-full text-center space-y-6">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
                  <Icons.Logo />
               </div>
               <div className="space-y-2">
                 <h4 className="text-sm font-bold text-navy-900 uppercase tracking-tighter">Case Adjudicator V1.0</h4>
                 <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto">
                   Select an application from the queue to start visual verification and hitl review
                 </p>
               </div>
               <div className="h-px w-8 bg-slate-200"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
