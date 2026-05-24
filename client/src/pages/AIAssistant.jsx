import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSmartToy, MdSend, MdCopyAll, MdAutoAwesome, MdEmail, MdRecordVoiceOver, MdSummarize, MdTrendingUp, MdDescription } from 'react-icons/md';
import API from '../services/api';
import toast from 'react-hot-toast';

const AI_PROMPTS = [
  { type: 'follow-up-email', icon: MdEmail, label: 'Follow-up Email', desc: 'Draft a professional follow-up email for a lead', color: '#6366f1' },
  { type: 'sales-pitch', icon: MdRecordVoiceOver, label: 'Sales Pitch', desc: 'Generate a compelling sales pitch for your product', color: '#8b5cf6' },
  { type: 'summarize-lead', icon: MdSummarize, label: 'Lead Summary', desc: 'AI-powered summary of lead information and history', color: '#06b6d4' },
  { type: 'next-action', icon: MdTrendingUp, label: 'Next Action', desc: 'Get AI recommendations for the next best action', color: '#10b981' },
  { type: 'proposal-summary', icon: MdDescription, label: 'Proposal Summary', desc: 'Generate a professional proposal summary', color: '#f59e0b' },
];

const SAMPLE_LEADS = [
  { companyName: 'Tata Motors Ltd', clientName: 'Rajesh Kumar', industry: 'Automotive', status: 'Qualified', priority: 'High', productInterest: 'ManufactoCRM Enterprise', estimatedDealValue: 850000 },
  { companyName: 'Sun Pharma Ltd', clientName: 'Dr. Nisha Shah', industry: 'Pharmaceutical', status: 'Proposal Sent', priority: 'Critical', productInterest: 'ManufactoCRM Pro', estimatedDealValue: 920000 },
  { companyName: 'JSW Steel', clientName: 'Abhishek Nair', industry: 'Steel & Metal', status: 'Negotiation', priority: 'High', productInterest: 'ManufactoCRM Enterprise+', estimatedDealValue: 1200000 },
];

const AIAssistant = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [selectedLead, setSelectedLead] = useState(SAMPLE_LEADS[0]);
  const [customContext, setCustomContext] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const generate = async (promptType) => {
    setSelectedPrompt(promptType);
    setLoading(true);
    setResponse('');
    try {
      const { data } = await API.post('/ai/generate', {
        type: promptType,
        lead: { ...selectedLead, notes: customContext }
      });
      setResponse(data.response.content);
      setHistory(prev => [{ type: promptType, lead: selectedLead.companyName, content: data.response.content, time: new Date() }, ...prev.slice(0, 4)]);
      toast.success('AI response generated! 🤖');
    } catch (err) {
      toast.error('AI generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    toast.success('Copied to clipboard!');
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MdSmartToy size={22} color="white" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>AI Sales Assistant</h2>
          <span style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.15)', color: '#4f46e5', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>ManufactoCRM-AI v2.0</span>
        </div>
        <p style={{ fontSize: 13, color: '#64748b' }}>Leverage AI to generate sales content, analyze leads, and accelerate your sales workflow.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
        {/* Left Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Lead Selector */}
          <div className="glass-card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Context Lead</h3>
            {SAMPLE_LEADS.map((lead, i) => (
              <div key={i} onClick={() => setSelectedLead(lead)} style={{
                padding: '10px 12px', borderRadius: 10, marginBottom: 6, cursor: 'pointer',
                background: selectedLead.companyName === lead.companyName ? '#edf2ff' : '#ffffff',
                border: `1px solid ${selectedLead.companyName === lead.companyName ? 'rgba(79, 70, 229, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`,
                transition: 'all 0.2s'
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{lead.companyName}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{lead.industry} · {lead.status}</div>
              </div>
            ))}
            <textarea
              className="input-dark"
              placeholder="Add custom context or notes..."
              value={customContext}
              onChange={e => setCustomContext(e.target.value)}
              rows={3}
              style={{ marginTop: 8, resize: 'vertical', fontSize: 12 }}
            />
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="glass-card" style={{ padding: 18 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Recent</h3>
              {history.map((h, i) => (
                <div key={i} onClick={() => setResponse(h.content)} style={{
                  padding: '8px 10px', borderRadius: 8, marginBottom: 4, cursor: 'pointer',
                  background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', marginBottom: 1 }}>{h.type.replace(/-/g, ' ')}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{h.lead}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Prompt Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
            {AI_PROMPTS.map(({ type, icon: Icon, label, desc, color }) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => generate(type)}
                disabled={loading}
                style={{
                  background: selectedPrompt === type && !loading ? `${color}0d` : '#ffffff',
                  border: `1px solid ${selectedPrompt === type && !loading ? `${color}30` : 'rgba(0, 0, 0, 0.08)'}`,
                  borderRadius: 12, padding: '14px 16px', cursor: loading ? 'not-allowed' : 'pointer',
                  textAlign: 'left', transition: 'all 0.2s', opacity: loading ? 0.6 : 1
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icon size={18} color={color} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{desc}</div>
              </motion.button>
            ))}
          </div>

          {/* Output Area */}
          <div className="glass-card" style={{ flex: 1, padding: 22, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MdAutoAwesome size={18} color="#4f46e5" />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>AI Response</h3>
                {selectedPrompt && !loading && (
                  <span style={{ fontSize: 11, color: '#4f46e5', background: 'rgba(79,70,229,0.08)', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                    {AI_PROMPTS.find(p => p.type === selectedPrompt)?.label}
                  </span>
                )}
              </div>
              {response && (
                <button onClick={copyToClipboard} className="btn-secondary" style={{ padding: '7px 12px', fontSize: 12 }}>
                  <MdCopyAll size={14} /> Copy
                </button>
              )}
            </div>

            <div style={{ flex: 1 }}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 16 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 56, height: 56, border: '3px solid rgba(79,70,229,0.1)', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MdSmartToy size={20} color="#4f46e5" />
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#4f46e5', fontWeight: 700, marginBottom: 4 }}>Generating AI response...</p>
                    <p style={{ color: '#64748b', fontSize: 12 }}>Analyzing lead context and crafting personalized content</p>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f46e5', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              ) : response ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <pre style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: "'Inter', sans-serif", background: '#f8fafc', borderRadius: 10, padding: 16, border: '1px solid rgba(0, 0, 0, 0.06)' }}>
                    {response}
                  </pre>
                </motion.div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 280, textAlign: 'center' }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🤖</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>Select an AI Action</h3>
                  <p style={{ fontSize: 13, color: '#64748b', maxWidth: 320 }}>
                    Choose a prompt above to generate AI-powered sales content tailored to your selected lead's context.
                  </p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    {['✉️', '🎯', '📊', '🚀', '📋'].map((emoji, i) => (
                      <span key={i} style={{ fontSize: 22, opacity: 0.4 }}>{emoji}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
};

export default AIAssistant;
