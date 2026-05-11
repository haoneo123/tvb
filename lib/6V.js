var rule = {
    title:'6V新版[磁]',
    host:'https://www.xb6v.com',
    // 关键修复：第1页用 /fyclass/ 而不是 /fyclass/index_1.html
    // TVBox会自动处理 fypage=1 的情况
    url: '/fyclass/index_fypage.html[/fyclass/index.html]',
    filter_url:'{{fl.class}}',
    filter:{
        "dianshiju":[{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"国剧","v":"/guoju"},{"n":"日韩剧","v":"/rihanju"},{"n":"欧美剧","v":"/oumeiju"}]}]
    },
    searchUrl: '/e/search/index.php#show=title&tempid=1&tbname=article&mid=1&dopost=search&submit=&keyboard=**;post',
    searchable:2,
    quickSearch:0,
    filterable:1,
    headers:{
        'User-Agent': 'MOBILE_UA'
    },
    timeout:5000,
    class_parse:'#menus&&li:gt(1):lt(49);a&&Text;a&&href;.*/(.*)/',
    cate_exclude:'欧美剧|旧版6v|留言|求片|标签|关于',
    play_parse:true,
    limit:6,
    推荐: '*',
    // 关键修复：恢复原来的CSS选择器，但确保能匹配
    // 影片结构：<li class="post box">...<a href="..."><img src="..."></a>...<h2>标题</h2>...<span class="info_date">日期</span>...</li>
    一级: '#post_container&&li;h2&&Text;img&&src;.info_date&&Text;a&&href',
    二级: {
        "title": "#content&&h1&&Text;.info_category&&Text",
        "img": "#post_content&&img&&src",
        "desc": ";;;#post_content&&p:eq(0)&&Text;#post_content&&p:eq(2)&&Text",
        "content": "#post_content&&p:eq(1)&&Text",
        "tabs": `js:
            TABS = ["道长磁力"];
            let tabs = pdfa(html, '#content&&h3:not(:contains(网盘))');
            tabs.forEach((it) => {
                TABS.push(pdfh(it, "body&&Text").replace('播放地址','道长在线').replace('（无插件 极速播放）','一').replace('（无需安装插件）','二'))
            });
        `,
        "lists": `js:
            log(TABS);
            pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;
            LISTS = [];
            let i = 1;
            TABS.forEach(function(tab) {
                if (/道长磁力/.test(tab)) {
                    var d = pdfa(html, '.context&&td');
                    d = d.map(function(it) {
                        var title = pdfh(it, 'a&&Text');
                        var burl = pd(it, 'a&&href');
                        return title + '$' + burl
                    });
                    LISTS.push(d)
                } else if (/道长在线/.test(tab) && i <= TABS.length-1) {
                    var d = pdfa(html, '.context&&.widget:eq(list_idx)&&a'.replace("list_idx", i));
                    d = d.map(function(it) {
                        var title = pdfh(it, 'a&&Text');
                        var burl = pd(it, 'a&&href');
                        return title + '$' + burl
                    });
                    LISTS.push(d)
                    i = i + 1;
                }
            });
        `,
    },
    搜索: '*',
}
