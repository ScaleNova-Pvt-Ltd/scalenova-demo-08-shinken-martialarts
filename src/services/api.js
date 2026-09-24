/**
 * ScaleNova Systems — Client API Dispatcher
 * Demo: Shinken Karate Academy (DEMO-08)
 */

window.ScaleNovaAPI = (function () {
  'use strict';

  const config = window.DEMO_CONFIG || {
    demoId: 'DEMO-08',
    industry: 'Martial Arts & Athletic Training',
    clientName: 'Shinken Karate Academy',
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycby-kC_gnWLAMrKc40yu0TOga5yZDreR50X-2AWw2rHrzCFi3oZp2W9Xqq3KXNoTh6bj/exec'
  };

  async function submitLead(formData, options = {}) {
    if (!formData.name || !formData.email) {
      throw new Error('Name and email are required.');
    }

    const payload = {
      demo_id: config.demoId,
      lead_type: (formData.lead_type || 'TRIAL').toUpperCase(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: (formData.phone || '').trim(),
      company: formData.experience_level ? `Experience: ${formData.experience_level}` : 'Student Candidate',
      service: formData.program || formData.service || 'Free 3-Day Trial Pass',
      requirement: `Age Group: ${formData.age_group || 'Adult'} | Preferred Dojo: ${formData.dojo_location || 'Main Dojo'}`,
      project_type: 'Martial Arts Training Enrollment',
      budget: formData.membership_plan || 'Standard Membership',
      preferred_date: formData.preferred_date || new Date().toISOString().slice(0, 10),
      preferred_time: formData.preferred_time || 'Evening Session (18:00)',
      message: (formData.message || formData.notes || '').trim(),
      source: 'Shinken Karate Academy Website',
      source_page: formData.source_page || window.location.pathname || 'Home'
    };

    const optimisticId = 'SN-D08-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const networkPromise = fetch(config.appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(async r => {
      try { return await r.json(); } catch (e) { return { success: true, submission_id: optimisticId }; }
    }).catch(() => ({ success: true, submission_id: optimisticId }));

    const quickTimeout = new Promise(resolve => setTimeout(() => {
      resolve({ success: true, submission_id: optimisticId, optimistic: true });
    }, 900));

    try {
      const result = await Promise.race([networkPromise, quickTimeout]);
      return {
        success: true,
        submission_id: (result && (result.submission_id || result.submissionId)) || optimisticId,
        demo_id: 'DEMO-08',
        message: 'Free trial class scheduled successfully'
      };
    } catch (err) {
      return { success: true, submission_id: optimisticId, demo_id: 'DEMO-08' };
    }
  }

  return { submitLead };
})();
