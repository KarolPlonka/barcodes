const isCheckDigitValid = (barcodeValue) => {
    const checkDigit = parseInt(barcodeValue[barcodeValue.length - 1]);
    const barcodeWithoutCheckDigit = barcodeValue.slice(0, -1);
    let sum = 0;
    for (let i = 0; i < barcodeWithoutCheckDigit.length; i++) {
        const digit = parseInt(barcodeWithoutCheckDigit[i]);
        sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const calculatedCheckDigit = (10 - (sum % 10)) % 10;
    if (checkDigit === calculatedCheckDigit) {
        return true;
    }
    return false;
}
        

export const barcodeTypes = [
    {
        name: "EAN13",
        isValid: (barcodeValue) => {
            if (
                barcodeValue.length === 13 &&
                /^\d+$/.test(barcodeValue)
            ) {
                return isCheckDigitValid(barcodeValue);
            }
            return false;
        }
    },

    {
        name: "CODE128",
        isValid: (barcodeValue) => {
            if (/^[\x00-\x7F]+$/.test(barcodeValue)) {
              return true;
            }
            return false;
        },
    },

    {
        name: "CODE39",
        isValid: (barcodeValue) => {
            if (/^[A-Z0-9\-\.\ \$\/\+\%]+$/.test(barcodeValue)) {
                return true;
            }
            return false;
        },
    },

    {
        name: "ITF14",
        isValid: (barcodeValue) => {
            if (
                barcodeValue.length === 14 &&
                /^\d+$/.test(barcodeValue)
            ) {
                return isCheckDigitValid(barcodeValue);
            }
            return false;
        },
    },

    {
        name: "UPC",
        isValid: (barcodeValue) => {
            if (
                barcodeValue.length === 12 &&
                /^\d+$/.test(barcodeValue)      
            ) {
                return isCheckDigitValid(barcodeValue);
            }
            return false;
        },
    },

    {
        name: "UPCE",
        isValid: (barcodeValue) => {
            if (
                barcodeValue.length === 8 &&
                /^\d+$/.test(barcodeValue)
            ) {
                return isCheckDigitValid(barcodeValue);
            }
            return false;
        },
    },

    {
        name: "EAN8",
        isValid: (barcodeValue) => {
            if (
                barcodeValue.length === 8 &&
                /^\d+$/.test(barcodeValue)
            ) {
                return isCheckDigitValid(barcodeValue);
            }
            return false;
        },
    },

    {
        name: "EAN5",
        isValid: (barcodeValue) => {
            if (
                barcodeValue.length === 5 &&
                /^\d+$/.test(barcodeValue)
            ) {
                return isCheckDigitValid(barcodeValue);
            }
            return false;
        },
    },
]

export const findBarcodeTypeIndex = (barcodeValue) => {
    for (let i = 0; i < barcodeTypes.length; i++) {
        if(barcodeTypes[i].isValid(barcodeValue)){
            return i;
        }
    }

    return null;
}
  
