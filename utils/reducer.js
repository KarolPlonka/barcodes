export const initialState = {
    hasPermission: null,
    scanned: false,
    name: "",
    barcodeValue: "",
    barcodeTypeIndex: null,
    borderColor: "#CCCCCC",
    splashVisible: false,
    isBarcodeValid: null,
  };
  
export function reducer(state, action) {
    switch (action.type) {
      case 'SET_HAS_PERMISSION':
        return { ...state, hasPermission: action.payload };
      case 'SET_SCANNED':
        return { ...state, scanned: action.payload };
      case 'SET_NAME':
        return { ...state, name: action.payload };
      case 'SET_BARCODE_VALUE':
        return { ...state, barcodeValue: action.payload };
      case 'SET_BARCODE_TYPE_INDEX':
        return { ...state, barcodeTypeIndex: action.payload };
      case 'SET_BORDER_COLOR':
        return { ...state, borderColor: action.payload };
      case 'SET_SPLASH_VISIBLE':
        return { ...state, splashVisible: action.payload };
      case 'SET_IS_BARCODE_VALID':
        return { ...state, isBarcodeValid: action.payload };
      default:
        throw new Error('Invalid action type');
    }
  }
