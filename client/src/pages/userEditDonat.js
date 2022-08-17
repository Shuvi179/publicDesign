import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateDonateInformation } from "../apiServices/apiUser";
import useAuth from "../hooks/useAuth";

import TextField from "../components/shared/textField";
import Button from "../components/shared/button";

const UserEditDonat = () => {
  const { userData, updateUserData } = useAuth();
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  
  const onSubmit = async (data) => {
    const res = await updateDonateInformation(data);
    if (res.error) {
      setErrorMessage(res.error)
    } else {
      updateUserData({
        ...userData,
        donat: res
      });
      history.push('/user');
    }
  };

  return (
    <div className="user-page user-page-form page-full">
      <div className="wr">
        <h1 className="user-title">Аккаунт</h1>
        <form className="user-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="user-form-title">Донати</div>
          <div className="user-form-fields">
            <TextField
              label="Карта 1"
              name="cardOne"
              defaultValue={userData?.donat?.cards?.[0]}
              placeholder="Карта 1"
              register={register}
              required={{ required: "Поле обязательное " }}
              error={errors.cardOne?.message}
            />
            <TextField
              label="Карта 2"
              defaultValue={userData?.donat?.cards?.[1]}
              name="cardTwo"
              placeholder="Карта 2"
              register={register}
            />
            <TextField
              label="Сcылка на donationalerts"
              name="link"
              defaultValue={userData?.donat?.link}
              placeholder="Сcылка на donationalerts"
              register={register}
              required={{ required: "Поле обязательное " }}
              error={errors.link?.message}
            />
          </div>
          {Boolean(errorMessage) && (
            <div className="user-form-error-message form-error-message">
              { errorMessage}
            </div>
          )}
          <div className="user-form-bottom">
            <Button theme="button-border" isLink={true} to="/user">Назад</Button>
            <Button type="submit" isLoading={isSubmitting}>Сохранить</Button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default UserEditDonat;