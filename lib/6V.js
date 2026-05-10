var rule = {
    title:'6V新版[磁]',
    host:'https://www.xb6v.com',
    // 完全恢复原版URL模板
    url: '/fyclassfyfilter/index_fypage.html[/fyclassfyfilter/index.html]',
    filter_url:'{{fl.class}}',
    filter:{
        "dianshiju":[{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"国剧","v":"/guoju"},{"n":"短剧","v":"/duanju"},{"n":"日韩剧","v":"/rihanju"},{"n":"欧美剧","v":"/oumeiju"}]}]
    },
    searchUrl: '/e/search/index.php#show=title&tempid=1&tbname=article&mid=1&dopost=search&submit=&keyboard=**;post',
    searchable:2,
    quickSearch:0,
    filterable:1,
    headers:{
        'User-Agent': 'MOBILE_UA'
    },
    timeout:5000,
    // 关键修复：用 >li 只选直接子li，排除子菜单里的国剧/短剧等
    class_parse:'#menus&&>li:gt(1):lt(20);a&&Text;a&&href;.*/(.*)/',
    cate_exclude:'欧美剧|旧版6v|留言|求片|标签|关于|最新50部',
    play_parse:true,
    limit:6,
    推荐: '*',
    // 核心修复：JS自定义一级，处理第1页URL问题
    一级: `js:
        pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;
        var d = [];

        // 先尝试解析当前页面
        var arr = pdfa(html, '#post_container&&li');

        // 如果当前页面没有数据（可能是404），重新请求正确URL
        if (arr.length === 0) {
            var page = 1;
            var cateId = '';

            // 从input(URL)提取分类ID和页码
            if (typeof input !== 'undefined' && input) {
                var m = input.match(/xb6v\.com\/([a-z]+(?:\/[a-z]+)*)\/index_(\d+)\.html/);
                if (m) {
                    cateId = m[1];
                    page = parseInt(m[2]);
                } else {
                    var m2 = input.match(/xb6v\.com\/([a-z]+(?:\/[a-z]+)*)\/?$/);
                    if (m2) cateId = m2[1];
                }
            }

            // 重新请求正确的分类URL
            if (cateId && typeof request === 'function') {
                var retryUrl = HOST + '/' + cateId + '/';
                if (page > 1) {
                    retryUrl = HOST + '/' + cateId + '/index_' + page + '.html';
                }
                try {
                    var newHtml = request(retryUrl);
                    arr = pdfa(newHtml, '#post_container&&li');
                } catch(e) {}
            }
        }

        arr.forEach(function(it) {
            var title = pdfh(it, 'h2&&Text');
            var pic = pdfh(it, 'img&&src');
            var desc = pdfh(it, '.info_date&&Text');
            var url = pd(it, 'a&&href');
            if (title && url) {
                d.push({
                    title: title,
                    pic_url: pic,
                    desc: desc,
                    url: url
                });
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
