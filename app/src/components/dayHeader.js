import React from "react";

const DayHeader = ({day}) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const _date = new Date(day);
    const weekDayNumber = _date.getDay();
    const weekday = days[weekDayNumber];
    const date = _date.getDate();
    return (
        <th
            className={`w-[20px] border border-[#E5EAEF] text-[12px] font-semibold text-center ${weekDayNumber == 0 || weekDayNumber == 6 ? "bg-[#FFD5F1]" : "bg-[white]"}`}
            key={`day-header-${day}`}
            day={weekDayNumber}>

            <div>{weekday}</div>
            <div>{date}</div>
        </th>
    );
}

export default DayHeader