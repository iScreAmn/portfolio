"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import portfolioData from "../../data/portfolioData";
import { useAnalytics } from "../../analytics/AnalyticsProvider";
import { useLocale } from "../../context/LocaleContext";
import { setPendingScroll } from "../../utils/pendingScroll";
import "./ProjectPage.css";

const ProjectPage = ({ slug }) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { track } = useAnalytics();

  const project = portfolioData.find((item) => item.slug === slug);
  const gallery = project?.gallery?.length ? project.gallery : project ? [project.imgSrc] : [];
  const totalImages = Math.max(gallery.length, 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const thumbItems = useCallback(() => {
    if (!project || !gallery.length) return [];
    const thumbs = [];
    for (let i = 0; i < 4; i++) {
      const targetIndex = i % gallery.length;
      const src = gallery[targetIndex];
      thumbs.push({ src, targetIndex, key: `${project.slug}-thumb-${i}` });
    }
    return thumbs;
  }, [gallery, project]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentIndex(0);
    if (project) {
      track("project", "view", project.slug);
    }
  }, [slug]);

  const openModalAt = (index) => {
    if (!isModalOpen && project) {
      track("project", "gallery", project.slug);
    }
    setCurrentIndex(index);
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove("no-scroll");
  };

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isModalOpen, showNext, showPrev]);

  if (!project) {
    return (
      <div className="project-page project-page--not-found">
        <div className="project-hero__container">
          <div className="project-hero__content">
            <div className="project-hero__eyebrow">Project not found</div>
            <h1 className="project-hero__title">Oops, this page is missing</h1>
            <p className="project-hero__subtitle">
              Looks like this case has not landed in the portfolio yet. Go back
              to the grid and pick another project.
            </p>
            <div className="project-hero__actions">
              <button
                className="project-hero__btn project-hero__btn--primary"
                onClick={() => router.push("/portfolio")}
              >
                All projects
              </button>
              <button
                className="project-hero__btn project-hero__btn--ghost"
                onClick={() => {
                  setPendingScroll("contact");
                  router.push("/");
                }}
              >
                Contact me
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const metaChips = [
    project.category,
    project.year && `Year: ${project.year}`,
    ...(project.tags || []),
  ].filter(Boolean);

  const projectEyebrow =
    locale === "ru" ? project.categoryRu || project.category : project.category;
  const projectDescription =
    locale === "ru" ? project.descriptionRu || project.description : project.description;
  const galleryButtonLabel = locale === "ru" ? "Открыть галерею" : "View gallery";
  const projectLinkButtonLabel = locale === "ru" ? "Открыть сайт" : "View Page";
  const inDevelopmentLabel = locale === "ru" ? "В разработке" : "In development";

  return (
    <div className="project-page">
      <section className="project-hero">
        <div className="project-hero__container">
          <div className="project-hero__content">
            <div className="project-hero__eyebrow">
              {projectEyebrow || "Project"}
            </div>
            <h1 className="project-hero__title">{project.title}</h1>
            <p className="project-hero__subtitle">{projectDescription}</p>

            <div className="project-hero__meta">
              {metaChips.map((chip) => (
                <span className="project-hero__chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>

            <div className="project-hero__actions">
              <button
                className="project-hero__btn project-hero__btn--primary"
                onClick={() => openModalAt(0)}
              >
                {galleryButtonLabel}
              </button>
              {project.inDevelopment ? (
                <span className="project-hero__btn-wrap project-hero__btn-wrap--disabled">
                  <button
                    type="button"
                    className="project-hero__btn project-hero__btn--ghost project-hero__btn--disabled"
                    disabled
                    aria-disabled="true"
                  >
                    {inDevelopmentLabel}
                  </button>
                </span>
              ) : project.href ? (
                <a
                  className="project-hero__btn project-hero__btn--ghost"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("project", "live_link", project.slug)}
                >
                  {projectLinkButtonLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section id="project-gallery" className="project-gallery">
        <div className="project-gallery__container">
          <div className="project-gallery__layout">
            <div className="project-gallery__main-img">
              <Image
                src={project.imgSrc}
                alt={`${project.title} main screenshot`}
                sizes="(max-width: 1024px) 100vw, 66vw"
                placeholder="blur"
              />
            </div>

            <div className="project-gallery__thumbnails">
              {[0, 1].map((row) => (
                <div className="project-gallery__thumbs-row" key={`row-${row}`}>
                  {thumbItems()
                    .slice(row * 2, row * 2 + 2)
                    .map((thumb) => (
                      <button
                        type="button"
                        key={thumb.key}
                        className={`project-gallery__thumb ${
                          currentIndex === thumb.targetIndex
                            ? "project-gallery__thumb--active"
                            : ""
                        }`}
                        onClick={() => openModalAt(thumb.targetIndex)}
                        aria-label={`Open image ${thumb.targetIndex + 1}`}
                      >
                        <Image
                          src={thumb.src}
                          alt={`${project.title} thumbnail ${thumb.targetIndex + 1}`}
                          sizes="(max-width: 1024px) 50vw, 17vw"
                        />
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="gallery-modal">
          <div className="gallery-modal__overlay" onClick={closeModal}></div>
          <div className="gallery-modal__content">
            <button
              type="button"
              className="gallery-modal__close"
              onClick={closeModal}
              aria-label="Close gallery"
            >
              <IoIosClose />
            </button>

            <div className="gallery-modal__slide">
              <Image
                src={gallery[currentIndex]}
                alt={`${project.title} full ${currentIndex + 1}`}
                sizes="100vw"
                priority
              />

              <button
                type="button"
                className="gallery-modal__nav-prev"
                onClick={showPrev}
                aria-label="Previous image"
              >
                <MdKeyboardArrowLeft />
              </button>

              <button
                type="button"
                className="gallery-modal__nav-next"
                onClick={showNext}
                aria-label="Next image"
              >
                <MdKeyboardArrowRight />
              </button>
            </div>

            <div className="gallery-modal__thumbnails">
              {gallery.map((image, idx) => (
                <button
                  type="button"
                  key={`${project.slug}-modal-thumb-${idx}`}
                  className={`project-gallery__thumb ${
                    currentIndex === idx ? "project-gallery__thumb--active" : ""
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Open image ${idx + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${project.title} thumbnail ${idx + 1}`}
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;

