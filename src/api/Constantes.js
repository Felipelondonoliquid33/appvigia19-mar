/*
* Ferney Duran 02/2020
*/
'use strict';

import {Dimensions} from 'react-native';

const dimensions = Dimensions.get('window');
 
const Constantes  = {
    height100: dimensions.height,
    height10: Math.round(dimensions.height * 0.1),
    height05: Math.round(dimensions.height * 0.05),
    height03: Math.round(dimensions.height * 0.03),
    height02: Math.round(dimensions.height * 0.02),
    height01: Math.round(dimensions.height * 0.01),
    width100: dimensions.width,
    width90: Math.round(dimensions.width * 0.9),
    width85: Math.round(dimensions.width * 0.85),
    width70: Math.round(dimensions.width * 0.70),
    width60: Math.round(dimensions.width * 0.6),
    width50: Math.round(dimensions.width * 0.5),
    width20: Math.round(dimensions.width * 0.2),
    fonSizeTitulo: 24,
    fonSizeTitulo2: 22,
    fonSizeSubTitulo: 20,
    fontSizeNormal: 16,
    fontSizeNormal18: 18,
    fontSizeNormal2: 14,
    fontSizeSmall: 12,
}


export default Constantes;      