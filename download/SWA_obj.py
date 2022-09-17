from manimlib import *


class obj(Scene):
    def construct(self):
        def page1(self):
            t1 = Text("滑动窗口算法一般运用在字符串处理中")
            t2 = Text("滑动窗口算法过程如同名字一样")
            t3 = Text("它是通过模拟一个窗口，并在字符串中滑动来进行处理")
            t4 = Text("根据窗口大小分为可变滑动窗口和固定滑动窗口")
            t5 = Text("下面来演示一下滑动窗口算法过程").shift(DOWN*0.6)

            self.play(Write(t1))
            self.wait(0.5)
            self.play(ApplyMethod(t1.shift, UP*0.6))
            self.play(Write(t2))
            self.wait(0.5)
            self.play(ApplyMethod(VGroup(t1, t2).shift, UP*0.6))
            self.play(Write(t3))
            self.wait(0.5)
            self.play(ApplyMethod(VGroup(t1, t2, t3).shift, UP*0.6))
            self.play(Write(t4))
            self.wait(0.5)
            self.play(Write(t5))
            self.wait(1)
            self.play(FadeOut(VGroup(t1, t2, t3, t4, t5)))

        def page2(self):
            title1 = Title("Sliding Window Algorithm")
            t1 = Text("假设我们要对 3285736234 求三个相邻数字最大和", t2c={
                      '3285736234': RED}).next_to(title1, DOWN)
            code1 = Code(
                """s = '3285736234'
left, right = 0, 3
max_sum, max_num = 0, ''
while right<=len(s):
    if right!=len(s):
        _sum = sum(map(int, s[left:right]))
        num = s[left:right]
    else:
        _sum = sum(map(int, s[left:]))
        num = s[left:]
    if _sum>max_sum:
        max_sum, max_num = _sum, num
    left, right = left+1, right+1
print(max_sum, max_num)""").to_edge(LEFT).shift(DOWN*0.9+RIGHT*0.7)
            arrow1 = Arrow(start=ORIGIN, end=RIGHT).set_color(
                RED).to_edge(LEFT).shift(UP*1.45)
            t2 = Text("我们来模拟运行一下这个代码").to_edge(RIGHT).shift(LEFT*0.5)
            target_string = Text("3 2 8 5 7 3 6 2 3 4", color=RED).to_edge(
                RIGHT).shift(LEFT*0.7+UP*1.4)
            window = Rectangle(color=BLUE).set_fill(
                color=BLUE, opacity=0.15).surround(target_string[0:5])
            max_sum = Text("max_sum = ", color=BLUE)
            max_sum = VGroup(max_sum, DecimalNumber(00, num_decimal_places=0).next_to(
                max_sum, RIGHT).shift(UP*0.05)).next_to(target_string, DOWN).shift(LEFT*2+DOWN*2.5)
            max_num = Text("max_num = ", color=YELLOW)
            max_num = VGroup(max_num, DecimalNumber(000, num_decimal_places=0).next_to(
                max_num, RIGHT).shift(UP*0.05)).next_to(target_string, DOWN).shift(RIGHT*1.2+DOWN*2.5)
            _sum = Text("_sum = ", color=BLUE)
            _sum = VGroup(_sum, DecimalNumber(13, num_decimal_places=0).next_to(
                _sum, RIGHT).shift(UP*0.05)).next_to(target_string, DOWN).shift(LEFT*2+DOWN)
            num = Text("num = ", color=YELLOW)
            num = VGroup(num, DecimalNumber(328, num_decimal_places=0).next_to(
                num, RIGHT).shift(UP*0.05)).next_to(target_string, DOWN).shift(RIGHT+DOWN)

            def arrow_down(arrow=arrow1, self=self, times=1):
                self.play(ApplyMethod(arrow.shift, DOWN*0.36*times))

            def arrow_up(arrow=arrow1, self=self, times=1):
                self.play(ApplyMethod(arrow.shift, UP*0.36*times))

            def window_move(times, self=self, target_string=target_string, window=window):
                self.play(ApplyMethod(window.surround,
                          target_string[2*times:5+2*times]))

            self.play(Write(title1))
            self.wait(0.5)
            self.play(Write(t1))
            self.wait(0.5)
            self.play(Write(code1))
            self.wait(0.5)
            self.play(FadeIn(t2))
            self.wait(1)
            self.play(FadeOut(t2))
            self.play(FadeIn(arrow1))
            self.wait(0.7)
            self.play(Write(target_string))
            arrow_down()
            self.wait(0.7)
            self.play(FadeIn(window))
            arrow_down()
            self.wait(0.7)
            self.play(Write(VGroup(max_sum, max_num)))
            arrow_down()
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            self.play(Write(_sum[0]))
            self.play(TransformFromCopy(target_string[0:5], _sum[1]))
            arrow_down()
            self.wait(0.7)
            self.play(Write(num[0]))
            self.play(TransformFromCopy(target_string[0:5], num[1]))
            arrow_down(times=4)
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(_sum[1], max_sum[1].set_value(_sum[1].get_value(
            ))), TransformFromCopy(num[1], max_num[1].set_value(num[1].get_value())))
            arrow_down()
            self.wait(0.7)
            window_move(1)
            arrow_up(times=9)
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[2:7], _sum[1].set_value(15)))
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[2:7], num[1].set_value(285)))
            arrow_down(times=4)
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(_sum[1], max_sum[1].set_value(_sum[1].get_value(
            ))), TransformFromCopy(num[1], max_num[1].set_value(num[1].get_value())))
            arrow_down()
            self.wait(0.7)
            window_move(2)
            arrow_up(times=9)
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[4:9], _sum[1].set_value(20)))
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[4:9], num[1].set_value(857)))
            arrow_down(times=4)
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(_sum[1], max_sum[1].set_value(_sum[1].get_value(
            ))), TransformFromCopy(num[1], max_num[1].set_value(num[1].get_value())))
            arrow_down()
            self.wait(0.7)
            window_move(3)
            arrow_up(times=9)
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[6:11], _sum[1].set_value(15)))
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[6:11], num[1].set_value(573)))
            arrow_down(times=4)
            self.wait(0.7)
            arrow_down(times=2)
            self.wait(0.7)
            window_move(4)
            arrow_up(times=9)
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[8:13], _sum[1].set_value(16)))
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[8:13], num[1].set_value(736)))
            arrow_down(times=4)
            self.wait(0.7)
            arrow_down(times=2)
            self.wait(0.7)
            window_move(5)
            arrow_up(times=9)
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[10:15], _sum[1].set_value(11)))
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[10:15], num[1].set_value(362)))
            arrow_down(times=4)
            self.wait(0.7)
            arrow_down(times=2)
            self.wait(0.7)
            window_move(6)
            arrow_up(times=9)
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[12:17], _sum[1].set_value(11)))
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[12:17], num[1].set_value(623)))
            arrow_down(times=4)
            self.wait(0.7)
            arrow_down(times=2)
            self.wait(0.7)
            window_move(7)
            arrow_up(times=9)
            self.wait(0.7)
            arrow_down()
            self.wait(0.7)
            arrow_down(times=4)
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[14:], _sum[1].set_value(9)))
            arrow_down()
            self.wait(0.7)
            self.play(TransformFromCopy(
                target_string[14:], num[1].set_value(234)))
            arrow_down()
            self.wait(0.7)
            arrow_down(times=2)
            self.wait(0.7)
            window_move(8)
            arrow_up(times=9)
            self.wait(0.7)
            arrow_down(times=10)
            out = Text('[Out]: 20 857', color=RED).to_edge(
                DR).shift(LEFT*1.8+UP*0.2)
            self.wait(0.7)
            self.play(Write(out))
            self.wait(2)
            self.play(FadeOut(VGroup(title1, t1, code1, arrow1,
                      target_string, window, _sum, num, max_sum, max_num, out)))

        def page3(self):
            t1 = Text("从算法的演示过程可以看到").shift(UP*1.2)
            t2 = Text("代码通过left和right设置了左右边界").shift(UP*0.4)
            t3 = Text("然后通过左右边界一起挪动构成了一个可以滑动的固定窗口").shift(DOWN*0.4)
            t4 = Text("这就是固定大小的滑动窗口算法").shift(DOWN*1.2)

            self.play(Write(t1))
            self.wait(1)
            self.play(Write(t2))
            self.wait(1)
            self.play(Write(t3))
            self.wait(1)
            self.play(Write(t4))
            self.wait(1)
            self.play(FadeOut(VGroup(t1, t2, t3, t4)))

        def page4(self):
            t1 = Text("当左边界固定，右边界随判断条件移动的时候").shift(UP*1.2)
            t2 = Text("就构成了一种不固定的滑动窗口").shift(UP*0.4)
            t3 = Text("这种滑动窗口被称为可变滑动窗口算法").shift(DOWN*0.4)
            t4 = Text("接下来简单演示一下可变活动窗口算法").shift(DOWN*1.2)

            self.play(Write(t1))
            self.wait(1)
            self.play(Write(t2))
            self.wait(1)
            self.play(Write(t3))
            self.wait(1)
            self.play(Write(t4))
            self.wait(1)
            self.play(FadeOut(VGroup(t1, t2, t3, t4)))

        def page5(self):
            title1 = Title("Sliding Window Algorithm")
            t1 = Text("假设我们要对 122333221 求最长相同数字相邻的子串", t2c={
                '122333221': RED}).next_to(title1, DOWN)
            code1 = Code(
                """s = '122333221'
left, right = 0, 1
longest = ''
s += '#'
while right<=len(s)-1:
    if s[left]==s[right]:
        right += 1
    else:
        if len(longest)<right-left:
            longest = s[left:right]
        left = right
        right += 1
print(longest)""").to_edge(LEFT).shift(DOWN*0.9+RIGHT*0.7)
            arrow1 = Arrow(start=ORIGIN, end=RIGHT).set_color(
                RED).to_edge(LEFT).shift(UP*1.29)
            t2 = Text("我们来模拟运行一下这个代码").to_edge(RIGHT).shift(LEFT*0.5)
            target_string = Text("1 2 2 3 3 3 2 2 1 #", color=RED).to_edge(
                RIGHT).shift(LEFT*1.7+UP*1.4)
            window = Rectangle(color=BLUE).set_fill(
                color=BLUE, opacity=0.15).surround(target_string[0], stretch=True).set_height(0.6, stretch=True)
            longest = Text("longest = ", color=BLUE)
            longest = VGroup(longest, DecimalNumber(1, num_decimal_places=0).next_to(
                longest, RIGHT)).next_to(target_string, DOWN).shift(DOWN)
            out = Text('[Out]: 333', color=RED).next_to(
                longest, DOWN).shift(DOWN)

            def arrow_down(arrow=arrow1, self=self, times=1):
                self.play(ApplyMethod(arrow.shift, DOWN*0.365*times))
                self.wait(0.2)

            def arrow_up(arrow=arrow1, self=self, times=1):
                self.play(ApplyMethod(arrow.shift, UP*0.365*times))
                self.wait(0.2)

            self.play(Write(title1))
            self.wait(0.5)
            self.play(Write(t1))
            self.wait(0.5)
            self.play(Write(code1))
            self.wait(0.5)
            self.play(FadeIn(t2))
            self.wait(1)
            self.play(FadeOut(t2))
            self.play(FadeIn(arrow1))
            self.wait(0.2)
            self.play(Write(target_string[:-2]))
            arrow_down()
            self.play(FadeIn(window))
            arrow_down()
            self.play(Write(longest[0]))
            arrow_down()
            self.play(Write(target_string[-2:]))
            arrow_down()
            arrow_down()
            arrow_down(times=2)
            arrow_down()
            arrow_down()
            self.play(TransformFromCopy(
                target_string[0], longest[1].set_value(1)))
            arrow_down()
            arrow_down()
            self.play(ApplyMethod(window.become, Rectangle(color=BLUE).set_fill(
                color=BLUE, opacity=0.15).surround(target_string[2], stretch=True).set_height(0.6, stretch=True)))
            arrow_up(times=7)
            arrow_down()
            arrow_down()
            self.play(ApplyMethod(window.become, Rectangle(color=BLUE).set_fill(
                color=BLUE, opacity=0.15).surround(target_string[2:5], stretch=True).set_height(0.6, stretch=True)))
            arrow_up(times=2)
            arrow_down()
            arrow_down(times=2)
            arrow_down()
            arrow_down()
            self.play(TransformFromCopy(
                target_string[2:5], longest[1].set_value(22)))
            arrow_down()
            arrow_down()
            self.play(ApplyMethod(window.become, Rectangle(color=BLUE).set_fill(
                color=BLUE, opacity=0.15).surround(target_string[6], stretch=True).set_height(0.6, stretch=True)))
            arrow_up(times=7)
            arrow_down()
            arrow_down()
            self.play(ApplyMethod(window.become, Rectangle(color=BLUE).set_fill(
                color=BLUE, opacity=0.15).surround(target_string[6:9], stretch=True).set_height(0.6, stretch=True)))
            arrow_up(times=2)
            arrow_down()
            arrow_down()
            self.play(ApplyMethod(window.become, Rectangle(color=BLUE).set_fill(
                color=BLUE, opacity=0.15).surround(target_string[6:11], stretch=True).set_height(0.6, stretch=True)))
            arrow_up(times=2)
            arrow_down()
            arrow_down(times=2)
            arrow_down()
            arrow_down()
            self.play(TransformFromCopy(
                target_string[6:11], longest[1].set_value(333).shift(DOWN*0.1)))
            arrow_down()
            arrow_down()
            self.play(ApplyMethod(window.become, Rectangle(color=BLUE).set_fill(
                color=BLUE, opacity=0.15).surround(target_string[12], stretch=True).set_height(0.6, stretch=True)))
            arrow_up(times=7)
            arrow_down()
            arrow_down()
            self.play(ApplyMethod(window.become, Rectangle(color=BLUE).set_fill(color=BLUE, opacity=0.15).surround(
                target_string[12:15], stretch=True).set_height(0.6, stretch=True)))
            arrow_up(times=2)
            arrow_down()
            arrow_down(times=2)
            arrow_down()
            arrow_down(times=2)
            arrow_down()
            self.play(ApplyMethod(window.become, Rectangle(color=BLUE).set_fill(
                color=BLUE, opacity=0.15).surround(target_string[16], stretch=True).set_height(0.6, stretch=True)))
            arrow_up(times=7)
            arrow_down()
            arrow_down(times=2)
            arrow_down()
            arrow_down(times=2)
            arrow_down()
            self.play(ApplyMethod(window.become, Rectangle(color=BLUE).set_fill(
                color=BLUE, opacity=0.15).surround(target_string[-1], stretch=True).set_height(0.6, stretch=True)))
            arrow_up(times=7)
            arrow_down(times=8)
            self.play(Write(out))
            self.wait(2)
            self.play(FadeOut(VGroup(title1, t1, code1, arrow1,
                      window, longest, out, target_string)))

        def page6(self):
            t1 = Text("依旧是通过定义左右边界的方法定义了一个滑动窗口").shift(UP*0.8)
            t2 = Text("不同之处在于可变滑动窗口的right变动的时候left不一定改变")
            t3 = Text("这个样例代码通过在字符串尾添加了特殊符号从而规避了特殊处理").shift(DOWN*0.8)
            
            self.play(Write(t1))
            self.wait()
            self.play(Write(t2))
            self.wait()
            self.play(Write(t3))
            self.wait()
            self.play(FadeOut(VGroup(t1, t2, t3)))
        
        def page7(self):
            t1 = Text("上一期视频里介绍的哈夫曼编码算法的解码过程").shift(UP*0.8)
            t2 = Text("就用到了这期介绍的可变滑动窗口的算法进行解码")
            t3 = Text("具体代码可以去www.xysama.cn进行浏览下载", t2c={"www.xysama.cn": RED}).shift(DOWN*0.8)
            
            self.play(Write(t1))
            self.wait()
            self.play(Write(t2))
            self.wait()
            self.play(Write(t3))
            self.wait()
            self.play(FadeOut(VGroup(t1, t2, t3)))
        
        def page8(self):
            t1 = Text('以上就是这期视频的全部内容，如果喜欢我的视频').shift(UP*1.6)
            t2 = Text('真心请求点个关注，顺便三连一下，感谢大佬们').shift(UP*0.8)
            t3 = Text('这对我这种小up来说真的很重要，是我支持下去的动力')
            t4 = Text('视频使用manim制作').shift(DOWN*0.8)
            t5 = Text('我会将我的视频源码放在简介和评论区链接内').shift(DOWN*1.6)
            
            self.play(Write(t1))
            self.wait()
            self.play(Write(t2))
            self.wait()
            self.play(Write(t3))
            self.wait()
            self.play(Write(t4))
            self.wait()
            self.play(Write(t5))
            self.wait()
            self.play(FadeOut(VGroup(t1, t2, t3, t4, t5)))
        
        def cover(self):
            t1 = Text("两种滑动窗口算法", font_size=60)
            t2 = Text("简介和使用样例", color=YELLOW).next_to(t1, DOWN).shift(DOWN*0.5)
            
            self.add(t1)
            self.add(t2)
        
        # page1(self)
        # self.wait()
        # page2(self)
        # self.wait()
        # page3(self)
        # self.wait()
        # page4(self)
        # self.wait()
        # page5(self)
        # self.wait()
        # page6(self)
        # self.wait()
        # page7(self)
        # self.wait()
        # page8(self)
        cover(self)
        # self.embed()


if __name__ == '__main__':
    from os import system
    system(f"manimgl {__file__} obj")
