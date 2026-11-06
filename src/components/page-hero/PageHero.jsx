import "./PageHero.css";

const PageHero = ({ eyebrow, title }) => {
  const titleSplit = title.lastIndexOf(" ");
  const titleHead = title.slice(0, titleSplit + 1);
  const titleAccent = title.slice(titleSplit + 1);

  return (
    <section className="page-hero">
      <div className="page-hero__container">
        <div className="page-hero__content">
          <div className="page-hero__eyebrow">
            <span className="page-hero__eyebrow-dot" aria-hidden="true" />
            {eyebrow}
          </div>
          <h1 className="page-hero__title">
            {titleHead}
            <span className="page-hero__title-accent">
              {titleAccent}
              <svg
                className="page-hero__title-scribble"
                viewBox="0 0 300 24"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M3 17 C 60 5, 120 5, 170 12 S 260 20, 297 7" />
              </svg>
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
