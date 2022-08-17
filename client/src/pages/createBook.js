import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import {
  getGanersBook,
  addNewBook,
  addAudioList,
  loadingFile
} from "../apiServices/apiAddOrCreateBooks";

import CreateBookInfo from "../components/createBookInfo";
import CreateBookAudio from "../components/createBookAudio";
import BookEdit from "../components/bookEdit";

const CreateBook = () => {
  const history = useHistory();
  const [bookStep, setBookStep] = useState("info"); // can be info, audio, check
  const [bookInfo, setBookInfo] = useState({});
  const [bookAudio, setAookAudio] = useState();
  const [bookGenres, setBookGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getBookGenres = async () => {
    const res = await getGanersBook();
    if (res) setBookGenres(res);
  }

  useEffect(() => {
    getBookGenres();
  }, []);

  const onBookInfo = (data) => {
    setBookInfo(data);
    setBookStep("audio");
  }

  const onBookAudio = (audio) => {
    setAookAudio(audio);
    setBookStep("check");
  };

  const _htmlTabsMenu = () => {
    const _arrText = [
      {
        name: "info",
        text: "Данные о книге"
      },
      {
        name: "audio",
        text: "Аудио файлы"
      },
      {
        name: "check",
        text: "Финиш"
      }
    ];
    return _arrText.map((z, i) => (
      <button
        key={`create-book-tabs-link_${i}`}
        className={`create-book-tabs-link ${bookStep === z.name ? "active" : ""}`}
        type="button"
      >
        { z.text }
      </button>
    ))
  };

  const createBook = async (data) => {
    setIsLoading(true);
    const book = {
      name: data?.name || "",
      description: data?.description || "",
      image: data?.image || "",
      genres: data.genres ? data?.genres.map((z) => z.value) : []
    }
    const res = await addNewBook(book);
    if (res && res.id && data.audio && data.audio.length !== 0) {
      let id = res.id;
      let files = [];
      // get all audio
      data.audio.forEach((z, i) => {
        if (z.files) {
          let chapterNumber = 0;
          z.files.forEach((f, c) => {
            let _chapterNumber = chapterNumber;
            if (z?.options?.prologue && c === 0) {
              _chapterNumber = -1;
            } else if (
              z?.options?.epilogue && z?.options?.afterword && c === z.files.length - 2 ||
              z?.options?.epilogue && !z?.options?.afterword && c === z.files.length - 1
            ) {
              _chapterNumber = -2;
            } else if (z?.options?.afterword && c === z.files.length - 1) {
              _chapterNumber = -3;
            } else {
              chapterNumber++;
            }
            files.push({
              name: f.name.replace(/\b(?:.mp4|.mp3)\b/gi, ""),
              tomeNumber: i,
              chapterNumber: _chapterNumber,
              file: f
            })
          });
        }
      });
      //  remove file
      if (files && files.length !== 0) {
        const filesData = files.map(({file, ...z}) => ({
          ...z
        }));
        const resAudio = await addAudioList(id, filesData);
        if (resAudio) {
          const loadingFiles = resAudio.map((id, i) => loadingFile(id, files[i].file));
          const isLodingFiles = await Promise.all(loadingFiles);
          if (isLodingFiles.some((f) => f.error)) {
            console.log(isLodingFiles.some((f) => f.error));
          }
        }
      }
    }
    setIsLoading(false);
    history.push("/books", { addNewBook: true })
  };

  return (
    <div className="create-book-page create-book page-full fadeIn">
      <div className="wr">
        <h1 className="create-book-title">Загрузить книгу</h1>
        <div className="create-book-wr">
          <div className="create-book-tabs">
            { _htmlTabsMenu() }
          </div>
          {bookStep === "info" && (
            <div className="create-book-tabs-body info">
              <CreateBookInfo
                genres={bookGenres}
                formData={bookInfo}
                getFormData={onBookInfo}
              />
            </div>
          )}
          {bookStep === "audio" && (
            <div className="create-book-tabs-body audio">
              <CreateBookAudio
                onGoBack={() => setBookStep("info")}
                bookName={bookInfo?.name || ""}
                audioFiles={bookAudio || []}
                setAudioData={onBookAudio}
              />
            </div>
          )}
          {bookStep === "check" && (
            <div className="create-book-tabs-body">
              <BookEdit
                audioFiles={bookAudio || []}
                genres={bookGenres}
                bookData={bookInfo}
                onGoBack={() => setBookStep("audio")}
                onSaveBook={createBook}
                isLoading={isLoading}
                isImageRequired={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default CreateBook;