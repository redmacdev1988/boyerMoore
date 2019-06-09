
const MATCH_NAME = 'Boyer-Moore';
const MAX = 256;

class BM_BadChar {
    constructor() {
        console.log(`constructing an ${MATCH_NAME} instance`);

        let _badCharacter = [MAX];  

        let _patternLength = 0;
        let _pattern = null;
   
        let _text = null;
        let _textLength = 0;

        function setText(tt) {
            _textLength = tt.length;
            _text = tt;
        }

        function setPattern(pp) {
            _patternLength = pp.length;
            _pattern = pp;
        }

        function badCharacterHeuristic(patternStr, badCharArr) {
            for (let i = 0; i < MAX; i++) { badCharArr[i] = -1; }
            for(let j = 0; j < _patternLength; j++) {
                let pChar = patternStr[j];           
                let asciiIndex = pChar.charCodeAt(0);
                _badCharacter[asciiIndex] = j;   //set position of character in the array.
            }  
        }

    function textSubstring_At_i_Match_Pattern(textIndex) {

        // match it going backwards
        let pIndex = _patternLength - 1;
        while (pIndex >= 0 && _pattern[pIndex] == _text[ textIndex + pIndex ]) { 
            pIndex--; 
        }
        return pIndex;
    }


    function bmSearch() {
        badCharacterHeuristic(_pattern, _badCharacter); 

        let shift = 0;
        let patternIndex;

        while (shift <= _textLength - _patternLength) {

            patternIndex = textSubstring_At_i_Match_Pattern(shift);
            if (patternIndex < 0) {
                console.log(`MATCH! at ${shift}`);

                if((shift + _patternLength) < _textLength) { 
                    let charAtText = _text[shift + _patternLength];
                    shift += _patternLength - _badCharacter[charAtText.charCodeAt(0)];
                } else {
                    shift += 1;
                }
            } else {
                let charAtText = _text[shift+patternIndex];
                shift += Math.max(1, patternIndex - _badCharacter[charAtText.charCodeAt(0)]);
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

let b = new BM_BadChar();
b.search('aabcaaa', 'aa');


/*
let a = new BM_GoodSuffix();
a.search('aacaacaacaa', 'aacaa');


class BM_GoodSuffix {
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

        // Keep reducing pattern index while characters of pattern and text are matching at this shift s
        function textSubstring_At_i_Match_Pattern(textIndex) {

            // match it going backwards
            let pIndex = _patternLength - 1;
            while (pIndex >= 0 && _pattern[pIndex] == _text[ textIndex + pIndex ]) { 
                pIndex--; 
            }
            return pIndex;
        }

        function bmSearch() {
            console.log(` ------------------- Now, lets search! --------------------`);

            let textIndex = 0;
            let patternIndex;

            while (textIndex <= _textLength - _patternLength) {

                patternIndex = textSubstring_At_i_Match_Pattern(textIndex);

                if (patternIndex < 0) {
                    console.log(` √ at ${textIndex}`);
                    textIndex += _shift[0];
                } else {
                    textIndex += (_shift[ patternIndex + 1 ]) ? _shift[ patternIndex + 1 ] : 1;
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

let a = new BM_GoodSuffix();
a.search('aacaacaacaa', 'aacaa');
*/