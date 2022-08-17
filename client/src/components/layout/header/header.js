import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import classNames from "classnames";

import {
  getConfirmUser,
  getCurrentSocialUserInfo,
  getCurrentUser, getCurrentVkUser,
  resendEmailMessage
} from "../../../apiServices/apiUser";

import HeaderLocale from "../headerLocale";
import HeaderSearch from "../headerSearch";

import Popup from "../../shared/popup";
import Button from "../../shared/button";

import LogInForm from "../../forms/logInForm";
import RegistrationForm from "../../forms/registrationForm";
import ResetPassword from "../../forms/resetPassword";
import ConfirmResetPassword from "../../forms/confirmResetPassword";
import MessagePopup from "../../shared/messagePopup";

import styles from "./header.module.scss";

import useAuth from "../../../hooks/useAuth";

import {
  LOG_IN_POPUP,
  REGISTRATION_POPUP,
  RESET_PASSWORD_POPUP,
  CONFIRM_USER_POPUP,
  CONFIRM_EMAIL_USER_POPUP,
  CONFIRM_RESET_PASSWORD_POPUP,
  SOCIAL_NETWORK_REGISTRATION_POPUP
} from "../../../constant";
import RegistrationSocialForm from "../../forms/registrationSocialForm";

const Header = () => {
  const { userData, updateUserData, userLogOut } = useAuth();
  const location = useLocation();
  const history = useHistory();
  const [activePopup, setActivePopup] = useState(null);
  const [popupData, setPopupData] = useState(null);

  const toggleOpenPopup = (name, data = null) => {
    setPopupData(data);
    if (Boolean(name) && Boolean(activePopup)) {
      document.body.style.overflow = "hidden";
      setActivePopup("");
      setTimeout(() => setActivePopup(name), 50);
      return;
    }
    document.body.style.overflow = Boolean(name) ? "hidden" : "";
    setActivePopup(name);
  };

  const showPopup = () => {
    switch(activePopup) {
      case LOG_IN_POPUP: return <LogInForm toggleOpenPopup={toggleOpenPopup} logIn={updateUserData} />;
      case REGISTRATION_POPUP: return <RegistrationForm toggleOpenPopup={toggleOpenPopup} />;
      case RESET_PASSWORD_POPUP: return <ResetPassword toggleOpenPopup={toggleOpenPopup} />;
      case CONFIRM_RESET_PASSWORD_POPUP: return <ConfirmResetPassword toggleOpenPopup={toggleOpenPopup} {...popupData} />;
      case CONFIRM_USER_POPUP: return <MessagePopup title="Вітаємо!" text="Ваш аккаунт успішно підтверджено." />;
      case SOCIAL_NETWORK_REGISTRATION_POPUP: return <RegistrationSocialForm toggleOpenPopup={toggleOpenPopup} {...popupData}/>;
      case CONFIRM_EMAIL_USER_POPUP: return (
        <MessagePopup title="Підтвердження аккаунта" text={`На пошту ${popupData && popupData.email ? popupData.email : 'example@gmail.com'} було надіслано інструкцію для підтвердження аккаунта`}>
          <a className="link" href="https://www.google.com/intl/ru/gmail/about/" target="_blank" rel="noreferrer">
            <span className="link-icon">
              <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.64153 0.78125H1.59375C1.15731 0.78125 0.801243 1.12536 0.782063 1.55707L8.02312 7.72977L15.1477 1.261C15.0206 0.978186 14.7364 0.78125 14.4062 0.78125H13.7301L8.28463 5.4223L8.02372 5.64467L7.76936 5.41483L2.64153 0.78125ZM3.8068 0.78125L8.03878 4.60533L12.5257 0.78125H3.8068ZM0.78125 10.8125V2.58297L2.45312 4.00817V11.625H1.59375C1.14502 11.625 0.78125 11.2612 0.78125 10.8125ZM3.23438 11.625H12.7031V4.53579L8.29383 8.5392L8.03938 8.77023L7.77784 8.54727L3.23438 4.67416V11.625ZM13.4844 3.82645V11.625H14.4062C14.855 11.625 15.2188 11.2612 15.2188 10.8125V2.25173L13.4844 3.82645ZM1.59375 0C0.713546 0 0 0.713547 0 1.59375V10.8125C0 11.6927 0.713546 12.4062 1.59375 12.4062H14.4062C15.2865 12.4062 16 11.6927 16 10.8125V1.59375C16 0.713546 15.2865 0 14.4062 0H1.59375Z" fill="#8A8A8E"/>
              </svg>
            </span>
            Відкрити Gmail
          </a>
        </MessagePopup>
      );
      default: return ""
    }
  };

  const confirmUser = async (id) => {
    const res = await getConfirmUser(id);
    if (res) {
      toggleOpenPopup(CONFIRM_USER_POPUP);
      history.replace({
        search: ""
      })
    }
  };

  useEffect(() => {
    const confirmId = new URLSearchParams(location.search).get("confirm");
    const passwordResetId = new URLSearchParams(location.search).get("passwordReset");
    const oauthLoginId = new URLSearchParams(location.search).get("oauthLogin");
    const vkLoginCode = new URLSearchParams(window.document.location.search).get('code');
    if (confirmId) {
      confirmUser(confirmId);
    }
    if (passwordResetId) {
      toggleOpenPopup(CONFIRM_RESET_PASSWORD_POPUP, { id: passwordResetId });
      history.replace({
        search: ""
      });
    }
    if (oauthLoginId) {
      onSocialLogin();
    }
    if (vkLoginCode) {
      onVkLogin(vkLoginCode);
    }
  }, []);

  const onSocialLogin = async () => {
    const res = await getCurrentSocialUserInfo();
    await baseSocialLogic(res);
  };

  const onVkLogin = async (code) => {
    const res = await getCurrentVkUser(code);
    await baseSocialLogic(res);
  };

  const baseSocialLogic = async (res) => {
    if (!res.error) {
      if (res.nickName !== undefined) {
        if (Boolean(res.created)) {
          toggleOpenPopup("", {email: res.email, needConfirm: true})
        } else {
          toggleOpenPopup(SOCIAL_NETWORK_REGISTRATION_POPUP, {email: res.email, identification: res.identification, clientId: res.clientId })
        }
      } else {
        const user = await getCurrentUser();
        updateUserData(user);
      }
    }
  };

  const onResendEmailMessage = async (email) => {
    const res = await resendEmailMessage(email);
    if (res) {
      setPopupData(null);
    }
  };

  const handlerUserLogOut = async () => {
    const res = await userLogOut();
    if (res) {
      history.push('/');
    }
  };

  return (
    <header className={classNames(styles["header"], { [styles["is-authorized"]]: Boolean(userData) }, "fadeIn")}>
      <div className={classNames("wr", styles["header-wr"])}>
        <div className={styles["header-left"]}>
          <Link to="/books" className={styles["header-logo"]}>
            Anibelika
          </Link>
        </div>
        <div className={styles["header-center"]}>
          <HeaderSearch />
        </div>
        <div className={styles["header-right"]}>
          { Boolean(userData) ? (
            <>
              { userData.isAuthor && (
                <Button isLink={true} to="/book/create" className={styles["header-btn"]}>
                  Добавить
                </Button>
              ) }
              <div className={styles["header-dropdown"]}>
                <Button className={classNames(styles["header-btn"], styles["header-btn-user"])} theme="button-white">
                  <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.3105 5.42231C13.3105 2.88529 11.2367 0.811401 8.69964 0.811401C6.16262 0.811401 4.08873 2.88529 4.08873 5.42231C4.08873 7.95933 6.16262 10.0332 8.69964 10.0332C11.2367 10.0332 13.3105 7.95933 13.3105 5.42231ZM0.78643 13.718C0.907253 13.416 1.06831 13.1341 1.24952 12.8723C2.17574 11.5031 3.60529 10.5971 5.21609 10.3756C5.41742 10.3555 5.63891 10.3957 5.8 10.5165C6.64568 11.1407 7.65241 11.4629 8.69945 11.4629C9.74649 11.4629 10.7532 11.1407 11.5989 10.5165C11.76 10.3957 11.9815 10.3353 12.1828 10.3756C13.7936 10.5971 15.2433 11.5031 16.1494 12.8723C16.324 13.1245 16.4799 13.4141 16.599 13.687C16.8585 14.0703 17 14.5145 17 15.0272C17 17.7416 13.0339 19.942 8.57447 19.942C4.11506 19.942 0.5 17.7416 0.5 15.0272C0.5 14.6032 0.588179 14.2261 0.753981 13.8914C0.748165 13.832 0.758982 13.7729 0.78643 13.718Z" fill="#8A8A8E"/>
                  </svg>
                </Button>
                <ul className={styles["header-dropdown-list"]}>
                  <li className={styles["header-dropdown-item"]}>
                    <strong>{ userData?.name }</strong>
                  </li>
                  <li className={styles["header-dropdown-item"]}>
                    <Link to="/user" className={styles["header-dropdown-link"]}>
                      Управлять аккаунтом
                    </Link>
                  </li>
                  <li className={styles["header-dropdown-item"]}>
                    <button className={styles["header-dropdown-btn"]} onClick={() => handlerUserLogOut()}>Выйти</button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Button className={styles["header-btn"]} theme="link" onClick={() => toggleOpenPopup(LOG_IN_POPUP)}>
                Войти
              </Button>
              <Button className={styles["header-btn"]} onClick={() => toggleOpenPopup(REGISTRATION_POPUP)}>
                Регистрация
              </Button>
            </>
          ) }
          <HeaderLocale />
        </div>
      </div>
      {Boolean(activePopup) && (
        <Popup
          className={`form-popup ${activePopup}`}
          onClosePopup={toggleOpenPopup.bind(null, null, popupData)}
        >
          {showPopup()}
        </Popup>
      )}
      {Boolean(popupData) && Boolean(popupData.email) && Boolean(popupData.needConfirm) && (
        <div className={styles["header-message"]}>
          <div className={styles["header-message-text"]}>
            <p>Ваш аккаунт не было подтверждено, пожалуйста, откройте инструкцию, которая была отправлена на адрес <u>{ popupData?.email }</u></p>
            <p>Не получили инструкцию? <button className={styles["header-message-btn"]} onClick={() => onResendEmailMessage(popupData?.email)}>Отправить снова</button></p>
            <button  onClick={toggleOpenPopup.bind(null, null)} className={styles["header-message-btn"]}>Закрыть</button>
          </div>
        </div>
      )}
    </header>
  )
};

export default Header;