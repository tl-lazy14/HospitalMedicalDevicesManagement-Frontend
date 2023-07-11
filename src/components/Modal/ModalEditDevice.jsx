import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalEditDevice = ({ isModalOpen, setIsModalOpen, updateListDevice, device, setSelectedDevice }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [infoDevice, setInfoDevice] = useState({
        deviceID: device.deviceID,
        deviceName: device.deviceName,
        serialNumber: device.serialNumber,
        classification: device.classification,
        manufacturer: device.manufacturer,
        origin: device.origin,
        manufacturingYear: device.manufacturingYear,
        importationDate: new Date(device.importationDate).toISOString().split("T")[0],
        price: device.price,
        storageLocation: device.storageLocation,
        warrantyPeriod: new Date(device.warrantyPeriod).toISOString().split("T")[0],
        maintenanceCycle: device.maintenanceCycle.split(' ')[0],
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInfoDevice((prevDevice) => ({
          ...prevDevice,
          [name]: value,
        }));
    };

    const closeModal = () => {
        setSelectedDevice(null);
        setIsModalOpen(false);
    };

    const handleEditDevice = async () => {
        if (
            infoDevice.deviceID.trim() === '' || 
            infoDevice.deviceName.trim() === '' ||
            infoDevice.serialNumber.trim() === '' ||
            infoDevice.classification.trim() === '' ||
            infoDevice.manufacturer.trim() === '' ||
            infoDevice.origin.trim() === '' ||
            infoDevice.manufacturingYear.toString().trim() === '' ||
            infoDevice.importationDate.trim() === '' ||
            infoDevice.price.toString().trim() === '' ||
            infoDevice.storageLocation.trim() === '' ||
            infoDevice.warrantyPeriod.trim() === '' ||
            infoDevice.maintenanceCycle.trim() === ''
        ) {
            toast.error('Vui lòng nhập đầy đủ các trường thông tin', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationEditDevice",
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
            !numericRegex.test(infoDevice.manufacturingYear) ||
            !numericRegex.test(infoDevice.price) ||
            !numericRegex.test(infoDevice.maintenanceCycle)
        ) {
            toast.error('Vui lòng chỉ nhập ký tự số cho năm sản xuất, giá và chu kỳ bảo trì', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationEditDevice",
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
            const response = await api.put(`/device/${device._id}`, infoDevice, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Sửa thông tin thiết bị thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'validationEditDevice',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: 'white',
                    fontSize: '17px',
                    backgroundColor: 'green',
                    width: '400px'
                },
            });
            updateListDevice();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "validationEditDevice",
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
            <ToastContainer containerId="validationEditDevice" limit={1}/>
            <Modal 
                isOpen={isModalOpen} 
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Sửa thông tin thiết bị</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Mã thiết bị:</span>
                            <input
                            type="text"
                            name="deviceID"
                            value={infoDevice.deviceID}
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
                            value={infoDevice.deviceName}
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
                            value={infoDevice.serialNumber}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Phân loại:</span>
                            <select name="classification" value={infoDevice.classification} onChange={handleInputChange}>
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
                            value={infoDevice.manufacturer}
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
                            value={infoDevice.origin}
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
                            value={infoDevice.manufacturingYear}
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
                            value={infoDevice.importationDate}
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
                            value={infoDevice.price}
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
                            value={infoDevice.storageLocation}
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
                            value={infoDevice.warrantyPeriod}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Chu kỳ bảo trì: (Số tháng)</span>
                            <input
                            type="text"
                            name="maintenanceCycle"
                            placeholder='Số tháng'
                            value={infoDevice.maintenanceCycle}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={handleEditDevice}>
                        Sửa
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

export default ModalEditDevice;