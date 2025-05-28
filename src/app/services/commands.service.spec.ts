import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommandsService } from './commands.service';
import { VacuumPlanModel } from '../models/vacuum-plan.model';
import { environment } from '../../environments/environment';
import { CleaningModesStoreService } from './cleaning-modes-store.service'; // Needed for service instantiation
import { signal } from '@angular/core'; // Needed for CleaningModesStoreService mock

describe('CommandsService', () => {
  let service: CommandsService;
  let httpMock: HttpTestingController;
  let cleaningModesStoreServiceMock: Partial<CleaningModesStoreService>;

  beforeEach(() => {
    cleaningModesStoreServiceMock = {
      // Mock any methods or properties used by CommandsService from CleaningModesStoreService
      // For 'executeVacuumPlan', it doesn't seem to directly use it, but 'cleanSegmentsCustom' does.
      // Providing a basic mock for modes signal as it's accessed in the service constructor indirectly.
      modes: signal({
        Custom: { fan_power: [0], water_box_mode: [0], mop_mode: [0] }
      })
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommandsService,
        { provide: CleaningModesStoreService, useValue: cleaningModesStoreServiceMock }
      ],
    });
    service = TestBed.inject(CommandsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Make sure that there are no outstanding requests.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('executeVacuumPlan', () => {
    const mockPlan: VacuumPlanModel = {
      id: 'plan-test-1',
      name: 'Test Plan',
      cycles: 2,
      roomIds: [10, 20],
      settings: {
        fan_power: 75,
        water_box_mode: 202,
        mop_mode: 302,
      },
    };

    it('should send clean/settings and then clean/segments requests', () => {
      service.executeVacuumPlan(mockPlan).subscribe(response => {
        expect(response).toBeTruthy(); // Or more specific checks on the final response
      });

      // Expect first request to 'clean/settings'
      const settingsReq = httpMock.expectOne(environment.apiEndpoint + 'clean/settings');
      expect(settingsReq.request.method).toBe('POST');
      expect(settingsReq.request.body).toEqual({
        mode: 'Custom',
        fan_power: mockPlan.settings.fan_power,
        water_box_mode: mockPlan.settings.water_box_mode,
        mop_mode: mockPlan.settings.mop_mode,
      });
      // Respond to the first request to trigger the next one in switchMap
      settingsReq.flush({ success: true }); // Mock response for settings

      // Expect second request to 'clean/segments'
      const segmentsReq = httpMock.expectOne(environment.apiEndpoint + 'clean/segments');
      expect(segmentsReq.request.method).toBe('POST');
      expect(segmentsReq.request.body).toEqual({
        segment_ids: mockPlan.roomIds,
        repeat: mockPlan.cycles,
      });
      segmentsReq.flush({ success: true }); // Mock response for segments
    });

    it('should handle errors from clean/settings request', () => {
      const errorResponse = { status: 500, statusText: 'Server Error' };
      service.executeVacuumPlan(mockPlan).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const settingsReq = httpMock.expectOne(environment.apiEndpoint + 'clean/settings');
      settingsReq.flush('Error', errorResponse);

      // No second request should be made
      httpMock.expectNone(environment.apiEndpoint + 'clean/segments');
    });

    it('should handle errors from clean/segments request', () => {
      const errorResponse = { status: 500, statusText: 'Server Error' };
      service.executeVacuumPlan(mockPlan).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const settingsReq = httpMock.expectOne(environment.apiEndpoint + 'clean/settings');
      settingsReq.flush({ success: true });

      const segmentsReq = httpMock.expectOne(environment.apiEndpoint + 'clean/segments');
      segmentsReq.flush('Error', errorResponse);
    });
  });
});
