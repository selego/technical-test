import {formatDate} from "./index";

export const getCurrentMonthRange = () => {
    let currentDate = new Date();
    let firstDateOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let lastDateOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    let firstDay = firstDateOfTheMonth.toISOString();
    let lastDay = lastDateOfTheMonth.toISOString();

    return {firstDay, lastDay}
}

