import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {  IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
  IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonCol, IonIcon, IonGrid, 
  IonRow, IonList, IonItem, IonLabel, IonToggle, IonImg,
  IonRange, IonHeader, IonButtons } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { FormsModule } from '@angular/forms';   // ← 这一行必须加！
import { ModalController } from '@ionic/angular/standalone';
import { ViewCameraPage } from 'src/app/view-camera/view-camera.page';
import { ViewLightPage } from 'src/app/view-light/view-light.page';
import { ParentDataService } from 'src/app/parent.data.service';
import { ViewDoorPage } from 'src/app/view-door/view-door.page';
import { ViewBlindPage } from 'src/app/view-blind/view-blind.page';
import { ViewMusicPage } from 'src/app/view-music/view-music.page';
import { ClickSoundsService } from 'src/app/click.sounds.service';

import { throttle } from 'rxjs';
import { Howl } from 'howler';
import { LevelData } from './levelData';
import { analytics } from 'ionicons/icons';



@Component({
  selector: 'app-home',
  templateUrl:'demo.page.html',
  //template: `<div #threeContainer style="width:100%; height:100%; background:#ffffff;"></div>`,
  styleUrls: ['demo.page.scss'],
  //standalone: true,
  imports: [IonButtons, IonContent, IonImg, IonHeader, CommonModule, IonButton, IonHeader, IonToolbar, IonTitle,
    FormsModule, IonToggle, IonLabel]
})



export class DemoPage {
[x: string]: any;
  @ViewChild('threeContainer', { static: true }) container!: ElementRef<HTMLDivElement>;

  loading = false;
  selectedModel = 'l1';
   private currentModel?: THREE.Group;
  // Cache loaded models so we don't reload every time
  private modelCache: { [key: string]: THREE.Group } = {};

  // List of your models
  private models = {
    l1: 'assets/glb/940leovista015.glb',
    l2: 'assets/glb/test002.glb',
    l3: 'assets/glb/test003.glb',
  };

  public levels = new Map<string,LevelData> ()
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private model!:any
  private sphereRadius = 0

  

  public lamps: THREE.Mesh[] = [];
  public lampOns = new Map<THREE.Mesh, boolean>();
  private spotlighWithLamps = new Map<THREE.Mesh, THREE.SpotLight>();

  public doors:THREE.Mesh[] = [];
  public doorOpens = new Map<THREE.Mesh,boolean>();

  public blinds:THREE.Mesh[] = []
  public blindUps = new Map<THREE.Mesh,boolean>();

  public cameras:THREE.Mesh[] = []
  public cameraUrls = new Map<string,string>()

  public garages:THREE.Mesh[] = []
  public garageUps = new Map<THREE.Mesh,boolean>();


  public musics: THREE.Mesh[] = [];
  public musicOns = new Map<THREE.Mesh, boolean>();
  public musicSongs =new Map<string,Howl>()
  private spotlighWithMusics = new Map<THREE.Mesh, THREE.SpotLight>();

  private cameraUrl :string | undefined
  private timer: any = null;
  
  private lastWidth = 0;
  private lastHeight = 0;
  private originY = 0

  private width_1=0;
  private hight_1=0

  // private readonly MODEL_PATH = 'assets/glb/940leovista015.glb'; // ← Your converted GLB
  // private modelUrls: string [] = []
  constructor(private ngZone: NgZone,private modalCtrl: ModalController,
    private clickSoundService:ClickSoundsService
    ,private parentDataService:ParentDataService
    , private clickSound:ClickSoundsService
     ) {
    this.parentDataService.demoPage= this
 
    
    
    this.musicSongs.set("FAMILY_MUSIC",new Howl({
        src: ['assets/music/The_Prayer.mp3'],
        volume: 0.7,
        onloaderror: () => console.error('音效加载失败'),
        onplayerror: () => console.warn('播放失败（可能未解锁）')
      }))
     this.musicSongs.set("KITCHEN_MUSIC",new Howl({
        src: ['assets/music/Smooth_Operator.mp3'],
        volume: 0.7,
        onloaderror: () => console.error('音效加载失败'),
        onplayerror: () => console.warn('播放失败（可能未解锁）')
      }))
      this.cameraUrls.set("CAMERA_1","assets/video/camera1.mp4")
      this.cameraUrls.set("CAMERA_2","assets/video/camera2.mp4")

      this.levels.set("l1", {})
    }
  
