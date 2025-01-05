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