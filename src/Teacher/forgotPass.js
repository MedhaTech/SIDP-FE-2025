/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/Logoe.png";
//import email from "../assets/img/icons/mail.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { URL, KEY } from "../constants/defaultValues";
import { useNavigate } from "react-router-dom";
import { getNormalHeaders, openNotificationWithIcon } from "../helpers/Utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import play from "../assets/img/playicon.png";

const Forgotpassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      mobile: "",
    },

    validationSchema: Yup.object({
      mobile: Yup.string()
        .trim()
        .matches(
          /^\d+$/,
          <span style={{ color: "red" }}>
            Mobile number is not valid (Enter only digits)
          </span>
        )
        .max(
          10,
          <span style={{ color: "red" }}>
            Please enter only 10 digit valid number
          </span>
        )
        .min(
          10,
          <span style={{ color: "red" }}>Number is less than 10 digits</span>
        )
        .required(
          <span style={{ color: "red" }}>Please Enter Registered mobile</span>
        )
        .max(255)
        .trim(),
    }),

    onSubmit: async (values) => {
      const axiosConfig = getNormalHeaders(KEY.User_API_Key);
      (axiosConfig["headers"] = {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      }),
        await axios
          .put(
            `${URL.putResetPassword}`,
            JSON.stringify(values, null, 2),
            axiosConfig
          )
          .then((checkOrgRes) => {
            if (checkOrgRes.status == 202) {
              openNotificationWithIcon(
                "success",
                "For registered users password reset link will be sent to registered mobile"
              );
              setTimeout(() => {
                navigate("/teacher");
              }, 2000);
            }
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "For registered users password reset link will be sent to registered mobile"
            );
            return err.response;
          });
    },
  });

  const handleLogoClick = () => {
    navigate("/");
  };

  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Watch Demo
    </Tooltip>
  );

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper forgot-pass-wrap bg-img">
          <div className="login-content">
            <form onSubmit={formik.handleSubmit} action="index">
              <div className="login-userset">
                <div
                  className="login-logo logo-normal"
                  onClick={handleLogoClick}
                >
                  <img
                    src={logo}
                    alt="Logo"
                    // className="logo-image"
                  />
                </div>

                <div className="login-userheading">
                  <h3>
                    Forgot your SIDP password?{" "}
                    <OverlayTrigger placement="top" overlay={renderTooltip}>
                      <a
                        href="https://www.youtube.com/watch?v=D434mJUmGpk"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* <img
                            src={play}
                            className="icon"
                            alt="play"
                            style={{ verticalAlign: "middle", width: "7%" }}
                          /> */}
                      </a>
                    </OverlayTrigger>
                  </h3>
                </div>
                <div className="form-login">
                  <label>Mobile</label>
                  <div className="form-addons">
                    <input
                      id="mobile"
                      type="mobile"
                      placeholder="Enter Your Registered Mobile"
                      className="form- control mb-2"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.mobile}
                    />
                    {formik.touched.mobile && formik.errors.mobile ? (
                      <small className="error-cls">
                        {" "}
                        {formik.errors.mobile}
                      </small>
                    ) : null}
                    {/* <img src={email} alt="mobile" /> */}
                  </div>
                </div>

                <div className="form-login">
                  <button
                    className={`btn btn-login ${
                      !(formik.dirty && formik.isValid) ? "default" : "primary"
                    }`}
                    disabled={!(formik.dirty && formik.isValid)}
                    type="submit"
                  >
                    Send Password
                  </button>
                </div>
                <div className="signinform text-center">
                  <h4>
                    Return to
                    <Link to="/teacher" className="hover-a">
                      {" "}
                      Login{" "}
                    </Link>
                  </h4>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;
