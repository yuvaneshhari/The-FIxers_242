import { useEffect, useMemo, useState } from 'react';
import {
  AlertOctagon,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  CloudRain,
  Droplets,
  Info,
  LayoutDashboard,
  MapPinned,
  Menu,
  RadioTower,
  ShieldCheck,
  Target,
  Users,
  X,
} from 'lucide-react';
import { ActionCard } from './components/ActionCard';
import { HotspotCard } from './components/HotspotCard';
import { MapView } from './components/MapView';
import {
  rankedHotspots,
  riskColor,
  riskTint,
  scenarioMeta,
  scoreAllZones,
  type Scenario,
  type ScoredZone,
} from './data';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { id: 'methodology', label: 'Methodology', path: '/methodology', icon: BookOpen },
  { id: 'about', label: 'About / Disclaimer', path: '/about', icon: Info },
] as const;
type Page = typeof navItems[number]['id'];

function pageFromPath(path: string): Page {
  if (path.startsWith('/methodology')) return 'methodology';
  if (path.startsWith('/about')) return 'about';
  return 'dashboard';
}

function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname));
  const [scenario, setScenario] = useState<Scenario>(() => (localStorage.getItem('floodfirst-scenario') as Scenario) || 'normal');
  const [prepared, setPrepared] = useState(() => localStorage.getItem('floodfirst-alert-prepared') === 'true');
  const [selectedId, setSelectedId] = useState(() => rankedHotspots((localStorage.getItem('floodfirst-scenario') as Scenario) || 'normal')[0].zone_id);
  const [mobileOpen, setMobileOpen] = useState(false);

  const scoredZones = useMemo(() => scoreAllZones(scenario), [scenario]);
  const topThree = useMemo(() => rankedHotspots(scenario), [scenario]);
  const selectedZone = scoredZones.find((zone) => zone.zone_id === selectedId) ?? topThree[0];
  const severeCount = scoredZones.filter((zone) => zone.riskLevel === 'Severe').length;
  const highCount = scoredZones.filter((zone) => zone.riskLevel === 'High').length;

  useEffect(() => {
    localStorage.setItem('floodfirst-scenario', scenario);
  }, [scenario]);

  useEffect(() => {
    localStorage.setItem('floodfirst-alert-prepared', String(prepared));
  }, [prepared]);

  useEffect(() => {
    const onPopState = () => setPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextPage: Page) => {
    const next = navItems.find((item) => item.id === nextPage);
    if (next && window.location.pathname !== next.path) window.history.pushState({}, '', next.path);
    setPage(nextPage);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectZone = (zone: ScoredZone) => {
    setSelectedId(zone.zone_id);
    window.requestAnimationFrame(() => document.getElementById('action-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const changeScenario = (nextScenario: Scenario) => {
    setScenario(nextScenario);
    setSelectedId(rankedHotspots(nextScenario)[0].zone_id);
    setPrepared(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-block">
          <div className="brand-mark"><Droplets size={19} /></div>
          <div><strong>FloodFirst</strong><span>Early action desk</span></div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <div className="pilot-card"><span className="pilot-dot" /><div><span>PILOT AREA</span><strong>Gummidipundi Ward Cluster</strong><small>Tamil Nadu, India</small></div></div>
        <nav className="side-nav" aria-label="Primary navigation">
          <span className="nav-label">OPERATIONS</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={page === item.id ? 'nav-item active' : 'nav-item'} onClick={() => navigate(item.id)}><Icon size={18} /><span>{item.label}</span>{page === item.id && <ChevronRight className="nav-arrow" size={15} />}</button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><CircleHelp size={17} /><div><strong>Decision window</strong><span>Next 1–3 hours</span></div></div>
          <div className="sidebar-foot"><span className="live-dot" /> Demo workspace · v0.1</div>
        </div>
      </aside>
      {mobileOpen && <button className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}

      <main className="main-shell">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><span className="breadcrumb">Gummidipundi Ward Cluster <ChevronRight size={14} /> <strong>{page === 'dashboard' ? 'Decision dashboard' : page === 'methodology' ? 'Methodology' : 'About / Disclaimer'}</strong></span></div>
          <div className="topbar-right"><span className="updated-status"><span className="live-dot" /> Last updated: Just now</span><span className="topbar-divider" /><span className="demo-badge"><RadioTower size={14} /> DEMO MODE — NOT AN OFFICIAL WARNING</span></div>
        </header>

        {page === 'dashboard' && (
          <Dashboard
            scenario={scenario}
            changeScenario={changeScenario}
            scoredZones={scoredZones}
            topThree={topThree}
            selectedZone={selectedZone}
            selectedId={selectedId}
            selectZone={selectZone}
            prepared={prepared}
            onPrepared={() => setPrepared(true)}
            severeCount={severeCount}
            highCount={highCount}
            navigate={navigate}
          />
        )}
        {page === 'methodology' && <Methodology navigate={navigate} />}
        {page === 'about' && <About navigate={navigate} />}
      </main>
    </div>
  );
}

function Dashboard({
  scenario,
  changeScenario,
  scoredZones,
  topThree,
  selectedZone,
  selectedId,
  selectZone,
  prepared,
  onPrepared,
  severeCount,
  highCount,
  navigate,
}: {
  scenario: Scenario;
  changeScenario: (scenario: Scenario) => void;
  scoredZones: ScoredZone[];
  topThree: ScoredZone[];
  selectedZone: ScoredZone;
  selectedId: string;
  selectZone: (zone: ScoredZone) => void;
  prepared: boolean;
  onPrepared: () => void;
  severeCount: number;
  highCount: number;
  navigate: (page: Page) => void;
}) {
  return (
    <div className="page-wrap dashboard-page">
      <section className="page-heading">
        <div>
          <div className="eyebrow-line"><span className="eyebrow-dot" /> HYPERLOCAL INUNDATION INTELLIGENCE</div>
          <h1>Where should the first action go?</h1>
          <p>Translate the next rain scenario into a ranked, explainable response plan for the ward control room.</p>
        </div>
        <div className="forecast-window"><CloudRain size={18} /><div><span>Forecast window</span><strong>Next 1–3 hours</strong></div></div>
      </section>

      <section className="scenario-bar">
        <div className="scenario-copy"><span className="section-eyebrow"><CloudRain size={14} /> Rainfall scenario</span><strong>What is the control room expecting?</strong><span className="scenario-note">{scenarioMeta[scenario].description}</span></div>
        <div className="scenario-options" role="group" aria-label="Rainfall scenario selector">
          {(Object.keys(scenarioMeta) as Scenario[]).map((key) => <button key={key} className={scenario === key ? `scenario-option selected scenario-${key}` : 'scenario-option'} onClick={() => changeScenario(key)}><span className="scenario-radio" />{scenarioMeta[key].label}</button>)}
        </div>
      </section>

      <div className="how-strip"><span className="how-label">HOW IT WORKS</span><span>Forecast rainfall</span><ArrowRight size={14} /><span>Terrain + drains</span><ArrowRight size={14} /><span>Historical hotspots</span><ArrowRight size={14} /><strong>Inundation risk</strong><ArrowRight size={14} /><strong>First-response action</strong></div>

      <section className="dashboard-grid">
        <div className="map-column">
          <div className="map-card">
            <div className="card-header map-header"><div><span className="section-eyebrow"><MapPinned size={14} /> Pilot-area risk map</span><h2>Gummidipundi Ward Cluster</h2></div><div className="map-header-stats"><span><strong>{severeCount}</strong> severe</span><span><strong>{highCount}</strong> high</span><span><strong>12</strong> zones</span></div></div>
            <div className="map-frame"><MapView scoredZones={scoredZones} selectedId={selectedId} onSelect={selectZone} /><div className="map-overlay-note"><span className="map-location-pulse" /> Scenario: <strong>{scenarioMeta[scenario].shortLabel}</strong> · scores recalculate live</div></div>
            <div className="map-footer"><div className="legend"><strong>Risk level</strong><span><i className="legend-dot low" />Low</span><span><i className="legend-dot watch" />Watch</span><span><i className="legend-dot high" />High</span><span><i className="legend-dot severe" />Severe</span></div><div className="map-foot-note"><Target size={14} /> Click a zone or priority card to inspect</div></div>
          </div>
        </div>
        <aside className="priority-column">
          <div className="priority-heading"><div><span className="section-eyebrow"><AlertOctagon size={14} /> Decision queue</span><h2>Priority Hotspots</h2></div><span className="priority-count">TOP 3</span></div>
          <p className="priority-intro">Ranked by flood risk, exposed residents, and critical-asset importance.</p>
          <div className="hotspot-list">{topThree.map((zone, index) => <HotspotCard key={zone.zone_id} zone={zone} rank={index + 1} onSelect={selectZone} />)}</div>
          <div className="formula-note"><span>DEMO SCORING LOGIC</span><p><strong>Flood risk</strong> = rainfall severity + low elevation + drain proximity + historical waterlogging</p><p><strong>Priority</strong> = flood risk + population exposure + critical asset importance</p></div>
        </aside>
      </section>

      <ActionCard key={`${selectedZone.zone_id}-${scenario}`} zone={selectedZone} prepared={prepared} onPrepared={onPrepared} />

      <section className="bottom-disclaimer"><ShieldCheck size={17} /><div><strong>Use this as decision support, not an official warning.</strong><span>Predictions are demo estimates for the fictional pilot area. Validate with local authorities before any field action.</span></div><button onClick={() => navigate('methodology')}>View methodology <ArrowRight size={15} /></button></section>
    </div>
  );
}

function Methodology({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <div className="page-wrap content-page">
      <section className="page-heading simple-heading"><div><div className="eyebrow-line"><span className="eyebrow-dot" /> TRANSPARENT BY DESIGN</div><h1>Methodology</h1><p>FloodFirst keeps the demo model explainable so an officer can see why a zone moves up the queue.</p></div><div className="method-icon"><BookOpen size={24} /></div></section>
      <div className="method-grid">
        <section className="content-card"><div className="content-card-icon"><CloudRain size={20} /></div><h2>Relative inundation risk, not exact depth</h2><p>This prototype estimates <strong>relative inundation risk</strong> across 12 local zones. It does not predict exact flood depth, water velocity, or a certified evacuation boundary.</p><div className="method-flow"><div><span>01</span><strong>Inputs</strong><small>Four interpretable signals</small></div><ArrowRight size={16} /><div><span>02</span><strong>Flood risk</strong><small>0–100 scenario score</small></div><ArrowRight size={16} /><div><span>03</span><strong>Action queue</strong><small>Top three first</small></div></div></section>
        <section className="content-card"><div className="content-card-icon blue"><Target size={20} /></div><h2>Risk model inputs</h2><ul className="method-list"><li><span className="method-number">01</span><div><strong>Forecast rainfall</strong><p>Scenario severity adds pressure to every zone.</p></div></li><li><span className="method-number">02</span><div><strong>Low elevation</strong><p>Basins and underpasses receive a higher factor.</p></div></li><li><span className="method-number">03</span><div><strong>Drain proximity</strong><p>Near-canal and constrained drain locations respond faster.</p></div></li><li><span className="method-number">04</span><div><strong>Historical waterlogging</strong><p>Known local hotspots retain a higher baseline.</p></div></li></ul></section>
        <section className="content-card"><div className="content-card-icon orange"><Users size={20} /></div><h2>Priority model inputs</h2><p>Priority adds response consequence to the flood risk score so that a hospital access road can move ahead of a similar residential pocket.</p><div className="equation"><span>Flood risk</span><b>+</b><span>Population exposure</span><b>+</b><span>Critical-asset importance</span><strong>= Priority score</strong></div><p className="small-copy">All scores are deterministic demo calculations from the embedded pilot dataset. Change the rainfall scenario to see the queue respond.</p></section>
        <section className="content-card disclaimer-card"><div className="content-card-icon red"><AlertOctagon size={20} /></div><h2>Required disclaimer</h2><blockquote>This is a hackathon decision-support prototype. It is not an official weather or evacuation warning. Production deployment requires validation with local authorities, official meteorological data, live drainage/water-level observations, and field verification.</blockquote><button className="secondary-button" onClick={() => navigate('dashboard')}>Return to dashboard <ArrowRight size={16} /></button></section>
      </div>
    </div>
  );
}

function About({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <div className="page-wrap content-page about-page">
      <section className="page-heading simple-heading"><div><div className="eyebrow-line"><span className="eyebrow-dot" /> PURPOSE & NEXT STEPS</div><h1>About FloodFirst</h1><p>A focused early-action desk for the first decision that matters during intense local rainfall.</p></div><div className="method-icon"><ShieldCheck size={24} /></div></section>
      <section className="mission-card"><div className="mission-mark"><Droplets size={28} /></div><div><span className="section-eyebrow">The objective</span><h2>From broad rainfall alerts to the next local action.</h2><p>Municipal disaster-control teams rarely need another generic weather screen. They need to know which small area is likely to become difficult first, what is exposed there, and what to do before access is cut off.</p><p>FloodFirst turns scenario rainfall, terrain, drains, and local history into a transparent queue for one fictional pilot area: Gummidipundi Ward Cluster, Tamil Nadu.</p><strong className="mission-quote">“FloodFirst helps disaster-control teams move from broad rainfall alerts to local, prioritized action before people are trapped.”</strong></div></section>
      <section className="roadmap-section"><div className="roadmap-heading"><div><span className="section-eyebrow"><RadioTower size={14} /> Responsible roadmap</span><h2>What production validation would add</h2></div><button className="secondary-button" onClick={() => navigate('dashboard')}>Open live demo <ArrowRight size={16} /></button></div><div className="roadmap"><div className="roadmap-step"><span>02</span><div><strong>Official IMD nowcast integration</strong><p>Replace scenario buttons with validated official weather inputs.</p></div></div><div className="roadmap-step"><span>03</span><div><strong>Live rain-gauge and water-level sensors</strong><p>Ground the relative estimates in real observations.</p></div></div><div className="roadmap-step"><span>04</span><div><strong>Field-worker validation + authorized alerts</strong><p>Close the loop with verified reports and approved public delivery.</p></div></div></div></section>
      <div className="about-footer-note"><CheckCircle2 size={17} /><span>Demo mode is intentionally offline: no messages are sent, no accounts are required, and no official warning is implied.</span></div>
    </div>
  );
}

export default App;
