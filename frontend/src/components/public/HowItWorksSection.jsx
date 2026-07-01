import { SectionHeading } from './SectionHeading';

const steps = [
  {
    number: '01',
    title: 'Discover events',
    text: 'Browse live activities with clear dates, places, status, and availability.',
  },
  {
    number: '02',
    title: 'Register or waitlist',
    text: 'Save your spot in seconds and see right away whether you are confirmed or on the waitlist.',
  },
  {
    number: '03',
    title: 'Stay updated',
    text: 'Track registrations, cancellations, and waitlist movement from your student account.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="landing-section" id="how-it-works">
      <SectionHeading eyebrow="How it works" title="Simple enough for students. Structured enough for organizers.">
        Attendly keeps discovery fast for students while organizers stay in control of every date, seat, and attendee list.
      </SectionHeading>

      <div className="steps-grid">
        {steps.map((step) => (
          <article className="step-card" key={step.number}>
            <span>{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
