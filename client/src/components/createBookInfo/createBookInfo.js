import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useForm } from "react-hook-form";

import { getParserBook } from "../../apiServices/apiAddOrCreateBooks";

import TextField from "../shared/textField";
import UiSelect from "../shared/uiSelect";
import Button from "../shared/button";

import styles from "./createBookInfo.module.scss";

const CreateBookInfo = ({ genres, formData, getFormData }) => {
  const [activeForm, setActiveForm] = useState(true);
  const [optionGenres, setOptionGenres] = useState([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      ...formData
    }
  });

  const {
    register: registerParse,
    handleSubmit: handleSubmitParse,
    formState: { errors: errorsParse, isSubmitting: isSubmittingParse },
  } = useForm({
    defaultValues: {
      ...formData
    }
  });

  const getGenres = (gen) => {
    const _res = formData.genres && formData.genres.length ? gen.map((z) => {
      const hasElement = formData.genres.find((l) => l.value === z.value);
      return {
        ...z,
        isActive: Boolean(hasElement)
      }
    }) : gen;
    setOptionGenres(_res);
  }

  useEffect(() => {
    getGenres(genres);
  }, [genres]);

  const onChangeGenres = (element) => {
    const newOptions = optionGenres.map((option) => {
      option.isActive = option.value === element.value ? element.isActive : option.isActive;
      return option;
    });
    setOptionGenres(newOptions);
  };

  const onResetGenres = (element) => {
    const newOptions = optionGenres.map((option) => {
      if (option.value === element.value) {
        option.isActive = false;
      }
      return option;
    });
    setOptionGenres(newOptions);
  };

  const onSubmit = (data) => {
    const activeOptionGenres = optionGenres.filter((z) => z.isActive === true);
    if (activeOptionGenres) {
      const _data = {
        ...data,
        genres: activeOptionGenres || []
      };
      getFormData(_data);
      return;
    }
  };

  const onSubmitParse = async (data) => {
    const res = await getParserBook(data.link);
    if (res) getFormData(res);
  };

  return (
    <>
      {activeForm ? (
        <form className={classNames(styles["book-info"], "fadeIn")} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles["book-info-left"]}>
            <div className={styles["book-info-row"]}>
              <TextField
                name="name"
                placeholder="Введите название книги"
                label="Название"
                register={register}
                required={{ required: "Поле обязательное " }}
                error={errors.name?.message}
              />
            </div>
            <div className={styles["book-info-row"]}>
              <TextField
                name="description"
                placeholder="Введите описание к книге"
                label="Описание"
                register={register}
                required={{ required: "Поле обязательное " }}
                isTextArea={true}
                error={errors.description?.message}
              />
            </div>
            <div className={styles["book-info-row"]}>
              <UiSelect
                isMultiSelect={true}
                isDefaultSelect={true}
                placeholder="Выберите жанр"
                label="Жанр"
                options={optionGenres}
                onChange={onChangeGenres}
                onReset={onResetGenres}
              />
            </div>
            <div className={styles["book-info-buttons"]}>
              <Button theme="button-border" isDisabled={true}>Назад</Button>
              <Button isLoading={isSubmitting}>Дальше</Button>
            </div>
          </div>
          <div className={styles["book-info-right"]}>
            <div className={styles["book-info-item"]}>
              <h5>Загрузите данные о книге удобным и быстрым способом</h5>
              <p>Для этого Вам необходимо выбрать озвученную вами книгу<br />на ресурсе - <a href="https://shikimori.one/" rel="noreferrer" target="_blank">shikimori.one</a>. Далее вставить ссылку на книгу<br />с этого ресурса в поле ссылка.</p>
              <p>Вся информация о книге будет загружена автоматически!</p>
            </div>
            <button
              disabled={isSubmitting}
              type="button"
              onClick={() => setActiveForm(false)}
              className={styles["book-info-btn"]}
            >
              Открыть автоматическую форму
            </button>
            <div className={styles["book-info-item"]}>
              <h5>Не нашли книгу на shikimori.one?</h5>
              <p>К сожалению, мы не можем загрузить информацию <br />о данной книге автоматически.</p>
              <p>Пожалуйста, введите информацию об этой книге в форму данную ниже!</p>
            </div>
          </div>
        </form>
      ) : (
        <form className={classNames(styles["book-info"], "fadeIn")} onSubmit={handleSubmitParse(onSubmitParse)}>
          <div className={styles["book-info-left"]}>
            <div className={styles["book-info-row"]}>
              <TextField
                name="link"
                placeholder="Вставте ссылку на книгу "
                label="Ссылка"
                register={registerParse}
                required={{ required: "Поле обязательное " }}
                error={errorsParse.link?.message}
              />
            </div>
            <div className={styles["book-info-buttons"]}>
              <Button theme="button-border" isDisabled={true}>Назад</Button>
              <Button isLoading={isSubmittingParse}>Дальше</Button>
            </div>
          </div>
          <div className={styles["book-info-right"]}>
            <div className={styles["book-info-item"]}>
              <h5>Загрузите данные о книге удобным и быстрым способом</h5>
              <p>Для этого Вам необходимо выбрать озвученную вами книгу<br />на ресурсе - <a href="https://shikimori.one/" rel="noreferrer" target="_blank">shikimori.one</a>. Далее вставить ссылку на книгу<br />с этого ресурса в поле ссылка.</p>
              <p>Вся информация о книге будет загружена автоматически!</p>
            </div>
            <div className={styles["book-info-item"]}>
              <h5>Не нашли книгу на shikimori.one?</h5>
              <p>К сожалению, мы не можем загрузить информацию <br />о данной книге автоматически.</p>
              <p>Пожалуйста, введите информацию об этой книге в форму данную ниже!</p>
            </div>
            <button
              disabled={isSubmittingParse}
              type="button"
              onClick={() => setActiveForm(true)}
              className={styles["book-info-btn"]}
            >
              Открыть форму
            </button>
          </div>
        </form>
      )}
    </>
  )
};

CreateBookInfo.defaultProps = {
  genres: [],
  formData: {},
  setBookData: () => {}
};

CreateBookInfo.propTypes = {
  setBookData: PropTypes.func,
  genres: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
    isActive: PropTypes.bool
  })),
  formData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    link: PropTypes.string,
    genres: PropTypes.array
  })
};

export default CreateBookInfo;