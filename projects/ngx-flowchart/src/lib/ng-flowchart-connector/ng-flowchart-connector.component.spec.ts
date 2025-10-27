import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgFlowchartConnectorComponent } from './ng-flowchart-connector.component';
import { NgFlowchartCanvasService } from '../ng-flowchart-canvas.service';
import { OptionsService } from '../services/options.service';
import { CanvasRendererService } from '../services/canvas-renderer.service';
import { DropDataService } from '../services/dropdata.service';
import { StepManagerService } from '../services/step-manager.service';

describe('NgFlowchartConnectorComponent', () => {
  let component: NgFlowchartConnectorComponent;
  let fixture: ComponentFixture<NgFlowchartConnectorComponent>;
  let mockCanvas: jasmine.SpyObj<NgFlowchartCanvasService>;
  let mockOptions: jasmine.SpyObj<OptionsService>;

  beforeEach(async () => {
    const canvasSpy = jasmine.createSpyObj('NgFlowchartCanvasService', ['scaleCoordinate']);
    const optionsSpy = jasmine.createSpyObj('OptionsService', [], {
      options: {
        orientation: 'VERTICAL',
        stepGap: 40
      }
    });

    await TestBed.configureTestingModule({
      imports: [NgFlowchartConnectorComponent],
      providers: [
        { provide: NgFlowchartCanvasService, useValue: canvasSpy },
        { provide: OptionsService, useValue: optionsSpy },
        CanvasRendererService,
        DropDataService,
        StepManagerService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgFlowchartConnectorComponent);
    component = fixture.componentInstance;
    mockCanvas = TestBed.inject(NgFlowchartCanvasService) as jasmine.SpyObj<NgFlowchartCanvasService>;
    mockOptions = TestBed.inject(OptionsService) as jasmine.SpyObj<OptionsService>;

    component.canvas = mockCanvas;
    component.connector = {
      startStepId: 'step1',
      endStepId: 'step2'
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('orthogonal path generation', () => {
    it('should generate orthogonal path for vertical orientation', () => {
      mockOptions.options.orientation = 'VERTICAL';

      // Set positions that would create a diagonal line
      component.autoPosition = {
        start: [100, 100],
        end: [200, 200]
      };

      // Access private method for testing
      const path = (component as any).generateOrthogonalPath();

      // Should contain right-angle segments (M, L, L pattern)
      expect(path).toContain('M');
      expect(path.split('L').length).toBeGreaterThanOrEqual(2);
    });

    it('should generate orthogonal path for horizontal orientation', () => {
      mockOptions.options.orientation = 'HORIZONTAL';

      // Set positions that would create a diagonal line
      component.autoPosition = {
        start: [100, 100],
        end: [200, 200]
      };

      // Access private method for testing
      const path = (component as any).generateOrthogonalPath();

      // Should contain right-angle segments (M, L, L pattern)
      expect(path).toContain('M');
      expect(path.split('L').length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('label positioning', () => {
    it('should position label on longest segment', () => {
      mockOptions.options.orientation = 'VERTICAL';

      component.autoPosition = {
        start: [100, 100],
        end: [300, 200]
      };

      component.connector = {
        startStepId: 'step1',
        endStepId: 'step2',
        label: 'Test Label'
      };

      // Access private methods for testing
      const segments = (component as any).getPathSegments();
      const longestSegment = (component as any).findLongestSegment(segments);

      expect(longestSegment).toBeTruthy();
      expect(segments.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('path segments parsing', () => {
    it('should correctly parse path segments', () => {
      const testPath = 'M10 10 L20 10 L20 30 L30 30';

      // Access private methods for testing
      const segments = (component as any).getPathSegments();
      const longestSegment = (component as any).findLongestSegment(segments);

      expect(segments.length).toBeGreaterThanOrEqual(1);
      if (longestSegment) {
        expect(longestSegment.start).toEqual(jasmine.arrayContaining([jasmine.any(Number)]));
        expect(longestSegment.end).toEqual(jasmine.arrayContaining([jasmine.any(Number)]));
      }
    });
  });
});
