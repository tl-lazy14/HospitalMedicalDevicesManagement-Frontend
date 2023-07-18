import "./ListDevicePage.css";
import PlusIcon from "../../assets/plusIcon.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faEllipsis, faEye, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/axiosInterceptor";
import ModalAddDevice from "../../components/Modal/ModalAddDevice";
import ModalEditDevice from "../../components/Modal/ModalEditDevice";
import { transformDate } from "../../utils/utils";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from 'react-csv';


const ListDevicePage = () => {

    const accessToken = localStorage.getItem('accessToken');

    const ACTIONS = {
        VIEW: 'view',
        EDIT: 'edit',
        DELETE: 'delete',
    };

    const navigate = useNavigate();

    const [devices, setDevices] = useState([]);
    const [countDevice, setCountDevice] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dropdownFilterStates, setDropdownFilterStates] = useState([
        false, // Phân loại
        false, // Nhà sản xuất
        false, // Kho lưu trữ
        false, // Trạng thái
    ]);

    const [activeRow, setActiveRow] = useState(null);

    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);

    const openAddFormModal = () => {
        setIsEditFormOpen(false);
        setIsAddFormOpen(true);
        setActiveRow(null);
        const newDropdownFilterStates = dropdownFilterStates.map(state => false);
        setDropdownFilterStates(newDropdownFilterStates);
    };

    const openEditFormModal = (device) => {
        setIsAddFormOpen(false);
        setSelectedDevice(device);
        setIsEditFormOpen(true);
        const newDropdownFilterStates = dropdownFilterStates.map(state => false);
        setDropdownFilterStates(newDropdownFilterStates);
    };

    const handleIconClick = (rowIndex) => {
        if (activeRow === rowIndex) setActiveRow(null);
        else setActiveRow(rowIndex);
    };

    const deleteDevice = async (device) => {
        try {
            const response = await api.delete(`/device/devices/${device._id}`, {
                headers: { token: `Bearer ${accessToken}` }
            });
            console.log(response.data);
            toast.success('Xóa thiết bị thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: "deleteDeviceToast",
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: 'white',
                    fontSize: '17px',
                    backgroundColor: 'green',
                },
            });
            getDevices();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                  position: toast.POSITION.TOP_RIGHT,
                  containerId: 'deleteDeviceToast',
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

    const handleAction = (action, device) => {
        if (action === 'view') {
            navigate(`/device-info/${device._id}`);
        }
        else if (action === 'edit') openEditFormModal(device);
        else if (action === 'delete') deleteDevice(device);
    
        // Sau khi thực hiện hành động, đặt activeRow về null để ẩn khung
        setActiveRow(null);
    };

    const [manufacturers, setManufacturers] = useState([]);
    const [storageLocations, setStorageLocation] = useState([]);

    const [selectedType, setSelectedType] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState([]);
    const [selectedStorageLocation, setSelectedStorageLocation] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);

    useEffect(() => {
        const getAllManufacturer = async () => {
            const response = await api.get('/device/manufacturers', {
                headers: { token: `Bearer ${accessToken}` },
            });
            setManufacturers(response.data);
        };
        const getAllStorageLocation = async () => {
            const response = await api.get('/device/storage-locations', {
                headers: { token: `Bearer ${accessToken}` },
            });
            setStorageLocation(response.data);
        };
        getAllManufacturer();
        getAllStorageLocation();
    }, [accessToken, devices])

    const getDevices = async () => {
        try {
          const response = await api.get('/device', {
            headers: { token: `Bearer ${accessToken}` },
            params: {
              selectedType,
              selectedManufacturer,
              selectedStorageLocation,
              selectedStatus,
              searchQuery,
              page: currentPage,
              limit: 20
            }
          });
          setDevices(response.data.devices);
          setCountDevice(response.data.totalDevices);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    useEffect(() => {
        getDevices();
    }, [accessToken, currentPage, searchQuery, selectedManufacturer, selectedStatus, selectedStorageLocation, selectedType]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedManufacturer, selectedStatus, selectedStorageLocation, selectedType, searchQuery])

    const toggleFilterDropdown = (index) => {
        const newDropdownFilterStates = dropdownFilterStates.map((state, i) => {
            if (i === index) {
              return !state;
            } else {
              return false;
            }
        });
        setDropdownFilterStates(newDropdownFilterStates);
    };

    const handleTypeFilterChange = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        // Cập nhật giá trị đã chọn
        if (isChecked) {
          setSelectedType(prevTypes => [...prevTypes, value]);
        } else {
          setSelectedType(prevTypes => prevTypes.filter(type => type !== value));
        }
    };

    const handleManufacturerFilterChange = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        // Cập nhật giá trị đã chọn
        if (isChecked) {
          setSelectedManufacturer(prevTypes => [...prevTypes, value]);
        } else {
          setSelectedManufacturer(prevTypes => prevTypes.filter(type => type !== value));
        }
    };
    
    const handleStorageFilterChange = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        // Cập nhật giá trị đã chọn
        if (isChecked) {
          setSelectedStorageLocation(prevTypes => [...prevTypes, value]);
        } else {
          setSelectedStorageLocation(prevTypes => prevTypes.filter(type => type !== value));
        }
    };

    const handleStatusFilterChange = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
    
        // Cập nhật giá trị đã chọn
        if (isChecked) {
          setSelectedStatus(prevTypes => [...prevTypes, value]);
        } else {
          setSelectedStatus(prevTypes => prevTypes.filter(type => type !== value));
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

    const [devicesExport, setDevicesExport] = useState([]);
    const [csvData, setCSVData] = useState([]);

    const getDevicesForExport = async () => {
        try {
          const response = await api.get('/device/export', {
            headers: { token: `Bearer ${accessToken}` },
            params: {
              selectedType,
              selectedManufacturer,
              selectedStorageLocation,
              selectedStatus,
              searchQuery,
            }
          });
          setDevicesExport(response.data.devices);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        getDevicesForExport();
        const csvSetUpData = [
            ['Mã thiết bị', 'Tên thiết bị', 'Số serial', 'Phân loại', 'Nhà sản xuất', 'Nguồn gốc', 'Năm sản xuất', 'Ngày nhập', 'Giá', 'Kho lưu trữ', 'Hạn bảo hành', 'Chu kỳ bảo trì', 'Trạng thái'],
              ...devicesExport.map(device => [
              device.deviceID,
              device.deviceName,
              device.serialNumber,
              device.classification,
              device.manufacturer,
              device.origin,
              device.manufacturingYear,
              device.importationDate,
              device.price,
              device.storageLocation,
              device.warrantyPeriod,
              device.maintenanceCycle,
              device.usageStatus,
              ],)
        ];
        setCSVData(csvSetUpData);
    }, [accessToken, devicesExport, searchQuery, selectedManufacturer, selectedStatus, selectedStorageLocation, selectedType]);

    return (
        <>
            <ToastContainer containerId="deleteDeviceToast" limit={1}/>
            <ModalAddDevice isModalOpen={isAddFormOpen} setIsModalOpen={setIsAddFormOpen} updateListDevice={getDevices} />
            {selectedDevice && <ModalEditDevice isModalOpen={isEditFormOpen} setIsModalOpen={setIsEditFormOpen} updateListDevice={getDevices} device={selectedDevice} setSelectedDevice={setSelectedDevice} />}
            <div className="list-device-page">
                <h2 className="name-page">Danh sách thông tin thiết bị y tế</h2>
                <div className="action-container">
                    <div className="left-action-container">
                        <div onClick={openAddFormModal} className="button">
                            <img src={PlusIcon} alt="plusIcon" />
                            <span>Thêm thiết bị</span>
                        </div>
                        <CSVLink className="export-button" data={csvData} filename="list-devices.csv">
                            <div className="button">Xuất file</div>
                        </CSVLink>
                    </div>
                    <div className="right-action-container">
                        <div className="num-devices">{countDevice} thiết bị</div>
                        <div className="search-box">
                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Tìm kiếm theo mã/tên thiết bị" 
                                onChange={handleSearchInputChange}
                            />
                            <img src={SearchIcon} alt="searchIcon" />
                        </div>
                    </div>
                </div>
                <div className="table-list-device">
                    <table>
                        <tbody>
                            <tr className="col-name">
                                <th style={{width: "12%"}}>Mã thiết bị</th>
                                <th style={{width: "17%"}}>Tên thiết bị</th>
                                <th style={{width: "10%"}} className={`${dropdownFilterStates[0] || selectedType.length > 0 ? 'selected' : ''}`}>
                                    <span>Phân loại</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown(0)} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "13%"}} className={`${dropdownFilterStates[1] || selectedManufacturer.length > 0 ? 'selected' : ''}`}>
                                    <span>Nhà sản xuất</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown(1)} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "12%"}}>Ngày nhập</th>
                                <th style={{width: "17%"}} className={`${dropdownFilterStates[2] || selectedStorageLocation.length > 0 ? 'selected' : ''}`}>
                                    <span>Kho lưu trữ</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown(2)} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "14%"}} className={`${dropdownFilterStates[3] || selectedStatus.length > 0 ? 'selected' : ''}`}>
                                    <span>Trạng thái</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown(3)} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "5%"}}></th>
                            </tr>
                            {devices.length > 0 && devices.map((device, index) => (
                            <tr key={device._id} className="record"> 
                                <td>{device.deviceID}</td>
                                <td>{device.deviceName}</td>
                                <td>{device.classification}</td>
                                <td>{device.manufacturer}</td>
                                <td>{transformDate(new Date(device.importationDate).toISOString().split("T")[0])}</td>
                                <td>{device.storageLocation}</td>
                                <td>{device.usageStatus}</td>
                                <td>
                                    <FontAwesomeIcon onClick={() => handleIconClick(index)} className={`option-icon ${activeRow === index ? 'selected-row' : ''}`} icon={faEllipsis} />
                                    {activeRow === index && (
                                    <div className="option-container">
                                        <div className="view-btn button" onClick={() => handleAction(ACTIONS.VIEW, device)}>
                                            <FontAwesomeIcon className="icon" icon={faEye} />
                                            Xem chi tiết
                                        </div>
                                        <div className="edit-btn button" onClick={() => handleAction(ACTIONS.EDIT, device)}>
                                            <FontAwesomeIcon className="icon" icon={faPenToSquare} />
                                            Sửa
                                        </div>
                                        <div className="delete-btn button" onClick={() => handleAction(ACTIONS.DELETE, device)}>
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
                {devices.length > 0 && 
                <div className="pagination">
                    <div className="btn" onClick={() => handlePageChange(1)}>Trang đầu</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage - 1)}>Trang trước</div>
                    <div style={{marginTop: "3px", width: "200px", textAlign: "center"}}>Trang <span style={{fontWeight: "700"}}>{currentPage}</span> trên {totalPages}</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage + 1)}>Trang sau</div>
                    <div className="btn" onClick={() => handlePageChange(totalPages)}>Trang cuối</div>
                </div> 
                }
                {dropdownFilterStates[0] && (
                    <div className="filter-type-device filter">
                        <form>
                            <div className="filter-name"><h3>Lọc theo phân loại</h3></div>
                            <div className="filter-container">
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="TBYT Loại A"
                                        onChange={handleTypeFilterChange}
                                        checked={selectedType.includes("TBYT Loại A")} 
                                    />
                                    TBYT Loại A
                                </label>
                            </div>
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="TBYT Loại B"
                                        onChange={handleTypeFilterChange}
                                        checked={selectedType.includes("TBYT Loại B")} 
                                    />
                                    TBYT Loại B
                                </label>
                            </div>
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="TBYT Loại C"
                                        onChange={handleTypeFilterChange} 
                                        checked={selectedType.includes("TBYT Loại C")}
                                    />
                                    TBYT Loại C
                                </label>
                            </div>
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="TBYT Loại D"
                                        onChange={handleTypeFilterChange} 
                                        checked={selectedType.includes("TBYT Loại D")}
                                    />
                                    TBYT Loại D
                                </label>
                            </div>
                            </div>
                            <button type="button">OK</button>
                        </form>                        
                    </div>
                )}
                {dropdownFilterStates[1] && (
                    <div className="filter-manufacturer filter">
                        <form>
                            <div className="filter-name"><h3>Lọc theo nhà sản xuất</h3></div>
                            <div className="filter-container">
                            {manufacturers.map(manufacturer => (
                                <div key={manufacturer} className="filter-option">
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={manufacturer}
                                            onChange={handleManufacturerFilterChange}
                                            checked={selectedManufacturer.includes(manufacturer)}
                                        />
                                        {manufacturer}
                                    </label>
                                </div>
                            ))}
                            </div>
                            <button type="button">OK</button>
                        </form>
                    </div>
                )}
                {dropdownFilterStates[2] && (
                    <div className="filter-storage filter">
                        <form>
                            <div className="filter-name"><h3>Lọc theo kho lưu trữ</h3></div>
                            <div className="filter-container">
                            {storageLocations.map(storageLocation => (
                                <div key={storageLocation} className="filter-option">
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={storageLocation}
                                            onChange={handleStorageFilterChange}
                                            checked={selectedStorageLocation.includes(storageLocation)}
                                        />
                                        {storageLocation}
                                    </label>
                                </div>
                            ))}
                            </div>
                            <button type="button">OK</button>
                        </form>
                    </div>
                )}
                {dropdownFilterStates[3] && (
                    <div className="filter-status filter">
                        <form>
                            <div className="filter-name"><h3>Lọc theo trạng thái</h3></div>
                            <div className="filter-container">
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Sẵn sàng sử dụng"
                                        onChange={handleStatusFilterChange}
                                        checked={selectedStatus.includes("Sẵn sàng sử dụng")}
                                    />
                                    Sẵn sàng sử dụng
                                </label>
                            </div>
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Đang sử dụng"
                                        onChange={handleStatusFilterChange}
                                        checked={selectedStatus.includes("Đang sử dụng")}
                                    />
                                    Đang sử dụng
                                </label>
                            </div>
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Hỏng"
                                        onChange={handleStatusFilterChange}
                                        checked={selectedStatus.includes("Hỏng")}
                                    />
                                    Hỏng
                                </label>
                            </div>
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Đang sửa chữa"
                                        onChange={handleStatusFilterChange}
                                        checked={selectedStatus.includes("Đang sửa chữa")}
                                    />
                                    Đang sửa chữa
                                </label>
                            </div>
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Đang bảo trì"
                                        onChange={handleStatusFilterChange}
                                        checked={selectedStatus.includes("Đang bảo trì")}
                                    />
                                    Đang bảo trì
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

export default ListDevicePage;