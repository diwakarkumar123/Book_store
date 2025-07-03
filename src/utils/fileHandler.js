const fs = require('fs').promises;
const path = require('path');

const getFilePath = (filename) => path.join(__dirname, '../data', filename);

const readData = async (filename) => {
  try {
    const filePath = getFilePath(filename);
    console.log(filePath,'filePath')
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data || '[]'); // return empty array if file is empty
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet — treat as empty
      return [];
    }
    throw error;
  }
};

// Write data to JSON file
const writeData = async (filename, data) => {
  try {
    const filePath = getFilePath(filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2)); // formatted JSON
  } catch (error) {
    throw error;
  }
};

module.exports = {
  readData,
  writeData,
};
