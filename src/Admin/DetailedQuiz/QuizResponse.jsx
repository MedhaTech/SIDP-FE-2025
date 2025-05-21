/* eslint-disable indent */
import React from "react";
// var parse = require('html-react-parser');
import parse from "html-react-parser";
import "./quiz.scss";

const QuizResponse = ({ response }) => {
  const { accimg, msg, ar_image, ar_link } = response;
  const config = process.env.REACT_APP_API_IMAGE_BASE_URL;
  return (
    <div className="w-100">
      <div className="row" style={{ fontSize: "1rem" }}>
        {accimg && (
          <div className="col-3">
            <img src={config + accimg} alt="star" className="img-fluid w-75" />
          </div>
        )}
        <div className={`${!accimg ? "col-12" : "col-9"}`}>
          {response.is_correct ? (
            <div className="row mt-4">
              {parse(
                `
                                <p  className="text-left responce_true">
                                    ${msg ? msg : "No Data"}
                                </p>
                                `
              )}
            </div>
          ) : (
            <div className="row mt-4">
              {parse(
                `
                        <p  className="text-left responce_false">
                            ${msg ? msg : "No Data"}
                        </p>
                        `
              )}
            </div>
          )}

          {ar_image && (
            <div className="row">
              <img
                src={config + ar_image}
                alt="star"
                className="img-fluid w-75"
              />
            </div>
          )}
        </div>
      </div>
      <div className="row">
        {ar_link && <div className="col-3">{ar_link}</div>}
      </div>
    </div>
  );
};

export default QuizResponse;
