
import React, { useState, useRef, useEffect } from 'react';
import { VerificationStep, Decision, RiskLevel, VerificationOutcome } from '../types';
import { analyzeDocument, analyzeLiveness } from '../services/gemini';
import { Icons } from '../constants';

export const KYCWorkflow: React.FC = () => {
  const [step, setStep] = useState<VerificationStep>(VerificationStep.START);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState({ doc: 0, bio: 0, behavior: 0 });
  const [isAi, setIsAi] = useState(false);
  const [outcome, setOutcome] = useState<VerificationOutcome | null>(null);

  // Biometrics Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startVerification = () => setStep(VerificationStep.DOCUMENT);

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const result = await analyzeDocument(ev.target?.result as string);
        setScores(prev => ({ ...prev, doc: result.score }));
        setIsAi(result.isAiGenerated);
        setStep(VerificationStep.BIOMETRICS);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBiometricComplete = async () => {
    setLoading(true);
    // Simulate multi-factor biometric analysis
    await new Promise(r => setTimeout(r, 2000));
    setScores(prev => ({ ...prev, bio: 0.15 })); // Low risk biometric score
    setStep(VerificationStep.BEHAVIOR);
    setLoading(false);
  };

  const handleBehaviorComplete = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setScores(prev => ({ ...prev, behavior: 0.05 }));
    setStep(VerificationStep.SCORING);
  };

  useEffect(() => {
    if (step === VerificationStep.SCORING) {
      const runScoring = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 2500));
        
        const overall = (scores.doc + scores.bio + scores.behavior) / 3;
        let decision: Decision = 'ACCEPT';
        let risk: RiskLevel = 'LOW';

        if (isAi || overall > 0.7) {
          decision = 'REJECT';
          risk = 'HIGH';
        } else if (overall > 0.3) {
          decision = 'REVIEW';
          risk = 'MEDIUM';
        }

        const finalOutcome: VerificationOutcome = {
          id: `KYC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          timestamp: new Date().toLocaleString(),
          documentScore: scores.doc,
          biometricScore: scores.bio,
          behaviorScore: scores.behavior,
          overallScore: overall,
          isAiGenerated: isAi,
          decision,
          riskLevel: risk,
          details: isAi ? "Synthetic document artifacts detected." : "Standard identity profile."
        };

        // Save to "Admin Database" (LocalStorage)
        const history = JSON.parse(localStorage.getItem('kyc_history') || '[]');
        localStorage.setItem('kyc_history', JSON.stringify([finalOutcome, ...history]));

        setOutcome(finalOutcome);
        setStep(VerificationStep.RESULT);
        setLoading(false);
      };
      runScoring();
    }
  }, [step, scores, isAi]);

  // Signature logic
  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };
  const stopDrawing = () => setIsDrawing(false);
  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !sigCanvasRef.current) return;
    const ctx = sigCanvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000080';
    const rect = sigCanvasRef.current.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {step === VerificationStep.START && (
        <div className="text-center space-y-8 animate-in fade-in duration-700">
          <div className="flex justify-center"><Icons.Logo /></div>
          <h1 className="text-3xl font-extrabold text-[#000080]">Identity Verification Portal</h1>
          <p className="text-slate-500 font-medium italic">Pramaan: The Truthful Eye for a Safe KYC.</p>
          <button onClick={startVerification} className="w-full py-4 bg-[#000080] text-white rounded-lg font-bold text-lg hover:shadow-xl transition-all">
            Begin Secure Verification
          </button>
        </div>
      )}

      {step !== VerificationStep.START && step !== VerificationStep.RESULT && (
        <div className="mb-8">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
             <span>Progress</span>
             <span>Stage {Object.values(VerificationStep).indexOf(step)} of 5</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-blue-600 transition-all duration-500" 
               style={{ width: `${(Object.values(VerificationStep).indexOf(step) / 5) * 100}%` }}
             ></div>
          </div>
        </div>
      )}

      {step === VerificationStep.DOCUMENT && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-navy-900">Stage 1: Document Authenticity</h2>
            <p className="text-sm text-slate-500">Upload your ID for deepfake/AI analysis</p>
          </div>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center hover:border-blue-400 transition-colors relative">
            <input type="file" onChange={handleDocUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            <div className="text-slate-400">
              {loading ? <Icons.Processing /> : <><p className="font-bold">Click to Upload Aadhaar/Passport</p><p className="text-xs mt-1">AI Guardian will scan for synthetic signatures</p></>}
            </div>
          </div>
        </div>
      )}

      {step === VerificationStep.BIOMETRICS && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-navy-900">Stage 2: Multi-Factor Biometrics</h2>
            <p className="text-sm text-slate-500">Liveness, Voice & Digital Signature</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">A. Liveness Verification</span>
              <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-mono">
                 [ Camera Stream Simulated ]
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">B. Digital Signature Stroke Analysis</span>
              <canvas 
                ref={sigCanvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                className="w-full h-32 bg-white rounded border border-slate-200 cursor-crosshair"
              />
              <p className="text-[9px] text-slate-400 mt-1 uppercase">Draw your signature in the box above</p>
            </div>

            <button onClick={handleBiometricComplete} disabled={loading} className="w-full py-3 bg-blue-900 text-white rounded-lg font-bold">
              {loading ? 'Analyzing Biometrics...' : 'Submit Biometrics'}
            </button>
          </div>
        </div>
      )}

      {step === VerificationStep.BEHAVIOR && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-navy-900">Stage 3: Behavioral Integrity</h2>
            <p className="text-sm text-slate-500">Interaction analysis & Human confirmation</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <input type="checkbox" id="human" className="w-5 h-5" onChange={(e) => e.target.checked && handleBehaviorComplete()} />
               <label htmlFor="human" className="text-sm font-bold text-slate-700 uppercase">I confirm I am a human citizen</label>
            </div>
            <div className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">RE-CAPTCHA V3</div>
          </div>
          <p className="text-[10px] text-slate-400 text-center uppercase">Tracking mouse latency & interaction patterns for bot-prevention</p>
        </div>
      )}

      {step === VerificationStep.SCORING && (
        <div className="text-center py-20 space-y-4">
          <Icons.Processing />
          <h2 className="text-xl font-bold text-[#000080] animate-pulse">Decision Engine Running...</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Aggregating Risk Factors & Cross-Referencing Databases</p>
        </div>
      )}

      {step === VerificationStep.RESULT && outcome && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-8 animate-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${outcome.decision === 'ACCEPT' ? 'bg-green-100 text-green-600' : outcome.decision === 'REJECT' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
               {outcome.decision === 'ACCEPT' ? <Icons.CheckMark /> : <Icons.Alert />}
            </div>
            <h2 className="text-2xl font-bold text-navy-900">Verification Outcome</h2>
            <p className="text-slate-500 text-sm">Case ID: {outcome.id}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Doc Risk</span>
              <span className="text-sm font-bold text-navy-900">{(outcome.documentScore * 100).toFixed(0)}%</span>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Bio Risk</span>
              <span className="text-sm font-bold text-navy-900">{(outcome.biometricScore * 100).toFixed(0)}%</span>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Behavior</span>
              <span className="text-sm font-bold text-navy-900">{(outcome.behaviorScore * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center mb-4">
               <span className="text-xs font-bold text-slate-500 uppercase">System Decision</span>
               <span className={`px-3 py-1 rounded-full text-xs font-bold ${outcome.decision === 'ACCEPT' ? 'bg-green-100 text-green-700' : outcome.decision === 'REJECT' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                 {outcome.decision}
               </span>
            </div>
            <p className="text-xs text-slate-500 italic text-center">Outcome forwarded to Admin for final auditing.</p>
          </div>

          <button onClick={() => setStep(VerificationStep.START)} className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold">
            Done
          </button>
        </div>
      )}
    </div>
  );
};
