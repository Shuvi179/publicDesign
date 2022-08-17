import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useTranslation } from 'react-i18next';
import { List, arrayMove } from 'react-movable';
import DropZone from "react-drop-zone";

import Popup from "../shared/popup";
import MessagePopup from "../shared/messagePopup";

import styles from "./bookAudio.module.scss";

const _defaultAudio = {
  name: '',
  files: [],
  isOpen: false,
  options: {
    prologue: false,
    epilogue: false,
    afterword: false
  }
};

const BookAudio = ({ bookName, setAudioData, setRemoveAudioData, audioFiles }) => {
  const { t } = useTranslation();
  const [activePopupConfirm, setActivePopupConfirm] = useState(false);
  const [toms, setToms] = useState(audioFiles);
  const [removeToms, setRemoveToms] = useState([]);
  const hasToms = Boolean(toms && toms.length);
  const activeTome = toms && toms.length !== 0 ? toms.find((t) => t.isActive === true) : null;
  const _options = [
    {
      text: t("tom_oprions_prologue"),
      name: 'prologue'
    },
    {
      text: t("tom_oprions_epilogue"),
      name: 'epilogue'
    },
    {
      text: t("tom_oprions_afterword"),
      name: 'afterword'
    }
  ];

  useEffect(() => {
    setAudioData(toms);
  }, [toms]);

  useEffect(() => {
    setRemoveAudioData(removeToms);
  }, [removeToms]);

  const addTome = () => {
    const _toms = [
      ...toms,
      {
        ..._defaultAudio,
        name: bookName,
        isActive: toms.length === 0,
      }
    ];
    setToms(_toms);
  };

  const addFiles = (files) => {
    if (!hasToms) {
      setToms([{
        ..._defaultAudio,
        name: bookName,
        isActive: true,
        files: [...files]
      }]);
      return;
    }
    const _toms = toms.map((z) => {
      if (z.isActive) {
        z.files = [
          ...z.files,
          ...files
        ]
      }
      return z;
    })
    setToms(_toms);
  };

  const onChangeTome = (index) => {
    setToms((prevToms) => prevToms.map((z, i) => ({
      ...z,
      isActive: i === index
    })));
  };

  const onOpenOption = (index) => {
    setToms((prevToms) => prevToms.map((z, i) => {
      if (index === i) {
        z.isOpen = !z.isOpen
      }
      return z
    }));
  };

  const onChangeOption = (index, type, status) => {
    const _toms = toms.map((z, i) => {
      if (index === i) {
        z.options = {
          ...z.options,
          [type]: status
        }
      }
      return z
    })
    setToms(_toms);
  };

  const onRemoveTome = (tome) => {
    let _removeItem = toms.find((_, i) => i === tome);
    const _toms = toms.filter((_, i) => i !== tome).map((z, i) => ({
      ...z,
      isActive: i === 0
    }));
    if (_removeItem && _removeItem.files) setRemoveToms([...removeToms, ..._removeItem.files])
    setToms(_toms);
  };

  const onChangePositionItem = (item) => {
    const _toms = toms.map((z) => {
      if (z.isActive) {
        z.files = item;
      }
      return z;
    })
    setToms(_toms);
  };

  const onRemoveItem = (item) => {
    let _removeItem;
    const _toms = toms.map((z) => {
      if (z.isActive) {
        _removeItem = z.files.find((_, elIndex) => elIndex === item);
        z.files = z.files.filter((_, elIndex) => elIndex !== item);
      }
      return z;
    });
    
    if (_removeItem) setRemoveToms([...removeToms, _removeItem]);
    setToms(_toms);
  };

  const onRemoveAllItems = () => {
    const _toms = toms.map((z) => {
      if (z.isActive) {
        z.files = [];
      }
      return z;
    });
    setToms(_toms);
    toggleOpenPopupConfirm();
  };

  const toggleOpenPopupConfirm = () => {
    document.body.style.overflow = !activePopupConfirm ? "hidden" : "";
    setActivePopupConfirm(!activePopupConfirm);
  };

  const getNameAudio = (audio, index) => {
    const { prologue, epilogue, afterword } = activeTome.options;
    if (prologue && index === 0) {
      return `${t("tom_oprions_prologue")}. ${audio.name}`
    } else if (
      epilogue && afterword && index === activeTome.files.length - 2 ||
      epilogue && !afterword && index === activeTome.files.length - 1
    ) {
      return `${t("tom_oprions_epilogue")}. ${audio.name}`
    } else if (afterword && index === activeTome.files.length - 1) {
      return `${t("tom_oprions_afterword")}. ${audio.name}`
    } else {
      return `Глава ${prologue ? index : index + 1 }. ${audio.name}` 
    }
  }

  return (
    <div className={classNames(styles["book-audio"], "book-audio")}>
      <div className={styles["book-audio-left"]}>
        <div className={styles["book-audio-head"]}>
          <button type="button" className={styles["book-audio-items-btn"]} onClick={() => addTome()}>
            Добавить том
              <span className={styles["book-audio-items-btn-icon"]}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.892857 4.10714H3.92857C4.02719 4.10714 4.10714 4.02719 4.10714 3.92857V0.892857C4.10714 0.39978 4.50692 0 5 0C5.49308 0 5.89286 0.39978 5.89286 0.892857V3.92857C5.89286 4.02719 5.97281 4.10714 6.07143 4.10714H9.10714C9.60022 4.10714 10 4.50692 10 5C10 5.49308 9.60022 5.89286 9.10714 5.89286H6.07143C5.97281 5.89286 5.89286 5.97281 5.89286 6.07143V9.10714C5.89286 9.60022 5.49308 10 5 10C4.50692 10 4.10714 9.60022 4.10714 9.10714V6.07143C4.10714 5.97281 4.02719 5.89286 3.92857 5.89286H0.892857C0.39978 5.89286 0 5.49308 0 5C0 4.50692 0.39978 4.10714 0.892857 4.10714Z" fill="#1C1C1E" />
              </svg>
            </span>
          </button>
        </div>
        <List
          values={toms}
          onChange={({ oldIndex, newIndex }) => setToms(arrayMove(toms, oldIndex, newIndex))}
          beforeDrag={({ index }) => onChangeTome(index)}
          renderList={({ children, props }) => <div className={styles["book-audio-items"]} {...props}>{children}</div>}
          renderItem={({ value, props, index }) => {
            if (value) {
              return (
                <div {...props} className={classNames(styles["book-audio-block"], { [styles["open-options"]]: value.isOpen })}>
                  <div className={styles["book-audio-options"]}>
                    <div className={styles["book-audio-options-block"]} role="button" onClick={() => onOpenOption(index)}>
                      <div className={styles["book-audio-items-name"]}>
                        <div className={styles["book-audio-items-name-text"]}>{`Додаток Том ${index + 1}`}</div>
                      </div>
                    </div>
                    { value.isOpen && _options.map((option, optionIndex) => (
                      <div className={classNames(styles["book-audio-options-block"], styles["book-audio-options-row"])} key={`book-audio-options-text_${optionIndex}`}>
                        <div className={styles["book-audio-options-text"]}>{ option.text }</div>
                        <div className={classNames(styles["book-audio-options-choice"], { [styles["has-option"]]: value.options[option.name] })}>
                          <div className={styles["book-audio-options-item"]} role="button" onClick={() => onChangeOption(index, option.name, true)}>
                            є
                          </div>
                          <div className={styles["book-audio-options-item"]} role="button" onClick={() => onChangeOption(index, option.name, false)}>
                            немає
                          </div>
                        </div>
                      </div>
                    )) }
                  </div>
                  <div className={classNames(styles["book-audio-items-item"], { [styles["active"]]: value.isActive })}>
                    <div className={styles["book-audio-items-name"]}>{`Том ${index + 1}. ${value.name}`}</div>
                    <button className={styles["book-audio-items-remove"]} type="button" onClick={() => onRemoveTome(index)}>
                      <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.31253 1.62501H9.54692C10.1078 1.62501 10.5625 2.07973 10.5625 2.64064V3.45314C10.5625 3.67752 10.3807 3.85939 10.1563 3.85939H0.406252C0.181874 3.85939 0 3.67752 0 3.45314V2.64064C0 2.07973 0.454723 1.62501 1.01563 1.62501H3.25002V1.21876C3.25002 0.545647 3.79566 0 4.46877 0H6.09378C6.76689 0 7.31253 0.545647 7.31253 1.21876V1.62501ZM4.46877 0.812504C4.24482 0.812504 4.06252 0.994809 4.06252 1.21876V1.62501H6.50003V1.21876C6.50003 0.994809 6.31772 0.812504 6.09378 0.812504H4.46877ZM0.644265 4.80482C0.640812 4.7324 0.698576 4.67182 0.771066 4.67182H9.79169C9.86418 4.67182 9.92194 4.7324 9.91849 4.80482L9.58333 11.8391C9.55235 12.4901 9.01762 13 8.3661 13H2.19665C1.54513 13 1.0104 12.4901 0.979423 11.8391L0.644265 4.80482ZM7.31263 5.2812C7.08818 5.2812 6.90638 5.46299 6.90638 5.68745V10.9687C6.90638 11.1932 7.08818 11.375 7.31263 11.375C7.53709 11.375 7.71889 11.1932 7.71889 10.9687V5.68745C7.71889 5.46299 7.53709 5.2812 7.31263 5.2812ZM5.28138 5.2812C5.05692 5.2812 4.87512 5.46299 4.87512 5.68745V10.9687C4.87512 11.1932 5.05692 11.375 5.28138 11.375C5.50583 11.375 5.68763 11.1932 5.68763 10.9687V5.68745C5.68763 5.46299 5.50583 5.2812 5.28138 5.2812ZM3.25012 5.2812C3.02566 5.2812 2.84386 5.46299 2.84386 5.68745V10.9687C2.84386 11.1932 3.02566 11.375 3.25012 11.375C3.47457 11.375 3.65637 11.1932 3.65637 10.9687V5.68745C3.65637 5.46299 3.47457 5.2812 3.25012 5.2812Z" fill="#1C1C1E" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            }
          }}
        />
      </div>
      <div className={styles["book-audio-right"]}>
        {activeTome && activeTome.files && activeTome.files.length !== 0 ? (
          <>
            <div className={classNames(styles["book-audio-head"], "fadeIn")}>
              <DropZone multiple={true} onDrop={(file) => addFiles(file)} accept=".mp3,audio/*">
                {() => (
                  <button className={styles["book-audio-items-btn"]} accept=".mp3,audio/*" type="button">
                    Добавить файл
                    <span className={styles["book-audio-items-btn-icon"]}>
                      <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.75552 8.01276C9.32569 8.01276 8.97715 8.3612 8.97715 8.79103V10.0041H1.55655V8.79103C1.55655 8.36123 1.2081 8.01276 0.778275 8.01276C0.348448 8.01276 0 8.3612 0 8.79103V10.7824C0 11.2122 0.348448 11.5608 0.778275 11.5608H9.75554C10.1853 11.5608 10.5338 11.2122 10.5338 10.7824V8.79103C10.5338 8.3612 10.1853 8.01276 9.75552 8.01276Z" fill="#1C1C1E" />
                        <path d="M5.03137 8.84086C5.16101 8.97041 5.37161 8.97041 5.50112 8.84086L8.22864 6.11336C8.30811 6.03389 8.33172 5.91453 8.28874 5.8104C8.24577 5.7067 8.14472 5.63909 8.03212 5.63909H6.75144V0.607383C6.75144 0.271753 6.47969 0 6.14413 0H4.38877C4.05323 0 3.78146 0.27173 3.78146 0.607383V5.63909H2.50034C2.38785 5.63909 2.28681 5.70667 2.24383 5.8104C2.20086 5.91453 2.22449 6.03389 2.30384 6.11336L5.03137 8.84086Z" fill="#1C1C1E" />
                      </svg>
                    </span>
                  </button>
                )}
              </DropZone>
              <button type="button" className={classNames(styles["book-audio-items-btn"], styles["book-audio-items-link"])} onClick={toggleOpenPopupConfirm}>
                Очистить все
              </button>
            </div>
            <List
              values={activeTome.files}
              onChange={({ oldIndex, newIndex }) => onChangePositionItem(arrayMove(activeTome.files, oldIndex, newIndex))}
              renderList={({ children, props }) => <div className={styles["book-audio-items"]} {...props}>{children}</div>}
              renderItem={({ value, props, index }) => {
                if (value) {
                  return (
                    <div
                      {...props}
                      className={classNames(styles["book-audio-items-item"], "fadeIn")}
                    >
                      <div className={styles["book-audio-items-name"]}>
                        { getNameAudio(value, index) }
                      </div>
                      <button className={styles["book-audio-items-remove"]} type="button" onClick={() => onRemoveItem(index)}>
                        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.31253 1.62501H9.54692C10.1078 1.62501 10.5625 2.07973 10.5625 2.64064V3.45314C10.5625 3.67752 10.3807 3.85939 10.1563 3.85939H0.406252C0.181874 3.85939 0 3.67752 0 3.45314V2.64064C0 2.07973 0.454723 1.62501 1.01563 1.62501H3.25002V1.21876C3.25002 0.545647 3.79566 0 4.46877 0H6.09378C6.76689 0 7.31253 0.545647 7.31253 1.21876V1.62501ZM4.46877 0.812504C4.24482 0.812504 4.06252 0.994809 4.06252 1.21876V1.62501H6.50003V1.21876C6.50003 0.994809 6.31772 0.812504 6.09378 0.812504H4.46877ZM0.644265 4.80482C0.640812 4.7324 0.698576 4.67182 0.771066 4.67182H9.79169C9.86418 4.67182 9.92194 4.7324 9.91849 4.80482L9.58333 11.8391C9.55235 12.4901 9.01762 13 8.3661 13H2.19665C1.54513 13 1.0104 12.4901 0.979423 11.8391L0.644265 4.80482ZM7.31263 5.2812C7.08818 5.2812 6.90638 5.46299 6.90638 5.68745V10.9687C6.90638 11.1932 7.08818 11.375 7.31263 11.375C7.53709 11.375 7.71889 11.1932 7.71889 10.9687V5.68745C7.71889 5.46299 7.53709 5.2812 7.31263 5.2812ZM5.28138 5.2812C5.05692 5.2812 4.87512 5.46299 4.87512 5.68745V10.9687C4.87512 11.1932 5.05692 11.375 5.28138 11.375C5.50583 11.375 5.68763 11.1932 5.68763 10.9687V5.68745C5.68763 5.46299 5.50583 5.2812 5.28138 5.2812ZM3.25012 5.2812C3.02566 5.2812 2.84386 5.46299 2.84386 5.68745V10.9687C2.84386 11.1932 3.02566 11.375 3.25012 11.375C3.47457 11.375 3.65637 11.1932 3.65637 10.9687V5.68745C3.65637 5.46299 3.47457 5.2812 3.25012 5.2812Z" fill="#1C1C1E" />
                        </svg>
                      </button>
                    </div>
                  )
                }
              }}
            />
          </>
        ) : (
          <DropZone multiple={true} onDrop={(file) => addFiles(file)} accept=".mp3,audio/*">
            {() => (
              <div className={classNames(styles["book-audio-drop-zone"], "fadeIn")}>
                <div className={styles["book-audio-drop-zone-icon"]}>
                  <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.6956 16.6343C19.8033 16.6343 19.0798 17.3577 19.0798 18.25V20.7684H3.67473V18.25C3.67473 17.3578 2.95136 16.6343 2.05904 16.6343C1.16673 16.6343 0.443359 17.3577 0.443359 18.25V22.3841C0.443359 23.2764 1.16673 24 2.05904 24H20.6957C21.5879 24 22.3114 23.2764 22.3114 22.3841V18.25C22.3114 17.3577 21.5879 16.6343 20.6956 16.6343Z" fill="#808080" />
                    <path d="M10.8875 18.3535C11.1566 18.6224 11.5938 18.6224 11.8627 18.3535L17.525 12.6912C17.6899 12.5262 17.7389 12.2784 17.6497 12.0623C17.5605 11.847 17.3507 11.7067 17.117 11.7067H14.4583V1.26092C14.4583 0.564154 13.8942 0 13.1976 0H9.55346C8.85689 0 8.29269 0.564106 8.29269 1.26092V11.7067H5.63312C5.39959 11.7067 5.18981 11.847 5.1006 12.0623C5.01139 12.2784 5.06045 12.5262 5.22518 12.6912L10.8875 18.3535Z" fill="#808080" />
                  </svg>
                </div>
                <div className={styles["book-audio-drop-zone-text"]}>
                  Перетащите файлы <br />или нажмите на кнопку чтобы загрузить
                </div>
              </div>
            )}
          </DropZone>
        )}
      </div>
      { activePopupConfirm && (
        <Popup
          className={styles["book-audio-confirm"]}
          onClosePopup={toggleOpenPopupConfirm}
        >
          <MessagePopup
            onClosePopup={toggleOpenPopupConfirm}
            onCallBack={onRemoveAllItems}
            isShowButtons={true}
            title="Очистить добавлены файлы?"
            text="Весь список добавленных файлов будет очищено навсегда"
          />
        </Popup>
      )}
    </div>
  )
};

BookAudio.defaultProps = {
  bookName: "",
  setAudioData: () => {},
  setRemoveAudioData: () => {},
  audioFiles: []
};

BookAudio.propTypes = {
  bookName: PropTypes.string,
  setAudioData: PropTypes.func,
  setRemoveAudioData: PropTypes.func,
  audioFiles: PropTypes.arrayOf(PropTypes.shape({
    files: PropTypes.array,
    isActive: PropTypes.bool,
    name: PropTypes.string
  }))
};

export default BookAudio;