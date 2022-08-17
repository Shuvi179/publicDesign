import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import DropZone from "react-drop-zone";
import classNames from "classnames";

import BookAudio from "../bookAudio";

import Button from "../shared/button";
import TextField from "../shared/textField";
import UiSelect from "../shared/uiSelect";

import styles from "./bookEdit.module.scss";

const BookEdit = ({ isImageRequired, audioFiles, bookData, genres, onGoBack, onSaveBook, isLoading, buttonLeftText, buttonRightText }) => {
  const [audio, setAudio] = useState(audioFiles);
  const [removeAudioData, setRemoveAudioData] = useState([]);
  const [optionGenres, setOptionGenres] = useState([]);
  const [bookImage, setBookImage] = useState(bookData.image);
  const [bookImageFile, setBookImageFile] = useState();
  const [isBookImageError, setIsBookImageError] = useState(false);

  const getImage = (file) => {
    const reader  = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setBookImage(reader.result.split(',')[1]);
      }
    };
    if (file) {
      setBookImageFile(file);
      reader.readAsDataURL(file);
      return;
    }
    setBookImageFile("");
    setBookImage("");
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: bookData?.name || "",
      description: bookData?.description || "",
      genres: bookData?.genres || []
    }
  });

  const getGenres = () => {
    const _res = bookData.genres && bookData.genres.length ? genres.map((z) => {
      const hasElement = bookData.genres.find((l) => l.value === z.value);
      return {
        ...z,
        isActive: Boolean(hasElement)
      }
    }) : genres;
    setOptionGenres(_res);
  };

  useEffect(() => {
    getGenres();
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
    const checkedGenres = optionGenres.filter((z) => z.isActive === true);
    let _image = bookImage;
    if (isImageRequired && !Boolean(_image)) {
      setIsBookImageError(true);
      return;
    }
    if (isBookImageError) setIsBookImageError(false);
    onSaveBook({
      ...data,
      genres: checkedGenres || [],
      image: _image,
      imageFile: bookImageFile,
      audio,
      removeAudio: removeAudioData
    })
  };

  return (
    <form className={styles["book-edit"]} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles["book-edit-top"]}>
        <div className={classNames(styles["book-edit-image"], { [styles["error"]]: isBookImageError })}>
          <DropZone onDrop={(file) => getImage(file)} accept="image/png, image/jpeg">
            {() => {
              if (bookImage) {
                return (
                  <>
                    {/^(http|https|\/api)/.test(bookImage) ? <img src={bookImage} /> : <img src={bookImage.includes("data:image") ? bookImage : `data:image/jpeg;base64, ${bookImage}`} /> }
                    <button className={styles["book-edit-image-btn"]} onClick={() => setBookImage()} type="button">
                      <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.6876 2.37502H13.9532C14.773 2.37502 15.4376 3.03962 15.4376 3.8594V5.04691C15.4376 5.37485 15.1718 5.64067 14.8439 5.64067H0.593755C0.265817 5.64067 0 5.37485 0 5.04691V3.8594C0 3.03962 0.664597 2.37502 1.48439 2.37502H4.75004V1.78126C4.75004 0.797487 5.54752 0 6.5313 0H8.90632C9.8901 0 10.6876 0.797487 10.6876 1.78126V2.37502ZM6.5313 1.18751C6.20399 1.18751 5.93755 1.45396 5.93755 1.78126V2.37502H9.50007V1.78126C9.50007 1.45396 9.23363 1.18751 8.90632 1.18751H6.5313ZM0.941971 7.02244C0.936925 6.9166 1.02135 6.82805 1.1273 6.82805H14.3113C14.4173 6.82805 14.5017 6.9166 14.4966 7.02244L14.0068 17.3034C13.9615 18.2549 13.18 19 12.2278 19H3.21086C2.25862 19 1.47709 18.2549 1.43182 17.3034L0.941971 7.02244ZM10.6881 7.71869C10.36 7.71869 10.0943 7.98439 10.0943 8.31244V16.0313C10.0943 16.3593 10.36 16.625 10.6881 16.625C11.0161 16.625 11.2818 16.3593 11.2818 16.0313V8.31244C11.2818 7.98439 11.0161 7.71869 10.6881 7.71869ZM7.71931 7.71869C7.39126 7.71869 7.12555 7.98439 7.12555 8.31244V16.0313C7.12555 16.3593 7.39126 16.625 7.71931 16.625C8.04736 16.625 8.31306 16.3593 8.31306 16.0313V8.31244C8.31306 7.98439 8.04736 7.71869 7.71931 7.71869ZM4.75054 7.71869C4.42249 7.71869 4.15678 7.98439 4.15678 8.31244V16.0313C4.15678 16.3593 4.42249 16.625 4.75054 16.625C5.07859 16.625 5.34429 16.3593 5.34429 16.0313V8.31244C5.34429 7.98439 5.07859 7.71869 4.75054 7.71869Z" fill="#1C1C1E"/>
                      </svg>
                    </button>
                  </>
                )
              }
              return (
                <div className={styles["book-edit-image-inner"]}>
                  <div className={styles["book-edit-image-icon"]}>
                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5894 11.0896C12.9945 11.0896 12.5122 11.5718 12.5122 12.1667V13.8457H2.24214V12.1667C2.24214 11.5719 1.75989 11.0896 1.16501 11.0896C0.570138 11.0896 0.0878906 11.5718 0.0878906 12.1667V14.9228C0.0878906 15.5176 0.570138 16 1.16501 16H13.5894C14.1843 16 14.6666 15.5176 14.6666 14.9228V12.1667C14.6666 11.5718 14.1843 11.0896 13.5894 11.0896Z" fill="#808080" />
                      <path d="M7.05129 12.2357C7.23071 12.4149 7.52218 12.4149 7.70141 12.2357L11.4763 8.46082C11.5863 8.35084 11.6189 8.18564 11.5595 8.04153C11.5 7.898 11.3601 7.80444 11.2043 7.80444H9.43185V0.840612C9.43185 0.376103 9.05575 0 8.59134 0H6.16194C5.69756 0 5.32143 0.376071 5.32143 0.840612V7.80444H3.54838C3.39269 7.80444 3.25284 7.89797 3.19337 8.04153C3.13389 8.18564 3.1666 8.35084 3.27642 8.46082L7.05129 12.2357Z" fill="#808080" />
                    </svg>
                  </div>
                  <div className={styles["book-edit-image-text"]}>Перетащите изображение<br />или нажмите на кнопку чтобы загрузить </div>
                </div>
              )
            }}
          </DropZone>
        </div>
        <div className={styles["book-edit-info"]}>
          <div className={styles["book-edit-info-row"]}>
            <TextField
              name="name"
              placeholder="Введите название книги"
              label="Название"
              register={register}
              required={{ required: "Поле обязательное " }}
              error={errors.name?.message}
            />
          </div>
          <div className={styles["book-edit-info-row"]}>
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
        </div>
      </div>
      <div className={styles["book-edit-description"]}>
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
      <BookAudio
        setAudioData={setAudio}
        setRemoveAudioData={setRemoveAudioData}
        bookName={bookData?.name || ""}
        audioFiles={audio}
      />
      <div className={styles["book-edit-buttons"]}>
        <Button theme="button-border" isDisabled={isLoading} type="button" onClick={onGoBack}>{ buttonLeftText }</Button>
        <Button isLoading={isLoading}>{ buttonRightText }</Button>
      </div>
    </form>
  )
};

BookEdit.defaultProps = {
  audioFiles: [],
  bookData: {},
  genres: [],
  onGoBack: () => {},
  onSaveBook: () => {},
  isLoading: false,
  buttonLeftText: "Назад",
  buttonRightText: "Дальше",
  isImageRequired: false
};

BookEdit.propTypes = {
  audioFiles: PropTypes.arrayOf(PropTypes.shape({
    files: PropTypes.array,
    isActive: PropTypes.bool,
    name: PropTypes.string
  })),
  bookData: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    genres: PropTypes.array
  }),
  genres: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
    isActive: PropTypes.bool
  })),
  onGoBack: PropTypes.func,
  onSaveBook: PropTypes.func,
  isLoading: PropTypes.bool,
  buttonLeftText: PropTypes.string,
  buttonRightText: PropTypes.string,
  isImageRequired: PropTypes.bool
};

export default BookEdit;