import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import styles from "./headerLocale.module.scss";

const _locales = [
  {
    code: "ua",
    name: "Українська"
  },
  {
    code: "ru",
    name: "Русский"
  },
  {
    code: "en",
    name: "English"
  }
];

const HeaderLocale = () => {
  const localeEl = useRef(null);
  const { i18n } = useTranslation();
  const [selectedLocale, setSelectedLocale] = useState("ru");
  const [openLocale, setOpenLocale] = useState(false);

  const handleClickOutside = (e) => {
    if (localeEl.current && !localeEl.current.contains(e.target)) {
      setOpenLocale(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onChangeLocale = (code) => {
    if (code !== openLocale) {
      setSelectedLocale(code);
      i18n.changeLanguage(code);
    }
    setOpenLocale(false);
  };

  return (
    <div ref={localeEl} className={classNames(styles["header-locale"], { [styles["open"]]: openLocale })}>
      <div
        onClick={setOpenLocale.bind(null, !openLocale)}
        className={styles["header-locale-selected"]}
        role="button"
      >
        { selectedLocale }
      </div>
      <div className={styles["header-locale-list"]}>
        {_locales.map((local, index) => (
          <div
            className={styles["header-locale-item"]}
            key={`header-locale-item_${index}`}
          >
            <button
              className={classNames(styles["header-locale-btn"], { [styles["selected"]]: local.code === selectedLocale })}
              type="button"
              onClick={onChangeLocale.bind(null, local.code)}
            >
              { local.name }
            </button>
          </div>
        ))}
      </div>
    </div>
  )
};

export default HeaderLocale;
