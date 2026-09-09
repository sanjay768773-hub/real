[10-09-2026 12:20 AM] Sanjay: import * as THREE from "three";

/* =========================================================
   STREET RUSH 3D
   Procedural arcade racing game
   ========================================================= */

// ---------------------------------------------------------
// BASIC SETUP
// ---------------------------------------------------------

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x020611);

scene.fog = new THREE.FogExp2(
  0x020611,
  0.007
);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(
  0,
  5,
  11
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;

document
  .getElementById("game")
  .appendChild(renderer.domElement);


// ---------------------------------------------------------
// LIGHTING
// ---------------------------------------------------------

const ambient = new THREE.HemisphereLight(
  0x6688aa,
  0x080808,
  1.5
);

scene.add(ambient);


const moon = new THREE.DirectionalLight(
  0x9fc8ff,
  2.5
);

moon.position.set(
  -50,
  80,
  30
);

moon.castShadow = true;

moon.shadow.mapSize.width = 1024;
moon.shadow.mapSize.height = 1024;

scene.add(moon);


// ---------------------------------------------------------
// SKY
// ---------------------------------------------------------

const skyGeometry =
  new THREE.SphereGeometry(
    450,
    32,
    16
  );

const skyMaterial =
  new THREE.MeshBasicMaterial({
    color: 0x030816,
    side: THREE.BackSide
  });

const sky =
  new THREE.Mesh(
    skyGeometry,
    skyMaterial
  );

scene.add(sky);


// ---------------------------------------------------------
// GROUND
// ---------------------------------------------------------

const groundMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x05070b,
    roughness: 1
  });

const ground =
  new THREE.Mesh(
    new THREE.PlaneGeometry(
      1000,
      1000
    ),
    groundMaterial
  );

ground.rotation.x =
  -Math.PI / 2;

ground.position.y = -0.08;

ground.receiveShadow = true;

scene.add(ground);


// ---------------------------------------------------------
// ROAD
// ---------------------------------------------------------

const ROAD_WIDTH = 16;
const ROAD_LENGTH = 800;

const roadMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x101318,
    roughness: .85
  });

const road =
  new THREE.Mesh(
    new THREE.PlaneGeometry(
      ROAD_WIDTH,
      ROAD_LENGTH
    ),
    roadMaterial
  );

road.rotation.x =
  -Math.PI / 2;

road.position.z = -300;

road.receiveShadow = true;

scene.add(road);


// ---------------------------------------------------------
// ROAD EDGE
// ---------------------------------------------------------

function createRoadEdge(x) {

  const geometry =
    new THREE.BoxGeometry(
      .35,
      .04,
      ROAD_LENGTH
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0x00cfff
    });

  const edge =
    new THREE.Mesh(
      geometry,
      material
    );

  edge.position.set(
    x,
    .03,
    -300
  );

  scene.add(edge);
}

createRoadEdge(-8);
createRoadEdge(8);


// ---------------------------------------------------------
// LANE MARKINGS
// ---------------------------------------------------------

const laneMarkers = [];

const laneMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xe8f5ff
  });

for (let lane = -4; lane <= 4; lane += 4) {

  for (
    let z = 20;
    z > -760;
    z -= 16
  ) {

    const marker =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          .18,
          .025,
          7
        ),
        laneMaterial
      );

    marker.position.set(
      lane,
      .05,
      z
    );

    scene.add(marker);
[10-09-2026 12:20 AM] Sanjay: laneMarkers.push(marker);
  }
}


// ---------------------------------------------------------
// ROAD LIGHTS
// ---------------------------------------------------------

const streetObjects = [];

function createStreetLight(x, z) {

  const group =
    new THREE.Group();

  // pole

  const pole =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        .08,
        .12,
        5,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x343941,
        metalness: .8
      })
    );

  pole.position.y = 2.5;

  group.add(pole);


  // arm

  const arm =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.3,
        .08,
        .08
      ),
      new THREE.MeshStandardMaterial({
        color: 0x343941
      })
    );

  arm.position.set(
    x > 0 ? -.6 : .6,
    4.8,
    0
  );

  group.add(arm);


  // light

  const light =
    new THREE.PointLight(
      0x7deaff,
      7,
      22
    );

  light.position.set(
    x > 0 ? -1.2 : 1.2,
    4.6,
    0
  );

  group.add(light);


  const bulb =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        .13,
        8,
        8
      ),
      new THREE.MeshBasicMaterial({
        color: 0xffffff
      })
    );

  bulb.position.copy(
    light.position
  );

  group.add(bulb);


  group.position.set(
    x,
    0,
    z
  );

  scene.add(group);

  streetObjects.push(group);
}

