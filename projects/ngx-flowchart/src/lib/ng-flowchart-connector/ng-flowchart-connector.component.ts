import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  HostListener,
  Input,
  inject,
  viewChild,
} from '@angular/core';
import { NgFlowchart } from '../model/flow.model';
import { NgFlowchartCanvasService } from '../ng-flowchart-canvas.service';
import { NgStyle, NgClass } from '@angular/common';

@Component({
  selector: 'ng-flowchart-connector',
  templateUrl: './ng-flowchart-connector.component.html',
  styleUrls: ['./ng-flowchart-connector.component.scss'],
  imports: [NgStyle, NgClass],
})
export class NgFlowchartConnectorComponent implements AfterViewInit {
  protected element = inject<ElementRef<HTMLElement>>(ElementRef);

  private static readonly LABEL_MIN_WIDTH = 80;
  private static readonly LABEL_MIN_HEIGHT = 36;

  @Input() canvas: NgFlowchartCanvasService;
  @Input()
  compRef: ComponentRef<NgFlowchartConnectorComponent>;

  private _connector: NgFlowchart.Connector;
  @Input() set connector(connector: NgFlowchart.Connector) {
    this._connector = connector;
    this.recalculateLayout();
  }
  get connector(): NgFlowchart.Connector {
    return this._connector;
  }

  readonly arrow = viewChild<ElementRef>('arrow');
  readonly arrowPadding = viewChild<ElementRef>('arrowPadding');

  private _position: { start: number[]; end: number[] };
  private _baseWidth = 0;
  private _baseHeight = 0;
  private _padX = 0;
  private _padY = 0;

  @Input()
  set autoPosition(pos: { start: number[]; end: number[] }) {
    this._position = pos;
    this.recalculateLayout();
  }

  selected = false;
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const path = this.arrow().nativeElement as SVGPathElement;
    if (event.target === this.arrowPadding().nativeElement && !this.selected) {
      path.parentElement.setAttribute(
        'marker-end',
        'url(#connectorArrowheadSelected)'
      );

      let bounds = path.getBoundingClientRect();
      const mouseX = event.clientX - bounds.left;
      const mouseY = event.clientY - bounds.top;
      const coord = this.canvas.scaleCoordinate([mouseX + 15, mouseY - 5]);
      this.deleteButtonPosition = {
        x: coord[0],
        y: coord[1],
      };
      this.selected = true;
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const path = this.arrow().nativeElement as SVGPathElement;
    const insideMenuClicked = (event.target as HTMLElement).matches(
      '.ngflowchart-connector-menu *'
    );
    if (
      event.target !== this.arrowPadding().nativeElement &&
      !insideMenuClicked
    ) {
      path.parentElement.setAttribute('marker-end', 'url(#connectorArrowhead)');
      this.selected = false;
    }
  }

  @HostListener('mouseover', ['$event.target'])
  onMouseOver(target: any) {
    if (!this.selected && target === this.arrowPadding().nativeElement) {
      const path = this.arrow().nativeElement as SVGPathElement;
      path.parentElement.setAttribute(
        'marker-end',
        'url(#connectorArrowheadHover)'
      );
    }
  }
  @HostListener('mouseout', ['$event.target'])
  onMouseOut(target: any) {
    if (!this.selected && target === this.arrowPadding().nativeElement) {
      const path = this.arrow().nativeElement as SVGPathElement;
      path.parentElement.setAttribute('marker-end', 'url(#connectorArrowhead)');
    }
  }

  opacity = 1;
  containerWidth: number = 0;
  containerHeight: number = 0;
  deleteButtonPosition: { x: number; y: number };
  get yOffset(): number {
    return this.canvas.options.options.orientation === 'VERTICAL' ? 6 : 0;
  }
  get xOffset(): number {
    return this.canvas.options.options.orientation === 'HORIZONTAL' ? 6 : 0;
  }

  get labelText(): string | undefined {
    return this._connector?.label ?? this._connector?.labelData?.text;
  }