  // Ionic lifecycle — waits for DOM + safe area
  ionViewDidEnter() {
    
    console.log(this.levels)
    


    setTimeout(() => {
      this.initThreeJS();
    //  this.loadModel();
    this.loadSelectedModel(); // load first model
      this.startRenderLoop();
      this.onResize(); // Force first correct size
    }, 150);
  }

  private initThreeJS() {
    const el = this.container.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    
    this.camera = new THREE.PerspectiveCamera(30, this.lastWidth / this.lastHeight, 0.1, 100);

    this.camera.position.set(0 ,20, 6);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    el.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;

    // Basic lighting
   this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
   const sun = new THREE.DirectionalLight(0xffffff, 2.5);
   sun.position.set(20, 40, 20);
   this.scene.add(sun);

     


    
    // In initThreeJS() — replace your old listeners with these:
this.renderer.domElement.addEventListener('click', (e: MouseEvent) => this.onClick(e));
this.renderer.domElement.addEventListener('touchstart', (e: TouchEvent) => {
  e.preventDefault(); // prevent scrolling
  this.onClick(e);
});
    // PERFECT RESIZE FOR IPHONE/IPAD
    const debouncedResize = () => {
      clearTimeout((debouncedResize as any).tid);
      (debouncedResize as any).tid = setTimeout(() => this.onResize(), 80);
    };

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', () => setTimeout(debouncedResize, 300));
    if ('visualViewport' in window) {
      window.visualViewport!.addEventListener('resize', debouncedResize);
    }
  }
  
  
  
async  loadSelectedModel() {
    console.log("load model")
 const modelKey = this.selectedModel;
    const modelPath = this.models[modelKey as keyof typeof this.models];

    // If already loaded → just swap
    if (this.modelCache[modelKey]) {
      this.swapModel(this.modelCache[modelKey]);
      return;
    }

    this.loading = true;

    const loader = new GLTFLoader();
    loader.load(
       modelPath, 
     
      // this.MODEL_PATH,
      (gltf) => {
        this.model = gltf.scene;
        const box = new THREE.Box3().setFromObject(this.model);
             const size = box.getSize(new THREE.Vector3()).length();
             const center = box.getCenter(new THREE.Vector3());
             this.model.position.copy(center.multiplyScalar(-0.1));
            this.model.scale.setScalar((this.width_1/51
            )/ size);
            //  if (this.width_1 > this.hight_1)
            //   this.originY = -3
            //  else
            //   this.originY =+4
           
            this.model.position.set(0,this.originY,0)
       
        this.scene.add(this.model);

        this.model.traverse((obj: any) => {
          if (obj.isMesh) {
            const name = (obj.name || '').toLowerCase();
          //  console.log(name)
            const isLamp = /light|lamp/.test(name) || obj.userData?.isLight;
            const isDoor = /front_door|FRONT_DOOR/.test(name) || obj.userData?.isDoor;
             const isCamera = /suveilance|camera/.test(name) || obj.userData?.isDoor;
             const isBlind = /family_blind|family_curtain/.test(name) || obj.userData?.isBlind;
             const isMusic = /MUSIC|music|speaker/.test(name) || obj.userData?.isMusic;
             const isGarage = /garage|garage_1/.test(name) || obj.userData?.isGarage;
             
            
             if (isGarage){
               this.garages.push(obj)
               this.garageUps.set(obj,false)
                this.adddSphereBall(obj,2,0,-1,0)

              
                
                console.log(this.levels.get("l1"))
              
               
            }
            
             if (isDoor){
               this.doors.push(obj)
               this.doorOpens.set(obj,false)
               console.log(this.doorOpens)
              this.adddSphereBall(obj,1.2,0.3,0.3,0)

              
              this.levels.get("l1")!.doors?.push(obj) 
              console.log(this.levels.get("l1")?.doors)
                console.log(this.doors)
            }

            if (isBlind){
               this.blinds.push(obj)
               this.blindUps.set(obj,false)
               console.log(this.blindUps)
              //add sphere ball
              this.adddSphereBall(obj,1.2,0,-1,0)
               
            }

             if (isCamera){

              this.cameras.push(obj)
              //add sphere ball
            this.adddSphereBall(obj,0.7,0,0,0)
             
               
            }



            if (isLamp) {
              this.lamps.push(obj);
              this.lampOns.set(obj, false);
          
               //create a new spotlight 
               let spotLight = new THREE.SpotLight(0xffffff, 0); // White, intensity 2
              spotLight.position.set(obj.position.x, obj.position.y,obj.position.z); // Position above and to the side
              spotLight.angle = Math.PI / 1.5; // 30° cone
             // spotLight.intensity = 0
             console.log(obj.position.y,obj.position.z)
              this.model.add(spotLight)

              this.spotlighWithLamps.set(obj,spotLight)

               this.adddSphereBall(obj,0.6,0,0,0)


              const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.emissive = new THREE.Color("green");
                mat.emissiveIntensity = 0;
                mat.toneMapped = false;
                mat.needsUpdate = true;
              }
            }
              //music
             if (isMusic) {
              this.musics.push(obj);
              this.musicOns.set(obj, false);
              this.musicSongs.set(obj,obj.name)
              console.log("song"+this.musicSongs.get(obj))
               //create a new spotlight 
               let spotLight = new THREE.SpotLight(0xffffff, 0); // White, intensity 2
              spotLight.position.set(obj.position.x, obj.position.y,obj.position.z); // Position above and to the side
              spotLight.angle = Math.PI / 1.5; // 30° cone
             // spotLight.intensity = 0
           
              this.model.add(spotLight)

              this.spotlighWithMusics.set(obj,spotLight)
             //add a sphere tranarent call]
              this.adddSphereBall(obj,0.7,0,0,0)



              const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.emissive = new THREE.Color(0x000000);
                mat.emissiveIntensity = 0;
                mat.toneMapped = false;
                mat.needsUpdate = true;
              }
            }

          }
        });

        console.log(`Found ${this.lamps.length} clickable lamps`);
       // this.fitCameraToModel(model);
        this.onResize(); // Final resize after model loads
 // Cache it
        this.modelCache[modelKey] = this.model;

        this.swapModel(this.model);
        this.loading = false;

      },
      (progress) => {
        console.log(modelKey, (progress.loaded / progress.total) * 100 + '%');
      },
      //undefined,
      (err) => console.error('GLB load failed → check path:', modelPath, err)
    );
  }

