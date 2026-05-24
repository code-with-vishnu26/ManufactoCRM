// @desc    AI Sales Assistant - Generate responses
// @route   POST /api/ai/generate
// @access  Private

const path = require('path');
const fs = require('fs');

// In-memory history store (last 100 entries; resets on server restart)
const aiHistory = [];

// ─────────────────────────────────────────────────────────────────────────────
// EXISTING AI RESPONSE TYPES (5)
// ─────────────────────────────────────────────────────────────────────────────
const aiResponses = {
  'follow-up-email': (lead) => `Subject: Following Up on Our Discussion – ${lead.companyName}

Dear ${lead.clientName},

I hope this message finds you well. I'm reaching out to follow up on our recent conversation regarding your interest in ${lead.productInterest || 'our manufacturing solutions'}.

At ManufactoCRM, we understand that ${lead.industry || 'your industry'} companies face unique challenges — from supply chain optimization to production efficiency. Our solution is specifically designed to address these pain points and drive measurable ROI.

Key benefits we discussed:
✅ 30% reduction in production downtime
✅ Real-time inventory and pipeline visibility
✅ Seamless integration with your existing ERP systems

I would love to schedule a quick 20-minute demo at your convenience. Would any of the following times work for you?

• [Date Option 1]
• [Date Option 2]
• [Date Option 3]

Please don't hesitate to reach out if you have any questions. Looking forward to connecting.

Best regards,
[Your Name]
ManufactoCRM AI | Business Development`,

  'sales-pitch': (lead) => `🎯 Sales Pitch for ${lead.companyName}

**Opening Hook:**
"${lead.companyName} is operating in a competitive ${lead.industry || 'manufacturing'} landscape. The companies winning today aren't just those with the best products — they're the ones with the smartest sales intelligence."

**Pain Points to Address:**
• Difficulty tracking leads across multiple channels
• Manual follow-up processes causing lost opportunities
• Lack of real-time visibility into pipeline health
• Inconsistent team performance metrics

**Our Value Proposition:**
ManufactoCRM AI gives your BDA team an unfair advantage with:
1. AI-powered lead scoring that prioritizes high-value opportunities
2. Automated follow-up workflows that never let a lead go cold
3. Real-time analytics dashboards for data-driven decisions
4. Seamless Kanban pipeline management

**ROI Statement:**
Companies using ManufactoCRM AI see an average of:
• 45% increase in lead conversion rates
• 3x faster deal closure times
• ₹50L+ additional revenue in the first year

**Call to Action:**
"Let's schedule a personalized demo tailored to ${lead.companyName}'s specific needs. I can show you exactly how we've helped similar companies in ${lead.industry || 'your industry'} achieve these results."`,

  'summarize-lead': (lead) => `📊 Lead Intelligence Summary

**Company:** ${lead.companyName}
**Contact:** ${lead.clientName}
**Industry:** ${lead.industry || 'Not specified'}
**Current Status:** ${lead.status}
**Priority Level:** ${lead.priority}

**Deal Overview:**
• Estimated Deal Value: ₹${(lead.estimatedDealValue || 0).toLocaleString()}
• Product Interest: ${lead.productInterest || 'To be determined'}
• Lead Source: ${lead.leadSource || 'Not specified'}
• Follow-up Due: ${lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Not scheduled'}

**AI Assessment:**
Based on the lead profile, this appears to be a ${lead.priority === 'High' || lead.priority === 'Critical' ? 'HIGH-PRIORITY' : 'standard priority'} opportunity. The ${lead.industry} sector is showing strong demand for manufacturing optimization solutions.

**Recommended Approach:**
• Personalize your pitch around ${lead.industry} industry pain points
• Emphasize ROI and implementation speed
• Reference case studies from similar companies
• Focus on decision-maker alignment and budget discussions

**Risk Factors:**
• Follow-up cadence needs to remain consistent
• Budget approval process may involve multiple stakeholders
• Competitive landscape in ${lead.industry} is active`,

  'next-action': (lead) => `🚀 AI-Recommended Next Actions for ${lead.companyName}

Based on current status: **${lead.status}**

**Immediate Actions (Next 24 Hours):**
${lead.status === 'New Lead' ? '1. Send introduction email with company overview\n2. Research company background and recent news\n3. Connect on LinkedIn with decision maker' :
  lead.status === 'Contacted' ? '1. Schedule discovery call to understand pain points\n2. Send relevant case study or white paper\n3. Confirm budget and timeline' :
  lead.status === 'Qualified' ? '1. Prepare tailored product demonstration\n2. Identify all stakeholders in decision process\n3. Send pre-demo questionnaire' :
  lead.status === 'Proposal Sent' ? '1. Follow up within 48 hours of proposal delivery\n2. Schedule proposal walkthrough call\n3. Address objections proactively' :
  lead.status === 'Negotiation' ? '1. Prepare final pricing options with value justification\n2. Involve senior management if needed\n3. Set clear decision deadline' :
  '1. Keep relationship warm for future opportunities\n2. Request referrals from any positive interactions\n3. Add to newsletter/event invite list'}

**This Week's Priority Tasks:**
• Prepare customized ROI calculator for ${lead.companyName}
• Research ${lead.industry} market trends to share insights
• Schedule team review of this opportunity

**Success Probability:** ${lead.priority === 'Critical' ? '85%' : lead.priority === 'High' ? '70%' : lead.priority === 'Medium' ? '50%' : '35%'}`,

  'proposal-summary': (lead) => `📋 Proposal Summary for ${lead.companyName}

**Executive Summary**
ManufactoCRM AI presents this proposal to ${lead.companyName} as a comprehensive solution to optimize their ${lead.industry || 'manufacturing'} sales operations and accelerate revenue growth.

**Solution Overview**
We propose implementing our full ManufactoCRM AI platform, specifically configured for ${lead.industry || 'manufacturing'} sector requirements.

**Scope of Work:**
1. Full CRM platform implementation and onboarding
2. Custom workflow configuration for ${lead.companyName}'s sales process
3. Team training and enablement (3 sessions)
4. 90-day dedicated support and optimization
5. Analytics dashboard customization

**Investment Summary:**
• Platform License: Based on team size and modules
• Implementation Fee: One-time setup
• Training: Included in Year 1
• Support: Ongoing with SLA guarantee

**Expected Outcomes:**
• Month 1-2: System setup, team training, data migration
• Month 3-4: Full adoption, initial performance improvements
• Month 6+: 40-60% improvement in lead conversion rates

**Why ManufactoCRM AI:**
✅ Industry-specific features for ${lead.industry || 'manufacturing'}
✅ Local support team in India
✅ Proven track record with 200+ manufacturing companies
✅ GDPR and data security compliant

**Next Steps:**
1. Technical requirements discussion
2. Pilot program agreement
3. Contract finalization
4. Kickoff meeting scheduling

We look forward to a successful partnership with ${lead.companyName}.`,

  // ─────────────────────────────────────────────────────────────────────────
  // NEW AI RESPONSE TYPES (5)
  // ─────────────────────────────────────────────────────────────────────────

  'objection-handler': (lead) => {
    const objection = lead.notes || 'The price is too high for our current budget.';
    return `🛡️ Objection Handler — AI Analysis

**Objection Detected:**
"${objection}"

**Identified Objection Type:**
${objection.toLowerCase().includes('price') || objection.toLowerCase().includes('budget') || objection.toLowerCase().includes('cost')
  ? '💰 Price / Budget Objection'
  : objection.toLowerCase().includes('time') || objection.toLowerCase().includes('busy') || objection.toLowerCase().includes('later')
  ? '⏰ Timing / Urgency Objection'
  : objection.toLowerCase().includes('competitor') || objection.toLowerCase().includes('using') || objection.toLowerCase().includes('already')
  ? '⚔️ Competitor / Status Quo Objection'
  : objection.toLowerCase().includes('trust') || objection.toLowerCase().includes('sure') || objection.toLowerCase().includes('proven')
  ? '🤝 Trust / Credibility Objection'
  : '❓ General / Unclear Objection — Needs Discovery'}

**3 Proven Strategies to Overcome It:**

1. **Acknowledge & Reframe**
   Validate the concern, then shift the conversation to value and ROI instead of cost.

2. **ROI-Based Justification**
   Present concrete numbers: average client saves ₹8L/year after implementation — making the platform pay for itself within 90 days.

3. **Risk Reversal**
   Offer a pilot program, phased rollout, or money-back guarantee to reduce perceived risk.

**Word-for-Word Responses:**

▸ *"I completely understand your concern about budget. Many of our top clients said the same thing before they saw the ROI. What if I showed you how ${lead.companyName || 'similar companies'} saved 3x the investment in the first year?"*

▸ *"That's a fair point. Let's not talk about the price — let's talk about what it costs you NOT to have this system. How many leads did you lose last quarter due to manual tracking?"*

▸ *"What if we started with a 30-day pilot at no risk? You'll see real results before committing to anything."*

**Best Follow-Up Action:**
📅 Schedule a 30-minute ROI deep-dive call within 48 hours. Prepare a custom ROI calculator for ${lead.companyName || 'this company'} before the call.`;
  },

  'competitor-analysis': (lead) => `⚔️ Competitive Intelligence Report

**ManufactoCRM AI vs The Market — ${lead.industry || 'Manufacturing'} Sector**

| Feature | ManufactoCRM AI | Generic CRM A | Generic CRM B | Generic CRM C |
|---|---|---|---|---|
| Industry Focus | ✅ Manufacturing-specific | ❌ Generic | ❌ Generic | ⚠️ Partial |
| AI Sales Assistant | ✅ Built-in, contextual | ❌ Add-on only | ⚠️ Basic | ❌ None |
| Kanban Pipeline | ✅ Drag & drop | ✅ Yes | ⚠️ Limited | ✅ Yes |
| Indian Rupee & Tax Support | ✅ Native | ❌ No | ❌ No | ⚠️ Plugin |
| ERP Integration | ✅ SAP, Tally, Oracle | ⚠️ Limited | ✅ Salesforce only | ❌ None |
| Pricing (per user/mo) | 💰 Competitive | 💰💰 2x Higher | 💰💰💰 3x Higher | 💰 Similar |
| Local Support Team | ✅ India-based | ❌ US timezones | ❌ Offshore | ⚠️ Email only |
| Onboarding Time | ✅ < 1 week | ❌ 4–6 weeks | ❌ 8+ weeks | ⚠️ 2–3 weeks |

**Our Strengths in ${lead.industry || 'Your'} Industry:**
• Pre-built workflows for ${lead.industry || 'manufacturing'} sales cycles
• Understands long B2B buying cycles common in ${lead.industry || 'this sector'}
• AI prompts trained on Indian manufacturing deal patterns
• Handles multi-stakeholder deals (purchase, finance, operations sign-off)

**Competitive Talking Points:**
1. "Unlike Salesforce, we don't charge you for each module separately — everything is included."
2. "We're the only CRM with an AI that speaks the language of Indian manufacturing."
3. "Our customers go live in days, not months — zero disruption to your sales team."
4. "Our support team is in your timezone, speaks your language, and picks up the phone."

**Battle Card — If ${lead.companyName || 'the prospect'} mentions a competitor:**
• *vs. Salesforce:* "Salesforce is powerful but overkill for your team size. We give you 80% of the features at 20% of the cost — and 10x faster to set up."
• *vs. HubSpot:* "HubSpot is great for digital marketing companies, not for manufacturing sales reps managing 50+ B2B accounts. We're built for your exact workflow."
• *vs. Zoho CRM:* "Zoho requires heavy customization and technical expertise. ManufactoCRM AI works out of the box for manufacturing, with zero IT dependency."`,

  'contract-drafter': (lead) => {
    const dealValue = (lead.estimatedDealValue || 500000).toLocaleString();
    const today = new Date();
    const startDate = today.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const endDate = new Date(today.setFullYear(today.getFullYear() + 1)).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    return `📝 MEMORANDUM OF UNDERSTANDING (MOU)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This Memorandum of Understanding ("MOU") is entered into as of ${startDate},

**BETWEEN:**

**Party A (Service Provider):**
ManufactoCRM AI Technologies Pvt. Ltd.
[Registered Address], India
CIN: U72900MH2024PTC000000
(hereinafter referred to as "ManufactoCRM")

**AND**

**Party B (Client):**
${lead.companyName || '[CLIENT COMPANY NAME]'}
[Client Registered Address]
Represented by: ${lead.clientName || '[AUTHORIZED SIGNATORY]'}
(hereinafter referred to as "Client")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. SCOPE OF ENGAGEMENT**

ManufactoCRM agrees to provide the Client with access to its AI-powered CRM platform, including but not limited to: lead management, pipeline analytics, AI-generated sales content, activity tracking, team performance dashboards, and associated support services.

The engagement covers the ${lead.industry || 'manufacturing'} vertical and is specifically scoped to the Client's sales operations team.

**2. PAYMENT TERMS**

2.1 Total Estimated Engagement Value: ₹${dealValue}
2.2 Payment Schedule:
    • 40% upon execution of this MOU (₹${Math.floor((lead.estimatedDealValue || 500000) * 0.4).toLocaleString()})
    • 40% upon platform go-live (₹${Math.floor((lead.estimatedDealValue || 500000) * 0.4).toLocaleString()})
    • 20% at end of Month 3 (₹${Math.floor((lead.estimatedDealValue || 500000) * 0.2).toLocaleString()})
2.3 Payment Mode: NEFT / RTGS / Cheque in favour of "ManufactoCRM AI Technologies Pvt. Ltd."
2.4 GST at 18% applicable on all invoices as per Indian tax laws.

**3. DURATION**

This MOU shall remain in effect from ${startDate} to ${endDate} (12 months), renewable upon mutual written agreement.

**4. TERMS & CONDITIONS**

4.1 **Confidentiality:** Both parties agree to maintain strict confidentiality of all proprietary information shared during the engagement.
4.2 **Data Ownership:** All client data uploaded to the platform remains the sole property of the Client.
4.3 **Intellectual Property:** ManufactoCRM retains all IP rights over the platform, AI models, and underlying technology.
4.4 **SLA:** ManufactoCRM guarantees 99.5% platform uptime, with support response within 4 business hours.
4.5 **Termination:** Either party may terminate with 30 days' written notice. No refunds on completed milestones.
4.6 **Governing Law:** This MOU shall be governed by the laws of India, with jurisdiction in [City] courts.

**5. AMENDMENTS**

Any modifications to this MOU must be made in writing and signed by authorized representatives of both parties.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**SIGNATURES**

**For ManufactoCRM AI Technologies Pvt. Ltd.:**

Signature: ________________________
Name: ____________________________
Designation: ______________________
Date: ____________________________
Seal: ____________________________

**For ${lead.companyName || '[CLIENT COMPANY]'}:**

Signature: ________________________
Name: ${lead.clientName || '____________________________'}
Designation: ______________________
Date: ____________________________
Seal: ____________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*This document is AI-generated for reference. Please review with legal counsel before signing.*`;
  },

  'win-loss-analysis': (lead) => {
    const isWon = lead.status === 'Closed Won';
    const isLost = lead.status === 'Closed Lost';
    return `📊 Win/Loss Analysis — ${lead.companyName || 'Lead'}

**Outcome:** ${isWon ? '🏆 CLOSED WON' : isLost ? '❌ CLOSED LOST' : `⚠️ Status: ${lead.status || 'Unknown'} (Analysis based on available data)`}
**Deal Value:** ₹${(lead.estimatedDealValue || 0).toLocaleString()}
**Industry:** ${lead.industry || 'Not specified'}
**Priority:** ${lead.priority || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Key Factors That Led to This Outcome:**

${isWon ? `✅ Strong alignment between product and client's pain points in ${lead.industry || 'this'} industry
✅ Timely follow-up cadence maintained throughout the deal cycle
✅ Competitive pricing relative to deal value (₹${(lead.estimatedDealValue || 0).toLocaleString()})
✅ Decision-maker (${lead.clientName || 'contact'}) was properly engaged from early stages
✅ Proposal was customized for ${lead.companyName || 'client'}'s specific workflow` :
isLost ? `❌ Possible price sensitivity — deal value ₹${(lead.estimatedDealValue || 0).toLocaleString()} may have exceeded budget
❌ Insufficient stakeholder mapping — may have missed key decision-makers
❌ Follow-up frequency was likely suboptimal for this deal stage
❌ Competitor may have offered better-fitted solution for ${lead.industry || 'their'} vertical
❌ Timeline mismatch — client may not have been ready to buy at this stage` :
`⚠️ Insufficient data to determine win/loss factors. Update lead status to 'Closed Won' or 'Closed Lost' for full analysis.`}

**Lessons Learned:**
${isWon ? `• Document this deal as a case study for ${lead.industry || 'this'} sector
• Replicate the outreach cadence on similar-profile leads
• The pricing at ₹${(lead.estimatedDealValue || 0).toLocaleString()} proved viable — use as reference benchmark` :
`• Earlier budget qualification could have saved time
• Multi-stakeholder engagement should begin at the 'Qualified' stage
• A pilot offer earlier in the cycle might have de-risked the decision`}

${isWon ? `**🚀 Upsell Opportunities (Act Now):**
• Upgrade to Enterprise plan with advanced analytics (+₹${Math.floor((lead.estimatedDealValue || 500000) * 0.3).toLocaleString()}/year)
• Add AI Calling Bot module for outbound automation
• Introduce ManufactoCRM to sister companies / group entities of ${lead.companyName || 'this client'}
• Annual contract lock-in with 10% discount offer
• Referral program enrollment — 3 referrals = 1 month free` :
isLost ? `**🔄 Re-Engagement Strategy (6-Month Plan):**
• Month 1: Send a "No hard feelings" email — keep the door open
• Month 2: Share a ${lead.industry || 'industry'}-specific success story from a competitor they respect
• Month 3: Invite to a free webinar or industry event
• Month 4: Check in with updated pricing or new feature announcement
• Month 5: Offer a limited-time 30-day pilot — zero commitment
• Month 6: Final outreach with a personalized video message from a senior leader` : ''}`;
  },

  'chat': (lead) => {
    const userMessage = lead.notes || 'I need help with this lead.';
    return `💬 ManufactoCRM AI Sales Assistant

**You asked:** "${userMessage}"

**AI Response:**

Great question! Based on the context of ${lead.companyName ? `your lead at **${lead.companyName}**` : 'this lead'}, here's my take:

${userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('quote') || userMessage.toLowerCase().includes('cost')
  ? `💰 **Pricing Strategy Advice:**
Since pricing is on the table, I recommend anchoring high and then presenting the value before the number. For a company like ${lead.companyName || 'this prospect'} in the ${lead.industry || 'manufacturing'} space, start with the ROI story — show them ₹${Math.floor((lead.estimatedDealValue || 500000) * 3).toLocaleString()} in annual savings before you reveal the ₹${(lead.estimatedDealValue || 0).toLocaleString()} investment. Make the price feel small relative to the gain.`
  : userMessage.toLowerCase().includes('follow') || userMessage.toLowerCase().includes('next') || userMessage.toLowerCase().includes('step')
  ? `📅 **Next Steps Recommendation:**
For ${lead.companyName || 'this lead'} at the **${lead.status || 'current'}** stage, I suggest sending a personalized email within the next 24 hours, followed by a WhatsApp or phone call in 48 hours if there's no response. Silence = not a no. Always follow up at least 5 times before deprioritizing.`
  : userMessage.toLowerCase().includes('meeting') || userMessage.toLowerCase().includes('demo') || userMessage.toLowerCase().includes('call')
  ? `📞 **Meeting Preparation Tips:**
Before your meeting with ${lead.clientName || 'the prospect'} from ${lead.companyName || 'this company'}:
1. Research their latest news / LinkedIn activity
2. Prepare 3 discovery questions specific to ${lead.industry || 'their industry'}
3. Have your ROI calculator ready
4. Know your walk-away price and best alternative offer
5. Confirm attendees — don't let the decision-maker skip`
  : `🤖 **General Sales Intelligence:**
Based on the context of ${lead.companyName || 'this lead'}, here are my recommendations:
• Current stage (${lead.status || 'Unknown'}) suggests you're ${lead.status === 'New Lead' ? 'at the beginning — focus on research and outreach' : lead.status === 'Negotiation' ? 'close to closing — stay confident and patient' : 'mid-funnel — keep momentum with consistent value delivery'}
• Priority level (${lead.priority || 'Unknown'}) means this deal ${lead.priority === 'Critical' || lead.priority === 'High' ? 'deserves daily attention' : 'can be managed on a weekly cadence'}
• Estimated deal value of ₹${(lead.estimatedDealValue || 0).toLocaleString()} puts this in the ${(lead.estimatedDealValue || 0) > 500000 ? 'enterprise' : 'SME'} tier — adjust your approach accordingly`}

**Suggested Immediate Actions:**
1. ${lead.status === 'New Lead' ? 'Send a personalized intro email today' : lead.status === 'Proposal Sent' ? 'Follow up on the proposal — schedule a review call' : 'Review your last interaction and plan the next touchpoint'}
2. Log any new notes or updates to keep your pipeline accurate
3. Set a follow-up reminder for ${lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'this week'}

*I'm here to help! Ask me anything about this deal, your pitch strategy, or how to handle specific objections.*`;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: Generate AI Response
// ─────────────────────────────────────────────────────────────────────────────
const generateAIResponse = async (req, res, next) => {
  try {
    const { type, lead } = req.body;

    if (!type) {
      return res.status(400).json({ success: false, message: 'AI response type is required' });
    }

    const leadData = lead || {};

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const responseGenerator = aiResponses[type];
    if (!responseGenerator) {
      return res.status(400).json({ success: false, message: `Invalid AI response type: '${type}'` });
    }

    const content = responseGenerator(leadData);

    const record = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      lead: {
        companyName: leadData.companyName || null,
        clientName: leadData.clientName || null,
        industry: leadData.industry || null,
        status: leadData.status || null
      },
      content,
      generatedAt: new Date(),
      model: 'ManufactoCRM-AI-v2.0',
      tokensUsed: Math.floor(Math.random() * 500) + 200,
      generatedBy: req.user ? req.user._id : null
    };

    // Store in history (keep last 100)
    aiHistory.unshift(record);
    if (aiHistory.length > 100) aiHistory.splice(100);

    res.json({
      success: true,
      response: record
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: Get AI History (last 20)
// GET /api/ai/history
// ─────────────────────────────────────────────────────────────────────────────
const getAIHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = aiHistory.slice(0, Math.min(limit, 50));
    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: Save AI Response to file
// POST /api/ai/save
// ─────────────────────────────────────────────────────────────────────────────
const saveAIResponse = async (req, res, next) => {
  try {
    const { response } = req.body;

    if (!response || !response.content) {
      return res.status(400).json({ success: false, message: 'Response content is required' });
    }

    const saveDir = path.join(__dirname, '..', 'ai_exports');
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    const filename = `ai_${response.type || 'response'}_${Date.now()}.txt`;
    const filepath = path.join(saveDir, filename);

    const fileContent = [
      `ManufactoCRM AI Export`,
      `======================`,
      `Type: ${response.type || 'Unknown'}`,
      `Generated At: ${response.generatedAt || new Date().toISOString()}`,
      `Model: ${response.model || 'ManufactoCRM-AI-v2.0'}`,
      ``,
      response.content
    ].join('\n');

    fs.writeFileSync(filepath, fileContent, 'utf8');

    res.json({
      success: true,
      message: 'AI response saved successfully',
      filename,
      filepath: `/ai_exports/${filename}`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateAIResponse, getAIHistory, saveAIResponse };
