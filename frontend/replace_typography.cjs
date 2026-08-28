const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\pavansahu\\Downloads\\NLP-PROJECT\\src\\components';

function getFiles(dir, files_) {
    files_ = files_ || [];
    const files = fs.readdirSync(dir);
    for (let i in files) {
        const name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else if (name.endsWith('.jsx')) {
            files_.push(name);
        }
    }
    return files_;
}

const files = getFiles(srcDir);

const replacements = [
    [/text-\[65px\] sm:text-\[85px\] lg:text-\[100px\] xl:text-\[110px\]/g, 'text-fluid-hero'],
    [/text-\[40px\] sm:text-\[50px\] lg:text-\[60px\]/g, 'text-fluid-h2-lg'],
    [/text-\[25px\] sm:text-\[36px\] lg:text-\[40px\]/g, 'text-fluid-h2'],
    [/text-\[55px\] sm:text-\[90px\] lg:text-\[180px\]/g, 'text-fluid-bg'],
    [/text-\[50px\] sm:text-\[80px\] lg:text-\[180px\]/g, 'text-fluid-bg'],
    [/text-\[18px\] sm:text-\[21px\] lg:text-\[24px\]/g, 'text-fluid-h3'],
    [/text-\[17px\] sm:text-\[18px\]/g, 'text-fluid-h3'],
    [/text-\[18px\] sm:text-\[19px\]/g, 'text-fluid-h3'],
    [/text-lg sm:text-xl/g, 'text-fluid-h3'],
    [/text-\[17px\] sm:text-xl lg:text-2xl/g, 'text-fluid-h3'],
    [/text-\[14px\] sm:text-\[15px\] lg:text-\[16px\]/g, 'text-fluid-p'],
    [/text-\[15px\] sm:text-\[16px\]/g, 'text-fluid-p'],
    [/text-\[14px\] sm:text-\[15px\]/g, 'text-fluid-p'],
    [/text-base sm:text-lg/g, 'text-fluid-p'],
    [/text-\[15px\] lg:text-\[16px\]/g, 'text-fluid-nav'],
    [/text-\[16px\]/g, 'text-fluid-nav'],
    [/text-\[15px\]/g, 'text-fluid-nav'],
    [/text-\[13px\] sm:text-sm/g, 'text-fluid-sm'],
    [/text-\[13px\] sm:text-\[14px\] lg:text-\[16px\]/g, 'text-fluid-sm'],
    [/text-\[13px\] sm:text-\[14px\] lg:text-\[17px\]/g, 'text-fluid-sm'],
    [/text-\[13px\] sm:text-\[14px\]/g, 'text-fluid-sm'],
    [/text-xs sm:text-sm/g, 'text-fluid-sm'],
    [/text-\[12px\] sm:text-sm/g, 'text-fluid-sm'],
    [/text-sm/g, 'text-fluid-sm'],
    [/text-\[11px\] sm:text-\[12px\]/g, 'text-fluid-xs'],
    [/text-\[10px\] sm:text-\[11px\]/g, 'text-fluid-xs'],
    [/text-\[10px\] sm:text-\[12px\]/g, 'text-fluid-xs'],
    [/text-xs/g, 'text-fluid-xs']
];

let totalModifications = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    for (const [regex, replacement] of replacements) {
        content = content.replace(regex, replacement);
    }
    
    // SAFE regex for leading-[...] or leading-7 or sm:leading-[24px]
    // Matches leading- followed by alphanumeric or bracketed values, avoiding closing quotes or tags
    content = content.replace(/(sm:|md:|lg:|xl:)?leading-([a-zA-Z0-9-]+|\[\w+\])/g, '');
    
    // Also remove duplicate spaces that might occur from removing classes
    content = content.replace(/  +/g, ' ');
    // Clean up class=" " situations
    content = content.replace(/className=" /g, 'className="');
    content = content.replace(/ className=""/g, '');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        totalModifications++;
        console.log('Modified:', path.basename(file));
    }
}
console.log('Total files modified:', totalModifications);
