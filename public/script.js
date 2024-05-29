function downloadVideo() {
    var videoUrl = document.getElementById('videoUrl').value;
    var fileFormat = document.getElementById('fileFormat').value; // Get selected file format

    if (videoUrl.trim() === '') {
        alert('Please paste a valid YouTube video URL');
        return;
    }

    // Redirect to the backend route to start the download
    window.location.href = `/download?videoUrl=${encodeURIComponent(videoUrl)}&format=${fileFormat}`;
}
