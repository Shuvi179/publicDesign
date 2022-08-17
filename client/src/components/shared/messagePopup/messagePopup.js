import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Button from "../button";
import styles from "./messagePopup.module.scss";

const MessagePopup = ({
  children, title, text,
  isShowButtons, onClosePopup, buttonTextClose,
  buttonText, onCallBack
}) => {
  return (
    <div className={styles["message-popup"]}>
      { Boolean(title) && <div className={styles["message-popup-title"]}>{ title }</div>}
      { Boolean(text) && <div className={classNames(styles["message-popup-text"], "message-popup-text")}>{ text }</div> }
      {isShowButtons && (
        <div className={styles["message-popup-buttons"]}>
          <Button type="button" className={classNames(styles["message-popup-button"], styles["close"])} theme="link" onClick={() => onClosePopup()}>{ buttonTextClose }</Button>
          <Button type="button" className={styles["message-popup-button"]} theme="link" onClick={() => onCallBack()}>{ buttonText }</Button>
        </div>
      )}
      { children }
    </div>
  )
};

MessagePopup.defaultProps = {
  isShowButtons: false,
  buttonTextClose: "Скасувати",
  buttonText: "Очистити",
  onClosePopup: () => {},
  onCallBack: () => {}
}

MessagePopup.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  text: PropTypes.string,
  buttonText: PropTypes.string,
  buttonTextClose: PropTypes.string,
  isShowButtons: PropTypes.bool,
  onClosePopup: PropTypes.func,
  onCallBack: PropTypes.func
}

export default MessagePopup;