import { DateDiff } from "../lib/utils";
import { instance, _prefix, API_URL } from "./index";

const mapBookItem = ({
  bookInfo: { id, name, genres, description, createdByCurrentUser },
  rating,
  favouriteByCurrentUser,
  selectedAsFavourite,
  author
}) => {
  return {
    id,
    name,
    image: `${API_URL}${_prefix}/book/${id}/image`,
    genres: genres ? genres.join(", ") : null,
    rating: {
      rating: rating?.rating,
      votes: rating?.numberOfVotes
    },
    isFavourite: favouriteByCurrentUser,
    author: {
      id: author.id,
      name: author.nickName
    },
    description,
    selectedAsFavourite,
    createdByCurrentUser
  }
};


const mapBooksItem = (books) => {
  if (books) {
    return books.map((book) => mapBookItem(book))
  }
  return false;
};


const mapBookAudioItems = (data, name) => {
  if (!data) {
    return false;
  }

  return data.map((z, i) => {
    const allfiles = z.map((n) => ({
      name: n.name,
      id: n.id,
      url: `${API_URL}${_prefix}/audio/${n.id}`,
      tome: n?.tomeNumber,
      number: n?.chapterNumber,
      time: n?.duration
    }));

    const prologue = allfiles.find(file => file.number === -1);
    const epilogue = allfiles.find(file => file.number === -2);
    const afterword = allfiles.find(file => file.number === -3);
    let files = allfiles.filter(file => file.number >= 0);
    if (prologue || epilogue || afterword) {
      files = [
        prologue,
        ...files,
        epilogue,
        afterword,
      ].filter(file => Boolean(file));
    }

    return {
      isActive: i === 0,
      name,
      files,
      options: {
        prologue: z.some((x) => x.chapterNumber === -1),
        epilogue: z.some((x) => x.chapterNumber === -2),
        afterword: z.some((x) => x.chapterNumber === -3)
      }
    }
  });
};


/**
 * @param {{id: string}} id
 * @param {{filters: object}} filters
 * @returns {Promise<{content: array} | null}
 **/
export const getPageOfBooks = async (id, filters = {}) => {
  try {
    const res = await instance.post(`${_prefix}/book/page/${id}`, filters);
    if (res && res.data) {
      return {
        books: mapBooksItem(res.data?.audioBooks),
        countPages: res?.data?.numberOfPages || 0,
        numberBooks: res?.data?.numberOfBooks || 0
      }
    }
    return [];
  } catch (error) {
    console.warn(error, '-> get page of books');
    return false;
  }
};

/**
 * @param {{id: string}} id
 * @returns {Promise<{content: array} | null}
 **/
 export const getPageCurrentBooks = async (id) => {
  try {
    const res = await instance.get(`${_prefix}/book/current/page/${id}`);
    if (res && res.data) {
      return {
        books: mapBooksItem(res.data?.audioBooks),
        countPages: res?.data?.numberOfPages || 0,
        numberBooks: res?.data?.numberOfBooks || 0
      }
    }
    return [];
  } catch (error) {
    console.warn(error, '-> get page current books');
    return false;
  }
};

/**
 * @param {{id: string}} id
 * @returns {Promise<{content: array} | null}
 **/
 export const getPageFavouriteBooks = async (id) => {
  try {
    const res = await instance.get(`${_prefix}/book/favourite/page/${id}`);
    if (res && res.data) {
      return {
        books: mapBooksItem(res.data?.audioBooks),
        countPages: res?.data?.numberOfPages || 0,
        numberBooks: res?.data?.numberOfBooks || 0
      }
    }
    return [];
  } catch (error) {
    console.warn(error, '-> get page favourite books');
    return false;
  }
};

