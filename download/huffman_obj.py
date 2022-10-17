from manimlib import *

class test(Scene):
    def construct(self):
        t1 = Text("哈夫曼树是一种简单的二叉树", font='SimSun')
        t2 = Text("哈夫曼树主要用于对文本进行编码，以压缩文本", font='SimSun')
        
        self.play(Write(t1))
        self.wait(0.5)
        self.play(ApplyMethod(t1.next_to, t2, TOP*0.5))
        self.wait(0.5)
        self.play(Write(t2))
        self.wait(0.5)
        self.play(FadeOut(VGroup(t1, t2)))
        
        t1 = Title("Huffman encode processing")
        t2 = Text('对于字符串 ', font='SimSun')
        t3 = Text('abbcccdddd', color=RED)
        t4 = Text(' 进行字频统计以求出每个字出现的次数', font='SimSun')
        t2.next_to(t3, LEFT*0.5)
        t4.next_to(t3, RIGHT*0.5)
        tg1 = VGroup(t2, t3, t4)
        tg1.shift(np.array((-2.96, 0, 0)))
        d1 = Text('{    ,    ,    ,    }')
        a = Text('a:1', color=RED)
        b = Text('b:2', color=RED)
        c = Text('c:3', color=RED)
        d = Text('d:4', color=RED)
        a.shift(LEFT*2)
        b.shift(LEFT*0.7)
        c.shift(RIGHT*0.7)
        d.shift(RIGHT*2)
        tg2 = VGroup(a, b, c, d, d1)
        
        self.add(t1)
        self.play(Write(tg1))
        self.wait(0.5)
        self.play(ApplyMethod(tg1.shift, np.array((0, 2, 0))))
        self.wait(0.5)
        self.play(ReplacementTransform(t3.copy(), tg2))
        
        t5 = Text('根据生成的字典构建哈夫曼树', font='SimSun')
        t5.shift(UP*2)
        t5.shift(LEFT*2.5)
        
        self.wait(0.5)
        self.play(ReplacementTransform(tg1, t5))
        self.play(ApplyMethod(tg2.next_to, t5, RIGHT*0.5))
        
        at = Text('从左到右依次递增', font='SimSun')
        at.shift(UP*1.2)
        arrow = Arrow(start=ORIGIN, end=RIGHT*4)
        arrow.next_to(at, DOWN*0.5)
        aag = VGroup(at, arrow)
        n10 = Text('a 1', color=RED)
        n11 = Arc(start_angle=0, angle=PI*2).set_fill(color=BLUE, opacity=0.3).surround(n10)
        n1 = VGroup(n11, n10)
        n1.next_to(arrow, DOWN*0.5)
        n1.shift(LEFT*1.8+DOWN*0.2)
        n20 = Text('b 2', color=RED)
        n21 = Arc(start_angle=0, angle=PI*2).set_fill(color=BLUE, opacity=0.3).surround(n20)
        n2 = VGroup(n21, n20)
        n2.next_to(n1, RIGHT)
        n30 = Text('c 3', color=RED)
        n31 = Arc(start_angle=0, angle=PI*2).set_fill(color=BLUE, opacity=0.3).surround(n30)
        n3 = VGroup(n31, n30)
        n3.next_to(n2, RIGHT)
        n40 = Text('d 4', color=RED)
        n41 = Arc(start_angle=0, angle=PI*2).set_fill(color=BLUE, opacity=0.3).surround(n40)
        n4 = VGroup(n41, n40)
        n4.next_to(n3, RIGHT)
        
        self.play(Write(n1))
        self.play(Write(n2))
        self.play(Write(n3))
        self.play(Write(n4))
        self.play(Write(aag))
        self.wait(1)
        
        self.play(FadeOut(VGroup(t5, tg2)))
        
        ns = VGroup(n1, n2, n3, n4, aag)
        self.play(ApplyMethod(ns.shift, UP*1.2))
        
        t2 = Text('从右侧结点中选择两个最小权重的结点，将它们组成一个二叉树，并放回结点列表中', font='SimSun', font_size=36)

        self.play(Write(t2))
        self.wait(0.5)
        self.play(ApplyMethod(n1.shift, DOWN*4+RIGHT*0.4))
        self.play(ApplyMethod(n2.shift, DOWN*4+RIGHT*2))
        
        n120 = Text('w=3', color=RED)
        n121 = Arc(start_angle=0, angle=PI*2).set_fill(color=BLUE, opacity=0.3).surround(n120)
        n12 = VGroup(n121, n120).shift(DOWN)
        l1 = Line(start=n12.get_bottom(), end=n1.get_top())
        l2 = Line(start=n12.get_bottom(), end=n2.get_top())
        
        self.play(Write(VGroup(l1, l2)))
        self.play(ReplacementTransform(VGroup(n1.copy(), n2.copy()), n12))
        self.play(FadeOut(t2))
        self.play(ApplyMethod(VGroup(n12, n1, n2, l1, l2).shift, LEFT*2+UP*2.2))
        
        t2 = Text("重复上述步骤", font='SimSun').shift(RIGHT*2)
        
        self.play(FadeIn(t2))
        self.wait(1)
        self.play(FadeOut(t2))
        
        self.play(ApplyMethod(VGroup(n12, n1, n2, l1, l2).shift, DOWN*12/7))
        self.play(ApplyMethod(n3.shift, DOWN*12/7))
        
        n123 = Text('w=6', color=RED)
        n123 = VGroup(Arc(start_angle=0, angle=PI*2).set_fill(color=BLUE, opacity=0.3).surround(n123), n123)
        n123.shift((n12.get_center()+n3.get_center())/2+UP*12/7)
        l123 = VGroup(Line(start=n12.get_top(), end=n123.get_bottom()), Line(start=n3.get_top(), end=n123.get_bottom()))
        
        self.play(Write(l123))
        self.play(ReplacementTransform(VGroup(n12.copy(), n3.copy()), n123))
        
        self.play(ApplyMethod(VGroup(n12, n1, n2, l1, l2, n123, n3, l123).shift, DOWN*12/7))
        self.play(ApplyMethod(n4.shift, DOWN*12/7))
        
        n1234 = Text('w10', color=RED)
        n1234 = VGroup(Arc(start_angle=0, angle=PI*2).set_fill(color=BLUE, opacity=0.3).surround(n1234), n1234)
        n1234.shift((n123.get_center()+n4.get_center())/2+UP*12/7)
        l1234 = VGroup(Line(start=n123.get_top(), end=n1234.get_bottom()), Line(start=n4.get_top(), end=n1234.get_bottom()))
        
        self.play(Write(l1234))
        self.play(ReplacementTransform(VGroup(n123.copy(), n4.copy()), n1234))
        
        self.play(ApplyMethod(VGroup(n12, n1, n2, l1, l2, n123, n3, l123, n1234, n4, l1234).shift, UP*0.8+RIGHT*4.5))
        
        t2 = Text('根据右侧的哈夫曼树生成编码规则', font='SimSun').next_to(at, LEFT).shift(RIGHT*3)
        
        self.play(FadeOut(at), FadeOut(arrow))
        self.play(Write(t2))

        tn01 = Text('0', color=YELLOW)
        tn11 = Text('1', color=BLUE)
        tng = VGroup(
            tn01.next_to(l1234, ORIGIN).shift(LEFT*0.5+DOWN*0.1),
            tn11.next_to(l1234, ORIGIN).shift(RIGHT*0.5+DOWN*0.1),
            tn01.copy().next_to(l123, ORIGIN).shift(LEFT*0.5+DOWN*0.1),
            tn11.copy().next_to(l123, ORIGIN).shift(RIGHT*0.5+DOWN*0.1),
            tn01.copy().next_to(VGroup(l1, l2), ORIGIN).shift(LEFT*0.5+DOWN*0.1),
            tn11.copy().next_to(VGroup(l1, l2), ORIGIN).shift(RIGHT*0.5+DOWN*0.1)
        )

        self.play(Write(tng))
        self.wait(0.5)
        l1.set_color(YELLOW)
        l2.set_color(BLUE)
        for i in range(2):
            if i==0:
                l123[i].set_color(YELLOW)
                l1234[i].set_color(YELLOW)
            else:
                l123[i].set_color(BLUE)
                l1234[i].set_color(BLUE)
        self.wait(0.5)
        
        code_t2c = {'0':YELLOW, '1':BLUE}
        ac = Text('a : 000', t2c=code_t2c).to_edge(LEFT).shift(UP*1.5)
        bc = Text('b : 001', t2c=code_t2c).to_edge(LEFT).shift(UP*1.5+RIGHT*5)
        cc = Text('c : 01', t2c=code_t2c).to_edge(LEFT).shift(UP*0.7)
        dc = Text('d : 1', t2c=code_t2c).to_edge(LEFT).shift(UP*0.7+RIGHT*5)
        
        self.play(Write(VGroup(ac[0:4], bc[0:4], cc[0:4], dc[0:4])))
        self.play(TransformFromCopy(tng[0], ac[4]), run_time=1)
        self.play(TransformFromCopy(tng[2], ac[5]), run_time=1)
        self.play(TransformFromCopy(tng[4], ac[6]), run_time=1)
        
        self.play(TransformFromCopy(tng[0], bc[4]), run_time=1)
        self.play(TransformFromCopy(tng[2], bc[5]), run_time=1)
        self.play(TransformFromCopy(tng[5], bc[6]), run_time=1)
        
        self.play(TransformFromCopy(tng[0], cc[4]), run_time=1)
        self.play(TransformFromCopy(tng[3], cc[5]), run_time=1)
        
        self.play(TransformFromCopy(tng[1], dc[4]), run_time=1)
        
        t3 = Text("则之前的 abbcccdddd 可编码为：", font='SimSun', t2c={"abbcccdddd":RED}).to_edge(LEFT).shift(DOWN*0.5)
        t4 = Text("000 001 001 01 01 01 1 1 1 1", t2c=code_t2c).next_to(t3, DOWN).shift(DOWN*0.5)
        t5 = Text("总编码长度为 19", font='SimSun', t2c={"14":RED}).next_to(t4, DOWN).shift(DOWN*0.5)
        
        self.play(Write(t3))
        self.play(TransformFromCopy(t3[5], t4[0:3]))
        self.play(TransformFromCopy(t3[6], t4[4:7]))
        self.play(TransformFromCopy(t3[7], t4[8:11]))
        self.play(TransformFromCopy(t3[8], t4[12:14]))
        self.play(TransformFromCopy(t3[9], t4[15:17]))
        self.play(TransformFromCopy(t3[10], t4[18:20]))
        self.play(TransformFromCopy(t3[11], t4[21]))
        self.play(TransformFromCopy(t3[12], t4[23]))
        self.play(TransformFromCopy(t3[13], t4[25]))
        self.play(TransformFromCopy(t3[14], t4[27]))
        self.play(Write(t5))
        self.wait(3)
        
        self.play(FadeOut(VGroup(t2, t3, t4, t5, ac, bc, cc, dc, tng, n1234, n123, n12, n1, n2, n3, n4, l1, l2, l123, l1234, t1)))

        t1 = Text("利用哈夫曼树编码的特点在于：", font='SimSun')
        t2 = Text("待编码文本中出现次数越多的字符，其编码长度越短", font='SimSun')
        t3 = Text("对于 abbcccdddd 字符串使用 {a:0, b:1, c:01, d:11}\n这种传统的编码规则进行编码的话，编码后为\n0 1 1 01 01 01 11 11 11 11，其长度为 17", font='SimSun', t2c={'a':RED, 'b':RED, 'c':RED, 'd':RED, '0':YELLOW, '1':BLUE, '17':RED}).shift(DOWN*0.7)
        
        self.play(Write(t1))
        self.play(ApplyMethod(t1.shift, UP))
        self.play(Write(t2))
        self.play(ApplyMethod(VGroup(t1, t2).shift, UP))
        self.play(Write(t3))
        
        self.play(FadeOut(VGroup(t1, t2, t3)))
        
        t1 = Text('同一个字符串 abbcccdddd', font='SimSun', t2c={'abbcccdddd':RED})
        t2 = Text('使用哈夫曼编码后长度为 19，使用普通编码后长度为 17', font='SimSun', t2c={'19':RED, '17':RED})
        t3 = Text('这是否意味着哈夫曼编码不能做到压缩的效果？', font='SimSun')
        t4 = Text('这实际上是因为哈夫曼编码一些不可避免的弊病', font='SimSun')
        t5 = Text('对于短文本，哈夫曼编码往往效果不佳，甚至出现负压缩', font='SimSun', font_size=36).to_edge(UP)
        t6 = Text('而哈夫曼编码适合压缩的文本是字符构成单一且文本较长', font='SimSun', font_size=36).next_to(t5, DOWN)
        t7 = Text('如图，svd为压缩后的文件，short.txt是短文本，呈现负压缩', font='SimSun', font_size=36).next_to(t6, DOWN)
        t8 = Text('而对于大文本的测试，压缩率接近50%（文件不包含中文）', font='SimSun', font_size=36).next_to(t7, DOWN)
        t9 = Text('而由于中文的字符复杂度高，采用哈夫曼编码压缩效果不理想', font='SimSun', font_size=36).next_to(t8, DOWN)
        i1 = ImageMobject('C:\\Users\\25315\\Desktop\\图片1.png').scale(0.6).shift(DOWN*0.6)
        i2 = ImageMobject('C:\\Users\\25315\\Desktop\\图片2.png').scale(0.4).next_to(i1, DOWN).shift(UP*0.2)
        
        self.play(Write(t1))
        self.play(ApplyMethod(t1.shift, UP*0.6))
        self.wait(0.5)
        self.play(Write(t2))
        self.play(ApplyMethod(VGroup(t1, t2).shift, UP*0.6))
        self.wait(0.5)
        self.play(Write(t3))
        self.play(ApplyMethod(VGroup(t1, t2, t3).shift, UP*0.6))
        self.wait(0.5)
        self.play(Write(t4))
        self.wait(1)
        self.play(FadeOut(VGroup(t1, t2, t3, t4)))
        
        self.play(Write(t5))
        self.wait(0.5)
        self.play(Write(t6))
        self.wait(0.5)
        self.play(Write(t7))
        self.wait(0.5)
        self.play(Write(t8))
        self.wait(0.5)
        self.play(Write(t9))
        self.wait(0.5)
        self.play(FadeIn(i1))
        self.play(FadeIn(i2))
        self.wait(2)
        self.play(FadeOut(VGroup(t5, t6, t7, t8, t9)))
        self.play(FadeOut(i1))
        self.play(FadeOut(i2))
        
        t1 = Text('以上就是这期视频的全部内容，如果喜欢我的视频', font='SimSun')
        t2 = Text('真心请求点个关注，顺便三连一下，感谢大佬们', font='SimSun')
        t3 = Text('这对我这种小up来说真的很重要，是我支持下去的动力', font='SimSun')
        t4 = Text('视频使用manim制作，代码近300行，耗时3天', font='SimSun')
        t5 = Text('我会将我的视频源码放在简介和评论区链接内', font='SimSun')
        
        t2.next_to(t3, UP)
        t1.next_to(t2, UP)
        t4.next_to(t3, DOWN)
        t5.next_to(t4, DOWN)
        
        self.play(Write(t1))
        self.wait(0.5)
        self.play(Write(t2))
        self.wait(0.5)
        self.play(Write(t3))
        self.wait(0.5)
        self.play(Write(t4))
        self.wait(0.5)
        self.play(Write(t5))
        self.wait(2)
        
        # self.embed()
        
        

if __name__ == '__main__':
    from os import system
    system(f"manimgl {__file__} test")
    # manimgl C:\Users\25315\Desktop\ļ\code\onlyVS\python\manim-master\object\workspace\obj.py test -c black -w --hd