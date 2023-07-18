import "./PurchaseRequestPage.css";
import SearchIcon from "../../assets/SearchIcon.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { transformDate, formatNumber } from "../../utils/utils";
import { useState, useEffect } from "react";
import { CSVLink } from 'react-csv';
import api from "../../components/axiosInterceptor";

const PurchaseRequestPage = () => {

    const accessToken = localStorage.getItem('accessToken');

    const [purchaseRequests, setPurchaseRequests] = useState([]);
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

    const updateStatusRequest = async (request, status) => {
        try {
            const response = await api.put(`/purchase-request/status/${request._id}`, { status: status }, {
                headers: { token: `Bearer ${accessToken}` }
            });
            console.log(response.data);
            getListPurchaseRequests();
            setActiveRow(null);
        } catch (err) {
            console.log(err);
        }
    }

    const [selectedStatus, setSelectedStatus] = useState([]);

    const getListPurchaseRequests = async () => {
        try {
          const response = await api.get('/purchase-request/list-request', {
            headers: { token: `Bearer ${accessToken}` },
            params: {
              selectedStatus,
              searchQuery,
              page: currentPage,
              limit: 20
            }
          });
          setPurchaseRequests(response.data.list);
          setCountRequest(response.data.totalRequests);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    useEffect(() => {
        getListPurchaseRequests();
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

    const [purchaseRequestExport, setPurchaseRequestExport] = useState([]);
    const [csvData, setCSVData] = useState([]);

    const getPurchaseRequestForExport = async () => {
        try {
          const response = await api.get('/purchase-request/export', {
            headers: { token: `Bearer ${accessToken}` },
            params: {
              selectedStatus,
              searchQuery,
            }
          });
          setPurchaseRequestExport(response.data.list);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        getPurchaseRequestForExport();
        const csvSetUpData = [
            ['Mã người yêu cầu', 'Tên người yêu cầu', 'Tên thiết bị', 'Số lượng', 'Đơn giá dự kiến', 'Tổng tiền', 'Ngày yêu cầu', 'Trạng thái'],
              ...purchaseRequestExport.map(record => [
              record.requester.userID,
              record.requester.name,
              record.deviceName,
              record.quantity,
              record.unitPriceEstimated,
              record.totalAmountEstimated,
              record.dateOfRequest,
              record.status,
              ],)
        ];
        setCSVData(csvSetUpData);
    }, [accessToken, purchaseRequestExport, searchQuery, selectedStatus]);

    return (
        <>
            <div className="list-request-purchase-page">
                <h2 className="name-page">Danh sách yêu cầu mua sắm thiết bị y tế</h2>
                <div className="action-container">
                    <div className="left-action-container">
                        <CSVLink className="export-button" data={csvData} filename="list-purchase-request.csv">
                            <div className="button">Xuất file</div>
                        </CSVLink>
                    </div>
                    <div className="right-action-container">
                        <div className="num-devices">{countRequest} yêu cầu mua sắm</div>
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
                </div>
                <div className="table-list-purchase-request">
                    <table>
                        <tbody>
                            <tr className="col-name">
                                <th style={{width: "17%"}}>Người yêu cầu</th>
                                <th style={{width: "17%"}}>Tên thiết bị</th>
                                <th style={{width: "8%"}}>Số lượng</th>
                                <th style={{width: "13%"}}>Đơn giá dự kiến</th>
                                <th style={{width: "13%"}}>Thành tiền</th>
                                <th style={{width: "12%"}}>Ngày yêu cầu</th>
                                <th style={{width: "12%"}} className={`${dropdownFilterStates || selectedStatus.length > 0 ? 'selected' : ''}`}>
                                    <span>Trạng thái</span>
                                    <FontAwesomeIcon onClick={() => toggleFilterDropdown()} className="icon" icon={faCaretDown} />
                                </th>
                                <th style={{width: "8%"}}>Phê duyệt</th>
                            </tr>
                            {purchaseRequests?.length > 0 && purchaseRequests.map((request, index) => (
                            <tr key={request._id} className="record"> 
                                <td>{request.requester?.userID} - <br/>{request.requester?.name}</td>
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
                {purchaseRequests?.length > 0 && 
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

export default PurchaseRequestPage;