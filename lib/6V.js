var rule = {
    title:'6V新版[磁]',
    host:'https://www.xb6v.com',
    url: '/fyclassfyfilter/index_fypage.html[/fyclassfyfilter/index.html]',
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
    class_parse:'#menus&&li:gt(1):lt(20);a&&Text;a&&href;.*/(.*)/',
    cate_exclude:'欧美剧|旧版6v|留言|求片|标签|关于',
    play_parse:true,
    limit:6,
    推荐: '*',
    // 核心修复：用JS自定义解析，遍历所有<a>，过滤出包含66tutup图片的影片
    一级: `js:
        pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;
        var d = [];
        // 遍历页面所有<a>标签
        var arr = pdfa(html, 'a');
        arr.forEach(function(it) {
            var img = pdfh(it, 'img&&src');
            // 只保留包含66tutup图片的<a>（即影片卡片）
            if (img && img.indexOf('66tutup') > -1) {
                var title = pdfh(it, 'h2&&Text');
                // 如果h2没有，尝试img的alt属性
                if (!title) title = pdfh(it, 'img&&alt');
                var url = pd(it, 'a&&href');
                if (title && url && url.indexOf('.html') > -1) {
                    d.push({
                        title: title,
                        pic_url: img,
                        desc: '',
                        url: url
                    });
                }
            }
        });
        setResult(d);
    `,
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
