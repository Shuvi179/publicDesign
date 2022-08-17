import React from "react";
import classNames from "classnames";
import styles from "./spinner.module.scss";

const Spinner = () => {
  return (
    <div className={classNames(styles["loader"], "loader")}>
      <div className={classNames(styles["loader-spinner"], "loader-spinner")}></div>
    </div>
  )
};

export default Spinner;