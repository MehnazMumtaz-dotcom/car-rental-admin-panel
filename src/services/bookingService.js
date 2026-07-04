export const isDateOverlap = (start1, end1, start2, end2) => {
  return new Date(start1) <= new Date(end2) &&
         new Date(start2) <= new Date(end1);
};

export const checkBookingConflict = (newBooking, bookings) => {
  return bookings.find(b => {
    if (b.vehicle !== newBooking.vehicle) return false;

    return isDateOverlap(
      b.startDate,
      b.endDate,
      newBooking.startDate,
      newBooking.endDate
    );
  });
};