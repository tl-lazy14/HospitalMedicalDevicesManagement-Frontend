import SearchIcon from "../../assets/SearchIcon.svg";
import PlusIcon from "../../assets/plusIcon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { formatNumber, transformDate } from "../../utils/utils";
import { useState, useEffect, useContext } from "react";
import api from "../../components/axiosInterceptor";
import { UserContext } from "../../components/userContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalCreatePurchaseRequest from "../../components/Modal/ModalCreatePurchaseRequest";
import ModalEditPurchaseRequest from "../../components/Modal/ModalEditPurchaseRequest";

const RequestPurchaseOperatorPage = () => {

    const accessToken = localStorage.getItem('accessToken');
    const { user } = useContext(UserContext);

    const [requests, setRequests] = useState([]);
    const [countRequest, setCountRequest] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dropdownFilterStates, setDropdownFilterStates] = useState(false);

    const [activeRow, setActiveRow] = useState(null);

    const handleIconClick = (rowIndex) => {
        if (activeRow === rowIndex) setActiveRow(null);
        else setActiveRow(rowIndex);
    };

    const [selectedStatus, setSelectedStatus] = useState([]);

    const handleAction = (action, record) => {
        if (record.status !== 'Đang chờ duyệt') {
            toast.error('Không thể thao tác do yêu cầu đã được phê duyệt hoặc từ chối', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "deletePurchaseRequestToast",
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
            else if (action === 'delete') deletePurchaseRequest(record);
        }
    
        // Sau khi thực hiện hành động, đặt activeRow về null để ẩn khung
        setActiveRow(null);
    };

    const deletePurchaseRequest = async (record) => {
        try {
            const response = await api.delete(`/purchase-request/crud/${record._id}`, {
                headers: { token: `Bearer ${accessToken}` }
            });
            console.log(response.data);
            toast.success('Hủy yêu cầu mua thiết bị thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: "deletePurchaseRequestToast",
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
            getMyPurchaseRequests();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                  position: toast.POSITION.TOP_RIGHT,
                  containerId: 'deletePurchaseRequestToast',
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

    const getMyPurchaseRequests = async () => {
        try {
          const response = await api.post(`/purchase-request/operator/${user._id}`, {
            selectedStatus,
            searchQuery,
            page: currentPage,
            limit: 20
          }, {
            headers: { token: `Bearer ${accessToken}` },
          });
          setRequests(response.data.list);
          setCountRequest(response.data.totalRecords);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    useEffect(() => {
        getMyPurchaseRequests();
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
            <ToastContainer containerId="deletePurchaseRequestToast" limit={1}/>
            <ModalCreatePurchaseRequest isModalOpen={isAddFormOpen} setIsModalOpen={setIsAddFormOpen} updateList={getMyPurchaseRequests} user={user} />
            {selectedRecord && <ModalEditPurchaseRequest isModalOpen={isEditFormOpen} setIsModalOpen={setIsEditFormOpen} updateList={getMyPurchaseRequests} request={selectedRecord} setSelectedRequest={setSelectedRecord} />}
            <div className="list-request-usage-page">
                <h2 className="name-page">Danh sách yêu cầu mua thiết bị y tế của bạn</h2>
                <div className="action-container">
                    <div className="left-action-container">
                        <div onClick={openAddFormModal} className="button">
                            <img src={PlusIcon} alt="plusIcon" />
                            <span>Tạo yêu cầu mới</span>
                        </div>
                    </div>
                    <div className="right-action-container">
                        <div className="num-devices">{countRequest} yêu cầu mua thiết bị</div>
                        <div className="search-box">
                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Tìm kiếm theo tên thiết bị" 
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
                                <th style={{width: "7%"}}>STT</th>
                                <th style={{width: "21%"}}>Tên thiết bị</th>
                                <th style={{width: "11%"}}>Số lượng</th>
                                <th style={{width: "13%"}}>Đơn giá dự kiến</th>
                                <th style={{width: "13%"}}>Tổng tiền dự kiến</th>
                                <th style={{width: "13%"}}>Ngày yêu cầu</th>
                                <th style={{width: "14%"}} className={`${dropdownFilterStates || selectedStatus.length > 0 ? 'selected' : ''}`}>
                                    <span>Trạng thái</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown()} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "8%"}}></th>
                            </tr>
                            {requests?.length > 0 && requests.map((request, index) => (
                            <tr key={request._id} className="record"> 
                                <td style={{ paddingLeft: '28px' }}>{20 * (currentPage - 1) + index + 1}</td>
                                <td>{request.deviceName}</td>
                                <td style={{ paddingLeft: '30px' }}>{request.quantity}</td>
                                <td>{formatNumber(request.unitPriceEstimated)} VND</td>
                                <td>{formatNumber(request.totalAmountEstimated)} VND</td>
                                <td>{transformDate(new Date(request.dateOfRequest).toISOString().split("T")[0])}</td>
                                <td>
                                    <span 
                                    className={request.status === 'Đã từ chối' ? 'status-refuse' : (request.status === 'Đang chờ duyệt' ? 'status-pending' : (request.status === 'Đã duyệt' ? 'status-accept' : ''))}
                                    >
                                        {request.status}
                                    </span>
                                </td>
                                <td style={{ paddingLeft: '20px' }}>
                                    <FontAwesomeIcon onClick={() => handleIconClick(index)} className={`option-icon ${activeRow === index ? 'selected-row' : ''}`} icon={faEllipsis} />
                                    {activeRow === index && (
                                    <div className="option-container">
                                        <div className="accept-btn button" onClick={() => handleAction('edit', request)}>
                                            Sửa yêu cầu
                                        </div>
                                        <div className="refuse-btn button" onClick={() => handleAction('delete', request)}>
                                            Hủy yêu cầu
                                        </div>
                                    </div>
                                    )}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {requests?.length > 0 && 
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
                            <div className="filter-name"><h3>Lọc theo trạng thái phê duyệt</h3></div>
                            <div className="filter-container">
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Đã duyệt"
                                        onChange={e => handleFilterChange(e, setSelectedStatus)}
                                        checked={selectedStatus.includes("Đã duyệt")}
                                    />
                                    Đã duyệt
                                </label>
                            </div>
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Đang chờ duyệt"
                                        onChange={e => handleFilterChange(e, setSelectedStatus)}
                                        checked={selectedStatus.includes("Đang chờ duyệt")}
                                    />
                                    Đang chờ duyệt
                                </label>
                            </div>
                            <div className="filter-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        value="Đã từ chối"
                                        onChange={e => handleFilterChange(e, setSelectedStatus)}
                                        checked={selectedStatus.includes("Đã từ chối")}
                                    />
                                    Đã từ chối
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

export default RequestPurchaseOperatorPage;