export const barcodeTypes = [
    "EAN13",
    "SRAN15",
    "KUPAN4",
]

export const barcodeTypesMap = new Map([
    //ios
    ["org.gs1.EAN-13", 0],
    
    //android
    [32, 0],
]);

export function validateBarcode(barcodeValue, barcodeTypeIndex) {
    
    if(barcodeTypeIndex === 0){
        return validateEAN13(barcodeValue);
    }

    return false;
}

const validateEAN13 = (barcodeValue) => {
    if(
        barcodeValue.length === 13 &&
        /^\d+$/.test(barcodeValue)
    ){
        return true;
    }
    return false;
}
  
