import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import OperationService from '../services/operation.service'
import EventBus from "../common/EventBus";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";

const Operations = () => {

  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [optionsOperationType, setOptionsOperationType] = useState([""]);

  const [operationType, setOperationType] = useState("");
  const [loading, setLoading] = useState(false);
  const [ errorMessage, setErrorMessage] = useState("");
  const [ successMessage, setSuccessMessage] = useState("");
  const form = useRef();
  let navigate = useNavigate();

  const onChangeNumber1 = (e) => {
    const n = e.target.value;
    setNumber1(n);
  };

  const onChangeNumber2 = (e) => {
    const n = e.target.value;
    setNumber2(n);
  };

  const onChangeOperation = (e) => {
    const n = e.target.value;
    setOperationType(n);
  };

  const handleFetchOperations = () => {
    const res = [];
		OperationService.getOperations().then(
      (response) => {
        if (response.data) {

          Object.keys(response.data).forEach(function(key) {
            res.push(<option key={key} value={key}>{response.data[key]}</option>);
          });

          setOptionsOperationType(res);
        }
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
          navigate("/login");
          window.location.reload();
        }
      }
    );
	};

  const handleNewOperation = (e) => {

    e.preventDefault();

    setLoading(true);

      OperationService.newOperation(operationType, number1, number2).then(
        (response) => {
          setOperationType("");
          setNumber1("");
          setNumber2("");
          setSuccessMessage(response.message);
          setErrorMessage("");
          setLoading(false);
        },
        (error) => {
          setSuccessMessage("")
          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
            navigate("/login");
            window.location.reload();
          } else if (error.response && error.response.status === 400) {
            const message = (error.response && error.response.data && error.response.data.messages) ? error.response.data.messages[0] : "";
            setErrorMessage(message);
          }
          setLoading(false);
        }
      );

	};

  useEffect(() => {
      handleFetchOperations();
  }, []);

  return (
    <div className="row" data-testid='operations'>
      <div className="col-12">
        <div>
          <h3 className="fw-light">New Operation</h3>
        </div>

        <div className="row mt-3">

          <div className="col-4">

              <Form onSubmit={handleNewOperation} ref={form}>
                <div className="form-group">
                  <label htmlFor="number1">Number 1</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="number1"
                    data-testid='number1'
                    maxLength="50"
                    onChange={onChangeNumber1}
                    value={number1}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    validations={[]}/>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="number2">Number 2</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="number2"
                    data-testid='number2'
                    maxLength="50"
                    value={number2}
                    onChange={onChangeNumber2}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    validations={[]}/>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="number2">Operation Type</label>
                  <Select
                    type="text"
                    className="form-control"
                    name="operationType"
                    data-testid='operationType'
                    value={operationType}
                    onChange={onChangeOperation}
                    validations={[]}>
                      <option value="" >
                        -- Select a Operation --
                      </option>
                      {optionsOperationType}
                    </Select>
                </div>

                <div className="form-group mt-3">
                  <button className="btn btn-primary btn-block" disabled={loading} name="invoke">
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Invoke</span>
                  </button>
                </div>

                {errorMessage && (
                  <div className="form-group mt-3">
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  </div>
                )}

                </Form>

                
            </div>

              <div className="col-8" id="operationResults">
              {successMessage && (
                  <div className="form-group mt-3">
                    <div className="alert alert-success" role="alert">
                    Your request has been processed with success. <br/><br/>
                      {successMessage}
                    </div>
                  </div>
                )}
              </div>

          </div>
        </div>
    </div>
  );
};

export default Operations;
