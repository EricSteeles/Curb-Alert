export const generateWhatsAppLink = (phoneNumber, itemTitle, itemLocation) => {
  if (!phoneNumber) return null;
  
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
  const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+1${cleanPhone}`;
  const message = `Hi! I'm interested in "${itemTitle}" that you posted on Curb Alert. Is it still available? Location: ${itemLocation}`;
  
  return `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
};

export const generateSMSLink = (phoneNumber, itemTitle, itemLocation) => {
  if (!phoneNumber) return null;
  
  const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
  const message = `Hi! Interested in "${itemTitle}" from Curb Alert. Still available? Location: ${itemLocation}`;
  
  return `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
};

export const generateEmailLink = (email, itemTitle, itemLocation) => {
  if (!email) return null;
  
  const subject = `Interested in: ${itemTitle}`;
  const body = `Hi!\n\nI saw your posting for "${itemTitle}" on Curb Alert and I'm interested in picking it up.\n\nIs it still available?\n\nLocation: ${itemLocation}\n\nThanks!`;
  
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const detectContactType = (contact) => {
  if (!contact) return null;
  
  if (contact.includes('@') && contact.includes('.')) {
    return 'email';
  }
  
  const phoneRegex = /^[\+]?[1]?[\s\-\.]?[\(]?[0-9]{3}[\)]?[\s\-\.]?[0-9]{3}[\s\-\.]?[0-9]{4}$/;
  const cleanContact = contact.replace(/[^\d+]/g, '');
  
  if (phoneRegex.test(contact) || (cleanContact.length >= 10 && cleanContact.length <= 12)) {
    return 'phone';
  }
  
  return 'unknown';
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/[^\d]/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};