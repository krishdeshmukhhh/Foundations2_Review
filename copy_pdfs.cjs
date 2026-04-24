const fs = require('fs');
const path = require('path');

const dirs = [
  'Typed_Notes',
  'Typed_Questions',
  'Exam_Review_Questions',
  'Exam_Review_Solutions',
  'Typed_Solutions'
];

const destDir = path.join(__dirname, 'dist');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

dirs.forEach(dir => {
  const src = path.join(__dirname, dir);
  const dest = path.join(destDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Copied ${dir} to dist/`);
  } else {
    console.log(`Directory ${dir} not found, skipping...`);
  }
});
