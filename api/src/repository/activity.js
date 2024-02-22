const ActivityObject = require("../models/activity");

const getOverallCost = async (dateFrom, dateTo) => {
    return ActivityObject.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(dateFrom),
                    $lt: new Date(dateTo),
                }
            }
        },
        {
            $group: {
                _id: null,
                totalCost: {$sum: "$value"}
            }
        },
        {
            $project: {
                _id: 0,
                totalCost: 1,
            }
        }
    ])
}

module.exports = getOverallCost