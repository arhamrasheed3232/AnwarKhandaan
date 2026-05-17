const fs = require('fs');

const familyJson = JSON.parse(fs.readFileSync('data/family.json', 'utf-8'));
const csvText = fs.readFileSync('data/family.csv', 'utf-8');

function parseCSVRow(str) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' && str[i+1] === '"') {
      current += '"'; i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

const lines = csvText.split('\n').filter(l => l.trim().length > 0);

lines.slice(1).forEach(line => {
  const cols = parseCSVRow(line);
  if (cols.length < 13) return;
  const name = cols[1].trim();
  let gender = cols[2].trim();
  let dob = cols[3].trim();
  let bio = cols[12].trim();
  
  if (!name) return;

  dob = dob.replace(/-/g, '/');

  // Find member
  let member = familyJson.members.find(m => 
    m.name.toLowerCase() === name.toLowerCase() || 
    m.name.toLowerCase().includes(name.toLowerCase()) || 
    name.toLowerCase().includes(m.name.toLowerCase())
  );
  
  if (name.toLowerCase().includes('zulekha')) {
      member = familyJson.members.find(m => m.id === 'zulekha');
  }

  if (member) {
      if (gender) member.gender = gender;
      if (dob) member.dob = dob;
      if (bio) member.bio = bio;
  } else {
      console.log('Could not find member:', name);
  }
});

fs.writeFileSync('data/family.json', JSON.stringify(familyJson, null, 2));
console.log('Successfully merged CSV into family.json');
