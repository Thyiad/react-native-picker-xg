/**
 * 依赖引用
 */
import React, { Component,  PropTypes} from 'react';
import {
  View,
  Text,
  Dimensions,
  Animated,
  PickerIOS,
  Platform,
  Modal,
  StatusBar,
  ActivityIndicator,
  Image,
    TouchableOpacity,
} from 'react-native';
import Pickroll from './cascadeRoll';
import {styles} from './pickerStyle';
import InputOuter from '../pickerTrigger/outer';
import Handle from '../pickerHandle/handle';
import * as pickConfig from '../constants/pickerConfig';
/**
 * 平台兼容
 */
let PickRoll = Platform.OS === 'ios' ? PickerIOS : Pickroll;
let modalHeight = Platform.OS === 'ios' ? pickConfig.pickerHeight : (StatusBar.currentHeight + pickConfig.pickerHeight);
let PickerItem = PickRoll.Item;

/**
 * 全局变量声明
 */
let height = Dimensions.get('window').height;

/**
 * 组件扩展
 */
class CascadePicker extends Component {

  /**
   * 类型约束
   * @type {{data: PropTypes.object, pickerNameStyle: PropTypes.style, cancelBtnStyle: PropTypes.style, confirmBtnStyle: PropTypes.style, inputStyle: PropTypes.style, navStyle: PropTypes.style, textStyle: PropTypes.style, pickerName: PropTypes.string, inputValue: PropTypes.string, level: PropTypes.number, selectIndex: PropTypes.array, onResult: PropTypes.func}}
     */
  static propTypes = {
    //传递的数据,cascade类型针对两个轮及其以上的,所以格式为对象
    data: PropTypes.any,
    //picker名称样式
    pickerNameStyle: Text.propTypes.style,
    //取消按钮样式
    cancelBtnStyle: Text.propTypes.style,
    //确认按钮样式
    confirmBtnStyle: Text.propTypes.style,
    //输入框样式
    inputStyle: View.propTypes.style,
    //滚轮头部样式
    navStyle: View.propTypes.style,
    //输入框内部字体样式
    textStyle: Text.propTypes.style,
    //右边下拉按钮的样式
    iconStyle: View.propTypes.style,
    //picker的名称
    pickerName: PropTypes.string,
    //输入框内部文字初始值
    inputValue: PropTypes.string,
    //确定按钮的文字
    confirmBtnText: PropTypes.string,
    //取消按钮的文字
    cancelBtnText: PropTypes.string,
    //确定几层菜单,必填
    level: PropTypes.number,
    //确定默认选择的
    selectIndex: PropTypes.array,
    //获取选择的内容
    onResult: PropTypes.func,
    //picker是否能操作
    enable: PropTypes.bool,
    //icon name
    iconName: PropTypes.string,
    //icon size
    iconSize: PropTypes.number,
    emptyText: PropTypes.string,
    firstRollCanEmpty: PropTypes.bool,
    subRollCanEmpty: PropTypes.bool,
  };

  /**
   * 构造函数
   * @param props {object} 继承的属性
   * @param context 上下文
     */
  constructor(props, context){
    super(props, context);
    this._setEventBegin = this._setEventBegin.bind(this);
    this._changeLayout = this._changeLayout.bind(this);
    this._cancelChose = this._cancelChose.bind(this);
    this._pushOpera = this._pushOpera.bind(this);
    this._changeAnimateStatus = this._changeAnimateStatus.bind(this);
    this._confirmChose = this._confirmChose.bind(this);
    this._setModalVisible = this._setModalVisible.bind(this);

    this.state = {};
    this.state.visible = this.props.visible;
    this.state.animatedHeight = new Animated.Value(height);

    this.choseNumber = [];
    this.choseValue = [];

    this.emptyItem = {
        parentId: 0,
        id: -1,
        name: this.props.emptyText,
    };

      let passData=[];
      for(let i=0;i<this.props.level;i++) {
          if (i === 0) {
              passData[i] = this.props.data.filter(function (item) {
                  return item.parentId == null || item.parentId <= 0;
              })
              if(this.props.firstRollCanEmpty){
                  passData[i].unshift(this.emptyItem);
              }else{
                  let selectedItem = passData[i][0];
                this.choseValue.push({value:selectedItem.id, label: selectedItem.name, parentId: selectedItem.parentId});
                this.choseNumber.push(0);
              }
          } else {
            let parent = passData[i-1][0];
              let parentId = parent && parent .id;
              if(parentId == null || parentId<=0){
                  passData[i]=[];
                continue;
              }
              passData[i] = this.props.data.filter(function (item) {
                  return item.parentId === parentId;
              });
              if(this.props.subRollCanEmpty){
                  passData[i].unshift(this.emptyItem);
              }else if(!this.props.firstRollCanEmpty){
                  let selectedItem = passData[i][0];
                  this.choseValue.push({value:selectedItem.id, label: selectedItem.name, parentId: selectedItem.parentId});
                  this.choseNumber.push(0);
              }
          }
      }
      this.state.passData = passData;
  }

