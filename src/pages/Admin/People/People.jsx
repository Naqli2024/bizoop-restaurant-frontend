import { CreditCard, Play } from 'lucide-react';
import '../../../assets/styles/people.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import StaffAdmin from '../../Admin/People/StaffAdmin';

const METRICS = [
    { label: "Labour cost", value: "11.9%", hint: "target 12%", tone: "good" },
    { label: "Dinner footfall", value: "+7%", hint: "forecast" },
    { label: "Recommended", value: "+1 captain, +1 helper", hint: "7–10 PM" },
    { label: "Payroll vs budget", value: "+₹46,000", hint: "illustrative", tone: "bad" },
];

const INSIGHTS = [
    "HR AI: Friday staffing is 2 people below forecast requirement.",
    "Kitchen labour up 18% while sales up 4% — review overtime.",
];


const WORKSPACES = [
    { label: "Employee onboarding", hub: "back-office", tab: "staff" },
    { label: "Staff & pay", hub: "back-office", tab: "staff", icon: <CreditCard size={14} /> },
];

export default function People() {
    const navigate = useNavigate()
    const [showStaff, setShowStaff] = useState(false);
    return (
        <>
            {showStaff ? (<StaffAdmin onBack={() => setShowStaff(false)} />) : (
                <section className="people-panel">
                    <header className="people-header">
                        <h1 className="people-header__title">
                            07 People
                            <span className="people-header__badge">Roster, payroll and productivity</span>
                        </h1>
                    </header>

                    <div className="people-scroll">
                        <div className="people-metrics">
                            {METRICS.map(({ label, value, hint, tone }) => (
                                <div
                                    key={label}
                                    className={`metric-tile${tone ? ` metric-tile--${tone}` : ""}`}
                                >
                                    <div className="metric-tile__label">{label}</div>
                                    <div className="metric-tile__value">{value}</div>
                                    <div className="metric-tile__hint">{hint}</div>
                                </div>
                            ))}
                        </div>

                        <div className="people-body">
                            <section className="people-section">
                                <h2 className="people-section__title">✨ Ambient AI</h2>
                                {INSIGHTS.map((text) => (
                                    <div key={text} className="insight-row">
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </section>

                            <section className="people-section">
                                <h2 className="people-section__title">Open workspace</h2>
                                <div className="workspace-links">
                                    {WORKSPACES.map(({ label, hub, tab, icon }) => (
                                        <button
                                            key={label}
                                            type="button"
                                            className="workspace-link"
                                            onClick={() => navigate(`/${hub}/${tab}`)}
                                        >
                                            {icon}
                                            <span>{label}</span>
                                            <Play size={12} aria-hidden="true" />
                                        </button>
                                    ))}
                                    <button className='workspace-link' onClick={() => setShowStaff(true)}>
                                        staff
                                        <Play size={12} aria-hidden="true" />
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            )
            }
        </>

    );
}
