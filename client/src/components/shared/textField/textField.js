import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import styles from "./textField.module.scss";

const TextField = ({
  children,
  isTextArea,
  type,
  label,
  name,
  defaultValue,
  placeholder,
  error,
  onChange,
  isDisabled,
  register,
  required
}) => {
  return (
    <>
      <label htmlFor={name} className={classNames(styles["text-field"], { [styles["field-error"]]: Boolean(error)}, { [styles["has-icon"]]: Boolean(children)}, "text-field")}>
        {Boolean(label) && <span className={classNames(styles["text-field-label"], "text-field-label")}>{ label }</span>}
          <div className={styles["text-field-inner"]}>
            {isTextArea ? (
              <textarea
                name={name}
                id={name}
                onChange={onChange}
                placeholder={placeholder}
                disabled={isDisabled}
                className={classNames(styles["text-field-input"], styles["text-field-textarea"])}
                {...register(name, { ...required })}
              >
              </textarea>
            ) : (
              <input
                name={name}
                id={name}
                type={type}
                defaultValue={defaultValue}
                onChange={onChange}
                placeholder={placeholder}
                disabled={isDisabled}
                className={styles["text-field-input"]}
                {...register(name, { ...required })}
              />
            )}
          <span className={type === "checkbox" ? styles["text-field-text"] : ""}>{children}</span>
        </div>
      </label>
      {Boolean(error) && <div className={classNames(styles["text-field-error-text"], "text-field-error-text")}>{error}</div>}
    </>
  );
}

TextField.defaultProps = {
  type: "text",
  isTextArea: false,
  label: "",
  placeholder: "",
  error: "",
  isDisabled: false,
  required: {},
  onChange: () => {}
};

TextField.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  error: PropTypes.string,
  isDisabled: PropTypes.bool,
  isTextArea: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  defaultValue: PropTypes.string,
  required: PropTypes.object,
};

export default TextField;
