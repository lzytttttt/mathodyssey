import Card from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-800 mb-4">
            关于 MathOdyssey
          </h1>
          <p className="text-lg text-stone-600">
            让数学成为一场发现之旅
          </p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">我们的理念</h2>
          <p className="text-stone-600 leading-relaxed">
            数学不是一组需要记忆的公式，而是人类在解决真实问题过程中逐步发明的思维工具。
            MathOdyssey 沿着历史时间轴探索不同文明如何面对具体问题，通过亲手操作互动工具，
            体验数学概念如何被「发明」出来。
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">学习模式</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                1
              </span>
              <div>
                <h3 className="font-medium text-stone-800">发现问题</h3>
                <p className="text-stone-600 text-sm">
                  面对一个历史情境中的真实问题
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                2
              </span>
              <div>
                <h3 className="font-medium text-stone-800">探索试错</h3>
                <p className="text-stone-600 text-sm">
                  通过互动工具尝试不同的方法
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                3
              </span>
              <div>
                <h3 className="font-medium text-stone-800">发现规律</h3>
                <p className="text-stone-600 text-sm">
                  在操作过程中自己发现数学关系
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                4
              </span>
              <div>
                <h3 className="font-medium text-stone-800">理解概念</h3>
                <p className="text-stone-600 text-sm">
                  将发现的规律提炼为数学概念
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">覆盖范围</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            目前平台覆盖从古埃及（约公元前 2000 年）到 18 世纪的数学史，包含 12 个精选节点：
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              '古埃及丈量土地',
              '巴比伦六十进制',
              '毕达哥拉斯定理',
              '欧几里得公理',
              '阿基米德穷竭法',
              '中国鸡兔同笼',
              '婆罗摩笈多与零',
              '花拉子密的代数',
              '笛卡尔坐标系',
              '牛顿与莱布尼茨微积分',
              '帕斯卡与费马概率论',
              '欧拉图论',
            ].map((name) => (
              <div key={name} className="flex items-center gap-2 text-sm text-stone-600">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {name}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
