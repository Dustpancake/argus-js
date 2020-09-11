# argus-js
A synchronized video player application, for watching films together with your friends/colleagues.

## Setup
Install dependencies with 
```bash
npm install
```

Build the Vue app with
```bash
npm run build
```
which will create a `dist` directory at the root of the project.

### Adding video content

In the current build, the video content must be served as `.m3u8` and `.ts` files. You can convert an `.mp4` into the required format with
```bash
ffmpeg -i [inputfile].mp4 \
    -profile:v baseline \
    -level 3.0 \
    -start_number 0 \
    -hls_time 10 \
    -hls_list_size 0 \
    -f hls \
    [outputdir]/index.m3u8
```

The video content must then be in the root directory under `videos`, with each title indexed by subdirectory, such that the overall setup looks along these lines:
```
webapp.js
dist/
videos/

 - title1/
   - index.m3u8
   - index01.ts
   - ...

 - title2/
   - index.m3u8
   - index01.ts
   - ...

```
### Run
Build and then
```bash
node webapp.js
```
and connect to [localhost:8081](http://localhost:8081).

## ToDo

- configuration files
- more versatile video formats
- tighter interaction
- silly features like reaction buttons