for (
  let z = 10;
  z > -700;
  z -= 25
) {

  createStreetLight(
    -11,
    z
  );

  createStreetLight(
    11,
    z - 12
  );
}


// ---------------------------------------------------------
// CITY BUILDINGS
// ---------------------------------------------------------

const buildings = [];

function createBuilding(x, z) {

  const width =
    4 + Math.random() * 6;

  const height =
    5 + Math.random() * 20;

  const depth =
    5 + Math.random() * 7;

  const colors = [
    0x101522,
    0x151a25,
    0x1b202c,
    0x0e141f,
    0x202633
  ];

  const material =
    new THREE.MeshStandardMaterial({
      color:
        colors[
          Math.floor(
            Math.random() *
            colors.length
          )
        ],
      roughness: .9
    });

  const building =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        width,
        height,
        depth
      ),
      material
    );

  building.position.set(
    x,
    height / 2,
    z
  );

  building.castShadow = true;
  building.receiveShadow = true;

  scene.add(building);

  buildings.push(building);


  // windows

  for (
    let y = 2;
    y < height - 1;
    y += 2.5
  ) {

    const windowsPerSide =
      Math.max(
        1,
        Math.floor(
          width / 1.5
        )
      );

    for (
      let i = 0;
      i < windowsPerSide;
      i++
    ) {

      if (
        Math.random() > .55
      ) continue;

      const windowMaterial =
        new THREE.MeshBasicMaterial({
          color:
            Math.random() > .35
              ? 0xffc857
              : 0x58bfff
        });

      const win =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            .4,
            .7,
            .03
          ),
          windowMaterial
        );

      win.position.set(
        x -
          width / 2 +
          .8 +
          i * 1.3,
        y,
        z -
          depth / 2 -
          .02
      );

      scene.add(win);
    }
  }
}

for (
  let z = 0;
  z > -700;
  z -= 22
) {

  createBuilding(
    -17 - Math.random() * 7,
    z
  );

  createBuilding(
    17 + Math.random() * 7,
    z - 10
  );
}


// ---------------------------------------------------------
// CAR CREATION
// ---------------------------------------------------------

function createCar(
  bodyColor,
  isPlayer = false
) {

  const car =
    new THREE.Group();

  // body

  const bodyMaterial =
    new THREE.MeshStandardMaterial({
      color: bodyColor,
      metalness: .65,
      roughness: .25
    });

  const body =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        2.2,
        .55,
        4.4
      ),
      bodyMaterial
    );

  body.position.y =
    .65;
[10-09-2026 12:20 AM] Sanjay: body.castShadow = true;

  car.add(body);


  // hood

  const hood =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        2.05,
        .22,
        1.35
      ),
      bodyMaterial
    );

  hood.position.set(
    0,
    .93,
    -1.15
  );

  car.add(hood);


  // cabin

  const glassMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x07101b,
      metalness: .4,
      roughness: .1
    });

  const cabin =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.55,
        .7,
        1.7
      ),
      glassMaterial
    );

  cabin.position.set(
    0,
    1.15,
    .35
  );

  cabin.castShadow = true;

  car.add(cabin);


  // roof

  const roof =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.4,
        .12,
        1.5
      ),
      bodyMaterial
    );

  roof.position.set(
    0,
    1.53,
    .35
  );

  car.add(roof);


  // wheels

  const wheels = [];

  const wheelMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: .7
    });

  const rimMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x9ca3ad,
      metalness: .9,
      roughness: .2
    });

  const wheelPositions = [
    [-1.08, .45, -1.35],
    [1.08, .45, -1.35],
    [-1.08, .45, 1.35],
    [1.08, .45, 1.35]
  ];

  wheelPositions.forEach(
    position => {

      const wheel =
        new THREE.Group();

      const tire =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            .42,
            .42,
            .28,
            16
          ),
          wheelMaterial
        );

      tire.rotation.z =
        Math.PI / 2;

      wheel.add(tire);


      const rim =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            .2,
            .2,
            .3,
            12
          ),
          rimMaterial
        );

      rim.rotation.z =
        Math.PI / 2;

      wheel.add(rim);

      wheel.position.set(
        ...position
      );

      wheel.castShadow = true;

      car.add(wheel);

      wheels.push(wheel);
    }
  );


  // headlights

  const headlightMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xdfffff
    });

  [-.65, .65].forEach(
    x => {

      const headlight =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            .42,
            .18,
            .05
          ),
          headlightMaterial
        );

      headlight.position.set(
        x,
        .78,
        -2.23
      );

      car.add(headlight);
    }
  );


  // tail lights

  const tailMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xff1010
    });

  [-.65, .65].forEach(
    x => {

      const tail =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            .42,
            .16,
            .05
          ),
          tailMaterial
        );

      tail.position.set(
        x,
        .78,
        2.23
      );

      car.add(tail);
    }
  );


  // Nitro exhaust

  if (isPlayer) {

    const flameMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x00d9ff
      });

    [-.5, .5].forEach(
      x => {

        const flame =
          new THREE.Mesh(
            new THREE.ConeGeometry(
              .18,
              .8,
              8
            ),
            flameMaterial
          );

        flame.rotation.x =
          -Math.PI / 2;

        flame.position.set(
          x,
          .48,
          2.45
        );

        flame.visible = false;

        car.add(flame);

        car.userData.flames =
          car.userData.flames || [];

        car.userData.flames.push(
          flame
        );
      }
    );
  }


  car.userData.wheels = wheels;

  return car;
}


