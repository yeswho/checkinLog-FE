import BikramSambat from 'bikram-sambat-js';

export function convertBsToAd(bsDate) {
    const bs = new BikramSambat(bsDate, 'BS');
    return bs.toAD();
}
