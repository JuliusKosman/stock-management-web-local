export function addActivityLog({ action, productID, productName, quantity }) {
    const logs = JSON.parse(localStorage.getItem("activityLogs") || "[]");
    const newLog = {
      pic: "Admin",
      action,
      productID,
      productName,
      quantity,
      date: new Date().toISOString().slice(0, 10),
    };
    logs.push(newLog);
    localStorage.setItem("activityLogs", JSON.stringify(logs));
  }
  