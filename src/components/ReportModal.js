import React, { useState } from 'react';
import { moderationService } from '../services/firebaseService';

const ReportModal = ({ item, onClose, showNotification }) => {
  const [formData, setFormData] = useState({
    reason: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { value: 'inappropriate', label: 'Inappropriate Content' },
    { value: 'spam', label: 'Spam or Duplicate Listing' },
    { value: 'scam', label: 'Suspicious/Scam Activity' },
    { value: 'prohibited', label: 'Prohibited Item' },
    { value: 'misleading', label: 'Misleading Information' },
    { value: 'safety', label: 'Safety Concerns' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reason) {
      showNotification('Please select a reason for reporting', 'error');
      return;
    }

    if (formData.reason === 'other' && !formData.description.trim()) {
      showNotification('Please provide a description for "Other" reports', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await moderationService.reportItem(item.id, {
        reason: formData.reason,
        description: formData.description.trim(),
        reportedBy: 'community_user',
        itemTitle: item.title,
        itemCategory: item.category
      });

      showNotification('Report submitted successfully. Thank you for helping keep our community safe.', 'success');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      showNotification('Error submitting report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="modal-header">
          <h2>
            <i className="fas fa-flag" style={{ color: '#ef4444' }}></i>
            Report Item
          </h2>
          <p>Help us keep the community safe by reporting inappropriate content</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="reported-item-info">
            <h4>Reporting: "{item.title}"</h4>
            <p>Category: {item.category} • Posted by: {item.contact || 'Anonymous'}</p>
          </div>

          <div className="form-group">
            <label htmlFor="reportReason">
              <i className="fas fa-exclamation-triangle"></i>
              Reason for Report *
            </label>
            <select
              id="reportReason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              required
            >
              <option value="">Select a reason...</option>
              {reportReasons.map(reason => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reportDescription">
              <i className="fas fa-comment"></i>
              Additional Details {formData.reason === 'other' && '*'}
            </label>
            <textarea
              id="reportDescription"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Please provide specific details about why you're reporting this item..."
              rows="4"
              maxLength="500"
              required={formData.reason === 'other'}
            />
            <small>{formData.description.length}/500 characters</small>
          </div>

          <div className="report-guidelines">
            <h4>
              <i className="fas fa-info-circle"></i>
              Reporting Guidelines
            </h4>
            <ul>
              <li>Only report items that violate community standards</li>
              <li>Provide specific details to help our review</li>
              <li>False reports may result in restrictions</li>
              <li>Reports are reviewed within 24-48 hours</li>
            </ul>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-danger"
              disabled={isSubmitting || !formData.reason}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-flag"></i>
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;