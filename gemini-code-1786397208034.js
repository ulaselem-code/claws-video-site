const characterPasswords = {
    "Boris Claws": "1234",
    "Luna Claws": "1234",
    "Mark Claws": "1234",
    "Geralt Claws": "1234",
    "Beric Max": "1234",
    "Nolan Claws": "1234",
    "7. Karakter": "1234"
};

const characters = [
    "Boris Claws", "Luna Claws", "Mark Claws", 
    "Geralt Claws", "Beric Max", "Nolan Claws", "7. Karakter"
];

let currentLoggedInUser = null;

document.addEventListener("DOMContentLoaded", () => {
    renderChannels();
});

const authModal = document.getElementById("authModal");
const uploadModal = document.getElementById("uploadModal");
document.getElementById("openModalBtn").onclick = () => authModal.style.display = "flex";
document.querySelector(".close").onclick = () => authModal.style.display = "none";
document.querySelector(".close-upload").onclick = () => uploadModal.style.display = "none";

document.getElementById("loginForm").onsubmit = (e) => {
    e.preventDefault();
    const selectedChar = document.getElementById("characterSelect").value;
    const passwordInput = document.getElementById("characterPassword").value;

    if (characterPasswords[selectedChar] === passwordInput) {
        currentLoggedInUser = selectedChar;
        authModal.style.display = "none";
        document.getElementById("panelTitle").innerText = `${selectedChar} - Kanal Paneli`;
        uploadModal.style.display = "flex";
        loadMyVideos();
    } else {
        alert("Hatalı Şifre!");
    }
};

function getVideosData() {
    const data = localStorage.getItem("claws_videos");
    return data ? JSON.parse(data) : {};
}

function saveVideosData(data) {
    localStorage.setItem("claws_videos", JSON.stringify(data));
}

document.getElementById("uploadBtn").onclick = () => {
    const title = document.getElementById("videoTitle").value;
    const url = document.getElementById("videoUrl").value;

    if (!title || !url) {
        alert("Lütfen başlık ve video linkini doldurun!");
        return;
    }

    let allVideos = getVideosData();
    if (!allVideos[currentLoggedInUser]) {
        allVideos[currentLoggedInUser] = [];
    }

    allVideos[currentLoggedInUser].push({ title, url });
    saveVideosData(allVideos);

    document.getElementById("videoTitle").value = "";
    document.getElementById("videoUrl").value = "";
    
    loadMyVideos();
    renderChannels();
    alert("Video başarıyla eklendi!");
};

function loadMyVideos() {
    const listDiv = document.getElementById("myVideosList");
    listDiv.innerHTML = "";
    let allVideos = getVideosData();
    let userVids = allVideos[currentLoggedInUser] || [];

    if (userVids.length === 0) {
        listDiv.innerHTML = "<p style='color:#8892b0;'>Henüz video yüklenmemiş.</p>";
        return;
    }

    userVids.forEach((vid, index) => {
        listDiv.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span>${vid.title}</span>
                <button onclick="deleteVideo('${currentLoggedInUser}', ${index})" style="background:red; color:white; border:none; padding:3px 8px; cursor:pointer; border-radius:3px;">Sil</button>
            </div>
        `;
    });
}

function deleteVideo(user, index) {
    let allVideos = getVideosData();
    allVideos[user].splice(index, 1);
    saveVideosData(allVideos);
    loadMyVideos();
    renderChannels();
}

function renderChannels() {
    const grid = document.getElementById("channelsGrid");
    grid.innerHTML = "";
    let allVideos = getVideosData();

    characters.forEach(char => {
        let vids = allVideos[char] || [];
        let vidsHtml = vids.length === 0 ? "<p style='color:#64748b; font-size:0.9rem;'>Bu kanalda henüz video yok.</p>" : "";

        vids.forEach(v => {
            vidsHtml += `
                <div class="video-item">
                    <video controls src="${v.url}"></video>
                    <p><strong>${v.title}</strong></p>
                </div>
            `;
        });

        grid.innerHTML += `
            <div class="channel-card">
                <h3>📺 ${char} Kanalı</h3>
                <div class="channel-videos">
                    ${vidsHtml}
                </div>
            </div>
        `;
    });
}