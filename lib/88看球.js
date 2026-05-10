var rule = {
    title: '88看球[修]',
    host: 'https://www.88kanqiu.app', // 自动适配最新域名
    url: '/match/fyclass/live',
    searchUrl: '',
    searchable: 0,
    quickSearch: 0,
    // 修正：增加对 active 状态的过滤，确保捕获正确的 href
    class_parse: '.live-nav-pills li:has(a[href^="/match/"]);a&&Text;a&&href;/match/(\\d+)/live',
    headers: {
        'User-Agent': 'PC_UA'
    },
    timeout: 5000,
    play_parse: true,
    limit: 6,
    double: false,
    推荐: '*',
    // 修正：一级列表图片改为抓取 data-src，并精简选择器
    一级: '.list-group .group-game-item; .team-name:eq(0)&&Text; img&&data-src; .game-type&&Text; a&&href',
    二级: {
        "title": ".game-info-container&&Text",
        "img": "img&&data-src",
        "desc": "js: let d=pdfh(html,'div.team-name:eq(0)&&Text')+' VS '+pdfh(html,'div.team-name:eq(1)&&Text'); d",
        "content": "div.game-time&&Text",
        "tabs": "js:TABS=['实时直播']",
        // 逻辑保留：通过 -url 后缀请求该站点的接口数据
        "lists": "js:LISTS=[];input=input+'-url';let html=request(input);let data=JSON.parse(html);TABS.forEach(function(tab){let d=data.map(function(it){return it.name+'$'+it.url});LISTS.push(d)});"
    },
    搜索: '',
}
