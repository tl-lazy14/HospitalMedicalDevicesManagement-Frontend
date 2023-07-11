import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalAddDevice = ({ isModalOpen, setIsModalOpen, updateListDevice }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [newDevice, setNewDevice] = useState({
        deviceID: '',
        deviceName: '',
        serialNumber: '',
        classification: '',
        manufacturer: '',
        origin: '',
        manufacturingYear: '',
        importationDate: '',
        price: '',
        storageLocation: '',
        warrantyPeriod: '',
        maintenanceCycle: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewDevice((prevDevice) => ({
          ...prevDevice,
          [name]: value,
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewDevice({
            deviceID: '',
            deviceName: '',
            serialNumber: '',
            classification: '',
            manufacturer: '',
            origin: '',
            manufacturingYear: '',
            importationDate: '',
            price: '',
            storageLocation: '',
            warrantyPeriod: '',
            maintenanceCycle: '',
        });
    };

    const handleAddDevice = async () => {
        if (
            newDevice.deviceID.trim() === '' || 
            newDevice.deviceName.trim() === '' ||
            newDevice.serialNumber.trim() === '' ||
            newDevice.classification.trim() === '' ||
            newDevice.manufacturer.trim() === '' ||
            newDevice.origin.trim() === '' ||
            newDevice.manufacturingYear.trim() === '' ||
            newDevice.importationDate.trim() === '' ||
            newDevice.price.trim() === '' ||
            newDevice.storageLocation.trim() === '' ||
            newDevice.warrantyPeriod.trim() === '' ||
            newDevice.maintenanceCycle.trim() === ''
        ) {
            toast.error('Vui lòng nhập đầy đủ các trường thông tin', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationAddDevice",
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

        const numericRegex = /^\d+$/;
        if (
            !numericRegex.test(newDevice.manufacturingYear) ||
            !numericRegex.test(newDevice.price) ||
            !numericRegex.test(newDevice.maintenanceCycle)
        ) {
            toast.error('Vui lòng chỉ nhập ký tự số cho năm sản xuất, giá và chu kỳ bảo trì', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationAddDevice",
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
            const response = await api.post('/device', newDevice, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Thêm thiết bị thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'validationAddDevice',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: 'white',
                    fontSize: '17px',
                    backgroundColor: 'green',
                },
            });
            updateListDevice();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "validationAddDevice",
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
            <ToastContainer containerId="validationAddDevice" limit={1}/>
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Thêm thiết bị mới</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Mã thiết bị:</span>
                            <input
                            type="text"
                            name="deviceID"
                            value={newDevice.deviceID}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Tên thiết bị:</span>
                            <input
                            type="text"
                            name="deviceName"
                            value={newDevice.deviceName}
                            onChange={handleInputChange}
                            autoComplete='off'
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Số serial:</span>
                            <input
                            type="text"
                            name="serialNumber"
                            value={newDevice.serialNumber}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Phân loại:</span>
                            <select name="classification" value={newDevice.classification} onChange={handleInputChange}>
                                <option value="">Phân loại thiết bị</option>
                                <option value="TBYT Loại A">TBYT Loại A</option>
                                <option value="TBYT Loại B">TBYT Loại B</option>
                                <option value="TBYT Loại C">TBYT Loại C</option>
                                <option value="TBYT Loại D">TBYT Loại D</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Nhà sản xuất:</span>
                            <input
                            type="text"
                            name="manufacturer"
                            value={newDevice.manufacturer}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Nguồn gốc:</span>
                            <input
                            type="text"
                            name="origin"
                            value={newDevice.origin}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Năm sản xuất:</span>
                            <input
                            type="text"
                            name="manufacturingYear"
                            value={newDevice.manufacturingYear}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Ngày nhập thiết bị:</span>
                            <input
                            type="date"
                            name="importationDate"
                            value={newDevice.importationDate}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Giá: (VND)</span>
                            <input
                            type="text"
                            name="price"
                            value={newDevice.price}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Kho lưu trữ:</span>
                            <input
                            type="text"
                            name="storageLocation"
                            value={newDevice.storageLocation}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Hạn bảo hành:</span>
                            <input
                            type="date"
                            name="warrantyPeriod"
                            value={newDevice.warrantyPeriod}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Chu kỳ bảo trì:</span>
                            <input
                            type="text"
                            name="maintenanceCycle"
                            placeholder='Số tháng'
                            value={newDevice.maintenanceCycle}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={handleAddDevice}>
                        Thêm
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

export default ModalAddDevice;