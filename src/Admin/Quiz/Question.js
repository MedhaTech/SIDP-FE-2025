/* eslint-disable indent */
import { React, useEffect, useState } from "react";
import { Fragment } from "react";
import { FormGroup, Input, Label, Row, Col } from "reactstrap";
// import { InputBox } from "../../stories/InputBox/InputBox";
import Csv from "../../assets/img/csv1.png";
import Pdf from "../../assets/img/pdf.png";
// import { Button } from "../../stories/Button";

const config = process.env.REACT_APP_API_IMAGE_BASE_URL;

const Question = (props) => {
  const quiz = props.qsts ? props.qsts : [];
  const [isCheck, setIsCheck] = useState([]);
  const [cAnswer, setAnswer] = useState("");
  const [image, setImage] = useState();
  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState("");
  const qst =
    quiz[0] && quiz[0].question_image != null
      ? quiz[0].question_image.replace(/{{}}/g, ",")
      : "";
  var array = qst.split(",");
  const qstL = array;
  const handleClick = (e) => {
    const { name, checked } = e.target;
    setIsCheck([...isCheck, name]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== name));
    }
  };
  useEffect(() => {
    const selectedAns = isCheck.toString();
    const allAns = selectedAns.replace(/,/g, "{{}}");
    props.onSelectAnswer(allAns);
  }, [isCheck]);

  useEffect(() => {
    props.onSelectAnswer(cAnswer);
  }, [cAnswer]);

  useEffect(() => {
    props.onSelectAnswer(image);
    props.onSelectType(quiz[0] && quiz[0].type);
  }, [image]);
  const fileTypes = ["csv", "pdf", "png", "jpg", "jpeg"];
  const changeHandler = (event) => {
    const file = event.target.files[0].name.split(".", 2);
    if (fileTypes.includes(file[1].toLowerCase())) {
      let img = event.target.files[0];
      setUrl(file[1]);
      setImage(img);
      setFileName(event.target.files[0].name);
    }
  };

  const removeSelectedImage = () => {
    setImage();
    setFileName();
    setUrl();
  };
  const ans = {
    type: "text",
    className: "defaultInput",
    placeholder: "Please Answer",
  };
  return (
    <Fragment>
      {quiz[0].question_image != null ? (
        <>
          {qstL.map((x, i) => {
            return (
              <img
                key={i}
                src={config + x}
                alt={config + x}
                className="img-fluid"
                style={{ height: "43rem" }}
              />
            );
          })}
        </>
      ) : null}
      <div
        className="question quiz"
        dangerouslySetInnerHTML={{
          __html: quiz[0] && quiz[0].question,
        }}
      ></div>
      {quiz[0] && quiz[0].type == "TEXT" && (
        <div className="answers">
          <label className="my-auto mx-1 ">
            <Input
              {...ans}
              id="Ans"
              name="Please Answer"
              onChange={(e) => setAnswer(e.target.value)}
              value={cAnswer}
            />
          </label>
        </div>
      )}
      {quiz[0] && quiz[0].type == "DRAW" && (
        <div className="answers">
          <Row className="my-5">
            <Col md={3}>
              {!image ? (
                <div className="wrapper">
                  <div className="btnimg">Upload File</div>
                  <input
                    type="file"
                    name="file"
                    accept="image/png, image/jpeg,.pdf.csv"
                    onChange={(e) => changeHandler(e)}
                  />
                </div>
              ) : null}
            </Col>
            <Col md={9}>
              <Row>
                <Col md={2} className="my-auto">
                  {image && url === "csv" ? (
                    <img src={`${Csv}`} className="img-fluid" alt="Thumb" />
                  ) : image && url === "pdf" ? (
                    <img src={`${Pdf}`} className="img-fluid" alt="Thumb" />
                  ) : null}
                </Col>
                <Col md={6} className="my-auto">
                  <p>{fileName}</p>
                </Col>
                <Col md={2} className="my-auto">
                  {image ? (
                    <button
                      onClick={removeSelectedImage}
                      className="btn btn-warning"
                      //   btnClass="primary py-2 px-4"
                      //   size="small"
                      //   label="Remove"
                    >
                      Remove
                    </button>
                  ) : null}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      )}
      {((quiz[0] && quiz[0].type == "MCQ") ||
        (quiz[0] && quiz[0].type == "MRQ")) && (
        <div className="answers">
          {quiz[0] &&
            quiz[0].options.map((answer, i) => {
              const file = answer.split(".", 2);
              return (
                <div className={"answer "} key={i}>
                  {quiz[0] && quiz[0].type == "MCQ" ? (
                    <label
                      htmlFor={answer}
                      className="my-auto mx-1 common-flex"
                    >
                      <Input
                        id={answer}
                        name={answer}
                        type="checkbox"
                        className="mx-1"
                        onChange={handleClick}
                        isChecked={isCheck.includes(answer)}
                      />
                      {answer}
                    </label>
                  ) : (
                    <FormGroup check className="answer-text common-flex">
                      <Input
                        onChange={() => props.onSelectAnswer(answer)}
                        className="my-auto"
                        name="radio1"
                        type="radio"
                        id={answer}
                      />{" "}
                      {file[1] === "png" ? (
                        // <figure className="text-center my-auto mx-3">
                        <label
                          htmlFor={answer}
                          className="text-center my-auto mx-1"
                        >
                          <img
                            src={config + answer}
                            alt={answer}
                            className="img-fluid"
                            style={{
                              height: "12rem",
                            }}
                          />
                        </label>
                      ) : (
                        // </figure>
                        <Label htmlFor={answer} className="px-3">
                          {answer}
                        </Label>
                      )}
                    </FormGroup>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </Fragment>
  );
};

export default Question;
