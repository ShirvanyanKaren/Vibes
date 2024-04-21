import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ParticleSystem = () => {
    let group;
    const particlesData = [];
    let camera, scene, renderer;
    let positions, colors;
    let particles;
    let pointCloud;
    let particlePositions;
    let linesMesh;
    let controls;
    let lc = new THREE.Color("#b8b4b4");

    const maxParticleCount = 1000;
    let particleCount = 150;
    const r = 800;
    const rHalf = r / 2;
    let v3 = new THREE.Vector3();

    const effectController = {
        showDots: false,
        showLines: true,
        minDistance: 150,
        limitConnections: false,
        maxConnections: 10,
        particleCount: 200
    };

    const rendererContainer = useRef(null);

    useEffect(() => {
        init();
        animate();

        return () => {
            // Clean up Three.js objects
            scene.remove(group);
            group = null;
            //controls.dispose();
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (renderer) {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }, [renderer]);

    function init() {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 4000);
        camera.position.z = 800;

        scene = new THREE.Scene();

        group = new THREE.Group();
        scene.add(group);

        // const helper = new THREE.Mesh(new THREE.IcosahedronGeometry(rHalf, 2), new THREE.MeshBasicMaterial({color: 0xd3d3d3,  wireframe: true}));
        // group.add(helper);
        

        const segments = maxParticleCount * maxParticleCount;

        positions = new Float32Array(segments * 3);
        colors = new Float32Array(segments * 3);

        const pMaterial = new THREE.PointsMaterial({
            color: 0x888888,
            size: 3,
            blending: THREE.AdditiveBlending,
            transparent: true,
            sizeAttenuation: false
        });
        

        particles = new THREE.BufferGeometry();
        particlePositions = new Float32Array(maxParticleCount * 3);

        for (let i = 0; i < maxParticleCount; i++) {
            let rand = Math.random();
            let radius = Math.sqrt(rHalf * rHalf * rand);
            v3.randomDirection().setLength(radius);

            particlePositions[i * 3] = v3.x;
            particlePositions[i * 3 + 1] = v3.y;
            particlePositions[i * 3 + 2] = v3.z;

            particlesData.push({
                velocity: new THREE.Vector3().randomDirection(),
                numConnections: 0
            });
        }

        particles.setDrawRange(0, particleCount);
        particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage));

        pointCloud = new THREE.Points(particles, pMaterial);
        pointCloud.visible = false;
        group.add(pointCloud);

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));

        geometry.computeBoundingSphere();

        geometry.setDrawRange(0, 0);

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        linesMesh = new THREE.LineSegments(geometry, material);
        group.add(linesMesh);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        
    
        renderer.domElement.id = "ParticleSystem";
        
        rendererContainer.current.appendChild(renderer.domElement);

        // controls = new OrbitControls(camera, renderer.domElement);
        // controls.minDistance = 800;
        // controls.maxDistance = 3000;
        // controls.enableDamping = true;
        // controls.enablePan = false;

        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        //controls.update();

        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        for (let i = 0; i < particleCount; i++)
            particlesData[i].numConnections = 0;

        for (let i = 0; i < particleCount; i++) {
            const particleData = particlesData[i];

            particlePositions[i * 3] += particleData.velocity.x;
            particlePositions[i * 3 + 1] += particleData.velocity.y;
            particlePositions[i * 3 + 2] += particleData.velocity.z;

            v3.fromArray(particlePositions, i * 3);
            let v3len = v3.length();
            v3.normalize().negate();
            if (v3len > rHalf) particleData.velocity.reflect(v3);

            if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections)
                continue;

            for (let j = i + 1; j < particleCount; j++) {
                const particleDataB = particlesData[j];
                if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections)
                    continue;

                const dx = particlePositions[i * 3] - particlePositions[j * 3];
                const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
                const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < effectController.minDistance) {
                    particleData.numConnections++;
                    particleDataB.numConnections++;

                    const alpha = 1.0 - dist / effectController.minDistance;

                    positions[vertexpos++] = particlePositions[i * 3];
                    positions[vertexpos++] = particlePositions[i * 3 + 1];
                    positions[vertexpos++] = particlePositions[i * 3 + 2];

                    positions[vertexpos++] = particlePositions[j * 3];
                    positions[vertexpos++] = particlePositions[j * 3 + 1];
                    positions[vertexpos++] = particlePositions[j * 3 + 2];

                    colors[colorpos++] = alpha * lc.r;
                    colors[colorpos++] = alpha * lc.g;
                    colors[colorpos++] = alpha * lc.b;

                    colors[colorpos++] = alpha * lc.r;
                    colors[colorpos++] = alpha * lc.g;
                    colors[colorpos++] = alpha * lc.b;

                    numConnected++;
                }
            }
        }

        linesMesh.geometry.setDrawRange(0, numConnected * 2);
        linesMesh.geometry.attributes.position.needsUpdate = true;
        linesMesh.geometry.attributes.color.needsUpdate = true;

        pointCloud.geometry.attributes.position.needsUpdate = true;

        requestAnimationFrame(animate);

        render();
    }

    function render() {
        const time = Date.now() * 0.001;
        group.rotation.y = time * 0.1;
        renderer.render(scene, camera);
    }

    return <div ref={rendererContainer} />;
};

export default ParticleSystem;
