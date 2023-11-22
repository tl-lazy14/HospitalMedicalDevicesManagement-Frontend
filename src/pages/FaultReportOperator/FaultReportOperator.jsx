import './FaultReportOperator.css';
import SearchIcon from "../../assets/SearchIcon.svg";
import PlusIcon from "../../assets/plusIcon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { transformDateTime } from "../../utils/utils";
import { useState, useEffect, useContext } from "react";
import api from "../../components/axiosInterceptor";
import { UserContext } from "../../components/userContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalCreateFaultReport from "../../components/Modal/ModalCreateFaultReport";
import ModalEditFaultReport from "../../components/Modal/ModalEditFaultReport";

const FaultReportOperatorPage = () => {

    const accessToken = localStorage.getItem('accessToken');
    const { user } = useContext(UserContext);

    const [faultReport, setFaultReports] = useState([]);
    const [count, setCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dropdownFilterStates, setDropdownFilterStates] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState([]);

    const handleAction = (action, record) => {
        if (record.repairStatus !== 'Chờ quyết định') {
            toast.error('Không thể thao tác do quyết định sửa chữa đã được đưa ra', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "faultReportToast",
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: '#d32f2f',
                    fontSize: '17px',
                    backgroundColor: '#f1f4fa',
                },
            });
            return;
        } else {
            if (action === 'edit') openEditFormModal(record);
        }
    };

    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const openAddFormModal = () => {
        setIsEditFormOpen(false);
        setIsAddFormOpen(true);
        setDropdownFilterStates(false);
    };

    const openEditFormModal = (record) => {
        setIsAddFormOpen(false);
        setSelectedRecord(record);
        setIsEditFormOpen(true);
        setDropdownFilterStates(false);
    };

    const getMyFaultReports = async () => {
        try {
          const response = await api.post(`/faultRepair/fault/operator/${user._id}`, {
            selectedStatus,
            searchQuery,
            page: currentPage,
            limit: 20
          }, {
            headers: { token: `Bearer ${accessToken}` },
          });
          setFaultReports(response.data.list);
          setCount(response.data.totalRecords);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    useEffect(() => {
        getMyFaultReports();
    }, [currentPage, searchQuery, selectedStatus]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStatus, searchQuery])

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

    return (
        <>
            <ToastContainer containerId="deleteUsageRequestToast" limit={1}/>
            <ModalCreateFaultReport isModalOpen={isAddFormOpen} setIsModalOpen={setIsAddFormOpen} updateList={getMyFaultReports} user={user} />
            {selectedRecord && <ModalEditFaultReport isModalOpen={isEditFormOpen} setIsModalOpen={setIsEditFormOpen} updateList={getMyFaultReports} record={selectedRecord} setSelectedRecord={setSelectedRecord} />}
            <div className="list-request-usage-page">
                <h2 className="name-page">Danh sách báo cáo hỏng hóc thiết bị y tế của bạn</h2>
                <div className="action-container">
                    <div className="left-action-container">
                        <div onClick={openAddFormModal} className="button">
                            <img src={PlusIcon} alt="plusIcon" />
                            <span>Tạo báo cáo mới</span>
                        </div>
                    </div>
                    <div className="right-action-container">
                        <div className="num-devices">{count} báo cáo hỏng hóc</div>
                        <div className="search-box">
                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Tìm kiếm theo thiết bị/mô tả hỏng hóc" 
                                onChange={handleSearchInputChange}
                            />
                            <img src={SearchIcon} alt="searchIcon" />
                        </div>
                    </div>
                </div>
                <div className="table-list-usage-request">
                    <table>
                        <tbody>
                            <tr className="col-name">
                                <th style={{width: "10%"}}>STT</th>
                                <th style={{width: "10%"}}>Mã thiết bị</th>
                                <th style={{width: "20%"}}>Tên thiết bị</th>
                                <th style={{width: "15%"}}>Thời gian phát hiện</th>
                                <th style={{width: "20%"}}>Mô tả hỏng hóc</th>
                                <th style={{width: "15%"}} className={`${dropdownFilterStates || selectedStatus.length > 0 ? 'selected' : ''}`}>
                                    <span>Trạng thái</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown()} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "10%"}}></th>
                            </tr>
                            {faultReport?.length > 0 && faultReport.map((record, index) => (
                            <tr key={record._id} className="record"> 
                                <td style={{ paddingLeft: '28px' }}>{20 * (currentPage - 1) + index + 1}</td>
                                <td>{record.device?.deviceID}</td>
                                <td>{record.device?.deviceName}</td>
                                <td>{transformDateTime(record.time)}</td>
                                <td>{record.description}</td>
                                <td className='repair-status'>
                                    <span 
                                    className={record.repairStatus === 'Sửa' ? 'status-accept' : (record.repairStatus === 'Không sửa' ? 'status-refuse' : (record.repairStatus === 'Chờ quyết định' ? 'status-pending' : ''))}
                                    >
                                        {record.repairStatus}
                                    </span>
                                </td>
                                <td>
                                    <div className='fault-report-edit' onClick={() => handleAction('edit', record)}>
                                        Sửa
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {faultReport?.length > 0 && 
                <div className="pagination">
                    <div className="btn" onClick={() => handlePageChange(1)}>Trang đầu</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage - 1)}>Trang trước</div>
                    <div style={{marginTop: "3px", width: "200px", textAlign: "center"}}>Trang <span style={{fontWeight: "700"}}>{currentPage}</span> trên {totalPages}</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage + 1)}>Trang sau</div>
                    <div className="btn" onClick={() => handlePageChange(totalPages)}>Trang cuối</div>
                </div> 
                }
                {dropdownFilterStates && (
                    <div className="filter-status filter">
                        <form>
                            <div className="filter-name"><h3>Lọc theo quyết định sửa chữa</h3></div>
                            <div className="filter-container">
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Sửa"
                                        onChange={e => handleFilterChange(e, setSelectedStatus)}
                                        checked={selectedStatus.includes("Sửa")}
                                    />
                                    Sửa
                                </label>
                            </div>
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Chờ quyết định"
                                        onChange={e => handleFilterChange(e, setSelectedStatus)}
                                        checked={selectedStatus.includes("Chờ quyết định")}
                                    />
                                    Chờ quyết định
                                </label>
                            </div>
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Không sửa"
                                        onChange={e => handleFilterChange(e, setSelectedStatus)}
                                        checked={selectedStatus.includes("Không sửa")}
                                    />
                                    Không sửa
                                </label>
                            </div>
                            </div>
                            <button type="button">OK</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default FaultReportOperatorPage;