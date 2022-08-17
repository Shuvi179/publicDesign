import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import { addNewUser } from "../../../apiServices/apiUser";

import TextField from "../../shared/textField";
import Button from "../../shared/button";

import { LOG_IN_POPUP, CONFIRM_EMAIL_USER_POPUP } from "../../../constant";

const RegistrationForm = ({ toggleOpenPopup }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    const res = await addNewUser(data);
    if (res.error) {
      setErrorMessage(res.error)
    } else {
      toggleOpenPopup(CONFIRM_EMAIL_USER_POPUP, data);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <h4 className="form-title">Регистрация</h4>
      <div className="form-text">Уже есть аккаунт? <button type="button" onClick={toggleOpenPopup.bind(null, LOG_IN_POPUP)}>Авторизироваться</button></div>
      <div className="form-row">
        <Button isLink={true} to="https://www.anibelika.com/oauth2/authorization/google" theme="button-white" className="form-btn">Продолжить с Google</Button>
      </div>
      <div className="form-row">
        <Button isLink={true} to="https://oauth.vk.com/authorize?client_id=7759596&redirect_uri=https://www.anibelika.com&scope=email&display=page&v=5.130&response_type=code" theme="button-white" className="form-btn">Продолжить с VK</Button>
      </div>
      <div className="form-row">
        <Button isLink={true} to="https://www.anibelika.com/oauth2/authorization/facebook" theme="button-white" className="form-btn">Продолжить с Facebook</Button>
      </div>
      <div className="form-line">
        <span className="form-line-text">или</span>
      </div>
      <div className="form-row">
        <TextField
          name="nickName"
          placeholder="Никнейм"
          register={register}
          required={{ required: "Поле обязательное " }}
          error={errors.nickName?.message}
        />
      </div>
      <div className="form-row">
        <TextField
            type="email"
            name="email"
            placeholder="Почта"
            register={register}
            required={{ required: "Поле обязательное " }}
            error={errors.email?.message}
          />
      </div>
      <div className="form-row">
        <TextField
            type={ showPassword ? "text" : "password" }
            name="password"
            placeholder="Пароль"
            className="has-icon"
            register={register}
            required={{ required: "Поле обязательное " }}
            error={errors.password?.message}
          >
            <button className="form-field-ico" type="button" onClick={() => {setShowPassword(!showPassword)}}>
              { showPassword ? (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32">
                  <path d="M16 9v0 0c9 0 13 7 13 7s-4 7-13 7c-9 0-13-7-13-7s4-7 13-7zM16 10c-8 0-11.8 6-11.8 6s3.8 6 11.8 6c8 0 11.8-6 11.8-6s-3.8-6-11.8-6v0 0zM16 20v0 0c-2.209 0-4-1.791-4-4s1.791-4 4-4c2.209 0 4 1.791 4 4s-1.791 4-4 4zM16 19c1.657 0 3-1.343 3-3s-1.343-3-3-3c-1.657 0-3 1.343-3 3s1.343 3 3 3v0 0zM16 17c0.552 0 1-0.448 1-1s-0.448-1-1-1c-0.552 0-1 0.448-1 1s0.448 1 1 1v0 0z" fill="#B9B9C1"></path>
                </svg>
              ) : (
                <svg width="19" height="6" viewBox="0 0 19 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.6707 1.0515L17.8003 0.969172C18.0525 0.801214 18.1118 0.469603 17.9372 0.228352C17.7611 -0.0150493 17.4148 -0.0699825 17.1678 0.0956798C8.52593 5.91294 2.23526 0.381967 1.97099 0.144302C1.74799 -0.0566439 1.39657 -0.0464608 1.1889 0.166964C0.980199 0.381249 0.990329 0.716448 1.2111 0.918111C1.22302 0.929012 1.41981 1.10242 1.77897 1.35902L0.671982 3.11676C0.514075 3.36747 0.596902 3.69478 0.857448 3.84811C0.946532 3.89974 1.04768 3.92571 1.14555 3.92571C1.33162 3.92571 1.51276 3.83463 1.61808 3.67069L2.70049 1.95339C3.30739 2.3091 4.08561 2.69751 5.01279 3.02568L4.47933 4.74283C4.39099 5.02553 4.5562 5.32043 4.84803 5.40448L5.00713 5.42714C5.24295 5.42714 5.46342 5.27797 5.53522 5.04719L6.06347 3.35356C6.9193 3.57889 7.87672 3.73107 8.90997 3.76722V5.46802C8.90997 5.76234 9.15681 6 9.46249 6C9.76788 6 10.0149 5.76234 10.0149 5.46802V3.75775C10.9164 3.71013 11.8719 3.56082 12.8696 3.28687L13.5496 5.01348C13.6344 5.22619 13.8444 5.35643 14.0662 5.35643L14.2617 5.32286C14.547 5.21845 14.6916 4.91165 14.5832 4.63712L13.921 2.95482C14.8294 2.62995 15.7684 2.20224 16.7381 1.63483L17.6333 2.78529C17.7423 2.92427 17.9087 2.99886 18.075 2.99886C18.1909 2.99886 18.3066 2.96501 18.406 2.892C18.6509 2.71558 18.7004 2.38211 18.518 2.14731L17.6707 1.0515Z" fill="#B9B9C1"/>
                </svg>
              ) }
            </button>
          </TextField>
      </div>
      <div className="form-row">
        <TextField
            type="checkbox"
            name="privacyPolicy"
            register={register}
            required={{ required: "Поле обязательное " }}
            error={errors.privacyPolicy?.message}
          >
            Согласен с Политикой конфиденциальности
          </TextField>
      </div>
      { Boolean(errorMessage) && (
        <div className="form-row form-error-message">
          { errorMessage }
        </div>
      )}
      <div className="form-bottom">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="form-btn gray"
        >
          Создать аккаунт
        </Button>
      </div>
    </form>
  )
};

RegistrationForm.defaultProps = {
  toggleOpenPopup: () => {}
};

RegistrationForm.propTypes = {
  toggleOpenPopup: PropTypes.func
};

export default RegistrationForm;