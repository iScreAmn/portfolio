"use client";

import "./Clients.css";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SectionTitle from "../section-title/SectionTitle";
import { motion } from "motion/react";
import Image from "next/image";
import ReviewModal from "../review-modal/ReviewModal";
import { useState } from "react";
import { useLocale } from "../../context/LocaleContext";
import { logo } from "../../assets/images";

/**
 * Монограмма компании — фолбэк, когда логотипа клиента нет в ассетах.
 * Из двух слов берём по первой букве, из одного — первые две, чтобы чип
 * не выглядел пустым с единственным символом.
 */
const companyInitials = (company = "") => {
  const words = company.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const Clients = () => {
  const { clientsData, clientsSectionData } = useLocaleHomeData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { locale } = useLocale();

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
              {clientsData.map((client) => (
                <SwiperSlide key={client.id}>
                  <figure className="review-slide">
                    <blockquote className="review-text">
                      {client.description}
                    </blockquote>
                    <figcaption className="review-author">
                      <div className="review-avatar">
                        <Image
                          src={client.imgSrc}
                          alt={client.name}
                          sizes="64px"
                        />
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
                            sizes="110px"
                          />
                        ) : (
                          <span
                            className="review-company-initials"
                            aria-label={client.company}
                          >
                            {companyInitials(client.company)}
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
            className="reviews-cta-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="reviews-cta-content">
              <h3 className="reviews-cta-title">
                {clientsSectionData.ctaTitle}
              </h3>
              <p className="reviews-cta-text">{clientsSectionData.ctaText}</p>
              <button
                type="button"
                className="reviews-cta-btn"
                onClick={() => setIsModalOpen(true)}
              >
                {clientsSectionData.addReviewButton}
              </button>
            </div>
            <Image
              src={logo}
              alt=""
              aria-hidden
              className="reviews-cta-decoration"
              sizes="300px"
            />
          </motion.div>
        </div>
      </div>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
      />
    </section>
  );
};

export default Clients;
