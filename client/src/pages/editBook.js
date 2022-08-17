import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import {getGanersBook, loadingFile, addAudioList} from "../apiServices/apiAddOrCreateBooks";
import { getPageBook, updateAudioList, editPageBook, getPageBookAudio, deleteAudioList, editImageBook } from "../apiServices/apiBooks";

import BookEdit from "../components/bookEdit";
import Spinner from "../components/shared/spinner";

const EditBook = () => {
  const { slug } = useParams();
  const history = useHistory();
  const [bookData, setBookData] = useState({});
  const [bookGenres, setBookGenres] = useState([]);
  const [audio, setAudio] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const getBookData = async () => {
    const _data = await getPageBook(slug);
    if (_data && _data.createdByCurrentUser) {
      await getBookGenres();
      const gesAudio = await getPageBookAudio(slug, _data?.name);
      setBookData({
        name: _data?.name,
        image: _data?.image,
        description: _data?.description,
        genres: _data.genres ? _data.genres.split(", ").map((z) => ({
          label: z,
          value: z,
          isActive: false
        })) : []
      });
      if (gesAudio) {
        setAudio(gesAudio);
      }
      setIsLoading(false);
      return;
    }
    history.push("/");
  }


  const getBookGenres = async () => {
    const res = await getGanersBook();
    if (res) setBookGenres(res);
  }

  useEffect(() => {
    getBookData();
  }, []);

  const updateBook = async (data) => {
    const _bookId = slug;
    setIsLoadingSubmit(true);
    const _bookInfo = {
      id: _bookId,
      name: data?.name,
      description: data?.description,
      genres: data && data.genres ? data.genres.map((z) => z.value) : []
    };
    // update image
    if (data.image !== bookData.image && data.imageFile) await editImageBook(_bookId, data.imageFile);
    const resBook = await editPageBook(_bookInfo);
    let files = [];
    let filesIdsRemove = data.removeAudio.filter((z) => Boolean(z.id) === true).map((z) => z.id);
    // get all audio
    if (data.audio && data.audio.length) {
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
            let _item = {
              name: f.name.replace(/\b(?:.mp4|.mp3)\b/gi, ""),
              tomeNumber: i,
              chapterNumber: _chapterNumber,
              file: f.id ? null : f
            }
            if (f.id) _item.id = f.id;
            files.push(_item);
          });
        };
      });
    }

    // if we have files
    if (files && files.length !== 0) {
      // get all info without file
      const _allFilesData = files.map(({file, ...z}) => ({ ...z }));
      const _filesData = _allFilesData.filter((z) => Boolean(z.id) === true);
      
      const _newFiles = files.filter((z) => !Boolean(z.id) === true);
      const _newFilesData = _newFiles.map(({file, ...z}) => ({ ...z }));

      // update order list
      await updateAudioList(_bookId, _filesData);

      // add new files
      if (_newFilesData && _newFilesData.length) {
        const _addAudio = await addAudioList(_bookId, _newFilesData);
        if (_addAudio) {
          // loading files
          const loadingFiles = _addAudio.map((id, i) => loadingFile(id, _newFiles[i].file));
          await Promise.all(loadingFiles);
        }
      }
    }
    // remove files
    if (Array.isArray(filesIdsRemove) && filesIdsRemove.length !== 0) await deleteAudioList(_bookId, filesIdsRemove);
    if (resBook) {
      history.push(`/book/${slug}`);
      return;
    }
    setIsLoadingSubmit(false);
  };

  return (
    <div className="book-page page-full">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="wr fadeIn">
          <div className="book-page-edit">
            <h1 className="book-page-title">Редагувати книгу</h1>
            <Link to={history.location?.state?.prevPage || "/books"} className="book-btn-back"></Link>
            <BookEdit
              audioFiles={audio}
              genres={bookGenres}
              bookData={bookData}
              onGoBack={() => { }}
              onSaveBook={updateBook}
              isLoading={isLoadingSubmit}
              buttonLeftText="Видалити"
              buttonRightText="Зберегти"
              isImageRequired={true}
            />
          </div>
        </div>
      )}
    </div>
  )
};

export default EditBook;