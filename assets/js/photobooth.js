function initPhotobooth() {
    const video = document.getElementById("video");
    const countdownEl = document.getElementById("countdown");
    const startBtn = document.getElementById("startPhotobooth");
    const download = document.getElementById("downloadPhotobooth");

    const photoCanvases = [];

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
            countdownEl.textContent = i;

            const interval = setInterval(() => {
                i--;
                countdownEl.textContent = i;
                if (i === 0) {
                    clearInterval(interval);
                    countdownEl.textContent = "";
                    resolve();
                }
            }, 1000);
        });
    }

function takePhoto() {
    const c = document.createElement("canvas");
    const size = 640; // quadratisch
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
        photoCanvases.length = 0;

        for (let i = 0; i < 3; i++) {
            await countdown(3);
            takePhoto();
        }

        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = photoCanvases[0].width;
        finalCanvas.height = photoCanvases[0].height * 3;
        const ctx = finalCanvas.getContext("2d");

        photoCanvases.forEach((c, i) => {
            ctx.drawImage(c, 0, i * c.height);
        });
        
        download.href = finalCanvas.toDataURL("image/png");
    };
}