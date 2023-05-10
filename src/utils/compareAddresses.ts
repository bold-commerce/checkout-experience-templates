import {IAddress} from '@boldcommerce/checkout-frontend-library';

type OptionalPartial<T> = undefined | null | Partial<T>;

const abbreviations = new Map<string, string>([
    ['allee', 'alley'],
    ['ally', 'alley'],
    ['aly', 'alley'],
    ['annex', 'anex'],
    ['annx', 'anex'],
    ['anx', 'anex'],
    ['apt', 'appartment'],
    ['appt', 'appartment'],
    ['arc', 'arcade'],
    ['av', 'avenue'],
    ['ave', 'avenue'],
    ['aven', 'avenue'],
    ['avenu', 'avenue'],
    ['avn', 'avenue'],
    ['avnue', 'avenue'],
    ['bayoo', 'bayou'],
    ['bch', 'beach'],
    ['bnd', 'bend'],
    ['blf', 'bluff'],
    ['bluf', 'bluff'],
    ['bluffs', 'bluff'],
    ['blfs', 'bluff'],
    ['bot', 'bottom'],
    ['btm', 'bottom'],
    ['bottm', 'bottom'],
    ['blvd', 'boulevard'],
    ['boul', 'boulevard'],
    ['boulv', 'boulevard'],
    ['br', 'branch'],
    ['brnch', 'branch'],
    ['brdge', 'bridge'],
    ['brg', 'bridge'],
    ['brk', 'brook'],
    ['brooks', 'brook'],
    ['brks', 'brook'],
    ['burg', 'brook'],
    ['bg', 'brook'],
    ['burgs', 'brook'],
    ['bgs', 'brook'],
    ['byp', 'bypass'],
    ['bypa', 'bypass'],
    ['bypas', 'bypass'],
    ['byps', 'bypass'],
    ['cp', 'camp'],
    ['cmp', 'camp'],
    ['canyn', 'canyon'],
    ['cnyn', 'canyon'],
    ['cpe', 'cape'],
    ['causwa', 'causeway'],
    ['cswy', 'causeway'],
    ['cen', 'center'],
    ['cent', 'center'],
    ['centr', 'center'],
    ['centre', 'center'],
    ['cnter', 'center'],
    ['cntr', 'center'],
    ['ctr', 'center'],
    ['centers', 'center'],
    ['ctrs', 'center'],
    ['cir', 'circle'],
    ['circ', 'circle'],
    ['circl', 'circle'],
    ['crcl', 'circle'],
    ['crcle', 'circle'],
    ['circles', 'circle'],
    ['cirs', 'circle'],
    ['clf', 'cliff'],
    ['clfs', 'cliffs'],
    ['clb', 'club'],
    ['common', 'club'],
    ['cmn', 'club'],
    ['commons', 'club'],
    ['cmns', 'club'],
    ['cor', 'corner'],
    ['cors', 'corners'],
    ['crse', 'course'],
    ['ct', 'court'],
    ['cts', 'courts'],
    ['cv', 'cove'],
    ['coves', 'cove'],
    ['cvs', 'cove'],
    ['crk', 'creek'],
    ['cres', 'crescent'],
    ['crsent', 'crescent'],
    ['crsnt', 'crescent'],
    ['crest', 'crescent'],
    ['crst', 'crescent'],
    ['crssng', 'crossing'],
    ['xing', 'crossing'],
    ['crossroad', 'crossing'],
    ['xrd', 'crossing'],
    ['crossroads', 'crossing'],
    ['xrds', 'crossing'],
    ['curve', 'crossing'],
    ['curv', 'crossing'],
    ['dl', 'dale'],
    ['dm', 'dam'],
    ['div', 'divide'],
    ['dv', 'divide'],
    ['dvd', 'divide'],
    ['dr', 'drive'],
    ['driv', 'drive'],
    ['drv', 'drive'],
    ['drives', 'drive'],
    ['drs', 'drive'],
    ['e', 'east'],
    ['est', 'estate'],
    ['ests', 'estates'],
    ['exp', 'expressway'],
    ['expr', 'expressway'],
    ['express', 'expressway'],
    ['expw', 'expressway'],
    ['expy', 'expressway'],
    ['ext', 'extension'],
    ['extn', 'extension'],
    ['extnsn', 'extension'],
    ['extensions', 'extension'],
    ['exts', 'extension'],
    ['fall', 'extension'],
    ['fls', 'falls'],
    ['frry', 'ferry'],
    ['fry', 'ferry'],
    ['fld', 'field'],
    ['flds', 'fields'],
    ['flt', 'flat'],
    ['flts', 'flats'],
    ['frd', 'ford'],
    ['fords', 'ford'],
    ['frds', 'ford'],
    ['forests', 'forest'],
    ['frst', 'forest'],
    ['forg', 'forge'],
    ['frg', 'forge'],
    ['forges', 'forge'],
    ['frgs', 'forge'],
    ['frk', 'fork'],
    ['frks', 'forks'],
    ['frt', 'fort'],
    ['ft', 'fort'],
    ['freewy', 'freeway'],
    ['frway', 'freeway'],
    ['frwy', 'freeway'],
    ['fwy', 'freeway'],
    ['gardn', 'garden'],
    ['grden', 'garden'],
    ['grdn', 'garden'],
    ['gdns', 'gardens'],
    ['grdns', 'gardens'],
    ['gatewy', 'gateway'],
    ['gatway', 'gateway'],
    ['gtway', 'gateway'],
    ['gtwy', 'gateway'],
    ['gln', 'glen'],
    ['glens', 'glen'],
    ['glns', 'glen'],
    ['grn', 'green'],
    ['greens', 'green'],
    ['grns', 'green'],
    ['grov', 'grove'],
    ['grv', 'grove'],
    ['groves', 'grove'],
    ['grvs', 'grove'],
    ['harb', 'harbor'],
    ['harbr', 'harbor'],
    ['hbr', 'harbor'],
    ['hrbor', 'harbor'],
    ['harbors', 'harbor'],
    ['hbrs', 'harbor'],
    ['hvn', 'haven'],
    ['ht', 'heights'],
    ['hts', 'heights'],
    ['highwy', 'highway'],
    ['hiway', 'highway'],
    ['hiwy', 'highway'],
    ['hway', 'highway'],
    ['hwy', 'highway'],
    ['hl', 'hill'],
    ['hls', 'hills'],
    ['hllw', 'hollow'],
    ['hollows', 'hollow'],
    ['holw', 'hollow'],
    ['holws', 'hollow'],
    ['inlet', 'hollow'],
    ['inlt', 'hollow'],
    ['is', 'island'],
    ['islnd', 'island'],
    ['islnds', 'islands'],
    ['iss', 'islands'],
    ['isles', 'isle'],
    ['jct', 'junction'],
    ['jction', 'junction'],
    ['jctn', 'junction'],
    ['junctn', 'junction'],
    ['juncton', 'junction'],
    ['jctns', 'junctions'],
    ['jcts', 'junctions'],
    ['ky', 'key'],
    ['kys', 'keys'],
    ['knl', 'knoll'],
    ['knol', 'knoll'],
    ['knls', 'knolls'],
    ['lk', 'lake'],
    ['lks', 'lakes'],
    ['land', 'lakes'],
    ['lndg', 'landing'],
    ['lndng', 'landing'],
    ['ln', 'lane'],
    ['lgt', 'light'],
    ['lights', 'light'],
    ['lgts', 'light'],
    ['lf', 'loaf'],
    ['lck', 'lock'],
    ['lcks', 'locks'],
    ['ldg', 'lodge'],
    ['ldge', 'lodge'],
    ['lodg', 'lodge'],
    ['loops', 'loop'],
    ['mall', 'loop'],
    ['mnr', 'manor'],
    ['mnrs', 'manors'],
    ['meadow', 'manors'],
    ['mdw', 'meadows'],
    ['mdws', 'meadows'],
    ['medows', 'meadows'],
    ['mews', 'meadows'],
    ['mill', 'meadows'],
    ['ml', 'meadows'],
    ['mills', 'meadows'],
    ['mls', 'meadows'],
    ['missn', 'mission'],
    ['mssn', 'mission'],
    ['motorway', 'mission'],
    ['mtwy', 'mission'],
    ['mnt', 'mount'],
    ['mt', 'mount'],
    ['mntain', 'mountain'],
    ['mntn', 'mountain'],
    ['mountin', 'mountain'],
    ['mtin', 'mountain'],
    ['mtn', 'mountain'],
    ['mntns', 'mountains'],
    ['n', 'north'],
    ['nck', 'neck'],
    ['orch', 'orchard'],
    ['orchrd', 'orchard'],
    ['ovl', 'oval'],
    ['overpass', 'oval'],
    ['opas', 'oval'],
    ['prk', 'park'],
    ['parks', 'park'],
    ['parkwy', 'parkway'],
    ['pkway', 'parkway'],
    ['pkwy', 'parkway'],
    ['pky', 'parkway'],
    ['pkwys', 'parkways'],
    ['pass', 'parkways'],
    ['passage', 'parkways'],
    ['psge', 'parkways'],
    ['paths', 'path'],
    ['pikes', 'pike'],
    ['pine', 'pike'],
    ['pne', 'pike'],
    ['pnes', 'pines'],
    ['place', 'pines'],
    ['pl', 'pines'],
    ['pln', 'plain'],
    ['plns', 'plains'],
    ['plz', 'plaza'],
    ['plza', 'plaza'],
    ['pt', 'point'],
    ['pts', 'points'],
    ['prt', 'port'],
    ['prts', 'ports'],
    ['pr', 'prairie'],
    ['prr', 'prairie'],
    ['rad', 'radial'],
    ['radiel', 'radial'],
    ['radl', 'radial'],
    ['ramp', 'radial'],
    ['ranches', 'ranch'],
    ['rnch', 'ranch'],
    ['rnchs', 'ranch'],
    ['rpd', 'rapid'],
    ['rpds', 'rapids'],
    ['rst', 'rest'],
    ['rdg', 'ridge'],
    ['rdge', 'ridge'],
    ['rdgs', 'ridges'],
    ['riv', 'river'],
    ['rvr', 'river'],
    ['rivr', 'river'],
    ['rd', 'road'],
    ['rds', 'roads'],
    ['route', 'roads'],
    ['rte', 'roads'],
    ['row', 'roads'],
    ['rue', 'roads'],
    ['run', 'roads'],
    ['s', 'south'],
    ['shl', 'shoal'],
    ['shls', 'shoals'],
    ['shoar', 'shore'],
    ['shr', 'shore'],
    ['shoars', 'shores'],
    ['shrs', 'shores'],
    ['skyway', 'shores'],
    ['skwy', 'shores'],
    ['spg', 'spring'],
    ['spng', 'spring'],
    ['sprng', 'spring'],
    ['spgs', 'springs'],
    ['spngs', 'springs'],
    ['sprngs', 'springs'],
    ['spur', 'springs'],
    ['spurs', 'springs'],
    ['sq', 'square'],
    ['sqr', 'square'],
    ['sqre', 'square'],
    ['squ', 'square'],
    ['sqrs', 'squares'],
    ['sta', 'station'],
    ['statn', 'station'],
    ['stn', 'station'],
    ['stra', 'stravenue'],
    ['strav', 'stravenue'],
    ['straven', 'stravenue'],
    ['stravn', 'stravenue'],
    ['strvn', 'stravenue'],
    ['strvnue', 'stravenue'],
    ['streme', 'stream'],
    ['strm', 'stream'],
    ['strt', 'street'],
    ['st', 'street'],
    ['str', 'street'],
    ['streets', 'street'],
    ['sts', 'street'],
    ['ste', 'suite'],
    ['s.w', 'southwest'],
    ['smt', 'summit'],
    ['sumit', 'summit'],
    ['sumitt', 'summit'],
    ['ter', 'terrace'],
    ['terr', 'terrace'],
    ['throughway', 'terrace'],
    ['trwy', 'terrace'],
    ['traces', 'trace'],
    ['trce', 'trace'],
    ['tracks', 'track'],
    ['trak', 'track'],
    ['trk', 'track'],
    ['trks', 'track'],
    ['trafficway', 'track'],
    ['trfy', 'track'],
    ['trails', 'trail'],
    ['trl', 'trail'],
    ['trls', 'trail'],
    ['trlr', 'trailer'],
    ['trlrs', 'trailer'],
    ['tunel', 'tunnel'],
    ['tunl', 'tunnel'],
    ['tunls', 'tunnel'],
    ['tunnels', 'tunnel'],
    ['tunnl', 'tunnel'],
    ['trnpk', 'turnpike'],
    ['turnpk', 'turnpike'],
    ['underpass', 'turnpike'],
    ['upas', 'turnpike'],
    ['un', 'union'],
    ['unions', 'union'],
    ['uns', 'union'],
    ['vally', 'valley'],
    ['vlly', 'valley'],
    ['vly', 'valley'],
    ['vlys', 'valleys'],
    ['vdct', 'viaduct'],
    ['via', 'viaduct'],
    ['viadct', 'viaduct'],
    ['vw', 'view'],
    ['vws', 'views'],
    ['vill', 'village'],
    ['villag', 'village'],
    ['villg', 'village'],
    ['villiage', 'village'],
    ['vlg', 'village'],
    ['vlgs', 'villages'],
    ['vl', 'ville'],
    ['vis', 'vista'],
    ['vist', 'vista'],
    ['vst', 'vista'],
    ['vsta', 'vista'],
    ['w', 'west'],
    ['walk', 'vista'],
    ['walks', 'vista'],
    ['wall', 'vista'],
    ['wy', 'way'],
    ['ways', 'way'],
    ['well', 'way'],
    ['wl', 'way'],
    ['wls', 'wells'],
]);

