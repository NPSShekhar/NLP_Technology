const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:\\Users\\pavansahu\\.gemini\\antigravity\\brain\\fb69c802-f3a7-4ca0-8fa8-394fdfd03b0d\\.system_generated\\logs\\transcript_full.jsonl';
const outDir = 'C:\\Users\\pavansahu\\Downloads\\reconstructed_src';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

function copyRecursiveSync(src, dest) {
    if (fs.existsSync(src) && fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        for (let item of fs.readdirSync(src)) {
            copyRecursiveSync(path.join(src, item), path.join(dest, item));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

const originalSrc = 'C:\\Users\\pavansahu\\Downloads\\temp_nlp\\NLP-PROJECT\\NLP-Project\\src';
copyRecursiveSync(originalSrc, outDir);

function normalize(str) {
    return str.replace(/\r\n/g, '\n');
}

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
let applied = 0;

for (const line of lines) {
    if (!line.trim()) continue;
    try {
        const obj = JSON.parse(line);
        if (obj.step_index > 518) break;
        
        if (obj.type === 'PLANNER_RESPONSE' && obj.tool_calls) {
            for (const call of obj.tool_calls) {
                if (!call.args || !call.args.TargetFile) continue;
                
                let parts = call.args.TargetFile.split(/src[\\\/]/);
                if (parts.length < 2) continue;
                let relativePath = parts[1];
                
                let targetPath = path.join(outDir, relativePath);
                
                if (call.name === 'write_to_file') {
                    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
                    fs.writeFileSync(targetPath, call.args.CodeContent);
                    applied++;
                } 
                else if (call.name === 'replace_file_content') {
                    if (!fs.existsSync(targetPath)) { console.log('File missing:', targetPath); continue; }
                    let content = fs.readFileSync(targetPath, 'utf8');
                    let targetContent = normalize(call.args.TargetContent);
                    let replacementContent = normalize(call.args.ReplacementContent);
                    
                    if (normalize(content).includes(targetContent)) {
                        content = normalize(content).replace(targetContent, replacementContent);
                        fs.writeFileSync(targetPath, content);
                        applied++;
                    } else {
                        console.log('Failed replace at step', obj.step_index, relativePath);
                    }
                }
                else if (call.name === 'multi_replace_file_content') {
                    if (!fs.existsSync(targetPath)) { console.log('File missing:', targetPath); continue; }
                    let content = normalize(fs.readFileSync(targetPath, 'utf8'));
                    let chunksApplied = 0;
                    for (const chunk of call.args.ReplacementChunks) {
                        let targetContent = normalize(chunk.TargetContent);
                        let replacementContent = normalize(chunk.ReplacementContent);
                        if (content.includes(targetContent)) {
                            content = content.replace(targetContent, replacementContent);
                            chunksApplied++;
                        } else {
                            console.log('Failed multi replace chunk at step', obj.step_index, relativePath);
                        }
                    }
                    fs.writeFileSync(targetPath, content);
                    if (chunksApplied > 0) applied++;
                }
            }
        }
    } catch(e) {
        // ignore JSON parse error on partial lines if any
    }
}
console.log('Total successful applied edits:', applied);