/**
 * @param {{id: string}} id
 * @returns {Promise<{content: array} | null}
 **/
 export const getPageFavouriteCountBooks = async () => {
  try {
    const res = await instance.get(`${_prefix}/book/my`);
    if (res && res.data) {
      return {
        favouriteCount: res.data?.numberOfFavouriteBooks || 0,
        createdCount: res.data?.numberOfCreatedBooks || 0
      }
    }
    return false;
  } catch (error) {
    console.warn(error, '-> get page favourite count');
    return false;
  }
};

/**
 * @param {{id: string}} id
 * @returns {Promise<{content: array} | null}
 **/
 export const getPageHistoryBooks = async (id) => {
  try {
    const res = await instance.get(`${_prefix}/book/history/page/${id}`);
    if (res && res.data) {
      return {
        books: mapBooksItem(res.data?.audioBooks),
        countPages: res?.data?.numberOfPages || 0,
        numberBooks: res?.data?.numberOfBooks || 0
      }
    }
    return [];
  } catch (error) {
    console.warn(error, '-> get page history');
  }
};


/**
 * @returns {Promise<boolean | null}
 **/
 export const removeAllHistoryBooks = async () => {
  try {
    const res = await instance.delete(`${_prefix}/book/history`);
    return res.status === 200;
  } catch (error) {
    console.warn(error, '-> remove all history');
    return false;
  }
};

/**
 * @param {{id: string}} id
 * @returns {Promise<boolean | null}
 **/
 export const removeHistoryBook = async (id) => {
  try {
    const res = await instance.delete(`${_prefix}/book/history/${id}`);
    return res.status === 200;
  } catch (error) {
    console.warn(error, '-> remove book history');
    return false;
  }
};



/**
 * @param {bookId: string } bookId
 * @returns {Promise<{content: Object} | null}
 **/
 export const getPageBook = async (bookId) => {
  try {
    const res = await instance.get(`${_prefix}/book/${bookId}`);
    return mapBookItem(res.data);
  } catch (err) {
    console.warn(err, '-> getPageBook');
    return false;
  }
};


/**
 * @param {data: {
 *  id: number,
 *  name: string,
 *  description: string,
 *  image: string,
 *  genres: string
 * } } data
 * @returns {Promise<{content: Object} | null}
 **/
 export const editPageBook = async (data) => {
  try {
    const res = await instance.put(`${_prefix}/book`, { 
      ...data,
      createdByCurrentUser: true
    });
    return res.status === 200;
  } catch (err) {
    console.warn(err, '-> editBook');
    return false;
  }
};

/**
 * @param {id: string } id
 * @param {file: object } file
 * @returns {Promise<boolean | null}
 **/
 export const editImageBook = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await instance.post(`${_prefix}/book/${id}/image`, formData, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      }
    });
    return res.status === 200;
  } catch (err) {
    console.warn(err, '-> edit image');
    return false;
  }
};


/**
 * @param {bookId: string } bookId
 * @param {nameBook: string } nameBook
 * @returns {Promise<{content: Object} | null}
 **/
 export const getPageBookAudio = async (bookId, nameBook = "") => {
  try {
    const res = await instance.get(`${_prefix}/book/${bookId}/baseAudio`);
    if (res && res.data && res.data.audioByTome) {
      return mapBookAudioItems(Object.values(res.data.audioByTome), nameBook);
    }
    return false;
  } catch (err) {
    console.warn(err, '-> getPageBookAudio');
    return false;
  }
};


/**
 * @param {bookId: string } bookId
 * @param {audioId: string } audioId
 * @param {audioTime: string } audioTime
 * @returns {Promise<boolean | null}
 **/
 export const saveBookAudio = async (bookId, audioId, audioTime) => {
  try {
    const res = await instance.post(`${_prefix}/book/history/${bookId}/audio/${audioId}?audioTime=${audioTime}`);
    return res.status === 200;
  } catch (err) {
    console.warn(err, '-> getPageBookAudio');
    return false;
  }
};

