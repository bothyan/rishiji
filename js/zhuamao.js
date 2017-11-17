(function($){
	var startevent = 'touchstart' in document.documentElement ? "touchstart" : "mousedown";
    var endevent = 'touchend' in document.documentElement ? "touchend" : "mouseup";	

    /*  动画帧函数
	** num   帧数量
    ** time  切换时间
    ** row 行数
    ** col 列数  
	*/

	function frameAni(dom,num,time,row,col,width,height){
		this.$dom = dom;
		this.num = num;
		this.time = time;
		this.row = row;
		this.col = col;
		this.timer = null;
		this.defaults = 0;
		this.width = width;
		this.height = height;
	}
	frameAni.prototype.animates = function(){
		var that = this;
		that.timer = window.setInterval(function(){
			var r = Math.floor(that.defaults/that.col),l = that.defaults%that.col;
			var x = - r*that.height,y = - l*that.width;
			that.$dom.css('background-position', y+'px '+x+'px');
			if(that.defaults == (that.num-1)){
				that.defaults = 0;
			}else{
				that.defaults++;
			}
		},that.time)
	}
	frameAni.prototype.cancelAni = function(){
		window.clearInterval(this.timer);

	}

	/*  预加载资源
	** initTag   是否已加载
    ** imgDomin  加载资源域名
    ** loadCount 初始加载资源数0  
	*/

	function preLoadimg(options){
		this.initTag = true;
		this.loadCount = 0;
		this.imgDomin = "images/";
		this.preLoadingImgData = options.preLoadingImgData;
		this.button = options.button;
		this.callback = options.callback || function(){};
	}
	preLoadimg.prototype.init = function(){
		var that = this;
		that.initTag = false;
		that.preLoadingImgData = that.preLoadingImgData.map(function(item,index){
			return that.imgDomin + item;
		});
		this.preLoading(0);
	}
	preLoadimg.prototype.preLoading = function(i){
		var that = this;
		var _img = new Image();
		var isloaded=false;
		_img.src=this.preLoadingImgData[i];
		console.log(this.preLoadingImgData[i]);
		this.loadCount++;
		var count = this.loadCount,imglength = this.preLoadingImgData.length;
		var percent=parseInt(count/imglength*100);
		// 显示百分比
	 	this.button.html(percent);
		if(count==imglength){
			// loading结束
			$("#loading-img").remove();	
			//this.button.html("");		
			window.setTimeout(function(){
				that.callback();
			},100)				
		}
		$("#loading-img").append($(_img));
		var timer=null;
		timer=setInterval(function(){
			if($(_img).height()){
				$("#loading-img").html("");	
				clearInterval(timer);
				if(count<imglength){
					that.preLoading(count);
				}
			}
		},10);	
	};

	/*  音乐转动
	** dom   音乐转动dom
    ** bgm   音乐资源dom
	*/
	var musicRotate = {
		dom:$("#music"),
		bgm:$("#bgm"),
		musicTnter:null,
		angle:0,
		rotateTag:true,
		init:function(){
			var that = this;
			that.bgm[0].play();
			that.dom.bind(startevent,function(){
				if(that.rotateTag){
					window.clearInterval(that.musicTnter);
					that.bgm[0].pause();
					that.rotateTag = false;
				}else{
					that.animate();
					that.bgm[0].play();
					that.rotateTag = true;
				}
			});
			that.animate();
		},
		animate:function(){
			var that = this;
			that.musicTnter = setInterval(function(){
			    that.angle +=3;
			    that.dom.rotate(that.angle);
			}, 50);
		}
	}

	var mainFun = {
		music:true,
		num:0,
		index:0,
		init:function(){
			
			this.handle();
			this.initMusic();
			this.load();
			//this.weixinshare();
		},
		load:function(){
			var that = this;
			var imgArrr = [
					'bgzhu.png',
					'bg.png',
					'btng.png',
					'guang.png',
					'hrefs.png',
					'lights.png',
					'load1.png',
					'load2.png',
					'load3.png',
					'load4.png',
					'load5.png',
					'logo.png',
					'mao.png',
					'mao1.png',
					'mao2.png',
					'mao3.png',
					'mao4.png',
					'mao5.png',
					'mao6.png',
					'musicicon.png',
					'restart.png',
					'share.png',
					'time.png',
					'spritesheet.png'
				];
			var options = {
				preLoadingImgData:imgArrr,
				button:$("#percent em"),
				callback:function(){	
					$("#loading").remove();
					$(".index").show();
					//that.start();
				}
			};
			new preLoadimg(options).init();
		},
		weixinshare:function(){
			$.ajax({
				url:"http://e.h5designer.com/WxApi/getSignPackage",
				type:"get",
				dataType: "json",
				success:function(res){
					var sharedata = res.data;
					wx.config({
				        debug: false,
				        appId: sharedata.appId,
				        timestamp: sharedata.timestamp,
				        nonceStr: sharedata.nonceStr,
				        signature: sharedata.signature,
				        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"]
				    });	
				    wx.ready(function () {
				    	wx.onMenuShareTimeline({
		                    title: shareMsg.title,
		                    link: shareMsg.link,
		                    imgUrl: shareMsg.imgUrl,
		                    success: function () {
		                    }
		                });
		                wx.onMenuShareAppMessage({
		                    title: shareMsg.title,
		                    desc: shareMsg.des,
		                    link: shareMsg.link,
		                    imgUrl: shareMsg.imgUrl,
		                    type: "",
		                    dataUrl: "",
		                    success: function () {
		                    }
		                });
		                wx.onMenuShareQQ({
		                    title: shareMsg.title,
		                    desc: shareMsg.des,
		                    link: shareMsg.link,
		                    imgUrl: shareMsg.imgUrl,
		                    success: function () {
		                    }
		                });
		                wx.onMenuShareWeibo({
		                    title: shareMsg.title,
		                    desc: shareMsg.des,
		                    link: shareMsg.link,
		                    imgUrl: shareMsg.imgUrl,
		                    success: function () {
		                    }
		                });
		                wx.onMenuShareQZone({
		                    title: shareMsg.title,
		                    desc: shareMsg.des,
		                    link: shareMsg.link,
		                    imgUrl: shareMsg.imgUrl,
		                    success: function () {
		                    }
		                })
					});
				}
			})
		},
		editweixinshare:function(){
			wx.ready(function () {
				wx.onMenuShareTimeline({
	                title: shareMsg.title,
	                link: shareMsg.link,
	                imgUrl: shareMsg.imgUrl,
	                success: function () {
	                }
	            });
	            wx.onMenuShareAppMessage({
	                title: shareMsg.title,
	                desc: shareMsg.des,
	                link: shareMsg.link,
	                imgUrl: shareMsg.imgUrl,
	                type: "",
	                dataUrl: "",
	                success: function () {
	                }
	            });
	            wx.onMenuShareQQ({
	                title: shareMsg.title,
	                desc: shareMsg.des,
	                link: shareMsg.link,
	                imgUrl: shareMsg.imgUrl,
	                success: function () {
	                }
	            });
	            wx.onMenuShareWeibo({
	                title: shareMsg.title,
	                desc: shareMsg.des,
	                link: shareMsg.link,
	                imgUrl: shareMsg.imgUrl,
	                success: function () {
	                }
	            });
	            wx.onMenuShareQZone({
	                title: shareMsg.title,
	                desc: shareMsg.des,
	                link: shareMsg.link,
	                imgUrl: shareMsg.imgUrl,
	                success: function () {
	                }
	            })
	        });
		},
		start:function(){
			musicRotate.init();
			this.audioAutoPlay('bgm');			
		},
		handle:function(){
			var that = this;
			$("body").bind("touchmove",function(e){
				e.preventDefault();		
			});
			
		},
		audioAutoPlay:function(id){
			var audio = document.getElementById(id),
		        play = function(){
		        	audio.play();
		        	document.removeEventListener("touchstart",play, false);
		    	};
		    audio.play();
		    document.addEventListener("WeixinJSBridgeReady", function () {
		        play();
		    }, false);
		    document.addEventListener("touchstart",play, false);
		},
		initMusic:function(){
			document.addEventListener("WeixinJSBridgeReady", function () {
				/*$("#bgm")[0].play();
	            $("#buttonm")[0].pause();
	            $("#bgm1")[0].pause();
	            $("#bgm2")[0].pause();
	            $("#bgm3")[0].pause();
	            $("#bgm4")[0].pause();
	            $("#bgm5")[0].pause();
	            $("#bgm6")[0].pause();
	            $("#bgm7")[0].pause();
	            $("#bgm8")[0].pause();*/
	        }, false);
		}
	};

	mainFun.init();
	var $content = $(".content");
	var k=1334/750;//设计稿宽高比
    function orientationfn() {
        setTimeout(function () {
            var html = document.documentElement;
            var w = $("body").width(), h = $("body").height();
            var scale = 1;
            if (h < w) {//横屏               
                scaleX = h/750;
                scaleY = w/1334;         
                $content.css({transform:"translate(-50%,-50%) rotate(-90deg) scale("+ scaleX + ", "+scaleY+ ")"});
            }
            else {//竖屏
                scaleX = w/750;
                scaleY = h/1334;
                $content.css({transform: "translate(-50%,-50%)  scale("+ scaleX + ", "+scaleY+ ")"});
            }
        }, 200);
    }
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", orientationfn, false);
    orientationfn();

 })(jQuery);  