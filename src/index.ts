import fs from 'fs';
import path from 'path';

interface IconData {
  body: string;
  width?: number;
  height?: number;
}

interface IconifyJSON {
  prefix: string;
  icons: { [key: string]: IconData };
}

const iconsDir = path.join(__dirname, '../aws-icons');

function processIconName(filename: string): string {
  // Remove .svg extension and convert to kebab-case
  return filename.replace('.svg', '').toLowerCase();
}

function processSvgContent(content: string): IconData {
  // Extract width and height from SVG if present
  const widthMatch = content.match(/width="(\d+)"/);
  const heightMatch = content.match(/height="(\d+)"/);
  
  return {
    body: content
      .replace(/<\?xml.*?\?>/, '') // Remove XML declaration
      .replace(/<svg[^>]*>/, '') // Remove SVG opening tag
      .replace(/<\/svg>/, '') // Remove SVG closing tag
      .trim(),
    ...(widthMatch && { width: parseInt(widthMatch[1], 10) }),
    ...(heightMatch && { height: parseInt(heightMatch[1], 10) })
  };
}

function buildIconsObject(): IconifyJSON {
  const icons: { [key: string]: IconData } = {};
  
  function processDirectory(dir: string) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.endsWith('.svg')) {
        const category = path.basename(path.dirname(fullPath));
        const iconName = processIconName(`${category}-${item}`);
        const svgContent = fs.readFileSync(fullPath, 'utf8');
        icons[iconName] = processSvgContent(svgContent);
      }
    });
  }
  
  processDirectory(iconsDir);
  
  return {
    prefix: 'codiva-aws',
    icons
  };
}

export const icons = buildIconsObject();
