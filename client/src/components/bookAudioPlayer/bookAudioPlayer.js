import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useTranslation } from 'react-i18next';

import AudioPlayer from 'react-h5-audio-player';

import Spinner from "../shared/spinner";

import 'react-h5-audio-player/lib/styles.css';

import styles from "./bookAudioPlayer.module.scss";

const BookAudioPlayer = ({ audioFiles, isLoading, activeAudio, onSaveBookAudio, fetchUrl }) => {
  const { t } = useTranslation();
  const [isFirstStart, setIsFirstStart] = useState(false);
  const [audio, setAudio] = useState([]);
  const [activeTome, setActiveTome] = useState();
  const [audioActiveId, setAudioActiveId] = useState();
  const [audioUrl, setAudioUrl] = useState();

  useEffect(() => {
    if (audioFiles) {
      setAudio(audioFiles);
      onChangeActiveTome(audioFiles, Boolean(activeAudio));
    }
  }, [audioFiles]);

  const onChangeTome = (ind) => {
    const _audio = audio.map((z, i) => {
      z.isActive = i === ind;
      return z;
    });
    setAudio(_audio);
    onChangeActiveTome(_audio);
  };

  const onChangeActiveTome = (data, firstInit = false) => {
    const _activeTome = data.find((z) => z.isActive === true);
    if (_activeTome && _activeTome.files && _activeTome.files.length > 0) {
      setActiveTome(_activeTome.files);
      // if we have history
      // set active audio
      if (firstInit) {
        const _audio = _activeTome?.files?.find(z => z.number === activeAudio.number);
        onAudioUrl(_audio);
      }
    } else {
      setActiveTome("");
      onChangeId();
    }
  };

  const onAudioUrl = (audio) => {
    // set audio
    if (audio) {
      onChangeId(audio.id);
      return;
    }
    if (activeTome && activeTome.files && activeTome.files.length > 0) {
      onChangeId(activeTome.files[0].id);
    } else {
      onChangeId();
    }
  };

  const onLoadNextAudio = () => {
    // change audio
    const _activeIndex = activeTome.findIndex(z => z.id === audioActiveId);
    if (activeTome[_activeIndex + 1]) {
      onChangeId(activeTome[_activeIndex + 1].id);
      return;
    }
    // change tom
    const _activeIndexTome = audioFiles.findIndex((z) => z.isActive === true);
    if (audioFiles[_activeIndexTome + 1]) {
      onChangeTome(_activeIndexTome + 1);
      onChangeId(audioFiles[_activeIndexTome + 1]?.files?.[0]?.id);
    }
  };

  const handlerSaveBookAudio = (audioTime) => {
    const _audio = activeTome.find(z => z.id === audioActiveId);
    if (_audio.id) {
      onSaveBookAudio(_audio.id, audioTime);
    }
  };

  const audioName = (number) => {
    switch (number) {
      case -1:
        return t("tom_oprions_prologue")
      case -2:
        return t("tom_oprions_epilogue")
      case -3:
        return t("tom_oprions_afterword")
      default:
        return `Глава ${number + 1}`
    }
  };

  const onChangeId = async (id) => {
    setAudioActiveId(id);
    const url = await fetchUrl(id);
    setAudioUrl(url);
  };

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className={classNames(styles["book-player"], "book-player", "fadeIn")}>
      <div className={styles["book-player-toms"]}>
        <div className={styles["book-player-control"]}>
          <AudioPlayer
              layout="stacked-reverse"
              showJumpControls={true}
              progressJumpSteps={{ backward: 30000, forward: 30000 }}
              onPlay={() => {
                if (!isFirstStart) setIsFirstStart(true);
              }}
              listenInterval={20000}
              onListen={event => {
                handlerSaveBookAudio(event.target.currentTime);
              }}
              onLoadedMetaData={event => {
                if (activeAudio && activeAudio.time) {
                  event.target.currentTime = activeAudio.time;
                  activeAudio.time = undefined
                }
              }}
              src={audioUrl}
              autoPlayAfterSrcChange={isFirstStart}
              onEnded={onLoadNextAudio}
          />
        </div>
        <div className={styles["book-player-toms-list"]}>
          <div className={styles["book-player-list"]}>
            {activeTome && activeTome.length > 0 ? activeTome.map((z, i) => (
              <div
                className={classNames(styles["book-player-item"], { [styles["active"]]: z.id === audioActiveId })}
                key={`book-player-item_${i}`}
                onClick={() => {
                  if (!isFirstStart) setIsFirstStart(true);
                  onChangeId(z.id);
                }}
                role="button"
              >
                <div className={styles["book-player-item-name"]}>
                  { audioName(z.number) }
                </div>
                <div className={styles["book-player-item-time"]}>
                  {z?.time || "00:00"}
                </div>
              </div>
            )) : "Файлов для прослушиваний пока нет"}
          </div>
        </div>
      </div>
      <div className={styles["book-player-items"]}>
        <div className={styles["book-player-list"]}>
          {audio && audio.length > 0 ? audio.map((z, i) => (
            <div
              className={classNames(styles["book-player-item"], { [styles["active"]]: z.isActive })}
              key={`book-player_${i}`}
              role="button"
              onClick={() => onChangeTome(i)}
            >
              {`Том ${i + 1}. ${audioFiles[0].name}`}
            </div>
          )) : "Файлов для прослушиваний пока нет"}
        </div>
      </div>
    </div>
  )
};

BookAudioPlayer.defaultProps = {
  audioFiles: [],
  isLoading: false,
  activeAudio: {},
  onSaveBookAudio: () => { }
};

BookAudioPlayer.propTypes = {
  audioFiles: PropTypes.arrayOf(PropTypes.shape({
    files: PropTypes.array,
    isActive: PropTypes.bool,
    name: PropTypes.string
  })),
  isLoading: PropTypes.bool,
  activeAudio: PropTypes.object,
  onSaveBookAudio: PropTypes.func
};

export default BookAudioPlayer;