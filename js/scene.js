(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var container = document.getElementById('webgl-canvas');
  if (!container) return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 30);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  var mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  var scrollY = 0;
  var time = 0;

  // Particle system
  var PARTICLE_COUNT = window.innerWidth < 640 ? 800 : 2000;
  var particleGeometry = new THREE.BufferGeometry();
  var positions = new Float32Array(PARTICLE_COUNT * 3);
  var velocities = new Float32Array(PARTICLE_COUNT * 3);
  var sizes = new Float32Array(PARTICLE_COUNT);
  var colors = new Float32Array(PARTICLE_COUNT * 3);

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    var i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = (Math.random() - 0.5) * 80;
    positions[i3 + 2] = (Math.random() - 0.5) * 60;

    velocities[i3] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

    sizes[i] = Math.random() * 2 + 0.5;

    var colorChoice = Math.random();
    if (colorChoice < 0.5) {
      colors[i3] = 0;
      colors[i3 + 1] = 0.94;
      colors[i3 + 2] = 1;
    } else if (colorChoice < 0.8) {
      colors[i3] = 0.66;
      colors[i3 + 1] = 0.33;
      colors[i3 + 2] = 0.97;
    } else {
      colors[i3] = 0.96;
      colors[i3 + 1] = 0.25;
      colors[i3 + 2] = 0.37;
    }
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  var particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() }
    },
    vertexShader: [
      'attribute float size;',
      'attribute vec3 color;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      'uniform float uTime;',
      'uniform float uPixelRatio;',
      'void main() {',
      '  vColor = color;',
      '  vec3 pos = position;',
      '  pos.x += sin(uTime * 0.3 + position.y * 0.1) * 0.5;',
      '  pos.y += cos(uTime * 0.2 + position.x * 0.1) * 0.5;',
      '  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);',
      '  float dist = length(mvPosition.xyz);',
      '  vAlpha = smoothstep(60.0, 10.0, dist) * 0.6;',
      '  gl_PointSize = size * uPixelRatio * (20.0 / -mvPosition.z);',
      '  gl_Position = projectionMatrix * mvPosition;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'varying vec3 vColor;',
      'varying float vAlpha;',
      'void main() {',
      '  float d = length(gl_PointCoord - 0.5);',
      '  if (d > 0.5) discard;',
      '  float alpha = smoothstep(0.5, 0.1, d) * vAlpha;',
      '  gl_FragColor = vec4(vColor, alpha);',
      '}'
    ].join('\n'),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  var particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Floating geometric shapes
  var geometries = [];
  var shapes = [
    new THREE.IcosahedronGeometry(1.5, 1),
    new THREE.OctahedronGeometry(1.2, 0),
    new THREE.TorusGeometry(1, 0.3, 8, 24),
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.RingGeometry(0.8, 1.4, 6)
  ];

  var wireframeMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });

  var wireframeMat2 = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.1
  });

  for (var g = 0; g < 12; g++) {
    var shape = shapes[Math.floor(Math.random() * shapes.length)];
    var mat = g % 2 === 0 ? wireframeMat.clone() : wireframeMat2.clone();
    var mesh = new THREE.Mesh(shape, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 30 - 10
    );
    var scale = Math.random() * 1.5 + 0.5;
    mesh.scale.set(scale, scale, scale);
    mesh.userData = {
      rotSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 },
      floatSpeed: Math.random() * 0.5 + 0.5,
      floatAmp: Math.random() * 2 + 1,
      initY: mesh.position.y
    };
    scene.add(mesh);
    geometries.push(mesh);
  }

  // Connection lines between nearby particles (computed on GPU via shader)
  var lineCount = 200;
  var linePositions = new Float32Array(lineCount * 6);
  var lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  var lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending
  });
  var lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  function updateLines() {
    var pos = particleGeometry.attributes.position.array;
    var linePos = lineGeometry.attributes.position.array;
    var lineIndex = 0;
    var maxDist = 8;

    for (var i = 0; i < Math.min(PARTICLE_COUNT, 300) && lineIndex < lineCount * 6; i++) {
      for (var j = i + 1; j < Math.min(PARTICLE_COUNT, 300) && lineIndex < lineCount * 6; j++) {
        var dx = pos[i * 3] - pos[j * 3];
        var dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        var dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist) {
          linePos[lineIndex++] = pos[i * 3];
          linePos[lineIndex++] = pos[i * 3 + 1];
          linePos[lineIndex++] = pos[i * 3 + 2];
          linePos[lineIndex++] = pos[j * 3];
          linePos[lineIndex++] = pos[j * 3 + 1];
          linePos[lineIndex++] = pos[j * 3 + 2];
        }
      }
    }

    for (var k = lineIndex; k < lineCount * 6; k++) {
      linePos[k] = 0;
    }

    lineGeometry.attributes.position.needsUpdate = true;
  }

  // Ambient light rings
  var ringGeom = new THREE.RingGeometry(15, 15.1, 64);
  var ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
  var ring1 = new THREE.Mesh(ringGeom, ringMat);
  ring1.position.z = -20;
  scene.add(ring1);

  var ringGeom2 = new THREE.RingGeometry(22, 22.1, 64);
  var ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.03, side: THREE.DoubleSide });
  var ring2 = new THREE.Mesh(ringGeom2, ringMat2);
  ring2.position.z = -25;
  ring2.rotation.x = 0.3;
  scene.add(ring2);

  function animate() {
    time += 0.01;
    requestAnimationFrame(animate);

    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    particleMaterial.uniforms.uTime.value = time;

    // Animate particles
    var pos = particleGeometry.attributes.position.array;
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var i3 = i * 3;
      pos[i3] += velocities[i3];
      pos[i3 + 1] += velocities[i3 + 1];
      pos[i3 + 2] += velocities[i3 + 2];

      if (pos[i3] > 40) pos[i3] = -40;
      if (pos[i3] < -40) pos[i3] = 40;
      if (pos[i3 + 1] > 40) pos[i3 + 1] = -40;
      if (pos[i3 + 1] < -40) pos[i3 + 1] = 40;
      if (pos[i3 + 2] > 30) pos[i3 + 2] = -30;
      if (pos[i3 + 2] < -30) pos[i3 + 2] = 30;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Animate floating geometry
    for (var g = 0; g < geometries.length; g++) {
      var mesh = geometries[g];
      mesh.rotation.x += mesh.userData.rotSpeed.x;
      mesh.rotation.y += mesh.userData.rotSpeed.y;
      mesh.position.y = mesh.userData.initY + Math.sin(time * mesh.userData.floatSpeed) * mesh.userData.floatAmp;
    }

    // Rotate rings
    ring1.rotation.z = time * 0.1;
    ring2.rotation.z = -time * 0.08;

    // Camera parallax from mouse
    camera.position.x += (mouse.x * 3 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.02;

    // Camera depth from scroll
    var targetZ = 30 + scrollY * 0.01;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);

    // Update lines periodically
    if (Math.floor(time * 100) % 10 === 0) {
      updateLines();
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('mousemove', function (e) {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  window.addEventListener('scroll', function () {
    scrollY = window.pageYOffset;
  });

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
