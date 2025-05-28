import { Injectable, signal } from '@angular/core';
import { VacuumPlanModel } from '../models/vacuum-plan.model';

@Injectable({
  providedIn: 'root',
})
export class VacuumPlanStoreService {
  private readonly _plans = signal<VacuumPlanModel[]>([]);
  public readonly plans = this._plans.asReadonly();

  constructor() {
    this.loadPlans();
  }

  public loadPlans(): void {
    const mockPlans: VacuumPlanModel[] = [
      {
        id: 'plan-1',
        name: 'Daily Clean',
        cycles: 1,
        roomIds: [1, 2, 3],
        settings: {
          fan_power: 60,
          water_box_mode: 201,
          mop_mode: 300,
        },
      },
      {
        id: 'plan-2',
        name: 'Kitchen & Living Room',
        cycles: 2,
        roomIds: [1, 2],
        settings: {
          fan_power: 80,
          water_box_mode: 202,
          mop_mode: 301,
        },
      },
    ];
    this._plans.set(mockPlans);
  }

  public addPlan(plan: Omit<VacuumPlanModel, 'id'>): void {
    const newPlan: VacuumPlanModel = {
      ...plan,
      id: `plan-${Date.now().toString()}`,
    };
    this._plans.update((plans) => [...plans, newPlan]);
  }

  public updatePlan(updatedPlan: VacuumPlanModel): void {
    this._plans.update((plans) =>
      plans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
    );
  }

  public deletePlan(planId: string): void {
    this._plans.update((plans) => plans.filter((plan) => plan.id !== planId));
  }
}