/**
 * @param {bookId: string } bookId
 * @returns {Promise<boolean | null}
 **/
 export const getHistoryBookAudio = async (bookId) => {
  try {
    const res = await instance.get(`${_prefix}/book/history/${bookId}`);
    if (res?.data) {
      return {
        tome: res?.data?.tomeNumber,
        number: res?.data?.chapterNumber,
        time: +res?.data?.audioTime,
      }
    }
    return false;
  } catch (err) {
    console.warn(err, '-> getPageBookAudio');
    return false;
  }
};


/**
 * @param {id: string } id
 * @param {data: [
 *  id: String|number
 *  name: String
 *  tomeNumber: number
 *  chapterNumber: number
 * ] } data
 * @returns {Promise<{content: Array} | boolean}
 **/
 export const updateAudioList = async (id, data) => {
  try {
    const res = await instance.put(`${_prefix}/book/${id}/baseAudio/list`, [...data]);
    return res.status === 200;
  } catch (err) {
    console.warn(err, '-> update audio list placeholder');
    return false;
  }
};


/**
 * @param {id: string } id
 * @param {data: array } data
 * @returns {Promise<{content: Array} | boolean}
 **/
 export const deleteAudioList = async (id, data) => {
  try {
    const res = await instance.delete(`${_prefix}/book/${id}/baseAudio/list`, { data });
    return res.status === 200;
  } catch (err) {
    console.warn(err, '-> delete audio list placeholder');
    return false;
  }
};


/**
 * @param {bookId: string } bookId
 * @param {status: bool } status
 * @returns {Promise<boolean | null}
 **/
 export const toggleFavouriteBook = async (bookId, status) => {
  try {
    const res = await instance.post(`${_prefix}/book/favourite/${bookId}/${status ? 'mark' : 'unmark'}`, 
    {
      bookId
    });
    return res.status === 200
  } catch (err) {
    console.warn(err, '-> remove book from favourite');
    return false;
  }
};


/**
 * @returns {Promise<boolean | null}
 **/
 export const removeAllFavouriteBooks = async () => {
  try {
    const res = await instance.delete(`${_prefix}/book/favourite`);
    return res.status === 200;
  } catch (err) {
    console.warn(err, '-> remove all books from favourite');
    return false;
  }
};


/**
 * @param {bookId: string } bookId
 * @returns {Promise<{content: Object} | boolean}
 **/
 export const getFilterInfoBook = async () => {
  try {
    const res = await instance.get(`${_prefix}/book/filter`);
    if (res.data) {
      const { genres, authors } = res.data;
      return {
        genres: genres ? genres.map((z) => ({
          label: z,
          value: z,
          isActive: false
        })) : [],
        authors: authors ? authors.map((z) => ({
          label: z,
          value: z,
          isActive: false
        })) : [] 
      }
    }
    return false;
  } catch (err) {
    console.warn(err, '-> getFilterInfoBook');
    return false;
  }
};


