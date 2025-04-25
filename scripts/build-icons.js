const fs = require('fs');
const path = require('path');

function processIconName(filename) {
  return filename.replace('.svg', '').toLowerCase();
}

function processSvgContent(content) {
  const widthMatch = content.match(/width="([^"]+)"/);
  const heightMatch = content.match(/height="([^"]+)"/);
  const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
  
  // Extract the SVG content while preserving important attributes
  const svgOpenTag = content.match(/<svg[^>]*>/)[0];
  const innerContent = content
    .replace(/<\?xml.*?\?>/, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();

  // Create a new SVG tag with preserved attributes
  const preservedAttributes = [];
  if (viewBoxMatch) preservedAttributes.push(`viewBox="${viewBoxMatch[1]}"`);
  if (widthMatch) preservedAttributes.push(`width="${widthMatch[1]}"`);
  if (heightMatch) preservedAttributes.push(`height="${heightMatch[1]}"`);

  const newSvgTag = `<svg xmlns="http://www.w3.org/2000/svg" ${preservedAttributes.join(' ')}>`;

  return {
    body: `${newSvgTag}${innerContent}</svg>`,
    ...(widthMatch && { width: parseInt(widthMatch[1], 10) }),
    ...(heightMatch && { height: parseInt(heightMatch[1], 10) })
  };
}

function buildIconsObject() {
  const icons = {};
  const iconsDir = path.join(__dirname, '../aws-icons');
  
  function processDirectory(dir) {
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
  return icons;
}

const icons = buildIconsObject();
const output = `// This file is auto-generated. Do not edit manually.
export const icons = {
  prefix: 'aws',
  icons: ${JSON.stringify(icons, null, 2)}
};`;

fs.writeFileSync(path.join(__dirname, '../src/generated-icons.ts'), output);
console.log('Icons generated successfully!');
