import React from 'react';

const ReportButton = ({ itemId, itemTitle, onReport, className = "" }) => {
  const handleReport = (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    onReport(itemId, itemTitle);
  };

  return (
    <button 
      className={`report-button ${className}`}
      onClick={handleReport}
      title="Report this item"
    >
      <i className="fas fa-flag"></i>
      <span>Report</span>
    </button>
  );
};

export default ReportButton;