const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "FLOOR", uid: "floor", sortable: true },
  { name: "ROOM TYPE", uid: "room_type", sortable: true },
  { name: "RATE", uid: "rate",  sortable: true },
  { name: "STATUS", uid: "status",  sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "UPDATED AT", uid: "updatedAt", sortable: true },
  { name:"RESERVE", uid:"reserve"},
  {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
  { name: "Available", uid: "Available" },
  { name: "Occupied", uid: "Occupied" },
  { name: "Under Maintenance", uid: "Under Maintenance" },
  { name: "Unavailable", uid: "Unavailable" },
];

export { columns, statusOptions };
