var algarismsMap = {
    1 : {
        1 : 'I',
        4 : 'IV',
        5 : 'V',
        9 : 'IX'
    },
    1e1 : {
        1 : 'X',
        4 : 'XL',
        5 : 'L',
        9 : 'XC'
    },
    1e2 : {
        1 : 'C',
        4 : 'CD',
        5 : 'D',
        9 : 'CM'
    },
    1e3: {
        1 : "I\u0305",
        4 : 'I\u0305V\u0305',
        5 : 'V\u0305',
        9 : 'I\u0305X\u0305'
    },
    1e4: {
        1 : "X\u0305",
        4 : 'X\u0305L\u0305',
        5 : 'L\u0305',
        9 : 'X\u0305C\u0305'
    },
    1e5 : {
        1 : "C\u0305",
        4 : 'C\u0305D\u0305',
        5 : 'D\u0305',
        9 : 'C\u0305M\u0305'
    }
}

const divisors = Object.keys( algarismsMap ).reverse()

const romanizeNumber = module.exports = function( n ) {

    // not throwing an error because this can happen while recursing
    if ( n <= 0 ) {
        return ''
    }

    // welp, for numbers greater than 3999999 we break roman rules of not repeating the same algarism more than 3 times, 
    //   or we need to add more dashes, which is not really documented, at least I could not find some reliable source about it. 🤔
    if ( n >= 4e6 ) {
        throw new Error( 'The max supported number to be converted is 3999999' )
    }
    
    let romanizedNumber = ''
    
    // Some special cases for the M algarism.
    if ( n >= 1e3 && n <= 3999 ||  n >= 1e6 && n <= 3999999 ) {
        
        romanizedNumber += ( n >= 1e6 ? 'M\u0305' : 'M' ).repeat( n / (n >= 1e6 ? 1e6 : 1e3 ) )
        romanizedNumber += romanizeNumber( n % (n >= 1e6 ? 1e6 : 1e3 ) )
        
    } else {
        
        for ( let i = 0; i < divisors.length; i++ ) {
            
            const currDivisor = divisors[i]|0
            const currDivisorInfo = algarismsMap[currDivisor]
            
            const internalDivisors = Object.keys( currDivisorInfo ).reverse()
            
            // The number is not divisible by this one, keep going (we could just check if n < currDivisor duh)
            if ( n % currDivisor === n ) {
                continue
            }
            
            for ( let k = 0; k < internalDivisors.length; k++ ) {
                
                const currInternalDivisor = internalDivisors[k]|0
                const currInternalDivisorAlgarism = currDivisorInfo[currInternalDivisor]

                if ( n >= currInternalDivisor * currDivisor ) {
                    
                    // the 1 check here is basically for the same motive than the 'M' check above.
                    romanizedNumber += currInternalDivisor === 1 ? currInternalDivisorAlgarism.repeat( n / currDivisor ) : currInternalDivisorAlgarism

                    romanizedNumber += romanizeNumber( n % (currInternalDivisor * currDivisor) )
                    
                    return romanizedNumber
                }
            }
        }
        
    }
    
    return romanizedNumber
}