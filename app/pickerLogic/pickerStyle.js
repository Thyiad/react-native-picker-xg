import {
  StyleSheet,
  Dimensions,
  PixelRatio
} from 'react-native';

let height = Dimensions.get('window').height;
let width = Dimensions.get('window').width;
let ratio = PixelRatio.get();
let styles = StyleSheet.create({

  container: {

  },
  pickContainer:{
    flex:9,
    flexDirection:'row',
  },
  modalContainer: {
    flex: 1,
    backgroundColor:'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    position:'absolute',
    height:220,
    width:width,
    backgroundColor:'white',
  }
});

let rollStyles = StyleSheet.create({

  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0)'
  },
  middle: {
    alignSelf:'stretch',
    borderColor: '#aaa',
    borderTopWidth: 1 / ratio,
    borderBottomWidth: 1 / ratio
  },
  middleView: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  middleText: {
    height: 36,
    paddingTop: 8,
    paddingBottom: 8,
    color: '#000',
    fontSize: 20,
    marginTop: 0,
    marginBottom: 0,
  }
});

export {styles as styles, rollStyles as rollStyles};
