import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';

export const useLeads = (params = {}) => {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async (queryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/leads', { params: { ...params, ...queryParams } });
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const createLead = async (leadData) => {
    try {
      const { data } = await API.post('/leads', leadData);
      setLeads(prev => [data.lead, ...prev]);
      return { success: true, lead: data.lead };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create lead' };
    }
  };

  const updateLead = async (id, leadData) => {
    try {
      const { data } = await API.put(`/leads/${id}`, leadData);
      setLeads(prev => prev.map(l => l._id === id ? data.lead : l));
      return { success: true, lead: data.lead };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update lead' };
    }
  };

  const deleteLead = async (id) => {
    try {
      await API.delete(`/leads/${id}`);
      setLeads(prev => prev.filter(l => l._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete lead' };
    }
  };

  return { leads, pagination, loading, error, fetchLeads, createLead, updateLead, deleteLead, setLeads };
};
