import React, { useState } from "react";
import PropTypes from "prop-types";
import UiSelect from "../../components/shared/uiSelect";

import styles from "./booksFilter.module.scss";

const BooksFilter = ({ authors, genres, sort, onChangeFilter, oClearFilter, isShowClearButton }) => {
  const [optionAuthors, setOptionAuthors] = useState(authors);
  const [optionGenres, setOptionGenres] = useState(genres);
  const [optionSort, setOptionSort] = useState(sort);

  const onChangeAuthors = (element) => {
    const newOptions = optionAuthors.map((option) => {
      option.isActive = option.value === element.value ? element.isActive : option.isActive;
      return option;
    });
    const activeItem = newOptions.filter((item) => item.isActive === true).map((z) => z.value);
    onChangeFilter({
      authorsNickName: activeItem
    });
    setOptionAuthors(newOptions);
  };

  const onChangeGenres = (element) => {
    const newOptions = optionGenres.map((option) => {
      option.isActive = option.value === element.value ? element.isActive : option.isActive;
      return option;
    });
    const activeItem = newOptions.filter((item) => item.isActive === true).map((z) => z.value);
    onChangeFilter({
      genres: activeItem
    });
    setOptionGenres(newOptions);
  };

  const onChangeSort = (element) => {
    const newOptions = optionSort.map((option) => {
      option.isActive = option.value === element.value || false;
      return option;
    });
    const activeItem = newOptions.find((item) => item.isActive === true);
    onChangeFilter({
      sortBy: activeItem?.value
    });
    setOptionSort(newOptions);
  };

  const onResetSort = (name) => {
    switch (name) {
      case "genres":
        setOptionGenres((prevOptions) => {
          const newOptions = prevOptions.map((option) => {
            option.isActive = false;
            return option;
          });
          return newOptions;
        });
        onChangeFilter({ genres: {} });
        break;
      case "sort":
        const newOptions = optionSort.map((option) => {
          option.isActive = option.value === 0 || false;
          return option;
        });
        const activeItem = newOptions.find((item) => item.isActive === true);
        onChangeFilter({
          sortBy: activeItem?.value
        });
        break;
      default:
        setOptionAuthors((prevOptions) => {
          const newOptions = prevOptions.map((option) => {
            option.isActive = false;
            return option;
          });
          return newOptions;
        });
        onChangeFilter({ authorsNickName: {} });
        break;
    }
  };

  const onCleanFilter = () => {
    onResetSort("genres");
    onResetSort("sort");
    onResetSort();
    onChangeFilter({  genres: {}, authorsNickName: {} });
  };

  return (
    <div className={styles["books-filter"]}>
      <div className={styles["books-filter-item"]}>
        <div className={styles["books-filter-label"]}>
          Фильтр
        </div>
        { isShowClearButton && <button className={styles["books-filter-btn"]} onClick={() => onCleanFilter()}>Очистить все</button> }
      </div>
      <UiSelect
        isMultiSelect={true}
        className={styles["books-filter-item"]}
        label="Авторы"
        options={optionAuthors}
        onReset={onResetSort}
        onChange={onChangeAuthors}
      />
      <UiSelect
        isMultiSelect={true}
        className={styles["books-filter-item"]}
        label="Жанры"
        onReset={onResetSort.bind(null, "genres")}
        options={optionGenres}
        onChange={onChangeGenres}
      />
      <UiSelect
        className={styles["books-filter-item"]}
        label="Сортировать"
        options={optionSort}
        onChange={onChangeSort}
      />
    </div>
  )
};

BooksFilter.defaultProps = {
  onChangeFilter: () => { },
  genres: [],
  sort: [],
  authors: [],
  isShowClearButton: false
};

BooksFilter.propTypes = {
  onChangeFilter: PropTypes.func,
  genres: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
    isActive: PropTypes.bool
  })),
  sort: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
    isActive: PropTypes.bool
  })),
  authors: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
    isActive: PropTypes.bool
  })),
  isShowClearButton: PropTypes.bool
};

export default BooksFilter;