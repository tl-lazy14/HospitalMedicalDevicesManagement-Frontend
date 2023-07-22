import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalCreateFaultReport = ({ isModalOpen, setIsModalOpen, updateList, user }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [newReport, setNewReport] = useState({
        reporter: user._id,
        device: {
            deviceID: '',
            deviceName: '',
        },
        time: '',
        description: '',
    });

    const getDeviceNameByID = async (id) => {
        try {
            if (!id) {
                setNewReport((prevInfo) => ({
                    ...prevInfo,
                    device: {
                      ...prevInfo.device,
                      deviceName: '',
                    },
                }));
            }
            else {
                const response = await api.get(`/device/getName/${id}`, {
                    headers: { token: `Bearer ${accessToken}` }
                });
                setNewReport((prevInfo) => ({
                    ...prevInfo,
                    device: {
                    ...prevInfo.device,
                    deviceName: response.data,
                    },
                }))
            };
        } catch (err) {
            console.log(err);
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name.startsWith('device')) {
            const [field, nestedField] = name.split('.');
            setNewReport((prevInfo) => ({
              ...prevInfo,
              device: {
                ...prevInfo.device,
                [nestedField]: value,
              },
            }));
        } else {
            // Xử lý các trường còn lại bình thường
            setNewReport((prevInfo) => ({
              ...prevInfo,
              [name]: value,
            }));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewReport({
            reporter: user._id,
            device: {
                deviceID: '',
                deviceName: '',
            },
            time: '',
            description: '',
        });
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
                containerId: "validationCreateFaultReport",
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
            const response = await api.post('/faultRepair/fault/report', newReport, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Tạo và gửi báo cáo thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'validationCreateFaultReport',
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
                    containerId: "validationCreateFaultReport",
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
            <ToastContainer containerId="validationCreateFaultReport" limit={1}/>
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
                            name="device.deviceID"
                            value={newReport.device.deviceID}
                            onChange={handleInputChange}
                            onBlur={() => {getDeviceNameByID(newReport.device.deviceID);}}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Tên thiết bị:</span>
                            <input
                            type="text"
                            name="device.deviceName"
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

export default ModalCreateFaultReport;