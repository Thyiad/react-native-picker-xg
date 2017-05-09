import {
  StyleSheet,
  Dimensions,
  PixelRatio
} from 'react-native';

import Styles from '../../../constants/Styles';

let styles = StyleSheet.create({

  nav: {
    flexDirection: 'row',
    flex:2,
    alignItems: 'center',
    backgroundColor:Styles.colors.green,
    height:55,
  },
  confirm: {
    flex:1,
    justifyContent: 'center'
  },
  confirmBtnStyle:{
      textAlign:'right',
      paddingLeft:35,
      paddingRight:35,
      fontSize: 18,
      color:'white',
  },
  pickerName:{
    textAlign:'center',
    fontSize: 14
  },
  cancel: {
    flex:1,
    justifyContent: 'center'
  },
  pickerNameContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelBtnStyle: {
      textAlign:'left',
      paddingLeft:35,
      paddingRight:35,
      fontSize: 18,
      color:'white',
  }
});


export default styles;
