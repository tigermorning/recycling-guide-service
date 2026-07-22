const fs = require('fs');
const h = fs.readFileSync('C:\\Users\\user\\Documents\\opencode-sandbox\\computer-learning-game.html', 'utf8');
const m = h.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  fs.writeFileSync('C:\\Users\\user\\Documents\\opencode-sandbox\\check.js', m[1]);
  console.log('JS extracted');
}
