import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import { getPageOfBooks, toggleFavouriteBook, getFilterInfoBook } from "../apiServices/apiBooks";

import BookItem from "../components/bookItem";
import BooksMenu from "../components/booksMenu";
import BooksFilter from "../components/booksFilter";
import Spinner from "../components/shared/spinner";

import Popup from "../components/shared/popup";
import MessagePopup from "../components/shared/messagePopup";

const Books = () => {
  const { state: locationState } = useLocation();
  const { userData } = useAuth();
  const isAuthorized = Boolean(userData);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [books, setBooks] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [activeFilter, setActiveFilter] = useState({
    sortBy: 0
  });
  const [filterData, setFilterData] = useState({
    authors: [],
    genres: [],
    sort: [
      {
        label: "Недавние",
        value: 1,
        isActive: false
      },
      {
        label: "Популярные",
        value: 0,
        isActive: true
      }
    ]
  });

  const getDataBooks = async (page, filter) => {
    const res = await getPageOfBooks(page, filter);
    if (res && res.books) {
      setBooks(res.books);
      setPageCount(res.countPages);
    }
    if (isLoading) setIsLoading(false);
    if (isLoadingBook) setIsLoadingBook(false);
  };

  const getInfoFilter = async () => {
    const res = await getFilterInfoBook();
    if (res) {
      setFilterData({
        ...filterData,
        authors: res.authors || [],
        genres: res.genres || []
      })
    }
  };

  useEffect(() => {
    getInfoFilter();
    if (locationState && locationState.addNewBook) {
      setIsOpenPopup(true);
    }
  }, []);

  useEffect(() => {
    getDataBooks(activePage, activeFilter);
  }, [activePage, activeFilter]);

  const handlePageClick = ({ selected }) => {
    window.scrollTo(0, 0);
    setActivePage(selected + 1);
  };

  const handleFavouriteBook = async (id) => {
    const activeItem = books.find((item) => item.id === id);
    const res = await toggleFavouriteBook(id, !activeItem.isFavourite);
    if (res) {
      const newBooks = books.map((book) => {
        if (book.id === id) {
          book.isFavourite = !activeItem.isFavourite;
          book.selectedAsFavourite = activeItem.isFavourite ? book.selectedAsFavourite + 1 : book.selectedAsFavourite - 1
        }
        return book;
      });
      setBooks(newBooks);
    }
  };

  const cleanObj = (obj) => {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || Object.keys(obj[propName]).length === 0) {
        delete obj[propName];
      }
    }
    return obj
  };

  const handleFilterBook = ({sortBy, ...data}) => {
    const _sortBy = filterData.sort.find((z) => z.isActive === true);
    const _filter = cleanObj({
      ...activeFilter,
      ...data
    });
    setActiveFilter({
      ..._filter,
      sortBy: sortBy || _sortBy?.value || 0
    });
    setIsLoadingBook(true);
    setActivePage(1);
  };

  if (isLoading) {
    return (
      <div className="books page-full">
        <Spinner />
      </div>
    )
  }

  const isShowClearButtonFilter = activeFilter.hasOwnProperty("genres") || activeFilter.hasOwnProperty("authorsNickName");

  return (
    <div className="books page-full">
      <div className="wr fadeIn">
        <div className="books-top">
          <div className="books-top-left">
            {isAuthorized && <BooksMenu />}
          </div>
          <div className="books-top-right">
            <BooksFilter
              authors={filterData.authors}
              genres={filterData.genres}
              sort={filterData.sort}
              isShowClearButton={isShowClearButtonFilter}
              onChangeFilter={handleFilterBook}
            />
          </div>
        </div>
        {isLoadingBook ? (
          <Spinner />
        ) : (
          <>
            <div className="books-list">
              {books && books.length ? (
                books.map((item) => (
                  <BookItem
                    className="books-item"
                    onCallBack={handleFavouriteBook}
                    iconType={item.isFavourite ? "heart-active" : "heart"}
                    tooltipText={item.isFavourite ? "Удалить из избранного" : "Добавить в избранное"}
                    isShowButton={isAuthorized}
                    key={item.id}
                    {...item}
                  />
                ))
              ) : <div className="text-message">В данный момент книг для просмотра нет</div>}
            </div>
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
          </>
        )}
      </div>
      {isOpenPopup && (
        <Popup className="books-popup-message" onClosePopup={setIsOpenPopup.bind(null, false)}>
          <MessagePopup
            title="Вітаємо!"
            text="Ваш книгу успішно додано."
          />
        </Popup>
      )}
    </div>
  )
};

export default Books;