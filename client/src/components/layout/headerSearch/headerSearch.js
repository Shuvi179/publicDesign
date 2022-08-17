import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

import { fetchSearch } from "../../../apiServices/apiBooks";
import Spinner from "../../shared/spinner";

import styles from "./headerSearch.module.scss";

const HeaderSearch = () => {
  let _submit;
  const searchEl = useRef(null);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const { register, watch, handleSubmit, setValue } = useForm();

  const watchSearch = watch("search");

  const clearSearch = () => {
    setValue("search", "");
    setIsLoading(false);
    clearTimeout(_submit);
  }

  const handleClickOutside = (e) => {
    if (searchEl.current && !searchEl.current.contains(e.target)) {
      clearSearch()
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = async ({ search }) => {
    let _books = [];
    if (search) {
      const res = await fetchSearch(search)
      if (res) {
        _books = res
      }
    }
    setIsLoading(false);
    setBooks(_books)
  };

  const onChange = (e) => {
    setValue("search", e.target.value);
    setIsLoading(true);
    clearTimeout(_submit);
    _submit = setTimeout(() => {
      handleSubmit(onSubmit)()
    }, 800)
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles["header-search"]}
      ref={searchEl}
    >
      <input
        {...register("search")}
        onChange={onChange}
        autoComplete="off"
        type="search"
        className={classNames(styles["header-search-input"], "header-search-input")}
        placeholder={t("search_form_input")}
      />
      <button className={styles["header-search-btn"]}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 0C3.14585 0 0 3.14585 0 7C0 10.8541 3.14585 14 7 14C8.748 14 10.345 13.348 11.5742 12.2812L12 12.707V14L18 20L20 18L14 12H12.707L12.2812 11.5742C13.348 10.345 14 8.748 14 7C14 3.14585 10.8541 0 7 0ZM7 2C9.77327 2 12 4.22673 12 7C12 9.77327 9.77327 12 7 12C4.22673 12 2 9.77327 2 7C2 4.22673 4.22673 2 7 2Z" fill="#8A8A8E"/>
        </svg>
      </button>
      { watchSearch && (
        <div className={styles["header-search-resaults"]}>
          { isLoading ? (
            <Spinner />
          ) : (
            books && books.length ? books.map(z => (
              <Link
                className={styles["header-search-resaults-block"]}
                to={`/book/${z.bookId}`} key={`header-search-resaults_${z.bookId}`}
                onClick={() => clearSearch()}
              >
                <span className={styles["header-search-resaults-book-name"]}>{ z.bookName }</span>
                <span className={styles["header-search-resaults-author"]}>{ z.author }</span>
              </Link>
            )) : <div className={styles["header-search-resaults-text"]}>{t("search_form_empty")}</div>
          ) }
        </div>
      ) }
    </form>
  )
};

export default HeaderSearch;
