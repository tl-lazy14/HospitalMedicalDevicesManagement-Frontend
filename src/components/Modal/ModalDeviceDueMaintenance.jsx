import './Modal.css';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import { transformDate } from '../../utils/utils';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import api from '../axiosInterceptor';

const ModalDeviceDueMaintenance = ({ isModalOpen, setIsModalOpen }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [listDeviceDueMaintenance, setListDeviceDueMaintenance] = useState([]);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getDeviceDueForMaintenance = async () => {
        try {
            const response = await api.get('/device/maintenance/due', {
              headers: { token: `Bearer ${accessToken}` },
            });
            setListDeviceDueMaintenance(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        getDeviceDueForMaintenance();
    }, []);

    const customModalStyle = {
        content: {
          overflow: 'auto', // hoặc 'scroll' tùy vào thiết kế của bạn
          maxHeight: '80vh', // Đặt chiều cao tối đa cho nội dung Modal
        },
      };

    return (
        <>
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={true} 
                shouldCloseOnEsc={true}
                style={customModalStyle}
                className="modal-device modal-due-maintenance"
                overlayClassName="overlay-device" 
            >
                <h2>Danh sách các thiết bị sắp tới hạn bảo trì định kỳ</h2>
                <div className='close-modal-due-maintenance'>
                    <FontAwesomeIcon onClick={closeModal} className="icon" icon={faCircleXmark} />
                </div>
                <div>
                    <table>
                        <tbody>
                            <tr className="col-name">
                                <th style={{width: "15%"}}>STT</th>
                                <th style={{width: "20%"}}>Mã thiết bị</th>
                                <th style={{width: "40%"}}>Tên thiết bị</th>
                                <th style={{width: "25%"}}>Ngày bảo trì dự kiến</th>
                            </tr>
                            {listDeviceDueMaintenance?.length > 0 && listDeviceDueMaintenance.map((record, index) => (
                            <tr key={record._id} className="record"> 
                                <td style={{paddingLeft: '30px'}}>{index + 1}</td>
                                <td style={{paddingLeft: '10px'}}>{record.deviceID}</td>
                                <td>{record.deviceName}</td>
                                <td style={{paddingLeft: '35px'}}>{transformDate(new Date(record.date).toISOString().split("T")[0])}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </>
    );
}

export default ModalDeviceDueMaintenance;