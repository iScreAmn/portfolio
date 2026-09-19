"use client";

import "./Services.css";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SectionTitle from "../section-title/SectionTitle";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";

const Services = () => {
  const { servicesSectionData } = useLocaleHomeData();
  const router = useRouter();
  const { slides } = servicesSectionData;

  return (
    <section className="services section" id="services">
      <div className="container flex-center">
        <SectionTitle
          title={servicesSectionData.sectionTitle}
          subtitle={servicesSectionData.sectionSubtitle}
        />
        <div className="services__wrapper">
          <motion.div
            className="services-slider"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              grabCursor={true}
              autoplay={{
                delay: 10000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              className="services-swiper"
            >
              {slides.map((slide) => {
                const ButtonIcon = slide.button.icon;

                return (
                  <SwiperSlide key={slide.id}>
                    <div className="services-app">
                      <div className="services-app-content">
                        {slide.eyebrow && <h4>{slide.eyebrow}</h4>}
                        <h3>{slide.subtitle}</h3>
                        <h2>{slide.title}</h2>
                        <button
                          type="button"
                          className="inner-info-link game-app"
                          onClick={() => router.push(slide.button.path)}
                        >
                          {slide.button.text} <ButtonIcon />
                        </button>
                      </div>
                      <div className="services-app-img">
                        <Image
                          src={slide.imageSrc}
                          alt={slide.imageAlt}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          placeholder="blur"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;
