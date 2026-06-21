// assets/charts.js — 雷达图与 Mermaid 初始化
(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  // ===== Mermaid 初始化 =====
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: bg2,
        primaryTextColor: ink,
        primaryBorderColor: accent,
        lineColor: muted,
        secondaryColor: 'rgba(122,154,110,0.10)',
        tertiaryColor: bg2,
        fontFamily: 'InstrumentSans, sans-serif',
        fontSize: '14px'
      },
      flowchart: { curve: 'basis', padding: 16 },
      securityLevel: 'loose'
    });
  }

  // ===== 雷达图：五大方案多维度对比 =====
  var radarEl = document.getElementById('chart-radar');
  if (radarEl && window.echarts) {
    var chart = echarts.init(radarEl, null, { renderer: 'svg' });

    var indicators = [
      { name: '多端一致性', max: 5 },
      { name: '首屏性能', max: 5 },
      { name: '换装灵活度', max: 5 },
      { name: '卡通风格契合', max: 5 },
      { name: '开发容易度', max: 5 },
      { name: '体积友好度', max: 5 }
    ];

    chart.setOption({
      animation: false,
      color: [accent2, accent, '#c2925a', '#5a7d9e', '#9e5a7d'],
      legend: {
        data: ['PNG 叠加', 'Canvas 2D', 'SVG 分层', 'Spine', 'Three.js(3D)'],
        top: 0,
        left: 'center',
        itemGap: 18,
        itemWidth: 14,
        itemHeight: 10,
        textStyle: { color: muted, fontSize: 12, fontFamily: 'InstrumentSans, sans-serif' }
      },
      radar: {
        indicator: indicators,
        center: ['50%', '58%'],
        radius: '62%',
        shape: 'polygon',
        splitNumber: 5,
        axisName: {
          color: ink,
          fontSize: 13,
          fontFamily: 'InstrumentSans, sans-serif',
          fontWeight: 600,
          padding: [4, 6]
        },
        splitLine: { lineStyle: { color: rule, width: 1 } },
        splitArea: {
          areaStyle: {
            color: ['rgba(122,154,110,0.02)', 'rgba(122,154,110,0.05)', 'rgba(122,154,110,0.02)', 'rgba(122,154,110,0.05)', 'rgba(122,154,110,0.02)']
          }
        },
        axisLine: { lineStyle: { color: rule } }
      },
      series: [{
        type: 'radar',
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.12 },
        emphasis: { areaStyle: { opacity: 0.25 } },
        data: [
          {
            value: [5, 5, 3, 5, 5, 2],
            name: 'PNG 叠加'
          },
          {
            value: [4, 3, 4, 4, 2, 5],
            name: 'Canvas 2D'
          },
          {
            value: [2, 4, 4, 5, 3, 4],
            name: 'SVG 分层'
          },
          {
            value: [3, 3, 5, 4, 2, 4],
            name: 'Spine'
          },
          {
            value: [1, 1, 5, 3, 1, 1],
            name: 'Three.js(3D)'
          }
        ]
      }],
      tooltip: {
        appendToBody: true,
        backgroundColor: ink,
        borderColor: ink,
        textStyle: { color: '#f4efe6', fontSize: 12, fontFamily: 'InstrumentSans, sans-serif' },
        formatter: function (params) {
          var html = '<strong style="color:' + accent + '">' + params.name + '</strong><br/>';
          var dims = ['多端一致性', '首屏性能', '换装灵活度', '卡通风格契合', '开发容易度', '体积友好度'];
          params.value.forEach(function (v, i) {
            html += dims[i] + '：' + v + ' / 5<br/>';
          });
          return html;
        }
      }
    });

    window.addEventListener('resize', function () { chart.resize(); });
  }
})();