private swapModel(newModel: THREE.Group) {
    // Remove old model
    if (this.currentModel) {
      this.scene.remove(this.currentModel);
    }

    // Add new one
    this.scene.add(newModel);
    this.currentModel = newModel;
  }

private onClick(event: MouseEvent | TouchEvent) {
  // Fix for Ionic/Capacitor — event can be MouseEvent or TouchEvent
  if (event instanceof MouseEvent || event instanceof TouchEvent) {
    event.preventDefault(); // now safe
  }

  const rect = this.renderer.domElement.getBoundingClientRect();

  let clientX: number;
  let clientY: number;

  // Handle both mouse click and touch
  if ('touches' in event) {
    // Touch event
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    // Mouse event
    clientX = event.clientX;
    clientY = event.clientY;
  }

  // Convert to Three.js coordinates
  this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  // Raycast
  this.raycaster.setFromCamera(this.mouse, this.camera);
  const intersects = this.raycaster.intersectObjects(this.scene.children, true);

  if (intersects.length === 0) return;

  const clickedObj = intersects[0].object;

  console.log(clickedObj.name+"------")
   console.log(clickedObj)

   // Find which camera was clicked (supports child meshes)
  const clickedCamera = this.cameras.find(camera =>
    camera === clickedObj ||
    camera.name.includes(clickedObj.name) ||
   camera.uuid === clickedObj.uuid ||
    camera.children.includes(clickedObj) ||
   (clickedObj.parent && camera.children.some(child => child.uuid === clickedObj.parent!.uuid))
  );

  if (clickedCamera) {
    console.log(clickedCamera.name)
    this.cameraUrl = this.cameraUrls.get(clickedCamera.name.slice(0,8))
   this.showViewCameraModal(this.cameraUrl!)

   console.log(this.cameraUrl)
    return
  }
  

   

  // Find which lamp was clicked (supports child meshes)
  const clickedLamp = this.lamps.find(lamp =>
    lamp === clickedObj ||
    lamp.name.includes(clickedObj.name) ||
   lamp.uuid === clickedObj.uuid ||
    lamp.children.includes(clickedObj) ||
   (clickedObj.parent && lamp.children.some(child => child.uuid === clickedObj.parent!.uuid))
  );

  if (clickedLamp) {
    this.toggleLamp(clickedLamp);
    console.log('Toggled:', clickedLamp || 'lamp');
    console.log('Toggled:', clickedLamp.children[0]);

  //  console.log(clickedLamp)
    return
  }

// Find which door was clicked (supports child meshes)
  const clickedDoor = this.doors.find(door =>
    door === clickedObj ||
    door.uuid === clickedObj.uuid ||
    door.children.includes(clickedObj) ||
    (clickedObj.parent && door.children.some(child => child.uuid === clickedObj.parent!.uuid))
  );

  if (clickedDoor) {
    this.toggleDoor(clickedDoor);
    console.log('Toggled:', clickedDoor.name || 'door');
    console.log(clickedDoor)
    return
  }

   //Find which blind was clicked (supports child meshes)
  const clickedBlind = this.blinds.find(blind =>
    blind === clickedObj ||
    blind.name.includes(clickedObj.name) ||
    blind.uuid === clickedObj.uuid ||
    blind.children.includes(clickedObj) ||
    (clickedObj.parent && blind.children.some(child => child.uuid === clickedObj.parent!.uuid))
  );

  if (clickedBlind) {
    this.toggleBlind(clickedBlind);
    console.log('Toggled:', clickedBlind.name || 'blind');
    console.log(clickedDoor)
    return
  }


  //Find which garage was clicked (supports child meshes)
  const clickedGarage= this.garages.find(garage =>
    garage === clickedObj ||
    garage.name.includes(clickedObj.name) ||
    garage.uuid === clickedObj.uuid ||
    garage.children.includes(clickedObj) ||
    (clickedObj.parent && garage.children.some(child => child.uuid === clickedObj.parent!.uuid))
  );

  if (clickedGarage) {
    this.toggleGarage(clickedGarage);
    console.log('Toggled:', clickedGarage.name || 'garage');
    console.log(clickedGarage)
    return
  }

//Find which music was clicked (supports child meshes)
  const clickedMusic = this.musics.find(music =>
    music === clickedObj ||
    music.name.includes(clickedObj.name) ||
   music.uuid === clickedObj.uuid ||
    music.children.includes(clickedObj) ||
   (clickedObj.parent && music.children.some(child => child.uuid === clickedObj.parent!.uuid))
  );

  if (clickedMusic) {
    this.toggleMusic(clickedMusic);
    console.log('Toggled:', clickedMusic.name || 'music');
    console.log(clickedMusic)
    return
  }

}
  
  public toggleLamp(lamp: THREE.Mesh) {
  
  const isOn = !this.lampOns.get(lamp);
  const spotlightWithLamp = this.spotlighWithLamps.get(lamp)
  this.lampOns.set(lamp, isOn);
  //console.log(lamp.position.x)

  if (spotlightWithLamp){
  //console.log(spotlightWithLamp.intensity)
  if (spotlightWithLamp.intensity ===0)
    spotlightWithLamp.intensity=50
  else
     spotlightWithLamp.intensity=0
   } 

  const mat = Array.isArray(lamp.material) ? lamp.material[0] : lamp.material;

  if (mat instanceof THREE.MeshStandardMaterial) {
    mat.emissive = isOn ? new THREE.Color(0xffff00) : new THREE.Color(0x000000);
    mat.emissiveIntensity = isOn ? 35 : 0;
    mat.toneMapped = false;
    mat.needsUpdate = true;
    console.log(lamp)
  }
  }

 toggleDoor(door: THREE.Mesh) {
  
  const  isOpen = !this.doorOpens.get(door);
  this.doorOpens.set(door, isOpen);
    console.log(isOpen)   
    console.log(this.doorOpens.get(door))
   // door.scale.x=0.0001

      gsap.to(door.rotation, {
      z: isOpen ? -Math.PI / 3 : 0,
      duration: 1.8,
      ease: "power2.out"
     });

     
   

}

