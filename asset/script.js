/*
1. Render song
2. Scroll top
3. Play / pause
4. Next / Prev
5. Random
6. Next/ repeat when ended
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $(".progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Making my way",
            singer: "Son Tung",
            path: "./asset/audio/song-1.mp3",
            img: "./asset/img/img-song-1.jpg",
        },
        {
            name: "Đường Tôi Chở Em Về",
            singer: "Bui Truong Linh",
            path: "./asset/audio/song-2.mp3",
            img: "./asset/img/img-song-2.jpg",
        },
        {
            name: "Khi ta lớn",
            singer: "An Vu",
            path: "./asset/audio/song-3.mp3",
            img: "./asset/img/img-song-3.jpg",
        },
        {
            name: "Lạ lùng",
            singer: "Vu",
            path: "./asset/audio/song-4.mp3",
            img: "./asset/img/img-song-4.jpg",
        },
        {
            name: "Não cá vàng",
            singer: "Only C",
            path: "./asset/audio/song-5.mp3",
            img: "./asset/img/img-song-5.jpg",
        },
        {
            name: "Đã lỡ yêu e nhiều",
            singer: "Justa Tee",
            path: "./asset/audio/song-6.mp3",
            img: "./asset/img/img-song-6.jpg",
        },
        {
            name: "Nấu cho em ăn",
            singer: "Đen Vâu",
            path: "./asset/audio/song-7.mp3",
            img: "./asset/img/img-song-7.jpg",
        },
        {
            name: "Phía sau một cô gái",
            singer: "Soobin Hoang Son",
            path: "./asset/audio/song-8.mp3",
            img: "./asset/img/img-song-8.jpg",
        },
        {
            name: "Đi để trở về",
            singer: "Soobin Hoang Son",
            path: "./asset/audio/song-9.mp3",
            img: "./asset/img/img-song-9.jpg",
        },
        {
            name: "Ghé qua",
            singer: "Dick x PC x Tofu",
            path: "./asset/audio/song-10.mp3",
            img: "./asset/img/img-song-10.jpg",
        },
        {
            name: "Tâm sự tuổi 30",
            singer: "Trinh Thanh Binh",
            path: "./asset/audio/song-11.mp3",
            img: "./asset/img/img-song-11.jpg",
        },
        {
            name: "Ngày mai em đi",
            singer: "TOULIVER X LÊ HIẾU X SOOBIN HOÀNG SƠN",
            path: "./asset/audio/song-12.mp3",
            img: "./asset/img/img-song-12.jpg",
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
               <div class="song ${
                   index === this.currentIndex ? "active" : ""
               }" data-index="${index}">
               <div class="thumb" style="
                              background-image: url('${song.img}');
                           "></div>
               <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
               </div>
               <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
               </div>
            </div>          
          `;
        });
        $(".playlist").innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // Xử lí Cd quay
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 10000, // 10 seconds
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();
        // Xử lí phóng to/ thu nhở CD
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
        // Xử lí khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                _this.isPlaying = false;
                audio.pause();
                player.classList.remove("playing");
                cdThumbAnimate.pause();
            } else {
                _this.isPlaying = true;
                audio.play();
                player.classList.add("playing");
                cdThumbAnimate.play();
            }
        };
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };
        // Xử lí khi tua
        progress.onchange = function (e) {
            const seekTime = (audio.duration * e.target.value) / 100;
            audio.currentTime = seekTime;
        };
        // Xử lí khi next
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        // Xử lí khi prev
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        // Xử lí bật/ tắt random
        randBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            randBtn.classList.toggle("active", _this.isRandom);
        };
        // Xử lí khi ấn repeat song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };
        // Xử lí next song khi ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };
        // Lắng nghe khi nhấp vào playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                // Handle when clicking on the song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào song option
                // Handle when clicking on the song option
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrol +
                lIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe/ xử lí các sự kiện
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist
        this.render();
    },
};
app.start();
