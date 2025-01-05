export interface RoomType {
    id: number;
    name: string;
    bed:number;
    ac: boolean;
    bathroom: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateRoomTypeDto {
    name: string;
    bed:number;
    ac: boolean;
    bathroom: boolean;
  }