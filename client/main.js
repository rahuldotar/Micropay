/**
 * Created by hp on 22-06-2017.
 */



$('body').mouseup(function(e)
{
    var subject = $(".prd_optns");

    if(e.target.id != subject.attr('id') && !subject.has(e.target).length)
    {
        //alert("sdsda");
        //$('.reg_pop_wrap').removeClass('act');
        $('.prd_all_wrp').removeClass('opt_wrp');
    }
});

$('.datepicker-here_bot').datepicker({
    dateFormat: 'dd-mm-yyyy',
    minDate: new Date(),
    onSelect: function (formattedDate, date, inst) {

    }
});



function prd_fl()
{
    $(this).toggleClass('opt_wrp');
}
function apnd_cnt()
{
    //$('.prd_st').html($(this).html());
    $(this).closest('.prd_all_wrp').find('.prd_st').html($(this).html());
}
function high_l()
{
    $(this).toggleClass('tog');
}



function init()
{
    $('.prd_all_wrp').click(prd_fl);
    $('.options').click(apnd_cnt);
    $('.tog_arrow').click(high_l);
}
$(document).ready(init);


