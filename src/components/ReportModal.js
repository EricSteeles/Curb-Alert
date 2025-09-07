/* ===== REPORT MODAL & MODERATION STYLING ===== */

/* Report modal specific styling */
.report-modal {
  max-width: 500px !important;
}

.report-modal .modal-header p {
  color: #94a3b8 !important;
  font-size: 0.9rem !important;
  margin-top: 0.5rem !important;
  margin-bottom: 0 !important;
}

.reported-item-info {
  background: rgba(30, 41, 59, 0.8) !important;
  border: 1px solid rgba(148, 163, 184, 0.1) !important;
  border-radius: 12px !important;
  padding: 1rem !important;
  margin-bottom: 1.5rem !important;
}

.reported-item-info h4 {
  color: #f1f5f9 !important;
  font-size: 1rem !important;
  margin: 0 0 0.5rem 0 !important;
  font-weight: 600 !important;
}

.reported-item-info p {
  color: #94a3b8 !important;
  font-size: 0.85rem !important;
  margin: 0 !important;
}

.report-guidelines {
  background: rgba(59, 130, 246, 0.1) !important;
  border: 1px solid rgba(59, 130, 246, 0.2) !important;
  border-radius: 12px !important;
  padding: 1rem !important;
  margin: 1.5rem 0 !important;
}

.report-guidelines h4 {
  color: #60a5fa !important;
  font-size: 0.9rem !important;
  margin: 0 0 0.75rem 0 !important;
  font-weight: 600 !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
}

.report-guidelines ul {
  margin: 0 !important;
  padding-left: 1.25rem !important;
  list-style-type: disc !important;
}

.report-guidelines li {
  color: #94a3b8 !important;
  font-size: 0.8rem !important;
  margin-bottom: 0.25rem !important;
  line-height: 1.4 !important;
}

/* Modal header improvements for report button */
.modal-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
  padding: 1.5rem 1.5rem 1rem 1.5rem !important;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1) !important;
}

.modal-header-left {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.5rem !important;
}

.modal-header-right {
  flex-shrink: 0 !important;
}

/* Report button styling */
.report-btn {
  background: transparent !important;
  border: 1px solid rgba(239, 68, 68, 0.3) !important;
  color: #ef4444 !important;
  padding: 0.5rem 0.75rem !important;
  font-size: 0.8rem !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.report-btn:hover {
  background: rgba(239, 68, 68, 0.1) !important;
  border-color: #ef4444 !important;
  transform: none !important;
}

.report-btn i {
  margin-right: 0.25rem !important;
}

/* Danger button styling for report submission */
.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  color: white !important;
  border: none !important;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4) !important;
}

.btn-danger:disabled {
  background: rgba(107, 114, 128, 0.5) !important;
  transform: none !important;
  box-shadow: none !important;
  cursor: not-allowed !important;
}

/* Outline button styling */
.btn-outline {
  background: transparent !important;
  border: 1px solid rgba(148, 163, 184, 0.3) !important;
  color: #94a3b8 !important;
}

.btn-outline:hover {
  background: rgba(148, 163, 184, 0.1) !important;
  border-color: #94a3b8 !important;
  color: #f1f5f9 !important;
}

/* Character counter styling */
.form-group small {
  color: #6b7280 !important;
  font-size: 0.75rem !important;
  text-align: right !important;
  display: block !important;
  margin-top: 0.25rem !important;
}

/* Admin features (for future admin panel) */
.flagged-item {
  border-left: 4px solid #ef4444 !important;
  background: rgba(239, 68, 68, 0.05) !important;
}

.flagged-badge {
  background: rgba(239, 68, 68, 0.9) !important;
  color: white !important;
  font-size: 0.7rem !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 4px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
}

/* Mobile responsive for report modal */
@media (max-width: 768px) {
  .modal-header {
    flex-direction: column !important;
    gap: 1rem !important;
    align-items: stretch !important;
  }
  
  .modal-header-right {
    align-self: flex-end !important;
  }
  
  .report-btn {
    align-self: flex-start !important;
    font-size: 0.75rem !important;
    padding: 0.5rem !important;
  }
  
  .report-modal {
    max-width: none !important;
    width: 100% !important;
    margin: 10px !important;
  }
  
  .reported-item-info {
    padding: 0.75rem !important;
  }
  
  .report-guidelines {
    padding: 0.75rem !important;
  }
  
  .report-guidelines li {
    font-size: 0.75rem !important;
  }
}