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
        c.width = video.videoWidth || 640;
        c.height = video.videoHeight || 480;
        c.getContext("2d").drawImage(video, 0, 0);
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