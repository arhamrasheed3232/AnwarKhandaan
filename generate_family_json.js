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

// First pass: Resolve spouses and children arrays (which establishes biological relations)
members.forEach(m => {
  if (m._bio && m._bio !== 'null') m.bio = m._bio;
  
  if (m._rawSpouse && m._rawSpouse !== 'null') {
    const spouseMatch = members.find(x => 
      x.name.toLowerCase().trim() === m._rawSpouse.toLowerCase().trim() || 
      x.id === m._rawSpouse.toLowerCase().trim()
    );
    if (spouseMatch) m.spouse = spouseMatch.id;
  }
  
  if (m._rawChildren && m._rawChildren !== 'null') {
    const childNames = m._rawChildren.split(',').map(s => s.trim());
    const childIds = [];
    childNames.forEach(cn => {
      const match = members.find(x => 
        x.name.toLowerCase().trim() === cn.toLowerCase().trim() || 
        x.id === cn.toLowerCase().trim()
      );
      if (match) {
        childIds.push(match.id);
      } else {
        // Fallback to formatted slug if child not present as a separate row yet
        childIds.push(cn.toLowerCase().trim().replace(/ /g, ''));
      }
    });
    m.children = childIds;
  }
});

// Second pass: Resolve parents using a multi-layered match (Name fuzzy match + Children array reverse match)
members.forEach(m => {
  let parentId = null;

  if (m._rawFather && m._rawFather !== 'null') {
    const cleanFather = m._rawFather.toLowerCase().trim();
    const parentMatch = members.find(x => {
      const cleanName = x.name.toLowerCase().trim();
      return (
        cleanName === cleanFather ||
        cleanName.replace('mohammad', 'mohd') === cleanFather ||
        cleanName.replace('mohd', 'mohammad') === cleanFather ||
        cleanName.replace('aamir', 'amir') === cleanFather ||
        cleanName.replace('amir', 'aamir') === cleanFather
      );
    });
    if (parentMatch) parentId = parentMatch.id;
  }

  // Double check: if still no parent, check who has this member listed in their children array
  if (!parentId) {
    const parentByChildren = members.find(x => x.children && x.children.includes(m.id));
    if (parentByChildren) {
      parentId = parentByChildren.id;
    }
  }

  if (parentId) {
    m.parent = parentId;
  }

  // Cleanup raw properties
  delete m._rawFather;
  delete m._rawSpouse;
  delete m._rawChildren;
  delete m._body;
  delete m._bio;
});

const anwar = members.find(m => m.id === 'anwar');
const familyData = {
  root: anwar ? anwar : { id: "anwar", name: "Anwar Ali", children: [] },
  members: members
};

fs.writeFileSync('data/family.json', JSON.stringify(familyData, null, 2));
console.log('Generated fresh family.json with ' + members.length + ' members!');
