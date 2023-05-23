export const initialState = {
    hasPermission: null,
    scanned: false,
    name: "",
    barcodeValue: "",
    barcodeTypeIndex: 0,
    borderColor: "#CCCCCC",
    splashVisible: false,
    isBarcodeValid: null,
    isLogoPickerVisible: false,
    logo: null,
    autoType: true,
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
      case 'SET_IS_LOGO_PICKER_VISBLE':
        return { ...state, isLogoPickerVisible: action.payload };
      case 'SET_LOGO':
        return { ...state, logo: action.payload };
      case 'SET_AUTO_TYPE':
        return { ...state, autoType: action.payload };
      default:
        throw new Error('Invalid action type');
    }
  }
