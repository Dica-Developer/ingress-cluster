import E1 from '../static/enl_reso_01.png';
import E2 from '../static/enl_reso_02.png';
import E3 from '../static/enl_reso_03.png';
import E4 from '../static/enl_reso_04.png';
import E5 from '../static/enl_reso_05.png';
import E6 from '../static/enl_reso_06.png';
import E7 from '../static/enl_reso_06.png';
import E8 from '../static/enl_reso_08.png';

import R1 from '../static/res_reso_01.png';
import R2 from '../static/res_reso_02.png';
import R3 from '../static/res_reso_03.png';
import R4 from '../static/res_reso_04.png';
import R5 from '../static/res_reso_05.png';
import R6 from '../static/res_reso_06.png';
import R7 from '../static/res_reso_06.png';
import R8 from '../static/res_reso_08.png';

import N from '../static/neutral.png';

export const PORTAL_IMG = {
    E1: E1,
    E2: E2,
    E3: E3,
    E4: E4,
    E5: E5,
    E6: E6,
    E7: E7,
    E8: E8,
    R1: R1,
    R2: R2,
    R3: R3,
    R4: R4,
    R5: R5,
    R6: R6,
    R7: R7,
    R8: R8,
    N: N
};

export const PAYLOADS = {
    VIEW_ACTION: Symbol('VIEW_ACTION'),
    BACKEND_ACTION: Symbol('BACKEND_ACTION')
};
export * from './portals.js';
