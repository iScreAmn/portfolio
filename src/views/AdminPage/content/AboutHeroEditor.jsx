"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { aboutImg } from '../../../assets/images';
import { getSiteContent, saveSiteContent, contentImageUrl } from '../../../lib/siteContent';
import { ABOUT_HERO_KEY, aboutHeroDefaults } from '../../../utils/aboutHeroContent';
import { resizeImage, ImageTooLargeError } from '../../../utils/resizeImage';
import adminData from '../../../data/adminData';

const text = adminData.content;
const hero = text.aboutHero;

const IMAGE_SIZES = [1400, 1200, 1000, 800];
const IMAGE_MAX_LENGTH = 850_000;
const LINK_PATTERN = /^(https?:\/\/\S+|mailto:\S+|tel:\S+|\/\S*)$/;

const toForm = (content) => {
  const defaults = aboutHeroDefaults();
  return {
    links: { ...defaults.links, ...content?.links },
    ...Object.fromEntries(
      hero.locales.map(({ key }) => [key, { ...defaults[key], ...content?.[key] }]),
    ),
  };
};

const toImage = (content) =>
  content?.image
    ? { kind: 'saved', src: contentImageUrl(content.image) }
    : { kind: 'default', src: aboutImg.src };

const trimAll = (group) =>
  Object.fromEntries(Object.entries(group).map(([key, value]) => [key, value.trim()]));

const validate = (form) => {
  for (const { key: locale, label: localeLabel } of hero.locales) {
    const missing = hero.fields.find((field) => field.required && !form[locale][field.key].trim());
    if (missing) return { message: hero.requiredError(missing.label, localeLabel), locale };
  }
  for (const link of hero.links) {
    const value = form.links[link.key].trim();
    if (!value) return { message: hero.linkRequired(link.label) };
    if (!LINK_PATTERN.test(value)) return { message: hero.linkInvalid(link.label) };
  }
  return null;
};

const formatDate = (value) =>
  new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

