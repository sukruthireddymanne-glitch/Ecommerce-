import React from 'react';
import { GraduationCap, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <GraduationCap size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                EduFeedback Platform
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Student & Faculty Feedback & Academic Quality Assurance
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Built with Spring Boot 3 & React. Final Year Academic Capstone Project.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
