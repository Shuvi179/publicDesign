import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import { registrationThroughSocialNetworks } from "../../../apiServices/apiUser";

import TextField from "../../shared/textField";
import Button from "../../shared/button";
import {CONFIRM_EMAIL_USER_POPUP} from "../../../constant";

const RegistrationSocialForm = ({ toggleOpenPopup, email, clientId, identification }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    data.clientId = clientId;
    data.identification = identification;
    const res = await registrationThroughSocialNetworks(data);
    if (res.error) {
      setErrorMessage(res.error);
    } else {
      toggleOpenPopup(CONFIRM_EMAIL_USER_POPUP, res);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <h4 className="form-title">Регистрация</h4>
      <div className="form-text">Пожалуйста, дополните свои данные для завершения регистрации</div>
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
            defaultValue={Boolean(email) ? email : ""}
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

RegistrationSocialForm.defaultProps = {
  toggleOpenPopup: () => {}
};

RegistrationSocialForm.propTypes = {
  toggleOpenPopup: PropTypes.func
};

export default RegistrationSocialForm;