const AboutHeroEditor = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [form, setForm] = useState(() => toForm(null));
  const [image, setImage] = useState(() => toImage(null));
  const [locale, setLocale] = useState(hero.locales[0].key);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const applyContent = useCallback((next) => {
    setContent(next);
    setForm(toForm(next));
    setImage(toImage(next));
  }, []);

  const fetchContent = useCallback(
    () =>
      getSiteContent(ABOUT_HERO_KEY)
        .then(applyContent)
        .catch((err) => setLoadError(err?.message || text.loadFailed))
        .finally(() => setLoading(false)),
    [applyContent],
  );

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const retry = () => {
    setLoading(true);
    setLoadError(null);
    fetchContent();
  };

  const baseline = useMemo(() => JSON.stringify(toForm(content)), [content]);
  const dirty =
    JSON.stringify(form) !== baseline ||
    image.kind === 'new' ||
    (image.kind === 'default' && Boolean(content?.image));

  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = text.leaveConfirm;
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const updateText = (key, value) =>
    setForm((prev) => ({ ...prev, [locale]: { ...prev[locale], [key]: value } }));

  const updateLink = (key, value) =>
    setForm((prev) => ({ ...prev, links: { ...prev.links, [key]: value } }));

  const pickImage = async (file) => {
    setMessage(null);
    try {
      const src = await resizeImage(file, { sizes: IMAGE_SIZES, maxLength: IMAGE_MAX_LENGTH });
      setImage({ kind: 'new', src });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof ImageTooLargeError ? hero.imageTooLarge : hero.imageFailed,
      });
    }
  };

  const reset = () => {
    setForm(toForm(content));
    setImage(toImage(content));
    setMessage(null);
  };

  const save = async (event) => {
    event.preventDefault();

    const problem = validate(form);
    if (problem) {
      if (problem.locale) setLocale(problem.locale);
      setMessage({ type: 'error', text: problem.message });
      return;
    }

    const payload = {
      links: trimAll(form.links),
      ...Object.fromEntries(hero.locales.map(({ key }) => [key, trimAll(form[key])])),
    };
    if (image.kind === 'new') payload.image = image.src;
    if (image.kind === 'default') payload.image = null;

    setSaving(true);
    setMessage(null);
    try {
      applyContent(await saveSiteContent(ABOUT_HERO_KEY, payload));
      setMessage({ type: 'success', text: text.saved });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || text.saveFailed });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <section className="content-block content-block--state">{text.loading}</section>;
  }

  if (loadError) {
    return (
      <section className="content-block content-block--state">
        <p>
          {adminData.common.errorPrefix} {loadError}
        </p>
        <button type="button" className="crm-btn" onClick={retry}>
          {adminData.common.retry}
        </button>
      </section>
    );
  }

  return (
    <form className="content-block" onSubmit={save}>
      <header className="content-block__head">
        <div>
          <h2 className="content-block__title">{hero.title}</h2>
          <p className="content-block__meta">
            {content ? `${text.savedAt} ${formatDate(content.updatedAt)}` : text.defaultsHint}
          </p>
        </div>
        <a
          href={hero.path}
          target="_blank"
          rel="noreferrer"
          className="crm-btn content-block__open"
        >
          {text.openOnSite}
          <HiOutlineExternalLink aria-hidden />
        </a>
      </header>

      <div className="content-block__grid">
        <fieldset className="content-group content-group--image" disabled={saving}>
          <legend className="content-group__title">{hero.imageTitle}</legend>

          <div className="content-image">
            <img src={image.src} alt="" />
          </div>
          {image.kind === 'default' && <p className="content-group__hint">{hero.imageDefault}</p>}

          <div className="content-image__actions">
            <label
              htmlFor="about-hero-image"
              className={`crm-btn crm-btn--primary${saving ? ' is-disabled' : ''}`}
            >
              {image.kind === 'default' ? hero.upload : hero.replace}
            </label>
            <input
              id="about-hero-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="content-image__file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) pickImage(file);
              }}
            />
            {image.kind !== 'default' && (
              <button
                type="button"
                className="crm-btn"
                onClick={() => setImage({ kind: 'default', src: aboutImg.src })}
              >
                {hero.resetImage}
              </button>
            )}
          </div>
          <p className="content-group__hint">{hero.imageHint}</p>
        </fieldset>

        <div className="content-block__fields">
          <fieldset className="content-group" disabled={saving}>
            <div className="content-group__row">
              <legend className="content-group__title">{hero.textsTitle}</legend>
              <div className="content-locales" role="group" aria-label={hero.localeLabel}>
                {hero.locales.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`content-locales__btn${locale === item.key ? ' is-active' : ''}`}
                    aria-pressed={locale === item.key}
                    onClick={() => setLocale(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {hero.fields.map((field) => {
              const id = `about-hero-${locale}-${field.key}`;
              const value = form[locale][field.key];
              return (
                <div className="crm-field content-field" key={field.key}>
                  <label htmlFor={id} className="crm-field__label">
                    {field.label}
                    {field.required && <span className="content-field__req"> *</span>}
                  </label>
                  {field.rows ? (
                    <textarea
                      id={id}
                      className="crm-input crm-input--area"
                      rows={field.rows}
                      maxLength={field.max}
                      value={value}
                      lang={locale}
                      onChange={(event) => updateText(field.key, event.target.value)}
                    />
                  ) : (
                    <input
                      id={id}
                      className="crm-input"
                      maxLength={field.max}
                      value={value}
                      lang={locale}
                      onChange={(event) => updateText(field.key, event.target.value)}
                    />
                  )}
                  <span className="content-field__foot">
                    <span>{field.hint}</span>
                    <span>
                      {value.length}/{field.max}
                    </span>
                  </span>
                </div>
              );
            })}
          </fieldset>

          <fieldset className="content-group" disabled={saving}>
            <legend className="content-group__title">{hero.linksTitle}</legend>
            <p className="content-group__hint">{hero.linksHint}</p>

            {hero.links.map((link) => (
              <label className="crm-field content-field" key={link.key}>
                <span className="crm-field__label">{link.label}</span>
                <input
                  className="crm-input"
                  inputMode="url"
                  maxLength={500}
                  placeholder={link.placeholder}
                  value={form.links[link.key]}
                  onChange={(event) => updateLink(link.key, event.target.value)}
                />
              </label>
            ))}
          </fieldset>
        </div>
      </div>

      <footer className={`content-block__actions${dirty ? ' is-dirty' : ''}`}>
        <p
          className={`content-block__status${
            message ? ` content-block__status--${message.type}` : ''
          }`}
          role="status"
        >
          {message?.text || (dirty ? text.unsaved : '')}
        </p>
        <button type="button" className="crm-btn" onClick={reset} disabled={!dirty || saving}>
          {text.reset}
        </button>
        <button type="submit" className="crm-btn crm-btn--primary" disabled={!dirty || saving}>
          {saving ? text.saving : text.save}
        </button>
      </footer>
    </form>
  );
};

export default AboutHeroEditor;
