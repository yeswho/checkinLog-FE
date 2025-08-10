const columns = [
    { name: "ID", uid: "bookingId", sortable: true },
    { name: "CUSTOMER", uid: "customer", sortable: true },
    { name: "ROOM", uid: "room", sortable: true },
    { name: "CHECK IN", uid: "checkIn", sortable: true },
    { name: "CHECK OUT", uid: "checkOut", sortable: true },
    { name: "DURATION", uid: "duration", sortable: true },
    { name: "ROOM TOTAL", uid: "totalPrice", sortable: true },
    {name:"ADDITIONAL", uid: "additionalCharges", sortable:true},
    { name: "STATUS", uid: "status", sortable: true },
    { name: "CREATED AT", uid: "createdAt", sortable: true },
    { name: "UPDATED AT", uid: "updatedAt", sortable: true },
    { name: "ACTIONS", uid: "actions" }
  ];
  
  const statusOptions = [
    { name: "Confirmed", uid: "confirmed" },
    { name: "Checked In", uid: "checked-in" },
    { name: "Checked Out", uid: "checked-out" },
    { name: "Cancelled", uid: "cancelled" }
  ];
  
  const bookings = [
    {
      bookingId: 1,
      customer: {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        contactNumber: "1234567890"
      },
      room: {
        id: 101,
        name: "Deluxe Room 101",
        floor: "First Floor",
        roomType: "Deluxe",
        rate: 150
      },
      checkIn: "2024-03-15",
      checkOut: "2024-03-18",
      duration: 3,
      totalPrice: 450,
      status: "confirmed",
      createdAt: "2024-02-15",
      updatedAt: "2024-02-15"
    },
    {
      bookingId: 2,
      customer: {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        contactNumber: "0987654321"
      },
      room: {
        id: 202,
        name: "Suite 202",
        floor: "Second Floor",
        roomType: "Suite",
        rate: 250
      },
      checkIn: "2024-03-20",
      checkOut: "2024-03-25",
      duration: 5,
      totalPrice: 1250,
      status: "confirmed",
      createdAt: "2024-02-16",
      updatedAt: "2024-02-16"
    },
    {
      bookingId: 3,
      customer: {
        id: 3,
        name: "Michael Johnson",
        email: "michael.j@example.com",
        contactNumber: "5551234567"
      },
      room: {
        id: 303,
        name: "Standard Room 303",
        floor: "Third Floor",
        roomType: "Standard",
        rate: 100
      },
      checkIn: "2024-03-10",
      checkOut: "2024-03-12",
      duration: 2,
      totalPrice: 200,
      status: "checked-out",
      createdAt: "2024-02-10",
      updatedAt: "2024-03-12"
    },
    {
      bookingId: 4,
      customer: {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        contactNumber: "6669876543"
      },
      room: {
        id: 401,
        name: "Executive Suite 401",
        floor: "Fourth Floor",
        roomType: "Executive Suite",
        rate: 350
      },
      checkIn: "2024-03-25",
      checkOut: "2024-03-28",
      duration: 3,
      totalPrice: 1050,
      status: "confirmed",
      createdAt: "2024-02-20",
      updatedAt: "2024-02-20"
    },
    {
      bookingId: 5,
      customer: {
        id: 5,
        name: "Chris Brown",
        email: "chris.brown@example.com",
        contactNumber: "4441122334"
      },
      room: {
        id: 102,
        name: "Deluxe Room 102",
        floor: "First Floor",
        roomType: "Deluxe",
        rate: 150
      },
      checkIn: "2024-03-18",
      checkOut: "2024-03-20",
      duration: 2,
      totalPrice: 300,
      status: "cancelled",
      createdAt: "2024-02-18",
      updatedAt: "2024-02-19"
    },
    {
      bookingId: 6,
      customer: {
        id: 6,
        name: "Sarah Lee",
        email: "sarah.lee@example.com",
        contactNumber: "7778899000"
      },
      room: {
        id: 203,
        name: "Suite 203",
        floor: "Second Floor",
        roomType: "Suite",
        rate: 250
      },
      checkIn: "2024-04-01",
      checkOut: "2024-04-05",
      duration: 4,
      totalPrice: 1000,
      status: "confirmed",
      createdAt: "2024-02-25",
      updatedAt: "2024-02-25"
    },
    {
      bookingId: 7,
      customer: {
        id: 7,
        name: "David Martinez",
        email: "david.martinez@example.com",
        contactNumber: "1112233445"
      },
      room: {
        id: 304,
        name: "Standard Room 304",
        floor: "Third Floor",
        roomType: "Standard",
        rate: 100
      },
      checkIn: "2024-03-15",
      checkOut: "2024-03-16",
      duration: 1,
      totalPrice: 100,
      status: "checked-in",
      createdAt: "2024-03-14",
      updatedAt: "2024-03-15"
    },
    {
      bookingId: 8,
      customer: {
        id: 8,
        name: "Laura Wilson",
        email: "laura.wilson@example.com",
        contactNumber: "2223344556"
      },
      room: {
        id: 402,
        name: "Executive Suite 402",
        floor: "Fourth Floor",
        roomType: "Executive Suite",
        rate: 350
      },
      checkIn: "2024-04-10",
      checkOut: "2024-04-15",
      duration: 5,
      totalPrice: 1750,
      status: "confirmed",
      createdAt: "2024-03-01",
      updatedAt: "2024-03-01"
    },
    {
      bookingId: 9,
      customer: {
        id: 9,
        name: "Daniel Garcia",
        email: "daniel.garcia@example.com",
        contactNumber: "3334455667"
      },
      room: {
        id: 103,
        name: "Deluxe Room 103",
        floor: "First Floor",
        roomType: "Deluxe",
        rate: 150
      },
      checkIn: "2024-03-22",
      checkOut: "2024-03-24",
      duration: 2,
      totalPrice: 300,
      status: "confirmed",
      createdAt: "2024-02-22",
      updatedAt: "2024-02-22"
    },
    {
      bookingId: 10,
      customer: {
        id: 10,
        name: "Megan Young",
        email: "megan.young@example.com",
        contactNumber: "8885566778"
      },
      room: {
        id: 204,
        name: "Suite 204",
        floor: "Second Floor",
        roomType: "Suite",
        rate: 250
      },
      checkIn: "2024-04-05",
      checkOut: "2024-04-08",
      duration: 3,
      totalPrice: 750,
      status: "confirmed",
      createdAt: "2024-03-05",
      updatedAt: "2024-03-05"
    },
    {
        bookingId: 11,
        customer: {
          id: 11,
          name: "Paul Harris",
          email: "paul.harris@example.com",
          contactNumber: "9999988881"
        },
        room: {
          id: 305,
          name: "Standard Room 305",
          floor: "Third Floor",
          roomType: "Standard",
          rate: 100
        },
        checkIn: "2024-03-29",
        checkOut: "2024-03-31",
        duration: 2,
        totalPrice: 200,
        status: "confirmed",
        createdAt: "2024-02-25",
        updatedAt: "2024-02-25"
      },
      {
        bookingId: 12,
        customer: {
          id: 12,
          name: "Anna Collins",
          email: "anna.collins@example.com",
          contactNumber: "1110002223"
        },
        room: {
          id: 403,
          name: "Executive Suite 403",
          floor: "Fourth Floor",
          roomType: "Executive Suite",
          rate: 350
        },
        checkIn: "2024-04-12",
        checkOut: "2024-04-14",
        duration: 2,
        totalPrice: 700,
        status: "confirmed",
        createdAt: "2024-03-10",
        updatedAt: "2024-03-10"
      },
      {
        bookingId: 13,
        customer: {
          id: 13,
          name: "James Roberts",
          email: "james.roberts@example.com",
          contactNumber: "6665554443"
        },
        room: {
          id: 205,
          name: "Suite 205",
          floor: "Second Floor",
          roomType: "Suite",
          rate: 250
        },
        checkIn: "2024-03-16",
        checkOut: "2024-03-18",
        duration: 2,
        totalPrice: 500,
        status: "cancelled",
        createdAt: "2024-03-01",
        updatedAt: "2024-03-02"
      },
      {
        bookingId: 14,
        customer: {
          id: 14,
          name: "Lisa Chang",
          email: "lisa.chang@example.com",
          contactNumber: "2221133344"
        },
        room: {
          id: 306,
          name: "Standard Room 306",
          floor: "Third Floor",
          roomType: "Standard",
          rate: 100
        },
        checkIn: "2024-03-20",
        checkOut: "2024-03-22",
        duration: 2,
        totalPrice: 200,
        status: "checked-in",
        createdAt: "2024-03-18",
        updatedAt: "2024-03-20"
      },
      {
        bookingId: 15,
        customer: {
          id: 15,
          name: "Tom Baker",
          email: "tom.baker@example.com",
          contactNumber: "5556677889"
        },
        room: {
          id: 103,
          name: "Deluxe Room 103",
          floor: "First Floor",
          roomType: "Deluxe",
          rate: 150
        },
        checkIn: "2024-03-23",
        checkOut: "2024-03-25",
        duration: 2,
        totalPrice: 300,
        status: "confirmed",
        createdAt: "2024-03-02",
        updatedAt: "2024-03-02"
      },
      {
        bookingId: 16,
        customer: {
          id: 16,
          name: "Olivia Martin",
          email: "olivia.martin@example.com",
          contactNumber: "3332233445"
        },
        room: {
          id: 104,
          name: "Deluxe Room 104",
          floor: "First Floor",
          roomType: "Deluxe",
          rate: 150
        },
        checkIn: "2024-04-02",
        checkOut: "2024-04-04",
        duration: 2,
        totalPrice: 300,
        status: "confirmed",
        createdAt: "2024-03-15",
        updatedAt: "2024-03-15"
      },
      {
        bookingId: 17,
        customer: {
          id: 17,
          name: "Henry Turner",
          email: "henry.turner@example.com",
          contactNumber: "1115566770"
        },
        room: {
          id: 405,
          name: "Executive Suite 405",
          floor: "Fourth Floor",
          roomType: "Executive Suite",
          rate: 350
        },
        checkIn: "2024-04-06",
        checkOut: "2024-04-10",
        duration: 4,
        totalPrice: 1400,
        status: "confirmed",
        createdAt: "2024-03-20",
        updatedAt: "2024-03-20"
      },
      {
        bookingId: 18,
        customer: {
          id: 18,
          name: "Grace Foster",
          email: "grace.foster@example.com",
          contactNumber: "7774411223"
        },
        room: {
          id: 307,
          name: "Standard Room 307",
          floor: "Third Floor",
          roomType: "Standard",
          rate: 100
        },
        checkIn: "2024-03-27",
        checkOut: "2024-03-30",
        duration: 3,
        totalPrice: 300,
        status: "checked-out",
        createdAt: "2024-03-15",
        updatedAt: "2024-03-30"
      },
      {
        bookingId: 19,
        customer: {
          id: 19,
          name: "Samuel Carter",
          email: "samuel.carter@example.com",
          contactNumber: "6667788990"
        },
        room: {
          id: 206,
          name: "Suite 206",
          floor: "Second Floor",
          roomType: "Suite",
          rate: 250
        },
        checkIn: "2024-03-21",
        checkOut: "2024-03-23",
        duration: 2,
        totalPrice: 500,
        status: "confirmed",
        createdAt: "2024-03-07",
        updatedAt: "2024-03-07"
      },
      {
        bookingId: 20,
        customer: {
          id: 20,
          name: "Natalie White",
          email: "natalie.white@example.com",
          contactNumber: "1233214567"
        },
        room: {
          id: 104,
          name: "Deluxe Room 104",
          floor: "First Floor",
          roomType: "Deluxe",
          rate: 150
        },
        checkIn: "2024-03-19",
        checkOut: "2024-03-22",
        duration: 3,
        totalPrice: 450,
        status: "cancelled",
        createdAt: "2024-03-01",
        updatedAt: "2024-03-03"
      }
  ];
  
  export { columns, bookings, statusOptions };