  get labelX(): number {
    if (!this._position) {
      return 0;
    }

    // For orthogonal paths, position label on the longest segment
    const pathSegments = this.getPathSegments();
    const longestSegment = this.findLongestSegment(pathSegments);

    if (longestSegment) {
      const originX = Math.min(this._position.start[0], this._position.end[0]) - this._padX;
      const midX = (longestSegment.start[0] + longestSegment.end[0]) / 2 - originX;
      return midX;
    }

    // Fallback to midpoint
    const originX = Math.min(this._position.start[0], this._position.end[0]) - this._padX;
    const midX = (this._position.start[0] + this._position.end[0]) / 2 - originX;
    return midX;
  }

  get labelY(): number {
    if (!this._position) {
      return 0;
    }

    // For orthogonal paths, position label on the longest segment
    const pathSegments = this.getPathSegments();
    const longestSegment = this.findLongestSegment(pathSegments);

    if (longestSegment) {
      const originY = Math.min(this._position.start[1], this._position.end[1]) - this._padY;
      const midY = (longestSegment.start[1] + longestSegment.end[1]) / 2 - originY;
      return midY;
    }

    // Fallback to midpoint
    const originY = Math.min(this._position.start[1], this._position.end[1]) - this._padY;
    const midY = (this._position.start[1] + this._position.end[1]) / 2 - originY;
    return midY;
  }

  private getPathSegments(): Array<{start: number[], end: number[]}> {
    if (!this._position) {
      return [];
    }

    const start = new Array(2);
    const end = new Array(2);

    // Calculate actual start and end points within the container
    if (this._position.start[1] > this._position.end[1]) {
      start[1] = this.containerHeight - this._padY + this.yOffset;
      end[1] = this._padY;
    } else {
      start[1] = this._padY + this.yOffset;
      end[1] = this.containerHeight - this._padY;
    }

    if (this._position.start[0] > this._position.end[0]) {
      start[0] = this.containerWidth - this._padX + this.xOffset;
      end[0] = this._padX;
    } else if (this._position.start[0] < this._position.end[0]) {
      start[0] = this._padX + this.xOffset;
      end[0] = this.containerWidth - this._padX;
    } else {
      const centerX = this.containerWidth / 2;
      start[0] = centerX + this.xOffset;
      end[0] = centerX;
    }

    // Generate the segments based on the orthogonal path
    const segments: Array<{start: number[], end: number[]}> = [];
    const path = this.createOrthogonalSegments(start, end);

    // Parse the path to extract segments
    const pathCommands = path.split('L');
    if (pathCommands.length >= 2) {
      const startMatch = path.match(/M([-\d.]+)\s+([-\d.]+)/);
      if (startMatch) {
        let currentX = parseFloat(startMatch[1]);
        let currentY = parseFloat(startMatch[2]);

        for (let i = 1; i < pathCommands.length; i++) {
          const coords = pathCommands[i].trim().split(/\s+/);
          if (coords.length >= 2) {
            const endX = parseFloat(coords[0]);
            const endY = parseFloat(coords[1]);

            segments.push({
              start: [currentX, currentY],
              end: [endX, endY]
            });

            currentX = endX;
            currentY = endY;
          }
        }
      }
    }

    return segments;
  }

  private findLongestSegment(segments: Array<{start: number[], end: number[]}>): {start: number[], end: number[]} | null {
    if (segments.length === 0) {
      return null;
    }

    let longestSegment = segments[0];
    let maxLength = this.getDistance(longestSegment.start, longestSegment.end);

    for (const segment of segments) {
      const length = this.getDistance(segment.start, segment.end);
      if (length > maxLength) {
        maxLength = length;
        longestSegment = segment;
      }
    }

    return longestSegment;
  }

  private getDistance(point1: number[], point2: number[]): number {
    return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
  }

  ngAfterViewInit(): void {
    this.updatePath();
  }

  toJSON() {
    return {
      startStepId: this._connector.startStepId,
      endStepId: this._connector.endStepId,
      label: this._connector.label,
      labelData: this._connector.labelData,
    };
  }

  deleteConnector(event: MouseEvent): void {
    this.destroy0();
    this.canvas.reRender(true);

    this.canvas.options.callbacks.afterDeleteConnector &&
      this.canvas.options.callbacks.afterDeleteConnector(this);
  }

