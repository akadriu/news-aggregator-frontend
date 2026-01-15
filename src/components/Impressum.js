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
          LajmAI është një agregator lajmesh në gjuhën shqipe, i ndërtuar me inteligjencë artificiale. Synimi është krijimi i një pasqyrë të përgjithshme të ngjarjeve aktuale.
        </p>

        <p style={{ marginBottom: '15px', color: '#2a2a2a' }}>
          Platforma mbledh lajmet e fundit nga faqet relevante dhe i grupon sipas temave dhe ngjarjeve, duke mundësuar dhe krahasimin mes raportimit nga media të ndryshme, si dhe identifikimin e personazheve në qendër të vëmendjes. Majtas shfaqet lista e entiteteve (personazhe ose institucione) që përmenden më shpesh në lajmet e 36 orëve të fundit. Djathtas, funksioni i kërkimit ju ndihmon të kërkoni brenda lajmeve të 36 orëve të fundit për çdo emër, temë ose fjalë kyçe që ju intereson dhe të gjeni menjëherë të gjithë artikujt që lidhen me të.
        </p>

        <p style={{ marginBottom: '15px', color: '#2a2a2a' }}>
          Platforma nuk prodhon lajme apo materiale të tjera origjinale; ajo vetëm analizon dhe i organizon përmbajtjet e faqeve të tjera. Lajmet procesohen nga algoritme kompjuterike që kemi dizajnuar dhe vazhdojmë t’i përmirësojmë. Përzgjedhja dhe pozicioni i lajmeve në faqe përcaktohen automatikisht nga këto algoritme, pa asnjë ndërhyrje njerëzore, çka mund të sjellë edhe gabime.
        </p>

        <p style={{ marginBottom: '15px', color: '#2a2a2a' }}>
          Një shtyllë e rëndësishme e projektit është respektimi i të drejtave të autorit. Platforma shfaq vetëm titullin original të artikullit, një fragment të shkurtër dhe një figurë të vogël shoqëruese. Nëse dëshironi të lexoni të gjithë artikullin, klikoni mbi titullin dhe dërgoheni në faqen origjinale të medias, ku mund ta lexoni të plotë. Ne nuk mbajmë asnjë përgjegjësi për vërtetësinë e informacionit të marrë nga burimet; besojmë se më shumë informacione do të thotë më shumë zgjedhje, më shumë liri dhe, në fund, më shumë fuqi për lexuesit.
        </p>

        <p style={{ marginBottom: '15px', color: '#2a2a2a' }}>
          LajmAI nuk është portal lajmesh dhe nuk përfaqëson asnjë parti politike apo media të veçantë; është një mjet eksperimental që kombinon AI dhe lajmet për të rritur transparencën dhe për t’ju dhënë një panoramë më të gjithanshme të asaj që po ndodh në shoqëri. Pas këtij projekti qëndron një person akademik me përvojë shumëvjeçare në fushën e inteligjencës artificiale, angazhim në kërkim shkencor dhe mësimdhënie universitare, si garanci për një përqasje serioze, kërkimore dhe afatgjatë ndaj zhvillimit të platformës.
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