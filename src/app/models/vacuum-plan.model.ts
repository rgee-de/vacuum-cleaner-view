import { RoomModel } from './room.model';

export interface VacuumPlanModel {
  id: string;
  name: string;
  cycles: number;
  roomIds: number[];
  settings: {
    fan_power: number;
    water_box_mode: number;
    mop_mode: number;
  };
}
