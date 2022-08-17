import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import { updateDonateInformation } from "../../../apiServices/apiUser";

import TextField from "../../shared/textField";
import Button from "../../shared/button";

const DonatForm = ({ toggleOpenPopup }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    const res = await updateDonateInformation(data);
    if (res.error) {
      setErrorMessage(res.error)
    } else {
      toggleOpenPopup(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <h4 className="form-title">Донаты</h4>
      <div className="form-text">Пожалуйста, добавьте информацию о донаты, чтобы слушатели смогли поддержать Вас и вашу работу</div>
      <div className="form-row">
        <TextField
          name="cardOne"
          placeholder="Карта 1"
          register={register}
        />
      </div>
      <div className="form-row">
        <TextField
          name="cardTwo"
          placeholder="Карта 2"
          register={register}
        />
      </div>
      <div className="form-row">
        <TextField
          name="link"
          placeholder="Сcылка на donationalerts"
          register={register}
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
            Добавить информацию
        </Button>
      </div>
    </form>
  )
};

DonatForm.defaultProps = {
  toggleOpenPopup: () => {}
};

DonatForm.propTypes = {
  toggleOpenPopup: PropTypes.func
};

export default DonatForm;