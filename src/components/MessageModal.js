import React, { useState } from 'react';

const MessageModal = ({ item, onClose, onSendMessage, showNotification }) => {
  const [message, setMessage] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      showNotification('Please enter a message', 'error');
      return;
    }

    if (!senderContact.trim()) {
      showNotification('Please enter your contact information', 'error');
      return;
    }

    setLoading(true);
    try {
      // For now, we'll just compose an email
      const subject = `Interest in: ${item.title}`;
      const body = `Hi,\n\nI'm interested in your item: "${item.title}"\n\nMessage: ${message}\n\nPlease contact me at: ${senderContact}\n\nThanks!`;
      
      // Create mailto link
      const mailtoLink = `mailto:${item.contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      showNotification('Email client opened! Your message has been prepared.', 'success');
      onClose();
      
      // TODO: In future, save message to Firebase for real messaging system
      
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Error sending message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="modal-header">
          <h2><i className="fas fa-envelope"></i> Send Message</h2>
          <p>About: <strong>{item.title}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="senderContact">
              <i className="fas fa-user"></i> Your Contact Info *
            </label>
            <input
              type="text"
              id="senderContact"
              value={senderContact}
              onChange={(e) => setSenderContact(e.target.value)}
              placeholder="Your email or phone number"
              required
            />
            <small>How should they contact you back?</small>
          </div>

          <div className="form-group">
            <label htmlFor="messageText">
              <i className="fas fa-comment"></i> Message *
            </label>
            <textarea
              id="messageText"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I'm interested in your item. When would be a good time to pick it up?"
              rows="5"
              required
              maxLength={1000}
            />
            <small>{message.length}/1000 characters</small>
          </div>

          <div className="message-preview">
            <h4>Preview:</h4>
            <div className="preview-content">
              <strong>To:</strong> {item.contact}<br/>
              <strong>Subject:</strong> Interest in: {item.title}<br/>
              <strong>Your Message:</strong> {message || '(Your message will appear here)'}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-envelope"></i>
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;