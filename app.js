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
        document.getElementById("panelTitle").innerText = `${selectedChar} - Yönetim Paneli`;
        
        // Mevcut profil bilgilerini doldur
        let profiles = getProfilesData();
        if(profiles[selectedChar]) {
            document.getElementById("profileImgUrl").value = profiles[selectedChar].img || "";
            document.getElementById("characterBio").value = profiles[selectedChar].bio || "";
        } else {
            document.getElementById("profileImgUrl").value = "";
            document.getElementById("characterBio").value = "";
        }

        uploadModal.style.display = "flex";
        loadMyVideos();
    } else {
        alert("Hatalı Şifre!");
    }
};

// Profilleri Saklama
function getProfilesData() {
    const data = localStorage.getItem("claws_profiles");
    return data ? JSON.parse(data) : {};
}

function saveProfilesData(data) {
    localStorage.setItem("claws_profiles", JSON.stringify(data));
}

document.getElementById("saveProfileBtn").onclick = () => {
    const img = document.getElementById("profileImgUrl").value;
    const bio = document.getElementById("characterBio").value;

    let profiles = getProfilesData();
    profiles[currentLoggedInUser] = { img, bio };
    saveProfilesData(profiles);

    renderChannels();
    alert("Karakter profili güncellendi!");
};

// Videoları Saklama
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
    alert("Anı/Video başarıyla eklendi!");
};

function loadMyVideos() {
    const listDiv = document.getElementById("myVideosList");
    listDiv.innerHTML = "";
    let allVideos = getVideosData();
    let userVids = allVideos[currentLoggedInUser] || [];

    if (userVids.length === 0) {
        listDiv.innerHTML = "<p style='color:#8892b0;'>Henüz anı eklenmemiş.</p>";
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
    let profiles = getProfilesData();

    characters.forEach(char => {
        let profile = profiles[char] || { img: "https://via.placeholder.com/70", bio: "Henüz bir hikaye yazılmadı..." };
        let avatarImg = profile.img ? profile.img : "https://via.placeholder.com/70";
        let bioText = profile.bio ? profile.bio : "Hikaye eklenmedi.";

        let vids = allVideos[char] || [];
        let vidsHtml = vids.length === 0 ? "<p style='color:#64748b; font-size:0.9rem;'>Bu karakterin henüz anısı yok.</p>" : "";

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
                <div class="character-header">
                    <img src="${avatarImg}" alt="${char}" class="character-avatar">
                    <div class="character-info">
                        <h3>${char}</h3>
                        <p class="character-bio">${bioText}</p>
                    </div>
                </div>
                <div class="channel-videos">
                    ${vidsHtml}
                </div>
            </div>
        `;
    });
}
