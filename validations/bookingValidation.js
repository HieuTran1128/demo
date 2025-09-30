function validateCreateBooking(data) {
    const errors = [];

    if (!data.customerId || data.customerId.trim() === '') {
        errors.push('Customer ID ko được để trống.');
    }

    if (!data.roomId || data.roomId.trim() === '') {
        errors.push('Room ID ko được để trống.');
    }

    if (!data.checkInDate || isNaN(Date.parse(data.checkInDate))) {
        errors.push('Check-in date không hợp lệ.');
    }

    if (!data.checkOutDate || isNaN(Date.parse(data.checkOutDate))) {
        errors.push('Check-out date không hợp lệ.');
    }

    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    
    if (checkIn.toString() === 'Invalid Date') {
        errors.push('Check-in date không hợp lệ.');
    }

    if (checkOut.toString() === 'Invalid Date') {
        errors.push('Check-out date không hợp lệ.');
    }
    
    if (checkIn >= checkOut) {
        errors.push('Check-out date phải sau check-in date.');
    }

    return errors;
}   

function validateSearchBookings(query) {
    const errors = [];

    if (!query.startDate) {
        errors.push('Start date ko được để trống.');
    }

    if (!query.endDate) {
        errors.push('End date ko được để trống.');
    }

    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    
    if (startDate.toString() === 'Invalid Date') {
        errors.push('Start date không hợp lệ.');
    }

    if (endDate.toString() === 'Invalid Date') {
        errors.push('End date không hợp lệ.');
    }

    if (startDate >= endDate) {
        errors.push('End date phải sau start date.');
    }

    return errors;
}

module.exports = {
    validateCreateBooking,
    validateSearchBookings
};