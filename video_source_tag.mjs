import fs from 'fs';
import { createFile } from 'mp4box';
import { Decoder } from 'ebml';

function usage() {
  console.log('node video_source_tag.mjs <VIDEO> [<VIDEO>...]');
}

if (process.argv.length === 2) {
  console.error('Please provide at least one video file.');
  usage();
  process.exit(1);
}

const files = process.argv.slice(2);
outputVideoTag(files);


function mp4TypeString(mime) {
  let tokens = mime.split(";");
  if (tokens[0] != 'video/mp4') {
    console.log('Error do not understand MIME type: ' + tokens[0]);
    return '';
  }
  if (tokens[1].indexOf('av01') === -1 &&
      tokens[1].indexOf('vp09') === -1 &&
      tokens[1].indexOf('avc1') === -1) {
    console.log('Error do not understand codec string: ' + tokens[1]);
    return '';
  }

  const codecsString = tokens[1].replaceAll('"', '');
  return tokens[0] + ';' + codecsString;
}

function webmTypeString(file) {
  let videoCodecString = '';
  let audioCodecString = '';
  const ebmlDecoder = new Decoder();
  ebmlDecoder.on('data', chunk => {
    if (chunk[1]['name'] === 'CodecID') {
      const codecId = chunk[1]['value'];
      if (codecId === 'V_VP8') {
        videoCodecString = 'vp8';
      } else if (codecId === 'V_VP9') {
        videoCodecString = 'vp9';
      } else if (codecId === 'A_OPUS') {
        audioCodecString = 'opus';
      } else if (codecId === 'A_VORBIS') {
        audioCodecString = 'vorbis';
      } else {
        console.log('Error do not understand codecId: ' + codecId);
        return '';
      }
    }
  });
  const data = fs.readFileSync(file);
  ebmlDecoder.write(data);

  let typeString = 'video/webm';
  typeString += '; codecs=' + videoCodecString;
  if (audioCodecString) {
    typeString += ',' + audioCodecString
  }
  return typeString;
}

function getTypeString(file) {
  let typeString = '';

  if (file.indexOf('.webm') !== -1) {
    // File has a WebM extension.
    typeString = webmTypeString(file);
  } else if (file.indexOf('.mp4') !== -1) {
    // File has a MP4 extension.
    const data = fs.readFileSync(file);
    let buffer = data.buffer;
    buffer.fileStart = 0;

    var mp4boxfile = createFile();
    mp4boxfile.onError = e => console.error(e);
    mp4boxfile.onReady = info => {
      typeString = mp4TypeString(info.mime);
    }
    mp4boxfile.appendBuffer(buffer);
    mp4boxfile.flush();
  }
  return typeString;
}

function outputVideoTag(files) {
  // Get the file srcs and type strings.
  let sources = [];
  files.forEach((element) => {
    let source = {};
    source['src'] = element;
    source['type'] = getTypeString(element);
    sources.push(source);
  });

  console.log('<video>');
  sources.forEach((element) => {
    const f = element['src'];
    const t = element['type'];
    console.log('  <source src="' + f + '" type="' + t + '" />');
  });
  console.log('</video>');
}

