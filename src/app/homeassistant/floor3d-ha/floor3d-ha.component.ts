import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

declare var Floor3DCards: any;  // Global from floor3d-card.js

interface EntityConfig {
  entity: string;
  type3d: 'light' | 'color' | 'text' | 'hide' | 'rotate';  // Simplified; extend as needed
  object_id: string;
  [key: string]: any;  // For light, colorcondition, etc.
}

interface Floor3DConfig {
  container: HTMLElement;
  path: string;
  objfile: string;
  mtlfile?: string;  // Omit if using GLB
  entities: EntityConfig[];
  backgroundColor?: string;
  globalLightPower?: number;
  // Add more options like camera, levels, etc.
}

@Component({
  selector: 'app-floor3d-ha',
  templateUrl: './floor3d-ha.component.html',
  styleUrls: ['./floor3d-ha.component.scss'],
  standalone: true,
})
export class Floor3dHaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardContainer', { static: false }) cardContainer!: ElementRef;

  private cardInstance: any;  // Reference to the Floor3D card
  private scriptLoaded = false;

  // Demo config: Adapt to your model and entities
  private config: Floor3DConfig = {
    container: undefined as any,  // Set in ngAfterViewInit
    path: '../../assets/models/',  // Relative to app root
    objfile: 'home.obj',
    mtlfile: 'home.mtl',  // Or use GLB: omit mtlfile and set objfile: 'home.glb'
    entities: [
      {
        entity: 'light.living_room',
        type3d: 'light',
        object_id: 'lamp_base_20',  // Must match object name in your 3D model
        light: { lumens: 900 }
      },
      {
        entity: 'binary_sensor.window_contact',
        type3d: 'color',
        object_id: 'window_pane',
        colorcondition: [
          { state: 'on', color: '#00ff00' },
          { state: 'off', color: '#ff0000' }
        ]
      }
      // Add more entities...
    ],
    backgroundColor: '#000001',
    globalLightPower: 0.4
  };

  ngOnInit() {
    this.loadScript();
  }

  ngAfterViewInit() {
    if (this.scriptLoaded) {
      this.initCard();
    }
    // Handle resize for responsive canvas
    window.addEventListener('resize', () => this.cardInstance?.resize?.());
  }

  ngOnDestroy() {
    if (this.cardInstance) {
      this.cardInstance.destroy?.();
    }
    window.removeEventListener('resize', () => {});
  }

  private loadScript() {
    if (this.scriptLoaded) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '../../assets/js/floor3d-card.js';
    script.onload = () => {
      this.scriptLoaded = true;
      if (this.cardContainer) {
        this.initCard();
      }
    };
    document.head.appendChild(script);
  }

  private initCard() {
    this.config.container = this.cardContainer.nativeElement;
    this.cardInstance = new Floor3DCards.create(this.config);  // Or Floor3DCards.create() if exposed as such

    // Demo: Update entity state (in real app, call on HA state changes)
    setTimeout(() => {
      this.cardInstance.updateEntity('light.living_room', { state: 'on', attributes: { brightness: 255 } });
      this.cardInstance.updateEntity('binary_sensor.window_contact', { state: 'off' });
    }, 2000);

    // Optional: Listen for interactions (e.g., clicks)
    this.cardInstance.addEventListener?.('object-click', (event: any) => {
      console.log('Clicked object:', event.detail.object_id);
      // Trigger HA service call or custom action
    });
  }
}
