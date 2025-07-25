function parseThaiDateString(thaiDateTime) {
  // thaiDateTime: "2568-07-21 15:47:04.168"
  const [datePart, timePart] = thaiDateTime.split(' ');
  const [yearBE, month, day] = datePart.split('-').map(Number);
  const yearAD = yearBE - 543; // JS ต้องใช้ ค.ศ.

  // สร้าง Date object (ตาม UTC)
  return new Date(
    `${yearAD}-${String(month).padStart(2, '0')}-${String(day).padStart(
      2,
      '0'
    )}T${timePart}Z`
  );
}

export { parseThaiDateString };
