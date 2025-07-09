$(function() {
    // Inițializează plugin-ul twenty-twenty
    $(".twentytwenty-container").twentytwenty({
        default_offset_pct: 0.5, // Punctul de start al slider-ului
        orientation: 'horizontal' // Poate fi 'vertical' sau 'horizontal'
    });

    // Creează elementul audio
    var audio = new Audio('audio/muzica.mp3'); // Am corectat calea către fișierul audio
    audio.loop = true; // Setează melodia să se repete

    // Referințe către elementele din HTML
    var playPauseBtn = $('#play-pause-btn');
    var volumeSlider = $('#volume-slider');

    // Funcționalitatea butonului Play/Pause
    playPauseBtn.on('click', function() {
        if (audio.paused) {
            audio.play();
            $(this).removeClass('play-btn').addClass('pause-btn');
        } else {
            audio.pause();
            $(this).removeClass('pause-btn').addClass('play-btn');
        }
    });

    // Funcționalitatea slider-ului de volum
    volumeSlider.on('input', function() {
        audio.volume = $(this).val();
    });
});
