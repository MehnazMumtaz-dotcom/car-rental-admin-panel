
const toDate = (d) => {
  if (!d) return null;
  return new Date(d);
};
export const isDateOverlap = (start1, end1, start2, end2) => {
  const s1 = toDate(start1);
  const e1 = toDate(end1);
  const s2 = toDate(start2);
  const e2 = toDate(end2);

  if (!s1 || !e1 || !s2 || !e2) return false;

  return s1 <= e2 && s2 <= e1;
};

export const checkBookingConflict = (newBooking, bookings = []) => {
  if (!newBooking?.vehicleId) return null;

  return bookings.find((b) => {

    if (Number(b.vehicleId) !== Number(newBooking.vehicleId)) {
      return false;
    }

    if (newBooking.id && b.id === newBooking.id) {
      return false;
    }

    return isDateOverlap(
      b.startDate,
      b.endDate,
      newBooking.startDate,
      newBooking.endDate
    );
  }) || null;
};
