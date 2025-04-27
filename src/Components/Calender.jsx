import React from "react";

const Calendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();

  const daysArray = [...Array(daysInMonth).keys()].map((day) => day + 1);

  return (
    <div className="border p-4 rounded-lg shadow-md w-64">
      <h2 className="text-lg font-bold mb-4 text-center">{month} {year}</h2>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div key={index} className="text-sm font-medium text-center">{day}</div>
        ))}
        {daysArray.map((day) => (
          <div key={day} className="text-center border rounded p-1">{day}</div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
