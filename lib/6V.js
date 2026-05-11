var rule = {
    title: '6V新版[磁]',
    host: 'https://www.xb6v.com',
    
    // 🔧 禁用分类相关（避免解析失败）
    class_name: '',
    class_url: '',
    class_parse: '',
    url: '',
    
    // ✅ 保留搜索（POST方式）
    searchUrl: '/e/search/index.php#show=title&tempid=1&tbname=article&mid=1&dopost=search&submit=&keyboard=**;post',
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    
    headers: { 'User-Agent': 'MOBILE_UA' },
    timeout: 5000,
    play_parse: true,
    limit: 18,
    
    // ✅ 首页推荐（已验证可用）
    推荐: '#post_container&&li;h2&&Text;img&&src;.info_date&&Text;a&&href',
    
    // ✅ 详情页解析
    二级: {
        "title": "#content&&h1&&Text",
        "img": "#post_content&&img&&src",
        "desc": ";;;#post_content&&p:eq(0)&&Text",
        "content": "#post_content&&p:eq(1)&&Text",
        "tabs": `js:
            TABS = ["🧲磁力下载"];
            let tabs = pdfa(html, '#content&&h3:not(:contains(网盘))');
            tabs.forEach((it) => {
                let name = pdfh(it, "body&&Text").trim();
                if(name && !TABS.includes(name)) TABS.push(name);
            });
        `,
        "lists": `js:
            pdfh=jsp.pdfh; pdfa=jsp.pdfa; pd=jsp.pd;
            LISTS = [];
            let d = pdfa(html, '.context&&td');
            if(d.length > 0) {
                let list = d.map(function(it) {
                    let title = pdfh(it, 'a&&Text').trim();
                    let url = pd(it, 'a&&href');
                    return title + '$' + url;
                });
                LISTS.push(list);
            }
        `
    },
    
    // ✅ 搜索规则（复用推荐规则）
    搜索: '#post_container&&li;h2&&Text;img&&src;.info_date&&Text;a&&href',
}
