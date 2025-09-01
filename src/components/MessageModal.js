import React, { useState } from 'react';

const MessageModal = ({ item, onClose, showNotification }) => {
  const [message, setMessage] = useState(`Hi! I'm interested in your "${item.title}" listing. Is it still available?`);
  const [senderContact, setSenderContact] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = async () => {
    const fullMessage = `Subject: Interest in "${item.title}"

Hi,

${message}

My contact info: ${senderContact}

Item: ${item.title}
Location: ${item.location}

Thanks!`;

    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      showNotification('Message copied to clipboard! You can paste it in your preferred messaging app.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
      showNotification('Failed to copy message. Try selecting and copying manually.', 'error');
    }
  };

  const handleEmailClient = () => {
    const subject = encodeURIComponent(`Interest in "${item.title}"`);
    const body = encodeURIComponent(`Hi,

${message}

My contact info: ${senderContact}

Item: ${item.title}
Location: ${item.location}

Thanks!`);
    
    const mailtoLink = `mailto:${item.contact}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="modal-header">
          <h2><i className="fas fa-envelope"></i> Contact Owner</h2>
          <p>About: <strong>{item.title}</strong></p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Owner: {item.contact}</p>
        </div>

        <div className="modal-body">
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
          </div>

          <div className="form-group">
            <label htmlFor="messageText">
              <i className="fas fa-comment"></i> Your Message
            </label>
            <textarea
              id="messageText"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              maxLength={500}
            />
            <small>{message.length}/500 characters</small>
          </div>

          <div className="message-preview">
            <h4>Preview:</h4>
            <div className="preview-content" style={{ whiteSpace: 'pre-wrap' }}>
              <strong>To:</strong> {item.contact}<br/>
              <strong>Subject:</strong> Interest in "{item.title}"<br/><br/>
              Hi,<br/><br/>
              {message}<br/><br/>
              My contact info: {senderContact || '(enter your contact info above)'}<br/><br/>
              Item: {item.title}<br/>
              Location: {item.location}<br/><br/>
              Thanks!
            </div>
          </div>

          <div className="contact-options">
            <h4>How would you like to send this message?</h4>
            
            <div className="contact-option">
              <button 
                className="btn btn-primary"
                onClick={handleCopyMessage}
                disabled={!senderContact.trim()}
              >
                <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                {copied ? 'Copied!' : 'Copy Message'}
              </button>
              <p>Copy the message to send via text, WhatsApp, or any messaging app</p>
            </div>

            <div className="contact-option">
              <button 
                className="btn btn-secondary"
                onClick={handleEmailClient}
                disabled={!senderContact.trim()}
              >
                <i className="fas fa-envelope"></i>
                Open Email Client
              </button>
              <p>Open your default email app (Gmail, Outlook, etc.)</p>
            </div>

            <div className="contact-option">
              <a 
                href={`mailto:${item.contact}`}
                className="btn btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-external-link-alt"></i>
                Direct Email
              </a>
              <p>Send email directly to {item.contact}</p>
            </div>
          </div>

          <div className="form-actions">
            <button 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;