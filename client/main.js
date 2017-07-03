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
$('body').mouseup(function(e)
{
    var subject = $(".gd_wrap");

    if(e.target.id != subject.attr('id') && !subject.has(e.target).length)
    {
        $('.gd_wrap').removeClass('act');
    }
});

$('body').mouseup(function(e)
{
    var subject = $(".display_filt");

    if(e.target.id != subject.attr('id') && !subject.has(e.target).length)
    {
        $('.display_filt').removeClass('act');
    }
});

$('.datepicker-here_bot').datepicker({
    dateFormat: 'dd-mm-yyyy',
   // minDate: new Date(),
    onSelect: function (formattedDate, date, inst) {
       console.log('IN')     
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
function filter()
{
    $('.gd_wrap').addClass('act');
}
function cbx()
{
    $(this).toggleClass('act');
}
function dp_filter()
{
    $('.display_filt').addClass('act');
}



function init()
{
    $('.prd_all_wrp').click(prd_fl);
    $('.options').click(apnd_cnt);
    $('.tog_arrow').click(high_l);
    $('.resp_filt').click(filter);
    $('.filt_chck').click(cbx);
    $('.resp_disp').click(dp_filter);
}
$(document).ready(init);


