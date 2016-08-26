#工欲善其事，必先利其器
***


>在我为期不长的iOS开发过程中，在浏览众多论坛和博客时，发现几乎处处都能发现关于辅助开发的工具——Mac应用和XCode插件。

***今天就来提笔写一写，我所使用的辅助开发工具。***

## Mac应用篇
***
### Dash——官方文档查看工具。
>利用Dash可以便捷的下载和查看苹果所有的官方文档（iOS7,OC,Swift等）。

<img src="/images/tools/1.png">

<img src="/images/tools/2.png">


>在Dash中也可下载其他语言的的官方文档，甚至可以下载Cocoapods里面支持的各类XCode插件的相关文档，以及在里面可以实时/离线的访问StackOverflow。



<img src="/images/tools/3.png">



<img src="/images/tools/4.png">


<img src="/images/tools/5.png">


>除此之外，它还能被集成进XCode，作为XCode的插件使用。


<img src="/images/tools/6.png">


>进入下载页面，点击上图中的1，再点击2，即可进入github中下载Dash插件然后进行安装。

使用方法：

<img src="/images/tools/7.gif">



***优点***：便捷下载各类文档，可合并到XCode中使用。（并不仅限于iOS开发）
***缺点***：免费使用情况下，每一次切换文档会有8秒的延时，并且应用必须处于最上层，才会计时。

<img src="/images/tools/8.png">


###[Reveal](revealapp.com/)——UI界面调试工具
>使用Reveal,可以在应用运行时查看和修改UI界面，清楚的了解当前界面上UI的层级关系。

<img src="/images/tools/reveal1.png">


使用展示：

<img src="/images/tools/reveal2.gif">


####安装Reveal后，我使用的是不修改Xcode工程就加载使用Reveal的方法。

- 在终端中新建一个.lldbinit文件，位置是~/.lldbinit，这是一个启动LLDB时都会调用的文件。（命令是：vim ~./lldbinit）
在.lldbinit文件中键入如下内容
`command alias reveal_load_sim expr (void*)dlopen("/Applications/Reveal.app/Contents/SharedSupport/iOS-Libraries/libReveal.dylib", 0x2);`
`command alias reveal_load_dev expr (void*)dlopen([(NSString*)[(NSBundle*)[NSBundle mainBundle] pathForResource:@"libReveal" ofType:@"dylib"] cStringUsingEncoding:0x4], 0x2);`
`command alias reveal_start expr (void)[(NSNotificationCenter*)[NSNotificationCenter defaultCenter] postNotificationName:@"IBARevealRequestStart" object:nil];`
`command alias reveal_stop expr (void)[(NSNotificationCenter*)[NSNotificationCenter defaultCenter] postNotificationName:@"IBARevealRequestStop" object:nil];`
- 保存并退出.lldbinit文件。（在vim的命令行模式键入:wq）

>上面四行代码，实质是命名了四个别名命令。
        reveal_load_sim 为模拟器加载reveal调用用的动态链接库
        reveal_load_dev 为模拟器加载reveal调用用的动态链接库
        reveal_start 启动reveal调试功能
        reveal_stop 关闭reveal调试功能


> 注：上述加载命令，必须保证reveal这个应用是位于你的Applications文件夹中的。
<img src="/images/tools/reveal3.png">


- 打开你想要进行界面调试的工程，在Appdelegate.m文件中`- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions`上述方法体内
 1. *设置一个断点*
 2. *右击该断点，选择"Edit Brearkpoint"*
 3. *单击"Action"选项卡右端的"+"号按钮，输入"reveal_load_sim"*
 4. *如法炮制，再点击一次“+”号按钮，输入"reveal_start"*
 5. *勾选“Option”上的“Automatically continue after evalating”选项。*

> 上述表明，在LLDB调试器运行时，在断点处执行reveal_load_sim和reveal_start，则是在应用编译运行时，自定导入加载Reveal，进行界面调试

<img src="/images/tools/reveal4.png">


演示操作：
        
<img src="/images/tools/reveal5.gif">


**注：在模拟器中切换页面后，需要点击reveal右上的“刷新”按钮，才会更新reveal中的界面和模拟器中的同步。**

***优点***：实时查看和修改自己的UI界面。

***缺点***：未知~（由于接触reveal时间擅浅，望各路英雄好汉指点~~）

***附录***：


