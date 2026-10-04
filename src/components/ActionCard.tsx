import { useState } from 'react';
import { AlertTriangle, Check, ClipboardCheck, Droplets, Languages, ShieldAlert, Siren, Users } from 'lucide-react';
import type { ScoredZone } from '../data';
import { riskColor, riskTint } from '../data';

const actionTemplates: Record<string, string[]> = {
  'Government Primary Health Centre': ['Dispatch drainage / pump team to PHC access road', 'Inspect and clear nearby storm-water drain inlets', 'Notify hospital administration and pre-position rescue support'],
  'Railway underpass · NH access': ['Barricade railway underpass entry points before water rises', 'Dispatch drainage / pump team to the low point', 'Warn commuters and coordinate with railway station staff'],
  'Emergency shelter · Community Hall': ['Inspect and clear nearby storm-water drain along canal bund', 'Pre-position rescue team at the community hall', 'Warn residents in affected streets and confirm shelter readiness'],
};

export function ActionCard({
  zone,
  prepared,
  onPrepared,
}: {
  zone: ScoredZone;
  prepared: boolean;
  onPrepared: () => void;
}) {
  const [alertVisible, setAlertVisible] = useState(false);
  const actions = actionTemplates[zone.criticalAsset] ?? [
    `Dispatch drainage / pump team to ${zone.road}`,
    `Inspect and clear nearby storm-water drain around ${zone.zone_name}`,
    `Pre-position rescue team and warn residents in affected streets`,
  ];
  const colour = riskColor(zone.riskLevel);
  const tamilRoad = zone.road === 'Railway Station Link Road' ? 'ரயில் நிலைய இணைப்பு சாலை' : zone.road;
  return (
    <section className="action-card" id="action-card">
      <div className="action-card-heading">
        <div>
          <span className="section-eyebrow"><Siren size={14} /> Action recommendation</span>
          <h2>Action required within <em>{zone.onset.replace('Within ', '')}</em></h2>
        </div>
        <span className="action-alert-icon" style={{ background: riskTint(zone.riskLevel), color: colour }}><ShieldAlert size={22} /></span>
      </div>
      <div className="action-zone-summary">
        <div><span>Selected hotspot</span><strong>{zone.zone_name}</strong></div>
        <div><span>Flood risk</span><strong style={{ color: colour }}>{zone.riskScore}<small>/100 · {zone.riskLevel}</small></strong></div>
        <div><span>Exposed residents</span><strong>{zone.populationExposure.toLocaleString('en-IN')}<small> people</small></strong></div>
      </div>
      <div className="action-detail-grid">
        <div className="detail-block">
          <h3>Why this zone is at risk</h3>
          <ul className="driver-list">
            {zone.drivers.slice(0, 4).map((driver) => <li key={driver}><span className="driver-dot" style={{ background: colour }} />{driver}</li>)}
          </ul>
        </div>
        <div className="detail-block">
          <h3>People & assets at risk</h3>
          <div className="asset-callout"><Users size={17} /><div><strong>{zone.populationExposure.toLocaleString('en-IN')} residents</strong><span>within the scenario exposure estimate</span></div></div>
          <div className="asset-callout"><Droplets size={17} /><div><strong>{zone.criticalAsset}</strong><span>{zone.road}</span></div></div>
        </div>
      </div>
      <div className="response-actions">
        <h3>Recommended response · exactly 3 actions</h3>
        <ol>
          {actions.map((action, index) => <li key={action}><span>{index + 1}</span>{action}</li>)}
        </ol>
      </div>
      <div className="alert-controls">
        <button className="primary-button" onClick={() => setAlertVisible((current) => !current)}><Languages size={17} />{alertVisible ? 'Hide simulated alert' : 'Generate Resident Alert'}</button>
        <button className={`secondary-button ${prepared ? 'prepared' : ''}`} onClick={onPrepared} disabled={prepared}><ClipboardCheck size={17} />{prepared ? 'Alert prepared' : 'Mark Alert Prepared'}</button>
      </div>
      {prepared && <div className="prepared-state"><Check size={16} />Alert prepared for local dissemination <span>SIMULATED ONLY</span></div>}
      {alertVisible && (
        <div className="simulated-alert" aria-live="polite">
          <div className="simulated-alert-heading"><AlertTriangle size={17} /><strong>Simulated resident alert · not sent</strong><span>EN + தமிழ்</span></div>
          <div className="alert-copy"><span>English</span><p>Flood warning for <strong>{zone.zone_name}</strong>: Heavy rain may cause waterlogging within the next {zone.onset === 'Within 1 hour' ? '1 hour' : '1–3 hours'}. Avoid <strong>{zone.road}</strong>. Move documents, medicines and electrical items to a safe height. Follow local authority instructions.</p></div>
          <div className="alert-copy tamil"><span>தமிழ்</span><p>வெள்ள எச்சரிக்கை — <strong>{zone.zone_name}</strong>: அடுத்த {zone.onset === 'Within 1 hour' ? '1 மணி நேரத்தில்' : '1–3 மணி நேரத்தில்'} கனமழையால் நீர் தேக்கம் ஏற்படலாம். <strong>{tamilRoad}</strong> பகுதியை தவிர்க்கவும். ஆவணங்கள், மருந்துகள் மற்றும் மின்சாதனங்களை பாதுகாப்பான உயரமான இடத்திற்கு மாற்றவும். உள்ளாட்சி நிர்வாகத்தின் அறிவுரைகளை பின்பற்றவும்.</p></div>
        </div>
      )}
    </section>
  );
}
