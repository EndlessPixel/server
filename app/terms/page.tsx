import { PageHeader, ContentContainer } from "@/components/page-primitives";

export const metadata = {
  title: "用户协议 - EndlessPixel",
  description: "EndlessPixel 服务器使用条款、用户行为规范及权利义务约定，适用于所有玩家。",
};

export default function TermsPage() {
  return (
    <ContentContainer className="py-8">
      <PageHeader
        title="用户协议"
        description="本协议是您与 EndlessPixel 运营团队之间就使用本服务器及相关网站服务所达成的法律约定。使用本服务即表示您已阅读、理解并接受本协议全部内容。若您不同意，请立即停止使用。"
      />

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">一、账号注册与管理</h2>
          <p className="mb-2">
            本服务器暂不支持网页单独注册，您需先在游戏内加入服务器，使用指定注册指令创建账号。账号一经创建，即视为您同意本协议。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>账号所有权：</strong>账号归您个人所有，但运营团队保留对违规账号采取限制措施的权利。您不得将账号出租、转让或赠与他人，否则由此产生的一切后果由您承担。
            </li>
            <li>
              <strong>密码安全：</strong>您应妥善保管密码，建议使用强密码并定期更换。因密码泄露、他人盗用或您主动告知第三方导致的损失，运营团队不承担任何责任。
            </li>
            <li>
              <strong>账号信息：</strong>您须确保提供的注册信息（如邮箱、QQ号等）真实有效，以便接收重要通知或进行身份验证。若信息不实导致无法接收通知或找回账号，后果自负。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">二、用户行为规范</h2>
          <p className="mb-2">
            为维护良好的游戏环境，您在使用本服务器时必须遵守以下规则。违规行为一经查实，运营团队可视情节轻重采取口头警告、暂时封禁、永久封停或清空数据等措施：
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>禁止作弊：</strong>使用外挂程序、作弊客户端、宏命令、内存修改器或任何非官方允许的第三方工具以获取不正当优势；</li>
            <li><strong>禁止恶意行为：</strong>刷屏、恶意骂人、人身攻击、种族歧视、发布涉政涉黄等违法或不良言论；</li>
            <li><strong>禁止破坏：</strong>恶意破坏他人建筑、偷窃物品、利用漏洞破坏服务器稳定性或经济平衡；</li>
            <li><strong>禁止骚扰：</strong>持续骚扰其他玩家、仿冒他人名称或冒充管理人员；</li>
            <li><strong>禁止商业推广：</strong>未经许可发布广告、宣传其他服务器或进行现实货币交易（RMT）；</li>
            <li><strong>禁止滥用机制：</strong>利用游戏漏洞或设计缺陷获取利益，或使用大量实体造成服务器卡顿（恶意卡服）。</li>
          </ul>
          <p className="mt-2">运营团队有权根据实际情况制定补充细则，并在网站或游戏内公告，您有义务及时了解并遵守。</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">三、内容与知识产权</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>您的创作：</strong>您在服务器内建造的建筑、红石机械、艺术作品等原创内容，其著作权归您本人所有。但您不可撤销地授权运营团队为服务器运营、宣传展示、维护存档等目的，在全球范围内永久、免费使用这些内容（包括但不限于截图、录像、直播等）。
            </li>
            <li>
              <strong>服务器资产：</strong>服务器的程序代码、插件、地图地形、美术资源、文字内容等，其知识产权归运营团队或原权利人所有，未经许可不得复制、分发或二次创作。
            </li>
            <li>
              <strong>用户内容责任：</strong>您需确保您在服务器内发布或上传的任何内容不侵犯第三方知识产权，否则由此引发的法律纠纷由您独立承担。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">四、游戏内交易与捐赠</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>游戏币与物品：</strong>服务器内的虚拟货币、道具、权限等均为游戏内虚拟财产，仅用于娱乐目的，不具备现实货币价值。运营团队不承认任何现实货币交易（RMT），若玩家私下交易产生纠纷，由玩家自行负责，运营团队概不介入。
            </li>
            <li>
              <strong>捐赠与赞助：</strong>本服务器为非营利爱好者项目，可能接受玩家自愿捐赠以维持运营成本。捐赠行为纯属自愿，一旦完成，除非因服务器永久关闭或法律要求，原则上不予退还。运营团队可能会向捐赠者提供游戏内非影响平衡的感谢性奖励（如称号、皮肤等），但奖励并非捐赠的对价商品。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">五、处罚与申诉</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>处罚措施：</strong>运营团队可依据违规情节轻重，对账号做出警告、临时封禁（1天~30天）、永久封禁、清空部分或全部数据、封禁IP段等处理。所有处罚均在网站或游戏内公告原因，但涉及安全信息的除外。
            </li>
            <li>
              <strong>申诉渠道：</strong>若您对处罚有异议，可在处罚公布后7个工作日内通过官方公告的社群渠道（如Discord、QQ群或工单系统）提交申诉，需附上证据（截图、日志等）。运营团队将在收到后15个工作日内复核并答复。申诉期间不停止执行原处罚。
            </li>
            <li>
              <strong>误封补偿：</strong>若经核实确属误封，运营团队将解除处罚并视情况给予适当游戏内补偿，但不予现实货币赔偿。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">六、服务变更、暂停与终止</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>更新与调整：</strong>运营团队有权随时对服务器内容、玩法、规则进行调整或更新，并提前在网站或游戏内公告。重大变更可能要求您重新接受协议。
            </li>
            <li>
              <strong>临时维护：</strong>为提升服务质量或修复漏洞，服务器可能需要临时停机维护，届时将提前通知（紧急情况除外）。维护期间造成的无法访问，运营团队不承担赔偿责任。
            </li>
            <li>
              <strong>服务终止：</strong>若服务器因项目解散、不可抗力或法律原因永久关闭，运营团队会至少提前30天公告，并尽力协助您导出个人存档数据（具体以当时能力为准）。但虚拟财产不折算现实货币返还。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">七、免责声明与责任限制</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>非营利性质：</strong>本服务器为爱好者自发运营的非商业项目，不保证服务的绝对稳定、无错误或不间断。对于因网络故障、黑客攻击、电力中断、自然灾害等不可抗力导致的数据丢失或服务中断，运营团队不承担责任。
            </li>
            <li>
              <strong>玩家间纠纷：</strong>玩家之间的私人冲突、交易纠纷、言语争执等，运营团队仅提供调解建议，不承担任何法律责任。
            </li>
            <li>
              <strong>数据风险：</strong>您理解并同意，任何互联网服务均存在数据丢失风险，我们建议您定期备份自己的重要建筑或存档（如有提供）。运营团队对因服务器故障导致的游戏数据丢失，仅尽最大努力恢复，但不承诺100%恢复。
            </li>
            <li>
              <strong>责任上限：</strong>在任何情况下，运营团队对您承担的全部赔偿责任总额不超过您近12个月内向本服务器支付的捐赠金额（若有），且不承担任何间接损失、附带损失或利润损失。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">八、实名制与未成年人保护</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              根据中国法律法规，您可能需要在游戏内实名登记（如绑定手机号）才能正常游戏，具体以届时政策为准。您应确保提供的信息真实有效。
            </li>
            <li>
              若您未满18周岁，请在监护人陪同和指导下使用本服务，并遵守国家关于未成年人游戏时长（如每日限制、宵禁）的规定。运营团队有权根据法律法规要求对未成年账号采取相应的防沉迷措施。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">九、适用法律与争议解决</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              本协议的订立、执行和解释均适用中华人民共和国法律，不考虑法律冲突原则。
            </li>
            <li>
              因本协议引起的或与本协议有关的任何争议，双方应首先友好协商解决；协商不成的，任何一方均有权将争议提交至运营团队所在地（即服务器所在地）有管辖权的人民法院诉讼解决。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">十、协议变更与生效</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              运营团队可不时修订本协议，修订后的版本将在网站显著位置公告，并更新协议顶部的“最后更新”日期。若涉及重大权利变更，我们可能通过邮件、弹窗或游戏内消息单独通知。
            </li>
            <li>
              如您不同意修改后的条款，您有权立即停止使用本服务；若您在变更公告后继续使用本服务，则视为您已接受修订后的协议。
            </li>
            <li>
              本协议自您首次注册或使用本服务器时生效，对过往行为同样具有约束力。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">十一、其他</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              本协议任何条款的无效或不可执行，不影响其余条款的效力。
            </li>
            <li>
              运营团队未执行本协议中的任何权利或规定，不构成对该权利或规定的放弃。
            </li>
            <li>
              如果您对本协议有任何疑问，可以通过网站公告的官方社群渠道联系我们，我们将在15个工作日内回复。
            </li>
          </ul>
        </section>

        <p>
          本隐私政策最终解释权归 EndlessPixel Studio 所有。
          最后更新：2026/08/29
        </p>
      </div>
    </ContentContainer>
  );
}