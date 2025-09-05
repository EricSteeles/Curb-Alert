import React from 'react';

const Guidelines = () => {
  return (
    <div className="tab-content">
      <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>
        <i className="fas fa-hands-helping"></i> Community Guidelines
      </h2>
      
      <div className="guidelines-content">
        <div className="guidelines-intro">
          <p>Welcome to our free stuff community! These guidelines help keep our platform safe, 
          friendly, and useful for everyone. By posting or using our platform, you agree to follow these rules.</p>
        </div>

        <div className="guidelines-section">
          <h3>
            <i className="fas fa-check-circle"></i>
            What You Can Post
          </h3>
          <ul>
            <li><strong>Free items only</strong> - No selling, trading, or requesting payment</li>
            <li><strong>Items you own</strong> - Only post things that belong to you</li>
            <li><strong>Clean, safe items</strong> - Items should be in reasonable condition</li>
            <li><strong>Legal items</strong> - Nothing stolen, counterfeit, or illegal</li>
            <li><strong>Household goods</strong> - Furniture, electronics, books, toys, etc.</li>
            <li><strong>Garden items</strong> - Plants, pots, tools, outdoor furniture</li>
            <li><strong>Clothing & accessories</strong> - Clean and in good condition</li>
          </ul>
        </div>

        <div className="guidelines-section">
          <h3>
            <i className="fas fa-times-circle"></i>
            What's Not Allowed
          </h3>
          <ul>
            <li><strong>Anything for sale</strong> - This is a free-only platform</li>
            <li><strong>Food items</strong> - For safety reasons, no perishables</li>
            <li><strong>Dangerous items</strong> - Weapons, chemicals, broken glass, etc.</li>
            <li><strong>Live animals</strong> - Use proper pet rehoming services</li>
            <li><strong>Personal information</strong> - No sharing others' private details</li>
            <li><strong>Spam or duplicates</strong> - Don't post the same item multiple times</li>
            <li><strong>Inappropriate content</strong> - Keep it family-friendly</li>
            <li><strong>Fake listings</strong> - All posts must be genuine offers</li>
          </ul>
        </div>

        <div className="guidelines-section">
          <h3>
            <i className="fas fa-handshake"></i>
            Being a Good Community Member
          </h3>
          <ul>
            <li><strong>Be honest</strong> - Describe items accurately, including any defects</li>
            <li><strong>Be responsive</strong> - Reply to messages promptly</li>
            <li><strong>Be respectful</strong> - Treat others with kindness and patience</li>
            <li><strong>First come, first served</strong> - Honor pickup commitments</li>
            <li><strong>Update your posts</strong> - Mark items as claimed when taken</li>
            <li><strong>No-shows happen</strong> - Be understanding if someone can't make it</li>
            <li><strong>Stay safe</strong> - Meet in public places when possible</li>
          </ul>
        </div>

        <div className="guidelines-section">
          <h3>
            <i className="fas fa-shield-alt"></i>
            Safety Tips
          </h3>
          <ul>
            <li><strong>Meet safely</strong> - Use well-lit, public locations for pickup</li>
            <li><strong>Bring a friend</strong> - Consider having someone with you</li>
            <li><strong>Trust your instincts</strong> - If something feels off, walk away</li>
            <li><strong>Verify items</strong> - Check that items match the description</li>
            <li><strong>Protect privacy</strong> - Don't share personal information unnecessarily</li>
            <li><strong>Report issues</strong> - Use the report button for inappropriate content</li>
          </ul>
        </div>

        <div className="guidelines-section">
          <h3>
            <i className="fas fa-exclamation-triangle"></i>
            Reporting & Moderation
          </h3>
          <ul>
            <li><strong>Report inappropriate content</strong> - Help keep the community safe</li>
            <li><strong>Be specific</strong> - Provide details when reporting issues</li>
            <li><strong>No false reports</strong> - Only report genuine violations</li>
            <li><strong>We review all reports</strong> - Usually within 24-48 hours</li>
            <li><strong>Consequences</strong> - Violations may result in post removal or restrictions</li>
          </ul>
        </div>

        <div className="guidelines-section">
          <h3>
            <i className="fas fa-lightbulb"></i>
            Tips for Great Posts
          </h3>
          <ul>
            <li><strong>Clear photos</strong> - Take good pictures showing the item's condition</li>
            <li><strong>Descriptive titles</strong> - "Oak coffee table with drawer" vs "Table"</li>
            <li><strong>Honest descriptions</strong> - Mention size, condition, and any issues</li>
            <li><strong>Accurate location</strong> - Help people find you easily</li>
            <li><strong>Pickup details</strong> - Mention stairs, heavy items, etc.</li>
            <li><strong>Use tags</strong> - Add keywords to help people find your items</li>
          </ul>
        </div>

        <div className="guidelines-footer">
          <div className="footer-section">
            <h4>
              <i className="fas fa-question-circle"></i>
              Questions or Issues?
            </h4>
            <p>If you have questions about these guidelines or need to report a serious issue, 
            please use the report feature or contact the community moderators.</p>
          </div>

          <div className="footer-section">
            <h4>
              <i className="fas fa-heart"></i>
              Thank You!
            </h4>
            <p>Thanks for being part of our community and helping reduce waste by giving items 
            a second life. Together, we're making our neighborhood more sustainable and connected!</p>
          </div>
        </div>

        <div className="guidelines-agreement">
          <div className="agreement-box">
            <i className="fas fa-info-circle"></i>
            <p><strong>By using this platform, you agree to follow these community guidelines.</strong> 
            We reserve the right to remove content or restrict access for violations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;