"use client";

import "./Clients.css";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SectionTitle from "../section-title/SectionTitle";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import ReviewForm from "../review-form/ReviewForm";
import ReviewSuccess from "../review-form/ReviewSuccess";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "../../context/LocaleContext";
import { logo } from "../../assets/images";
import { getPublishedReviews } from "../../lib/reviews";
import { initials } from "../../utils/initials";

const EASE_OUT = [0.22, 1, 0.36, 1];

const fromApi = (review) => ({
  id: `review-${review.id}`,
  imgSrc: review.photo,
  description: review.text,
  name: review.name,
  company: review.company || "",
  companyLogo: review.logo,
});

const Clients = () => {
  const { clientsData, clientsSectionData } = useLocaleHomeData();
  // Карточка рядом со слайдером: призыв → форма отзыва → благодарность.
  const [view, setView] = useState("cta");
  const returnFocus = useRef(false);
  const [published, setPublished] = useState([]);
  const [submittedReview, setSubmittedReview] = useState(null);
  const { locale } = useLocale();

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

  // После «Отмены» возвращаем фокус на кнопку, иначе он теряется вместе с формой.
  // Callback-ref, а не эффект: из-за mode="wait" кнопка монтируется позже смены view.
  const ctaButtonRef = (button) => {
    if (button && returnFocus.current) {
      returnFocus.current = false;
      button.focus({ preventScroll: true });
    }
  };

  const handleCancel = () => {
    returnFocus.current = true;
    setView("cta");
  };

  const reviews = useMemo(
    () => [...published, ...clientsData],
    [published, clientsData],
  );

  return (
    <section className="section our-client" id="clients">
      <div className="container flex-center">
        <SectionTitle
          title={clientsSectionData.sectionTitle}
          subtitle={clientsSectionData.sectionSubtitle}
        />
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
            {/* Логотип вне анимированных обёрток: их transform сместил бы
                абсолютное позиционирование. В форме он гаснет через CSS. */}
            {view !== "success" && (
              <Image
                src={logo}
                alt=""
                aria-hidden
                className="reviews-cta-decoration"
                sizes="300px"
              />
            )}
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
                  <div className="reviews-cta-content">
                    <h3 className="reviews-cta-title">
                      {clientsSectionData.ctaTitle}
                    </h3>
                    <p className="reviews-cta-text">{clientsSectionData.ctaText}</p>
                    <button
                      ref={ctaButtonRef}
                      type="button"
                      className="reviews-cta-btn"
                      onClick={() => setView("form")}
                    >
                      {clientsSectionData.addReviewButton}
                    </button>
                  </div>
                </motion.div>
              )}
              {view === "form" && (
                <motion.div
                  key="form"
                  className="reviews-cta-view"
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                >
                  <ReviewForm
                    locale={locale}
                    onCancel={handleCancel}
                    onSubmitted={(review) => {
                      setSubmittedReview(review);
                      setView("success");
                    }}
                  />
                </motion.div>
              )}
              {view === "success" && (
                <ReviewSuccess
                  key="success"
                  title={clientsSectionData.successTitle}
                  message={clientsSectionData.successMessage}
                  review={submittedReview}
                  origin="80% 92%"
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