toggleBlind(blind: THREE.Mesh) {
  
  const  isUp = !this.blindUps.get(blind);
  this.blindUps.set(blind, isUp);
    console.log(isUp)   
    console.log(this.blindUps.get(blind))
    console.log(blind)

const tl = gsap.timeline({ paused:true });





if (isUp)
{
     blind.scale.z=0.018

// GSAP 动画：全部拉开恢复原高
    tl.to(blind.scale, {
      z: 0.003,
      duration: 1.8,
       ease: "none",
      //ease: "elastic.out(1, 0.35)",    // 超级有弹性的拉帘感
      stagger: 0.03                     // 逐片错开，更加真实
    });  

  }

else{
  blind.scale.z=0.003

// GSAP 动画：全部拉开恢复原高
    tl.to(blind.scale, {
      z: 0.018,
      duration: 1.8,
      ease :"none",
      //ease: "elastic.out(1, 0.35)",    // 超级有弹性的拉帘感
      stagger: 0.03                     // 逐片错开，更加真实
    });  

  }
  tl.timeScale(0.3)
  tl.play()

}


toggleGarage(garage: THREE.Mesh) {
  
  const  isUp = !this.garageUps.get(garage);
  this.garageUps.set(garage, isUp);
    console.log(isUp)   
    console.log(this.garageUps.get(garage))
    console.log(garage)

const tl = gsap.timeline({ paused:true });





if (isUp)
{
     garage.scale.z=0.010

// GSAP 动画：全部拉开恢复原高
    tl.to(garage.scale, {
      z: 0.003,
      duration: 1.8,
       ease: "none",
      //ease: "elastic.out(1, 0.35)",    // 超级有弹性的拉帘感
      stagger: 0.03                     // 逐片错开，更加真实
    });  

  }

else{
  garage.scale.z=0.003

// GSAP 动画：全部拉开恢复原高
    tl.to(garage.scale, {
      z: 0.010,
      duration: 1.8,
      ease :"none",
      //ease: "elastic.out(1, 0.35)",    // 超级有弹性的拉帘感
      stagger: 0.03                     // 逐片错开，更加真实
    });  

  }
  tl.timeScale(0.3)
  tl.play()

}


