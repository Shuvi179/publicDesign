import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./uiSelect.module.scss";

const UiSelect = ({
  isMultiSelect,
  onChange,
  label,
  options,
  onReset,
  isDefaultSelect,
  placeholder,
  error
}) => {
  const selectEl = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (e) => {
    if (selectEl.current && !selectEl.current.contains(e.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  const changeOption = (option) => {
    if (!isMultiSelect) {
      setIsOpen(false);
      if (!option.isActive) {
        onChange({
          ...option,
          isActive: true
        })
      }
    } else {
      onChange({
        ...option,
        isActive: !option.isActive
      })
    }
  }

  const checkedItems = () => {
    const selectedItems = options && options.filter((z) => z.isActive);
    if (selectedItems && selectedItems.length) {
      if (isDefaultSelect) {
        if (isMultiSelect) {
          return selectedItems.map((z, i) => (
            <div
              className={classNames(styles["ui-select--toggle-name"], "ui-select--toggle-name")}
              key={`ui-select--toggle-name_${i}`}
            >
              <span>{ z.label }</span>
              {isMultiSelect && <button type="button" className={styles["ui-select--toggle-close"]} onClick={() => onReset(z)}></button>}
            </div>
          ))
        }
        return selectedItems[0].label;
      }
      let label = selectedItems[0].label;
      if (isMultiSelect) {
        let selectedItemsStr = selectedItems.length > 1 ? selectedItems.map((z) => z.label).join(", ") : selectedItems[0].label;
        label = selectedItemsStr;
      }
      return (
        <div className={classNames(styles["ui-select--toggle-name"], "ui-select--toggle-name")}>
          <span>{ label }</span>
          {selectedItems.length > 1 ? <div className={styles["ui-select--tooltip"]}>{ label }</div> : null}
          {isMultiSelect && <button type="button" className={styles["ui-select--toggle-close"]} onClick={() => onReset()}></button>}
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={selectEl} className={classNames(styles["ui-select"], { [styles["is-open"]]: isOpen }, "ui-select", { [styles["ui-select-error"]]: Boolean(error)}, { [styles["ui-select-default"]]: isDefaultSelect })}>
      {isDefaultSelect ? (
        <>
          <div className={classNames(styles["ui-select--toggle-label"], styles["ui-select-default--toggle-label"], "ui-select--toggle-label")}>
            { label }
          </div>
          <div
            className={classNames(styles["ui-select--toggle-name"], "ui-select--toggle-name", { [styles["ui-select-default--toggle-name"]]: isDefaultSelect })}
            onClick={toggleDropdown}
            onKeyDown={toggleDropdown}
            role="button"
            tabIndex={0}
          >
            <span>{ placeholder }</span>
          </div>
          { isMultiSelect && checkedItems() }
        </>
      ) : (
        <>
          <div
            className={styles["ui-select--toggle-label"]}
            onClick={toggleDropdown}
            onKeyDown={toggleDropdown}
            role="button"
            tabIndex={0}
          >
            { label }
          </div>
          { checkedItems() }
        </>
      )}
      <div className={classNames(styles["ui-select--inner"], "ui-select--inner")}>
        <div className={styles["ui-select--inner-content"]}>
          {options && options.map((option, index) => {
            if (isMultiSelect) {
              return (
                <div
                  className={classNames(styles["ui-select--multi-item"], { [styles["is-active"]]: option.isActive })}
                  onClick={() => changeOption(option)}
                  key={`ui-select--multi-item_${index}`}
                  onKeyDown={() => {}}
                  role="button"
                  tabIndex={0}>
                  <span>{option.label}</span>
                </div>
              );
            }
            return (
              <div
                className={classNames(styles["ui-select--item"], { [styles["is-active"]]: option.isActive })}
                onClick={() => changeOption(option)}
                key={`ui-select--item_${index}`}
                onKeyDown={() => {}}
                role="button"
                tabIndex={0}>
                <span>{option.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      {Boolean(error) && <div className={classNames(styles["ui-select-error-text"], "ui-select-error-text")}>{error}</div>}
    </div>
  )
};

UiSelect.propTypes = {
  isMultiSelect: PropTypes.bool,
  isDefaultSelect: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onReset: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
    isActive: PropTypes.bool
  }))
};

UiSelect.defaultProps = {
  isMultiSelect: false,
  isDefaultSelect: false,
  placeholder: "",
  error: "",
  options: [],
  onReset: () => {},
  onChange: () => {}
}

export default UiSelect;
