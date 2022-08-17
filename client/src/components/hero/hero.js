import React from "react";
import { useTranslation } from 'react-i18next';

import Button from "../shared/button";

import styles from "./hero.module.scss";

const Hero = () => {
  const { t } = useTranslation();
  return (
    <div className={styles["hero"]}>
      <div className={styles["hero-wr"]}>
        <div className="wr">
          <h1 className={styles["hero-title"]}>ANIBELIKA</h1>
          <div className={styles["hero-text"]}>{t("home_page_text")}</div>
          <Button isLink={true} to="/books" theme="button-white">{t("home_page_button")}</Button>
        </div>
      </div>
    </div>
  )
};

export default Hero;