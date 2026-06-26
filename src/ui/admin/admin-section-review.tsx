export type AdminSectionReviewItem = {
  label: string;
  value: string;
};

export type AdminSectionReviewModel = {
  title: string;
  eyebrow: string;
  summary: string;
  reviewStatus: string;
  currentlyVisible: readonly AdminSectionReviewItem[];
  intentionallyDisabled: readonly AdminSectionReviewItem[];
  futureReviewQuestions: readonly string[];
};

export function AdminSectionReview({
  section
}: Readonly<{ section: AdminSectionReviewModel }>) {
  return (
    <section className="section-review" aria-labelledby="section-review-title">
      <div className="section-review__header">
        <div>
          <p className="review-hero__eyebrow">{section.eyebrow}</p>
          <h1 id="section-review-title">{section.title}</h1>
          <p>{section.summary}</p>
        </div>
        <span>{section.reviewStatus}</span>
      </div>
      <div className="section-review__grid">
        <article className="section-review-card">
          <h2>Currently visible</h2>
          <dl>
            {section.currentlyVisible.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </article>
        <article className="section-review-card">
          <h2>Intentionally disabled</h2>
          <dl>
            {section.intentionallyDisabled.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
      <article className="section-review-card">
        <h2>Review questions</h2>
        <ul>
          {section.futureReviewQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