/**
 * @param {bookId: string } bookId
 * @param {page: string } page
 * @returns {Promise<{content: Object} | boolean}
 **/
 export const getComments = async (bookId, page) => {
  try {
    const res = await instance.get(`${_prefix}/book/${bookId}/comment/page?pageNumber=${page}`);
    if (!res.data) {
      return false;
    }
    const currentDate = new Date();
    return {
      comments: res.data && res.data.comments ? res.data.comments.map((z) => {
        const userData = new Date(z?.createTime);
        const inMinut = DateDiff.inMinutes(userData, currentDate);
        const inHours = DateDiff.inHourse(userData, currentDate);
        const inDays = DateDiff.inDays(userData, currentDate);
        const inWeeks = DateDiff.inWeeks(userData, currentDate);
        const inYears = DateDiff.inYears(userData, currentDate);
        let date = "несколько секунд назад";
        if (inYears > 0) {
            if (inYears === 1) {
                date = `${inYears} год назад`;
            } else if (inYears > 1 && inYears < 5) {
                date = `${inYears} года назад`;
            } else {
                date = `${inYears} лет назад`;
            }
        } else if (inWeeks > 0 && inWeeks < 52) {
            if (inWeeks === 1) {
                date = `${inWeeks} неделю назад`;
            } else if (inWeeks > 1 && inWeeks < 5) {
                date = `${inWeeks} недели назад`;
            } else {
                date = `${inWeeks} недель назад`;
            }
        } else if (inDays > 0) {
            if (inDays === 1) {
                date = `${inDays} день назад`;
            } else if (inDays > 1 && inDays < 5) {
                date = `${inDays} дня назад`;
            } else {
                date = `${inDays} дней назад`;
            }
        } else if (inHours > 0) {
            if (inHours === 1) {
                date = `${inHours} час назад`;
            } else if (inHours > 1 && inHours < 5) {
                date = `${inHours} часа назад`;
            } else {
                date = `${inHours} часов назад`;
            }
        } else if (inMinut > 0) {
            if (inMinut === 1) {
                date = `${inMinut} минуту назад`;
            } else if (inMinut > 1 && inMinut < 5) {
                date = `${inMinut} минуты назад`;
            } else {
                date = `${inMinut} минут назад`;
            }
        }
        return {
          name: z?.userInfo?.nickName,
          text: z?.text,
          rating: z?.rating,
          date
        }
      }) : [],
      numberOfPages: res?.data?.numberOfPages
    };
  } catch (err) {
    console.warn(err, '-> getPageBook');
    return false;
  }
};


/**
 * @param {bookId: string } bookId
 * @param {data: {
 *  text: string
 *  rating: number
 * } } data
 * @returns {Promise<boolean | null}
 **/
 export const setComments = async (bookId, data) => {
  try {
    const res = await instance.post(`${_prefix}/book/${bookId}/comment`, {...data});
    return res.status === 200;
  } catch (err) {
    console.warn(err, '-> getPageBook');
    return false;
  }
};


/**
 * @param {bookId: string } bookId
 * @param {rating: string } rating
 * @returns {Promise<{content: Object} | boolean}
 **/
 export const setRatingVoteBook = async (bookId, rating) => {
  try {
    const res = await instance.post(`${_prefix}/book/${bookId}/rating/${rating}`);
    if (res && res.data) {
      const { rating } = res.data;
      return rating;
    }
    return false;
  } catch (err) {
    console.warn(err, '-> set rating vote book');
    return false;
  }
};


/**
 * @param {bookId: string } bookId
 * @returns {Promise<{content: Object} | boolean}
 **/
 export const getRatingVoteBook = async (bookId) => {
  try {
    const res = await instance.get(`${_prefix}/book/${bookId}/rating/vote`);
    if (res && res.data) {
      return res.data;
    }
    return false;
  } catch (err) {
    console.warn(err, '-> get rating vote book');
    return false;
  }
};


/**
 * @param {bookId: string } bookId
 * @returns {Promise<{content: Object} | boolean}
 **/
 export const getRatingBook = async (bookId) => {
  try {
    const res = await instance.get(`${_prefix}/book/${bookId}/rating`);
    if (res && res.data) {
      const { rating } = res.data;
      return rating;
    }
    return false;
  } catch (err) {
    console.warn(err, '-> rating book');
    return false;
  }
};



/**
 * @param {name: string } name
 * @returns {Promise<{content: Object} | boolean}
 **/
 export const fetchSearch = async (name) => {
  try {
    const res = await instance.post(`${_prefix}/book/search`, {
      name
    });
    if (res && res.data) {
      const { books } = res.data;
      return books.map(z => ({
        author: z?.authorName,
        bookId: z?.id,
        bookName: z?.name
      }));
    }
    return false;
  } catch (err) {
    console.warn(err, '-> serach book');
    return false;
  }
};

 export const fetchPreSignedUrl = async (bookId, audioId) => {
     try {
         const res = await instance.get(`${_prefix}/book/${bookId}/baseAudio/${audioId}/url`);
         if (res && res.data) {
             return res.data;
         }
         return "";
     } catch (err) {
         console.warn(err, '-> fetch pre signed url');
         return "";
     }
 };