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
        this.current_src = "";
    }

    registerSocketEvents() {
        this.socket.on('paused', () => {
            this.player.pause();
        });

        this.socket.on('play', () => {
            this.player.play();
        });

        this.socket.on('seek', (data) => {
            let time = data.time;
            // check if time is same
            if (Math.abs(time - this.player.currentTime()) < 0.1)  {
                // skip
            } else {
                // seek to time
                this.player.currentTime(time);
            }
        });

        this.socket.on('load', (data) => {
            this.load(data.src, true);
        });

        return this;
    }

    registerPlayerEvents() {
        this.player.on('pause', () => {
            this.socket.emit('paused');
        });

        this.player.on('play', () => {
            this.socket.emit('play');
        });

        // seeking comes before seeked
        this.player.on('seeking', () => {
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
      //this.client.load('https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8');
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

