import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VacuumPlanSetupComponent } from './vacuum-plan-setup.component';
import { VacuumPlanStoreService } from '../../../services/vacuum-plan-store.service';
import { RoomStoreService } from '../../../services/room-store.service';
import { VacuumPlanModel } from '../../../models/vacuum-plan.model';
import { RoomModel } from '../../../models/room.model';
import { signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

// Mock Services
class MockVacuumPlanStoreService {
  private _plans: WritableSignal<VacuumPlanModel[]> = signal([]);
  public plans = this._plans.asReadonly();

  constructor(initialPlans: VacuumPlanModel[] = []) {
    this._plans.set(initialPlans);
  }

  loadPlans() { /* Mock, actual load happens in constructor for test setup */ }
  addPlan = jasmine.createSpy('addPlan').and.callFake((plan: Omit<VacuumPlanModel, 'id'>) => {
    const newPlan = { ...plan, id: `new-${Math.random()}` };
    this._plans.update(plans => [...plans, newPlan]);
  });
  updatePlan = jasmine.createSpy('updatePlan').and.callFake((updatedPlan: VacuumPlanModel) => {
    this._plans.update(plans => plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  });
  deletePlan = jasmine.createSpy('deletePlan').and.callFake((planId: string) => {
    this._plans.update(plans => plans.filter(p => p.id !== planId));
  });
  setPlans(plans: VacuumPlanModel[]) { // Helper for tests
    this._plans.set(plans);
  }
}

class MockRoomStoreService {
  private _rooms: WritableSignal<RoomModel[]> = signal([]);
  public rooms = this._rooms.asReadonly();
  loadRooms = jasmine.createSpy('loadRooms').and.callFake(() => {
    this._rooms.set([
      { id: 1, name: 'Kitchen', segment_id: 101 },
      { id: 2, name: 'Living Room', segment_id: 102 },
      { id: 3, name: 'Bedroom', segment_id: 103 },
    ]);
  });
  setRooms(rooms: RoomModel[]) { // Helper for tests
    this._rooms.set(rooms);
  }
}

const mockInitialPlans: VacuumPlanModel[] = [
  { id: 'p1', name: 'Plan 1', cycles: 1, roomIds: [1], settings: { fan_power: 60, water_box_mode: 201, mop_mode: 300 } },
  { id: 'p2', name: 'Plan 2', cycles: 2, roomIds: [1, 2], settings: { fan_power: 70, water_box_mode: 202, mop_mode: 301 } },
];

describe('VacuumPlanSetupComponent', () => {
  let component: VacuumPlanSetupComponent;
  let fixture: ComponentFixture<VacuumPlanSetupComponent>;
  let mockVacuumPlanStoreService: MockVacuumPlanStoreService;
  let mockRoomStoreService: MockRoomStoreService;

  beforeEach(async () => {
    mockVacuumPlanStoreService = new MockVacuumPlanStoreService([...mockInitialPlans]); // Use a fresh copy
    mockRoomStoreService = new MockRoomStoreService();

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, VacuumPlanSetupComponent], // Import the standalone component
      providers: [
        { provide: VacuumPlanStoreService, useValue: mockVacuumPlanStoreService },
        { provide: RoomStoreService, useValue: mockRoomStoreService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VacuumPlanSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit and initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call roomStoreService.loadRooms on init', () => {
    expect(mockRoomStoreService.loadRooms).toHaveBeenCalled();
  });

  it('should display existing plans on init', () => {
    const planRows = fixture.debugElement.queryAll(By.css('.list-section table tbody tr'));
    expect(planRows.length).toBe(mockInitialPlans.length);
    const plan1Name = fixture.debugElement.query(By.css('.list-section table tbody tr:first-child td:first-child')).nativeElement.textContent;
    expect(plan1Name).toContain(mockInitialPlans[0].name);
  });

  describe('onAddPlan', () => {
    it('should call vacuumPlanStoreService.addPlan with new plan data and reset form', () => {
      component.newPlan = {
        name: 'Test Add Plan',
        cycles: 3,
        roomIds: [1, 3],
        settings: { fan_power: 80, water_box_mode: 203, mop_mode: 303 },
      };
      fixture.detectChanges();

      component.onAddPlan();
      fixture.detectChanges();

      expect(mockVacuumPlanStoreService.addPlan).toHaveBeenCalledWith(component.newPlan); // This was the value before reset
      expect(component.newPlan.name).toBe(''); // Check if form is reset
      expect(component.newPlan.cycles).toBe(1);
    });

    it('should show alert if plan name is missing', () => {
      spyOn(window, 'alert');
      component.newPlan = {
        name: '', // Missing name
        cycles: 1,
        roomIds: [1],
        settings: { fan_power: 60, water_box_mode: 201, mop_mode: 300 },
      };
      component.onAddPlan();
      expect(window.alert).toHaveBeenCalledWith('Plan name and at least one room are required.');
      expect(mockVacuumPlanStoreService.addPlan).not.toHaveBeenCalled();
    });

     it('should show alert if roomIds are empty', () => {
      spyOn(window, 'alert');
      component.newPlan = {
        name: 'Valid Name',
        cycles: 1,
        roomIds: [], // Missing rooms
        settings: { fan_power: 60, water_box_mode: 201, mop_mode: 300 },
      };
      component.onAddPlan();
      expect(window.alert).toHaveBeenCalledWith('Plan name and at least one room are required.');
      expect(mockVacuumPlanStoreService.addPlan).not.toHaveBeenCalled();
    });
  });

  describe('onSelectEditPlan', () => {
    it('should set editingPlan with a deep copy of the selected plan', () => {
      const planToEdit = mockInitialPlans[0];
      component.onSelectEditPlan(planToEdit);
      expect(component.editingPlan).toEqual(planToEdit);
      expect(component.editingPlan).not.toBe(planToEdit); // Ensure it's a copy
    });
  });

  describe('onUpdatePlan', () => {
    it('should call vacuumPlanStoreService.updatePlan and clear editingPlan', () => {
      const planToEdit = { ...mockInitialPlans[0] }; // Create a copy to simulate selection
      component.editingPlan = planToEdit;
      fixture.detectChanges();

      // Simulate a change
      if (component.editingPlan) {
        component.editingPlan.name = 'Updated Plan Name';
        component.editingPlan.cycles = 5;
      }
      fixture.detectChanges();

      component.onUpdatePlan();
      fixture.detectChanges();

      expect(mockVacuumPlanStoreService.updatePlan).toHaveBeenCalledWith(jasmine.objectContaining({
        id: planToEdit.id,
        name: 'Updated Plan Name',
        cycles: 5
      }));
      expect(component.editingPlan).toBeNull();
    });

     it('should show alert if editing plan name is missing', () => {
      spyOn(window, 'alert');
      const planToEdit = { ...mockInitialPlans[0] };
      component.editingPlan = planToEdit;
       if(component.editingPlan) component.editingPlan.name = ''; // Invalid name

      component.onUpdatePlan();
      expect(window.alert).toHaveBeenCalledWith('Plan name and at least one room are required.');
      expect(mockVacuumPlanStoreService.updatePlan).not.toHaveBeenCalled();
    });
  });

  describe('onDeletePlan', () => {
    it('should call vacuumPlanStoreService.deletePlan with the correct ID after confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const planIdToDelete = mockInitialPlans[0].id;

      component.onDeletePlan(planIdToDelete);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this plan?');
      expect(mockVacuumPlanStoreService.deletePlan).toHaveBeenCalledWith(planIdToDelete);
    });

    it('should NOT call vacuumPlanStoreService.deletePlan if confirmation is false', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const planIdToDelete = mockInitialPlans[0].id;

      component.onDeletePlan(planIdToDelete);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this plan?');
      expect(mockVacuumPlanStoreService.deletePlan).not.toHaveBeenCalled();
    });
  });

  describe('cancelEdit', () => {
    it('should set editingPlan to null', () => {
      component.editingPlan = { ...mockInitialPlans[0] };
      component.cancelEdit();
      expect(component.editingPlan).toBeNull();
    });
  });

  describe('getRoomNames', () => {
    it('should return "N/A" for empty roomIds', () => {
      expect(component.getRoomNames([])).toBe('N/A');
    });

    it('should return comma-separated room names for given ids', () => {
      // Ensure rooms are loaded in the mock service
      mockRoomStoreService.loadRooms(); // This sets up the rooms signal
      fixture.detectChanges(); // Update component with rooms
      expect(component.getRoomNames([1, 2])).toBe('Kitchen, Living Room');
    });

    it('should return "ID X" for unknown room ids', () => {
      mockRoomStoreService.loadRooms();
      fixture.detectChanges();
      expect(component.getRoomNames([1, 99])).toBe('Kitchen, ID 99');
    });
  });

  describe('onRoomIdsChange', () => {
    it('should update newPlan.roomIds from comma-separated string', () => {
      const event = { target: { value: '1, 2, 3' } } as unknown as Event;
      component.onRoomIdsChange(event, 'newPlan');
      expect(component.newPlan.roomIds).toEqual([1, 2, 3]);
    });

    it('should update editingPlan.roomIds from comma-separated string', () => {
      component.editingPlan = { ...mockInitialPlans[0], roomIds: [] }; // Initialize editingPlan
      const event = { target: { value: '2,3' } } as unknown as Event;
      component.onRoomIdsChange(event, 'editingPlan');
      expect(component.editingPlan?.roomIds).toEqual([2, 3]);
    });

    it('should filter out NaN values', () => {
      const event = { target: { value: '1, abc, 2' } } as unknown as Event;
      component.onRoomIdsChange(event, 'newPlan');
      expect(component.newPlan.roomIds).toEqual([1, 2]);
    });
  });

  // Test form bindings (basic example)
  it('should update newPlan.name on input change', fakeAsync(() => {
    fixture.detectChanges(); // Ensure component is stable
    tick();

    const newPlanNameInput = fixture.debugElement.query(By.css('#newPlanName')).nativeElement as HTMLInputElement;
    newPlanNameInput.value = 'My New Plan Name';
    newPlanNameInput.dispatchEvent(new Event('input'));
    tick(); // Allow time for ngModel to update
    fixture.detectChanges();

    expect(component.newPlan.name).toBe('My New Plan Name');
  }));

  it('should display available rooms in the new plan form', fakeAsync(() => {
    mockRoomStoreService.loadRooms(); // Ensure rooms are loaded
    fixture.detectChanges();
    tick(); // Allow signals to propagate and UI to update

    const availableRoomsSmallText = fixture.debugElement.query(By.css('form[ngsubmit="onAddPlan()"] small')).nativeElement.textContent;
    expect(availableRoomsSmallText).toContain('Kitchen (1)');
    expect(availableRoomsSmallText).toContain('Living Room (2)');
    expect(availableRoomsSmallText).toContain('Bedroom (3)');
  }));
});
