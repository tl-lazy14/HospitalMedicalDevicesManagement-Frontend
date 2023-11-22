import "./ListInfoUsage.css";
import SearchIcon from "../../assets/SearchIcon.svg";
import PlusIcon from "../../assets/plusIcon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faEllipsis, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { transformDate } from "../../utils/utils";
import { useState, useEffect } from "react";
import { CSVLink } from 'react-csv';
import api from "../../components/axiosInterceptor";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalAddUsageInfo from "../../components/Modal/ModalAddUsageInfo";
import ModalEditUsageInfo from "../../components/Modal/ModalEditUsageInfo";

const ListInfoUsage = () => {

    const accessToken = localStorage.getItem('accessToken');

    const ACTIONS = {
        EDIT: 'edit',
        DELETE: 'delete',
    };

    const [usageInfos, setUsageInfos] = useState([]);
    const [countUsageTimes, setCountUsageTimes] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dropdownFilterStates, setDropdownFilterStates] = useState(false);
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const defaultMonth = `${currentYear}-${currentMonth}`;
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

    const [activeRow, setActiveRow] = useState(null);

    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const openAddFormModal = () => {
        setIsEditFormOpen(false);
        setIsAddFormOpen(true);
        setActiveRow(null);
        setDropdownFilterStates(false);
    };

    const openEditFormModal = (record) => {
        setIsAddFormOpen(false);
        setSelectedRecord(record);
        setIsEditFormOpen(true);
        setDropdownFilterStates(false);
    };

    const deleteUsageInfo = async (record) => {
        try {
            const response = await api.delete(`/usage/info/crud/${record._id}`, {
                headers: { token: `Bearer ${accessToken}` }
            });
            console.log(response.data);
            toast.success('Xóa thông tin sử dụng thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: "deleteUsageInfoToast",
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: 'white',
                    fontSize: '17px',
                    backgroundColor: 'green',
                    width: '400px',
                },
            });
            getListUsageInfos();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                  position: toast.POSITION.TOP_RIGHT,
                  containerId: 'deleteUsageInfoToast',
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

    const handleIconClick = (rowIndex) => {
        if (activeRow === rowIndex) setActiveRow(null);
        else setActiveRow(rowIndex);
    };

    const handleAction = (action, record) => {
        if (action === 'edit') openEditFormModal(record);
        else if (action === 'delete') deleteUsageInfo(record);
    
        // Sau khi thực hiện hành động, đặt activeRow về null để ẩn khung
        setActiveRow(null);
    };

    const [usageDepartments, setUsageDepartments] = useState([]);
    const [selectedUsageDepartment, setSelectedUsageDepartment] = useState([]);

    useEffect(() => {
        const getAllUsageDepartment = async () => {
            const response = await api.get('/usage/info/department', {
                headers: { token: `Bearer ${accessToken}` },
            });
            setUsageDepartments(response.data);
        };
        getAllUsageDepartment();
    }, [accessToken, usageInfos])

    const getListUsageInfos = async () => {
        try {
          const response = await api.post('/usage/info/list-usage', {
            selectedUsageDepartment,
            selectedMonth,
            searchQuery,
            page: currentPage,
            limit: 20
          }, {
            headers: { token: `Bearer ${accessToken}` },
          });
          setUsageInfos(response.data.list);
          setCountUsageTimes(response.data.totalRecords);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    useEffect(() => {
        getListUsageInfos();
    }, [currentPage, searchQuery, selectedUsageDepartment, selectedMonth]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedUsageDepartment, searchQuery, selectedMonth])

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

    const handleSelectMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const [usageInfoExport, setUsageInfoExport] = useState([]);
    const [csvData, setCSVData] = useState([]);

    const getUsageInfoForExport = async () => {
        try {
          const response = await api.post('/usage/export', {
            selectedUsageDepartment,
            selectedMonth,
            searchQuery,
          }, {
            headers: { token: `Bearer ${accessToken}` },
          });
          setUsageInfoExport(response.data.list);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        getUsageInfoForExport();
        const csvSetUpData = [
            ['Mã thiết bị', 'Tên thiết bị', 'Mã người yêu cầu', 'Tên người yêu cầu', 'Phòng sử dụng', 'Ngày bắt đầu', 'Ngày kết thúc'],
              ...usageInfoExport.map(record => [
              record.device.deviceID,
              record.device.deviceName,
              record.requester.userID,
              record.requester.name,
              record.usageDepartment,
              record.startDate,
              record.endDate,
              ],)
        ];
        setCSVData(csvSetUpData);
    }, [accessToken, usageInfoExport, searchQuery, selectedMonth, selectedUsageDepartment]);

    return (
        <>
            <ToastContainer containerId="deleteUsageInfoToast" limit={1}/>
            <ModalAddUsageInfo isModalOpen={isAddFormOpen} setIsModalOpen={setIsAddFormOpen} updateListUsageInfo={getListUsageInfos} />
            {selectedRecord && <ModalEditUsageInfo isModalOpen={isEditFormOpen} setIsModalOpen={setIsEditFormOpen} updateListUsageInfo={getListUsageInfos} record={selectedRecord} setSelectedRecord={setSelectedRecord} />}
            <div className="list-request-usage-page">
                <h2 className="name-page">Danh sách thông tin sử dụng thiết bị y tế</h2>
                <input 
                    type="month" 
                    className="select-month-info-usage-page"
                    value={selectedMonth}
                    onChange={handleSelectMonthChange}
                />
                <div className="action-container">
                    <div className="left-action-container">
                        <div onClick={openAddFormModal} className="button">
                            <img src={PlusIcon} alt="plusIcon" />
                            <span>Thêm thông tin sử dụng</span>
                        </div>
                        <CSVLink className="export-button" data={csvData} filename="list-usage-info.csv">
                            <div className="button">Xuất file</div>
                        </CSVLink>
                    </div>
                    <div className="right-action-container">
                        <div className="num-devices">{countUsageTimes} thông tin sử dụng</div>
                        <div className="search-box">
                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Tìm kiếm theo thiết bị/người yêu cầu" 
                                onChange={handleSearchInputChange}
                            />
                            <img src={SearchIcon} alt="searchIcon" />
                        </div>
                    </div>
                </div>
                <div className="table-list-usage-info">
                    <table>
                        <tbody>
                            <tr className="col-name detail-device-header">
                                <th style={{width: "10%"}}>STT</th>
                                <th style={{width: "11%"}}>Mã thiết bị</th>
                                <th style={{width: "18%"}}>Tên thiết bị</th>
                                <th style={{width: "17%"}}>Người yêu cầu</th>
                                <th style={{width: "17%"}} className={`${dropdownFilterStates || selectedUsageDepartment.length > 0 ? 'selected' : ''}`}>
                                    <span>Phòng sử dụng</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown()} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "11%"}}>Ngày bắt đầu</th>
                                <th style={{width: "11%"}}>Ngày kết thúc</th>
                                <th style={{width: "5%"}}></th>
                            </tr>
                            {usageInfos?.length > 0 && usageInfos.map((record, index) => (
                            <tr key={record._id} className="record"> 
                                <td style={{ textAlign: "center" }}>{20 * (currentPage - 1) + index + 1}</td>
                                <td>{record.device?.deviceID}</td>
                                <td>{record.device?.deviceName}</td>
                                <td>{record.requester?.userID} - <br/>{record.requester?.name}</td>
                                <td>{record.usageDepartment}</td>
                                <td>{transformDate(new Date(record.startDate).toISOString().split("T")[0])}</td>
                                <td>{transformDate(new Date(record.endDate).toISOString().split("T")[0])}</td>
                                <td>
                                    <FontAwesomeIcon onClick={() => handleIconClick(index)} className={`option-icon ${activeRow === index ? 'selected-row' : ''}`} icon={faEllipsis} />
                                    {activeRow === index && (
                                    <div className="option-container">
                                        <div className="edit-btn button" onClick={() => handleAction(ACTIONS.EDIT, record)}>
                                            <FontAwesomeIcon className="icon" icon={faPenToSquare} />
                                            Sửa
                                        </div>
                                        <div className="delete-btn button" onClick={() => handleAction(ACTIONS.DELETE, record)}>
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
                {usageInfos?.length > 0 && 
                <div className="pagination">
                    <div className="btn" onClick={() => handlePageChange(1)}>Trang đầu</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage - 1)}>Trang trước</div>
                    <div style={{marginTop: "3px", width: "200px", textAlign: "center"}}>Trang <span style={{fontWeight: "700"}}>{currentPage}</span> trên {totalPages}</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage + 1)}>Trang sau</div>
                    <div className="btn" onClick={() => handlePageChange(totalPages)}>Trang cuối</div>
                </div> 
                }
                {dropdownFilterStates && (
                    <div className="filter-usage-department-info filter">
                        <form>
                            <div className="filter-name"><h3>Lọc theo phòng sử dụng</h3></div>
                            <div className="filter-container">
                            {usageDepartments.map((department, index) => (
                                <div key={index} className="filter-option">
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={department}
                                            onChange={e => handleFilterChange(e, setSelectedUsageDepartment)}
                                            checked={selectedUsageDepartment.includes(department)}
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

export default ListInfoUsage;