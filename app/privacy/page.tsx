import { PageHeader, ContentContainer } from "@/components/page-primitives";

export const metadata = {
  title: "隐私政策 - EndlessPixel",
  description: "EndlessPixel 网站及服务器如何收集、使用、存储与保护您的个人信息，以及您所拥有的数据权利。",
};

export default function PrivacyPage() {
  return (
    <ContentContainer className="py-8">
      <PageHeader
        title="隐私政策"
        description="我们重视您的隐私。本政策详细说明 EndlessPixel 网站及服务器在您使用服务时会收集哪些信息、如何使用、如何存储与保护，以及您对自身数据所拥有的权利。"
      />

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">一、我们收集的信息</h2>
          <p className="mb-2">
            我们仅在提供服务和保障安全所必需的范围内收集您的个人信息，包括：
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>登录凭证：</strong>您输入的用户名与密码。密码在传输前会使用约定的加密算法（如 bcrypt）进行哈希处理，服务器仅保存加密后的结果，我们无法获知您的明文密码。
            </li>
            <li>
              <strong>游戏与账户数据：</strong>为提供联机功能，我们会记录您的游戏内 ID、登录 IP 地址及大致地理位置（仅精确到城市级别），以及服务器运行所需的游戏进度数据（如背包物品、角色位置、成就记录等）。
            </li>
            <li>
              <strong>主动提交的信息：</strong>您自愿填写的联系方式（如 QQ 号、电子邮箱）仅在您主动提供时收集，用于账户找回、活动通知或客服沟通。
            </li>
            <li>
              <strong>设备与日志信息：</strong>当您访问网站或连接服务器时，我们可能自动记录您的浏览器类型、操作系统版本、访问时间、请求来源以及操作日志，用于排查故障和防范恶意攻击。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">二、信息的使用</h2>
          <p className="mb-2">我们收集的信息仅用于以下明确目的：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>验证您的身份并完成登录与授权；</li>
            <li>维护服务器稳定运行，实施异常行为监测、作弊检测与安全防护；</li>
            <li>在个人中心向您展示属于您自己的游戏数据和账户信息；</li>
            <li>改进服务体验，进行内部数据统计与分析（均采用匿名化方式）；</li>
            <li>在必要时与您取得联系（如处理违规申诉、发送重要通知）。</li>
          </ul>
          <p className="mt-2">我们不会将您的个人信息用于任何超出上述范围的目的，更不会出售或出租给第三方。</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">三、信息的共享与披露</h2>
          <p className="mb-2">我们承诺对您的个人信息严格保密，仅在以下情形下可能对外披露：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>法律法规要求：</strong>应国家法律、行政法规、司法机关或行政机关的强制性要求，我们必须提供相关信息；
            </li>
            <li>
              <strong>保护重大权益：</strong>为保障 EndlessPixel 及其他用户的合法权益、人身安全或财产安全所必需，且披露符合比例原则；
            </li>
            <li>
              <strong>经您明确同意：</strong>事先获得您的单独授权；
            </li>
            <li>
              <strong>匿名化数据：</strong>经过匿名化处理且无法识别特定个人的统计数据，可用于公开报告或合作研究。
            </li>
          </ul>
          <p className="mt-2">除以上情况外，我们不会主动向任何第三方共享您的个人可识别信息。</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">四、Cookie 与会话管理</h2>
          <p className="mb-2">
            登录后我们会在您的浏览器写入一个会话 Cookie（HttpOnly 属性，无法被网页脚本读取），用于保持您的登录状态。该 Cookie 仅在会话期间有效，当您关闭浏览器或主动清除该 Cookie 时，即视为退出登录。
          </p>
          <p>
            我们不会使用 Cookie 追踪您在其他网站的浏览行为，也不会利用 Cookie 投放针对性广告。您可以通过浏览器设置禁用 Cookie，但可能导致部分功能无法正常使用。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">五、数据安全措施</h2>
          <p className="mb-2">
            我们采取业界通用的安全技术和管理措施来保护您的数据免受未经授权的访问、泄露、篡改或销毁：
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>传输层使用 TLS/SSL 加密（HTTPS）保护通信链路；</li>
            <li>密码等敏感信息采用强哈希算法存储，不保存明文；</li>
            <li>服务器部署防火墙、入侵检测系统和定期安全审计；</li>
            <li>内部人员访问数据遵循最小权限原则，并签署保密协议；</li>
            <li>定期进行数据备份，以防止意外丢失。</li>
          </ul>
          <p className="mt-2">尽管我们竭力保护您的数据，但请注意互联网并非绝对安全的环境，我们无法对传输过程中非我方原因导致的风险承担全部责任。</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">六、数据保留期限</h2>
          <p>
            我们仅在实现本政策所述目的所必需的最短期限内保留您的个人信息，具体保留期根据数据的性质和使用目的确定：
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>账户信息（用户名、加密密码、游戏数据）在您主动注销账户后，我们将予以删除或匿名化，但法律法规另有要求的除外；</li>
            <li>操作日志和 IP 访问记录一般保留不超过 180 天，用于安全审计和故障排查；</li>
            <li>Cookie 会话信息在您退出登录或会话超时后即失效。</li>
          </ul>
          <p className="mt-2">当您注销账户或提出删除请求后，我们会在合理期限内（通常为 30 个工作日）完成处理，并保留不可直接识别个人身份的脱敏数据用于统计分析。</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">七、您的权利</h2>
          <p className="mb-2">您对自己的个人信息享有以下权利，并可随时通过公告渠道联系运营团队行使：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>访问与更正：</strong>您可以在个人中心查看您的账户信息和游戏数据，如有错误可申请更正；</li>
            <li><strong>删除与注销：</strong>您可以申请删除特定数据或注销整个账户，我们将在核实身份后依法处理；</li>
            <li><strong>撤回同意：</strong>您对某项数据处理活动的同意可以随时撤回（不影响撤回前基于同意的处理效力）；</li>
            <li><strong>投诉与申诉：</strong>如果您认为我们的数据处理行为侵犯了您的权益，有权向运营团队投诉或向监管机构举报。</li>
          </ul>
          <p className="mt-2">对于合理请求，我们不会收取费用；但对于重复、超量或技术上不切实际的请求，我们可能酌情收取合理成本或拒绝。</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">八、第三方服务与链接</h2>
          <p>
            我们的网站或服务器可能包含指向第三方平台（如支付渠道、社交媒体、外部工具）的链接，这些平台拥有独立的隐私政策。我们对这些外部网站的信息处理行为不承担任何责任，请您在使用前仔细阅读其隐私声明。我们不会主动将您的个人信息提供给这些第三方，除非您自行操作或明确授权。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">九、儿童隐私</h2>
          <p>
            我们高度重视未成年人的隐私保护。若您未满 14 周岁（或所在国家/地区规定的法定年龄），请在监护人陪同下使用本服务，并确保您的监护人已阅读并同意本政策。我们不会故意收集未成年人的个人信息，若发现误收集，我们会尽快删除。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">十、国际数据传输</h2>
          <p>
            我们的服务器位于中国境内，所有收集的个人信息将存储于境内的服务器。若您从境外访问本服务，请注意您的数据可能会被传输至中国，而中国的数据保护法律可能与您所在地区不同。当您使用本服务，即表示您知晓并同意此类传输。我们承诺采取充分措施确保数据安全，并遵循适用的跨境数据流动法规。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">十一、隐私政策的更新</h2>
          <p>
            我们可能不时修订本隐私政策，以反映服务变化、法律法规更新或行业最佳实践。重大变更我们会通过网站公告、弹窗或邮件等方式显著通知您，并在政策顶部的“最后更新”日期中标明。建议您定期查阅最新版本。若您不同意修改后的条款，请停止使用本服务；继续使用即视为您接受更新后的政策。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">十二、联系我们</h2>
          <p>
            如果您对本隐私政策有任何疑问、意见或请求（包括行使您的数据权利），可以通过网站公告中提供的官方社群渠道（如 Discord、QQ 群或邮件）与我们联系。我们的运营团队会在 15 个工作日内对您的请求做出响应。
          </p>
        </section>
        <p>
          本隐私政策最终解释权归 EndlessPixel Studio 所有。
          最后更新：2026/08/29
        </p>
      </div>
    </ContentContainer>
  );
}