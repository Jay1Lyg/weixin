//index.js
//获取应用实例
const app = getApp()
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({
  data: {
    motto: '你好',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    play: false,
    audio: {
      //资源地址
      src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',
      //开始播放位置s
      startTime: 0,
      //资源标题
      title: '此时此刻',
      //专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
      epanme: '此时此刻',
      //歌手名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
      singer: '许巍',
      //封面图 URL
      coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
      //总时长s
      duration: 0,
      //当前播放的位置s
      currentTime: 0,
      //进度条0-100
      progress: 0,
      //进度条最大值
      max: 100,
      //是否默认播放
      defaultPlay: true,
      //是否暂停
      isPaused:false,
      //是否执行了滑动
      isSlided:false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("播放")
    var _this = this;
    this.audioInit();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 资源初始化
   */
  audioInit: function() {
    var _this = this;
    console.log("资源初始化")
    //1.基本属性
    backgroundAudioManager.title = _this.data.audio.title;
    backgroundAudioManager.epname = _this.data.audio.epanm;
    backgroundAudioManager.singer = _this.data.audio.singer;
    backgroundAudioManager.coverImgUrl = _this.data.audio.coverImgUrl;
    backgroundAudioManager.src = _this.data.audio.src;
    //2.关键属性,是否默认播放
    if (_this.data.audio.defaultPlay) {
      console.log("自动播放")
      //3.监听背景音频进入可以播放状态
      backgroundAudioManager.onCanplay(function(){
        //4.保存总时长
        console.log("就绪状态值：",backgroundAudioManager);
        _this.data.audio.duration = backgroundAudioManager.duration;
        //5.监听进度条更新
        _this.onTimeUpdate();
      });
      
    } else {
      console.log("默认停止")
      this.data.audio.isPaused = true;
    }
  },

  /**
   * 播放
   */
  play: function() {
    console.log("开始播放",this.data.audio)
    backgroundAudioManager.play();
  },

  /**
   * 暂停
   */
  pause: function() {
    var _this = this;
    backgroundAudioManager.pause();
  },

  /**
   * 监听进度条滑动结束事件
   */
  dragOver: function(e) {
    var _this = this;
    console.log("拖拽结束", e)
    console.log("播放到：", this.data.audio.currentTime)
    //1.计算当前应该滑动到多少秒位置
    this.data.audio.progress = e.detail.value;
    console.log("资源信息", this.data.audio.duration);
    this.data.audio.currentTime = e.detail.value / this.data.audio.max * this.data.audio.duration;
    console.log("当前时间", this.data.audio.currentTime);
    backgroundAudioManager.seek(_this.data.audio.currentTime);
    //更新是否滑动过字段
    this.data.audio.isSlided = true;
    //2.滑动滑动条实时更新当前音频时间
    this.setData({
      audio: this.data.audio
    });
    
  },

  /**
   * 监听进度条滑动事件
   */
  draging: function(e) {
    var _this = this;
    console.log("拖拽中", e)
  },

  /**
   * 滑动条点击
   */
  sliderClick:function(e) {
    console.log("点击",e)
  },

  /**
   * 监听播放进度更新事件
   */
  onTimeUpdate: function() {
    console.log("监听播放进度更新事件");
    var _this = this;
    backgroundAudioManager.onTimeUpdate(function() {
      //更新进度条
      _this.onTimeUpdateProgress();
    })
  },

  /**
   * 监听停止事件
   */
  onStop: function() {
    console.log("停止监听");
    var _this = this;
    backgroundAudioManager.onStop(function() {
      _this.data.audio.progress = 0;
      _this.data.audio.currentTime = 0;
      _this.setData({
        audio: _this.data.audio
      })
    });
  },

  /**
   * 返回进度条对象数据
   */
  progress: function() {
    let progress = {
      progress: 0
    }
    progress.progress = backgroundAudioManager.currentTime / backgroundAudioManager.duration * 100
    return progress;
  },

  /**
  * 计算并更新播放进度
  */
  onTimeUpdateProgress: function () {
    //计算播放进度相关
    let progress = this.progress();
    this.data.audio.progress = progress.progress;
    this.data.audio.currentTime = backgroundAudioManager.currentTime;
    this.data.audio.duration = backgroundAudioManager.duration;
    //实时更新进度
    this.setData({
      audio: this.data.audio
    });
  },


})