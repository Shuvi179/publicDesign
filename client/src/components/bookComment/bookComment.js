import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useForm } from "react-hook-form";

import useAuth from "../../hooks/useAuth";
import Spinner from "../shared/spinner";
import { getComments, setComments } from "../../apiServices/apiBooks";

import styles from "./bookComment.module.scss";

const BookComment = ({ bookId, defaultChecked, onSubmitComment }) => {
  const { userData } = useAuth();
  const isAuthorized = Boolean(userData);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [bookComments, setBookComments] = useState([]);
  const [maxPage, setMaxPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [isShowForm, setIsShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const getBookComments = async (id, page = 1) => {
    const res = await getComments(id, page);
    if (res) {
      setBookComments((prev) => {
        return [
          ...prev,
          ...res.comments
        ]
      });
      setMaxPage(res?.numberOfPages || 1);
    }
    if (isLoadingMore) setIsLoadingMore(false);
    setIsLoading(false);
  };
  const onSubmit = async (data) => {
    const res = await setComments(bookId, {
      text: data.text,
      rating: +data.rating
    });
    if (res) {
      onSubmitComment(+data.rating);
      setBookComments([]);
      setIsLoading(true);
      setIsShowForm(false);
      getBookComments(bookId);
      reset({ text: '', rating: '' });
    }
  };

  const ratingComment = (rtg = 0) => {
    let items = '';
    for (let i = 0; i < rtg; i++) {
      items += `
        <div class="book-comment-rating-item">
          <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0457 4.20009L8.23165 3.64517L6.52626 0.185715C6.40463 -0.061905 5.95072 -0.061905 5.82909 0.185715L4.12394 3.64517L0.309656 4.20009C0.0128357 4.24357 -0.104686 4.60956 0.109604 4.81805L2.86885 7.51097L2.21705 11.3135C2.16686 11.6065 2.47478 11.8355 2.7424 11.6954L6.20195 9.90023L9.613 11.6954C9.87917 11.8355 10.1888 11.6065 10.1383 11.3135L9.48655 7.51097L12.246 4.81805C12.46 4.60956 12.3425 4.24357 12.0457 4.20009Z" fill="#1C1C1E" />
          </svg>
        </div>
      `
    }
    return items;
  };

  useEffect(() => {
    reset({ rating: '' });
  }, [defaultChecked]);

  useEffect(() => {
    getBookComments(bookId, activePage);
  }, [bookId, activePage]);

  const onLoadingMore = () => {
    setActivePage(activePage + 1);
    setIsLoadingMore(true);
  };

  return (
    <div className={classNames(styles["book-comment"], "book-comment")}>
      <div className={styles["book-comment-top"]}>
        <div className={styles["book-comment-title"]}>Отзывы</div>
        {isAuthorized && <button className={classNames(styles["book-comment-btn"], "book-button-arrow", { "active": isShowForm })} onClick={() => setIsShowForm(!isShowForm)}>Оставить отзыв</button>}
      </div>
      { isShowForm && (
        <form className={classNames(styles["book-comment-form"], "fadeIn")} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles["book-comment-form-title"]}>Оставить отзыв</div>
          <div className={styles["book-comment-block"]}>
            <div className={styles["book-comment-img"]}>
              <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M14.7374 5.97096C14.7374 3.20843 12.4792 0.950195 9.71667 0.950195C6.95413 0.950195 4.6959 3.20843 4.6959 5.97096C4.6959 8.7335 6.95413 10.9917 9.71667 10.9917C12.4792 10.9917 14.7374 8.7335 14.7374 5.97096ZM1.10173 15.0044C1.23329 14.6755 1.40867 14.3686 1.60599 14.0835C2.61454 12.5926 4.17116 11.606 5.92514 11.3649C6.14437 11.3429 6.38554 11.3868 6.56096 11.5183C7.4818 12.198 8.57802 12.5488 9.71813 12.5488C10.8582 12.5488 11.9545 12.198 12.8753 11.5183C13.0507 11.3868 13.2919 11.321 13.5111 11.3649C15.2651 11.606 16.8437 12.5926 17.8303 14.0835C18.021 14.359 18.1912 14.6754 18.3211 14.9734C18.6025 15.3902 18.7559 15.873 18.7559 16.4299C18.7559 19.3856 14.4372 21.7817 9.58139 21.7817C4.72559 21.7817 0.789192 19.3856 0.789192 16.4299C0.789192 15.9678 0.885403 15.5568 1.0663 15.1922C1.0602 15.1278 1.07201 15.0638 1.10173 15.0044Z" fill="#8A8A8E" />
              </svg>
            </div>
            <div className={styles["book-comment-inner"]}>
              <div className={styles["book-comment-info"]}>
                <div className={styles["book-comment-name"]}>{ userData?.name }</div>
                <div className={styles["book-comment-set-rating"]}>
                  <input type="radio" id="star-5" name="rating" {...register('rating', { required: true })} value="5" defaultChecked={defaultChecked === 5} />
                  <label htmlFor="star-5" title="5"></label>
                  <input type="radio" id="star-4" name="rating" {...register('rating', { required: true })} value="4" defaultChecked={defaultChecked === 4} />
                  <label htmlFor="star-4" title="4"></label>    
                  <input type="radio" id="star-3" name="rating" {...register('rating', { required: true })} value="3" defaultChecked={defaultChecked === 3} />
                  <label htmlFor="star-3" title="3"></label>  
                  <input type="radio" id="star-2" name="rating" {...register('rating', { required: true })} value="2" defaultChecked={defaultChecked === 2} />
                  <label htmlFor="star-2" title="2"></label>    
                  <input type="radio" id="star-1" name="rating" {...register('rating', { required: true })} value="1" defaultChecked={defaultChecked === 1} />
                  <label htmlFor="star-1" title="1"></label>
                </div>
              </div>
              <div className={styles["book-comment-subtitle"]}>Отзыв</div>
              <textarea {...register('text', { required: true })} className={styles["book-comment-form-message"]}></textarea>
            </div>
          </div>
          <button className={styles["book-comment-form-btn"]} type="submit">Опубликовать</button>
        </form>
      ) }
      { isLoading ? (
        <Spinner />
      ) : (
        <>
          { bookComments && bookComments.length ? bookComments.map((item, index) => {
            return (
              <div className={classNames(styles["book-comment-block"], "fadeIn")} key={`book-comment${index}`}>
                <div className={styles["book-comment-img"]}>
                  <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.7374 5.97096C14.7374 3.20843 12.4792 0.950195 9.71667 0.950195C6.95413 0.950195 4.6959 3.20843 4.6959 5.97096C4.6959 8.7335 6.95413 10.9917 9.71667 10.9917C12.4792 10.9917 14.7374 8.7335 14.7374 5.97096ZM1.10173 15.0044C1.23329 14.6755 1.40867 14.3686 1.60599 14.0835C2.61454 12.5926 4.17116 11.606 5.92514 11.3649C6.14437 11.3429 6.38554 11.3868 6.56096 11.5183C7.4818 12.198 8.57802 12.5488 9.71813 12.5488C10.8582 12.5488 11.9545 12.198 12.8753 11.5183C13.0507 11.3868 13.2919 11.321 13.5111 11.3649C15.2651 11.606 16.8437 12.5926 17.8303 14.0835C18.021 14.359 18.1912 14.6754 18.3211 14.9734C18.6025 15.3902 18.7559 15.873 18.7559 16.4299C18.7559 19.3856 14.4372 21.7817 9.58139 21.7817C4.72559 21.7817 0.789192 19.3856 0.789192 16.4299C0.789192 15.9678 0.885403 15.5568 1.0663 15.1922C1.0602 15.1278 1.07201 15.0638 1.10173 15.0044Z" fill="#8A8A8E" />
                  </svg>
                </div>
                <div className={styles["book-comment-inner"]}>
                  <div className={styles["book-comment-info"]}>
                    <div className={styles["book-comment-name"]}>{ item.name }</div>
                    <div className={styles["book-comment-rating"]} dangerouslySetInnerHTML={{ __html: ratingComment(item.rating) }}></div>
                    <div className={styles["book-comment-date"]}>{ item.date }</div>
                  </div>
                  <div className={styles["book-comment-text"]}>{ item.text }</div>
                </div>
              </div>
            )
          }) : <p className={classNames(styles["book-comment-description"], "book-description")}>Оставь свой отзыв, будь первым!</p> }
          { isLoadingMore ? <Spinner /> : (
            <>
              { activePage < maxPage ? <button className={styles["book-comment-btn-more"]} onClick={() => onLoadingMore()}>Показать больше</button> : null }
            </>
          ) }
        </>
      )}
     
    </div>
  )
};

BookComment.defaultProps = {
  onSubmitComment: () => {},
  defaultChecked: 5
};

BookComment.propTypes = {
  bookId: PropTypes.any,
  defaultChecked: PropTypes.number,
  onSubmitComment: PropTypes.func
};

export default BookComment;