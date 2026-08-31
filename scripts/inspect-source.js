#!/usr/bin/env node
/**
 * 复刻第一步：鉴定参考图真实格式与像素。
 * 用法（本 Skill 根目录 = SKILL.md 所在目录，不要写死 ~/.cursor/skills）：
 *   node <本 Skill 根目录>/scripts/inspect-source.js <image>
 * 也可复制到项目 review/ 再跑。禁止信文件名或对话里的「1920」。
 */
const fs = require('fs');
const path = require('path');

function readU16BE(buf, i) {
  return buf.readUInt16BE(i);
}

function inspectPng(buf) {
  if (buf.length < 24) return null;
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) if (buf[i] !== sig[i]) return null;
  return { format: 'png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function inspectJpeg(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i += 1; continue; }
    const marker = buf[i + 1];
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    const len = readU16BE(buf, i + 2);
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { format: 'jpeg', width: readU16BE(buf, i + 7), height: readU16BE(buf, i + 5) };
    }
    i += 2 + len;
  }
  return { format: 'jpeg', width: 0, height: 0 };
}

function inspect(file) {
  const buf = fs.readFileSync(file);
  const png = inspectPng(buf);
  const jpeg = inspectJpeg(buf);
  const ext = path.extname(file).toLowerCase();
  const meta = png || jpeg || { format: 'unknown', width: 0, height: 0 };
  const mismatch = (ext === '.png' && meta.format === 'jpeg')
    || ((ext === '.jpg' || ext === '.jpeg') && meta.format === 'png');
  let verdict = 'ok-measure';
  if (meta.format === 'unknown' || !meta.width) verdict = 'unreadable';
  else if (meta.width < 1600) verdict = 'stop-too-small';
  else if (meta.width === 1920 && meta.height === 1080) verdict = 'ok-1to1';
  else verdict = 'scale-only';
  if (mismatch && verdict === 'ok-1to1') verdict = 'stop-ext-mismatch';
  if (mismatch && meta.width < 1920) verdict = 'stop-chat-compress';
  return { file, ext, bytes: buf.length, ...meta, extMismatch: !!mismatch, verdict };
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node inspect-source.js <image> [image...]');
  process.exit(1);
}
const rows = files.map(inspect);
console.log(JSON.stringify(rows, null, 2));
const bad = rows.some((r) => String(r.verdict).startsWith('stop') || r.verdict === 'unreadable');
process.exit(bad ? 2 : 0);
