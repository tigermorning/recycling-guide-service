const fs=require('fs');
const html=fs.readFileSync('computer-village-game.html','utf8');
const start=html.indexOf('<script type="module">');
const end=html.lastIndexOf('</script>');
const js=html.substring(start+22,end);
fs.writeFileSync('_check.mjs', js);
