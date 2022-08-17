import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import styles from "./footer.module.scss";

const Footer = () => {

  return (
    <footer className={classNames(styles["footer"], "fadeIn")}>
      <div className="wr">
        <div className={styles["footer-copyright"]}>
          <p><Link to="">Политика конфиденциальности</Link></p>
          <p><strong>Anibelika 2021</strong></p>
        </div>
      </div>
    </footer>
  )
};

export default Footer;