/**
 * Converts abbreviations in an address field to full words.
 * 
 * A few examples:
 *   - "123 Main St" => "123 Main Street"
 *   - "123 Main St." => "123 Main Street"
 *   - "S.W. 12th Ave." => "Southwest 12th Avenue"
 *   - "123 Notre Dame Ave" => "123 Notre Dame Avenue"
 *   - "123 Blvd." => "123 Boulevard"
 *   - "Apt. 123" => "Apartment 123"
 *   - "Ste. 123" => "Suite 123"
 */
export const convertAddressAbbreviations = (addressField: string): string => {
    const words = addressField.split(' ');

    for (let i = 0; i < words.length; i++) {
        const word = words[i].replace(/\.$/, '').toLowerCase();
        words[i] = abbreviations.get(word) ?? words[i];
    }

    return words.join(' ');
};

/**
 * Compares the fields of two addresses and returns true if they are the same.
 * 
 * address_line_1 and address_line_2 will have commonly used abbreviations swapped out for full
 * words. Eg.
 * 
 * address_line_1: '123 Main St'
 * address_line_2: 'Apt. 1'
 * 
 * Will be converted to:
 * 
 * address_line_1: '123 Main Street'
 * address_line_2: 'Appartment 1'
 * 
 * See the abbreviations map for a list of abbreviations and their full words.
 */
