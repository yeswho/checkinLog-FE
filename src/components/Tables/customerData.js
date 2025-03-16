const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "FIRST NAME", uid: "firstName", sortable: true },
    { name: "LAST NAME", uid: "lastName", sortable: true },
    { name: "ADDRESS", uid: "address" },
    { name: "DATE OF BIRTH", uid: "dateofbirth", sortable: true },
    { name: "CONTACT", uid: "contact" },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "GENDER", uid: "gender" },
    { name: "COMPANY", uid: "company" },
    { name: "CREATED AT", uid: "createdAt", sortable: true },
    { name: "UPDATED AT", uid: "updatedAt", sortable: true },
    {name: "ACTIONS", uid: "actions"},
  ];
  
  const genderOptions = [
    { name: "Male", uid: "male" },
    { name: "Female", uid: "female" },
    { name: "Other", uid: "other" },
  ];
  
  
  export { columns, genderOptions };
  
  