var rule = {
    title: '6V新版[磁]',
    host: 'https://www.xb6v.com',
    
    // 🔧 核心修复：分类页翻页逻辑（第1页用 /fyclass/，第2页+用 /fyclass/index_2.html）
    url: '/fyclass/index_fypage.html[/fyclass/]',
    
    // 🔧 硬编码分类（绕过 class_parse 解析失败问题）
    class_name: '喜剧片&动作片&爱情片&科幻片&恐怖片&剧情片&动画片&纪录片&战争片&电视剧&综艺&动漫',
    class_url: 'xijupian&dongzuopian&aiqingpian&kehuanpian&kongbupian&juqingpian&donghuapian&jilupian&zhanzhengpian&dianshiju&ZongYi&donghuapian',
    
    filter_url: '{{fl.class}}',
    filter: {
        "dianshiju": [{
            "key": "class",
            "name": "类型",
            "value": [
                {"n": "全部", "v": ""},
                {"n": "国剧", "v": "/guoju"},
                {"n": "日韩剧", "v": "/rihanju"},
                {"n": "欧美剧", "v": "/oumeiju"}
            ]
        }]
    },
    
    searchUrl: '/e/search/index.php#show=title&tempid=1&tbname=article&mid=1&dopost=search&submit=&keyboard=**;post',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    headers: { 'User-Agent': 'MOBILE_UA' },
    timeout: 5000,
    
    // 🔧 禁用 class_parse（已用硬编码替代）
    class_parse: '',
    cate_exclude: '',
    
    play_parse: true,
    limit: 18,
    推荐: '*',  // ✅ 首页推荐已验证可用
    
    // 🔧 一级规则（与首页推荐完全一致，确保解析成功）
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
                TABS.push(pdfh(it, "body&&Text")
                    .replace('播放地址','道长在线')
                    .replace('（无插件 极速播放）','一')
                    .replace('（无需安装插件）','二'));
            });
        `,
        "lists": `js:
            log(TABS);
            pdfh=jsp.pdfh; pdfa=jsp.pdfa; pd=jsp.pd;
            LISTS = [];
            let i = 1;
            TABS.forEach(function(tab) {
                if (/道长磁力/.test(tab)) {
                    var d = pdfa(html, '.context&&td');
                    d = d.map(function(it) {
                        var title = pdfh(it, 'a&&Text');
                        var burl = pd(it, 'a&&href');
                        return title + '$' + burl;
                    });
                    LISTS.push(d);
                } else if (/道长在线/.test(tab) && i <= TABS.length-1) {
                    var d = pdfa(html, '.context&&.widget:eq(list_idx)&&a'.replace("list_idx", i));
                    d = d.map(function(it) {
                        var title = pdfh(it, 'a&&Text');
                        var burl = pd(it, 'a&&href');
                        return title + '$' + burl;
                    });
                    LISTS.push(d);
                    i = i + 1;
                }
            });
        `
    },
    搜索: '*',
}
