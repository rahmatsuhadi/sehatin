export const periodGetter = (period: "week" | "month" | "3months") => {
  const today = new Date();
  const end = today.toISOString().split("T")[0];

  const start = new Date();
  if (period === "week") start.setDate(today.getDate() - 7);
  if (period === "month") start.setMonth(today.getMonth() - 1);
  if (period === "3months") start.setMonth(today.getMonth() - 3);

  return {
    dateFrom: start.toISOString().split("T")[0],
    dateTo: end,
  };
};
