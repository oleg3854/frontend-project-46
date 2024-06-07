import path from 'path';
import fs from 'fs';

const gendiff = (filepath1, filepath2) => {
  const [path1, path2] = [path.resolve(process.cwd(), filepath1), path.resolve(process.cwd(), filepath2)];
  const data1 = fs.readFileSync(path1, 'utf-8');
  const data2 = fs.readFileSync(path2);
  return [data1, data2];
};

export default gendiff;