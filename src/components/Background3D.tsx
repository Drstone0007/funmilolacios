import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    const pN = 480;
    const pG = new THREE.BufferGeometry();
    const pp = new Float32Array(pN * 3);
    const pc = new Float32Array(pN * 3);
    const ps = new Float32Array(pN);

    for (let i = 0; i < pN; i++) {
      pp[i * 3] = (Math.random() - .5) * 30;
      pp[i * 3 + 1] = (Math.random() - .5) * 20;
      pp[i * 3 + 2] = (Math.random() - .5) * 13;
      const t = Math.random();
      if (t < .42) { pc[i * 3] = 1; pc[i * 3 + 1] = .73; pc[i * 3 + 2] = .16; }
      else if (t < .72) { pc[i * 3] = 0; pc[i * 3 + 1] = 1; pc[i * 3 + 2] = .88; }
      else if (t < .88) { pc[i * 3] = .69; pc[i * 3 + 1] = .38; pc[i * 3 + 2] = 1; }
      else { pc[i * 3] = .9; pc[i * 3 + 1] = .9; pc[i * 3 + 2] = 1; }
      ps[i] = Math.random() * 2.2 + .35;
    }

    pG.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    pG.setAttribute('color', new THREE.BufferAttribute(pc, 3));
    pG.setAttribute('size', new THREE.BufferAttribute(ps, 1));

    const pM = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float size;
        varying vec3 vC;
        uniform float time;
        void main(){
          vC=color;
          vec3 p=position;
          p.y+=sin(time*.2+position.x*.28)*.46;
          p.x+=cos(time*.16+position.z*.22)*.26;
          vec4 mv=modelViewMatrix*vec4(p,1.);
          gl_PointSize=size*(280./-mv.z);
          gl_Position=projectionMatrix*mv;
        }`,
      fragmentShader: `
        varying vec3 vC;
        void main(){
          float d=length(gl_PointCoord-vec2(.5));
          if(d>.5)discard;
          gl_FragColor=vec4(vC,smoothstep(.5,.05,d)*.55);
        }`
    });

    const points = new THREE.Points(pG, pM);
    scene.add(points);

    const mkGOrb = (r: number, x: number, y: number, z: number, c1: string, c2: string) => {
      const m = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          time: { value: 0 },
          c1: { value: new THREE.Color(c1) },
          c2: { value: new THREE.Color(c2) }
        },
        vertexShader: `
          varying vec3 vN;
          void main(){
            vN=normalize(normalMatrix*normal);
            gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
          }`,
        fragmentShader: `
          varying vec3 vN;
          uniform vec3 c1;
          uniform vec3 c2;
          uniform float time;
          void main(){
            float f=dot(vN,vec3(0,0,1));
            float rim=1.-f;
            vec3 c=mix(c1,c2,rim*rim);
            gl_FragColor=vec4(c,rim*rim*(.27+.13*sin(time*1.1)));
          }`
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), m);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      return mesh;
    };

    const go1 = mkGOrb(2.2, -5, 3, -3, '#FFB928', '#FF4500');
    const go2 = mkGOrb(1.8, 5, -2, -4, '#00FFE0', '#0060FF');
    const go3 = mkGOrb(1.3, 1, 5, -5, '#B060FF', '#FFB928');

    const grd = new THREE.GridHelper(50, 50, 0xFFB928, 0x060A0E);
    grd.position.y = -8;
    if (grd.material instanceof THREE.Material) {
      grd.material.opacity = .062;
      grd.material.transparent = true;
    }
    scene.add(grd);

    let bgT = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      bgT += .006;
      pM.uniforms.time.value = bgT;
      [go1, go2, go3].forEach(o => o.material.uniforms.time.value = bgT);
      go1.position.y = 3 + Math.sin(bgT * .33) * .65;
      go2.position.x = 5 + Math.cos(bgT * .26) * .46;
      camera.position.x = Math.sin(bgT * .037) * .3;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};
