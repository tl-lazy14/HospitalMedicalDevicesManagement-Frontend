export const transformDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

export const transformDateTime = (dateString) => {
    const utcTime = new Date(dateString);
    const localTime = utcTime.toLocaleString();
    return localTime;
};

export const formatNumber = (number) => {
    if (typeof number === 'number') {
        return number.toLocaleString('vi-VN');
    }
    return '';
};