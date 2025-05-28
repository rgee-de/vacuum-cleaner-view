import { TestBed } from '@angular/core/testing';
import { VacuumPlanStoreService } from './vacuum-plan-store.service';
import { VacuumPlanModel } from '../models/vacuum-plan.model';
import { signal } from '@angular/core';

describe('VacuumPlanStoreService', () => {
  let service: VacuumPlanStoreService;

  const initialMockPlans: VacuumPlanModel[] = [
    {
      id: 'plan-1',
      name: 'Daily Clean',
      cycles: 1,
      roomIds: [1, 2, 3],
      settings: { fan_power: 60, water_box_mode: 201, mop_mode: 300 },
    },
    {
      id: 'plan-2',
      name: 'Kitchen & Living Room',
      cycles: 2,
      roomIds: [1, 2],
      settings: { fan_power: 80, water_box_mode: 202, mop_mode: 301 },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VacuumPlanStoreService],
    });
    service = TestBed.inject(VacuumPlanStoreService);
    // Reset service to a known state before each test by re-running loadPlans
    // This ensures tests are isolated.
    service.loadPlans();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadPlans', () => {
    it('should load initial mock plans into the signal', () => {
      // loadPlans is called in constructor and beforeEach, so plans should be populated
      expect(service.plans().length).toBe(initialMockPlans.length);
      expect(service.plans()).toEqual(initialMockPlans);
    });
  });

  describe('addPlan', () => {
    it('should add a new plan to the plans signal and generate an ID', () => {
      const newPlanData: Omit<VacuumPlanModel, 'id'> = {
        name: 'Evening Sweep',
        cycles: 1,
        roomIds: [3],
        settings: { fan_power: 70, water_box_mode: 200, mop_mode: 300 },
      };
      const initialPlanCount = service.plans().length;

      service.addPlan(newPlanData);

      const currentPlans = service.plans();
      expect(currentPlans.length).toBe(initialPlanCount + 1);
      const addedPlan = currentPlans.find(p => p.name === 'Evening Sweep');
      expect(addedPlan).toBeTruthy();
      expect(addedPlan?.id).toBeDefined();
      expect(addedPlan?.id.startsWith('plan-')).toBeTrue();
      expect(addedPlan?.cycles).toBe(newPlanData.cycles);
      expect(addedPlan?.roomIds).toEqual(newPlanData.roomIds);
    });
  });

  describe('updatePlan', () => {
    it('should update an existing plan in the plans signal', () => {
      const planToUpdateId = 'plan-1';
      const updatedPlanData: VacuumPlanModel = {
        id: planToUpdateId,
        name: 'Daily Clean Updated',
        cycles: 2,
        roomIds: [1, 2, 3, 4],
        settings: { fan_power: 65, water_box_mode: 202, mop_mode: 301 },
      };

      service.updatePlan(updatedPlanData);

      const updatedPlan = service.plans().find(p => p.id === planToUpdateId);
      expect(updatedPlan).toBeTruthy();
      expect(updatedPlan?.name).toBe('Daily Clean Updated');
      expect(updatedPlan?.cycles).toBe(2);
      expect(updatedPlan?.roomIds).toEqual([1, 2, 3, 4]);
      expect(updatedPlan?.settings.fan_power).toBe(65);
    });

    it('should not change the state if updating a non-existent plan', () => {
      const nonExistentPlan: VacuumPlanModel = {
        id: 'plan-non-existent',
        name: 'Non Existent',
        cycles: 1,
        roomIds: [1],
        settings: { fan_power: 60, water_box_mode: 201, mop_mode: 300 },
      };
      const initialPlans = [...service.plans()]; // Deep copy before operation

      service.updatePlan(nonExistentPlan);

      expect(service.plans()).toEqual(initialPlans);
    });
  });

  describe('deletePlan', () => {
    it('should remove an existing plan from the plans signal', () => {
      const planToDeleteId = 'plan-1';
      const initialPlanCount = service.plans().length;

      service.deletePlan(planToDeleteId);

      expect(service.plans().length).toBe(initialPlanCount - 1);
      expect(service.plans().find(p => p.id === planToDeleteId)).toBeUndefined();
    });

    it('should not change the state if deleting a non-existent plan', () => {
      const nonExistentPlanId = 'plan-non-existent';
      const initialPlanCount = service.plans().length;
      const initialPlans = [...service.plans()];

      service.deletePlan(nonExistentPlanId);

      expect(service.plans().length).toBe(initialPlanCount);
      expect(service.plans()).toEqual(initialPlans);
    });
  });
});
