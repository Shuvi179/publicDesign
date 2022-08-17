import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import { getPageFavouriteCountBooks, getPageCurrentBooks, removeAllFavouriteBooks, getPageFavouriteBooks, toggleFavouriteBook } from "../apiServices/apiBooks";

import BookItem from "../components/bookItem";
import BooksMenu from "../components/booksMenu";
import Spinner from "../components/shared/spinner";
import Popup from "../components/shared/popup";
import MessagePopup from "../components/shared/messagePopup";

const _typeCreacted = "created";
const _typeFavourite = "favourite";

const BooksFavourite = () => {
  const { userData } = useAuth();
  const _isAuthor = Boolean(userData) && userData.isAuthor;
  const history = useHistory();
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [activePopup, setActivePopup] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [books, setBooks] = useState([]);
  const [selectedTab, setSelectedTab] = useState(_isAuthor ? _typeCreacted : _typeFavourite); // can be created or favourite
  const [booksCount, setBooksCount] = useState({
    favouriteCount: 0,
    createdCount: 0
  });

  const getPageFavoriteCount = async () => {
    const res = await getPageFavouriteCountBooks();
    if (res) {
      setBooksCount(res);
    }
    setIsLoadingBook(false);
  };

  const getDataBooks = async (page, type = selectedTab) => {
    let res = [];
    if (type === _typeCreacted) res = await getPageCurrentBooks(page);
    if (type === _typeFavourite) res = await getPageFavouriteBooks(page);
    if (res && res.books) {
      setBooks(res.books);
      setPageCount(res.countPages);
    } else {
      setBooks([]);
      setPageCount(0);
    }
    setIsLoadingBook(false);
  };

  useEffect(() => {
    getPageFavoriteCount();
    getDataBooks(1);
  }, []);

  const handlePageClick = ({ selected }) => {
    window.scrollTo(0, 0);
    setIsLoadingBook(true);
    getDataBooks(selected + 1);
  };

  const handleFavouriteBook = async (id) => {
    const activeItem = books.find((item) => item.id === id);
    const res = await toggleFavouriteBook(id, !activeItem.isFavourite);
    if (res) {
      const newBooks = books.filter((book) => book.id !== id);
      getPageFavoriteCount();
      setBooks(newBooks);
    }
  };

  const handleChangeTab = (type) => {
    if (selectedTab !== type) {
      setBooks([]);
      setPageCount(0);
      setIsLoadingBook(true);
      setSelectedTab(type);
      getDataBooks(1, type);
    }
  };

  const onCleanAllFavourite = async () => {
    const res = await removeAllFavouriteBooks();
    if (res) {
      setBooksCount((prevCount) => ({
        ...prevCount,
        favouriteCount: 0
      }));
      setActivePopup(false);
      setIsLoadingBook(true);
      getDataBooks(1);
    }
  };

  const handleEditBook = (id) => {
    history.push(`/book/edit/${id}`);
  };

  return (
    <div className="books page-full">
      <div className="wr fadeIn">
        <div className="books-top">
          <div className="books-top-left">
            <BooksMenu />
          </div>
          <div className="books-top-right">
            <div className="books-info">
              <div className="books-info-block">
                { _isAuthor && (
                  <button
                    className={`books-info-btn ${selectedTab === _typeCreacted ? 'active' : ''}`}
                    onClick={() => handleChangeTab(_typeCreacted)}
                  >
                    Опубликованные <span className="books-info-number">{booksCount.createdCount}</span>
                  </button>
                ) }
                <button
                  className={`books-info-btn ${selectedTab === _typeFavourite ? 'active' : ''}`}
                  onClick={() => handleChangeTab(_typeFavourite)}
                >
                  Избранные <span className="books-info-number">{booksCount.favouriteCount}</span>
                </button>
              </div>
              {selectedTab === _typeFavourite && books && books.length ? (
                <div className="books-info-block">
                  <button className="books-info-btn books-info-btn-icon" onClick={() => setActivePopup(true)}>
                    <span>
                      <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.13461 1.80769H10.6202C11.2442 1.80769 11.75 2.31354 11.75 2.9375V3.84135C11.75 4.09095 11.5477 4.29327 11.2981 4.29327H0.451923C0.20232 4.29327 0 4.09095 0 3.84135V2.9375C0 2.31354 0.505843 1.80769 1.12981 1.80769H3.61538V1.35577C3.61538 0.606989 4.22237 0 4.97115 0H6.77885C7.52763 0 8.13461 0.606989 8.13461 1.35577V1.80769ZM4.97115 0.903846C4.72203 0.903846 4.51923 1.10665 4.51923 1.35577V1.80769H7.23077V1.35577C7.23077 1.10665 7.02797 0.903846 6.77885 0.903846H4.97115ZM0.716961 5.34497C0.713119 5.26441 0.777377 5.19702 0.858017 5.19702H10.8927C10.9734 5.19702 11.0376 5.26441 11.0338 5.34497L10.661 13.1701C10.6265 13.8943 10.0317 14.4614 9.30689 14.4614H2.44387C1.7191 14.4614 1.12426 13.8943 1.0898 13.1701L0.716961 5.34497ZM8.135 5.87491C7.88531 5.87491 7.68307 6.07714 7.68307 6.32683V12.2018C7.68307 12.4515 7.88531 12.6538 8.135 12.6538C8.38468 12.6538 8.58692 12.4515 8.58692 12.2018V6.32683C8.58692 6.07714 8.38468 5.87491 8.135 5.87491ZM5.87538 5.87491C5.62569 5.87491 5.42346 6.07714 5.42346 6.32683V12.2018C5.42346 12.4515 5.62569 12.6538 5.87538 12.6538C6.12507 12.6538 6.3273 12.4515 6.3273 12.2018V6.32683C6.3273 6.07714 6.12507 5.87491 5.87538 5.87491ZM3.61576 5.87491C3.36608 5.87491 3.16384 6.07714 3.16384 6.32683V12.2018C3.16384 12.4515 3.36608 12.6538 3.61576 12.6538C3.86545 12.6538 4.06769 12.4515 4.06769 12.2018V6.32683C4.06769 6.07714 3.86545 5.87491 3.61576 5.87491Z" fill="#1C1C1E" />
                      </svg>
                    </span>
                    Очистить список избранных
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {isLoadingBook ? (
          <Spinner />
        ) : (
          <div className="books-list">
            {books && books.length ? (
              books.map((item) => (
                <BookItem
                  className="books-item"
                  onCallBack={selectedTab === _typeCreacted ? handleEditBook : handleFavouriteBook}
                  iconType={selectedTab === _typeCreacted ? "edit" : "heart-active" }
                  tooltipText={selectedTab === _typeCreacted ? "Редагувати" : "Видалити із обраного"}
                  isShowButton={true}
                  key={item.id}
                  {...item}
                />
              ))
            ) : <div className="text-message">В данном разделе книг нет</div>}
          </div>
        )}
        {Boolean(pageCount) && pageCount > 1 && (
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={' '}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        )}
      </div>
      {activePopup && (
        <Popup
          className={`books-popup-delete`}
          onClosePopup={setActivePopup.bind(null, false)}
        >
          <MessagePopup
            onClosePopup={setActivePopup.bind(null, false)}
            onCallBack={onCleanAllFavourite}
            isShowButtons={true}
            title="Очистить список опубликованного?"
            text="Полный список вашего опубликованного будет очищено навсегда"
          />
        </Popup>
      )}
    </div>
  )
};

export default BooksFavourite;