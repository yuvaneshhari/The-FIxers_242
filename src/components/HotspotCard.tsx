import { ArrowUpRight, Clock3, MapPin, Users } from 'lucide-react';
import type { ScoredZone } from '../data';
import { riskColor, riskTint } from '../data';

export function HotspotCard({
  zone,
  rank,
  onSelect,
}: {
  zone: ScoredZone;
  rank: number;
  onSelect: (zone: ScoredZone) => void;
}) {
  const labels = ['Immediate action', 'High priority', 'Monitor / prepare'];
  return (
    <button className={`hotspot-card hotspot-card-${rank}`} onClick={() => onSelect(zone)} aria-label={`Open ${zone.zone_name} action recommendation`}>
      <div className="hotspot-card-topline">
        <span className="rank-badge">0{rank}</span>
        <span className="rank-label">{labels[rank - 1]}</span>
        <ArrowUpRight size={16} strokeWidth={2.4} />
      </div>
      <div className="hotspot-name-row">
        <h3>{zone.zone_name}</h3>
        <span className="risk-pill" style={{ background: riskTint(zone.riskLevel), color: riskColor(zone.riskLevel) }}>{zone.riskLevel}</span>
      </div>
      <div className="hotspot-score-row">
        <span className="hotspot-score"><strong>{zone.priorityScore}</strong><small>/100 priority</small></span>
        <span className="hotspot-onset"><Clock3 size={14} />{zone.onset}</span>
      </div>
      <div className="hotspot-meta">
        <span><Users size={14} />{zone.populationExposure.toLocaleString('en-IN')} exposed</span>
        <span><MapPin size={14} />{zone.criticalAsset}</span>
      </div>
      <p>{zone.riskLevel === 'Severe' ? 'Start here: compounding risk and critical access make this the first response action.' : 'Prepare early: rainfall loading is likely to concentrate risk at this location.'}</p>
    </button>
  );
}
