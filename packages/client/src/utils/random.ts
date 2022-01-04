import seedrandom from 'seedrandom'
import { range } from 'lodash'

// Standard Normal variate using Box-Muller transform.
export function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

export const genDataPoints = (seed = '0') => {
    const rnd = seedrandom(seed);
    const count = 100 * rnd();
    const mean = rnd() * 5;
    const std = rnd() * 3;
    return range(count).map(() => randn_bm() * std + mean)
}