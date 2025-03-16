export interface Room {
  id: number;
  name: string;
  floor: {
    id: number;
    name: string;
  };
  room_type: {
    id: number;
    name: string;
  };
  status: string;
  rate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomDto {
  name: string;
  floor_id: string;
  roomType_id: string;
  rate: string;
  status: string;
}

// const updatedRoom = {
//   id: room.id,
//   name: formData.name,
//   floor: Array.from(formData.floor_id)[0],
//   room_type: Array.from(formData.roomType_id)[0],
//   rate: formData.rate,
//   status: formData.status,
//   createdAt: room.createdAt,
//   updatedAt: new Date().toISOString()
// };


export interface UpdateRoomDto {
  id: number;
  name: string;
  floor: {
    name: string;
  };
  roomType: {
    name: string;
  };
  rate: number;
}