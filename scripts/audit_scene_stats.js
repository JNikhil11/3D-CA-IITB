import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) files = files.concat(walk(full));
    else if (full.endsWith('.tsx') || full.endsWith('.ts')) files.push(full);
  }
  return files;
}

const sceneFiles = walk('src/scene');
let totalMeshes = 0;
let totalInstanced = 0;
let totalPointLights = 0;
let totalDirLights = 0;
let totalSpotLights = 0;

for (const f of sceneFiles) {
  const code = fs.readFileSync(f, 'utf8');
  const meshCount = (code.match(/<mesh[\s>]/g) || []).length;
  const instancedCount = (code.match(/<instancedMesh[\s>]/g) || []).length;
  const groupCount = (code.match(/<group[\s>]/g) || []).length;
  const pointLightCount = (code.match(/<pointLight[\s>]/g) || []).length;
  const dirLightCount = (code.match(/<directionalLight[\s>]/g) || []).length;
  const spotLightCount = (code.match(/<spotLight[\s>]/g) || []).length;

  totalMeshes += meshCount;
  totalInstanced += instancedCount;
  totalPointLights += pointLightCount;
  totalDirLights += dirLightCount;
  totalSpotLights += spotLightCount;

  console.log(f + ':');
  console.log(`  meshes: ${meshCount}, instancedMeshes: ${instancedCount}, groups: ${groupCount}`);
  console.log(`  pointLights: ${pointLightCount}, dirLights: ${dirLightCount}, spotLights: ${spotLightCount}`);
}

console.log('\n--- TOTALS ACROSS SRC/SCENE ---');
console.log(`Total <mesh> declarations: ${totalMeshes}`);
console.log(`Total <instancedMesh> declarations: ${totalInstanced}`);
console.log(`Total <pointLight> declarations: ${totalPointLights}`);
console.log(`Total <directionalLight> declarations: ${totalDirLights}`);
console.log(`Total <spotLight> declarations: ${totalSpotLights}`);
