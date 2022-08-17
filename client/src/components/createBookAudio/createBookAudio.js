import React, { useState } from "react";
import PropTypes from "prop-types";

import BookAudio from "../bookAudio";

import Button from "../shared/button";
import Popup from "../shared/popup";
import MessagePopup from "../shared/messagePopup";

import styles from "./createBookAudio.module.scss";

const CreateBookAudio = ({ bookName, setAudioData, audioFiles, onGoBack }) => {
  const [activePopup, setActivePopup] = useState(false);
  const [typePopup, setTypePopup] = useState("");
  const [audio, setAudio] = useState(audioFiles);

  const toggleOpenPopup = (type = '') => {
    document.body.style.overflow = !activePopup ? "hidden" : "";
    setActivePopup(!activePopup);
    setTypePopup(type)
  };

  const onNextStep = () => {
    setAudioData(audio);
  };

  return (
    <div className={styles["book-audio"]}>
      <div className={styles["book-audio-top"]}>
        <div className={styles["book-audio-top-left"]}>
          <button className={styles["book-audio-link"]} onClick={() => toggleOpenPopup()}>Что такое приложение?</button>
        </div>
        <div className={styles["book-audio-top-right"]}>
          <button className={styles["book-audio-link"]} onClick={() => toggleOpenPopup('begin')}>Не знаете с чего начать?</button>
        </div>
      </div>
      <BookAudio setAudioData={setAudio} bookName={bookName} audioFiles={audio} />
      <div className={styles["book-audio-buttons"]}>
        <Button theme="button-border" onClick={onGoBack}>Назад</Button>
        <Button onClick={onNextStep}>Дальше</Button>
      </div>
      { activePopup && (
        <Popup
          className={styles["book-audio-message"]}
          onClosePopup={toggleOpenPopup}
        >
          { typePopup === "begin" ? (
            <MessagePopup>
              <h5>С чего начать?</h5>
              <p>Первым шагом Вам необходимо <strong>создать том.</strong> Для вашего удобства первый том создается автоматически.</p>
              <h5>Как добавить главы в том?</h5>
              <p>Чтобы добавить главу в созданный том, Вам необходимо <strong>выбрать этот том</strong> в первой форме и перетащить аудио-файл в другую форму или можно <strong>загрузить</strong> файл з ПК.</p>
              <p>Вы можете перетаскивать или загружать сразу <strong>несколько глав.</strong></p>
              <h5>Как сортировать главы?</h5>
              <p>Все аудио-файлы, которые вы добавляете в форму, <strong>посортированы </strong> в том порядке, котором Вы добавляли их.</p>
              <p>Порядок аудио-файлов всегда <strong>можно изменить.</strong> Для этого Вам необходимо <strong>перетаскивать</strong> их в форме.</p>
              <h5>Можно редактировать тома после публикации?</h5>
              <p>Да, Вы всегда сможете вернуться к своей книге и вносить изменения.</p>
            </MessagePopup>
          ) : (
            <MessagePopup>
              <h5>Что такое приложение?</h5>
              <p>Приложение - это дополнительные главы к тому. Автор нашего сервиса имеет возможность добавлять к каждому тому дополнительные главы.</p>
              <p>Дополнительные главы - пролог, эпилог, послесловие автора.</p>
              <h5>Почему нужно обозначать приложение для каждого тома?</h5>
              <p>Наш сервис автоматически определяет порядок файлов, который вы сохранили и отражает его пользователям. Для правильного показа файлов мы просим Вас всегда обозначать наличие или отсутствие дополнительных глав в томах.</p>
              <h5>Как сортируются файлы, если том имеет дополнительные главы?</h5>
              <p>Сервис автоматически сортирует файлы каждого тома согласно порядку ниже:</p>
              <p>Первый файл - пролог. Следующие файлы - основные главы. Предпоследний файл - эпилог. Последний - послесловие автора</p>
              <p>Просим Вас сортировать все файлы согласно этому порядку!</p>
            </MessagePopup>
          )}
        </Popup>
      )}
    </div>
  )
};

CreateBookAudio.defaultProps = {
  bookName: "",
  setAudioData: () => {},
  onGoBack: () => {},
  audioFiles: []
};

CreateBookAudio.propTypes = {
  bookName: PropTypes.string,
  setAudioData: PropTypes.func,
  onGoBack: PropTypes.func,
  audioFiles: PropTypes.arrayOf(PropTypes.shape({
    files: PropTypes.array,
    isActive: PropTypes.bool,
    name: PropTypes.string
  }))
};

export default CreateBookAudio;