/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import { CSVLink } from "react-csv";
import {
  openNotificationWithIcon,
  getCurrentUser,
} from "../../../helpers/Utils";

import { useDispatch, useSelector } from "react-redux";
import Select from "../../../Admin/Reports/Helpers/Select.jsx";

import axios from "axios";
import "../../../Admin/Reports/reports.scss";
import { notification } from "antd";
import { districtList } from "../../../RegPage/ORGData";
import { useNavigate, Link } from "react-router-dom";
import { themesList } from "../../../Team/IdeaSubmission/themesData";
import moment from "moment/moment";
import * as XLSX from 'xlsx';

import { encryptGlobal } from "../../../constants/encryptDecrypt.js";

const ReportL1 = () => {
  const [RegTeachersdistrict, setRegTeachersdistrict] = React.useState("");
  const [totalCount, setTotalCount] = useState([]);
  const [totalCountB, setTotalCountB] = useState([]);

  const [sdg, setsdg] = React.useState("");
  const [filterType, setFilterType] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const [studentDetailedReportsData, setstudentDetailedReportsData] = useState(
    []
  );
  const [filteredData, setFilteredData] = useState([]);
  const [filteresData, setFilteresData] = useState([]);
  const filterOptions = ["Registered", "Not Registered"];
  const categoryData = ["All Categories", "ATL", "Non ATL"];
  const categoryDataTn = [
   "All Categories",
   "HSS",
    "HS",
    "Non ATL",
  ];

  const newThemesList = ["All Themes", ...themesList];
  const fiterDistData = [
    "All Districts",
    ...districtList['Tamil Nadu']
  ];
  const [downloadData, setDownloadData] = useState(null);
  const [downloadNotRegisteredData, setDownloadNotRegisteredData] =
    useState(null);
  const [chartTableData, setChartTableData] = useState([]);
  const [chartTableData2, setChartTableData2] = useState([]);

  const csvLinkRefTable = useRef();
  const csvLinkRefTable2 = useRef();

  const csvLinkRef = useRef();
  const csvLinkRefNotRegistered = useRef();
  const dispatch = useDispatch();
  const currentUser = getCurrentUser("current_user");
  const [registeredGenderChartData, setRegisteredGenderChartData] =
    useState(null);
  const [registeredChartData, setRegisteredChartData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [newFormat, setNewFormat] = useState("");
  const [barChart1Data, setBarChart1Data] = useState({
    labels: [],
    datasets: [],
  });
      const [status, setstatus] = React.useState('');
  
  const statusdata = ['Accepted', 'Rejected', 'Both'];
  const [downloadTableData, setDownloadTableData] = useState(null);
  const [downloadTableData2, setDownloadTableData2] = useState(null);

  const summaryHeaders = [
    {
      label: "District Name",
      key: "district",
    },
    {
      label: "No of Ideas Submitted",
      key: "totalSubmited",
    },

    {
      label: "No of Ideas Accepted",
      key: "accepted",
    },
    {
      label: "No of Ideas Rejected",
      key: "rejected",
    },
  ];
  const summaryHeaders2 = [
    {
      label: "Evaluator Name",
      key: "full_name",
    },
    {
      label: "User ID",
      key: "user_id",
    },
    
    {
      label: "No of Ideas Evaluated",
      key: "totalEvaluated",
    },

    {
      label: "No of Ideas Accepted",
      key: "accepted",
    },
    {
      label: "No of Ideas Rejected",
      key: "rejected",
    },
  ];
  const teacherDetailsHeaders = [
    {
      label: "UDISE CODE",
      key: "organization_code",
    },
    {
      label: "State",
      key: "state",
    },
    {
      label: "District",
      key: "district",
    },
    {
      label: 'CID',
      key: 'challenge_response_id'
    },
    {
      label: "School Name",
      key: "organization_name",
    },
    {
      label: "School Category",
      key: "category",
    },
    {
      label: 'Pin code',
      key: 'pin_code'
    },
    {
      label: 'Mandal / Taluka',
      key: 'mandal'
    }, {
      label: 'School Type',
      key: 'school_type'
    },
    {
      label: 'School Board',
      key: 'board'
    },
    {
      label: "Teacher Name",
      key: "full_name",
    },
    {
      label: "Teacher Email",
      key: "username",
    },
    {
      label: "Teacher Gender",
      key: "gender",
    },
    {
      label: "Teacher Contact",
      key: "mobile",
    },
    {
      label: "Team Name",
      key: "team_name",
    },
    {
      label: "Team Username",
      key: "team_username",
    },
    {
      label: "Student Names",
      key: "names",
    },
    {
      label: 'Theme',
      key: 'theme'
    },
    {
      label: 'Focus Area',
      key: 'focus_area'
    },
    {
      label: 'Select in which language you prefer Submitting Your Idea?',
      key: 'language'
    },
    {
      label: 'Title of your idea (Think of a proper name. Dont describe the solution or problem statement here.',
      key: 'title'
    },
    {
      label: 'Write down your Problem statement',
      key: 'problem_statement'
    },
    {
      label: 'List the Causes of the problem',
      key: 'causes'
    },
    {
      label: 'List the Effects of the problem',
      key: 'effects'
    },
    {
      label: 'In which places in your community did you find this problem?',
      key: 'community'
    },
    {
      label: 'Who all are facing this problem?',
      key: 'facing'
    },
    {
      label: 'Describe the solution to the problem your team found. Explain your solution clearly - how does it work, who is it helping, and how will it solve the problem.',
      key: 'solution'
    },
    {
      label: 'Apart from your teacher, how many people/stakeholders did you speak to to understand or improve your problem or solution?',
      key: 'stakeholders'
    },
    {
      label: 'Pick the actions your team did in your problem solving journey (You can choose multiple options)',
      key: 'problem_solving'
    },
    {
      label: 'Mention the feedback that your team got and the changes you have made, if any, to your problem or solution.',
      key: 'feedback'
    },
    {
      label: 'Upload image of your prototype.',
      key: 'prototype_image'
    },
    {
      label: 'Upload documents & video links of your prototype.',
      key: 'prototype_link'
    },
    {
      label: 'Did your team complete and submit the workbook to your school Guide teacher?',
      key: 'workbook'
    },
    {
      label: 'Idea Submission Status',
      key: 'status'
    },
    {
      label: 'Teacher Verified Status',
      key: 'verifiedment'
    },
    {
      label: 'Teacher Verified At',
      key: 'verified_at'
    },
    {
      label: 'L1 Status',
      key: 'l1status'
  }
  ];
 const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(studentDetailedReportsData);  // Converts the JSON data to a sheet
    const wb = XLSX.utils.book_new();  // Creates a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  // Appends the sheet to the workbook
    XLSX.writeFile(wb, `L1DetailedReport_${newFormat}.xlsx`);  // Triggers download of the Excel file
    
  };
  useEffect(() => {
    fetchChartTableData();
    fetchChartTableData2();
  }, []);
  useEffect(() => {
    if (studentDetailedReportsData.length > 0) {
      handleExport();

    }
  }, [studentDetailedReportsData]);
  const handleDownload = () => {
    if (!RegTeachersdistrict  || !category || !sdg || !status) {
      notification.warning({
        message:
        "Select district, category type, status and Theme to download report.",
      });
      return;
    }
    setIsDownloading(true);
    fetchData();
  };
  const fetchData = () => {
   // This function filters  data based on selected district, category, theme, and evaluation status
    const param = encryptGlobal(
      JSON.stringify({
        district: RegTeachersdistrict,
        category: category,
        theme: sdg,
        evaluation_status: status !== 'Both'? (status === 'Accepted' ? 'SELECTEDROUND1' : 'REJECTEDROUND1'): 'Both',

      })
    );
    const url = `/reports/L1deatilreport?Data=${param}`;
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL_FOR_REPORTS + url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
            const teamDataMap = response.data.data[0].teamData.reduce(
                (map, item) => {
                  map[item.team_id] = item;
                  return map;
                },
                {}
              );
              const teamUsernameMap = response.data.data[0].teamUsername.reduce(
                (map, item) => {
                  map[item.teamuserId] = item.teamUsername;
                  return map;
                },
                {}
              );
              const mentorMap = response.data.data[0].mentorData.reduce(
                (map, item) => {
                  map[item.mentor_id] = item;
                  return map;
                },
                {}
              );
              const mentorUsernameMap = response.data.data[0].mentorUsername.reduce(
                (map, item) => {
                  map[item.user_id] = item.username;
                  return map;
                },
                {}
              );
              const studentNamesMap = response.data.data[0].
                student_names
                .reduce(
                  (map, item) => {
                    map[item.team_id] = item.names;
                    return map;
                  },
                  {}
                );
                const studentAndteam = response.data.data[0].summary.map((item) => {
                    return {
                      ...item,
                     
                      names: studentNamesMap[item.team_id],
        
                      team_name: teamDataMap[item.team_id].team_name,
                      team_email: teamDataMap[item.team_id].team_email,
                      mentor_id: teamDataMap[item.team_id].mentor_id,
                      teamuserId: teamDataMap[item.team_id].teamuserId,
        
                    };
                  });
        
                  const mentorAndOrg = studentAndteam.map((item) => {
                    return {
                      ...item,
        
                      team_username: teamUsernameMap[item.teamuserId],
                      category: mentorMap[item.mentor_id].category,
                      district: mentorMap[item.mentor_id].district,
                      full_name: mentorMap[item.mentor_id].full_name,
                      gender: mentorMap[item.mentor_id].gender,
                      mobile: mentorMap[item.mentor_id].mobile,
                      organization_code: mentorMap[item.mentor_id].organization_code,
                      unique_code: mentorMap[item.mentor_id].unique_code,
                      organization_name: mentorMap[item.mentor_id].organization_name,
                      state: mentorMap[item.mentor_id].state,
                      mentorUserId: mentorMap[item.mentor_id].mentorUserId,
                      city: mentorMap[item.mentor_id].city,
                      principal_name: mentorMap[item.mentor_id].principal_name,
                      principal_mobile: mentorMap[item.mentor_id].principal_mobile,
                      pin_code: mentorMap[item.mentor_id].pin_code,
                      address: mentorMap[item.mentor_id].address,
                      mandal: mentorMap[item.mentor_id].mandal, 
                      school_type: mentorMap[item.mentor_id].school_type,
                      board: mentorMap[item.mentor_id].board,
                    };
                  });
                  const newdatalist = mentorAndOrg.map((item) => {
                    return {
                        "UDISE CODE":item.organization_code,
                                   State:item.state,
                                   District:item.district,
                                   CID:item.challenge_response_id,
                                   "School Name":item.organization_name,
                                   "School Category":item.category,
                                   "Pin code":item.pin_code,
                                   "School Type":item.school_type, "Mandal / Taluka":item.mandal, "School Board":item.board,
                                   Address:item.address,
                                    "Teacher Name":item.full_name,
                                    "Teacher Email":mentorUsernameMap[item.mentorUserId],
                                    "Teacher Gender":item.gender,
                                    "Teacher Contact":item.mobile,
                                    "Team Name":item.team_name,
                                    "Team Username":item.team_username,
                                    "Student Names":item.names,
                                    Theme:item.theme,
                                    "Focus Area":item.focus_area,
                                    "Select in which language you prefer Submitting Your Idea?":item.language,
                                    "Title of your idea (Think of a proper name. Dont describe the solution or problem statement here.":item.title,
                                    "Write down your Problem statement":item.problem_statement,
                                    "List the Causes of the problem":item.causes,
                                    "List the Effects of the problem":item.effects,
                                    "In which places in your community did you find this problem?":item.community,
                                    "Who all are facing this problem?":item.facing,
                                    "Describe the solution to the problem your team found. Explain your solution clearly - how does it work, who is it helping, and how will it solve the problem.":item.solution,
                                    "Apart from your teacher, how many people/stakeholders did you speak to to understand or improve your problem or solution?":item.stakeholders,
                                    "Pick the actions your team did in your problem solving journey (You can choose multiple options)":item.problem_solving,
                                    "Mention the feedback that your team got and the changes you have made, if any, to your problem or solution.":item.feedback,
                                    "Descriptive Document/Image of your prototype.":item.prototype_image,
                                    "Clear YouTube Video Explaining your Solution":item.prototype_link,
                                    "Did your team complete and submit the workbook to your school Guide teacher?":item.workbook,
                                    "Idea Submission Status":item.status,
                                    "Teacher Verified Status":item.verified_status == null ? "Not yet Reviewed" : item.verified_status,
                                    "Teacher Verified At":item.verified_at ? moment(item.verified_at).format(
                                      "DD-MM-YYYY"
                                    ) : '',
                                    "L1 Status":item.evaluation_status === 'SELECTEDROUND1'  ? 'Accepted': 'Rejected',
                                    ...(item.evaluation_status === 'REJECTEDROUND1' && item.rejected_reason
                                      ? { "Rejected Reason 1": item.rejected_reason }
                                      : {}),
                                  ...(item.evaluation_status === 'REJECTEDROUND1' && item.rejected_reasonSecond
                                      ? { "Rejected Reason 2": item.rejected_reasonSecond }
                                      : {}),
                                      "Evaluator Name":item.evaluatorName,
                                   


                     
                    };

                  });
                  setDownloadData(newdatalist);
                  setstudentDetailedReportsData(newdatalist);
                  if (response.data.data[0].summary.length > 0) {
                    openNotificationWithIcon(
                        'success',
                        `L1 Status Detailed Reports Downloaded Successfully`
                    );
                  } else {
                    openNotificationWithIcon("error", "No Data Found");
                  }
                 
                  setIsDownloading(false);
                      
        }
      })
      .catch((error) => {
        console.log("API error:", error);
        setIsDownloading(false);
      });
  };

 

  
  useEffect(() => {
    if (downloadComplete) {
      setDownloadComplete(false);
      setRegTeachersdistrict("");
      setsdg("");
    }
    const newDate = new Date();
    const formattedDate = `${newDate.getUTCDate()}/${
      1 + newDate.getMonth()
    }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    setNewFormat(formattedDate);
  }, [downloadComplete]);

  const fetchChartTableData = () => {
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL_FOR_REPORTS + "/reports/L1ReportTable1",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((res) => {
        if (res.status === 200) {
          const chartTableData = res?.data?.data || [];
          const total = chartTableData.reduce(
            (acc, item) => {
              (acc.totalSubmited += item.totalSubmited),
                (acc.accepted += item.accepted),
                (acc.rejected += item.rejected);

              return acc;
            },
            {
              totalSubmited: 0,
              accepted: 0,
              rejected: 0,
            }
          );

          var array = chartTableData;
          array.push({ district: "Total Count", ...total });
          setChartTableData(array);
          setDownloadTableData(chartTableData);
          setTotalCount(total);
        }
      })
      .catch((error) => {
        console.log("API error:", error);
      });
  };
  const fetchChartTableData2 = () => {
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL_FOR_REPORTS + "/reports/L1ReportTable2",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((res) => {
        if (res.status === 200) {
          const chartTableData2 = res?.data?.data || [];
          const totalB = chartTableData2.reduce(
            (acc, item) => {
              (acc.totalEvaluated += item.totalEvaluated),
                (acc.accepted += item.accepted),
                (acc.rejected += item.rejected);

              return acc;
            },
            {
             
              totalEvaluated: 0,
              accepted: 0,
              rejected: 0,
            }
          );

          var arrayB = chartTableData2;
          arrayB.push({ full_name: "Total Count", ...totalB });
          setChartTableData2(arrayB);
          setDownloadTableData2(chartTableData2);
          setTotalCountB(totalB);
         
        }
      })
      .catch((error) => {
        console.log("API error:", error);
      });
  };

  return (
    <div className="page-wrapper">
      <h4
        className="m-2"
        style={{
          position: "sticky",
          top: "70px",
          zIndex: 1000,
          padding: "10px",
          backgroundColor: "white",
          display: "inline-block",
          color: "#fe9f43",
          fontSize: "16px",
        }}
      >
        Reports
      </h4>
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>L1 - Report</h4>
            </div>
          </div>
          <div className="page-btn">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/reports-card")}
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
        </div>
        <Container className="RegReports userlist">
          <div className="reports-data mt-2 mb-2">
            <Row className="align-items-center mt-3 mb-2">
              <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={fiterDistData}
                    setValue={setRegTeachersdistrict}
                    placeHolder={"Select District"}
                    value={RegTeachersdistrict}
                  />
                </div>
              </Col>
            
              <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                    <Select
                      list={categoryDataTn}
                      setValue={setCategory}
                      placeHolder={"Select Category"}
                      value={category}
                    />
                </div>
              </Col>
              <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={newThemesList}
                    setValue={setsdg}
                    placeHolder={"Select Theme"}
                    value={sdg}
                  />
                </div>
              </Col>
              <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={statusdata}
                    setValue={setstatus}
                    placeHolder={"Select Status"}
                    value={status}
                  />
                </div>
              </Col>
              <Col
                md={2}
                className="d-flex align-items-center justify-content-center"
              >
                <button
                  onClick={handleDownload}
                  type="button"
                  disabled={isDownloading}
                  className="btn btn-primary"
                >
                  {isDownloading ? "Downloading" : "Download Report"}
                </button>
              </Col>
            </Row>
            <div className="chart mt-2 mb-2">
              {chartTableData.length > 0 && (
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                    <div className="card flex-fill default-cover w-100 mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h4 className="card-title mb-0">
                        L1 District wise Overview
                        </h4>
                        <div className="dropdown">
                          <Link
                            to="#"
                            className="view-all d-flex align-items-center"
                          >
                            <button
                              className="btn mx-2 btn-primary"
                              type="button"
                          
                            onClick={() => {
                                if (downloadTableData) {
                                    setDownloadTableData(
                                        null
                                    );
                                    csvLinkRefTable.current.link.click();
                                }
                            }}
                            >
                              Get Statistics
                            </button>
                          </Link>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-border recent-transactions">
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  #
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  District Name
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  No.of Ideas Approved by Mentor{" "}
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  No.of Ideas Accepted in L1
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  No.of Ideas Rejected in L1
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {chartTableData.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td
                                    style={{
                                      maxWidth: "150px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      color: "crimson",
                                    }}
                                  >
                                    {item.district}
                                  </td>
                                  <td> {item.totalSubmited}</td>
                                  <td>{item.accepted}</td>
                                  <td>{item.rejected}</td>
                                 
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {chartTableData2.length > 0 && (
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                    <div className="card flex-fill default-cover w-100 mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h4 className="card-title mb-0">
                        L1 Evaluator Overview
                        </h4>
                        <div className="dropdown">
                          <Link
                            to="#"
                            className="view-all d-flex align-items-center"
                          >
                            <button
                              className="btn mx-2 btn-primary"
                              type="button"
                          
                              onClick={() => {
                                if (downloadTableData2) {
                                    setDownloadTableData2(
                                        null
                                    );
                                    csvLinkRefTable2.current.link.click();
                                }
                            }}
                            >
                              Get Statistics
                            </button>
                          </Link>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-border recent-transactions">
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  #
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                   Evaluator
                                   Name
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  User ID{" "}
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  No of Ideas Evaluated{" "}
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  No of Ideas Accepted
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  No of Ideas Rejected
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {chartTableData2.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td
                                    style={{
                                      maxWidth: "150px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      color: "crimson",
                                    }}
                                  >
                                    {item.full_name}
                                  </td>
                                  <td> {item.user_id}</td>
                                  <td> {item.totalEvaluated}</td>
                                  <td>{item.accepted}</td>
                                  <td>{item.rejected}</td>
                                 
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          
            {downloadTableData && (
              <CSVLink
                data={downloadTableData}
                headers={summaryHeaders}
                filename={`L1StatusTable_${newFormat}.csv`}
                className="hidden"
                ref={csvLinkRefTable}
              >
                Download Table CSV
              </CSVLink>
            )}
            {downloadTableData2 && (
              <CSVLink
                data={downloadTableData2}
                headers={summaryHeaders2}
                filename={`L1EvaluatorTable_${newFormat}.csv`}
                className="hidden"
                ref={csvLinkRefTable2}
              >
                Download Table CSV
              </CSVLink>
            )}
            {studentDetailedReportsData && (
              <CSVLink
                data={studentDetailedReportsData}
                headers={teacherDetailsHeaders}
                filename={`L1DetailedReport_${newFormat}.csv`}
                className="hidden"
                ref={csvLinkRef}
              >
                Download Table CSV
              </CSVLink>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};
export default ReportL1;
