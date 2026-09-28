"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ModalCloseButton from "../../components/modal-close-button/ModalCloseButton";
import { IoIosArrowDown } from "react-icons/io";
import "./ServicesPage.css";
import ServicePackageForm, { contactMethodIcons } from "./ServicePackageForm";
import ServicePackageSuccess from "./ServicePackageSuccess";
import { useLocale } from "../../context/LocaleContext";
import * as englishServicesData from "../../data/english/services";
import * as russianServicesData from "../../data/russian/services";

const servicesDataByLocale = {
  en: englishServicesData,
  ru: russianServicesData,
};

const ServicesPage = () => {
  const { locale } = useLocale();
  const [selectedService, setSelectedService] = useState(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  // Заказ, принятый сервером: пока он есть, вместо формы в модалке сцена благодарности.
  const [order, setOrder] = useState(null);
  const [curtainOrigin, setCurtainOrigin] = useState(undefined);
  const contentRef = useRef(null);
  const {
    packages,
    heroData,
    uiTexts,
    supportCtaData,
  } = servicesDataByLocale[locale] ?? englishServicesData;

  const openModal = (pkg) => {
    setOrder(null);
    setSelectedService(pkg);
    document.body.classList.add("no-scroll");
  };

  const closeModal = () => {
    setSelectedService(null);
    setOrder(null);
    document.body.classList.remove("no-scroll");
  };

  const handleSuccess = (submittedOrder, submitRect) => {
    // Шторка благодарности раскрывается из центра кнопки, которой отправили заявку.
    const content = contentRef.current;
    const box = content?.getBoundingClientRect();
    if (box && submitRect) {
      const x = ((submitRect.left + submitRect.width / 2 - box.left) / box.width) * 100;
      const y = ((submitRect.top + submitRect.height / 2 - box.top) / box.height) * 100;
      setCurtainOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
    } else {
      setCurtainOrigin(undefined);
    }
    setOrder(submittedOrder);
    // Кнопка отправки исчезает вместе с формой — фокус остаётся внутри диалога.
    content?.scrollTo({ top: 0 });
    content?.focus({ preventScroll: true });
  };

  useEffect(() => {
    setSelectedService(null);
    setOrder(null);
    document.body.classList.remove("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [locale]);

  return (
    <div className="services-page">
      <div className="services-intro">
        <section className="services-hero">
          <div className="services-hero__container">
            <div className="services-hero__content">
              <div className="services-hero__eyebrow">{heroData.eyebrow}</div>
              <h1 className="services-hero__title">{heroData.title}</h1>
              <p className="services-hero__subtitle">
                {heroData.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="services-packages">
          <div className="services-packages__container">
            <div className="services-packages__grid">
              {packages.map((pkg) => (
                <article
                  className={`services-card services-card--${pkg.accent}`}
                  key={pkg.name}
                >
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    className="services-card__image"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                  />
                  <div className="services-card__header">
                    <span className="services-card__pill">{pkg.price}</span>
                    <h3 className="services-card__title">{pkg.name}</h3>
                  </div>
                  <ul className="services-card__list">
                    {pkg.items.map((item) => (
                      <li key={item} className="services-card__item">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="services-card__btn"
                    type="button"
                    onClick={() => openModal(pkg)}
                  >
                    {uiTexts.choosePlan}
                  </button>
                </article>
              ))}
            </div>

            <div className="services-support-cta">
              <div className="services-support-cta__content">
                <span className="services-support-cta__eyebrow">
                  {supportCtaData.eyebrow}
                </span>
                <h2 className="services-support-cta__title">
                  {supportCtaData.title}
                </h2>
                <p className="services-support-cta__text">
                  {supportCtaData.description}
                </p>

                <div
                  className={`services-support-cta__dropdown ${
                    isSupportOpen ? "is-open" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="services-support-cta__summary"
                    onClick={() => setIsSupportOpen((prev) => !prev)}
                    aria-expanded={isSupportOpen}
                    aria-controls="services-support-cta-panel"
                  >
                    <span>{supportCtaData.maintenance.title}</span>
                    <span className="services-support-cta__summary-actions">
                      <strong>{supportCtaData.maintenance.price}</strong>
                      <IoIosArrowDown
                        className="services-support-cta__summary-icon"
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  <div
                    id="services-support-cta-panel"
                    className="services-support-cta__dropdown-panel"
                  >
                    <div className="services-support-cta__dropdown-body">
                      <p className="services-support-cta__includes">
                        {supportCtaData.maintenance.includesLabel}
                      </p>
                      <ul className="services-support-cta__list">
                        {supportCtaData.maintenance.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="services-support-cta__media">
                <Image
                  src={supportCtaData.image}
                  alt={supportCtaData.imageAlt}
                  className="services-support-cta__image"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {selectedService && (
        <div className="services-modal">
          <div
            className="services-modal__overlay"
            onClick={closeModal}
            aria-hidden="true"
          />
          <div
            ref={contentRef}
            className={`services-modal__content${order ? " is-success" : ""}`}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            <ModalCloseButton onClick={closeModal} label={uiTexts.closeButton} />
            {order ? (
              <ServicePackageSuccess
                pkg={selectedService}
                order={order}
                texts={uiTexts.form}
                icon={contactMethodIcons[order.method]}
                origin={curtainOrigin}
              />
            ) : (
              <div className="services-modal__body">
                <div className="services-modal__info">
                  <span className="services-modal__pill">{selectedService.price}</span>
                  <h3 className="services-modal__title">{selectedService.name}</h3>
                  <p className="services-modal__description">
                    {selectedService.text}
                  </p>
                  <Image
                    src={selectedService.image}
                    alt=""
                    aria-hidden="true"
                    sizes="200px"
                    className="services-modal__image"
                  />
                </div>
                <ServicePackageForm
                  key={selectedService.accent}
                  pkg={selectedService}
                  uiTexts={uiTexts}
                  onSuccess={handleSuccess}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;