  componentDidMount(){
    if (this.state.visible && this.props.data.length > 0) {
      this._setEventBegin();
    }
  }


  /**
   * 确定操作
   * @returns {string} 选择的数据
   * @private
     */
  _confirmChose(){
    while (this.choseNumber.length < this.props.level) {
      this.choseNumber.push(0);
    }
    this._setModalVisible(false,'confirm');
  }

  /**
   * 数组操作
   * @param from {array} 拷贝的数组
   * @param to {array} 待拷贝的数组
   * @private
     */
  _pushOpera(from,to){
    to.length = 0;
    for (let item of from){
      to.push(item);
    }
  }

  /**
   * 取消操作
   * @returns {{saveChoseValue: Array, saveData: Array, saveIndex: Array}}
   * @private
     */
  _cancelChose(){
      this.choseNumber = this.beforeOpe.slice();
      this.choseValue = this.beforeValue.slice();

      this.setState({
          passData: this.beforeData
      })

    this._setModalVisible(false,'cancel');
  }

  /**
   * 行为触发(整个操作的开始
   * @returns {{saveChoseValue: Array, saveData: Array, saveIndex: Array}}
   * @private
     */
  _setEventBegin(){
    if (this.props.enable && (this.props.data.length >= 1)){
      this.beforeData = this.state.passData.slice();
      this.beforeOpe = this.choseNumber.slice();
      this.beforeValue = this.choseValue.slice();

      this._setModalVisible(true);
    } else {
      this.state.visible = false;
    }
  }

  /**
   * Modal操作
   * @param visible {bool} 是否可见
   * @param type {string} 确定操作触发的类型
   * @private
     */
  _setModalVisible(visible,type) {
    if (visible){
      this.setState({visible: visible});
      Animated.timing(
        this.state.animatedHeight,
        {toValue: height - modalHeight,
          delay: 300}
      ).start();
    } else {
      Animated.timing(
        this.state.animatedHeight,
        {toValue: height}
      ).start(() => this._changeAnimateStatus(type));
    }
  }

  /**
   * 根据触发的类型改变动画状态
   * @param type {string} 操作触发的类型
   * @private
     */
  _changeAnimateStatus(type){
    if (type === 'confirm'){
      this.setState({visible:false},() => {
        if (this.props.onResult){
          this.props.onResult(this.choseValue);
        }
      });
    }
    else if (type === 'cancel'){
      this.setState({visible:false});
      this.props.onCancel && this.props.onCancel(this.beforeData);
    }
  }

  /**
   * 改变滚轮布局
   * @param value {string} 改变的数据
   * @param index {number} 改变的位置
   * @private
     */
  _changeLayout(value,index, wheelNumber){
    this.choseNumber[wheelNumber] = index;
    this.choseNumber.length = (wheelNumber + 1);
    this.choseValue[wheelNumber] = value;
    this.choseValue.length = (wheelNumber + 1);

    let length = this.choseValue.length;
    if(this.choseValue[length-1].value === this.emptyItem.id){
        this.choseNumber.length = length-1;
        this.choseValue.length = length-1;
    }

    this._handleData(wheelNumber, value);

    this.props.onWheelChange && this.props.onWheelChange(value, index, wheelNumber);
  }

