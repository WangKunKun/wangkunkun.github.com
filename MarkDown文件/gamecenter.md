I##GameCenter

XY相关代码位于XYApple工程里。

HM相关代码位于HMApple工程里。

XY和HM的代码类似，流程也是一样的。看看文档和注释就OK。


	
		电玩城项目里目标很多，对应关系如下（默认为iOS平台）：
		
		GameCenter_iOS_YU  街机电玩城
		GameCenter_Handheld 掌上电玩城
		Center_Happy_Winner 好运来电玩城
		Center_Winner   扑克王
		Game_Poker 天天棋牌
		GameCenter_Pocket 欢乐游戏厅
		GameCenter_iOS_Diamond 连环夺宝
		GameCenter_iOS_XY  XY平台的街机电玩城-天天游乐场
		GameCenter_YU_HM  海马平台的街机电玩城
		
1. 打包注意事项：
			
			由于上述目标公用一套工程，所以在打iOS平台的包时，需要将FCXY.h 文件里的#define PACKXY 注释掉 ，还有WKHM.h文件里的#define PACKHM注释掉。
			
			同理，打包XY时，将#define PACKHM注释掉，让#define PACKXY 生效，打包HM时，将#define PACKXY注释掉，让#define PACKHM 生效。
			
			因为HM和XY的支付在服务器端用的一套接口，所以在FCWebviewWarpper.mm文件里的137至165行，用了宏定义控制，打包XY，就让XY的宏生效，注释掉HM的，反之亦然。
			

2.	打包时注意build parse里的Copy Bundle Resources的引用资源目录是否正确3.	打包时，如果替换了资源文件，请先清除缓存，和.a文件存放在一起的包名文件。4.	宏定义设置在每个目标的build setting里的preprocessor macros里面，注意增删改查。
5. 两个XY平台小的资源目录是Res_CN_YU,Res_EN.



另外对Cocos2d-X的EditBox文件做了一些修改 主要就是把图片的倍数从定值改为了EAGView的ContentScaleFactor属性，适配plus机型。
没事多看看底层，说不定哪天就要你解决了~~


##Fishing

1. WKWebViewController

		捕鱼要求支付宝支付弹出页面时，需为竖屏，由于游戏中只有一个VC，所以只能新建VC实现横竖屏切换。 已配置OK。  
		问题：iOS9 在竖屏模式下键盘弹出为横屏，需纠正。
		解决方案：1. 通过通知中心监听键盘弹出，强制更改键盘弹出样式和frame
				 2. 自定义键盘，让它弹出，也是通过通知中心控制让其弹出。
		必须要等捕鱼上架了之后才能测试，所以就留给你了。
		支付宝支付页面的横竖屏配置在FCWebViewApple.mm 一个宏定义
		#define HENG 1 //注释掉则为竖屏 详细代码内含注释
		
2. 捕鱼内购

		捕鱼的内购和GameCenter的不同，是在JS直接调用OC的东西，没有通过网页，是在HRechargeManager.mm里的 recharge:方法。
	


##其他

###如果是新项目，新工程，无法打包
**问题如下：**

		1. 头文件问题（路径设置）
		2. LiblibFCExtentions库没支持CPU架构arm64（添加arm64）
		3. build setting里面的llvm里的Generate test coveage files 和 Instrument program Flow 设为YES
		4. FCUtlApple.mm 文件里30行 获得外部VC 注释掉。（485，486行更改为获得rootvc，推送VC进入，不要告诉我你不知道如何获得）
		5. FCScoail.cpp里的 #ifdef win32 和 # endif 需要注释
		6. RootAPI.h 中注释掉691和700行（JS::IsInRequst（cx））
		7. 删除Build Phases->copy Bundle Resources里的无效资源
		8. build phases-> run script脚本运行的路径问题
		9. 如果发生崩溃在Scoripting.cpp的CreatGold...，需要注释掉JSPubtd.h的23至25行
		
如果还不能解决，那么就对比一下fishing和gamecenter的文件吧。 
		
###JS，C++，OC之间的调用关系

请详细查看 FCSocail 和FCWebView类。
还可以去百度一下. 
推荐[老G小屋](http://goldlion.blog.51cto.com/)的博客，里面有一套详细的解释。	

###支付

支付全部都在FCWebViewWarpper.mm里，主要是通过点击网页按钮，更改webview的url，调用webview的代理方法 sholdstartloadwithrequest 方法，然后对url进行解析区分支付。

###第三方分享

在UMengSocial.xcodeproj下的FCSocialApple.mm文件里面的shareWithPaltform函数里面实现的。
###截取全屏在libFCExternsion.xcodeproj下的FCUtl里面的getSceneTexture函数，在iOS里面被FCUtlApple里面继承后实现的。
###本地通知
在FCUtl类里面的CreateLocalNotify函数里。
###创建iOS原生照相和相册功能
FCUtl类的createTextFiled函数
###调用iOS原声照相和相册功能
FCUtl里面的openSelectPhoto函数，里面有获取相片后压缩，转成base64上传服务器。
###获取iOS联网情况reachability 这个应该很熟悉才对哇~