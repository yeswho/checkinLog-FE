const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "CREATED AT", uid: "createdAt", sortable: true },
    { name: "UPDATED AT", uid: "updatedAt", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];
  
  const floors = [
    {
      id: 1,
      name: "Ground Floor",
      createdAt: "2024-01-15",
      updatedAt: "2024-02-10"
    },
    {
      id: 2,
      name: "First Floor",
      createdAt: "2024-01-16",
      updatedAt: "2024-02-11"
    },
    {
      id: 3,
      name: "Second Floor",
      createdAt: "2024-01-17",
      updatedAt: "2024-02-12"
    },
    {
      id: 4,
      name: "Third Floor",
      createdAt: "2024-01-18",
      updatedAt: "2024-02-13"
    },
    {
      id: 5,
      name: "Fourth Floor",
      createdAt: "2024-01-19",
      updatedAt: "2024-02-14"
    },
    {
      id: 6,
      name: "Fifth Floor",
      createdAt: "2024-01-20",
      updatedAt: "2024-02-15"
    },
    {
      id: 7,
      name: "Sixth Floor",
      createdAt: "2024-01-21",
      updatedAt: "2024-02-16"
    },
    {
      id: 8,
      name: "Seventh Floor",
      createdAt: "2024-01-22",
      updatedAt: "2024-02-17"
    }
];

  
  export { columns, floors };