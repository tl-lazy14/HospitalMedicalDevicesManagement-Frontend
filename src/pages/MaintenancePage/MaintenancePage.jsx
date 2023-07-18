import "./MaintenancePage.css";
import SearchIcon from "../../assets/SearchIcon.svg";
import PlusIcon from "../../assets/plusIcon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faEllipsis, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatNumber, transformDate } from "../../utils/utils";
import { useState, useEffect } from "react";
import { CSVLink } from 'react-csv';
import api from "../../components/axiosInterceptor";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalAddMaintenanceInfo from "../../components/Modal/ModalAddMaintenanceInfo";
import ModalEditMaintenanceInfo from "../../components/Modal/ModalEditMaintenanceInfo";
import ModalDeviceDueMaintenance from "../../components/Modal/ModalDeviceDueMaintenance";

const ListInfoMaintenance = () => {

    const accessToken = localStorage.getItem('accessToken');

    const ACTIONS = {
        EDIT: 'edit',
        DELETE: 'delete',
    };

    const [maintenanceInfos, setMaintenanceInfos] = useState([]);
    const [count, setCount] = useState(0);
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
    const [isDueMaintenanceModalOpen, setIsDueMaintenanceModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const openAddFormModal = () => {
        setIsEditFormOpen(false);
        setIsDueMaintenanceModalOpen(false);
        setIsAddFormOpen(true);
        setActiveRow(null);
        setDropdownFilterStates(false);
    };

    const openEditFormModal = (record) => {
        setIsAddFormOpen(false);
        setIsDueMaintenanceModalOpen(false);
        setSelectedRecord(record);
        setIsEditFormOpen(true);
        setDropdownFilterStates(false);
    };

    const openModalDeviceDueMaintenance = (record) => {
        setIsAddFormOpen(false);
        setIsEditFormOpen(false);
        setIsDueMaintenanceModalOpen(true);
        setActiveRow(null);
        setDropdownFilterStates(false);
    };

    const deleteMaintenanceInfo = async (record) => {
        try {
            const response = await api.delete(`/maintenance/info/crud/${record._id}`, {
                headers: { token: `Bearer ${accessToken}` }
            });
            console.log(response.data);
            toast.success('Xóa thông tin bảo trì thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: "deleteMaintenanceInfoToast",
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
            getListMaintenanceInfos();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                  position: toast.POSITION.TOP_RIGHT,
                  containerId: 'deleteMaintenanceInfoToast',
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
        else if (action === 'delete') deleteMaintenanceInfo(record);
    
        // Sau khi thực hiện hành động, đặt activeRow về null để ẩn khung
        setActiveRow(null);
    };

    const [serviceProviders, setServiceProviders] = useState([]);
    const [selectedProviders, setSelectedProviders] = useState([]);

    useEffect(() => {
        const getAllServiceProviders = async () => {
            const response = await api.get('/maintenance/info/provider', {
                headers: { token: `Bearer ${accessToken}` },
            });
            setServiceProviders(response.data);
        };
        getAllServiceProviders();
    }, [accessToken, maintenanceInfos])

    const getListMaintenanceInfos = async () => {
        try {
          const response = await api.get('/maintenance/info/list', {
            headers: { token: `Bearer ${accessToken}` },
            params: {
              selectedProviders,
              selectedMonth,
              searchQuery,
              page: currentPage,
              limit: 20
            }
          });
          setMaintenanceInfos(response.data.list);
          setCount(response.data.totalRecords);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    useEffect(() => {
        getListMaintenanceInfos();
    }, [currentPage, searchQuery, selectedProviders, selectedMonth]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedProviders, searchQuery, selectedMonth])

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

    const [maintenanceInfoExport, setMaintenanceInfoExport] = useState([]);
    const [csvData, setCSVData] = useState([]);

    const getMaintenanceInfoForExport = async () => {
        try {
          const response = await api.get('/maintenance/info/export', {
            headers: { token: `Bearer ${accessToken}` },
            params: {
              selectedProviders,
              selectedMonth,
              searchQuery,
            }
          });
          setMaintenanceInfoExport(response.data.list);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        getMaintenanceInfoForExport();
        const csvSetUpData = [
            ['Mã thiết bị', 'Tên thiết bị', 'Ngày bắt đầu', 'Ngày hoàn thành', 'Người thực hiện', 'Đơn vị bảo trì', 'Chi phí'],
              ...maintenanceInfoExport.map(record => [
              record.device.deviceID,
              record.device.deviceName,
              record.startDate,
              record.finishedDate,
              record.performer,
              record.maintenanceServiceProvider,
              record.cost,
              ],)
        ];
        setCSVData(csvSetUpData);
    }, [accessToken, maintenanceInfoExport, searchQuery, selectedMonth, selectedProviders]);

    return (
        <>
            <ToastContainer containerId="deleteMaintenanceInfoToast" limit={1}/>
            <ModalAddMaintenanceInfo isModalOpen={isAddFormOpen} setIsModalOpen={setIsAddFormOpen} updateListMaintenanceInfo={getListMaintenanceInfos} />
            <ModalDeviceDueMaintenance isModalOpen={isDueMaintenanceModalOpen} setIsModalOpen={setIsDueMaintenanceModalOpen} />
            {selectedRecord && <ModalEditMaintenanceInfo isModalOpen={isEditFormOpen} setIsModalOpen={setIsEditFormOpen} updateListMaintenanceInfo={getListMaintenanceInfos} record={selectedRecord} setSelectedRecord={setSelectedRecord} />}
            <div className="list-maintenance-page">
                <h2 className="name-page">Danh sách thông tin bảo trì thiết bị y tế</h2>
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
                            <span>Thêm thông tin bảo trì</span>
                        </div>
                        <div onClick={openModalDeviceDueMaintenance} className="button">
                            <span>Thiết bị sắp tới hạn định kỳ</span>
                        </div>
                        <CSVLink className="export-button" data={csvData} filename="list-maintenance-info.csv">
                            <div className="button">Xuất file</div>
                        </CSVLink>
                    </div>
                    <div className="right-action-container">
                        <div className="num-devices">{count} thông tin bảo trì</div>
                        <div className="search-box search-box-maintenance">
                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Tìm kiếm theo thiết bị/người thực hiện bảo trì" 
                                onChange={handleSearchInputChange}
                            />
                            <img src={SearchIcon} alt="searchIcon" />
                        </div>
                    </div>
                </div>
                <div className="table-list-usage-info">
                    <table>
                        <tbody>
                            <tr className="col-name">
                                <th style={{width: "11%"}}>Mã thiết bị</th>
                                <th style={{width: "19%"}}>Tên thiết bị</th>
                                <th style={{width: "11%"}}>Ngày bắt đầu</th>
                                <th style={{width: "11%"}}>Ngày kết thúc</th>
                                <th style={{width: "15%"}}>Người thực hiện</th>
                                <th style={{width: "18%"}} className={`${dropdownFilterStates || selectedProviders.length > 0 ? 'selected' : ''}`}>
                                    <span>Đơn vị bảo trì</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown()} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "10%"}}>Chi phí</th>
                                <th style={{width: "5%"}}></th>
                            </tr>
                            {maintenanceInfos?.length > 0 && maintenanceInfos.map((record, index) => (
                            <tr key={record._id} className="record"> 
                                <td>{record.device?.deviceID}</td>
                                <td>{record.device?.deviceName}</td>
                                <td>{transformDate(new Date(record.startDate).toISOString().split("T")[0])}</td>
                                <td>{transformDate(new Date(record.finishedDate).toISOString().split("T")[0])}</td>
                                <td>{record.performer}</td>
                                <td>{record.maintenanceServiceProvider}</td>
                                <td>{record.cost && formatNumber(record.cost)} VND</td>
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
                {maintenanceInfos?.length > 0 && 
                <div className="pagination">
                    <div className="btn" onClick={() => handlePageChange(1)}>Trang đầu</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage - 1)}>Trang trước</div>
                    <div style={{marginTop: "3px", width: "200px", textAlign: "center"}}>Trang <span style={{fontWeight: "700"}}>{currentPage}</span> trên {totalPages}</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage + 1)}>Trang sau</div>
                    <div className="btn" onClick={() => handlePageChange(totalPages)}>Trang cuối</div>
                </div> 
                }
                {dropdownFilterStates && (
                    <div className="filter-service-provider filter">
                        <form>
                            <div className="filter-name"><h3>Lọc theo đơn vị bảo trì</h3></div>
                            <div className="filter-container">
                            {serviceProviders.map((provider, index) => (
                                <div key={index} className="filter-option">
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={provider}
                                            onChange={e => handleFilterChange(e, setSelectedProviders)}
                                            checked={selectedProviders.includes(provider)}
                                        />
                                        {provider}
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

export default ListInfoMaintenance;