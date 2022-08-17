import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";

import styles from "./button.module.scss";

const Button = ({
  children,
  className,
  isLink,
  onClick,
  isDisabled,
  theme,
  type,
  to,
  isLoading
}) => {
  
  if (isLink) {
    return (
      <>
        {/^(http|https)/.test(to) ? (
          <a
            className={classNames(styles["button"], styles[theme], className)}
            href={to}
          >
            { children}
          </a>
        ) :
        <Link
          className={classNames(styles["button"], styles[theme], className)}
          to={to}
        >
          { children}
        </Link>
        }
      </>
    )
  }

  return (
    <button
      className={classNames(styles["button"], styles[theme], className)}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      type={type}
    >
      {children}
      {isLoading && <span className={styles["button-spinner"]}></span>}
    </button>
  )
};

Button.defaultProps = {
  theme: "button-gray",
  type: "text",
  to: "/",
  onClick: () => { },
  isDisabled: false,
  isLink: false,
  isLoading: false
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  type: PropTypes.string,
  to: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLink: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  theme: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(["button-gray", "button-white", "button-border", "link"]),
  ])
};

export default Button;