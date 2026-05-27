import type { Metadata } from 'next';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: '常见问题',
  description: 'MathOdyssey 常见问题解答：平台使用、技术支持、内容相关问题。',
  alternates: {
    canonical: 'https://mathodyssey.com/faq',
  },
};

const faqs = [
  {
    category: '平台使用',
    items: [
      {
        q: 'MathOdyssey 是免费的吗？',
        a: '是的，MathOdyssey 是完全免费的开源教育平台，采用 Apache 2.0 许可证。',
      },
      {
        q: '需要注册账号吗？',
        a: '不需要。目前平台无需注册即可使用所有功能。学习进度保存在浏览器本地，清除浏览器数据会丢失进度。',
      },
      {
        q: '支持哪些设备？',
        a: '支持桌面电脑、笔记本和平板。推荐使用 Chrome、Firefox、Safari、Edge 等现代浏览器。手机端可使用但体验有限，推荐平板或电脑。',
      },
      {
        q: '互动实验打不开怎么办？',
        a: '请确保浏览器是最新版本，JavaScript 已启用。如果问题持续，尝试清除浏览器缓存或换一个浏览器。',
      },
    ],
  },
  {
    category: '内容相关',
    items: [
      {
        q: '平台适合什么年龄段？',
        a: '主要面向 K12 学生（小学高年级到高中）。不同节点有不同难度标注（L1-L5），可以根据自己的水平选择。',
      },
      {
        q: '历史内容准确吗？',
        a: '我们尽力确保历史准确性，每个节点标注了可信度等级（A-E）。但平台以教学为目的，部分内容可能进行了简化。如有疑问请参考节点底部的参考资料。',
      },
      {
        q: '会增加更多节点吗？',
        a: '是的，目前覆盖 12 个精选节点。未来计划扩展更多数学史节点和互动实验。',
      },
      {
        q: '有英文版吗？',
        a: '目前只有中文版。多语言支持在规划中，未来可能推出英文版。',
      },
    ],
  },
  {
    category: '教师使用',
    items: [
      {
        q: '可以在课堂上使用吗？',
        a: '可以！平台非常适合课堂使用。请参考教师指南了解具体使用建议。',
      },
      {
        q: '有教案或教学材料吗？',
        a: '目前提供教师指南，包含各节点的教学目标、适用年级和讨论问题。详细的教案在规划中。',
      },
      {
        q: '能追踪学生的学习进度吗？',
        a: '目前不支持。进度仅保存在本地浏览器中。用户系统和进度追踪在后续版本规划中。',
      },
    ],
  },
  {
    category: '技术问题',
    items: [
      {
        q: '这是开源项目吗？',
        a: '是的，MathOdyssey 采用 Apache 2.0 开源许可证。欢迎贡献代码、报告问题或提出建议。',
      },
      {
        q: '用什么技术栈？',
        a: 'Next.js + TypeScript + React + Tailwind CSS。数学公式使用 KaTeX，可视化使用 SVG/Canvas。',
      },
      {
        q: '如何反馈问题？',
        a: '请在 GitHub 仓库提交 Issue，描述问题和复现步骤。',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            常见问题
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            关于 MathOdyssey 的常见问题解答
          </p>
        </div>

        {faqs.map((section) => (
          <Card key={section.category} variant="glass" className="p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.items.map((item, index) => (
                <div
                  key={index}
                  className={
                    index < section.items.length - 1
                      ? 'pb-4 border-b border-[var(--border-light)]'
                      : ''
                  }
                >
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">
                    {item.q}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">{item.a}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
