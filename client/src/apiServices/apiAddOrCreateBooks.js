import {instance, _prefix, API_URL} from "./index";


/**
 * @param {data: {
 *  name: String
 *  description: String
 *  image: String
 *  genres: Array
 * } } data
 * @returns {Promise<{content: Object} | boolean}
 **/
 export const addNewBook = async (data) => {
  try {
    const res = await instance.post(`${_prefix}/book`, { 
      ...data,
      createdByCurrentUser: true
    });
    if (res && res.data) {
      return {
        id: res.data
      }
    }
    return false;
  } catch (err) {
    console.warn(err, '-> add new book');
    return false;
  }
};


/**
 * @param {data: [
 *  id: String|number
 *  name: String
 *  tomeNumber: number
 *  chapterNumber: number
 * ] } data
 * @returns {Promise<{content: Array} | boolean}
 **/
 export const addAudioList = async (id, data) => {
  try {
    const res = await instance.post(`${_prefix}/book/${id}/baseAudio/list`, [...data]);
    if (res && res.data) {
      return res.data;
    }
    return false;
  } catch (err) {
    console.warn(err, '-> add audio list');
    return false;
  }
};


/**
 * @param {id: string } id
 * @param {file: Object } file
 * @returns {Promise<{content: Object} | boolean}
 **/
 export const loadingFile = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await instance.post(`${_prefix}/audio/${id}`, formData, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      }
    });
    if (res) {
      await updateAudioDuration(id);
      return res.status === 201 || res.status === 200;
    }
    return {
      error: true
    };
  } catch (err) {
    console.warn(err, '-> loading file');
    return {
      error: true
    };
  }
};

 export const updateAudioDuration = async (id) => {
     const url = `${API_URL}${_prefix}/audio/${id}`;
     await new Promise((resolve, reject) => {
         let audio = new Audio(url);
         audio.addEventListener('loadedmetadata', (event) => {
             const duration = event.target.duration;
             instance.put(`${_prefix}/book/baseAudio/${id}/duration?duration=${duration}`).then(() => {
                 audio = undefined;
                 resolve();
             });
         });
     })
 };

/**
 * @param {url: string } url
 * @returns {Promise<{content: Object} | boolean}
 **/
 export const getParserBook = async (url) => {
  try {
    const res = await instance.post(`${_prefix}/parser`, {
      url
    });
    if (res && res.data) {
      const { name, description, image, tome, genres } = res.data;
      return {
        link: url,
        name,
        description,
        image,
        tome,
        genres: genres ? genres.map((z) => ({
          label: z,
          value: z,
          isActive: false
        })) : []
      };
    }
    return false;
  } catch (err) {
    console.warn(err, '-> get parser book');
    return false;
  }
};


/**
 * @returns {Promise<{content: Array} | boolean}
 **/
 export const getGanersBook = async () => {
  try {
    const res = await instance.get(`${_prefix}/book/genre`);
    if (res && res.data) {
      return res.data.map((z) => ({
        label: z,
        value: z,
        isActive: false
      }));
    }
    return false;
  } catch (err) {
    console.warn(err, '-> get genres book');
    return false;
  }
};
