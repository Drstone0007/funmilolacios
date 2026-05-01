import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OriOrbProps {
  analyzing?: boolean;
  speaking?: boolean;
  orbPh?: number;
  swAct?: number;
  satActive?: boolean[];
}

export const OriOrb: React.FC<OriOrbProps> = ({ 
  analyzing, 
  speaking, 
  orbPh = 0, 
  swAct = 0, 
  satActive = [false, false, false, false, false, false] 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(240, 166);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 240 / 166, 0.1, 100);
    camera.position.z = 3.5;

    const coreMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        ph: { value: 0 },
        sw: { value: 0 }
      },
      vertexShader: `
        varying vec3 vN;
        uniform float time;
        void main(){
          vN=normalize(normalMatrix*normal);
          vec3 p=position;
          p+=normal*(sin(position.x*4.+time*2.)*.037+sin(position.y*3.+time*1.5)*.027);
          gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
        }`,
      fragmentShader: `
        varying vec3 vN;
        uniform float time;
        uniform float ph;
        uniform float sw;
        void main(){
          float f=dot(vN,vec3(0,0,1));
          float rim=1.-f;
          vec3 gold=vec3(1.,.73,.16);
          vec3 cyan=vec3(0.,1.,.88);
          vec3 pur=vec3(.69,.38,1.);
          vec3 c=mix(gold,cyan,sin(time*.27+ph)*.5+.5);
          c=mix(c,pur,sw*.54);
          gl_FragColor=vec4(c,f*.83+rim*rim*.37);
        }`
    });

    const core = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), coreMaterial);
    scene.add(core);

    const auraMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vN;
        void main(){
          vN=normalize(normalMatrix*normal);
          gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
        }`,
      fragmentShader: `
        varying vec3 vN;
        uniform float time;
        void main(){
          float rim=1.-dot(vN,vec3(0,0,-1));
          vec3 c=mix(vec3(1.,.72,.1),vec3(.69,.38,1.),sin(time*.43)*.5+.5);
          gl_FragColor=vec4(c,pow(rim,2.4)*.34);
        }`
    });

    const aura = new THREE.Mesh(new THREE.SphereGeometry(1.25, 32, 32), auraMaterial);
    scene.add(aura);

    const mkR = (r: number, tube: number, rx: number, ry: number, col: number) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 8, 32), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .3 }));
      m.rotation.x = rx;
      m.rotation.y = ry;
      scene.add(m);
      return m;
    };

    const rngs = [
      mkR(1.5, .012, Math.PI / 2, 0, 0xFFB928),
      mkR(1.7, .010, Math.PI / 4, Math.PI / 3, 0x00FFE0),
      mkR(1.9, .008, Math.PI / 6, Math.PI / 1.5, 0xFF4560),
      mkR(2.1, .007, Math.PI / 3, Math.PI / 4, 0xB060FF)
    ];

    const SATCOLS = [0xFFB928, 0x00FFE0, 0xB060FF, 0x4080FF, 0xFF4560, 0x00FF88];
    const satMeshes = SATCOLS.map(col => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(.08, 10, 10), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .28 }));
      scene.add(m);
      return m;
    });

    scene.add(new THREE.AmbientLight(0x001020, 1));

    let time = 0;
    let req: number;
    const animate = () => {
      req = requestAnimationFrame(animate);
      time += .012;
      coreMaterial.uniforms.time.value = time;
      coreMaterial.uniforms.ph.value = orbPh;
      coreMaterial.uniforms.sw.value += (swAct - coreMaterial.uniforms.sw.value) * .055;
      auraMaterial.uniforms.time.value = time;
      
      rngs[0].rotation.z = time * .57;
      rngs[1].rotation.z = -time * .37;
      rngs[2].rotation.y = time * .47;
      rngs[3].rotation.z = time * .21;

      satMeshes.forEach((m, i) => {
        const a = time * (.36 + i * .064) + i * (Math.PI * 2 / 6);
        const r = satActive[i] ? 2.1 : 1.72;
        m.position.set(Math.cos(a) * r * .66, Math.sin(a * 1.26) * .37, Math.sin(a) * r * .66);
        m.scale.setScalar(satActive[i] ? 1.45 : .62);
        if (m.material instanceof THREE.MeshBasicMaterial) {
          m.material.opacity = satActive[i] ? .9 : .23;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(req);
      renderer.dispose();
    };
  }, [orbPh, swAct, satActive]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-40 block ${analyzing ? 'animate-pulse' : ''} ${speaking ? 'scale-110' : ''} transition-transform duration-300`} 
    />
  );
};
