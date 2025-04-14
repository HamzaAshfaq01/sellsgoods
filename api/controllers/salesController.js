import Order from "../models/orderModel.js";
import Sales from "../models/salesModel.js";
import dayjs from "dayjs";

const getSales = async (req, res) => {
  try {
    const { month, year } = req.query;

    
    let filter = {};
    if (month && year) {
      const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
      const endDate = dayjs(startDate).endOf("month").toDate();
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    const orders = await Order.find(filter).sort({ createdAt: 1 });

    const grouped = {};

    orders.forEach((order) => {
      const dateKey = dayjs(order.createdAt).format("YYYY-MM-DD");
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(order.total);
    });

    const results = await Promise.all(
      Object.entries(grouped).map(async ([date, totals]) => {
        const totalOrders = totals.length;
        const totalRevenue = totals.reduce((acc, curr) => acc + curr, 0);
        const averageOrderValue = totalRevenue / totalOrders;

        const dailyData = {
          date,
          totalOrders,
          totalRevenue,
          averageOrderValue,
          minOrderValue: Math.min(...totals),
          maxOrderValue: Math.max(...totals),
        };

        await Sales.findOneAndUpdate({ date }, dailyData, {
          upsert: true,
          new: true,
        });

        return dailyData;
      })
    );

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ message: "Sales data generated", data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate sales data" });
  }
};

export { getSales };
