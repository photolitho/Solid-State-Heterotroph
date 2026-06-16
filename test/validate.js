/* Validates the app's inline JS: data integrity, electron configs,
   all detail-panel tabs for all 118 elements, 3D structures, compare,
   map, quiz and calculators. Run: node test/validate.js               */
'use strict';
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const src = html.match(/<script>([\s\S]*)<\/script>/)[1];

const el = () => ({
  addEventListener: () => {}, setAttribute: () => {}, appendChild: () => {},
  classList: { add: () => {}, remove: () => {}, toggle: () => {} },
  style: { setProperty: () => {} }, dataset: {}, innerHTML: '', textContent: '',
  closest: () => null, value: '300', scrollTop: 0, className: '', hidden: true,
  viewBox: { baseVal: { width: 280, height: 250 } }, setPointerCapture: () => {},
  querySelectorAll: () => [], querySelector: () => el(), blur: () => {}
});
const stub = {
  getElementById: el, querySelectorAll: () => [], querySelector: el,
  createElement: el, createDocumentFragment: el, addEventListener: () => {},
  documentElement: { dataset: {} }
};

let failures = 0;
const assert = (cond, msg) => {
  if (!cond) { failures++; console.error('FAIL:', msg); }
};

const hook = `check({ELEMENTS,COMPOUNDS,electronConfig,gridPos,openSheet,
  renderTab,setTab:t=>{curTab=t},STRUCTS,renderXtal3d,renderCompare,renderMap,
  matData,modeColor,genQuiz,niCalc,NI_MAT,searchMatches,egT,IT_NAMES,
  setHeat:p=>{heatProp=p;computeHeatRange()},heatColor,drawDevice,
  setLang:l=>{LANG=l},elName});`;
const body = src.replace(/\/\* ---------- init[\s\S]*$/, hook);

new Function('document', 'window', 'navigator', 'requestAnimationFrame', 'check', body)(
  stub, { addEventListener: () => {} }, {}, () => 0,
  api => {
    const { ELEMENTS, COMPOUNDS, electronConfig, gridPos, openSheet, renderTab,
      setTab, STRUCTS, renderXtal3d, renderCompare, renderMap, matData,
      modeColor, genQuiz, niCalc, NI_MAT, searchMatches, egT, IT_NAMES,
      setHeat, heatColor, drawDevice, setLang, elName } = api;

    assert(ELEMENTS.length === 118, 'expected 118 elements');

    // unique z 1..118, unique grid positions
    const zs = new Set(), pos = new Set();
    for (const e of ELEMENTS) {
      zs.add(e.z);
      const [r, c] = gridPos(e);
      assert(r && c, `bad grid position for ${e.symbol}`);
      const k = r + ',' + c;
      assert(!pos.has(k), `grid collision at ${k} (${e.symbol})`);
      pos.add(k);
      assert(typeof e.deviceApplications === 'string' && e.deviceApplications.length,
        `missing applications for ${e.symbol}`);
    }
    for (let i = 1; i <= 118; i++) assert(zs.has(i), 'missing z=' + i);

    // electron count must equal z for every element
    for (let z = 1; z <= 118; z++) {
      const tot = electronConfig(z).shells.reduce((a, b) => a + b, 0);
      assert(tot === z, `electron count mismatch for z=${z}: ${tot}`);
    }

    // all three detail tabs render for every element
    for (const e of ELEMENTS) {
      openSheet(e);
      for (const t of ['data', 'phys', 'comp']) { setTab(t); renderTab(); }
      modeColor(e);
    }

    // compounds carry full data
    assert(COMPOUNDS.length >= 13, 'expected at least 13 compounds');
    for (const c of COMPOUNDS) {
      assert(Array.isArray(c.els) && c.els.length, `compound ${c.f} missing els`);
      assert(Array.isArray(c.props) && c.props.length === 4, `compound ${c.f} missing props`);
      assert(c.dens != null && c.bg != null, `compound ${c.f} missing dens/bg`);
    }

    // 3D structures render at several angles
    for (const k of Object.keys(STRUCTS))
      for (const a of [0, 0.6, 1.2]) renderXtal3d(el(), k, a, a * 1.3);

    // compare accessor over the full id space
    for (const e of ELEMENTS) matData('e' + e.z);
    COMPOUNDS.forEach((c, i) => matData('c' + i));
    renderCompare(); renderMap();

    // quiz generator: well-formed questions, correct answer present
    for (let i = 0; i < 300; i++) {
      const q = genQuiz();
      assert(q.q && q.opts.length === 4, 'malformed quiz question');
      assert(q.opts.includes(q.correct), 'quiz correct answer missing from options');
    }

    // physics sanity: ni(Si, 300 K) ~ 1e10
    const ni = niCalc(NI_MAT.Si, 300);
    assert(ni > 0.9e10 && ni < 1.1e10, 'ni(Si,300K) calibration off: ' + ni);

    // search
    assert(searchMatches('si').some(e => e.symbol === 'Si'), 'search "si" should find Si');
    assert(searchMatches('49')[0].symbol === 'In', 'search "49" should find In');
    assert(searchMatches('silicio').some(e => e.symbol === 'Si'), 'search IT name should find Si');

    // Varshni Eg(T): Eg(300) must match the room-temperature table values
    assert(Math.abs(egT(NI_MAT.Si, 300) - 1.12) < 0.01, 'Varshni Si Eg(300) off');
    assert(Math.abs(egT(NI_MAT.Ge, 300) - 0.66) < 0.01, 'Varshni Ge Eg(300) off');
    assert(egT(NI_MAT.Si, 400) < egT(NI_MAT.Si, 300), 'Eg should shrink with temperature');

    // Italian names + elName
    assert(IT_NAMES[14] === 'Silicio' && IT_NAMES[49] === 'Indio', 'IT names wrong');
    setLang('it');
    assert(elName(ELEMENTS[13]) === 'Silicio', 'elName(it) should be Silicio');
    setLang('en');
    assert(elName(ELEMENTS[13]) === 'Silicon', 'elName(en) should be Silicon');

    // heatmap: colour for elements with data, null for those without
    setHeat('atomicRadius');
    assert(/^rgb/.test(heatColor(ELEMENTS[13]) || ''), 'heatColor should colour Si');
    assert(heatColor(ELEMENTS[86]) === null, 'heatColor null where no radius (Fr)');
    setHeat('abundance');
    assert(/^rgb/.test(heatColor(ELEMENTS[7]) || ''), 'heatColor should colour O (abundance)');
    setHeat('none');
    assert(heatColor(ELEMENTS[13]) === null, 'heatColor off → null');

    // device cross-sections render without error
    for (const d of ['mos', 'laser', 'hemt']) drawDevice(d);

    // atomic radius / abundance data wired onto elements
    assert(ELEMENTS[13].atomicRadius === 111, 'Si atomic radius should be 111 pm');
    assert(ELEMENTS[7].abundance === 461000, 'O crustal abundance should be 461000 ppm');
  });

if (failures) { console.error(failures + ' assertion(s) failed'); process.exit(1); }
console.log('ALL CHECKS PASSED');