// ---------------------------------------------------------
// PLAYER
// ---------------------------------------------------------

const player =
  createCar(
    0x08bfe8,
    true
  );

player.position.set(
  0,
  0,
  7
);

scene.add(player);


// ---------------------------------------------------------
// TRAFFIC
// ---------------------------------------------------------

const traffic = [];
[10-09-2026 12:20 AM] Sanjay: const trafficColors = [
  0xff2633,
  0xffa726,
  0x8e44ff,
  0xffffff,
  0x20c878,
  0xffdd33
];

function spawnTraffic(
  z = -80
) {

  const lane =
    [-6, -2, 2, 6][
      Math.floor(
        Math.random() * 4
      )
    ];

  const car =
    createCar(
      trafficColors[
        Math.floor(
          Math.random() *
          trafficColors.length
        )
      ],
      false
    );

  car.position.set(
    lane,
    0,
    z
  );

  car.userData.speed =
    25 + Math.random() * 35;

  car.userData.lane =
    lane;

  scene.add(car);

  traffic.push(car);
}

for (
  let i = 0;
  i < 10;
  i++
) {

  spawnTraffic(
    -40 - i * 55
  );
}


// ---------------------------------------------------------
// GAME STATE
// ---------------------------------------------------------

let running = false;
let paused = false;
let gameOver = false;

let speed = 0;

let distance = 0;

let lives = 3;

let nitro = 100;

let steering = 0;

let accelerate = false;
let braking = false;
let nitroPressed = false;

let crashTimer = 0;

let scoreTime = 0;


// ---------------------------------------------------------
// SETTINGS
// ---------------------------------------------------------

const MAX_SPEED = 92;
const NITRO_SPEED = 145;

const ACCELERATION = 38;
const BRAKE_POWER = 75;

const ROAD_LIMIT = 6.5;

const clock =
  new THREE.Clock();


// ---------------------------------------------------------
// INPUT
// ---------------------------------------------------------

const keys = {};

window.addEventListener(
  "keydown",
  event => {

    keys[event.code] = true;

    if (
      event.code === "Space"
    ) {
      event.preventDefault();
    }

    if (
      event.code === "Escape" &&
      running
    ) {
      togglePause();
    }
  }
);

window.addEventListener(
  "keyup",
  event => {
    keys[event.code] = false;
  }
);


function updateKeyboard() {

  steering = 0;

  if (
    keys["ArrowLeft"] ||
    keys["KeyA"]
  ) {
    steering = -1;
  }

  if (
    keys["ArrowRight"] ||
    keys["KeyD"]
  ) {
    steering = 1;
  }

  accelerate =
    keys["ArrowUp"] ||
    keys["KeyW"];

  braking =
    keys["ArrowDown"] ||
    keys["KeyS"];

  nitroPressed =
    keys["Space"];
}


// ---------------------------------------------------------
// MOBILE INPUT
// ---------------------------------------------------------

function holdButton(
  element,
  onStart,
  onEnd
) {

  const el =
    document.getElementById(
      element
    );

  el.addEventListener(
    "pointerdown",
    e => {
      e.preventDefault();
      onStart();
    }
  );

  el.addEventListener(
    "pointerup",
    e => {
      e.preventDefault();
      onEnd();
    }
  );

  el.addEventListener(
    "pointercancel",
    onEnd
  );

  el.addEventListener(
    "pointerleave",
    onEnd
  );
}

holdButton(
  "left-button",
  () => steering = -1,
  () => {
    if (
      steering === -1
    ) steering = 0;
  }
);

holdButton(
  "right-button",
  () => steering = 1,
  () => {
    if (
      steering === 1
    ) steering = 0;
  }
);

holdButton(
  "gas-button",
  () => accelerate = true,
  () => accelerate = false
);

