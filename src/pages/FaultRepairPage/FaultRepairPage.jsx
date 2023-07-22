import './FaultRepairPage.css'
import SearchIcon from "../../assets/SearchIcon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import api from "../../components/axiosInterceptor";
import { CSVLink } from 'react-csv';
import ModalViewRepairInfo from '../../components/Modal/ModalViewRepairInfo';
import ModalCreateRepairInfo from '../../components/Modal/ModalCreateRepairReport';
import ModalEditRepairInfo from '../../components/Modal/ModalEditRepairInfo';
import { transformDateTime } from '../../utils/utils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FaultRepairPage = () => {

    const accessToken = localStorage.getItem('accessToken');

    const [faultReports, setFaultReports] = useState([]);
    const [count, setCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dropdownFilterStates, setDropdownFilterStates] = useState(false); // by repairDecision

    const [activeRow, setActiveRow] = useState(null);

    const handleIconClick = (rowIndex) => {
        if (activeRow === rowIndex) setActiveRow(null);
        else setActiveRow(rowIndex);
    };

    const updateRepairDecision = async (report, status) => {
        if (report.repairStatus === 'Sửa' && report.startDate && status === 'Không sửa') {
            toast.error(`Thiết bị này đã hoặc đang được sửa chữa rồi`, {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "RepairInfoToastCreate",
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
        }
        try {
            const response = await api.put(`/faultRepair/repair/decision/${report._id}`, { repairStatus: status }, {
                headers: { token: `Bearer ${accessToken}` }
            });
            console.log(response.data);
            getListFaultReports();
            setActiveRow(null);
        } catch (err) {
            console.log(err);
        }
    }

    const [selectedStatus, setSelectedStatus] = useState([]);

    const getListFaultReports = async () => {
        try {
          const response = await api.get('/faultRepair/fault/list', {
            headers: { token: `Bearer ${accessToken}` },
            params: {
              selectedStatus,
              searchQuery,
              page: currentPage,
              limit: 20
            }
          });
          setFaultReports(response.data.list);
          setCount(response.data.totalRecords);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    useEffect(() => {
        getListFaultReports();
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

    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const openCreateFormModal = (record) => {
        setIsEditFormOpen(false);
        setIsViewModalOpen(false);
        setSelectedRecord(record);
        setIsCreateFormOpen(true);
        setActiveRow(null);
        setDropdownFilterStates(false);
    };

    const openEditFormModal = (record) => {
        setIsCreateFormOpen(false);
        setIsViewModalOpen(false);
        setSelectedRecord(record);
        setIsEditFormOpen(true);
        setDropdownFilterStates(false);
    };

    const openViewModal = (record) => {
        setIsCreateFormOpen(false);
        setIsEditFormOpen(false);
        setSelectedRecord(record);
        setActiveRow(null);
        setIsViewModalOpen(true);
        setDropdownFilterStates(false);
    };

    const handleAction = (action, record) => {
        if (action === 'create') {
            if (record.repairStatus === 'Sửa') {
                openCreateFormModal(record);
            } else {
                toast.error(`Chỉ có thể tạo thông tin sửa chữa khi trạng thái là 'Sửa'`, {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "RepairInfoToastCreate",
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
        else if (action === 'view') openViewModal(record);
        else if (action === 'edit') openEditFormModal(record);
    
        // Sau khi thực hiện hành động, đặt activeRow về null để ẩn khung
        setActiveRow(null);
    };

    const [faultRepairExport, setFaultRepairExport] = useState([]);
    const [csvData, setCSVData] = useState([]);

    const getFaultRepairInfoForExport = async () => {
        try {
          const response = await api.get('/faultRepair/fault-repair/export', {
            headers: { token: `Bearer ${accessToken}` },
            params: {
              selectedStatus,
              searchQuery,
            }
          });
          setFaultRepairExport(response.data.list);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        getFaultRepairInfoForExport();
        const csvSetUpData = [
            ['Mã thiết bị', 'Tên thiết bị', 'Mã người báo cáo', 'Tên người báo cáo', 'Thời gian phát hiện', 'Mô tả hỏng hóc', 'Quyết định sửa', 'Ngày bắt đầu sửa', 'Ngày hoàn thành sửa', 'Đơn vị sửa chữa', 'Chi phí'],
              ...faultRepairExport.map(record => [
              record.device.deviceID,
              record.device.deviceName,
              record.reporter.userID,
              record.reporter.name,
              record.time,
              record.description,
              record.repairStatus,
              record.startDate,
              record.finishedDate,
              record.repairServiceProvider,
              record.cost,
            ],)
        ];
        setCSVData(csvSetUpData);
    }, [accessToken, faultRepairExport, searchQuery, selectedStatus]);

    return (
        <>
            <ToastContainer containerId="RepairInfoToastCreate" limit={1}/>
            {selectedRecord && <ModalCreateRepairInfo isModalOpen={isCreateFormOpen} setIsModalOpen={setIsCreateFormOpen} record={selectedRecord} setSelectedRecord={setSelectedRecord} updateListRecord={getListFaultReports} />}
            {selectedRecord && <ModalEditRepairInfo isModalOpen={isEditFormOpen} setIsModalOpen={setIsEditFormOpen} record={selectedRecord} setSelectedRecord={setSelectedRecord} updateListRecord={getListFaultReports} />}
            {selectedRecord && <ModalViewRepairInfo isModalOpen={isViewModalOpen} setIsModalOpen={setIsViewModalOpen} record={selectedRecord} setSelectedRecord={setSelectedRecord} openEditForm={openEditFormModal} />}
            <div className="fault-repair-page">
                <h2 className="name-page">Danh sách báo cáo hỏng hóc thiết bị y tế</h2>
                <div className="action-container">
                <div className="left-action-container">
                        <CSVLink className="export-button" data={csvData} filename="list-fault-repair-info.csv">
                            <div className="button">Xuất file</div>
                        </CSVLink>
                    </div>
                    <div className="right-action-container">
                        <div className="num-devices">{count} báo cáo hỏng hóc</div>
                        <div className="search-box search-box-fault-repair-page">
                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Tìm kiếm theo thiết bị/người báo cáo/mô tả hỏng hóc" 
                                onChange={handleSearchInputChange}
                            />
                            <img src={SearchIcon} alt="searchIcon" />
                        </div>
                    </div>
                </div>
                <div className="table-list-fault-report">
                    <table>
                        <tbody>
                            <tr className="col-name">
                                <th style={{width: "10%"}}>Mã thiết bị</th>
                                <th style={{width: "16%"}}>Tên thiết bị</th>
                                <th style={{width: "16%"}}>Người báo cáo</th>
                                <th style={{width: "16%"}}>Thời gian phát hiện</th>
                                <th style={{width: "17%"}}>Mô tả hỏng hóc</th>
                                <th style={{width: "13%"}} className={`${dropdownFilterStates || selectedStatus.length > 0 ? 'selected' : ''}`}>
                                    <span>Quyết định sửa</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown()} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "17%"}} colSpan={2}>Thông tin sửa chữa</th>
                            </tr>
                            {faultReports?.length > 0 && faultReports.map((record, index) => (
                            <tr key={record._id} className="record"> 
                                <td>{record.device?.deviceID}</td>
                                <td>{record.device?.deviceName}</td>
                                <td>{record.reporter?.userID} - <br/>{record.reporter?.name}</td>
                                <td>{transformDateTime(record.time)}</td>
                                <td>{record.description}</td>
                                <td className='repair-status'>
                                    <span 
                                    className={record.repairStatus === 'Sửa' ? 'status-accept' : (record.repairStatus === 'Không sửa' ? 'status-refuse' : (record.repairStatus === 'Chờ quyết định' ? 'status-pending' : ''))}
                                    >
                                        {record.repairStatus}
                                    </span>
                                </td>
                                <td style={{ width: '5%', paddingLeft: '30px' }}>
                                        {(!record.startDate && !record.finishedDate && !record.repairServiceProvider && !record.cost) ? 
                                            <div className='repair-report' onClick={() => handleAction('create', record)}>
                                                Tạo
                                            </div> :
                                            <div className='repair-report' onClick={() => handleAction('view', record)}>
                                                Xem
                                            </div>
                                        }
                                </td>
                                <td style={{textAlign: 'left'}}>
                                    <FontAwesomeIcon onClick={() => handleIconClick(index)} className={`option-icon ${activeRow === index ? 'selected-row' : ''}`} icon={faEllipsis} />
                                    {activeRow === index && (
                                    <div className="option-container">
                                        <div className="accept-btn button" onClick={() => updateRepairDecision(record, 'Sửa')}>
                                            Sửa
                                        </div>
                                        <div className="refuse-btn button" onClick={() => updateRepairDecision(record, 'Không sửa')}>
                                            Không sửa
                                        </div>
                                    </div>
                                    )}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {faultReports?.length > 0 && 
                <div className="pagination">
                    <div className="btn" onClick={() => handlePageChange(1)}>Trang đầu</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage - 1)}>Trang trước</div>
                    <div style={{marginTop: "3px", width: "200px", textAlign: "center"}}>Trang <span style={{fontWeight: "700"}}>{currentPage}</span> trên {totalPages}</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage + 1)}>Trang sau</div>
                    <div className="btn" onClick={() => handlePageChange(totalPages)}>Trang cuối</div>
                </div> 
                }
                {dropdownFilterStates && (
                    <div className="filter-repair-decision filter">
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

export default FaultRepairPage;