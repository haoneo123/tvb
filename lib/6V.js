var rule = {
    title:'6V新版[磁]',
    host:'https://www.xb6v.com',
    // 修复：第1页直接用 /fyclass/，不带 index.html
    url: '/fyclass/index_fypage.html[/fyclass/]',
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
    // 修复：扩大范围到lt(49)，确保能获取所有分类
    class_parse:'#menus&&li:gt(1):lt(49);a&&Text;a&&href;.*/(.*)/',
    // 修复：添加更多需要排除的项，避免干扰
    cate_exclude:'欧美剧|日韩剧|国剧|短剧|旧版6v|留言|求片|标签|关于|最新50部',
    play_parse:true,
    limit:6,
    推荐: '*',
    // 修复：确保选择器能正确匹配分类页结构
    // 分类页中 li 的 class 是 "post box row fixed-hight"，首页也是
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