    _handleData(wheelNumber, value) {
      if(wheelNumber+1>=this.props.level){
        return;
      }
      let passData = this.state.passData;
      let parentId = value.value;
      for(let i=wheelNumber+1;i<this.props.level;i++){
        if(parentId==null||parentId<=0){
          passData[i]=[];
          parentId=null;
          continue;
        }

        let wheelData = this.props.data.filter(function (item) {
            return item.parentId===parentId;
        })
          let firstData = wheelData[0];
        if(this.props.subRollCanEmpty && firstData){
            wheelData.unshift(this.emptyItem);
            firstData = wheelData[0];
        }else if(!this.props.subRollCanEmpty && firstData) {
            this.choseNumber[i] = 0;
            this.choseValue[i] = {value: firstData.id, label: firstData.name, parentId: firstData.parentId}
        }
        passData[i] = wheelData;
        parentId= firstData && firstData.id;
      }
      this.setState({passData:passData});
  }
  /**
   * 渲染函数
   * @returns {XML}
     */
  render(){
    let that = this;

    return (
      <View style={styles.container}>
        <Modal
          animationType={this.props.animationType}
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => {this._setModalVisible(false, 'cancel');}}
        >
          <View style={[styles.modalContainer]}>
            <Animated.View style={[styles.innerContainer,{top:this.state.animatedHeight}]}>
            <Handle
                navStyle = {this.props.navStyle}
                confirmBtnStyle = {this.props.confirmBtnStyle}
                cancelBtnStyle = {this.props.cancelBtnStyle}
                confirmChose = {this._confirmChose}
                pickerNameStyle ={this.props.pickerNameStyle}
                cancelChose = {this._cancelChose}
                pickerName = {this.props.pickerName}
                confirmBtnText = {this.props.confirmBtnText}
                cancelBtnText = {this.props.cancelBtnText}
                />
              <View style={[styles.pickContainer]} >
                {that.state.passData && that.state.passData.map((item,index) =>{
                  if (this.props.loading.length > 0 && this.props.loading[index] && Platform.OS === 'android') {
                    return (
                      <View key={index} style={[{flex: 1, alignItems: 'center', borderWidth:0}, Platform.OS !== 'ios' && {justifyContent: 'center'}]}>
                        {Platform.OS === 'ios' && <View style={{position: 'absolute', width: 500, height: 36, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ddd', marginTop: 90}} />}
                        <ActivityIndicator
                                animating={true}
                                size="small"
                                style={Platform.OS === 'ios' && {marginTop: 96}}
                        />
                      </View>
                    );
                  }
                  return (
                    <PickRoll
                      itemStyle={{fontSize: 17}}
                      id = {this.props.id}
                      name = {this.props.name}
                      parentId = {this.props.parentId}
                      key = {index}
                      wheelNumber = {index}
                      style = {{flex:1}}
                      pickerStyle = {{flex:1}}
                      data = {that.state.passData[index]}
                      passData = {that.state.passData}
                      selectedIndex = {that.choseNumber[index]}
                      selectedValue = {that.choseValue[index]}
                      onValueChange={(newValue, newIndex) => {
                        that._changeLayout(newValue,newIndex, index);}}
                    >
                    {Platform.OS === 'ios' && this.props.loading.length > 0 && this.props.loading[index] && (
                      <PickerItem
                        key={'loading'}
                        value={'loading'}
                        label={'loading'}
                      />
                      )}
                    {Platform.OS === 'ios' && !this.props.loading[index] && ((that.state.passData[index]).map((carMake) => (
                      <PickerItem
                        key={carMake}
                        value={carMake[this.props.id]}
                        label={carMake[this.props.name]}
                      />
                    )))}
                    </PickRoll>);})}
              </View>
            </Animated.View>
          </View>
        </Modal>
          {this.props.children ? <TouchableOpacity onPress={this._setEventBegin}>
              {this.props.children}
          </TouchableOpacity> : this._renderDefaultContent()}
      </View>
    );
  }

    _renderDefaultContent(){
      return (
          <InputOuter
              enable={this.props.enable && (this.props.data.length >= 1)}
              textStyle={this.props.textStyle}
              inputStyle={this.props.inputStyle}
              iconSize={this.props.iconSize}
              iconName={this.props.iconName}
              iconStyle={this.props.iconStyle}
              onPress={this._setEventBegin}
              placeholder={this.props.inputValue}/>
      );
    }
}

CascadePicker.defaultProps = {
  animationType: 'none',
  visible: false,
  enable: true,
  inputValue: 'please chose',
  confirmBtnText: '确定',
  cancelBtnText: '取消',
  id: 'id',
  name: 'name',
  parentId: 'parentId',
  loading: [],
  emptyText:'—',
  firstRollCanEmpty:false,
  subRollCanEmpty:true,
};

export default CascadePicker;
