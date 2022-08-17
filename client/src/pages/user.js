import React,  { useState }  from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import Popup from "../components/shared/popup";
import DonatForm from "../components/forms/donatForm";

const User = () => {
  const { userData } = useAuth();
  const [isShowPopup, setIsShowPopup] = useState(false);
  return (
    <div className="user-page page-full fadeIn">
      <div className="wr">
        <h1 className="user-title">Аккаунт</h1>
        <div className="user-info-row">
          <div className="user-info-item user-info-title">Общая информация</div>
          <div className="user-info-item">
            <p>{ userData?.name }</p>
            <p>{ userData?.email }</p>
            <p>пароль **********</p>
          </div>
          <div className="user-info-item user-info-title">
            <Link to="/user/edit" className="user-info-btn">Редактировать профиль</Link>
          </div>
        </div>
        { userData.isAuthor && (
          <div className="user-info-row">
            <div className="user-info-item user-info-title">Данати</div>
            <div className="user-info-item">
              { userData.donat && userData.donat.cards ? (
                <>
                  {userData.donat.cards.map((card, index) => <p key={`user-info-donat_${index}`}>{ card }</p>)}
                  <p><a href={userData.donat.link} target="_blank" title={userData.donat.link}>{ userData.donat.link }</a></p>
                </>
              ) : null }
            </div>
            <div className="user-info-item user-info-title">
              { userData.donat ? (
                <Link to="/user/edit-donat" className="user-info-btn">Редактировать информацию</Link>
              ) : (
                <div role="button" onClick={() => setIsShowPopup(true)} className="user-info-btn">Добавить информацию</div>
              ) }
            </div>
          </div>
        ) }
      </div>
      { isShowPopup && (
        <Popup
          onClosePopup={setIsShowPopup}
          className="form-popup popup-donat"
        >
          <DonatForm toggleOpenPopup={setIsShowPopup} />
        </Popup>
      )}
    </div>
  )
};

export default User;