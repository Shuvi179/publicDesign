import React, {useEffect, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {useTranslation} from 'react-i18next';

import {
  fetchPreSignedUrl,
  getHistoryBookAudio,
  getPageBook,
  getPageBookAudio,
  getRatingBook,
  getRatingVoteBook,
  saveBookAudio,
  setRatingVoteBook,
  toggleFavouriteBook
} from "../apiServices/apiBooks";
import {getDonateInformation} from "../apiServices/apiUser";

import useAuth from "../hooks/useAuth";
import Button from "../components/shared/button";
import Spinner from "../components/shared/spinner";
import BookComment from "../components/bookComment";
import BookAudioPlayer from "../components/bookAudioPlayer";
import ValidImage from "../components/shared/validImage";

import Popup from "../components/shared/popup";
import TextField from "../components/shared/textField";

const Book = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { location } = useHistory();
  const { userData } = useAuth();
  const isAuthorized = Boolean(userData);
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [userDonatInfo, setUserDonatInfo] = useState();
  const [showDonatPopup, setShowDonatPopup] = useState(false);
  const [isFavouriteLoading, setIsFavouriteLoading] = useState(false);
  const [bookRating, setBookRating] = useState(0);
  const [bookRatingVote, setBookRatingVote] = useState(5);
  const [openDescription, setOpenDescription] = useState(false);
  const [audio, setAudio] = useState([]);
  const [audioHistory, setAudioHistory] = useState();

  const getDataBook = async () => {
    const res = await getPageBook(slug);
    if (res) {
      setBook(res);
      setIsLoading(false);
      getRatings(res.id);
      getAudio(res.id, res.name);
      getDonatLink(res?.author?.id);
    }
  };

  const getDonatLink = async (id) => {
    const res = await getDonateInformation(id);
    if (res?.link) {
      setUserDonatInfo(res)
    };
  };

  const toggleOpenDonatPopup = () => {
    document.body.style.overflow = !showDonatPopup ? "hidden" : "";
    setShowDonatPopup(!showDonatPopup);
  };

  const getAudio = async (id, name) => {
    const res = await getPageBookAudio(id, name);
    const _audioHistory = await getHistoryBookAudio(id);
    if (res) {
      let _res = res;
      if (Boolean(_audioHistory)) {
        _res = _res.map(z => ({
          ...z,
          isActive: z.files.some(z => z.tome === _audioHistory.tome)
        }));
        setAudioHistory(_audioHistory);
      }
      setAudio(_res);
    }
  };

  const fetchAudioUrl = async (audioId) => {
      if (audioId) {
        return await fetchPreSignedUrl(book.id, audioId);
      }
      return undefined;
  };

  const getRatings = async (id) => {
    const res = await getRatingBook(id);
    if (res) setBookRating(parseFloat(res.toFixed(1)));
    if (isAuthorized) {
      const resVote = await getRatingVoteBook(id);
      if (resVote) setBookRatingVote(resVote);
    }
  };

  const setRatingVote = async (rating) => {
    const res = await setRatingVoteBook(book.id, rating);
    if (res) {
      setBookRating(res);
      setBookRatingVote(rating);
    }
  };

  const handleFavouriteBook = async () => {
    setIsFavouriteLoading(true);
    const res = await toggleFavouriteBook(book.id, !book.isFavourite);
    if (res) {
      setBook((prevBook) => {
        return {
          ...prevBook,
          isFavourite: !book.isFavourite
        }
      })
    }
    setIsFavouriteLoading(false);
  };

  const onSaveBookAudio = async (audioId, audioTime = 0) => {
    if (isAuthorized) {
      await saveBookAudio(book.id, audioId, audioTime);
    }
  };

  useEffect(() => {
    getDataBook();
  }, []);

  return (
    <div className="book-page page-full">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="wr fadeIn">
          <Link to={location?.state?.prevPage || "/books"} className="book-btn-back"></Link>
          <div className="book-top">
            <div className="book-image">
              <ValidImage src={book?.image} alt={book?.name} title={book?.name} />
            </div>
            <div className="book-info">
              <div className="book-genres">{book?.genres}</div>
              <h1 className="book-title">{book?.name}</h1>
              <div className="book-author">{book?.author?.name}</div>
              <div className="book-rating">
                <div className="book-rating-starts">
                  {/*{Array.from({ length: 5 }, (v, i) => (*/}
                    {/*<a*/}
                      {/*href="#"*/}
                      {/*className="book-rating-item"*/}
                      {/*key={i}*/}
                      {/*title={i + 1}*/}
                      {/*onClick={(e) => {*/}
                        {/*e.preventDefault();*/}
                        {/*if (isAuthorized) setRatingVote(i + 1);*/}
                      {/*}}*/}
                    {/*>*/}
                      {/*<svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*<path fill={bookRating - 1 < i ? "#F3F3F9" : "#1C1C1E"} d="M20.0708 6.79875L13.897 5.90051L11.1364 0.30062C10.9396 -0.100207 10.2048 -0.100207 10.0079 0.30062L7.24777 5.90051L1.07351 6.79875C0.593043 6.86914 0.402809 7.46158 0.749684 7.79906L5.21613 12.1581L4.16105 18.3133C4.0798 18.7877 4.57824 19.1584 5.01144 18.9316L10.6115 16.0257L16.133 18.9316C16.5639 19.1584 17.065 18.7877 16.9834 18.3133L15.9283 12.1581L20.3951 7.79906C20.7416 7.46158 20.5513 6.86914 20.0708 6.79875Z" />*/}
                      {/*</svg>*/}
                    {/*</a>*/}
                  {/*))}*/}
                  {Array.from({ length: 5 }, (v, i) => (
                    <div
                      className="book-rating-item"
                      key={i}
                    >
                      <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill={bookRating - 1 < i ? "#F3F3F9" : "#1C1C1E"} d="M20.0708 6.79875L13.897 5.90051L11.1364 0.30062C10.9396 -0.100207 10.2048 -0.100207 10.0079 0.30062L7.24777 5.90051L1.07351 6.79875C0.593043 6.86914 0.402809 7.46158 0.749684 7.79906L5.21613 12.1581L4.16105 18.3133C4.0798 18.7877 4.57824 19.1584 5.01144 18.9316L10.6115 16.0257L16.133 18.9316C16.5639 19.1584 17.065 18.7877 16.9834 18.3133L15.9283 12.1581L20.3951 7.79906C20.7416 7.46158 20.5513 6.86914 20.0708 6.79875Z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <div className="book-rating-item book-rating-number">
                  <strong>{bookRating}</strong> / 5
                </div>
              </div>
              <div className="book-buttons">
                {/* donat link */}
                { Boolean(userDonatInfo) && (
                  <Button
                    onClick={() => toggleOpenDonatPopup()}
                    className="book-button book-button-icon"
                    >
                    {t("book_support_author")}
                  </Button>
                ) }

                {isAuthorized && (
                  <>
                    {/* favourite */}
                    <Button
                      theme="button-border"
                      className="book-button book-button-icon"
                      onClick={() => handleFavouriteBook()}
                      isLoading={isFavouriteLoading}
                    >
                      <span>
                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 17.931C9.71527 17.931 9.44077 17.8271 9.22684 17.6383C8.41888 16.9263 7.63992 16.2573 6.95267 15.6671L6.94916 15.6641C4.93423 13.9337 3.19427 12.4394 1.98364 10.9674C0.630341 9.32179 0 7.76152 0 6.05702C0 4.40095 0.563507 2.87313 1.58661 1.75478C2.62192 0.623216 4.04251 0 5.58716 0C6.74164 0 7.79892 0.36781 8.72955 1.09313C9.19922 1.45925 9.62494 1.90732 10 2.42997C10.3752 1.90732 10.8008 1.45925 11.2706 1.09313C12.2012 0.36781 13.2585 0 14.413 0C15.9575 0 17.3782 0.623216 18.4135 1.75478C19.4366 2.87313 20 4.40095 20 6.05702C20 7.76152 19.3698 9.32179 18.0165 10.9673C16.8059 12.4394 15.0661 13.9336 13.0515 15.6637C12.363 16.2548 11.5828 16.9249 10.773 17.6386C10.5592 17.8271 10.2846 17.931 10 17.931ZM5.58716 1.18062C4.37363 1.18062 3.25882 1.66868 2.44781 2.55499C1.62476 3.45467 1.17142 4.69834 1.17142 6.05702C1.17142 7.49059 1.70013 8.77269 2.88559 10.2141C4.03137 11.6074 5.73563 13.0709 7.70889 14.7656L7.71255 14.7687C8.4024 15.3611 9.18442 16.0328 9.99832 16.75C10.8171 16.0314 11.6003 15.3587 12.2916 14.7653C14.2647 13.0706 15.9688 11.6074 17.1146 10.2141C18.2999 8.77269 18.8286 7.49059 18.8286 6.05702C18.8286 4.69834 18.3752 3.45467 17.5522 2.55499C16.7413 1.66868 15.6264 1.18062 14.413 1.18062C13.524 1.18062 12.7078 1.4654 11.9872 2.02695C11.3449 2.52762 10.8975 3.16052 10.6352 3.60337C10.5003 3.8311 10.2629 3.96703 10 3.96703C9.73709 3.96703 9.49966 3.8311 9.36478 3.60337C9.10263 3.16052 8.65524 2.52762 8.01285 2.02695C7.29218 1.4654 6.47598 1.18062 5.58716 1.18062Z" fill="#1C1C1E" />
                        </svg>
                      </span>
                      {book.isFavourite ? "Удалить из Избранного" : "В Избранное"}
                    </Button>
                    {/* edit book */}
                    {book?.createdByCurrentUser &&
                      <Button
                        className="book-button book-button-icon"
                        isLink={true}
                        to={`/book/edit/${slug}`}
                      >
                        <span>
                          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
                            <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
                          </svg>
                        </span>
                        Редактировать
                    </Button>
                    }
                  </>
                ) }
              </div>
            </div>
          </div>

          {/* audio */}
          {audio && audio.length > 0 ? 
            <BookAudioPlayer
              onSaveBookAudio={onSaveBookAudio}
              audioFiles={audio}
              activeAudio={audioHistory}
              fetchUrl={fetchAudioUrl}
            />
            : null
          }

          <div className="book-content">
            <div className="book-description">
              <h4 className="book-subtitle">Описание</h4>
              <div className="book-description-text">{book?.description.length > 360 && !openDescription ? `${book?.description?.substring(0, 360)} ...` : book?.description}</div>
              {book?.description.length > 360 &&
                <button
                  className={`book-button-arrow ${openDescription ? 'active' : ''}`}
                  onClick={() => setOpenDescription(!openDescription)}>
                  Развернуть
                </button>
              }
            </div>
            <BookComment
              bookId={book.id}
              onSubmitComment={setRatingVote}
              defaultChecked={bookRatingVote}
            />
          </div>

          { showDonatPopup && (
            <Popup
              onClosePopup={toggleOpenDonatPopup}
            >
              <div className="form">
                <h4 className="form-title">Донаты</h4>
                { userDonatInfo?.cards?.map((z, i) => (
                  <div className="form-row" key={`form-row_${i}`}>
                    <TextField
                      placeholder={`Карта ${i + 1}`}
                      register={() => {}}
                      isDisabled={true}
                      defaultValue={z}
                    />
                  </div>
                )) }
                <div className="form-row">
                  <TextField
                    placeholder="Сcылка на donationalerts"
                    register={() => {}}
                    isDisabled={true}
                    defaultValue={userDonatInfo?.link}
                  />
                </div>
              </div>
            </Popup>
          )}
        </div>
      )}
    </div>
  )
};

export default Book;