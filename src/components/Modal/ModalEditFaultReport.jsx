import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalEditFaultReport = ({ isModalOpen, setIsModalOpen, updateList, record, setSelectedRecord }) => {

    const accessToken = localStorage.getItem('accessToken');

    const time = new Date(record.time);

// Lấy các thành phần của thời gian
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const day = String(time.getDate()).padStart(2, '0');
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');

// Tạo chuỗi định dạng theo múi giờ địa phương (VD: "2023-07-19T02:42")
    const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    const [newReport, setNewReport] = useState({
        device: {
            deviceID: record.device.deviceID,
            deviceName: record.device.deviceName,
        },
        time: formattedTime,
        description: record.description,
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        // Xử lý các trường còn lại bình thường
        setNewReport((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    }

    const closeModal = () => {
        setSelectedRecord(null);
        setIsModalOpen(false);
    };

    const handleCreateReport = async () => {
        if (
            newReport.device.deviceID.trim() === '' || 
            newReport.device.deviceName.trim() === '' ||
            newReport.time.trim() === '' ||
            newReport.description.trim() === '' 
        ) {
            toast.error('Vui lòng nhập đầy đủ các trường thông tin', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationEditFaultReport",
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
            const response = await api.put(`/faultRepair/fault/report/${record._id}`, newReport, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Sửa và gửi báo cáo thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'validationEditFaultReport',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: 'white',
                    fontSize: '17px',
                    backgroundColor: 'green',
                },
            });
            updateList();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "validationEditFaultReport",
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
    };

    return (
        <>
            <ToastContainer containerId="validationEditFaultReport" limit={1}/>
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Tạo báo cáo hỏng hóc mới</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Mã thiết bị:</span>
                            <input
                            type="text"
                            value={newReport.device.deviceID}
                            disabled
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Tên thiết bị:</span>
                            <input
                            type="text"
                            value={newReport.device.deviceName}
                            disabled
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Thời gian phát hiện:</span>
                            <input
                            type="datetime-local"
                            name="time"
                            value={newReport.time}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Mô tả hỏng hóc:</span>
                            <input
                            type="text"
                            name="description"
                            value={newReport.description}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={handleCreateReport}>
                        Gửi
                    </button>
                    <button className='cancel-btn' type="button" onClick={closeModal}>
                        Hủy
                    </button>
                </div>
                </form>
            </Modal>
        </>
    );
}

export default ModalEditFaultReport;