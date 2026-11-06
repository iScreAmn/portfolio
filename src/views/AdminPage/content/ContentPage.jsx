"use client";

import AboutHeroEditor from './AboutHeroEditor';
import adminData from '../../../data/adminData';
import '../crm/Crm.css';
import './Content.css';

const text = adminData.content;

const ContentPage = () => (
  <div className="content-page">
    <header className="content-page__header">
      <h1 className="content-page__title">{text.title}</h1>
      <p className="content-page__subtitle">{text.subtitle}</p>
    </header>

    <AboutHeroEditor />
  </div>
);

export default ContentPage;
