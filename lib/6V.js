var rule = {
    title: '新版6v电影',
    host: 'http://www.xb6v.com', //
    url: '/fyclass/index_fypage.html[/fyclass/index.html]',
    
    // 导航分类解析
    class_parse: '#menus&&li:gt(1);a&&Text;a&&href;.*/(.*)/', //
    cate_exclude: '欧美剧|旧版6v', // 排除冗余项

    // 搜索逻辑：该站使用 POST 请求
    searchUrl: '/e/search/index.php#show=title&tempid=1&tbname=article&mid=1&dopost=search&submit=&keyboard=**;post',
    
    // 一级界面解析：匹配文章列表块
    一级: '#post_container&&li;h2&&Text;img&&src;.info_date&&Text;a&&href', //
    
    // 二级详情页解析
    二级: {
        "title": "#content&&h1&&Text",
        "img": "#post_content&&img&&src",
        "desc": ";;;#post_content&&p:eq(0)&&Text",
        "content": "#post_content&&p:eq(1)&&Text",
        "tabs": "js:TABS=['磁力地址','网盘地址']",
        "lists": `js:
            LISTS = [];
            // 磁力链接提取逻辑
            let d = pdfa(html, '.context&&td a');
            let links = d.map(it => pdfh(it, 'a&&Text') + '$' + pd(it, 'a&&href'));
            LISTS.push(links);
        `
    }
};
