import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import { resetPassWord } from "../../../apiServices/apiUser";

import TextField from "../../shared/textField";
import Button from "../../shared/button";

import { LOG_IN_POPUP } from "../../../constant";

const ResetPassword = ({ toggleOpenPopup }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    const res = await resetPassWord(data.email, true);
    if (res.error) {
      setErrorMessage(res.error)
    } else {
      toggleOpenPopup("");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <h4 className="form-title">Восстановить пароль</h4>
      <div className="form-text">Вспомнили пароль? <button type="button" onClick={toggleOpenPopup.bind(null, LOG_IN_POPUP)}>Авторизация</button></div>
      <div className="form-row">
        <TextField
          type="email"
          name="email"
          placeholder="Пошта"
          register={register}
          required={{ required: "Поле обязательное " }}
          error={errors.email?.message}
        />
      </div>
      { Boolean(errorMessage) && (
        <div className="form-row form-error-message">
          { errorMessage }
        </div>
      )}
      <div className="form-bottom">
        <Button type="submit" isLoading={isSubmitting} className="form-btn gray">Отправить инструкцию</Button>
      </div>
    </form>
  )
};

ResetPassword.defaultProps = {
  toggleOpenPopup: () => {}
};

ResetPassword.propTypes = {
  toggleOpenPopup: PropTypes.func
};

export default ResetPassword;