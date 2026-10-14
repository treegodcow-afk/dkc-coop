// Build a Donkey Kong Country ROM where a Kong is drawn as a Mortal Kombat 3 fighter.
// Both ROMs come from the player; the recipe below holds only addresses and frame numbers.
import { buildFrame, compose } from "./mk3frames.js";
import { hiromOffset, parseFrame, paintFrame, replacePalette } from "./dkcskin.js";

export const RECIPE = {
  mk3: {
    subzero: {
      tileTable: 0xFFCDA5, aux62: 0xFFF7C0, aux66: 0xFFF7CF, palette: 0x3FB07F,   // palette = file offset
      art: {
        idle: [0xE7AE95, 0xEA4DF5],
        walk: [0xE7B137, 0xE7B1A5, 0xE7B212, 0xE7B277, 0xE7B2D8],
        jump: [0xEA5833],
        roll: [0xEA5019, 0xEA504C, 0xEA5086, 0xEA594D],
        crouch: [0xEA4E59],
      },
    },
  },
  dkc: {
    frameTable: 0x3BCC9C,                       // file offset; 4 bytes per frame id (addr16, bank, y)
    kongs: {
      dk:    { ids: [[0x08C, 0x93C]], palettes: [0x39BDA3, 0x39E245, 0x3C834E, 0x3C8498], known: {} },
      diddy: { ids: [[0x954, 0x118C], [0x11A0, 0x11B0]], palettes: [0x39B783, 0x39B903, 0x39BA83, 0x39BC63, 0x3C843E], known: {} },
    },
  },
};

const framesIn = (ranges) => { const out = []; for (const [lo, hi] of ranges) for (let id = lo; id <= hi; id += 4) out.push(id); return out; };

// known: { frameId: category } from recorded play; other frames take the category of the nearest known id.
function categorise(ids, known) {
  const kids = Object.keys(known).map(Number).sort((a, b) => a - b);
  return ids.map(id => {
    if (!kids.length) return "idle";
    let best = kids[0]; for (const k of kids) if (Math.abs(k - id) < Math.abs(best - id)) best = k;
    return known[best];
  });
}

export function applyFighter(dkcRom, mk3Rom, kongName, fighterName, recipe = RECIPE) {
  const f = recipe.mk3[fighterName], kong = recipe.dkc.kongs[kongName];
  const art = {};
  for (const [cat, list] of Object.entries(f.art)) art[cat] = list.map(a => compose(buildFrame(mk3Rom, f, a)));
  const ids = framesIn(kong.ids), cats = categorise(ids, kong.known);
  const counters = {}; let painted = 0;
  ids.forEach((id, i) => {
    const o = recipe.dkc.frameTable + id, bank = dkcRom[o + 2];
    if (bank < 0xC0) return;
    const h = hiromOffset((bank << 16) | dkcRom[o] | (dkcRom[o + 1] << 8));
    if (h < 0 || h + 8 >= dkcRom.length || dkcRom[h] > 16) return;
    const list = art[cats[i]] || art.idle;
    const n = counters[cats[i]] = (counters[cats[i]] || 0) + 1;
    paintFrame(dkcRom, parseFrame(dkcRom, h), list[n % list.length]);
    painted++;
  });
  const colours = []; for (let k = 0; k < 16; k++) colours.push(mk3Rom[f.palette + k * 2] | (mk3Rom[f.palette + k * 2 + 1] << 8));
  replacePalette(dkcRom, kong.palettes, colours);
  return painted;
}
