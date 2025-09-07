import React, { useState } from 'react';

const ContactForm = ({ isOpen, onClose, showNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectOptions = [
    'General Question',
    'Report Content Issue',
    'Technical Problem', 
    'Suggestion/Feedback',
    'Account Issue',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/myzdldyp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _subject: `Curb Alert Contact: ${formData.subject}`,
        }),
      });

      if (response.ok) {
        showNotification('Message sent successfully! We\'ll respond within 24-48 hours.', 'success');
        setFormData({ name: '', email: '', subject: 'General Question', message: '' });
        onClose();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Error sending message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Contact Moderators</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p className="contact-intro">
            Have a question, concern, or need to report an issue? We're here to help keep our community safe and running smoothly.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactName">Name *</label>
                <input
                  id="contactName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contactEmail">Email *</label>
                <input
                  id="contactEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="contactSubject">Subject *</label>
              <select
                id="contactSubject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
              >
                {subjectOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="contactMessage">Message *</label>
              <textarea
                id="contactMessage"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Please provide details about your question or concern..."
                rows="6"
                maxLength="1000"
                required
              />
              <small>{formData.message.length}/1000 characters</small>
            </div>
            
            <div className="contact-guidelines">
              <h4>Response Information</h4>
              <ul>
                <li>We typically respond within 24-48 hours</li>
                <li>For urgent safety issues, contact local authorities first</li>
                <li>Use the Report button on items for content-specific issues</li>
                <li>All messages are reviewed by our moderation team</li>
              </ul>
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;