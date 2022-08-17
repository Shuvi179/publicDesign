import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ValidImage = ({ src, defaultSrc, ...props }) => {
  const [image, setImage] = useState();

  const getImage = (url) => {
    setImage(url);
  };

  useEffect(() => {
    getImage(src);
  }, [src]);

  return (
    <img className="fadeIn" src={image} {...props} />
  )
};

ValidImage.propTypes = {
  src: PropTypes.string,
  defaultSrc: PropTypes.string
};

ValidImage.defaultProps = {
  src: "",
  defaultSrc: ""
};

export default ValidImage;