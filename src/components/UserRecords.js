import React, { useState, useEffect } from "react";
import UserRecordsService from "../services/user_records.service";
import ReactPaginate from 'react-paginate';
import { useNavigate  } from 'react-router-dom';
import useConstructor from "../use.constructor";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import EventBus from "../common/EventBus";

import "react-datepicker/dist/react-datepicker.css";

const UserRecords = () => {

    useConstructor(() => {
    });

    let navigate = useNavigate();

    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(5); 
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); 
    const [selectedItem, setSelectedItem] = useState("");
    const [content, setContent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [sortBy, setSortBy] = useState("id");
    const [sortDirection, setSortDirection] = useState("desc");
    const [sortDirectionCss, setSortDirectionCss] = useState("sort-desc");

    const handleClose = () => {
      setSelectedItem(0);
      setModalShow(false);
    }
    const handleShowDeleteDialog = (id) => {
      setSelectedItem(id);
      setModalShow(true);
    };
    const onChangePageSize = (e) => {
      const n = e.target.value;
      setPageSize(n);
    };

    const newSortDirection = (column) => {
      let newSort = (sortDirection === "asc" && column === sortBy)  ? "desc" : "asc";
      setSortBy(column);
      setSortDirection(newSort);
      setSortDirectionCss("sort-" + newSort);
    }

    useEffect(() => {
      handleFetch(0);
    }, [sortBy, sortDirection, pageSize]);

    const userRecord = (u) => {
      return (
        <tr key={u.id} className={`${u.dateDeleted ? "text-muted" : ""}`}>
          <td>{u.id}</td>
          <td>{u.operationName}</td>
          <td>{u.dateInserted}</td>
          <td>{u.amount}</td>
          <td>{u.userBalance}</td>
          <td>{u.success 
          ? (<span className="badge bg-success">Yes</span>) 
          : (<span className="badge bg-danger">No</span>)
          }</td>
          <td>{u.operationResponse}</td>
          <td>
            {!u.deleted && u.success && u.operationName
              ? (<div><Button onClick={ () => {handleShowDeleteDialog(u.id)}} className="btn btn-sm btn-danger">Delete</Button></div>)
              : ("")
            }
            {u.deleted
              ? (<span>Deleted at {u.dateDeleted}</span>)
              : ("")
            }
          </td>
        </tr>
      );
    };

  const handleFetch = (page) => {

		UserRecordsService.getUserRecords(page, pageSize, startDate, endDate, sortBy, sortDirection).then(
      (response) => {
        setCurrentPage(0);
        setPageCount(response.data.totalPages);
        setIsLoaded(response.data.results.length > 0);
        const res = response.data.results.map(i => userRecord(i));
        setContent(res);
      },
      (error) => {
        
        const _content =(error.response && error.response.data) || error.message || error.toString();
          
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
          navigate("/login");
          window.location.reload();
        }

        setIsLoaded(false);
        setContent(_content);
      }
    );
	};

  const handleDelete = (id) => {
    if (id) {
      handleClose();
      UserRecordsService.deleteUserRecord(id).then(
        (response) => {
          handleFetch(0)
        },
        (error) => {
          const _content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();

          setContent(_content);
        }
      );
    }
	};

  const buildLink = (label, column) => {
    return (
      <th className={column === sortBy ? sortDirectionCss : ""}>
        <a href="#" className="link-secondary" onClick={(e) => newSortDirection(column)}>{label}</a>
      </th>
    );
  }


  useEffect(() => {
    handleFetch(currentPage);
  }, []);

  useEffect(() => {
      setCurrentPage(0);
  }, [content]);

  const handlePageChange = (selectedObject) => {
		setCurrentPage(selectedObject.selected);
		handleFetch(selectedObject.selected);
	};
  

  return (

    
    <div className="row" data-testid='user-records'>
      <div className="col-md-12">
        <div>
          <h3 className="fw-light">User Records</h3>
        </div>

        <div>

          <div className="row mb-4 mt-4">
            <div className="col-3">
              <DatePicker 
                dateFormat="MM/dd/yyyy"
                name="startDate"
                isClearable={true}
                onFocus={e => e.target.blur()}
                placeholderText="Start Date"
                selected={startDate} 
                onChange={(date) => setStartDate(date)}
                value={startDate} 
                className="form-control" />
            </div>
            <div className="col-3">

            <DatePicker 
                dateFormat="MM/dd/yyyy"
                name="endDate"
                isClearable={true}
                placeholderText="End Date"
                onFocus={e => e.target.blur()}
                selected={endDate} 
                onChange={(date) => setEndDate(date)}
                value={endDate} 
                className="form-control" />
            </div>
            <div className="col-4">
              <Button onClick={() => { handleFetch(0)}} className="btn btn-default">Filter Results</Button>
            </div>
            <div className="col-2">
              <div>
              Itens per page 
              </div>
              <div>
              <select
                    type="text"
                    className="form-control"
                    name="pageSize"
                    onChange={onChangePageSize}
                    value={pageSize}
                    validations={[]}>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                    </select>
              </div>
              
            </div>
          </div>
        

        {isLoaded ? (

          <div>

            <table className="table table-condensed">
              <thead>
                <tr>
                  {buildLink("ID", "id")}
                  {buildLink("Operation", "operation.type")}
                  {buildLink("Date", "dateUts")}
                  {buildLink("Amount", "amount")}
                  {buildLink("User Balance", "userBalance")}
                  {buildLink("Success", "success")}
                  <th>Operation Response</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {content}
              </tbody>
            </table>

            <div className="container">            
              <ReactPaginate
                pageCount={pageCount}
                pageRange={2}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                containerClassName={'pagination'}
                previousLinkClassName={'btn btn-primary'}
                breakClassName={'page'}
                nextLinkClassName={'btn btn-primary'}
                pageClassName={'btn btn-primary'}
                disabledClassName={'disabled'}
                activeClassName={'active'}/>
              </div>
          </div>
          ) : (
            <div>No records found</div>
          )} 

        </div>
      </div>


      <Modal show={modalShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {handleDelete(selectedItem)}}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>


    </div>

            


  );
};

export default UserRecords;