export const compareAddresses = (address1: OptionalPartial<IAddress>, address2: OptionalPartial<IAddress>): boolean => {
    const convert = convertAddressAbbreviations;

    if (!address1 && !address2) {
        return true;
    } else if (!address1 || !address2) {
        return false;
    }

    // Creating a set of month fields in the addresses to make sure we compare all the fields
    // and not just a subset of one or the other. So if address1 has a phone and address2 doesn't
    // (or vise vera) the function will return false
    const fields = new Set([
        ...Object.keys(address1),
        ...Object.keys(address2),
    ]);

    for (const field of fields) {
        // Ignoring ID field
        if (field.toLowerCase() === 'id') {
            continue; 
        }

        // If one of the values is not a string or undefined then we fallback to strict equal
        let value1 = address1[field] as unknown;
        let value2 = address2[field] as unknown;
        if (
            (typeof value1 !== 'undefined' && typeof value1 !== 'string') ||
            (typeof value2 !== 'undefined' && typeof value2 !== 'string')
        ) {
            if (value1 === value2) {
                continue; 
            }
            return false;
        }
        
        value1 = value1?.trim()?.toLowerCase();
        value2 = value2?.trim()?.toLowerCase();

        // Checking type and value are exact
        if (value1 === value2) {
            continue; 
        }

        // Checking they are both falsey
        if (!value1 && !value2) {
            continue; 
        }

        // Only doing additional checks if both values are strings
        if (typeof value1 === 'string' && typeof value2 === 'string') {

            // Only doing additional checks if the field is an address_line_# field
            if (['address_line_1', 'address_line_2'].includes(field)) {

                // Checking if the values are the same when dots are removed from the end of words of the field
                if (value1.replace(/\.(?: |$)/g, '') === value2.replace(/\.(?: |$)/g, '')) {
                    continue; 
                }

                // Checking if the values are the same when the abbreviations are replaced with full words
                if (convert(value1) === convert(value2)) {
                    continue; 
                }
            }

            // Only doing additional checks if the field is province
            if (field === 'province') {
                const pc1 = address1.province_code?.trim()?.toLowerCase();
                const pc2 = address2.province_code?.trim()?.toLowerCase();

                // Checking if the province codes are the same and both are truthy
                if (pc1 === pc2 && pc1 && pc1) {
                    continue; 
                }
            }

            // Only doing additional checks if the field is country
            if (field === 'country') {
                const cc1 = address1.country_code?.trim()?.toLowerCase();
                const cc2 = address2.country_code?.trim()?.toLowerCase();

                // Checking if the country codes are the same and both are truthy
                if (cc1 === cc2 && cc1 && cc2) {
                    continue; 
                }
            }
        }
        
        // If it gets to this point in the loop then all other comparisons have failed
        // and the field in address1 is not equal to the field in address2
        return false;
    }

    return true;
};