$(document).ready(function () {
    $('#carousel-timelapse').on('slid.bs.carousel', function () {
        var index = $('#carousel-timelapse .active').index('#carousel-timelapse .item');
        var perc = Math.round(100* (index / totalImages));
        $('.progress-bar').css('width', perc+'%').attr('aria-valuenow', perc);
    });
});