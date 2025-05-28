import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomStoreService } from '../../../services/room-store.service';
import { VacuumPlanStoreService } from '../../../services/vacuum-plan-store.service';
import { VacuumPlanModel } from '../../../models/vacuum-plan.model';
import { RoomModel } from '../../../models/room.model';

@Component({
  selector: 'app-vacuum-plan-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vacuum-plan-setup.component.html',
  styleUrls: ['./vacuum-plan-setup.component.css'],
})
export class VacuumPlanSetupComponent implements OnInit {
  private vacuumPlanStoreService = inject(VacuumPlanStoreService);
  private roomStoreService = inject(RoomStoreService);

  plans = this.vacuumPlanStoreService.plans;
  rooms = this.roomStoreService.rooms;

  newPlan: Omit<VacuumPlanModel, 'id'> = {
    name: '',
    cycles: 1,
    roomIds: [],
    settings: {
      fan_power: 60,
      water_box_mode: 201,
      mop_mode: 300,
    },
  };

  editingPlan: VacuumPlanModel | null = null;

  ngOnInit(): void {
    // Assuming roomStoreService.load() is available and needed.
    // If rooms are loaded globally or by another service, this might not be necessary.
    this.roomStoreService.loadRooms();
  }

  onAddPlan(): void {
    if (!this.newPlan.name || this.newPlan.roomIds.length === 0) {
      alert('Plan name and at least one room are required.');
      return;
    }
    this.vacuumPlanStoreService.addPlan(this.newPlan);
    this.newPlan = {
      name: '',
      cycles: 1,
      roomIds: [],
      settings: {
        fan_power: 60,
        water_box_mode: 201,
        mop_mode: 300,
      },
    };
  }

  onSelectEditPlan(plan: VacuumPlanModel): void {
    // Create a deep copy for editing to avoid modifying the original object in the signal directly
    this.editingPlan = JSON.parse(JSON.stringify(plan));
  }

  onUpdatePlan(): void {
    if (this.editingPlan) {
      if (!this.editingPlan.name || this.editingPlan.roomIds.length === 0) {
        alert('Plan name and at least one room are required.');
        return;
      }
      this.vacuumPlanStoreService.updatePlan(this.editingPlan);
      this.editingPlan = null;
    }
  }

  onDeletePlan(planId: string): void {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.vacuumPlanStoreService.deletePlan(planId);
    }
  }

  cancelEdit(): void {
    this.editingPlan = null;
  }

  // Helper to convert comma-separated string to number array for roomIds
  onRoomIdsChange(event: Event, model: 'newPlan' | 'editingPlan'): void {
    const inputElement = event.target as HTMLInputElement;
    const roomIds = inputElement.value.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
    if (model === 'newPlan') {
      this.newPlan.roomIds = roomIds;
    } else if (this.editingPlan) {
      this.editingPlan.roomIds = roomIds;
    }
  }

  getRoomNames(roomIds: number[]): string {
    if (!roomIds || roomIds.length === 0) {
      return 'N/A';
    }
    return roomIds.map(id => this.rooms().find(r => r.id === id)?.name || `ID ${id}`).join(', ');
  }
}
