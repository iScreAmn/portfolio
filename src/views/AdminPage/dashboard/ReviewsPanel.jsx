"use client";

import { useCallback, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ReviewEditModal from './ReviewEditModal';
import ConfirmDeleteModal from '../crm/ConfirmDeleteModal';
import {
  getReviews,
  updateReview,
  approveReview,
  deleteReview,
} from '../../../lib/reviewsAdmin';
import { initials } from '../../../utils/initials';
import adminData from '../../../data/adminData';
import '../crm/Crm.css';

const { common } = adminData;
const text = adminData.overview.reviews;

const formatDate = (value) =>
  new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const ReviewSlide = ({ review, busy, onEdit, onDelete, onApprove }) => {
  const isPending = review.status === 'pending';
  const date = isPending ? review.createdAt : review.approvedAt;

  return (
    <figure className="dash-review">
      <blockquote className="dash-review__text">{review.text}</blockquote>

      <figcaption className="dash-review__author">
        <div className="dash-review__avatar">
          {review.photo ? (
            <img src={review.photo} alt={review.name} />
          ) : (
            <span aria-hidden>{initials(review.name)}</span>
          )}
        </div>
        <div className="dash-review__meta">
          <span className="dash-review__name">{review.name}</span>
          {review.company && <span className="dash-review__company">{review.company}</span>}
        </div>
        {(review.logo || review.company) && (
          <div className="dash-review__logo">
            {review.logo ? (
              <img src={review.logo} alt={review.company || ''} />
            ) : (
              <span aria-hidden>{initials(review.company)}</span>
            )}
          </div>
        )}
      </figcaption>

      <div className="dash-review__footer">
        {date && (
          <span className="dash-review__date">
            {isPending ? text.submittedAt : text.approvedAt} {formatDate(date)}
          </span>
        )}
        <div className="dash-review__actions">
          <button type="button" className="crm-btn" onClick={onEdit} disabled={busy}>
            {text.edit}
          </button>
          <button
            type="button"
            className="crm-btn dash-review__delete"
            onClick={onDelete}
            disabled={busy}
          >
            {text.delete}
          </button>
          {isPending && (
            <button
              type="button"
              className="crm-btn crm-btn--primary"
              onClick={onApprove}
              disabled={busy}
            >
              {busy ? text.approving : text.approve}
            </button>
          )}
        </div>
      </div>
    </figure>
  );
};

const ReviewsPanel = () => {
  const [status, setStatus] = useState('pending');
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setActionError(null);
    try {
      const data = await getReviews({ status });
      setItems(data.items || []);
      setCounts(data.counts || { pending: 0, approved: 0 });
    } catch (err) {
      setError(err?.message || text.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const removeFromList = (id, fromStatus) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setCounts((prev) => ({ ...prev, [fromStatus]: Math.max(0, prev[fromStatus] - 1) }));
  };

  const save = async (patch) => {
    const next = await updateReview(editing.id, patch);
    setItems((prev) => prev.map((item) => (item.id === next.id ? next : item)));
  };

  const approve = async (id) => {
    setActionError(null);
    setApprovingId(id);
    try {
      await approveReview(id);
      removeFromList(id, 'pending');
      setCounts((prev) => ({ ...prev, approved: prev.approved + 1 }));
    } catch (err) {
      setActionError(err?.message || text.approveFailed);
    } finally {
      setApprovingId(null);
    }
  };

  const confirmDelete = async () => {
    await deleteReview(deleting.id);
    removeFromList(deleting.id, deleting.status);
  };

  return (
    <section className="dash-card dash-reviews">
      <div className="dash-card__head">
        <h3 className="dash-card__title">{text.title}</h3>
        <div className="dash-reviews__tabs" role="tablist">
          {text.tabs.map((tab) => (
            <button
              key={tab.status}
              type="button"
              role="tab"
              aria-selected={status === tab.status}
              className={`crm-filter${status === tab.status ? ' is-active' : ''}`}
              onClick={() => setStatus(tab.status)}
            >
              {tab.label}
              <span className="crm-filter__count">{counts[tab.status] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="dash-card__empty">{text.loading}</p>
      ) : error ? (
        <p className="dash-card__error">
          {common.errorPrefix} {error}{' '}
          <button type="button" className="crm-btn" onClick={load}>
            {common.retry}
          </button>
        </p>
      ) : items.length === 0 ? (
        <p className="dash-card__empty">{text.empty[status]}</p>
      ) : (
        <>
          {/* key по вкладке: при переключении слайдер начинает с первого отзыва. */}
          <Swiper
            key={status}
            modules={[Pagination]}
            slidesPerView={1}
            spaceBetween={16}
            grabCursor
            autoHeight
            pagination={{ clickable: true }}
            className="dash-reviews__swiper"
          >
            {items.map((review) => (
              <SwiperSlide key={review.id}>
                <ReviewSlide
                  review={review}
                  busy={approvingId === review.id}
                  onEdit={() => setEditing(review)}
                  onDelete={() => setDeleting(review)}
                  onApprove={() => approve(review.id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {actionError && (
            <p className="dash-card__error dash-reviews__error">
              {common.errorPrefix} {actionError}
            </p>
          )}
        </>
      )}

      {editing && (
        <ReviewEditModal
          review={editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}

      {deleting && (
        <ConfirmDeleteModal
          client={deleting}
          text={text.deleteModal}
          onClose={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  );
};

export default ReviewsPanel;
