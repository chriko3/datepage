function initPhotobooth() {
    const video = document.getElementById("video");
    const countdownEl = document.getElementById("countdown");
    const startBtn = document.getElementById("startPhotobooth");
    const download = document.getElementById("downloadPhotobooth");

    const photoCanvases = [];
    let isTakingPhotos = false;

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            countdownEl.textContent = "Kamera nicht verfügbar ❌";
            console.error(err);
        });

    function countdown(seconds) {
        return new Promise(resolve => {
            let i = seconds;

            const interval = setInterval(() => {
                if (i > 0) {
                    countdownEl.textContent = i;
                    i--;
                } else {
                    clearInterval(interval);
                    countdownEl.textContent = "📸";
                    setTimeout(() => {
                        countdownEl.textContent = "";
                        resolve();
                    }, 350);
                }
            }, 1000);
        });
    }

    function takePhoto() {
        const c = document.createElement("canvas");
        const size = 640;
        c.width = size;
        c.height = size;
        const ctx = c.getContext("2d");

        const videoAspect = video.videoWidth / video.videoHeight;
        if (videoAspect > 1) {
            const cropWidth = video.videoHeight;
            const cropX = (video.videoWidth - cropWidth) / 2;
            ctx.drawImage(video, cropX, 0, cropWidth, video.videoHeight, 0, 0, size, size);
        } else {
            const cropHeight = video.videoWidth;
            const cropY = (video.videoHeight - cropHeight) / 2;
            ctx.drawImage(video, 0, cropY, video.videoWidth, cropHeight, 0, 0, size, size);
        }

        photoCanvases.push(c);
    }

    startBtn.onclick = async () => {
        if (isTakingPhotos) return;
        isTakingPhotos = true;

        photoCanvases.length = 0;

        for (let i = 0; i < 3; i++) {
            await countdown(3);
            takePhoto();
        }

        const photoSize = photoCanvases[0].width;
        const padding = 20;
        const bottomSpace = 50;
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = photoSize + padding * 2;
        finalCanvas.height = photoSize * 3 + padding * 4 + bottomSpace;
        const ctx = finalCanvas.getContext("2d");

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

        photoCanvases.forEach((c, i) => {
            const x = padding;
            const y = padding + i * (photoSize + padding);
            ctx.drawImage(c, x, y, photoSize, photoSize);
        });

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const dateTimeStr = `♥ ${day}.${month}.${year} ${hours}:${minutes} ♥`;

        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(dateTimeStr, finalCanvas.width / 2, finalCanvas.height - 15);

        download.href = finalCanvas.toDataURL("image/png");

        isTakingPhotos = false;
    };
}