public toggleMusic(music: THREE.Mesh) {
  
  const isOn = !this.musicOns.get(music);
  this.musicOns.set(music, isOn);



    
     if (isOn){
      console.log("music----"+music.name)
     // this.showViewMusicModal()
     this.musicSongs.get(music.name)!.play()
     
    }
   
     else{
      this.musicSongs.get(music.name)!.pause()
     
     }

  

  const mat = Array.isArray(music.material) ? music.material[0] : music.material;

  if (mat instanceof THREE.MeshStandardMaterial) {
     mat.emissive = isOn ? new THREE.Color(0xffff00) : new THREE.Color(0x000000);
    mat.emissiveIntensity = isOn ? 35 : 0;
     
    mat.toneMapped = false;
    mat.needsUpdate = true;
    console.log(music)
  }
   
}
  private fitCameraToModel(model: THREE.Object3D) {
     const box = new THREE.Box3().setFromObject(this.model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const distance = Math.max(size.x, size.z) * 2.5;

  this.camera.position.set(center.x + distance, center.y + distance * 0.6, center.z + distance);
  console.log(center.x + distance, center.y + distance * 0.6, center.z + distance)
  this.controls.target.copy(center);
  console.log(center)
  this.controls.update();
  }

  private onResize() {
    if (!this.container || !this.renderer || !this.camera) return;

    const w = this.container.nativeElement.clientWidth;
    const h = this.container.nativeElement.clientHeight;
     console.log(w,h)
     this.width_1 = w
     this.hight_1 = h
    if (w === this.lastWidth && h === this.lastHeight) return;
    this.lastWidth = w;
    this.lastHeight = h;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private startRenderLoop() {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        requestAnimationFrame(animate);


            if (this.width_1 < this.hight_1){
          this.scene.rotation.y =Math.PI / 2
          this.scene.scale.set(
                      1.2,   //y- X axis → 2× wider
                       1.2,   //z- Y axis → 3× taller  
                        1.2   //x- Z axis → 1.5× deeper
                        );
            }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };
      animate();
    });
  }

