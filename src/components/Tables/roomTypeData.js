const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "BEDS", uid: "bed", sortable: true },
    { name: "AC", uid: "ac", sortable: true },
    { name: "BATHROOM", uid: "bathroom", sortable: true },
    { name: "CREATED AT", uid: "createdAt", sortable: true },
    { name: "UPDATED AT", uid: "updatedAt", sortable: true },
    { name: "ACTIONS", uid: "actions" }
  ];
  
  const roomTypes = [
    {
      id: 1,
      name: "Standard Single",
      bed: 1,
      ac: false,
      bathroom: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-02-10"
    },
    {
      id: 2,
      name: "Deluxe Single",
      bed: 1,
      ac: true,
      bathroom: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-02-10"
    },
    {
      id: 3,
      name: "Standard Double",
      bed: 2,
      ac: false,
      bathroom: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-02-10"
    },
    {
      id: 4,
      name: "Deluxe Double",
      bed: 2,
      ac: true,
      bathroom: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-02-10"
    },
    {
      id: 5,
      name: "Family Suite",
      bed: 3,
      ac: true,
      bathroom: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-02-10"
    },
    {
      id: 6,
      name: "Executive Suite",
      bed: 2,
      ac: true,
      bathroom: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-02-10"
    },
    {
      id: 7,
      name: "Budget Single",
      bed: 1,
      ac: false,
      bathroom: false,
      createdAt: "2024-01-15",
      updatedAt: "2024-02-10"
    },
    {
      id: 8,
      name: "Premium Double",
      bed: 2,
      ac: true,
      bathroom: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-02-10"
    }
];

  
  export { columns, roomTypes };