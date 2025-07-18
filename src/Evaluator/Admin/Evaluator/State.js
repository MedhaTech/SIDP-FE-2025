/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Row, Col, Label, Container, Card, } from 'reactstrap';
import { Button } from '../../../stories/Button';
import {
    getNormalHeaders,
    openNotificationWithIcon
} from '../../../helpers/Utils';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

import { URL, KEY } from '../../../constants/defaultValues';
import Check from '../EvalProcess/Pages/Check.jsx';
import {themesList} from "../../../Team/IdeaSubmission/themesData";
import {languageOptions} from "../../../RegPage/ORGData";
import { useDispatch } from 'react-redux';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
import {districtList } from "../../../RegPage/ORGData.js";
const Districts = (props) => {
    const location = useLocation();
    const { evaluatorId } = location.state || {};
    const evalID = JSON.parse(localStorage.getItem('eavlId'));
    const IdIntial =evaluatorId ? evaluatorId : evalID.evaluator_id ;
    const allDataLanguages= ["All Languages",...languageOptions];
    const allDataThemes= ["All Themes",...themesList];
    const dispatch = useDispatch();
    const [clickedValue, setclickedValue] = useState({});
    const [clickedValue1, setclickedValue1] = useState({});
    const [clickedValue2, setclickedValue2] = useState({});
    const [selectedDistricts, setselectedDistricts] = useState([]);
    const [selectedLang, setselectedLang] = useState([]);
    const [selectedTheme, setselectedTheme] = useState([]);

const navigate = useNavigate();
    const newdistrictList = ["All Districts", ...districtList["Tamil Nadu"]];
     const fulldistrictNames = newdistrictList;
    useEffect(() => {
        if (evalID && evalID.theme) {
            if (
                evalID.theme.split(',').length === allDataThemes.length - 1 &&
                !evalID.theme.includes('All Themes')
            ) {
                setselectedTheme(allDataThemes);
            } else {
                setselectedTheme(evalID.theme.split(','));
            }
        }
    }, []);
    useEffect(() => {
        if (clickedValue1.name === 'All Themes') {
            if (selectedTheme.includes('All Themes')) {
                setselectedTheme(allDataThemes);
            } else {
                setselectedTheme([]);
            }
        } else if (
            clickedValue1.name &&
            clickedValue1.name !== 'All Themes' &&
            selectedTheme.length === allDataThemes.length - 1 &&
            !selectedTheme.includes('All Themes')
        ) {
            setselectedTheme(allDataThemes);
        } else if (clickedValue1.name && clickedValue1.name !== 'All Themes') {
            setselectedTheme(
                selectedTheme?.filter((item) => item !== 'All Themes')
            );
        }
    }, [clickedValue1]);
    
    useEffect(() => {
        if (evalID && evalID.language) {
            if (
                evalID.language.split(',').length === allDataLanguages.length - 1 &&
                !evalID.language.includes('All Languages')
            ) {
                setselectedLang(allDataLanguages);
            } else {
                setselectedLang(evalID.language.split(','));
            }
        }
    }, []);
    useEffect(() => {
        if (clickedValue2.name === 'All Languages') {
            if (selectedLang.includes('All Languages')) {
                setselectedLang(allDataLanguages);
            } else {
                setselectedLang([]);
            }
        } else if (
            clickedValue2.name &&
            clickedValue2.name !== 'All Languages' &&
            selectedLang.length === allDataLanguages.length - 1 &&
            !selectedLang.includes('All Languages')
        ) {
            setselectedLang(allDataLanguages);
        } else if (clickedValue2.name && clickedValue2.name !== 'All Languages') {
            setselectedLang(
                selectedLang?.filter((item) => item !== 'All Languages')
            );
        }
    }, [clickedValue2]);
        
    useEffect(() => {
        
        if (evalID && evalID.district) {
            if (
                evalID.district.split(',').length ===
                    fulldistrictNames.length - 1 &&
                !evalID.district.includes('All Districts')
            ) {
                setselectedDistricts(fulldistrictNames);
            } else {
                setselectedDistricts(evalID.district.split(','));
            }
        }
    }, []);

    useEffect(() => {
        if (clickedValue.name === 'All Districts') {
            if (selectedDistricts.includes('All Districts')) {
                setselectedDistricts(fulldistrictNames);
            } else {
                setselectedDistricts([]);
            }
        } else if (
            clickedValue.name &&
            clickedValue.name !== 'All Districts' &&
            selectedDistricts.length === fulldistrictNames.length - 1 &&
            !selectedDistricts.includes('All Districts')
        ) {
            setselectedDistricts(fulldistrictNames);
        } else if (clickedValue.name && clickedValue.name !== 'All Districts') {
            setselectedDistricts(
                selectedDistricts?.filter((item) => item !== 'All Districts')
            );
        }
    }, [clickedValue]);

    async function handleDistricts(value) {
        //  handleDistricts Api where value = district //
        // where we can update the district //
        if(value.district===''){
            value.district = '-';
        }
        if(value.language===''){
            value.language = '-';
        }
        if(value.theme===''){
            value.theme = '-';
        }
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const evalid = encryptGlobal(JSON.stringify(IdIntial));
        await axios
            .put(
                `${URL.updateEvaluatorState + evalid}`,
                JSON.stringify(value, null, 2),
                axiosConfig
            )
            .then((response) => {
                if (response.status == 200) {
            localStorage.removeItem('eavlId');

                    openNotificationWithIcon(
                        'success',
                        'Districts,Themes and Languages Update Successfully'
                    );
                    navigate('/eadmin/evaluator');
                }
            })
            .catch((err) => {
                return err.response;
            });
    }

    const handleclick = async () => {
        const value = { district: '',
              language: '',
               theme: ''
         };
     
        value.district = selectedDistricts.includes('All Districts')
        ? selectedDistricts.filter((item) => item !== 'All Districts').toString()
        : selectedDistricts.toString();

    value.language = selectedLang.includes('All Languages')
        ? selectedLang.filter((item) => item !== 'All Languages').toString()
        : selectedLang.toString();
        
        value.theme = selectedTheme.includes('All Themes')
        ? selectedTheme.filter((item) => item !== 'All Themes').toString()
        : selectedTheme.toString();
            
        await handleDistricts(value);
    };
    const handleDiscard = () => {
        setselectedDistricts([]);
        localStorage.removeItem('eavlId');
        navigate('/eadmin/evaluator');
      };
    return (
        <div className="page-wrapper">
          <div className="content">
            <Container>
                <Card className="m-3 p-3">
                    <Row>
                        <Col md={4}>
                            <Label className="mb-2 text-info">
                            
                                <span className="text-muted">
                                </span>{' '}
                            </Label>
                        </Col>
                      
                    </Row>
                    <Row>
                        <Label className="mb-2 text-info form-label">Districts:</Label>
                        <Check
                            list={fulldistrictNames}
                            value={selectedDistricts}
                            setValue={setselectedDistricts}
                            selValue={setclickedValue}
                        />
                    </Row>
                </Card>
                <Card className="m-3 p-3">
                    <Row>
                        <Col md={4}>
                            <Label className="mb-2 text-info">
                            
                                <span className="text-muted">
                                </span>{' '}
                            </Label>
                        </Col>
                      
                    </Row>
                    <Row>
                        <Label className="mb-2 text-info form-label">Languages:</Label>
                        <Check
                            list={allDataLanguages}
                            value={selectedLang}
                            setValue={setselectedLang}
                            selValue={setclickedValue2}
                        />
                    </Row>
                </Card>
                <Card className="m-3 p-3">
                    <Row>
                        <Col md={4}>
                            <Label className="mb-2 text-info">
                            
                                <span className="text-muted">
                                </span>{' '}
                            </Label>
                        </Col>
                      
                    </Row>
                    <Row>
                        <Label className="mb-2 text-info form-label">Themes:</Label>
                        <Check
                            list={allDataThemes}
                            value={selectedTheme}
                            setValue={setselectedTheme}
                            selValue={setclickedValue1}
                            colSize={4}
                        />
                    </Row>
                </Card>
                <Row>
                    <Col className="col-xs-12 col-sm-6">
                    <button
          type="button"
          onClick={handleDiscard}
          className="btn btn-secondary"
        >
          Discard
        </button>
                         
                    </Col>
                    <Col className="submit-btn col-xs-12 col-sm-6 text-right">
                        <Button
                            label="Save"
                            onClick={() => handleclick()}
                            btnClass={'primary'}
                            size="small"
                        />
                    </Col>
                </Row>
            </Container>
        </div>
        </div>
    );
};
export default Districts;
