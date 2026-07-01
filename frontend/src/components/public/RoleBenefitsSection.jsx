import { SectionHeading } from './SectionHeading';

const studentBenefits = ['Browse published events', 'Register quickly', 'Track confirmed or waitlisted status', 'View personal registrations'];
const organizerBenefits = ['Create draft events', 'Preview and publish', 'Manage capacity', 'View registrations and waitlist'];

export function RoleBenefitsSection() {
  return (
    <section className="landing-section role-benefits-section" id="about">
      <SectionHeading eyebrow="Built for real event days" title="One platform, two clear experiences." />

      <div className="role-benefits-grid">
        <BenefitPanel title="For students" items={studentBenefits} />
        <BenefitPanel title="For organizers" items={organizerBenefits} accent />
      </div>
    </section>
  );
}

function BenefitPanel({ title, items, accent = false }) {
  return (
    <article className={`benefit-panel ${accent ? 'benefit-panel-accent' : ''}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
