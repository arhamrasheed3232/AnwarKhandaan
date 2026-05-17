const fs = require('fs');

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
const parsedRows = [];
let currentRow = '';
let inQuotes = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  currentRow += (currentRow ? '\n' : '') + line;
  const quoteCount = (line.match(/"/g) || []).length;
  if (quoteCount % 2 === 1) {
    inQuotes = !inQuotes;
  }
  if (!inQuotes) {
    parsedRows.push(parseCSVRow(currentRow));
    currentRow = '';
  }
}

const members = [];

parsedRows.slice(1).forEach(cols => {
  if (cols.length < 13) return;
  const id = cols[0].trim().toLowerCase();
  if (!id || id === 'id') return;

  const name = cols[1].trim();
  const gender = cols[2].trim();
  let dob = cols[3].trim();
  const father = cols[4].trim(); 
  const spouse = cols[9].trim();
  const childrenStr = cols[10].trim();
  const bio = cols[12].trim().replace(/^"|"$/g, '').trim();

  if (dob.includes('-')) dob = dob.replace(/-/g, '/');

  const member = { id, name };
  if (gender && gender !== 'null') member.gender = gender;
  if (dob && dob !== 'null') member.dob = dob;
  
  member._rawFather = father;
  member._rawSpouse = spouse;
  member._rawChildren = childrenStr;
  member._bio = bio;
  
  members.push(member);
});

members.forEach(m => {
  if (m._bio && m._bio !== 'null') m.bio = m._bio;
  
  if (m._rawFather && m._rawFather !== 'null') {
    const parentMatch = members.find(x => x.name.toLowerCase() === m._rawFather.toLowerCase());
    if (parentMatch) m.parent = parentMatch.id;
  }
  
  if (m._rawSpouse && m._rawSpouse !== 'null') {
    const spouseMatch = members.find(x => x.name.toLowerCase() === m._rawSpouse.toLowerCase() || x.id === m._rawSpouse.toLowerCase());
    if (spouseMatch) m.spouse = spouseMatch.id;
  }
  
  if (m._rawChildren && m._rawChildren !== 'null') {
    const childNames = m._rawChildren.split(',').map(s => s.trim());
    const childIds = [];
    childNames.forEach(cn => {
      const match = members.find(x => x.name.toLowerCase() === cn.toLowerCase() || x.id === cn.toLowerCase());
      if (match) {
        childIds.push(match.id);
      } else {
        childIds.push(cn.toLowerCase().replace(/ /g, ''));
      }
    });
    m.children = childIds;
  }
  
  delete m._rawFather;
  delete m._rawSpouse;
  delete m._rawChildren;
  delete m._bio;
});

const anwar = members.find(m => m.id === 'anwar');
const familyData = {
  root: anwar ? anwar : { id: "anwar", name: "Anwar Ali", children: [] },
  members: members
};

fs.writeFileSync('data/family.json', JSON.stringify(familyData, null, 2));
console.log('Generated fresh family.json with ' + members.length + ' members!');
