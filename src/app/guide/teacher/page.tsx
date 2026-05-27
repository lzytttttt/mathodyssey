import type { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: '教师指南',
  description:
    'MathOdyssey 教师指南：课堂使用建议、各节点教学目标、讨论问题和技术准备。',
  alternates: {
    canonical: 'https://mathodyssey.com/guide/teacher',
  },
};

export default function TeacherGuidePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            教师指南
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            如何在课堂中使用 MathOdyssey 辅助数学教学
          </p>
        </div>

        {/* 适用场景 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            🎯 适用场景
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: '课堂引入',
                desc: '用历史故事引入新课，激发学生好奇心。例如用尼罗河泛滥的故事引入面积计算。',
                time: '5-10 分钟',
              },
              {
                title: '概念探索',
                desc: '让学生通过互动实验自己发现数学规律，再进行总结。',
                time: '15-20 分钟',
              },
              {
                title: '课后拓展',
                desc: '布置节点探索任务，让学生在课后自主学习。',
                time: '20-30 分钟',
              },
              {
                title: '小组活动',
                desc: '分组探索不同节点，然后分享发现。',
                time: '30-45 分钟',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-lg bg-[var(--bg-secondary)]"
              >
                <h3 className="font-medium text-[var(--text-primary)] mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  {item.desc}
                </p>
                <span className="text-xs text-[var(--text-muted)]">
                  建议时长：{item.time}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* 节点与课标对应 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            📚 节点与教学目标
          </h2>
          <div className="space-y-3 text-sm">
            {[
              {
                node: '古埃及丈量土地',
                topic: '面积计算、几何初步',
                level: '小学高年级 ~ 初中',
                key: '不规则图形分解为规则图形',
              },
              {
                node: '巴比伦六十进制',
                topic: '进位制、数系',
                level: '小学 ~ 初中',
                key: '理解不同进位制的原理',
              },
              {
                node: '毕达哥拉斯定理',
                topic: '勾股定理',
                level: '初中',
                key: '面积法验证 a²+b²=c²',
              },
              {
                node: '欧几里得公理',
                topic: '公理化方法、逻辑推理',
                level: '初中 ~ 高中',
                key: '从公设推导定理的思维方式',
              },
              {
                node: '阿基米德穷竭法',
                topic: '极限思想、π 的计算',
                level: '初中 ~ 高中',
                key: '用多边形逼近圆的极限思想',
              },
              {
                node: '鸡兔同笼',
                topic: '方程组、假设法',
                level: '小学高年级 ~ 初中',
                key: '从算术思维到代数思维',
              },
              {
                node: '婆罗摩笈多与零',
                topic: '负数、数轴',
                level: '初中',
                key: '负数的运算规则',
              },
              {
                node: '花拉子密的代数',
                topic: '配方法、一元二次方程',
                level: '初中',
                key: '配方法的几何直观',
              },
              {
                node: '笛卡尔坐标系',
                topic: '坐标几何、函数',
                level: '初中 ~ 高中',
                key: '几何与代数的统一',
              },
              {
                node: '牛顿与莱布尼茨微积分',
                topic: '导数、积分',
                level: '高中',
                key: '切线斜率 = 瞬时变化率',
              },
              {
                node: '帕斯卡与费马概率论',
                topic: '概率初步',
                level: '初中 ~ 高中',
                key: '频率趋近于概率',
              },
              {
                node: '欧拉图论',
                topic: '图论初步',
                level: '高中',
                key: '欧拉路径的存在条件',
              },
            ].map((item) => (
              <div
                key={item.node}
                className="flex flex-col sm:flex-row sm:items-start gap-2 p-3 rounded-lg bg-[var(--bg-secondary)]"
              >
                <div className="sm:w-40 font-medium text-[var(--text-primary)]">
                  {item.node}
                </div>
                <div className="flex-1">
                  <div className="text-[var(--text-secondary)]">{item.topic}</div>
                  <div className="text-[var(--text-muted)] mt-1">
                    适用：{item.level} · 核心：{item.key}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 讨论问题 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            💬 课堂讨论问题
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">通用讨论</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                <li>这个数学概念是为了解决什么问题而发明的？</li>
                <li>在没有这个概念之前，人们是怎么处理这个问题的？</li>
                <li>你能想到生活中有哪些地方用到了这个概念？</li>
                <li>如果你是那个时代的数学家，你会怎么解决这个问题？</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">实验后讨论</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                <li>在实验中你发现了什么规律？</li>
                <li>这个规律能用数学语言表达吗？</li>
                <li>改变参数后，结果发生了什么变化？</li>
                <li>这个发现和课本上的哪个公式对应？</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 技术准备 */}
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            💻 技术准备
          </h2>
          <div className="space-y-3 text-[var(--text-secondary)] text-sm">
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>设备</strong>：电脑或平板（推荐 Chrome 浏览器）</li>
              <li><strong>网络</strong>：需要联网访问</li>
              <li><strong>投影</strong>：建议使用投影或大屏展示，方便全班观看</li>
              <li><strong>分组</strong>：如分组活动，每组至少一台设备</li>
              <li><strong>预览</strong>：建议教师课前先体验一遍实验流程</li>
            </ul>
            <p className="text-[var(--text-muted)]">
              平台支持桌面和平板，响应式布局自动适配。无需安装任何软件。
            </p>
          </div>
        </Card>

        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-white hover:opacity-90 transition-opacity"
          >
            浏览时间轴 →
          </Link>
          <div>
            <Link
              href="/guide"
              className="text-sm text-[var(--accent-primary)] hover:opacity-80 transition-opacity"
            >
              返回使用指南
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