holdButton(
  "brake-button",
  () => braking = true,
  () => braking = false
);

holdButton(
  "nitro-button",
  () => nitroPressed = true,
  () => nitroPressed = false
);


// ---------------------------------------------------------
// START / RESTART
// ---------------------------------------------------------

document
  .getElementById("start-button")
  .addEventListener(
    "click",
    startGame
  );

document
  .getElementById("restart-button")
  .addEventListener(
    "click",
    startGame
  );

document
  .getElementById("resume-button")
  .addEventListener(
    "click",
    togglePause
  );

document
  .getElementById("pause-button")
  .addEventListener(
    "click",
    togglePause
  );


function startGame() {

  running = true;
  paused = false;
  gameOver = false;

  speed = 0;

  distance = 0;

  lives = 3;

  nitro = 100;

  player.position.x = 0;

  player.rotation.set(
    0,
    0,
    0
  );
[10-09-2026 12:20 AM] Sanjay: traffic.forEach(
    (car, index) => {

      car.position.z =
        -50 -
        index * 60;

      car.position.x =
        [-6, -2, 2, 6][
          Math.floor(
            Math.random() * 4
          )
        ];
    }
  );

  document
    .getElementById(
      "start-screen"
    )
    .classList.add("hidden");

  document
    .getElementById(
      "game-over"
    )
    .classList.add("hidden");

  document
    .getElementById(
      "pause-screen"
    )
    .classList.add("hidden");

  updateHUD();
}


// ---------------------------------------------------------
// PAUSE
// ---------------------------------------------------------

function togglePause() {

  if (
    !running ||
    gameOver
  ) return;

  paused = !paused;

  document
    .getElementById(
      "pause-screen"
    )
    .classList.toggle(
      "hidden",
      !paused
    );
}


// ---------------------------------------------------------
// UPDATE PLAYER
// ---------------------------------------------------------

function updatePlayer(dt) {

  // speed

  if (accelerate) {

    speed +=
      ACCELERATION * dt;

  } else {

    speed -=
      12 * dt;
  }


  if (braking) {

    speed -=
      BRAKE_POWER * dt;
  }


  // Nitro

  if (
    nitroPressed &&
    nitro > 0 &&
    speed > 25
  ) {

    speed +=
      80 * dt;

    nitro -=
      28 * dt;

    player.userData.flames
      .forEach(
        flame =>
          flame.visible = true
      );

  } else {

    nitro +=
      7 * dt;

    player.userData.flames
      .forEach(
        flame =>
          flame.visible = false
      );
  }


  nitro =
    THREE.MathUtils.clamp(
      nitro,
      0,
      100
    );


  speed =
    THREE.MathUtils.clamp(
      speed,
      0,
      nitroPressed &&
      nitro > 0
        ? NITRO_SPEED
        : MAX_SPEED
    );


  // steering

  const steeringPower =
    8 +
    speed * .065;

  player.position.x +=
    steering *
    steeringPower *
    dt;


  player.position.x =
    THREE.MathUtils.clamp(
      player.position.x,
      -ROAD_LIMIT,
      ROAD_LIMIT
    );


  // visual steering

  const targetRotation =
    -steering * .08;

  player.rotation.z +=
    (
      targetRotation -
      player.rotation.z
    ) * 8 * dt;


  // body movement

  player.position.y =
    Math.sin(
      performance.now() *
      .012
    ) * .015;


  // wheel animation

  player.userData.wheels
    .forEach(
      wheel => {

        wheel.rotation.x -=
          speed * dt * .5;
      }
    );


  // world moves toward player

  const worldSpeed =
    speed * dt;


  laneMarkers.forEach(
    marker => {

      marker.position.z +=
        worldSpeed;

      if (
        marker.position.z > 20
      ) {

        marker.position.z -=
          760;
      }
    }
  );


  streetObjects.forEach(
    object => {

      object.position.z +=
        worldSpeed;

      if (
        object.position.z > 30
      ) {

        object.position.z -=
          725;
      }
    }
  );


  buildings.forEach(
    building => {

      building.position.z +=
        worldSpeed;

      if (
        building.position.z > 30
      ) {

        building.position.z -=
          725;
      }
    }
  );


  distance +=
    speed * dt * .55;
}


// ---------------------------------------------------------
// TRAFFIC UPDATE
// ---------------------------------------------------------

function updateTraffic(dt) {

  traffic.forEach(
    car => {

      const relativeSpeed =
        speed -
        car.userData.speed;

      car.position.z +=
        relativeSpeed * dt;


      car.userData.wheels
        .forEach(
          wheel => {

            wheel.rotation.x -=
              ca
