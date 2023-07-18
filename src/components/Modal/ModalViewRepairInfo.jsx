import './Modal.css';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import { transformDate, transformDateTime, formatNumber } from '../../utils/utils';

const ModalViewRepairInfo = ({ isModalOpen, setIsModalOpen, record, setSelectedRecord, openEditForm }) => {

    const closeModal = () => {
        setSelectedRecord(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Thông tin sửa chữa thiết bị</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <span className='name-field'>Mã thiết bị:</span> {record?.device?.deviceID}
                    </div>
                    <div className='grid-col'>
                        <span className='name-field'>Tên thiết bị:</span> {record?.device?.deviceName}
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <span className='name-field'>Mã người báo cáo:</span> {record?.reporter?.userID}
                    </div>
                    <div className='grid-col'>
                        <span className='name-field'>Tên người báo cáo:</span> {record?.reporter?.name}
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <span className='name-field'>Thời gian phát hiện:</span> {record?.time && transformDateTime(record.time)}
                    </div>
                    <div className='grid-col'>
                        <span className='name-field'>Mô tả hỏng hóc:</span> {record?.description}
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <span className='name-field'>Ngày bắt đầu sửa:</span> {record?.startDate && transformDate(new Date(record.startDate).toISOString().split("T")[0])}
                    </div>
                    <div className='grid-col'>
                        <span className='name-field'>Ngày hoàn thành sửa:</span> {record?.finishedDate && transformDate(new Date(record.finishedDate).toISOString().split("T")[0])}
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <span className='name-field'>Đơn vị sửa chữa:</span> {record?.repairServiceProvider}
                    </div>
                    <div className='grid-col'>
                        <span className='name-field'>Chi phí:</span> {record?.cost && formatNumber(record.cost)} VND
                    </div>
                </div>
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={() => openEditForm(record)}>
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

export default ModalViewRepairInfo;