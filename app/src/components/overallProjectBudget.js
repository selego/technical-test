import React, {useEffect, useState} from "react";
import api from "../services/api";
import {getCurrentMonthRange} from "../utils/date";

export const OverAllProjectBudget = () => {
    const [overallCost, setOverallCost] = useState(0);
    useEffect(() => {
        (async () => {
            const {firstDay, lastDay} = getCurrentMonthRange();
            const {data} = await api.get(`/activity/overall-cost?dateFrom=${firstDay}&dateTo=${lastDay}`);
            setOverallCost(data?.[0]?.totalCost);
        })();
    }, []);
    return (
        <div>
            Budget consumed this month:
            <span className="mt-2 text-[24px] text-[#212325] font-semibold"> {overallCost?.toFixed(2)}€</span>

        </div>
    )
}

export default OverAllProjectBudget