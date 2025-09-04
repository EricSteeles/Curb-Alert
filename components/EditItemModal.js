import React, { useState } from 'react';

const EditItemModal = ({ item, onSave, onClose, showNotification }) => {
  const [formData, setFormData] = useState({
    title: item.title || '',
    description: item.description || '',
    condition: item.condition || 'good',
    location: item.location || '',
    contact: item.contact || ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      showNotification('Please enter a title', 'error');
      return;
    }

    setLoading(true);
    try {
      await onSave(item.id, formData);
      showNotification('Item updated successfully!', 'success');
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      showNotification('Error updating item. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="modal-header">
          <h2><i className="fas fa-edit"></i> Edit Item</h2>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="editTitle">
              <i className="fas fa-heading"></i> Title *
            </label>
            <input
              type="text"
              id="editTitle"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="What are you giving away?"
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="editDescription">
              <i className="fas fa-align-left"></i> Description
            </label>
            <textarea
              id="editDescription"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the item's condition, size, etc."
              rows="4"
              maxLength={1000}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="editCondition">
                <i className="fas fa-info-circle"></i> Condition
              </label>
              <select
                id="editCondition"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="editLocation">
              <i className="fas fa-map-marker-alt"></i> Location
            </label>
            <input
              type="text"
              id="editLocation"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Street address or general area"
            />
          </div>

          <div className="form-group">
            <label htmlFor="editContact">
              <i className="fas fa-envelope"></i> Contact Info
            </label>
            <input
              type="text"
              id="editContact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="Email or phone number"
            />
            <small>How should people contact you about this item?</small>
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
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;