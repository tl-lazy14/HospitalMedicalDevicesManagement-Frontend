import { useNavigate, useParams } from 'react-router-dom';
import './DetailDevicePage.css';
import { useEffect, useState } from 'react';
import api from '../../components/axiosInterceptor';
import { transformDate, formatNumber } from '../../utils/utils';

const DetailDevicePage = () => {

    const { id } = useParams();
    const accessToken = localStorage.getItem('accessToken');
    const [device, setDevice] = useState({});
    const navigate = useNavigate();
    const [historyView, setHistoryView] = useState('usage');
    const [records, setRecords] = useState([]);

    const getInfoDevice = async () => {
        try {
            const response = await api.get(`/device/devices/${id}`, {
                headers: { token: `Bearer ${accessToken}` }
            });
            setDevice(response.data);
        } catch (err) {
            console.log('Error', err);
        }
    }

    const getUsageHistoryOfDevice = async () => {
        try {
            const response = await api.get(`/usage/history/${id}`, {
                headers: { token: `Bearer ${accessToken}` }
            });
            setRecords(response.data);
        } catch (err) {
            console.log('Error', err);
        }
    };

    const getFaultRepairHistoryOfDevice = async () => {
        try {
            const response = await api.get(`/faultRepair/${id}`, {
                headers: { token: `Bearer ${accessToken}` }
            });
            setRecords(response.data);
        } catch (err) {
            console.log('Error', err);
        }
    };

    const getMaintenanceHistoryOfDevice = async () => {
        try {
            const response = await api.get(`/maintenance/${id}`, {
                headers: { token: `Bearer ${accessToken}` }
            });
            setRecords(response.data);
        } catch (err) {
            console.log('Error', err);
        }
    };

    useEffect(() => {
        getInfoDevice();
    }, [id]);

    useEffect(() => {
        if (historyView === 'usage') getUsageHistoryOfDevice();
        else if (historyView === 'faultRepair') getFaultRepairHistoryOfDevice();
        else if (historyView === 'maintenance') getMaintenanceHistoryOfDevice();
    }, [historyView, id]);

    return (
        <>
            <div className="detail-info-page">
                <h2 className="name-page">Thông tin chi tiết thiết bị</h2>
                <h2 className='name-device'>{device.deviceID} - {device.deviceName}</h2>
                <div className='btn-back' onClick={() => navigate('/list-device')}>Quay về trang danh sách thiết bị</div>
                <div className='info-device-container'>
                    <div className='row'>
                        <div className='field-info'><span className='name-field'>Mã thiết bị:</span> {device.deviceID}</div>
                        <div className='field-info'><span className='name-field'>Tên thiết bị:</span> {device.deviceName}</div>
                    </div>
                    <div className='row'>
                        <div className='field-info'><span className='name-field'>Số serial:</span> {device.serialNumber}</div>
                        <div className='field-info'><span className='name-field'>Phân loại:</span> {device.classification}</div>
                    </div>
                    <div className='row'>
                        <div className='field-info'><span className='name-field'>Nhà sản xuất:</span> {device.manufacturer}</div>
                        <div className='field-info'><span className='name-field'>Nguồn gốc:</span> {device.origin}</div>
                    </div>
                    <div className='row'>
                        <div className='field-info'><span className='name-field'>Năm sản xuất:</span> {device.manufacturingYear}</div>
                        <div className='field-info'><span className='name-field'>Ngày nhập:</span> {device.importationDate && transformDate(new Date(device.importationDate).toISOString().split("T")[0])}</div>
                    </div>
                    <div className='row'>
                        <div className='field-info'><span className='name-field'>Giá mua:</span> {formatNumber(device.price)} VND</div>
                        <div className='field-info'><span className='name-field'>Kho lưu trữ:</span> {device.storageLocation}</div>
                    </div>
                    <div className='row'>
                        <div className='field-info'><span className='name-field'>Hạn bảo hành:</span> {device.warrantyPeriod && transformDate(new Date(device.warrantyPeriod).toISOString().split("T")[0])}</div>
                        <div className='field-info'><span className='name-field'>Chu kỳ bảo trì:</span> {device.maintenanceCycle}</div>
                    </div>
                    <div className='row'>
                        <div className='field-info'><span className='name-field'>Trạng thái:</span> {device.usageStatus}</div>
                    </div>
                </div>
                <div className='button-history-container'>
                    <div className={`btn ${historyView === 'usage' ? 'selected-btn' : ''}`} style={{borderRadius: '8px 0 0 8px'}} onClick={() => setHistoryView('usage')}>
                        Lịch sử sử dụng
                    </div>
                    <div className={`btn ${historyView === 'faultRepair' ? 'selected-btn' : ''}`} onClick={() => setHistoryView('faultRepair')}>
                        Lịch sử hỏng hóc
                    </div>
                    <div className={`btn ${historyView === 'maintenance' ? 'selected-btn' : ''}`} style={{borderRadius: '0 8px 8px 0'}} onClick={() => setHistoryView('maintenance')}>
                        Lịch sử bảo trì
                    </div>
                </div>
                <div className='view-history-content'>
                    {historyView === 'usage' && (
                    <><h2 className="title">Lịch sử sử dụng thiết bị</h2>
                    { records.length > 0 ?
                    <table>
                            <tbody>
                                <tr className="col-name detail-device-header">
                                    <th style={{ width: "10%" }}>STT</th>
                                    <th style={{ width: "25%" }}>Người yêu cầu</th>
                                    <th style={{ width: "25%" }}>Phòng sử dụng</th>
                                    <th style={{ width: "20%" }}>Ngày bắt đầu</th>
                                    <th style={{ width: "20%" }}>Ngày kết thúc</th>
                                </tr>
                                {records.map((record, index) => (
                                    <tr key={record._id} className="record">
                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                        <td>{record.requester?.userID} - {record.requester?.name}</td>
                                        <td>{record.usageDepartment}</td>
                                        <td>{record.startDate && transformDate(new Date(record.startDate).toISOString().split("T")[0])}</td>
                                        <td>{record.endDate && transformDate(new Date(record.endDate).toISOString().split("T")[0])}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> : <h3 className='no-found-record'>Thiết bị chưa được sử dụng lần nào</h3>}
                    </>
                    )}

                    {historyView === 'faultRepair' && (
                    <>  <h2 className="title">Lịch sử hỏng hóc & sửa chữa thiết bị</h2>
                        {records.length > 0 ? 
                        <table>
                            <tbody>
                                <tr className="col-name detail-device-header">
                                    <th style={{ width: "10%" }}>STT</th>
                                    <th style={{ width: "18%" }}>Mô tả hỏng hóc</th>
                                    <th style={{ width: "13%" }}>Quyết định sửa</th>
                                    <th style={{ width: "14%" }}>Ngày bắt đầu</th>
                                    <th style={{ width: "14%" }}>Ngày hoàn thành</th>
                                    <th style={{ width: "17%" }}>Đơn vị sửa chữa</th>
                                    <th style={{ width: "14%" }}>Chi phí</th>
                                </tr>
                                {records.map((record, index) => (
                                <tr key={record._id} className="record">
                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                    <td>{record.description}</td>
                                    <td>{record.repairStatus}</td>
                                    <td>{record.startDate && transformDate(new Date(record.startDate).toISOString().split("T")[0])}</td>
                                    <td>{record.finishedDate && transformDate(new Date(record.finishedDate).toISOString().split("T")[0])}</td>
                                    <td>{record.repairServiceProvider}</td>
                                    <td>{formatNumber(record.cost)} đ</td>
                                </tr>
                                ))}
                            </tbody>
                        </table> : <h3 className='no-found-record'>Thiết bị chưa từng hỏng lần nào</h3>}
                    </>
                    )}
                    
                    {historyView === 'maintenance' && (
                    <><h2 className="title">Lịch sử bảo trì thiết bị</h2>
                    {records.length > 0 ? 
                    <table>
                            <tbody>
                                <tr className="col-name detail-device-header">
                                    <th style={{ width: "10%" }}>STT</th>
                                    <th style={{ width: "15%" }}>Ngày bắt đầu</th>
                                    <th style={{ width: "15%" }}>Ngày hoàn thành</th>
                                    <th style={{ width: "20%" }}>Người thực hiện</th>
                                    <th style={{ width: "25%" }}>Đơn vị bảo trì</th>
                                    <th style={{ width: "15%" }}>Chi phí</th>
                                </tr>
                                {records.map((record, index) => (
                                    <tr key={record._id} className="record">
                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                        <td>{record.startDate && transformDate(new Date(record.startDate).toISOString().split("T")[0])}</td>
                                        <td>{record.finishedDate && transformDate(new Date(record.finishedDate).toISOString().split("T")[0])}</td>
                                        <td>{record.performer}</td>
                                        <td>{record.maintenanceServiceProvider}</td>
                                        <td>{formatNumber(record.cost)} đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> : <h3 className='no-found-record'>Thiết bị chưa được bảo trì lần nào</h3>}
                    </>
                    )}
                </div>
            </div>
        </>
    );
}

export default DetailDevicePage;
