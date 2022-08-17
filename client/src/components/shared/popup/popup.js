import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import styles from "./popup.module.scss";

const Popup = ({
  children,
  className,
  isOpen,
  onClosePopup
}) => {
  return (
    <div className={classNames(styles["popup"], { "open": isOpen }, className, "fade-in")}>
      <div className={styles["popup-bg-close"]} role="button" onClick={() => onClosePopup(false)}></div>
      <div className={classNames(styles["popup-wr"], "popup-wr")}>
        <div className={styles["popup-content"]}>
          <div className={classNames(styles["popup-inner"], "popup-inner")}>
            <button className={styles["popup-btn-close"]} type="button" onClick={() => onClosePopup(false)}></button>
            { children }
          </div>
        </div>
      </div>
    </div>
  )
};

Popup.defaultProps = {
  onClosePopup: () => {},
  isOpen: false
};

Popup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClosePopup: PropTypes.func,
  isOpen: PropTypes.bool
};

export default Popup;