export interface PropertiesModel {
  status: Status;
  clean_summary: CleanSummary;
  consumable: Consumable;
  last_clean_record: LastCleanRecord;
  dock_summary: DockSummary;
  dust_collection_mode_name: string;
}

export interface Status {
  msg_ver: number;
  msg_seq: number;
  state: number;
  battery: number;
  clean_time: number;
  clean_area: number;
  square_meter_clean_area: number;
  error_code: number;
  map_present: number;
  in_cleaning: number;
  in_returning: number;
  in_fresh_state: number;
  lab_status: number;
  water_box_status: number;
  back_type: number;
  wash_phase: number;
  wash_ready: number;
  fan_power: number;
  dnd_enabled: number;
  map_status: number;
  is_locating: number;
  lock_status: number;
  water_box_mode: number;
  water_box_carriage_status: number;
  mop_forbidden_enable: number;
  camera_status: number;
  is_exploring: number;
  home_sec_status: number;
  home_sec_enable_password: number;
  adbumper_status: number[];
  water_shortage_status: number;
  dock_type: number;
  dust_collection_status: number;
  auto_dust_collection: number;
  avoid_count: number;
  mop_mode: number;
  debug_mode: number;
  collision_avoid_status: number;
  switch_map_mode: number;
  dock_error_status: number;
  charge_status: number;
  unsave_map_reason: number;
  unsave_map_flag: number;
  wash_status: number | null;
  distance_off: number | null;
  in_warmup: number | null;
  dry_status: number | null;
  rdt: number | null;
  clean_percent: number;
  rss: number | null;
  dss: number | null;
  common_status: number | null;
  corner_clean_mode: number | null;
  error_code_name: string;
  state_name: string;
  water_box_mode_name: string;
  fan_power_options: string[];
  fan_power_name: string;
  mop_mode_name: string;
}

export interface CleanSummary {
  clean_time: number;
  clean_area: number;
  square_meter_clean_area: number;
  clean_count: number;
  dust_collection_count: number;
  records: number[];
  last_clean_t: number | null;
}

export interface Consumable {
  main_brush_work_time: number;
  side_brush_work_time: number;
  filter_work_time: number;
  filter_element_work_time: number;
  sensor_dirty_time: number;
  strainer_work_times: number;
  dust_collection_work_times: number;
  cleaning_brush_work_times: number;
  moproller_work_time: number | null;
  main_brush_time_left: number;
  side_brush_time_left: number;
  filter_time_left: number;
  sensor_time_left: number;
  strainer_time_left: number;
  dust_collection_time_left: number;
  cleaning_brush_time_left: number;
  mop_roller_time_left: number | null;
}

export interface LastCleanRecord {
  begin: number;
  begin_datetime: string;          // ISO-8601 string
  end: number;
  end_datetime: string;            // ISO-8601 string
  duration: number;
  area: number;
  square_meter_area: number;
  error: number;
  complete: number;
  start_type: number;
  clean_type: number;
  finish_reason: number;
  dust_collection_status: number;
  avoid_count: number;
  wash_count: number;
  map_flag: number;
}

export interface DockSummary {
  dust_collection_mode: DustCollectionMode;
  wash_towel_mode: WashTowelMode;
  smart_wash_params: SmartWashParams;
}

export interface DustCollectionMode {
  mode: number;
}

export interface WashTowelMode {
  wash_mode: number;
}

export interface SmartWashParams {
  smart_wash: number;
  wash_interval: number;
}
