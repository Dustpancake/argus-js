<template>
    <div>
        <video 
        controls 
        ref="ArgusVid" 
        class="video-js vjs-fluid vjs-default-skin vjs-big-play-centered"
        width="640"
        preload="auto"
        height="264"
        >
        </video>
    </div>
</template>



<script>
import 'video.js/dist/video-js.css';

import videojs from 'video.js';
import io from 'socket.io-client';

class Client {

    constructor(ref, options) {
        this.player = videojs(ref, options);
        this.socket = io();
        this.last_emit = "";
    }

    registerSocketEvents() {
        this.socket.on('pause', () => {
            if (this.last_emit == 'pause') {
                // skip
            }
            else {
                this.player.pause();
            }
        });

        this.socket.on('play', () => {
            if (this.last_emit == 'play') {
                // skip
            }
            else {
                this.player.play();
            }
        });

        this.socket.on('seek', (data) => {
            let time = data.time;
            // check if time is same
            if (Math.abs(time - this.player.currentTime()) < 0.1)  {
                // skip
            } else {
                // seek to time
                this.player.currentTime(time);
                this.player.pause();
            }
        });

        this.socket.on('load', (data) => {
            this.load(data.src, true);
        });

        return this;
    }

    registerPlayerEvents() {
        this.player.on('pause', () => {
            this.last_emit = 'pause';
            this.socket.emit('pause');
        });

        this.player.on('play', () => {
            this.last_emit = 'play';
            this.socket.emit('play');
        });

        // seeking comes before seeked
        this.player.on('seeked', () => {
            this.last_emit = 'seek';
            this.socket.emit('seek', {
                time: this.player.currentTime()
            });
        });

        return this;
    }

    dispose() {
      this.player.dispose();
      this.socket.disconnect();
    }

    load(src, silent) {
        if (silent != true) {
            this.socket.emit('load', {
                src: src
            });
        }

        this.player.src({
            src: `/vid/${src}/index.m3u8`,
            typte: 'application/x-mpegURL'
        });
        return this;
    }
};

// EXPORT STATEMENTS
export default {
    name: "ArgusVid",
    props: {
        options: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            client: null
        }
    },
    mounted() {
      this.client = new Client(this.$refs.ArgusVid, this.options);
      this.client.registerPlayerEvents().registerSocketEvents();

      // store instance
      this.$store.commit("storeClient", this.client);
    },
    beforeDestroy() {
        if (this.client) {
            this.player.dispose()
        }
    }
}
</script>

