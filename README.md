# video_source_tag
Node module for outputting source tags with correct RFC 6381 parameters.


When using the browser to play media files in the <video> tag, you can give the
browser more information to help it understand if it will know how to play the
media file beforehand. This information is conveyed using a [MIME
type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) and a
[codecs
parameter](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter). 
Each codec defines the format of their codecs parameter. E.g. 
[AV1](https://aomediacodec.github.io/av1-isobmff/#codecsparam), 
[VP9 in MP4](https://www.webmproject.org/vp9/mp4/#codecs-parameter-string), and 
[VP8 and VP9 in WebM](https://www.webmproject.org/docs/container/#video-codec).
The values in some of the codec parameter strings may be mandatory and can be
difficult to obtain. Using this module makes it easier to obtain the correct
codec parameter strings for many media files.

Prerequisites
=============

You need to install [mp4box](https://www.npmjs.com/package/mp4box) and
[ebml](https://www.npmjs.com/package/ebml)
modules.

~~~~~ bash
npm install mp4box && npm install ebml
~~~~~

Usage
=====
Run the video_source_tag module with a list of media files. The media files will
be output in order in the video tag based on the order in the command
line.

~~~~~ bash
node video_source_tag.mjs <input1> <input2> <input3>
~~~~~

Examples
--------

Media files with only video streams.

~~~~~ bash
node video_source_tag.mjs input_av1.mp4 input_vp9.mp4 input_vp9.webm input_vp8.webm input_h264.mp4
<video>
  <source src="input_av1.mp4" type="video/mp4; codecs=av01.0.00M.08" />
  <source src="input_vp9.mp4" type="video/mp4; codecs=vp09.00.10.08" />
  <source src="input_vp9.webm" type="video/webm; codecs=vp9" />
  <source src="input_vp8.webm" type="video/webm; codecs=vp8" />
  <source src="input_h264.mp4" type="video/mp4; codecs=avc1.640009" />
</video>
~~~~~

Media files with audio and video streams.

~~~~~ bash
node video_source_tag.mjs input_av1_aac.mp4 input_vp9_opus.mp4 input_vp9_opus.webm input_vp8_vorbis.webm input_h264_aac.mp4
<video>
  <source src="input_av1_aac.mp4" type="video/mp4; codecs=av01.0.00M.08,mp4a.40.2" />
  <source src="input_vp9_opus.mp4" type="video/mp4; codecs=vp09.00.10.08,Opus" />
  <source src="input_vp9_opus.webm" type="video/webm; codecs=vp9,opus" />
  <source src="input_vp8_vorbis.webm" type="video/webm; codecs=vp8,vorbis" />
  <source src="input_h264_aac.mp4" type="video/mp4; codecs=avc1.640009,mp4a.40.2" />
</video>
~~~~~

Restrictions
============

1. Only .mp4 and .webm files are currently supported.
2. Only H.264, VP8, VP9, and AV1 video codecs are currently supported.
3. Only AAC, Opus, and Vorbis audio codecs are currently supported.

