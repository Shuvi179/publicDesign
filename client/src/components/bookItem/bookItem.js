import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { Link } from "react-router-dom";

import ValidImage from "../shared/validImage";
import styles from "./bookItem.module.scss";

const BookItem = ({
  className,
  id,
  genres,
  image,
  onCallBack,
  isShowButton,
  iconType,
  selectedAsFavourite,
  tooltipText,
  name,
  rating,
  author
}) => {
  const { location } = useHistory();

  const _htmlIco = () => {
    switch (iconType) {
      case "remove":
        return (
          <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.6876 2.37502H13.9532C14.773 2.37502 15.4376 3.03962 15.4376 3.8594V5.04691C15.4376 5.37485 15.1718 5.64067 14.8439 5.64067H0.593755C0.265817 5.64067 0 5.37485 0 5.04691V3.8594C0 3.03962 0.664597 2.37502 1.48439 2.37502H4.75004V1.78126C4.75004 0.797487 5.54752 0 6.5313 0H8.90632C9.8901 0 10.6876 0.797487 10.6876 1.78126V2.37502ZM6.5313 1.18751C6.20399 1.18751 5.93755 1.45396 5.93755 1.78126V2.37502H9.50007V1.78126C9.50007 1.45396 9.23363 1.18751 8.90632 1.18751H6.5313ZM0.941971 7.02244C0.936925 6.9166 1.02135 6.82805 1.1273 6.82805H14.3113C14.4173 6.82805 14.5017 6.9166 14.4966 7.02244L14.0068 17.3034C13.9615 18.2549 13.18 19 12.2278 19H3.21086C2.25862 19 1.47709 18.2549 1.43182 17.3034L0.941971 7.02244ZM10.6881 7.71869C10.36 7.71869 10.0943 7.98439 10.0943 8.31244V16.0313C10.0943 16.3593 10.36 16.625 10.6881 16.625C11.0161 16.625 11.2818 16.3593 11.2818 16.0313V8.31244C11.2818 7.98439 11.0161 7.71869 10.6881 7.71869ZM7.71931 7.71869C7.39126 7.71869 7.12555 7.98439 7.12555 8.31244V16.0313C7.12555 16.3593 7.39126 16.625 7.71931 16.625C8.04736 16.625 8.31306 16.3593 8.31306 16.0313V8.31244C8.31306 7.98439 8.04736 7.71869 7.71931 7.71869ZM4.75054 7.71869C4.42249 7.71869 4.15678 7.98439 4.15678 8.31244V16.0313C4.15678 16.3593 4.42249 16.625 4.75054 16.625C5.07859 16.625 5.34429 16.3593 5.34429 16.0313V8.31244C5.34429 7.98439 5.07859 7.71869 4.75054 7.71869Z" fill="#1C1C1E" />
          </svg>
        );
      case "heart-active":
        return (
          <svg width="20" height="18" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#000" d="m9.78758,2.88382c2.7655,-6.65232 20.1016,2.29297 0.04554,14.82384c-19.38103,-12.75588 -3.27981,-21.10115 -0.04554,-14.82384z" fill="#000000" />
          </svg>
        );
      case "edit":
        return (
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
            <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
          </svg>
        );
      default:
        return (
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17.931C9.71527 17.931 9.44077 17.8271 9.22684 17.6383C8.41888 16.9263 7.63992 16.2573 6.95267 15.6671L6.94916 15.6641C4.93423 13.9337 3.19427 12.4394 1.98364 10.9674C0.630341 9.32179 0 7.76152 0 6.05702C0 4.40095 0.563507 2.87313 1.58661 1.75478C2.62192 0.623216 4.04251 0 5.58716 0C6.74164 0 7.79892 0.36781 8.72955 1.09313C9.19922 1.45925 9.62494 1.90732 10 2.42997C10.3752 1.90732 10.8008 1.45925 11.2706 1.09313C12.2012 0.36781 13.2585 0 14.413 0C15.9575 0 17.3782 0.623216 18.4135 1.75478C19.4366 2.87313 20 4.40095 20 6.05702C20 7.76152 19.3698 9.32179 18.0165 10.9673C16.8059 12.4394 15.0661 13.9336 13.0515 15.6637C12.363 16.2548 11.5828 16.9249 10.773 17.6386C10.5592 17.8271 10.2846 17.931 10 17.931ZM5.58716 1.18062C4.37363 1.18062 3.25882 1.66868 2.44781 2.55499C1.62476 3.45467 1.17142 4.69834 1.17142 6.05702C1.17142 7.49059 1.70013 8.77269 2.88559 10.2141C4.03137 11.6074 5.73563 13.0709 7.70889 14.7656L7.71255 14.7687C8.4024 15.3611 9.18442 16.0328 9.99832 16.75C10.8171 16.0314 11.6003 15.3587 12.2916 14.7653C14.2647 13.0706 15.9688 11.6074 17.1146 10.2141C18.2999 8.77269 18.8286 7.49059 18.8286 6.05702C18.8286 4.69834 18.3752 3.45467 17.5522 2.55499C16.7413 1.66868 15.6264 1.18062 14.413 1.18062C13.524 1.18062 12.7078 1.4654 11.9872 2.02695C11.3449 2.52762 10.8975 3.16052 10.6352 3.60337C10.5003 3.8311 10.2629 3.96703 10 3.96703C9.73709 3.96703 9.49966 3.8311 9.36478 3.60337C9.10263 3.16052 8.65524 2.52762 8.01285 2.02695C7.29218 1.4654 6.47598 1.18062 5.58716 1.18062Z" fill="#1C1C1E" />
          </svg>
        )
    }
  };

  return (
    <div className={classNames(styles["book-item"], className)}>
      <Link
        className={styles["book-item-link"]}
        to={{
          pathname: `/book/${id}`,
          state: { prevPage: location.pathname }
        }}
      />
      <div className={styles["book-item-img"]}>
        <ValidImage src={image} alt={name} />
        {isShowButton && (
          <button className={styles["book-item-btn"]} onClick={onCallBack.bind(null, id)}>
            { _htmlIco()}
          </button>
        )}
        <div className={styles["book-item-tooltip"]}>{tooltipText}</div>
      </div>
      <div className={styles["book-item-rating"]}>
        <div className={styles["book-item-rating-item"]}>
          <div className={styles["book-item-rating-icon"]}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.649 4.75913L9.3273 4.13036L7.39492 0.210434C7.25711 -0.0701448 6.74277 -0.0701448 6.60496 0.210434L4.67285 4.13036L0.350872 4.75913C0.0145441 4.8084 -0.11862 5.22311 0.124193 5.45934L3.2507 8.5107L2.51215 12.8193C2.45527 13.1514 2.80418 13.4109 3.10742 13.2521L7.02745 11.218L10.8925 13.2521C11.1941 13.4109 11.5449 13.1514 11.4878 12.8193L10.7492 8.5107L13.876 5.45934C14.1185 5.22311 13.9853 4.8084 13.649 4.75913Z" fill="#1C1C1E" />
            </svg>
          </div>
          <div className={classNames(styles["book-item-rating-text"], styles["number"])}>
            {parseFloat(rating.rating.toFixed(1))}/<span className={styles["color-gray"]}>5</span>
          </div>
          <div className={styles["book-item-rating-text"]}>
            ({rating.votes})
          </div>
        </div>
        <div className={styles["book-item-rating-item"]}>
          <div className={styles["book-item-rating-icon"]}>
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.0313 1.07649C1.70425 0.382319 2.62763 0 3.63155 0C4.38197 0 5.0692 0.225637 5.67421 0.670591C5.97949 0.895191 6.25611 1.16997 6.5 1.4907C6.74379 1.17007 7.02051 0.895191 7.32589 0.670591C7.9308 0.225637 8.61803 0 9.36845 0C10.3724 0 11.2959 0.382319 11.9688 1.07649C12.6337 1.76255 13 2.69982 13 3.71575C13 4.7614 12.5903 5.71856 11.7106 6.72808C10.9237 7.6311 9.79275 8.5478 8.48305 9.60929C8.03584 9.9718 7.52892 10.3827 7.00256 10.8204C6.8635 10.9362 6.68507 11 6.5 11C6.31503 11 6.1365 10.9362 5.99764 10.8206C5.47128 10.3828 4.96407 9.97171 4.51665 9.60901C3.20715 8.5477 2.07618 7.6311 1.28927 6.72799C0.409622 5.71856 0 4.7614 0 3.71566C0 2.69982 0.36628 1.76255 1.0313 1.07649Z" fill="#1C1C1E" />
            </svg>
          </div>
          <div className={styles["book-item-rating-text"]}>
            {selectedAsFavourite}
          </div>
        </div>
      </div>
      <h5 className={styles["book-item-title"]}>
        <Link to={`/book/${id}`}>{name}</Link>
      </h5>
      <div className={styles["book-item-author"]}>
        <Link to={`/user/${author.id}`}>{author.name}</Link>
      </div>
      <div className={styles["book-item-genres"]}>
        {genres}
      </div>
    </div>
  )
};

BookItem.defaultProps = {
  onCallBack: () => { },
  isShowButton: false,
  tooltipText: "",
  iconType: "heart"
};

BookItem.propTypes = {
  className: PropTypes.string,
  id: PropTypes.number,
  genres: PropTypes.string,
  tooltipText: PropTypes.string,
  image: PropTypes.string,
  isShowButton: PropTypes.bool,
  name: PropTypes.string,
  rating: PropTypes.shape({
    rating: PropTypes.number,
    votes: PropTypes.number
  }),
  author: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }),
  onCallBack: PropTypes.func,
  iconType: PropTypes.oneOf(["remove", "heart-active", "heart", "edit"])
};

export default BookItem;