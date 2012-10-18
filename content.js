var pageNum = 1;
var baseUrl = location.origin + location.pathname + '?';
var param = location.search.substring(1, location.search.length);
if( param.length > 0 ){
    var param_array = param.split('&');
    for( n in param_array ){
        if( param_array[n].match(/^([^=]+)=(.*)$/) ){
            if( RegExp.$1 == 'page' ){
                pageNum = RegExp.$2;
            }
            else{
                baseUrl += RegExp.$1 + '=' + RegExp.$2 + '&';
            }
        }
    }
}

$(window).bind('scroll', function(){
    scrollHeight = $(document).height();
    scrollPosition = $(window).height() + $(window).scrollTop();
    if( (scrollHeight - scrollPosition) / scrollHeight <= 0.05 ){
        $(window).trigger('reach_bottom');
    }
});

$(document).ready(function() {
    $(window).bind('reach_bottom', function(){
        if( !$(window).data('loading') ){
            $(window).data('loading', true);
            if( location.host == 'danbooru.donmai.us' ){
                danbooru();
            }
            else if( location.host == 'yande.re' ){
                yandere();
            }
        }
    });
    if( $(document).height() <= $(window).height() ){
        $(window).trigger('reach_bottom');
    }
});

function danbooru(){
    $('div').each( function(){
        if( $(this).attr('class') == 'content' ){
            $(this).find('div').each( function(){
                if( !$(this).attr('style') 
                    && !$(this).attr('id') 
                    && !$(this).attr('class') ){
                    appendBaseUrl = $(this);
                    return false;
                }
            });
        }
    });
    imgURL = chrome.extension.getURL('loading.gif');
    appendBaseUrl.append('<span class="thumb __eximg"><img src="' + imgURL + '" height="32" width="32" /></span>');

    $.ajax({
        url: baseUrl + "page=" + (++pageNum),
        cache: false,
        success: function(data){
            appendBaseUrl.find('span').each( function(){
                if( $(this).attr('class') == 'thumb __eximg' ){
                    $(this).remove();
                    return false;
                }
            });

            $(data).find('span').each( function(){
                if( $(this).attr('class') == 'thumb blacklisted' ){
                    this.className = 'thumb';
                    appendBaseUrl.append(this);
                }
                else if( $(this).attr('class') == 'thumb' ){
                    appendBaseUrl.append(this);
                }
            });
            $(window).data('loading', false);
        }
    });
}

function yandere(){
    $('ul').each( function(){
        if( $(this).attr('id') == 'post-list-posts' ){
            appendBaseUrl = $(this);
            return false;
        }
    });
    imgURL = chrome.extension.getURL('loading.gif');
    appendBaseUrl.append('<li class="__eximg"><img src="' + imgURL + '" height="32" width="32" /></li>');

    $.ajax({
        url: baseUrl + "page=" + (++pageNum),
        cache: false,
        success: function(data){
            appendBaseUrl.find('li').each( function(){
                if( $(this).attr('class') == '__eximg' ){
                    $(this).remove();
                    return false;
                }
            });
            $(data).find('ul').each( function(){
                if( $(this).attr('id') == 'post-list-posts' ){
                    $(this).children().each( function(){
                        this.className = this.className.substring(16, this.className.length);
                        appendBaseUrl.append(this);
                    });
                }
            });
            $(window).data('loading', false);
        }
    });
}

