"use client";

import "./Clients.css";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SectionTitle from "../section-title/SectionTitle";
import { motion } from "motion/react";
import { slideInVariants } from "../../utils/animation";
import ReviewModal from "../review-modal/ReviewModal";
import { useState } from "react";
import { useLocale } from "../../context/LocaleContext";

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
        <motion.div
          className="our-client-wrapper"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={slideInVariants("bottom", 0.7, 70, false)}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            className="client-swiper"
          >
            {clientsData.map((client) => (
              <SwiperSlide key={client.id}>
                <div className="swiper-slide swiper-client-block">
                  <div className="client-img">
                    <img src={client.imgSrc} alt={client.name} />
                  </div>
                  <div className="client-details">
                    <p>{client.description}</p>
                    <h3>{client.name}</h3>
                    <span>{client.position}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <motion.button
            className="add-review-btn"
            onClick={() => setIsModalOpen(true)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideInVariants("bottom", 0.9, 70, false)}
          >
            {clientsSectionData.addReviewButton}
          </motion.button>
        </motion.div>
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
