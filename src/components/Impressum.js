import React from 'react';

function Impressum() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      lineHeight: '1.6'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '20px',
        borderBottom: '2px solid #2a2a2a',
        paddingBottom: '10px'
      }}>
        Rreth nesh
      </h1>
      
      <div style={{
        fontSize: '14px',
        color: '#1a1a1a',
        marginBottom: '15px'
      }}>
        <p style={{ marginBottom: '15px', color: '#2a2a2a' }}>
          Kjo faqe shoqëron një agregator lajmesh në shqip, të ndërtuar me inteligjencë artificiale. 
          Qëllimi është të sjellë lajmet kryesore nga disa media në një vend të vetëm, pa tituj mashtrues 
          dhe pa clickbait, në mënyrë që të kuptohet më qartë çfarë po ndodh.
        </p>
        
        <p style={{ marginBottom: '15px', color: '#2a2a2a' }}>
          Sistemi mbledh lajmet e fundit, i grupon sipas temave dhe ngjarjeve dhe ndihmon të krahasohet 
          se si media të ndryshme raportojnë për të njëjtën histori. Përveç vetë lajmeve, platforma 
          tregon edhe se kush është në qendër të vëmendjes.
        </p>
        
        <p style={{ marginBottom: '15px', color: '#2a2a2a' }}>
          <strong style={{ color: '#1a1a1a' }}>Majtas</strong> shfaqet lista e entiteteve që lakohen më së shumti në lajmet e 36 orëve 
          të fundit. Këtu mund të shihni politikanë, institucione, kompani, vende dhe ngjarje që përmenden 
          më shpesh dhe të kuptoni se kush dominon diskursin publik në këtë moment.
        </p>
        
        <p style={{ marginBottom: '15px', color: '#2a2a2a' }}>
          <strong style={{ color: '#1a1a1a' }}>Djathtas</strong> mund të përdorni kërkimin për të kërkuar brenda lajmeve të 36 orëve 
          të fundit për çdo emër, temë ose fjalë kyçe që ju intereson dhe të shihni menjëherë të gjitha 
          artikujt që lidhen me të.
        </p>
        
        <p style={{ marginBottom: '25px', color: '#2a2a2a' }}>
          LajmAI nuk është portal lajmesh dhe nuk përfaqëson asnjë parti apo media. Është një mjet 
          eksperimental që kombinon AI dhe lajmet për të rritur transparencën dhe për t'ju dhënë një 
          pamje më të plotë të asaj që po ndodh në shoqëri.
        </p>
        
        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '15px'
          }}>
            Kontakt
          </h2>
          <p style={{ color: '#2a2a2a' }}>
            Email: <a 
              href="mailto:contact@lajm.ai" 
              style={{
                color: '#1a1a1a',
                textDecoration: 'underline',
                fontWeight: '600'
              }}
              onMouseOver={(e) => {
                e.target.style.color = '#4a4a4a';
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#1a1a1a';
              }}
            >
              contact@lajm.ai
            </a>
          </p>
        </div>
        
        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e0e0e0',
          fontSize: '12px',
          color: '#5a5a5a',
          textAlign: 'center'
        }}>
          <p>© {new Date().getFullYear()} LajmAI. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </div>
    </div>
  );
}

export default Impressum;