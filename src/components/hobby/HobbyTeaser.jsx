"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { hobby1 } from "../../assets/images";
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";
import "./HobbyTeaser.css";

const HobbyTeaser = () => {
  const router = useRouter();
  const { hobbyTeaserData: t } = useLocaleHomeData();

  return (
    <section className="hobby-teaser section" id="hobby">
      <div className="container hobby-teaser__container">
        <div className="hobby-teaser__content">
          <span className="hobby-teaser__eyebrow">{t.eyebrow}</span>
          <h2 className="hobby-teaser__title">{t.title}</h2>
          <p className="hobby-teaser__text">{t.text}</p>
          <button
            type="button"
            className="hobby-teaser__btn"
            onClick={() => router.push("/hobby")}
          >
            {t.button}
          </button>
        </div>
        <div className="hobby-teaser__thumb">
          <Image
            src={hobby1}
            alt={t.imageAlt}
            sizes="(max-width: 1024px) 100vw, 50vw"
            placeholder="blur"
          />
        </div>
      </div>
    </section>
  );
};

export default HobbyTeaser;