async showViewCameraModal(url:string) {
  const modal = await this.modalCtrl.create({
    component: ViewCameraPage,  
    componentProps: {
      url: url
      
    },
    // 你的自定义页面
  cssClass: 'half-modal',   // ← important
    mode: 'ios',                          // gives card style
    backdropDismiss: true,
    showBackdrop: true,
    // Optional: make it draggable like iOS bottom sheet
     breakpoints: [0, 0.5, 0.75, 1],
    initialBreakpoint: 0.3,
   
  });
  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data) console.log('新亮度：', data.brightness);
}

async showViewLightModal() {
const modal = await this.modalCtrl.create({
    component: ViewLightPage,    // 你的自定义页面
  cssClass: 'half-modal',   // ← important
    mode: 'ios',                          // gives card style
    backdropDismiss: true,
    showBackdrop: true,
    // Optional: make it draggable like iOS bottom sheet
     breakpoints: [0, 0.5, 0.75, 1],
    initialBreakpoint: 0.3,
   
  });
  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data) console.log('新亮度：', data.brightness);
}

 show(){
  console.log("test")
 }

 async showViewDoorModal() {
  const modal = await this.modalCtrl.create({
    component: ViewDoorPage,    // 你的自定义页面
  cssClass: 'half-modal',   // ← important
    mode: 'ios',                          // gives card style
    backdropDismiss: true,
    showBackdrop: true,
    // Optional: make it draggable like iOS bottom sheet
     breakpoints: [0, 0.5, 0.75, 1],
    initialBreakpoint: 0.3,
   
  });
  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data) console.log('新亮度：', data.brightness);
}

  async showViewBlindModal() {
  const modal = await this.modalCtrl.create({
    component: ViewBlindPage,    // 你的自定义页面
  cssClass: 'half-modal',   // ← important
    mode: 'ios',                          // gives card style
    backdropDismiss: true,
    showBackdrop: true,
    // Optional: make it draggable like iOS bottom sheet
     breakpoints: [0, 0.5, 0.75, 1],
    initialBreakpoint: 0.3,
   
  });
  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data) console.log('新亮度：', data.brightness);
}




async showViewMusicModal() {
const modal = await this.modalCtrl.create({
    component: ViewMusicPage,    // 你的自定义页面
 cssClass: 'transparent-modal',     
    mode: 'ios',                          // gives card style
    backdropDismiss: true,
    showBackdrop: true,
    // Optional: make it draggable like iOS bottom sheet
     breakpoints: [0, 0.5, 0.75, 1],
    initialBreakpoint: 0.3,
   
  });
  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data) console.log('新亮度：', data.brightness);
}

 

changeModel(modelKey: string) {
 //this.clearArrayMap()
  this.selectedModel = modelKey;
  this.loadSelectedModel();
}

  swap():void{
  
  if (this.selectedModel==='l1')
    
   {this.changeModel('l2')
    return}

  else
    if (this.selectedModel==='l2')
     {this.changeModel('l3')
      return}
    else
      {this.changeModel("l1")
        return}

}

clearArrayMap(){

      this.lamps.length = 0
      this.lampOns.clear()
      this.spotlighWithLamps.clear()

      this.doors.length = 0
      this.doorOpens.clear()

      this.blinds.length = 0
      this.blindUps.clear()

      this.cameras.length = 0

      this.garages.length = 0
      this.garageUps.clear()


      this.musics.length = 0
      this.musicOns.clear()
      this.spotlighWithMusics.clear()
}


adddSphereBall(obj:THREE.Mesh,radius:number,offsetX:number,offsetY:number,offsetZ:number){


             //add sphere ball
              let  sphere = new THREE.Mesh(
               new THREE.SphereGeometry(radius, 48, 32),
                 new THREE.MeshBasicMaterial({ color: 0xffaa88, transparent: true,
                      opacity: this.sphereRadius, side: THREE.BackSide })
              );
                sphere.position.set(obj.position.x+offsetX, 
                  obj.position.y+offsetY,obj.position.z+offsetZ);
                 sphere.name = obj.name
                 obj.add(sphere)
              this.model.add(sphere);

             console.log(obj.name)



}
}