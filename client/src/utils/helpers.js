export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (date) => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const getStatusBadgeClass = (status) => {
  const map = {
    'New Lead': 'badge-new',
    'Contacted': 'badge-contacted',
    'Qualified': 'badge-qualified',
    'Proposal Sent': 'badge-proposal',
    'Negotiation': 'badge-negotiation',
    'Closed Won': 'badge-won',
    'Closed Lost': 'badge-lost',
  };
  return map[status] || 'badge-new';
};

export const getPriorityBadgeClass = (priority) => {
  const map = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high', Critical: 'badge-critical' };
  return map[priority] || 'badge-medium';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const getRoleLabel = (role) => {
  const map = { admin: 'Admin', team_lead: 'Team Lead', sales_executive: 'Sales Executive' };
  return map[role] || role;
};

export const PIPELINE_STAGES = ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
export const INDUSTRIES = ['Automotive', 'Electronics', 'Food & Beverage', 'Textile', 'Chemical', 'Pharmaceutical', 'Steel & Metal', 'Plastics', 'Packaging', 'Other'];
export const LEAD_SOURCES = ['Cold Call', 'Email Campaign', 'Referral', 'Trade Show', 'Website', 'LinkedIn', 'Industry Event', 'Other'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
