
const MATCH_NAME = 'Boyer-Moore';

class BmStringMatcher {

    constructor() {
        console.log(`constructing an ${MATCH_NAME} instance`);

        // all private variables
        let _pattern = null; 
        let _text = null; 
        let _patternLength = 0; 
        let _textLength = 0; 

        // A border is a substring which is both proper suffix and proper prefix. 
        // For example, in string “ccacc”, “c” is a border, 
        // “cc” is a border because it appears in both end of string but “cca” is not a border.

        // Each entry _borderPositions[i] contains the starting index 
        // of border for suffix starting at index i in given pattern P.
        let _borderPositions= []; // integers

        // As a part of preprocessing, an array shift is created. 
        // Each entry shift[i] contain the distance pattern will shift if mismatch occur at position i-1. 
        // That is, the suffix of pattern starting at position i is matched and a mismatch occur at position i-1. 
        let _shift = []; 

        function processSuffixBorderIndexes() {
           
            let i = _patternLength;
            let j = _patternLength+1;
 
            _borderPositions[i] = j;

            while (i > 0) {

                let p_i = _pattern[i-1];
                let p_j = _pattern[j-1];

                while (j <= _patternLength && (p_i != p_j)) {
                    
                    // mismatch!!!
                    if (_shift[j] == 0) {
                        _shift[j] = j - i;
                    }
                    j = _borderPositions[j]; 
                }

                i--; j--;
                _borderPositions[i] = j;
            }
        }

        function processShiftIndexes() {
            let i;
            let j;

            j = _borderPositions[0];

            for (i = 0; i <= _patternLength; i++) {

                // set the border postion of first character of pattern to all indices in array shift having shift[i] = 0 
                if (_shift[i] == 0) _shift[i] = j;

                // suffix become shorter than bpos[0], use the position of next widest border as value of j 
                if (i == j) j = _borderPositions[i];
            }
        }


        function bmPreprocess() {
            processSuffixBorderIndexes();
            processShiftIndexes();
        }

        function setText(tt) {
            _textLength = tt.length;
            _text = tt;
        }

        function setPattern(pp) {
            _patternLength = pp.length;
            _pattern = pp;
            for (let i = 0; i < _patternLength; i++) {
                _borderPositions[i] = 0;
                _shift[i] = 0; // initialize all shifts to 0
            }
            bmPreprocess();
        }

     
        function bmSearch() {
            console.log(` ------------------- Now, lets search! --------------------`);

            let i = 0;
            let j = 0;

            while (i <= _textLength - _patternLength) {
                console.log(`lets process i ${i}`);
                j = _patternLength - 1;

                // Keep reducing index j of pattern while characters of pattern and text are matching at this shift s
                while ( j >= 0 && _pattern[j] == _text[i+j]) { j--; }

                if (j < 0) {
                    // If the pattern is present at current shift, then index j will become -1 after the above loop 
                    console.log(` √ at ${i}`);
                    i += _shift[0];
                } else {
                    // pattern at [i] != pattern at [s+j] so shift the pattern  shift[j+1] times  */
                    i += (_shift[j+1]) ? _shift[j+1] : 1;
                }
            }
        }

        this.search = function(tt, pp) {
            console.log(`set text: ${tt}, set pattern: ${pp}`);
            setText(tt);
            setPattern(pp);
            bmSearch();
        }
    }   
}

let a = new BmStringMatcher();
a.search('aacaacaacaa', 'aacaa');