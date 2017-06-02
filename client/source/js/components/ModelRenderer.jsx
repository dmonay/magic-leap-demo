import React from 'react';

import * as THREE from 'lib/three/three.min.js';
import Detector from 'lib/three/Detector.js';
import MTLLoader from 'lib/three/MTLLoader.js';
import OBJLoader from 'lib/three/OBJLoader.js';
import OrbitControls from 'lib/three/OrbitControls.js';

const adjustPosition = () => {
  let showroom = document.getElementsByClassName('showroom');

  if (showroom.length > 0) {
    showroom = showroom[0];

    // y = mx+b
    const leftX = window.innerWidth;
    const leftM = 0.03125;
    const leftB = -35;
    const leftOffset = leftM * leftX + leftB;

    const topX = window.innerHeight;
    const topM = -1.0326;
    const topB = 221.304;
    const topOffset = topM * topX + topB;

    showroom.style.marginTop = topOffset + 'px';
    showroom.style.marginLeft = leftOffset + 'px';
  }
};

export default class ModelRenderer extends React.Component {
  constructor() {
    super();
  }

  componentWillUpdate() {
    // each update flush the nodes
    while (this.rootNode.firstChild) {
      this.rootNode.removeChild(this.rootNode.firstChild);
    }
  }

  renderModel() {
    if (!Detector.webgl) {
      Detector.addGetWebGLMessage();
    }

    const container = this.rootNode;

    adjustPosition();

    var camera, controls, scene, renderer;
    var lighting, ambient, keyLight, fillLight, backLight;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {
      /* Camera */
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000);
      camera.position.z = 30;

      /* Scene */
      scene = new THREE.Scene();
      lighting = false;

      ambient = new THREE.AmbientLight(0x838ae4, 1.0);
      scene.add(ambient);

      keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
      keyLight.position.set(-100, 0, 100);

      fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
      fillLight.position.set(100, 0, 100);

      backLight = new THREE.DirectionalLight(0xffffff, 1.0);
      backLight.position.set(100, 0, -100).normalize();

      scene.add(keyLight);
      scene.add(fillLight);
      scene.add(backLight);

      /* Model */
      const mtlLoader = new THREE.MTLLoader();
      const assetPath = 'build/assets/';
      mtlLoader.setPath(assetPath);
      mtlLoader.load('pod_racer.mtl', function(materials) {
        materials.preload();

        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(assetPath);
        objLoader.load('pod_racer.obj', function(object) {
          scene.add(object);
        });
      });

      /* Renderer */
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth / 1.6, window.innerHeight / 1.6);
      renderer.setClearColor(new THREE.Color('hsl(0, 0%, 10%)'));

      container.appendChild(renderer.domElement);

      /* Controls */
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enableZoom = true;
      controls.zoomSpeed = 0.25;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;

      /* Events */
      window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth / 1.6, window.innerHeight / 1.6);
    }

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      render();
    }

    function render() {
      renderer.render(scene, camera);
    }
  }
  render() {
    // only start drawing (accessing the DOM) after the first render
    if (this.rootNode) {
      this.renderModel();
    } else {
      // setTimeout necessary for the very first draw, to ensure drawing using a DOMNode
      setTimeout(() => this.renderModel(), 0);
    }

    return <div className="showroom" ref={node => (this.rootNode = node)} />;
  }
}
