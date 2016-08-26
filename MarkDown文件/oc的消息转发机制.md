#OC的消息转发机制

众所周知，OC中的方法调用是利用消息转发实现的。

		[obj foo] 等同于 objc_msgSend(obj,@selector(foo))

首先我们来了解一下类的底层构造如下：

		struct objc_class {
		  Class isa OBJC_ISA_AVAILABILITY; //isa指针
		  #if !__OBJC2__
		  Class super_class OBJC2_UNAVAILABLE; // 父类
		  const char *name OBJC2_UNAVAILABLE; // 类名
		  long version OBJC2_UNAVAILABLE; // 类的版本信息，默认为0
		  long info OBJC2_UNAVAILABLE; // 类信息
		  long instance_size OBJC2_UNAVAILABLE; // 类占据的内存大小
		  struct objc_ivar_list *ivars OBJC2_UNAVAILABLE; // 成员变量链表
		  struct objc_method_list **methodLists OBJC2_UNAVAILABLE; // 方法链表
		  struct objc_cache *cache OBJC2_UNAVAILABLE; // 方法缓存列表
		   struct objc_protocol_list *protocols OBJC2_UNAVAILABLE; // 协议链表
		  #endif
		  } OBJC2_UNAVAILABLE;

objc在向一个对象发送消息时，runtime库会根据对象的isa指针找到该对象实际所属的类，然后在该类中的方法列表以及其父类方法列表中寻找方法运行。

如果在层层的寻找中，均未找到方法的实现，就是会抛出`unrecognized selector sent to XXX`的异常，导致程序崩溃。

在这之前OC的运行时提供了三次拯救程序的机会。

下述代码均放在 为可能出现方法非法调用的类书写的类目中。

1. Method resolution
 
		#pragma mark 消息转发第一步(实例) 
		//实例方法
		+ (BOOL)resolveInstanceMethod:(SEL)sel
		{
		    //可利用sel得到具体调用的方法，进而为方法列表添加不同的方法
		    class_addMethod([self class], sel, (IMP)test, "Test");
		    return [super resolveInstanceMethod:sel];
		}
		如此便达到了，当此类调用未定义的实例方法时，自动调用test函数，而避免了崩溃的情况。
		类方法亦如此。

2. Fast forwarding （方法转发）

		#pragma mark 消息转发第二步， 第一步失败后执行
		#pragma mark 其实只要返回对象不为self 和 nil  就会把消息转发给返回的对象
		- (id)forwardingTargetForSelector:(SEL)aSelector
		{
		    NSString * str = NSStringFromSelector(aSelector);
		    NSString * obj = [NSString stringWithFormat:@"1234567"];
		    NSLog(@"方法 %@ 即将转发给 Class %@",str,[obj class]);
		    return obj;
		}

3. Normal forwarding

		首先会调用- (NSMethodSignature *)methodSignatureForSelector:(SEL)aSelector 方法，倘若返回值为nil，则runtime会发出doesNotRecognizeSelector:消息，引发异常，程序崩溃。
		如果返回了一个合理的函数签名，Runtime就会创建一个NSInvocation对象并发送-forwardInvocation:消息给目标对象。
		#pragma mark 消息转发第三步，前两步失败后到这里
        - (NSMethodSignature *)methodSignatureForSelector:(SEL)aSelector
        {
        /**
         *  参数列表
         *         = char *
         char BOOL = c
         :         = SEL
         ^type     = type *
         @         = NSObject *
         ^@        = NSError **
         #         = NSObject
         等等签名信息
         然而我并不知道如何解析~~
         */

        //生成一个签名返回 可以和SEL毫无关系
        return [NSMethodSignature signatureWithObjCTypes:"@@:"];
        }

        //返回签名后调用此方法，在参数中已经存储了SEL信息，简易的异常处理，可提示所有类的非法方法调用，不崩溃。
        - (void)forwardInvocation:(NSInvocation *)anInvocation
        {
        NSString * key = NSStringFromSelector([anInvocation selector]);
        NSLog(@"Class %@ can't responer %@ methond",[self class],key);
        }
	

至此我不由想到，如果为NSObject书写一个类目，覆写上述方法，则就不会出现`unrecognized selector sent to XXX`的异常导致程序崩溃了。

**事实如此。。但是并没有什么卵用~~**

不过在请求数据时候，数据为NSNull时很容易引发上述异常，[解决方案](http://www.cocoachina.com/industry/20140424/8225.html)就是运用了消息转发机制的最后一道守护。


