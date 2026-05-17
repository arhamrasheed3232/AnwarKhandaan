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
let count = 0;

// The headers are: ID, Full Name, Gender, DOB, Father, Mother, Grandfather, Great Grandfather, Married, Spouse, Children, Branch, Bio

// Need to handle multi-line bios nicely by combining lines if quotes are open
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

parsedRows.slice(1).forEach(cols => {
  if (cols.length < 13) return;
  
  const id = cols[0].trim().toLowerCase();
  const name = cols[1].trim();
  const gender = cols[2].trim();
  let dob = cols[3].trim();
  const bio = cols[12].trim().replace(/^"|"$/g, '').trim();
  
  if (!id || id === 'id' || !name) return;

  // Convert DOB from DD-MM-YYYY to DD/MM/YYYY if applicable
  if (dob.includes('-')) {
    dob = dob.replace(/-/g, '/');
  }

  // Find member by ID
  let member = familyJson.members.find(m => m.id === id);
  
  if (member) {
      member.name = name;
      if (gender && gender !== 'null') member.gender = gender;
      if (dob && dob !== 'null') member.dob = dob;
      if (bio && bio !== 'null') member.bio = bio;
      count++;
  } else {
      // Create new member
      const newMember = { id, name };
      if (gender && gender !== 'null') newMember.gender = gender;
      if (dob && dob !== 'null') newMember.dob = dob;
      if (bio && bio !== 'null') newMember.bio = bio;
      
      familyJson.members.push(newMember);
      count++;
      console.log('Added new member:', name);
  }
});

fs.writeFileSync('data/family.json', JSON.stringify(familyJson, null, 2));
console.log('Successfully processed ' + count + ' members from CSV into family.json');
