import React from 'react';

function Guidelines() {
  return (
    <div className="tab-content">
      <div className="guidelines-container">
        <h2>Community Guidelines</h2>
        
        <div className="guidelines-section">
          <h3>🏠 What to Post</h3>
          <ul>
            <li>Items that are free and available for pickup</li>
            <li>Items in good, usable condition</li>
            <li>Items you're placing on the curb or giving away</li>
            <li>Clear photos showing the item's condition</li>
            <li>Accurate descriptions and locations</li>
          </ul>
        </div>

        <div className="guidelines-section">
          <h3>❌ What NOT to Post</h3>
          <ul>
            <li>Items for sale (this is for free items only)</li>
            <li>Broken or damaged items unless clearly stated</li>
            <li>Hazardous materials or chemicals</li>
            <li>Items that violate local regulations</li>
            <li>Food items or perishables</li>
            <li>Live animals</li>
            <li>Inappropriate or offensive content</li>
            <li>Fake or misleading listings</li>
          </ul>
        </div>

        <div className="guidelines-section">
          <h3>📍 Location & Pickup</h3>
          <ul>
            <li>Provide accurate location information</li>
            <li>Only post items available for immediate pickup</li>
            <li>Update status when items are taken</li>
            <li>Be respectful of private property</li>
            <li>Meet in safe, well-lit areas when possible</li>
          </ul>
        </div>

        <div className="guidelines-section">
          <h3>🤝 Community Etiquette</h3>
          <ul>
            <li>First come, first served basis</li>
            <li>Be respectful in all interactions</li>
            <li>Don't hold items for extended periods</li>
            <li>Clean up after yourself when picking up items</li>
            <li>Be understanding if pickup plans change</li>
          </ul>
        </div>

        <div className="guidelines-section">
          <h3>📱 Using the App</h3>
          <ul>
            <li>Mark items as "taken" when picked up</li>
            <li>Delete posts for items no longer available</li>
            <li>Use clear, descriptive titles</li>
            <li>Include relevant details in descriptions</li>
            <li>Report inappropriate content using the report button</li>
          </ul>
        </div>

        <div className="guidelines-section important">
          <h3>🚨 Reporting Issues</h3>
          <p>Help keep our community safe by reporting problematic content:</p>
          <ul>
            <li><strong>Use the Report button</strong> on any inappropriate item listing</li>
            <li><strong>Report spam, fraud, or dangerous items</strong> immediately</li>
            <li><strong>Contact moderators</strong> for serious issues or questions</li>
          </ul>
          
          <div className="contact-info">
            <h4>📧 Contact Information</h4>
            <p>For questions, concerns, or reporting issues that require immediate attention:</p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:0ericsteele0@gmail.com">0ericsteele0@gmail.com</a></li>
              <li><strong>Moderation Team:</strong> <a href="mailto:0ericsteele0@gmail.com">0ericsteele0@gmail.com</a></li>
              <li><strong>Response time:</strong> Usually within 24-48 hours</li>
              <li><strong>Urgent safety issues:</strong> Please contact local authorities first</li>
            </ul>
            
            <div className="report-process">
              <h5>How Reports Are Handled:</h5>
              <ol>
                <li>Reports are reviewed by our moderation team</li>
                <li>Inappropriate content is removed promptly</li>
                <li>Repeat violations may result in posting restrictions</li>
                <li>We investigate all reports thoroughly and fairly</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="guidelines-section">
          <h3>🛡️ Safety First</h3>
          <ul>
            <li>Trust your instincts - if something feels wrong, walk away</li>
            <li>Meet in public places when possible</li>
            <li>Bring a friend for larger item pickups</li>
            <li>Don't share personal information unnecessarily</li>
            <li>Report suspicious activity immediately</li>
          </ul>
        </div>

        <div className="guidelines-section">
          <h3>⚖️ Community Standards</h3>
          <p>We reserve the right to remove content that violates these guidelines. Repeated violations may result in restricted access to the platform.</p>
          <p>Our automated systems also scan for prohibited content and may flag items for review.</p>
          <p>By using this app, you agree to follow these community guidelines and help maintain a positive environment for everyone.</p>
        </div>

        <div className="guidelines-footer">
          <div className="footer-section">
            <h4>🌱 Environmental Impact</h4>
            <p>By participating in our free item sharing community, you're helping reduce waste and promoting sustainable living in your neighborhood.</p>
          </div>
          
          <div className="footer-section">
            <h4>💝 Thank You</h4>
            <p>Thank you for being part of our community! Together, we're building stronger neighborhood connections while reducing waste and helping items find new homes.</p>
          </div>
        </div>

        <div className="last-updated">
          <p><small>Guidelines last updated: {new Date().toLocaleDateString()}</small></p>
        </div>
      </div>
    </div>
  );
}

export default Guidelines;