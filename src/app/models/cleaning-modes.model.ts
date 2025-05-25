export interface ModeSettings {
  fan_power: number[];
  water_box_mode: number[];
  mop_mode: number[];
}

export interface CleaningModesModel {
  Vac: ModeSettings;
  Mop: ModeSettings;
  "Vac&Mop": ModeSettings;
  Custom: ModeSettings;

  [extraMode: string]: ModeSettings;
}

export const defaultCleaningModes = {
  Vac: {
    fan_power: [0],
    water_box_mode: [0],
    mop_mode: [0]
  },
  Mop: {
    fan_power: [0],
    water_box_mode: [0],
    mop_mode: [0]
  },
  "Vac&Mop": {
    fan_power: [0],
    water_box_mode: [0],
    mop_mode: [0]
  },
  Custom: {
    fan_power: [0],
    water_box_mode: [0],
    mop_mode: [0]
  }
}
