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
	 	//this.button.html(percent);
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
	};


	var Gameobj = (function() {
	    var game;
	    var score = 0;
	    var music = {};
	    var playerDie = false;
	    var overlaped = false;
	    var bootState = {
	        init: function () {
	            console.log('boot')
	        },
	        preload:function(){
	            game.load.baseURL = 'images/';
	            game.load.crossOrigin = "Anonymous";//允许图片资源跨域

	        },
	        create: function () {
	            //适配屏幕
	            //game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
	            game.scale.parentIsWindow = true;

	            //  启动物理引擎
	            game.physics.startSystem(Phaser.Physics.ARCADE);
	            game.state.start('load');
	        }
	    };

	    var loadState = {
	        init: function () {
	            console.log('load')
	        },
	        preload: function () {
	            game.load.image('bg','bgzhu.jpg');
	        	game.load.atlas('sprite','spritesheet.png', 'sprites.json');
	        	game.load.image('dian','dian.png');
	        	game.load.spritesheet('time', 'time.png', 86, 289,15);
	        	game.load.spritesheet('mao1', 'mao1.png', 220, 225,10);
	        	game.load.spritesheet('mao2', 'mao2.png', 202, 419,2);
	        	game.load.spritesheet('mao3', 'mao3.png', 177, 241,12);
	        	game.load.spritesheet('mao4', 'mao4.png', 196, 150,10);
	        	game.load.spritesheet('mao5', 'mao5.png', 334, 243,3);
	        	game.load.spritesheet('mao6', 'mao6.png', 158, 167,2);
	        	game.load.image('success', 'success.png');
	        	game.load.image('cat1', 'zmao1.png');
	        	game.load.image('cat2', 'zmao2.png');
	        	game.load.image('cat3', 'zmao3.png');
	        	game.load.image('cat4', 'zmao4.png');
	        	game.load.image('cat5', 'zmao5.png');
	        	game.load.image('cat6', 'zmao6.png');
	        	game.load.image('jia1', 'success.png');
	        	game.load.image('gangbg', 'gangbg.png');
	        },
	        create: function () {
	            game.state.start('play');
	        },
	        loadUpdate: function () {
	        }
	    };

	    var playState = {
	        init: function () {
	            console.log("play");
	        },
	        create: function () {
	            var bg = game.add.tileSprite(0,0,750,4003,'bg'); 
	            bg.autoScroll(0,-420);
	            game.input.onTap.addOnce(this.catch, this);

	            this.gangbg = game.add.image(640,672,'gangbg');
	            this.gangbg.anchor.setTo(0,0.5);
	            //时间
	            this.times = game.add.sprite(635, 20, 'time');
	            this.times.animations.add('dong');
	            this.times.animations.play('dong',1,false);
	            //猫
	            this.maos = game.add.group();
	            this.maos.enableBody = true;
	            game.physics.arcade.enable(this.maos);

	            this.mao1 = this.maos.create(60, 2010, 'mao1');
	            //this.mao1 = game.add.sprite(60, 2010, 'mao1');
	            this.mao1.animations.add('dong');
	            this.mao1.animations.play('dong',5,true);
	            this.mao1.kind = 'cat1';
	          	
	            this.mao2 = this.maos.create(60, 1370, 'mao2');
	            this.mao2.animations.add('dong');
	            this.mao2.animations.play('dong',3,true);
	            this.mao2.kind = 'cat2';

	            this.mao3 = this.maos.create(60, 640, 'mao3');
	            this.mao3.animations.add('dong');
	            this.mao3.animations.play('dong',5,true);
	            this.mao3.kind = 'cat3';

	            this.mao4 = this.maos.create(60, 2560, 'mao4');
	            this.mao4.animations.add('dong');
	            this.mao4.animations.play('dong',5,true);
	            this.mao4.kind = 'cat4';

	            this.mao5 = this.maos.create(60, 3700, 'mao5');
	            this.mao5.animations.add('dong');
	            this.mao5.animations.play('dong',5,true);
	            this.mao5.kind = 'cat5';

	            this.mao6 = this.maos.create(100, 3010, 'mao6');
	            this.mao6.animations.add('dong');
	            this.mao6.animations.play('dong',3,true);
	            this.mao6.kind = 'cat6';
	            game.physics.arcade.enable(this.mao1);
	            game.physics.arcade.enable(this.mao2);
	            game.physics.arcade.enable(this.mao3);
	            game.physics.arcade.enable(this.mao4);
	            game.physics.arcade.enable(this.mao5);
	            game.physics.arcade.enable(this.mao6);
	            this.mao1.body.immovable = true;
	            this.mao2.body.immovable = true;
	            this.mao3.body.immovable = true;
	            this.mao4.body.immovable = true;
	            this.mao5.body.immovable = true;
	            this.mao6.body.immovable = true;
	            this.mao1.body.velocity.y = -420;
	            this.mao2.body.velocity.y = -420;
	            this.mao3.body.velocity.y = -420;
	            this.mao4.body.velocity.y = -420;
	            this.mao5.body.velocity.y = -420;
	            this.mao6.body.velocity.y = -420;
	            //机械臂
	            this.hand = game.add.sprite(650,672,'sprite','gang');
	            this.hand.enableBody = true;
	            game.physics.arcade.enable(this.hand);
	            this.hand.anchor.setTo(0,0.5);
	            this.dian = game.make.sprite(-44,-15,'dian');
	            this.hand.addChild(this.dian);
	            this.left = this.dian.addChild(game.make.sprite(20,18,'sprite','zhua1'));
            	this.right = this.dian.addChild(game.make.sprite(20,18,'sprite','zhua2'));
	        	this.left.anchor.setTo(1,1);
           		this.right.anchor.setTo(1,0);

           		//计时器
           		this.timer = game.time.create();
            	this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 15, endGame, this);
            	this.timer.start();
            	this.jia1 = game.add.image(550,672,'jia1');
            	this.jia1.anchor.setTo(0,0.5);
            	this.jia1.alpha = 0;
	        },
	        update: function () {
	        	var that = this;
	        	game.physics.arcade.overlap(that.hand, that.maos, that.judgeCatch, null, this);
	            if (this.timer.running) {
	                
	            }
	            if(this.hand.x < 250){
	                game.add.tween(this.right).to({angle:0}, 150, Phaser.Easing.Linear.None,true);
	                game.add.tween(this.left).to({angle:0}, 150, Phaser.Easing.Linear.None,true);
	                this.hand.body.velocity.x = 0;
	                game.add.tween(this.hand).to({x:650}, 700, Phaser.Easing.Linear.None,true).onComplete.addOnce(function () {
	                    game.input.onTap.addOnce(that.catch, that);
	                    overlaped = false;
	                },this);
	            }
	        },
	        start: function () {
	            
	        },
	        //抓取
	        catch: function () {
	            game.add.tween(this.left).to({angle:30}, 400, Phaser.Easing.Linear.None,true);
	            game.add.tween(this.right).to({angle:-30}, 400, Phaser.Easing.Linear.None,true);
	            this.hand.body.velocity.x = -450;
	        },
	        judgeCatch: function (hand,animal) {
	        	
	        	var that = this;
	            if(overlaped){
	                return;
	            }
	            overlaped = true;
	            //var positionDiff = Math.abs(hand.y - animal.y);
	            var animalPicked = false;
	      		//console.log(positionDiff);
	      		//console.log(animal.kind);

	            //if(positionDiff < 50){
	                animal.kill();
	                game.add.tween(this.right).to({angle:20}, 100, Phaser.Easing.Linear.None,true);
	                game.add.tween(this.left).to({angle:-20}, 100, Phaser.Easing.Linear.None,true);
	                if(animal.kind !== "mao6"){
	                	animalPicked = game.make.sprite(-40,5,animal.kind);
	            		animalPicked.anchor.setTo(1,0.5);
	                }else{

	                }
	                hand.addChild(animalPicked);
	           // }
	            /*else {
	                game.add.tween(this.miss).to({alpha:1}, 500, Phaser.Easing.Linear.None,true).yoyo(true);
	                $("#miss")[0].play();
	                game.add.tween(this.right1).to({angle:0}, 200, Phaser.Easing.Linear.None,true);
	                game.add.tween(this.left1).to({angle:0}, 200, Phaser.Easing.Linear.None,true);
	            }*/
	            hand.body.velocity.x = 0;
	            game.add.tween(hand).to({x:650}, 700, Phaser.Easing.Linear.None,true).onComplete.add(function () {
	                game.input.onTap.addOnce(that.catch, that);
	                if(animalPicked){
	                    hand.removeChild(animalPicked);
	                    score += 1;
	                    game.add.tween(this.jia1).to({alpha:1}, 300, Phaser.Easing.Linear.None,true).yoyo(true);
	                }
	                this.left.angle = 0;
	                this.right.angle = 0;
	                overlaped = false;
	            },this);
	        }
	    };
	    var overState = {
	        highScore:null,
	        init: function () {
	        	$("#result").show();
	    		$("#game").html("");
	    		$("#nummao").html(score);
	        },
	        create: function () {
	            
	        },
	        showShare: function () {
	            
	        },
	        restart: function () {
	            
	        },
	    };
	    function endGame() {
	    	game.state.start('over');        
   		}

	    //初始化游戏
	    function init() {
	        game = new Phaser.Game(750, 1334, Phaser.AUTO, 'game');
	        game.preserveDrawingBuffer = true;
	        game.state.add('boot', bootState);
	        game.state.add('load', loadState);
	        game.state.add('play', playState);
	        game.state.add('over', overState);
	         game.state.start('boot');
	    }

	    return {
	        init:init,
	        start:function () {
	           /* document.getElementById('game-wrapper').style.display = 'block';
	            document.getElementById('share-wrapper').style.display = 'none';
	            $('.share-wrapper .share-img').hide();
	            game.state.start('menu');*/
	           game.state.start('play');
	        }
	    };
	})();

	var mainFun = {
		music:true,
		num:0,
		index:0,
		init:function(){
			this.handle();
			this.initMusic();
			//this.load();
			//this.weixinshare();	
			Gameobj.init();		
		},
		load:function(){
			var that = this;
			var imgArrr = [
					'bgzhu.jpg',
					'bg.png',
					'btng.png',
					'guang.png',
					'hrefs.png',
					'lights.png',
					'word.png',
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
					'spritesheet.png',
					'success.png',
					'zmao6.png'
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
			$("#restart").bind(startevent,function(e){
				window.location.reload();
			});
			$("#hrefs").bind(startevent,function(e){
				window.location.href = "https://weibo.com/lovesupie?refer_flag=1001030103_";
			});
			$("#share").bind(startevent,function(e){
				
			});
			$("#start").bind(startevent,function(e){

				$(".mc").each(function(k,v){
					var time = 500 + k*200;
					console.log(time);
					$(this).animate({
						left:"-750px"
					},time)
				})
				window.setTimeout(function(){
					$("#index").hide();
					$("#game").show();
					Gameobj.start();
				},2200);
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