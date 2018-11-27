import "./event.scss";
import "../../var/copyedText";
$(function () {

    $('[data-type="part-nav"] li').click(function () {
        console.log('clicked');
        if ($(this).hasClass('active')) {
            return;
        }
        let $active = $('[data-type="part-nav"] li.active');
        $active.removeClass('active');
        let oldActivePartName = $active.attr('data-part');
        $(this).addClass('active');
        let partName = $(this).attr('data-part');
        $(`[data-type="part-part"][data-part="${oldActivePartName}"]`).slideUp();
        $(`[data-type="part-part"][data-part="${partName}"]`).slideDown();
    });
});
