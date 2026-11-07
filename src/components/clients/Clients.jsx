"use client";

import "./Clients.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SectionTitle from "../section-title/SectionTitle";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import ReviewForm from "../review-form/ReviewForm";
import ReviewSuccess from "../review-form/ReviewSuccess";
import ReviewFormModal from "../review-form/ReviewFormModal";
import PromoCta from "../promo-cta/PromoCta";
import { VscCodeReview } from "react-icons/vsc";
import { useEffect, useMemo, useRef, useState } from "react";
import { getPublishedReviews } from "../../lib/reviews";
import { initials } from "../../utils/initials";
import { useDictionary } from "../../i18n/useDictionary";

const EASE_OUT = [0.22, 1, 0.36, 1];

const MOBILE_QUERY = "(max-width: 768px)";

const SUCCESS_ORIGIN = { inline: "80% 92%", modal: "20% 70%" };

const fromApi = (review) => ({
  id: `review-${review.id}`,
  imgSrc: review.photo,
  description: review.text,
  name: review.name,
  company: review.company || "",
  companyLogo: review.logo,
});

const Clients = ({ hideTitle = false, className = "" }) => {
  const { clientsData, clientsSectionData } = useDictionary("home");
  const [view, setView] = useState("cta");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successOrigin, setSuccessOrigin] = useState(SUCCESS_ORIGIN.inline);
  const returnFocus = useRef(false);
  const ctaButton = useRef(null);
  const successTimer = useRef(null);
  const [published, setPublished] = useState([]);
  const [submittedReview, setSubmittedReview] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getPublishedReviews()
      .then((items) => {
        if (!cancelled && Array.isArray(items)) setPublished(items.map(fromApi));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => () => clearTimeout(successTimer.current), []);

  const ctaButtonRef = (button) => {
    ctaButton.current = button;
    if (button && returnFocus.current) {
      returnFocus.current = false;
      button.focus({ preventScroll: true });
    }
  };

  const handleCancel = () => {
    returnFocus.current = true;
    setView("cta");
  };

  const openForm = () => {
    if (window.matchMedia(MOBILE_QUERY).matches) setIsModalOpen(true);
    else setView("form");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    ctaButton.current?.focus({ preventScroll: true });
  };

  const showSuccess = (review, origin) => {
    setSubmittedReview(review);
    setSuccessOrigin(origin);
    setView("success");
  };

  const handleModalSubmitted = (review) => {
    setIsModalOpen(false);
    clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => showSuccess(review, SUCCESS_ORIGIN.modal), 350);
  };

  const reviews = useMemo(
    () => [...published, ...clientsData],
    [published, clientsData],
  );

  return (
    <section className={`section our-client ${className}`.trim()} id="clients">
      <div className="container flex-center">
        {!hideTitle && (
          <SectionTitle
            title={clientsSectionData.sectionTitle}
            subtitle={clientsSectionData.sectionSubtitle}
          />
        )}
        <div className="our-client-wrapper">
          <motion.div
            className="reviews-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="reviews-quote" aria-hidden>
              &ldquo;
            </span>
            <Swiper
              key={reviews.length}
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              grabCursor={true}
              autoHeight={false}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              onAutoplayTimeLeft={(swiper, _time, progress) =>
                swiper.el.style.setProperty("--autoplay-progress", 1 - progress)
              }
              className="reviews-swiper"
            >
              {reviews.map((client) => (
                <SwiperSlide key={client.id}>
                  <figure className="review-slide">
                    <blockquote className="review-text">
                      {client.description}
                    </blockquote>
                    <figcaption className="review-author">
                      <div className="review-avatar">
                        {client.imgSrc ? (
                          <Image
                            src={client.imgSrc}
                            alt={client.name}
                            width={64}
                            height={64}
                            sizes="64px"
                          />
                        ) : (
                          <span className="review-avatar-initials" aria-hidden>
                            {initials(client.name)}
                          </span>
                        )}
                      </div>
                      <div className="review-author-meta">
                        <h3 className="review-author-name">{client.name}</h3>
                        <span className="review-author-role">
                          {client.company}
                        </span>
                      </div>
                      <div className="review-company-logo">
                        {client.companyLogo ? (
                          <Image
                            src={client.companyLogo}
                            alt={client.company}
                            {...(typeof client.companyLogo === "string"
                              ? { width: 110, height: 30 }
                              : {})}
                            sizes="110px"
                          />
                        ) : (
                          <span
                            className="review-company-initials"
                            aria-label={client.company}
                          >
                            {initials(client.company)}
                          </span>
                        )}
                      </div>
                    </figcaption>
                  </figure>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          <motion.div
            className={`reviews-cta-card reviews-cta-card--${view}`}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {view === "cta" && (
                <motion.div
                  key="cta"
                  className="reviews-cta-view"
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                >
                  <PromoCta
                    title={clientsSectionData.ctaTitle}
                    text={clientsSectionData.ctaText}
                    buttonLabel={clientsSectionData.addReviewButton}
                    tapeIcon={<VscCodeReview />}
                    onOpen={openForm}
                    buttonRef={ctaButtonRef}
                  />
                </motion.div>
              )}
              {view === "form" && (
                <motion.div
                  key="form"
                  className="reviews-cta-view reviews-cta-view--form"
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                >
                  <ReviewForm
                    onCancel={handleCancel}
                    onSubmitted={(review) => showSuccess(review, SUCCESS_ORIGIN.inline)}
                  />
                </motion.div>
              )}
              {view === "success" && (
                <ReviewSuccess
                  key="success"
                  title={clientsSectionData.successTitle}
                  message={clientsSectionData.successMessage}
                  review={submittedReview}
                  origin={successOrigin}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmitted={handleModalSubmitted}
      />
    </section>
  );
};

export default Clients;
