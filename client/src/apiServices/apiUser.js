import {_prefix, instance} from "./index";

const mapDonat = (data) => {
  const cards = [];
  if (data) {
    if (data?.firstCard) cards.push(data?.firstCard)
    if (data?.secondCard) cards.push(data?.secondCard)
    return {
      cards,
      link: data?.donationAlertsUrl
    }
  }
  return false;
};


/**
 * @param {{
 * email: string
 * password: string
 * }} data
 * @returns {Promise<{content: Object} | null}
 **/
export const logInUser = async ({ email, password }) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);
  try {
    const res = await instance.post(`/login`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if (res.status === 200) {
      return await getCurrentUser();
    }
    return false;
  } catch (err) {
    console.warn(err, '-> log in user');
    return {
      error: err?.response?.data?.message || "Something went wrong",
      status: err?.response?.status
    }
  }
};


/**
 * @returns {Promise<boolean | null}
 **/
export const logOutUser = async () => {
  try {
    const res = await instance.post(`/logout`);
    return res.status === 200;
  } catch (err) {
    console.warn(err, '-> log out user');
    return false
  }
};


/**
 * @returns {Promise<{content: Object} | null}
 **/
export const getCurrentUser = async () => {
  try {
    const res = await instance.get(`${_prefix}/user/current`);
    let donat = null;
    if (res?.data?.id) {
      donat = await getDonateInformation(res?.data?.id);
    }
    return {
      id: res.data.id,
      isAuthor: res.data?.author,
      email: res.data.email,
      name: res.data.nickName,
      donat
    }
  } catch (err) {
    console.warn(err, '-> log in user');
    return {
      error: err?.response?.data?.message || "Something went wrong"
    }
  }
};

/**
 * @param {{
 * email: string
 * nickName: string
 * password: string
 * }} data
 * @returns {Promise<{content: Object} | null}
 **/
export const addNewUser = async (data) => {
  try {
    const res = await instance.post(`${_prefix}/user`, data);
    return {
      id: res.data.id,
      email: res.data.email,
      userName: res.data.nickName
    }
  } catch (err) {
    console.warn(err, '-> add new user');
    return {
      error: err?.response?.data?.message || "Something went wrong"
    }
  }
};


/**
 * @param {{
 * email: string
 * nickName: string
 * }} data
 * @returns {Promise<{content: Object} | null}
 **/
export const registrationThroughSocialNetworks = async (data) => {
  try {
    const res = await instance.post(`${_prefix}/oauthLogin`, data);
    return {
      id: res.data.id,
      email: res.data.email
    }
  } catch (err) {
    console.warn(err, '-> registration through social networks');
    return {
      error: err?.response?.data?.message || "Something went wrong"
    }
  }
};

export const getCurrentSocialUserInfo = async () => {
  try {
    const res = await instance.get(`${_prefix}/oauthLogin`);
    return {
      email: res.data.email,
      identification: res.data.identification,
      nickName: res.data.nickName,
      clientId: res.data.clientId,
      created: res.data.created
    }
  } catch (err) {
    console.warn(err, '-> get current social info');
    return {
      error: err?.response?.data?.message || "Something went wrong",
      status: err?.status
    }
  }
};

export const getCurrentVkUser = async (code) => {
  try {
    const res = await instance.get(`${_prefix}/vk/login?code=${code}`);
    return {
      email: res.data.email,
      identification: res.data.identification,
      nickName: res.data.nickName,
      clientId: res.data.clientId,
      created: res.data.created
    }
  } catch (err) {
    console.warn(err, '-> get current vk user info');
    return {
      error: err?.response?.data?.message || "Something went wrong",
      status: err?.status
    }
  }
};

/**
 * @param {value: string | Object} value
 * @returns {Promise<boolean | null}
 **/
export const resetPassWord = async (value, isStart) => {
  try {
    let res;
    if (isStart) {
      const params = new URLSearchParams();
      params.append('email', value);
      res = await instance.post(`${_prefix}/user/reset`, params);
      return res.status === 200;
    }
    res = await instance.put(`${_prefix}/user/reset?uuid=${value.id}`, { password: value.password });
    return res.status === 200;
  } catch (err) {
    console.warn(err, '-> reset password');
    return {
      error: err?.response?.data?.message || "Something went wrong"
    }
  }
};


/**
 * @param {oldPassword: string} oldPassword
 * @param {newPassword: string} newPassword
 * @returns {Promise<boolean | null}
 **/
 export const updatePassWord = async (oldPassword, newPassword) => {
  try {
    const res = await instance.put(`${_prefix}/user/password`, {
      oldPassword,
      newPassword
    });
    return res.status === 200;
  } catch (error) {
    console.warn(error, '-> update passWord');
    return {
      error: error?.response?.data?.message || "Something went wrong"
    }
  }
};


/**
 * @param {nickName : string} nickName
 * @returns {Promise<boolean | null}
 **/
 export const updateUserName = async (nickName) => {
  try {
    const res = await instance.put(`${_prefix}/user/nickname/${nickName}`);
    return res.status === 200;
  } catch (error) {
    console.warn(error, '-> update user name');
    return {
      error: error?.response?.data?.message || "Something went wrong"
    }
  }
};


// /**
//  * @param {id : string} id
//  * @returns {Promise<{content: Object} | null}
//  **/
//  export const getUserById = async (id) => {
//   try {
//     const res = await instance.get(`${_prefix}/user/${id}`);
//   } catch (error) {
//     console.warn(error, '-> get user by id');
//   }
// };


/**
 * @param {uuid : string} uuid
 * @returns {Promise<boolean | null}
 **/
 export const getConfirmUser = async (uuid) => {
  try {
    const res = await instance.get(`${_prefix}/user/confirm`, {
      params: {
        uuid
      }
    });
    return res.status === 200;
  } catch (error) {
    console.warn(error, '-> get confirm user');
  }
};


/**
 * @param {email: string} email
 * @returns {Promise<boolean | null}
 **/
 export const resendEmailMessage = async (email) => {
  try {
    const res = await instance.post(`${_prefix}/user/resend/${email}`);
    return res.status === 200;
  } catch (error) {
    console.warn(error, '-> resend email message');
    return false;
  }
};

/**
 * @param {userId: string} userId
 * @returns {Promise<object | null}
 **/
 export const getDonateInformation = async (userId) => {
  try {
    const res = await instance.get(`${_prefix}/requisite/${userId}`);
    return mapDonat(res.data);
  } catch (error) {
    console.warn(error, '-> get donate information');
    return false;
  }
};


/**
 * @param { data: {
 *  link: string
 *  cardOne: string
 *  cardTwo: string
 * }} data
 * @returns {Promise<boolean | null}
 **/
 export const updateDonateInformation = async (data) => {
  try {
    const res = await instance.put(`${_prefix}/requisite`, {
      firstCard: data?.cardOne,
      secondCard: data?.cardTwo || "",
      donationAlertsUrl: data?.link
    });
    return mapDonat(res.data);
  } catch (error) {
    console.warn(error, '-> get donate information');
    return {
      error: error?.response?.data?.message || "Something went wrong"
    }
  }
};
