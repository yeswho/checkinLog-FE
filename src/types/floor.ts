export interface Floor {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateFloorDto {
    name: string;
  }