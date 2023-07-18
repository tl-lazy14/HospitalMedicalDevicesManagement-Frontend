export const transformDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

export const transformDateTime = (dateString) => {
    const dateParts = dateString.split("T"); // Tách thành hai phần: ngày-tháng-năm và giờ-phút-giây
    const date = new Date(dateParts[0]); // Lấy phần ngày-tháng-năm
    const time = dateParts[1].substring(0, 5); // Lấy phần giờ:phút từ phần giờ-phút-giây
  
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year} ${time}`;
    return formattedDate;
  };

export const formatNumber = (number) => {
    if (typeof number === 'number') {
        return number.toLocaleString('vi-VN');
    }
    return '';
};