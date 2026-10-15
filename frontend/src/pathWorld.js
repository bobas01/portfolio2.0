import * as THREE from "three";
import { WORLD, stops } from "./walk.js";

const SKY = "#9ed4f2";

export function toPathX(x) {
  return (x - WORLD.minX) / 80;
}

export function fillSpriteHoles(pixels, width, height) {
  const outside = new Uint8Array(width * height);
  const queue = [];

  function visit(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (outside[index] || pixels[index * 4 + 3] > 24) return;
    outside[index] = 1;
    queue.push(x, y);
  }

  for (let x = 0; x < width; x += 1) {
    visit(x, 0);
    visit(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    visit(0, y);
    visit(width - 1, y);
  }
  for (let cursor = 0; cursor < queue.length; cursor += 2) {
    const x = queue[cursor];
    const y = queue[cursor + 1];
    visit(x + 1, y);
    visit(x - 1, y);
    visit(x, y + 1);
    visit(x, y - 1);
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (outside[index] || pixels[index * 4 + 3] > 24) continue;
      const source = nearestOpaque(pixels, width, height, x, y);
      if (!source) continue;
      const target = index * 4;
      pixels[target] = source[0];
      pixels[target + 1] = source[1];
      pixels[target + 2] = source[2];
      pixels[target + 3] = 255;
    }
  }
  return pixels;
}

function nearestOpaque(pixels, width, height, x, y) {
  for (let radius = 1; radius <= 8; radius += 1) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const index = (ny * width + nx) * 4;
        if (pixels[index + 3] > 24) return pixels.slice(index, index + 4);
      }
    }
  }
  return null;
}

function pixelTexture(canvas, repeatX = 1, repeatY = 1) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  return texture;
}

function paintCane() {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 32;
  const pen = canvas.getContext("2d");
  pen.fillStyle = "#2f8a40";
  pen.fillRect(0, 0, 8, 32);
  pen.fillStyle = "#174624";
  for (let y = 0; y < 32; y += 8) pen.fillRect(0, y, 8, 2);
  pen.fillStyle = "#8fd18a";
  pen.fillRect(1, 3, 1, 3);
  return canvas;
}

function paintNoise(width, height, base, specks) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const pen = canvas.getContext("2d");
  pen.fillStyle = base;
  pen.fillRect(0, 0, width, height);
  specks.forEach((color, index) => {
    pen.fillStyle = color;
    for (let n = 0; n < 18; n += 1) {
      const x = (index * 5 + n * 7) % width;
      const y = (index * 3 + n * 11) % height;
      pen.fillRect(x, y, 1, 1);
    }
  });
  return canvas;
}

function paintSign(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 96;
  const pen = canvas.getContext("2d");
  pen.fillStyle = "#e7d3a8";
  pen.fillRect(0, 0, 320, 96);
  pen.fillStyle = "#5c3b22";
  pen.fillRect(0, 0, 320, 8);
  pen.fillRect(0, 88, 320, 8);
  pen.fillRect(0, 0, 8, 96);
  pen.fillRect(312, 0, 8, 96);
  pen.fillStyle = "#1a2a14";
  pen.textAlign = "center";
  pen.textBaseline = "middle";
  let size = 44;
  pen.font = `700 ${size}px sans-serif`;
  while (size > 22 && pen.measureText(label).width > 280) {
    size -= 2;
    pen.font = `700 ${size}px sans-serif`;
  }
  pen.fillText(label, 160, 50);
  return canvas;
}

function buildPanda() {
  const black = new THREE.MeshLambertMaterial({ color: "#1a1a1a" });
  const white = new THREE.MeshLambertMaterial({ color: "#f4f1e6" });
  const cream = new THREE.MeshLambertMaterial({ color: "#f3e6c4" });
  const ink = new THREE.MeshLambertMaterial({ color: "#111111" });
  const actor = new THREE.Group();
  const leftLeg = new THREE.Group();
  const rightLeg = new THREE.Group();
  const torso = new THREE.Group();
  const leftArm = new THREE.Group();
  const rightArm = new THREE.Group();
  const hip = 0.58;

  function box(parent, size, position, material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
    mesh.position.set(position[0], position[1], position[2]);
    parent.add(mesh);
  }

  leftLeg.position.set(-0.24, hip, 0);
  rightLeg.position.set(0.24, hip, 0);
  box(leftLeg, [0.34, 0.4, 0.36], [0, -0.2, 0], black);
  box(rightLeg, [0.34, 0.4, 0.36], [0, -0.2, 0], black);
  box(leftLeg, [0.38, 0.14, 0.42], [0, -0.38, 0.06], black);
  box(rightLeg, [0.38, 0.14, 0.42], [0, -0.38, 0.06], black);

  torso.position.y = hip;
  box(torso, [1.02, 0.82, 0.7], [0, 0.4, 0], black);
  box(torso, [0.62, 0.5, 0.18], [0, 0.32, 0.36], cream);
  box(torso, [0.92, 0.78, 0.8], [0, 1.16, 0.04], white);
  box(torso, [0.26, 0.26, 0.2], [-0.36, 1.62, 0], black);
  box(torso, [0.26, 0.26, 0.2], [0.36, 1.62, 0], black);
  box(torso, [0.3, 0.24, 0.12], [-0.22, 1.2, 0.42], black);
  box(torso, [0.3, 0.24, 0.12], [0.22, 1.2, 0.42], black);
  box(torso, [0.12, 0.12, 0.06], [-0.22, 1.22, 0.5], white);
  box(torso, [0.12, 0.12, 0.06], [0.22, 1.22, 0.5], white);
  box(torso, [0.06, 0.07, 0.04], [-0.22, 1.21, 0.54], ink);
  box(torso, [0.06, 0.07, 0.04], [0.22, 1.21, 0.54], ink);
  box(torso, [0.16, 0.1, 0.1], [0, 0.98, 0.46], ink);

  const shoulder = 0.72;
  leftArm.position.set(-0.62, shoulder, 0);
  rightArm.position.set(0.62, shoulder, 0);
  box(leftArm, [0.26, 0.52, 0.26], [0, -0.26, 0], black);
  box(rightArm, [0.26, 0.52, 0.26], [0, -0.26, 0], black);
  torso.add(leftArm, rightArm);
  actor.add(leftLeg, rightLeg, torso);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.62, 12),
    new THREE.MeshBasicMaterial({ color: "#6d5a3c" }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.13, 0);
  actor.add(shadow);

  return { actor, leftLeg, rightLeg, leftArm, rightArm };
}

