import React from 'react';
import { generateWhatsAppLink, generateSMSLink, generateEmailLink, detectContactType, formatPhoneNumber } from '../utils/contact';

const ContactButtons = ({ contact, itemTitle, itemLocation, size = 'normal' }) => {
  if (!contact) return null;
  
  const contactType = detectContactType(contact);
  const buttonClass = size === 'small' ? 'btn btn-small' : 'btn';
  
  const renderEmailButton = () => (
    <a
      href={generateEmailLink(contact, itemTitle, itemLocation)}
      className={`${buttonClass} btn-email`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fas fa-envelope"></i>
      {size !== 'small' && ' Send Email'}
    </a>
  );
  
  const renderPhoneButtons = () => (
    <>
      <a
        href={generateWhatsAppLink(contact, itemTitle, itemLocation)}
        className={`${buttonClass} btn-whatsapp`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-whatsapp"></i>
        {size !== 'small' && ' WhatsApp'}
      </a>
      
      <a
        href={generateSMSLink(contact, itemTitle, itemLocation)}
        className={`${buttonClass} btn-sms`}
      >
        <i className="fas fa-sms"></i>
        {size !== 'small' && ' Text Message'}
      </a>
      
      <a
        href={`tel:${contact}`}
        className={`${buttonClass} btn-call`}
      >
        <i className="fas fa-phone"></i>
        {size !== 'small' && ' Call'}
      </a>
    </>
  );
  
  const renderUnknownContact = () => (
    <div className="contact-info">
      <i className="fas fa-info-circle"></i>
      <span>Contact: {contact}</span>
    </div>
  );
  
  return (
    <div className="contact-buttons">
      {contactType === 'email' && renderEmailButton()}
      {contactType === 'phone' && renderPhoneButtons()}
      {contactType === 'unknown' && renderUnknownContact()}
      
      {contactType === 'phone' && size !== 'small' && (
        <div className="contact-info">
          <small>
            <i className="fas fa-phone"></i>
            {formatPhoneNumber(contact)}
          </small>
        </div>
      )}
    </div>
  );
};

export default ContactButtons;