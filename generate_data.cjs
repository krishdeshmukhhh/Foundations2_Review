const fs = require('fs');
const path = require('path');

const dirs = {
  notes: 'Typed_Notes',
  questions: 'Typed_Questions',
  reviewQuestions: 'Exam_Review_Questions',
  solutions: 'Typed_Solutions',
  reviewSolutions: 'Exam_Review_Solutions'
};

const allFiles = {};

for (const [key, dir] of Object.entries(dirs)) {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    allFiles[key] = fs.readdirSync(fullPath).filter(f => f.endsWith('.pdf'));
  } else {
    allFiles[key] = [];
  }
}

const topicsMap = new Map();

function getTopicKey(filename) {
  let name = filename.replace('CSE2331_', '').replace('.pdf', '');
  name = name.replace('_Typed', '').replace('_Homework', '').replace('_Solutions', '');
  name = name.replace('Final_Exam_Review_', 'Final_Review_').replace('Midterm_', 'Midterm_Review_');
  // Handle specific matches
  if (name === 'Minimum_Spanning_Tree' || name === 'Greedy_Graph_Algorithms') return 'Greedy_Algorithms_and_MST';
  if (name === 'QuickSort_and_Probabilistic_Analysis' || name === 'Quicksort') return 'Quicksort_and_Probabilistic_Analysis';
  if (name === 'Red_black_Tree') return 'Red_Black_Trees';
  return name;
}

function addFileToTopic(topicKey, category, title, filePath) {
  if (!topicsMap.has(topicKey)) {
    topicsMap.set(topicKey, {
      id: topicKey.toLowerCase().replace(/_/g, '-'),
      title: topicKey.replace(/_/g, ' '),
      files: { notes: [], questions: [], reviewQuestions: [], solutions: [] }
    });
  }
  topicsMap.get(topicKey).files[category].push({ title, path: filePath });
}

for (const file of allFiles.notes) {
  const key = getTopicKey(file);
  addFileToTopic(key, 'notes', file.replace('.pdf', '').replace(/_/g, ' '), `/${dirs.notes}/${file}`);
}

for (const file of allFiles.questions) {
  const key = getTopicKey(file);
  const solutionFile = file.replace('.pdf', '_Solutions.pdf');
  const hasSolution = allFiles.solutions.includes(solutionFile);
  
  const fileObj = { 
    title: file.replace('.pdf', '').replace(/_/g, ' '), 
    path: `/${dirs.questions}/${file}`
  };
  
  if (hasSolution) {
    fileObj.solutionPath = `/${dirs.solutions}/${solutionFile}`;
  } else if (allFiles.solutions.includes(file)) { // Red_black_Tree_Homework.pdf in solutions is just that
    fileObj.solutionPath = `/${dirs.solutions}/${file}`;
  }
  
  addFileToTopic(key, 'questions', fileObj.title, fileObj.path);
  if (fileObj.solutionPath) {
     addFileToTopic(key, 'solutions', fileObj.title + ' Solutions', fileObj.solutionPath);
  }
}

for (const file of allFiles.reviewQuestions) {
  const key = getTopicKey(file);
  const solutionFile = file.replace('.pdf', '_Solutions.pdf');
  const hasSolution = allFiles.reviewSolutions && allFiles.reviewSolutions.includes(solutionFile);
  
  const fileObj = {
    title: file.replace('.pdf', '').replace(/_/g, ' '),
    path: `/${dirs.reviewQuestions}/${file}`
  };

  if (hasSolution) {
    fileObj.solutionPath = `/${dirs.reviewSolutions}/${solutionFile}`;
  }

  addFileToTopic(key, 'reviewQuestions', fileObj.title, fileObj.path);
  if (fileObj.solutionPath) {
    addFileToTopic(key, 'solutions', fileObj.title + ' Solutions', fileObj.solutionPath);
  }
}

const topics = Array.from(topicsMap.values()).map((t, idx) => ({ ...t, order: idx + 1 }));

const output = `export const topics = ${JSON.stringify(topics, null, 2)};\n`;
fs.mkdirSync(path.join(__dirname, 'src/data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'src/data/topics.ts'), output);
console.log('Topics generated!');