export async function createPathWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(SKY);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SKY);
  scene.fog = new THREE.Fog(SKY, 9, 24);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  scene.add(new THREE.AmbientLight("#fff6ea", 0.72));
  const sun = new THREE.DirectionalLight("#fff8ee", 0.9);
  sun.position.set(-6, 9, 7);
  scene.add(sun);

  const sand = pixelTexture(
    paintNoise(32, 32, "#efe4cc", ["#e4d5b4", "#f7f0e0", "#d9cbae"]),
    10,
    6,
  );
  const dirt = pixelTexture(
    paintNoise(32, 32, "#c4a06a", ["#ddb97f", "#a8844e", "#efd2a4"]),
    12,
    2,
  );
  const grove = pixelTexture(paintCane(), 1, 1);
  const leaf = new THREE.MeshBasicMaterial({ color: "#3f9a48" });

  const ground = new THREE.Mesh(
    new THREE.BoxGeometry(28, 0.2, 14),
    new THREE.MeshBasicMaterial({ map: sand }),
  );
  ground.position.set(9, -0.1, 0);
  scene.add(ground);

  const road = new THREE.Mesh(
    new THREE.BoxGeometry(26, 0.12, 2.15),
    new THREE.MeshBasicMaterial({ map: dirt }),
  );
  road.position.set(9, 0.06, 0);
  scene.add(road);

  const trunk = new THREE.BoxGeometry(0.16, 1, 0.16);
  const crown = new THREE.BoxGeometry(0.62, 0.34, 0.62);
  const greens = ["#1d6b32", "#2f8a40", "#145028", "#3c9a4c", "#246636"];
  for (let index = 0; index < 24; index += 1) {
    const material = new THREE.MeshBasicMaterial({ map: grove, color: greens[index % greens.length] });
    const spots = [
      { z: -2.15, h: 2.4 },
      { z: -3.15, h: 3.1 },
    ];
    spots.forEach((spot, row) => {
      const height = spot.h + ((index + row) % 3) * 0.25;
      const cane = new THREE.Mesh(trunk, material);
      cane.scale.y = height;
      const x = index * 0.95 - 1;
      cane.position.set(x, height / 2, spot.z);
      const top = new THREE.Mesh(crown, leaf);
      top.position.set(x, height + 0.12, spot.z);
      scene.add(cane, top);
    });
  }

  const postMaterial = new THREE.MeshBasicMaterial({ color: "#6b4428" });
  const signGroups = [];
  const signBoards = [];
  stops.forEach((stop) => {
    const group = new THREE.Group();
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.92, 0.08), postMaterial);
    post.position.y = 0.46;
    const board = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 0.58),
      new THREE.MeshBasicMaterial({ color: "#e7d3a8" }),
    );
    board.position.y = 1.2;
    group.add(post, board);
    group.position.set(toPathX(stop.x), 0.12, 0);
    scene.add(group);
    signGroups.push(group);
    signBoards.push(board);
  });

  const panda = buildPanda();
  scene.add(panda.actor);

  let portrait = false;

  function resize(width, height) {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    const aspect = width / Math.max(height, 1);
    portrait = width < 760 || aspect < 0.9;
    camera.aspect = aspect;
    camera.fov = portrait ? 30 : 28;
    camera.updateProjectionMatrix();
    const scale = portrait ? 1.35 : 1;
    signGroups.forEach((group) => group.scale.setScalar(scale));
  }

  function setLabels(labels) {
    labels.forEach((label, index) => {
      const board = signBoards[index];
      if (!board) return;
      board.material.map?.dispose();
      board.material.map = pixelTexture(paintSign(label));
      board.material.needsUpdate = true;
    });
  }

  function sync(walk) {
    const x = toPathX(walk.x);
    panda.actor.position.x = x;
    panda.actor.rotation.y = walk.facing * 1.1;
    const step = walk.mode === "walk" ? Math.sin(walk.x / 9) : 0;
    panda.leftLeg.rotation.x = step * 0.7;
    panda.rightLeg.rotation.x = -step * 0.7;
    panda.leftArm.rotation.x = -step * 0.5;
    panda.rightArm.rotation.x = step * 0.5;
    if (portrait) {
      camera.position.set(x - 0.15, 2.2, 4.4);
      camera.lookAt(x + 1.15, 1.05, 0);
    } else {
      camera.position.set(x + 0.35, 4.05, 9.1);
      camera.lookAt(x + 1.7, 0.85, 0);
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  function dispose() {
    scene.traverse((node) => {
      node.geometry?.dispose();
      const materials = node.material ? [].concat(node.material) : [];
      materials.forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
    });
    renderer.dispose();
  }

  return { resize, setLabels, sync, render, dispose };
}
