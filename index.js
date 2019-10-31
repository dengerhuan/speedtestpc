var map = new AMap.Map('container', {
    mapStyle: 'amap://styles/darkblue',
    resizeEnable: true, //是否监控地图容器尺寸变化
    center: [101.515674, 36.100043],
    zoom: 4,//初始化地图中心点
});
map.setFeatures(['road', 'building', 'bg']); // 多个种类要素显示

var Shape = G2.Shape;

function randomAT(range, minivalue) {
    const offset = Math.random() * range;
    return minivalue + Math.round(offset);
}


Shape.registerShape('point', 'pointer', {
    drawShape: function drawShape(cfg, group) {
        var point = cfg.points[0];
        var center = this.parsePoint({x: 0, y: 0});
        var target = this.parsePoint({x: point.x, y: 0.6});
        var dirBec = {x: center.x - target.x, y: center.y - target.y};
        var length = Math.sqrt(dirBec.x * dirBec.x + dirBec.y * dirBec.y);
        dirBec.x *= 1 / length;
        dirBec.y *= 1 / length;
        var angle1 = -Math.PI / 2;
        var angle2 = Math.PI / 2;
        var xOne = Math.cos(angle1) * dirBec.x - Math.sin(angle1) * dirBec.y;
        var yOne = Math.sin(angle1) * dirBec.x + Math.cos(angle1) * dirBec.y;
        var xTwo = Math.cos(angle2) * dirBec.x - Math.sin(angle2) * dirBec.y;
        var yTwo = Math.sin(angle2) * dirBec.x + Math.cos(angle2) * dirBec.y;
        var l = 4;
        var s = 6;

        var path = [['M', target.x + xOne * l, target.y + yOne * l], ['L', center.x + xOne * s, center.y + yOne * s],
            ['L', center.x + xTwo * s, center.y + yTwo * s], ['L', target.x + xTwo * l, target.y + yTwo * l], ['Z']];


        return group.addShape('path', {
            attrs: {path: path, fill: 'l(90) 0:#ffffff 1:#161929'},
        });

    }
});
var prefix = 'Connecting';

function install(container, max) {

    var chart = new G2.Chart({
        container: container,
        forceFit: true,
        height: 320,
        padding: [20, 0, 30, 0],
        animate: false
    });

    var format = function (val) {
        return Math.ceil(val / 100 * max)
    };
    chart.point().position('value*1').shape('pointer').active(false);


    // 坐标系
    chart.coord('polar', {
        startAngle: Math.PI * -1.2,
        endAngle: Math.PI * 0.2,
    });
    chart.scale('value', {
        min: 0,
        max: 100,
        nice: true,
        tickCount: 6,
    });
    chart.axis('1', false);
    // 刻度值
    chart.axis('value', {
        zIndex: 2,
        line: null,
        label: {
            offset: -32,
            formatter: format,
            textStyle: {
                textAlign: 'center', // 文本对齐方向，可取值为： start middle end
                fill: '#fff', // 文本的颜色
                fontSize:18
            },
        },
        tickLine: null,
        grid: null,
    });
    chart.legend(false);
    chart.render();

    update(chart, 0, max, prefix);
    return chart;
}


function update(chart, value, max, prefix) {

    var color = 'l(0) 0:#01affe 1:#42e6f3';
    var bgColor = '#111421';
    if (!chart) {
        return;
    }


    var guide = chart.guide();

    guide.clear();


    var data = [{
        value: Math.round(value / max * 100)
    }];
    // 绘制仪表盘背景
    guide.arc({
        zIndex: 0,
        top: false,
        start: [0, 0.95],
        end: [100, 0.95],
        style: {
            stroke: bgColor,
            lineWidth: 24,
        },
    });

    // 绘制指标
    guide.arc({
        zIndex: 1,
        start: [0, 0.95],
        end: [data[0].value, 0.95],
        style: {
            stroke: color,
            lineWidth: 24,
        },
    });

    // 绘制指标
    guide.arc({
        zIndex: 1,
        start: [0, 0.7],
        end: [data[0].value, 0.7],
        style: {
            stroke: color,
            lineWidth: 90,
            strokeOpacity: 0.2
        },
    });


    // 绘制数字
    guide.html({
        position: ['50%', '95%'],
        html: '<div class="app_gauge"> <div class="app_gauge_value">' + value + '</div> <div class="app_gauge_title"> <i class="app_gauge_title_prefix"> <svg viewBox="64 64 896 896" fill="currentColor" width="1em" height="1em" data-icon="down" aria-hidden="true"> <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path> </svg> </i>' + prefix + '</div></div>',
    });
    chart.changeData(data);
    //
}


var nrmax = 1600;
var ltemax = 300;
var nr = install(document.querySelector('#nr'), nrmax);
var lte = install(document.querySelector('#lte'), ltemax);


setTimeout(function () {
    prefix = 'Mbps';
    setInterval(function () {
        update(nr, randomAT(100, 850), nrmax, prefix);
        update(lte, randomAT(30, 40), ltemax, prefix);
    }, 600)
}, 2000);




// 加密地址  http://tool.chinaz.com/js.aspx
