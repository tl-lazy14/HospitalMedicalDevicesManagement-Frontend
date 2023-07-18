import "./ListOperator.css";
import PlusIcon from "../../assets/plusIcon.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faEllipsis, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import api from "../../components/axiosInterceptor";
import ModalAddOperator from "../../components/Modal/ModalAddOperator";
import ModalEditOperator from "../../components/Modal/ModalEditOperator";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from 'react-csv';


const ListOperator = () => {

    const accessToken = localStorage.getItem('accessToken');

    const ACTIONS = {
        EDIT: 'edit',
        DELETE: 'delete',
    };

    const [user, setUser] = useState([]);
    const [count, setCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dropdownFilterStates, setDropdownFilterStates] = useState(false);

    const [activeRow, setActiveRow] = useState(null);

    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openAddFormModal = () => {
        setIsEditFormOpen(false);
        setIsAddFormOpen(true);
        setActiveRow(null);
        setDropdownFilterStates(false);
    };

    const openEditFormModal = (user) => {
        setIsAddFormOpen(false);
        setSelectedUser(user);
        setIsEditFormOpen(true);
        setDropdownFilterStates(false);
    };

    const handleIconClick = (rowIndex) => {
        if (activeRow === rowIndex) setActiveRow(null);
        else setActiveRow(rowIndex);
    };

    const deleteUser = async (user) => {
        try {
            const response = await api.delete(`/user/${user._id}`, {
                headers: { token: `Bearer ${accessToken}` }
            });
            console.log(response.data);
            toast.success('Xóa người vận hành thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: "deleteOperatorToast",
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: 'white',
                    fontSize: '17px',
                    backgroundColor: 'green',
                },
            });
            getListOperator();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                  position: toast.POSITION.TOP_RIGHT,
                  containerId: 'deleteOperatorToast',
                  autoClose: 3000,
                  hideProgressBar: true,
                  closeButton: false,
                  style: {
                    color: '#d32f2f',
                    fontSize: '17px',
                    backgroundColor: '#f1f4fa',
                  },
                });
            }
        }
    }

    const handleAction = (action, user) => {
        if (action === 'edit') openEditFormModal(user);
        else if (action === 'delete') deleteUser(user);
    
        // Sau khi thực hiện hành động, đặt activeRow về null để ẩn khung
        setActiveRow(null);
    };

    const [department, setDepartment] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);

    useEffect(() => {
        const getAllDepartment = async () => {
            const response = await api.get('/user/info/department', {
                headers: { token: `Bearer ${accessToken}` },
            });
            setDepartment(response.data);
        };
        getAllDepartment();
    }, [accessToken, user])

    const getListOperator = async () => {
        try {
          const response = await api.get('/user/info/list', {
            headers: { token: `Bearer ${accessToken}` },
            params: {
              selectedDepartment,
              searchQuery,
              page: currentPage,
              limit: 20
            }
          });
          setUser(response.data.list);
          setCount(response.data.totalRecords);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    useEffect(() => {
        getListOperator();
    }, [accessToken, currentPage, searchQuery, selectedDepartment]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDepartment, searchQuery])

    const toggleFilterDropdown = () => {
        setDropdownFilterStates(!dropdownFilterStates);
    };

    const handleFilterChange = (event, setFilter) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        // Cập nhật giá trị đã chọn
        if (isChecked) {
          setFilter(prevTypes => [...prevTypes, value]);
        } else {
          setFilter(prevTypes => prevTypes.filter(type => type !== value));
        }
    };

    const handleSearchInputChange = (event) => {
        const value = event.target.value;
        setSearchQuery(value);
    }

    const handlePageChange = (page) => {
        if (page > totalPages || page < 1) return;
        else setCurrentPage(page);
    };

    const [operatorsExport, setOperatorsExport] = useState([]);
    const [csvData, setCSVData] = useState([]);

    const getOperatorsForExport = async () => {
        try {
          const response = await api.get('/user/info/export', {
            headers: { token: `Bearer ${accessToken}` },
            params: {
              selectedDepartment,
              searchQuery,
            }
          });
          setOperatorsExport(response.data.list);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        getOperatorsForExport();
        const csvSetUpData = [
            ['Mã người vận hành', 'Tên người vận hành', 'Email', 'Đơn vị'],
              ...operatorsExport.map(user => [
              user.userID,
              user.name,
              user.email,
              user.department,
              ],)
        ];
        setCSVData(csvSetUpData);
    }, [accessToken, operatorsExport, searchQuery, selectedDepartment]);

    return (
        <>
            <ToastContainer containerId="deleteOperatorToast" limit={1}/>
            <ModalAddOperator isModalOpen={isAddFormOpen} setIsModalOpen={setIsAddFormOpen} updateListOperator={getListOperator} />
            {selectedUser && <ModalEditOperator isModalOpen={isEditFormOpen} setIsModalOpen={setIsEditFormOpen} updateListOperator={getListOperator} user={selectedUser} setSelectedUser={setSelectedUser} />}
            <div className="list-operator-page">
                <h2 className="name-page">Danh sách thông tin người vận hành thiết bị y tế</h2>
                <div className="action-container">
                    <div className="left-action-container">
                        <div onClick={openAddFormModal} className="button">
                            <img src={PlusIcon} alt="plusIcon" />
                            <span>Thêm người vận hành</span>
                        </div>
                        <CSVLink className="export-button" data={csvData} filename="list-operators.csv">
                            <div className="button">Xuất file</div>
                        </CSVLink>
                    </div>
                    <div className="right-action-container">
                        <div className="num-devices">{count} người vận hành</div>
                        <div className="search-box search-box-operator">
                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Tìm kiếm theo mã/tên/email người vận hành" 
                                onChange={handleSearchInputChange}
                            />
                            <img src={SearchIcon} alt="searchIcon" />
                        </div>
                    </div>
                </div>
                <div className="table-list-operator">
                    <table>
                        <tbody>
                            <tr className="col-name">
                                <th style={{width: "20%"}}>Mã người vận hành</th>
                                <th style={{width: "20%"}}>Họ tên người vận hành</th>
                                <th style={{width: "20%"}}>Email</th>
                                <th style={{width: "30%"}} className={`${dropdownFilterStates || selectedDepartment.length > 0 ? 'selected' : ''}`}>
                                    <span>Đơn vị</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown()} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "10%"}}></th>
                            </tr>
                            {user.length > 0 && user.map((user, index) => (
                            <tr key={user._id} className="record"> 
                                <td>{user.userID}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.department}</td>
                                <td>
                                    <FontAwesomeIcon onClick={() => handleIconClick(index)} className={`option-icon ${activeRow === index ? 'selected-row' : ''}`} icon={faEllipsis} />
                                    {activeRow === index && (
                                    <div className="option-container">
                                        <div className="edit-btn button" onClick={() => handleAction(ACTIONS.EDIT, user)}>
                                            <FontAwesomeIcon className="icon" icon={faPenToSquare} />
                                            Sửa
                                        </div>
                                        <div className="delete-btn button" onClick={() => handleAction(ACTIONS.DELETE, user)}>
                                            <FontAwesomeIcon className="icon" icon={faTrash} />
                                            Xóa
                                        </div>
                                    </div>
                                    )} 
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {user.length > 0 && 
                <div className="pagination">
                    <div className="btn" onClick={() => handlePageChange(1)}>Trang đầu</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage - 1)}>Trang trước</div>
                    <div style={{marginTop: "3px", width: "200px", textAlign: "center"}}>Trang <span style={{fontWeight: "700"}}>{currentPage}</span> trên {totalPages}</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage + 1)}>Trang sau</div>
                    <div className="btn" onClick={() => handlePageChange(totalPages)}>Trang cuối</div>
                </div> 
                }
                {dropdownFilterStates && (
                    <div className="filter-department-user filter">
                        <form>
                            <div className="filter-name"><h3>Lọc theo khoa phòng</h3></div>
                            <div className="filter-container">
                            {department.map(department => (
                                <div key={department} className="filter-option">
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={department}
                                            onChange={(e) => handleFilterChange(e, setSelectedDepartment)}
                                            checked={selectedDepartment.includes(department)}
                                        />
                                        {department}
                                    </label>
                                </div>
                            ))}
                            </div>
                            <button type="button">OK</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default ListOperator;