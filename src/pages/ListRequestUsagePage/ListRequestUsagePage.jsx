import "./ListRequestUsagePage.css";
import SearchIcon from "../../assets/SearchIcon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { transformDate } from "../../utils/utils";
import { useState, useEffect } from "react";
import api from "../../components/axiosInterceptor";

const ListRequestUsagePage = () => {

    const accessToken = localStorage.getItem('accessToken');

    const [usageRequests, setUsageRequests] = useState([]);
    const [countRequest, setCountRequest] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [dropdownFilterStates, setDropdownFilterStates] = useState([
        false, // Phòng sử dụng
        false, // Số lượng
        false, // Trạng thái
    ]);
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const defaultMonth = `${currentYear}-${currentMonth}`;
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

    const [activeRow, setActiveRow] = useState(null);

    const handleIconClick = (rowIndex) => {
        if (activeRow === rowIndex) setActiveRow(null);
        else setActiveRow(rowIndex);
    };

    const updateStatusRequest = async (request, status) => {
        try {
            const response = await api.put(`/usage/request/status/${request._id}`, { status: status }, {
                headers: { token: `Bearer ${accessToken}` }
            });
            console.log(response.data);
            getListUsageRequests();
            setActiveRow(null);
        } catch (err) {
            console.log(err);
        }
    }

    const [usageDepartments, setUsageDepartments] = useState([]);

    const [selectedUsageDepartment, setSelectedUsageDepartment] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);

    useEffect(() => {
        const getAllUsageDepartment = async () => {
            const response = await api.get('/usage/request/department', {
                headers: { token: `Bearer ${accessToken}` },
            });
            setUsageDepartments(response.data);
        };
        getAllUsageDepartment();
    }, [accessToken, usageRequests])

    const getListUsageRequests = async () => {
        try {
          const response = await api.post('/usage/request/list-request', {
            selectedUsageDepartment,
            selectedStatus,
            selectedMonth,
            searchQuery,
            page: currentPage,
            limit: 20
          }, {
            headers: { token: `Bearer ${accessToken}` },
          });
          setUsageRequests(response.data.request);
          setCountRequest(response.data.totalRequests);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    useEffect(() => {
        getListUsageRequests();
    }, [currentPage, searchQuery, selectedUsageDepartment, selectedMonth, selectedStatus]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedUsageDepartment, selectedStatus, searchQuery, selectedMonth])

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

    return (
        <>
            <div className="list-request-usage-page">
                <h2 className="name-page">Danh sách yêu cầu sử dụng thiết bị y tế</h2>
                <input 
                    type="month" 
                    className="select-month"
                    value={selectedMonth}
                    onChange={handleSelectMonthChange}
                />
                <div className="action-container">
                    <div className="num-requests">{countRequest} yêu cầu sử dụng</div>
                    <div className="search-box">
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Tìm kiếm theo người yêu cầu/tên thiết bị"
                            onChange={handleSearchInputChange} 
                        />
                        <img src={SearchIcon} alt="searchIcon" />
                    </div>
                </div>
                <div className="table-list-usage-request">
                    <table>
                        <tbody>
                            <tr className="col-name">
                                <th style={{width: "17%"}}>Người yêu cầu</th>
                                <th style={{width: "17%"}} className={`${dropdownFilterStates[0] || selectedUsageDepartment.length > 0 ? 'selected' : ''}`}>
                                    <span>Phòng sử dụng</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown(0)} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "17%"}}>Tên thiết bị</th>
                                <th style={{width: "7%"}}>Số lượng</th>
                                <th style={{width: "11%"}}>Ngày bắt đầu</th>
                                <th style={{width: "11%"}}>Ngày kết thúc</th>
                                <th style={{width: "12%"}} className={`${dropdownFilterStates[1] || selectedStatus.length > 0 ? 'selected' : ''}`}>
                                    <span>Trạng thái</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown(1)} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "8%"}}>Phê duyệt</th>
                            </tr>
                            {usageRequests?.length > 0 && usageRequests.map((request, index) => (
                            <tr key={request._id} className="record"> 
                                <td>{request.requester?.userID} - <br/>{request.requester?.name}</td>
                                <td>{request.usageDepartment}</td>
                                <td>{request.deviceName}</td>
                                <td style={{ paddingLeft: '30px' }}>{request.quantity}</td>
                                <td>{transformDate(new Date(request.startDate).toISOString().split("T")[0])}</td>
                                <td>{transformDate(new Date(request.endDate).toISOString().split("T")[0])}</td>
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
                                        <div className="accept-btn button" onClick={() => updateStatusRequest(request, 'Đã duyệt')}>
                                            Duyệt
                                        </div>
                                        <div className="refuse-btn button" onClick={() => updateStatusRequest(request, 'Đã từ chối')}>
                                            Từ chối
                                        </div>
                                    </div>
                                    )}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {usageRequests?.length > 0 && 
                <div className="pagination">
                    <div className="btn" onClick={() => handlePageChange(1)}>Trang đầu</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage - 1)}>Trang trước</div>
                    <div style={{marginTop: "3px", width: "200px", textAlign: "center"}}>Trang <span style={{fontWeight: "700"}}>{currentPage}</span> trên {totalPages}</div>
                    <div className="btn" onClick={() => handlePageChange(currentPage + 1)}>Trang sau</div>
                    <div className="btn" onClick={() => handlePageChange(totalPages)}>Trang cuối</div>
                </div> 
                }
                {dropdownFilterStates[0] && (
                    <div className="filter-usage-department filter">
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
                {dropdownFilterStates[1] && (
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

export default ListRequestUsagePage;