  destroy0(): void {
    this.compRef.destroy();
    this.canvas.flow.removeConnector(this);
  }

  private recalculateLayout() {
    if (!this._position) {
      return;
    }

    this._baseWidth = Math.abs(
      this._position.start[0] - this._position.end[0]
    );
    this._baseHeight = Math.abs(
      this._position.start[1] - this._position.end[1]
    );

    const needsLabelPadding = !!this.labelText;

    const minWidth = needsLabelPadding
      ? NgFlowchartConnectorComponent.LABEL_MIN_WIDTH
      : 0;
    const minHeight = needsLabelPadding
      ? NgFlowchartConnectorComponent.LABEL_MIN_HEIGHT
      : 0;

    this.containerWidth = Math.max(this._baseWidth, minWidth);
    this.containerHeight = Math.max(this._baseHeight, minHeight);

    this._padX = (this.containerWidth - this._baseWidth) / 2;
    this._padY = (this.containerHeight - this._baseHeight) / 2;

    this.setConnectorPosition();
    this.updatePath();
  }

  private setConnectorPosition() {
    if (!this._position) {
      return;
    }

    const left =
      Math.min(this._position.start[0], this._position.end[0]) - this._padX;
    const top =
      Math.min(this._position.start[1], this._position.end[1]) - this._padY;

    this.element.nativeElement.style.left = `${left}px`;
    this.element.nativeElement.style.top = `${top}px`;
  }

  private updatePath() {
    const arrowValue = this.arrow();
    if (!arrowValue?.nativeElement || !this._position) {
      return;
    }

    const padX = this._padX;
    const padY = this._padY;

    // Generate orthogonal path instead of straight line
    const path = this.generateOrthogonalPath();
    arrowValue.nativeElement.setAttribute('d', path);
    this.arrowPadding().nativeElement.setAttribute('d', path);
  }

  private generateOrthogonalPath(): string {
    const start = new Array(2);
    const end = new Array(2);

    // Calculate actual start and end points within the container
    if (this._position.start[1] > this._position.end[1]) {
      start[1] = this.containerHeight - this._padY + this.yOffset;
      end[1] = this._padY;
    } else {
      start[1] = this._padY + this.yOffset;
      end[1] = this.containerHeight - this._padY;
    }

    if (this._position.start[0] > this._position.end[0]) {
      start[0] = this.containerWidth - this._padX + this.xOffset;
      end[0] = this._padX;
    } else if (this._position.start[0] < this._position.end[0]) {
      start[0] = this._padX + this.xOffset;
      end[0] = this.containerWidth - this._padX;
    } else {
      const centerX = this.containerWidth / 2;
      start[0] = centerX + this.xOffset;
      end[0] = centerX;
    }

    // Generate orthogonal path with right angles
    return this.createOrthogonalSegments(start, end);
  }

  private createOrthogonalSegments(start: number[], end: number[]): string {
    const segments: string[] = [];

    // Start from the actual start position
    segments.push(`M${start[0]} ${start[1]}`);

    // Create orthogonal path based on orientation
    if (this.canvas.options.options.orientation === 'VERTICAL') {
      // For vertical orientation, prefer vertical segments first
      if (Math.abs(start[0] - end[0]) > Math.abs(start[1] - end[1])) {
        // Horizontal distance is greater, go horizontal first
        segments.push(`L${end[0]} ${start[1]}`);
        segments.push(`L${end[0]} ${end[1]}`);
      } else {
        // Vertical distance is greater, go vertical first
        segments.push(`L${start[0]} ${end[1]}`);
        segments.push(`L${end[0]} ${end[1]}`);
      }
    } else {
      // For horizontal orientation, prefer horizontal segments first
      if (Math.abs(start[1] - end[1]) > Math.abs(start[0] - end[0])) {
        // Vertical distance is greater, go vertical first
        segments.push(`L${start[0]} ${end[1]}`);
        segments.push(`L${end[0]} ${end[1]}`);
      } else {
        // Horizontal distance is greater, go horizontal first
        segments.push(`L${end[0]} ${start[1]}`);
        segments.push(`L${end[0]} ${end[1]}`);
      }
    }

    return segments.join(' ');
  }
}
